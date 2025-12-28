from typing import List, Dict, Optional, Tuple

def get_field_recommendation(
    source_field: str, 
    column_values: List[str], 
    data_fields: List[Dict]
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Returns (entity, field_name, field_id) or (None, None, None)
    Based on source field name and/or column values matching standard values.
    """
    if not source_field:
        return None, None, None
        
    source_field_lower = str(source_field).lower().strip()
    
    # 1. Try exact match on field name
    for df in data_fields:
        if source_field_lower == df["name"].lower().strip():
            return df["entity"], df["name"], df["id"]
            
    # 2. Try match on common patterns or synonyms (simple heuristic)
    synonyms = {
        "hostname": ["host name", "server name", "node name"],
        "ip": ["ip address", "ipv4", "address"],
        "os": ["operating system", "os type", "os name"],
        "cpu": ["cpu count", "cores", "processors"],
        "ram": ["ram size", "memory", "memory size"],
    }
    
    for canonical, variations in synonyms.items():
        if source_field_lower == canonical or source_field_lower in variations:
            # Look for a field that matches the canonical name
            for df in data_fields:
                if canonical in df["name"].lower():
                    return df["entity"], df["name"], df["id"]

    # 3. Try to match column values against standard values
    if column_values:
        best_field = None
        max_matches = 0
        
        # Clean column values
        clean_values = set(str(v).strip().lower() for v in column_values if v is not None and str(v).strip())
        
        if clean_values:
            for df in data_fields:
                if not df.get("standard_values"):
                    continue
                    
                standard_values = set(str(sv["value"]).lower().strip() for sv in df["standard_values"])
                matches = len(clean_values.intersection(standard_values))
                
                if matches > max_matches:
                    max_matches = matches
                    best_field = df
            
            # If at least 20% of values match (and at least 1 match), recommend it
            if best_field and max_matches > 0 and (max_matches / len(clean_values) >= 0.2):
                 return best_field["entity"], best_field["name"], best_field["id"]

    # 4. Try fuzzy/substring match on field name as a fallback
    # Only if it's reasonably specific (length > 3)
    if len(source_field_lower) > 3:
        for df in data_fields:
            if source_field_lower in df["name"].lower() or df["name"].lower() in source_field_lower:
                return df["entity"], df["name"], df["id"]

    return None, None, None
