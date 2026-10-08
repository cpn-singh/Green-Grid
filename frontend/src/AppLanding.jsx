import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Globe,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Database,
  Info,
  Server,
  Activity,
  Flame,
  Radio
} from 'lucide-react'
import { Logo3D, BackgroundScene } from './components/ui'

// ─── 01 // EXECUTIVE SNAPSHOT METRICS (OCTOBER 2026 BENCHMARK) ───────────────

const EXECUTIVE_SNAPSHOT = [
  { value: '~1.75 GW / ~2 GW', label: 'India Operational DC Capacity', note: '~1.75 GW operational by mid-2026; ~2 GW expected by end-2026' },
  { value: '135 GW / 50 GWh', label: 'Green Energy Corridor III', note: '₹1.86 lakh crore approved national RE evacuation & storage backbone' },
  { value: '₹3.20–₹4.50', label: 'C&I Renewable PPA / kWh', note: 'State-dependent commercial & industrial procurement benchmark' },
  { value: '~₹2.50–₹3.00', label: 'Utility Auction Benchmark', note: 'Ex-busbar generation tariff (delivered cost varies by state wheeling & CSS/AS)' },
]

// ─── 02 // MAJOR AI & HYPERSCALE DATA CENTERS IN INDIA ────────────────────────

const INDIAN_AI_DATA_CENTERS = [
  {
    name: 'Yotta – D2',
    operator: 'Yotta Data Services',
    location: 'Greater Noida, UP (Knowledge Park V)',
    capacity: '60 MW IT Load (Scalable to 250 MW)',
    specs: '20,736 NVIDIA Blackwell Ultra GPUs; High-density liquid cooled',
    pue: '1.22',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'Yotta – NM1',
    operator: 'Yotta Data Services',
    location: 'Panvel / Navi Mumbai, MH (Hiranandani Fortune City)',
    capacity: '52 MW IT Load (Park scalable to ~1 GW)',
    specs: 'Tier IV; 7,000+ racks; PUE <1.5; Enterprise AI & cloud',
    pue: '1.25',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'Yotta – D1',
    operator: 'Yotta Data Services',
    location: 'Greater Noida, Uttar Pradesh',
    capacity: '30 MW IT Load (Expandable to 50 MW)',
    specs: 'Tier III+; Energy-efficient cooling; Cloud colocation',
    pue: '1.32',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'Yotta – G1',
    operator: 'Yotta Data Services',
    location: 'GIFT City, Gandhinagar, Gujarat',
    capacity: '1 MW IT Load (Scalable)',
    specs: 'District cooling + DX redundancy; Low-latency fintech edge',
    pue: '1.28',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'Yotta – NDC NER',
    operator: 'Yotta Data Services',
    location: 'Guwahati, Assam',
    capacity: 'Scalable to 8 MW',
    specs: 'Tier III; IGBC Gold; National AI & sovereign digital infrastructure',
    pue: '1.35',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'AdaniConneX – Visakhapatnam',
    operator: 'AdaniConneX',
    location: 'Visakhapatnam, Andhra Pradesh',
    capacity: '1 GW Potential IT Load',
    specs: 'Next-generation national digital/AI megahub; Phase 1 Dec 2028',
    pue: '1.18',
    status: 'Phase 1 Dec 2028',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with dedicated Khavda RE & transmission lines.'
  },
  {
    name: 'AdaniConneX – Navi Mumbai',
    operator: 'AdaniConneX',
    location: 'Navi Mumbai, Maharashtra',
    capacity: '1,000 MW Potential IT Load',
    specs: 'Exascale AI campus; direct 400kV substation interconnect; RFS Dec 2026',
    pue: '1.20',
    status: 'RFS Dec 2026 onward',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'AdaniConneX – Hyderabad',
    operator: 'AdaniConneX',
    location: 'Hyderabad, Telangana',
    capacity: '600 MW Potential IT Load',
    specs: 'Hyperscale campus; Phase 1 live Oct 2024; High-density compute',
    pue: '1.22',
    status: 'Phase 1 Live',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, backed by Greenko pumped hydro and solar PPAs.'
  },
  {
    name: 'AdaniConneX – Pune',
    operator: 'AdaniConneX',
    location: 'Pune, Maharashtra',
    capacity: '250 MW Potential IT Load',
    specs: 'Hyperscale AI infrastructure; Phase 1 live Oct 2025',
    pue: '1.24',
    status: 'Phase 1 Live Oct 2025',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'AdaniConneX – Noida',
    operator: 'AdaniConneX',
    location: 'Noida, Uttar Pradesh',
    capacity: '150 MW Potential IT Load',
    specs: 'Hyperscale campus; Phase 1 live Jan 2025',
    pue: '1.26',
    status: 'Phase 1 Live Jan 2025',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'AdaniConneX – Chennai 1',
    operator: 'AdaniConneX',
    location: 'Chennai, Tamil Nadu',
    capacity: '33 MW Potential IT Load',
    specs: '99.999% design availability; AI liquid-cooling readiness',
    pue: '1.25',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.'
  },
  {
    name: 'Digital Edge – BOM Campus',
    operator: 'Digital Edge',
    location: 'Navi Mumbai, Maharashtra',
    capacity: '350 MW Campus',
    specs: '83 MW solar PPA planned from Dec 2026; Recycled greywater liquid cooling',
    pue: '1.20',
    status: 'Active Expansion',
    renewableNote: 'Supplied through a combination of grid electricity and contracted 83 MW solar PPA, backed by BESS storage and recycled cooling water.'
  },
  {
    name: 'Sify Technologies DGX-Ready AI Campus',
    operator: 'Sify Technologies',
    location: 'Mumbai & Chennai',
    capacity: '309.6 MWp RE PPAs Contracted',
    specs: 'NVIDIA-certified DGX-ready facilities; high-density liquid cooling',
    pue: '1.25',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, reducing carbon footprint through 309.6 MWp PPAs.'
  },
  {
    name: 'Equinix India (MB1 & MB2)',
    operator: 'Equinix',
    location: 'Mumbai (Chandivali & Navi Mumbai)',
    capacity: '33 MW Captive CleanMax PPA',
    specs: 'International Business Exchange; carrier-neutral AI interconnection',
    pue: '1.30',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and 33 MW captive solar-wind hybrid PPA with CleanMax.'
  },
  {
    name: 'Web Werks / Iron Mountain',
    operator: 'Web Werks & Iron Mountain JV',
    location: 'Navi Mumbai (Rabale), Maharashtra',
    capacity: '32M kWh Clean-Energy PPA',
    specs: 'Hyperscale colocation; energy-efficient chilling; Edge AI hubs',
    pue: '1.35',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted 32 million kWh annual solar-wind PPA.'
  },
  {
    name: 'Nxtra by Airtel',
    operator: 'Airtel Nxtra',
    location: 'Chennai, Mumbai, Pune, Kolkata',
    capacity: 'Expanding National Portfolio',
    specs: 'Hyperscale & enterprise colocation across 12+ large campuses',
    pue: '1.38',
    status: 'Operational',
    renewableNote: 'Supplied through a combination of grid electricity and contracted renewable generation, actively expanding corporate open-access PPAs.'
  }
]

