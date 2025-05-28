import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gspmqvwdfxcdshfqvips.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcG1xdndkZnhjZHNoZnF2aXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODE0NjAsImV4cCI6MjA2MzA1NzQ2MH0.OQh09QZ3gdmuMCgHYOoTr3toW1_q2da_7UzruGcRH5Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
  },
})