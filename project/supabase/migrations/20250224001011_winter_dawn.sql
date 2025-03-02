/*
  # Create auth trigger for user profiles

  1. New Function
    - Creates a function to automatically create a user profile when a new user signs up
    
  2. New Trigger
    - Adds a trigger to execute the function after user insertion
    
  3. Security
    - Function executes with security definer privileges
    - Only accessible to authenticated users
*/

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    profile_tag,
    level,
    xp
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user_' || substr(NEW.id::text, 1, 8),
    0,
    0
  );
  RETURN NEW;
END;
$$;

-- Create a trigger to automatically create a profile for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();