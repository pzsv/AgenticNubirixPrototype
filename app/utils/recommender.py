import difflib
from typing import List, Dict, Optional, Tuple

def get_field_recommendation(
    source_field: str, 
    column_values: List[str], 
    data_fields: List[Dict],
    entities: Optional[List[Dict]] = None
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Returns (entity, field_name, field_id) or (None, None, None)
    Based on source field name and/or column values matching standard values.
    """
    if not source_field:
        return None, None, None
        
    source_field_lower = str(source_field).lower().strip()
    
    def normalize(s: str) -> str:
        if not s: return ""
        s = s.lower().strip()
        # Basic plural to singular
        if s.endswith('s') and len(s) > 3:
            if s.endswith('ies'): return s[:-3] + 'y'
            return s[:-1]
        return s

    def calculate_match_score(source: str, target: str) -> float:
        if not source or not target: return 0.0
        s_norm = source.lower().strip()
        t_norm = target.lower().strip()
        
        if s_norm == t_norm: return 1.0
        
        # Check normalized (singular) version
        if normalize(s_norm) == normalize(t_norm): return 0.95
        
        # Substring match
        if s_norm in t_norm or t_norm in s_norm:
            # Prefer longer matches relative to targets
            return 0.8 * (min(len(s_norm), len(t_norm)) / max(len(s_norm), len(t_norm))) + 0.1
            
        # Fuzzy match
        return difflib.SequenceMatcher(None, s_norm, t_norm).ratio()

    # 1. Try to identify potential entity and field parts from source
    extracted_entity_part = None
    extracted_field_part = source_field_lower
    
    for sep in ["|", "-", ":", "/"]:
        if sep in source_field:
            parts = [p.strip() for p in source_field.split(sep)]
            if len(parts) >= 2:
                extracted_entity_part = parts[0]
                extracted_field_part = " ".join(parts[1:])
                break

    # 2. Collect all possible targets
    all_targets = []
    
    # Data Dictionary fields
    for df in data_fields:
        all_targets.append({
            "entity": df["entity"],
            "field": df["name"],
            "id": df["id"],
            "type": "dictionary",
            "standard_values": df.get("standard_values", [])
        })
        
    # Entity Fields
    if entities:
        for ent in entities:
            # Also add the entity itself as a possible target (with no field)
            all_targets.append({
                "entity": ent["name"],
                "field": None,
                "id": None,
                "type": "entity_only"
            })
            for f in ent.get("fields", []):
                # Avoid duplicates
                if not any(t["entity"] == ent["name"] and t["field"] == f["name"] for t in all_targets):
                    all_targets.append({
                        "entity": ent["name"],
                        "field": f["name"],
                        "id": None,
                        "type": "entity_field"
                    })

    # 3. Score targets
    best_match = None
    max_score = 0.0

    synonyms = {
        "hostname": ["host name", "server name", "node name", "name", "dns name"],
        "ip": ["ip address", "ipv4", "address"],
        "os": ["operating system", "os type", "os name"],
        "cpu": ["cpu count", "cores", "processors", "cpu core count"],
        "ram": ["ram size", "memory", "memory size", "ram (gb)"],
    }

    for target in all_targets:
        score = 0.0
        target_entity = target["entity"]
        target_field = target["field"]
        
        # Entity matching
        entity_score = 0.0
        if extracted_entity_part:
            entity_score = calculate_match_score(extracted_entity_part, target_entity)
        
        # Also try matching entity name against the WHOLE source field
        whole_entity_score = calculate_match_score(source_field_lower, target_entity)
        # Or check if entity name is CONTAINED in the source field
        if target_entity.lower() in source_field_lower or normalize(target_entity) in source_field_lower:
            whole_entity_score = max(whole_entity_score, 0.8) # Boosted from 0.7
            
        entity_score = max(entity_score, whole_entity_score)
        
        # Field matching
        field_score = 0.0
        if target_field:
            field_score = calculate_match_score(extracted_field_part, target_field)
            # Also try matching field name against the WHOLE source field
            whole_field_score = calculate_match_score(source_field_lower, target_field)
            field_score = max(field_score, whole_field_score)
            
            # Synonym boost for field
            for canonical, variations in synonyms.items():
                if canonical in target_field.lower() or any(v in target_field.lower() for v in variations):
                    if any(v in extracted_field_part for v in variations) or any(v in source_field_lower for v in variations):
                        field_score = max(field_score, 0.9)

        elif target["type"] == "entity_only":
            # Baseline for entity-only match if entity matches well
            if entity_score > 0.6:
                field_score = 0.1 
        
        # Combined score
        if target_field:
            # If field score is very low, it shouldn't help much, and should even penalize
            if field_score > 0.7:
                effective_field_score = field_score
            elif field_score > 0.45:
                effective_field_score = field_score * 0.1
            else:
                effective_field_score = -1.0 # Heavier penalty for bad field match
            
            if entity_score > 0.7:
                score = entity_score * 85 + effective_field_score * 15
            else:
                # If entity doesn't match well, field must match VERY well
                score = entity_score * 15 + field_score * 85
        else:
            # Entity only match - should be strong if entity is found
            score = entity_score * 95
            
        # Value-based boost
        if column_values and target.get("standard_values"):
            clean_values = set(str(v).strip().lower() for v in column_values if v is not None and str(v).strip())
            if clean_values:
                standard_values = set(str(sv["value"]).lower().strip() for sv in target["standard_values"])
                matches = len(clean_values.intersection(standard_values))
                if matches > 0:
                    match_ratio = matches / len(clean_values)
                    if match_ratio >= 0.2:
                        score += 40 # Increased boost
                    score += int(match_ratio * 20)

        if score > max_score:
            max_score = score
            best_match = target

    # Final decision
    if best_match and max_score >= 40: # Increased threshold
        return best_match["entity"], best_match["field"], best_match["id"]

    return None, None, None
