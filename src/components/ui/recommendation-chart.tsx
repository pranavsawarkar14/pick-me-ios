import { motion } from 'motion/react';

interface RecommendationChartProps {
    voteAverage: number;
}

export const RecommendationChart = ({ voteAverage }: RecommendationChartProps) => {
    const percentage = (voteAverage / 10) * 100;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let color = 'text-red-500';
    let text = 'Avoid';

    if (percentage >= 75) {
        color = 'text-green-500';
        text = 'Must Watch';
    } else if (percentage >= 60) {
        color = 'text-yellow-500';
        text = 'Good Watch';
    } else if (percentage >= 40) {
        color = 'text-orange-500';
        text = 'Timepass';
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                    />
                    <motion.circle
                        className={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-2xl font-bold ${color}`}>{Math.round(percentage)}%</span>
                </div>
            </div>
            <span className={`mt-2 font-bold ${color}`}>{text}</span>
        </div>
    );
};
