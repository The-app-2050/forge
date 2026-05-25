import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Infinity, Shield, Brain, Sparkles, Zap } from "lucide-react";

const FEATURES = [
  { icon: Shield, color: "#EF4444", label: "Full Security Guardian" },
  { icon: Brain, color: "#8B5CF6", label: "Unlimited Recall" },
  { icon: Sparkles, color: "#a5b4fc", label: "Cinematic Core Access" },
  { icon: Zap, color: "#F59E0B", label: "Priority Processing" },
];

export default function PaywallModal({ onClose, onSuccess }) {
  const [plan, setPlan] = useState("annual");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const profiles = await base44.entities.UserProfile.list();
    if (profiles.length > 0) {
      await base44.entities.UserProfile.update(profiles[0].id, { isPremium: true });
    }
    await base44.entities.SystemLog.create({
      action: "Premium unlocked. All agents operating at full capacity.",
      reason: "User completed upgrade flow.",
      agentName: "Orchestrator",
      impact: "All premium features now active. Forge operating at maximum power.",
    });
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1a0b2e] to-[#050505] rounded-t-3xl border-t border-x border-violet-500/20 p-6 pb-10">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-600/15 border border-violet-500/40 flex items-center justify-center glow-violet">
            <Infinity className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">AWAKEN THE CORE</h2>
          <p className="text-sm text-gray-500 text-center">Unlock the full power of your personal AI OS</p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${f.color}18` }}>
                  <Icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                <p className="text-sm text-gray-300">{f.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setPlan("monthly")}
            className={`p-4 rounded-2xl border text-center transition-all ${plan === "monthly" ? "border-violet-500/60 bg-violet-600/10" : "border-white/5 bg-white/3"}`}
          >
            <p className="text-sm font-bold text-white">Monthly</p>
            <p className="text-xs text-violet-400 mt-1">$12.99/mo</p>
          </button>
          <button
            onClick={() => setPlan("annual")}
            className={`p-4 rounded-2xl border text-center transition-all relative ${plan === "annual" ? "border-violet-500/60 bg-violet-600/10" : "border-white/5 bg-white/3"}`}
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-emerald-500 text-black font-black px-2 py-0.5 rounded-full tracking-wider">SAVE 35%</span>
            <p className="text-sm font-bold text-white">Annual</p>
            <p className="text-xs text-violet-400 mt-1">$99.99/yr</p>
          </button>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold tracking-widest text-sm uppercase disabled:opacity-50 transition-opacity mb-4"
        >
          {loading ? "INITIATING..." : "INITIATE UPGRADE →"}
        </button>

        <p className="text-center text-[10px] text-gray-600">
          Restore Purchases · Terms of Service · Privacy Policy
        </p>
      </div>
    </div>
  );
}
