import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Film, Search, Menu } from 'lucide-react';

export const Navbar = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-colors duration-300 ${isHome ? 'bg-black/50 backdrop-blur-md' : 'bg-background'
                }`}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 text-primary-foreground">
                    <Film className="h-6 w-6 text-blue-500" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        MoviePWA
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <Link to="/search" className="hover:text-white transition-colors">Movies</Link>
                    <Link to="/search" className="hover:text-white transition-colors">Series</Link>
                    <Link to="/profile" className="hover:text-white transition-colors">My List</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/search" className="p-2 text-gray-300 hover:text-white transition-colors">
                        <Search className="h-5 w-5" />
                    </Link>
                    <button className="md:hidden p-2 text-gray-300 hover:text-white transition-colors">
                        <Menu className="h-5 w-5" />
                    </button>
                    <Link to="/profile">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-tr from-blue-500 to-purple-500">
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};
