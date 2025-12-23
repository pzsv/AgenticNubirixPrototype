from typing import Dict, List, Any
import uuid

class InMemoryStorage:
    def __init__(self):
        self.cis: Dict[str, Any] = {}
        self.workloads: Dict[str, Any] = {}
        self.dependencies: List[Any] = []
        self.waves: Dict[str, Any] = {}
        self.runbooks: Dict[str, Any] = {}

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

storage = InMemoryStorage()
