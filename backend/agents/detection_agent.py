import time
from typing import Dict, Any, List

class DetectionAgent:
    """Ingests raw security telemetry logs, filters noise, identifies anomaly signatures and clusters candidate alerts."""
    
    def detect_anomalies(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        anomalies = []
        
        # Group by user and source IP
        auth_failures = {}
        for ev in events:
            user = ev.get("user", "unknown")
            src_ip = ev.get("source_ip", "0.0.0.0")
            ev_type = ev.get("event_type", "")
            
            # Check 1: Brute force / credential stuffing
            if "FAIL" in ev_type or ev.get("status") == "FAILURE":
                auth_failures[src_ip] = auth_failures.get(src_ip, 0) + 1
                if auth_failures[src_ip] >= 3:
                    anomalies.append({
                        "id": f"anom-{len(anomalies)+1}",
                        "title": f"High-Volume Authentication Failures from {src_ip}",
                        "signature": "SIGN_AUTH_BRUTE_FORCE",
                        "severity": "HIGH",
                        "related_events": [ev["id"]],
                        "source_ip": src_ip,
                        "target_user": user,
                        "description": f"Detected {auth_failures[src_ip]} consecutive failed login attempts indicating credential brute forcing.",
                        "timestamp": ev.get("timestamp")
                    })
            
            # Check 2: Impossible travel / Geo anomaly
            if ev.get("country") in ["Tor Exit Node", "High-Risk ASN", "Nigeria", "Russia", "North Korea"] and ev.get("status") == "SUCCESS":
                anomalies.append({
                    "id": f"anom-{len(anomalies)+1}",
                    "title": f"Anomalous Geographic Ingress for User {user}",
                    "signature": "SIGN_IMPOSSIBLE_TRAVEL",
                    "severity": "CRITICAL",
                    "related_events": [ev["id"]],
                    "source_ip": src_ip,
                    "target_user": user,
                    "description": f"Successful session established from suspicious country ({ev.get('country')}) with anomalous ASN.",
                    "timestamp": ev.get("timestamp")
                })
                
            # Check 3: Cloud IAM / Privilege Escalation
            if "IAM_Policy_Modified" in ev_type or "Admin_Role_Assumed" in ev_type:
                anomalies.append({
                    "id": f"anom-{len(anomalies)+1}",
                    "title": f"Sensitive IAM Privilege Escalation by {user}",
                    "signature": "SIGN_IAM_PRIV_ESC",
                    "severity": "CRITICAL",
                    "related_events": [ev["id"]],
                    "source_ip": src_ip,
                    "target_user": user,
                    "description": "Administrator IAM policies attached to previously low-privileged service account.",
                    "timestamp": ev.get("timestamp")
                })
                
            # Check 4: Suspicious Process / EDR
            if "powershell_download" in ev_type.lower() or "vssadmin_delete" in ev_type.lower() or "c2_beacon" in ev_type.lower():
                anomalies.append({
                    "id": f"anom-{len(anomalies)+1}",
                    "title": f"Malicious Endpoint Execution: {ev_type}",
                    "signature": "SIGN_EDR_RANSOM_PRECURSOR",
                    "severity": "CRITICAL",
                    "related_events": [ev["id"]],
                    "source_ip": src_ip,
                    "target_user": user,
                    "description": f"Endpoint sensor flagged process: {ev.get('raw_log', 'Suspicious payload detected')}",
                    "timestamp": ev.get("timestamp")
                })
                
        return anomalies