import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'greengrid.settings')
django.setup()

from apps.supplier.models import SupplierProfile
from apps.dcbuilder.models import DCProfile
from apps.matches.models import Match

# ══════════════════════════════════════════════════════════════════════════════
# 1. EXPANDED RENEWABLE ENERGY SOURCES & SITES (FROM DOCUMENTATION)
# ══════════════════════════════════════════════════════════════════════════════
RENEWABLE_SOURCES = [
    {
        "name": "Adani Green Energy (AGEL) - Khavda Mega RE Park",
        "category": "ipp",
        "capacity_mw": 30000.0,
        "available_capacity_mw": 4500.0,
        "energy_types": ["Solar", "Wind", "Hybrid"],
        "sourcing_models": ["Physical PPA", "vPPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Gujarat", "Rajasthan", "Maharashtra", "Pan-India"],
        "min_contract_years": 10,
        "price_per_unit_inr": {"min": 3.75, "max": 4.85},
        "rtc_availability_pct": 88,
        "website": "https://www.adanigreenenergy.com",
        "latitude": 23.8500,
        "longitude": 69.7500,
        "is_verified": True,
        "description": "World's largest renewable energy installation in Khavda, Rann of Kutch (Gujarat). High-density solar and wind supplying hyperscale AI campuses."
    },
    {
        "name": "Tata Power Renewable Energy (TPREL) - Pavagada Solar Complex",
        "category": "ipp",
        "capacity_mw": 11600.0,
        "available_capacity_mw": 2100.0,
        "energy_types": ["FDRE", "Hybrid", "Solar", "Wind"],
        "sourcing_models": ["Physical PPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Karnataka", "Maharashtra", "Tamil Nadu", "Rajasthan"],
        "min_contract_years": 10,
        "price_per_unit_inr": {"min": 4.10, "max": 5.20},
        "rtc_availability_pct": 82,
        "website": "https://www.tatapowerrenewables.com",
        "latitude": 14.2810,
        "longitude": 77.2917,
        "is_verified": True,
        "description": "Major operations across Pavagada Solar Park (Karnataka) and hybrid FDRE plants in Tamil Nadu & Rajasthan dedicated to colocation & enterprise power."
    },
    {
        "name": "ReNew (ReNew Power) - Jaisalmer Wind-Solar RTC Hybrid",
        "category": "ipp",
        "capacity_mw": 13400.0,
        "available_capacity_mw": 2600.0,
        "energy_types": ["Wind", "Solar", "BESS"],
        "sourcing_models": ["Physical PPA", "vPPA", "RTC/FDRE"],
        "states_covered": ["Rajasthan", "Karnataka", "Andhra Pradesh", "Maharashtra"],
        "min_contract_years": 8,
        "price_per_unit_inr": {"min": 4.15, "max": 5.05},
        "rtc_availability_pct": 84,
        "website": "https://www.renew.com",
        "latitude": 26.9157,
        "longitude": 70.9083,
        "is_verified": True,
        "description": "Custom wind-solar-BESS hybrid balancing evening solar drops to guarantee round-the-clock power for critical hyperscale servers."
    },
    {
        "name": "Avaada Energy - Bikaner Solar & Storage Grid",
        "category": "ipp",
        "capacity_mw": 7200.0,
        "available_capacity_mw": 1500.0,
        "energy_types": ["Solar", "BESS", "Hybrid"],
        "sourcing_models": ["Physical PPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Rajasthan", "Maharashtra", "Gujarat", "Karnataka"],
        "min_contract_years": 12,
        "price_per_unit_inr": {"min": 3.95, "max": 4.90},
        "rtc_availability_pct": 76,
        "website": "https://www.avaada.com",
        "latitude": 28.0176,
        "longitude": 73.3119,
        "is_verified": True,
        "description": "Integrated clean operator offering up to 76% time-matched green power backed by utility-scale BESS for AI-ready data center facilities."
    },
    {
        "name": "Greenko Group - Pinnapuram Integrated Renewable Energy Project (IREP)",
        "category": "ipp",
        "capacity_mw": 7500.0,
        "available_capacity_mw": 1800.0,
        "energy_types": ["Pumped Hydro", "Solar", "Wind"],
        "sourcing_models": ["Physical PPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Andhra Pradesh", "Telangana", "Karnataka"],
        "min_contract_years": 15,
        "price_per_unit_inr": {"min": 4.35, "max": 5.35},
        "rtc_availability_pct": 92,
        "website": "https://www.greenkogroup.com",
        "latitude": 15.6820,
        "longitude": 78.2710,
        "is_verified": True,
        "description": "Pioneering Pinnapuram Pumped Hydro Storage (1,200 MW hydro + 2,000 MW solar + 400 MW wind) delivering 24/7 baseload renewable power."
    },
    {
        "name": "JSW Neo Energy - Ballari Clean Power Hub",
        "category": "ipp",
        "capacity_mw": 7600.0,
        "available_capacity_mw": 1200.0,
        "energy_types": ["Wind", "Solar", "Hydro"],
        "sourcing_models": ["Physical PPA", "Open Access"],
        "states_covered": ["Karnataka", "Maharashtra", "Tamil Nadu"],
        "min_contract_years": 10,
        "price_per_unit_inr": {"min": 4.10, "max": 5.00},
        "rtc_availability_pct": 78,
        "website": "https://www.jsw.in/energy",
        "latitude": 15.1394,
        "longitude": 76.9214,
        "is_verified": True,
        "description": "Scaling 13 GW locked-in portfolio with high-speed wind generation and captive power transmission to data center corridors."
    },
    {
        "name": "NTPC Green Energy (NGEL) - Khavda Solar Phase",
        "category": "ipp",
        "capacity_mw": 10000.0,
        "available_capacity_mw": 2500.0,
        "energy_types": ["Solar", "Wind", "Green Hydrogen"],
        "sourcing_models": ["Physical PPA", "Green Tariff", "RTC/FDRE"],
        "states_covered": ["Gujarat", "Rajasthan", "Andhra Pradesh", "Pan-India"],
        "min_contract_years": 15,
        "price_per_unit_inr": {"min": 3.85, "max": 4.80},
        "rtc_availability_pct": 80,
        "website": "https://www.ntpc.co.in",
        "latitude": 23.7500,
        "longitude": 70.1200,
        "is_verified": True,
        "description": "State-owned clean energy giant targeting 60 GW by 2032 with massive generation parks in Gujarat and Rajasthan."
    },
    {
        "name": "CleanMax - Babra Wind-Solar Hybrid Park",
        "category": "ci",
        "capacity_mw": 2000.0,
        "available_capacity_mw": 450.0,
        "energy_types": ["Solar", "Wind", "Hybrid"],
        "sourcing_models": ["Open Access", "Physical PPA", "Group Captive"],
        "states_covered": ["Gujarat", "Maharashtra", "Karnataka", "Tamil Nadu"],
        "min_contract_years": 5,
        "price_per_unit_inr": {"min": 4.45, "max": 5.40},
        "rtc_availability_pct": 70,
        "website": "https://www.cleanmax.com",
        "latitude": 21.8480,
        "longitude": 71.3050,
        "is_verified": True,
        "description": "Corporate C&I leader powering Equinix Mumbai (33 MW hybrid) and Web Werks with dedicated group captive renewable arrays."
    },
    {
        "name": "Sunsure Energy - Bundelkhand Renewable Corridor",
        "category": "ci",
        "capacity_mw": 1500.0,
        "available_capacity_mw": 350.0,
        "energy_types": ["Solar", "Wind"],
        "sourcing_models": ["Open Access", "Group Captive"],
        "states_covered": ["Uttar Pradesh", "Haryana", "Maharashtra", "Tamil Nadu"],
        "min_contract_years": 5,
        "price_per_unit_inr": {"min": 4.55, "max": 5.50},
        "rtc_availability_pct": 68,
        "website": "https://www.sunsure-energy.com",
        "latitude": 25.4484,
        "longitude": 78.5685,
        "is_verified": True,
        "description": "Industrial decarbonisation partner backed by Partners Group delivering corporate solar & wind open-access PPAs."
    },
    {
        "name": "Hero Future Energies - Bhadla Solar Generation Hub",
        "category": "ci",
        "capacity_mw": 1600.0,
        "available_capacity_mw": 300.0,
        "energy_types": ["Solar", "Wind", "BESS"],
        "sourcing_models": ["Physical PPA", "Open Access"],
        "states_covered": ["Rajasthan", "Gujarat", "Andhra Pradesh", "Karnataka"],
        "min_contract_years": 8,
        "price_per_unit_inr": {"min": 4.35, "max": 5.25},
        "rtc_availability_pct": 65,
        "website": "https://www.herofutureenergies.com",
        "latitude": 27.5397,
        "longitude": 71.9161,
        "is_verified": True,
        "description": "Backed by KKR, providing peak-time power supply and load-following corporate energy tariffs from Bhadla, Rajasthan."
    },
    {
        "name": "Fourth Partner Energy - Hyderabad Renewable Campus",
        "category": "ci",
        "capacity_mw": 1400.0,
        "available_capacity_mw": 280.0,
        "energy_types": ["Solar", "Wind", "BESS"],
        "sourcing_models": ["Open Access", "Group Captive"],
        "states_covered": ["Telangana", "Andhra Pradesh", "Maharashtra", "Tamil Nadu"],
        "min_contract_years": 7,
        "price_per_unit_inr": {"min": 4.50, "max": 5.35},
        "rtc_availability_pct": 67,
        "website": "https://www.fourthpartner.co",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "is_verified": True,
        "description": "Backed by British International Investment, building onsite and offsite corporate open-access solar and wind-storage systems."
    },
    {
        "name": "Suzlon Group - Muppandal Wind Energy Complex",
        "category": "epc",
        "capacity_mw": 20000.0,
        "available_capacity_mw": 500.0,
        "energy_types": ["Wind", "Hybrid"],
        "sourcing_models": ["Behind-the-Meter", "Physical PPA"],
        "states_covered": ["Tamil Nadu", "Gujarat", "Maharashtra", "Rajasthan"],
        "min_contract_years": 5,
        "price_per_unit_inr": {"min": 3.90, "max": 4.90},
        "rtc_availability_pct": 75,
        "website": "https://www.suzlon.com",
        "latitude": 8.2612,
        "longitude": 77.5458,
        "is_verified": True,
        "description": "India's highest density wind park in Muppandal (Tamil Nadu) executing end-to-end turbine integration for heavy consumers."
    },
    {
        "name": "Sterling and Wilson Renewable Energy - Kurnool Ultra Solar Park",
        "category": "epc",
        "capacity_mw": 15000.0,
        "available_capacity_mw": 400.0,
        "energy_types": ["Solar", "BESS"],
        "sourcing_models": ["Behind-the-Meter", "Physical PPA"],
        "states_covered": ["Andhra Pradesh", "Pan-India"],
        "min_contract_years": 3,
        "price_per_unit_inr": {"min": 3.70, "max": 4.80},
        "rtc_availability_pct": 72,
        "website": "https://www.sterlingandwilsonre.com",
        "latitude": 15.6820,
        "longitude": 78.2710,
        "is_verified": True,
        "description": "Turnkey engineering EPC contractor for Kurnool Solar Park (Andhra Pradesh) with high-capacity BESS battery arrays."
    }
]

