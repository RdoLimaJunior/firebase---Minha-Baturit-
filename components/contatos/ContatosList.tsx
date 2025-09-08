import React, { useMemo } from 'react';
import { useContatosUteis } from '../../hooks/useMockData';
import { ContatoUtil, CategoriaContato, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ContatosListProps {
  navigateTo: (view: View) => void;
}

const ContatoSkeletonItem: React.FC = () => (
    <Card className="!p-4 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 w-3/4">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
        </div>
    </Card>
);

const ContatoItem: React.FC<{ contato: ContatoUtil }> = ({ contato }) => {
    const handleCall = () => {
        window.location.href = `tel:${contato.telefone.replace(/\D/g, '')}`;
    };

    return (
        <Card className="!p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Icon name={contato.icon} className="text-3xl text-[var(--color-primary)]" />
                    <div>
                        <h3 className="font-bold text-slate-800">{contato.nome}</h3>
                        <p className="text-slate-600">{contato.telefone}</p>
                    </div>
                </div>
                <Button size="icon" variant="ghost" onClick={handleCall} className="!text-[var(--color-accent-green)] hover:!bg-[var(--color-accent-green)]/10" aria-label={`Ligar para ${contato.nome}`}>
                    <Icon name="call" />
                </Button>
            </div>
        </Card>
    );
};

const ContatosList: React.FC<ContatosListProps> = ({ navigateTo }) => {
  const { data: contatos, loading } = useContatosUteis();
  
  const groupedContatos = useMemo(() => {
    if (!contatos) return {};
    return contatos.reduce((acc, contato) => {
        (acc[contato.categoria] = acc[contato.categoria] || []).push(contato);
        return acc;
    }, {} as Record<CategoriaContato, ContatoUtil[]>);
  }, [contatos]);

  const categoryOrder: CategoriaContato[] = [
      CategoriaContato.EMERGENCIA,
      CategoriaContato.SAUDE,
      CategoriaContato.SERVICOS,
      CategoriaContato.OUTROS
  ];

  if (loading) {
      return (
          <div className="space-y-4">
              <div className="flex items-center space-x-2 animate-pulse">
                  <Button variant="ghost" size="icon" className="!bg-slate-200" disabled><Icon name="arrow_back" className="text-transparent" /></Button>
                  <div className="h-8 w-1/2 rounded bg-slate-200"></div>
              </div>
              <div className="space-y-6 pt-2">
                  {[...Array(2)].map((_, section) => (
                      <div key={section} className="space-y-3">
                          <div className="h-5 w-1/3 bg-slate-200 rounded mb-2 ml-1 animate-pulse"></div>
                          <ContatoSkeletonItem />
                          <ContatoSkeletonItem />
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon" aria-label="Voltar para o início">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Contatos Úteis</h2>
      </div>
      
      {groupedContatos ? (
        <div className="space-y-6">
          {categoryOrder.map(category => {
            if (groupedContatos[category]?.length > 0) {
              return (
                <section key={category} aria-labelledby={`category-title-${category}`}>
                  <h3 id={`category-title-${category}`} className="text-lg font-bold text-slate-700 mb-2 pl-1">{category}</h3>
                  <div className="space-y-3">
                    {groupedContatos[category].map(contato => (
                      <ContatoItem key={contato.id} contato={contato} />
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-slate-600">Nenhum contato encontrado.</p>
        </Card>
      )}
    </div>
  );
};

export default ContatosList;