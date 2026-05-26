import { useNavigate, useLocation } from "react-router-dom";
import { Zap, Shield, Brain } from "lucide-react";

const TABS = [
  { path: "/brief", icon: Zap, label: "BRIEF" },
  { path: "/security", icon: Shield, label: "SHIELD" },
  { path: "/recall", icon: Brain, label: "RECALL" },
];

export default function ForgeLayout({ children, dataStream }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col max-w-md mx-auto relative overflow-hidden">
      {dataStream}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#050505] border-t border-violet-500/20 flex">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                active ? "text-violet-400" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] tracking-widest font-bold">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
