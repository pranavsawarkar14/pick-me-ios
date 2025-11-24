import axios from 'axios';

const API_KEY = '6f4bea985032953e284db545b1733ece';
const BASE_URL = 'https://api.themoviedb.org/3';

export const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
    timeout: 10000, // 10 second timeout for Safari
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    vote_average: number;
    release_date: string;
    genres?: { id: number; name: string }[];
    runtime?: number;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    type: string;
}

export interface Provider {
    provider_id: number;
    provider_name: string;
    logo_path: string;
}

export const getTrendingMovies = async (): Promise<Movie[]> => {
    try {
        const response = await api.get('/trending/movie/week');
        return response.data.results || [];
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        // Fallback to popular movies if trending fails
        try {
            const fallback = await api.get('/movie/popular');
            return fallback.data.results || [];
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            return [];
        }
    }
};

export const getIndianMovies = async (): Promise<Movie[]> => {
    try {
        const response = await api.get('/discover/movie', {
            params: {
                region: 'IN',
                with_original_language: 'hi|te|ta|ml|kn',
                sort_by: 'popularity.desc',
                'vote_count.gte': 100
            }
        });
        return response.data.results || [];
    } catch (error) {
        console.error('Error fetching Indian movies:', error);
        return [];
    }
};

export const getPersonDetails = async (id: number) => {
    const response = await api.get(`/person/${id}`);
    return response.data;
};

export const getPersonCredits = async (id: number) => {
    const response = await api.get(`/person/${id}/movie_credits`);
    return response.data.cast
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 20);
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
    const response = await api.get(`/movie/${id}`);
    return response.data;
};

export const getMovieCredits = async (id: number): Promise<Cast[]> => {
    const response = await api.get(`/movie/${id}/credits`);
    return response.data.cast.slice(0, 15);
};

export const getMovieVideos = async (id: number): Promise<Video[]> => {
    const response = await api.get(`/movie/${id}/videos`);
    return response.data.results.filter((v: Video) => v.type === 'Trailer' || v.type === 'Teaser');
};

export const getWatchProviders = async (id: number): Promise<Provider[]> => {
    const response = await api.get(`/movie/${id}/watch/providers`);
    const results = response.data.results.IN || response.data.results.US;
    return results?.flatrate || [];
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    const response = await api.get('/search/movie', {
        params: { query },
    });
    return response.data.results;
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getSimilarMovies = async (id: number): Promise<Movie[]> => {
    const response = await api.get(`/movie/${id}/similar`);
    return response.data.results.slice(0, 10);
};

export const getRecommendations = async (id: number): Promise<Movie[]> => {
    const response = await api.get(`/movie/${id}/recommendations`);
    return response.data.results.slice(0, 10);
};

export const getGenres = async () => {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
};

export const discoverMovies = async (params: {
    with_genres?: string;
    sort_by?: string;
    year?: number;
    vote_average_gte?: number;
}): Promise<Movie[]> => {
    const response = await api.get('/discover/movie', { params });
    return response.data.results;
};

// Advanced recommendation algorithm based on user preferences
export const getPersonalizedRecommendations = async (preferences: {
    favoriteGenres?: number[];
    minRating?: number;
    yearRange?: { min: number; max: number };
    language?: string;
}): Promise<Movie[]> => {
    const params: any = {
        sort_by: 'vote_average.desc',
        'vote_count.gte': 100,
    };

    if (preferences.favoriteGenres && preferences.favoriteGenres.length > 0) {
        params.with_genres = preferences.favoriteGenres.join(',');
    }

    if (preferences.minRating) {
        params['vote_average.gte'] = preferences.minRating;
    }

    if (preferences.yearRange) {
        params['primary_release_date.gte'] = `${preferences.yearRange.min}-01-01`;
        params['primary_release_date.lte'] = `${preferences.yearRange.max}-12-31`;
    }

    if (preferences.language) {
        params.with_original_language = preferences.language;
    }

    const response = await api.get('/discover/movie', { params });
    return response.data.results;
};
