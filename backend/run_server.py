import sys, http.server, socketserver, json, uuid, time, asyncio
from datetime import datetime
from typing import Dict, Any, List

# Emergency Agents (BANT PT Emergency Dispatch)
from agents.orchestrator import Orchestrator, EmergencyRequest

# Cyber Security SOC Agents (Sentinel AI Cyber Center)
from agents.detection_agent import DetectionAgent
from agents.investigation_agent import InvestigationAgent
from agents.risk_agent import RiskAgent as SOCRiskAgent
from agents.explanation_agent import ExplanationAgent
from agents.response_agent import ResponseRecommendationAgent

emergency_orchestrator = Orchestrator()
soc_detection = DetectionAgent()
soc_investigation = InvestigationAgent()
soc_risk = SOCRiskAgent()
soc_explanation = ExplanationAgent()
soc_response = ResponseRecommendationAgent()

CURRENT_SOC_INCIDENT = None

def get_emergency_scenarios():
    return [
        {
            'id': 'scenario-1',
            'title': 'Scenario 1 — Road Accident',
            'category': 'Road Accident',
            'badge': 'Critical Trauma',
            'description': 'Two people involved, one unconscious and another bleeding on roadside.',
            'sample_text': 'There has been a severe motorcycle and car collision on Ring Road near the flyover. Two people involved. One rider is unconscious on the tarmac, another person has deep active bleeding from an arm injury. Traffic is backing up.',
            'location_name': 'Ring Road Sector 4 Junction, New Delhi',
            'latitude': 28.5672,
            'longitude': 77.2100,
            'sample_image_hint': 'Damaged motorcycle on roadway with hazard triangles.'
        },
        {
            'id': 'scenario-2',
            'title': 'Scenario 2 — Building Fire',
            'category': 'Fire / Explosion',
            'badge': 'Hazardous Fire',
            'description': 'Dense smoke detected inside residential complex, residents trapped.',
            'sample_text': 'Heavy black smoke billowing from 3rd floor apartment of Galaxy Towers. Alarm sounding continuously. 2 residents shouting from the balcony cut off by hallway smoke.',
            'location_name': 'Galaxy Towers Block C, Andheri East, Mumbai',
            'latitude': 19.1136,
            'longitude': 72.8697,
            'sample_image_hint': 'Thermal signature showing heat concentrated on 3rd floor facade.'
        },
        {
            'id': 'scenario-3',
            'title': 'Scenario 3 — Lost / Personal Safety',
            'category': 'Personal Safety / Threat',
            'badge': 'Urgent Search',
            'description': 'Hiker missing in unfamiliar mountain trail as daylight is fading rapidly.',
            'sample_text': 'I got separated from my trekking group in dense forest trail. Battery is at 12%, daylight fading rapidly and temperature dropping. Sprained my left ankle.',
            'location_name': 'Nag Tibba Summit Trail Post #4, Uttarakhand',
            'latitude': 30.5843,
            'longitude': 78.1492,
            'sample_image_hint': 'Forest trail coordinates with compass orientation markers.'
        },
        {
            'id': 'scenario-4',
            'title': 'Scenario 4 — Natural Disaster / Flood',
            'category': 'Natural Disaster',
            'badge': 'Severe Flood',
            'description': 'Rapidly rising flash flood waters entering ground floor homes.',
            'sample_text': 'Flash flood waters from overflowing canal entered our ground floor living room. Water level reached waist height (approx 3.5 ft) in 20 minutes. Power has been cut off.',
            'location_name': 'Riverbank Colony Ward 12, Patna',
            'latitude': 25.5941,
            'longitude': 85.1376,
            'sample_image_hint': 'Water inundation depth measuring 1 meter against doorway.'
        }
    ]

