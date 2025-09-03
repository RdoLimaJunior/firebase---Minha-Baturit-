import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { generateDynamicGreeting } from '../../utils/greetings';

interface DynamicGreetingProps {
    userName: string;
}

const DynamicGreeting: React.FC<DynamicGreetingProps> = ({ userName }) => {
    const { weather, isLoading } = useWeather();

    const greeting = React.useMemo(() => {
        // We generate the greeting even if weather is loading, it will just fallback to general suggestions.
        // It will re-calculate once weather data arrives.
        return generateDynamicGreeting(userName, weather);
    }, [userName, weather]);

    if (isLoading && !greeting.subtitle) {
        return (
            <div className="animate-pulse">
                <div className="h-7 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800">{greeting.title}</h1>
            <p className="text-slate-600">{greeting.subtitle}</p>
        </div>
    );
};

export default DynamicGreeting;