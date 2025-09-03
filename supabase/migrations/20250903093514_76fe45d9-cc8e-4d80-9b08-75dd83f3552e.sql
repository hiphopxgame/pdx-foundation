-- Fix function search path security warnings
-- Update functions to have proper search_path settings for security

-- Fix update_oregon_tires_employee_schedules_updated_at function
CREATE OR REPLACE FUNCTION public.update_oregon_tires_employee_schedules_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_oregon_tires_service_images_updated_at function
CREATE OR REPLACE FUNCTION public.update_oregon_tires_service_images_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_oretir_appointments_updated_at function
CREATE OR REPLACE FUNCTION public.update_oretir_appointments_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_oregon_tires_custom_hours_updated_at function
CREATE OR REPLACE FUNCTION public.update_oregon_tires_custom_hours_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_oregon_tires_employees_updated_at function
CREATE OR REPLACE FUNCTION public.update_oregon_tires_employees_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_oregon_tires_gallery_images_updated_at function
CREATE OR REPLACE FUNCTION public.update_oregon_tires_gallery_images_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_pdxbus_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_pdxbus_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_iwitty_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_iwitty_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_multichain_profiles_updated_at function
CREATE OR REPLACE FUNCTION public.update_multichain_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;