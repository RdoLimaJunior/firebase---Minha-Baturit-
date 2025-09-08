import React, { useState, useMemo } from 'react';
import { View, Protocolo, Noticia, TurismoItem, ServicoOnline } from '../../types';
import { useProtocolos, useNoticias, useTurismoItens, useServicosOnline } from '../../hooks/useMockData';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface SearchProps {
  navigateTo: (view: View, params?: any) => void;
}

const ResultSkeletonItem: React.FC = () => (
    <div className="p-4 flex items-center space-x-4 animate-pulse">
        <div className="w-6 h-6 rounded bg-slate-200"></div>
        <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
            <div className="h-2 w-full bg-slate-200 rounded"></div>
        </div>
    </div>
);

const ResultItem: React.FC<{ icon: string, title: string, subtitle: string, onClick: () => void }> = ({ icon, title, subtitle, onClick }) => (
    <div onClick={onClick} className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-slate-100 rounded-lg">
        <Icon name={icon} className="text-2xl text-slate-500" />
        <div>
            <h4 className="font-semibold text-slate-800">{title}</h4>
            <p className="text-sm text-slate-600 truncate">{subtitle}</p>
        </div>
    </div>
);

const Search: React.FC<SearchProps> = ({ navigateTo }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: protocolos, loading: loadingProtocolos } = useProtocolos();
    const { data: noticias, loading: loadingNoticias } = useNoticias();
    const { data: turismoItens, loading: loadingTurismo } = useTurismoItens();
    const { data: servicos, loading: loadingServicos } = useServicosOnline();

    const isLoading = loadingProtocolos || loadingNoticias || loadingTurismo || loadingServicos;

    const searchResults = useMemo(() => {
        if (searchTerm.trim().length < 3) {
            return null;
        }
        const query = searchTerm.toLowerCase();

        const foundProtocolos = protocolos?.filter(p =>
            p.protocolo.includes(query) ||
            p.descricao.toLowerCase().includes(query) ||
            p.tipo.toLowerCase().includes(query) ||
            p.categoria?.toLowerCase().includes(query)
        ) || [];

        const foundNoticias = noticias?.filter(n =>
            n.title.toLowerCase().includes(query) ||
            n.summary.toLowerCase().includes(query)
        ) || [];
        
        const foundTurismo = turismoItens?.filter(t =>
            t.nome.toLowerCase().includes(query) ||
            t.descricao.toLowerCase().includes(query) ||
            t.descricaoCurta.toLowerCase().includes(query)
        ) || [];

        const foundServicos = servicos?.filter(s =>
            s.nome.toLowerCase().includes(query) ||
            s.descricao.toLowerCase().includes(query)
        ) || [];

        return { protocolos: foundProtocolos, noticias: foundNoticias, turismo: foundTurismo, servicos: foundServicos };
    }, [searchTerm, protocolos, noticias, turismoItens, servicos]);
    
    const totalResults = searchResults 
        ? searchResults.protocolos.length + searchResults.noticias.length + searchResults.turismo.length + searchResults.servicos.length
        : 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Button onClick={() => navigateTo('DASHBOARD')} variant="ghost" size="icon" aria-label="Voltar para o início">
                    <Icon name="arrow_back" />
                </Button>
                <h2 className="text-2xl font-bold text-slate-800">Busca Global</h2>
            </div>

            <div className="sticky top-[70px] bg-gray-50 py-2 z-5">
                <div className="relative">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar em protocolos, notícias, etc."
                        className="w-full p-4 pl-12 bg-white text-slate-900 border border-slate-300 rounded-full focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-base"
                        autoFocus
                    />
                </div>
            </div>

            {isLoading && (
                <Card>
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <section key={i}>
                                <div className="h-6 w-1/4 bg-slate-100 rounded-md my-2 animate-pulse"></div>
                                <ResultSkeletonItem />
                                <ResultSkeletonItem />
                            </section>
                        ))}
                    </div>
                </Card>
            )}

            {!isLoading && searchResults && (
                <Card>
                    <h3 className="font-bold text-slate-800 mb-2 px-4">
                        {totalResults} {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </h3>
                    {searchResults.protocolos.length > 0 && (
                        <section>
                            <h4 className="font-semibold text-sm text-slate-500 bg-slate-100 p-2 rounded-md my-2">Protocolos</h4>
                            {searchResults.protocolos.map(p => (
                                <ResultItem 
                                    key={`p-${p.id}`}
                                    icon="list_alt"
                                    title={`${p.tipo} - ${p.protocolo}`}
                                    subtitle={p.descricao}
                                    onClick={() => navigateTo('PROTOCOLO_DETAIL', { protocoloId: p.id })}
                                />
                            ))}
                        </section>
                    )}
                    {searchResults.noticias.length > 0 && (
                        <section>
                            <h4 className="font-semibold text-sm text-slate-500 bg-slate-100 p-2 rounded-md my-2">Notícias</h4>
                            {searchResults.noticias.map(n => (
                                <ResultItem 
                                    key={`n-${n.id}`}
                                    icon="feed"
                                    title={n.title}
                                    subtitle={n.summary}
                                    onClick={() => navigateTo('NOTICIA_DETAIL', { noticiaId: n.id })}
                                />
                            ))}
                        </section>
                    )}
                    {searchResults.turismo.length > 0 && (
                        <section>
                            <h4 className="font-semibold text-sm text-slate-500 bg-slate-100 p-2 rounded-md my-2">Turismo</h4>
                            {searchResults.turismo.map(t => (
                                <ResultItem 
                                    key={`t-${t.id}`}
                                    icon="tour"
                                    title={t.nome}
                                    subtitle={t.descricaoCurta}
                                    onClick={() => navigateTo('TURISMO_DETAIL', { turismoId: t.id, turismoCategoria: t.categoria })}
                                />
                            ))}
                        </section>
                    )}
                    {searchResults.servicos.length > 0 && (
                        <section>
                            <h4 className="font-semibold text-sm text-slate-500 bg-slate-100 p-2 rounded-md my-2">Serviços Online</h4>
                            {searchResults.servicos.map(s => (
                                <ResultItem 
                                    key={`s-${s.id}`}
                                    icon="apps"
                                    title={s.nome}
                                    subtitle={s.descricao}
                                    onClick={() => navigateTo('SERVICO_FORM', { servicoId: s.id })}
                                />
                            ))}
                        </section>
                    )}
                </Card>
            )}

            {!isLoading && !searchResults && (
                <Card className="text-center py-10">
                    <Icon name="search" className="text-5xl text-slate-400 mx-auto" />
                    <p className="text-slate-600 mt-4">Digite pelo menos 3 caracteres para iniciar a busca.</p>
                </Card>
            )}

            {!isLoading && searchResults && totalResults === 0 && (
                 <Card className="text-center py-10">
                    <Icon name="search_off" className="text-5xl text-slate-400 mx-auto" />
                    <p className="text-slate-600 mt-4">Nenhum resultado encontrado para "<span className="font-semibold">{searchTerm}</span>".</p>
                    <p className="text-sm text-slate-500 mt-2">Tente usar palavras-chave diferentes.</p>
                </Card>
            )}
        </div>
    );
};

export default Search;