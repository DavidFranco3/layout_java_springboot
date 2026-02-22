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
    style: {
      backgroundColor: event.color || '#6366f1',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block',
      fontSize: '0.8rem'
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
    showMore: total => `+ Ver más (${total})`
  };

  const eventsWithProperDates = eventos.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
      <div className="mb-4">
        <Calendar
          localizer={localizer}
          events={eventsWithProperDates}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={(newView) => setView(newView)}
          selectable
          onSelectSlot={handleSelectSlot}
          popup
          eventPropGetter={eventStyleGetter}
          messages={messages}
          className="rounded-lg overflow-hidden border dark:border-slate-700"
        />
      </div>

      {/* Implementación de tu ModalCustom */}
      <ModalCustom show={isOpen} onClose={() => setIsOpen(false)} maxWidth="md">
        <ModalCustom.Header onClose={() => setIsOpen(false)} closeButton>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500" />
            <span className="font-bold text-gray-800 dark:text-white">
              Cuentas del {selectedDate && dayjs(selectedDate).format('DD [de] MMMM')}
            </span>
          </div>
        </ModalCustom.Header>

        <ModalCustom.Body>
          <div className="space-y-3">
            {dailyEvents.length > 0 ? (
              dailyEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id, event.title)}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-10 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Presiona para ver detalles
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {formatAmount(event.cantidad)}
                    </span>
                    <FontAwesomeIcon icon={faMoneyBillWave} className="ml-2 text-gray-300 group-hover:text-indigo-400 text-xs" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-300 text-4xl mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No hay cuentas registradas para esta fecha.</p>
              </div>
            )}
          </div>
        </ModalCustom.Body>

        <ModalCustom.Footer>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 transition-colors"
          >
            Cerrar
          </button>
        </ModalCustom.Footer>
      </ModalCustom>
    </div>
  );
};

export default CalendarCustom;