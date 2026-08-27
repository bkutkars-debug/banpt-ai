import streamlit as st
import time
import json
import uuid
from datetime import datetime

# Page Configuration
st.set_page_config(
    page_title="BANTPT AI — Autonomous Operations Center",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Dark Theme CSS
st.markdown("""
<style>
    .main { background-color: #07090e; color: #f8fafc; }
    .stButton>button { border-radius: 10px; font-weight: 600; }
    .metric-card { background: rgba(15, 23, 42, 0.7); padding: 18px; border-radius: 12px; border: 1px solid #1e293b; }
</style>
""", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.title("🛡️ BANTPT AI")
st.sidebar.caption("Unified Autonomous Intelligence Platform v3.0")
module = st.sidebar.radio("Select Active Operations Module:", ["🚨 Emergency Response (BANT PT)", "🛡️ Cyber Defense SOC (Sentinel AI)"])

st.sidebar.markdown("---")
st.sidebar.info("💡 **Autonomous Engine:** Multi-Agent Pipeline with 6 specialized decision agents running concurrently.")

# ==============================================================================
# MODULE 1: EMERGENCY RESPONSE ASSISTANT
# ==============================================================================
if module == "🚨 Emergency Response (BANT PT)":
    st.title("🚨 BANT PT — Autonomous Emergency Response Assistant")
    st.markdown("*Transforming raw distress telemetry into coordinated first-responder briefs and life-saving step-by-step action plans.*")
    
    col1, col2 = st.columns([1.2, 1])
    
    with col1:
        st.subheader("1. Emergency Intake Console")
        category = st.selectbox("Select Emergency Type", ["Road Accident", "Fire / Explosion", "Personal Safety / Threat", "Natural Disaster / Flood"])
        emergency_text = st.text_area("Situation Description (Text / Voice Transcript)", value="Severe two-car accident on highway near overpass. One victim unconscious with heavy bleeding. Traffic blocked.", height=120)
        location = st.text_input("Incident Location Coordinates", value="Ring Road Sector 4 Junction, New Delhi")
        
        if st.button("⚡ Analyze Emergency & Dispatch Multi-Agent Grid", type="primary", use_container_width=True):
            with st.spinner("Orchestrating Situation, Risk, Action, Resource & Verification Agents..."):
                time.sleep(1.2)
                st.session_state["emergency_analyzed"] = True

    with col2:
        if st.session_state.get("emergency_analyzed"):
            st.subheader("2. Real-Time Severity Engine")
            st.metric(label="Calculated Severity Index", value="98 / 100", delta="CRITICAL PRIORITY", delta_color="inverse")
            st.error("🚨 **Immediate Hazards:** Unconscious Casualty, Active Arterial Bleeding, High-Speed Traffic Obstruction.")
            st.caption("AI Confidence: **95%** | Target SLA: **< 4 minutes**")

    if st.session_state.get("emergency_analyzed"):
        st.markdown("---")
        st.subheader("3. Step-by-Step Response Protocol & Responder Brief")
        
        c1, c2, c3 = st.columns(3)
        with c1:
            st.markdown("### ⚡ Step-by-Step Actions")
            st.info("**Step 1: Secure Scene & Divert Traffic**\nPosition hazard triangles 50m upstream.")
            st.info("**Step 2: Airway & Direct Pressure**\nApply firm, direct pressure on bleeding site with clean cloth. Do NOT remove helmet if spinal injury is suspected.")
            st.info("**Step 3: Call 112 Dispatch**\nProvide exact coordinates and casualty counts.")
            
        with c2:
            st.markdown("### 📋 Official Dispatch Brief")
            st.code("""[BANTPT EMERGENCY SOS BRIEF]
INCIDENT ID: INC-2026-89A12F
TYPE: Road Accident (Critical Trauma)
LOCATION: Ring Road Sector 4 Junction, New Delhi
CASUALTIES: 2 (1 Unconscious, 1 Severe Bleed)
PRIMARY DISPATCH: Direct Trauma Unit & Traffic Control""", language="yaml")
            
        with c3:
            st.markdown("### 🏥 Nearest Verified Resources")
            st.success("🏥 **Apollo Trauma Center** — 1.8 km (4 min ETA)\n*ICU Equipped, 6 Beds Free*")
            st.warning("🚓 **Police Patrol Unit 04** — 0.9 km (2 min ETA)")
            st.error("🚒 **Fire Rescue Station 11** — 3.1 km (7 min ETA)")

# ==============================================================================
# MODULE 2: CYBER SECURITY SOC (SENTINEL AI)
# ==============================================================================
else:
    st.title("🛡️ SENTINEL AI — Security Operations Center (SOC)")
    st.markdown("*Autonomous multi-agent threat correlation, MITRE ATT&CK mapping, and human-in-the-loop remediation.*")
    
    st.subheader("1. Select Synthetic Attack Scenario")
    sc_choice = st.selectbox("1-Click Safe Benchmark Scenarios", [
        "Credential Stuffing & AWS IAM Privilege Escalation",
        "Phishing Ingress to Ransomware Precursor Activity",
        "Impossible Geographic Travel / Session Hijack",
        "Insider Database Mass Extraction Anomaly"
    ])
    
    if st.button("🚀 Inject Synthetic Cyber Telemetry & Correlate", type="primary"):
        with st.spinner("Correlating CloudTrail, Okta, and EDR streams..."):
            time.sleep(1.0)
            st.session_state["soc_analyzed"] = True
            
    if st.session_state.get("soc_analyzed", True):
        st.markdown("---")
        c1, c2, c3 = st.columns([1, 1, 1.2])
        
        with c1:
            st.subheader("Threat Severity")
            st.metric(label="Risk Score", value="98 / 100", delta="CRITICAL THREAT", delta_color="inverse")
            st.warning("⚠️ **Targeted Identity:** alex.dev@corp.internal\n**Source IP:** 185.220.101.5 (Tor Exit Node)")
            st.caption("Explanation Agent: Adversary achieved brute force bypass on legacy basic auth and attached AdministratorAccess IAM policy.")
            
        with c2:
            st.subheader("MITRE ATT&CK Mapping")
            st.badge = st.markdown("""
            - **TA0001:** Initial Access (`T1078.004`)
            - **TA0006:** Credential Access (`T1110.001`)
            - **TA0004:** Privilege Escalation (`T1098`)
            - **TA0010:** Exfiltration (`T1537`)
            """)
            st.code("Chronology:\n1. 3x Auth Fails\n2. Tor Ingress Success\n3. AttachUserPolicy -> Admin\n4. S3 Parquet Bulk Read", language="text")

        with c3:
            st.subheader("Human Approval SOAR Actions")
            if st.button("🔒 Authorize: Revoke Okta/STS Session Tokens", use_container_width=True):
                st.success("✅ Okta session terminated & STS tokens invalidated for alex.dev.")
            if st.button("🚫 Authorize: Push Firewall Drop Rule for 185.220.101.5", use_container_width=True):
                st.success("✅ Ingress ACL updated across Cloudflare & AWS Security Groups.")
            if st.button("🛑 Authorize: Isolate Bastion Host", use_container_width=True):
                st.success("✅ Host network-quarantined via EDR integration.")

# Footer
st.markdown("---")
st.caption("BANTPT AI — Autonomous Multi-Agent Decision Engine & Operations Command.")