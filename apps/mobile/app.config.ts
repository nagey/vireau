import 'dotenv/config';

export default {
  expo: {
    name: 'Vireau',
    slug: 'vireau',
    version: '1.0.0',
    sdkVersion: '52.0.0',
    scheme: 'vireau',
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  },
};
