import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { getPersonDetails, getPersonCredits, getImageUrl, Movie } from '@/lib/api';
import { MovieCard } from '@/components/ui/movie-card';

interface Person {
    id: number;
    name: string;
    biography: string;
    birthday: string;
    place_of_birth: string;
    profile_path: string;
}

export default function ActorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState<Person | null>(null);
    const [credits, setCredits] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [personData, creditsData] = await Promise.all([
                    getPersonDetails(Number(id)),
                    getPersonCredits(Number(id))
                ]);
                setPerson(personData);
                setCredits(creditsData);
            } catch (error) {
                console.error('Failed to fetch person details:', error);
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

    if (!person) return null;

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="relative">
                <div className="absolute top-0 left-0 p-4 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full bg-black/40 p-2 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-20">
                <div className="flex flex-col md:flex-row gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-shrink-0 mx-auto md:mx-0"
                    >
                        <div className="w-48 h-72 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10">
                            <img
                                src={getImageUrl(person.profile_path)}
                                alt={person.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </motion.div>

                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-bold text-foreground mb-4 text-center md:text-left"
                        >
                            {person.name}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground mb-6"
                        >
                            {person.birthday && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(person.birthday).toLocaleDateString()}</span>
                                </div>
                            )}
                            {person.place_of_birth && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{person.place_of_birth}</span>
                                </div>
                            )}
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-muted-foreground leading-relaxed mb-8 line-clamp-6 hover:line-clamp-none transition-all cursor-pointer"
                        >
                            {person.biography || "No biography available."}
                        </motion.p>
                    </div>
                </div>

                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Known For</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {credits.map((movie, index) => (
                            <MovieCard key={movie.id} movie={movie} index={index} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
