import React from 'react';
import Icon from '../ui/Icon';
import { useWeather } from '../../hooks/useWeather';

const WeatherWidget: React.FC = () => {
  const { weather, isLoading } = useWeather();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 animate-pulse" aria-label="Carregando clima">
        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
        <div className="text-right space-y-1">
          <div className="h-5 w-12 bg-slate-200 rounded"></div>
          <div className="h-3 w-16 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center space-x-2 text-slate-700">
        <Icon name={'thermostat'} className={`text-3xl text-slate-600`} />
        <div className="text-right">
          <p className="font-bold text-xl">--°C</p>
          <p className="text-xs text-slate-500">Indisponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-slate-700">
      <Icon name={weather.icon} className={`text-3xl ${weather.color}`} />
      <div className="text-right">
        <p className="font-bold text-xl">{weather.temperature}°C</p>
        <p className="text-xs text-slate-500">{weather.condition}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;