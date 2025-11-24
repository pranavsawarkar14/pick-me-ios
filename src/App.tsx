import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'motion/react';
import { RadialIntro } from '@/components/ui/radial-intro';
import { ThemeProvider } from '@/components/theme-provider';
import Home from '@/pages/home';
import MovieDetail from '@/pages/movie-detail';
import ActorDetail from '@/pages/actor-detail';
import Search from '@/pages/search';
import Watchlist from '@/pages/watchlist';
import Suggestions from '@/pages/suggestions';
import Profile from '@/pages/profile';

// Extend Window interface for Clerk
declare global {
    interface Window {
        Clerk?: any;
    }
}

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Clerk Publishable Key');
}

// Intro items
const INTRO_ITEMS = [
    { id: 1, name: 'Action', src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop' },
    { id: 2, name: 'Drama', src: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop' },
    { id: 3, name: 'Sci-Fi', src: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=400&h=400&fit=crop' },
    { id: 4, name: 'Comedy', src: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop' },
    { id: 5, name: 'Horror', src: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=400&h=400&fit=crop' },
];

function AppContent() {
    const [showIntro, setShowIntro] = useState(true);
    const [isClerkLoaded, setIsClerkLoaded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowIntro(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Ensure Clerk is loaded (important for iOS)
        const checkClerk = setInterval(() => {
            if (window.Clerk) {
                setIsClerkLoaded(true);
                clearInterval(checkClerk);
            }
        }, 100);

        // Timeout after 5 seconds
        const timeout = setTimeout(() => {
            setIsClerkLoaded(true);
            clearInterval(checkClerk);
        }, 5000);

        return () => {
            clearInterval(checkClerk);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <AnimatePresence mode="wait">
                {showIntro ? (
                    <motion.div
                        key="intro"
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                    >
                        <RadialIntro orbitItems={INTRO_ITEMS} />
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-20 text-2xl font-bold tracking-widest text-white/50"
                        >
                            PICK ME
                        </motion.h1>
                    </motion.div>
                ) : !isClerkLoaded ? (
                    <div className="flex h-screen items-center justify-center bg-background">
                        <div className="text-center">
                            <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SignedIn>
                            <Routes location={location} key={location.pathname}>
                                <Route path="/" element={<Home />} />
                                <Route path="/movie/:id" element={<MovieDetail />} />
                                <Route path="/actor/:id" element={<ActorDetail />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/watchlist" element={<Watchlist />} />
                                <Route path="/suggestions" element={<Suggestions />} />
                                <Route path="/profile" element={<Profile />} />
                            </Routes>
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function App() {
    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            appearance={{
                elements: {
                    formFieldInput: 'rounded-lg bg-[#1a1d29] border-white/10 text-foreground',
                    formButtonPrimary: 'bg-primary hover:bg-primary/90',
                    card: 'bg-[#0f1014] border border-white/10',
                    headerTitle: 'text-foreground',
                    headerSubtitle: 'text-muted-foreground',
                    socialButtonsBlockButton: 'bg-[#1a1d29] border-white/10 text-foreground hover:bg-[#1f2230]',
                    formFieldLabel: 'text-foreground',
                    footerActionLink: 'text-primary hover:text-primary/90',
                },
                layout: {
                    socialButtonsPlacement: 'bottom',
                    socialButtonsVariant: 'iconButton',
                },
            }}
        >
            <ThemeProvider defaultTheme="dark" storageKey="movie-pwa-theme">
                <Router>
                    <AppContent />
                </Router>
            </ThemeProvider>
        </ClerkProvider>
    );
}
