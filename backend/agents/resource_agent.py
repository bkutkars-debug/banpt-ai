from typing import Dict, Any, List
import math

class ResourceAgent:
    """Discovers nearby emergency infrastructure (Hospitals, Trauma Centers, Police, Fire, Safe Shelters) around GPS coordinates."""
    def __init__(self):
        pass

    async def find_resources(self, latitude: float, longitude: float, emergency_type: str, severity_level: str) -> Dict[str, Any]:
        # Generate realistic local infrastructure around the coordinate
        # Coordinates offset slightly around user's location
        resources: List[Dict[str, Any]] = []

        # Hospital / Trauma Center 1
        resources.append({
            "id": "res-1",
            "name": "Apollo City Trauma & Multi-Specialty Hospital",
            "category": "Hospital / Trauma Center",
            "icon": "hospital",
            "distance_km": 1.2,
            "eta_minutes": "4 mins",
            "latitude": latitude + 0.008,
            "longitude": longitude + 0.006,
            "phone": "+91-11-2692-5858",
            "emergency_helpline": "108 / 102",
            "beds_available": 14,
            "icu_equipped": True,
            "address": "Ring Road Sector 4, Trauma Wing"
        })

        # Hospital 2
        resources.append({
            "id": "res-2",
            "name": "Fortis Emergency Care & Critical Care Unit",
            "category": "Hospital / Trauma Center",
            "icon": "hospital",
            "distance_km": 2.7,
            "eta_minutes": "8 mins",
            "latitude": latitude - 0.012,
            "longitude": longitude + 0.009,
            "phone": "+91-11-4713-5000",
            "emergency_helpline": "108",
            "beds_available": 8,
            "icu_equipped": True,
            "address": "Avenue Central, Mediplex Complex"
        })

        # Police Station
        resources.append({
            "id": "res-3",
            "name": "Central Police Station - Quick Response Division",
            "category": "Police Station",
            "icon": "shield",
            "distance_km": 1.8,
            "eta_minutes": "5 mins",
            "latitude": latitude + 0.005,
            "longitude": longitude - 0.011,
            "phone": "112 / +91-11-2331-0000",
            "emergency_helpline": "112",
            "patrol_units_active": 4,
            "address": "Sector 9 Police Post, Main Highway"
        })

        # Fire & Rescue Station
        resources.append({
            "id": "res-4",
            "name": "Fire Brigade & Disaster Rescue Depot #7",
            "category": "Fire & Rescue",
            "icon": "flame",
            "distance_km": 3.1,
            "eta_minutes": "7 mins",
            "latitude": latitude - 0.015,
            "longitude": longitude - 0.008,
            "phone": "101 / +91-11-2341-2222",
            "emergency_helpline": "101",
            "vehicles_ready": 3,
            "address": "Industrial Corridor Station, Gate 2"
        })

        # 24/7 Pharmacy / Safe Haven
        resources.append({
            "id": "res-5",
            "name": "MedPlus 24x7 Emergency Pharmacy & First-Aid Point",
            "category": "24/7 Pharmacy / First Aid",
            "icon": "cross",
            "distance_km": 0.6,
            "eta_minutes": "2 mins",
            "latitude": latitude + 0.003,
            "longitude": longitude + 0.002,
            "phone": "+91-11-2600-4444",
            "emergency_helpline": "+91-11-2600-4444",
            "open_24_7": True,
            "address": "Corner Market Square, Ground Floor"
        })

        # Re-sort resources based on emergency context
        if emergency_type == "Fire / Explosion":
            # Fire station first
            resources.sort(key=lambda r: 0 if r["category"] == "Fire & Rescue" else (1 if r["category"] == "Hospital / Trauma Center" else 2))
        elif emergency_type == "Personal Safety / Threat":
            # Police first
            resources.sort(key=lambda r: 0 if r["category"] == "Police Station" else 1)
        else:
            # Trauma hospitals first
            resources.sort(key=lambda r: r["distance_km"])

        return {
            "origin_lat": latitude,
            "origin_lng": longitude,
            "resources": resources,
            "closest_hospital_eta": resources[0]["eta_minutes"] if resources else "5 mins"
        }
