-- supabase/migrations/20240515_add_isquickrace_flag_to_regattas.sql
ALTER TABLE regattas ADD COLUMN "isQuickRace" boolean NOT NULL DEFAULT false;
