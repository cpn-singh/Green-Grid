export const ENERGY_SOURCES = [
  {
    id: 'solar',
    name: 'Utility Solar PV & Canal-Top',
    shortName: 'Solar PV',
    tagline: 'High-irradiance daytime photovoltaic bulk generation',
    category: 'Solar',
    badge: 'STAGE 01 // BULK GENERATION',
    status: 'COMMERCIAL HYPERSCALE',
    installedCapacityIndia: '92.1 GW',
    targetCapacity2030: '280 GW',
    tariffInrPerKwh: '₹2.30 - ₹2.75',
    tariffUsdPerMwh: '$27.50 - $32.90',
    cufRange: '22% - 28%',
    carbonIntensityGCo2: '38 - 48 gCO₂e/kWh',
    matchingScore247: 62,
    roleInDatacenter: 'Primary daytime zero-carbon bulk power; drives electrolyzers and charges daytime battery/PSP reserves.',
    image: '/energy-media/solar.jpg',
    video: '/energy-media/solar.mp4',
    videoCdn: null,
    accentColor: '#10b981',
    corridors: [
      'Bhadla-Bikaner 765kV Green Corridor (Rajasthan)',
      'Khavda RE Park CTU Interconnect (Gujarat)',
      'Pavagada Pooling Substation (Karnataka)',
      'Rewa Ultra-Mega Solar Substation (Madhya Pradesh)'
    ],
    keyPlants: [
      { name: 'Bhadla Solar Park', location: 'Jodhpur, Rajasthan', capacity: '2,245 MW', developer: 'RSDCL / Adani / Hero' },
      { name: 'Khavda Renewable Energy Park', location: 'Kutch, Gujarat', capacity: '14,000 MW (Phased)', developer: 'Adani Green / NTPC' },
      { name: 'Pavagada Solar Park (Shakti Sthala)', location: 'Tumakuru, Karnataka', capacity: '2,050 MW', developer: 'KREDL / NTPC' },
      { name: 'Rewa Ultra Mega Solar', location: 'Rewa, Madhya Pradesh', capacity: '750 MW', developer: 'RUMSL / Mahindra / ACME' }
    ],
    dispatchProfile: 'Day-peaking curve with bell-shaped insolation between 06:30 and 18:00 IST. Peak generation occurs at 12:30 IST at 920-1000 W/m² DNI.',
    technicalSpecs: {
      technology: 'Monocrystalline PERC & N-Type TOPCon Bifacial Panels with Single-Axis Trackers',
      landRequirement: '4 - 4.5 Acres / MW',
      degradationRate: '0.45% / year (30-year lifecycle guarantee)',
      inverterTopology: '1500V DC Central Inverters with Smart Grid-Forming Active Power Filtering',
      waterConsumption: 'Robotic dry cleaning (<0.02 L/kWh)'
    },
    regulatoryFramework: [
      'MNRE Approved List of Models and Manufacturers (ALMM) Compliance',
      'CERC ISTS Transmission Charge Waiver for projects commissioned before June 2028',
      'Green Energy Open Access Rules (100 kW minimum threshold)'
    ],
    advantages: [
      'Lowest levelized cost of energy (LCOE) in the Indian grid',
      'Fast deployment velocity (8–14 months commissioning)',
      'Zero on-site emissions or cooling water requirements with dry-cleaning robots'
    ],
    limitations: [
      'Zero nighttime output requires firm storage pairing (PSP/BESS)',
      'Generation drops 40–60% during peak monsoon cloud cover (July–August)',
      'High land acreage requirement requiring desert or wasteland siting'
    ]
  },
  {
    id: 'wind',
    name: 'Onshore & Offshore Wind Power',
    shortName: 'Wind Energy',
    tagline: 'High-altitude aerodynamic kinetic energy capture',
    category: 'Wind',
    badge: 'STAGE 01 // BULK GENERATION',
    status: 'COMMERCIAL HYPERSCALE',
    installedCapacityIndia: '47.4 GW',
    targetCapacity2030: '100 GW',
    tariffInrPerKwh: '₹2.85 - ₹3.40',
    tariffUsdPerMwh: '$34.10 - $40.70',
    cufRange: '32% - 42%',
    carbonIntensityGCo2: '11 - 15 gCO₂e/kWh',
    matchingScore247: 74,
    roleInDatacenter: 'Counter-cyclical to solar; delivers peak evening and night generation during summer & southwest monsoon months.',
    image: '/energy-media/wind.jpg',
    video: '/energy-media/wind.mp4',
    videoCdn: null,
    accentColor: '#34d399',
    corridors: [
      'Southern Regional Interconnector (Tamil Nadu - Karnataka)',
      'Saurashtra-Kutch High Voltage Green Corridor (Gujarat)',
      'Western Ghats Passages (Maharashtra - Karnataka)',
      'Jaisalmer-Barmer Desert Wind Corridor (Rajasthan)'
    ],
    keyPlants: [
      { name: 'Muppandal Wind Farm', location: 'Kanyakumari, Tamil Nadu', capacity: '1,500 MW', developer: 'Various IPPs / TNEB' },
      { name: 'Jaisalmer Wind Park', location: 'Jaisalmer, Rajasthan', capacity: '1,600 MW', developer: 'Suzlon / CLP India' },
      { name: 'Brahmanvel Wind Farm', location: 'Dhule, Maharashtra', capacity: '528 MW', developer: 'Parakh Agro / Tata Power' },
      { name: 'Damanjodi Wind Power Project', location: 'Koraput, Odisha', capacity: '100 MW', developer: 'NALCO / Suzlon' }
    ],
    dispatchProfile: 'Bimodal diurnal curve; high evening and midnight output (20:00 - 05:00 IST) and massive seasonal output during Southwest Monsoon (June - September).',
    technicalSpecs: {
      technology: '3.0 - 4.2 MW Direct Drive Turbines with 140m - 160m Hub Heights and 160m Rotor Diameters',
      windSpeedCutIn: '2.5 - 3.0 m/s (Cut-out: 25 m/s)',
      availabilityFactor: '97.8% fleet uptime',
      gridCompliance: 'Low Voltage Ride-Through (LVRT) & Fast Frequency Response under CEA Regulations 2019'
    },
    regulatoryFramework: [
      'National Offshore Wind Energy Policy (70 GW pipeline off Gujarat and Tamil Nadu coasts)',
      'Inter-State Transmission System (ISTS) zero-wheeling waiver',
      'Wind-Solar Hybrid Policy offering optimal tariff pooling'
    ],
    advantages: [
      'Produces power during evening peak hours (18:00 - 23:00 IST) when solar output ceases',
      'Lowest lifecycle CO₂ footprint of any commercial generation technology (11 g/kWh)',
      'Minimal ground footprint; agricultural farming continues beneath turbines'
    ],
    limitations: [
      'Seasonal intermittency (high generation June-Sept, lower in winter slack months)',
      'Geographically concentrated in 7 windy states (TN, GJ, KA, RJ, MH, AP, MP)',
      'Logistics constraints transporting 75m+ blades through mountainous terrain'
    ]
  },
  {
    id: 'large-hydro',
    name: 'Large Hydroelectric Dams (>25 MW)',
    shortName: 'Large Hydro',
    tagline: 'Himalayan reservoir potential & synchronous grid inertia',
    category: 'Hydro',
    badge: 'STAGE 02 // FIRM BASELOAD',
    status: 'DISPATCHABLE BASELOAD',
    installedCapacityIndia: '46.9 GW',
    targetCapacity2030: '65 GW',
    tariffInrPerKwh: '₹3.60 - ₹4.90',
    tariffUsdPerMwh: '$43.10 - $58.70',
    cufRange: '45% - 60%',
    carbonIntensityGCo2: '24 - 35 gCO₂e/kWh',
    matchingScore247: 91,
    roleInDatacenter: 'Continuous spinning reserve, frequency stability (50.0 Hz), black-start resilience, and round-the-clock firm baseload.',
    image: '/energy-media/large-hydro.jpg',
    video: '/energy-media/hydro.mp4',
    videoCdn: null,
    accentColor: '#38bdf8',
    corridors: [
      'Northern Regional 765kV Pooling Line (Tehri - Meerut)',
      'Subansiri-Biswanath Chariali HVDC Corridor (North-East to Northern Grid)',
      'Himachal Hydro Evacuation Corridor (Parbati - Koldam - Ludhiana)'
    ],
    keyPlants: [
      { name: 'Tehri Hydroelectric Complex', location: 'Tehri Garhwal, Uttarakhand', capacity: '2,400 MW (incl. PSP)', developer: 'THDC India' },
      { name: 'Koyna Hydroelectric Project', location: 'Satara, Maharashtra', capacity: '1,960 MW', developer: 'MAHAGENCO' },
      { name: 'Srisailam Hydro Station', location: 'Kurnool, Andhra Pradesh / Telangana', capacity: '1,670 MW', developer: 'APGENCO / TSGENCO' },
      { name: 'Nathpa Jhakri Station', location: 'Shimla, Himachal Pradesh', capacity: '1,500 MW', developer: 'SJVN Limited' }
    ],
    dispatchProfile: 'Flat controllable baseload with rapid ramp rates (0 to 100% capacity within 90 seconds) for immediate frequency balancing during grid perturbations.',
    technicalSpecs: {
      technology: 'Francis & Pelton Hydro Turbines coupled with High-Inertia Synchronous Generators',
      rampRate: '>40% per minute',
      waterHead: '200m - 800m high-head reservoir impoundments',
      gridSupport: 'Provides fundamental physical grid inertia and dynamic reactive power (MVAR) control'
    },
    regulatoryFramework: [
      'Cabinet Approval reclassifying Large Hydro (>25 MW) as Renewable Energy Source (2019)',
      'Hydro Power Purchase Obligation (HPO) trajectory specified under Ministry of Power targets',
      'Budgetary support for flood moderation and enabling infrastructure'
    ],
    advantages: [
      'True 24/7 firm zero-carbon baseload with >99.5% mechanical reliability',
      'Provides physical synchronous inertia that software or inverters cannot replace',
      'Over 80-year operating lifespan with predictable operating costs'
    ],
    limitations: [
      'High initial capital expenditure and 6–10 year construction gestation',
      'Environmental and local ecological clearances required in Himalayan watersheds',
      'Seasonal river inflows tied to snowmelt and monsoon patterns'
    ]
  },
  {
    id: 'pumped-hydro',
    name: 'Pumped Storage Hydro (PSP)',
    shortName: 'Pumped Hydro (PSP)',
    tagline: 'Closed-loop gravitational gigawatt-hour bulk energy buffer',
    category: 'Storage',
    badge: 'STAGE 03 // MULTI-HOUR BUFFER',
    status: 'ACTIVE PIPELINE (>120 GW)',
    installedCapacityIndia: '4.8 GW (Operational) / 120 GW (Planned)',
    targetCapacity2030: '26 GW Operational',
    tariffInrPerKwh: '₹4.30 - ₹5.40 (RTC)',
    tariffUsdPerMwh: '$51.50 - $64.70 (RTC)',
    cufRange: '75% - 88% (RTC Availability)',
    carbonIntensityGCo2: '18 - 28 gCO₂e/kWh',
    matchingScore247: 96,
    roleInDatacenter: 'Crucial backbone of 24/7 Firm Dispatchable Renewable Energy (FDRE). Absorbs surplus daytime solar and generates full load for 6–10 hours across night shifts.',
    image: '/energy-media/pumped-hydro.jpg',
    video: '/energy-media/pumped-hydro.mp4',
    videoCdn: null,
    accentColor: '#06b6d4',
    corridors: [
      'Southern Grid Kurnool Hub 765kV (Andhra Pradesh)',
      'Central Grid Neemuch Substation (Madhya Pradesh)',
      'Western Ghats PSP Evacuation Hub (Maharashtra - Karnataka)'
    ],
    keyPlants: [
      { name: 'Pinnapuram Integrated RE Project', location: 'Kurnool, Andhra Pradesh', capacity: '1,200 MW (9.6 GWh)', developer: 'Greenko Group' },
      { name: 'Gandhisagar Pumped Storage Project', location: 'Neemuch, Madhya Pradesh', capacity: '1,440 MW (10.5 GWh)', developer: 'Greenko / Torrent' },
      { name: 'Ghatghar Pumped Storage', location: 'Ahmednagar, Maharashtra', capacity: '250 MW', developer: 'WRD Maharashtra' },
      { name: 'Kundah PSP Phase I-IV', location: 'Nilgiris, Tamil Nadu', capacity: '500 MW', developer: 'TANGEDCO' }
    ],
    dispatchProfile: 'Pumping mode during daytime solar excess (10:00 - 16:00 IST). Generating discharge mode during evening peak (18:00 - 24:00 IST) and early morning (03:00 - 08:00 IST).',
    technicalSpecs: {
      technology: 'Reversible Francis Pump-Turbines with Variable Speed Drives (DFIG)',
      roundTripEfficiency: '76% - 82% cycle efficiency',
      storageDuration: '6 - 12 hours continuous full-load discharge',
      cycleLife: 'Indefinite cycle life (>50 years with zero chemical degradation)'
    },
    regulatoryFramework: [
      'Guidelines for Promotion of Pumped Storage Projects issued by Ministry of Power (April 2023)',
      'Exemption from ISTS charges for PSP projects commissioned by 2030',
      'Prioritized green clearance pathway using off-river closed-loop reservoirs'
    ],
    advantages: [
      'Lowest levelized cost of multi-hour storage (LCOS) compared to chemical batteries',
      'No reliance on imported critical minerals like lithium, cobalt, or nickel',
      'Instantaneous multi-hundred-megawatt black-start readiness'
    ],
    limitations: [
      'Requires dual-reservoir topographic elevation differential (minimum 150m head)',
      'Higher initial capex than modular battery containers',
      '36–48 month engineering construction cycle'
    ]
  },
  {
    id: 'bess',
    name: 'Battery Energy Storage Systems (BESS)',
    shortName: 'Grid BESS',
    tagline: 'Millisecond sub-second electrochemical frequency & peak response',
    category: 'Storage',
    badge: 'STAGE 03 // PEAK REGULATION',
    status: 'RAPID EXPANSION',
    installedCapacityIndia: '3.2 GWh (Scaling to 47 GWh)',
    targetCapacity2030: '47 GWh (CEA National Electricity Plan)',
    tariffInrPerKwh: '₹4.90 - ₹6.20 (RTC Blend)',
    tariffUsdPerMwh: '$58.70 - $74.25 (RTC)',
    cufRange: '85% - 95% Availability',
    carbonIntensityGCo2: '32 - 45 gCO₂e/kWh',
    matchingScore247: 94,
    roleInDatacenter: 'Sub-second UPS buffer, frequency stability, voltage ride-through, and 2-to-4 hour evening peak shaving.',
    image: '/energy-media/bess.jpg',
    video: '/energy-media/bess.mp4',
    videoCdn: null,
    accentColor: '#10b981',
    corridors: [
      'Khavda Hybrid BESS Substation (Gujarat)',
      'Bikaner Solar-Storage Interconnect (Rajasthan)',
      'Fatehgarh Pooling Station 765kV (Rajasthan)',
      'Delhi State Load Despatch Center Fast-Reserve Cluster'
    ],
    keyPlants: [
      { name: 'Tata Power DDL Rohini BESS', location: 'Rohini, New Delhi', capacity: '10 MW / 10 MWh', developer: 'Tata Power / AES / Fluence' },
      { name: 'Khavda Mega BESS Pilot', location: 'Kutch, Gujarat', capacity: '500 MW / 1,000 MWh', developer: 'Adani Green / SECI' },
      { name: 'SECI 1200 MWh Standalone BESS Tender', location: 'Fatehgarh, Rajasthan', capacity: '600 MW / 1,200 MWh', developer: 'JSW Energy / SECI' },
      { name: 'Rajnandgaon Solar-Storage Project', location: 'Chhattisgarh', capacity: '100 MW Solar + 40 MW / 120 MWh BESS', developer: 'SECI' }
    ],
    dispatchProfile: 'Ultra-fast sub-second response (<20ms). Charges during mid-day solar trough or midnight wind surplus; discharges during sharp peak stress events.',
    technicalSpecs: {
      technology: 'Lithium Iron Phosphate (LFP) & Sodium-Ion Modular Containerized Packs with Liquid Cooling',
      roundTripEfficiency: '86% - 91% AC-AC efficiency',
      responseLatency: '< 15 milliseconds (Synthetic Inertia capable)',
      thermalManagement: 'Liquid-cooled chilled loops with NFPA 855 fire containment systems',
      cycleLife: '6,000 - 8,000 cycles at 80% Depth of Discharge (DoD)'
    },
    regulatoryFramework: [
      'Viability Gap Funding (VGF) scheme approved by Union Cabinet for 4,000 MWh BESS',
      'CEA Technical Standards for Connectivity of Distributed Generation & Inverter-Based Resources',
      'Ancillary Services Market Regulations 2023 enabling battery arbitrage'
    ],
    advantages: [
      'Instantaneous millisecond ramp rates; replaces noisy diesel rotary systems',
      'Completely modular and deployable inside data center property boundaries',
      'Provides synthetic inertia and dynamic voltage stabilization'
    ],
    limitations: [
      'Degradation over time requiring cell replenishment or augmentation',
      'Supply chain sensitivity to critical cell imports',
      'Limited discharge duration (typically 2 to 4 hours economically optimal)'
    ]
  },
  {
    id: 'small-hydro',
    name: 'Small & Canal Hydro (SHP ≤25 MW)',
    shortName: 'Small Hydro',
    tagline: 'Run-of-the-river continuous clean hydraulic baseload',
    category: 'Hydro',
    badge: 'STAGE 02 // DISTRIBUTED BASELOAD',
    status: 'COMMERCIAL DISTRIBUTED',
    installedCapacityIndia: '5.1 GW',
    targetCapacity2030: '10 GW',
    tariffInrPerKwh: '₹3.40 - ₹4.10',
    tariffUsdPerMwh: '$40.70 - $49.10',
    cufRange: '50% - 70%',
    carbonIntensityGCo2: '14 - 20 gCO₂e/kWh',
    matchingScore247: 88,
    roleInDatacenter: 'Supplies steady non-intermittent run-of-river baseload with minimal land acquisition overhead or reservoir displacement.',
    image: '/energy-media/small-hydro.jpg',
    video: '/energy-media/small-hydro.mp4',
    videoCdn: null,
    accentColor: '#6ee7b7',
    corridors: [
      'Himachal Inter-Valley 132kV Local Feeders',
      'Uttarakhand Alaknanda Basin Grid',
      'Karnataka Western Ghats Canal Network'
    ],
    keyPlants: [
      { name: 'Kutehr Small Hydro', location: 'Ravi River, Himachal Pradesh', capacity: '24 MW', developer: 'JSW Energy' },
      { name: 'Shivanasamudra Historical SHP', location: 'Cauvery River, Karnataka', capacity: '15 MW', developer: 'KPCL' },
      { name: 'Chambal Canal Drop Hydro Plants', location: 'Kota, Rajasthan', capacity: '12 MW', developer: 'RRVUNL' },
      { name: 'Titur Small Hydro Project', location: 'Kullu, Himachal Pradesh', capacity: '10 MW', developer: 'State Nodal Agency' }
    ],
    dispatchProfile: 'Continuous run-of-the-river baseline output 24 hours a day, dictated by river streamflow without massive water containment dams.',
    technicalSpecs: {
      technology: 'Compact Kaplan & Banki Turbines with Induction or Synchronous Alternators',
      environmentalImpact: 'Zero reservoir submergence; water diverted through intake weir and returned 2km downstream',
      operatingCost: 'Lowest OPEX among mechanical generators (< ₹0.20 / kWh maintenance)'
    },
    regulatoryFramework: [
      'MNRE Small Hydro Power Programme with capital subsidies',
      'State Net-Metering and Feed-in-Tariff preferential dispatch priority',
      'Exemption from EIA (Environmental Impact Assessment) requirement for projects <25 MW'
    ],
    advantages: [
      'Non-intermittent 24-hour generation with predictable seasonal flow',
      'Zero greenhouse emissions from reservoir biomass decomposition',
      'Strong community acceptance and decentralized local interconnection'
    ],
    limitations: [
      'Stream discharge drops during extreme winter freezing or dry season',
      'Susceptible to silt and sediment erosion during high Himalayan monsoon runoffs',
      'Geographically dispersed with lower individual project capacities'
    ]
  },
  {
    id: 'biomass',
    name: 'Biomass & Bagasse Cogeneration',
    shortName: 'Biomass / Bio-Energy',
    tagline: 'Agricultural residue & circular carbon thermal baseload',
    category: 'Biomass',
    badge: 'STAGE 02 // THERMAL BASELOAD',
    status: 'COMMERCIAL NON-INTERMITTENT',
    installedCapacityIndia: '10.8 GW',
    targetCapacity2030: '20 GW',
    tariffInrPerKwh: '₹4.60 - ₹5.80',
    tariffUsdPerMwh: '$55.00 - $69.45',
    cufRange: '70% - 85%',
    carbonIntensityGCo2: '45 - 90 gCO₂e/kWh (Carbon Neutral Cycle)',
    matchingScore247: 89,
    roleInDatacenter: 'Firm thermal generation available 24 hours a day; eliminates farm stubble burning in Punjab/Haryana while providing dispatchable baseload.',
    image: '/energy-media/biomass.jpg',
    video: '/energy-media/biomass.mp4',
    videoCdn: null,
    accentColor: '#f59e0b',
    corridors: [
      'Punjab Agro-Energy Evacuation Corridors (Mansa - Patiala)',
      'Uttar Pradesh Sugar Belt 132kV Grid (Meerut - Muzaffarnagar)',
      'Maharashtra Co-gen Transmission Link (Solapur - Kolhapur)'
    ],
    keyPlants: [
      { name: 'Mansa Rice Stubble Biomass Plant', location: 'Mansa, Punjab', capacity: '18 MW', developer: 'Punjab Renewable Energy Systems' },
      { name: 'Dhampur Sugar Mills Bagasse Co-gen', location: 'Bijnor, Uttar Pradesh', capacity: '105 MW', developer: 'Dhampur Bio Organics' },
      { name: 'Nahar Sugar Cogeneration Unit', location: 'Amloh, Punjab', capacity: '24 MW', developer: 'Nahar Industrial Enterprises' },
      { name: 'Oswal Biomass Power Plant', location: 'Muktsar, Punjab', capacity: '14 MW', developer: 'Oswal Group' }
    ],
    dispatchProfile: 'Firm dispatchable thermal output 24/7, operates continuously through the crushing season (Nov-May) and via briquetted agro-pellets year-round.',
    technicalSpecs: {
      technology: 'High-Pressure Travelling Grate Boilers (87 bar, 510°C) with Condensing Steam Turbines',
      feedstock: 'Paddy straw, bagasse, mustard husk, cotton stalks, sawdust pellets',
      efficiency: 'High combined heat and power (CHP) thermal efficiency (>75% co-gen mode)'
    },
    regulatoryFramework: [
      'Ministry of Power Mandate: 5%–7% biomass co-firing in thermal power stations',
      'SATAT (Sustainable Alternative Towards Affordable Transportation) for CBG production',
      'MNRE Central Financial Assistance for agro-pellet plants'
    ],
    advantages: [
      'Zero weather dependency; immune to cloud cover, wind lulls, or low rainfall',
      'Directly combats air pollution by purchasing crop residue otherwise burned as stubble',
      'Provides synchronous rotational inertia and steam co-generation options'
    ],
    limitations: [
      'Feedstock supply chain logistics require disciplined seasonal aggregation',
      'Fuel price volatility over multi-year horizons',
      'Flue gas particulate scrubbing (ESP filters) required for clean stack emissions'
    ]
  },
  {
    id: 'green-hydrogen',
    name: 'Green Hydrogen & Clean Fuel Cells',
    shortName: 'Green Hydrogen',
    tagline: 'Zero-emission replacement for hyperscale diesel generator backup',
    category: 'Hydrogen',
    badge: 'STAGE 04 // CLEAN BACKUP & DIESEL REPLACEMENT',
    status: 'COMMERCIAL PILOTS / SCALE-UP',
    installedCapacityIndia: 'National Mission: 5 MMT/year by 2030',
    targetCapacity2030: '5 Million Metric Tonnes / year',
    tariffInrPerKwh: '₹6.50 - ₹8.50 (Equivalent Levelized)',
    tariffUsdPerMwh: '$77.80 - $101.80',
    cufRange: 'On-Demand / 99.999% Reliability',
    carbonIntensityGCo2: '<5 gCO₂e/kWh',
    matchingScore247: 99,
    roleInDatacenter: 'Direct replacement for Tier III/IV diesel backup generators (gensets); eliminates Scope 1 emissions during prolonged grid disconnects.',
    image: '/energy-media/green-hydrogen.jpg',
    video: '/energy-media/green-hydrogen.mp4',
    videoCdn: null,
    accentColor: '#10b981',
    corridors: [
      'Kandla-Mundra Hydrogen Hub Corridor (Gujarat)',
      'Gopalpur Green Port Corridor (Odisha)',
      'Visakhapatnam-Kakinada Energy Cluster (Andhra Pradesh)'
    ],
    keyPlants: [
      { name: 'NTPC Kawas Green H₂ Blending Project', location: 'Surat, Gujarat', capacity: '1 MW Electrolyzer', developer: 'NTPC / Bloom Energy' },
      { name: 'L&T Hazira Green Hydrogen Plant', location: 'Hazira, Gujarat', capacity: '800 kg/day', developer: 'Larsen & Toubro' },
      { name: 'Adani New Industries Khavda H₂ Hub', location: 'Kutch, Gujarat', capacity: '1 MMTPA Targeted', developer: 'Adani New Industries' },
      { name: 'GAIL Vijaipur PEM Electrolyzer', location: 'Guna, Madhya Pradesh', capacity: '10 MW PEM', developer: 'GAIL India' }
    ],
    dispatchProfile: 'Electrolyzers produce hydrogen during low-cost surplus solar hours. Stored hydrogen powers Solid Oxide Fuel Cells (SOFC) or hydrogen IC engines on demand within seconds.',
    technicalSpecs: {
      technology: 'Proton Exchange Membrane (PEM) & Alkaline Electrolyzers + High-Temp Fuel Cells',
      purity: '99.999% Grade D Hydrogen fuel quality',
      storageMode: '350 - 700 bar Type IV Carbon Fiber composite cylinders or underground salt caverns',
      emissions: 'Pure distilled water vapor is the sole operational exhaust byproduct'
    },
    regulatoryFramework: [
      'National Green Hydrogen Mission (₹19,744 Crore outlay approved by Union Cabinet)',
      'SIGHT Scheme (Strategic Interventions for Green Hydrogen Transition) electrolyzer incentives',
      'Free inter-state transmission for 25 years for green hydrogen production projects'
    ],
    advantages: [
      'True 100% elimination of on-site diesel exhaust and soot particulate emissions',
      'Multi-day standby duration capable of sustaining 72+ hour grid blackout scenarios',
      'Whisper-quiet operational acoustics (<65 dB vs >105 dB for heavy diesel engines)'
    ],
    limitations: [
      'Higher equipment cost for fuel cell stacks compared to traditional diesel generators',
      'Hydrogen storage safety and footprint zoning regulations in urban data center clusters',
      'Electrolyzer conversion round-trip efficiency losses (approx 45–55% electrical-to-electrical)'
    ]
  },
  {
    id: 'geothermal',
    name: 'Geothermal Subsurface Energy',
    shortName: 'Geothermal Energy',
    tagline: 'High-enthalpy subsurface volcanic & tectonic thermal baseload',
    category: 'Geothermal',
    badge: 'STAGE 02 // ZERO-FLUCTUATION BASELOAD',
    status: 'PILOT DEMONSTRATION',
    installedCapacityIndia: '50 MW Pilot Pipeline',
    targetCapacity2030: '1,000 MW Exploratory',
    tariffInrPerKwh: '₹4.50 - ₹5.50 (Projected)',
    tariffUsdPerMwh: '$53.90 - $65.80',
    cufRange: '88% - 94%',
    carbonIntensityGCo2: '15 - 25 gCO₂e/kWh',
    matchingScore247: 98,
    roleInDatacenter: 'Continuous constant-temperature zero-fluctuation baseload in high-altitude cold environments; offers dual-use direct liquid cooling sink.',
    image: '/energy-media/geothermal.jpg',
    video: '/energy-media/geothermal.mp4',
    videoCdn: null,
    accentColor: '#a7f3d0',
    corridors: [
      'Leh-Puga 66kV High Altitude Transmission Link (Ladakh)',
      'Himachal Beas Valley Geothermal Microgrid',
      'Tattapani Thermal Fault Line Corridor (Chhattisgarh)'
    ],
    keyPlants: [
      { name: 'Puga Valley Geothermal Pilot', location: 'Changthang Valley, Ladakh', capacity: '1 - 7 MW (Phase 1)', developer: 'ONGC Energy Centre' },
      { name: 'Chumathang Geothermal Prospect', location: 'Indus Basin, Ladakh', capacity: '5 MW Proposed', developer: 'Geological Survey of India / ONGC' },
      { name: 'Tattapani Geothermal Field', location: 'Balrampur, Chhattisgarh', capacity: '3 MW Experimental', developer: 'NTPC / CREDA' },
      { name: 'Manikaran Geothermal Springs', location: 'Kullu, Himachal Pradesh', capacity: 'Pilot Facility', developer: 'CEA / IIT Bombay' }
    ],
    dispatchProfile: 'Rock-solid 100% constant power output 365 days a year. Independent of atmospheric weather, cloud cover, water discharge, or seasonal variations.',
    technicalSpecs: {
      technology: 'Binary Cycle Organic Rankine Cycle (ORC) power plants utilizing high-temp isobutane working fluid',
      subsurfaceTemperature: '160°C - 220°C at 500m - 1000m depth',
      directCoolingSynergy: 'Subsurface fluid heat exchange can serve as high-efficiency heat rejection for server racks',
      footprint: 'Extremely compact surface footprint per megawatt'
    },
    regulatoryFramework: [
      'MNRE Geothermal Policy Draft and exploration incentives',
      'Ladakh Union Territory Renewable Energy Master Plan for sub-zero strategic bases',
      'ONGC Mission Geothermal exploration roadmap'
    ],
    advantages: [
      'Highest capacity factor (>90%) of any renewable technology without any storage',
      'Zero fuel replenishment cost or transport logistics in remote mountain regions',
      'Unmatched resilience in harsh Himalayan sub-zero data center siting environments'
    ],
    limitations: [
      'High deep subsurface exploratory drilling capital risk',
      'Geographically restricted to specific tectonic fault lines and volcanic anomalies',
      'Initial projects in India are still transitioning from pilot to commercial scale'
    ]
  }
];

export const getEnergySourceById = (id) => {
  return ENERGY_SOURCES.find((source) => source.id === id) || ENERGY_SOURCES[0];
};

export const ENERGY_SOURCE_CATEGORIES = [
  'All Sources',
  'Solar',
  'Wind',
  'Hydro',
  'Storage',
  'Biomass',
  'Hydrogen',
  'Geothermal'
];
