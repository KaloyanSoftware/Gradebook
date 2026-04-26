-- Custom Access Token Hook
-- Runs before every JWT is issued by Supabase Auth.
-- Embeds the user's app role (ADMIN/PARENT/STUDENT) as the "app_role" claim
-- so Spring Security can enforce @PreAuthorize without a DB lookup on every request.

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  app_role text;
BEGIN
  SELECT role INTO app_role
  FROM public.app_users
  WHERE external_uid = (event->>'user_id');

  IF app_role IS NOT NULL THEN
    event := jsonb_set(event, '{claims,app_role}', to_jsonb(app_role));
  END IF;

  RETURN event;
END;
$$;

-- Allow Supabase Auth internals to invoke this function
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

-- Revoke direct invocation from public (only the hook should call it)
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM PUBLIC;

-- The hook must be able to read app_users
GRANT SELECT ON public.app_users TO supabase_auth_admin;
