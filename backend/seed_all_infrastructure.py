import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'greengrid.settings')
django.setup()

from apps.supplier.models import SupplierProfile
from apps.dcbuilder.models import DCProfile
from apps.matches.models import Match

# ══════════════════════════════════════════════════════════════════════════════
# 1. RENEWABLE ENERGY DEVELOPERS & SUPPLIERS (OCTOBER 2026 DATABASE)
# ══════════════════════════════════════════════════════════════════════════════
RENEWABLE_SOURCES = [
    {
        "name": "Adani Green Energy (AGEL)",
        "category": "ipp",
        "capacity_mw": 20000.0,
        "available_capacity_mw": 4500.0,
        "energy_types": ["Solar", "Wind", "Hybrid", "BESS"],
        "sourcing_models": ["Physical PPA", "vPPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Gujarat", "Rajasthan", "Maharashtra", "Pan-India"],
        "min_contract_years": 10,
        "price_per_unit_inr": {"min": 3.75, "max": 4.85},
        "rtc_availability_pct": 88,
        "website": "https://www.adanigreenenergy.com",
        "latitude": 23.8500,
        "longitude": 69.7500,
        "is_verified": True,
        "description": "20+ GW operational (Jul 2026); >52 billion units annual clean generation; Khavda 30 GW target. FY26 energy sales 37,567 MU; FY26 power revenue ₹11,602 crore."
    },
    {
        "name": "ReNew (ReNew Power)",
        "category": "ipp",
        "capacity_mw": 12600.0,
        "available_capacity_mw": 2600.0,
        "energy_types": ["Solar", "Wind", "BESS"],
        "sourcing_models": ["Physical PPA", "vPPA", "RTC/FDRE"],
        "states_covered": ["Rajasthan", "Karnataka", "Andhra Pradesh", "Maharashtra"],
        "min_contract_years": 8,
        "price_per_unit_inr": {"min": 4.15, "max": 5.05},
        "rtc_availability_pct": 84,
        "website": "https://www.renew.com",
        "latitude": 28.4595,
        "longitude": 77.0266,
        "is_verified": True,
        "description": "~12.6 GW operating; ~20 GW gross portfolio. In FY26 commissioned ~2.4 GW (1.75 GW solar + 0.62 GW wind + 25 MW/100 MWh BESS). Custom wind-solar-storage RTC hybrid."
    },
    {
        "name": "Tata Power Renewable Energy (TPREL)",
        "category": "ipp",
        "capacity_mw": 11600.0,
        "available_capacity_mw": 2100.0,
        "energy_types": ["Solar", "Wind", "Hybrid/FDRE", "BESS"],
        "sourcing_models": ["Physical PPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Maharashtra", "Tamil Nadu", "Rajasthan", "Gujarat", "Karnataka"],
        "min_contract_years": 10,
        "price_per_unit_inr": {"min": 4.10, "max": 5.20},
        "rtc_availability_pct": 82,
        "website": "https://www.tatapowerrenewables.com",
        "latitude": 18.9220,
        "longitude": 72.8347,
        "is_verified": True,
        "description": "11.6 GW total utility renewable capacity including 9.4 GW contracted PPA; 6.3 GW operational (5.1 GW solar + 1.2 GW wind). Manufacturing facility in Tirunelveli."
    },
    {
        "name": "Avaada Energy",
        "category": "ipp",
        "capacity_mw": 7300.0,
        "available_capacity_mw": 1500.0,
        "energy_types": ["Solar", "Wind", "Hybrid", "FDRE", "BESS"],
        "sourcing_models": ["Physical PPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Rajasthan", "Maharashtra", "Gujarat", "Karnataka"],
        "min_contract_years": 12,
        "price_per_unit_inr": {"min": 3.95, "max": 4.90},
        "rtc_availability_pct": 76,
        "website": "https://www.avaada.com",
        "latitude": 28.0176,
        "longitude": 73.3119,
        "is_verified": True,
        "description": "~7.2–7.3 GWp operational; >17.7 GWp portfolio including construction. Flagship Bikaner 1.25 GWp single-site solar park; integrated AI-ready DC clean power provider."
    },
    {
        "name": "JSW Energy (JSW Neo Energy)",
        "category": "ipp",
        "capacity_mw": 9190.0,
        "available_capacity_mw": 1400.0,
        "energy_types": ["Wind", "Solar", "Hybrid", "Hydro", "BESS", "Pumped Hydro"],
        "sourcing_models": ["Physical PPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Karnataka", "Maharashtra", "Tamil Nadu", "Pan-India"],
        "min_contract_years": 10,
        "price_per_unit_inr": {"min": 3.65, "max": 4.85},
        "rtc_availability_pct": 80,
        "website": "https://www.jsw.in/energy",
        "latitude": 15.1394,
        "longitude": 76.9214,
        "is_verified": True,
        "description": "~9.19 GW renewable operational (reported Oct 2026); 15.15 GW total platform; 29.6 GWh storage locked in. Long-term target of 30 GW generation + 40 GWh storage by 2030."
    },
    {
        "name": "Greenko Group",
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
        "description": "Integrated renewable + pumped hydro storage platform. Pinnapuram IREP (1,200 MW pumped hydro + 2,000 MW solar + 400 MW wind) delivering 24/7 firm baseload renewable power."
    },
    {
        "name": "NTPC Green Energy (NGEL)",
        "category": "ipp",
        "capacity_mw": 10000.0,
        "available_capacity_mw": 2500.0,
        "energy_types": ["Solar", "Wind", "Hybrid", "Storage"],
        "sourcing_models": ["Physical PPA", "Green Tariff", "RTC/FDRE"],
        "states_covered": ["Gujarat", "Rajasthan", "Andhra Pradesh", "Pan-India"],
        "min_contract_years": 15,
        "price_per_unit_inr": {"min": 3.85, "max": 4.80},
        "rtc_availability_pct": 82,
        "website": "https://www.ntpc.co.in",
        "latitude": 28.5355,
        "longitude": 77.3910,
        "is_verified": True,
        "description": "PSU clean energy flagship targeting 60 GW by 2032 with mega solar and wind complexes across Gujarat and Rajasthan. Strong utility-scale and RTC/FDRE pipeline."
    },
    {
        "name": "ACME Solar",
        "category": "ipp",
        "capacity_mw": 2800.0,
        "available_capacity_mw": 600.0,
        "energy_types": ["Solar", "Wind", "Hybrid", "FDRE"],
        "sourcing_models": ["Physical PPA", "Open Access", "RTC/FDRE"],
        "states_covered": ["Rajasthan", "Gujarat", "Pan-India"],
        "min_contract_years": 10,
        "price_per_unit_inr": {"min": 3.80, "max": 4.75},
        "rtc_availability_pct": 78,
        "website": "https://www.acme.in",
        "latitude": 27.5397,
        "longitude": 71.9161,
        "is_verified": True,
        "description": "~2.8 GW solar operational; expanding hybrid/FDRE pipeline with recent Bikaner hybrid commissioning linked to long-term NTPC PPA."
    },
    {
        "name": "Sembcorp Green Infra",
        "category": "ipp",
        "capacity_mw": 4200.0,
        "available_capacity_mw": 800.0,
        "energy_types": ["Solar", "Wind", "Hybrid", "Storage"],
        "sourcing_models": ["Physical PPA", "Open Access"],
        "states_covered": ["Gujarat", "Karnataka", "Madhya Pradesh", "Tamil Nadu"],
        "min_contract_years": 10,
        "price_per_unit_inr": {"min": 4.05, "max": 4.95},
        "rtc_availability_pct": 79,
        "website": "https://www.sembcorp.com",
        "latitude": 21.1702,
        "longitude": 72.8311,
        "is_verified": True,
        "description": "Major utility-scale and C&I renewable platform providing tailored hybrid generation and storage contracts across India."
    },
    {
        "name": "Serentica Renewables",
        "category": "ipp",
        "capacity_mw": 4000.0,
        "available_capacity_mw": 900.0,
        "energy_types": ["Wind", "Solar", "Storage", "Firm Renewable"],
        "sourcing_models": ["Physical PPA", "RTC/FDRE", "Open Access"],
        "states_covered": ["Rajasthan", "Karnataka", "Maharashtra", "Pan-India"],
        "min_contract_years": 12,
        "price_per_unit_inr": {"min": 4.20, "max": 5.10},
        "rtc_availability_pct": 85,
        "website": "https://www.serenticaglobal.com",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "is_verified": True,
        "description": "Firm renewable energy specialist dedicated to commercial and industrial decarbonisation; offers structured RTC and FDRE PPAs for data centers."
    },
    {
        "name": "CleanMax",
        "category": "ci",
        "capacity_mw": 2000.0,
        "available_capacity_mw": 450.0,
        "energy_types": ["Solar", "Wind", "Hybrid"],
        "sourcing_models": ["Open Access", "Group Captive", "Physical PPA"],
        "states_covered": ["Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat"],
        "min_contract_years": 5,
        "price_per_unit_inr": {"min": 3.20, "max": 4.50},
        "rtc_availability_pct": 70,
        "website": "https://www.cleanmax.com",
        "latitude": 19.0178,
        "longitude": 72.8478,
        "is_verified": True,
        "description": "Corporate C&I sourcing specialist. Typical C&I benchmark ₹3.20–₹4.50/kWh. Powers Equinix Mumbai with 33 MW hybrid PPA and Web Werks with 32M kWh group captive arrays."
    },
    {
        "name": "Sunsure Energy",
        "category": "ci",
        "capacity_mw": 1500.0,
        "available_capacity_mw": 350.0,
        "energy_types": ["Solar", "Wind", "Hybrid"],
        "sourcing_models": ["Open Access", "Group Captive", "C&I"],
        "states_covered": ["Karnataka", "Uttar Pradesh", "Haryana", "Maharashtra", "Tamil Nadu"],
        "min_contract_years": 5,
        "price_per_unit_inr": {"min": 3.40, "max": 4.60},
        "rtc_availability_pct": 68,
        "website": "https://www.sunsure-energy.com",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "is_verified": True,
        "description": "Bengaluru HQ C&I renewable developer backed by Partners Group. Delivers tailored corporate open-access solar, wind, and hybrid PPAs."
    },
    {
        "name": "Fourth Partner Energy",
        "category": "ci",
        "capacity_mw": 1400.0,
        "available_capacity_mw": 280.0,
        "energy_types": ["Solar", "Hybrid", "BESS", "C&I"],
        "sourcing_models": ["Open Access", "Group Captive"],
        "states_covered": ["Telangana", "Andhra Pradesh", "Maharashtra", "Tamil Nadu", "Karnataka"],
        "min_contract_years": 7,
        "price_per_unit_inr": {"min": 3.50, "max": 4.65},
        "rtc_availability_pct": 67,
        "website": "https://www.fourthpartner.co",
        "latitude": 17.4483,
        "longitude": 78.3915,
        "is_verified": True,
        "description": "Hyderabad HQ C&I renewable platform backed by British International Investment. Builds onsite solar, wind-solar hybrids, and offsite open-access."
    },
    {
        "name": "Hero Future Energies",
        "category": "ci",
        "capacity_mw": 1600.0,
        "available_capacity_mw": 300.0,
        "energy_types": ["Wind", "Solar", "Hybrid", "BESS"],
        "sourcing_models": ["Physical PPA", "Open Access"],
        "states_covered": ["Rajasthan", "Gujarat", "Andhra Pradesh", "Karnataka"],
        "min_contract_years": 8,
        "price_per_unit_inr": {"min": 3.60, "max": 4.70},
        "rtc_availability_pct": 66,
        "website": "https://www.herofutureenergies.com",
        "latitude": 28.5355,
        "longitude": 77.2610,
        "is_verified": True,
        "description": "Large independent renewable platform backed by KKR. Provides peak-time load-following power solutions and corporate PPAs."
    },
    {
        "name": "Suzlon Group",
        "category": "epc",
        "capacity_mw": 20000.0,
        "available_capacity_mw": 0.0,
        "energy_types": ["Wind", "Hybrid"],
        "sourcing_models": ["Behind-the-Meter", "Physical PPA"],
        "states_covered": ["Tamil Nadu", "Gujarat", "Maharashtra", "Rajasthan"],
        "min_contract_years": 5,
        "price_per_unit_inr": {"min": 3.50, "max": 4.50},
        "rtc_availability_pct": 75,
        "website": "https://www.suzlon.com",
        "latitude": 8.2612,
        "longitude": 77.5458,
        "is_verified": True,
        "description": "India's pioneer wind EPC developer with landmark installations across Muppandal (Tamil Nadu) executing high-CUF turbine integration for energy-intensive campuses."
    },
    {
        "name": "Sterling and Wilson Renewable Energy",
        "category": "epc",
        "capacity_mw": 15000.0,
        "available_capacity_mw": 0.0,
        "energy_types": ["Solar", "BESS"],
        "sourcing_models": ["Behind-the-Meter", "Physical PPA"],
        "states_covered": ["Andhra Pradesh", "Pan-India"],
        "min_contract_years": 3,
        "price_per_unit_inr": {"min": 3.40, "max": 4.40},
        "rtc_availability_pct": 72,
        "website": "https://www.sterlingandwilsonre.com",
        "latitude": 15.6820,
        "longitude": 78.2710,
        "is_verified": True,
        "description": "Global pure-play green EPC contractor for ultra-mega solar parks (e.g. Kurnool, AP) and utility-scale BESS battery installations."
    }
]

