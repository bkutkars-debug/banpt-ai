from typing import Dict, Any, List

class RiskAgent:
    """Calculates multi-dimensional risk index (0-100) assessing velocity, asset criticality, privilege elevation, and impact probability."""
    
    def score_risk(self, anomalies: List[Dict[str, Any]], investigation: Dict[str, Any]) -> Dict[str, Any]:
        base_score = 20
        risk_breakdown = []
        
        # Factor 1: High severity anomalies
        critical_count = sum(1 for a in anomalies if a.get("severity") == "CRITICAL")
        high_count = sum(1 for a in anomalies if a.get("severity") == "HIGH")
        
        if critical_count > 0:
            base_score += critical_count * 25
            risk_breakdown.append(f"+{critical_count * 25} pts: {critical_count} Critical Anomaly Signatures Triggered")
            
        if high_count > 0:
            base_score += high_count * 15
            risk_breakdown.append(f"+{high_count * 15} pts: {high_count} High Severity Anomaly Flags")
            
        # Factor 2: MITRE Tactics breadth
        tactics_count = len(investigation.get("mitre_tactics", []))
        if tactics_count >= 2:
            base_score += 20
            risk_breakdown.append(f"+20 pts: Multi-Stage Attack Progression ({tactics_count} distinct MITRE Tactics)")
            
        # Factor 3: High-value assets
        assets = investigation.get("affected_assets", [])
        if any("prod" in a.lower() or "confidential" in a.lower() or "admin" in a.lower() for a in assets):
            base_score += 15
            risk_breakdown.append("+15 pts: Direct exposure of Tier-0 Mission-Critical Assets / S3 Buckets")
            
        final_score = min(max(base_score, 10), 98)
        
        if final_score >= 80:
            level = "CRITICAL"
            color = "red"
            sla = "Immediate Containment Required (< 10 mins)"
        elif final_score >= 55:
            level = "HIGH"
            color = "amber"
            sla = "Urgent SOC Investigation (< 30 mins)"
        elif final_score >= 30:
            level = "MEDIUM"
            color = "yellow"
            sla = "Standard Tier-1 Triage Queue"
        else:
            level = "LOW"
            color = "green"
            sla = "Informational / Routine Audit"
            
        return {
            "score": final_score,
            "level": level,
            "color": color,
            "sla": sla,
            "risk_breakdown": risk_breakdown,
            "confidence": 95 if final_score > 70 else 88
        }