import React, { useState } from 'react';
import { View, OpiniaoConsulta, StatusConsultaPublica, UserProfile } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Spinner from '../ui/Spinner';
import { useConsultaPublicaById } from '../../hooks/useMockData';
import { useToast } from '../ui/Toast';
import { timeSince } from '../../utils/helpers';

interface ConsultaPublicaDetailProps {
  consultaId: string;
  navigateTo: (view: View) => void;
  currentUser: UserProfile;
}

const ConsultaPublicaDetail: React.FC<ConsultaPublicaDetailProps> = ({ consultaId, navigateTo, currentUser }) => {
  const { data: consulta, loading } = useConsultaPublicaById(consultaId);
  const { addToast } = useToast();
  const [opinioes, setOpinioes] = useState<OpiniaoConsulta[]>([]);
  const [supportedOpinions, setSupportedOpinions] = useState<Set<string>>(new Set());
  const [newOpinion, setNewOpinion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const isGuest = currentUser.uid === 'guest-user';
  
  React.useEffect(() => {
      if (consulta && consulta.opinioes) {
          const opinionsWithData = consulta.opinioes.map(op => ({
              ...op,
              supports: op.supports ?? 0,
          }));
          setOpinioes(opinionsWithData);
      }
  }, [consulta]);

  const handleSubmitOpinion = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      addToast('Você precisa fazer login para enviar uma opinião.', 'error');
      return;
    }
    if (!newOpinion.trim()) {
      addToast('Sua opinião não pode estar vazia.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
        const opinionToAdd: OpiniaoConsulta = {
            id: `op${Date.now()}`,
            author: { 
                uid: currentUser.uid, 
                name: currentUser.displayName || 'Usuário', 
                avatar: currentUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.displayName || 'User'}` 
            },
            text: newOpinion,
            date: new Date().toISOString(),
            supports: 0,
        };
        setOpinioes(prev => [opinionToAdd, ...prev]);
        setNewOpinion('');
        setIsSubmitting(false);
        addToast('Sua opinião foi enviada com sucesso!', 'success');
    }, 1000);
  };

  const handleSupport = (opinionId: string) => {
    const isAlreadySupported = supportedOpinions.has(opinionId);

    setOpinioes(prev => 
        prev.map(op => 
            op.id === opinionId 
                ? { ...op, supports: op.supports + (isAlreadySupported ? -1 : 1) } 
                : op
        )
    );

    setSupportedOpinions(prev => {
        const newSet = new Set(prev);
        if (isAlreadySupported) {
            newSet.delete(opinionId);
        } else {
            newSet.add(opinionId);
        }
        return newSet;
    });
  };

  if (loading) return <Spinner />;
  if (!consulta) return <Card><p>Consulta pública não encontrada.</p></Card>;

  const endDate = new Date(consulta.endDate);
  const now = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isAberta = consulta.status === StatusConsultaPublica.ABERTA && now < endDate;

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in-up { animation: slide-in-up 0.3s ease-out forwards; }
      `}</style>

      <Button onClick={() => navigateTo('CONSULTAS_PUBLICAS_LIST')} variant="ghost" iconLeft="arrow_back">
        Todas as Consultas
      </Button>

      <Card className="!p-0 overflow-hidden">
        <img src={consulta.imageUrl} alt={consulta.title} className="w-full h-56 object-cover bg-slate-200" />
        <div className="p-4">
            <h1 className="text-2xl font-bold text-slate-800">{consulta.title}</h1>
            <div className="mt-2 text-sm text-slate-600">
                <p><strong>Período de participação:</strong> {new Date(consulta.startDate).toLocaleDateString('pt-BR')} a {endDate.toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{consulta.description}</p>
            </div>
        </div>
      </Card>
      
      {consulta.documentos && consulta.documentos.length > 0 && (
          <Card>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Documentos e Anexos</h2>
              <div className="space-y-2">
                  {consulta.documentos.map(doc => (
                      <a href={doc.url} key={doc.nome} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors">
                          <Icon name={doc.icon} className="text-2xl text-indigo-600" />
                          <span className="ml-3 font-medium text-sm text-slate-800">{doc.nome}</span>
                          <Icon name="download" className="ml-auto text-xl text-slate-500" />
                      </a>
                  ))}
              </div>
          </Card>
      )}

      {isAberta ? (
        <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Deixe sua Opinião</h2>
            <p className="text-sm text-slate-500 mb-4">A consulta encerra em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}.</p>
            <form onSubmit={handleSubmitOpinion} className="space-y-3">
                 <textarea
                    value={newOpinion}
                    onChange={(e) => setNewOpinion(e.target.value)}
                    placeholder={isGuest ? "Faça login para opinar" : "Escreva sua sugestão, crítica ou apoio ao projeto..."}
                    className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 text-sm"
                    rows={4}
                    disabled={isSubmitting || isGuest}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting || isGuest}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Opinião'}
                </Button>
            </form>
        </Card>
      ) : (
        <Card className="text-center">
            <Icon name="lock_clock" className="text-4xl text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700 mt-2">Período de participação encerrado.</p>
        </Card>
      )}

       <Card>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Opiniões da Comunidade ({opinioes.length})</h2>
        <div className="space-y-4">
            {opinioes.map(op => {
                const isSupported = supportedOpinions.has(op.id);
                return (
                    <div key={op.id} className="p-3 rounded-lg bg-slate-50">
                        <div className="flex items-start space-x-3">
                            <img src={op.author.avatar} alt={op.author.name} className="w-9 h-9 rounded-full"/>
                            <div className="flex-1">
                                <span className="font-semibold text-slate-800 text-sm">{op.author.name}</span>
                                <p className="text-sm text-slate-600 mt-1">{op.text}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pl-12">
                            <span className="text-xs text-slate-500">{timeSince(op.date)}</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSupport(op.id)}
                                iconLeft="thumb_up"
                                className={`transition-colors !py-1 ${isSupported ? '!text-indigo-600 font-bold' : 'text-slate-500'}`}
                            >
                                {op.supports}
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
      </Card>

      <div className="fixed bottom-24 right-4 z-30 animate-fade-in">
          <Button
              size="lg"
              className="!rounded-full !p-4 shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setIsHelpVisible(true)}
              aria-label="Ajuda sobre Consultas Públicas"
          >
              <Icon name="flutter_dash" className="text-3xl" />
          </Button>
      </div>

      {isHelpVisible && (
          <div 
              className="fixed inset-0 bg-black/30 z-40 flex items-end justify-end p-4 animate-fade-in"
              onClick={() => setIsHelpVisible(false)}
              role="dialog"
              aria-modal="true"
          >
              <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl p-4 text-sm text-slate-700 mb-20 animate-slide-in-up"
              >
                  <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-base text-slate-800 flex items-center">
                          <Icon name="flutter_dash" className="mr-2 text-indigo-600" />
                          Assistente Uirapuru
                      </h4>
                      <Button size="icon" variant="ghost" onClick={() => setIsHelpVisible(false)} aria-label="Fechar ajuda">
                          <Icon name="close" />
                      </Button>
                  </div>
                  <p className="font-semibold">O que é uma Consulta Pública?</p>
                  <p className="mt-1">É uma ferramenta para a Prefeitura ouvir sua opinião sobre projetos e leis importantes para a cidade antes que sejam finalizados.</p>
                  <p className="mt-2">Sua participação ajuda a construir uma Baturité melhor para todos!</p>
                  <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white rotate-45 transform"></div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ConsultaPublicaDetail;