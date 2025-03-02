import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'action',
    name: 'Action',
    description: 'Fast-paced excitement, battles, and adrenaline-pumping adventures',
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&w=500',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'romance',
    name: 'Romance',
    description: 'Heartwarming stories of love, relationships, and emotional connections',
    image: 'https://images.unsplash.com/photo-1612833603922-5a4a5a6b9c68?auto=format&fit=crop&w=500',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Magical worlds, mythical creatures, and extraordinary powers',
    image: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=500',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'scifi',
    name: 'Sci-Fi',
    description: 'Futuristic technology, space exploration, and scientific concepts',
    image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=500',
    color: 'from-violet-500 to-indigo-500'
  }
];

export function AnimeCategories() {
  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Browse by Category</h2>
        <Link to="/categories" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-lg overflow-hidden card-hover"
          >
            <Link to={`/category/${category.id}`} className="block">
              <div className="aspect-[16/9] relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-white/90">{category.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}