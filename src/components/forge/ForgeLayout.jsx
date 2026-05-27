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
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Full-screen background canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {dataStream}
      </div>

      {/* Centered content column */}
      <div className="relative z-10 flex-1 flex flex-col items-center">
        <div className="w-full max-w-md mx-auto flex-1 overflow-y-auto pb-20">
          {children}
        </div>
      </div>

      {/* Bottom nav — full width backdrop, content centered */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-[#050505]/95 backdrop-blur-sm border-t border-violet-500/20 flex justify-center">
        <div className="w-full max-w-md flex">
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
        </div>
      </nav>
    </div>
  );
}
