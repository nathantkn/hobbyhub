import { createClient } from '@supabase/supabase-js'

const URL = 'https://qrclwownfifvbaukfyig.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyY2x3b3duZmlmdmJhdWtmeWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDIwOTksImV4cCI6MjA2MDkxODA5OX0.KOxA5APOexVimkOaPU7lKW755WyOQwgBVAyg6UkYveM';

export const supabase = createClient(URL, API_KEY);