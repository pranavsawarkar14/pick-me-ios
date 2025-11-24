import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Plus, Star, Clock, Calendar, X, Check } from 'lucide-react';
import {
    getMovieDetails,
    getMovieCredits,
    getWatchProviders,
    getMovieVideos,
    getSimilarMovies,
    getImageUrl,
    Movie,
    Cast,
    Provider,
    Video
} from '@/lib/api';
import { RecommendationChart } from '@/components/ui/recommendation-chart';
import { MovieRow } from '@/components/ui/movie-row';

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [trailer, setTrailer] = useState<Video | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addedToWatchlist, setAddedToWatchlist] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [movieData, castData, providersData, videosData, similar] = await Promise.all([
                    getMovieDetails(Number(id)),
                    getMovieCredits(Number(id)),
                    getWatchProviders(Number(id)),
                    getMovieVideos(Number(id)),
                    getSimilarMovies(Number(id))
                ]);
                setMovie(movieData);
                setCast(castData);
                setProviders(providersData);
                setTrailer(videosData.find(v => v.type === 'Trailer') || videosData[0] || null);
                setSimilarMovies(similar);
            } catch (error) {
                console.error('Failed to fetch movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const handleAddToWatchlist = () => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        if (!watchlist.find((m: Movie) => m.id === movie?.id)) {
            watchlist.push(movie);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            setAddedToWatchlist(true);
            setTimeout(() => {
                navigate('/watchlist');
            }, 1000);
        }
    };

    if (!movie) return null;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0"
                >
                    <img
                        src={getImageUrl(movie.backdrop_path, 'original')}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute top-0 left-0 p-4 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full bg-black/40 p-2 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-bold text-white mb-2"
                    >
                        {movie.title}
                    </motion.h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                        <span className="flex items-center gap-1 text-yellow-400">
                            <Star className="h-4 w-4 fill-current" />
                            {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {movie.runtime} min
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(movie.release_date).getFullYear()}
                        </span>
                        <div className="flex gap-2">
                            {movie.genres?.map(g => (
                                <span key={g.id} className="rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => trailer && setShowTrailer(true)}
                            disabled={!trailer}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play className="h-5 w-5 fill-current" />
                            {trailer ? 'Watch Trailer' : 'No Trailer'}
                        </button>
                        <button
                            onClick={handleAddToWatchlist}
                            className={`flex items-center justify-center rounded-xl p-3 text-white backdrop-blur-md transition-all ${addedToWatchlist
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            {addedToWatchlist ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8 space-y-8">
                {/* Recommendation Chart */}
                <section className="flex justify-center py-4 bg-card/50 rounded-2xl backdrop-blur-sm border border-white/5">
                    <RecommendationChart voteAverage={movie.vote_average} />
                </section>

                {/* Overview */}
                <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">Storyline</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {movie.overview}
                    </p>
                </section>

                {/* Where to Watch */}
                {providers.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">Where to Watch</h2>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {providers.map(provider => (
                                <div key={provider.provider_id} className="flex-shrink-0">
                                    <img
                                        src={getImageUrl(provider.logo_path)}
                                        alt={provider.provider_name}
                                        className="h-12 w-12 rounded-xl object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Cast */}
                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4">Cast</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {cast.map(person => (
                            <Link to={`/actor/${person.id}`} key={person.id} className="w-24 flex-shrink-0 text-center group">
                                <div className="mb-2 h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 transition-transform group-hover:scale-105 group-hover:border-primary">
                                    <img
                                        src={getImageUrl(person.profile_path)}
                                        alt={person.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">{person.name}</p>
                                <p className="truncate text-xs text-muted-foreground">{person.character}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* Similar Movies */}
            {similarMovies.length > 0 && (
                <MovieRow title="Similar Movies" movies={similarMovies} />
            )}

            {/* Trailer Modal */}
            <AnimatePresence>
                {showTrailer && trailer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    >
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                                title={trailer.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
