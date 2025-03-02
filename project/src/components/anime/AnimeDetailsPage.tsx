import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Calendar, 
  Clock, 
  Heart, 
  Share2, 
  BookmarkPlus, 
  Play, 
  X,
  ChevronLeft,
  Info,
  Users,
  MessageCircle
} from 'lucide-react';
import { animeClient } from '../../lib/apis/anime-client';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

export function AnimeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const { user } = useAuth();
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchAnimeDetails() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const animeData = await animeClient.getAnimeById(parseInt(id));
        
        if (isMounted) {
          setAnime(animeData);
        }
      } catch (err) {
        console.error('Failed to fetch anime details:', err);
        if (isMounted) {
          setError('Failed to load anime details. Please try again later.');
          toast.error('Failed to load anime details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchAnimeDetails();
    
    return () => {
      isMounted = false;
    };
  }, [id]);
  
  const handleAddToWatchlist = () => {
    if (!user) {
      toast.error('Please sign in to add to your watchlist');
      return;
    }
    
    toast.success(`Added ${anime?.title} to your watchlist`);
  };
  
  const handleAddToFavorites = () => {
    if (!user) {
      toast.error('Please sign in to add to favorites');
      return;
    }
    
    toast.success(`Added ${anime?.title} to your favorites`);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: anime?.title,
        text: `Check out ${anime?.title} on Aniverse!`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };
  
  const handlePlayEpisode = (episodeNumber: number) => {
    setCurrentEpisode(episodeNumber);
    setIsPlaying(true);
    
    // Scroll to player
    const playerElement = document.getElementById('anime-player');
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const closePlayer = () => {
    setIsPlaying(false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading anime details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !anime) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Failed to load anime'}</p>
          <Link 
            to="/"
            className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Generate episode list based on episodes count
  const episodes = Array.from(
    { length: anime.episodes || 12 }, 
    (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: anime.images.jpg.large_image_url,
      duration: Math.floor(Math.random() * 6) + 20, // Random duration between 20-25 minutes
    })
  );
  
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto flex gap-8 items-end">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                {anime.type}
              </span>
              {anime.score && (
                <div className="flex items-center gap-1 text-yellow-400 bg-black/40 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{anime.score.toFixed(1)}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-none">
              {anime.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {anime.genres.map((genre: any) => (
                <span key={genre.mal_id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 mb-6 text-sm text-gray-300">
              {anime.year && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {anime.year}
                </span>
              )}
              {anime.episodes && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {anime.episodes} Episodes
                </span>
              )}
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {anime.members.toLocaleString()} Members
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handlePlayEpisode(1)}
                className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Watch Now
              </button>
              <button 
                onClick={handleAddToWatchlist}
                className="flex items-center gap-2 px-8 py-4 glass hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <BookmarkPlus className="w-5 h-5" />
                Add to List
              </button>
              <button 
                onClick={handleAddToFavorites}
                className="p-4 glass hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button 
                onClick={handleShare}
                className="p-4 glass hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-[300px]">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden card-hover">
              <img 
                src={anime.images.jpg.large_image_url}
                alt={anime.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 card-gradient" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Player Section */}
      {isPlaying && (
        <div id="anime-player" className="py-8 bg-black">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {anime.title} - Episode {currentEpisode}
              </h2>
              <button 
                onClick={closePlayer}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-gray-400">
                    This is a demo player. In a real application, the video would play here.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentEpisode === 1 ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
                }`}
                onClick={() => setCurrentEpisode(1)}
              >
                Episode 1
              </button>
              {anime.episodes && anime.episodes > 1 && (
                <button 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentEpisode === 2 ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
                  }`}
                  onClick={() => setCurrentEpisode(2)}
                >
                  Episode 2
                </button>
              )}
              {anime.episodes && anime.episodes > 2 && (
                <button 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentEpisode === 3 ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
                  }`}
                  onClick={() => setCurrentEpisode(3)}
                >
                  Episode 3
                </button>
              )}
              {/* More episodes indicator */}
              {anime.episodes && anime.episodes > 3 && (
                <button className="px-4 py-2 bg-white/10 rounded-lg">
                  ...
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Synopsis
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {anime.synopsis || 'No synopsis available.'}
              </p>
            </div>
            
            {/* Episodes */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Episodes
              </h2>
              
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <motion.div
                    key={episode.number}
                    whileHover={{ scale: 1.01 }}
                    className="flex gap-4 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handlePlayEpisode(episode.number)}
                  >
                    <div className="relative w-40 aspect-video rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={episode.thumbnail} 
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{episode.title}</h3>
                      <p className="text-sm text-gray-400">{episode.duration} min</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Discussion
              </h2>
              
              {user ? (
                <div className="mb-6">
                  <textarea
                    placeholder="Share your thoughts about this anime..."
                    className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors text-sm">
                      Post Comment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-white/5 rounded-lg mb-6">
                  <p className="text-gray-400 mb-2">Sign in to join the discussion</p>
                  <button className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors text-sm">
                    Sign In
                  </button>
                </div>
              )}
              
              <div className="text-center py-4">
                <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Information */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Information</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span>{anime.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Episodes</span>
                  <span>{anime.episodes || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span>{anime.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Aired</span>
                  <span>{anime.year || 'Unknown'}</span>
                </div>
                {anime.season && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Season</span>
                    <span className="capitalize">{anime.season}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span>{anime.rating || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Source</span>
                  <span>{anime.source}</span>
                </div>
              </div>
            </div>
            
            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <div className="glass rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Studios</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map((studio: any) => (
                    <span 
                      key={studio.mal_id}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Related Anime */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
              
              <div className="space-y-4">
                {/* Placeholder related anime */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-24 bg-white/10 rounded overflow-hidden flex-shrink-0">
                      <div className="w-full h-full animate-pulse bg-white/5" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse mb-2" />
                      <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}