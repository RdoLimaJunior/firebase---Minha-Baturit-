import React from 'react';
import { View, TurismoCategoria } from '../../types';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface TurismoDashboardProps {
  navigateTo: (view: View, params?: { turismoCategoria?: TurismoCategoria }) => void;
}

const CATEGORIAS_TURISMO: { id: TurismoCategoria; title: string; icon: string; description: string; color: string; }[] = [
    { id: 'Pontos Turísticos', title: 'Pontos Turísticos', icon: 'account_balance', description: 'Monumentos e história', color: 'bg-[var(--color-accent-yellow)]' },
    { id: 'Gastronomia', title: 'Gastronomia', icon: 'restaurant', description: 'Sabores da serra', color: 'bg-[var(--color-accent-red)]' },
    { id: 'Hospedagem', title: 'Hospedagem', icon: 'hotel', description: 'Encontre seu refúgio', color: 'bg-[var(--color-primary)]' },
    { id: 'Lazer e Entretenimento', title: 'Lazer e Entretenimento', icon: 'local_activity', description: 'Aventura e diversão', color: 'bg-[var(--color-accent-green)]' },
    { id: 'Cultura', title: 'Cultura', icon: 'theater_comedy', description: 'Espaços e eventos', color: 'bg-[var(--color-accent-pink)]' },
];

const TurismoDashboard: React.FC<TurismoDashboardProps> = ({ navigateTo }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Cultura e Turismo em Baturité</h2>
      </div>
      <p className="text-slate-600">
        Explore os encantos da serra. Descubra lugares incríveis, sabores autênticos e a hospitalidade de Baturité.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {CATEGORIAS_TURISMO.map(cat => (
          <Card 
            key={cat.id} 
            onClick={() => navigateTo('TURISMO_LIST', { turismoCategoria: cat.id })}
            className="text-center flex flex-col items-center justify-center space-y-2 !p-6"
          >
            <div className={`${cat.color} p-4 rounded-full`}>
              <Icon name={cat.icon} className="text-white text-4xl" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{cat.title}</h3>
            <p className="text-sm text-slate-600">{cat.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TurismoDashboard;