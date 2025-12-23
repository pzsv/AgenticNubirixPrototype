from typing import Dict, List, Any, Optional
import uuid

class InMemoryStorage:
    def __init__(self):
        self.cis: Dict[str, Any] = {}
        self.workloads: Dict[str, Any] = {}
        self.dependencies: List[Any] = []
        self.waves: Dict[str, Any] = {}
        self.runbooks: Dict[str, Any] = {}
        self.data_fields: Dict[str, Any] = {}
        self.standard_values: Dict[str, Any] = {}
        self.datasets: Dict[str, Any] = {}
        self.field_mappings: List[Any] = []
        self._seed_data_dictionary()
        self._seed_datasets()

    def _seed_datasets(self):
        # Sample datasets based on screenshots
        ds1_id = self.add_dataset({
            "name": "app_ds_2",
            "last_uploaded": "Nov 14, 2025, 10:49:28 AM",
            "records": 17,
            "upload_count": 1,
            "process": True,
            "worksheets": ["Business Unit", "Company", "Group"]
        })
        ds2_id = self.add_dataset({
            "name": "app_inventory_ds",
            "last_uploaded": "Nov 14, 2025, 10:32:56 AM",
            "records": 298,
            "upload_count": 1,
            "process": True,
            "worksheets": ["Application Package", "Application Software", "Database"]
        })
        ds3_id = self.add_dataset({
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
            "Network Device": ["Device Type", "Firmware Version"]
        }
        
        for entity, fields in entities.items():
            for field_name in fields:
                field_id = self.add_data_field({"name": field_name, "entity": entity})
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
        ci_id = str(uuid.uuid4())
        ci_data["id"] = ci_id
        self.cis[ci_id] = ci_data
        return ci_id

    def get_cis(self) -> List[Dict[str, Any]]:
        return list(self.cis.values())

    def add_workload(self, workload_data: Dict[str, Any]) -> str:
        workload_id = str(uuid.uuid4())
        workload_data["id"] = workload_id
        self.workloads[workload_id] = workload_data
        return workload_id

    def get_workloads(self) -> List[Dict[str, Any]]:
        return list(self.workloads.values())

    def add_dependency(self, dep_data: Dict[str, Any]):
        self.dependencies.append(dep_data)

    def get_dependencies(self) -> List[Dict[str, Any]]:
        return self.dependencies

    def add_wave(self, wave_data: Dict[str, Any]) -> str:
        wave_id = str(uuid.uuid4())
        wave_data["id"] = wave_id
        self.waves[wave_id] = wave_data
        return wave_id

    def get_waves(self) -> List[Dict[str, Any]]:
        return list(self.waves.values())

    def add_runbook(self, runbook_data: Dict[str, Any]) -> str:
        runbook_id = str(uuid.uuid4())
        runbook_data["id"] = runbook_id
        self.runbooks[runbook_id] = runbook_data
        return runbook_id

    def get_runbooks(self) -> List[Dict[str, Any]]:
        return list(self.runbooks.values())

    def add_data_field(self, field_data: Dict[str, Any]) -> str:
        field_id = str(uuid.uuid4())
        field_data["id"] = field_id
        if "standard_values" not in field_data:
            field_data["standard_values"] = []
        self.data_fields[field_id] = field_data
        return field_id

    def get_data_fields(self) -> List[Dict[str, Any]]:
        fields = []
        for field in self.data_fields.values():
            field_copy = field.copy()
            field_copy["standard_values"] = [
                sv for sv in self.standard_values.values() if sv["field_id"] == field["id"]
            ]
            fields.append(field_copy)
        return fields

    def add_standard_value(self, sv_data: Dict[str, Any]) -> str:
        sv_id = str(uuid.uuid4())
        sv_data["id"] = sv_id
        self.standard_values[sv_id] = sv_data
        return sv_id

    def get_standard_values(self, field_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if field_id:
            return [sv for sv in self.standard_values.values() if sv["field_id"] == field_id]
        return list(self.standard_values.values())

    def add_dataset(self, ds_data: Dict[str, Any]) -> str:
        ds_id = str(uuid.uuid4())
        ds_data["id"] = ds_id
        self.datasets[ds_id] = ds_data
        return ds_id

    def get_datasets(self) -> List[Dict[str, Any]]:
        return list(self.datasets.values())

    def add_field_mapping(self, mapping_data: Dict[str, Any]) -> str:
        mapping_id = str(uuid.uuid4())
        mapping_data["id"] = mapping_id
        self.field_mappings.append(mapping_data)
        return mapping_id

    def get_field_mappings(self) -> List[Dict[str, Any]]:
        return self.field_mappings

    def update_field_mapping(self, mapping_id: str, updates: Dict[str, Any]):
        for m in self.field_mappings:
            if m["id"] == mapping_id:
                m.update(updates)
                return True
        return False

storage = InMemoryStorage()
