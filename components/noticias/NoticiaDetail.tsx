import React, { useState } from 'react';
import { useNoticiaById } from '../../hooks/useMockData';
import { Comment, Noticia, View, UserProfile } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { MOCK_USER_PROFILES } from '../../constants';

interface NoticiaDetailProps {
  noticiaId: string;
  navigateTo: (view: View) => void;
  currentUser: UserProfile;
}

const NoticiaDetail: React.FC<NoticiaDetailProps> = ({ noticiaId, navigateTo, currentUser }) => {
  const { data: noticia, loading } = useNoticiaById(noticiaId);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(noticia?.likes || 0);
  const [comments, setComments] = useState<Comment[]>(noticia?.comments || []);
  const [newComment, setNewComment] = useState('');
  const isGuest = currentUser.uid === 'guest-user';

  const { addToast } = useToast();

  React.useEffect(() => {
    if (noticia) {
      setLikeCount(noticia.likes);
      setComments(noticia.comments);
    }
  }, [noticia]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share && noticia) {
        try {
            await navigator.share({
                title: noticia.title,
                text: noticia.summary,
                url: noticia.link,
            });
        } catch (error) {
            // Don't show an error if the user cancels the share dialog
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Share cancelled by user.');
            } else {
                console.error('Error sharing', error);
                addToast('Não foi possível compartilhar a notícia.', 'error');
            }
        }
    } else if (noticia) {
        // Fallback for browsers that do not support the Web Share API
        try {
            await navigator.clipboard.writeText(noticia.link);
            addToast('Link da notícia copiado para a área de transferência!', 'info');
        } catch (err) {
            console.error('Failed to copy link: ', err);
            addToast('Não foi possível copiar o link.', 'error');
        }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest || !newComment.trim()) {
        if(isGuest) addToast('Você precisa fazer login para comentar.', 'error');
        return;
    }
    
    const commentToAdd: Comment = {
        id: `c${Date.now()}`,
        author: {
            uid: currentUser.uid,
            name: currentUser.displayName || 'Usuário',
            avatar: currentUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.displayName}`,
        },
        text: newComment,
        date: new Date().toISOString(),
    };
    setComments(prev => [...prev, commentToAdd]);
    setNewComment('');
    addToast('Comentário adicionado!', 'success');
  };

  if (loading) return <Spinner />;
  if (!noticia) return <Card><p>Notícia não encontrada.</p></Card>;

  return (
    <div className="space-y-4">
        <Button onClick={() => navigateTo('NOTICIAS_LIST')} variant="ghost" iconLeft="arrow_back">Voltar para Notícias</Button>
        <Card className="!p-0">
            <div className="p-4 flex items-center space-x-3">
                 <img src="https://www.baturite.ce.gov.br/imagens/logo-prefeitura-de-baturite.png" alt="Logo" className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                 <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Prefeitura de Baturité</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(noticia.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
                 </div>
            </div>
            <img src={noticia.imageUrl} alt={noticia.title} className="w-full h-auto max-h-96 object-cover" />
            <div className="p-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{noticia.title}</h2>
                <p className="text-slate-700 dark:text-slate-200 mt-2">{noticia.summary}</p>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-4">
                    <button onClick={handleLike} className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-red-500">
                        <Icon name={isLiked ? 'favorite' : 'favorite_border'} className={`text-3xl ${isLiked ? 'text-red-500' : ''}`} />
                        <span className="font-semibold text-sm">{likeCount.toLocaleString('pt-BR')}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                        <Icon name="chat_bubble_outline" className="text-3xl" />
                        <span className="font-semibold text-sm">{comments.length}</span>
                    </div>
                    <button onClick={handleShare} className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400">
                        <Icon name="share" className="text-3xl" />
                    </button>
                </div>
            </div>
        </Card>
        
        <Card>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Comentários</h3>
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                            <img src={comment.author.avatar} alt={comment.author.name} className="w-9 h-9 rounded-full"/>
                            <div>
                                <p className="text-sm">
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">{comment.author.name}</span>
                                    <span className="text-slate-600 dark:text-slate-300 ml-2">{comment.text}</span>
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{new Date(comment.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                )}
            </div>
            <form onSubmit={handleAddComment} className="mt-6 flex items-center space-x-2">
                <img src={currentUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.displayName || 'User'}`} alt="Seu avatar" className="w-9 h-9 rounded-full"/>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isGuest ? "Faça login para comentar" : "Adicione um comentário..."}
                    className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-full focus:ring-indigo-600 focus:border-indigo-600 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    disabled={isGuest}
                />
                <Button type="submit" size="icon" disabled={!newComment.trim() || isGuest}>
                    <Icon name="send"/>
                </Button>
            </form>
        </Card>
    </div>
  );
};

export default NoticiaDetail;