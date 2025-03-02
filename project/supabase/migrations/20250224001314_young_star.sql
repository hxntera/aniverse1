/*
  # Create storage buckets for user media

  1. New Storage Buckets
    - avatars: For user profile pictures
    - banners: For profile banner images
    
  2. Security
    - Enable RLS on both buckets
    - Add policies for authenticated users
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('banners', 'banners', true);

-- Set up security policies for avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Set up security policies for banners
CREATE POLICY "Users can upload their own banner"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'banners' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Banner images are publicly accessible"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'banners');

CREATE POLICY "Users can update their own banner"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'banners' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own banner"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'banners' AND
  (storage.foldername(name))[1] = auth.uid()::text
);