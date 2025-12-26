from typing import Dict, List, Any, Optional
import uuid
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import models
from datetime import datetime

class DatabaseStorage:
    def __init__(self):
        Base.metadata.create_all(bind=engine)
        self._migrate_db()
        # Seed only if empty
        with SessionLocal() as db:
            if db.query(models.DataField).count() == 0:
                self._seed_data_dictionary(db)
            if db.query(models.DataSource).count() == 0:
                self._seed_data_sources(db)
            if db.query(models.DiscoveredDataEntity).count() == 0:
                self._seed_discovered_data(db)
            if db.query(models.NetworkScan).count() == 0:
                self._seed_network_scans(db)
            if db.query(models.Environment).count() == 0:
                self._seed_environments(db)
            if db.query(models.MovePrinciple).count() == 0:
                self._seed_move_principles(db)
            if db.query(models.ScoreCardFactor).count() == 0:
                self._seed_score_card(db)
            if db.query(models.Workload).count() == 0:
                self._seed_cis_workloads_dependencies(db)
            else:
                self._fix_existing_ci_types(db)
            
            # Always ensure super_admin exists
            self._seed_users(db)

    def _seed_users(self, db: Session):
        try:
            # 1. Create super_admin role if not exists
            super_admin_role = db.query(models.Role).filter(models.Role.name == "super_admin").first()
            if not super_admin_role:
                print("Seeding: Creating super_admin role...")
                super_admin_role = models.Role(name="super_admin")
                db.add(super_admin_role)
                db.flush()
            
            # 2. Create super_admin user if not exists
            super_admin_user = db.query(models.User).filter(models.User.username == "super_admin").first()
            if not super_admin_user:
                print("Seeding: Creating super_admin user...")
                super_admin_user = models.User(
                    username="super_admin",
                    password="nubirix123456",  # In a real app, this should be hashed
                    role_id=super_admin_role.id
                )
                db.add(super_admin_user)
            else:
                # Ensure password is correct even if it was changed or failed previously
                super_admin_user.password = "nubirix123456"
                super_admin_user.role_id = super_admin_role.id
            
            # 3. Create access rights for all features
            features = [
                'home', 'prepare', 'prepare-old', 'map', 'plan', 'move', 'evaluate',
                'discovered-data', 'data-dictionary', 'data-entities', 'environments',
                'move-principles', 'score-card', 'admin-project', 'admin-users', 'admin-failures', 'help'
            ]

            for feature in features:
                ar = db.query(models.AccessRight).filter(
                    models.AccessRight.role_id == super_admin_role.id,
                    models.AccessRight.feature == feature
                ).first()
                if not ar:
                    ar = models.AccessRight(
                        role_id=super_admin_role.id,
                        feature=feature,
                        read=True,
                        write=True,
                        delete=True,
                        execute=True
                    )
                    db.add(ar)
                else:
                    ar.read = True
                    ar.write = True
                    ar.delete = True
                    ar.execute = True
            
            db.commit()
            print("Seeding: User management seed successful.")
        except Exception as e:
            db.rollback()
            print(f"Seeding Error (users): {e}")

    def _migrate_db(self):
        from sqlalchemy import inspect, text
        inspector = inspect(engine)
        
        # Add status column to discovered_data_entities if it doesn't exist
        tables = inspector.get_table_names()
        if 'discovered_data_entities' in tables:
            columns = [col['name'] for col in inspector.get_columns('discovered_data_entities')]
            if 'status' not in columns:
                with engine.connect() as conn:
                    conn.execute(text("ALTER TABLE discovered_data_entities ADD COLUMN status VARCHAR DEFAULT 'Ingested'"))
                    conn.commit()

    def _fix_existing_ci_types(self, db: Session):
        # Fix legacy CI types that might not match the new lowercase enum
        from app.schemas.prepare import CIType
        valid_types = [t.value for t in CIType]
        cis = db.query(models.ConfigurationItem).all()
        updated = False
        for ci in cis:
            if ci.type not in valid_types:
                new_type = ci.type.lower().replace(" ", "_")
                if new_type in valid_types:
                    ci.type = new_type
                    updated = True
                else:
                    ci.type = "other"
                    updated = True
        if updated:
            db.commit()

    def _seed_cis_workloads_dependencies(self, db: Session):
        # 1. Seed CIs
        cis = [
            {"name": "SRV-APPS-01", "type": "virtual_server", "description": "Production App Server 1", "properties": {"OS": "Ubuntu 22.04", "RAM": "16GB"}},
            {"name": "SRV-APPS-02", "type": "virtual_server", "description": "Production App Server 2", "properties": {"OS": "Ubuntu 22.04", "RAM": "16GB"}},
            {"name": "SRV-DB-01", "type": "virtual_server", "description": "Production DB Server 1", "properties": {"OS": "RHEL 9", "RAM": "32GB"}},
            {"name": "CUST-DB-01", "type": "database", "description": "Customer Database", "properties": {"Technology": "PostgreSQL", "Version": "15.4"}},
        ]
        ci_ids = {}
        for ci in cis:
            ci_ids[ci["name"]] = self.add_ci(ci, db)

        # 2. Seed Workloads (AWIs)
        workloads = [
            {
                "name": "Customer Portal",
                "description": "Main customer facing portal",
                "environment": "PROD",
                "hosting_model": "On-Premise",
                "ci_ids": [ci_ids["SRV-APPS-01"], ci_ids["SRV-APPS-02"], ci_ids["CUST-DB-01"]],
                "relationships": []
            },
            {
                "name": "Payment Gateway",
                "description": "Internal payment processing service",
                "environment": "PROD",
                "hosting_model": "On-Premise",
                "ci_ids": [ci_ids["SRV-DB-01"]],
                "relationships": []
            },
            {
                "name": "HR Dashboard",
                "description": "Employee self-service portal",
                "environment": "PROD",
                "hosting_model": "SaaS",
                "ci_ids": [],
                "relationships": []
            }
        ]
        wl_ids = {}
        for wl in workloads:
            wl_ids[wl["name"]] = self.add_workload(wl, db)

        # 3. Seed Dependencies
        dependencies = [
            {
                "source_workload_id": wl_ids["Customer Portal"],
                "target_workload_id": wl_ids["Payment Gateway"],
                "environment": "PROD",
                "level": "High",
                "latency_sensitive": True,
                "type": "dependency"
            },
            {
                "source_workload_id": wl_ids["Customer Portal"],
                "target_workload_id": wl_ids["HR Dashboard"],
                "environment": "PROD",
                "level": "Low",
                "latency_sensitive": False,
                "type": "dependency"
            }
        ]
        for dep in dependencies:
            self.add_dependency(dep, db)

    def _seed_network_scans(self, db: Session):
        scans = [
            {
                "name": "Initial Discovery",
                "target_range": "10.0.1.0/24",
                "status": "Completed",
                "start_time": "2025-12-23 08:00:00",
                "end_time": "2025-12-23 08:15:00",
                "discovered_items": 12,
                "results": [
                    {"ip": "10.0.1.10", "hostname": "SRV-APPS-01", "type": "server"},
                    {"ip": "10.0.1.11", "hostname": "SRV-APPS-02", "type": "server"},
                    {"ip": "10.0.1.50", "hostname": "GW-01", "type": "network_device"}
                ]
            },
            {
                "name": "DC-2 Scan",
                "target_range": "10.0.2.0/24",
                "status": "Failed",
                "start_time": "2025-12-23 10:00:00",
                "end_time": "2025-12-23 10:05:00",
                "discovered_items": 0,
                "results": []
            }
        ]
        for s in scans:
            self.add_network_scan(s, db)

    def _seed_discovered_data(self, db: Session):
        # Sample discovered data for manual ingestion
        entities = [
            {
                "source_type": "manual",
                "user": "admin",
                "data_entity_name": "server",
                "data_source_id": "ds-manual-01",
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
                "data_source_id": "ds-manual-01",
                "fields": {
                    "name": "CUST-DB-01",
                    "Technology": "PostgreSQL",
                    "Version": "15.4"
                }
            }
        ]

        # Sample discovered data for file ingestion
        file_entities = [
            {
                "source_type": "file",
                "user": "admin",
                "data_entity_name": "Server List",
                "data_source_id": "ds-excel-01",
                "rating": "high",
                "rows": [
                    {"Server Name": "SRV-APPS-01", "Environment": "PROD", "IP Address": "10.0.1.10"},
                    {"Server Name": "SRV-APPS-02", "Environment": "PROD", "IP Address": "10.0.1.11"},
                    {"Server Name": "SRV-APPS-03", "Environment": "DEV", "IP Address": "10.0.2.10"}
                ]
            }
        ]

        for e in entities:
            eid = self.add_discovered_data_entity({
                "source_type": e["source_type"],
                "user": e["user"],
                "data_entity_name": e["data_entity_name"],
                "data_source_id": e.get("data_source_id")
            }, db)
            for k, v in e["fields"].items():
                self.add_discovered_data_field({
                    "discovered_data_entity_id": eid,
                    "field_name": k,
                    "field_value": v,
                    "rating": "manual"
                }, db)

        for fe in file_entities:
            for row in fe["rows"]:
                eid = self.add_discovered_data_entity({
                    "source_type": fe["source_type"],
                    "user": fe["user"],
                    "data_entity_name": fe["data_entity_name"],
                    "data_source_id": fe.get("data_source_id")
                }, db)
                for k, v in row.items():
                    self.add_discovered_data_field({
                        "discovered_data_entity_id": eid,
                        "field_name": k,
                        "field_value": v,
                        "rating": fe["rating"]
                    }, db)

    def _seed_data_sources(self, db: Session):
        # Sample data sources of various types
        self.add_data_source({
            "id": "ds-excel-01",
            "name": "Server_Inventory_v2",
            "source_type": "Excel",
            "data_ingested": "Server Inventory",
            "last_sync": "10 mins ago",
            "records": 1245,
            "sync_count": 2,
            "status": "Success",
            "process": True,
            "config": {"worksheets": ["Server List"]},
            "rating": "high"
        }, db)
        self.add_data_source({
            "id": "ds-cmdb-01",
            "name": "ServiceNow_PROD",
            "source_type": "CMDB",
            "data_ingested": "Full CI Export",
            "last_sync": "Just now",
            "records": 892,
            "sync_count": 45,
            "status": "Syncing",
            "process": True,
            "config": {"api_endpoint": "https://servicenow.prod/api"},
            "rating": "high"
        }, db)
        self.add_data_source({
            "name": "Initial Discovery Scan",
            "source_type": "Network Scan",
            "data_ingested": "Subnet 10.0.1.0/24",
            "last_sync": "2 hours ago",
            "records": 12,
            "sync_count": 1,
            "status": "Success",
            "process": True,
            "config": {"target_range": "10.0.1.0/24"},
            "rating": "medium"
        }, db)
        self.add_data_source({
            "id": "ds-manual-01",
            "name": "Manual Entry",
            "source_type": "Manual",
            "data_ingested": "Miscellaneous Assets",
            "last_sync": "Yesterday",
            "records": 42,
            "sync_count": 12,
            "status": "Success",
            "process": True,
            "config": {},
            "rating": "low"
        }, db)

        # Add some sample mappings
        self.add_field_mapping({
            "source_field": "Business Unit Company Name",
            "data_source": "Server_Inventory_v2",
            "worksheet": "Server List",
            "data_entity": None,
            "target_field": None,
            "status": "Pending",
            "process": True
        }, db)
        self.add_field_mapping({
            "source_field": "Company Business Group Name",
            "data_source": "Server_Inventory_v2",
            "worksheet": "Server List",
            "data_entity": "Company",
            "target_field": "Company Business Group Name",
            "status": "Resolved",
            "process": False
        }, db)

    def _seed_data_dictionary(self, db: Session):
        entities = {
            "Database": ["Database Technology", "Database Type", "Database Version"],
            "Virtual Server": ["OS Type", "CPU Count", "RAM Size"],
            "Physical Server": ["Hardware Model", "Serial Number"],
            "Application": ["Application Category", "Criticality"],
            "Web": ["Web Server Type", "VHost Name"],
            "Network Device": ["Device Type", "Firmware Version"],
            "Storage": ["Storage Type", "Capacity", "IOPS"],
            "Environment": ["Environment Name", "Location", "Tier"],
            "Migration": ["Move Principle"]
        }
        
        for entity, fields in entities.items():
            entity_id = self.add_data_entity({"name": entity}, db)
            first_field_id = None
            for field_name in fields:
                field_id = self.add_data_field({"name": field_name, "entity": entity}, db)
                ef_id = self.add_data_entity_field({"name": field_name, "entity_id": entity_id, "anchor": field_name.lower().replace(" ", "_")}, db)
                if first_field_id is None:
                    first_field_id = ef_id
                
                # Seed specific values
                if field_name == "Environment Name":
                    for val in ["PROD", "TEST", "DEV", "STAGE"]:
                        self.add_standard_value({"field_id": field_id, "value": val}, db)
                elif field_name == "Move Principle":
                    for val in ["Rehost", "Relocate", "Replatform", "Refactor", "Repurchase", "Retire", "Retain"]:
                        self.add_standard_value({"field_id": field_id, "value": val}, db)
                elif field_name == "Database Technology":
                    for val in ["Oracle", "PostgreSQL", "MySQL", "SQL Server", "MongoDB"]:
                        self.add_standard_value({"field_id": field_id, "value": val}, db)
                elif field_name == "Database Type":
                    for val in ["Relational", "NoSQL", "Graph"]:
                        self.add_standard_value({"field_id": field_id, "value": val}, db)
                elif field_name == "OS Type":
                    for val in ["Linux", "Windows", "Unix", "ESXi"]:
                        self.add_standard_value({"field_id": field_id, "value": val}, db)
                elif field_name == "Application Category":
                    for val in ["Finance", "HR", "Operations", "Sales"]:
                        self.add_standard_value({"field_id": field_id, "value": val}, db)
                elif field_name == "Web Server Type":
                    for val in ["Apache", "Nginx", "IIS", "Tomcat"]:
                        self.add_standard_value({"field_id": field_id, "value": val}, db)
            
            if first_field_id:
                self.update_data_entity(entity_id, {"key_field_id": first_field_id}, db)

    def add_ci(self, ci_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        ci_id = ci_data.get("id") or str(uuid.uuid4())
        db_ci = models.ConfigurationItem(
            id=ci_id,
            name=ci_data["name"],
            type=ci_data["type"],
            description=ci_data.get("description"),
            properties=ci_data.get("properties", {})
        )
        if db:
            db.add(db_ci)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_ci)
                db.commit()
        return ci_id

    def get_cis(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            cis = db.query(models.ConfigurationItem).all()
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
        with SessionLocal() as db:
            ci = db.query(models.ConfigurationItem).filter(models.ConfigurationItem.id == ci_id).first()
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
        with SessionLocal() as db:
            ci = db.query(models.ConfigurationItem).filter(models.ConfigurationItem.name == name).first()
            if ci:
                return {
                    "id": ci.id,
                    "name": ci.name,
                    "type": ci.type,
                    "description": ci.description,
                    "properties": ci.properties
                }
            return None

    def add_workload(self, workload_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        workload_id = workload_data.get("id") or str(uuid.uuid4())
        
        if db:
            ci_ids = workload_data.get("ci_ids", [])
            db_cis = db.query(models.ConfigurationItem).filter(models.ConfigurationItem.id.in_(ci_ids)).all()
            
            db_workload = models.Workload(
                id=workload_id,
                name=workload_data["name"],
                description=workload_data.get("description"),
                environment=workload_data.get("environment", "PROD"),
                hosting_model=workload_data.get("hosting_model", "On-Premise"),
                cis=db_cis,
                internal_relationships=workload_data.get("relationships", [])
            )
            db.add(db_workload)
            db.commit()
        else:
            with SessionLocal() as db:
                ci_ids = workload_data.get("ci_ids", [])
                db_cis = db.query(models.ConfigurationItem).filter(models.ConfigurationItem.id.in_(ci_ids)).all()
                
                db_workload = models.Workload(
                    id=workload_id,
                    name=workload_data["name"],
                    description=workload_data.get("description"),
                    environment=workload_data.get("environment", "PROD"),
                    hosting_model=workload_data.get("hosting_model", "On-Premise"),
                    cis=db_cis,
                    internal_relationships=workload_data.get("relationships", [])
                )
                db.add(db_workload)
                db.commit()
        return workload_id

    def get_workloads(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            workloads = db.query(models.Workload).all()
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
        with SessionLocal() as db:
            wl = db.query(models.Workload).filter(models.Workload.id == workload_id).first()
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
        with SessionLocal() as db:
            db_workload = db.query(models.Workload).filter(models.Workload.id == workload_id).first()
            if db_workload:
                if "name" in updates: db_workload.name = updates["name"]
                if "description" in updates: db_workload.description = updates["description"]
                if "environment" in updates: db_workload.environment = updates["environment"]
                if "hosting_model" in updates: db_workload.hosting_model = updates["hosting_model"]
                if "relationships" in updates: db_workload.internal_relationships = updates["relationships"]
                if "ci_ids" in updates:
                    ci_ids = updates["ci_ids"]
                    db_cis = db.query(models.ConfigurationItem).filter(models.ConfigurationItem.id.in_(ci_ids)).all()
                    db_workload.cis = db_cis
                db.commit()
                return True
            return False

    def get_workload_by_name_and_env(self, name: str, env: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as db:
            wl = db.query(models.Workload).filter(models.Workload.name == name, models.Workload.environment == env).first()
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

    def add_dependency(self, dep_data: Dict[str, Any], db: Optional[Session] = None):
        db_dep = models.Dependency(
            source_workload_id=dep_data["source_workload_id"],
            target_workload_id=dep_data["target_workload_id"],
            environment=dep_data.get("environment", "PROD"),
            level=dep_data.get("level", "Medium"),
            latency_sensitive=dep_data.get("latency_sensitive", False),
            type=dep_data.get("type", "dependency")
        )
        if db:
            db.add(db_dep)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_dep)
                db.commit()

    def get_dependencies(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            deps = db.query(models.Dependency).all()
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
        with SessionLocal() as db:
            workload_ids = wave_data.get("workload_ids", [])
            db_workloads = db.query(models.Workload).filter(models.Workload.id.in_(workload_ids)).all()
            
            mdg_ids = wave_data.get("mdg_ids", [])
            db_mdgs = db.query(models.MoveDependencyGroup).filter(models.MoveDependencyGroup.id.in_(mdg_ids)).all()
            
            db_wave = models.Wave(
                id=wave_id,
                name=wave_data["name"],
                start_date=wave_data.get("start_date"),
                end_date=wave_data.get("end_date"),
                workloads=db_workloads,
                mdgs=db_mdgs
            )
            db.add(db_wave)
            db.commit()
        return wave_id

    def get_waves(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            waves = db.query(models.Wave).all()
            return [
                {
                    "id": w.id,
                    "name": w.name,
                    "start_date": w.start_date,
                    "end_date": w.end_date,
                    "workload_ids": [wl.id for wl in w.workloads],
                    "mdg_ids": [m.id for m in w.mdgs]
                } for w in waves
            ]

    def get_wave_by_id(self, wave_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as db:
            w = db.query(models.Wave).filter(models.Wave.id == wave_id).first()
            if w:
                return {
                    "id": w.id,
                    "name": w.name,
                    "start_date": w.start_date,
                    "end_date": w.end_date,
                    "workload_ids": [wl.id for wl in w.workloads],
                    "mdg_ids": [m.id for m in w.mdgs]
                }
            return None

    def add_runbook(self, runbook_data: Dict[str, Any]) -> str:
        runbook_id = runbook_data.get("id") or str(uuid.uuid4())
        with SessionLocal() as db:
            db_runbook = models.Runbook(
                id=runbook_id,
                name=runbook_data["name"],
                workload_id=runbook_data["workload_id"],
                steps=runbook_data.get("steps", [])
            )
            db.add(db_runbook)
            db.commit()
        return runbook_id

    def get_runbooks(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            runbooks = db.query(models.Runbook).all()
            return [
                {
                    "id": r.id,
                    "name": r.name,
                    "workload_id": r.workload_id,
                    "steps": r.steps
                } for r in runbooks
            ]

    def get_runbook_by_id(self, runbook_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as db:
            r = db.query(models.Runbook).filter(models.Runbook.id == runbook_id).first()
            if r:
                return {
                    "id": r.id,
                    "name": r.name,
                    "workload_id": r.workload_id,
                    "steps": r.steps
                }
            return None

    def add_data_field(self, field_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        field_id = field_data.get("id") or str(uuid.uuid4())
        db_field = models.DataField(
            id=field_id,
            name=field_data["name"],
            entity=field_data["entity"]
        )
        if db:
            db.add(db_field)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_field)
                db.commit()
        return field_id

    def get_data_fields(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            fields = db.query(models.DataField).all()
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
        with SessionLocal() as db:
            f = db.query(models.DataField).filter(models.DataField.id == field_id).first()
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

    def add_standard_value(self, sv_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        sv_id = sv_data.get("id") or str(uuid.uuid4())
        db_sv = models.StandardValue(
            id=sv_id,
            field_id=sv_data["field_id"],
            value=sv_data["value"]
        )
        if db:
            db.add(db_sv)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_sv)
                db.commit()
        return sv_id

    def get_standard_values(self, field_id: Optional[str] = None) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            query = db.query(models.StandardValue)
            if field_id:
                query = query.filter(models.StandardValue.field_id == field_id)
            svs = query.all()
            return [{"id": sv.id, "field_id": sv.field_id, "value": sv.value} for sv in svs]

    def get_standard_value_by_id(self, sv_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as db:
            sv = db.query(models.StandardValue).filter(models.StandardValue.id == sv_id).first()
            if sv:
                return {"id": sv.id, "field_id": sv.field_id, "value": sv.value}
            return None

    def add_data_source(self, ds_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        ds_id = ds_data.get("id") or str(uuid.uuid4())
        db_ds = models.DataSource(
            id=ds_id,
            name=ds_data["name"],
            source_type=ds_data.get("source_type", "Excel"),
            data_ingested=ds_data.get("data_ingested"),
            last_sync=ds_data.get("last_sync"),
            records=ds_data.get("records", 0),
            sync_count=ds_data.get("sync_count", 0),
            status=ds_data.get("status", "Pending"),
            process=ds_data.get("process", True),
            config=ds_data.get("config", {}),
            rating=ds_data.get("rating")
        )
        if db:
            db.add(db_ds)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_ds)
                db.commit()
        return ds_id

    def get_data_sources(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            data_sources = db.query(models.DataSource).all()
            return [
                {
                    "id": d.id,
                    "name": d.name,
                    "source_type": d.source_type,
                    "data_ingested": d.data_ingested,
                    "last_sync": d.last_sync,
                    "last_uploaded": d.last_sync, # Compatibility
                    "records": d.records,
                    "sync_count": d.sync_count,
                    "upload_count": d.sync_count, # Compatibility
                    "status": d.status,
                    "process": d.process,
                    "config": d.config,
                    "worksheets": d.config.get("worksheets", []) if d.config else [], # Compatibility
                    "rating": d.rating
                } for d in data_sources
            ]

    def add_field_mapping(self, mapping_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        mapping_id = mapping_data.get("id") or str(uuid.uuid4())
        db_mapping = models.FieldMapping(
            id=mapping_id,
            source_field=mapping_data["source_field"],
            data_source=mapping_data["data_source"],
            worksheet=mapping_data["worksheet"],
            data_entity=mapping_data.get("data_entity"),
            target_field=mapping_data.get("target_field"),
            data_dictionary_field_id=mapping_data.get("data_dictionary_field_id"),
            status=mapping_data.get("status", "Pending"),
            process=mapping_data.get("process", True)
        )
        if db:
            db.add(db_mapping)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_mapping)
                db.commit()
        return mapping_id

    def get_field_mappings(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            mappings = db.query(models.FieldMapping).all()
            return [
                {
                    "id": m.id,
                    "source_field": m.source_field,
                    "data_source": m.data_source,
                    "worksheet": m.worksheet,
                    "data_entity": m.data_entity,
                    "target_field": m.target_field,
                    "data_dictionary_field_id": m.data_dictionary_field_id,
                    "status": m.status,
                    "process": m.process
                } for m in mappings
            ]

    def update_field_mapping(self, mapping_id: str, updates: Dict[str, Any]):
        with SessionLocal() as db:
            db_mapping = db.query(models.FieldMapping).filter(models.FieldMapping.id == mapping_id).first()
            if db_mapping:
                for key, value in updates.items():
                    if hasattr(db_mapping, key):
                        setattr(db_mapping, key, value)
                db.commit()
                return True
            return False

    def add_data_entity(self, entity_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        entity_id = entity_data.get("id") or str(uuid.uuid4())
        db_entity = models.DataEntity(
            id=entity_id,
            name=entity_data["name"],
            key_field_id=entity_data.get("key_field_id")
        )
        if db:
            db.add(db_entity)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_entity)
                db.commit()
        return entity_id

    def get_data_entities(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            entities = db.query(models.DataEntity).all()
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
        with SessionLocal() as db:
            e = db.query(models.DataEntity).filter(models.DataEntity.id == entity_id).first()
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

    def update_data_entity(self, entity_id: str, updates: Dict[str, Any], db: Optional[Session] = None) -> bool:
        if db:
            db_entity = db.query(models.DataEntity).filter(models.DataEntity.id == entity_id).first()
            if not db_entity:
                return False
            for key, value in updates.items():
                if hasattr(db_entity, key):
                    setattr(db_entity, key, value)
            db.commit()
            return True
        else:
            with SessionLocal() as db:
                db_entity = db.query(models.DataEntity).filter(models.DataEntity.id == entity_id).first()
                if not db_entity:
                    return False
                for key, value in updates.items():
                    if hasattr(db_entity, key):
                        setattr(db_entity, key, value)
                db.commit()
                return True

    def delete_data_entity(self, entity_id: str) -> bool:
        with SessionLocal() as db:
            db_entity = db.query(models.DataEntity).filter(models.DataEntity.id == entity_id).first()
            if not db_entity:
                return False
            db.delete(db_entity)
            db.commit()
            return True

    def add_data_entity_field(self, field_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        field_id = field_data.get("id") or str(uuid.uuid4())
        db_field = models.DataEntityField(
            id=field_id,
            name=field_data["name"],
            anchor=field_data.get("anchor"),
            entity_id=field_data["entity_id"]
        )
        if db:
            db.add(db_field)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_field)
                db.commit()
        return field_id

    def get_data_entity_fields(self, entity_id: Optional[str] = None) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            query = db.query(models.DataEntityField)
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
        with SessionLocal() as db:
            f = db.query(models.DataEntityField).filter(models.DataEntityField.id == field_id).first()
            if f:
                return {
                    "id": f.id,
                    "name": f.name,
                    "anchor": f.anchor,
                    "entity_id": f.entity_id
                }
            return None

    def update_data_entity_field(self, field_id: str, updates: Dict[str, Any]) -> bool:
        with SessionLocal() as db:
            db_field = db.query(models.DataEntityField).filter(models.DataEntityField.id == field_id).first()
            if not db_field:
                return False
            for key, value in updates.items():
                if hasattr(db_field, key):
                    setattr(db_field, key, value)
            db.commit()
            return True

    def delete_data_entity_field(self, field_id: str) -> bool:
        with SessionLocal() as db:
            db_field = db.query(models.DataEntityField).filter(models.DataEntityField.id == field_id).first()
            if not db_field:
                return False
            db.delete(db_field)
            db.commit()
            return True

    def add_discovered_data_entity(self, entity_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        entity_id = entity_data.get("id") or str(uuid.uuid4())
        created_time = entity_data.get("created_time") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db_entity = models.DiscoveredDataEntity(
            id=entity_id,
            created_time=created_time,
            source_type=entity_data["source_type"],
            user=entity_data["user"],
            data_entity_name=entity_data["data_entity_name"],
            data_source_id=entity_data.get("data_source_id"),
            status=entity_data.get("status", "Ingested")
        )
        if db:
            db.add(db_entity)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_entity)
                db.commit()
        return entity_id

    def get_discovered_data_entities(self, data_source_id: Optional[str] = None) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            query = db.query(models.DiscoveredDataEntity)
            if data_source_id:
                query = query.filter(models.DiscoveredDataEntity.data_source_id == data_source_id)
            entities = query.all()
            return [
                {
                    "id": e.id,
                    "created_time": e.created_time,
                    "source_type": e.source_type,
                    "user": e.user,
                    "data_entity_name": e.data_entity_name,
                    "data_source_id": e.data_source_id,
                    "status": e.status,
                    "fields": [
                        {
                            "id": f.id, 
                            "created_time": f.created_time,
                            "discovered_data_entity_id": f.discovered_data_entity_id,
                            "field_name": f.field_name,
                            "field_value": f.field_value,
                            "rating": f.rating
                        }
                        for f in e.fields
                    ]
                } for e in entities
            ]

    def get_discovered_data_entity_by_id(self, entity_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as db:
            e = db.query(models.DiscoveredDataEntity).filter(models.DiscoveredDataEntity.id == entity_id).first()
            if e:
                return {
                    "id": e.id,
                    "created_time": e.created_time,
                    "source_type": e.source_type,
                    "user": e.user,
                    "data_entity_name": e.data_entity_name,
                    "data_source_id": e.data_source_id,
                    "status": e.status,
                    "fields": [
                        {
                            "id": f.id, 
                            "created_time": f.created_time,
                            "discovered_data_entity_id": f.discovered_data_entity_id,
                            "field_name": f.field_name,
                            "field_value": f.field_value,
                            "rating": f.rating
                        }
                        for f in e.fields
                    ]
                }
            return None

    def delete_discovered_data_entity(self, entity_id: str) -> bool:
        with SessionLocal() as db:
            db_entity = db.query(models.DiscoveredDataEntity).filter(models.DiscoveredDataEntity.id == entity_id).first()
            if not db_entity:
                return False
            db.delete(db_entity)
            db.commit()
            return True

    def add_discovered_data_field(self, field_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        field_id = field_data.get("id") or str(uuid.uuid4())
        created_time = field_data.get("created_time") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db_field = models.DiscoveredDataField(
            id=field_id,
            created_time=created_time,
            discovered_data_entity_id=field_data["discovered_data_entity_id"],
            field_name=field_data["field_name"],
            field_value=str(field_data.get("field_value", "")),
            rating=field_data.get("rating")
        )
        if db:
            db.add(db_field)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_field)
                db.commit()
        return field_id

    def get_discovered_data_fields(self, entity_id: str) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            fields = db.query(models.DiscoveredDataField).filter(models.DiscoveredDataField.discovered_data_entity_id == entity_id).all()
            return [
                {
                    "id": f.id,
                    "created_time": f.created_time,
                    "discovered_data_entity_id": f.discovered_data_entity_id,
                    "field_name": f.field_name,
                    "field_value": f.field_value,
                    "rating": f.rating
                } for f in fields
            ]

    def add_network_scan(self, scan_data: Dict[str, Any], db: Optional[Session] = None) -> str:
        scan_id = scan_data.get("id") or str(uuid.uuid4())
        db_scan = models.NetworkScan(
            id=scan_id,
            name=scan_data["name"],
            target_range=scan_data["target_range"],
            status=scan_data.get("status", "Pending"),
            start_time=scan_data.get("start_time"),
            end_time=scan_data.get("end_time"),
            discovered_items=scan_data.get("discovered_items", 0),
            results=scan_data.get("results", [])
        )
        if db:
            db.add(db_scan)
            db.commit()
        else:
            with SessionLocal() as db:
                db.add(db_scan)
                db.commit()
        return scan_id

    def get_network_scans(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            scans = db.query(models.NetworkScan).all()
            return [
                {
                    "id": s.id,
                    "name": s.name,
                    "target_range": s.target_range,
                    "status": s.status,
                    "start_time": s.start_time,
                    "end_time": s.end_time,
                    "discovered_items": s.discovered_items,
                    "results": s.results
                } for s in scans
            ]

    def get_network_scan_by_id(self, scan_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as db:
            s = db.query(models.NetworkScan).filter(models.NetworkScan.id == scan_id).first()
            if s:
                return {
                    "id": s.id,
                    "name": s.name,
                    "target_range": s.target_range,
                    "status": s.status,
                    "start_time": s.start_time,
                    "end_time": s.end_time,
                    "discovered_items": s.discovered_items,
                    "results": s.results
                }
            return None

    def update_network_scan(self, scan_id: str, updates: Dict[str, Any]) -> bool:
        with SessionLocal() as db:
            db_scan = db.query(models.NetworkScan).filter(models.NetworkScan.id == scan_id).first()
            if not db_scan:
                return False
            for key, value in updates.items():
                if hasattr(db_scan, key):
                    setattr(db_scan, key, value)
            db.commit()
            return True

    def _seed_environments(self, db: Session):
        environments = [
            {"name": "PROD", "description": "Production environment"},
            {"name": "STAGE", "description": "Staging environment"},
            {"name": "UAT", "description": "User Acceptance Testing"},
            {"name": "DEV", "description": "Development environment"},
            {"name": "DR", "description": "Disaster Recovery"}
        ]
        for env in environments:
            self.add_environment(env, db)

    def _seed_move_principles(self, db: Session):
        principles = [
            {"name": "Rehost", "description": "Moving an application to the cloud as-is without any changes (Lift & Shift)."},
            {"name": "Relocate", "description": "Moving infrastructure to the cloud without functional changes or new hardware."},
            {"name": "Replatform", "description": "Moving an application to the cloud with minor optimizations (Lift, Tinker & Shift)."},
            {"name": "Refactor", "description": "Reimagining how an application is architected and developed using cloud-native features."},
            {"name": "Repurchase", "description": "Moving to a different product, typically a SaaS platform."},
            {"name": "Retire", "description": "Decommissioning an application that is no longer needed."},
            {"name": "Retain", "description": "Keeping an application in its current environment (Do nothing for now)."}
        ]
        for mp in principles:
            self.add_move_principle(mp, db)

    # Environment CRUD
    def add_environment(self, env_data: Dict[str, Any], db: Optional[Session] = None):
        if db is None:
            with SessionLocal() as db:
                return self._add_environment_impl(env_data, db)
        return self._add_environment_impl(env_data, db)

    def _add_environment_impl(self, env_data: Dict[str, Any], db: Session):
        env_id = env_data.get("id", str(uuid.uuid4()))
        db_env = models.Environment(
            id=env_id,
            name=env_data["name"],
            description=env_data.get("description", "")
        )
        db.add(db_env)
        db.commit()
        return env_id

    def get_environments(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            envs = db.query(models.Environment).all()
            return [{"id": e.id, "name": e.name, "description": e.description} for e in envs]

    def update_environment(self, env_id: str, updates: Dict[str, Any]) -> bool:
        with SessionLocal() as db:
            db_env = db.query(models.Environment).filter(models.Environment.id == env_id).first()
            if db_env:
                if "name" in updates:
                    db_env.name = updates["name"]
                if "description" in updates:
                    db_env.description = updates["description"]
                db.commit()
                return True
            return False

    def delete_environment(self, env_id: str) -> bool:
        with SessionLocal() as db:
            db_env = db.query(models.Environment).filter(models.Environment.id == env_id).first()
            if db_env:
                db.delete(db_env)
                db.commit()
                return True
            return False

    # Move Principle CRUD
    def add_move_principle(self, principle_data: Dict[str, Any], db: Optional[Session] = None):
        if db is None:
            with SessionLocal() as db:
                return self._add_move_principle_impl(principle_data, db)
        return self._add_move_principle_impl(principle_data, db)

    def _add_move_principle_impl(self, principle_data: Dict[str, Any], db: Session):
        principle_id = principle_data.get("id", str(uuid.uuid4()))
        db_principle = models.MovePrinciple(
            id=principle_id,
            name=principle_data["name"],
            description=principle_data.get("description", "")
        )
        db.add(db_principle)
        db.commit()
        return principle_id

    def get_move_principles(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            principles = db.query(models.MovePrinciple).all()
            return [{"id": p.id, "name": p.name, "description": p.description} for p in principles]

    def update_move_principle(self, principle_id: str, updates: Dict[str, Any]) -> bool:
        with SessionLocal() as db:
            db_principle = db.query(models.MovePrinciple).filter(models.MovePrinciple.id == principle_id).first()
            if db_principle:
                if "name" in updates:
                    db_principle.name = updates["name"]
                if "description" in updates:
                    db_principle.description = updates["description"]
                db.commit()
                return True
            return False

    def delete_move_principle(self, principle_id: str) -> bool:
        with SessionLocal() as db:
            db_principle = db.query(models.MovePrinciple).filter(models.MovePrinciple.id == principle_id).first()
            if db_principle:
                db.delete(db_principle)
                db.commit()
                return True
            return False

    def _seed_score_card(self, db: Session):
        factors = [
            {"name": "Technical Aspects", "weight": 3, "description": "Complexity, legacy debt, integration density", "options": [
                {"name": "Low Complexity", "score": 10},
                {"name": "Medium Complexity", "score": 5},
                {"name": "High Complexity", "score": 1}
            ]},
            {"name": "Current Location", "weight": 1, "description": "Where it is now", "options": [
                {"name": "On-Premise", "score": 1},
                {"name": "Co-location", "score": 3},
                {"name": "Public Cloud", "score": 5}
            ]},
            {"name": "Target Location", "weight": 2, "description": "Where it is going", "options": [
                {"name": "AWS", "score": 5},
                {"name": "Azure", "score": 5},
                {"name": "On-Premise", "score": 1}
            ]},
            {"name": "Risks", "weight": 4, "description": "Business impact of migration failure", "options": [
                {"name": "Low", "score": 10},
                {"name": "Medium", "score": 5},
                {"name": "High", "score": 1}
            ]},
            {"name": "Skills in Team", "weight": 2, "description": "Team familiarity with target tech", "options": [
                {"name": "Expert", "score": 10},
                {"name": "Competent", "score": 5},
                {"name": "Novice", "score": 1}
            ]},
            {"name": "TCO", "weight": 3, "description": "Total Cost of Ownership impact", "options": [
                {"name": "Significant Saving", "score": 10},
                {"name": "Neutral", "score": 5},
                {"name": "Cost Increase", "score": 1}
            ]},
            {"name": "ESG", "weight": 2, "description": "Environmental, Social, and Governance impact", "options": [
                {"name": "Positive", "score": 10},
                {"name": "Neutral", "score": 5},
                {"name": "Negative", "score": 1}
            ]}
        ]
        for f in factors:
            options = f.pop("options")
            factor_id = self.add_score_card_factor(f, db)
            for opt in options:
                opt["factor_id"] = factor_id
                self.add_score_card_option(opt, db)

    # Score Card CRUD
    def add_score_card_factor(self, factor_data: Dict[str, Any], db: Optional[Session] = None):
        if db is None:
            with SessionLocal() as db:
                return self._add_score_card_factor_impl(factor_data, db)
        return self._add_score_card_factor_impl(factor_data, db)

    def _add_score_card_factor_impl(self, factor_data: Dict[str, Any], db: Session):
        factor_id = factor_data.get("id", str(uuid.uuid4()))
        db_factor = models.ScoreCardFactor(
            id=factor_id,
            name=factor_data["name"],
            weight=factor_data.get("weight", 1),
            description=factor_data.get("description", "")
        )
        db.add(db_factor)
        db.commit()
        return factor_id

    def get_score_card_factors(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            factors = db.query(models.ScoreCardFactor).all()
            result = []
            for f in factors:
                result.append({
                    "id": f.id,
                    "name": f.name,
                    "weight": f.weight,
                    "description": f.description,
                    "options": [{"id": o.id, "factor_id": o.factor_id, "name": o.name, "score": o.score} for o in f.options]
                })
            return result

    def add_score_card_option(self, option_data: Dict[str, Any], db: Optional[Session] = None):
        if db is None:
            with SessionLocal() as db:
                return self._add_score_card_option_impl(option_data, db)
        return self._add_score_card_option_impl(option_data, db)

    def _add_score_card_option_impl(self, option_data: Dict[str, Any], db: Session):
        option_id = option_data.get("id", str(uuid.uuid4()))
        db_option = models.ScoreCardOption(
            id=option_id,
            factor_id=option_data["factor_id"],
            name=option_data["name"],
            score=option_data["score"]
        )
        db.add(db_option)
        db.commit()
        return option_id

    # S2T Mapping CRUD
    def add_s2t_mapping(self, mapping_data: Dict[str, Any]):
        with SessionLocal() as db:
            mapping_id = mapping_data.get("id", str(uuid.uuid4()))
            db_mapping = models.S2TMapping(
                id=mapping_id,
                workload_id=mapping_data["workload_id"],
                move_principle_id=mapping_data.get("move_principle_id"),
                target_environment_id=mapping_data.get("target_environment_id"),
                target_location=mapping_data.get("target_location"),
                score_card_results=mapping_data.get("score_card_results", {}),
                total_score=mapping_data.get("total_score", 0),
                status=mapping_data.get("status", "Draft")
            )
            db.add(db_mapping)
            db.commit()
            return mapping_id

    def get_s2t_mappings(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            mappings = db.query(models.S2TMapping).all()
            return [
                {
                    "id": m.id,
                    "workload_id": m.workload_id,
                    "move_principle_id": m.move_principle_id,
                    "target_environment_id": m.target_environment_id,
                    "target_location": m.target_location,
                    "score_card_results": m.score_card_results,
                    "total_score": m.total_score,
                    "status": m.status
                } for m in mappings
            ]
            
    def get_s2t_mapping_by_workload(self, workload_id: str) -> Optional[Dict[str, Any]]:
        with SessionLocal() as db:
            m = db.query(models.S2TMapping).filter(models.S2TMapping.workload_id == workload_id).first()
            if m:
                return {
                    "id": m.id,
                    "workload_id": m.workload_id,
                    "move_principle_id": m.move_principle_id,
                    "target_environment_id": m.target_environment_id,
                    "target_location": m.target_location,
                    "score_card_results": m.score_card_results,
                    "total_score": m.total_score,
                    "status": m.status
                }
            return None

    def update_s2t_mapping(self, mapping_id: str, updates: Dict[str, Any]) -> bool:
        with SessionLocal() as db:
            db_mapping = db.query(models.S2TMapping).filter(models.S2TMapping.id == mapping_id).first()
            if db_mapping:
                for key, value in updates.items():
                    if hasattr(db_mapping, key):
                        setattr(db_mapping, key, value)
                db.commit()
                return True
            return False

    # MDG CRUD
    def add_mdg(self, mdg_data: Dict[str, Any]):
        with SessionLocal() as db:
            mdg_id = mdg_data.get("id", str(uuid.uuid4()))
            db_mdg = models.MoveDependencyGroup(
                id=mdg_id,
                name=mdg_data["name"],
                description=mdg_data.get("description", ""),
                score_card_results=mdg_data.get("score_card_results", {}),
                total_score=mdg_data.get("total_score", 0),
                status=mdg_data.get("status", "Draft")
            )
            
            if mdg_data.get("workload_ids"):
                workloads = db.query(models.Workload).filter(models.Workload.id.in_(mdg_data["workload_ids"])).all()
                db_mdg.workloads = workloads
                
            db.add(db_mdg)
            db.commit()
            return mdg_id

    def get_mdgs(self) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            mdgs = db.query(models.MoveDependencyGroup).all()
            return [
                {
                    "id": m.id,
                    "name": m.name,
                    "description": m.description,
                    "workload_ids": [w.id for w in m.workloads],
                    "score_card_results": m.score_card_results,
                    "total_score": m.total_score,
                    "status": m.status
                } for m in mdgs
            ]

    def update_mdg(self, mdg_id: str, updates: Dict[str, Any]) -> bool:
        with SessionLocal() as db:
            db_mdg = db.query(models.MoveDependencyGroup).filter(models.MoveDependencyGroup.id == mdg_id).first()
            if db_mdg:
                if "workload_ids" in updates:
                    workloads = db.query(models.Workload).filter(models.Workload.id.in_(updates["workload_ids"])).all()
                    db_mdg.workloads = workloads
                    del updates["workload_ids"]
                    
                for key, value in updates.items():
                    if hasattr(db_mdg, key):
                        setattr(db_mdg, key, value)
                db.commit()
                return True
            return False

    def delete_mdg(self, mdg_id: str) -> bool:
        with SessionLocal() as db:
            db_mdg = db.query(models.MoveDependencyGroup).filter(models.MoveDependencyGroup.id == mdg_id).first()
            if db_mdg:
                db.delete(db_mdg)
                db.commit()
                return True
            return False

storage = DatabaseStorage()
