import React, { useState } from 'react';
import Icon from './ui/Icon';
import { UserProfile, View } from '../types';
import { useCollection } from '../hooks/useFirestore';
import { Notificacao } from '../types';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';

interface HeaderProps {
    activeProfile: UserProfile;
    navigateTo: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeProfile, navigateTo }) => {
  const { data: notificacoes } = useCollection<Notificacao>('notificacoes'); // Assumindo que as notificações estão em uma coleção
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const unreadCount = notificacoes?.filter(n => !n.lida).length || 0;

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10 flex-shrink-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('DASHBOARD')}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Bras%C3%A3o_de_Baturit%C3%A9_-_CE.svg" 
            alt="Brasão de Baturité" 
            className="h-10"
          />
          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Minha <span className="text-indigo-600">Baturité</span></h1>
        </div>
        <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateTo('SEARCH')}
              className="p-2 rounded-full hover:bg-slate-100"
              aria-label="Buscar"
            >
              <Icon name="search" className="text-slate-500 text-2xl" />
            </button>
            <button
              onClick={() => navigateTo('ACESSIBILIDADE')}
              className="p-2 rounded-full hover:bg-slate-100"
              aria-label="Acessibilidade"
            >
              <Icon name="accessibility_new" className="text-slate-500 text-2xl" />
            </button>
            <button 
              onClick={() => navigateTo('NOTIFICACOES_LIST')} 
              className="p-2 rounded-full hover:bg-slate-100 relative"
              aria-label={`Notificações. ${unreadCount} não lidas.`}
            >
              <Icon name="notifications" className="text-slate-500 text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 block w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100">
                    <img src={activeProfile.photoURL || 'https://i.pravatar.cc/150?u=default'} alt="Avatar" className="w-8 h-8 rounded-full"/>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-slate-700">{activeProfile.displayName}</p>
                        <p className="text-xs text-slate-500">{activeProfile.email}</p>
                    </div>
                    <Icon name={menuOpen ? "expand_less" : "expand_more"} className="text-slate-500" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                        <Button 
                            onClick={logout}
                            variant="ghost"
                            className="w-full !justify-start"
                            iconLeft="logout"
                        >
                            Sair
                        </Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;