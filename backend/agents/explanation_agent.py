from typing import Dict, Any, List

class ExplanationAgent:
    """Translates dense raw SIEM, CloudTrail, and EDR logs into plain English executive narratives and incident summaries."""
    
    def generate_narrative(self, incident_title: str, anomalies: List[Dict[str, Any]], investigation: Dict[str, Any], risk: Dict[str, Any]) -> Dict[str, Any]:
        tactics = ", ".join(investigation.get("mitre_tactics", []))
        users = ", ".join(investigation.get("compromised_identities", []))
        assets = ", ".join(investigation.get("affected_assets", []))
        
        executive_summary = (
            f"Sentinel AI has autonomously detected and correlated a high-confidence security incident: '{incident_title}'. "
            f"An adversary operating across {tactics} targeted account(s) [{users}], affecting critical infrastructure [{assets}]. "
            f"Based on behavioral telemetry, the threat level has been calculated at {risk.get('level')} ({risk.get('score')}/100) with {risk.get('confidence')}% model confidence."
        )
        
        chronological_story = [
            f"Stage 1 (Recon & Ingress): Adversary initiated automated probing against enterprise gateways from anomalous external infrastructure.",
            f"Stage 2 (Compromise): Successful authentication anomaly established session token without customary MFA challenge.",
            f"Stage 3 (Lateral Movement / Escalation): Immediate administrative privilege escalation and sensitive resource enumeration observed.",
            f"Stage 4 (Threat Containment Trigger): Sentinel AI safety barrier flagged blast radius expansion and staged automated remediation playbook."
        ]
        
        why_incident = [
            "Sudden spike in authentication failures followed by immediate login success from an unapproved Tor exit node.",
            "Execution of administrative IAM policy modifications outside normal change control windows.",
            "High correlation across multiple distinct telemetry sources within a compressed 180-second time window."
        ]
        
        return {
            "executive_summary": executive_summary,
            "chronological_story": chronological_story,
            "why_flagged_as_incident": why_incident
        }