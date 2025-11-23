"use client";
import styles from "./dashboard-layout.module.css";
import { useEffect, useState } from "react";
import { apiFetch } from "@/app/api/client";

interface EventItem {
  id: number;
  title: string;
  category: string;
  date: string;
  location?: string;
  description?: string;
  joined?: boolean;
  capacity?: number | null; // Fixed: Allow null as well
  attendees?: number;
}

// Define API response interfaces
interface ApiEvent {
  id: number;
  title: string;
  category?: string;
  date: string;
  location?: string;
  description?: string;
  capacity?: number | null;
  rsvps?: any[];
  image?: string;
}

interface EventsResponse {
  events: ApiEvent[];
}

interface JoinLeaveResponse {
  success: boolean;
  message?: string;
}

export default function MainDashboard() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [joinLoading, setJoinLoading] = useState<number | null>(null);

  // Load only approved events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await apiFetch<EventsResponse>("/api/events");
        
        // Type guard to check if response has events array
        if (response && typeof response === 'object' && 'events' in response && Array.isArray(response.events)) {
          // Transform backend events to match frontend format
          const transformedEvents = response.events.map((event: ApiEvent) => ({
            id: event.id,
            title: event.title,
            category: event.category || 'general',
            date: event.date,
            location: event.location,
            description: event.description,
            joined: false,
            capacity: event.capacity || null,
            attendees: event.rsvps?.length || 0,
          }));
          setEvents(transformedEvents);
        } else {
          console.warn("Unexpected API response format");
          setEvents([]);
        }
      } catch {
        setEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

  // Join event functionality
  const handleJoinEvent = async (eventId: number) => {
    setJoinLoading(eventId);
    try {
      const response = await apiFetch<JoinLeaveResponse>(
        `/api/notifications/events/${eventId}/join/`, 
        { method: "POST" }
      );
      
      if (response.success) {
        // Update local state to reflect join status
        setEvents(events.map(event => 
          event.id === eventId ? { 
            ...event, 
            joined: true,
            attendees: (event.attendees || 0) + 1 
          } : event
        ));
      }
    } catch (error) {
      console.error("Failed to join event:", error);
      // TODO: Add toast notification here
    } finally {
      setJoinLoading(null);
    }
  };

  // Leave event functionality
  const handleLeaveEvent = async (eventId: number) => {
    setJoinLoading(eventId);
    try {
      const response = await apiFetch<JoinLeaveResponse>(
        `/api/events/${eventId}/leave`, 
        { method: "POST" }
      );
      
      if (response.success) {
        setEvents(events.map(event => 
          event.id === eventId ? { 
            ...event, 
            joined: false,
            attendees: Math.max(0, (event.attendees || 1) - 1)
          } : event
        ));
      }
    } catch (error) {
      console.error("Failed to leave event:", error);
    } finally {
      setJoinLoading(null);
    }
  };

  // Get unique categories for filter
  const categories = ["all", ...new Set(events.map(event => event.category))];

  // Filter events based on search and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Check if event is full
  const isEventFull = (event: EventItem) => {
    return event.capacity && event.attendees && event.attendees >= event.capacity;
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  // Stats calculations
  const totalEvents = events.length;
  const joinedEvents = events.filter((e) => e.joined).length;
  const upcomingToday = events.filter((e) => 
    new Date(e.date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className={styles["main-dashboard"]}>
      {/* Welcome Header */}
      <div className={styles["welcome-header"]}>
        <h1>Community Events</h1>
        <p>Discover and join exciting events in your community</p>
      </div>

      {/* Top Stats */}
      <div className={styles["stats-grid"]}>
        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className={styles["stat-content"]}>
            <div className={styles["stat-label"]}>Available Events</div>
            <div className={styles["stat-value"]}>{totalEvents}</div>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className={styles["stat-content"]}>
            <div className={styles["stat-label"]}>Joined Events</div>
            <div className={styles["stat-value"]}>{joinedEvents}</div>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <div className={styles["stat-content"]}>
            <div className={styles["stat-label"]}>Upcoming Today</div>
            <div className={styles["stat-value"]}>{upcomingToday}</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className={styles["filter-bar"]}>
        <div className={styles["search-container"]}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={styles["search-icon"]}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles["search-input"]}
          />
        </div>
        
        <div className={styles["category-filter"]}>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles["category-select"]}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className={styles["content-grid"]}>
        {isLoadingEvents ? (
          <div className={styles["loading-state"]}>
            <div className={styles["loading-spinner"]}></div>
            <p>Loading community events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={styles["empty-state"]}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            </svg>
            <h3>No events found</h3>
            <p>Try adjusting your search criteria or browse all categories</p>
          </div>
        ) : (
          <div className={styles["events-grid"]}>
            {filteredEvents.map((event) => {
              const full = isEventFull(event);
              const canJoin = !event.joined && !full;
              
              return (
                <div key={event.id} className={styles["event-card"]}>
                  <div className={styles["event-header"]}>
                    <h3>{event.title}</h3>
                    <span className={styles["event-category"]}>{event.category}</span>
                  </div>
                  
                  <div className={styles["event-details"]}>
                    <div className={styles["detail-item"]}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                      </svg>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    {event.location && (
                      <div className={styles["detail-item"]}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.capacity && (
                      <div className={styles["detail-item"]}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                        <span>{event.attendees || 0} / {event.capacity} attendees</span>
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className={styles["event-description"]}>{event.description}</p>
                  )}
                  
                  <div className={styles["event-actions"]}>
                    {event.joined ? (
                      <button
                        onClick={() => handleLeaveEvent(event.id)}
                        disabled={joinLoading === event.id}
                        className={`${styles["join-button"]} ${styles["joined"]}`}
                      >
                        {joinLoading === event.id ? "Leaving..." : "Leave Event"}
                      </button>
                    ) : full ? (
                      <button
                        disabled
                        className={`${styles["join-button"]} ${styles["full"]}`}
                      >
                        Event Full
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={joinLoading === event.id}
                        className={styles["join-button"]}
                      >
                        {joinLoading === event.id ? "Joining..." : "Join Event"}
                      </button>
                    )}
                  </div>
                  
                  {full && !event.joined && (
                    <div className={styles["full-notice"]}>
                      This event has reached maximum capacity
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Info Card */}
      <div className={styles["info-card"]}>
        <div className={styles["info-content"]}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <div>
            <h4>Community Events Hub</h4>
            <p>Browse approved community events, join activities you're interested in, and connect with your community. All events are verified by administrators to ensure quality and safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
}