// js/supabase-client.js

// The Supabase client is expected to be loaded via CDN in index.html and admin.html
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabaseUrl = 'https://zwksurtgjdlptkguitei.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3a3N1cnRnamRscHRrZ3VpdGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDk5OTIsImV4cCI6MjA4Nzg4NTk5Mn0.9dVnN3jZOd5qg6djKK_kY7Gbckb7p9dtRb2rhAgMKRg';

// Initialize the Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Make it globally available
window.supabaseClient = supabase;
