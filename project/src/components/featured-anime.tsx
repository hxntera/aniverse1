import { motion } from 'framer-motion';
import { Play, Star, Clock, Calendar, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedAnime() {
  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=2000"
        alt="Featured Anime"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-8 md:p-16 container mx-auto flex gap-8 items-end"
      >
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Featured
            </span>
            <div className="flex items-center gap-1 text-yellow-400 bg-black/40 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">9.8</span>
            </div>
          </div>

          <h2 className="text-6xl md:text-8xl font-bold mb-6 text-gradient leading-none">
            Attack on Titan
          </h2>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <span className="genre-tag">Action</span>
            <span className="genre-tag">Drama</span>
            <span className="genre-tag">Fantasy</span>
            <span className="genre-tag">Mystery</span>
          </div>

          <div className="flex items-center gap-6 mb-6 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              2023
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              24 Episodes
            </span>
            <span className="px-2 py-1 bg-white/10 rounded text-white">
              TV Series
            </span>
          </div>

          <p className="max-w-2xl text-gray-300 mb-8 text-lg leading-relaxed">
            In a world where humanity resides within enormous walled cities to protect themselves from Titans, 
            giant humanoid creatures who devour humans seemingly without reason. The story follows Eren Yeager, 
            whose life is changed forever after a Colossal Titan breaches his hometown's wall.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/anime/16498" className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 hover:scale-105">
              <Play className="w-5 h-5" />
              Watch Now
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 glass hover:bg-white/20 rounded-lg transition-all duration-300">
              <Heart className="w-5 h-5" />
              Add to List
            </button>
            <button className="p-4 glass hover:bg-white/20 rounded-lg transition-all duration-300">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="hidden lg:block w-[300px]">
          <Link to="/anime/16498" className="block">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden card-hover">
              <img 
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800" 
                alt="Attack on Titan Poster" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 card-gradient" />
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}