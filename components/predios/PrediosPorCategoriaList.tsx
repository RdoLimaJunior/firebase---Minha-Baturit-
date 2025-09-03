import React, { useState, useMemo, useEffect } from 'react';
import { usePrediosPublicos } from '../../hooks/useMockData';
import { View, PredioPublico, CategoriaPredioPublico } from '../../types';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { haversineDistance } from '../../utils/helpers';

const CATEGORY_DETAILS: Record<CategoriaPredioPublico, { icon: string; color: string; bgColor: string }> = {
    'Saúde': { icon: 'local_hospital', color: 'text-rose-700', bgColor: 'bg-rose-100' },
    'Educação': { icon: 'school', color: 'text-sky-700', bgColor: 'bg-sky-100' },
    'Assistência Social': { icon: 'people', color: 'text-violet-700', bgColor: 'bg-violet-100' },
    'Administração': { icon: 'corporate_fare', color: 'text-slate-700', bgColor: 'bg-slate-200' }
};

type FilterType = 'todos' | 'abertos' | 'proximos';

interface PrediosPorCategoriaListProps {
  navigateTo: (view: View, params?: any) => void;
  categoria: CategoriaPredioPublico;
  titulo: string;
  icon: string;
  goBackView: View;
}

const PredioPublicoSkeletonItem: React.FC = () => (
    <Card className="!p-4 space-y-3 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="w-3/4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
            </div>
            <div className="h-5 w-1/5 bg-slate-200 rounded-full"></div>
        </div>
        <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
            <div className="h-9 bg-slate-200 rounded-lg w-full"></div>
            <div className="h-9 bg-slate-200 rounded-lg w-full"></div>
        </div>
    </Card>
);

