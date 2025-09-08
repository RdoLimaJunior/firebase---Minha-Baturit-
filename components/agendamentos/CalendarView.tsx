import React, { useMemo } from 'react';
import { Agendamento } from '../../types';
import Icon from '../ui/Icon';
import Card from '../ui/Card';

// Funções auxiliares para manipulação de datas
const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getISODateString = (date: Date) => date.toISOString().split('T')[0];

interface CalendarViewProps {
  agendamentos: Agendamento[];
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ agendamentos, currentDate, selectedDate, onDateSelect, onMonthChange }) => {
  const appointmentDates = useMemo(() => {
    const dates = new Set<string>();
    agendamentos.forEach(ag => {
      dates.add(getISODateString(new Date(ag.dataHora)));
    });
    return dates;
  }, [agendamentos]);

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    const grid: (Date | null)[] = [];
    // Adiciona células vazias para dias antes do dia 1 do mês
    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push(null);
    }
    // Adiciona as células para cada dia do mês
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(year, month, day));
    }
    return grid;
  }, [currentDate]);

  const today = new Date();

  return (
    <Card className="!p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onMonthChange('prev')} className="p-2 rounded-full hover:bg-slate-100" aria-label="Mês anterior">
          <Icon name="chevron_left" />
        </button>
        <h3 className="font-bold text-slate-800 capitalize">{monthName}</h3>
        <button onClick={() => onMonthChange('next')} className="p-2 rounded-full hover:bg-slate-100" aria-label="Próximo mês">
          <Icon name="chevron_right" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 font-medium">
        {weekdays.map((day, i) => <div key={`${day}-${i}`}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {calendarGrid.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);
          const hasAppointment = appointmentDates.has(getISODateString(date));

          let buttonClasses = "w-full h-12 flex flex-col justify-center items-center rounded-full transition-colors text-sm ";
          if (isSelected) {
            buttonClasses += "bg-[var(--color-primary)] text-white font-bold";
          } else if (isToday) {
            buttonClasses += "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold";
          } else {
            buttonClasses += "hover:bg-slate-100 text-slate-700";
          }

          return (
            <div key={date.toISOString()}>
              <button onClick={() => onDateSelect(date)} className={buttonClasses}>
                <span>{date.getDate()}</span>
                {hasAppointment && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-slate-500'}`}></div>}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarView;