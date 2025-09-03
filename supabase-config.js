// تهيئة Supabase - استبدل القيم بمعلومات مشروعك
const SUPABASE_URL = 'https://hqrwcfwhdzencahgiuex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxcndjZndoZHplbmNhaGdpdWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzUwMDksImV4cCI6MjA3MjQxMTAwOX0.-7_wUXyLUStUItr3tCYhUcis8ebfygLlfjrk9mEzfmE';

// إنشاء عميل Supabase مع إعدادات إضافية
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});