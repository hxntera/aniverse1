import { motion } from 'framer-motion';
import { Star, TrendingUp, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const trendingAnime = [
  {
    id: 5114,
    title: "Fullmetal Alchemist: Brotherhood",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500",
    rating: 9.5,
    genre: "Action",
    episodes: 64
  },
  {
    id: 38000,
    title: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=500",
    rating: 9.3,
    genre: "Supernatural",
    episodes: 24
  },
  {
    id: 21,
    title: "One Piece",
    image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=500",
    rating: 9.7,
    genre: "Adventure",
    episodes: 1000
  },
  {
    id: 44511,
    title: "Chainsaw Man",
    image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&w=500",
    rating: 9.1,
    genre: "Dark Fantasy",
    episodes: 12
  }
];

export function TrendingSection() {
  return (
    <section className="py-16 px-4 md:px-8 container mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="relative">
            <TrendingUp className="w-6 h-6 text-primary" />
            <motion.div 
              className="absolute -inset-1 bg-primary/20 rounded-full z-[-1]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <h3 className="text-2xl font-bold">Trending Now</h3>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingAnime.map((anime, index) => (
          <motion.div
            key={anime.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-lg overflow-hidden card-hover"
          >
            <Link to={`/anime/${anime.id}`}>
              <div className="aspect-[3/4] relative">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Play className="w-5 h-5" />
                      Play Now
                    </button>
                  </div>
                  <div className="absolute bottom-0 p-4 w-full">
                    <h4 className="text-lg font-semibold mb-2">{anime.title}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{anime.genre}</span>
                      <span className="flex items-center gap-1 text-yellow-400 bg-black/40 px-2 py-1 rounded-full text-sm">
                        <Star className="w-3 h-3 fill-current" />
                        {anime.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{anime.episodes} Episodes</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}