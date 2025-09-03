import React from 'react';
import { useProtocoloById } from '../../hooks/useMockData';
import { StatusProtocolo, HistoricoProtocolo, TipoProtocolo } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ProtocoloDetailProps {
  protocoloId: string;
  goBack: () => void;
}

const getStatusIcon = (status: StatusProtocolo) => {
    switch(status) {
        case StatusProtocolo.RECEBIDO: return <Icon name="article" className="text-sky-500 text-2xl" />;
        case StatusProtocolo.EM_ANDAMENTO: return <Icon name="sync" className="text-amber-500 text-2xl" />;
        case StatusProtocolo.RESOLVIDO: return <Icon name="check_circle" className="text-emerald-500 text-2xl" />;
        case StatusProtocolo.REJEITADO: return <Icon name="cancel" className="text-rose-500 text-2xl" />;
        default: return null;
    }
};

const TimelineItem: React.FC<{ item: HistoricoProtocolo, isLast: boolean }> = ({ item, isLast }) => (
    <li className="relative pb-8">
        {!isLast && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true"></span>}
        <div className="relative flex items-start space-x-3">
            <div>
                <div className="relative px-1">
                    <div className="h-8 w-8 bg-white rounded-full ring-4 ring-white flex items-center justify-center">
                        {getStatusIcon(item.status)}
                    </div>
                </div>
            </div>
            <div className="min-w-0 flex-1 py-1.5">
                <div className="text-sm text-slate-600">
                    Status alterado para <span className="font-semibold text-slate-800">{item.status}</span>
                </div>
                <div className="text-xs text-slate-500">
                    {new Date(item.data).toLocaleString('pt-BR')}
                </div>
                {item.observacao && <p className="text-sm mt-1 p-2 bg-slate-100 rounded-md text-slate-700">{item.observacao}</p>}
            </div>
        </div>
    </li>
);

const ProtocoloDetail: React.FC<ProtocoloDetailProps> = ({ protocoloId, goBack }) => {
  const { data: protocolo, loading } = useProtocoloById(protocoloId);

  if (loading) return <Spinner />;
  if (!protocolo) return <Card><p>Protocolo não encontrado.</p></Card>;

  return (
    <div className="space-y-4">
      <Button onClick={goBack} variant="ghost" iconLeft="arrow_back">Voltar</Button>
      
      <Card>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{protocolo.tipo}</h2>
        {protocolo.tipo === TipoProtocolo.RECLAMACAO && protocolo.categoria && (
            <p className="text-md font-medium text-slate-600">{protocolo.categoria}</p>
        )}
        <p className="text-sm font-medium text-slate-500 mt-2">Protocolo: {protocolo.protocolo}</p>
        
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p><span className="font-semibold">Descrição:</span> {protocolo.descricao}</p>
          <p><span className="font-semibold">Bairro:</span> {protocolo.bairro}</p>
          <p><span className="font-semibold">Data de Abertura:</span> {new Date(protocolo.dataAbertura).toLocaleString('pt-BR')}</p>
        </div>
        
        {protocolo.fotos && protocolo.fotos.length > 0 && (
            <div className="mt-4">
                <h3 className="font-semibold text-slate-800 mb-2">Fotos:</h3>
                <img src={protocolo.fotos[0]} alt="Foto do protocolo" className="rounded-lg w-full h-auto object-cover"/>
            </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Histórico de Atualizações</h3>
        <ul>
            {[...protocolo.historico].reverse().map((item, index, arr) => (
                <TimelineItem key={index} item={item} isLast={index === arr.length - 1} />
            ))}
        </ul>
      </Card>
    </div>
  );
};

export default ProtocoloDetail;