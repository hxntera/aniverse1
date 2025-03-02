import { motion } from 'framer-motion';
import { Moon, Sun, Bell, BellOff, Trash2, RotateCcw, Check, Languages } from 'lucide-react';
import { useState } from 'react';
import { useSettings, ThemeType, FontSize, Language } from '../../lib/settings';
import { useTranslation } from '../../lib/i18n/useTranslation';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const settings = useSettings();
  const { t } = useTranslation();
  const [isResetting, setIsResetting] = useState(false);

  const handleThemeChange = (theme: ThemeType) => {
    settings.setTheme(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const handleFontSizeChange = (size: FontSize) => {
    settings.setFontSize(size);
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[size];
  };

  const handleClearCache = async () => {
    await settings.clearCache();
    toast.success(t('settings.cache.cleared'));
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      settings.resetSettings();
      setIsResetting(false);
      toast.success(t('settings.saved'));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-6 md:p-8"
        >
          <h1 className="text-3xl font-bold mb-8">{t('settings.title')}</h1>

          <div className="space-y-8">
            {/* Theme */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('settings.theme.label')}</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all ${
                    settings.theme === 'light'
                      ? 'bg-primary text-white'
                      : 'bg-secondary hover:bg-white/10'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  {t('settings.theme.light')}
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all ${
                    settings.theme === 'dark'
                      ? 'bg-primary text-white'
                      : 'bg-secondary hover:bg-white/10'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  {t('settings.theme.dark')}
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('settings.language.label')}</h2>
              <div className="flex gap-4">
                {(['ru', 'en'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => settings.setLanguage(lang)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all ${
                      settings.language === lang
                        ? 'bg-primary text-white'
                        : 'bg-secondary hover:bg-white/10'
                    }`}
                  >
                    <Languages className="w-5 h-5" />
                    {t(`settings.language.${lang}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('settings.notifications.label')}</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => settings.setNotifications(true)}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all ${
                    settings.notifications
                      ? 'bg-primary text-white'
                      : 'bg-secondary hover:bg-white/10'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {t('settings.notifications.enabled')}
                </button>
                <button
                  onClick={() => settings.setNotifications(false)}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg transition-all ${
                    !settings.notifications
                      ? 'bg-primary text-white'
                      : 'bg-secondary hover:bg-white/10'
                  }`}
                >
                  <BellOff className="w-5 h-5" />
                  {t('settings.notifications.disabled')}
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('settings.fontSize.label')}</h2>
              <div className="flex gap-4">
                {(['small', 'medium', 'large'] as FontSize[]).map(size => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`flex-1 p-4 rounded-lg transition-all ${
                      settings.fontSize === size
                        ? 'bg-primary text-white'
                        : 'bg-secondary hover:bg-white/10'
                    }`}
                  >
                    {t(`settings.fontSize.${size}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Cache and Reset */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleClearCache}
                className="flex-1 flex items-center justify-center gap-2 p-4 bg-destructive hover:bg-destructive/90 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                {t('settings.cache.clear')}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 p-4 bg-secondary hover:bg-white/10 rounded-lg transition-colors"
                disabled={isResetting}
              >
                {isResetting ? (
                  <Check className="w-5 h-5 animate-bounce" />
                ) : (
                  <RotateCcw className="w-5 h-5" />
                )}
                {t('settings.reset.label')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}