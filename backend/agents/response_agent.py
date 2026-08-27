from typing import Dict, Any, List

class ResponseRecommendationAgent:
    """Generates precise, automated, reversible SOAR remediation actions with a required Human-in-the-Loop approval gate."""
    
    def recommend_actions(self, investigation: Dict[str, Any], risk: Dict[str, Any]) -> List[Dict[str, Any]]:
        actions = []
        
        # Action 1: Revoke User Sessions
        for user in investigation.get("compromised_identities", []):
            actions.append({
                "id": f"act-revoke-{user.split('@')[0]}",
                "title": f"Revoke Active Session Tokens & Force MFA",
                "target": user,
                "action_type": "IDENTITY_CONTAINMENT",
                "risk_impact": "Low (User will need to re-authenticate with hardware MFA)",
                "reversible": True,
                "status": "PENDING_APPROVAL",
                "description": f"Instantly terminates all Okta/IdP sessions, invalidates STS tokens, and forces password + WebAuthn reset for {user}."
            })
            
        # Action 2: Firewall IP Block
        for ioc in investigation.get("iocs", []):
            actions.append({
                "id": f"act-block-ip-{ioc['value'].replace('.', '-')}",
                "title": f"Push Ingress Drop Rule for {ioc['value']}",
                "target": f"Palo Alto / CloudFlare WAF: {ioc['value']}",
                "action_type": "NETWORK_ISOLATION",
                "risk_impact": "Zero (IP matches high-confidence Tor/Malicious bulletproof proxy)",
                "reversible": True,
                "status": "PENDING_APPROVAL",
                "description": f"Broadcasts an immediate drop rule across border BGP routers and AWS Security Groups for IP {ioc['value']}."
            })
            
        # Action 3: EDR Host Isolation
        for asset in investigation.get("affected_assets", []):
            if "bastion" in asset or "host" in asset or "vm" in asset:
                actions.append({
                    "id": f"act-isolate-{asset.split('.')[0]}",
                    "title": f"Quarantine Endpoint via CrowdStrike/SentinelOne",
                    "target": asset,
                    "action_type": "HOST_CONTAINMENT",
                    "risk_impact": "Medium (Host is isolated from LAN; only forensic tunnel preserved)",
                    "reversible": True,
                    "status": "PENDING_APPROVAL",
                    "description": f"Network-isolates {asset} to halt lateral beaconing while preserving memory artifacts for forensics."
                })
                
        return actions