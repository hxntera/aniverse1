import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  display_name: z.string().min(3).max(30),
  profile_tag: z.string().min(3).max(20),
  status_message: z.string().max(100).optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  initialData: {
    display_name: string;
    profile_tag: string;
    status_message: string | null;
  };
}

export function EditProfileModal({ isOpen, onClose, onSubmit, initialData }: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = profileSchema.parse(formData);
      await onSubmit(validatedData);
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof ProfileFormData] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md glass rounded-lg p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.display_name && (
              <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Profile Tag</label>
            <input
              type="text"
              value={formData.profile_tag}
              onChange={(e) => setFormData({ ...formData, profile_tag: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.profile_tag && (
              <p className="text-red-500 text-sm mt-1">{errors.profile_tag}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status Message</label>
            <textarea
              value={formData.status_message || ''}
              onChange={(e) => setFormData({ ...formData, status_message: e.target.value })}
              maxLength={100}
              rows={3}
              className="w-full px-3 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
            <div className="flex justify-end">
              <span className="text-sm text-gray-400">
                {(formData.status_message?.length || 0)}/100
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}