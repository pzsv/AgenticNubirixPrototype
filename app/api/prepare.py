from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
from app.schemas.prepare import ConfigurationItem, ConfigurationItemCreate, CIType, NetworkScan, NetworkScanCreate
from app.services.storage import storage
from app.utils.recommender import get_field_recommendation
import pandas as pd
import io
import json
from datetime import datetime

router = APIRouter(prefix="/prepare", tags=["Prepare"])

@router.post("/items", response_model=ConfigurationItem)
async def create_ci(ci: ConfigurationItemCreate):
    ci_id = storage.add_ci(ci.model_dump())
    
    # Create Discovered Data record for manual ingestion
    discovered_entity_id = storage.add_discovered_data_entity({
        "source_type": "manual",
        "user": "admin", # Default user for now
        "data_entity_name": ci.type.value if hasattr(ci.type, 'value') else str(ci.type)
    })
    
    # Add name as a field
    storage.add_discovered_data_field({
        "discovered_data_entity_id": discovered_entity_id,
        "field_name": "name",
        "field_value": ci.name,
        "rating": "manual"
    })
    
    # Add description as a field
    if ci.description:
        storage.add_discovered_data_field({
            "discovered_data_entity_id": discovered_entity_id,
            "field_name": "description",
            "field_value": ci.description,
            "rating": "manual"
        })
        
    # Add properties as fields
    for key, value in ci.properties.items():
        storage.add_discovered_data_field({
            "discovered_data_entity_id": discovered_entity_id,
            "field_name": key,
            "field_value": str(value),
            "rating": "manual"
        })
        
    return storage.get_ci_by_id(ci_id)

@router.get("/items", response_model=list[ConfigurationItem])
async def list_cis():
    return storage.get_cis()

@router.get("/data-sources")
async def list_data_sources():
    return storage.get_data_sources()

@router.get("/data-sources/{source_id}/discovered-data")
async def get_data_source_discovered_data(source_id: str):
    return storage.get_discovered_data_entities(data_source_id=source_id)

@router.get("/datasets")
async def list_datasets():
    # Keep for backward compatibility, but return generalized data sources
    return storage.get_data_sources()

@router.get("/field-mappings")
async def list_field_mappings():
    return storage.get_field_mappings()

@router.post("/field-mappings/{mapping_id}")
async def update_field_mapping(mapping_id: str, updates: dict):
    if storage.update_field_mapping(mapping_id, updates):
        return {"message": "Mapping updated"}
    raise HTTPException(status_code=404, detail="Mapping not found")

@router.post("/upload")
async def upload_dataset(
    name: str = Form(...),
    rating: str = Form(...),
    file: UploadFile = File(...),
    worksheet: Optional[str] = Form(None),
    header_row: Optional[int] = Form(None),
    worksheets_json: Optional[str] = Form(None)
):
    contents = await file.read()
    try:
        worksheets_to_process = []
        if worksheets_json:
            worksheets_to_process = json.loads(worksheets_json)
        elif worksheet and header_row:
            worksheets_to_process = [{"name": worksheet, "header_row": header_row}]
        else:
            raise HTTPException(status_code=400, detail="No worksheet information provided")

        total_records = 0
        
        # Add data source to storage once for the file
        ds_id = storage.add_data_source({
            "name": name,
            "source_type": "Excel" if file.filename.endswith(('.xls', '.xlsx')) else "CSV",
            "data_ingested": ", ".join([ws["name"] for ws in worksheets_to_process]),
            "last_sync": datetime.now().strftime("%b %d, %Y, %I:%M:%S %p"),
            "records": 0, # Will update after processing
            "sync_count": 1,
            "status": "Processing",
            "process": True,
            "config": {"worksheets": [ws["name"] for ws in worksheets_to_process]},
            "rating": rating
        })

        for ws_info in worksheets_to_process:
            ws_name = ws_info["name"]
            h_row = int(ws_info["header_row"])
            
            if file.filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(contents), header=h_row-1)
            elif file.filename.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(io.BytesIO(contents), sheet_name=ws_name, header=h_row-1)
            else:
                raise HTTPException(status_code=400, detail="Invalid file format")
            
            total_records += len(df)

            # Get all data dictionary fields for recommendations
            data_fields = storage.get_data_fields()

            # Generate initial field mappings for this worksheet
            for col in df.columns:
                # Sample some unique values for recommendation engine
                column_values = df[col].dropna().unique().tolist()[:50]
                rec_entity, rec_field, rec_field_id = get_field_recommendation(str(col), column_values, data_fields)

                storage.add_field_mapping({
                    "source_field": str(col),
                    "data_source": name,
                    "worksheet": ws_name,
                    "data_entity": rec_entity,
                    "target_field": rec_field,
                    "data_dictionary_field_id": rec_field_id,
                    "status": "Pending",
                    "process": True
                })

            # Create Discovered Data Records for each row
            # Limit to first 100 rows to avoid excessive data in prototype
            for _, row in df.head(100).iterrows():
                discovered_entity_id = storage.add_discovered_data_entity({
                    "source_type": "file",
                    "user": "admin",
                    "data_entity_name": ws_name,
                    "data_source_id": ds_id
                })
                for col in df.columns:
                    storage.add_discovered_data_field({
                        "discovered_data_entity_id": discovered_entity_id,
                        "field_name": str(col),
                        "field_value": str(row[col]),
                        "rating": rating
                    })
        
        # Update total records and status
        storage.update_data_source(ds_id, {
            "records": total_records,
            "status": "Success"
        })

        return {"message": f"Successfully uploaded {name} with {total_records} records from {len(worksheets_to_process)} worksheets", "source_id": ds_id, "source_name": name}
    except Exception as e:
        if 'ds_id' in locals():
            storage.update_data_source(ds_id, {"status": "Error", "message": str(e)})
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/scans", response_model=list[NetworkScan])
async def list_scans():
    return storage.get_network_scans()