const PredioCard: React.FC<{predio: PredioPublico & {distance: number | null}, onDetailsClick: () => void, onVerNoMapaClick: () => void}> = ({ predio, onDetailsClick, onVerNoMapaClick }) => {
    const catDetails = CATEGORY_DETAILS[predio.categoria];
    return (
        <Card className="!p-4 space-y-3">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="font-bold text-lg text-slate-800">{predio.nome}</h3>
                  <div className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${catDetails.bgColor} ${catDetails.color} mt-1`}>
                    <Icon name={catDetails.icon} className="!text-sm" />
                    <span>{predio.categoria}</span>
                  </div>
               </div>
               <div className={`flex items-center space-x-1.5 text-xs font-semibold ${predio.isOpenNow ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${predio.isOpenNow ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <span>{predio.isOpenNow ? 'Aberto' : 'Fechado'}</span>
               </div>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
               <p className="flex items-center"><Icon name="location_on" className="text-base mr-2 text-slate-400" />{predio.endereco}</p>
               {predio.distance !== null && <p className="flex items-center"><Icon name="near_me" className="text-base mr-2 text-slate-400" />{`~${predio.distance.toFixed(1)} km de distância`}</p>}
               {predio.busyness && (
                    <p className="flex items-center pt-1"><Icon name="show_chart" className="text-base mr-2 text-slate-400" />{predio.busyness}</p>
               )}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
               <Button size="sm" onClick={onDetailsClick} variant="secondary" className="w-full">Detalhes</Button>
               <Button size="sm" onClick={onVerNoMapaClick} variant="primary" className="w-full">Ver no Mapa</Button>
               <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${predio.telefone.replace(/\D/g, '')}`;
                    }} 
                    className="w-full !text-emerald-600 hover:!bg-emerald-100"
                    iconLeft="call"
                >
                    Ligar
                </Button>
            </div>
        </Card>
    );
};


const PrediosPorCategoriaList: React.FC<PrediosPorCategoriaListProps> = ({ navigateTo, categoria, titulo, icon, goBackView }) => {
    const { data: todosPredios, loading } = usePrediosPublicos();
    const [selectedPredio, setSelectedPredio] = useState<PredioPublico | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
    const [mainImage, setMainImage] = useState<string | null>(null);
    
    useEffect(() => {
        if (selectedPredio && selectedPredio.imagens && selectedPredio.imagens.length > 0) {
            setMainImage(selectedPredio.imagens[0]);
        } else {
            setMainImage(null);
        }
    }, [selectedPredio]);

    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lng: longitude });
            },
            (error) => { console.warn(`Error getting user location: ${error.message}`); }
          );
        }
    }, []);

    const processedData = useMemo(() => {
        if (!todosPredios) return { grouped: {}, flat: [] };

        let items = todosPredios.filter(p => p.categoria === categoria);

        if (searchTerm.trim()) {
            const lowercasedTerm = searchTerm.toLowerCase();
            items = items.filter(p => 
              p.nome.toLowerCase().includes(lowercasedTerm) ||
              p.endereco.toLowerCase().includes(lowercasedTerm) ||
              p.bairro.toLowerCase().includes(lowercasedTerm) ||
              p.servicos.some(s => s.toLowerCase().includes(lowercasedTerm))
            );
        }

        if (activeFilter === 'abertos') {
            items = items.filter(p => p.isOpenNow);
        }

        const itemsWithDistance = items.map(p => ({
            ...p,
            distance: userLocation 
                ? haversineDistance(
                    userLocation, 
                    { lat: p.localizacao.latitude, lng: p.localizacao.longitude }
                  ) 
                : null
        }));

        if (activeFilter === 'proximos' && userLocation) {
            return { grouped: {}, flat: itemsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)) };
        }

        const grouped = itemsWithDistance.reduce((acc, predio) => {
            const bairro = predio.bairro || 'Não informado';
            if (!acc[bairro]) {
                acc[bairro] = [];
            }
            acc[bairro].push(predio);
            return acc;
        }, {} as Record<string, (PredioPublico & {distance: number | null})[]>);

        // Sort bairros alphabetically, then items within each bairro
        const sortedGrouped: Record<string, (PredioPublico & {distance: number | null})[]> = {};
        Object.keys(grouped).sort().forEach(bairro => {
            sortedGrouped[bairro] = grouped[bairro].sort((a, b) => a.nome.localeCompare(b.nome));
        });
        
        return { grouped: sortedGrouped, flat: itemsWithDistance };

    }, [todosPredios, categoria, searchTerm, activeFilter, userLocation]);
    
    const renderList = () => {
        if (activeFilter === 'proximos') {
             if (processedData.flat.length === 0) {
                 return <Card><p className="text-center text-slate-600 py-8">Nenhum local encontrado para os filtros selecionados.</p></Card>;
             }
            return processedData.flat.map(predio => (
                <PredioCard 
                    key={predio.id} 
                    predio={predio} 
                    onDetailsClick={() => setSelectedPredio(predio)}
                    onVerNoMapaClick={() => navigateTo('MAPA_SERVICOS', { predioId: predio.id })}
                />
            ));
        }

        const bairros = Object.keys(processedData.grouped);
        if (bairros.length === 0) {
             return <Card><p className="text-center text-slate-600 py-8">Nenhum local encontrado para os filtros selecionados.</p></Card>;
        }

        return bairros.map(bairro => (
            <div key={bairro}>
                <h3 className="text-lg font-bold text-slate-700 mb-2 pl-1 border-b-2 border-slate-200 pb-1">{bairro}</h3>
                <div className="space-y-3 pt-2">
                    {processedData.grouped[bairro].map(predio => (
                        <PredioCard 
                            key={predio.id} 
                            predio={predio} 
                            onDetailsClick={() => setSelectedPredio(predio)}
                            onVerNoMapaClick={() => navigateTo('MAPA_SERVICOS', { predioId: predio.id })}
                        />
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Button onClick={() => navigateTo(goBackView)} variant="ghost" size="icon">
                    <Icon name="arrow_back" />
                </Button>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
                    <Icon name={icon} />
                    <span>{titulo}</span>
                </h2>
            </div>
            
            <div className="sticky top-[68px] bg-gray-50 z-10 py-2 space-y-3">
                <div className="relative">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome, bairro, serviço..."
                        className="w-full p-3 pl-10 bg-white text-slate-900 border border-slate-300 rounded-full focus:ring-indigo-600 focus:border-indigo-600 text-sm"
                    />
                </div>
                <Card className="!p-2">
                    <div className="flex items-center justify-around gap-1">
                        <Button size="sm" variant={activeFilter === 'todos' ? 'primary' : 'secondary'} onClick={() => setActiveFilter('todos')} className="flex-1">Todos</Button>
                        <Button size="sm" variant={activeFilter === 'abertos' ? 'primary' : 'secondary'} onClick={() => setActiveFilter('abertos')} className="flex-1">Abertos</Button>
                        <Button size="sm" variant={activeFilter === 'proximos' ? 'primary' : 'secondary'} onClick={() => setActiveFilter('proximos')} className="flex-1" disabled={!userLocation}>Próximos</Button>
                    </div>
                </Card>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => <PredioPublicoSkeletonItem key={i} />)}
                    </div>
                ) : renderList()}
            </div>
            {selectedPredio && (
                <Modal isOpen={!!selectedPredio} onClose={() => setSelectedPredio(null)} title={selectedPredio.nome}>
                    {mainImage && <img src={mainImage} alt={`Foto de ${selectedPredio.nome}`} className="w-full h-56 object-cover bg-slate-200" />}
                    {selectedPredio.imagens && selectedPredio.imagens.length > 1 && (
                    <div className="p-2 flex space-x-2 overflow-x-auto bg-slate-100">
                        {selectedPredio.imagens.map((img, index) => (
                            <img key={index} src={img} alt={`Miniatura ${index + 1}`} className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 flex-shrink-0 ${mainImage === img ? 'border-indigo-500' : 'border-transparent'}`} onClick={() => setMainImage(img)} />
                        ))}
                    </div>
                    )}
                    <div className="p-6 space-y-4 text-slate-700">
                        <p className="text-base text-slate-600">{selectedPredio.endereco}</p>
                        <div className="pt-4 border-t border-slate-200 space-y-2.5">
                            <p className={`flex items-center font-semibold ${selectedPredio.isOpenNow ? 'text-emerald-600' : 'text-rose-600'}`}><Icon name="fiber_manual_record" className="text-base mr-3" />{selectedPredio.isOpenNow ? 'Aberto agora' : 'Fechado agora'}</p>
                            {selectedPredio.busyness && (<p className="flex items-center"><Icon name="show_chart" className="text-xl mr-2 text-slate-500" />{selectedPredio.busyness}</p>)}
                            <p className="flex items-center"><Icon name="schedule" className="text-xl mr-2 text-slate-500" />{selectedPredio.horario}</p>
                            <p className="flex items-center"><Icon name="phone" className="text-xl mr-2 text-slate-500" />{selectedPredio.telefone}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-200"><h5 className="font-bold text-slate-800 mb-2">Serviços oferecidos:</h5><ul className="list-disc list-inside space-y-1 pl-1">{selectedPredio.servicos.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                        {selectedPredio.profissionais && selectedPredio.profissionais.length > 0 && (<div className="pt-4 border-t border-slate-200"><h5 className="font-bold text-slate-800 mb-3">Profissionais</h5><div className="space-y-3">{selectedPredio.profissionais.map((prof, i) => (<div key={i} className="text-sm"><p className="font-semibold text-slate-700">{prof.nome}</p><p className="text-slate-600">{prof.cargo}</p><p className="text-xs text-slate-500 uppercase">{prof.cargaHoraria}</p></div>))}</div></div>)}
                        <div className="pt-4 mt-4 border-t border-slate-200 flex items-center flex-wrap gap-3"><Button iconLeft="call" onClick={() => window.location.href = `tel:${selectedPredio.telefone.replace(/\D/g, '')}`} variant="secondary" className="bg-emerald-600 hover:bg-emerald-700 text-white">Ligar</Button><Button iconLeft="directions" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPredio.localizacao.latitude},${selectedPredio.localizacao.longitude}`, '_blank')} variant="primary" className="bg-sky-600 hover:bg-sky-700 text-white">Google Maps</Button><Button iconLeft="navigation" onClick={() => window.open(`waze://?ll=${selectedPredio.localizacao.latitude},${selectedPredio.localizacao.longitude}&navigate=yes`, '_blank')} variant="secondary" className="bg-cyan-500 hover:bg-cyan-600 text-white">Waze</Button></div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PrediosPorCategoriaList;