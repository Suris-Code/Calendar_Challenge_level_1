import appointmentsService, { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest 
} from './appointmentsService';
import { YesNo } from '../types/enums';

// Event interface matching Schedule-X expected format
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}

const calendarService = {
  /**
   * Fetch appointments and convert them to calendar events
   */
  getCalendarEvents: async (): Promise<CalendarEvent[]> => {
    try {
      const appointments = await appointmentsService.getAppointments();
      
      // Check if appointments is defined and is an array
      if (!appointments || !Array.isArray(appointments)) {
        console.error('Invalid appointments data received:', appointments);
        return [];
      }
      
      const calendarEvents = appointments.map(appointmentToCalendarEvent);
      
      return calendarEvents;
    } catch (error) {
      console.error('Error in getCalendarEvents:', error);
      return [];
    }
  },

  /**
   * Create a new appointment from calendar event data
   */
  createEvent: async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
    // Format the dates for the .NET backend (ISO 8601 format)
    const formattedStartTime = new Date(event.start).toISOString();
    const formattedEndTime = new Date(event.end).toISOString();
    
    const request: CreateAppointmentRequest = {
      title: event.title,
      description: event.description || 'No description',
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      location: event.location,
      isConfirmed: YesNo.No,
      sendReminder: YesNo.Yes
    };

    const appointment = await appointmentsService.createAppointment(request);
    return appointment ? appointmentToCalendarEvent(appointment) : null;
  },

  /**
   * Update an existing appointment from calendar event data
   */
  updateEvent: async (event: CalendarEvent): Promise<CalendarEvent | null> => {
    // Need to fetch the current appointment to get all required fields
    const currentAppointment = await appointmentsService.getAppointment(parseInt(event.id));
    
    console.log('Current appointment:', currentAppointment);
    if (!currentAppointment) {
      return null;
    }

    // Format the dates for the .NET backend (ISO 8601 format)
    const formattedStartTime = new Date(event.start).toISOString();
    const formattedEndTime = new Date(event.end).toISOString();
    
    const request: UpdateAppointmentRequest = {
      id: parseInt(event.id),
      title: event.title,
      description: event.description || currentAppointment.description,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      location: event.location || currentAppointment.location,
      isConfirmed: currentAppointment.isConfirmed,
      isCancelled: currentAppointment.isCancelled || YesNo.No,
      cancellationReason: currentAppointment.cancellationReason,
      meetingLink: currentAppointment.meetingLink,
      sendReminder: currentAppointment.sendReminder
    };

    const appointment = await appointmentsService.updateAppointment(request);
    return appointment ? appointmentToCalendarEvent(appointment) : null;
  },

  /**
   * Delete an event by ID
   */
  deleteEvent: async (eventId: string): Promise<boolean> => {
    return appointmentsService.deleteAppointment(parseInt(eventId));
  }
};

/**
 * Convert an Appointment to a CalendarEvent
 */
function appointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
  // Format dates from ISO format to YYYY-MM-DD HH:MM format
  const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    // Convert to local time
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')} ${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;
  };

  return {
    id: appointment.id.toString(),
    title: appointment.title,
    start: formatDateTime(appointment.startTime),
    end: formatDateTime(appointment.endTime),
    description: appointment.description,
    location: appointment.location
  };
}

export default calendarService; 