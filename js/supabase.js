const SUPABASE_URL =
"https://iqzxvbvjefxybjkhuwwr.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxenh2YnZqZWZ4eWJqa2h1d3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDc4OTMsImV4cCI6MjA5NzUyMzg5M30.g9lFvFb0PW16DgypEUbx3HM0Z9XU0a6Gw91f6fE2M8U";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
console.log("SUPABASE LOADED");
console.log(supabaseClient);