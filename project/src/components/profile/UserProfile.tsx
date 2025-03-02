import { motion } from 'framer-motion';
import { Camera, Edit2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { EditProfileModal } from './EditProfileModal';
import { Avatar } from '../ui/avatar';
import { Banner } from '../ui/banner';
import toast from 'react-hot-toast';

export function UserProfile() {
  const { profile, loading, error, updateProfile, uploadProfileImage } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState<'avatar' | 'banner' | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load profile</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (formData: {
    display_name: string;
    profile_tag: string;
    status_message: string | null;
  }) => {
    const result = await updateProfile(formData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleImageUpload = async (type: 'avatar' | 'banner', file: File) => {
    try {
      setUploading(type);
      const result = await uploadProfileImage(file, type);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Banner */}
      <div className="relative">
        <Banner src={profile.banner_url} alt={`${profile.display_name}'s banner`} />
        <label className={`absolute bottom-4 right-4 p-2 glass rounded-lg transition-colors ${
          uploading === 'banner' ? 'opacity-50 cursor-wait' : 'hover:bg-white/20 cursor-pointer'
        }`}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
            disabled={uploading === 'banner'}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload('banner', file);
            }}
          />
          {uploading === 'banner' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </label>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-full overflow-hidden border-4 border-background"
              >
                <Avatar 
                  src={profile.avatar_url} 
                  alt={profile.display_name}
                  size="xl"
                />
              </motion.div>
              <label className={`absolute bottom-2 right-2 p-2 glass rounded-full transition-colors ${
                uploading === 'avatar' ? 'opacity-50 cursor-wait' : 'hover:bg-white/20 cursor-pointer'
              }`}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  disabled={uploading === 'avatar'}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('avatar', file);
                  }}
                />
                {uploading === 'avatar' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold flex items-center gap-2">
                  <span>{profile.profile_tag}</span>
                  {profile.display_name}
                </h1>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 glass rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xl font-bold">Level {profile.level}</span>
              </div>

              {profile.status_message && (
                <p className="text-gray-300 mb-6 max-w-2xl">
                  {profile.status_message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleProfileUpdate}
        initialData={{
          display_name: profile.display_name,
          profile_tag: profile.profile_tag,
          status_message: profile.status_message,
        }}
      />
    </div>
  );
}