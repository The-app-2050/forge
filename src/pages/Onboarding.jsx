import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { User, MapPin, Shield, Brain, MessageSquare, Activity } from "lucide-react";
import CrystalCore from "@/components/forge/CrystalCore";
import DataStream from "@/components/forge/DataStream";

const STYLES = [
  { id: "cinematic", label: "CINEMATIC", desc: "Full visual depth" },
  { id: "stealth", label: "STEALTH", desc: "Dark minimal mode" },
  { id: "developer", label: "DEVELOPER", desc: "Terminal aesthetic" },
];

const AGENTS = [
  { icon: Shield, color: "#EF4444", name: "Security Guardian", desc: "Monitors your perimeter. Detects motion, door activity, and unusual patterns.", delay: 0 },
  { icon: Brain, color: "#8B5CF6", name: "Recall Agent", desc: "Stores memories and insights. Everything you want to remember — saved forever.", delay: 150 },
  { icon: MessageSquare, color: "#3B82F6", name: "Communication Agent", desc: "Generates smart replies. Helps you respond quickly and clearly.", delay: 300 },
  { icon: Activity, color: "#10B981", name: "Resilience Agent", desc: "Tracks patterns, routines, and disruptions. Keeps you stable and prepared.", delay: 450 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [loading, setLoading] = useState(false);
  const [agentsVisible, setAgentsVisible] = useState(false);

  const handleNext = () => {
    if (!name.trim()) return;
    setStep(2);
    setTimeout(() => setAgentsVisible(true), 100);
  };

  const handleAwaken = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. Create Profile
      await supabase.from('profiles').insert({
        id: user.id,
        name: name.trim(),
        location: location.trim(),
        preferred_style: style,
        is_premium: false,
        forged_at: new Date().toISOString(),
      });

      // 2. Create System Log
      await supabase.from('system_logs').insert({
        user_id: user.id,
        action: "Core awakened. All agents online.",
        reason: "User completed onboarding sequence.",
        agent_name: "Orchestrator",
        impact: "Forge is now fully operational.",
      });

      navigate("/brief");
    } catch (error) {
      console.error("Onboarding error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      <DataStream variant="matrix" opacity={0.3} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e]/80 via-transparent to-[#050505]/90 pointer-events-none" />
      <div className="w-full max-w-md">

        {step === 1 && (
          <div className="flex flex-col gap-8" style={{ animation: "slideUpFade 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-52 h-52 rounded-full bg-violet-600/10 blur-3xl" />
                <CrystalCore size={200} />
              </div>
              <div className="text-center">
                <p className="text-xs tracking-[0.4em] text-violet-500 uppercase mb-2">FORGE OS v1.0</p>
                <h1 className="text-3xl font-black text-white tracking-tight">INITIALIZE FORGE</h1>
                <p className="text-sm text-gray-400 mt-3 leading-relaxed max-w-xs mx-auto">
                  Your personal AI collective is ready to come online. Everything runs here. No external servers. Just your intelligence, amplified.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                <input
                  className="w-full bg-violet-950/30 border border-violet-500/30 rounded-2xl pl-11 pr-4 py-4 text-white placeholder-violet-400/50 text-sm focus:outline-none focus:border-violet-400 focus:bg-violet-950/50 transition-all"
                  placeholder="What do they call you?"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                <input
                  className="w-full bg-violet-950/30 border border-violet-500/30 rounded-2xl pl-11 pr-4 py-4 text-white placeholder-violet-400/50 text-sm focus:outline-none focus:border-violet-400 focus:bg-violet-950/50 transition-all"
                  placeholder="Where are you operating from?"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">Interface Resonance</p>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      style === s.id
                        ? "border-violet-500/60 bg-violet-600/15 text-violet-300"
                        : "border-white/5 bg-white/2 text-gray-500 hover:border-violet-500/30"
                    }`}
                  >
                    <p className="text-xs font-bold tracking-wider">{s.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold tracking-widest text-sm uppercase disabled:opacity-30 transition-opacity"
            >
              INITIALIZE AGENTS →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8" style={{ animation: "slideUpFade 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="text-center">
              <p className="text-xs tracking-[0.4em] text-violet-500 uppercase mb-2">AGENT ACTIVATION</p>
              <h1 className="text-2xl font-black text-white tracking-tight">YOUR COLLECTIVE IS<br />COMING ONLINE</h1>
            </div>

            <div className="flex flex-col gap-3">
              {AGENTS.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.name} className="bg-white/3 border border-white/5 rounded-2xl p-4 flex items-start gap-4 transition-all duration-500"
                    style={{ opacity: agentsVisible ? 1 : 0, transform: agentsVisible ? 'translateY(0)' : 'translateY(20px)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${agent.color}18`, border: `1px solid ${agent.color}40` }}>
                      <Icon className="w-5 h-5" style={{ color: agent.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{agent.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{agent.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleAwaken}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold tracking-widest text-sm uppercase disabled:opacity-50 transition-opacity"
            >
              {loading ? "AWAKENING..." : "AWAKEN THE CORE →"}
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes slideUpFade { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
