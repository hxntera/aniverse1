import { z } from 'zod';

// API Response Schemas
export const AnimeSchema = z.object({
  mal_id: z.number(),
  title: z.string(),
  title_english: z.string().nullable(),
  title_japanese: z.string().nullable(),
  type: z.string(),
  source: z.string(),
  episodes: z.number().nullable(),
  status: z.string(),
  airing: z.boolean(),
  duration: z.string(),
  rating: z.string().nullable(),
  score: z.number().nullable(),
  scored_by: z.number().nullable(),
  rank: z.number().nullable(),
  popularity: z.number().nullable(),
  members: z.number(),
  favorites: z.number(),
  synopsis: z.string().nullable(),
  background: z.string().nullable(),
  season: z.string().nullable(),
  year: z.number().nullable(),
  images: z.object({
    jpg: z.object({
      image_url: z.string(),
      small_image_url: z.string(),
      large_image_url: z.string(),
    }),
    webp: z.object({
      image_url: z.string(),
      small_image_url: z.string(),
      large_image_url: z.string(),
    }),
  }),
  genres: z.array(z.object({
    mal_id: z.number(),
    type: z.string(),
    name: z.string(),
  })),
  studios: z.array(z.object({
    mal_id: z.number(),
    type: z.string(),
    name: z.string(),
  })),
});

export type Anime = z.infer<typeof AnimeSchema>;

export const AnimeListResponseSchema = z.object({
  pagination: z.object({
    last_visible_page: z.number(),
    has_next_page: z.boolean(),
    current_page: z.number(),
    items: z.object({
      count: z.number(),
      total: z.number(),
      per_page: z.number(),
    }),
  }),
  data: z.array(AnimeSchema),
});

export type AnimeListResponse = z.infer<typeof AnimeListResponseSchema>;

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds between retries

class AnimeClient {
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue: boolean = false;

  private async rateLimitedFetch(endpoint: string, init?: RequestInit, retryCount = 0): Promise<any> {
    try {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
      }

      this.lastRequestTime = Date.now();
      const response = await fetch(`${JIKAN_API_BASE}${endpoint}`, init);
      
      // Handle rate limiting response
      if (response.status === 429) {
        if (retryCount < MAX_RETRIES) {
          console.log(`Rate limited, retrying in ${RETRY_DELAY}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return this.rateLimitedFetch(endpoint, init, retryCount + 1);
        } else {
          throw new Error('API rate limit exceeded after multiple retries');
        }
      }
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error, retry
        if (retryCount < MAX_RETRIES) {
          console.log(`Network error, retrying in ${RETRY_DELAY}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return this.rateLimitedFetch(endpoint, init, retryCount + 1);
        }
      }
      throw error;
    }
  }

  private async enqueueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Error processing queue request:', error);
        }
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }
    
    this.isProcessingQueue = false;
  }

  async getTopAnime(page = 1): Promise<AnimeListResponse> {
    return this.enqueueRequest(async () => {
      const data = await this.rateLimitedFetch(`/top/anime?page=${page}`);
      return AnimeListResponseSchema.parse(data);
    });
  }

  async getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall', page = 1): Promise<AnimeListResponse> {
    return this.enqueueRequest(async () => {
      const data = await this.rateLimitedFetch(`/seasons/${year}/${season}?page=${page}`);
      return AnimeListResponseSchema.parse(data);
    });
  }

  async searchAnime(query: string, page = 1): Promise<AnimeListResponse> {
    return this.enqueueRequest(async () => {
      const data = await this.rateLimitedFetch(`/anime?q=${encodeURIComponent(query)}&page=${page}`);
      return AnimeListResponseSchema.parse(data);
    });
  }

  async getAnimeById(id: number): Promise<Anime> {
    return this.enqueueRequest(async () => {
      const data = await this.rateLimitedFetch(`/anime/${id}/full`);
      return z.object({ data: AnimeSchema }).parse(data).data;
    });
  }

  async getAnimeRecommendations(id: number) {
    return this.enqueueRequest(async () => {
      const data = await this.rateLimitedFetch(`/anime/${id}/recommendations`);
      return z.object({
        data: z.array(z.object({
          entry: AnimeSchema,
          url: z.string(),
          votes: z.number(),
        })),
      }).parse(data);
    });
  }
}

export const animeClient = new AnimeClient();