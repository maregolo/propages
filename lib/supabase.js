import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://obizylsmrgltanvdrifa.supabase.co';
const supabaseKey = 'sb_publishable_qE6vn0CGywisFBvYDxGn2g_jeLRtXKf';

export const supabase = createClient(supabaseUrl, supabaseKey);
