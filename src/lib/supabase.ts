import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vltuvoqfgocesxhykdqx.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdHV2b3FmZ29jZXN4aHlrZHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MDU3NzEsImV4cCI6MjEwNjA4MTc3MX0.HFycWAEpNuAS6TXWQHR8X9Hnjzk_TPjQzgJd4yzkEFY";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);