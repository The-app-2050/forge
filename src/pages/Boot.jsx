import { supabase } from "@/lib/supabaseClient";

// ... inside your useEffect
const init = async () => {
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
    navigate("/onboarding"); // No session, go to onboarding
  }
};
