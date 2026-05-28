// Replace the import
import { supabase } from "@/lib/supabaseClient"; 

// Replace the useEffect
useEffect(() => {
  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('system_logs') // Ensure this table exists in your Supabase DB
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (error) console.error("Error fetching logs:", error);
    else setLogs(data);
  };
  
  fetchLogs();
}, []);
