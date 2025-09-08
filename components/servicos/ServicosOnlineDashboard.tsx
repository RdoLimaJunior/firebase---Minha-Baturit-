import React, { useMemo } from 'react';
import { useServicosOnline } from '../../hooks/useMockData';
import { ServicoOnline, CategoriaServicoOnline, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ServicosOnlineDashboardProps {
  navigateTo: (view: View, params?: { servicoId?: string }) => void;
}

const ServicoItem: React.FC<{ servico: ServicoOnline; onAgendar: () => void; }> = ({ servico, onAgendar }) => (
  <Card className="!p-4">
    <div className="flex items-center space-x-4">
      <Icon name={servico.icon} className="text-3xl text-[var(--color-primary)]" />
      <div className="flex-1">
        <h3 className="font-bold text-slate-800">{servico.nome}</h3>
        <p className="text-sm text-slate-600">{servico.descricao}</p>
      </div>
      <Button size="sm" onClick={onAgendar} className="whitespace-nowrap">Agendar</Button>
    </div>
  </Card>
);

// Lista de serviços externos com títulos, links e ícones correspondentes.
const servicosExternos = [
  {
    title: 'Contra Cheques',
    link: 'https://layoutonline.layoutsistemas.com.br/login',
    icon: 'receipt_long',
  },
  {
    title: 'Plano Municipal de Saneamento Básico',
    link: 'https://www.baturite.ce.gov.br/publicacoes.php',
    icon: 'water_drop',
  },
  {
    title: 'Portal do Contribuinte',
    link: 'https://www.xtronline.com.br/ce/baturite/',
    icon: 'paid',
  },
  {
    title: 'Chamamento Público',
    link: 'https://www.baturite.ce.gov.br/publicacoes.php?cat=27&Comp=&Exer=&dtini=&dtfim=&Num=&ta=3',
    icon: 'campaign',
  },
];

// Componente para renderizar um item da lista de serviços externos.
const ServicoExternoItem: React.FC<{ title: string; link: string; icon: string; }> = ({ title, link, icon }) => {
    const handleOpenLink = () => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card onClick={handleOpenLink} className="!p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Icon name={icon} className="text-3xl text-[var(--color-primary)]" />
                <h3 className="font-bold text-slate-800">{title}</h3>
            </div>
            <Icon name="open_in_new" className="text-slate-400" />
        </Card>
    );
};


const ServicosOnlineDashboard: React.FC<ServicosOnlineDashboardProps> = ({ navigateTo }) => {
  const { data: servicos, loading } = useServicosOnline();

  const groupedServicos = useMemo(() => {
    if (!servicos) return {};
    return servicos.reduce((acc, servico) => {
        (acc[servico.categoria] = acc[servico.categoria] || []).push(servico);
        return acc;
    }, {} as Record<CategoriaServicoOnline, ServicoOnline[]>);
  }, [servicos]);

  const categoryOrder: CategoriaServicoOnline[] = [
      CategoriaServicoOnline.ASSISTENCIA,
      CategoriaServicoOnline.TRIBUTOS,
      CategoriaServicoOnline.EDUCACAO,
      CategoriaServicoOnline.SAUDE,
      CategoriaServicoOnline.OUTROS,
  ];

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('SERVICOS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Serviços Online</h2>
      </div>
      
      <p className="text-slate-600 px-1">
        Agende atendimentos presenciais ou acesse portais e informações importantes da prefeitura.
      </p>

      {groupedServicos && (
        <div className="space-y-6">
          {categoryOrder.map(category => {
            if (groupedServicos[category]?.length > 0) {
              return (
                <section key={category}>
                  <h3 className="text-lg font-bold text-slate-700 mb-2 pl-1">{category}</h3>
                  <div className="space-y-3">
                    {groupedServicos[category].map(servico => (
                      <ServicoItem key={servico.id} servico={servico} onAgendar={() => navigateTo('SERVICO_FORM', { servicoId: servico.id })} />
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>
      )}

      <section className="pt-4">
          <h3 className="text-lg font-bold text-slate-700 mb-2 pl-1">Acesso Rápido</h3>
          <div className="space-y-3">
            {servicosExternos.map(servico => (
              <ServicoExternoItem 
                  key={servico.title} 
                  title={servico.title}
                  link={servico.link}
                  icon={servico.icon}
              />
            ))}
          </div>
      </section>
    </div>
  );
};

export default ServicosOnlineDashboard;