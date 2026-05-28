import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient"; // Native Supabase client
import { Zap, Settings, Sparkles, Cpu, Shield, Brain, MessageSquare, Activity, ChevronRight } from "lucide-react";
import ForgeLayout from "@/components/forge/ForgeLayout";
import DataStream from "@/components/forge/DataStream";
import CrystalCore from "@/components/forge/CrystalCore";
import UpgradeBanner from "@/components/forge/UpgradeBanner";
import PaywallModal from "@/components/forge/PaywallModal";

const AGENT_ICONS = {
  "Orchestrator": { Icon: Zap, color: "#8B5CF6" },
  "Security Guardian": { Icon: Shield, color: "#EF4444" },
  "Recall Agent": { Icon: Brain, color: "#8B5CF6" },
  "Communication Agent": { Icon: MessageSquare, color: "#3B82F6" },
  "Resilience Agent": { Icon: Activity, color: "#10B981" },
};

export default function Brief() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [brief, setBrief] = useState(null);
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    // Fetch data via Supabase
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: systemLogs } = await supabase.from('system_logs').select('*').order('created_date', { ascending: false }).limit(20);
    const { data: briefs } = await supabase.from('daily_briefs').select('*');
    
    if (profiles && profiles.length > 0) setProfile(profiles[0]);
    if (systemLogs) setLogs(systemLogs);
    
    const today = new Date().toISOString().split("T")[0];
    const todayBrief = briefs?.find(b => b.briefDate === today);
    if (todayBrief) setBrief(todayBrief);
  };

  const generateBrief = async () => {
    setGeneratingBrief(true);
    
    // Call your Supabase Edge Function instead of direct LLM invocation
    const { data, error } = await supabase.functions.invoke('generate-brief', {
      body: { profile }
    });

    if (!error && data) {
        setBrief(data);
        loadData();
    }
    setGeneratingBrief(false);
  };

  const handlePaywallSuccess = () => {
    setShowPaywall(false);
    setProfile(p => p ? { ...p, isPremium: true } : p);
    loadData();
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (date) => date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <ForgeLayout dataStream={<DataStream variant="rain" opacity={1} crystalY={120} />}>
      {/* ... (Keep your existing return JSX here) ... */}
    </ForgeLayout>
  );
}
