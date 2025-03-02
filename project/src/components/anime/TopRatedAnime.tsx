import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { animeClient } from '../../lib/apis/anime-client';
import toast from 'react-hot-toast';

export function TopRatedAnime() {
  const [topAnime, setTopAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchTopAnime() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await animeClient.getTopAnime(1);
        if (isMounted) {
          setTopAnime(response.data.slice(0, 5)); // Get top 5
        }
      } catch (err) {
        console.error('Failed to fetch top anime:', err);
        if (isMounted) {
          setError('Failed to load top anime');
          toast.error('Failed to load top anime');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchTopAnime();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-3xl font-bold">Top Rated</h2>
        </div>
        <Link to="/top-rated" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
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
      
      {/* Top anime list */}
      {!loading && !error && topAnime.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {topAnime.map((anime, index) => (
            <motion.div
              key={anime.mal_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Link to={`/anime/${anime.mal_id}`} className="block">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  
                  {/* Rank badge */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="font-bold text-black">{index + 1}</span>
                  </div>
                  
                  {/* Rating */}
                  {anime.score && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-yellow-400 bg-black/70 px-2 py-1 rounded-full text-sm">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-medium">{anime.score.toFixed(1)}</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white line-clamp-2">{anime.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-300">{anime.type}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-300">{anime.episodes || '?'} eps</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* No anime found */}
      {!loading && !error && topAnime.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No top anime found</p>
        </div>
      )}
    </section>
  );
}