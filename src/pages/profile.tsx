import { Settings, Heart, Clock, ChevronRight, LogOut, Moon, Sun, User as UserIcon, Bell, Shield, HelpCircle, Info } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useTheme } from '@/components/theme-provider';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Movie } from '@/lib/api';

export default function Profile() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { theme, setTheme } = useTheme();
    const [watchlistCount, setWatchlistCount] = useState(0);

    useEffect(() => {
        const watchlist: Movie[] = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setWatchlistCount(watchlist.length);
    }, []);

    const handleSignOut = async () => {
        await signOut();
    };

    const stats = [
        {
            icon: Heart,
            value: watchlistCount,
            label: 'Watchlist',
            color: 'from-red-500 to-pink-500',
            bgColor: 'bg-red-500/10'
        },
        {
            icon: Clock,
            value: '128h',
            label: 'Watched',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10'
        },
    ];

    const settingsSections = [
        {
            title: 'Preferences',
            items: [
                {
                    icon: theme === 'dark' ? Moon : Sun,
                    label: theme === 'dark' ? 'Dark Mode' : 'Light Mode',
                    color: 'text-purple-500',
                    action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
                    showToggle: true
                },
                {
                    icon: Bell,
                    label: 'Notifications',
                    color: 'text-yellow-500',
                    badge: '3'
                },
            ]
        },
        {
            title: 'Account',
            items: [
                { icon: UserIcon, label: 'Edit Profile', color: 'text-blue-500' },
                { icon: Shield, label: 'Privacy & Security', color: 'text-green-500' },
                { icon: Settings, label: 'App Settings', color: 'text-indigo-500' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help Center', color: 'text-cyan-500' },
                { icon: Info, label: 'About Pick Me', color: 'text-gray-500' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 pb-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

                <div className="relative px-4 pt-6 pb-4">
                    <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
                    <p className="text-white/80 text-sm">Manage your account</p>
                </div>
            </div>

            {/* Profile Card - Overlapping */}
            <div className="px-4 -mt-16 relative z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-card rounded-3xl p-6 shadow-2xl border border-border"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-white dark:border-purple-500 shadow-lg">
                                <img
                                    src={user?.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop'}
                                    alt="User"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-card" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-foreground">
                                {user?.fullName || user?.username || 'User'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {user?.primaryEmailAddress?.emailAddress || 'Premium Member'}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative overflow-hidden rounded-2xl p-4 ${stat.bgColor} border border-border`}
                            >
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-10 -mt-10`} />
                                <div className="relative">
                                    <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-2`}>
                                        <stat.icon className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Settings Sections */}
            <div className="px-4 pt-6 space-y-6">
                {settingsSections.map((section, sectionIndex) => (
                    <motion.div
                        key={section.title}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + sectionIndex * 0.1 }}
                    >
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            {section.title}
                        </h3>
                        <div className="bg-card rounded-2xl border border-border overflow-hidden">
                            {section.items.map((item, index) => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className={`flex w-full items-center justify-between p-4 transition-colors hover:bg-accent ${index !== section.items.length - 1 ? 'border-b border-border' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl bg-${item.color.split('-')[1]}-500/10`}>
                                            <item.icon className={`h-5 w-5 ${item.color}`} />
                                        </div>
                                        <span className="font-medium text-foreground">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.badge && (
                                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                        {item.showToggle ? (
                                            <div className={`w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-purple-500' : 'bg-gray-300'
                                                } relative`}>
                                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                                                    }`} />
                                            </div>
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* Sign Out Button */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-semibold hover:bg-red-500/20 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </motion.button>

                {/* App Version */}
                <p className="text-center text-xs text-muted-foreground py-4">
                    Pick Me v1.0.0
                </p>
            </div>

            <BottomNav />
        </div>
    );
}
