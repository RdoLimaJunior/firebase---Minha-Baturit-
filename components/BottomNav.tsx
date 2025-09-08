import React from 'react';
import Icon from './ui/Icon';
import { View } from '../types';

interface BottomNavProps {
  navigateTo: (view: View) => void;
  currentView: View;
}

const NavItem: React.FC<{ icon: string; label: string; view: View; isActive: boolean; onClick: (view: View) => void; }> = ({ icon, label, view, isActive, onClick }) => {
  const activeClasses = 'text-[var(--color-primary)]';
  const inactiveClasses = 'text-slate-500 hover:text-slate-800';
  return (
    <button onClick={() => onClick(view)} className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon name={icon} className="text-2xl" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ navigateTo, currentView }) => {
  const mainNavItems = [
    { icon: 'home', label: 'Início', view: 'DASHBOARD' as View },
    { icon: 'apps', label: 'Serviços', view: 'SERVICOS_DASHBOARD' as View },
    // FIX: Add icon and label to the central button item to ensure a consistent object shape within the array, resolving a TypeScript error.
    // Placeholder for the central button
    { icon: 'campaign', label: 'Participar', view: 'PARTICIPACAO_FEED' as View },
    { icon: 'map', label: 'Mapa', view: 'MAPA_SERVICOS' as View },
    { icon: 'more_horiz', label: 'Mais', view: 'MAIS_DASHBOARD' as View },
  ];
  
  const isViewActive = (view: View) => {
    if (currentView === view) return true;

    const servicosViews: View[] = [
      'PROTOCOLOS_LIST', 'PROTOCOLO_DETAIL', 'PROTOCOLO_FORM',
      'SERVICOS_ONLINE_DASHBOARD', 'SERVICO_FORM', 'AGENDAMENTOS_LIST'
    ];
    if (view === 'SERVICOS_DASHBOARD' && servicosViews.includes(currentView)) return true;

    const maisViews: View[] = [
      'TURISMO_DASHBOARD', 'TURISMO_LIST', 'TURISMO_DETAIL',
      'NOTICIAS_LIST', 'NOTICIA_DETAIL', 'SECRETARIAS_LIST', 'CONTATOS_LIST'
    ];
    if (view === 'MAIS_DASHBOARD' && maisViews.includes(currentView)) return true;

    const participacaoViews: View[] = ['PARTICIPACAO_DETAIL', 'PARTICIPACAO_FORM'];
    if (view === 'PARTICIPACAO_FEED' && participacaoViews.includes(currentView)) return true;
    
    return false;
  };

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 flex justify-around items-center h-16">
        {mainNavItems.map((item, index) => {
          if (index === 2) { // Central button
            const isActive = isViewActive(item.view);
            return (
              <div key={item.view} className="w-1/5 flex justify-center">
                  <button 
                    onClick={() => navigateTo(item.view)} 
                    className={`-translate-y-5 w-[4.5rem] h-[4.5rem] rounded-full flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105 bg-[var(--color-primary)] text-white hover:bg-opacity-90`}
                    aria-label="Participar da Cidade"
                  >
                      <Icon name="campaign" className="text-2xl" />
                      <span className="text-xs font-bold tracking-tighter">Participar</span>
                  </button>
              </div>
            );
          }
          return (
            <div key={item.view} className="w-1/5">
              <NavItem 
                {...item}
                isActive={isViewActive(item.view)}
                onClick={navigateTo}
              />
            </div>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNav;