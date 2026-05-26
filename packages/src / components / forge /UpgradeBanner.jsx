import { Infinity, ChevronRight } from "lucide-react";

export default function UpgradeBanner({ onUpgrade }) {
  return (
    <button
      onClick={onUpgrade}
      className="w-full bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border border-violet-500/30 rounded-2xl p-4 flex items-center gap-3 glow-violet hover:border-violet-500/60 transition-all text-left"
    >
      <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
        <Infinity className="w-5 h-5 text-violet-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-violet-300 tracking-wider">FORGE PREMIUM</p>
        <p className="text-[11px] text-gray-500 mt-0.5">Unlock full system capabilities</p>
      </div>
      <ChevronRight className="w-4 h-4 text-violet-400 flex-shrink-0" />
    </button>
  );
}
