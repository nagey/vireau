-- Migration: add public SELECT policy for regattas
-- Generated: May 14, 2025

-- Ensure Row Level Security is enabled on the regattas table
ALTER TABLE public.regattas
  ENABLE ROW LEVEL SECURITY;

-- (Optional) Remove old policy if it exists, to avoid conflicts
DROP POLICY IF EXISTS allow_all_select_on_regattas
  ON public.regattas;

-- Create a new policy allowing any authenticated user to SELECT all regatta rows
CREATE POLICY allow_all_select_on_regattas
  ON public.regattas
  FOR SELECT
  TO authenticated
  USING (
    true
  );

-- To grant select access to anonymous (unauthenticated) users as well, uncomment below:
CREATE POLICY allow_anon_select_on_regattas
  ON public.regattas
  FOR SELECT
  TO anon
  USING (
    true
  );
