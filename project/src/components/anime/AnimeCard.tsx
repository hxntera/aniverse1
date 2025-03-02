import { motion } from 'framer-motion';
import { Star, Play, Heart, BookmarkPlus, Info } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

export interface AnimeCardProps {
  id: number;
  title: string;
  image: string;
  rating?: number | null;
  type?: string;
  episodes?: number | null;
  genres?: { name: string }[];
  year?: number | null;
  season?: string | null;
}

export function AnimeCard({ 
  id, 
  title, 
  image, 
  rating, 
  type, 
  episodes, 
  genres = [], 
  year, 
  season 
}: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to add to your watchlist');
      return;
    }
    
    toast.success(`Added ${title} to your watchlist`);
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to add to favorites');
      return;
    }
    
    toast.success(`Added ${title} to your favorites`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-lg overflow-hidden card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/anime/${id}`} className="block">
        <div className="aspect-[3/4] relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500';
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 text-yellow-400 bg-black/70 px-2 py-1 rounded-full text-sm">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Type badge */}
          {type && (
            <div className="absolute top-2 left-2 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium">
              {type}
            </div>
          )}
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-12 h-12 bg-primary rounded-full"
            >
              <Play className="w-5 h-5 text-white" fill="white" />
            </motion.button>
          </div>
          
          {/* Action buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToWatchlist}
              className="p-2 bg-black/70 hover:bg-black/90 rounded-full"
              title="Add to watchlist"
            >
              <BookmarkPlus className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToFavorites}
              className="p-2 bg-black/70 hover:bg-black/90 rounded-full"
              title="Add to favorites"
            >
              <Heart className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
        
        {/* Info section */}
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-gray-400">
              {year && <span>{year} • </span>}
              {episodes && <span>{episodes} eps</span>}
            </div>
            {season && (
              <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                {season}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}