import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { EnergyOptimizationEngine, type EnergyMetric, type EnergySavingsPrediction } from '../lib/energyOptimizationEngine';
import {
  Zap,
  Sparkles,
  Droplet,
  Snowflake,
  TrendingDown,
  CheckCircle2,
  Lock,
  IndianRupee,
  Leaf,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const ENERGY_USAGE_TREND = [
  { time: '08:00', BaselineKWh: 580, OptimizedKWh: 480 },
  { time: '10:00', BaselineKWh: 640, OptimizedKWh: 520 },
  { time: '12:00', BaselineKWh: 710, OptimizedKWh: 570 },
  { time: '14:00', BaselineKWh: 690, OptimizedKWh: 550 },
  { time: '16:00', BaselineKWh: 610, OptimizedKWh: 490 },
  { time: '18:00', BaselineKWh: 450, OptimizedKWh: 380 },
];

export const EnergyPortal: React.FC = () => {
  const { currentRole } = useRole();
  const isStudent = currentRole === 'Student';

  const [telemetry, setTelemetry] = useState<EnergyMetric[]>(
    EnergyOptimizationEngine.getEnergyTelemetry()
  );
  const [prediction, setPrediction] = useState<EnergySavingsPrediction>(
    EnergyOptimizationEngine.predictEnergySavings()
  );
  const [executedPayloads, setExecutedPayloads] = useState<string[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleExecuteEnergyAction = (payload: string, title: string) => {
    const res = EnergyOptimizationEngine.executeEnergyAction(payload);
    setExecutedPayloads(prev => [...prev, payload]);
    setActiveMessage(res.message);
    setTimeout(() => setActiveMessage(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-teal-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/20">
                <Leaf size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  AI Energy & Sustainability Optimization
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    IoT Telemetry Active
                  </span>
                </h1>
                <p className="text-xs text-slate-300">Real-Time Electricity, Water & AC/HVAC Optimization &bull; Projected Savings Engine</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              PREDICTED SAVINGS: ₹4.2 LAKHS / MO
            </span>
          </div>
        </div>
      </div>

      {/* Dispatch Feedback Message */}
      {activeMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 size={18} />
          <span>{activeMessage}</span>
        </div>
      )}

      {/* Real-time Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {telemetry.map((m, idx) => (
          <div key={idx} className="glass-card p-5 space-y-2 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                {m.category === 'Electricity' && <Zap size={16} className="text-amber-400" />}
                {m.category === 'AC_HVAC' && <Snowflake size={16} className="text-cyan-400" />}
                {m.category === 'Water' && <Droplet size={16} className="text-blue-400" />}
                {m.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                -{m.activeSavingsPercent}% REDUCTION
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <p className="text-2xl font-extrabold text-white">
                {m.currentUsage} <span className="text-xs font-normal text-slate-400">{m.unit}</span>
              </p>
              <span className="text-xs text-slate-400">Baseline: {m.baselineUsage} {m.unit}</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${100 - m.activeSavingsPercent}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Projected Energy & Cost Savings Grid */}
      <div className="glass-card p-6 space-y-6 border-emerald-500/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              AI Energy Savings Forecast & Auto-Optimization Dispatches
            </h3>
            <p className="text-xs text-slate-400">Estimated monthly cost reduction: <strong className="text-emerald-400 font-mono">₹4,20,000 / month</strong> (18.5% savings)</p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            CO2 Cut: 12.4 Tons / Mo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prediction.topOptimizations.map((opt, idx) => {
            const isExecuted = executedPayloads.includes(opt.actionPayload);

            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{opt.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      +₹{(opt.estimatedSavingsINR / 1000).toFixed(0)}k/mo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{opt.description}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleExecuteEnergyAction(opt.actionPayload, opt.title)}
                    disabled={isExecuted}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isExecuted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {isExecuted ? (
                      <>
                        <CheckCircle2 size={14} /> Optimization Active ✓
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> Activate Eco Mode &rarr;
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recharts Usage Comparison Chart */}
      <div className="glass-card p-6 space-y-4 border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Baseline Power Usage vs AI Optimized Consumption (kW/h)</h3>
            <p className="text-xs text-slate-400">Live 24-Hour Telemetry Stream</p>
          </div>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ENERGY_USAGE_TREND}>
              <defs>
                <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#64748B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="OptimizedKWh" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorOpt)" />
              <Area type="monotone" dataKey="BaselineKWh" stroke="#64748B" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0.2} fill="url(#colorBase)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
