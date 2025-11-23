'use client';

import { useEffect, useState } from 'react';
import styles from './myevents.module.css';
import { apiFetch } from '@/app/api/client';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  status: 'upcoming' | 'past' | 'cancelled';
  joined: boolean;
  attendeeCount?: number;
  capacity?: number;
  organizer?: string;
  reminderSet?: boolean;
}

type TabType = 'upcoming' | 'past' | 'cancelled' | 'all';

// API Response Interfaces
interface RsvpResponse {
  rsvps: any[];
  [key: string]: any;
}

interface LeaveEventResponse {
  success: boolean;
  message?: string;
}

interface ReminderResponse {
  success: boolean;
  [key: string]: any;
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [leavingEventId, setLeavingEventId] = useState<number | null>(null);

  // Helper function to determine event status
  const getEventStatus = (rsvpStatus: string, eventDate: string): 'upcoming' | 'past' | 'cancelled' => {
    if (rsvpStatus === 'NOT_GOING') {
      return 'cancelled';
    }
    
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    
    if (eventDateTime < now) {
      return 'past';
    }
    
    return 'upcoming';
  };

  // Fetch joined/subscribed events
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await apiFetch<RsvpResponse>('/api/events/user/rsvps');
        
        // Type guard to safely access response
        if (response && typeof response === 'object' && 'rsvps' in response && Array.isArray(response.rsvps)) {
          // Transform RSVPs to events with proper typing
          const transformedEvents: Event[] = response.rsvps.map((rsvp: any) => {
            const eventStatus = getEventStatus(rsvp.status, rsvp.event.date);
            
            return {
              id: rsvp.event.id || 0,
              title: rsvp.event.title || 'Untitled Event',
              description: rsvp.event.description || 'No description available',
              date: rsvp.event.date || new Date().toISOString(),
              location: rsvp.event.location || 'Location not specified',
              category: rsvp.event.category || 'general',
              status: eventStatus,
              joined: true,
              attendeeCount: rsvp.event.rsvps?.length || 0,
              capacity: rsvp.event.capacity || null,
              organizer: rsvp.event.organizer?.email || 'Unknown',
              reminderSet: false,
            };
          });
          setEvents(transformedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  // Filter events based on active tab
  const filteredEvents = events.filter(event => 
    activeTab === 'all' || event.status === activeTab
  );

  // Allow user to leave/unsubscribe from event
  const handleLeaveEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to leave this event? You can always rejoin if spaces are available.')) {
      return;
    }

    setLeavingEventId(eventId);
    try {
      const response = await apiFetch<LeaveEventResponse>(`/api/notifications/events/${eventId}/leave/`, { 
        method: 'POST' 
      });
      
      // Type guard for leave response
      if (response && typeof response === 'object' && 'success' in response && response.success) {
        setEvents(prev => prev.filter(event => event.id !== eventId));
      } else {
        throw new Error((response as LeaveEventResponse).message || 'Failed to leave event');
      }
    } catch (error) {
      console.error('Error leaving event:', error);
      alert('Failed to leave event. Please try again.');
    } finally {
      setLeavingEventId(null);
    }
  };

  // Toggle event reminder
  const handleToggleReminder = async (eventId: number, currentState: boolean) => {
    try {
      const response = await apiFetch<ReminderResponse>(`/api/events/${eventId}/reminder/`, { 
        method: 'POST',
        body: JSON.stringify({ setReminder: !currentState })
      });
      
      // Type guard for reminder response
      if (response && typeof response === 'object' && 'success' in response && response.success) {
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, reminderSet: !currentState }
            : event
        ));
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Events</h1>
          <p className={styles.subtitle}>Manage events you've joined and track your participation</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.active : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
          <span className={styles.tabCount}>
            {events.filter(e => e.status === 'upcoming').length}
          </span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'past' ? styles.active : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
          <span className={styles.tabCount}>
            {events.filter(e => e.status === 'past').length}
          </span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'cancelled' ? styles.active : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
          <span className={styles.tabCount}>
            {events.filter(e => e.status === 'cancelled').length}
          </span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Events
          <span className={styles.tabCount}>{events.length}</span>
        </button>
      </div>

      <main className={styles.content}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/>
              </svg>
            </div>
            <h3>No events found</h3>
            <p>
              {activeTab === 'upcoming' 
                ? "You haven't joined any upcoming events yet." 
                : activeTab === 'past'
                ? "You don't have any past events."
                : activeTab === 'cancelled'
                ? "No cancelled events in your list."
                : "You haven't joined any events yet."
              }
            </p>
            {activeTab === 'upcoming' && events.length === 0 && (
              <Link href="/dashboard" className={styles.browseButton}>
                Browse Community Events
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.eventGrid}>
            {filteredEvents.map(event => {
              const { date, time } = formatDate(event.date);
              const isFull = event.capacity && event.attendeeCount && event.attendeeCount >= event.capacity;
              
              return (
                <div key={event.id} className={styles.eventCard}>
                  {/* Event Header */}
                  <div className={styles.eventHeader}>
                    <div className={styles.eventTitleSection}>
                      <h2 className={styles.eventTitle}>{event.title}</h2>
                      <span className={styles.eventCategory}>{event.category}</span>
                    </div>
                    <span
                      className={`${styles.status} ${
                        event.status === 'upcoming'
                          ? styles.upcoming
                          : event.status === 'past'
                          ? styles.past
                          : styles.cancelled
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>

                  {/* Event Description */}
                  <p className={styles.description}>{event.description}</p>

                  {/* Event Details */}
                  <div className={styles.eventDetails}>
                    <div className={styles.detailItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm0 16H5V8h14v11z"/>
                      </svg>
                      <span>{date} at {time}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    {event.organizer && (
                      <div className={styles.detailItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>Organized by {event.organizer}</span>
                      </div>
                    )}
                    {event.capacity && (
                      <div className={styles.detailItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                        <span>{event.attendeeCount || 0} / {event.capacity} attendees {isFull && '(Full)'}</span>
                      </div>
                    )}
                  </div>

                  {/* Event Actions */}
                  <div className={styles.actions}>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleLeaveEvent(event.id)}
                        disabled={leavingEventId === event.id || event.status === 'past'}
                        className={`${styles.leaveBtn} ${
                          event.status === 'past' ? styles.disabled : ''
                        }`}
                      >
                        {leavingEventId === event.id ? 'Leaving...' : 'Leave Event'}
                      </button>
                      <button className={styles.viewBtn}>View Details</button>
                    </div>
                    
                    {event.status === 'upcoming' && (
                      <button
                        onClick={() => handleToggleReminder(event.id, event.reminderSet || false)}
                        className={`${styles.reminderBtn} ${
                          event.reminderSet ? styles.reminderActive : ''
                        }`}
                      >
                        {event.reminderSet ? '🔔' : '🔕'} Reminder
                      </button>
                    )}
                  </div>

                  {/* Additional Info for Past Events */}
                  {event.status === 'past' && (
                    <div className={styles.pastEventInfo}>
                      <span>This event has ended</span>
                      <button className={styles.feedbackBtn}>Leave Feedback</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}