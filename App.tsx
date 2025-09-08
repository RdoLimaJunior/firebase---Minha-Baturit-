import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProtocolosList from './components/protocolos/ProtocolosList';
import ProtocoloDetail from './components/protocolos/ProtocoloDetail';
import ProtocoloForm from './components/protocolos/ProtocoloForm';
import NoticiasList from './components/noticias/NoticiasList';
import NoticiaDetail from './components/noticias/NoticiaDetail';
import SecretariasList from './components/secretarias/SecretariasList';
import MapaServicos from './components/mapa/MapaServicos';
import TurismoDashboard from './components/turismo/TurismoDashboard';
import TurismoList from './components/turismo/TurismoList';
import TurismoDetail from './components/turismo/TurismoDetail';
import ContatosList from './components/contatos/ContatosList';
import ServicosOnlineDashboard from './components/servicos/ServicosOnlineDashboard';
import ServicoForm from './components/servicos/ServicoForm';
import AgendamentosList from './components/agendamentos/AgendamentosList';
import NotificacoesList from './components/notificacoes/NotificacoesList';
import Acessibilidade from './components/acessibilidade/Acessibilidade';
import { View, TurismoCategoria, UserProfile } from './types';
import { ToastProvider } from './components/ui/Toast';
import BottomNav from './components/BottomNav';
import ServicosDashboard from './components/servicos/ServicosDashboard';
import MoreDashboard from './components/more/MoreDashboard';
import Search from './components/search/Search';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import ParticipacaoFeed from './components/participacao/ParticipacaoFeed';
import ParticipacaoDetail from './components/participacao/ParticipacaoDetail';
import ParticipacaoForm from './components/participacao/ParticipacaoForm';
import ConsultasPublicasList from './components/consultas/ConsultasPublicasList';
import ConsultaPublicaDetail from './components/consultas/ConsultaPublicaDetail';
import PrediosPorCategoriaList from './components/predios/PrediosPorCategoriaList';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Spinner from './components/ui/Spinner';

const GUEST_PROFILE: UserProfile = {
    uid: 'guest-user',
    displayName: 'Visitante',
    email: null,
    photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=Visitante`,
};

const AppContent: React.FC = () => {
  const { user, loading, isGuest } = useAuth();
  const [view, setView] = useState<View>('DASHBOARD');
  const [activeProtocoloId, setActiveProtocoloId] = useState<string | null>(null);
  const [activeNoticiaId, setActiveNoticiaId] = useState<string | null>(null);
  const [activeTurismoId, setActiveTurismoId] = useState<string | null>(null);
  const [activeTurismoCategoria, setActiveTurismoCategoria] = useState<TurismoCategoria | null>(null);
  const [activeServicoId, setActiveServicoId] = useState<string | null>(null);
  const [activePublicacaoId, setActivePublicacaoId] = useState<string | null>(null);
  const [activeConsultaId, setActiveConsultaId] = useState<string | null>(null);
  const [activeViewParams, setActiveViewParams] = useState<any>(null);
  
  const navigateTo = useCallback((newView: View, params: { [key: string]: any } | any = null) => {
    setView(newView);
    setActiveProtocoloId(params?.protocoloId || null);
    setActiveNoticiaId(params?.noticiaId || null);
    setActiveTurismoId(params?.turismoId || null);
    setActiveTurismoCategoria(params?.turismoCategoria || null);
    setActiveServicoId(params?.servicoId || null);
    setActivePublicacaoId(params?.publicacaoId || null);
    setActiveConsultaId(params?.consultaId || null);
    setActiveViewParams(params);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as View;

    if (viewParam) {
      const queryParams: { [key: string]: any } = {};
      params.forEach((value, key) => {
        if (key !== 'view') {
          queryParams[key] = value;
        }
      });

      navigateTo(viewParam, queryParams);

      // Clean URL after navigation to avoid re-triggering on refresh
      if (window.history.replaceState) {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [navigateTo]);

  const handleBottomNav = (view: View) => {
    navigateTo(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const currentUser = user || (isGuest ? GUEST_PROFILE : null);

  if (!currentUser) {
    return <Login />;
  }
  
  const renderView = () => {
    switch (view) {
      case 'DASHBOARD':
        return <Dashboard navigateTo={navigateTo} userProfile={currentUser} />;
      case 'PROTOCOLOS_LIST':
        return <ProtocolosList navigateTo={navigateTo} />;
      case 'PROTOCOLO_DETAIL':
        return activeProtocoloId ? <ProtocoloDetail protocoloId={activeProtocoloId} goBack={() => navigateTo('PROTOCOLOS_LIST')} /> : <Dashboard navigateTo={navigateTo} userProfile={currentUser} />;
      case 'PROTOCOLO_FORM':
        return <ProtocoloForm goBack={() => navigateTo('SERVICOS_DASHBOARD')} navigateTo={navigateTo} userProfile={currentUser} />;
      case 'NOTICIAS_LIST':
        return <NoticiasList navigateTo={navigateTo} />;
      case 'NOTICIA_DETAIL':
        return activeNoticiaId ? <NoticiaDetail noticiaId={activeNoticiaId} navigateTo={navigateTo} currentUser={currentUser} /> : <NoticiasList navigateTo={navigateTo} />;
      case 'SECRETARIAS_LIST':
        return <SecretariasList navigateTo={navigateTo} />;
      case 'MAPA_SERVICOS':
        return <MapaServicos navigateTo={navigateTo} {...activeViewParams} />;
      case 'TURISMO_DASHBOARD':
        return <TurismoDashboard navigateTo={navigateTo} />;
      case 'TURISMO_LIST':
        return activeTurismoCategoria ? <TurismoList categoria={activeTurismoCategoria} navigateTo={navigateTo} /> : <TurismoDashboard navigateTo={navigateTo} />;
      case 'TURISMO_DETAIL':
        return activeTurismoId && activeTurismoCategoria ? <TurismoDetail turismoId={activeTurismoId} categoria={activeTurismoCategoria} navigateTo={navigateTo} /> : <TurismoDashboard navigateTo={navigateTo} />;
      case 'CONTATOS_LIST':
        return <ContatosList navigateTo={navigateTo} />;
      case 'SERVICOS_ONLINE_DASHBOARD':
        return <ServicosOnlineDashboard navigateTo={navigateTo} />;
      case 'SERVICO_FORM':
        return activeServicoId ? <ServicoForm servicoId={activeServicoId} goBack={() => navigateTo('SERVICOS_ONLINE_DASHBOARD')} userProfile={currentUser}/> : <ServicosOnlineDashboard navigateTo={navigateTo} />;
      case 'AGENDAMENTOS_LIST':
        return <AgendamentosList navigateTo={navigateTo} />;
      case 'NOTIFICACOES_LIST':
        return <NotificacoesList navigateTo={navigateTo} />;
      case 'SERVICOS_DASHBOARD':
        return <ServicosDashboard navigateTo={navigateTo} />;
      case 'MAIS_DASHBOARD':
        return <MoreDashboard navigateTo={navigateTo} />;
      case 'SEARCH':
        return <Search navigateTo={navigateTo} />;
      case 'ACESSIBILIDADE':
        return <Acessibilidade navigateTo={navigateTo} />;
      case 'PARTICIPACAO_FEED':
        return <ParticipacaoFeed navigateTo={navigateTo} />;
      case 'PARTICIPACAO_DETAIL':
        return activePublicacaoId ? <ParticipacaoDetail publicacaoId={activePublicacaoId} navigateTo={navigateTo} currentUser={currentUser} /> : <ParticipacaoFeed navigateTo={navigateTo} />;
      case 'PARTICIPACAO_FORM':
        return <ParticipacaoForm goBack={() => navigateTo('PARTICIPACAO_FEED')} userProfile={currentUser} />;
      case 'CONSULTAS_PUBLICAS_LIST':
        return <ConsultasPublicasList navigateTo={navigateTo} />;
      case 'CONSULTAS_PUBLICAS_DETAIL':
        return activeConsultaId ? <ConsultaPublicaDetail consultaId={activeConsultaId} navigateTo={navigateTo} currentUser={currentUser} /> : <ConsultasPublicasList navigateTo={navigateTo} />;
      case 'PREDIOS_POR_CATEGORIA_LIST':
        return activeViewParams ? <PrediosPorCategoriaList navigateTo={navigateTo} {...activeViewParams} /> : <MoreDashboard navigateTo={navigateTo} />;
      default:
        return <Dashboard navigateTo={navigateTo} userProfile={currentUser} />;
    }
  };
  
  const isDashboard = view === 'DASHBOARD';

  const mainContainerClass = isDashboard
    ? "flex-grow flex flex-col pb-20"
    : "flex-grow container mx-auto p-4 pb-20";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header activeProfile={currentUser} navigateTo={navigateTo}/>
      
      <main className={mainContainerClass}>
        {renderView()}
      </main>
      
      <BottomNav navigateTo={handleBottomNav} currentView={view} />
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerServiceWorker = () => {
        // Construct an absolute URL for the service worker.
        // This prevents cross-origin errors in environments where relative paths
        // are resolved against a different origin than the main document.
        const swUrl = new URL('service-worker.js', window.location.origin).href;
        navigator.serviceWorker.register(swUrl)
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      };

      // The 'load' event might have already fired by the time this useEffect runs.
      // So we check the document.readyState.
      if (document.readyState === 'complete') {
        registerServiceWorker();
      } else {
        window.addEventListener('load', registerServiceWorker);
        // Cleanup listener if component unmounts before load event
        return () => window.removeEventListener('load', registerServiceWorker);
      }
    }
  }, []);
  
  return (
    <AccessibilityProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </AccessibilityProvider>
  );
};

export default App;