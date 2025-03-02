import { motion } from 'framer-motion';
import { ChevronDown, User, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../ui/avatar';
import { useAuth } from '../../lib/auth';
import { useProfile } from '../../hooks/useProfile';

export function ProfilePreview() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-24 right-4 z-50"
    >
      <div className="glass rounded-lg overflow-hidden shadow-lg">
        <div 
          className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar size="md" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs">{profile?.level || 0}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm">🌸 {profile?.display_name || user?.email?.split('@')[0] || 'Anime Fan'}</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Level {profile?.level || 0} • {profile?.profile_tag || 'New Member'}</span>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">XP Progress</span>
                <span className="text-primary">{profile?.xp || 0} / {((profile?.level || 0) + 1) * 1000}</span>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((profile?.xp || 0) % 1000) / 10}%` }}
                  className="absolute h-full bg-primary"
                />
              </div>
              <button 
                onClick={() => window.location.href = '/profile'}
                className="w-full py-2 text-sm text-center bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
              >
                View Full Profile
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}