def get_soc_preset_scenarios():
    return [
        {
            "id": "scenario-cred-stuffing",
            "title": "Credential Stuffing & AWS IAM Privilege Escalation",
            "category": "Cloud Infrastructure Compromise",
            "severity": "CRITICAL",
            "description": "Adversary performs password spraying against Okta IdP, achieves successful login from a Tor exit node, escalates AWS IAM permissions, and accesses confidential S3 buckets.",
            "synthetic_events": [
                {"id": "log-1", "timestamp": "23:01:02", "source": "Okta IdP", "event_type": "USER_AUTH_FAILURE", "user": "alex.dev@corp.internal", "source_ip": "185.220.101.5", "country": "Tor Exit Node", "status": "FAILURE", "raw_log": "Authentication attempt failed. Invalid credential payload."},
                {"id": "log-2", "timestamp": "23:01:08", "source": "Okta IdP", "event_type": "USER_AUTH_FAILURE", "user": "alex.dev@corp.internal", "source_ip": "185.220.101.5", "country": "Tor Exit Node", "status": "FAILURE", "raw_log": "Authentication attempt failed. Threshold warning."},
                {"id": "log-3", "timestamp": "23:01:14", "source": "Okta IdP", "event_type": "USER_AUTH_FAILURE", "user": "alex.dev@corp.internal", "source_ip": "185.220.101.5", "country": "Tor Exit Node", "status": "FAILURE", "raw_log": "Brute force signature candidate detected."},
                {"id": "log-4", "timestamp": "23:01:29", "source": "Okta IdP", "event_type": "USER_AUTH_SUCCESS", "user": "alex.dev@corp.internal", "source_ip": "185.220.101.5", "country": "Tor Exit Node", "status": "SUCCESS", "raw_log": "Session established. Bypass flag: Legacy Basic Auth endpoint."},
                {"id": "log-5", "timestamp": "23:02:11", "source": "AWS CloudTrail", "event_type": "IAM_Policy_Modified", "user": "alex.dev@corp.internal", "source_ip": "185.220.101.5", "resource": "arn:aws:iam::123456789:role/AdministratorAccess", "status": "SUCCESS", "raw_log": "AttachUserPolicy executed. PolicyArn=AdministratorAccess assigned to alex.dev."},
                {"id": "log-6", "timestamp": "23:03:04", "source": "AWS S3 Server Access", "event_type": "GetObject_Bulk_Download", "user": "alex.dev@corp.internal", "source_ip": "185.220.101.5", "resource": "s3://corporate-confidential-bucket/financial_records_2026.parquet", "status": "SUCCESS", "raw_log": "High-volume data read: 4.8 GB transferred to external IP."}
            ]
        },
        {
            "id": "scenario-ransomware",
            "title": "Phishing Ingress to Ransomware Precursor Activity",
            "category": "Endpoint Ransomware Vector",
            "severity": "CRITICAL",
            "description": "Suspicious email macro triggers base64-encoded PowerShell execution, establishes Cobalt Strike C2 beacon, and attempts shadow copy destruction.",
            "synthetic_events": [
                {"id": "log-101", "timestamp": "23:04:10", "source": "Proofpoint SEG", "event_type": "EMAIL_ATTACHMENT_MACRO", "user": "finance-lead@corp.internal", "source_ip": "45.154.255.89", "country": "High-Risk ASN", "status": "FLAGGED", "raw_log": "Suspicious macro enabled document 'Invoice_9921.docm' delivered."},
                {"id": "log-102", "timestamp": "23:04:22", "source": "CrowdStrike EDR", "event_type": "powershell_download", "user": "finance-lead@corp.internal", "host": "fin-workstation-89.corp.internal", "source_ip": "45.154.255.89", "status": "ANOMALY", "raw_log": "powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGo... downloaded staging binary."},
                {"id": "log-103", "timestamp": "23:05:01", "source": "Zeek Network IDS", "event_type": "c2_beacon", "user": "SYSTEM", "host": "fin-workstation-89.corp.internal", "source_ip": "45.154.255.89", "status": "MALICIOUS", "raw_log": "Periodic heartbeat TLS beaconing (jitter 10%, interval 30s) to known C2 domain."},
                {"id": "log-104", "timestamp": "23:05:35", "source": "CrowdStrike EDR", "event_type": "vssadmin_delete", "user": "SYSTEM", "host": "fin-workstation-89.corp.internal", "source_ip": "45.154.255.89", "status": "CRITICAL", "raw_log": "vssadmin.exe delete shadows /all /quiet executed."}
            ]
        },
        {
            "id": "scenario-impossible-travel",
            "title": "Impossible Geographic Travel / Session Hijack",
            "category": "Identity Compromise",
            "severity": "HIGH",
            "description": "Legitimate developer session in New York is followed 6 minutes later by an active session in Lagos creating permanent API credentials.",
            "synthetic_events": [
                {"id": "log-201", "timestamp": "23:00:10", "source": "Azure AD", "event_type": "USER_AUTH_SUCCESS", "user": "sarah.lead@corp.internal", "source_ip": "198.51.100.44", "country": "United States (New York)", "status": "SUCCESS", "raw_log": "Interactive logon from managed corporate laptop."},
                {"id": "log-202", "timestamp": "23:06:40", "source": "Azure AD", "event_type": "USER_AUTH_SUCCESS", "user": "sarah.lead@corp.internal", "source_ip": "102.89.23.11", "country": "Nigeria (Lagos)", "status": "SUCCESS", "raw_log": "Session token replayed from anomalous ASN. Velocity: 5,400 mph."},
                {"id": "log-203", "timestamp": "23:07:15", "source": "GitHub Enterprise", "event_type": "PAT_TOKEN_CREATED", "user": "sarah.lead@corp.internal", "source_ip": "102.89.23.11", "country": "Nigeria", "status": "SUCCESS", "raw_log": "Personal Access Token 'CI-Deploy-Permanent' generated with repo:all permissions."}
            ]
        },
        {
            "id": "scenario-insider-data",
            "title": "Insider Database Mass Extraction Anomaly",
            "category": "Insider Threat & Data Exfiltration",
            "severity": "HIGH",
            "description": "Off-hours query volume spike dumping employee PII and customer database records to unencrypted archive.",
            "synthetic_events": [
                {"id": "log-301", "timestamp": "23:10:05", "source": "PostgreSQL Audit", "event_type": "DB_AUTH_SUCCESS", "user": "db-readonly-svc", "source_ip": "10.0.12.45", "host": "prod-customer-db.internal", "status": "SUCCESS", "raw_log": "Service account authenticated at 03:10 AM local time (Off-hours baseline)."},
                {"id": "log-302", "timestamp": "23:11:12", "source": "PostgreSQL Audit", "event_type": "BULK_SELECT_QUERY", "user": "db-readonly-svc", "source_ip": "10.0.12.45", "host": "prod-customer-db.internal", "status": "ANOMALY", "raw_log": "SELECT * FROM customers_pii JOIN payment_vault ON 1=1 LIMIT 500000;"},
                {"id": "log-303", "timestamp": "23:12:00", "source": "AuditD Linux", "event_type": "ARCHIVE_COMPRESSION", "user": "db-readonly-svc", "host": "prod-customer-db.internal", "source_ip": "10.0.12.45", "status": "SUCCESS", "raw_log": "tar -czvf /tmp/dump_vault.tar.gz /var/lib/postgresql/data/"}
            ]
        }
    ]

