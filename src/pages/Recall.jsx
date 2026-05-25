import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Database, Plus, Search, RefreshCw } from "lucide-react";
import ForgeLayout from "@/components/forge/ForgeLayout";
import DataStream from "@/components/forge/DataStream";

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
    const data = await base44.entities.Vision.list("-created_date", 100);
    setVisions(data);
  };

  const submitVision = async () => {
    if (!input.trim()) return;
    setSubmitting(true);
    const prompt = input.trim();
    setInput("");

    const saved = await base44.entities.Vision.create({
      name: prompt,
      manifestation: "PENDING",
      type: inputType,
      forgedAt: new Date().toISOString(),
    });
    setVisions(prev => [saved, ...prev]);

    manifestVision(saved, prompt);
  };

  const manifestVision = async (visionRecord, prompt) => {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the Crystal Core intelligence engine of Forge. Year 2050. Mystical, concise, authoritative. No filler. The user has spoken a ${visionRecord.type}: "${prompt}". Manifest this into a clear, powerful response. Treat it as a vision to expand, a note to crystallize, or an insight to deepen. Max 120 words. Pure signal. No preamble.`,
    }).catch(() => null);

    if (result) {
      await base44.entities.Vision.update(visionRecord.id, {
        manifestation: result,
      });
      setVisions(prev => prev.map(v => v.id === visionRecord.id ? { ...v, manifestation: result } : v));
      await base44.entities.SystemLog.create({
        action: `Vision manifested: "${prompt.slice(0, 50)}..."`,
        reason: "User submitted recall entry.",
        agentName: "Recall Agent",
        impact: "Memory crystallized and archived.",
      });
    }
    setSubmitting(false);
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
    <ForgeLayout dataStream={<DataStream variant="matrix" opacity={0.18} />}>
      <div className="px-4 pt-6 pb-28">
        <div className="mb-6">
          <p className="text-xs tracking-[0.35em] text-violet-500/70 uppercase mb-1">RECALL AGENT</p>
          <h1 className="text-2xl font-black text-white tracking-tight">RECALL</h1>
          <p className="text-xs text-gray-600 mt-0.5">Memory Engine & Neural Manifestation</p>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            className="w-full bg-white/2 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/40 transition-colors"
            placeholder="Search memories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
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

        {/* Vision Cards */}
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
                <div
                  key={vision.id}
                  className="rounded-2xl border p-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 100%)",
                    borderColor: "rgba(139,92,246,0.15)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ color: typeStyle.color, backgroundColor: typeStyle.bg, border: `1px solid ${typeStyle.border}` }}
                      >
                        {vision.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-700 flex-shrink-0">
                      {new Date(vision.created_date).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </p>
                  </div>

                  <p className="text-xs text-indigo-300 uppercase tracking-wider font-bold mb-2 leading-snug">
                    VISION: {vision.name}
                  </p>

                  <div className="border-t border-white/5 pt-2 mt-1">
                    {isPending ? (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 font-bold tracking-wider border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          PENDING MANIFESTATION
                        </span>
                        <button
                          onClick={() => retryManifestation(vision)}
                          disabled={retrying === vision.id}
                          className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${retrying === vision.id ? "animate-spin" : ""}`} />
                          RETRY
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

      {/* Fixed Input Bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 py-3 bg-[#050505] border-t border-white/5">
        <div className="flex gap-2 mb-2">
          {["vision", "note", "insight"].map(t => (
            <button
              key={t}
              onClick={() => setInputType(t)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                inputType === t
                  ? "bg-violet-600/20 border border-violet-500/40 text-violet-300"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <textarea
            className="flex-1 bg-white/3 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/40 transition-colors resize-none"
            placeholder="Speak your vision to the Crystal Core..."
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitVision();
              }
            }}
          />
          <button
            onClick={submitVision}
            disabled={!input.trim() || submitting}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </ForgeLayout>
  );
}
