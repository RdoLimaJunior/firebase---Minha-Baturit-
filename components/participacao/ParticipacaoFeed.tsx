import React, { useState, useMemo } from 'react';
import { usePublicacoes } from '../../hooks/useMockData';
import { View, Publicacao, TipoPublicacao } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import PublicacaoCard from './PublicacaoCard';

interface ParticipacaoFeedProps {
  navigateTo: (view: View, params?: { publicacaoId?: string }) => void;
}

const SkeletonCard: React.FC = () => (
    <Card className="!p-0 animate-pulse">
        <div className="w-full h-40 bg-slate-200"></div>
        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <div className="w-2/3 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-5 bg-slate-200 rounded w-full"></div>
                </div>
                <div className="h-6 w-1/4 bg-slate-200 rounded-full"></div>
            </div>
            <div className="space-y-2 my-4">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-100">
                <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                <div className="flex space-x-4">
                    <div className="h-4 w-12 bg-slate-200 rounded"></div>
                    <div className="h-4 w-12 bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    </Card>
);

const ParticipacaoFeed: React.FC<ParticipacaoFeedProps> = ({ navigateTo }) => {
  const { data: publicacoes, loading } = usePublicacoes();
  const [filtroTipo, setFiltroTipo] = useState<TipoPublicacao | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'relevancia' | 'recentes'>('relevancia');

  const filteredAndSortedPublicacoes = useMemo(() => {
    if (!publicacoes) return [];

    let items = [...publicacoes];

    if (filtroTipo !== 'Todos') {
      items = items.filter(p => p.tipo === filtroTipo);
    }

    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase();
      items = items.filter(p => 
        p.title.toLowerCase().includes(lowercasedTerm) ||
        p.resumo.toLowerCase().includes(lowercasedTerm) ||
        p.bairro.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (sortBy === 'recentes') {
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else { // Relevância (apoios + recência)
        items.sort((a, b) => {
            const scoreA = a.counts.supports + (new Date(a.createdAt).getTime() / 1e11);
            const scoreB = b.counts.supports + (new Date(b.createdAt).getTime() / 1e11);
            return scoreB - scoreA;
        });
    }

    return items;
  }, [publicacoes, filtroTipo, searchTerm, sortBy]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    if (filteredAndSortedPublicacoes.length === 0) {
      return (
        <Card className="text-center py-10">
          <Icon name="forum" className="text-5xl text-slate-400 mx-auto" />
          <p className="text-slate-700 mt-4 font-semibold">Ainda sem publicações</p>
          <p className="text-slate-600 text-sm mt-1">Seja o primeiro a participar e compartilhar suas ideias!</p>
          <Button onClick={() => navigateTo('PARTICIPACAO_FORM')} className="mt-6" iconLeft="add_comment">Criar Publicação</Button>
        </Card>
      );
    }
    return (
      <div className="space-y-4">
        {filteredAndSortedPublicacoes.map(pub => (
          <PublicacaoCard 
            key={pub.id} 
            publicacao={pub} 
            onClick={() => navigateTo('PARTICIPACAO_DETAIL', { publicacaoId: pub.id })}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Participação Pública</h1>
            <p className="text-slate-600 mt-1">Um espaço para ideias, problemas e elogios da nossa comunidade.</p>
        </div>
      
        <div className="sticky top-[68px] bg-gray-50 z-10 py-2 space-y-3">
             <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por título, resumo ou bairro..."
                    className="w-full p-3 pl-10 bg-white text-slate-900 border border-slate-300 rounded-full focus:ring-indigo-600 focus:border-indigo-600 text-sm"
                />
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <Button size="sm" onClick={() => setFiltroTipo('Todos')} variant={filtroTipo === 'Todos' ? 'primary' : 'secondary'} className="!rounded-full whitespace-nowrap">Todos</Button>
                    {Object.values(TipoPublicacao).map(tipo => (
                         <Button key={tipo} size="sm" onClick={() => setFiltroTipo(tipo)} variant={filtroTipo === tipo ? 'primary' : 'secondary'} className="!rounded-full whitespace-nowrap">{tipo}</Button>
                    ))}
                </div>
                <div className="p-1 bg-slate-200 rounded-lg flex text-sm">
                    <button
                        onClick={() => setSortBy('relevancia')}
                        className={`px-3 py-1 rounded-md transition-colors ${sortBy === 'relevancia' ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-600'}`}
                    >
                        Relevantes
                    </button>
                    <button
                        onClick={() => setSortBy('recentes')}
                        className={`px-3 py-1 rounded-md transition-colors ${sortBy === 'recentes' ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-600'}`}
                    >
                        Recentes
                    </button>
                </div>
            </div>
        </div>

        {renderContent()}

        <div className="fixed bottom-20 right-4 z-20">
             <Button
                onClick={() => navigateTo('PARTICIPACAO_FORM')}
                size="lg"
                className="!rounded-full !p-4 shadow-lg"
                aria-label="Criar nova publicação"
            >
                <Icon name="add" className="text-3xl" />
            </Button>
        </div>
    </div>
  );
};

export default ParticipacaoFeed;