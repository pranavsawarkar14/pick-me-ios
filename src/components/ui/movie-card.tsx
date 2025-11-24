import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie, getImageUrl } from '@/lib/api';

interface MovieCardProps {
    movie: Movie;
    index: number;
}

export const MovieCard = ({ movie, index }: MovieCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative aspect-[2/3] overflow-hidden rounded-xl bg-card shadow-lg cursor-pointer"
        >
            <Link to={`/movie/${movie.id}`}>
                <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-bold leading-tight">{movie.title}</h3>
                        <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-yellow-400">
                                <Star className="h-4 w-4 fill-current" />
                                {movie.vote_average.toFixed(1)}
                            </span>
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                        </div>
                        <p className="mt-2 line-clamp-3 text-xs text-gray-300">
                            {movie.overview}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
