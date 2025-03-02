import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimeCard } from './AnimeCard';
import { animeClient } from '../../lib/apis/anime-client';
import toast from 'react-hot-toast';

export function RecentlyAddedAnime() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  };
  
  // Determine current items per page based on screen size
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage.lg);
  
  useEffect(() => {
    // Update items per page based on window width
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentItemsPerPage(itemsPerPage.sm);
      } else if (width < 768) {
        setCurrentItemsPerPage(itemsPerPage.md);
      } else if (width < 1280) {
        setCurrentItemsPerPage(itemsPerPage.lg);
      } else {
        setCurrentItemsPerPage(itemsPerPage.xl);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchRecentAnime() {
      try {
        setLoading(true);
        setError(null);
        
        // Get current season anime
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        
        // Determine current season
        const month = currentDate.getMonth();
        let season: 'winter' | 'spring' | 'summer' | 'fall';
        
        if (month >= 0 && month < 3) {
          season = 'winter';
        } else if (month >= 3 && month < 6) {
          season = 'spring';
        } else if (month >= 6 && month < 9) {
          season = 'summer';
        } else {
          season = 'fall';
        }
        
        // Fallback to a known good season if current season fails
        try {
          const response = await animeClient.getSeasonalAnime(year, season, 1);
          if (isMounted) {
            setAnimeList(response.data);
          }
        } catch (err) {
          console.warn(`Failed to fetch current season (${season} ${year}), trying fallback`);
          // Try previous season as fallback
          const fallbackSeason = season === 'winter' ? 'fall' : 
                               season === 'spring' ? 'winter' : 
                               season === 'summer' ? 'spring' : 'summer';
          const fallbackYear = season === 'winter' ? year - 1 : year;
          
          const fallbackResponse = await animeClient.getSeasonalAnime(fallbackYear, fallbackSeason, 1);
          if (isMounted) {
            setAnimeList(fallbackResponse.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch recent anime:', err);
        if (isMounted) {
          setError('Failed to load recent anime');
          toast.error('Failed to load recent anime');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchRecentAnime();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  const nextSlide = () => {
    if (currentIndex + currentItemsPerPage < animeList.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const visibleAnime = animeList.slice(currentIndex, currentIndex + currentItemsPerPage);
  
  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Recently Added</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full transition-colors ${
              currentIndex === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex + currentItemsPerPage >= animeList.length}
            className={`p-2 rounded-full transition-colors ${
              currentIndex + currentItemsPerPage >= animeList.length
                ? 'text-gray-500 cursor-not-allowed'
                : 'hover:bg-white/10'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {/* Anime carousel */}
      {!loading && !error && animeList.length > 0 && (
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              initial={{ x: 0 }}
              animate={{ x: -currentIndex * (100 / currentItemsPerPage) + '%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {animeList.map((anime) => (
                <div
                  key={anime.mal_id}
                  className="flex-none"
                  style={{ width: `calc(${100 / currentItemsPerPage}% - ${(4 * (currentItemsPerPage - 1)) / currentItemsPerPage}px)` }}
                >
                  <AnimeCard
                    id={anime.mal_id}
                    title={anime.title}
                    image={anime.images.jpg.large_image_url}
                    rating={anime.score}
                    type={anime.type}
                    episodes={anime.episodes}
                    genres={anime.genres}
                    year={anime.year}
                    season={anime.season}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
      
      {/* No anime found */}
      {!loading && !error && animeList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No recent anime found</p>
        </div>
      )}
    </section>
  );
}