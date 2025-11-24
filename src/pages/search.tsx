import { useState, useEffect } from 'react';
import { Search as SearchIcon, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchMovies, Movie } from '@/lib/api';
import { MovieCard } from '@/components/ui/movie-card';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                try {
                    const data = await searchMovies(query);
                    setResults(data);
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background border-b border-border">
                <div className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                        <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <div className="flex-1 flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-border">
                        <SearchIcon className="h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search movies, series, actors..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
                            autoFocus
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="p-1">
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 pt-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {results.map((movie, index) => (
                            <MovieCard key={movie.id} movie={movie} index={index} />
                        ))}
                    </div>
                )}

                {!loading && query && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                        <SearchIcon className="mb-4 h-12 w-12 opacity-20" />
                        <p>No results found for "{query}"</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
