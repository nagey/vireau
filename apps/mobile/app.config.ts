import 'dotenv/config';

export default {
  expo: {
    name: 'Vireau',
    slug: 'vireau',
    version: '1.0.0',
    sdkVersion: '52.0.0',
    scheme: 'vireau',
    ios: {
      bundleIdentifier: 'co.vireau',
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false  
      },
    },
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: 'f07c7922-1dba-4f2f-8af1-ff8a062654a7'
      }
    },
  },
};
