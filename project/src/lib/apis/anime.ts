import { z } from 'zod';

/**
 * Comprehensive documentation of available anime APIs
 */

export const AnimeAPISchema = z.object({
  name: z.string(),
  url: z.string().url(),
  apiUrl: z.string().url(),
  auth: z.object({
    type: z.enum(['apiKey', 'oauth2', 'none']),
    instructions: z.string(),
  }),
  documentation: z.string().url(),
  features: z.array(z.string()),
  endpoints: z.array(z.object({
    path: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    description: z.string(),
  })),
  rateLimit: z.object({
    requests: z.number(),
    period: z.string(),
  }).optional(),
  tier: z.object({
    free: z.object({
      available: z.boolean(),
      limitations: z.array(z.string()),
    }),
    paid: z.object({
      available: z.boolean(),
      pricing: z.string().optional(),
      features: z.array(z.string()).optional(),
    }),
  }),
});

export type AnimeAPI = z.infer<typeof AnimeAPISchema>;

export const ANIME_APIS: AnimeAPI[] = [
  {
    name: "MyAnimeList API",
    url: "https://myanimelist.net",
    apiUrl: "https://api.myanimelist.net/v2",
    auth: {
      type: "oauth2",
      instructions: "Requires client ID and optional OAuth2 for extended access",
    },
    documentation: "https://myanimelist.net/apiconfig/references/api/v2",
    features: [
      "Anime database",
      "Manga database",
      "User lists",
      "Reviews",
      "Recommendations",
      "Seasonal anime",
      "Rankings"
    ],
    endpoints: [
      {
        path: "/anime/{id}",
        method: "GET",
        description: "Get anime details by ID",
      },
      {
        path: "/anime/ranking",
        method: "GET",
        description: "Get top anime rankings",
      }
    ],
    rateLimit: {
      requests: 3,
      period: "second"
    },
    tier: {
      free: {
        available: true,
        limitations: [
          "Limited to 3 requests per second",
          "Some endpoints require authentication"
        ]
      },
      paid: {
        available: false
      }
    }
  },
  {
    name: "Kitsu API",
    url: "https://kitsu.io",
    apiUrl: "https://kitsu.io/api/edge",
    auth: {
      type: "oauth2",
      instructions: "OAuth2 required for user-specific actions only",
    },
    documentation: "https://kitsu.docs.apiary.io",
    features: [
      "Anime database",
      "Manga database",
      "User library",
      "Categories",
      "Episodes",
      "Reviews",
      "Character data"
    ],
    endpoints: [
      {
        path: "/anime",
        method: "GET",
        description: "List anime with filters",
      },
      {
        path: "/anime/{id}/episodes",
        method: "GET",
        description: "Get anime episodes",
      }
    ],
    rateLimit: {
      requests: 60,
      period: "minute"
    },
    tier: {
      free: {
        available: true,
        limitations: [
          "Rate limited to 60 requests per minute"
        ]
      },
      paid: {
        available: false
      }
    }
  },
  {
    name: "AniList API",
    url: "https://anilist.co",
    apiUrl: "https://graphql.anilist.co",
    auth: {
      type: "oauth2",
      instructions: "OAuth2 required for mutations and private data",
    },
    documentation: "https://anilist.gitbook.io/anilist-apiv2-docs/",
    features: [
      "GraphQL API",
      "Anime database",
      "Manga database",
      "Character database",
      "Staff database",
      "User lists",
      "Activity feed",
      "Real-time notifications"
    ],
    endpoints: [
      {
        path: "/",
        method: "POST",
        description: "GraphQL endpoint for all operations",
      }
    ],
    rateLimit: {
      requests: 90,
      period: "minute"
    },
    tier: {
      free: {
        available: true,
        limitations: [
          "90 requests per minute",
          "Some queries require authentication"
        ]
      },
      paid: {
        available: false
      }
    }
  },
  {
    name: "Crunchyroll API",
    url: "https://www.crunchyroll.com",
    apiUrl: "https://beta-api.crunchyroll.com",
    auth: {
      type: "apiKey",
      instructions: "Requires API key and premium account for full access",
    },
    documentation: "https://www.crunchyroll.com/developers/docs",
    features: [
      "Anime streaming",
      "Episode metadata",
      "Series information",
      "Simulcasts",
      "Multiple languages",
      "Subtitles",
      "Dubbing"
    ],
    endpoints: [
      {
        path: "/content/v2/cms",
        method: "GET",
        description: "Get content metadata",
      },
      {
        path: "/videos/{id}/streams",
        method: "GET",
        description: "Get video streams",
      }
    ],
    tier: {
      free: {
        available: false,
        limitations: []
      },
      paid: {
        available: true,
        pricing: "Requires Crunchyroll Premium subscription",
        features: [
          "Full access to streaming content",
          "HD quality",
          "Multiple language support"
        ]
      }
    }
  },
  {
    name: "Jikan API (MyAnimeList Unofficial)",
    url: "https://jikan.moe",
    apiUrl: "https://api.jikan.moe/v4",
    auth: {
      type: "none",
      instructions: "No authentication required",
    },
    documentation: "https://docs.api.jikan.moe/",
    features: [
      "Anime data",
      "Manga data",
      "Character info",
      "Staff details",
      "User reviews",
      "Recommendations",
      "Seasonal anime",
      "Schedules"
    ],
    endpoints: [
      {
        path: "/anime/{id}",
        method: "GET",
        description: "Get anime details",
      },
      {
        path: "/seasons/{year}/{season}",
        method: "GET",
        description: "Get seasonal anime",
      }
    ],
    rateLimit: {
      requests: 60,
      period: "minute"
    },
    tier: {
      free: {
        available: true,
        limitations: [
          "Rate limited to 60 requests per minute",
          "No guaranteed uptime",
          "Cached data"
        ]
      },
      paid: {
        available: false
      }
    }
  }
];

/**
 * Example API calls for reference
 */

export const API_EXAMPLES = {
  // MyAnimeList API
  myAnimeList: {
    getAnime: `
    const response = await fetch('https://api.myanimelist.net/v2/anime/1', {
      headers: {
        'X-MAL-CLIENT-ID': 'your-client-id'
      }
    });
    const data = await response.json();
    `,
    searchAnime: `
    const response = await fetch('https://api.myanimelist.net/v2/anime?q=one%20piece&limit=10', {
      headers: {
        'X-MAL-CLIENT-ID': 'your-client-id'
      }
    });
    const data = await response.json();
    `
  },
  
  // AniList API
  aniList: {
    getAnime: `
    const query = \`
      query ($id: Int) {
        Media (id: $id, type: ANIME) {
          id
          title {
            romaji
            english
          }
          episodes
          genres
          averageScore
        }
      }
    \`;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { id: 1 }
      })
    });
    const data = await response.json();
    `
  },

  // Kitsu API
  kitsu: {
    getAnime: `
    const response = await fetch('https://kitsu.io/api/edge/anime/1', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });
    const data = await response.json();
    `
  },

  // Jikan API
  jikan: {
    getAnime: `
    const response = await fetch('https://api.jikan.moe/v4/anime/1');
    const data = await response.json();
    `,
    getSeasonalAnime: `
    const response = await fetch('https://api.jikan.moe/v4/seasons/2024/winter');
    const data = await response.json();
    `
  }
};