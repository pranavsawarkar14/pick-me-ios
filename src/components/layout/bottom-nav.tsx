import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, Bookmark, User } from 'lucide-react';

export const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/suggestions', icon: Sparkles, label: 'Suggestions' },
        { path: '/watchlist', icon: Bookmark, label: 'Watchlist' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe backdrop-blur-xl">
            <div className="flex items-center justify-around h-16 px-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center gap-1 flex-1"
                        >
                            <item.icon
                                className={`h-6 w-6 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'
                                    }`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span
                                className={`text-xs transition-colors ${isActive ? 'text-primary font-medium' : 'text-gray-400'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
