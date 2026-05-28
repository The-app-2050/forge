import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import CrystalCore from "@/components/forge/CrystalCore";
import DataStream from "@/components/forge/DataStream";

export default function Boot() {
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      // Simulate boot-up delay
      await new Promise(r => setTimeout(r, 1400));
      
      // Check if a session exists
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if a profile exists in your 'profiles' table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          navigate("/brief");
        } else {
          navigate("/onboarding");
        }
      } else {
        navigate("/onboarding");
      }
    };
    init();
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center gap-8">
      <DataStream variant="binary" opacity={0.25} />
      <div className="relative flex items-center justify-center">
        <div className="absolute w-40 h-40 rounded-full bg-violet-600/10 blur-2xl" />
        <CrystalCore size={160} />
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-xs tracking-[0.4em] text-indigo-400 uppercase font-medium">
          AWAKENING THE CRYSTAL CORE...
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-violet-500"
              style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
