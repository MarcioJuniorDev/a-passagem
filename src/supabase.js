import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uedruuzyopqzpgqgunuw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZHJ1dXp5b3BxenBncWd1bnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NjYwMTUsImV4cCI6MjA5OTA0MjAxNX0.G0hwbJNIS1I6bS7pU-QEDCDl0ZXafwWEEADRfn54mso";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);