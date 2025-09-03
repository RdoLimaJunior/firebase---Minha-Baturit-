import React from 'react';
import { View, CategoriaPredioPublico } from '../../types';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

const infoItems: { view: View; icon: string; title: string; }[] = [
    { view: 'NOTICIAS_LIST', icon: 'feed', title: 'Notícias' },
    { view: 'SECRETARIAS_LIST', icon: 'account_balance', title: 'Secretarias' },
    { view: 'TURISMO_DASHBOARD', icon: 'theater_comedy', title: 'Cultura e Turismo' },
    { view: 'CONTATOS_LIST', icon: 'contact_phone', title: 'Contatos Úteis' },
];

const servicosPublicosItems: { view: View; icon: string; title: string; params: any }[] = [
    { 
      view: 'PREDIOS_POR_CATEGORIA_LIST', 
      icon: 'local_hospital', 
      title: 'Unidades de Saúde',
      params: { 
        categoria: 'Saúde' as CategoriaPredioPublico,
        titulo: 'Unidades de Saúde', 
        icon: 'local_hospital',
        goBackView: 'MAIS_DASHBOARD' as View,
      }
    },
    { 
      view: 'PREDIOS_POR_CATEGORIA_LIST', 
      icon: 'school', 
      title: 'Unidades Escolares',
      params: { 
        categoria: 'Educação' as CategoriaPredioPublico,
        titulo: 'Unidades Escolares', 
        icon: 'school',
        goBackView: 'MAIS_DASHBOARD' as View,
      }
    },
    { 
      view: 'PREDIOS_POR_CATEGORIA_LIST', 
      icon: 'groups', 
      title: 'Assistência Social',
      params: { 
        categoria: 'Assistência Social' as CategoriaPredioPublico, 
        titulo: 'Unidades de Assistência Social', 
        icon: 'groups',
        goBackView: 'MAIS_DASHBOARD' as View,
      }
    },
];

const settingsItems: { view: View; icon: string; title: string }[] = [
    { view: 'ACESSIBILIDADE', icon: 'accessibility_new', title: 'Acessibilidade' },
];

const ListItem: React.FC<{ icon: string; title: string; onClick: () => void }> = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
        <div className="flex items-center space-x-4">
            <Icon name={icon} className="text-2xl text-slate-600" />
            <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <Icon name="chevron_right" className="text-slate-400" />
    </button>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.902 4.902 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122s-.013 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.556.556-1.112.9-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06s-3.056-.013-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12s.013-3.056.06-4.122c.05-1.065.217-1.79.465-2.428a4.883 4.883 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 2c-2.67 0-2.987.01-4.043.058-1.002.048-1.595.212-2.076.385a2.89 2.89 0 00-1.15 1.15c-.173.48-.337 1.073-.385 2.076-.048 1.056-.058 1.373-.058 4.043s.01 2.987.058 4.043c.048 1.002.212 1.595.385 2.076.173.481.417.86.748 1.15a2.895 2.895 0 001.15.748c.48.173 1.073.337 2.076.385 1.056.048 1.373.058 4.043.058s2.987-.01 4.043-.058c1.002-.048 1.595-.212 2.076-.385a2.89 2.89 0 001.15-1.15.938.938 0 00.218-.385c.173-.48.337-1.073.385-2.076.048-1.056.058-1.373.058-4.043s-.01-2.987-.058-4.043c-.048-1.002-.212-1.595-.385-2.076a2.89 2.89 0 00-1.15-1.15c-.481-.173-1.073-.337-2.076-.385C14.987 4.01 14.67 4 12 4zm0 4.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.5a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zM16.5 6.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
  </svg>
);

const YouTubeIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/>
    </svg>
);

interface MoreDashboardProps {
  navigateTo: (view: View, params?: any) => void;
}

const MoreDashboard: React.FC<MoreDashboardProps> = ({ navigateTo }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Mais Opções</h2>
      
      <div className="space-y-4 pt-2">
        <Card>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider px-3 pb-2">Informações</h3>
            <div className="divide-y divide-slate-100">
                {infoItems.map(item => <ListItem key={item.title} {...item} onClick={() => navigateTo(item.view)} />)}
            </div>
        </Card>
        
        <Card>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider px-3 pb-2">Serviços Públicos</h3>
            <div className="divide-y divide-slate-100">
                {servicosPublicosItems.map(item => <ListItem key={item.title} {...item} onClick={() => navigateTo(item.view, item.params)} />)}
            </div>
        </Card>
        
        <Card>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider px-3 pb-2">Configurações</h3>
            <div className="divide-y divide-slate-100">
                {settingsItems.map(item => <ListItem key={item.title} {...item} onClick={() => navigateTo(item.view)} />)}
            </div>
        </Card>

        <Card>
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Redes Sociais</h3>
            <div className="flex justify-center flex-wrap gap-x-8 gap-y-4">
                <a href="https://www.facebook.com/Governo-Municipal-de-Baturit%C3%A9-104660501581546" target="_blank" rel="noopener noreferrer" title="Facebook" className="text-slate-500 hover:text-slate-800 transition-colors">
                    <FacebookIcon />
                </a>
                <a href="https://www.instagram.com/prefeitura.baturite/" target="_blank" rel="noopener noreferrer" title="Instagram" className="text-slate-500 hover:text-slate-800 transition-colors">
                    <InstagramIcon />
                </a>
                <a href="https://www.youtube.com/channel/UCyuBX70YG6fs4aN-cwKfECA" target="_blank" rel="noopener noreferrer" title="YouTube" className="text-slate-500 hover:text-slate-800 transition-colors">
                    <YouTubeIcon />
                </a>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default MoreDashboard;