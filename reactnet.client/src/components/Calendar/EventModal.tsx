import { useRef, useEffect, useState } from 'react';
import { CalendarEvent } from '../../services/calendarService';
import Swal from 'sweetalert2';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  event?: {
    id?: string;
    title?: string;
    description?: string;
    start: Date;
    end: Date;
    location?: string;
    readOnly?: boolean;
  };
}

const EventModal = ({ isOpen, onClose, onSave, onDelete, event }: EventModalProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const modal = useRef<HTMLDivElement>(null);

  // Format date for datetime-local input (YYYY-MM-DDThh:mm)
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleRef.current && descriptionRef.current && startRef.current && endRef.current) {
      onSave({
        id: event?.id,
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        location: locationRef.current?.value,
        start: new Date(startRef.current.value).toISOString(),
        end: new Date(endRef.current.value).toISOString(),
      });
    }
    onClose();
  };

  const handleDeleteClick = () => {
    Swal.fire({
      title: 'Delete Event',
      text: 'Are you sure you want to delete this event? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel'
    }).then((result) => {
      if (result.isConfirmed && event?.id && onDelete) {
        onDelete(event.id);
        onClose();
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
        <div ref={modal} className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-6">
            {event?.readOnly ? 'View Event' : (event?.title ? 'Edit Event' : 'Create Event')}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  ref={titleRef}
                  type="text"
                  id="title"
                  defaultValue={event?.title || ''}
                  required
                  disabled={event?.readOnly}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  ref={locationRef}
                  type="text"
                  id="location"
                  defaultValue={event?.location || ''}
                  disabled={event?.readOnly}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  ref={startRef}
                  type="datetime-local"
                  id="start"
                  defaultValue={event?.start ? formatDateForInput(event.start) : ''}
                  required
                  disabled={event?.readOnly}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  ref={endRef}
                  type="datetime-local"
                  id="end"
                  defaultValue={event?.end ? formatDateForInput(event.end) : ''}
                  required
                  disabled={event?.readOnly}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  ref={descriptionRef}
                  id="description"
                  defaultValue={event?.description || ''}
                  required
                  disabled={event?.readOnly}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              {event?.id && !event?.readOnly && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="mr-auto px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {event?.readOnly ? 'Close' : 'Cancel'}
              </button>
              {!event?.readOnly && (
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EventModal; 