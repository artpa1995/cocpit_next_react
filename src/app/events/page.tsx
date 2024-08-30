"use client";
import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
// import DateSelectArg from "@fullcalendar/react";
// import EventClickArg from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Modal, Box, TextField, Button, Typography, List, ListItem, ListItemText, FormControl, Select, MenuItem, InputLabel, useTheme } from "@mui/material";
import axios from 'axios';
import { useSession } from 'next-auth/react';

import CoachLayout from '../coach/CoachLayout';
// import AddEvent from '../components/admin/modals/AddEventType';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  status: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  [key: string]: any; // Если у объекта могут быть дополнительные свойства
}
  // const createCalendarEvent = async function () {

  //   const event = {
  //     'summary': "vsdvdv",
  //     'description': "sdvsdvd",
  //     'start': {
  //       'dateTime': start,
  //       'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone 
  //     },
  //     'end': {
  //       'dateTime': end,
  //       'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone 
  //     }
  //   }
  //   await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
  //     method: "POST",
  //     headers: {
  //       'Authorization':'Bearer ' + session.accessToken 
  //     },
  //     body: JSON.stringify(event)
  //   }).then((data) => {
  //     return data.json();
  //   }).then((data) => {
  //     alert("Event created, check your Google Calendar!");
  //   });
  // }
const Calendar = () => {
  const theme = useTheme();
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [eventTypes, setEventTypes] = useState([]);
  const [eventType, setEventType] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await axios.post('/api/admin/events/getEvents');
      const formattedEvents = response.data.map((event: Event) => ({
        ...event,
        start: event.date,
      }));
      setCurrentEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const geEventTypes = async () => {
    try {
      const response = await axios.get('/api/admin/events/getEventTypes');
      setEventTypes(response.data.types || []);
    } catch (error) {
      console.error('Error fetching getEventTypes:', error);
    } 
  };  

  const { data: session } = useSession();
  const [googleEvents, setGoogleEvents] = useState([]);
  const fetchGoogleEvents = async () => {
    try {
      const response = await axios.post('/api/google-calendar',{session:session});
      setGoogleEvents(response.data.events || []);
    } catch (error) {
        console.error('Error fetching companies:', error);
    }
};
  useEffect(() => {
    geEventTypes();
    fetchEvents();

    if(session){
      fetchGoogleEvents()
    }
  }, [session]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected.startStr);
    setModalOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    
    // if (
    //   window.confirm(
    //     `Are you sure you want to delete the event '${selected.event.title}'`
    //   )
    // ) {
    //   deleteEvent(selected.event.id);
    // }
  };

  const handleSaveEvent = async () => {
    if (eventTitle && selectedDate) {
      try {
        const response = await axios.post('/api/admin/events/create', {
          title: eventTitle,
          date: selectedDate,
          type: eventType
        });

        if (response.data.newevent) {
          setCurrentEvents([...currentEvents, {
            ...response.data.newevent,
            start: response.data.newevent.date,
          }]);
        }

        setEventTitle("");
        setSelectedDate(null);
        setModalOpen(false);
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await axios.post('/api/admin/events/deleteEvent', {
        id: eventId
      });
      setCurrentEvents(currentEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <CoachLayout>
      <div className='p-5 w-full admin_user_main overflow-y-auto'>
        {/* <div className="flex justify-end mb-5">
          <button className="text-white bg-sky-900 rounded-lg px-5 py-3" onClick={() => setShowAddModal(true)}>
            Add Event Type
          </button>
        </div> */}
        {/* <AddEvent 
          showModal={showAddModal}
          onClose={() => setShowAddModal(false)} 
          onUpdate={geEventTypes}
        /> */}
        <Box display="flex" justifyContent="space-between">
        <Box
          sx={{
            backgroundColor: '#2c3e50',
            p: '15px',
            borderRadius: '4px',
          }}
        >
            <Typography variant="h5" className="text-white text-center font-bold">Events</Typography>
            <List>
              {currentEvents && currentEvents.map((event:any) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: event.status === 2 ? 'green' : 'red',
                    color: 'white',
                    margin: "10px 0",
                    borderRadius: "2px",
                    flexDirection: 'column'
                  }}
                >
                  <div className="flex justify-end w-full">
                    <button onClick={() => deleteEvent(event.id)}>X</button>
                  </div>
                  <div className="w-full">
                    <span>Type: </span>
                    <span>{event && event.EventType && event.EventType.type ? event.EventType.type : '' }</span>
                  </div>
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Typography>
                        {new Date(event.start).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box flex="1 1 100%" ml="15px">
            <FullCalendar
              ref={calendarRef}
              height="75vh"
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              events={currentEvents}
            />
          </Box>
        </Box>



        <h1 className="font-bold mt-5 ">Google Calendar  </h1>
        {!session ? (
        <button >Sign in with Google</button>
      ) : (
        <div className="mb-5">

          <ul className="font-bold  mb-5">
            {googleEvents.map((event:any) => (
              <li key={event.id}>
                <a target="_blank" className="text-blue-400" href={event.htmlLink}>  {event.summary} ({event.start.dateTime})</a>
              
              </li>
            ))}
          </ul>
        </div>
      )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" className="text-center font-bold">
              Add Event
            </Typography>
            <TextField
              fullWidth
              label="Event Title"
              margin="normal"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                label="Type"
              >
                {eventTypes && eventTypes.map((response:any) => (
                  <MenuItem key={response.id} value={response.id}>
                    {response.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
             
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEvent}
              sx={{ mt: 2 }}
            >
              Save Event
            </Button>
          </Box>
        </Modal>
      </div>
    </CoachLayout>
  );
};

export default Calendar;
