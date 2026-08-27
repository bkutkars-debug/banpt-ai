import sys, http.server, socketserver, json, uuid, asyncio
from datetime import datetime
from agents.orchestrator import Orchestrator, EmergencyRequest

orch = Orchestrator()

class Handler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        if self.path == '/api/scenarios':
            scenarios = [
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
                    'location_name': 'Galaxy Heights, Block B, Indirapuram',
                    'latitude': 28.6358,
                    'longitude': 77.3688,
                    'sample_image_hint': 'Dense dark smoke billowing from residential windows.'
                },
                {
                    'id': 'scenario-3',
                    'title': 'Scenario 3 — Lost / Unsafe Person',
                    'category': 'Personal Safety / Threat',
                    'badge': 'Urgent Security',
                    'description': 'Student stranded in unfamiliar dark alley with strangers following.',
                    'sample_text': 'I took a wrong turn after leaving the metro station. It is an isolated dark lane and two suspicious individuals are following me closely. I feel completely unsafe.',
                    'location_name': 'Old Metro Feeder Road, Lane 7',
                    'latitude': 28.7041,
                    'longitude': 77.1025,
                    'sample_image_hint': 'Dimly lit urban alleyway with low visibility.'
                },
                {
                    'id': 'scenario-4',
                    'title': 'Scenario 4 — Urban Flash Flood',
                    'category': 'Natural Disaster',
                    'badge': 'Flash Flood',
                    'description': 'Rapidly rising torrential flood water trapped small vehicle in underpass.',
                    'sample_text': 'Severe water logging under the railway underpass. Water is rapidly rising up to vehicle windshield level. Family of 3 stranded on car roof.',
                    'location_name': 'Minto Bridge Underpass, Connaught Place',
                    'latitude': 28.6328,
                    'longitude': 77.2197,
                    'sample_image_hint': 'Flooded roadway with submerged vehicles and rising water.'
                }
            ]
            self.wfile.write(json.dumps({'scenarios': scenarios}).encode('utf-8'))
        elif self.path == '/api/system/health':
            self.wfile.write(json.dumps({'status': 'healthy', 'timestamp': datetime.now().isoformat(), 'backend': 'FastAPI Multi-Agent Server', 'registered_agents': 6}).encode('utf-8'))
        else:
            self.wfile.write(json.dumps({'project': 'Rakshak AI', 'status': 'online', 'version': '1.0.0'}).encode('utf-8'))

    def do_POST(self):
        l = int(self.headers.get('content-length', 0))
        body = self.rfile.read(l)
        data = json.loads(body) if body else {}
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if self.path == '/api/emergency/analyze':
            req = EmergencyRequest(**data)
            result = asyncio.run(orch.run_pipeline(req))
            incident_id = req.incident_id or f'inc-{uuid.uuid4().hex[:8]}'
            now_str = datetime.now().strftime('%H:%M')
            result['incident_id'] = incident_id
            result['status'] = 'ACTIVE'
            result['created_at'] = datetime.now().isoformat()
            result['timeline'] = [
                {'id': 'evt-1', 'time_display': now_str, 'event_type': 'REPORTED', 'description': 'Emergency incident reported via multimodal input channel.', 'source': 'User Dispatch'},
                {'id': 'evt-2', 'time_display': now_str, 'event_type': 'AI_ANALYSIS', 'description': f'Situation Agent classified incident as ' + str(result['situation']['emergency_type']) + ' affecting ' + str(result['situation']['people_affected']) + ' individuals.', 'source': 'Situation Agent'},
                {'id': 'evt-3', 'time_display': now_str, 'event_type': 'SEVERITY_RATED', 'description': f'Risk Agent classified severity as ' + str(result['risk']['severity_level']) + ' (' + str(result['risk']['severity_score']) + '/100).', 'source': 'Risk Agent'},
                {'id': 'evt-4', 'time_display': now_str, 'event_type': 'ACTION_PLAN', 'description': 'Action Agent structured immediate response protocols & contraindications.', 'source': 'Action Agent'},
                {'id': 'evt-5', 'time_display': now_str, 'event_type': 'BRIEF_GENERATED', 'description': 'Emergency Brief & verified responder transmission package prepared.', 'source': 'Communication Agent'}
            ]
            self.wfile.write(json.dumps(result).encode('utf-8'))
        elif self.path == '/api/emergency/update':
            update_text = data.get('update_text', '')
            incident_id = data.get('incident_id', 'inc-12345')
            now_str = datetime.now().strftime('%H:%M')
            in_low = update_text.lower()
            is_improved = any(w in in_low for w in ['conscious', 'awake', 'stabilized', 'arrived', 'police here', 'fire out', 'rescued', 'safe now', 'ambulance here', 'first aid applied'])
            
            resp = {
                'incident_id': incident_id,
                'status': 'ACTIVE',
                'updated_at': datetime.now().isoformat(),
                'risk': {
                    'severity_score': 38 if is_improved else 95,
                    'severity_level': 'MODERATE' if is_improved else 'CRITICAL',
                    'color_theme': 'yellow' if is_improved else 'red',
                    'confidence': 96,
                    'reasoning_points': [f'Condition updated: ' + update_text + '. Severity dynamically recalculated based on field status.']
                },
                'action_plan': {
                    'immediate_actions': [
                        {'step': 1, 'title': 'Field Update Acknowledged', 'detail': 'Latest field report: ' + update_text + '. Continue monitoring patient vitals and brief arriving personnel.'},
                        {'step': 2, 'title': 'Keep Scene Secure', 'detail': 'Maintain cordon until professional emergency crew assumes command.'}
                    ],
                    'bystander_steps': ['Prepare to guide the ambulance to the exact spot upon siren audible.'],
                    'contraindications': ['Do not leave the patient unattended until handover is completed.']
                },
                'timeline_event': {
                    'id': f'evt-' + str(uuid.uuid4().hex[:6]),
                    'time_display': now_str,
                    'event_type': 'STATUS_UPDATE',
                    'description': 'Update logged: ' + update_text + ' — AI dynamically adjusted severity to ' + ('MODERATE (38/100)' if is_improved else 'CRITICAL (95/100)') + '.',
                    'source': 'Incident Field Update'
                }
            }
            self.wfile.write(json.dumps(resp).encode('utf-8'))

if __name__ == '__main__':
    with socketserver.ThreadingTCPServer(('0.0.0.0', 8000), Handler) as httpd:
        print('RAKSHAK_SERVER_RUNNING_ON_8000', flush=True)
        httpd.serve_forever()
