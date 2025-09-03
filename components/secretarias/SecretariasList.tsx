import React from 'react';
import { useSecretarias } from '../../hooks/useMockData';
import { Secretaria, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface SecretariasListProps {
  navigateTo: (view: View) => void;
}

const SecretariaSkeletonItem: React.FC = () => (
    <Card className="animate-pulse">
        <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 mb-4"></div>
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="space-y-2 w-1/2">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-2 w-2/3 mx-auto bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="mt-6 w-full text-left space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    </Card>
);

const SecretariaItem: React.FC<{ secretaria: Secretaria }> = ({ secretaria }) => (
  <Card className="flex flex-col items-center text-center">
    <img 
      src={secretaria.avatarUrl} 
      alt={`Foto de ${secretaria.secretario}`}
      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-slate-100 dark:border-slate-700 shadow-md"
      referrerPolicy="no-referrer"
    />
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{secretaria.nome}</h3>
    <div className="mt-2">
        <p className="text-md font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center space-x-1">
            <span>{secretaria.secretario}</span>
            <Icon name="check_circle" className="text-green-500 text-base" />
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{secretaria.cargo}</p>
    </div>
    
    <div className="mt-6 w-full text-left space-y-3">
        <div className="flex items-start space-x-3 text-slate-700 dark:text-slate-200">
            <Icon name="email" className="text-xl text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="text-sm">{secretaria.email}</span>
        </div>
        <div className="flex items-start space-x-3 text-slate-700 dark:text-slate-200">
            <Icon name="phone" className="text-xl text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="text-sm">{secretaria.telefone}</span>
        </div>
        <div className="flex items-start space-x-3 text-slate-700 dark:text-slate-200">
            <Icon name="schedule" className="text-xl text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="text-sm">{secretaria.horario}</span>
        </div>
        <div className="flex items-start space-x-3 text-slate-700 dark:text-slate-200">
            <Icon name="location_on" className="text-xl text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="text-sm">{secretaria.endereco}</span>
        </div>
    </div>

    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 w-full flex flex-wrap gap-2 justify-center">
      {secretaria.link && (
          <a 
            href={secretaria.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center px-2.5 py-1.5 text-sm rounded-lg font-semibold transition-colors bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
              Mais informações
          </a>
      )}
      <Button 
        size="sm" 
        variant="secondary"
        iconLeft="map"
        onClick={(e) => {
            e.stopPropagation();
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(secretaria.endereco)}`, '_blank');
        }}
    >
        Ver no Mapa
    </Button>
    </div>
  </Card>
);

const SecretariasList: React.FC<SecretariasListProps> = ({ navigateTo }) => {
  const { data: secretarias, loading } = useSecretarias();

  if (loading) {
      return (
          <div className="space-y-4">
              <div className="flex items-center space-x-2 animate-pulse">
                  <Button variant="ghost" size="icon" className="!bg-slate-200 dark:!bg-slate-700" disabled><Icon name="arrow_back" className="text-transparent" /></Button>
                  <div className="h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div className="space-y-4 pt-2">
                  <SecretariaSkeletonItem />
                  <SecretariaSkeletonItem />
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Secretarias</h2>
      </div>
      
      {secretarias && secretarias.length > 0 ? (
        <div className="space-y-4">
          {secretarias.map(sec => (
            <SecretariaItem key={sec.id} secretaria={sec} />
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Nenhuma secretaria encontrada.</p>
        </Card>
      )}
    </div>
  );
};

export default SecretariasList;