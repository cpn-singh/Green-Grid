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
  CartesianGrid
} from 'recharts';
import {
  Cpu,
  Zap,
  BatteryCharging,
  Sun,
  Wind,
  Droplets,
  TrendingDown,
  ShieldCheck,
  Layers,
  Download,
  Activity
} from 'lucide-react';

const DC_PRESETS = [
  { id: 'yotta_d2', name: 'Yotta D2 Campus (Greater Noida)', itLoad: 60, pue: 1.22, workload: 'ai_training', cooling: 'liquid', tier: 'Tier IV', chipset: 'blackwell', cleanGoal: 100 },
  { id: 'adaniconnex_hyd', name: 'AdaniConneX Hub (Hyderabad)', itLoad: 200, pue: 1.20, workload: 'ai_training', cooling: 'liquid', tier: 'Tier IV', chipset: 'h100', cleanGoal: 100 },
  { id: 'digital_edge_bom', name: 'Digital Edge BOM (Navi Mumbai)', itLoad: 120, pue: 1.20, workload: 'inference', cooling: 'liquid', tier: 'Tier IV', chipset: 'blackwell', cleanGoal: 95 },
  { id: 'equinix_mb', name: 'Equinix MB1/MB2 IBX (Mumbai)', itLoad: 45, pue: 1.30, workload: 'enterprise', cooling: 'hybrid', tier: 'Tier IV', chipset: 'cloud_cpu', cleanGoal: 90 }
];

const SUPPLIER_PRESETS = [
  { id: 'khavda_mega', name: 'Adani Green Khavda Mega Park', capacity: 2000, solarPct: 55, windPct: 30, storagePct: 15, storageDuration: 4, tariff: 3.85, lossPct: 3.5 },
  { id: 'pinnapuram_psp', name: 'Greenko Pinnapuram IRESP', capacity: 1200, solarPct: 40, windPct: 20, storagePct: 40, storageDuration: 6, tariff: 4.35, lossPct: 3.0 },
  { id: 'renew_rajasthan', name: 'ReNew Rajasthan Hybrid Hub', capacity: 600, solarPct: 60, windPct: 30, storagePct: 10, storageDuration: 4, tariff: 4.10, lossPct: 3.8 },
  { id: 'cleanmax_ci', name: 'CleanMax Corporate C&I Hybrid', capacity: 150, solarPct: 70, windPct: 20, storagePct: 10, storageDuration: 2, tariff: 4.25, lossPct: 2.5 }
];

