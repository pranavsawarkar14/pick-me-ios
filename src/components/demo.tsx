import { RadialIntro } from "@/components/ui/radial-intro";

// Using Unsplash images as requested
const ITEMS = [
    {
        id: 1,
        name: 'Action',
        src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop',
    },
    {
        id: 2,
        name: 'Drama',
        src: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop',
    },
    {
        id: 3,
        name: 'Sci-Fi',
        src: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=400&h=400&fit=crop',
    },
    {
        id: 4,
        name: 'Comedy',
        src: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop',
    },
    {
        id: 5,
        name: 'Horror',
        src: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=400&h=400&fit=crop',
    },
];

export default function DemoOne() {
    return (
        <div className="flex items-center justify-center h-[500px] w-full bg-black/5 rounded-xl overflow-hidden">
            <RadialIntro orbitItems={ITEMS} />
        </div>
    );
}
