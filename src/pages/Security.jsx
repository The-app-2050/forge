import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, ShieldCheck, AlertTriangle, Lock, EyeOff, Search } from "lucide-react";
import ForgeLayout from "@/components/forge/ForgeLayout";
import DataStream from "@/components/forge/DataStream";
import PaywallModal from "@/components/forge/PaywallModal";

const THREAT_LEVELS = [
  { level: "SECURE", color: "#10B981", Icon: ShieldCheck, desc: "All systems nominal. Perimeter locked." },
  { level: "ELEVATED", color: "#F59E0B", Icon: AlertTriangle, desc: "Anomalous patterns detected. Monitoring active." },
  { level: "CRITICAL", color: "#EF4444", Icon: AlertTriangle, desc: "Breach signature detected. Immediate action required." },
];

const CATEGORY_COLORS = {
  motion: "#F59E0B",
  door: "#3B82F6",
  pattern: "#8B5CF6",
  purge: "#10B981",
  scan: "#a5b4fc",
  test: "#6B7280",
};

export default function Security() {
  const [threatIdx, setThreatIdx] = useState(0);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [purging, setPurging] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [profiles, secEvents] = await Promise.all([
      base44.entities.UserProfile.list(),
      base44.entities.SecurityEvent.list("-created_date", 50),
    ]);
    if (profiles.length > 0) setProfile(profiles[0]);
    setEvents(secEvents);
  };

  const cycleShield = async () => {
    const next = (threatIdx + 1) % THREAT_LEVELS.length;
    setThreatIdx(next);
    await base44.entities.SecurityEvent.create({
      title: "Shield Scan Executed",
      body: `Threat assessment updated to ${THREAT_LEVELS[next].level} by Security Guardian.`,
      category: "scan",
    });
    await base44.entities.SystemLog.create({
      action: `Shield scan executed. Threat level: ${THREAT_LEVELS[next].level}.`,
      reason: "Manual shield cycle triggered.",
      agentName: "Security Guardian",
      impact: `Perimeter status: ${THREAT_LEVELS[next].desc}`,
    });
    loadData();
  };

  const triggerPurge = async () => {
    if (!profile?.isPremium) {
      setShowPaywall(true);
      return;
    }
    setPurging(true);
    await new Promise(r => setTimeout(r, 1500));
    await base44.entities.SecurityEvent.create({
      title: "Instant Purge Executed",
      body: "Metadata trails scrubbed. Digital footprint cleared.",
      category: "purge",
    });
    await base44.entities.SystemLog.create({
      action: "Instant purge executed. Metadata trails scrubbed.",
      reason: "User triggered emergency purge.",
      agentName: "Security Guardian",
      impact: "All tracking vectors neutralized.",
    });
    setPurging(false);
    loadData();
  };

  const simulateEvent = async () => {
    await base44.entities.SecurityEvent.create({
      title: "Motion Detected",
      body: "Unusual activity pattern logged by Security Guardian.",
      category: "motion",
    });
    await base44.entities.SystemLog.create({
      action: "Motion event detected and logged.",
      reason: "HomeKit sensor triggered.",
      agentName: "Security Guardian",
      impact: "Event archived in Notification Vault.",
    });
    loadData();
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.body?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  const threat = THREAT_LEVELS[threatIdx];
  const ThreatIcon = threat.Icon;

  return (
    <ForgeLayout dataStream={<DataStream variant="binary" opacity={0.18} />}>
      <div className="px-4 pt-6 pb-4">
        <div className="mb-6">
          <p className="text-xs tracking-[0.35em] text-red-500/70 uppercase mb-1">SECURITY GUARDIAN</p>
          <h1 className="text-2xl font-black text-white tracking-tight">SECURITY</h1>
          <p className="text-xs text-gray-600 mt-0.5">Containment & Privacy Perimeter</p>
        </div>

        {/* Threat Level */}
        <div
          className="rounded-2xl p-5 mb-4 border"
          style={{
            borderColor: `${threat.color}40`,
            backgroundColor: `${threat.color}08`,
            boxShadow: `0 0 20px ${threat.color}15`,
          }}
        >
          <div className="flex items-center gap-3">
            <ThreatIcon className="w-6 h-6" style={{ color: threat.color }} />
            <div className="flex-1">
              <p className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: threat.color }}>
                THREAT LEVEL: {threat.level}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{threat.desc}</p>
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">Local Sandbox</p>
              <p className="text-xs text-emerald-400 font-bold mt-0.5">ENFORCED</p>
            </div>
          </div>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">Anti-Tracking</p>
              <p className="text-xs text-emerald-400 font-bold mt-0.5">ACTIVE</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={cycleShield}
            className="py-3 rounded-xl bg-white/3 border border-white/5 text-xs text-white font-bold tracking-wider hover:border-violet-500/30 transition-colors"
          >
            CYCLE SHIELD SCAN
          </button>
          <button
            onClick={triggerPurge}
            disabled={purging}
            className="py-3 rounded-xl text-xs font-bold tracking-wider transition-all disabled:opacity-50"
            style={{
              background: profile?.isPremium
                ? "linear-gradient(to right, #7C3AED, #4F46E5)"
                : "rgba(239,68,68,0.1)",
              border: profile?.isPremium ? "none" : "1px solid rgba(239,68,68,0.3)",
              color: profile?.isPremium ? "white" : "#EF4444",
            }}
          >
            {purging ? "PURGING..." : profile?.isPremium ? "INSTANT PURGE" : "INSTANT PURGE"}
          </button>
        </div>

        {/* Notification Vault */}
        <div>
          <p className="text-xs tracking-[0.35em] text-gray-500 uppercase mb-3">NOTIFICATION VAULT</p>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              className="w-full bg-white/2 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/40 transition-colors"
              placeholder="Search vault..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <Shield className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-700">No security events logged.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map(event => (
                <div key={event.id} className="bg-white/2 border border-white/5 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-white font-medium leading-snug">{event.title}</p>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wider"
                      style={{
                        color: CATEGORY_COLORS[event.category] || "#6B7280",
                        backgroundColor: `${CATEGORY_COLORS[event.category] || "#6B7280"}18`,
                        border: `1px solid ${CATEGORY_COLORS[event.category] || "#6B7280"}40`,
                      }}
                    >
                      {event.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{event.body}</p>
                  <p className="text-[10px] text-gray-700 mt-2">
                    {new Date(event.created_date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={simulateEvent}
            className="w-full mt-4 py-3 rounded-xl border border-dashed border-white/10 text-xs text-gray-600 hover:text-gray-400 hover:border-white/20 transition-colors tracking-wider"
          >
            + SIMULATE SECURITY EVENT
          </button>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            setProfile(p => p ? { ...p, isPremium: true } : p);
          }}
        />
      )}
    </ForgeLayout>
  );
}
