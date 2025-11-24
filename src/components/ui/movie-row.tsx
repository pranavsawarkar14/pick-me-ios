import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Movie, getImageUrl } from '@/lib/api';

interface MovieRowProps {
    title: string;
    movies: Movie[];
}

export const MovieRow = ({ title, movies }: MovieRowProps) => {
    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
                <button className="text-sm text-primary">See All</button>
            </div>

            <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {movies.map((movie, index) => (
                    <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="flex-shrink-0 w-[140px]"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5">
                                <img
                                    src={getImageUrl(movie.poster_path)}
                                    alt={movie.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
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
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
