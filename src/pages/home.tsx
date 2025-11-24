import { useState, useEffect } from 'react';
import { Mic, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FeaturedCarousel } from '@/components/ui/featured-carousel';
import { MovieRow } from '@/components/ui/movie-row';
import { BottomNav } from '@/components/layout/bottom-nav';
import { getTrendingMovies, getIndianMovies, Movie } from '@/lib/api';

export default function Home() {
    const navigate = useNavigate();
    const [indianMovies, setIndianMovies] = useState<Movie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const [indian, trending] = await Promise.all([
                    getIndianMovies(),
                    getTrendingMovies()
                ]);
                setIndianMovies(indian);
                setTrendingMovies(trending);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header with Search */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
                <div className="px-4 py-3">
                    <div
                        onClick={() => navigate('/search')}
                        className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 cursor-pointer border border-border"
                    >
                        <Search className="h-5 w-5 text-gray-400" />
                        <span className="flex-1 text-gray-400 text-sm">Search</span>
                        <Mic className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </div>

            <main className="pt-4">
                {/* Featured Carousel */}
                <div className="px-4 mb-6">
                    {loading ? (
                        <div className="h-[280px] w-full animate-pulse rounded-2xl bg-white/5" />
                    ) : (
                        <FeaturedCarousel movies={trendingMovies.slice(0, 5)} />
                    )}
                </div>

                {/* Trending Now */}
                {loading ? (
                    <div className="px-4">
                        <div className="h-6 w-32 animate-pulse rounded bg-white/5 mb-4" />
                        <div className="flex gap-3 overflow-x-auto">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-[140px] flex-shrink-0">
                                    <div className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <MovieRow title="Trending Now" movies={trendingMovies} />
                        <MovieRow title="🇮🇳 Indian Cinema" movies={indianMovies} />
                        <MovieRow title="For You" movies={trendingMovies.slice(5, 15)} />
                    </>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
