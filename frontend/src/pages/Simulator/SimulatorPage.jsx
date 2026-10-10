import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';
import {
  Cpu,
  Zap,
  BatteryCharging,
  Sun,
  Wind,
  Droplets,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Sliders,
  DollarSign,
  CloudRain,
  Flame,
  Activity,
  Layers,
  ArrowRight,
  Download,
  Info
} from 'lucide-react';

// Preset configurations for Data Centers
const DC_PRESETS = [
  {
    id: 'yotta_d2',
    name: 'Yotta D2 AI Campus (Greater Noida)',
    itLoad: 60,
    pue: 1.22,
    workload: 'ai_training',
    cooling: 'liquid',
    tier: 'Tier IV',
    chipset: 'blackwell',
    cleanGoal: 100
  },
  {
    id: 'adaniconnex_hyd',
    name: 'AdaniConneX Mega Hub (Hyderabad)',
    itLoad: 200,
    pue: 1.20,
    workload: 'ai_training',
    cooling: 'liquid',
    tier: 'Tier IV',
    chipset: 'h100',
    cleanGoal: 100
  },
  {
    id: 'digital_edge_bom',
    name: 'Digital Edge BOM Campus (Navi Mumbai)',
    itLoad: 120,
    pue: 1.20,
    workload: 'inference',
    cooling: 'liquid',
    tier: 'Tier IV',
    chipset: 'blackwell',
    cleanGoal: 95
  },
  {
    id: 'equinix_mb',
    name: 'Equinix MB1/MB2 IBX (Mumbai)',
    itLoad: 45,
    pue: 1.30,
    workload: 'enterprise',
    cooling: 'hybrid',
    tier: 'Tier IV',
    chipset: 'cloud_cpu',
    cleanGoal: 90
  }
];

// Preset configurations for Energy Suppliers
const SUPPLIER_PRESETS = [
  {
    id: 'khavda_mega',
    name: 'Adani Green Khavda Mega Park (Gujarat)',
    capacity: 2000,
    solarPct: 55,
    windPct: 30,
    storagePct: 15,
    storageDuration: 4,
    tariff: 3.85,
    lossPct: 3.5
  },
  {
    id: 'pinnapuram_psp',
    name: 'Greenko Pinnapuram IRESP (Andhra Pradesh)',
    capacity: 1200,
    solarPct: 40,
    windPct: 20,
    storagePct: 40,
    storageDuration: 6,
    tariff: 4.35,
    lossPct: 3.0
  },
  {
    id: 'renew_rajasthan',
    name: 'ReNew Rajasthan Hybrid Hub',
    capacity: 600,
    solarPct: 60,
    windPct: 30,
    storagePct: 10,
    storageDuration: 4,
    tariff: 4.10,
    lossPct: 3.8
  },
  {
    id: 'cleanmax_ci',
    name: 'CleanMax Corporate C&I Hybrid',
    capacity: 150,
    solarPct: 70,
    windPct: 20,
    storagePct: 10,
    storageDuration: 2,
    tariff: 4.25,
    lossPct: 2.5
  }
];

// Normalized hourly generation shapes (0 to 1) for Indian climate conditions
const HOURLY_SOLAR_CURVE = [
  0.0, 0.0, 0.0, 0.0, 0.0, 0.02, 0.15, 0.40, 0.68, 0.88, 0.98, 1.0, 0.96, 0.85, 0.65, 0.38, 0.12, 0.02, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
];

