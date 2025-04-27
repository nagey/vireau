import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabase';

const ACCESS_TOKEN_KEY = 'sb-access-token';
const REFRESH_TOKEN_KEY = 'sb-refresh-token';
const AVATAR_URL_KEY = 'supabase_avatar_url';

export async function saveAvatarUrl(url: string) {
  await SecureStore.setItemAsync(AVATAR_URL_KEY, url);
}

export async function restoreAvatarUrl() {
  return await SecureStore.getItemAsync(AVATAR_URL_KEY);
}

export async function clearAvatarUrl() {
  await SecureStore.deleteItemAsync(AVATAR_URL_KEY);
}

export async function saveSession(access_token: string, refresh_token: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
}

export async function restoreSession() {
  const access_token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const refresh_token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

  if (access_token && refresh_token) {
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.warn('🔁 Failed to restore Supabase session:', error);
    } else {
      console.log('🔁 Supabase session restored:', data);
    }

    return data.session;
  }

  return null;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
