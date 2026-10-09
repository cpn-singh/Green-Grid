import json
import math
from .gemini_client import get_gemini_client

def calculate_rule_match_score(dc_profile: dict, supplier_profile: dict) -> float:
    """
    Weighted matching formula:
    Match Score = (
      CapacityFit        * 30% +
      LocationProximity  * 25% +
      EnergyTypeMatch    * 20% +
      SourcingModelMatch * 15% +
      PriceRangeOverlap  * 10%
    ) * 100
    """
    needed_mw = float(dc_profile.get('it_load_mw', 10.0)) * float(dc_profile.get('target_pue', 1.4))
    available_mw = float(supplier_profile.get('available_capacity_mw', 100.0))
    if available_mw <= 0:
        available_mw = float(supplier_profile.get('capacity_mw', 500.0)) * 0.2

    # 1. Capacity fit (ideal when available >= needed, penalize if too small or over 10x too large)
    if available_mw >= needed_mw:
        ratio = needed_mw / available_mw
        capacity_score = 1.0 if ratio >= 0.1 else 0.8
    else:
        capacity_score = max(0.2, available_mw / needed_mw)

    # 2. Location proximity (state or preferred hub overlap)
    dc_state = str(dc_profile.get('preferred_state', '')).lower()
    sup_states = [s.lower() for s in supplier_profile.get('states_covered', [])]
    if any(dc_state in s or s in dc_state for s in sup_states) or "pan-india" in sup_states:
        loc_score = 1.0
    else:
        loc_score = 0.5

    # 3. Energy Type Match (Supports all 7 Indian RE types: Solar, Wind, Hybrid, Pumped Hydro, BESS, Small Hydro, Biomass)
    preferred_sources = [t.lower() for t in dc_profile.get('preferred_energy_sources', [])]
    sup_types = [t.lower() for t in supplier_profile.get('energy_types', [])]
    
    if preferred_sources:
        matched = set(preferred_sources).intersection(set(sup_types))
        energy_score = min(1.0, 0.4 + (len(matched) / max(1, len(preferred_sources))) * 0.6)
    else:
        # General clean energy check across major Indian RE types
        all_re_types = {'solar', 'wind', 'hybrid', 'bess', 'pumped hydro', 'small hydro', 'hydro', 'biomass'}
        type_matches = len(all_re_types.intersection(set(sup_types)))
        energy_score = min(1.0, 0.4 + (type_matches * 0.15))

    # 4. Sourcing Model Match
    dc_sourcing = [m.lower() for m in dc_profile.get('sourcing_models', ['Physical PPA', 'Open Access'])]
    sup_sourcing = [m.lower() for m in supplier_profile.get('sourcing_models', [])]
    overlap_sourcing = set(dc_sourcing).intersection(set(sup_sourcing))
    sourcing_score = 1.0 if overlap_sourcing else 0.4

    # 5. Price overlap
    price_score = 0.85

    score = (
        (capacity_score * 0.30) +
        (loc_score * 0.25) +
        (energy_score * 0.20) +
        (sourcing_score * 0.15) +
        (price_score * 0.10)
    ) * 100

    return round(min(98.5, max(45.0, score)), 1)

def get_ai_match_analysis(dc_profile: dict, supplier_profile: dict) -> dict:
    rule_score = calculate_rule_match_score(dc_profile, supplier_profile)
    it_load = float(dc_profile.get('it_load_mw', 10.0))
    pue = float(dc_profile.get('target_pue', 1.4))
    annual_mwh = it_load * pue * 8760
    # Average ~4.5 INR per kWh -> in Crores (1 Cr = 10,000,000 INR)
    annual_cost_cr = round((annual_mwh * 1000 * 4.65) / 10000000, 2)
    carbon_offset_tons = round(annual_mwh * 0.82, 0) # 0.82 tons CO2 per MWh in India grid

    sup_name = supplier_profile.get('name', 'Energy Supplier')
    dc_city = dc_profile.get('preferred_city', 'Mumbai')

    fallback_analysis = {
        "match_score": rule_score,
        "match_reasons": [
            f"Strong capacity alignment with {supplier_profile.get('capacity_mw', 'large')} MW overall renewable portfolio.",
            f"Proven presence in {', '.join(supplier_profile.get('states_covered', [])[:2])} matching data center hub requirements.",
            f"Supports flexible {', '.join(supplier_profile.get('sourcing_models', [])[:2])} models for Tier III/IV uptime."
        ],
        "recommended_sourcing_model": supplier_profile.get('sourcing_models', ['Physical PPA'])[0],
        "estimated_annual_cost_inr_cr": annual_cost_cr,
        "carbon_offset_tons_per_year": carbon_offset_tons,
        "risk_factors": [
            "Transmission wheeling and inter-state open access surcharges should be locked in PPA covenants.",
            "Verify backup battery storage (BESS) or hydro dispatch during peak evening load (7pm - 11pm)."
        ],
        "negotiation_tips": [
            "Propose a 10-15 year tenure to lock in lower unit tariffs under INR 4.50/kWh.",
            "Insist on minimum 80% Round-The-Clock (RTC) delivery guarantees with liquidated damages."
        ],
        "best_dc_location": {
            "city": dc_city,
            "state": dc_profile.get('preferred_state', 'Maharashtra'),
            "lat": float(dc_profile.get('latitude', 19.0760) or 19.0760),
            "lng": float(dc_profile.get('longitude', 72.8777) or 72.8777),
            "reasons": [
                "Abundant grid sub-stations and high fiber density",
                "Favorable state open-access policy for green data centers"
            ]
        }
    }

    client = get_gemini_client()
    if not client:
        return fallback_analysis

    prompt = f"""
    You are a Green Energy Matchmaking AI expert for India's mission-critical data center sector.
    Evaluate the compatibility between this Data Center Builder and Energy Supplier:

    DC Builder:
    {json.dumps(dc_profile)}

    Energy Supplier:
    {json.dumps(supplier_profile)}

    Baseline computed match score: {rule_score}

    Provide deep qualitative and financial matching analysis.
    Return ONLY a JSON matching:
    {{
      "match_score": <float 0-100>,
      "match_reasons": ["string", "string", ...],
      "recommended_sourcing_model": "string",
      "estimated_annual_cost_inr_cr": <float>,
      "carbon_offset_tons_per_year": <float>,
      "risk_factors": ["string", "string"],
      "negotiation_tips": ["string", "string"],
      "best_dc_location": {{
        "city": "string",
        "state": "string",
        "lat": <float>,
        "lng": <float>,
        "reasons": ["string", "string"]
      }}
    }}
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini match error: {e}. Using deterministic analysis.")
        return fallback_analysis
