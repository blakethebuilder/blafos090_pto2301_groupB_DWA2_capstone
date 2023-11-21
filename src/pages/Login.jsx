import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SUPABASE_URL, SUPABASE_API } from '../assets/api';

export const supabase = createClient(SUPABASE_URL, SUPABASE_API);

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleAuthStateChange = (event, session) => {
      console.log('Auth state changed:', event, session);

      if (event === 'SIGNED_IN') {
        navigate('/success');
        console.log('User signed in');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
        console.log('User signed out');
      }
    };
  
    // Add the auth state change listener
    supabase.auth.onAuthStateChange(handleAuthStateChange);
  
    // Clean up all auth state change listeners when the component unmounts
    return () => {
      // This removes all listeners associated with onAuthStateChange
      supabase.auth.onAuthStateChange(null);
    };
  }, [navigate]);
  

  return (
    <div>
      <Auth
        supabaseClient={supabase}
        providers={['discord']}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        socialLayout="horizontal"
        socialButtonSize="xlarge"
      />
      <button onClick={() => navigate('/success')}> Go to Success</button>
    </div>
  );
}
