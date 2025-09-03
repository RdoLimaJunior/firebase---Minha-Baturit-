import { useState, useEffect } from 'react';
import { mapWeatherCodeToIcon } from '../utils/helpers';

export interface WeatherData {
  temperature: number;
  condition: string;
  weatherCode: string; // Keep the original code for logic
  icon: string;
  color: string;
}

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async (url: string) => {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather API response not ok');
            const data = await response.json();
            const current = data.current_condition[0];
            const { icon, color } = mapWeatherCodeToIcon(current.weatherCode);
            setWeather({
              temperature: parseInt(current.temp_C, 10),
              condition: current.lang_pt[0].value,
              weatherCode: current.weatherCode,
              icon,
              color,
            });
          } catch (err) {
            console.error("Failed to fetch weather:", err);
            setWeather(null); // Set to null on error
          } finally {
            setIsLoading(false);
          }
        };

        const getWeatherData = () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(`https://wttr.in/${latitude},${longitude}?format=j1&lang=pt`);
              },
              (geoError) => {
                console.warn(`Geolocation failed: ${geoError.message}. Falling back to city.`);
                fetchWeather('https://wttr.in/Baturite?format=j1&lang=pt');
              },
              { timeout: 10000 }
            );
          } else {
            console.warn('Geolocation not supported. Falling back to city.');
            fetchWeather('https://wttr.in/Baturite?format=j1&lang=pt');
          }
        };

        getWeatherData();
    }, []);

    return { weather, isLoading };
}
