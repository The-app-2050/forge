import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Zap, Shield, Brain, MessageSquare, Activity, Terminal } from "lucide-react";
import DataStream from "@/components/forge/DataStream";

const AGENT_ICONS = {
  "Orchestrator": { Icon: Zap, color: "#8B5CF6" },
  "Security Guardian": { Icon: Shield, color: "#EF4444" },
  "Recall Agent": { Icon: Brain, color: "#8B5CF6" },
  "Communication Agent": { Icon: MessageSquare, color: "#3B82F6" },
  "Resilience Agent": { Icon: Activity, color: "#10B981" },
};

export default function ActivityLog() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    base44.entities.SystemLog.list("-created_date", 100).then(setLogs);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] max-w-md mx-auto relative overflow-hidden">
      <DataStream variant="hex" opacity={0.22} />
      <div className="px-4 pt-6 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/brief")}
            className="w-9 h-9 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </button>
          <div>
            <p className="text-xs tracking-[0.35em] text-violet-500 uppercase">TRANSPARENCY ENGINE</p>
            <h1 className="text-xl font-black text-white tracking-tight">ACTIVITY LOG</h1>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Terminal className="w-8 h-8 text-gray-700" />
            <p className="text-xs text-gray-600">No activity logged yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {logs.map(log => {
              const agent = AGENT_ICONS[log.agentName] || AGENT_ICONS["Orchestrator"];
              const Icon = agent.Icon;
              return (
                <div
                  key={log.id}
                  className="bg-white/2 border border-white/5 rounded-xl p-4 font-mono"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${agent.color}18`, border: `1px solid ${agent.color}30` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: agent.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-bold leading-snug">{log.action}</p>
                      {log.reason && (
                        <p className="text-[10px] text-gray-600 mt-1">
                          <span className="text-gray-700">REASON: </span>{log.reason}
                        </p>
                      )}
                      {log.impact && (
                        <p className="text-[10px] text-emerald-600/80 mt-0.5">
                          <span className="text-gray-700">IMPACT: </span>{log.impact}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
                          style={{ color: agent.color, backgroundColor: `${agent.color}15` }}
                        >
                          {log.agentName}
                        </span>
                        <span className="text-[10px] text-gray-700">
                          {new Date(log.created_date).toLocaleString([], {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
