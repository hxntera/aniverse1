import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext, useAuthProvider } from './lib/auth';
import { Navbar } from './components/ui/navbar';
import { FeaturedAnime } from './components/featured-anime';
import { TrendingSection } from './components/trending-section';
import { UserProfile } from './components/profile/UserProfile';
import { SettingsPage } from './components/settings/SettingsPage';
import { AuthModal } from './components/auth/AuthModal';
import { useSettings } from './lib/settings';
import { useEffect } from 'react';
import { AnimeCategories } from './components/anime/AnimeCategories';
import { TopRatedAnime } from './components/anime/TopRatedAnime';
import { RecentlyAddedAnime } from './components/anime/RecentlyAddedAnime';
import { AnimeBrowseSection } from './components/anime/AnimeBrowseSection';
import { AnimeDetailsPage } from './components/anime/AnimeDetailsPage';

function HomePage() {
  return (
    <>
      <main>
        <FeaturedAnime />
        <TrendingSection />
        <AnimeCategories />
        <TopRatedAnime />
        <RecentlyAddedAnime />
        <AnimeBrowseSection />
      </main>
    </>
  );
}

function App() {
  const auth = useAuthProvider();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const { theme, fontSize } = useSettings();

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Apply font size
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[fontSize];
  }, [theme, fontSize]);

  // Update auth modal visibility when auth state changes
  React.useEffect(() => {
    if (!auth.loading) {
      setShowAuthModal(!auth.user);
    }
  }, [auth.user, auth.loading]);

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onSignInClick={() => setShowAuthModal(true)} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={
              auth.user ? (
                <UserProfile />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={<SettingsPage />}
          />
          <Route path="/anime/:id" element={<AnimeDetailsPage />} />
        </Routes>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

        <Toaster
          position="top-right"
          toastOptions={{
            className: 'glass',
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              borderRadius: '0.5rem',
            },
          }}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App