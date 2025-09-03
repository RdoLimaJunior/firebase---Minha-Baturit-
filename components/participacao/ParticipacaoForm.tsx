import React, { useState } from 'react';
import { TipoPublicacao, UserProfile } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { BAIRROS_BATURITE } from '../../constants';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';

interface ParticipacaoFormProps {
    goBack: () => void;
    userProfile: UserProfile;
}

const TIPO_PUBLICACAO_METADATA = {
  [TipoPublicacao.IDEIA]: { title: 'Compartilhar uma Ideia', icon: 'lightbulb', description: 'Sugira melhorias para a cidade.' },
  [TipoPublicacao.PROBLEMA]: { title: 'Relatar um Problema', icon: 'report_problem', description: 'Reporte problemas urbanos.' },
  [TipoPublicacao.ELOGIO]: { title: 'Fazer um Elogio', icon: 'thumb_up', description: 'Reconheça um bom serviço.' },
  [TipoPublicacao.EVENTO]: { title: 'Divulgar um Evento', icon: 'event', description: 'Promova eventos comunitários.' },
};

const MAX_FOTOS = 4;

const ParticipacaoForm: React.FC<ParticipacaoFormProps> = ({ goBack, userProfile }) => {
    const [step, setStep] = useState(1);
    const [tipo, setTipo] = useState<TipoPublicacao | null>(null);

    const [title, setTitle] = useState('');
    const [descricao, setDescricao] = useState('');
    const [bairro, setBairro] = useState<string>('');
    const [fotos, setFotos] = useState<File[]>([]);
    const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [lgpdConsent, setLgpdConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { logout } = useAuth();
    const isGuest = userProfile.uid === 'guest-user';

    const handleTypeSelect = (selectedType: TipoPublicacao) => {
        setTipo(selectedType);
        setStep(2);
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, MAX_FOTOS - fotos.length);
            setFotos(prev => [...prev, ...files]);
            const previews = files.map(file => URL.createObjectURL(file));
            setFotoPreviews(prev => [...prev, ...previews]);
        }
    };

    const removeFoto = (index: number) => {
        setFotos(prev => prev.filter((_, i) => i !== index));
        setFotoPreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            // Revoke the object URL to free up memory
            URL.revokeObjectURL(prev[index]);
            return newPreviews;
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isGuest) {
            addToast('Você precisa fazer login para criar uma publicação.', 'error');
            return;
        }
        if(!tipo || !title || !descricao || !bairro) {
            addToast('Por favor, preencha os campos obrigatórios.', 'error');
            return;
        }
        if(!lgpdConsent) {
            addToast('Você precisa aceitar os termos para publicar.', 'error');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            console.log({ tipo, title, descricao, bairro, fotos, isAnonymous, lgpdConsent });
            setIsSubmitting(false);
            addToast('Publicação enviada! Ela ficará visível após checagem rápida.', 'success');
            goBack();
        }, 1500);
    };

    if (step === 1) {
        return (
            <div className="space-y-4">
                <Button onClick={goBack} variant="ghost" iconLeft="arrow_back">Voltar</Button>
                <Card>
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Criar Publicação</h1>
                        <p className="text-slate-600 mt-1">O que você gostaria de compartilhar?</p>
                    </div>
                    <div className="space-y-3">
                        {Object.values(TipoPublicacao).map(type => (
                            <Card key={type} onClick={() => handleTypeSelect(type)} className="flex items-center space-x-4 text-left !p-4 border-2 border-transparent hover:border-indigo-500 hover:shadow-lg">
                                <Icon name={TIPO_PUBLICACAO_METADATA[type].icon} className="text-3xl text-indigo-600" />
                                <div>
                                    <h3 className="font-bold text-slate-800">{TIPO_PUBLICACAO_METADATA[type].title}</h3>
                                    <p className="text-sm text-slate-600">{TIPO_PUBLICACAO_METADATA[type].description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Button onClick={() => setStep(1)} variant="ghost" iconLeft="arrow_back">Mudar tipo</Button>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h1 className="text-2xl font-bold text-slate-800">{TIPO_PUBLICACAO_METADATA[tipo!]?.title}</h1>
                    
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resuma em poucas palavras..." className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600" />
                    </div>

                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
                        <textarea id="descricao" rows={5} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Conte os detalhes que ajudam a entender..." className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"></textarea>
                    </div>

                     <div>
                        <label htmlFor="bairro" className="block text-sm font-medium text-slate-700 mb-1">Bairro *</label>
                        <select id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600">
                            <option value="" disabled>Selecione seu bairro</option>
                            {BAIRROS_BATURITE.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Fotos (Opcional, até {MAX_FOTOS})</label>
                        <div className="grid grid-cols-4 gap-2">
                            {Array.from({ length: MAX_FOTOS }).map((_, index) => {
                                if (fotoPreviews[index]) {
                                    return (
                                        <div key={index} className="relative aspect-square">
                                            <img src={fotoPreviews[index]} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                            <button type="button" onClick={() => removeFoto(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors">
                                                <Icon name="close" className="text-sm" />
                                            </button>
                                        </div>
                                    );
                                }
                                if (index === fotos.length) {
                                    return (
                                        <label key="add-photo" htmlFor="foto-upload" className="aspect-square w-full flex items-center justify-center rounded-md border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-50">
                                            <div className="text-center text-slate-400">
                                                <Icon name="add_a_photo" className="mx-auto text-3xl" />
                                                <span className="text-xs mt-1 block">Adicionar</span>
                                            </div>
                                        </label>
                                    );
                                }
                                return (
                                    <div key={`placeholder-${index}`} className="aspect-square w-full flex items-center justify-center rounded-md bg-slate-100 border-2 border-dashed border-slate-200">
                                        <Icon name="image" className="text-3xl text-slate-300" />
                                    </div>
                                );
                            })}
                        </div>
                        <input id="foto-upload" type="file" className="sr-only" accept="image/*" multiple onChange={handleFotoChange} disabled={fotos.length >= MAX_FOTOS} />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                            <label htmlFor="anonymous" className="text-sm font-medium text-slate-700">Publicar como anônimo?</label>
                            <button type="button" onClick={() => setIsAnonymous(!isAnonymous)} className={`${isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                                <span className={`${isAnonymous ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </button>
                        </div>
                        <div className="flex items-start space-x-2">
                            <input id="lgpd" type="checkbox" checked={lgpdConsent} onChange={e => setLgpdConsent(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-1" />
                            <label htmlFor="lgpd" className="text-xs text-slate-600">
                                Concordo que as informações fornecidas (exceto dados pessoais, se anônimo) serão públicas e podem ser utilizadas pela prefeitura para análise.
                            </label>
                        </div>
                    </div>

                    {isGuest && (
                        <div className="p-3 bg-amber-100 border-l-4 border-amber-500 text-amber-800 text-sm rounded-r-lg">
                            <p>
                                <span className="font-bold">Modo Visitante:</span> Para publicar, por favor,{' '}
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
                        {isSubmitting ? 'Enviando...' : 'Publicar'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ParticipacaoForm;