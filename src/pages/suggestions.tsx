import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Star, Calendar, Zap, TrendingUp, Award, Film, Shuffle } from 'lucide-react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { MovieRow } from '@/components/ui/movie-row';
import {
    getPersonalizedRecommendations,
    getTrendingMovies,
    getIndianMovies,
    Movie
} from '@/lib/api';

interface Mood {
    id: string;
    name: string;
    icon: string;
    gradient: string;
    genres: number[];
}

export default function Suggestions() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'moods' | 'advanced'>('moods');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [preferences, setPreferences] = useState({
        favoriteGenres: [] as number[],
        minRating: 7,
        yearRange: { min: 2020, max: 2024 },
        language: 'hi|te|ta|ml|kn|en',
    });

    const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [indianMovies, setIndianMovies] = useState<Movie[]>([]);
    const [highRatedMovies, setHighRatedMovies] = useState<Movie[]>([]);
    const [moodMovies, setMoodMovies] = useState<Movie[]>([]);

    const moods: Mood[] = [
        { id: 'action', name: 'Adrenaline Rush', icon: '💥', gradient: 'from-red-500 to-orange-500', genres: [28, 12] },
        { id: 'laugh', name: 'Laugh Out Loud', icon: '😂', gradient: 'from-yellow-500 to-pink-500', genres: [35] },
        { id: 'romance', name: 'Love & Romance', icon: '❤️', gradient: 'from-pink-500 to-purple-500', genres: [10749] },
        { id: 'mystery', name: 'Mystery & Thrill', icon: '🔍', gradient: 'from-purple-500 to-blue-500', genres: [53, 9648] },
        { id: 'scifi', name: 'Future Vision', icon: '🚀', gradient: 'from-blue-500 to-cyan-500', genres: [878] },
        { id: 'drama', name: 'Deep Stories', icon: '🎭', gradient: 'from-indigo-500 to-purple-500', genres: [18] },
        { id: 'horror', name: 'Spine Chiller', icon: '👻', gradient: 'from-gray-700 to-red-900', genres: [27] },
        { id: 'family', name: 'Family Time', icon: '👨‍👩‍👧‍👦', gradient: 'from-green-500 to-teal-500', genres: [10751, 16] },
    ];

    const genres = [
        { id: 28, name: 'Action', icon: '🎬', color: 'from-red-500 to-orange-600' },
        { id: 35, name: 'Comedy', icon: '😂', color: 'from-yellow-500 to-orange-500' },
        { id: 18, name: 'Drama', icon: '🎭', color: 'from-purple-500 to-pink-500' },
        { id: 27, name: 'Horror', icon: '👻', color: 'from-gray-700 to-red-900' },
        { id: 10749, name: 'Romance', icon: '❤️', color: 'from-pink-500 to-red-500' },
        { id: 878, name: 'Sci-Fi', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
        { id: 53, name: 'Thriller', icon: '🔪', color: 'from-purple-600 to-indigo-600' },
        { id: 16, name: 'Animation', icon: '🎨', color: 'from-green-500 to-teal-500' },
    ];

    useEffect(() => {
        if (selectedMood) {
            fetchMoodMovies();
        } else {
            fetchRecommendations();
        }
    }, [preferences, selectedMood]);

    const fetchMoodMovies = async () => {
        const mood = moods.find(m => m.id === selectedMood);
        if (!mood) return;

        setLoading(true);
        try {
            const movies = await getPersonalizedRecommendations({
                favoriteGenres: mood.genres,
                minRating: 6.5,
            });
            setMoodMovies(movies);
        } catch (error) {
            console.error('Failed to fetch mood movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const [personalized, trending, indian, highRated] = await Promise.all([
                getPersonalizedRecommendations(preferences),
                getTrendingMovies(),
                getIndianMovies(),
                getPersonalizedRecommendations({ minRating: 8, favoriteGenres: preferences.favoriteGenres })
            ]);

            setRecommendedMovies(personalized);
            setTrendingMovies(trending);
            setIndianMovies(indian);
            setHighRatedMovies(highRated);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleGenre = (genreId: number) => {
        setPreferences(prev => ({
            ...prev,
            favoriteGenres: prev.favoriteGenres.includes(genreId)
                ? prev.favoriteGenres.filter(id => id !== genreId)
                : [...prev.favoriteGenres, genreId]
        }));
    };

    const selectMood = (moodId: string) => {
        setSelectedMood(moodId === selectedMood ? null : moodId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f1014] via-[#1a1d29] to-[#0f1014] pb-24">
            {/* Animated Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-[#0f1014] border-b border-white/5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

                <div className="relative px-4 py-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center mb-4 shadow-2xl shadow-purple-500/50"
                    >
                        <Sparkles className="h-8 w-8 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-2"
                    >
                        AI-Powered Suggestions
                    </motion.h1>
                    <p className="text-center text-muted-foreground">Discover your next favorite movie</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="sticky top-0 z-30 bg-[#0f1014]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3">
                <div className="flex gap-2 bg-[#1a1d29] rounded-xl p-1">
                    <button
                        onClick={() => setActiveTab('moods')}
                        className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'moods'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Zap className="inline h-4 w-4 mr-2" />
                        Quick Moods
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'advanced'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <TrendingUp className="inline h-4 w-4 mr-2" />
                        Advanced
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'moods' ? (
                    <motion.div
                        key="moods"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="px-4 pt-6"
                    >
                        {/* Mood Cards */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {moods.map((mood, index) => (
                                <motion.button
                                    key={mood.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => selectMood(mood.id)}
                                    className={`relative overflow-hidden rounded-2xl p-5 transition-all ${selectedMood === mood.id
                                            ? 'scale-105 shadow-2xl'
                                            : 'hover:scale-102'
                                        }`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} ${selectedMood === mood.id ? 'opacity-100' : 'opacity-70'
                                        }`} />
                                    <div className="relative">
                                        <div className="text-4xl mb-2">{mood.icon}</div>
                                        <div className="text-white font-bold text-sm">{mood.name}</div>
                                    </div>
                                    {selectedMood === mood.id && (
                                        <motion.div
                                            layoutId="mood-indicator"
                                            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                                        >
                                            <Award className="h-4 w-4 text-purple-600" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Shuffle Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                                selectMood(randomMood.id);
                            }}
                            className="w-full mb-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                        >
                            <Shuffle className="h-5 w-5" />
                            Surprise Me!
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="advanced"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="px-4 pt-6"
                    >
                        {/* Genre Grid */}
                        <section className="mb-8">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Film className="h-5 w-5 text-purple-500" />
                                Select Genres
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {genres.map(genre => (
                                    <motion.button
                                        key={genre.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleGenre(genre.id)}
                                        className={`relative overflow-hidden rounded-xl p-4 transition-all ${preferences.favoriteGenres.includes(genre.id)
                                                ? 'shadow-xl'
                                                : 'bg-[#1a1d29] border border-white/10'
                                            }`}
                                    >
                                        {preferences.favoriteGenres.includes(genre.id) && (
                                            <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-90`} />
                                        )}
                                        <div className="relative flex items-center gap-2">
                                            <span className="text-2xl">{genre.icon}</span>
                                            <span className={`font-medium text-sm ${preferences.favoriteGenres.includes(genre.id) ? 'text-white' : 'text-foreground'
                                                }`}>
                                                {genre.name}
                                            </span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </section>

                        {/* Rating Slider */}
                        <section className="mb-8">
                            <div className="bg-[#1a1d29] rounded-2xl p-5 border border-white/5">
                                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    Minimum Rating: {preferences.minRating}/10
                                </h2>
                                <input
                                    type="range"
                                    min="5"
                                    max="9"
                                    step="0.5"
                                    value={preferences.minRating}
                                    onChange={(e) => setPreferences(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                                    className="w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #ef4444 0%, #eab308 50%, #22c55e 100%)`
                                    }}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>⭐ 5.0</span>
                                    <span>⭐ 9.0</span>
                                </div>
                            </div>
                        </section>

                        {/* Year Range */}
                        <section className="mb-8">
                            <div className="bg-[#1a1d29] rounded-2xl p-5 border border-white/5">
                                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    Release Year: {preferences.yearRange.min} - {preferences.yearRange.max}
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">From: {preferences.yearRange.min}</label>
                                        <input
                                            type="range"
                                            min="2000"
                                            max="2024"
                                            value={preferences.yearRange.min}
                                            onChange={(e) => setPreferences(prev => ({
                                                ...prev,
                                                yearRange: { ...prev.yearRange, min: parseInt(e.target.value) }
                                            }))}
                                            className="w-full h-2 bg-blue-500/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">To: {preferences.yearRange.max}</label>
                                        <input
                                            type="range"
                                            min="2000"
                                            max="2024"
                                            value={preferences.yearRange.max}
                                            onChange={(e) => setPreferences(prev => ({
                                                ...prev,
                                                yearRange: { ...prev.yearRange, max: parseInt(e.target.value) }
                                            }))}
                                            className="w-full h-2 bg-blue-500/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="relative">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
                        <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-purple-500 animate-pulse" />
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {selectedMood && moodMovies.length > 0 ? (
                        <MovieRow title={`${moods.find(m => m.id === selectedMood)?.icon} ${moods.find(m => m.id === selectedMood)?.name}`} movies={moodMovies} />
                    ) : (
                        <>
                            {recommendedMovies.length > 0 && (
                                <MovieRow title="✨ Personalized For You" movies={recommendedMovies} />
                            )}
                            <MovieRow title="🔥 Trending Now" movies={trendingMovies} />
                            <MovieRow title="🇮🇳 Top Indian Picks" movies={indianMovies} />
                            {highRatedMovies.length > 0 && (
                                <MovieRow title="⭐ Highly Rated" movies={highRatedMovies} />
                            )}
                        </>
                    )}
                </div>
            )}

            <BottomNav />
        </div>
    );
}
