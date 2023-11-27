import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import { SUPABASE_API, SUPABASE_URL } from '../assets/api';

export const supabase = createClient(SUPABASE_URL, SUPABASE_API);

export default function Login(props) {
  const { setUser } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthStateChange = (event, session) => {
      console.log('LOGIN log Auth state changed:', event, session);

      if (event === 'SIGNED_IN') {
        setUser(session.user);
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
      supabase.auth.onAuthStateChange(null);
    };
  }, []);

  return (
    <div>
      <Auth
        supabaseClient={supabase}
        providers={['discord', 'google']}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        socialLayout="horizontal"
        socialButtonSize="xlarge"
      />
      <button onClick={() => navigate('/success')} aria-label="Go to Success">
        Go to Success
      </button>
    </div>
  );
}