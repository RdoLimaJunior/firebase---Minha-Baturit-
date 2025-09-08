import React, { useState, useMemo } from 'react';
import { CategoriaReclamacao, TipoProtocolo, View, Protocolo, StatusProtocolo, UserProfile } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { BAIRROS_BATURITE } from '../../constants';
import { useToast } from '../ui/Toast';
import { useProtocolos } from '../../hooks/useMockData';
import { useAuth } from '../../hooks/useAuth';

// --- Protocolo List Components (adapted from ProtocolosList.tsx) ---

const ProtocoloSkeletonItem: React.FC = () => (
    <Card>
        <div className="animate-pulse flex flex-col space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3 w-3/4">
                    <div className="w-6 h-6 bg-slate-200 rounded-md"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-2 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-2 bg-slate-200 rounded w-full"></div>
            <div className="h-2 bg-slate-200 rounded w-1/3 pt-2"></div>
        </div>
    </Card>
);

const getStatusChipStyle = (status: StatusProtocolo) => {
    switch (status) {
        case StatusProtocolo.RECEBIDO:
            return 'bg-[var(--color-accent-yellow)]/20 text-[var(--color-accent-yellow)]';
        case StatusProtocolo.EM_ANDAMENTO:
            return 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]';
        case StatusProtocolo.RESOLVIDO:
            return 'bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]';
        case StatusProtocolo.REJEITADO:
            return 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]';
        default:
            return 'bg-slate-100 text-slate-800';
    }
};

const getProtocoloTypeStyle = (tipo: TipoProtocolo) => {
    switch (tipo) {
        case TipoProtocolo.RECLAMACAO:
            return { icon: 'report_problem', color: 'text-[var(--color-accent-red)]' };
        case TipoProtocolo.SUGESTAO:
            return { icon: 'lightbulb', color: 'text-[var(--color-accent-yellow)]' };
        case TipoProtocolo.ELOGIO:
            return { icon: 'thumb_up', color: 'text-[var(--color-accent-green)]' };
        case TipoProtocolo.DENUNCIA:
            return { icon: 'security', color: 'text-[var(--color-accent-pink)]' };
        default:
            return { icon: 'article', color: 'text-slate-500' };
    }
};

