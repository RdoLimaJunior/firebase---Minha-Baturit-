import React from 'react';
import { useTurismoItemById } from '../../hooks/useMockData';
import { View, TurismoCategoria } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface TurismoDetailProps {
  turismoId: string;
  categoria: TurismoCategoria;
  navigateTo: (view: View, params?: any) => void;
}

const TurismoDetail: React.FC<TurismoDetailProps> = ({ turismoId, categoria, navigateTo }) => {
  const { data: item, loading } = useTurismoItemById(turismoId);

  if (loading) return <Spinner />;
  if (!item) return <Card><p>Item não encontrado.</p></Card>;
  
  const handleVerNoMapa = () => {
      navigateTo('MAPA_SERVICOS', { turismoId: item.id });
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => navigateTo('TURISMO_LIST', { turismoCategoria: categoria })} variant="ghost" iconLeft="arrow_back">
        Voltar para {categoria}
      </Button>

      <Card className="!p-0">
        <img 
          src={item.imagens[0]} 
          alt={`Foto principal de ${item.nome}`}
          className="w-full h-64 object-cover" 
        />
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">{item.nome}</h2>
          <p className="text-slate-700 leading-relaxed">{item.descricao}</p>
          
          <div className="pt-4 border-t border-slate-200 space-y-3">
             <div className="flex items-start space-x-3 text-slate-700">
                <Icon name="location_on" className="text-xl text-slate-400 mt-0.5" />
                <span className="text-sm">{item.endereco}</span>
            </div>
            {item.contato && (
                <div className="flex items-start space-x-3 text-slate-700">
                    <Icon name="phone" className="text-xl text-slate-400 mt-0.5" />
                    <span className="text-sm">{item.contato}</span>
                </div>
            )}
            {item.site && (
                 <div className="flex items-start space-x-3 text-slate-700">
                    <Icon name="language" className="text-xl text-slate-400 mt-0.5" />
                    <a href={item.site} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-primary)] hover:underline">{item.site}</a>
                </div>
            )}
          </div>

           <div className="pt-4 mt-4 border-t border-slate-200 flex items-center flex-wrap gap-3">
                <Button
                    iconLeft="map"
                    onClick={handleVerNoMapa}
                    variant="primary"
                >
                    Ver no mapa
                </Button>
                {item.contato && (
                    <Button
                        iconLeft="call"
                        onClick={() => window.open(`tel:${item.contato?.replace(/\D/g, '')}`)}
                        variant="secondary"
                    >
                        Ligar
                    </Button>
                )}
           </div>
        </div>
      </Card>

      {item.imagens.length > 1 && (
        <Card>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Galeria de Fotos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {item.imagens.slice(1).map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Foto ${index + 2} de ${item.nome}`}
                className="rounded-lg w-full h-32 object-cover"
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TurismoDetail;