import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Movie, getImageUrl } from '@/lib/api';

interface FeaturedCarouselProps {
    movies: Movie[];
}

export const FeaturedCarousel = ({ movies }: FeaturedCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [movies.length]);

    if (movies.length === 0) return null;

    return (
        <div className="relative h-[280px] w-full overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Link to={`/movie/${movies[currentIndex].id}`}>
                        <img
                            src={getImageUrl(movies[currentIndex].backdrop_path, 'original')}
                            alt={movies[currentIndex].title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <p className="text-xs text-gray-300 mb-1">Featured Movie</p>
                            <h2 className="text-2xl font-bold text-white">
                                {movies[currentIndex].title}
                            </h2>
                        </div>
                    </Link>
                </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {movies.slice(0, 5).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${index === currentIndex
                                ? 'w-6 bg-primary'
                                : 'w-1.5 bg-white/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
