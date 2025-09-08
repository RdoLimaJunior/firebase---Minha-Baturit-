import React, { useState, useMemo } from 'react';
import { useAgendamentos } from '../../hooks/useMockData';
import { Agendamento, AgendamentoStatus, View } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import CalendarView from './CalendarView';

interface AgendamentosListProps {
  navigateTo: (view: View) => void;
}

const AgendamentoSkeletonItem: React.FC = () => (
    <Card className="animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3 w-3/4">
                <div className="w-7 h-7 rounded-md bg-slate-200"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
        </div>
    </Card>
);

const getStatusChipStyle = (status: AgendamentoStatus) => {
    switch (status) {
        case AgendamentoStatus.AGENDADO:
            return 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]';
        case AgendamentoStatus.REALIZADO:
            return 'bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]';
        case AgendamentoStatus.CANCELADO:
            return 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]';
        default:
            return 'bg-slate-100 text-slate-800';
    }
};

const AgendamentoItem: React.FC<{ agendamento: Agendamento; onCancel: (id: string) => void; isCancellable: boolean }> = ({ agendamento, onCancel, isCancellable }) => {
    const data = new Date(agendamento.dataHora);
    const dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <Icon name={agendamento.servicoIcon} className="text-2xl text-[var(--color-primary)]" />
                    <div>
                        <h3 className="font-bold text-slate-800">{agendamento.servicoNome}</h3>
                        <p className="text-sm text-slate-500">{dataFormatada} às {horaFormatada}</p>
                    </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusChipStyle(agendamento.status)}`}>
                    {agendamento.status}
                </span>
            </div>
            {isCancellable && agendamento.status === AgendamentoStatus.AGENDADO && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-right">
                    <Button size="sm" variant="secondary" onClick={() => onCancel(agendamento.id)}>
                        Cancelar
                    </Button>
                </div>
            )}
        </Card>
    );
};

const AgendamentosList: React.FC<AgendamentosListProps> = ({ navigateTo }) => {
  const { data: agendamentos, loading } = useAgendamentos();
  const [listaAgendamentos, setListaAgendamentos] = useState<Agendamento[]>([]);
  const { addToast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);

  React.useEffect(() => {
    if (agendamentos) {
      setListaAgendamentos(agendamentos);
    }
  }, [agendamentos]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(1); // Evita problemas com dias do mês (ex: 31)
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    // Se a mesma data for selecionada novamente, desmarque-a
    if (selectedDate && date.getTime() === selectedDate.getTime()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const filteredAgendamentos = useMemo(() => {
    if (!listaAgendamentos || !selectedDate) return null;
    
    return listaAgendamentos.filter(ag => {
      const agDate = new Date(ag.dataHora);
      return agDate.getFullYear() === selectedDate.getFullYear() &&
             agDate.getMonth() === selectedDate.getMonth() &&
             agDate.getDate() === selectedDate.getDate();
    }).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  }, [listaAgendamentos, selectedDate]);

  const { proximos, anteriores } = useMemo(() => {
    if (!listaAgendamentos || selectedDate) return { proximos: [], anteriores: [] };
    
    const agora = new Date();
    agora.setHours(0, 0, 0, 0); // Considera o dia inteiro para "próximos"
    
    const proximosAg = listaAgendamentos
        .filter(a => new Date(a.dataHora) >= agora && a.status !== AgendamentoStatus.CANCELADO)
        .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
        
    const anterioresAg = listaAgendamentos
        .filter(a => new Date(a.dataHora) < agora || a.status === AgendamentoStatus.CANCELADO)
        .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

    return { proximos: proximosAg, anteriores: anterioresAg };
  }, [listaAgendamentos, selectedDate]);

  const handleCancel = (id: string) => {
    if(window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
        setListaAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, status: AgendamentoStatus.CANCELADO } : ag));
        addToast('Agendamento cancelado.', 'info');
    }
  };

  if (loading) {
      return (
          <div className="space-y-6 animate-pulse">
              <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-lg bg-slate-200"></div>
                      <div className="h-8 w-48 rounded bg-slate-200"></div>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-slate-200"></div>
              </div>
              
              <Card className="!p-4">
                  <div className="h-6 w-1/3 mx-auto bg-slate-200 rounded mb-4"></div>
                  <div className="grid grid-cols-7 gap-1">
                      {[...Array(35)].map((_, i) => (
                          <div key={i} className="w-full h-12 bg-slate-200 rounded-full"></div>
                      ))}
                  </div>
              </Card>

              <div>
                  <div className="h-5 w-1/4 bg-slate-200 rounded mb-2 ml-1"></div>
                  <div className="space-y-3">
                      <AgendamentoSkeletonItem />
                  </div>
              </div>
              
              <div>
                  <div className="h-5 w-1/4 bg-slate-200 rounded mb-2 ml-1"></div>
                  <div className="space-y-3">
                      <AgendamentoSkeletonItem />
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Button onClick={() => navigateTo('SERVICOS_DASHBOARD')} variant="ghost" size="icon">
              <Icon name="arrow_back" />
            </Button>
            <h2 className="text-2xl font-bold text-slate-800">Agenda do Cidadão</h2>
        </div>
        <Button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            variant="ghost"
            size="icon"
            aria-label={isCalendarOpen ? "Ocultar calendário" : "Mostrar calendário"}
            aria-expanded={isCalendarOpen}
            aria-controls="calendar-view-container"
            className={!isCalendarOpen ? "text-[var(--color-primary)]" : ""}
        >
            <Icon name="calendar_month" />
        </Button>
      </div>
      
      {isCalendarOpen && (
        <div id="calendar-view-container">
            <CalendarView
                agendamentos={listaAgendamentos}
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onMonthChange={handleMonthChange}
            />
        </div>
      )}

      {selectedDate ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-700 pl-1">
              Agendamentos de {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            </h3>
            <Button size="sm" variant="ghost" onClick={() => setSelectedDate(null)}>Limpar</Button>
          </div>
          {filteredAgendamentos && filteredAgendamentos.length > 0 ? (
            <div className="space-y-3">
              {filteredAgendamentos.map(ag => (
                <AgendamentoItem key={ag.id} agendamento={ag} onCancel={handleCancel} isCancellable={new Date(ag.dataHora) >= new Date()} />
              ))}
            </div>
          ) : (
            <Card><p className="text-center text-slate-500">Nenhum agendamento para este dia.</p></Card>
          )}
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-2 pl-1">Próximos</h3>
            {proximos.length > 0 ? (
              <div className="space-y-3">
                {proximos.map(ag => (
                  <AgendamentoItem key={ag.id} agendamento={ag} onCancel={handleCancel} isCancellable={true} />
                ))}
              </div>
            ) : (
              <Card><p className="text-center text-slate-500">Nenhum agendamento futuro.</p></Card>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-2 pl-1">Anteriores</h3>
            {anteriores.length > 0 ? (
              <div className="space-y-3">
                {anteriores.map(ag => (
                  <AgendamentoItem key={ag.id} agendamento={ag} onCancel={handleCancel} isCancellable={false} />
                ))}
              </div>
            ) : (
              <Card><p className="text-center text-slate-500">Nenhum agendamento anterior.</p></Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AgendamentosList;