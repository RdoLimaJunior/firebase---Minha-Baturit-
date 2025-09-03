// service-worker.js

// Escuta pelo evento de instalação do service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
});

// Escuta pelo evento de ativação do service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
});

// Escuta por eventos de push recebidos do servidor
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Recebido.');
  
  const pushData = event.data?.json() ?? {
    title: 'Minha Baturité',
    body: 'Você tem uma nova notificação!',
  };

  const title = pushData.title;
  const options = {
    body: pushData.body,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bras%C3%A3o_de_Baturit%C3%A9_-_CE.svg',
    badge: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bras%C3%A3o_de_Baturit%C3%A9_-_CE.svg'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Escuta por cliques na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Foca na janela existente do app ou abre uma nova
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
