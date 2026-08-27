from typing import Dict, Any, List

class ActionAgent:
    """Creates clear, structured, prioritized emergency action steps for bystanders, victims, and coordinating contacts."""
    def __init__(self):
        pass

    async def generate_plan(self, situation: Dict[str, Any], risk: Dict[str, Any]) -> Dict[str, Any]:
        emergency_type = situation.get("emergency_type", "General Emergency")
        injuries = situation.get("detected_injuries", [])
        is_trapped = situation.get("is_trapped", False)
        severity = risk.get("severity_level", "HIGH")

        immediate_actions = []
        bystander_steps = []
        contraindications = []

        # Baseline mandatory emergency service call
        if emergency_type == "Fire / Explosion":
            immediate_actions.extend([
                {"step": 1, "title": "Evacuate & Sound Alarm", "detail": "Immediately leave the structure via the nearest safe exit. Do NOT use elevators."},
                {"step": 2, "title": "Call Fire Emergency (101 / 911)", "detail": "Report exact floor, room, building name, and trapped status."},
                {"step": 3, "title": "Stay Low Beneath Smoke", "detail": "Crawl on hands and knees to avoid inhaling toxic carbon monoxide."}
            ])
            contraindications.extend([
                "DO NOT re-enter a burning building for personal belongings.",
                "DO NOT throw water on grease or electrical fires."
            ])
        elif emergency_type == "Road Accident":
            immediate_actions.extend([
                {"step": 1, "title": "Secure Scene & Prevent Secondary Impact", "detail": "Turn on hazard flashers, place warning triangles, or alert oncoming traffic if safe to do so."},
                {"step": 2, "title": "Contact Emergency Services (108 / 112 / 911)", "detail": "State location, number of injured individuals, and that at least one person is unconscious."},
                {"step": 3, "title": "Check Airway & Control Bleeding", "detail": "Apply firm, direct pressure on active bleeding with a clean cloth or bandage. Ensure airway is clear without twisting neck."}
            ])
            bystander_steps.extend([
                "Assign a specific bystander to wave down the approaching ambulance.",
                "Keep bystanders away from the roadway to prevent further accidents.",
                "Speak calmly to the injured to reduce psychological shock."
            ])
            contraindications.extend([
                "DO NOT remove the helmet of an unconscious motorcyclist unless their breathing is obstructed (risk of spinal cord injury).",
                "DO NOT offer food, water, or medication to unconscious or bleeding victims.",
                "DO NOT move the victim unless there is imminent danger of vehicle fire or collapse."
            ])
        elif emergency_type == "Personal Safety / Threat":
            immediate_actions.extend([
                {"step": 1, "title": "Move Toward Well-Lit Public Space", "detail": "Head immediately toward an open store, petrol pump, or populated area."},
                {"step": 2, "title": "Discreetly Alert Police / Emergency Line (112)", "detail": "Keep phone call live or transmit live GPS location to trusted contacts."},
                {"step": 3, "title": "Make Noise / Draw Attention if Cornered", "detail": "Use a personal alarm, shout loudly for help, and maintain safe physical distance."}
            ])
            contraindications.extend([
                "DO NOT take secluded shortcuts or dark alleys.",
                "DO NOT engage in aggressive confrontation unless defending life as a last resort."
            ])
        elif emergency_type == "Natural Disaster":
            immediate_actions.extend([
                {"step": 1, "title": "Move to Higher / Structurally Sound Ground", "detail": "Evacuate low-lying areas or compromised buildings immediately."},
                {"step": 2, "title": "Avoid Downed Power Lines & Flood Water", "detail": "Never walk or drive through moving flood water (just 15 cm can sweep people away)."},
                {"step": 3, "title": "Contact Disaster Relief Helplines", "detail": "Signal location from roof or elevated window with bright fabric or flashlight."}
            ])
            contraindications.extend([
                "DO NOT touch electrical equipment while wet or standing in water.",
                "DO NOT drive through flooded underpasses or submerged bridges."
            ])
        else: # Medical
            immediate_actions.extend([
                {"step": 1, "title": "Call Ambulance & Medical Dispatch (102 / 108 / 911)", "detail": "Provide precise GPS address, symptoms, and age/gender if known."},
                {"step": 2, "title": "Assess Responsiveness & Breathing", "detail": "Gently tap collarbone and ask loudly 'Can you hear me?'. Check chest rise for 10 seconds."},
                {"step": 3, "title": "Position for Recovery or CPR", "detail": "If breathing normally and no spinal injury suspected, place in recovery position (on side). If not breathing, begin CPR."}
            ])
            contraindications.extend([
                "DO NOT shake an unresponsive infant or child vigorously.",
                "DO NOT leave an unconscious individual flat on their back if vomiting."
            ])

        # Common reassurance & responder greeting step
        bystander_steps.append("Gather patient details (known allergies, medical history) to brief the arriving paramedics.")
        bystander_steps.append("Keep phone line clear in case the emergency dispatcher calls back for updates.")

        return {
            "immediate_actions": immediate_actions,
            "bystander_steps": bystander_steps,
            "contraindications": contraindications,
            "priority_level": severity,
            "estimated_action_time_minutes": "1-3 mins"
        }