@router.post("/scans", response_model=NetworkScan)
async def create_scan(scan: NetworkScanCreate):
    scan_id = storage.add_network_scan(scan.model_dump())
    return storage.get_network_scan_by_id(scan_id)

@router.post("/scans/{scan_id}/run")
async def run_scan(scan_id: str):
    scan = storage.get_network_scan_by_id(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    storage.update_network_scan(scan_id, {
        "status": "Running",
        "start_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    
    # Mock scan execution
    results = [
        {"ip": "192.168.1.10", "hostname": "WEB-SRV-01", "type": "server"},
        {"ip": "192.168.1.11", "hostname": "WEB-SRV-02", "type": "server"},
        {"ip": "192.168.1.20", "hostname": "DB-SRV-01", "type": "database"},
    ]
    
    storage.update_network_scan(scan_id, {
        "status": "Completed",
        "end_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "discovered_items": len(results),
        "results": results
    })
    
    # Also create/update Data Source entry for this scan
    storage.add_data_source({
        "name": f"Scan: {scan.name}",
        "source_type": "Network Scan",
        "data_ingested": f"Range: {scan.target_range}",
        "last_sync": datetime.now().strftime("%b %d, %Y, %I:%M:%S %p"),
        "records": len(results),
        "sync_count": 1,
        "status": "Success",
        "process": True,
        "config": {"scan_id": scan_id},
        "rating": "high"
    })
    
    # Also create Discovered Data Entities for the discovered items
    for item in results:
        discovered_entity_id = storage.add_discovered_data_entity({
            "source_type": "network_scan",
            "user": "system",
            "data_entity_name": item["type"]
        })
        storage.add_discovered_data_field({
            "discovered_data_entity_id": discovered_entity_id,
            "field_name": "hostname",
            "field_value": item["hostname"],
            "rating": "high"
        })
        storage.add_discovered_data_field({
            "discovered_data_entity_id": discovered_entity_id,
            "field_name": "ip",
            "field_value": item["ip"],
            "rating": "high"
        })

    return storage.get_network_scan_by_id(scan_id)

@router.post("/ingest")
async def ingest_cis(file: UploadFile = File(...)):
    contents = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents))
    elif file.filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(io.BytesIO(contents))
    else:
        raise HTTPException(status_code=400, detail="Invalid file format")

    ingested_count = 0
    for _, row in df.iterrows():
        # Basic mapping logic - assuming column names match or are close
        try:
            ci_data = {
                "name": str(row.get("name", "Unnamed")),
                "type": row.get("type", CIType.OTHER),
                "description": row.get("description", ""),
                "properties": json.loads(row.get("properties", "{}")) if isinstance(row.get("properties"), str) else {}
            }
            storage.add_ci(ci_data)
            
            # Create Discovered Data record
            discovered_entity_id = storage.add_discovered_data_entity({
                "source_type": "file",
                "user": "admin",
                "data_entity_name": str(ci_data["type"])
            })
            for col in df.columns:
                storage.add_discovered_data_field({
                    "discovered_data_entity_id": discovered_entity_id,
                    "field_name": str(col),
                    "field_value": str(row[col]),
                    "rating": "high"
                })
                
            ingested_count += 1
        except Exception:
            continue
            
    # Also create a Data Source entry for this ingestion
    storage.add_data_source({
        "name": f"Direct Ingest: {file.filename}",
        "source_type": "Excel" if file.filename.endswith(('.xls', '.xlsx')) else "CSV",
        "data_ingested": "Direct CI Ingest",
        "last_sync": datetime.now().strftime("%b %d, %Y, %I:%M:%S %p"),
        "records": ingested_count,
        "sync_count": 1,
        "status": "Success",
        "process": True,
        "config": {"filename": file.filename},
        "rating": "high"
    })
    
    return {"message": f"Successfully ingested {ingested_count} items"}
