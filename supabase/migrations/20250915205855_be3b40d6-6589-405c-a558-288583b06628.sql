-- Grant admin role to tyronenorris@gmail.com
-- This sets up the initial admin user

-- First, get the user ID for tyronenorris@gmail.com and grant admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'tyronenorris@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create a profile entry for the admin if it doesn't exist
INSERT INTO public.por_eve_profiles (
    id, 
    email, 
    display_name, 
    username, 
    project_id
)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email),
    LOWER(REPLACE(COALESCE(raw_user_meta_data->>'full_name', SPLIT_PART(email, '@', 1)), ' ', '_')),
    'portland-events'
FROM auth.users 
WHERE email = 'tyronenorris@gmail.com'
ON CONFLICT (id) DO NOTHING;