// ─── 03 // MAJOR RENEWABLE ENERGY DEVELOPERS & SUPPLIERS IN INDIA ────────────

const RENEWABLE_SUPPLIERS = [
  {
    name: 'Adani Green Energy (AGEL)',
    hq: 'Ahmedabad HQ · Khavda, Kutch, Gujarat',
    type: 'Utility-Scale IPP',
    capacity: '20+ GW Operational (Jul 2026)',
    mix: 'Solar · Wind · Hybrid · BESS',
    storageInfo: '>52B units annual clean gen; Khavda 30 GW target; FY26 sales 37,567 MU; FY26 rev ₹11,602 cr',
    pricing: 'Project / PPA-specific'
  },
  {
    name: 'ReNew (ReNew Power)',
    hq: 'Gurugram HQ · Pan-India sites',
    type: 'Utility-Scale IPP / C&I',
    capacity: '~12.6 GW Operating (~20 GW Gross Mar 2026)',
    mix: 'Solar · Wind · BESS',
    storageInfo: 'FY26 commissioned ~2.4 GW (1.75 GW solar + 0.62 GW wind + 25 MW/100 MWh BESS)',
    pricing: 'Negotiated PPA-specific'
  },
  {
    name: 'Tata Power Renewable Energy (TPREL)',
    hq: 'Mumbai · Generation nationwide · Tirunelveli fab',
    type: 'Utility-Scale IPP / C&I',
    capacity: '11.6 GW Total Utility (6.3 GW Operational)',
    mix: 'Solar · Wind · Hybrid/FDRE · Storage',
    storageInfo: 'Operational: 5.1 GW solar + 1.2 GW wind; 9.4 GW contracted PPA pipeline',
    pricing: 'State / PPA-specific'
  },
  {
    name: 'Avaada Energy',
    hq: 'India-wide · Bikaner, Rajasthan',
    type: 'Utility-Scale IPP',
    capacity: '~7.2–7.3 GWp Operational (>17.7 GWp Pipeline)',
    mix: 'Solar · Wind · Hybrid · FDRE · Storage',
    storageInfo: 'Flagship Bikaner 1.25 GWp single-site solar; Integrated AI-ready DC clean power provider',
    pricing: 'Contract-specific'
  },
  {
    name: 'JSW Energy (JSW Neo Energy)',
    hq: 'Mumbai · Projects across India',
    type: 'Utility-Scale IPP',
    capacity: '~9.19 GW RE Operational (15.15 GW Total Platform)',
    mix: 'Wind · Solar · Hybrid · Hydro · BESS · Pumped Hydro',
    storageInfo: '29.6 GWh storage locked in; Target 30 GW gen + 40 GWh storage by 2030 (e.g. ₹3.65/kWh wind PPA)',
    pricing: 'Tender / PPA-specific'
  },
  {
    name: 'Greenko Group',
    hq: 'Hyderabad HQ · Andhra Pradesh & Karnataka',
    type: 'Pumped Hydro & RTC Platform',
    capacity: 'Integrated Renewable + Storage Platform',
    mix: 'Hydro · Solar · Wind · Pumped Hydro',
    storageInfo: 'Pinnapuram IREP: 1,200 MW pumped hydro + 2,000 MW solar + 400 MW wind delivering 24/7 firm power',
    pricing: 'RTC / FDRE tender-specific'
  },
  {
    name: 'NTPC Green Energy (NGEL)',
    hq: 'New Delhi HQ · Projects nationwide',
    type: 'PSU Utility IPP',
    capacity: 'Large PSU-Backed Pipeline (60 GW by 2032)',
    mix: 'Solar · Wind · Hybrid · Storage',
    storageInfo: 'State-backed mega solar/wind parks in Gujarat & Rajasthan; High-voltage grid access',
    pricing: 'Tender / PPA-specific'
  },
  {
    name: 'ACME Solar',
    hq: 'New Delhi · Major projects in Rajasthan',
    type: 'Utility-Scale IPP',
    capacity: '~2.8 GW Solar Operational (Jun 2025)',
    mix: 'Solar · Wind · Hybrid · FDRE',
    storageInfo: 'Expanding hybrid/FDRE pipeline with recent Bikaner hybrid commissioning linked to NTPC PPA',
    pricing: 'PPA / Tender-specific'
  },
  {
    name: 'Sembcorp Green Infra',
    hq: 'India-wide presence',
    type: 'Utility-Scale IPP & C&I',
    capacity: 'Major Multi-Gigawatt Portfolio',
    mix: 'Solar · Wind · Hybrid · Storage',
    storageInfo: 'Comprehensive renewable platform offering structured off-site open access contracts',
    pricing: 'Open-access quote required'
  },
  {
    name: 'Serentica Renewables',
    hq: 'Hyderabad / Pan-India',
    type: 'Firm Renewable / RTC Specialist',
    capacity: '4+ GW Contracted Pipeline',
    mix: 'Wind · Solar · Storage · Firm RE',
    storageInfo: 'Specialist in round-the-clock firm renewable delivery for heavy industrial and AI compute consumers',
    pricing: 'Negotiated RTC/FDRE pricing'
  },
  {
    name: 'CleanMax',
    hq: 'Mumbai / Pan-India',
    type: 'C&I Renewable Specialist',
    capacity: '2.0 GW C&I Portfolio',
    mix: 'Solar · Wind · Hybrid',
    storageInfo: 'C&I sourcing leader powering Equinix Mumbai (33 MW captive PPA) and Web Werks (32M kWh PPA)',
    pricing: 'Benchmark: ₹3.20–₹4.50/kWh'
  },
  {
    name: 'Sunsure Energy',
    hq: 'Bengaluru / Pan-India',
    type: 'C&I Renewable Specialist',
    capacity: '1.5 GW Developed / Under Execution',
    mix: 'Solar · Wind · Hybrid',
    storageInfo: 'Industrial decarbonisation partner backed by Partners Group; Open-access & group captive',
    pricing: 'State / Contract-specific'
  },
  {
    name: 'Fourth Partner Energy',
    hq: 'Hyderabad / Pan-India',
    type: 'C&I Renewable Specialist',
    capacity: '1.4 GW C&I Portfolio',
    mix: 'Solar · Hybrid · BESS · C&I',
    storageInfo: 'Backed by British International Investment; Onsite solar, wind-solar hybrids, and offsite open-access',
    pricing: 'Project / Contract-specific'
  },
  {
    name: 'Hero Future Energies',
    hq: 'New Delhi / Pan-India',
    type: 'C&I Renewable Specialist',
    capacity: '1.6 GW Operating / Pipeline',
    mix: 'Wind · Solar · Hybrid · BESS',
    storageInfo: 'Backed by KKR; Specializing in peak-time load-following power solutions and corporate PPAs',
    pricing: 'PPA / Project-specific'
  },
  {
    name: 'Suzlon Group',
    hq: 'Pune HQ · Muppandal, Tamil Nadu',
    type: 'EPC / Renewable Infrastructure',
    capacity: '20+ GW Global Wind Integration',
    mix: 'Wind · Hybrid',
    storageInfo: 'India wind energy pioneer executing high-CUF turbine integration across high-wind corridors',
    pricing: 'Turnkey EPC / Behind-the-meter'
  },
  {
    name: 'Sterling and Wilson Renewable Energy',
    hq: 'Mumbai HQ · Kurnool, Andhra Pradesh',
    type: 'EPC / Renewable Infrastructure',
    capacity: '15+ GW Global Solar & BESS EPC',
    mix: 'Solar · BESS',
    storageInfo: 'Turnkey EPC contractor for ultra-mega solar parks (e.g. Kurnool, AP) and utility-scale BESS',
    pricing: 'Turnkey EPC benchmark'
  }
]

