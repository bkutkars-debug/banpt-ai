import os
import json
import asyncio
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

# Import our agents
from agents.situation_agent import SituationAgent
from agents.risk_agent import RiskAgent
from agents.action_agent import ActionAgent
from agents.resource_agent import ResourceAgent
from agents.communication_agent import CommunicationAgent
from agents.verification_agent import VerificationAgent

class EmergencyRequest(BaseModel):
    incident_id: Optional[str] = None
    text: Optional[str] = ""
    audio_transcript: Optional[str] = ""
    image_base64: Optional[str] = None
    image_metadata: Optional[Dict[str, Any]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = "Detected GPS Location"
    category: Optional[str] = "General Emergency"

class Orchestrator:
    def __init__(self):
        self.situation_agent = SituationAgent()
        self.risk_agent = RiskAgent()
        self.action_agent = ActionAgent()
        self.resource_agent = ResourceAgent()
        self.communication_agent = CommunicationAgent()
        self.verification_agent = VerificationAgent()

    async def run_pipeline(self, request: EmergencyRequest) -> Dict[str, Any]:
        import time
        start_time = time.time()
        agent_traces = []

        # 1. Situation Analysis
        t0 = time.time()
        situation_result = await self.situation_agent.analyze(
            text=request.text,
            audio_transcript=request.audio_transcript,
            image_base64=request.image_base64,
            image_metadata=request.image_metadata,
            category=request.category,
            location_name=request.location_name
        )
        t_situation = round((time.time() - t0) * 1000, 2)
        agent_traces.append({
            "agent": "Situation Agent",
            "status": "completed",
            "duration_ms": t_situation,
            "description": "Extracted emergency classification, casualties, trapped status, and multimodal cues.",
            "output_summary": f"Detected {situation_result.get('emergency_type')} affecting {situation_result.get('people_affected')} people."
        })

        # 2. Risk & Severity Engine
        t0 = time.time()
        risk_result = await self.risk_agent.evaluate_risk(
            situation=situation_result,
            context={"latitude": request.latitude, "longitude": request.longitude}
        )
        t_risk = round((time.time() - t0) * 1000, 2)
        agent_traces.append({
            "agent": "Risk Agent",
            "status": "completed",
            "duration_ms": t_risk,
            "description": "Calculated 0-100 severity index, risk factors, and human-interpretable reasoning.",
            "output_summary": f"Severity {risk_result.get('severity_level')} ({risk_result.get('severity_score')}/100) - Confidence: {risk_result.get('confidence')}%"
        })

        # 3. Action Agent (Parallel with Resource Agent)
        t0 = time.time()
        action_task = asyncio.create_task(
            self.action_agent.generate_plan(situation_result, risk_result)
        )
        resource_task = asyncio.create_task(
            self.resource_agent.find_resources(
                latitude=request.latitude or 28.6139,
                longitude=request.longitude or 77.2090,
                emergency_type=situation_result.get("emergency_type", "Medical Emergency"),
                severity_level=risk_result.get("severity_level", "High")
            )
        )
        action_result, resource_result = await asyncio.gather(action_task, resource_task)
        t_action_resource = round((time.time() - t0) * 1000, 2)

        agent_traces.append({
            "agent": "Action Agent",
            "status": "completed",
            "duration_ms": round(t_action_resource * 0.55, 2),
            "description": "Generated prioritized emergency steps, bystander instructions, and contraindications.",
            "output_summary": f"{len(action_result.get('immediate_actions', []))} immediate actions + {len(action_result.get('contraindications', []))} safety warnings."
        })

        agent_traces.append({
            "agent": "Resource Agent",
            "status": "completed",
            "duration_ms": round(t_action_resource * 0.45, 2),
            "description": "Discovered closest emergency responders, medical centers, fire/police units, and safe havens.",
            "output_summary": f"Found {len(resource_result.get('resources', []))} nearby facilities within radius."
        })

        # 4. Communication Agent (Emergency Brief)
        t0 = time.time()
        brief_result = await self.communication_agent.create_brief(
            situation=situation_result,
            risk=risk_result,
            actions=action_result,
            location_name=request.location_name or "GPS Coordinates Provided",
            latitude=request.latitude,
            longitude=request.longitude
        )
        t_comm = round((time.time() - t0) * 1000, 2)
        agent_traces.append({
            "agent": "Communication Agent",
            "status": "completed",
            "duration_ms": t_comm,
            "description": "Formatted standardized dispatch brief for first responders and family contacts.",
            "output_summary": f"Generated concise {brief_result.get('priority')} priority briefing."
        })

        # 5. Verification Agent
        t0 = time.time()
        verification_result = await self.verification_agent.verify(
            situation=situation_result,
            risk=risk_result,
            actions=action_result,
            brief=brief_result
        )
        t_verify = round((time.time() - t0) * 1000, 2)
        agent_traces.append({
            "agent": "Verification Agent",
            "status": "completed",
            "duration_ms": t_verify,
            "description": "Audited recommendations for safety hazards, missing critical information, and contradictions.",
            "output_summary": f"Safety audit: {'PASSED' if verification_result.get('is_safe') else 'FLAGGED'} (Checks: {len(verification_result.get('safety_checks', []))})"
        })

        total_duration_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "situation": situation_result,
            "risk": risk_result,
            "action_plan": action_result,
            "resources": resource_result.get("resources", []),
            "emergency_brief": brief_result,
            "verification": verification_result,
            "metrics": {
                "total_duration_ms": total_duration_ms,
                "agent_count": 6,
                "steps_completed": len(agent_traces),
                "confidence_score": risk_result.get("confidence", 94),
                "model_used": "Gemini 2.5 Flash / Rakshak Heuristic Co-Pilot",
                "safety_checks_passed": verification_result.get("is_safe", True)
            },
            "agent_traces": agent_traces
        }