const ProtocoloItem: React.FC<{ protocolo: Protocolo, onClick: () => void }> = ({ protocolo, onClick }) => {
    const typeStyle = getProtocoloTypeStyle(protocolo.tipo);

    return (
        <Card onClick={onClick}>
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <Icon name={typeStyle.icon} className={`text-2xl ${typeStyle.color}`} />
                    <div>
                        <p className="text-sm font-semibold text-slate-600">{protocolo.protocolo}</p>
                        <h3 className="font-bold text-slate-800">{protocolo.tipo}</h3>
                        {protocolo.categoria && <p className="text-xs text-slate-500">{protocolo.categoria}</p>}
                    </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusChipStyle(protocolo.status)}`}>
                    {protocolo.status}
                </span>
            </div>
            <p className="text-sm text-slate-700 mt-2 truncate">{protocolo.descricao}</p>
            <div className="text-xs text-slate-500 mt-4 flex items-center">
                <Icon name="schedule" className="text-base mr-1" />
                <span>Aberto em: {new Date(protocolo.dataAbertura).toLocaleDateString('pt-BR')}</span>
            </div>
        </Card>
    );
};


const MeusProtocolosList: React.FC<{ navigateTo: (view: View, params?: { protocoloId?: string }) => void; }> = ({ navigateTo }) => {
    const { data: protocolos, loading } = useProtocolos();
    const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'status'>('date-desc');

    const sortedProtocolos = useMemo(() => {
        if (!protocolos) return [];
        
        const statusOrder = {
            [StatusProtocolo.RECEBIDO]: 1,
            [StatusProtocolo.EM_ANDAMENTO]: 2,
            [StatusProtocolo.RESOLVIDO]: 3,
            [StatusProtocolo.REJEITADO]: 4,
        };
        
        const sorted = [...protocolos];
        switch (sortBy) {
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.dataAbertura).getTime() - new Date(b.dataAbertura).getTime());
            case 'status':
                return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime());
            case 'date-desc':
            default:
                return sorted.sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime());
        }
    }, [protocolos, sortBy]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                </div>
                <Card className="!p-3">
                    <div className="flex items-center space-x-2 flex-wrap animate-pulse">
                        <div className="h-6 w-20 bg-slate-200 rounded"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                    </div>
                </Card>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <ProtocoloSkeletonItem key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Acompanhar Meus Protocolos</h2>
            </div>
            <Card className="!p-3">
                <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-600 mr-2">Ordenar por:</span>
                    <Button size="sm" onClick={() => setSortBy('date-desc')} variant={sortBy === 'date-desc' ? 'primary' : 'ghost'}>Recentes</Button>
                    <Button size="sm" onClick={() => setSortBy('date-asc')} variant={sortBy === 'date-asc' ? 'primary' : 'ghost'}>Antigos</Button>
                    <Button size="sm" onClick={() => setSortBy('status')} variant={sortBy === 'status' ? 'primary' : 'ghost'}>Status</Button>
                </div>
            </Card>
            {sortedProtocolos && sortedProtocolos.length > 0 ? (
                <div className="space-y-3">
                    {sortedProtocolos.map(protocolo => (
                        <ProtocoloItem key={protocolo.id} protocolo={protocolo} onClick={() => navigateTo('PROTOCOLO_DETAIL', { protocoloId: protocolo.id })} />
                    ))}
                </div>
            ) : (
                <Card className="text-center">
                    <p className="text-slate-600">Você ainda não abriu nenhum protocolo.</p>
                </Card>
            )}
        </div>
    );
};


interface ProtocoloFormProps {
    goBack: () => void;
    navigateTo: (view: View, params?: { protocoloId?: string }) => void;
    userProfile: UserProfile;
}

const TIPO_PROTOCOLO_METADATA = {
  [TipoProtocolo.RECLAMACAO]: { title: 'Registrar Reclamação', icon: 'report_problem', description: 'Reporte problemas como buracos, iluminação, etc.' },
  [TipoProtocolo.SUGESTAO]: { title: 'Enviar Sugestão', icon: 'lightbulb', description: 'Dê ideias para melhorar nossa cidade.' },
  [TipoProtocolo.DENUNCIA]: { title: 'Fazer Denúncia', icon: 'security', description: 'Relate irregularidades de forma segura.' },
  [TipoProtocolo.ELOGIO]: { title: 'Fazer um Elogio', icon: 'thumb_up', description: 'Reconheça um bom serviço ou servidor.' },
};

const ProtocoloForm: React.FC<ProtocoloFormProps> = ({ goBack, navigateTo, userProfile }) => {
    const [step, setStep] = useState(1);
    const [tipo, setTipo] = useState<TipoProtocolo | null>(null);

    const [categoria, setCategoria] = useState<CategoriaReclamacao | ''>('');
    const [bairro, setBairro] = useState<string>('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [localizacao, setLocalizacao] = useState<{ lat: number, lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { logout } = useAuth();
    const isGuest = userProfile.uid === 'guest-user';

    const handleTypeSelect = (selectedType: TipoProtocolo) => {
        setTipo(selectedType);
        setStep(2);
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFoto(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleGetLocation = () => {
        setLocalizacao({ lat: -4.333, lng: -38.881 });
        addToast('Localização obtida com sucesso!', 'success');
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isGuest) {
            addToast('Você precisa fazer login para enviar um protocolo.', 'error');
            return;
        }
        if(!tipo || !descricao || !bairro || (tipo === TipoProtocolo.RECLAMACAO && !categoria)) {
            addToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            console.log({ tipo, categoria, descricao, foto, localizacao, bairro });
            setIsSubmitting(false);
            addToast('Protocolo enviado com sucesso!', 'success');
            goBack();
        }, 1500);
    };

    if (step === 1) {
        return (
            <div className="space-y-6">
                 <div>
                    <Button onClick={goBack} variant="ghost" iconLeft="arrow_back">Voltar</Button>
                    <Card className="mt-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Participação Cidadã</h2>
                            <p className="text-slate-600 mt-1">Qual tipo de protocolo você deseja abrir?</p>
                        </div>
                        <div className="space-y-3">
                            {Object.values(TipoProtocolo).map(type => (
                                <Card key={type} onClick={() => handleTypeSelect(type)} className="flex items-center space-x-4 text-left !p-4 border-2 border-transparent hover:border-[var(--color-primary)] hover:shadow-lg">
                                    <Icon name={TIPO_PROTOCOLO_METADATA[type].icon} className="text-3xl text-[var(--color-primary)]" />
                                    <div>
                                        <h3 className="font-bold text-slate-800">{TIPO_PROTOCOLO_METADATA[type].title}</h3>
                                        <p className="text-sm text-slate-600">{TIPO_PROTOCOLO_METADATA[type].description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </div>
                
                <MeusProtocolosList navigateTo={navigateTo} />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Button onClick={() => setStep(1)} variant="ghost" iconLeft="arrow_back">Mudar tipo</Button>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">{TIPO_PROTOCOLO_METADATA[tipo!]?.title}</h2>
                    
                    {tipo === TipoProtocolo.RECLAMACAO && (
                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
                            <select
                                id="categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value as CategoriaReclamacao)}
                                className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            >
                                <option value="" disabled>Selecione uma categoria</option>
                                {Object.values(CategoriaReclamacao).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="bairro" className="block text-sm font-medium text-slate-700 mb-1">Bairro *</label>
                        <select
                            id="bairro"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                        >
                            <option value="" disabled>Selecione seu bairro</option>
                            {BAIRROS_BATURITE.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
                        <textarea
                            id="descricao"
                            rows={4}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            placeholder="Descreva sua solicitação com o máximo de detalhes."
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Foto (Opcional)</label>
                        <label htmlFor="foto-upload" className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-md cursor-pointer hover:bg-slate-50">
                            <div className="text-center">
                                <Icon name="photo_camera" className="mx-auto text-4xl text-slate-400" />
                                <span className="mt-2 block text-sm text-slate-600">Clique para enviar uma foto</span>
                            </div>
                        </label>
                        <input id="foto-upload" type="file" className="sr-only" accept="image/*" onChange={handleFotoChange} />
                        {fotoPreview && <img src={fotoPreview} alt="Preview" className="mt-2 rounded-md w-32 h-32 object-cover" />}
                    </div>

                    <div className="space-y-2">
                         <label className="block text-sm font-medium text-slate-700">Localização (Opcional)</label>
                        <Button type="button" variant="secondary" onClick={handleGetLocation} iconLeft="my_location" className="w-full">
                           Usar minha localização atual
                        </Button>
                        {localizacao && (
                            <div className="text-sm text-[var(--color-accent-green)] flex items-center justify-center">
                                <Icon name="check_circle" className="text-lg mr-1" />
                                Localização capturada!
                            </div>
                        )}
                    </div>
                    
                    {isGuest && (
                        <div className="p-3 bg-amber-100 border-l-4 border-amber-500 text-amber-800 text-sm rounded-r-lg">
                            <p>
                                <span className="font-bold">Modo Visitante:</span> Para enviar, por favor,{' '}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        logout();
                                    }}
                                    className="underline font-semibold hover:text-amber-900"
                                >
                                    faça login
                                </button>
                                .
                            </p>
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting || isGuest}>
                        {isSubmitting ? 'Enviando...' : 'Enviar Protocolo'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ProtocoloForm;