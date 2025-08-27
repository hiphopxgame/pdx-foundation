-- Enable leaked password protection for enhanced security
-- This prevents users from using passwords that have been compromised in data breaches

-- Update auth configuration to enable leaked password protection
UPDATE auth.config 
SET 
  password_min_length = 8,
  password_require_lowercase = true,
  password_require_uppercase = true,
  password_require_numbers = true,
  password_require_symbols = false,
  hibp_enabled = true  -- Enable "Have I Been Pwned" protection
WHERE id = 'password-policy';

-- If the config doesn't exist, insert it
INSERT INTO auth.config (id, password_min_length, password_require_lowercase, password_require_uppercase, password_require_numbers, password_require_symbols, hibp_enabled)
SELECT 'password-policy', 8, true, true, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM auth.config WHERE id = 'password-policy');