// ─── 04 // GLOBAL LARGEST AI DATA CENTERS BENCHMARK ──────────────────────────

const GLOBAL_AI_DATA_CENTERS = [
  {
    name: 'xAI Colossus (xAI / SpaceXAI)',
    location: 'Memphis, Tennessee & Southaven, Mississippi, USA',
    power: 'Hundreds of MW current; 1.2 GW permanent generation',
    strategy: 'Utility grid + natural gas + 240+ batteries. Normal operations use MLGW electricity; temporary gas turbines and 240+ batteries deployed; 1.2 GW permanent gas generation plant under development in Southaven.'
  },
  {
    name: 'Amazon AI Data Center Campuses (AWS / Anthropic)',
    location: 'Northern Indiana, USA',
    power: '2.4 GW planned data-center capacity',
    strategy: 'Utility grid + new generation. NIPSCO agreement supports new generation and transmission infrastructure, with Amazon also investing in local renewable projects.'
  },
  {
    name: 'Microsoft Fairwater',
    location: 'Mount Pleasant, Wisconsin, USA',
    power: '~369 MW current IT power; Multi-GW planned',
    strategy: 'Regional utility grid + carbon-free energy strategy. Operational in 2026; Microsoft\'s flagship high-power AI supercomputer facility.'
  },
  {
    name: 'Meta Prometheus',
    location: 'New Albany, Ohio, USA',
    power: '~471 MW current IT power; ~1.0 GW projected',
    strategy: 'PJM/AEP Ohio grid + large-scale renewable-energy procurement contracts supporting corporate net-zero targets.'
  },
  {
    name: 'OpenAI Stargate — Abilene',
    location: 'Abilene, Texas, USA',
    power: 'Operational frontier training campus',
    strategy: 'ERCOT grid + large-scale energy infrastructure; operates on Oracle Cloud Infrastructure training and serving frontier AI models.'
  },
  {
    name: 'OpenAI / SB Energy Stargate Site',
    location: 'Milam County, Texas, USA',
    power: '1.2 GW initial data-center lease',
    strategy: 'Large-scale dedicated AI infrastructure; OpenAI selected SB Energy to build and operate the 1.2 GW Stargate development.'
  },
  {
    name: 'AWS / Talen Cumulus Data Center Campus',
    location: 'Berwick, Pennsylvania, USA',
    power: 'Up to ~960 MW planned scale',
    strategy: 'Nuclear + grid. Colocated directly adjacent to the Susquehanna 2.5 GW nuclear generating station providing round-the-clock firm low-carbon power.'
  },
  {
    name: 'YTL Green Data Center Park',
    location: 'Johor, Malaysia',
    power: 'Up to 500 MW data-center target',
    strategy: 'Dedicated 500 MW solar generation + grid infrastructure; first Sea phase is up to 72 MW.'
  }
]

// ─── 05 // KEY ENERGY-SUPPLY TRENDS IN AI INFRASTRUCTURE ─────────────────────

const ENERGY_SUPPLY_TRENDS = [
  {
    title: 'Grid Power + Behind-the-Meter Generation',
    icon: Flame,
    desc: 'Campus demand often exceeds local electrical substation capacity. Operators pair utility connections with dedicated substations, temporary turbines, and permanent gas/hybrid plants (e.g. xAI Colossus 1.2 GW permanent generation).'
  },
  {
    title: 'Nuclear Power Colocation & Upgrades',
    icon: Radio,
    desc: 'Nuclear provides firm, low-carbon baseload electricity 24/7. Hyperscalers are contracting directly with nuclear plants (e.g. AWS Cumulus Susquehanna colocation; Google 20-year agreement with Constellation for 890 MW of nuclear capacity).'
  },
  {
    title: 'Renewable PPAs & Dedicated Generation',
    icon: Zap,
    desc: 'Renewable procurement spans physical PPAs, virtual PPAs (vPPAs), green tariffs, open access, and group-captive SPVs. Note: renewable contracts match energy balance but do not mean direct physical electron delivery from a specific farm.'
  },
  {
    title: 'Battery Energy Storage Systems (BESS)',
    icon: Activity,
    desc: 'BESS smooths short-term GPU load swings, protects against grid disturbances, shaves peak tariff charges, and shifts solar/wind generation into evening compute hours (e.g. xAI Colossus operating >240 batteries).'
  },
  {
    title: 'Round-the-Clock (RTC) Renewable Energy',
    icon: Layers,
    desc: 'Intermittent solar and wind alone cannot sustain Tier 4 data centers. Modern AI campuses deploy Solar + Wind + BESS + Pumped Hydro + Grid backup to provide contractually guaranteed 24/7 power.'
  }
]

