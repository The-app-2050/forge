import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Shield, Brain, MessageSquare, Activity, AlertTriangle } from "lucide-react";
import ForgeLayout from "@/components/forge/ForgeLayout";
import DataStream from "@/components/forge/DataStream";
import CrystalCore from "@/components/forge/CrystalCore";

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
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setName(data.name || "");
        setLocation(data.location || "");
      }
    }
  };

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from('profiles').update({ name, location }).eq('id', profile.id);
    setSaving(false);
  };

  const resetCore = async () => {
    setResetting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // Delete user data sequentially based on your schema
    await supabase.from('visions').delete().eq('user_id', user.id);
    await supabase.from('system_logs').delete().eq('user_id', user.id);
    await supabase.from('security_events').delete().eq('user_id', user.id);
    await supabase.from('daily_briefs').delete().eq('user_id', user.id);
    await supabase.from('profiles').delete().eq('id', user.id);
    
    navigate("/");
  };

  return (
    <ForgeLayout dataStream={<DataStream variant="hex" opacity={1} crystalY={120} />}>
      <div className="px-4 pt-6 pb-4">
        <div className="flex flex-col items-center justify-center py-4 mb-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-violet-600/10 blur-2xl" />
            <CrystalCore size={90} />
          </div>
          <p className="text-[10px] tracking-[0.4em] text-violet-500 uppercase mt-2 font-bold">FORGE OS — SETTINGS</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/brief")} className="w-9 h-9 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </button>
          <div>
            <p className="text-xs tracking-[0.35em] text-violet-500 uppercase">FORGE OS</p>
            <h1 className="text-xl font-black text-white tracking-tight">SETTINGS</h1>
          </div>
        </div>

        {profile && (
          <div className="bg-white/2 border border-white/5 rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">Identity</p>
            </div>
            <div className="flex flex-col gap-3">
              <input className="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" value={name} onChange={e => setName(e.target.value)} />
              <input className="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" value={location} onChange={e => setLocation(e.target.value)} />
              <button onClick={save} disabled={saving} className="py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm text-white font-bold uppercase">{saving ? "SAVING..." : "SAVE CHANGES"}</button>
            </div>
          </div>
        )}

        <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5">
          <p className="text-xs tracking-[0.3em] text-red-500/70 uppercase mb-3">Danger Zone</p>
          {!showReset ? (
            <button onClick={() => setShowReset(true)} className="w-full py-3 rounded-xl border border-red-500/30 text-sm text-red-400 font-bold uppercase">RESET CRYSTAL CORE</button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setShowReset(false)} className="py-3 rounded-xl border border-white/10 text-sm text-gray-400 font-bold">CANCEL</button>
              <button onClick={resetCore} disabled={resetting} className="py-3 rounded-xl bg-red-600 text-sm text-white font-bold uppercase">{resetting ? "RESETTING..." : "CONFIRM"}</button>
            </div>
          )}
        </div>
      </div>
    </ForgeLayout>
  );
}
