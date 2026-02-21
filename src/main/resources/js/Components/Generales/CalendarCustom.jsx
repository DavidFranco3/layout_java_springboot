import React, { useState } from 'react';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa el locale de español para dayjs
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';

dayjs.locale('es'); // Configura dayjs para usar español

const localizer = dayjsLocalizer(dayjs);

const CalendarCustom = ({ eventos, onEventClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyEvents, setDailyEvents] = useState([]);
  const [view, setView] = useState(Views.MONTH);

  const handleSelectSlot = ({ start }) => {
    const selectedDateEvents = eventos.filter(
      (event) => dayjs(event.start).isSame(start, 'day')
    );
    setSelectedDate(start);
    setDailyEvents(selectedDateEvents);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setDailyEvents([]);
  };

  const handleEventClick = (eventId, tipo) => {
    onEventClick(eventId, tipo);
    handleCloseModal();
  };

  const formatAmount = (amount) => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return 'Cantidad no válida';
    }
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parsedAmount);
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  // Personaliza los mensajes del calendario
  const messages = {
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    allDay: 'Todo el día',
    week: 'Semana',
    work_week: 'Semana laboral',
    day: 'Día',
    month: 'Mes',
    previous: 'Anterior',
    next: 'Siguiente',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    today: 'Hoy',
    agenda: 'Agenda',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: total => `+ Ver más (${total})`
  };

  // Personaliza el formato de fecha
  const formats = {
    dayFormat: 'dddd', // Nombre completo del día en español
    monthHeaderFormat: 'MMMM YYYY', // Nombre completo del mes y año en español
    weekdayFormat: 'ddd', // Abreviación del nombre del día en español
    monthFormat: 'MMMM YYYY' // Nombre completo del mes y año en español
  };

  const eventsWithProperDates = eventos.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <div className="container mt-5">
      {/* <div className="row mb-3">
        <div className="col">
          <ButtonGroup toggle>
            {[
              { value: Views.MONTH, label: 'Mes' },
              { value: Views.WEEK, label: 'Semana' },
              { value: Views.DAY, label: 'Día' },
              { value: Views.AGENDA, label: 'Agenda' }
            ].map((radio, idx) => (
              <ToggleButton
                key={idx}
                type="radio"
                variant="outline-primary"
                name="view"
                value={radio.value}
                checked={view === radio.value}
                onChange={(e) => setView(e.currentTarget.value)}
              >
                {radio.label}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
      </div> */}
      <div className="row">
        <div className="col">
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
            dayPropGetter={() => ({
              className: 'rbc-day-bg',
            })}
            eventPropGetter={eventStyleGetter}
            className="border"
            messages={messages}
            formats={formats}
          />
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cuentas {selectedDate && dayjs(selectedDate).format('LL')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dailyEvents.length > 0 ? (
            <ul className="list-group">
              {dailyEvents.map((event) => (
                <li
                  key={event.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleEventClick(event.id, event.title)}
                >
                  {event.title} - {formatAmount(event.cantidad)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay cuentas para este día.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarCustom;
