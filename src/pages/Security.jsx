import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Shield, ShieldCheck, AlertTriangle, Lock, EyeOff, Search } from "lucide-react";
import ForgeLayout from "@/components/forge/ForgeLayout";
import DataStream from "@/components/forge/DataStream";
import CrystalCore from "@/components/forge/CrystalCore";
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
    const { data: { user } } = await supabase.auth.getUser();
    const [ { data: pData }, { data: eData } ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user?.id).single(),
      supabase.from('security_events').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    setProfile(pData);
    setEvents(eData || []);
  };

  const cycleShield = async () => {
    const next = (threatIdx + 1) % THREAT_LEVELS.length;
    setThreatIdx(next);
    
    await supabase.from('security_events').insert({
      title: "Shield Scan Executed",
      body: `Threat assessment updated to ${THREAT_LEVELS[next].level}.`,
      category: "scan",
    });
    loadData();
  };

  const triggerPurge = async () => {
    if (!profile?.is_premium) {
      setShowPaywall(true);
      return;
    }
    setPurging(true);
    await supabase.from('security_events').insert({
      title: "Instant Purge Executed",
      body: "Metadata trails scrubbed. Digital footprint cleared.",
      category: "purge",
    });
    setPurging(false);
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
    <ForgeLayout dataStream={<DataStream variant="binary" opacity={1} crystalY={120} />}>
      <div className="px-4 pt-6 pb-4">
        <div className="flex flex-col items-center justify-center py-3 mb-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-red-600/10 blur-2xl" />
            <CrystalCore size={90} />
          </div>
          <p className="text-[10px] tracking-[0.4em] text-red-500 uppercase mt-2 font-bold">SECURITY GUARDIAN</p>
          <h1 className="text-xl font-black text-white tracking-tight mt-0.5">SECURITY</h1>
        </div>

        <div className="rounded-2xl p-5 mb-4 border" style={{ borderColor: `${threat.color}40`, backgroundColor: `${threat.color}08` }}>
          <div className="flex items-center gap-3">
            <ThreatIcon className="w-6 h-6" style={{ color: threat.color }} />
            <div className="flex-1">
              <p className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: threat.color }}>THREAT LEVEL: {threat.level}</p>
              <p className="text-xs text-gray-500 mt-0.5">{threat.desc}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div><p className="text-[10px] text-gray-600 uppercase">Local Sandbox</p><p className="text-xs text-emerald-400 font-bold">ENFORCED</p></div>
          </div>
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-emerald-400" />
            <div><p className="text-[10px] text-gray-600 uppercase">Anti-Tracking</p><p className="text-xs text-emerald-400 font-bold">ACTIVE</p></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={cycleShield} className="py-3 rounded-xl bg-white/3 border border-white/5 text-xs text-white font-bold tracking-wider hover:border-violet-500/30">CYCLE SHIELD SCAN</button>
          <button onClick={triggerPurge} disabled={purging} className="py-3 rounded-xl text-xs font-bold tracking-wider transition-all" style={{ background: profile?.is_premium ? "linear-gradient(to right, #7C3AED, #4F46E5)" : "rgba(239,68,68,0.1)", border: profile?.is_premium ? "none" : "1px solid rgba(239,68,68,0.3)", color: profile?.is_premium ? "white" : "#EF4444" }}>
            {purging ? "PURGING..." : profile?.is_premium ? "INSTANT PURGE" : "🔒 INSTANT PURGE"}
          </button>
        </div>

        <div>
          <p className="text-xs tracking-[0.35em] text-gray-500 uppercase mb-3">NOTIFICATION VAULT</p>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input className="w-full bg-white/2 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none" placeholder="Search vault..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map(event => (
              <div key={event.id} className="bg-white/2 border border-white/5 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-white font-medium">{event.title}</p>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ color: CATEGORY_COLORS[event.category] || "#6B7280", backgroundColor: `${CATEGORY_COLORS[event.category] || "#6B7280"}18` }}>{event.category}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{event.body}</p>
                <p className="text-[10px] text-gray-700 mt-2">{new Date(event.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onSuccess={() => { setShowPaywall(false); loadData(); }} />}
    </ForgeLayout>
  );
}
