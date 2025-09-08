import React, { useState } from 'react';
import { useNoticias } from '../../hooks/useMockData';
import { Noticia, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import LazyImage from '../ui/LazyImage';

interface NoticiasListProps {
  navigateTo: (view: View, params?: { noticiaId?: string }) => void;
}

const NoticiaSkeletonItem: React.FC = () => (
    <Card className="!p-0 overflow-hidden animate-pulse">
        <div className="p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            <div className="flex-1 space-y-1">
                <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                <div className="h-3 w-1/4 bg-slate-200 rounded"></div>
            </div>
        </div>
        <div className="w-full h-64 bg-slate-200"></div>
        <div className="p-4 space-y-2">
            <div className="h-3 w-full bg-slate-200 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
        </div>
        <div className="p-4 border-t border-slate-200 flex items-center space-x-4">
            <div className="h-6 w-12 bg-slate-200 rounded"></div>
            <div className="h-6 w-12 bg-slate-200 rounded"></div>
            <div className="h-6 w-12 bg-slate-200 rounded"></div>
        </div>
    </Card>
);


const NoticiaItem: React.FC<{ noticia: Noticia; onClick: () => void; onShare: () => void; }> = ({ noticia, onClick, onShare }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(noticia.likes);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare();
  };

  return (
    <Card onClick={onClick} className="!p-0 overflow-hidden">
        <div className="p-4 flex items-center space-x-3">
            <img src="https://www.baturite.ce.gov.br/imagens/logo-prefeitura-de-baturite.png" alt="Logo Prefeitura" className="w-10 h-10 rounded-full border" />
            <div>
                <h4 className="font-bold text-slate-800">Prefeitura de Baturité</h4>
                <p className="text-xs text-slate-500">{new Date(noticia.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
            </div>
        </div>
      <LazyImage 
        src={noticia.imageUrl} 
        alt={noticia.title}
        className="w-full h-64 object-cover"
        isLoading={isImageLoading}
        onLoad={() => setIsImageLoading(false)}
      />
      <div className="p-4">
        <h3 className="font-bold text-slate-800">{noticia.title}</h3>
        <p className="text-sm text-slate-600 mt-1 line-clamp-3">{noticia.summary}</p>
      </div>
      <div className="p-4 border-t border-slate-100 flex items-center space-x-4">
        <button onClick={handleLike} className="flex items-center space-x-1 text-slate-600 hover:text-[var(--color-accent-red)]">
          <Icon name={isLiked ? 'favorite' : 'favorite_border'} className={`text-2xl ${isLiked ? 'text-[var(--color-accent-red)]' : ''}`} />
          <span className="font-semibold text-sm">{likeCount.toLocaleString('pt-BR')}</span>
        </button>
        <div className="flex items-center space-x-1 text-slate-600">
            <Icon name="chat_bubble_outline" className="text-2xl" />
            <span className="font-semibold text-sm">{noticia.comments.length}</span>
        </div>
        <button onClick={handleShareClick} className="flex items-center space-x-1 text-slate-600 hover:text-[var(--color-primary)]">
            <Icon name="share" className="text-2xl" />
        </button>
      </div>
    </Card>
  );
};

const NoticiasList: React.FC<NoticiasListProps> = ({ navigateTo }) => {
  const { data: noticias, loading } = useNoticias();
  const { addToast } = useToast();

  const handleShare = async (noticia: Noticia) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: noticia.title,
                text: noticia.summary,
                url: noticia.link,
            });
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Error sharing', error);
                addToast('Não foi possível compartilhar a notícia.', 'error');
            }
        }
    } else {
        try {
            await navigator.clipboard.writeText(noticia.link);
            addToast('Link da notícia copiado!', 'info');
        } catch (err) {
            console.error('Failed to copy link: ', err);
            addToast('Não foi possível copiar o link.', 'error');
        }
    }
  };

  const sortedNoticias = noticias ? [...noticias].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Últimas Notícias</h2>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <NoticiaSkeletonItem />
          <NoticiaSkeletonItem />
        </div>
      ) : sortedNoticias.length > 0 ? (
        <div className="space-y-4">
          {sortedNoticias.map(noticia => (
            <NoticiaItem 
              key={noticia.id} 
              noticia={noticia} 
              onClick={() => navigateTo('NOTICIA_DETAIL', { noticiaId: noticia.id })}
              onShare={() => handleShare(noticia)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-slate-600">Nenhuma notícia encontrada.</p>
        </Card>
      )}
    </div>
  );
};

export default NoticiasList;