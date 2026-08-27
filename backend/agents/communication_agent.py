from typing import Dict, Any, Optional

class CommunicationAgent:
    """Creates a standardized, concise emergency briefing card suitable for sharing with first responders, police, hospital triage, or family contacts."""
    def __init__(self):
        pass

    async def create_brief(self, situation: Dict[str, Any], risk: Dict[str, Any], actions: Dict[str, Any], location_name: str, latitude: Optional[float] = None, longitude: Optional[float] = None) -> Dict[str, Any]:
        emergency_type = situation.get("emergency_type", "General Emergency")
        severity_level = risk.get("severity_level", "CRITICAL")
        people_count = situation.get("people_affected", 1)
        injuries = situation.get("detected_injuries", [])
        risks = risk.get("detected_risks", [])

        location_str = location_name
        if latitude and longitude:
            location_str += f" ({round(latitude, 4)}° N, {round(longitude, 4)}° E)"

        situation_summary = f"{people_count} individual(s) involved in {emergency_type.lower()}."
        if injuries:
            situation_summary += f" Identified injuries/symptoms: {', '.join(injuries)}."

        primary_recommendation = "Contact emergency services immediately (112 / 108) and maintain secure perimeter."
        if actions.get("immediate_actions"):
            first_action = actions["immediate_actions"][0]
            primary_recommendation = f"{first_action['title']} - {first_action['detail']}"

        # Formulate quick copy text
        formatted_text = f"""🚨 RAKSHAK AI EMERGENCY BRIEF 🚨
--------------------------------------
TYPE: {emergency_type.upper()}
PRIORITY: {severity_level} (Score: {risk.get('severity_score', 90)}/100)
PEOPLE AFFECTED: {people_count}
LOCATION: {location_str}

SITUATION SUMMARY:
{situation_summary}

DETECTED CRITICAL RISKS:
• """ + "\n• ".join(risks[:3]) + f"""

RECOMMENDED ACTION:
{primary_recommendation}

Generated via Rakshak AI Autonomous Response System
Note: AI assistance does not replace official emergency services."""

        return {
            "emergency_type": emergency_type,
            "priority": severity_level,
            "severity_score": risk.get("severity_score", 90),
            "people_affected": people_count,
            "location_display": location_str,
            "situation_summary": situation_summary,
            "detected_risks": risks[:4],
            "recommended_action": primary_recommendation,
            "shareable_text": formatted_text
        }