# ══════════════════════════════════════════════════════════════════════════════
# 2. ALREADY INSTALLED & OPERATIONAL DATA CENTERS IN INDIA (FROM DOCUMENTATION)
# ══════════════════════════════════════════════════════════════════════════════
INSTALLED_DATA_CENTERS = [
    {
        "project_name": "Sify Technologies DGX-Ready AI Campus",
        "preferred_city": "Mumbai",
        "preferred_state": "Maharashtra",
        "latitude": 19.1136,
        "longitude": 72.8697,
        "tier": "tier4",
        "it_load_mw": 85.0,
        "server_types": ["HPC/AI", "NVIDIA DGX-Ready", "Hyperscale Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.25,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 1200, "max": 2500},
        "launch_timeline": "Operational (309.6 MWp RE Contracted)"
    },
    {
        "project_name": "AdaniConneX Hyperscale Campus (1 GW Pipeline)",
        "preferred_city": "Visakhapatnam",
        "preferred_state": "Andhra Pradesh",
        "latitude": 17.6868,
        "longitude": 83.2185,
        "tier": "tier4",
        "it_load_mw": 200.0,
        "server_types": ["HPC/AI", "Hyperscale Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.22,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 5000, "max": 12000},
        "launch_timeline": "Operational / Scaling"
    },
    {
        "project_name": "AdaniConneX Noida Hyperscale Data Center",
        "preferred_city": "Noida",
        "preferred_state": "Uttar Pradesh",
        "latitude": 28.5355,
        "longitude": 77.3910,
        "tier": "tier4",
        "it_load_mw": 100.0,
        "server_types": ["Standard Cloud", "HPC/AI"],
        "cooling_type": "hybrid",
        "target_pue": 1.28,
        "green_goal_pct": 90,
        "sourcing_models": ["Physical PPA", "Open Access"],
        "budget_inr_cr": {"min": 2000, "max": 4500},
        "launch_timeline": "Operational"
    },
    {
        "project_name": "Equinix MB1 & MB2 International Business Exchange",
        "preferred_city": "Mumbai (Chandivali & Navi Mumbai)",
        "preferred_state": "Maharashtra",
        "latitude": 19.1075,
        "longitude": 72.8943,
        "tier": "tier4",
        "it_load_mw": 45.0,
        "server_types": ["HPC/AI", "Interconnection", "Enterprise Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.30,
        "green_goal_pct": 100,
        "sourcing_models": ["Group Captive", "Physical PPA"],
        "budget_inr_cr": {"min": 850, "max": 1800},
        "launch_timeline": "Operational (33 MW CleanMax PPA Active)"
    },
    {
        "project_name": "Web Werks & Iron Mountain JV Hyperscale Facility",
        "preferred_city": "Navi Mumbai (Rabale)",
        "preferred_state": "Maharashtra",
        "latitude": 19.1554,
        "longitude": 73.0033,
        "tier": "tier3",
        "it_load_mw": 32.0,
        "server_types": ["Standard Cloud", "Edge"],
        "cooling_type": "hybrid",
        "target_pue": 1.35,
        "green_goal_pct": 100,
        "sourcing_models": ["Open Access", "Group Captive"],
        "budget_inr_cr": {"min": 600, "max": 1200},
        "launch_timeline": "Operational (32M kWh CleanMax PPA)"
    },
    {
        "project_name": "Digital Edge BOM 350 MW AI-Ready Campus",
        "preferred_city": "Navi Mumbai",
        "preferred_state": "Maharashtra",
        "latitude": 19.0330,
        "longitude": 73.0297,
        "tier": "tier4",
        "it_load_mw": 120.0,
        "server_types": ["HPC/AI", "Hyperscale Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.20,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 3500, "max": 7500},
        "launch_timeline": "Operational (83 MW Solar PPA + Greywater Cooling)"
    },
    {
        "project_name": "Nxtra by Airtel Hyper-Density Data Center",
        "preferred_city": "Chennai",
        "preferred_state": "Tamil Nadu",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "tier": "tier4",
        "it_load_mw": 50.0,
        "server_types": ["Standard Cloud", "Enterprise Colocation"],
        "cooling_type": "air",
        "target_pue": 1.38,
        "green_goal_pct": 85,
        "sourcing_models": ["Open Access", "Physical PPA"],
        "budget_inr_cr": {"min": 900, "max": 2000},
        "launch_timeline": "Operational"
    },
    {
        "project_name": "Nxtra by Airtel Eastern Hyperscale Hub",
        "preferred_city": "Kolkata (Rajarhat)",
        "preferred_state": "West Bengal",
        "latitude": 22.5850,
        "longitude": 88.4735,
        "tier": "tier3",
        "it_load_mw": 25.0,
        "server_types": ["Standard Cloud", "Edge"],
        "cooling_type": "hybrid",
        "target_pue": 1.40,
        "green_goal_pct": 75,
        "sourcing_models": ["Green Tariff", "Open Access"],
        "budget_inr_cr": {"min": 450, "max": 1000},
        "launch_timeline": "Operational"
    },
    {
        "project_name": "Google India AI & Hyperscale Infrastructure Campus",
        "preferred_city": "Bengaluru",
        "preferred_state": "Karnataka",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "tier": "tier4",
        "it_load_mw": 110.0,
        "server_types": ["HPC/AI", "TPU Clusters", "Hyperscale Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.18,
        "green_goal_pct": 100,
        "sourcing_models": ["vPPA", "Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 4000, "max": 9000},
        "launch_timeline": "Operational (Adani Green Localized RE PPA)"
    },
    {
        "project_name": "Amazon Web Services (AWS) Asia Pacific Hyperscale Cluster",
        "preferred_city": "Hyderabad",
        "preferred_state": "Telangana",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "tier": "tier4",
        "it_load_mw": 150.0,
        "server_types": ["Hyperscale Cloud", "AWS Graviton/Trainium AI"],
        "cooling_type": "liquid",
        "target_pue": 1.20,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 6000, "max": 15000},
        "launch_timeline": "Operational (Backed by 53 RE Projects Nationwide)"
    },
    {
        "project_name": "Yotta Infrastructure D1 Hyperscale Park",
        "preferred_city": "Greater Noida",
        "preferred_state": "Uttar Pradesh",
        "latitude": 28.4744,
        "longitude": 77.5040,
        "tier": "tier4",
        "it_load_mw": 80.0,
        "server_types": ["HPC/AI", "NVIDIA H100 GPU Clusters", "Enterprise"],
        "cooling_type": "liquid",
        "target_pue": 1.28,
        "green_goal_pct": 80,
        "sourcing_models": ["Open Access", "Physical PPA"],
        "budget_inr_cr": {"min": 1500, "max": 3500},
        "launch_timeline": "Operational"
    },
    {
        "project_name": "CtrlS Green Datacenters Cloud Campus",
        "preferred_city": "Pune",
        "preferred_state": "Maharashtra",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "tier": "tier4",
        "it_load_mw": 40.0,
        "server_types": ["Standard Cloud", "Disaster Recovery"],
        "cooling_type": "hybrid",
        "target_pue": 1.32,
        "green_goal_pct": 100,
        "sourcing_models": ["Solar Captive", "Open Access"],
        "budget_inr_cr": {"min": 750, "max": 1600},
        "launch_timeline": "Operational"
    }
]

# ══════════════════════════════════════════════════════════════════════════════
# 3. SEEDING LOGIC
# ══════════════════════════════════════════════════════════════════════════════
def seed_all():
    print("[1/3] Seeding Verified Renewable Energy Sources & Locations...")
    sup_count = 0
    for data in RENEWABLE_SOURCES:
        obj, created = SupplierProfile.objects.update_or_create(
            name=data["name"],
            defaults={
                "category": data.get("category", "ipp"),
                "capacity_mw": data.get("capacity_mw", 1000.0),
                "available_capacity_mw": data.get("available_capacity_mw", 300.0),
                "energy_types": data.get("energy_types", ["Solar"]),
                "sourcing_models": data.get("sourcing_models", ["Physical PPA"]),
                "states_covered": data.get("states_covered", []),
                "min_contract_years": data.get("min_contract_years", 10),
                "price_per_unit_inr": data.get("price_per_unit_inr", {"min": 4.0, "max": 5.0}),
                "rtc_availability_pct": data.get("rtc_availability_pct", 75),
                "website": data.get("website", ""),
                "latitude": data.get("latitude", 19.0760),
                "longitude": data.get("longitude", 72.8777),
                "is_verified": data.get("is_verified", True),
                "description": data.get("description", ""),
            }
        )
        sup_count += 1

    print(f"      Total Energy Sources in DB: {SupplierProfile.objects.count()}")

    print("[2/3] Seeding Installed Data Center Facilities in India...")
    dc_count = 0
    dc_objs = []
    for dc_data in INSTALLED_DATA_CENTERS:
        dc_obj, created = DCProfile.objects.update_or_create(
            project_name=dc_data["project_name"],
            defaults={
                "preferred_city": dc_data["preferred_city"],
                "preferred_state": dc_data["preferred_state"],
                "latitude": dc_data["latitude"],
                "longitude": dc_data["longitude"],
                "tier": dc_data["tier"],
                "it_load_mw": dc_data["it_load_mw"],
                "server_types": dc_data["server_types"],
                "cooling_type": dc_data["cooling_type"],
                "target_pue": dc_data["target_pue"],
                "green_goal_pct": dc_data["green_goal_pct"],
                "sourcing_models": dc_data["sourcing_models"],
                "budget_inr_cr": dc_data["budget_inr_cr"],
                "launch_timeline": dc_data["launch_timeline"]
            }
        )
        dc_objs.append(dc_obj)
        dc_count += 1

    print(f"      Total Data Centers in DB: {DCProfile.objects.count()}")

    print("[3/3] Establishing Verified PPA & Matching Routes...")
    # Clean existing seed matches
    Match.objects.all().delete()
    
    # Establish document-verified active contracts:
    match_pairs = [
        # Equinix Mumbai <-> CleanMax (33 MW Captive PPA)
        ("Equinix MB1 & MB2 International Business Exchange", "CleanMax - Babra Wind-Solar Hybrid Park", 96.5, "Active 33 MW corporate captive PPA powering Chandivali & Navi Mumbai campuses"),
        # Web Werks <-> CleanMax (32 million kWh)
        ("Web Werks & Iron Mountain JV Hyperscale Facility", "CleanMax - Babra Wind-Solar Hybrid Park", 94.0, "Active corporate PPA supplying 32 million kWh solar-wind energy"),
        # Google Bengaluru <-> Adani Green Energy (Localized PPA)
        ("Google India AI & Hyperscale Infrastructure Campus", "Adani Green Energy (AGEL) - Khavda Mega RE Park", 97.2, "Corporate partnership supplying localized solar & wind with 51%+ time-matching"),
        # Digital Edge BOM <-> Avaada Energy (83 MW Solar PPA)
        ("Digital Edge BOM 350 MW AI-Ready Campus", "Avaada Energy - Bikaner Solar & Storage Grid", 95.8, "Structured 83 MW utility solar PPA backed by BESS storage"),
        # Sify Technologies <-> ReNew Power (309.6 MWp RE)
        ("Sify Technologies DGX-Ready AI Campus", "ReNew (ReNew Power) - Jaisalmer Wind-Solar RTC Hybrid", 95.0, "Contracted 309.6 MWp renewable energy reducing facility footprint by 50%"),
        # AWS Hyderabad <-> Greenko Group (Pinnapuram Pumped Hydro)
        ("Amazon Web Services (AWS) Asia Pacific Hyperscale Cluster", "Greenko Group - Pinnapuram Integrated Renewable Energy Project (IREP)", 98.0, "24/7 firm dispatchable RTC clean power backed by 1,200 MW pumped hydro storage"),
        # AdaniConneX Vizag <-> Adani Green Khavda
        ("AdaniConneX Hyperscale Campus (1 GW Pipeline)", "Adani Green Energy (AGEL) - Khavda Mega RE Park", 99.0, "Direct internal JV gigawatt-scale clean energy pipeline supplying Vizag AI hub"),
        # Nxtra Chennai <-> Suzlon Muppandal Wind
        ("Nxtra by Airtel Hyper-Density Data Center", "Suzlon Group - Muppandal Wind Energy Complex", 91.5, "Off-site open-access wheeling PPA from Tamil Nadu wind energy corridor"),
    ]

    for dc_name, sup_name, score, reason in match_pairs:
        try:
            dc = DCProfile.objects.get(project_name=dc_name)
            sup = SupplierProfile.objects.get(name=sup_name)
            Match.objects.create(
                dc_profile=dc,
                supplier_profile=sup,
                match_score=score,
                status="accepted",
                notes=reason,
                ai_analysis={
                    "match_score": score,
                    "match_reasons": [reason, "High geographic feasibility & transmission margin"],
                    "recommended_sourcing_model": "Physical PPA / Open Access",
                    "carbon_offset_tons_per_year": round(dc.it_load_mw * 8760 * 0.82)
                }
            )
        except Exception as e:
            print(f"   Warning for match {dc_name} <-> {sup_name}: {e}")

    print(f"   Done. Total Active Match Routes in DB: {Match.objects.count()}")

if __name__ == "__main__":
    seed_all()
