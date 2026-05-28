import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabaseClient";

function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
        
      if (error) {
        console.error("Error fetching logs:", error);
      } else {
        setLogs(data);
      }
    };
    
    fetchLogs();
  }, []); // useEffect is now properly inside the component

  return (
    <div className="activity-log-container">
      <h1>System Activity</h1>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>{log.action} - {log.reason}</li>
        ))}
      </ul>
    </div>
  ); // The return is now properly closed with a </div>
}

export default ActivityLog;
