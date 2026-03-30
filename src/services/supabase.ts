import { createClient } from '@supabase/supabase-js';

// Твои данные
const SUPABASE_URL = 'https://esyaukvplirsjlddbrey.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6RONMjqGZ25xhGKzqJirmA_b7Jl9S65';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);