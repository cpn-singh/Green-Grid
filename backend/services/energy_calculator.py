import json
from .gemini_client import get_gemini_client

def calculate_energy_requirements(dc_profile: dict) -> dict:
    """
    Calculate annual MWh, peak demand, renewable capacity needed,
    and recommended location scores for a Data Center profile.
    Uses Gemini when key is provided, otherwise falls back to deterministic model.
    """
    it_load_mw = float(dc_profile.get('it_load_mw', 10.0))
    target_pue = float(dc_profile.get('target_pue', 1.4))
    green_goal_pct = float(dc_profile.get('green_goal_pct', 100))
    cooling_type = dc_profile.get('cooling_type', 'liquid')
    preferred_city = dc_profile.get('preferred_city', 'Mumbai')

    # Baseline physics / industry metrics
    # Annual hours: 8760
    # Total facility power = it_load_mw * target_pue
    total_facility_mw = it_load_mw * target_pue
    estimated_annual_mwh = round(total_facility_mw * 8760, 2)
    peak_demand_mw = round(total_facility_mw * 1.15, 2)
    renewable_needed_mw = round((total_facility_mw * (green_goal_pct / 100.0)), 2)

    cooling_overhead = round((target_pue - 1.0) * 100, 1)

    fallback_result = {
        "estimated_annual_mwh": estimated_annual_mwh,
        "peak_demand_mw": peak_demand_mw,
        "renewable_needed_mw": renewable_needed_mw,
        "cooling_overhead_pct": cooling_overhead,
        "recommended_sourcing_models": ["Physical PPA", "RTC/FDRE", "Open Access"],
        "preferred_energy_types": ["Solar", "Wind", "BESS Hybrid"],
        "location_scores": {
            "Mumbai": 92,
            "Pune": 88,
            "Bengaluru": 86,
            "Chennai": 84,
            "Hyderabad": 87,
            "Noida": 79
        },
        "reasoning": f"Based on {it_load_mw} MW IT load with {cooling_type} cooling and target PUE {target_pue}, facility requires {renewable_needed_mw} MW green firm capacity. RTC/FDRE hybrid recommended for 24/7 uptime."
    }

    client = get_gemini_client()
    if not client:
        return fallback_result

    prompt = f"""
    You are an expert Data Center energy engineer and green power procurement consultant in India.
    Analyze this Data Center Builder profile:
    {json.dumps(dc_profile)}

    Calculate precise energy metrics and location recommendation rankings for Indian data center hubs.
    Return ONLY a JSON object matching this schema:
    {{
      "estimated_annual_mwh": <float>,
      "peak_demand_mw": <float>,
      "renewable_needed_mw": <float>,
      "cooling_overhead_pct": <float>,
      "recommended_sourcing_models": ["string", ...],
      "preferred_energy_types": ["string", ...],
      "location_scores": {{"Mumbai": <int 0-100>, "Pune": <int 0-100>, "Chennai": <int 0-100>, "Hyderabad": <int 0-100>, "Bengaluru": <int 0-100>, "Noida": <int 0-100>}},
      "reasoning": "<concise explanation of calculations and recommendations>"
    }}
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json'
            }
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Gemini calculation error: {e}. Using deterministic calculation.")
        return fallback_result