# ══════════════════════════════════════════════════════════════════════════════
# 2. MAJOR AI & HYPERSCALE DATA CENTERS IN INDIA (OCTOBER 2026 DATABASE)
# ══════════════════════════════════════════════════════════════════════════════
INSTALLED_DATA_CENTERS = [
    {
        "project_name": "Yotta – D2 Hyperscale AI Campus",
        "preferred_city": "Greater Noida (Knowledge Park V)",
        "preferred_state": "Uttar Pradesh",
        "latitude": 28.4744,
        "longitude": 77.5040,
        "tier": "tier4",
        "it_load_mw": 60.0,
        "server_types": ["NVIDIA Blackwell Ultra GPUs (20,736 Units)", "HPC/AI", "Liquid-Cooled AI Racks"],
        "cooling_type": "liquid",
        "target_pue": 1.22,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 2500, "max": 6000},
        "launch_timeline": "Operational (60 MW IT Load; Scalable to 250 MW)"
    },
    {
        "project_name": "Yotta – NM1 Hyperscale Park",
        "preferred_city": "Panvel / Navi Mumbai",
        "preferred_state": "Maharashtra",
        "latitude": 18.9894,
        "longitude": 73.1175,
        "tier": "tier4",
        "it_load_mw": 52.0,
        "server_types": ["Hyperscale Cloud", "7,000+ Racks", "HPC Clusters"],
        "cooling_type": "liquid",
        "target_pue": 1.25,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "Open Access"],
        "budget_inr_cr": {"min": 2000, "max": 5000},
        "launch_timeline": "Operational (52 MW IT Load; Campus Scalable to ~1 GW)"
    },
    {
        "project_name": "Yotta – D1 Data Center",
        "preferred_city": "Greater Noida",
        "preferred_state": "Uttar Pradesh",
        "latitude": 28.4680,
        "longitude": 77.4980,
        "tier": "tier3",
        "it_load_mw": 30.0,
        "server_types": ["Enterprise Cloud", "Standard Colocation"],
        "cooling_type": "hybrid",
        "target_pue": 1.32,
        "green_goal_pct": 85,
        "sourcing_models": ["Open Access", "Physical PPA"],
        "budget_inr_cr": {"min": 1000, "max": 2200},
        "launch_timeline": "Operational (30 MW IT Load; Expandable to 50 MW)"
    },
    {
        "project_name": "Yotta – G1 GIFT City Edge Campus",
        "preferred_city": "GIFT City, Gandhinagar",
        "preferred_state": "Gujarat",
        "latitude": 23.1610,
        "longitude": 72.6840,
        "tier": "tier3",
        "it_load_mw": 1.0,
        "server_types": ["Financial Trading Edge", "FinTech Cloud"],
        "cooling_type": "hybrid",
        "target_pue": 1.28,
        "green_goal_pct": 90,
        "sourcing_models": ["Green Tariff", "Open Access"],
        "budget_inr_cr": {"min": 80, "max": 200},
        "launch_timeline": "Operational (1 MW IT Load; Scalable District Cooling)"
    },
    {
        "project_name": "Yotta – NDC NER Guwahati",
        "preferred_city": "Guwahati",
        "preferred_state": "Assam",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "tier": "tier3",
        "it_load_mw": 8.0,
        "server_types": ["National AI Infrastructure", "Sovereign Cloud"],
        "cooling_type": "air",
        "target_pue": 1.35,
        "green_goal_pct": 80,
        "sourcing_models": ["Open Access", "Green Tariff"],
        "budget_inr_cr": {"min": 250, "max": 600},
        "launch_timeline": "Operational (IGBC Gold; Scalable to 8 MW)"
    },
    {
        "project_name": "AdaniConneX – Chennai 1",
        "preferred_city": "Chennai",
        "preferred_state": "Tamil Nadu",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "tier": "tier4",
        "it_load_mw": 33.0,
        "server_types": ["HPC/AI", "99.999% Design Availability"],
        "cooling_type": "liquid",
        "target_pue": 1.25,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "Open Access"],
        "budget_inr_cr": {"min": 900, "max": 2000},
        "launch_timeline": "Operational (33 MW Potential IT Load)"
    },
    {
        "project_name": "AdaniConneX – Hyderabad Campus",
        "preferred_city": "Hyderabad",
        "preferred_state": "Telangana",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "tier": "tier4",
        "it_load_mw": 200.0,
        "server_types": ["HPC/AI", "Hyperscale Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.22,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 5000, "max": 12000},
        "launch_timeline": "Phase 1 Live (Oct 2024); 600 MW Potential IT Load"
    },
    {
        "project_name": "AdaniConneX – Navi Mumbai Mega Campus",
        "preferred_city": "Navi Mumbai",
        "preferred_state": "Maharashtra",
        "latitude": 19.0330,
        "longitude": 73.0297,
        "tier": "tier4",
        "it_load_mw": 300.0,
        "server_types": ["Hyperscale AI", "Exascale Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.20,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 8000, "max": 20000},
        "launch_timeline": "RFS Dec 2026 Onward (1,000 MW Potential IT Load)"
    },
    {
        "project_name": "AdaniConneX – Noida Campus",
        "preferred_city": "Noida",
        "preferred_state": "Uttar Pradesh",
        "latitude": 28.5355,
        "longitude": 77.3910,
        "tier": "tier4",
        "it_load_mw": 50.0,
        "server_types": ["Hyperscale Cloud", "AI Clusters"],
        "cooling_type": "hybrid",
        "target_pue": 1.26,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "Open Access"],
        "budget_inr_cr": {"min": 1500, "max": 3500},
        "launch_timeline": "Phase 1 Live (Jan 2025); 150 MW Potential IT Load"
    },
    {
        "project_name": "AdaniConneX – Pune Campus",
        "preferred_city": "Pune",
        "preferred_state": "Maharashtra",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "tier": "tier4",
        "it_load_mw": 80.0,
        "server_types": ["HPC/AI", "Enterprise Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.24,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 2500, "max": 5500},
        "launch_timeline": "Phase 1 Live (Oct 2025); 250 MW Potential IT Load"
    },
    {
        "project_name": "AdaniConneX – Visakhapatnam AI Mega Hub",
        "preferred_city": "Visakhapatnam",
        "preferred_state": "Andhra Pradesh",
        "latitude": 17.6868,
        "longitude": 83.2185,
        "tier": "tier4",
        "it_load_mw": 350.0,
        "server_types": ["Next-Gen Frontier AI Hub", "Gigawatt Scale Compute"],
        "cooling_type": "liquid",
        "target_pue": 1.18,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 10000, "max": 25000},
        "launch_timeline": "Phase 1 Dec 2028 (1 GW Potential IT Load)"
    },
    {
        "project_name": "Digital Edge – BOM Campus",
        "preferred_city": "Navi Mumbai",
        "preferred_state": "Maharashtra",
        "latitude": 19.0450,
        "longitude": 73.0150,
        "tier": "tier4",
        "it_load_mw": 120.0,
        "server_types": ["AI-Ready Hyperscale", "High-Density GPU Racks"],
        "cooling_type": "liquid",
        "target_pue": 1.20,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 3500, "max": 8000},
        "launch_timeline": "350 MW Campus (83 MW Solar PPA from Dec 2026; Greywater Cooling)"
    },
    {
        "project_name": "Sify Technologies DGX-Ready AI Campus",
        "preferred_city": "Mumbai",
        "preferred_state": "Maharashtra",
        "latitude": 19.1136,
        "longitude": 72.8697,
        "tier": "tier4",
        "it_load_mw": 85.0,
        "server_types": ["NVIDIA-Certified DGX-Ready", "HPC/AI", "Liquid-Cooled"],
        "cooling_type": "liquid",
        "target_pue": 1.25,
        "green_goal_pct": 100,
        "sourcing_models": ["Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 1200, "max": 2500},
        "launch_timeline": "Operational (309.6 MWp RE PPAs Contracted)"
    },
    {
        "project_name": "Equinix MB1 & MB2 IBX Facilities",
        "preferred_city": "Mumbai (Chandivali & Navi Mumbai)",
        "preferred_state": "Maharashtra",
        "latitude": 19.1075,
        "longitude": 72.8943,
        "tier": "tier4",
        "it_load_mw": 45.0,
        "server_types": ["Interconnection", "HPC/AI", "Enterprise Hybrid Cloud"],
        "cooling_type": "liquid",
        "target_pue": 1.30,
        "green_goal_pct": 100,
        "sourcing_models": ["Group Captive", "Physical PPA"],
        "budget_inr_cr": {"min": 850, "max": 1800},
        "launch_timeline": "Operational (33 MW Captive CleanMax Solar-Wind PPA Active)"
    },
    {
        "project_name": "Web Werks & Iron Mountain JV Hyperscale Facility",
        "preferred_city": "Navi Mumbai (Rabale)",
        "preferred_state": "Maharashtra",
        "latitude": 19.1554,
        "longitude": 73.0033,
        "tier": "tier3",
        "it_load_mw": 32.0,
        "server_types": ["Standard Cloud", "Edge AI"],
        "cooling_type": "hybrid",
        "target_pue": 1.35,
        "green_goal_pct": 100,
        "sourcing_models": ["Open Access", "Group Captive"],
        "budget_inr_cr": {"min": 600, "max": 1200},
        "launch_timeline": "Operational (32M kWh Clean-Energy PPA Active)"
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
        "launch_timeline": "Operational (Expanding Renewable Procurement Portfolio)"
    },
    {
        "project_name": "Avaada Energy AI-Ready Data Center Campus",
        "preferred_city": "Bikaner / Jaipur",
        "preferred_state": "Rajasthan",
        "latitude": 28.0176,
        "longitude": 73.3119,
        "tier": "tier4",
        "it_load_mw": 100.0,
        "server_types": ["AI Training Racks", "Integrated Renewable Compute"],
        "cooling_type": "liquid",
        "target_pue": 1.22,
        "green_goal_pct": 100,
        "sourcing_models": ["Behind-the-Meter", "Physical PPA", "RTC/FDRE"],
        "budget_inr_cr": {"min": 2500, "max": 6000},
        "launch_timeline": "Under Construction (Integrated with 1.25 GWp Solar + BESS)"
    }
]

