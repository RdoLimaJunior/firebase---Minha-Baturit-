import React from 'react';
import { Publicacao, StatusPublicacao, TipoPublicacao } from '../../types';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

interface PublicacaoCardProps {
  publicacao: Publicacao;
  onClick: () => void;
}

const getStatusStyle = (status: StatusPublicacao) => {
  switch (status) {
    case StatusPublicacao.ABERTO:
      return { text: 'Aberto', classes: 'bg-sky-100 text-sky-800' };
    case StatusPublicacao.EM_ANALISE:
      return { text: 'Em análise', classes: 'bg-amber-100 text-amber-800' };
    case StatusPublicacao.ENCAMINHADO:
      return { text: 'Encaminhado', classes: 'bg-violet-100 text-violet-800' };
    case StatusPublicacao.CONCLUIDO:
      return { text: 'Concluído', classes: 'bg-emerald-100 text-emerald-800' };
    default:
      return { text: 'Status', classes: 'bg-slate-100 text-slate-800' };
  }
};

const getTypeStyle = (tipo: TipoPublicacao) => {
    switch (tipo) {
        case TipoPublicacao.PROBLEMA:
            return { icon: 'report_problem', color: 'text-rose-400' };
        case TipoPublicacao.IDEIA:
            return { icon: 'lightbulb', color: 'text-amber-400' };
        case TipoPublicacao.ELOGIO:
            return { icon: 'thumb_up', color: 'text-emerald-400' };
        case TipoPublicacao.EVENTO:
            return { icon: 'event', color: 'text-sky-400' };
        default:
            return { icon: 'forum', color: 'text-slate-400' };
    }
};


const PublicacaoCard: React.FC<PublicacaoCardProps> = ({ publicacao, onClick }) => {
  const statusStyle = getStatusStyle(publicacao.status);
  const typeStyle = getTypeStyle(publicacao.tipo);
  const hasImage = publicacao.fotos && publicacao.fotos.length > 0;
  
  return (
    <Card onClick={onClick} className="!p-0 overflow-hidden">
      {hasImage ? (
        <div className="relative">
          <img 
            src={publicacao.fotos[0]} 
            alt={publicacao.title} 
            className="w-full h-56 object-cover bg-slate-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <div className="flex items-center space-x-2">
                <Icon name={typeStyle.icon} className={`text-lg ${typeStyle.color} drop-shadow-md`} />
                <span className={`font-bold text-sm text-white drop-shadow-md`}>{publicacao.tipo}</span>
            </div>
            <h3 className="font-bold text-xl text-white leading-tight drop-shadow-md mt-1">{publicacao.title}</h3>
          </div>

          <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.classes} shadow-md`}>
            {statusStyle.text}
          </span>
        </div>
      ) : (
        <div className="p-4 border-b border-slate-100">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <Icon name={typeStyle.icon} className={`text-xl ${typeStyle.color.replace('-400', '-500')}`} />
                    <span className={`font-bold text-sm ${typeStyle.color.replace('-400', '-500')}`}>{publicacao.tipo}</span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyle.classes}`}>
                    {statusStyle.text}
                </span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 leading-tight">{publicacao.title}</h3>
        </div>
      )}

      <div className="p-4">
        <p className="text-sm text-slate-600 line-clamp-2">{publicacao.resumo}</p>
        
        <div className="mt-3">
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              <Icon name="location_on" className="!text-sm" />
              <span>{publicacao.bairro}</span>
          </div>
        </div>
      
        <div className="flex items-center justify-between text-sm text-slate-600 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
              <img src={publicacao.author.avatar} alt="Avatar do autor" className="w-6 h-6 rounded-full"/>
              <span className="font-semibold text-slate-700">{publicacao.author.isAnonymous ? 'Anônimo' : publicacao.author.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="thumb_up_off_alt" className="text-base" />
              <span>{publicacao.counts.supports}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="chat_bubble_outline" className="text-base" />
              <span>{publicacao.counts.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PublicacaoCard;