REVOKE EXECUTE ON FUNCTION public.can_access_patient(uuid) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.can_edit_patient(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.can_access_patient(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_patient(uuid) TO authenticated;