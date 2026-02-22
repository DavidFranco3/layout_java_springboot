import React, { useState } from 'react';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMoneyBillWave, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ModalCustom from './ModalCustom';

dayjs.locale('es');
const localizer = dayjsLocalizer(dayjs);

const CalendarCustom = ({ eventos, onEventClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyEvents, setDailyEvents] = useState([]);
  const [view, setView] = useState(Views.MONTH);

  const handleSelectSlot = ({ start }) => {
    const selectedDateEvents = eventos.filter(
      (event) => dayjs(event.start).isSame(start, 'day')
    );
    setSelectedDate(start);
    setDailyEvents(selectedDateEvents);
    setIsOpen(true); // Abrir ModalCustom
  };

  const handleEventClick = (eventId, tipo) => {
    onEventClick(eventId, tipo);
    setIsOpen(false);
  };

  const formatAmount = (amount) => {
    const parsedAmount = parseFloat(amount);
    return isNaN(parsedAmount)
      ? 'N/A'
      : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parsedAmount);
  };

  const eventStyleGetter = (event) => ({
    className: "transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm",
    style: {
      backgroundColor: event.color || 'var(--color-primary)',
      borderRadius: '6px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: '500',
      padding: '2px 6px'
    }
  });

  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    showMore: total => `+ Ver más (${total})`,
    noEventsInRange: 'No hay eventos en este rango.'
  };

  const eventsWithProperDates = eventos.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl shadow-premium border border-[var(--border-light)] overflow-hidden transition-all duration-300">
      <div className="p-4 md:p-6">
        <style>{`
          .rbc-calendar {
             font-family: inherit;
          }
          .rbc-header {
            padding: 12px 0;
            font-weight: 600;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border-light);
          }
          .rbc-off-range-bg {
            background: rgba(0,0,0,0.02);
          }
          html.dark .rbc-off-range-bg {
            background: rgba(255,255,255,0.02);
          }
          .rbc-today {
            background-color: var(--color-primary-soft);
          }
          .rbc-toolbar button {
            color: var(--text-main);
            border: 1px solid var(--border-light);
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
            margin: 0 2px;
          }
          .rbc-toolbar button:hover {
            background: var(--border-light);
          }
          .rbc-toolbar button.rbc-active {
            background: var(--color-primary);
            color: white;
            border-color: var(--color-primary);
          }
          .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
            border: 1px solid var(--border-light);
            border-radius: 12px;
          }
          .rbc-day-bg + .rbc-day-bg {
            border-left: 1px solid var(--border-light);
          }
          .rbc-month-row + .rbc-month-row {
            border-top: 1px solid var(--border-light);
          }
        `}</style>
        <Calendar
          localizer={localizer}
          events={eventsWithProperDates}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={(newView) => setView(newView)}
          selectable
          onSelectSlot={handleSelectSlot}
          popup
          eventPropGetter={eventStyleGetter}
          messages={messages}
          className="dark:text-slate-200"
        />
      </div>

      <ModalCustom show={isOpen} onClose={() => setIsOpen(false)} maxWidth="md">
        <ModalCustom.Header onClose={() => setIsOpen(false)} closeButton>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                Detalles del Día
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {selectedDate && dayjs(selectedDate).format('dddd, DD [de] MMMM')}
              </p>
            </div>
          </div>
        </ModalCustom.Header>

        <ModalCustom.Body>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
            {dailyEvents.length > 0 ? (
              dailyEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id, event.title)}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-1.5 h-12 rounded-full shadow-sm"
                      style={{ backgroundColor: event.color }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 capitalize">
                          {event.tipo || 'Evento'}
                        </span>
                        <span className="text-[10px] text-slate-400">Ver detalles <i className="fas fa-chevron-right ml-1 text-[8px]" /></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-base font-black text-primary">
                      {formatAmount(event.cantidad)}
                    </span>
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-primary/20 group-hover:text-primary/40 transition-colors text-sm mt-1" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-slate-300 dark:text-slate-600 text-2xl" />
                </div>
                <h4 className="text-slate-900 dark:text-white font-semibold">Sin movimientos</h4>
                <p className="text-slate-500 text-sm mt-1">No hay registros para este día específico.</p>
              </div>
            )}
          </div>
        </ModalCustom.Body>

        <ModalCustom.Footer className="bg-slate-50/50 dark:bg-slate-900/50 flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-8 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Aceptar
          </button>
        </ModalCustom.Footer>
      </ModalCustom>
    </div>
  );
};


export default CalendarCustom;