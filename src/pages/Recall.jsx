import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Brain, Sparkles, Database, Plus, Search, RefreshCw } from "lucide-react";
import ForgeLayout from "@/components/forge/ForgeLayout";
import DataStream from "@/components/forge/DataStream";
import CrystalCore from "@/components/forge/CrystalCore";

const TYPE_COLORS = {
  vision: { color: "#8B5CF6", bg: "#8B5CF618", border: "#8B5CF640" },
  note: { color: "#3B82F6", bg: "#3B82F618", border: "#3B82F640" },
  insight: { color: "#10B981", bg: "#10B98118", border: "#10B98140" },
};

const FILTERS = ["ALL", "VISIONS", "NOTES", "INSIGHTS"];
const TYPE_MAP = { "VISIONS": "vision", "NOTES": "note", "INSIGHTS": "insight" };

export default function Recall() {
  const [visions, setVisions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState("vision");
  const [submitting, setSubmitting] = useState(false);
  const [retrying, setRetrying] = useState(null);

  useEffect(() => {
    loadVisions();
  }, []);

  const loadVisions = async () => {
    const { data } = await supabase
      .from('visions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setVisions(data);
  };

  const submitVision = async () => {
    if (!input.trim()) return;
    setSubmitting(true);
    const prompt = input.trim();
    setInput("");

    const { data: saved, error } = await supabase
      .from('visions')
      .insert({
        name: prompt,
        manifestation: "PENDING",
        type: inputType,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saved) {
      setVisions(prev => [saved, ...prev]);
      manifestVision(saved, prompt);
    }
    setSubmitting(false);
  };

  const manifestVision = async (visionRecord, prompt) => {
    // Calling the Supabase Edge Function
    const { data } = await supabase.functions.invoke('manifest-vision', {
      body: { visionId: visionRecord.id, prompt, type: visionRecord.type }
    });

    if (data?.result) {
      await supabase.from('visions').update({ manifestation: data.result }).eq('id', visionRecord.id);
      setVisions(prev => prev.map(v => v.id === visionRecord.id ? { ...v, manifestation: data.result } : v));
      
      // Log the action
      await supabase.from('system_logs').insert({
        action: `Vision manifested: "${prompt.slice(0, 50)}..."`,
        agent_name: "Recall Agent",
        impact: "Memory crystallized and archived."
      });
    }
  };

  const retryManifestation = async (vision) => {
    setRetrying(vision.id);
    await manifestVision(vision, vision.name);
    setRetrying(null);
  };

  const filtered = visions.filter(v => {
    const matchesFilter = filter === "ALL" || v.type === TYPE_MAP[filter];
    const matchesSearch = !search ||
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.manifestation?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <ForgeLayout dataStream={<DataStream variant="matrix" opacity={1} crystalY={120} />}>
      <div className="px-4 pt-6 pb-28">
        <div className="flex flex-col items-center justify-center py-3 mb-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-violet-600/10 blur-2xl" />
            <CrystalCore size={90} />
          </div>
          <p className="text-[10px] tracking-[0.4em] text-violet-500 uppercase mt-2 font-bold">RECALL AGENT</p>
          <h1 className="text-xl font-black text-white tracking-tight mt-0.5">RECALL</h1>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            className="w-full bg-white/2 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/40 transition-colors"
            placeholder="Search memories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex-shrink-0 transition-all ${
                filter === f
                  ? "bg-violet-600/20 border border-violet-500/40 text-violet-300"
                  : "bg-white/2 border border-white/5 text-gray-600 hover:text-gray-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Database className="w-10 h-10 text-gray-700" />
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              The archive is empty.<br />Speak your vision to the Crystal Core.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(vision => {
              const typeStyle = TYPE_COLORS[vision.type] || TYPE_COLORS.vision;
              const isPending = vision.manifestation === "PENDING";
              return (
                <div key={vision.id} className="rounded-2xl border p-4" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 100%)", borderColor: "rgba(139,92,246,0.15)" }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ color: typeStyle.color, backgroundColor: typeStyle.bg, border: `1px solid ${typeStyle.border}` }}>
                        {vision.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-700 flex-shrink-0">{new Date(vision.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}</p>
                  </div>
                  <p className="text-xs text-indigo-300 uppercase tracking-wider font-bold mb-2 leading-snug">VISION: {vision.name}</p>
                  <div className="border-t border-white/5 pt-2 mt-1">
                    {isPending ? (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 font-bold tracking-wider border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full">PENDING</span>
                        <button onClick={() => retryManifestation(vision)} disabled={retrying === vision.id} className="flex items-center gap-1 text-[10px] text-violet-400">
                          <RefreshCw className={`w-3 h-3 ${retrying === vision.id ? "animate-spin" : ""}`} /> RETRY
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-300 leading-relaxed">{vision.manifestation}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 py-3 bg-[#050505] border-t border-white/5">
        <div className="flex gap-2 mb-2">
          {["vision", "note", "insight"].map(t => (
            <button key={t} onClick={() => setInputType(t)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inputType === t ? "bg-violet-600/20 border border-violet-500/40 text-violet-300" : "text-gray-600"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <textarea
            className="flex-1 bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/40"
            rows={2} value={input} onChange={e => setInput(e.target.value)}
          />
          <button onClick={submitVision} disabled={!input.trim() || submitting} className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </ForgeLayout>
  );
}
