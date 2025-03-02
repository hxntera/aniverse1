import { motion } from 'framer-motion';
import { Search, Bell, Menu, PlayCircle, User, Settings, LogOut, Crown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { Avatar } from './avatar';

interface NavbarProps {
  onSignInClick?: () => void;
}

export function Navbar({ onSignInClick }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    navigate('/settings');
  };

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 w-full z-50 glass"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"
              />
              <PlayCircle className="w-8 h-8 relative z-10 text-white group-hover:text-primary transition-colors" />
            </div>
            <div className="relative">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Aniverse
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 origin-left"
              />
            </div>
          </motion.div>
          <div className="hidden lg:flex gap-8">
            <a href="#" className="nav-link active">{t('nav.home')}</a>
            <a href="#" className="nav-link">{t('nav.discover')}</a>
            <a href="#" className="nav-link">{t('nav.seasonal')}</a>
            <a href="#" className="nav-link">{t('nav.topRated')}</a>
            <a href="#" className="nav-link">{t('nav.community')}</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex relative group">
            <input 
              type="text" 
              placeholder={t('nav.search')}
              className="w-72 px-4 py-2 rounded-full bg-secondary text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 group-hover:bg-white/10"
            />
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-white/80 transition-colors" />
          </div>
          {user ? (
            <>
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:block relative" ref={menuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Avatar size="sm" />
                </button>

                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-lg overflow-hidden shadow-lg"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Crown className="w-4 h-4 text-primary" />
                          <span className="text-sm text-primary font-medium">Premium</span>
                        </div>
                        <div className="text-xs text-gray-400">@{user.email?.split('@')[0]}</div>
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          {t('nav.profile')}
                        </button>
                        <button
                          onClick={handleSettingsClick}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          {t('nav.settings')}
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('nav.signOut')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onSignInClick}
              className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              {t('nav.signIn')}
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}