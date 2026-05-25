import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Shield, Brain, MessageSquare, Activity, AlertTriangle } from "lucide-react";
import DataStream from "@/components/forge/DataStream";

const AGENTS = [
  { icon: Shield, color: "#EF4444", name: "Security Guardian" },
  { icon: Brain, color: "#8B5CF6", name: "Recall Agent" },
  { icon: MessageSquare, color: "#3B82F6", name: "Communication Agent" },
  { icon: Activity, color: "#10B981", name: "Resilience Agent" },
];

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    base44.entities.UserProfile.list().then(profiles => {
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setName(profiles[0].name || "");
        setLocation(profiles[0].location || "");
      }
    });
  }, []);

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    const updated = await base44.entities.UserProfile.update(profile.id, { name, location });
    setProfile(updated);
    setSaving(false);
  };

  const resetCore = async () => {
    setResetting(true);
    const [profiles, visions, logs, events, briefs] = await Promise.all([
      base44.entities.UserProfile.list(),
      base44.entities.Vision.list(),
      base44.entities.SystemLog.list(),
      base44.entities.SecurityEvent.list(),
      base44.entities.DailyBrief.list(),
    ]);
    await Promise.all([
      ...profiles.map(p => base44.entities.UserProfile.delete(p.id)),
      ...visions.map(v => base44.entities.Vision.delete(v.id)),
      ...logs.map(l => base44.entities.SystemLog.delete(l.id)),
      ...events.map(e => base44.entities.SecurityEvent.delete(e.id)),
      ...briefs.map(b => base44.entities.DailyBrief.delete(b.id)),
    ]);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#050505] max-w-md mx-auto px-4 pt-6 pb-10 relative overflow-hidden">
      <DataStream variant="hex" opacity={0.18} />
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/brief")}
          className="w-9 h-9 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-gray-400" />
        </button>
        <div>
          <p className="text-xs tracking-[0.35em] text-violet-500 uppercase">FORGE OS</p>
          <h1 className="text-xl font-black text-white tracking-tight">SETTINGS</h1>
        </div>
      </div>

      {/* Profile */}
      {profile && (
        <div className="bg-white/2 border border-white/5 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">Identity</p>
            <div className="flex gap-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 uppercase tracking-wider">
                {profile.preferredStyle}
              </span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                profile.isPremium
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                  : "bg-white/5 border border-white/10 text-gray-500"
              }`}>
                {profile.isPremium ? "PREMIUM" : "FREE"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">Designation</p>
              <input
                className="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40 transition-colors"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">Primary Sector</p>
              <input
                className="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40 transition-colors"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm text-white font-bold tracking-wider uppercase disabled:opacity-50 transition-opacity"
            >
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>
      )}

      {/* Agents */}
      <div className="bg-white/2 border border-white/5 rounded-2xl p-5 mb-4">
        <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">Agent Collective</p>
        <div className="flex flex-col gap-3">
          {AGENTS.map(agent => {
            const Icon = agent.icon;
            return (
              <div key={agent.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${agent.color}18`, border: `1px solid ${agent.color}30` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: agent.color }} />
                  </div>
                  <p className="text-sm text-white">{agent.name}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full tracking-wider">
                  ONLINE
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5">
        <p className="text-xs tracking-[0.3em] text-red-500/70 uppercase mb-3">Danger Zone</p>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          This will permanently delete all your data: profile, visions, security events, and activity logs. This cannot be undone.
        </p>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="w-full py-3 rounded-xl border border-red-500/30 text-sm text-red-400 font-bold tracking-wider uppercase hover:bg-red-500/10 transition-colors"
          >
            RESET CRYSTAL CORE
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-xs text-red-300 font-bold">Are you absolutely sure?</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowReset(false)}
                className="py-3 rounded-xl border border-white/10 text-sm text-gray-400 font-bold tracking-wider"
              >
                CANCEL
              </button>
              <button
                onClick={resetCore}
                disabled={resetting}
                className="py-3 rounded-xl bg-red-600 text-sm text-white font-bold tracking-wider uppercase disabled:opacity-50"
              >
                {resetting ? "RESETTING..." : "CONFIRM"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
