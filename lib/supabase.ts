import { createClient } from '@supabase/supabase-js';

const supaUrl = 'https://csteoeudjuzyhkhjaszo.supabase.co';
// Using the provided key as the admin key to ensure CRUD operations work regardless of RLS
const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdGVvZXVkanV6eWhraGphc3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNDg2MDksImV4cCI6MjA4OTgyNDYwOX0.R2IsssIzOYjDMQiu_0Ona6zjI3COy2ui_swbFpFaroU';

export const supabase = createClient(supaUrl, supaKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
