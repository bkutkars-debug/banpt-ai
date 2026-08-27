export interface MultimodalSources {
  has_text: boolean;
  has_audio: boolean;
  has_image: boolean;
}

export interface ImageAnalysis {
  analyzed: boolean;
  disclaimer: string;
  visual_cues: string[];
  confidence_score: number;
}

export interface SituationData {
  emergency_type: string;
  people_affected: number;
  detected_injuries: string[];
  is_trapped: boolean;
  environmental_hazards: string[];
  raw_input_summary: string;
  location_name: string;
  image_analysis?: ImageAnalysis | null;
  multimodal_sources: MultimodalSources;
}

export interface RiskData {
  severity_score: number;
  severity_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  color_theme: 'green' | 'yellow' | 'amber' | 'red';
  confidence: number;
  urgency_target: string;
  detected_risks: string[];
  reasoning_points: string[];
}

export interface ImmediateAction {
  step: number;
  title: string;
  detail: string;
}

export interface ActionPlanData {
  immediate_actions: ImmediateAction[];
  bystander_steps: string[];
  contraindications: string[];
  priority_level: string;
  estimated_action_time_minutes: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  category: string;
  icon: string;
  distance_km: number;
  eta_minutes: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergency_helpline: string;
  beds_available?: number;
  icu_equipped?: boolean;
  patrol_units_active?: number;
  vehicles_ready?: number;
  open_24_7?: boolean;
  address: string;
}

export interface EmergencyBriefData {
  emergency_type: string;
  priority: string;
  severity_score: number;
  people_affected: number;
  location_display: string;
  situation_summary: string;
  detected_risks: string[];
  recommended_action: string;
  shareable_text: string;
}

export interface SafetyCheck {
  check: string;
  passed: boolean;
  note: string;
}

export interface VerificationData {
  is_safe: boolean;
  safety_checks: SafetyCheck[];
  audit_timestamp: string;
  confidence_rating: string;
}

export interface MetricsData {
  total_duration_ms: number;
  agent_count: number;
  steps_completed: number;
  confidence_score: number;
  model_used: string;
  safety_checks_passed: boolean;
}

export interface AgentTrace {
  agent: string;
  status: string;
  duration_ms: number;
  description: string;
  output_summary: string;
}

export interface TimelineEvent {
  id: string;
  time_display: string;
  event_type: string;
  description: string;
  source: string;
}

export interface IncidentState {
  incident_id: string;
  status: string;
  created_at: string;
  situation: SituationData;
  risk: RiskData;
  action_plan: ActionPlanData;
  resources: EmergencyResource[];
  emergency_brief: EmergencyBriefData;
  verification: VerificationData;
  metrics: MetricsData;
  agent_traces: AgentTrace[];
  timeline: TimelineEvent[];
}

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  sample_text: string;
  location_name: string;
  latitude: number;
  longitude: number;
  sample_image_hint: string;
}