import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';


import { SUPABASE_API, SUPABASE_URL } from '../assets/api';




export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_API)
  



 export default async function getUserData(setUser) {

    try {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        console.log("User inside fucntiion data:", data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  getUserData()