// ─── 06 // HOW RENEWABLE POWER REACHES AN AI DATA CENTER ──────────────────────

const SOURCING_MODELS = [
  {
    code: '01',
    title: 'Virtual / Financial Sourcing (vPPA / CfD)',
    highlight: 'Financial Contract-for-Differences // I-RECs',
    desc: 'The data center remains connected to the normal grid while renewable generation is contractually matched through a vPPA or CfD, bundled with auditable International Renewable Energy Certificates (I-RECs).'
  },
  {
    code: '02',
    title: 'Physical PPA / Open Access',
    highlight: 'Grid-Wheeled Clean Power // Surcharge Waivers',
    desc: 'Electricity from an off-site solar, wind, or hybrid project is physically wheeled across ISTS (inter-state) or InSTS (intra-state) transmission lines directly to the data center substation under CERC Open Access rules.'
  },
  {
    code: '03',
    title: 'RTC / FDRE Architecture',
    highlight: 'Firm & Dispatchable Renewable Energy // 24/7 Baseload',
    desc: 'Solar and high-CUF wind are combined with 4–8 hour BESS or utility-scale pumped-hydro storage (e.g. Greenko Pinnapuram) to deliver contractual 85%–99% continuous baseload availability.'
  },
  {
    code: '04',
    title: 'Behind-the-Meter Generation & Storage',
    highlight: 'Campus-Adjacent Generation // Zero Wheeling Losses',
    desc: 'Generation or utility-scale battery storage is colocated directly on or adjacent to the data-center campus, eliminating external transmission bottlenecks and state open-access cross-subsidy charges.'
  }
]

// ─── 07 // PRICING AND PROCUREMENT COST LAYERS ───────────────────────────────

const PRICING_COST_LAYERS = [
  { layer: 'Generation / PPA Tariff', detail: '₹/kWh contract tariff based on technology mix, CUF, and term (10–25 yrs)', treatment: 'Project & developer specific' },
  { layer: 'Open-Access Charges', detail: 'Inter-state (ISTS) and intra-state (InSTS) transmission + wheeling fees', treatment: 'State / Central CERC regulated (ISTS waiver applicable)' },
  { layer: 'CSS & Additional Surcharge', detail: 'Cross-Subsidy Surcharge (CSS) and Additional Surcharge (AS)', treatment: '100% exempt under Green Open Access / Group Captive (26% equity)' },
  { layer: 'Banking Charges', detail: 'Energy banking fees, seasonal banking limits, and monthly settlement rules', treatment: 'State DISCOM specific regulation' },
  { layer: 'Standby / Grid Support', detail: 'Charges for DISCOM backup power during scheduled renewable plant downtime', treatment: 'State tariff order schedule' },
  { layer: 'BESS / Storage Firming', detail: 'Levelized cost of storage (LCOS) for battery or pumped hydro time-shifting', treatment: 'Project-specific contract formula' },
  { layer: 'REC / Green Attribute', detail: 'Treatment and bundled pricing of Indian Energy Attribute Certificates', treatment: 'Included in PPA or traded separately' },
  { layer: 'Connection & Substation Bay', detail: 'Dedicated 400kV/220kV substation bay allocation, transformer step-down', treatment: 'Developer capital expenditure' },
]

const VIDEO_SCENES = [
  { id: 1, src: '/scene_approach_1.mp4', label: 'Aerial Substation Ingress' },
  { id: 2, src: '/scene_approach_2.mp4', label: 'Campus Transmission Bay' },
  { id: 3, src: '/hero.mp4', label: 'High-Voltage Clean Power Grid' },
]

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

