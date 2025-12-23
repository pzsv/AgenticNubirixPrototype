from typing import Dict, List, Any, Optional
import uuid
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import models
from datetime import datetime

class DatabaseStorage:
    def __init__(self):
        Base.metadata.create_all(bind=engine)
        self.db: Session = SessionLocal()
        # Seed only if empty
        if self.db.query(models.DataField).count() == 0:
            self._seed_data_dictionary()
        if self.db.query(models.Dataset).count() == 0:
            self._seed_datasets()
        if self.db.query(models.RawDataEntity).count() == 0:
            self._seed_raw_data()

    def _seed_raw_data(self):
        # Sample raw data for manual ingestion
        entities = [
            {
                "source_type": "manual",
                "user": "admin",
                "data_entity_name": "server",
                "fields": {
                    "name": "PROD-WEB-01",
                    "OS": "Ubuntu 22.04",
                    "CPU": "4",
                    "RAM": "16GB"
                }
            },
            {
                "source_type": "manual",
                "user": "peti",
                "data_entity_name": "database",
                "fields": {
                    "name": "CUST-DB-01",
                    "Technology": "PostgreSQL",
                    "Version": "15.4"
                }
            }
        ]

        # Sample raw data for file ingestion
        file_entities = [
            {
                "source_type": "file",
                "user": "admin",
                "data_entity_name": "Server List",
                "rating": "high",
                "rows": [
                    {"Server Name": "SRV-APPS-01", "Environment": "PROD", "IP Address": "10.0.1.10"},
                    {"Server Name": "SRV-APPS-02", "Environment": "PROD", "IP Address": "10.0.1.11"},
                    {"Server Name": "SRV-APPS-03", "Environment": "DEV", "IP Address": "10.0.2.10"}
                ]
            }
        ]

        for e in entities:
            eid = self.add_raw_data_entity({
                "source_type": e["source_type"],
                "user": e["user"],
                "data_entity_name": e["data_entity_name"]
            })
            for k, v in e["fields"].items():
                self.add_raw_data_entity_field({
                    "raw_data_entity_id": eid,
                    "field_name": k,
                    "field_value": v,
                    "rating": "manual"
                })

        for fe in file_entities:
            for row in fe["rows"]:
                eid = self.add_raw_data_entity({
                    "source_type": fe["source_type"],
                    "user": fe["user"],
                    "data_entity_name": fe["data_entity_name"]
                })
                for k, v in row.items():
                    self.add_raw_data_entity_field({
                        "raw_data_entity_id": eid,
                        "field_name": k,
                        "field_value": v,
                        "rating": fe["rating"]
                    })

    def _seed_datasets(self):
        # Sample datasets based on screenshots
        self.add_dataset({
            "name": "app_ds_2",
            "last_uploaded": "Nov 14, 2025, 10:49:28 AM",
            "records": 17,
            "upload_count": 1,
            "process": True,
            "worksheets": ["Business Unit", "Company", "Group"]
        })
        self.add_dataset({
            "name": "app_inventory_ds",
            "last_uploaded": "Nov 14, 2025, 10:32:56 AM",
            "records": 298,
            "upload_count": 1,
            "process": True,
            "worksheets": ["Application Package", "Application Software", "Database"]
        })
        self.add_dataset({
            "name": "server_inventory_ds",
            "last_uploaded": "Nov 14, 2025, 10:15:12 AM",
            "records": 349,
            "upload_count": 1,
            "process": True,
            "worksheets": ["Server List"]
        })

        # Add some sample mappings
        self.add_field_mapping({
            "source_field": "Business Unit Company Name",
            "data_source": "app_ds_2",
            "worksheet": "Business Unit",
            "data_entity": None,
            "target_field": None,
            "status": "Pending",
            "process": True
        })
        self.add_field_mapping({
            "source_field": "Company Business Group Name",
            "data_source": "app_ds_2",
            "worksheet": "Company",
            "data_entity": "Company",
            "target_field": "Company Business Group Name",
            "status": "Resolved",
            "process": False
        })

    def _seed_data_dictionary(self):
        entities = {
            "Database": ["Database Technology", "Database Type", "Database Version"],
            "Virtual Server": ["OS Type", "CPU Count", "RAM Size"],
            "Physical Server": ["Hardware Model", "Serial Number"],
            "Application": ["Application Category", "Criticality"],
            "Web": ["Web Server Type", "VHost Name"],
            "Network Device": ["Device Type", "Firmware Version"],
            "Storage": ["Storage Type", "Capacity", "IOPS"],
            "Environment": ["Environment Name", "Location", "Tier"]
        }
        
        for entity, fields in entities.items():
            entity_id = self.add_data_entity({"name": entity})
            first_field_id = None
            for field_name in fields:
                field_id = self.add_data_field({"name": field_name, "entity": entity})
                ef_id = self.add_data_entity_field({"name": field_name, "entity_id": entity_id, "anchor": field_name.lower().replace(" ", "_")})
                if first_field_id is None:
                    first_field_id = ef_id
            
            if first_field_id:
                self.update_data_entity(entity_id, {"key_field_id": first_field_id})
                
                if field_name == "Database Technology":
                    for val in ["Oracle", "PostgreSQL", "MySQL", "SQL Server", "MongoDB"]:
                        self.add_standard_value({"field_id": field_id, "value": val})
                elif field_name == "Database Type":
                    for val in ["Relational", "NoSQL", "Graph"]:
                        self.add_standard_value({"field_id": field_id, "value": val})
                elif field_name == "OS Type":
                    for val in ["Linux", "Windows", "Unix", "ESXi"]:
                        self.add_standard_value({"field_id": field_id, "value": val})
                elif field_name == "Application Category":
                    for val in ["Finance", "HR", "Operations", "Sales"]:
                        self.add_standard_value({"field_id": field_id, "value": val})
                elif field_name == "Web Server Type":
                    for val in ["Apache", "Nginx", "IIS", "Tomcat"]:
                        self.add_standard_value({"field_id": field_id, "value": val})

    def add_ci(self, ci_data: Dict[str, Any]) -> str:
        ci_id = ci_data.get("id") or str(uuid.uuid4())
        db_ci = models.ConfigurationItem(
            id=ci_id,
            name=ci_data["name"],
            type=ci_data["type"],
            description=ci_data.get("description"),
            properties=ci_data.get("properties", {})
        )
        self.db.add(db_ci)
        self.db.commit()
        return ci_id

    def get_cis(self) -> List[Dict[str, Any]]:
        cis = self.db.query(models.ConfigurationItem).all()
        return [
            {
                "id": ci.id,
                "name": ci.name,
                "type": ci.type,
                "description": ci.description,
                "properties": ci.properties
            } for ci in cis
        ]

    def get_ci_by_id(self, ci_id: str) -> Optional[Dict[str, Any]]:
        ci = self.db.query(models.ConfigurationItem).filter(models.ConfigurationItem.id == ci_id).first()
        if ci:
            return {
                "id": ci.id,
                "name": ci.name,
                "type": ci.type,
                "description": ci.description,
                "properties": ci.properties
            }
        return None

    def get_ci_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        ci = self.db.query(models.ConfigurationItem).filter(models.ConfigurationItem.name == name).first()
        if ci:
            return {
                "id": ci.id,
                "name": ci.name,
                "type": ci.type,
                "description": ci.description,
                "properties": ci.properties
            }
        return None

    def add_workload(self, workload_data: Dict[str, Any]) -> str:
        workload_id = workload_data.get("id") or str(uuid.uuid4())
        
        ci_ids = workload_data.get("ci_ids", [])
        db_cis = self.db.query(models.ConfigurationItem).filter(models.ConfigurationItem.id.in_(ci_ids)).all()
        
        db_workload = models.Workload(
            id=workload_id,
            name=workload_data["name"],
            description=workload_data.get("description"),
            environment=workload_data.get("environment", "PROD"),
            hosting_model=workload_data.get("hosting_model", "On-Premise"),
            cis=db_cis,
            internal_relationships=workload_data.get("relationships", [])
        )
        self.db.add(db_workload)
        self.db.commit()
        return workload_id

    def get_workloads(self) -> List[Dict[str, Any]]:
        workloads = self.db.query(models.Workload).all()
        return [
            {
                "id": wl.id,
                "name": wl.name,
                "description": wl.description,
                "environment": wl.environment,
                "hosting_model": wl.hosting_model,
                "ci_ids": [ci.id for ci in wl.cis],
                "relationships": wl.internal_relationships
            } for wl in workloads
        ]
    
    def get_workload_by_id(self, workload_id: str) -> Optional[Dict[str, Any]]:
        wl = self.db.query(models.Workload).filter(models.Workload.id == workload_id).first()
        if wl:
            return {
                "id": wl.id,
                "name": wl.name,
                "description": wl.description,
                "environment": wl.environment,
                "hosting_model": wl.hosting_model,
                "ci_ids": [ci.id for ci in wl.cis],
                "relationships": wl.internal_relationships
            }
        return None

    def update_workload(self, workload_id: str, updates: Dict[str, Any]):
        db_workload = self.db.query(models.Workload).filter(models.Workload.id == workload_id).first()
        if db_workload:
            if "name" in updates: db_workload.name = updates["name"]
            if "description" in updates: db_workload.description = updates["description"]
            if "environment" in updates: db_workload.environment = updates["environment"]
            if "hosting_model" in updates: db_workload.hosting_model = updates["hosting_model"]
            if "relationships" in updates: db_workload.internal_relationships = updates["relationships"]
            if "ci_ids" in updates:
                ci_ids = updates["ci_ids"]
                db_cis = self.db.query(models.ConfigurationItem).filter(models.ConfigurationItem.id.in_(ci_ids)).all()
                db_workload.cis = db_cis
            self.db.commit()
            return True
        return False

    def get_workload_by_name_and_env(self, name: str, env: str) -> Optional[Dict[str, Any]]:
        wl = self.db.query(models.Workload).filter(models.Workload.name == name, models.Workload.environment == env).first()
        if wl:
            return {
                "id": wl.id,
                "name": wl.name,
                "description": wl.description,
                "environment": wl.environment,
                "hosting_model": wl.hosting_model,
                "ci_ids": [ci.id for ci in wl.cis],
                "relationships": wl.internal_relationships
            }
        return None

    def add_dependency(self, dep_data: Dict[str, Any]):
        db_dep = models.Dependency(
            source_workload_id=dep_data["source_workload_id"],
            target_workload_id=dep_data["target_workload_id"],
            environment=dep_data.get("environment", "PROD"),
            level=dep_data.get("level", "Medium"),
            latency_sensitive=dep_data.get("latency_sensitive", False),
            type=dep_data.get("type", "dependency")
        )
        self.db.add(db_dep)
        self.db.commit()

    def get_dependencies(self) -> List[Dict[str, Any]]:
        deps = self.db.query(models.Dependency).all()
        return [
            {
                "source_workload_id": d.source_workload_id,
                "target_workload_id": d.target_workload_id,
                "environment": d.environment,
                "level": d.level,
                "latency_sensitive": d.latency_sensitive,
                "type": d.type
            } for d in deps
        ]

    def add_wave(self, wave_data: Dict[str, Any]) -> str:
        wave_id = wave_data.get("id") or str(uuid.uuid4())
        
        workload_ids = wave_data.get("workload_ids", [])
        db_workloads = self.db.query(models.Workload).filter(models.Workload.id.in_(workload_ids)).all()
        
        db_wave = models.Wave(
            id=wave_id,
            name=wave_data["name"],
            start_date=wave_data.get("start_date"),
            end_date=wave_data.get("end_date"),
            workloads=db_workloads
        )
        self.db.add(db_wave)
        self.db.commit()
        return wave_id

    def get_waves(self) -> List[Dict[str, Any]]:
        waves = self.db.query(models.Wave).all()
        return [
            {
                "id": w.id,
                "name": w.name,
                "start_date": w.start_date,
                "end_date": w.end_date,
                "workload_ids": [wl.id for wl in w.workloads]
            } for w in waves
        ]

    def get_wave_by_id(self, wave_id: str) -> Optional[Dict[str, Any]]:
        w = self.db.query(models.Wave).filter(models.Wave.id == wave_id).first()
        if w:
            return {
                "id": w.id,
                "name": w.name,
                "start_date": w.start_date,
                "end_date": w.end_date,
                "workload_ids": [wl.id for wl in w.workloads]
            }
        return None

    def add_runbook(self, runbook_data: Dict[str, Any]) -> str:
        runbook_id = runbook_data.get("id") or str(uuid.uuid4())
        db_runbook = models.Runbook(
            id=runbook_id,
            name=runbook_data["name"],
            workload_id=runbook_data["workload_id"],
            steps=runbook_data.get("steps", [])
        )
        self.db.add(db_runbook)
        self.db.commit()
        return runbook_id

    def get_runbooks(self) -> List[Dict[str, Any]]:
        runbooks = self.db.query(models.Runbook).all()
        return [
            {
                "id": r.id,
                "name": r.name,
                "workload_id": r.workload_id,
                "steps": r.steps
            } for r in runbooks
        ]

    def get_runbook_by_id(self, runbook_id: str) -> Optional[Dict[str, Any]]:
        r = self.db.query(models.Runbook).filter(models.Runbook.id == runbook_id).first()
        if r:
            return {
                "id": r.id,
                "name": r.name,
                "workload_id": r.workload_id,
                "steps": r.steps
            }
        return None

    def add_data_field(self, field_data: Dict[str, Any]) -> str:
        field_id = field_data.get("id") or str(uuid.uuid4())
        db_field = models.DataField(
            id=field_id,
            name=field_data["name"],
            entity=field_data["entity"]
        )
        self.db.add(db_field)
        self.db.commit()
        return field_id

    def get_data_fields(self) -> List[Dict[str, Any]]:
        fields = self.db.query(models.DataField).all()
        return [
            {
                "id": f.id,
                "name": f.name,
                "entity": f.entity,
                "standard_values": [
                    {"id": sv.id, "field_id": sv.field_id, "value": sv.value}
                    for sv in f.standard_values
                ]
            } for f in fields
        ]

    def get_data_field_by_id(self, field_id: str) -> Optional[Dict[str, Any]]:
        f = self.db.query(models.DataField).filter(models.DataField.id == field_id).first()
        if f:
            return {
                "id": f.id,
                "name": f.name,
                "entity": f.entity,
                "standard_values": [
                    {"id": sv.id, "field_id": sv.field_id, "value": sv.value}
                    for sv in f.standard_values
                ]
            }
        return None

    def add_standard_value(self, sv_data: Dict[str, Any]) -> str:
        sv_id = sv_data.get("id") or str(uuid.uuid4())
        db_sv = models.StandardValue(
            id=sv_id,
            field_id=sv_data["field_id"],
            value=sv_data["value"]
        )
        self.db.add(db_sv)
        self.db.commit()
        return sv_id

    def get_standard_values(self, field_id: Optional[str] = None) -> List[Dict[str, Any]]:
        query = self.db.query(models.StandardValue)
        if field_id:
            query = query.filter(models.StandardValue.field_id == field_id)
        svs = query.all()
        return [{"id": sv.id, "field_id": sv.field_id, "value": sv.value} for sv in svs]

    def get_standard_value_by_id(self, sv_id: str) -> Optional[Dict[str, Any]]:
        sv = self.db.query(models.StandardValue).filter(models.StandardValue.id == sv_id).first()
        if sv:
            return {"id": sv.id, "field_id": sv.field_id, "value": sv.value}
        return None

    def add_dataset(self, ds_data: Dict[str, Any]) -> str:
        ds_id = ds_data.get("id") or str(uuid.uuid4())
        db_ds = models.Dataset(
            id=ds_id,
            name=ds_data["name"],
            last_uploaded=ds_data.get("last_uploaded"),
            records=ds_data.get("records", 0),
            upload_count=ds_data.get("upload_count", 0),
            process=ds_data.get("process", True),
            worksheets=ds_data.get("worksheets", []),
            rating=ds_data.get("rating")
        )
        self.db.add(db_ds)
        self.db.commit()
        return ds_id

    def get_datasets(self) -> List[Dict[str, Any]]:
        datasets = self.db.query(models.Dataset).all()
        return [
            {
                "id": d.id,
                "name": d.name,
                "last_uploaded": d.last_uploaded,
                "records": d.records,
                "upload_count": d.upload_count,
                "process": d.process,
                "worksheets": d.worksheets,
                "rating": d.rating
            } for d in datasets
        ]

    def add_field_mapping(self, mapping_data: Dict[str, Any]) -> str:
        mapping_id = mapping_data.get("id") or str(uuid.uuid4())
        db_mapping = models.FieldMapping(
            id=mapping_id,
            source_field=mapping_data["source_field"],
            data_source=mapping_data["data_source"],
            worksheet=mapping_data["worksheet"],
            data_entity=mapping_data.get("data_entity"),
            target_field=mapping_data.get("target_field"),
            status=mapping_data.get("status", "Pending"),
            process=mapping_data.get("process", True)
        )
        self.db.add(db_mapping)
        self.db.commit()
        return mapping_id

    def get_field_mappings(self) -> List[Dict[str, Any]]:
        mappings = self.db.query(models.FieldMapping).all()
        return [
            {
                "id": m.id,
                "source_field": m.source_field,
                "data_source": m.data_source,
                "worksheet": m.worksheet,
                "data_entity": m.data_entity,
                "target_field": m.target_field,
                "status": m.status,
                "process": m.process
            } for m in mappings
        ]

    def update_field_mapping(self, mapping_id: str, updates: Dict[str, Any]):
        db_mapping = self.db.query(models.FieldMapping).filter(models.FieldMapping.id == mapping_id).first()
        if db_mapping:
            for key, value in updates.items():
                if hasattr(db_mapping, key):
                    setattr(db_mapping, key, value)
            self.db.commit()
            return True
        return False

    def add_data_entity(self, entity_data: Dict[str, Any]) -> str:
        entity_id = entity_data.get("id") or str(uuid.uuid4())
        db_entity = models.DataEntity(
            id=entity_id,
            name=entity_data["name"],
            key_field_id=entity_data.get("key_field_id")
        )
        self.db.add(db_entity)
        self.db.commit()
        return entity_id

    def get_data_entities(self) -> List[Dict[str, Any]]:
        entities = self.db.query(models.DataEntity).all()
        return [
            {
                "id": e.id,
                "name": e.name,
                "key_field_id": e.key_field_id,
                "fields": [
                    {"id": f.id, "name": f.name, "anchor": f.anchor, "entity_id": f.entity_id}
                    for f in e.fields
                ]
            } for e in entities
        ]

    def get_data_entity_by_id(self, entity_id: str) -> Optional[Dict[str, Any]]:
        e = self.db.query(models.DataEntity).filter(models.DataEntity.id == entity_id).first()
        if e:
            return {
                "id": e.id,
                "name": e.name,
                "key_field_id": e.key_field_id,
                "fields": [
                    {"id": f.id, "name": f.name, "anchor": f.anchor, "entity_id": f.entity_id}
                    for f in e.fields
                ]
            }
        return None

    def update_data_entity(self, entity_id: str, updates: Dict[str, Any]) -> bool:
        db_entity = self.db.query(models.DataEntity).filter(models.DataEntity.id == entity_id).first()
        if not db_entity:
            return False
        for key, value in updates.items():
            if hasattr(db_entity, key):
                setattr(db_entity, key, value)
        self.db.commit()
        return True

    def delete_data_entity(self, entity_id: str) -> bool:
        db_entity = self.db.query(models.DataEntity).filter(models.DataEntity.id == entity_id).first()
        if not db_entity:
            return False
        self.db.delete(db_entity)
        self.db.commit()
        return True

    def add_data_entity_field(self, field_data: Dict[str, Any]) -> str:
        field_id = field_data.get("id") or str(uuid.uuid4())
        db_field = models.DataEntityField(
            id=field_id,
            name=field_data["name"],
            anchor=field_data.get("anchor"),
            entity_id=field_data["entity_id"]
        )
        self.db.add(db_field)
        self.db.commit()
        return field_id

    def get_data_entity_fields(self, entity_id: Optional[str] = None) -> List[Dict[str, Any]]:
        query = self.db.query(models.DataEntityField)
        if entity_id:
            query = query.filter(models.DataEntityField.entity_id == entity_id)
        fields = query.all()
        return [
            {
                "id": f.id,
                "name": f.name,
                "anchor": f.anchor,
                "entity_id": f.entity_id
            } for f in fields
        ]

    def get_data_entity_field_by_id(self, field_id: str) -> Optional[Dict[str, Any]]:
        f = self.db.query(models.DataEntityField).filter(models.DataEntityField.id == field_id).first()
        if f:
            return {
                "id": f.id,
                "name": f.name,
                "anchor": f.anchor,
                "entity_id": f.entity_id
            }
        return None

    def update_data_entity_field(self, field_id: str, updates: Dict[str, Any]) -> bool:
        db_field = self.db.query(models.DataEntityField).filter(models.DataEntityField.id == field_id).first()
        if not db_field:
            return False
        for key, value in updates.items():
            if hasattr(db_field, key):
                setattr(db_field, key, value)
        self.db.commit()
        return True

    def delete_data_entity_field(self, field_id: str) -> bool:
        db_field = self.db.query(models.DataEntityField).filter(models.DataEntityField.id == field_id).first()
        if not db_field:
            return False
        self.db.delete(db_field)
        self.db.commit()
        return True

    def add_raw_data_entity(self, entity_data: Dict[str, Any]) -> str:
        entity_id = entity_data.get("id") or str(uuid.uuid4())
        created_time = entity_data.get("created_time") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db_entity = models.RawDataEntity(
            id=entity_id,
            created_time=created_time,
            source_type=entity_data["source_type"],
            user=entity_data["user"],
            data_entity_name=entity_data["data_entity_name"]
        )
        self.db.add(db_entity)
        self.db.commit()
        return entity_id

    def get_raw_data_entities(self) -> List[Dict[str, Any]]:
        entities = self.db.query(models.RawDataEntity).all()
        return [
            {
                "id": e.id,
                "created_time": e.created_time,
                "source_type": e.source_type,
                "user": e.user,
                "data_entity_name": e.data_entity_name,
                "fields": [
                    {
                        "id": f.id, 
                        "created_time": f.created_time,
                        "raw_data_entity_id": f.raw_data_entity_id,
                        "field_name": f.field_name,
                        "field_value": f.field_value,
                        "rating": f.rating
                    }
                    for f in e.fields
                ]
            } for e in entities
        ]

    def get_raw_data_entity_by_id(self, entity_id: str) -> Optional[Dict[str, Any]]:
        e = self.db.query(models.RawDataEntity).filter(models.RawDataEntity.id == entity_id).first()
        if e:
            return {
                "id": e.id,
                "created_time": e.created_time,
                "source_type": e.source_type,
                "user": e.user,
                "data_entity_name": e.data_entity_name,
                "fields": [
                    {
                        "id": f.id, 
                        "created_time": f.created_time,
                        "raw_data_entity_id": f.raw_data_entity_id,
                        "field_name": f.field_name,
                        "field_value": f.field_value,
                        "rating": f.rating
                    }
                    for f in e.fields
                ]
            }
        return None

    def delete_raw_data_entity(self, entity_id: str) -> bool:
        db_entity = self.db.query(models.RawDataEntity).filter(models.RawDataEntity.id == entity_id).first()
        if not db_entity:
            return False
        self.db.delete(db_entity)
        self.db.commit()
        return True

    def add_raw_data_entity_field(self, field_data: Dict[str, Any]) -> str:
        field_id = field_data.get("id") or str(uuid.uuid4())
        created_time = field_data.get("created_time") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db_field = models.RawDataEntityField(
            id=field_id,
            created_time=created_time,
            raw_data_entity_id=field_data["raw_data_entity_id"],
            field_name=field_data["field_name"],
            field_value=str(field_data.get("field_value", "")),
            rating=field_data.get("rating")
        )
        self.db.add(db_field)
        self.db.commit()
        return field_id

    def get_raw_data_entity_fields(self, entity_id: str) -> List[Dict[str, Any]]:
        fields = self.db.query(models.RawDataEntityField).filter(models.RawDataEntityField.raw_data_entity_id == entity_id).all()
        return [
            {
                "id": f.id,
                "created_time": f.created_time,
                "raw_data_entity_id": f.raw_data_entity_id,
                "field_name": f.field_name,
                "field_value": f.field_value,
                "rating": f.rating
            } for f in fields
        ]

storage = DatabaseStorage()
