import React from 'react';
import { View, ConsultaPublica, StatusConsultaPublica } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { useConsultasPublicas } from '../../hooks/useMockData';
import Spinner from '../ui/Spinner';

interface ConsultasPublicasListProps {
  navigateTo: (view: View, params?: { consultaId?: string }) => void;
}

const SkeletonCard: React.FC = () => (
    <Card className="!p-0 animate-pulse">
        <div className="w-full h-40 bg-slate-200"></div>
        <div className="p-4 space-y-3">
            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-1/4 bg-slate-200 rounded-full"></div>
                <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
            </div>
        </div>
    </Card>
);

const getStatusStyle = (status: StatusConsultaPublica) => {
  switch (status) {
    case StatusConsultaPublica.ABERTA:
      return { text: 'Aberta para participação', classes: 'bg-emerald-100 text-emerald-800' };
    case StatusConsultaPublica.ENCERRADA:
      return { text: 'Encerrada', classes: 'bg-rose-100 text-rose-800' };
    case StatusConsultaPublica.EM_ANALISE:
       return { text: 'Resultados em análise', classes: 'bg-amber-100 text-amber-800' };
    default:
      return { text: 'Status', classes: 'bg-slate-100 text-slate-800' };
  }
};

const ConsultaCard: React.FC<{ consulta: ConsultaPublica, onClick: () => void }> = ({ consulta, onClick }) => {
    const statusStyle = getStatusStyle(consulta.status);
    
    const endDate = new Date(consulta.endDate);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <Card onClick={onClick} className="!p-0">
            <img src={consulta.imageUrl} alt={consulta.title} className="w-full h-40 object-cover bg-slate-200" />
            <div className="p-4">
                <h3 className="font-bold text-lg text-slate-800">{consulta.title}</h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{consulta.summary}</p>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.classes}`}>
                        {statusStyle.text}
                    </span>
                    {consulta.status === StatusConsultaPublica.ABERTA && daysRemaining > 0 && (
                        <div className="text-sm font-semibold text-slate-700">
                           <Icon name="timer" className="text-base mr-1" />
                           {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};


const ConsultasPublicasList: React.FC<ConsultasPublicasListProps> = ({ navigateTo }) => {
  const { data: consultas, loading } = useConsultasPublicas();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('SERVICOS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Consultas Públicas</h2>
      </div>

      <p className="text-slate-600">
        Sua voz é fundamental para construir o futuro de Baturité. Participe, opine e ajude a tomar as melhores decisões para nossa cidade.
      </p>
      
      {loading ? (
        <div className="space-y-4 pt-2">
            <SkeletonCard />
            <SkeletonCard />
        </div>
      ) : consultas && consultas.length > 0 ? (
        <div className="space-y-4 pt-2">
            {consultas.map(c => (
                <ConsultaCard key={c.id} consulta={c} onClick={() => navigateTo('CONSULTAS_PUBLICAS_DETAIL', { consultaId: c.id })} />
            ))}
        </div>
      ) : (
        <Card className="text-center py-10">
            <Icon name="upcoming" className="text-5xl text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 mt-4">Nenhuma Consulta Ativa</h3>
            <p className="text-slate-600 mt-2 max-w-md mx-auto">
            No momento, não há consultas públicas abertas. Fique de olho neste espaço para futuras oportunidades de participação!
            </p>
        </Card>
      )}
    </div>
  );
};

export default ConsultasPublicasList;