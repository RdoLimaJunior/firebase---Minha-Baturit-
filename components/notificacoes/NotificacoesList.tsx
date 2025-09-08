import React, { useState, useEffect } from 'react';
import { useNotificacoes } from '../../hooks/useMockData';
import { Notificacao, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { timeSince } from '../../utils/helpers';
import { useToast } from '../ui/Toast';
import { usePushNotifications } from '../../hooks/usePushNotifications';

interface NotificacoesListProps {
  navigateTo: (view: View, params?: any) => void;
}

const NotificacaoSkeletonItem: React.FC = () => (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="w-8 h-8 rounded-full bg-gray-200 mt-1"></div>
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
            <div className="h-2 bg-gray-200 rounded w-1/4 pt-2"></div>
        </div>
    </div>
);

const getIconForNotificacao = (notificacao: Notificacao) => {
    if (notificacao.titulo.toLowerCase().includes('lembrete')) {
        return { icon: 'event_available', color: 'text-[var(--color-primary)]' };
    }
    if (notificacao.titulo.toLowerCase().includes('protocolo')) {
        return { icon: 'list_alt', color: 'text-[var(--color-accent-green)]' };
    }
    return { icon: 'notifications', color: 'text-gray-500' };
};

const NotificacaoItem: React.FC<{ notificacao: Notificacao; onClick: () => void; }> = ({ notificacao, onClick }) => {
    const { icon, color } = getIconForNotificacao(notificacao);

    return (
        <div 
            onClick={onClick}
            className={`flex items-start space-x-4 p-4 border-l-4 ${notificacao.lida ? 'border-transparent bg-white' : 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'} rounded-r-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors`}
        >
            <Icon name={icon} className={`text-3xl mt-1 ${color}`} />
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">{notificacao.titulo}</h3>
                <p className="text-sm text-gray-600 mt-1">{notificacao.mensagem}</p>
                <p className="text-xs text-gray-400 mt-2">{timeSince(notificacao.data)}</p>
            </div>
        </div>
    );
};

const NotificacoesList: React.FC<NotificacoesListProps> = ({ navigateTo }) => {
  const { data: notificacoes, loading } = useNotificacoes();
  const [listaNotificacoes, setListaNotificacoes] = useState<Notificacao[]>([]);
  const { addToast } = useToast();
  const { 
    isSubscribed, 
    subscribe, 
    unsubscribe, 
    isLoading: isLoadingSubscription 
  } = usePushNotifications();
  
  useEffect(() => {
    if (notificacoes) {
        const sorted = [...notificacoes].sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        setListaNotificacoes(sorted);
    }
  }, [notificacoes]);

  const handleNotificationClick = (notificacao: Notificacao) => {
    setListaNotificacoes(prev => 
        prev.map(n => n.id === notificacao.id ? { ...n, lida: true } : n)
    );
    if (notificacao.link) {
      navigateTo(notificacao.link.view, notificacao.link.params);
    }
  };
  
  const markAllAsRead = () => {
      setListaNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
      addToast('Todas as notificações foram marcadas como lidas.', 'success');
  };

  const handleToggleSubscription = () => {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  const handleTestNotification = async () => {
    if (!('serviceWorker' in navigator) || !('showNotification' in ServiceWorkerRegistration.prototype)) {
        addToast('Notificações não são suportadas neste navegador.', 'error');
        return;
    }
    try {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Teste de Notificação', {
            body: 'Se você vê isso, as notificações estão funcionando!',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bras%C3%A3o_de_Baturit%C3%A9_-_CE.svg',
            badge: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bras%C3%A3o_de_Baturit%C3%A9_-_CE.svg'
        });
    } catch (error) {
        console.error('Erro ao mostrar notificação de teste:', error);
        addToast('Erro ao exibir notificação de teste.', 'error');
    }
  };

  const unreadCount = listaNotificacoes.filter(n => !n.lida).length;

  if (loading) {
      return (
          <div className="space-y-4">
              <div className="flex justify-between items-center animate-pulse">
                  <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="!bg-gray-200" disabled><Icon name="arrow_back" className="text-transparent" /></Button>
                      <div className="h-8 w-40 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-8 w-32 rounded-lg bg-gray-200"></div>
              </div>
              <div className="space-y-3 pt-2">
                  {[...Array(4)].map((_, i) => <NotificacaoSkeletonItem key={i} />)}
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Button onClick={() => navigateTo('DASHBOARD')} variant="ghost" size="icon">
              <Icon name="arrow_back" />
            </Button>
            <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
        </div>
        {unreadCount > 0 && (
            <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                Marcar todas como lidas
            </Button>
        )}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Notificações Push</h3>
            <p className="text-sm text-gray-600 mt-1">
              Receba alertas sobre seus protocolos e novidades.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
            <Button 
              onClick={handleToggleSubscription} 
              disabled={isLoadingSubscription}
              className="flex-grow"
              variant={isSubscribed ? 'secondary' : 'primary'}
            >
              {isLoadingSubscription ? 'Verificando...' : isSubscribed ? 'Desativar' : 'Ativar'}
            </Button>
            {isSubscribed && (
              <Button 
                onClick={handleTestNotification}
                variant="secondary"
                size="icon"
                aria-label="Testar notificação"
              >
                <Icon name="notifications_active" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {listaNotificacoes.length > 0 ? (
        <div className="space-y-3">
          {listaNotificacoes.map(notificacao => (
            <NotificacaoItem 
                key={notificacao.id} 
                notificacao={notificacao} 
                onClick={() => handleNotificationClick(notificacao)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-10">
            <Icon name="notifications_off" className="text-5xl text-gray-400 mx-auto" />
            <p className="text-gray-600 mt-4">Você não tem nenhuma notificação.</p>
        </Card>
      )}
    </div>
  );
};

export default NotificacoesList;