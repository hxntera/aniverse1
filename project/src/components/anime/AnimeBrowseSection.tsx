import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import { AnimeCard } from './AnimeCard';
import { animeClient } from '../../lib/apis/anime-client';
import toast from 'react-hot-toast';

const ANIME_TYPES = ['TV', 'Movie', 'OVA', 'Special', 'ONA', 'Music'];
const ANIME_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'
];
const ANIME_SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];
const ANIME_YEARS = Array.from({ length: 11 }, (_, i) => 2025 - i);

export function AnimeBrowseSection() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchAnime() {
      try {
        setLoading(true);
        setError(null);
        
        // If search query exists, use search endpoint
        if (searchQuery.trim()) {
          const response = await animeClient.searchAnime(searchQuery, page);
          if (isMounted) {
            setAnimeList(response.data);
            setHasNextPage(response.pagination.has_next_page);
          }
        } else {
          // Otherwise fetch top anime
          const response = await animeClient.getTopAnime(page);
          if (isMounted) {
            setAnimeList(response.data);
            setHasNextPage(response.pagination.has_next_page);
          }
        }
      } catch (err) {
        console.error('Failed to fetch anime:', err);
        if (isMounted) {
          setError('Failed to load anime. Please try again later.');
          toast.error('Failed to load anime');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchAnime();
    
    return () => {
      isMounted = false;
    };
  }, [page, searchQuery]);
  
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  
  const clearFilters = () => {
    setSelectedType(null);
    setSelectedGenres([]);
    setSelectedYear(null);
    setSelectedSeason(null);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };
  
  // Filter anime list based on selected filters
  const filteredAnimeList = animeList.filter(anime => {
    // Filter by type
    if (selectedType && anime.type !== selectedType) {
      return false;
    }
    
    // Filter by genres
    if (selectedGenres.length > 0) {
      const animeGenres = anime.genres.map((g: any) => g.name);
      if (!selectedGenres.some(genre => animeGenres.includes(genre))) {
        return false;
      }
    }
    
    // Filter by year
    if (selectedYear && anime.year !== selectedYear) {
      return false;
    }
    
    // Filter by season
    if (selectedSeason && anime.season !== selectedSeason?.toLowerCase()) {
      return false;
    }
    
    return true;
  });
  
  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold">Explore Anime</h2>
        
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 pr-10 rounded-full bg-secondary text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Search className="w-4 h-4 text-gray-400" />
            </button>
          </form>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-white/10 rounded-full transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Filters section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 glass rounded-lg p-4"
        >
          <div className="flex flex-wrap gap-6">
            {/* Type filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Type</h3>
              <div className="flex flex-wrap gap-2">
                {ANIME_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Genres filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {ANIME_GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Year filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Year</h3>
              <div className="flex flex-wrap gap-2">
                {ANIME_YEARS.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedYear === year
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Season filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Season</h3>
              <div className="flex flex-wrap gap-2">
                {ANIME_SEASONS.map(season => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(selectedSeason === season ? null : season)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedSeason === season
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Active filters */}
          {(selectedType || selectedGenres.length > 0 || selectedYear || selectedSeason) && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Active filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedType && (
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center gap-1">
                        {selectedType}
                        <button onClick={() => setSelectedType(null)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    
                    {selectedGenres.map(genre => (
                      <span key={genre} className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center gap-1">
                        {genre}
                        <button onClick={() => toggleGenre(genre)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    {selectedYear && (
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center gap-1">
                        {selectedYear}
                        <button onClick={() => setSelectedYear(null)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    
                    {selectedSeason && (
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center gap-1">
                        {selectedSeason}
                        <button onClick={() => setSelectedSeason(null)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => setPage(1)}
            className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Results count */}
      {!loading && !error && (
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            Showing {filteredAnimeList.length} anime
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      )}
      
      {/* Anime grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredAnimeList.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
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
            ))}
          </div>
          
          {/* Pagination */}
          {filteredAnimeList.length > 0 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === 1
                    ? 'bg-secondary/50 text-gray-500 cursor-not-allowed'
                    : 'bg-secondary hover:bg-white/10'
                }`}
              >
                Previous
              </button>
              
              <span className="px-4 py-2 bg-white/10 rounded-lg">
                Page {page}
              </span>
              
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasNextPage}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !hasNextPage
                    ? 'bg-secondary/50 text-gray-500 cursor-not-allowed'
                    : 'bg-secondary hover:bg-white/10'
                }`}
              >
                Next
              </button>
            </div>
          )}
          
          {/* No results */}
          {filteredAnimeList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No anime found matching your criteria</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}