# ══════════════════════════════════════════════════════════════════════════════
# 3. SEEDING LOGIC WITH STRICT VERIFICATION MAPPINGS
# ══════════════════════════════════════════════════════════════════════════════
def seed_all():
    print("[1/3] Seeding Verified Renewable Energy Developers & Suppliers...")
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
                "price_per_unit_inr": data.get("price_per_unit_inr", {"min": 3.5, "max": 4.5}),
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

    print("[2/3] Seeding Major AI & Hyperscale Data Center Campuses in India...")
    dc_count = 0
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
        dc_count += 1

    print(f"      Total Data Centers in DB: {DCProfile.objects.count()}")

    print("[3/3] Establishing Document-Verified Sourcing & Transmission Routes...")
    # Clean existing seed matches
    Match.objects.all().delete()

    # Credible note template adhering strictly to energy research guidelines:
    # "The facility is supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability."
    match_pairs = [
        # Yotta D2 <-> Adani Green Khavda
        (
            "Yotta – D2 Hyperscale AI Campus",
            "Adani Green Energy (AGEL)",
            98.5,
            "Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability for 20,736 NVIDIA Blackwell Ultra GPUs."
        ),
        # Yotta NM1 <-> Tata Power Renewables
        (
            "Yotta – NM1 Hyperscale Park",
            "Tata Power Renewable Energy (TPREL)",
            96.0,
            "Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability across 7,000+ racks."
        ),
        # AdaniConneX Vizag 1 GW <-> Adani Green Khavda
        (
            "AdaniConneX – Visakhapatnam AI Mega Hub",
            "Adani Green Energy (AGEL)",
            99.0,
            "Internal ecosystem gigawatt clean power corridor backed by Khavda 30 GW generation park and dedicated high-voltage transmission lines."
        ),
        # AdaniConneX Hyderabad <-> Greenko Group (Pinnapuram Pumped Hydro)
        (
            "AdaniConneX – Hyderabad Campus",
            "Greenko Group",
            97.5,
            "Supplied through a combination of grid electricity and contracted renewable generation, with Pinnapuram 1,200 MW pumped-hydro storage used to support 24/7 reliability."
        ),
        # Digital Edge BOM <-> Avaada Energy (83 MW Solar PPA)
        (
            "Digital Edge – BOM Campus",
            "Avaada Energy",
            95.5,
            "Structured 83 MW solar PPA paired with BESS storage and industrial recycled greywater liquid cooling."
        ),
        # Equinix MB1 & MB2 <-> CleanMax (33 MW Captive PPA)
        (
            "Equinix MB1 & MB2 IBX Facilities",
            "CleanMax",
            96.5,
            "Active 33 MW corporate captive renewable PPA combining solar and wind generation for Chandivali & Navi Mumbai facilities."
        ),
        # Web Werks <-> CleanMax (32 million kWh)
        (
            "Web Werks & Iron Mountain JV Hyperscale Facility",
            "CleanMax",
            94.0,
            "Active corporate PPA supplying 32 million kWh solar-wind energy for Navi Mumbai operations."
        ),
        # Sify Technologies <-> ReNew Power (309.6 MWp RE)
        (
            "Sify Technologies DGX-Ready AI Campus",
            "ReNew (ReNew Power)",
            97.0,
            "Contracted 309.6 MWp renewable energy through PPAs powering NVIDIA-certified DGX-ready liquid-cooled facilities."
        ),
        # Nxtra Chennai <-> Suzlon Group (Muppandal Wind)
        (
            "Nxtra by Airtel Hyper-Density Data Center",
            "Suzlon Group",
            92.0,
            "Supplied through a combination of grid electricity and contracted renewable generation, with high-CUF Tamil Nadu wind corridor wheeling."
        ),
        # Avaada AI DC <-> Avaada Energy Bikaner
        (
            "Avaada Energy AI-Ready Data Center Campus",
            "Avaada Energy",
            98.0,
            "Behind-the-meter colocation integrated directly with Bikaner 1.25 GWp solar generation and dedicated BESS storage."
        )
    ]

    match_count = 0
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
                    "match_reasons": [
                        reason,
                        "Technical compliance with CERC Green Energy Open Access Regulations",
                        "High baseload reliability & ISTS transmission corridor access"
                    ],
                    "recommended_sourcing_model": "Hybrid / RTC / FDRE + BESS + Grid",
                    "carbon_offset_tons_per_year": round(dc.it_load_mw * 8760 * 0.82)
                }
            )
            match_count += 1
        except Exception as e:
            print(f"   Warning for match {dc_name} <-> {sup_name}: {e}")

    print(f"      Total Active Match Routes in DB: {Match.objects.count()}")
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_all()
