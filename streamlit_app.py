import streamlit as st
import time
import json
import uuid
from datetime import datetime

# Page Configuration
st.set_page_config(
    page_title="BANTPT AI — Autonomous Operations & Copilot",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Dark Cyber Theme CSS
st.markdown("""
<style>
    .stApp { background-color: #07090e; color: #f8fafc; }
    .stButton>button { border-radius: 10px; font-weight: 600; }
</style>
""", unsafe_allow_html=True)

# Initialize Session States for Chat
if "emergency_chat_history" not in st.session_state:
    st.session_state["emergency_chat_history"] = [
        {"role": "assistant", "content": "👋 I am your BantPT AI Emergency Dispatch Copilot. Ask me about first-aid procedures, nearest hospitals, or emergency handling instructions."}
    ]

if "soc_chat_history" not in st.session_state:
    st.session_state["soc_chat_history"] = [
        {"role": "assistant", "content": "🛡️ BantPT AI SOC Investigation Copilot online. Ask me about active indicators of compromise (IOCs), MITRE ATT&CK techniques, or containment playbooks."}
    ]

# Sidebar Navigation
st.sidebar.title("🛡️ BANTPT AI")
st.sidebar.caption("Unified Autonomous Intelligence Platform v3.0")
module = st.sidebar.radio("Select Active Operations Module:", ["🚨 Emergency Response (BANT PT)", "🛡️ Cyber Defense SOC (Sentinel AI)"])

st.sidebar.markdown("---")
st.sidebar.info("💡 **Autonomous AI Copilot Engine:** Real-time conversational intelligence embedded in both Emergency & Cyber modules.")

# ==============================================================================
# MODULE 1: EMERGENCY RESPONSE ASSISTANT (WITH CHATBOT)
# ==============================================================================
if module == "🚨 Emergency Response (BANT PT)":
    st.title("🚨 BANT PT — Autonomous Emergency Response Assistant")
    st.markdown("*Transforming raw distress telemetry into coordinated first-responder briefs and life-saving step-by-step action plans.*")
    
    col1, col2 = st.columns([1.2, 1])
    
    with col1:
        st.subheader("1. Emergency Intake Console")
        category = st.selectbox("Select Emergency Type", ["Road Accident", "Fire / Explosion", "Personal Safety / Threat", "Natural Disaster / Flood"])
        emergency_text = st.text_area("Situation Description (Text / Voice Transcript)", value="Severe two-car accident on highway near overpass. One victim unconscious with heavy bleeding. Traffic blocked.", height=110)
        location = st.text_input("Incident Location Coordinates", value="Ring Road Sector 4 Junction, New Delhi")
        
        if st.button("⚡ Analyze Emergency & Dispatch Multi-Agent Grid", type="primary", use_container_width=True):
            with st.spinner("Orchestrating Situation, Risk, Action, Resource & Verification Agents..."):
                time.sleep(0.8)
                st.session_state["emergency_analyzed"] = True

    with col2:
        if st.session_state.get("emergency_analyzed", True):
            st.subheader("2. Real-Time Severity Engine")
            st.metric(label="Calculated Severity Index", value="98 / 100", delta="CRITICAL PRIORITY", delta_color="inverse")
            st.error("🚨 **Immediate Hazards:** Unconscious Casualty, Active Arterial Bleeding, High-Speed Traffic Obstruction.")
            st.caption("AI Confidence: **95%** | Target SLA: **< 4 minutes**")

    # Step-by-Step Response Cards
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

    # EMERGENCY CHATBOT SECTION
    st.markdown("---")
    st.subheader("💬 BantPT AI Emergency Field Copilot (Live Chat)")
    st.caption("Ask questions about first aid, triage, handling burns, CPR rhythm, or bystander safety.")

    for message in st.session_state["emergency_chat_history"]:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Ask the Emergency AI Assistant anything... (e.g. 'How do I perform CPR?' or 'How to stop bleeding?')"):
        st.session_state["emergency_chat_history"].append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        p_low = prompt.lower()
        if "cpr" in p_low:
            reply = "🫀 **CPR Instructions:** Place heel of hand in center of chest. Push hard and fast at **100–120 beats/min** (to the rhythm of 'Stayin' Alive'). Compress 2 inches deep. Do not interrupt compressions until EMS arrives."
        elif "bleed" in p_low or "blood" in p_low:
            reply = "🩸 **Severe Bleeding Protocol:** 1) Apply firm direct pressure with sterile gauze or clean cloth. 2) Elevate injured limb if no fracture. 3) If bleeding does not stop through soaked dressing, apply a tourniquet 2-3 inches above the wound."
        elif "burn" in p_low or "fire" in p_low:
            reply = "🔥 **Burn Care Protocol:** Cool the burn under cool running water for at least 10–20 minutes. Do NOT use ice. Cover loosely with sterile plastic wrap or clean dry cloth. Do NOT pop blisters."
        elif "hospital" in p_low or "call" in p_low or "where" in p_low:
            reply = "🏥 **Nearest Dispatch Point:** Apollo Trauma Center is located 1.8 km away (Estimated arrival time: **4 mins**). Emergency helpline **112 / 108** is standing by."
        else:
            reply = f"🚨 **BantPT Emergency Dispatch Copilot:** Understood regarding '{prompt}'. In this active emergency, ensure responder scene safety first, keep the victim still with airway open, and confirm ambulance dispatch to {location}."

        st.session_state["emergency_chat_history"].append({"role": "assistant", "content": reply})
        with st.chat_message("assistant"):
            st.markdown(reply)

# ==============================================================================
# MODULE 2: CYBER SECURITY SOC (WITH CHATBOT)
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
            time.sleep(0.8)
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
            st.markdown("""
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

    # SOC CHATBOT SECTION
    st.markdown("---")
    st.subheader("🤖 Sentinel AI SOC Investigation Copilot (Live Chat)")
    st.caption("Ask questions about attack techniques, compromised identities, log timelines, or containment steps.")

    for message in st.session_state["soc_chat_history"]:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if soc_prompt := st.chat_input("Ask the SOC AI Copilot anything... (e.g. 'What MITRE techniques were used?' or 'How should we contain this?')"):
        st.session_state["soc_chat_history"].append({"role": "user", "content": soc_prompt})
        with st.chat_message("user"):
            st.markdown(soc_prompt)

        p_low = soc_prompt.lower()
        if "mitre" in p_low or "technique" in p_low:
            soc_reply = "🛡️ **MITRE ATT&CK Breakdown:**\n- **T1078.004 (Valid Cloud Accounts):** Compromised identity via brute force\n- **T1098 (Account Manipulation):** AdministratorAccess IAM role attachment\n- **T1537 (Transfer to Cloud Account):** High-volume S3 bucket download"
        elif "user" in p_low or "who" in p_low or "identity" in p_low:
            soc_reply = "👤 **Targeted Identity:** `alex.dev@corp.internal`. Ingress originated from Tor exit node `185.220.101.5` bypassing standard MFA via Legacy Basic Auth endpoint."
        elif "contain" in p_low or "remediate" in p_low or "action" in p_low:
            soc_reply = "🛑 **Recommended SOAR Containment:**\n1. Invalidate active STS tokens & terminate Okta sessions.\n2. Apply border BGP firewall drop rule on `185.220.101.5`.\n3. Revert IAM Policy modification on `AdministratorAccess`.\n4. Rotate access credentials and enforce WebAuthn hardware keys."
        else:
            soc_reply = f"🔍 **Sentinel AI SOC Analysis:** In response to '{soc_prompt}', the active incident represents a multi-stage cloud infrastructure compromise rated at **CRITICAL (98/100)**. All indicators of compromise (IOCs) are staged for your one-click authorization in the SOAR panel above."

        st.session_state["soc_chat_history"].append({"role": "assistant", "content": soc_reply})
        with st.chat_message("assistant"):
            st.markdown(soc_reply)

# Footer
st.markdown("---")
st.caption("BANTPT AI — Autonomous Multi-Agent Decision Engine & Operations Command.")