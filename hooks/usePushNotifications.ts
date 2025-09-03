import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';

// A chave pública VAPID identifica o servidor de aplicação que envia as notificações push.
// Em um app real, esta chave deve ser gerada e armazenada de forma segura no backend.
const VAPID_PUBLIC_KEY = 'BCqVfW-5Y-4eG5g-jhi3DKc5Yd23gSo_xX2s8wS-GqdpJjA9XZa3q2sZ8c8y3J8f6h9n-j2k3lZ1f8sY4-zJ9Yw';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const usePushNotifications = () => {
  const { addToast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const sub = await registration.pushManager.getSubscription();
          if (sub) {
            setIsSubscribed(true);
            setSubscription(sub);
          }
        } catch (error) {
          console.error('Erro ao verificar inscrição de notificação push:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    checkSubscription();
  }, []);

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        addToast('Notificações push não são suportadas neste navegador.', 'error');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        
        if (permission !== 'granted') {
            addToast('Permissão para notificações não concedida.', 'info');
            return;
        }

        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        // Em um app real, você enviaria este objeto de inscrição para o seu backend.
        console.log('Inscrição Push:', JSON.stringify(sub));
        // Ex: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(sub), headers: { 'Content-Type': 'application/json' } });

        addToast('Notificações push ativadas!', 'success');
        setIsSubscribed(true);
        setSubscription(sub);
    } catch (error) {
        console.error('Falha ao se inscrever para notificações push:', error);
        addToast('Falha ao ativar notificações.', 'error');
    }
  }, [addToast]);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;
    try {
        await subscription.unsubscribe();
        
        // Em um app real, você notificaria seu backend para remover a inscrição.
        console.log('Inscrição push removida.');
        // Ex: await fetch('/api/unsubscribe', { method: 'POST', body: JSON.stringify({ endpoint: subscription.endpoint }), headers: { 'Content-Type': 'application/json' } });
        
        addToast('Notificações push desativadas.', 'info');
        setIsSubscribed(false);
        setSubscription(null);
    } catch (error) {
        console.error('Falha ao remover inscrição push:', error);
        addToast('Falha ao desativar notificações.', 'error');
    }
  }, [addToast, subscription]);

  return { isSubscribed, subscribe, unsubscribe, isLoading };
};