const HOURLY_WIND_CURVE = [
  0.88, 0.92, 0.95, 0.94, 0.86, 0.75, 0.60, 0.45, 0.35, 0.30, 0.28, 0.30, 0.32, 0.36, 0.45, 0.58, 0.72, 0.84, 0.90, 0.92, 0.95, 0.92, 0.89, 0.85
];

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'datacenter' | 'supplier'
  const [selectedSeason, setSelectedSeason] = useState('summer'); // 'summer' | 'monsoon' | 'winter'
  const [showHourlyTable, setShowHourlyTable] = useState(false);

  // --- Data Center Parameters ---
  const [itLoadMw, setItLoadMw] = useState(60);
  const [targetPue, setTargetPue] = useState(1.22);
  const [workloadType, setWorkloadType] = useState('ai_training'); // 'ai_training' | 'inference' | 'batch'
  const [coolingType, setCoolingType] = useState('liquid'); // 'liquid' | 'immersion' | 'hybrid' | 'air'
  const [brownTariffInr, setBrownTariffInr] = useState(9.20); // Rs/kWh standard grid
  const [cleanGoalPct, setCleanGoalPct] = useState(100);

  // --- Renewable Supplier Parameters ---
  const [plantCapacityMw, setPlantCapacityMw] = useState(300);
  const [solarPct, setSolarPct] = useState(50);
  const [windPct, setWindPct] = useState(30);
  const [storagePct, setStoragePct] = useState(20);
  const [storageDurationHours, setStorageDurationHours] = useState(4);
  const [ppaTariffInr, setPpaTariffInr] = useState(4.15); // Rs/kWh clean PPA
  const [transmissionLossPct, setTransmissionLossPct] = useState(3.5);

  // Season solar & wind multiplier adjustments
  const seasonModifiers = useMemo(() => {
    switch (selectedSeason) {
      case 'monsoon':
        return { solar: 0.58, wind: 1.35, ambientTemp: '28°C (High Cloud Cover & Gusting Wind)' };
      case 'winter':
        return { solar: 0.90, wind: 0.80, ambientTemp: '20°C (Clear Atmospheric Insolation)' };
      default: // summer
        return { solar: 1.05, wind: 0.95, ambientTemp: '42°C (Peak Thermal Radiation)' };
    }
  }, [selectedSeason]);

  // Adjust PUE based on cooling type selection if user clicks a cooling chip
  const handleCoolingChange = (type) => {
    setCoolingType(type);
    if (type === 'immersion') setTargetPue(1.12);
    else if (type === 'liquid') setTargetPue(1.20);
    else if (type === 'hybrid') setTargetPue(1.28);
    else if (type === 'air') setTargetPue(1.42);
  };

  // One-click Preset Application
  const applyDCPreset = (preset) => {
    setItLoadMw(preset.itLoad);
    setTargetPue(preset.pue);
    setWorkloadType(preset.workload);
    setCoolingType(preset.cooling);
    setCleanGoalPct(preset.cleanGoal);
  };

  const applySupplierPreset = (preset) => {
    setPlantCapacityMw(preset.capacity);
    setSolarPct(preset.solarPct);
    setWindPct(preset.windPct);
    setStoragePct(preset.storagePct);
    setStorageDurationHours(preset.storageDuration);
    setPpaTariffInr(preset.tariff);
    setTransmissionLossPct(preset.lossPct);
  };

  // --- CORE SIMULATION ENGINE ---
  const simulation = useMemo(() => {
    // 1. Calculate Data Center Facility Demand Breakdown
    const coolingOverheadMw = itLoadMw * (targetPue - 1.0);
    const totalFacilityDemandMw = itLoadMw * targetPue;

    // Workload multiplier by hour
    const getWorkloadFactor = (hour) => {
      if (workloadType === 'ai_training') {
        // Continuous 24/7 AI GPU baseload with minor fluctuation
        return 0.98 + 0.04 * Math.sin(hour * 0.2);
      }
      if (workloadType === 'inference') {
        // Daytime peak customer traffic, drops at night
        return hour >= 9 && hour <= 21 ? 1.02 : 0.72;
      }
      // Batch / Off-peak compute
      return hour >= 22 || hour <= 7 ? 1.05 : 0.65;
    };

    // 2. Calculate Supplier Capacities
    const normSum = solarPct + windPct + storagePct || 100;
    const actualSolarMw = (solarPct / normSum) * plantCapacityMw;
    const actualWindMw = (windPct / normSum) * plantCapacityMw;
    const actualStorageMw = (storagePct / normSum) * plantCapacityMw;
    const totalStorageMwh = actualStorageMw * storageDurationHours;

    let currentSoCMwh = totalStorageMwh * 0.4; // Initial battery state of charge (40%)
    const hourlyData = [];

    let totalGenMwh = 0;
    let totalDCDemandMwh = 0;
    let totalCleanDeliveredMwh = 0;
    let totalGridDeficitMwh = 0;
    let totalCurtailmentMwh = 0;
    let totalStorageChargedMwh = 0;
    let totalStorageDischargedMwh = 0;

    // Simulate 24-hour cycle
    for (let h = 0; h < 24; h++) {
      const timeLabel = `${String(h).padStart(2, '0')}:00`;
      
      // Hourly facility demand
      const loadFactor = getWorkloadFactor(h);
      const hourDCDemandMw = +(totalFacilityDemandMw * loadFactor).toFixed(2);
      totalDCDemandMwh += hourDCDemandMw;

      // Hourly raw generation with season modifiers and grid losses
      const lossMultiplier = 1.0 - (transmissionLossPct / 100.0);
      const rawSolarMw = actualSolarMw * HOURLY_SOLAR_CURVE[h] * seasonModifiers.solar * lossMultiplier;
      const rawWindMw = actualWindMw * HOURLY_WIND_CURVE[h] * seasonModifiers.wind * lossMultiplier;
      const directGenerationMw = +(rawSolarMw + rawWindMw).toFixed(2);
      totalGenMwh += directGenerationMw;

      // Smart Battery Dispatch Logic:
      let storageDischargeMw = 0;
      let storageChargeMw = 0;

      if (directGenerationMw > hourDCDemandMw) {
        // Surplus generation -> Charge Storage
        const surplusMw = directGenerationMw - hourDCDemandMw;
        const maxChargeAllowedMw = Math.min(actualStorageMw, (totalStorageMwh - currentSoCMwh));
        storageChargeMw = +Math.max(0, Math.min(surplusMw, maxChargeAllowedMw)).toFixed(2);
        currentSoCMwh += storageChargeMw * 0.90; // 90% round-trip efficiency on charge
        totalStorageChargedMwh += storageChargeMw;
      } else {
        // Generation deficit -> Discharge Storage
        const deficitMw = hourDCDemandMw - directGenerationMw;
        const maxDischargeAllowedMw = Math.min(actualStorageMw, currentSoCMwh);
        storageDischargeMw = +Math.max(0, Math.min(deficitMw, maxDischargeAllowedMw)).toFixed(2);
        currentSoCMwh -= storageDischargeMw;
        totalStorageDischargedMwh += storageDischargeMw;
      }

      currentSoCMwh = Math.max(0, Math.min(totalStorageMwh, currentSoCMwh));
      const socPercentage = totalStorageMwh > 0 ? Math.round((currentSoCMwh / totalStorageMwh) * 100) : 0;

      // Total clean power delivered to facility this hour
      const cleanDeliveredMw = +Math.min(hourDCDemandMw, directGenerationMw + storageDischargeMw).toFixed(2);
      totalCleanDeliveredMwh += cleanDeliveredMw;

      // Any remaining deficit that must be imported from brown state grid
      const gridDeficitMw = +Math.max(0, hourDCDemandMw - cleanDeliveredMw).toFixed(2);
      totalGridDeficitMwh += gridDeficitMw;

      // Any remaining clean generation that couldn't be absorbed or stored
      const curtailmentMw = +Math.max(0, directGenerationMw - hourDCDemandMw - storageChargeMw).toFixed(2);
      totalCurtailmentMwh += curtailmentMw;

      const matchPct = hourDCDemandMw > 0 ? Math.min(100, Math.round((cleanDeliveredMw / hourDCDemandMw) * 100)) : 100;

      hourlyData.push({
        hour: timeLabel,
        hourIndex: h,
        solarMw: +rawSolarMw.toFixed(2),
        windMw: +rawWindMw.toFixed(2),
        storageDischargeMw,
        storageChargeMw,
        totalCleanGenMw: +(directGenerationMw + storageDischargeMw).toFixed(2),
        dcDemandMw: hourDCDemandMw,
        cleanDeliveredMw,
        gridDeficitMw,
        curtailmentMw,
        socPct: socPercentage,
        matchPct
      });
    }

    // Aggregates & KPIs
    const rtcMatchPct = totalDCDemandMwh > 0 
      ? Math.min(100, +((totalCleanDeliveredMwh / totalDCDemandMwh) * 100).toFixed(1))
      : 100;

    const capacityUtilFactor = plantCapacityMw > 0
      ? +((totalGenMwh / (plantCapacityMw * 24)) * 100).toFixed(1)
      : 0;

    const annualDCMwh = totalDCDemandMwh * 365;
    const annualCleanDeliveredMwh = totalCleanDeliveredMwh * 365;
    const annualGridDeficitMwh = totalGridDeficitMwh * 365;
    const annualCo2AvoidedTons = Math.round(annualCleanDeliveredMwh * 0.82); // 0.82 tCO2/MWh CEA factor

    // Financial calculations (in INR Crores)
    // 1 Crore = 10,000,000 INR
    const brownPowerAnnualCostCr = +((annualDCMwh * 1000 * brownTariffInr) / 10000000).toFixed(2);
    const greenPpaAnnualCostCr = +(
      ((annualCleanDeliveredMwh * 1000 * ppaTariffInr) + (annualGridDeficitMwh * 1000 * brownTariffInr)) / 10000000
    ).toFixed(2);
    const annualSavingsCr = +(brownPowerAnnualCostCr - greenPpaAnnualCostCr).toFixed(2);
    const annualSavingsUsdM = +(annualSavingsCr * 0.12).toFixed(2); // ~1 Cr = ~$120k USD

    // Supplier revenue
    const annualSupplierRevenueCr = +((annualCleanDeliveredMwh * 1000 * ppaTariffInr) / 10000000).toFixed(2);

    return {
      hourlyData,
      itLoadMw,
      coolingOverheadMw: +coolingOverheadMw.toFixed(2),
      totalFacilityDemandMw: +totalFacilityDemandMw.toFixed(2),
      actualSolarMw: +actualSolarMw.toFixed(1),
      actualWindMw: +actualWindMw.toFixed(1),
      actualStorageMw: +actualStorageMw.toFixed(1),
      totalStorageMwh: +totalStorageMwh.toFixed(1),
      totalGenMwh: +totalGenMwh.toFixed(1),
      totalDCDemandMwh: +totalDCDemandMwh.toFixed(1),
      totalCleanDeliveredMwh: +totalCleanDeliveredMwh.toFixed(1),
      totalGridDeficitMwh: +totalGridDeficitMwh.toFixed(1),
      totalCurtailmentMwh: +totalCurtailmentMwh.toFixed(1),
      rtcMatchPct,
      capacityUtilFactor,
      annualDCMwh: Math.round(annualDCMwh),
      annualCo2AvoidedTons,
      brownPowerAnnualCostCr,
      greenPpaAnnualCostCr,
      annualSavingsCr,
      annualSavingsUsdM,
      annualSupplierRevenueCr
    };
  }, [
    itLoadMw,
    targetPue,
    workloadType,
    plantCapacityMw,
    solarPct,
    windPct,
    storagePct,
    storageDurationHours,
    ppaTariffInr,
    brownTariffInr,
    transmissionLossPct,
    seasonModifiers
  ]);

  // Download simulation JSON summary
  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(simulation, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `green_grid_simulation_${itLoadMw}MW_vs_${plantCapacityMw}MW.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col pt-16 selection:bg-emerald-500/20 selection:text-white">
      <Navbar />

      {/* Hero Header & Mode Switcher */}
      <div className="border-b border-white/10 bg-[#0c0e10]/90 backdrop-blur-md px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
                CERC / CEA Compliant Physics Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>National Grid & Clean Power Simulator</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Model real-time generation dispatch, storage battery balancing, AI GPU workload curves, and 24/7 Round-The-Clock (RTC) clean energy matching for data centers and renewable suppliers.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-black/80 p-1 rounded-xl border border-white/15 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('both')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'both' ? 'bg-emerald-500 text-neutral-950 shadow-md font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>24/7 RTC Dispatch Matcher</span>
            </button>
            <button
              onClick={() => setActiveTab('datacenter')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'datacenter' ? 'bg-sky-500 text-neutral-950 shadow-md font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Data Center Sizing</span>
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'supplier' ? 'bg-amber-500 text-neutral-950 shadow-md font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Renewable Supplier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulator Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 space-y-8">
        
        {/* KPI Scorecard Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>24/7 RTC Match</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {simulation.rtcMatchPct}%
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>Direct clean supply</span>
            </div>
            <div className="absolute top-0 right-0 h-1 w-full bg-emerald-500/40" />
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Total DC Facility Load</span>
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {simulation.totalFacilityDemandMw} <span className="text-xs font-normal text-neutral-400">MW</span>
            </div>
            <div className="text-[11px] text-sky-400 mt-1">
              IT: {simulation.itLoadMw} MW | Cooling: {simulation.coolingOverheadMw} MW
            </div>
            <div className="absolute top-0 right-0 h-1 w-full bg-sky-500/40" />
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Clean Generation</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {simulation.totalGenMwh} <span className="text-xs font-normal text-neutral-400">MWh/day</span>
            </div>
            <div className="text-[11px] text-amber-400 mt-1">
              CUF: {simulation.capacityUtilFactor}% plant efficiency
            </div>
            <div className="absolute top-0 right-0 h-1 w-full bg-amber-500/40" />
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Annual PPA Savings</span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono text-emerald-400">
              ₹{simulation.annualSavingsCr} <span className="text-xs font-normal text-neutral-400">Cr</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              ${simulation.annualSavingsUsdM}M USD vs standard grid
            </div>
            <div className="absolute top-0 right-0 h-1 w-full bg-emerald-500/40" />
          </div>

          <div className="col-span-2 lg:col-span-1 bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>CO₂ Abated / Yr</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {simulation.annualCo2AvoidedTons.toLocaleString()} <span className="text-xs font-normal text-neutral-400">t</span>
            </div>
            <div className="text-[11px] text-cyan-400 mt-1">
              CEA 0.82 kg/kWh emission factor
            </div>
            <div className="absolute top-0 right-0 h-1 w-full bg-cyan-500/40" />
          </div>
        </div>

        {/* Interactive Controls & Scenario Presets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Data Center Configuration Controls */}
          {(activeTab === 'both' || activeTab === 'datacenter') && (
            <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-[#111317] border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-sm text-white">Data Center Consumer Profile</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  CONSUMER SIDE
                </span>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-[11px] font-mono text-neutral-400 block mb-2 uppercase">Load Scenario Presets:</label>
                <div className="grid grid-cols-2 gap-2">
                  {DC_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyDCPreset(p)}
                      className="p-2 rounded-lg bg-black/60 hover:bg-neutral-800 border border-white/10 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-sky-400 font-mono">{p.itLoad} MW IT • PUE {p.pue}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* IT Compute Load Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-neutral-300 font-medium">IT Compute Capacity Load (MW):</span>
                  <span className="font-mono text-sky-400 font-bold text-sm">{itLoadMw} MW</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={itLoadMw}
                  onChange={(e) => setItLoadMw(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-0.5">
                  <span>5 MW (Edge AI)</span>
                  <span>100 MW (Hyperscale)</span>
                  <span>300 MW (Gigawatt Campus)</span>
                </div>
              </div>

              {/* Cooling Architecture & PUE */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-neutral-300 font-medium">Cooling Architecture (Target PUE):</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">PUE {targetPue}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'immersion', label: 'Immersion', pue: 1.12 },
                    { id: 'liquid', label: 'Direct Liquid', pue: 1.20 },
                    { id: 'hybrid', label: 'Evaporative', pue: 1.28 },
                    { id: 'air', label: 'Air Chilled', pue: 1.42 },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCoolingChange(c.id)}
                      className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer text-xs ${
                        coolingType === c.id
                          ? 'border-sky-500 bg-sky-500/20 text-white font-bold'
                          : 'border-white/10 bg-black/40 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] font-medium">{c.label}</div>
                      <div className="text-[10px] font-mono opacity-80">{c.pue}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Workload Pattern */}
              <div>
                <label className="text-[11px] font-mono text-neutral-400 block mb-1.5 uppercase">Workload Dispatch Curve:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'ai_training', label: '24/7 AI Training', sub: 'Flat ~100% Baseload' },
                    { id: 'inference', label: 'Cloud Inference', sub: 'Daytime Peak Traffic' },
                    { id: 'batch', label: 'Batch Processing', sub: 'Night-Shift Heavy' }
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWorkloadType(w.id)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        workloadType === w.id
                          ? 'border-emerald-500 bg-emerald-500/20 text-white font-semibold'
                          : 'border-white/10 bg-black/40 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] font-medium">{w.label}</div>
                      <div className="text-[9px] text-neutral-400">{w.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Commercial Tariffs */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">State Grid Tariff (₹/kWh):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="6"
                    max="15"
                    value={brownTariffInr}
                    onChange={(e) => setBrownTariffInr(Number(e.target.value))}
                    className="w-full bg-black/70 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">Standard brown power</span>
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Clean Target (% RTC):</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={cleanGoalPct}
                    onChange={(e) => setCleanGoalPct(Number(e.target.value))}
                    className="w-full bg-black/70 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400"
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">Corporate decarbonization goal</span>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: Renewable Energy Supplier Controls */}
          {(activeTab === 'both' || activeTab === 'supplier') && (
            <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-[#111317] border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Renewable Supplier & Storage Asset</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  SUPPLY SIDE
                </span>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-[11px] font-mono text-neutral-400 block mb-2 uppercase">Developer Project Presets:</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPLIER_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applySupplierPreset(p)}
                      className="p-2 rounded-lg bg-black/60 hover:bg-neutral-800 border border-white/10 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-amber-400 font-mono">{p.capacity} MW • ₹{p.tariff}/kWh PPA</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nameplate Plant Capacity Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-neutral-300 font-medium">Installed Generation Capacity (MW):</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">{plantCapacityMw} MW</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1500"
                  step="20"
                  value={plantCapacityMw}
                  onChange={(e) => setPlantCapacityMw(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-0.5">
                  <span>20 MW (C&I Captive)</span>
                  <span>500 MW (Utility Hybrid)</span>
                  <span>1,500 MW (Ultra-Mega Park)</span>
                </div>
              </div>

              {/* Technology Generation Split */}
              <div className="space-y-3">
                <label className="text-[11px] font-mono text-neutral-400 block uppercase">Hybrid Technology Generation Split:</label>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/50 p-2.5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-amber-400 flex items-center gap-1 font-medium"><Sun className="w-3.5 h-3.5" /> Solar</span>
                      <span className="font-mono text-white text-xs">{solarPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={solarPct}
                      onChange={(e) => setSolarPct(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-neutral-500">{simulation.actualSolarMw} MW Solar</span>
                  </div>

                  <div className="bg-black/50 p-2.5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-sky-400 flex items-center gap-1 font-medium"><Wind className="w-3.5 h-3.5" /> Wind</span>
                      <span className="font-mono text-white text-xs">{windPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={windPct}
                      onChange={(e) => setWindPct(Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-neutral-500">{simulation.actualWindMw} MW Wind</span>
                  </div>

                  <div className="bg-black/50 p-2.5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-emerald-400 flex items-center gap-1 font-medium"><BatteryCharging className="w-3.5 h-3.5" /> BESS/PSP</span>
                      <span className="font-mono text-white text-xs">{storagePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={storagePct}
                      onChange={(e) => setStoragePct(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-neutral-500">{simulation.totalStorageMwh} MWh Reserve</span>
                  </div>
                </div>
              </div>

              {/* Climate Season & Storage Duration */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1.5">Climate & Insolation Season:</label>
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
                    {[
                      { id: 'summer', label: 'Summer' },
                      { id: 'monsoon', label: 'Monsoon' },
                      { id: 'winter', label: 'Winter' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSeason(s.id)}
                        className={`flex-1 py-1 rounded text-xs transition-colors cursor-pointer ${
                          selectedSeason === s.id
                            ? 'bg-amber-500 text-neutral-950 font-bold'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 block">{seasonModifiers.ambientTemp}</span>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Clean PPA Offer Rate (₹/kWh):</label>
                  <input
                    type="number"
                    step="0.05"
                    min="2.5"
                    max="7.0"
                    value={ppaTariffInr}
                    onChange={(e) => setPpaTariffInr(Number(e.target.value))}
                    className="w-full bg-black/70 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400"
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">CERC Open Access indexed</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* INTERACTIVE 24-HOUR DISPATCH & MATCH CHART */}
        <div className="bg-[#111317] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>24-Hour Real-Time Power Dispatch & Hourly Match Curve</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Simulated hourly direct solar generation, wind gusts, battery dispatch buffer, and data center load demand (00:00 - 23:00 IST).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHourlyTable(!showHourlyTable)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showHourlyTable ? 'Hide Table' : 'View Hourly Table'}</span>
              </button>
              <button
                onClick={handleExportData}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Model</span>
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="w-full h-80 sm:h-96 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulation.hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.85} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.15} />
                  </linearGradient>
                  <linearGradient id="deficitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="hour" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#0c0e10] border border-white/20 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[200px]">
                          <div className="font-bold text-white border-b border-white/10 pb-1 flex justify-between">
                            <span>{label} IST</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${d.matchPct >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {d.matchPct}% Clean Match
                            </span>
                          </div>
                          <div className="text-neutral-300 flex justify-between">
                            <span>Data Center Load:</span>
                            <span className="font-mono text-white font-bold">{d.dcDemandMw} MW</span>
                          </div>
                          <div className="text-amber-400 flex justify-between">
                            <span>Solar Generation:</span>
                            <span className="font-mono">{d.solarMw} MW</span>
                          </div>
                          <div className="text-sky-400 flex justify-between">
                            <span>Wind Generation:</span>
                            <span className="font-mono">{d.windMw} MW</span>
                          </div>
                          {d.storageDischargeMw > 0 && (
                            <div className="text-emerald-400 flex justify-between">
                              <span>Storage Discharge:</span>
                              <span className="font-mono">+{d.storageDischargeMw} MW</span>
                            </div>
                          )}
                          {d.storageChargeMw > 0 && (
                            <div className="text-purple-400 flex justify-between">
                              <span>Storage Charging:</span>
                              <span className="font-mono">-{d.storageChargeMw} MW</span>
                            </div>
                          )}
                          {d.gridDeficitMw > 0 && (
                            <div className="text-red-400 flex justify-between font-semibold border-t border-white/10 pt-1">
                              <span>Grid Deficit (Brown):</span>
                              <span className="font-mono">{d.gridDeficitMw} MW</span>
                            </div>
                          )}
                          <div className="text-neutral-500 text-[10px] pt-0.5">
                            Battery State of Charge: {d.socPct}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
                  formatter={(value) => <span className="text-neutral-300 text-xs">{value}</span>}
                />
                
                {/* Stacked Clean Generation Areas */}
                <Area type="monotone" dataKey="solarMw" name="Solar PV Output" stackId="gen" stroke="#f59e0b" fill="url(#solarGrad)" />
                <Area type="monotone" dataKey="windMw" name="Wind Output" stackId="gen" stroke="#38bdf8" fill="url(#windGrad)" />
                <Area type="monotone" dataKey="storageDischargeMw" name="BESS/PSP Discharge" stackId="gen" stroke="#10b981" fill="url(#storageGrad)" />
                <Area type="monotone" dataKey="gridDeficitMw" name="Grid Deficit (Import)" stroke="#ef4444" fill="url(#deficitGrad)" strokeDasharray="4 4" />
                
                {/* Data Center Demand Line */}
                <Line
                  type="monotone"
                  dataKey="dcDemandMw"
                  name="Facility Demand (IT + PUE)"
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Legend & Insights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Solar: <strong>{simulation.actualSolarMw} MW</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Wind: <strong>{simulation.actualWindMw} MW</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>BESS: <strong>{simulation.totalStorageMwh} MWh</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span>Net Deficit: <strong>{simulation.totalGridDeficitMwh} MWh/day</strong></span>
            </div>
          </div>
        </div>

        {/* Optional Expandable Hourly Breakdown Table */}
        {showHourlyTable && (
          <div className="bg-[#111317] border border-white/10 rounded-2xl p-5 overflow-hidden shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-white">Hourly Power & Dispatch Ledger (24 Hours)</h3>
              <span className="text-xs text-neutral-400 font-mono">Units in MW (Instantaneous)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="py-2.5 px-3">Hour</th>
                    <th className="py-2.5 px-3">Solar MW</th>
                    <th className="py-2.5 px-3">Wind MW</th>
                    <th className="py-2.5 px-3">BESS Discharge</th>
                    <th className="py-2.5 px-3">BESS Charge</th>
                    <th className="py-2.5 px-3 text-sky-400">DC Load MW</th>
                    <th className="py-2.5 px-3 text-emerald-400">Delivered MW</th>
                    <th className="py-2.5 px-3 text-red-400">Deficit MW</th>
                    <th className="py-2.5 px-3">Match %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {simulation.hourlyData.map((row) => (
                    <tr key={row.hour} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 px-3 font-semibold text-white">{row.hour}</td>
                      <td className="py-2 px-3 text-amber-400">{row.solarMw}</td>
                      <td className="py-2 px-3 text-sky-400">{row.windMw}</td>
                      <td className="py-2 px-3 text-emerald-400">{row.storageDischargeMw > 0 ? `+${row.storageDischargeMw}` : '-'}</td>
                      <td className="py-2 px-3 text-purple-400">{row.storageChargeMw > 0 ? `-${row.storageChargeMw}` : '-'}</td>
                      <td className="py-2 px-3 text-white font-bold">{row.dcDemandMw}</td>
                      <td className="py-2 px-3 text-emerald-400 font-semibold">{row.cleanDeliveredMw}</td>
                      <td className="py-2 px-3 text-red-400">{row.gridDeficitMw > 0 ? row.gridDeficitMw : '-'}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${row.matchPct === 100 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {row.matchPct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Regulatory & Call to Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#111317] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>CERC Regulatory Compliance</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Under India's Green Energy Open Access Rules (2022–2026), minimum procurement threshold is lowered to 100 kW. ISTS transmission charge waiver applies to inter-state renewable supply.
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                ISTS Waiver Eligible
              </span>
            </div>
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <DollarSign className="w-4 h-4" />
              <span>Contract Structure Advice</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {simulation.rtcMatchPct >= 90
                ? 'High RTC compatibility (>90%). We recommend a Firm Dispatchable Renewable Energy (FDRE) hybrid PPA with virtual banking.'
                : 'Partial deficit detected during late hours. Recommend increasing BESS duration from 4h to 6h or adding pumped storage hydro contracts.'}
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">
                Recommended: FDRE + BESS Hybrid
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/40 via-[#111317] to-[#111317] border border-emerald-500/30 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <span>Explore Live Grid Matches</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Connect your simulated {simulation.itLoadMw} MW load directly with 16 verified Indian renewable suppliers on our National Radar map.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Link
                to="/map"
                className="flex-1 text-center bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Inspect on National Radar →
              </Link>
              <Link
                to="/dc/profile"
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                title="Save Profile"
              >
                Save DC Specs
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
