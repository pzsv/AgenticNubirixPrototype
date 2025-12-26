from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, JSON, Table, Date
from sqlalchemy.orm import relationship
from app.database import Base

# Many-to-many relationship table for Workload and CI
workload_ci = Table(
    "workload_ci",
    Base.metadata,
    Column("workload_id", String, ForeignKey("workloads.id")),
    Column("ci_id", String, ForeignKey("configuration_items.id")),
)

# Many-to-many relationship table for Wave and Workload
wave_workload = Table(
    "wave_workload",
    Base.metadata,
    Column("wave_id", String, ForeignKey("waves.id")),
    Column("workload_id", String, ForeignKey("workloads.id")),
)

class ConfigurationItem(Base):
    __tablename__ = "configuration_items"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    description = Column(String)
    properties = Column(JSON)

class Workload(Base):
    __tablename__ = "workloads"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    environment = Column(String)
    hosting_model = Column(String)
    
    # Using relationship for CIs
    cis = relationship("ConfigurationItem", secondary=workload_ci)
    
    # relationships (the JSON list from the schema for internal Relationships)
    internal_relationships = Column(JSON, default=list)

class Dependency(Base):
    __tablename__ = "dependencies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_workload_id = Column(String, ForeignKey("workloads.id"))
    target_workload_id = Column(String, ForeignKey("workloads.id"))
    environment = Column(String)
    level = Column(String)
    latency_sensitive = Column(Boolean)
    type = Column(String)

class DataField(Base):
    __tablename__ = "data_fields"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    entity = Column(String)
    
    standard_values = relationship("StandardValue", back_populates="field", cascade="all, delete-orphan")

class DataEntity(Base):
    __tablename__ = "data_entities"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    key_field_id = Column(String, ForeignKey("data_entity_fields.id", use_alter=True, name="fk_key_field"))

    fields = relationship("DataEntityField", back_populates="entity", foreign_keys="DataEntityField.entity_id")

class DataEntityField(Base):
    __tablename__ = "data_entity_fields"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    anchor = Column(String)
    entity_id = Column(String, ForeignKey("data_entities.id"))

    entity = relationship("DataEntity", back_populates="fields", foreign_keys=[entity_id])

class DiscoveredDataEntity(Base):
    __tablename__ = "discovered_data_entities"

    id = Column(String, primary_key=True, index=True)
    created_time = Column(String)
    source_type = Column(String) # "manual" or "file"
    user = Column(String) # user id or name
    data_entity_name = Column(String)
    data_source_id = Column(String, ForeignKey("data_sources.id"), nullable=True)

    fields = relationship("DiscoveredDataField", back_populates="entity", cascade="all, delete-orphan")

class DiscoveredDataField(Base):
    __tablename__ = "discovered_data_fields"

    id = Column(String, primary_key=True, index=True)
    created_time = Column(String)
    discovered_data_entity_id = Column(String, ForeignKey("discovered_data_entities.id"))
    field_name = Column(String)
    field_value = Column(String)
    rating = Column(String)

    entity = relationship("DiscoveredDataEntity", back_populates="fields")

class StandardValue(Base):
    __tablename__ = "standard_values"

    id = Column(String, primary_key=True, index=True)
    field_id = Column(String, ForeignKey("data_fields.id"))
    value = Column(String)
    
    field = relationship("DataField", back_populates="standard_values")

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    source_type = Column(String) # "Excel", "CSV", "CMDB", "Network Scan", "Manual", etc.
    data_ingested = Column(String) # e.g., "Server Inventory", "App List"
    last_sync = Column(String)
    records = Column(Integer)
    sync_count = Column(Integer)
    status = Column(String) # "Success", "Syncing", "Failed", "Pending"
    process = Column(Boolean)
    config = Column(JSON) # for storing source-specific configuration
    rating = Column(String)

class FieldMapping(Base):
    __tablename__ = "field_mappings"

    id = Column(String, primary_key=True, index=True)
    source_field = Column(String)
    data_source = Column(String)
    worksheet = Column(String)
    data_entity = Column(String)
    target_field = Column(String)
    data_dictionary_field_id = Column(String, ForeignKey("data_fields.id"), nullable=True)
    status = Column(String)
    process = Column(Boolean)

class Wave(Base):
    __tablename__ = "waves"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    
    workloads = relationship("Workload", secondary=wave_workload)

class Environment(Base):
    __tablename__ = "environments"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

class MovePrinciple(Base):
    __tablename__ = "move_principles"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

class Runbook(Base):
    __tablename__ = "runbooks"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    workload_id = Column(String, ForeignKey("workloads.id"))
    steps = Column(JSON) # Storing RunbookSteps as JSON for simplicity

class NetworkScan(Base):
    __tablename__ = "network_scans"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    target_range = Column(String)
    status = Column(String) # "Pending", "Running", "Completed", "Failed"
    start_time = Column(String)
    end_time = Column(String)
    discovered_items = Column(Integer, default=0)
    results = Column(JSON)