function Hero({ isRevealed: controlledRevealed, setIsRevealed: setControlledRevealed } = {}) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [canPreloadScene1, setCanPreloadScene1] = useState(false)

  const sectionRef = useRef(null)
  const videoRefs = useRef([])
  const activeSceneRef = useRef(0)
  const revealTimerRef = useRef(null)
  const hasTriggeredRef = useRef(false)
  const userToggledRef = useRef(false)

  const [internalRevealed, setInternalRevealed] = useState(false)
  const isRevealed = controlledRevealed !== undefined ? controlledRevealed : internalRevealed
  const setIsRevealed = setControlledRevealed || setInternalRevealed

  const triggerReveal = () => {
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true
    setIsRevealed(true)
  }

  const advanceScene = () => {
    const cur = activeSceneRef.current
    const next = (cur + 1) % VIDEO_SCENES.length
    activeSceneRef.current = next
    setActiveSceneIndex(next)

    const nextVid = videoRefs.current[next]
    if (nextVid) {
      if (!nextVid.src) {
        nextVid.src = VIDEO_SCENES[next].src
      }
      nextVid.currentTime = 0
      nextVid.play().catch(() => {})
    }

    setTimeout(() => {
      const prevVid = videoRefs.current[cur]
      if (prevVid && cur !== next) {
        prevVid.pause()
      }
    }, 700)

    if (next === 2 && !hasTriggeredRef.current) {
      setTimeout(triggerReveal, 2000)
    }
  }

  useEffect(() => {
    const vid0 = videoRefs.current[0]
    if (vid0) {
      vid0.currentTime = 0
      vid0.muted = true
      vid0.play().catch(() => {})
    }

    // Stagger loading: let scene 0 stream smoothly first, buffer scene 1 after 1.5s
    const preloadTimer = setTimeout(() => {
      setCanPreloadScene1(true)
    }, 1500)

    const unlockAudio = () => {
      if (userToggledRef.current) return
      setIsMuted(false)
      videoRefs.current.forEach(v => {
        if (v) v.muted = false
      })
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
    window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true })
    window.addEventListener('click', unlockAudio, { passive: true, once: true })
    window.addEventListener('keydown', unlockAudio, { passive: true, once: true })

    clearTimeout(revealTimerRef.current)
    revealTimerRef.current = setTimeout(triggerReveal, 7000)

    const observer = new IntersectionObserver(
      ([entry]) => {
        const curVid = videoRefs.current[activeSceneRef.current]
        if (!curVid) return
        if (entry.isIntersecting) {
          curVid.play().catch(() => {})
        } else {
          curVid.pause()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      clearTimeout(revealTimerRef.current)
      clearTimeout(preloadTimer)
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      observer.disconnect()
    }
  }, [])

  const toggleSound = (e) => {
    e.stopPropagation()
    userToggledRef.current = true
    const newMuted = !isMuted
    setIsMuted(newMuted)
    videoRefs.current.forEach(v => {
      if (v) v.muted = newMuted
    })
  }

  const replayIntro = (e) => {
    if (e) e.stopPropagation()
    hasTriggeredRef.current = false
    setIsRevealed(false)
    activeSceneRef.current = 0
    setActiveSceneIndex(0)

    const vid0 = videoRefs.current[0]
    if (vid0) {
      vid0.currentTime = 0
      vid0.play().catch(() => {})
    }

    clearTimeout(revealTimerRef.current)
    revealTimerRef.current = setTimeout(triggerReveal, 7000)
  }

  return (
    <section
      ref={sectionRef}
      onClick={!isRevealed ? triggerReveal : undefined}
      className={`relative w-full min-h-screen overflow-hidden flex flex-col justify-between bg-[#080b09] ${
        !isRevealed ? 'cursor-pointer' : ''
      }`}
    >
      {VIDEO_SCENES.map((scene, idx) => {
        const shouldLoad = idx === 0 || (idx === 1 && canPreloadScene1) || activeSceneIndex >= idx - 1
        const preloadMode = idx === 0 ? 'auto' : (shouldLoad ? 'auto' : 'none')

        return (
          <video
            key={scene.id}
            ref={el => (videoRefs.current[idx] = el)}
            src={shouldLoad ? scene.src : undefined}
            autoPlay={idx === 0}
            muted={isMuted}
            playsInline
            preload={preloadMode}
            loop={idx === 2}
            onEnded={idx < 2 ? advanceScene : undefined}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out transform-gpu pointer-events-none ${
              activeSceneIndex === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          />
        )
      })}

      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ${
          isRevealed ? 'opacity-55 bg-gradient-to-b from-[#080b09]/40 via-[#080b09]/65 to-[#080b09]/85' : 'opacity-25 bg-black/40'
        }`}
      />

      <div className="relative z-30 pt-20 sm:pt-24 px-4 sm:px-6 md:px-12 flex justify-between items-center gap-2">
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#6b7c72] truncate max-w-[200px] sm:max-w-none">
          [ CERC § 41.2 GREEN ENERGY OPEN ACCESS ]
        </div>
        <button
          onClick={toggleSound}
          className="btn-busbar !py-1 !px-2.5 !text-[10px] sm:!text-[11px] !border-[#19241d] shrink-0"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#6b7c72]" />
              <span>Audio Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#22c55e]" />
              <span className="text-[#22c55e]">Audio On</span>
            </>
          )}
        </button>
      </div>

      <div className="relative z-30 px-6 md:px-12 max-w-5xl mx-auto text-center my-auto py-12">
        <div
          className={`transition-all duration-1000 ease-out flex flex-col items-center ${
            isRevealed
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          <div
            onClick={replayIntro}
            title="Click to replay video intro"
            className="cursor-pointer mb-6 group relative min-h-[200px] flex items-center justify-center"
          >
            {isRevealed && <Logo3D size={200} className="sm:w-[240px] sm:h-[240px]" />}
          </div>

          <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#22c55e] mb-3">
            National Renewable Energy &amp; AI Infrastructure Platform
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight leading-[0.98] max-w-4xl">
            Powering India's <span className="text-[#22c55e]">Gigawatt-Scale AI</span> Compute.
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#6b7c72] max-w-2xl font-sans leading-relaxed">
            Planning, procurement, and high-voltage transmission structuring connecting hyperscale data centers to verified round-the-clock solar, wind, BESS, and pumped-hydro generation.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#indian-dcs" className="btn-signal">
              <span>View Indian AI Data Centers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a href="#suppliers" className="btn-busbar">
              <Database className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Renewable Suppliers</span>
            </a>
            <Link to="/map" className="btn-busbar">
              <Globe className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>National GIS Radar</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-30 border-t border-[#19241d] bg-[#080b09]/80 py-3.5 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-mono text-[#6b7c72]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[#f0f4f1]">GEC III APPROVED: 135 GW RE EVACUATION · 50 GWh BESS</span>
          <span>• ₹1.86 LAKH CRORE INVESTMENT</span>
        </div>
        <div>MUMBAI · NOIDA · CHENNAI · HYDERABAD · PUNE · VIZAG</div>
      </div>
    </section>
  )
}

// ─── 01 // EXECUTIVE SNAPSHOT & NATIONAL CAPACITY LEDGER ─────────────────────

function ExecutiveSnapshotLedger() {
  return (
    <section className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72] flex items-center justify-between">
          <span>01 // Executive Snapshot · Indian Data Center Power Market</span>
          <span className="text-[#22c55e]">Research Snapshot: October 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-14 border-b border-[#19241d]">
          {EXECUTIVE_SNAPSHOT.map((m) => (
            <div key={m.label} className="relative">
              <span className="tech-crosshair tl">+</span>
              <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-[#f0f4f1] tracking-tight">
                {m.value}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#22c55e] mt-2">
                {m.label}
              </div>
              <div className="text-xs text-[#6b7c72] mt-1.5 font-sans leading-relaxed">
                {m.note}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Guidance Badge */}
        <div className="pt-8 flex items-start gap-3 bg-black/40 border border-[#19241d] p-4 text-xs font-mono text-[#6b7c72]">
          <Info className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#f0f4f1] font-bold">Procurement Distinction: </span>
            Utility-scale auction generation tariffs (~₹2.50–₹3.00/kWh ex-busbar) are not the same as final delivered data center electricity cost. Landed cost incorporates transmission, wheeling, cross-subsidy surcharges, banking, and firming/BESS charges.
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 02 // DISPATCH SIZING ENGINE ─────────────────────────────────────────────

function DispatchSizingEngine() {
  const [loadMw, setLoadMw] = useState(60)
  const [mode, setMode] = useState('hybrid')

  const calculations = useMemo(() => {
    if (mode === 'solar_wind') {
      return {
        firmness: 68.5,
        tariff: '₹3.10–₹3.30',
        solar: Math.round(loadMw * 1.8),
        wind: Math.round(loadMw * 1.2),
        bess: 0,
        assessment: 'Unbuffered solar and wind. Subject to diurnal duck curve and state DISCOM banking limits.'
      }
    } else if (mode === 'hybrid') {
      return {
        firmness: 89.2,
        tariff: '₹3.40–₹3.75',
        solar: Math.round(loadMw * 2.2),
        wind: Math.round(loadMw * 1.4),
        bess: Math.round(loadMw * 4),
        assessment: 'Solar and wind backed by 4-hour battery storage (BESS). Covers evening peak without diesel dispatch.'
      }
    } else {
      return {
        firmness: 99.4,
        tariff: '₹3.80–₹4.25',
        solar: Math.round(loadMw * 2.6),
        wind: Math.round(loadMw * 1.8),
        bess: Math.round(loadMw * 8),
        assessment: 'Round-the-clock firm dispatch (FDRE) with pumped hydro storage and multi-state transmission wheeling.'
      }
    }
  }, [loadMw, mode])

  return (
    <section id="sizing" className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12 scroll-mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          02 // Hourly Dispatch Architecture &amp; Sizing
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
                The physics of <span className="text-[#22c55e]">baseload clean power</span>.
              </h2>
              <p className="mt-4 text-sm text-[#6b7c72] leading-relaxed font-sans">
                Data centers demand uninterrupted megawatts 8,760 hours a year. Solar generates during daytime; wind peaks seasonally. Achieving high time-matched clean power requires over-contracted generation paired with dedicated battery or pumped-hydro storage.
              </p>
            </div>

            <div className="busbar-panel p-6 space-y-4">
              <span className="tech-crosshair tl">+</span>
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs uppercase text-[#6b7c72]">IT Demand Load</span>
                <span className="text-2xl font-bold text-[#22c55e]">{loadMw} MW</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="10"
                value={loadMw}
                onChange={(e) => setLoadMw(Number(e.target.value))}
                className="w-full h-1.5 bg-[#19241d] rounded-none appearance-none cursor-pointer accent-[#22c55e]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#6b7c72]">
                <span>10 MW (Edge)</span>
                <span>60 MW (D2 Scale)</span>
                <span>250 MW (Hyperscale Hub)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#6b7c72]">
                Dispatch Contract Mode:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'solar_wind', label: 'Solar + Wind' },
                  { id: 'hybrid', label: 'Hybrid + BESS' },
                  { id: 'rtc', label: 'RTC / FDRE' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`py-2 px-3 text-xs font-mono border transition-colors ${
                      mode === m.id
                        ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]'
                        : 'border-[#19241d] bg-black/40 text-[#6b7c72] hover:border-[#6b7c72]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#6b7c72] font-mono pt-1">
                {calculations.assessment}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 busbar-panel p-6 md:p-8">
            <span className="tech-crosshair tl">+</span>
            <span className="tech-crosshair tr">+</span>
            <span className="tech-crosshair bl">+</span>
            <span className="tech-crosshair br">+</span>

            <div className="text-[11px] font-mono uppercase tracking-wider text-[#6b7c72] pb-4 border-b border-[#19241d] mb-6 flex justify-between items-center">
              <span>8,760-Hour Portfolio Dispatch Simulation</span>
              <span className="text-[#22c55e] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                SIMULATED TARIFF FY2026
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-[#19241d] mb-6">
              <div>
                <div className="text-[11px] font-mono uppercase text-[#6b7c72]">
                  Baseload Hourly Firmness
                </div>
                <div className="text-4xl font-mono font-bold text-[#22c55e] mt-1">
                  {calculations.firmness}%
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-[#6b7c72]">
                  Ex-Substation Landed Tariff
                </div>
                <div className="text-4xl font-mono font-bold text-[#f0f4f1] mt-1">
                  {calculations.tariff} <span className="text-sm font-normal text-[#6b7c72]">/ kWh</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="ledger-row">
                <span className="ledger-label">Solar PV Generation Capacity</span>
                <span className="ledger-value">{calculations.solar} MW</span>
              </div>
              <div className="ledger-row">
                <span className="ledger-label">High-CUF Wind Generation</span>
                <span className="ledger-value">{calculations.wind} MW</span>
              </div>
              <div className="ledger-row">
                <span className="ledger-label">4-Hour BESS / Pumped Storage</span>
                <span className="ledger-value text-[#22c55e]">{calculations.bess} MWh</span>
              </div>
              <div className="ledger-row">
                <span className="ledger-label">Cross-Subsidy Surcharge (CSS) Exemption</span>
                <span className="ledger-value">100% Waived (Green Open Access)</span>
              </div>
              <div className="ledger-row">
                <span className="ledger-label">Annual Carbon Abatement</span>
                <span className="ledger-value text-[#22c55e]">~{Math.round(loadMw * 7200)} MT CO2e / yr</span>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-[#19241d] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#6b7c72] font-mono">
                CERC Green Open Access Reference Framework
              </span>
              <a href="#inquiry" className="btn-signal">
                <span>Request Siting Pre-Feasibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 03 // MAJOR INDIAN AI DATA CENTER CAMPUSES ───────────────────────────────

function IndianDataCentersRegistry() {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return INDIAN_AI_DATA_CENTERS
    if (filter === 'yotta') return INDIAN_AI_DATA_CENTERS.filter(d => d.operator.includes('Yotta'))
    if (filter === 'adaniconnex') return INDIAN_AI_DATA_CENTERS.filter(d => d.operator.includes('AdaniConneX'))
    return INDIAN_AI_DATA_CENTERS.filter(d => !d.operator.includes('Yotta') && !d.operator.includes('AdaniConneX'))
  }, [filter])

  return (
    <section id="indian-dcs" className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12 scroll-mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72] flex items-center justify-between">
          <span>03 // Major AI &amp; Hyperscale Data Center Campuses in India</span>
          <span className="text-[#22c55e]">16 Monitored Facilities</span>
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
              India's verified <span className="text-[#22c55e]">AI data center portfolio</span>.
            </h2>
            <p className="mt-3 text-sm text-[#6b7c72] font-sans max-w-2xl leading-relaxed">
              Tracking reported and operational power capacity, liquid cooling architectures, and clean energy procurement structures across India's primary compute corridors.
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Operators' },
              { id: 'yotta', label: 'Yotta' },
              { id: 'adaniconnex', label: 'AdaniConneX' },
              { id: 'other', label: 'Colocation JV' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`py-1.5 px-3 text-xs font-mono border transition-colors ${
                  filter === f.id
                    ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]'
                    : 'border-[#19241d] bg-black/40 text-[#6b7c72] hover:border-[#6b7c72]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabular Dense Registry */}
        <div className="busbar-panel overflow-x-auto">
          <span className="tech-crosshair tl">+</span>
          <span className="tech-crosshair tr">+</span>
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#19241d] bg-black/60 text-[#6b7c72] text-[11px] uppercase tracking-wider">
                <th className="p-4">Campus / Facility</th>
                <th className="p-4">Location</th>
                <th className="p-4">Capacity / IT Load</th>
                <th className="p-4">AI / Architecture Specs</th>
                <th className="p-4">Target PUE</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19241d]">
              {filtered.map((dc) => (
                <tr key={dc.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[#f0f4f1]">{dc.name}</div>
                    <div className="text-[11px] text-[#6b7c72]">{dc.operator}</div>
                  </td>
                  <td className="p-4 text-[#6b7c72]">{dc.location}</td>
                  <td className="p-4 text-[#22c55e] font-semibold">{dc.capacity}</td>
                  <td className="p-4 text-[#f0f4f1] max-w-xs">{dc.specs}</td>
                  <td className="p-4 font-mono">{dc.pue}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 text-[10px] uppercase text-[#22c55e] border border-[#22c55e]/30 bg-[#22c55e]/5">
                      {dc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Accurate Phrasing Notice */}
        <div className="mt-6 p-4 border border-[#19241d] bg-black/40 flex items-start gap-3 text-xs font-mono text-[#6b7c72]">
          <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#f0f4f1] font-semibold">Technical Power Statement: </span>
            The facilities listed above are supplied through a combination of utility grid electricity and contracted renewable generation, with additional storage or firm-generation resources used to support 24/7 reliability.
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 04 // VERIFIED RENEWABLE ENERGY DEVELOPERS & SUPPLIERS ───────────────────

function GenerationPortfolioRegistry() {
  return (
    <section id="suppliers" className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12 scroll-mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72] flex items-center justify-between">
          <span>04 // Verified Renewable Energy Developers &amp; Suppliers</span>
          <span className="text-[#22c55e]">16 Institutional Partners</span>
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
              Major renewable <span className="text-[#22c55e]">energy developers</span>.
            </h2>
            <p className="mt-3 text-sm text-[#6b7c72] font-sans max-w-xl">
              Utility-scale IPPs, C&amp;I specialists, and EPC infrastructure contractors with active renewable generation and storage pipelines in India.
            </p>
          </div>
          <div className="font-mono text-xs text-[#22c55e]">
            ● Combined 100+ GW Utility &amp; C&amp;I Portfolio
          </div>
        </div>

        <div className="busbar-panel overflow-x-auto">
          <span className="tech-crosshair tl">+</span>
          <span className="tech-crosshair tr">+</span>
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#19241d] bg-black/60 text-[#6b7c72] text-[11px] uppercase tracking-wider">
                <th className="p-4">Developer / Supplier</th>
                <th className="p-4">Category</th>
                <th className="p-4">Reported Capacity</th>
                <th className="p-4">Generation Mix</th>
                <th className="p-4">Operational &amp; Storage Profile</th>
                <th className="p-4">Pricing Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19241d]">
              {RENEWABLE_SUPPLIERS.map((s) => (
                <tr key={s.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[#f0f4f1]">{s.name}</div>
                    <div className="text-[11px] text-[#6b7c72]">{s.hq}</div>
                  </td>
                  <td className="p-4 text-[#6b7c72]">
                    <span className="px-2 py-0.5 text-[10px] uppercase border border-[#19241d] bg-black/40 text-[#6b7c72]">
                      {s.type}
                    </span>
                  </td>
                  <td className="p-4 text-[#22c55e] font-semibold">{s.capacity}</td>
                  <td className="p-4 text-[#f0f4f1]">{s.mix}</td>
                  <td className="p-4 text-[#6b7c72] max-w-md">{s.storageInfo}</td>
                  <td className="p-4 font-mono text-[#f0f4f1]">{s.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ─── 05 // GLOBAL LARGEST AI DATA CENTERS BENCHMARK & TRENDS ──────────────────

function GlobalAIBenchmarkSection() {
  return (
    <section className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72] flex items-center justify-between">
          <span>05 // Global Frontier AI Infrastructure Benchmark</span>
          <span className="text-[#22c55e]">Comparative Reference</span>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
            Largest global AI <span className="text-[#22c55e]">data-center campuses</span>.
          </h2>
          <p className="mt-3 text-sm text-[#6b7c72] font-sans max-w-2xl leading-relaxed">
            The largest frontier AI campuses are increasingly designed around hundreds of megawatts to gigawatt-scale power requirements, combining utility grids with natural gas, behind-the-meter generation, batteries, and nuclear contracts.
          </p>
        </div>

        {/* Global Benchmark Table */}
        <div className="busbar-panel overflow-x-auto mb-16">
          <span className="tech-crosshair tl">+</span>
          <span className="tech-crosshair tr">+</span>
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#19241d] bg-black/60 text-[#6b7c72] text-[11px] uppercase tracking-wider">
                <th className="p-4">Campus / Operator</th>
                <th className="p-4">Location</th>
                <th className="p-4">Power / Capacity</th>
                <th className="p-4">Main Energy Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19241d]">
              {GLOBAL_AI_DATA_CENTERS.map((g) => (
                <tr key={g.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-[#f0f4f1]">{g.name}</td>
                  <td className="p-4 text-[#6b7c72]">{g.location}</td>
                  <td className="p-4 text-[#22c55e] font-semibold">{g.power}</td>
                  <td className="p-4 text-[#f0f4f1] max-w-lg leading-relaxed">{g.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5 Key Energy Trends */}
        <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          Key Energy-Supply Trends in AI Infrastructure
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENERGY_SUPPLY_TRENDS.map((t, idx) => {
            const Icon = t.icon
            return (
              <div key={t.title} className="busbar-panel p-6 relative">
                <span className="tech-crosshair tl">+</span>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded border border-[#19241d] bg-black flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <div className="font-mono text-xs text-[#22c55e] font-bold">
                    0{idx + 1} //
                  </div>
                </div>
                <h3 className="font-display font-bold uppercase text-sm text-[#f0f4f1] mb-2">
                  {t.title}
                </h3>
                <p className="text-xs text-[#6b7c72] font-sans leading-relaxed">
                  {t.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── 06 // HOW RENEWABLE POWER REACHES AN AI DATA CENTER ──────────────────────

function ProcurementFrameworks() {
  return (
    <section className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          06 // How Renewable Power Reaches an AI Data Center
        </div>

        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
            Commercial <span className="text-[#22c55e]">sourcing models</span>.
          </h2>
          <p className="mt-3 text-sm text-[#6b7c72] font-sans max-w-xl">
            Four primary procurement frameworks under the Ministry of Power Green Energy Open Access Regulations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#19241d] mb-16">
          {SOURCING_MODELS.map((f, idx) => (
            <div
              key={f.code}
              className={`p-6 bg-black/40 ${
                idx < 3 ? 'lg:border-r border-b lg:border-b-0 border-[#19241d]' : ''
              } flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-baseline mb-3 font-mono">
                  <span className="text-xs text-[#22c55e]">{f.code} //</span>
                  <span className="text-[10px] text-[#6b7c72] uppercase tracking-wider">Model</span>
                </div>
                <h3 className="text-base font-bold font-display uppercase text-[#f0f4f1] mb-1">
                  {f.title}
                </h3>
                <div className="text-[11px] font-mono text-[#22c55e] mb-4">
                  {f.highlight}
                </div>
                <p className="text-xs text-[#6b7c72] font-sans leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing & Procurement Cost Layers */}
        <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          Pricing &amp; Procurement Framework // Delivered Cost Layers
        </div>
        <div className="busbar-panel overflow-x-auto">
          <span className="tech-crosshair tl">+</span>
          <span className="tech-crosshair tr">+</span>
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#19241d] bg-black/60 text-[#6b7c72] text-[11px] uppercase tracking-wider">
                <th className="p-4">Cost Layer</th>
                <th className="p-4">What To Capture</th>
                <th className="p-4">Typical Regulatory / Contract Treatment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19241d]">
              {PRICING_COST_LAYERS.map((c) => (
                <tr key={c.layer} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-[#f0f4f1]">{c.layer}</td>
                  <td className="p-4 text-[#22c55e]">{c.detail}</td>
                  <td className="p-4 text-[#6b7c72]">{c.treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ─── 07 // INSTITUTIONAL INTAKE (OFFTAKE DESK) ────────────────────────────────

function InstitutionalOfftakeDesk() {
  const [form, setForm] = useState({ name: '', email: '', company: '', capacity: '25-50 MW', region: 'Mumbai', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="inquiry" className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12 scroll-mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          07 // Transmission &amp; Offtake Advisory Desk
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
              Initiate power offtake &amp; <span className="text-[#22c55e]">grid siting study</span>.
            </h2>
            <p className="text-sm text-[#6b7c72] leading-relaxed font-sans">
              We structure 400kV substation bay reservations, evaluate state Green Open Access banking schedules, and negotiate long-term round-the-clock PPAs for Indian AI campuses.
            </p>

            <div className="space-y-4 pt-4 border-t border-[#19241d] text-xs font-mono text-[#f0f4f1]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span>Maker Maxity, 5th Floor, Bandra Kurla Complex (BKC), Mumbai 400051</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>offtake@greengrid.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>+91 22 6840 9200</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 busbar-panel p-8">
            <span className="tech-crosshair tl">+</span>
            <span className="tech-crosshair tr">+</span>
            <span className="tech-crosshair bl">+</span>
            <span className="tech-crosshair br">+</span>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#22c55e] mx-auto" />
                <h3 className="text-xl font-bold font-display uppercase text-[#f0f4f1]">
                  Inquiry Logged on Dispatch Ledger
                </h3>
                <p className="text-xs font-mono text-[#6b7c72] max-w-md mx-auto">
                  Our transmission structuring group will prepare a regional substation bay headroom and tariff evaluation within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Principal Contact Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Vikramaditya Sharma"
                      className="tech-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Institutional Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@organization.com"
                      className="tech-input"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Organization / Operating Entity
                    </label>
                    <input
                      required
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Data Center Operator / Cloud Provider"
                      className="tech-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Planned IT Capacity (MW)
                    </label>
                    <select
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      className="tech-select"
                    >
                      <option value="10-25 MW">10–25 MW (Edge / Colocation)</option>
                      <option value="25-50 MW">25–50 MW (Hyperscale Hub)</option>
                      <option value="50-100 MW">50–100 MW (Multi-Campus AI Cloud)</option>
                      <option value="100+ MW">100+ MW (Gigawatt Scale Cluster)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                    Project Siting Scope &amp; Target COD
                  </label>
                  <textarea
                    rows="3"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Substation corridor, expected commercial operations date (COD), and preferred sourcing structure (Physical PPA, RTC/FDRE, Behind-the-Meter)..."
                    className="tech-input"
                  />
                </div>

                <button type="submit" className="btn-signal w-full !py-3.5 mt-2">
                  Initiate Grid Sizing Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#19241d] bg-[#080b09] py-16 px-6 md:px-12 text-xs relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <span className="text-lg font-bold font-display uppercase tracking-tight text-[#f0f4f1]">
              GreenGrid India
            </span>
            <p className="text-xs text-[#6b7c72] mt-1.5 font-sans max-w-sm">
              High-voltage clean power infrastructure platform for Indian hyperscale data center operators.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-wider text-[#6b7c72]">
            <a href="#sizing" className="hover:text-[#22c55e] transition-colors">Dispatch Sizing</a>
            <a href="#indian-dcs" className="hover:text-[#22c55e] transition-colors">Indian AI DCs</a>
            <a href="#suppliers" className="hover:text-[#22c55e] transition-colors">Renewable Suppliers</a>
            <Link to="/map" className="hover:text-[#22c55e] transition-colors">National Radar</Link>
            <a href="#inquiry" className="hover:text-[#22c55e] transition-colors">Offtake Desk</a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#19241d] flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono text-[#6b7c72]">
          <div>© {new Date().getFullYear()} GreenGrid Technologies India Pvt. Ltd. · Research Snapshot October 2026</div>
          <div className="flex items-center gap-2 text-[#22c55e]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="uppercase tracking-wider">CERC &amp; CEA Framework Compliant</span>
          </div>
          <div>Green Energy Corridor III Evacuation Backbone</div>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN APP LANDING PAGE COMPONENT ──────────────────────────────────────────

export default function AppLanding() {
  const [isHeroRevealed, setIsHeroRevealed] = useState(false)

  return (
    <div className="bg-[#080b09] min-h-screen text-[#f0f4f1] selection:bg-[#22c55e]/25 selection:text-[#f0f4f1] relative">
      <BackgroundScene />
      <Navbar visible={isHeroRevealed} />
      <Hero isRevealed={isHeroRevealed} setIsRevealed={setIsHeroRevealed} />
      <div className="relative z-10">
        <ExecutiveSnapshotLedger />
        <DispatchSizingEngine />
        <IndianDataCentersRegistry />
        <GenerationPortfolioRegistry />
        <GlobalAIBenchmarkSection />
        <ProcurementFrameworks />
        <InstitutionalOfftakeDesk />
        <Footer />
      </div>
    </div>
  )
}