const HOURLY_SOLAR_CURVE = [0.0, 0.0, 0.0, 0.0, 0.0, 0.02, 0.15, 0.40, 0.68, 0.88, 0.98, 1.0, 0.96, 0.85, 0.65, 0.38, 0.12, 0.02, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
const HOURLY_WIND_CURVE = [0.88, 0.92, 0.95, 0.94, 0.86, 0.75, 0.60, 0.45, 0.35, 0.30, 0.28, 0.30, 0.32, 0.36, 0.45, 0.58, 0.72, 0.84, 0.90, 0.92, 0.95, 0.92, 0.89, 0.85];

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState('both');
  const [selectedSeason, setSelectedSeason] = useState('summer');
  const [showHourlyTable, setShowHourlyTable] = useState(false);

  // Data Center Parameters
  const [itLoadMw, setItLoadMw] = useState(60);
  const [targetPue, setTargetPue] = useState(1.22);
  const [workloadType, setWorkloadType] = useState('ai_training');
  const [coolingType, setCoolingType] = useState('liquid');
  const [brownTariffInr, setBrownTariffInr] = useState(9.20);
  const [cleanGoalPct, setCleanGoalPct] = useState(100);

  // Supplier Parameters
  const [plantCapacityMw, setPlantCapacityMw] = useState(300);
  const [solarPct, setSolarPct] = useState(50);
  const [windPct, setWindPct] = useState(30);
  const [storagePct, setStoragePct] = useState(20);
  const [storageDurationHours, setStorageDurationHours] = useState(4);
  const [ppaTariffInr, setPpaTariffInr] = useState(4.15);
  const [transmissionLossPct, setTransmissionLossPct] = useState(3.5);

  const seasonModifiers = useMemo(() => {
    switch (selectedSeason) {
      case 'monsoon': return { solar: 0.58, wind: 1.35, ambientTemp: '28°C (High Cloud Cover & Gusting Wind)' };
      case 'winter': return { solar: 0.90, wind: 0.80, ambientTemp: '20°C (Clear Atmospheric Insolation)' };
      default: return { solar: 1.05, wind: 0.95, ambientTemp: '42°C (Peak Thermal Radiation)' };
    }
  }, [selectedSeason]);

  const handleCoolingChange = (type) => {
    setCoolingType(type);
    if (type === 'immersion') setTargetPue(1.12);
    else if (type === 'liquid') setTargetPue(1.20);
    else if (type === 'hybrid') setTargetPue(1.28);
    else if (type === 'air') setTargetPue(1.42);
  };

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

  const simulation = useMemo(() => {
    const coolingOverheadMw = itLoadMw * (targetPue - 1.0);
    const totalFacilityDemandMw = itLoadMw * targetPue;

    const getWorkloadFactor = (hour) => {
      if (workloadType === 'ai_training') return 0.98 + 0.04 * Math.sin(hour * 0.2);
      if (workloadType === 'inference') return hour >= 9 && hour <= 21 ? 1.02 : 0.72;
      return hour >= 22 || hour <= 7 ? 1.05 : 0.65;
    };

    const normSum = solarPct + windPct + storagePct || 100;
    const actualSolarMw = (solarPct / normSum) * plantCapacityMw;
    const actualWindMw = (windPct / normSum) * plantCapacityMw;
    const actualStorageMw = (storagePct / normSum) * plantCapacityMw;
    const totalStorageMwh = actualStorageMw * storageDurationHours;

    let currentSoCMwh = totalStorageMwh * 0.4;
    const hourlyData = [];

    let totalGenMwh = 0;
    let totalDCDemandMwh = 0;
    let totalCleanDeliveredMwh = 0;
    let totalGridDeficitMwh = 0;
    let totalCurtailmentMwh = 0;
    let totalStorageChargedMwh = 0;
    let totalStorageDischargedMwh = 0;

    for (let h = 0; h < 24; h++) {
      const timeLabel = `${String(h).padStart(2, '0')}:00`;

      const loadFactor = getWorkloadFactor(h);
      const hourDCDemandMw = +(totalFacilityDemandMw * loadFactor).toFixed(2);
      totalDCDemandMwh += hourDCDemandMw;

      const lossMultiplier = 1.0 - (transmissionLossPct / 100.0);
      const rawSolarMw = actualSolarMw * HOURLY_SOLAR_CURVE[h] * seasonModifiers.solar * lossMultiplier;
      const rawWindMw = actualWindMw * HOURLY_WIND_CURVE[h] * seasonModifiers.wind * lossMultiplier;
      const directGenerationMw = +(rawSolarMw + rawWindMw).toFixed(2);
      totalGenMwh += directGenerationMw;

      let storageDischargeMw = 0;
      let storageChargeMw = 0;

      if (directGenerationMw > hourDCDemandMw) {
        const surplusMw = directGenerationMw - hourDCDemandMw;
        const maxChargeAllowedMw = Math.min(actualStorageMw, (totalStorageMwh - currentSoCMwh));
        storageChargeMw = +Math.max(0, Math.min(surplusMw, maxChargeAllowedMw)).toFixed(2);
        currentSoCMwh += storageChargeMw * 0.90;
        totalStorageChargedMwh += storageChargeMw;
      } else {
        const deficitMw = hourDCDemandMw - directGenerationMw;
        const maxDischargeAllowedMw = Math.min(actualStorageMw, currentSoCMwh);
        storageDischargeMw = +Math.max(0, Math.min(deficitMw, maxDischargeAllowedMw)).toFixed(2);
        currentSoCMwh -= storageDischargeMw;
        totalStorageDischargedMwh += storageDischargeMw;
      }

      currentSoCMwh = Math.max(0, Math.min(totalStorageMwh, currentSoCMwh));
      const socPercentage = totalStorageMwh > 0 ? Math.round((currentSoCMwh / totalStorageMwh) * 100) : 0;

      const cleanDeliveredMw = +Math.min(hourDCDemandMw, directGenerationMw + storageDischargeMw).toFixed(2);
      totalCleanDeliveredMwh += cleanDeliveredMw;

      const gridDeficitMw = +Math.max(0, hourDCDemandMw - cleanDeliveredMw).toFixed(2);
      totalGridDeficitMwh += gridDeficitMw;

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

    const rtcMatchPct = totalDCDemandMwh > 0
      ? Math.min(100, +((totalCleanDeliveredMwh / totalDCDemandMwh) * 100).toFixed(1))
      : 100;

    const capacityUtilFactor = plantCapacityMw > 0
      ? +((totalGenMwh / (plantCapacityMw * 24)) * 100).toFixed(1)
      : 0;

    const annualDCMwh = totalDCDemandMwh * 365;
    const annualCleanDeliveredMwh = totalCleanDeliveredMwh * 365;
    const annualGridDeficitMwh = totalGridDeficitMwh * 365;
    const annualCo2AvoidedTons = Math.round(annualCleanDeliveredMwh * 0.82);

    const brownPowerAnnualCostCr = +((annualDCMwh * 1000 * brownTariffInr) / 10000000).toFixed(2);
    const greenPpaAnnualCostCr = +(
      ((annualCleanDeliveredMwh * 1000 * ppaTariffInr) + (annualGridDeficitMwh * 1000 * brownTariffInr)) / 10000000
    ).toFixed(2);
    const annualSavingsCr = +(brownPowerAnnualCostCr - greenPpaAnnualCostCr).toFixed(2);
    const annualSavingsUsdM = +(annualSavingsCr * 0.12).toFixed(2);
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
    itLoadMw, targetPue, workloadType, plantCapacityMw, solarPct, windPct,
    storagePct, storageDurationHours, ppaTariffInr, brownTariffInr,
    transmissionLossPct, seasonModifiers
  ]);

  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(simulation, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `simulation_${itLoadMw}MW_vs_${plantCapacityMw}MW.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col pt-16">
      <Navbar />

      <div className="border-b border-white/10 bg-[#0c0e10]/90 backdrop-blur-md px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-medium">
                Physics Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              National Grid & Clean Power Simulator
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Model real-time generation dispatch, storage battery balancing, workload curves, and RTC clean energy matching.
            </p>
          </div>

          <div className="flex items-center bg-black/80 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('both')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'both' ? 'bg-emerald-500/20 text-emerald-400' : 'text-neutral-400 hover:text-white'
                }`}
            >
              <Activity className="w-4 h-4" />
              <span>Dispatch Matcher</span>
            </button>
            <button
              onClick={() => setActiveTab('datacenter')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'datacenter' ? 'bg-sky-500/20 text-sky-400' : 'text-neutral-400 hover:text-white'
                }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Data Center</span>
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'supplier' ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-400 hover:text-white'
                }`}
            >
              <Zap className="w-4 h-4" />
              <span>Supplier</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 space-y-8">

        {/* KPI Scorecard */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>RTC Match</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {simulation.rtcMatchPct}%
            </div>
            <div className="text-xs text-emerald-400 mt-1">Direct clean supply</div>
            <div className="absolute top-0 right-0 h-1 w-full bg-emerald-500/40" />
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Facility Load</span>
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {simulation.totalFacilityDemandMw} <span className="text-sm font-normal text-neutral-500">MW</span>
            </div>
            <div className="text-xs text-sky-400 mt-1">IT: {simulation.itLoadMw} MW | Cooling: {simulation.coolingOverheadMw} MW</div>
            <div className="absolute top-0 right-0 h-1 w-full bg-sky-500/40" />
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Clean Generation</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {simulation.totalGenMwh} <span className="text-sm font-normal text-neutral-500">MWh/day</span>
            </div>
            <div className="text-xs text-amber-400 mt-1">CUF: {simulation.capacityUtilFactor}%</div>
            <div className="absolute top-0 right-0 h-1 w-full bg-amber-500/40" />
          </div>

          <div className="bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Annual PPA Savings</span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              ₹{simulation.annualSavingsCr} <span className="text-sm font-normal text-neutral-500">Cr</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">${simulation.annualSavingsUsdM}M USD vs grid</div>
            <div className="absolute top-0 right-0 h-1 w-full bg-emerald-500/40" />
          </div>

          <div className="col-span-2 lg:col-span-1 bg-[#111317] border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>CO₂ Abated / Yr</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {simulation.annualCo2AvoidedTons.toLocaleString()} <span className="text-sm font-normal text-neutral-500">t</span>
            </div>
            <div className="text-xs text-cyan-400 mt-1">CEA 0.82 kg/kWh emission factor</div>
            <div className="absolute top-0 right-0 h-1 w-full bg-cyan-500/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Data Center Configuration */}
          {(activeTab === 'both' || activeTab === 'datacenter') && (
            <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-[#111317] border border-white/10 rounded-xl p-5 space-y-5`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-sm">Data Center Profile</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">CONSUMER</span>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-2 uppercase">Load Presets:</label>
                <div className="grid grid-cols-2 gap-2">
                  {DC_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyDCPreset(p)}
                      className="p-2.5 rounded-lg bg-black/40 hover:bg-neutral-800 border border-white/10 text-left transition-colors"
                    >
                      <div className="text-xs font-medium text-white truncate">{p.name}</div>
                      <div className="text-xs text-sky-400 mt-0.5">{p.itLoad} MW • PUE {p.pue}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-neutral-300">IT Compute Load (MW):</span>
                  <span className="font-mono text-sky-400 font-bold">{itLoadMw} MW</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={itLoadMw}
                  onChange={(e) => setItLoadMw(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-neutral-300">Cooling Architecture:</span>
                  <span className="font-mono text-emerald-400 font-bold">PUE {targetPue}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'immersion', label: 'Immersion', pue: 1.12 },
                    { id: 'liquid', label: 'Liquid', pue: 1.20 },
                    { id: 'hybrid', label: 'Evaporative', pue: 1.28 },
                    { id: 'air', label: 'Air Chilled', pue: 1.42 },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCoolingChange(c.id)}
                      className={`p-2 rounded-lg border text-center transition-colors text-xs ${coolingType === c.id ? 'border-sky-500 bg-sky-500/20 text-white' : 'border-white/10 bg-black/40 text-neutral-400'
                        }`}
                    >
                      <div className="font-medium">{c.label}</div>
                      <div className="text-xs opacity-75 mt-0.5">{c.pue}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-2 uppercase">Workload Dispatch Curve:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ai_training', label: 'AI Training', sub: 'Flat Baseload' },
                    { id: 'inference', label: 'Cloud Inference', sub: 'Daytime Peak' },
                    { id: 'batch', label: 'Batch Processing', sub: 'Night-Shift Heavy' }
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWorkloadType(w.id)}
                      className={`p-2.5 rounded-lg border text-left transition-colors ${workloadType === w.id ? 'border-emerald-500 bg-emerald-500/20 text-white' : 'border-white/10 bg-black/40 text-neutral-400'
                        }`}
                    >
                      <div className="text-xs font-medium">{w.label}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{w.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">State Grid Tariff (₹/kWh):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="6"
                    max="15"
                    value={brownTariffInr}
                    onChange={(e) => setBrownTariffInr(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Clean Target (% RTC):</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={cleanGoalPct}
                    onChange={(e) => setCleanGoalPct(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Supplier Configuration */}
          {(activeTab === 'both' || activeTab === 'supplier') && (
            <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-[#111317] border border-white/10 rounded-xl p-5 space-y-5`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm">Supplier & Storage Profile</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">SUPPLY</span>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-2 uppercase">Project Presets:</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPLIER_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applySupplierPreset(p)}
                      className="p-2.5 rounded-lg bg-black/40 hover:bg-neutral-800 border border-white/10 text-left transition-colors"
                    >
                      <div className="text-xs font-medium text-white truncate">{p.name}</div>
                      <div className="text-xs text-amber-400 mt-0.5">{p.capacity} MW • ₹{p.tariff}/kWh</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-neutral-300">Installed Generation Capacity (MW):</span>
                  <span className="font-mono text-amber-400 font-bold">{plantCapacityMw} MW</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1500"
                  step="20"
                  value={plantCapacityMw}
                  onChange={(e) => setPlantCapacityMw(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-2 uppercase">Technology Split:</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/40 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-amber-400 font-medium flex items-center gap-1.5"><Sun className="w-3.5 h-3.5" /> Solar</span>
                      <span className="text-white">{solarPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={solarPct}
                      onChange={(e) => setSolarPct(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                    <span className="text-xs text-neutral-500 block mt-1">{simulation.actualSolarMw} MW</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-sky-400 font-medium flex items-center gap-1.5"><Wind className="w-3.5 h-3.5" /> Wind</span>
                      <span className="text-white">{windPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={windPct}
                      onChange={(e) => setWindPct(Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                    <span className="text-xs text-neutral-500 block mt-1">{simulation.actualWindMw} MW</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-emerald-400 font-medium flex items-center gap-1.5"><BatteryCharging className="w-3.5 h-3.5" /> Storage</span>
                      <span className="text-white">{storagePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={storagePct}
                      onChange={(e) => setStoragePct(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                    <span className="text-xs text-neutral-500 block mt-1">{simulation.totalStorageMwh} MWh</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="text-xs text-neutral-400 block mb-2">Climate Season:</label>
                  <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                    {['summer', 'monsoon', 'winter'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSeason(s)}
                        className={`flex-1 py-1.5 rounded text-xs capitalize transition-colors ${selectedSeason === s ? 'bg-amber-500/20 text-amber-400 font-medium' : 'text-neutral-400 hover:text-white'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">PPA Offer Rate (₹/kWh):</label>
                  <input
                    type="number"
                    step="0.05"
                    min="2.5"
                    max="7.0"
                    value={ppaTariffInr}
                    onChange={(e) => setPpaTariffInr(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charting section */}
        <div className="bg-[#111317] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                24-Hour Dispatch & Match Curve
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Simulated hourly direct solar generation, wind gusts, battery dispatch buffer, and data center load demand.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHourlyTable(!showHourlyTable)}
                className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>{showHourlyTable ? 'Hide Table' : 'View Table'}</span>
              </button>
              <button
                onClick={handleExportData}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          <div className="w-full h-80 sm:h-[400px] pt-4">
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
                <XAxis dataKey="hour" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#111317] border border-white/20 p-4 rounded-xl shadow-xl text-sm space-y-2 min-w-[220px]">
                          <div className="font-bold text-white border-b border-white/10 pb-2 flex justify-between">
                            <span>{label}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${d.matchPct >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {d.matchPct}% Match
                            </span>
                          </div>
                          <div className="text-neutral-300 flex justify-between">
                            <span>Load:</span>
                            <span className="font-bold text-white">{d.dcDemandMw} MW</span>
                          </div>
                          <div className="text-amber-400 flex justify-between">
                            <span>Solar:</span>
                            <span>{d.solarMw} MW</span>
                          </div>
                          <div className="text-sky-400 flex justify-between">
                            <span>Wind:</span>
                            <span>{d.windMw} MW</span>
                          </div>
                          {d.storageDischargeMw > 0 && (
                            <div className="text-emerald-400 flex justify-between">
                              <span>BESS Discharging:</span>
                              <span>+{d.storageDischargeMw} MW</span>
                            </div>
                          )}
                          {d.storageChargeMw > 0 && (
                            <div className="text-purple-400 flex justify-between">
                              <span>BESS Charging:</span>
                              <span>-{d.storageChargeMw} MW</span>
                            </div>
                          )}
                          {d.gridDeficitMw > 0 && (
                            <div className="text-red-400 flex justify-between font-medium border-t border-white/10 pt-2">
                              <span>Grid Deficit:</span>
                              <span>{d.gridDeficitMw} MW</span>
                            </div>
                          )}
                          <div className="text-neutral-500 text-xs pt-1">
                            State of Charge: {d.socPct}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 15 }} />

                <Area type="monotone" dataKey="solarMw" name="Solar" stackId="gen" stroke="#f59e0b" fill="url(#solarGrad)" />
                <Area type="monotone" dataKey="windMw" name="Wind" stackId="gen" stroke="#38bdf8" fill="url(#windGrad)" />
                <Area type="monotone" dataKey="storageDischargeMw" name="Discharge" stackId="gen" stroke="#10b981" fill="url(#storageGrad)" />
                <Area type="monotone" dataKey="gridDeficitMw" name="Deficit" stroke="#ef4444" fill="url(#deficitGrad)" strokeDasharray="4 4" />

                <Line type="monotone" dataKey="dcDemandMw" name="Demand" stroke="#ffffff" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Data Table */}
        {showHourlyTable && (
          <div className="bg-[#111317] border border-white/10 rounded-xl p-5 overflow-hidden">
            <h3 className="font-bold text-base text-white mb-4">Hourly Dispatch Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="py-3 px-4 font-medium">Hour</th>
                    <th className="py-3 px-4 font-medium">Solar MW</th>
                    <th className="py-3 px-4 font-medium">Wind MW</th>
                    <th className="py-3 px-4 font-medium">BESS Out</th>
                    <th className="py-3 px-4 font-medium">BESS In</th>
                    <th className="py-3 px-4 font-medium text-sky-400">Load MW</th>
                    <th className="py-3 px-4 font-medium text-emerald-400">Delivered</th>
                    <th className="py-3 px-4 font-medium text-red-400">Deficit</th>
                    <th className="py-3 px-4 font-medium">Match %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {simulation.hourlyData.map((row) => (
                    <tr key={row.hour} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white">{row.hour}</td>
                      <td className="py-3 px-4 text-amber-400">{row.solarMw}</td>
                      <td className="py-3 px-4 text-sky-400">{row.windMw}</td>
                      <td className="py-3 px-4 text-emerald-400">{row.storageDischargeMw > 0 ? `+${row.storageDischargeMw}` : '-'}</td>
                      <td className="py-3 px-4 text-purple-400">{row.storageChargeMw > 0 ? `-${row.storageChargeMw}` : '-'}</td>
                      <td className="py-3 px-4 text-white font-medium">{row.dcDemandMw}</td>
                      <td className="py-3 px-4 text-emerald-400">{row.cleanDeliveredMw}</td>
                      <td className="py-3 px-4 text-red-400">{row.gridDeficitMw > 0 ? row.gridDeficitMw : '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${row.matchPct === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
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

      </div>
    </div>
  );
}