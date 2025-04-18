// apps/web/pages/login.tsx
import { supabase } from '../supabase';

export default function LoginPage() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error(error);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login to Vireau</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}
