import { createClient } from '@supabase/supabase-js';



export default function getSupabase() {
    const SUPABASE_URL = 'https://rfegzaevtwgnsuzmezca.supabase.co';
    const SUPABASE_API = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZWd6YWV2dHdnbnN1em1lemNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg0NDM5NjAsImV4cCI6MjAxNDAxOTk2MH0.OmfESqkKkWP8y3X1x6e4p2mm6NVpXRpdjLTBMmimdqQ';
  
    const supabase = createClient(SUPABASE_URL, SUPABASE_API);
    return supabase;
  }