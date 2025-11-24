import { useState, useEffect } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Movie, getImageUrl } from '@/lib/api';

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);

    useEffect(() => {
        loadWatchlist();
    }, []);

    const loadWatchlist = () => {
        const saved = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setWatchlist(saved);
    };

    const removeFromWatchlist = (movieId: number) => {
        const updated = watchlist.filter(m => m.id !== movieId);
        localStorage.setItem('watchlist', JSON.stringify(updated));
        setWatchlist(updated);
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-background border-b border-border px-4 py-4">
                <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
                <p className="text-sm text-muted-foreground">{watchlist.length} movies saved</p>
            </div>

            {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Bookmark className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Your Watchlist is Empty</h2>
                    <p className="text-center text-muted-foreground max-w-sm">
                        Start adding movies and shows you want to watch later
                    </p>
                </div>
            ) : (
                <div className="px-4 pt-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {watchlist.map((movie) => (
                            <div key={movie.id} className="relative group">
                                <Link to={`/movie/${movie.id}`}>
                                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5">
                                        <img
                                            src={getImageUrl(movie.poster_path)}
                                            alt={movie.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
                                            <span className="text-xs text-yellow-400 font-semibold">
                                                ⭐ {movie.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="mt-2 text-sm font-medium text-foreground line-clamp-2 leading-tight">
                                        {movie.title}
                                    </h3>
                                </Link>
                                <button
                                    onClick={() => removeFromWatchlist(movie.id)}
                                    className="absolute top-2 left-2 p-2 bg-red-500/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