def analyze_soc_pipeline(incident_title: str, events: List[Dict[str, Any]]) -> Dict[str, Any]:
    t0 = time.time()
    anomalies = soc_detection.detect_anomalies(events)
    investigation = soc_investigation.investigate(anomalies, events)
    risk = soc_risk.score_risk(anomalies, investigation)
    narrative = soc_explanation.generate_narrative(incident_title, anomalies, investigation, risk)
    actions = soc_response.recommend_actions(investigation, risk)
    duration_ms = round((time.time() - t0) * 1000, 2)
    
    return {
        "incident_id": f"SOC-2026-{uuid.uuid4().hex[:6].upper()}",
        "title": incident_title,
        "status": "OPEN_INVESTIGATING",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "telemetry_events": events,
        "anomalies": anomalies,
        "investigation": investigation,
        "risk": risk,
        "narrative": narrative,
        "recommended_actions": actions,
        "agent_telemetry": {
            "pipeline_latency_ms": duration_ms if duration_ms > 0 else 1.15,
            "agents_executed": ["Detection Agent", "Investigation Agent", "Risk Agent", "Explanation Agent", "Response Recommendation Agent"],
            "events_correlated": len(events),
            "anomalies_flagged": len(anomalies)
        }
    }

class UnifiedServerHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        
        if self.path == "/api/emergency/scenarios" or self.path == "/api/scenarios":
            self.wfile.write(json.dumps({"scenarios": get_emergency_scenarios()}).encode("utf-8"))
        elif self.path == "/api/soc/scenarios":
            self.wfile.write(json.dumps({"scenarios": get_soc_preset_scenarios()}).encode("utf-8"))
        elif self.path == "/api/soc/incident/current":
            global CURRENT_SOC_INCIDENT
            if not CURRENT_SOC_INCIDENT:
                scenarios = get_soc_preset_scenarios()
                CURRENT_SOC_INCIDENT = analyze_soc_pipeline(scenarios[0]["title"], scenarios[0]["synthetic_events"])
            self.wfile.write(json.dumps(CURRENT_SOC_INCIDENT).encode("utf-8"))
        else:
            self.wfile.write(json.dumps({"system": "BANTPT AI UNIFIED PLATFORM", "status": "ONLINE", "version": "3.0"}).encode("utf-8"))

    def do_POST(self):
        l = int(self.headers.get("content-length", 0))
        body = self.rfile.read(l)
        data = json.loads(body) if body else {}
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        global CURRENT_SOC_INCIDENT
        if self.path == "/api/emergency/analyze":
            req = EmergencyRequest(
                text=data.get("text", ""),
                audio_transcript=data.get("audio_transcript", ""),
                image_base64=data.get("image_base64"),
                image_metadata=data.get("image_metadata"),
                latitude=data.get("latitude"),
                longitude=data.get("longitude"),
                location_name=data.get("location_name", "Detected Location"),
                category=data.get("category", "General Emergency")
            )
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(emergency_orchestrator.run_pipeline(req))
            self.wfile.write(json.dumps(result).encode("utf-8"))
        elif self.path == "/api/emergency/update":
            req = EmergencyRequest(
                text=data.get("update_text", ""),
                category="Field Status Update"
            )
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            recalculated = loop.run_until_complete(emergency_orchestrator.run_pipeline(req))
            
            result = {
                "risk": recalculated.get("risk"),
                "action_plan": recalculated.get("action_plan"),
                "timeline_event": {
                    "id": f"evt-{uuid.uuid4().hex[:6]}",
                    "time_display": datetime.now().strftime("%H:%M:%S"),
                    "source": data.get("source", "Field Operator"),
                    "event_type": "STATUS_UPDATE",
                    "description": data.get("update_text", "")
                }
            }
            self.wfile.write(json.dumps(result).encode("utf-8"))
        elif self.path == "/api/soc/incident/simulate":
            scenario_id = data.get("scenario_id")
            scenarios = get_soc_preset_scenarios()
            matched = next((s for s in scenarios if s["id"] == scenario_id), scenarios[0])
            CURRENT_SOC_INCIDENT = analyze_soc_pipeline(matched["title"], matched["synthetic_events"])
            self.wfile.write(json.dumps(CURRENT_SOC_INCIDENT).encode("utf-8"))
        elif self.path == "/api/soc/action/approve":
            action_id = data.get("action_id")
            if CURRENT_SOC_INCIDENT and "recommended_actions" in CURRENT_SOC_INCIDENT:
                for act in CURRENT_SOC_INCIDENT["recommended_actions"]:
                    if act["id"] == action_id:
                        act["status"] = "EXECUTED_CONTAINED"
                        act["executed_at"] = datetime.now().strftime("%H:%M:%S")
            self.wfile.write(json.dumps({"success": True, "incident": CURRENT_SOC_INCIDENT}).encode("utf-8"))
        elif self.path == "/api/soc/copilot/ask":
            question = data.get("question", "")
            q_low = question.lower()
            if "mitre" in q_low or "technique" in q_low:
                reply = f"Adversary techniques identified: {', '.join([t['name'] + ' (' + t['id'] + ')' for t in CURRENT_SOC_INCIDENT.get('investigation', {}).get('mitre_techniques', [])])}. The attack chain shows credential access transitioning into cloud privilege manipulation."
            elif "user" in q_low or "who" in q_low:
                reply = f"Targeted identity is {', '.join(CURRENT_SOC_INCIDENT.get('investigation', {}).get('compromised_identities', []))}."
            else:
                reply = f"BantPT AI SOC Copilot: Incident '{CURRENT_SOC_INCIDENT.get('title')}' is currently rated {CURRENT_SOC_INCIDENT.get('risk', {}).get('level')} ({CURRENT_SOC_INCIDENT.get('risk', {}).get('score')}/100)."
            self.wfile.write(json.dumps({"reply": reply, "timestamp": datetime.now().strftime("%H:%M:%S")}).encode("utf-8"))

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("0.0.0.0", 8080), UnifiedServerHandler) as httpd:
        print("BANTPT_AI_UNIFIED_SERVER_RUNNING_ON_8080", flush=True)
        httpd.serve_forever()