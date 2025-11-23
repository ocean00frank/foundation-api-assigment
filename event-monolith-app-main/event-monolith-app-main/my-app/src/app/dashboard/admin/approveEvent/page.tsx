"use client";

import React, { useEffect, useState } from "react";
import styles from "./approveEvents.module.css";
import { apiFetch } from '@/app/api/client';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  location: string;
  category: string;
  submitted_by_name: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  capacity: number;
  price: number;
  approved?: boolean;
}

// API Response Interfaces
interface EventsResponse {
  events: Event[];
}

interface ApproveResponse {
  message?: string;
  event?: Event;
  error?: string;
}

interface DeleteResponse {
  message?: string;
  error?: string;
}

export default function ApproveEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Safe date formatting function
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  // Safe status formatting
  const getSafeStatus = (status: string | undefined): string => {
    const safeStatus = status || 'pending';
    return safeStatus.toUpperCase();
  };

  // Safe status class
  const getStatusClass = (status: string | undefined): string => {
    const safeStatus = status || 'pending';
    switch (safeStatus) {
      case "approved": return styles.approvedText;
      case "rejected": return styles.declinedText;
      default: return styles.pendingText;
    }
  };

  // Safe card class
  const getCardClass = (status: string | undefined): string => {
    const safeStatus = status || 'pending';
    switch (safeStatus) {
      case "approved": return styles.approved;
      case "rejected": return styles.declined;
      default: return "";
    }
  };

  // Fetch pending events from API - UPDATED VERSION
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Use the admin-specific endpoint with status filter
        const response = await apiFetch<EventsResponse>('/api/events?status=pending');
        
        // Type guard to safely access response
        if (response && typeof response === 'object' && 'events' in response && Array.isArray(response.events)) {
          // Map events with corrected field mappings
          const pendingEvents = response.events.map((event: any) => ({
            id: event.id || 0,
            title: event.title || 'Untitled Event',
            description: event.description || 'No description available',
            // CORRECTED: Use event.date for start_date (as per backend field)
            start_date: event.date || event.start_date || new Date().toISOString(),
            location: event.location || 'Location not specified',
            // IMPORTANT: Ensure category is properly mapped
            category: event.category || 'Uncategorized',
            submitted_by_name: event.submitted_by_name || 'Unknown',
            status: (event.status || 'pending') as "pending" | "approved" | "rejected",
            // CORRECTED: Use event.createdAt for submitted_at (as per backend field)
            submitted_at: event.createdAt || event.submitted_at || new Date().toISOString(),
            capacity: typeof event.capacity === 'number' ? event.capacity : 0,
            price: typeof event.price === 'number' ? event.price : 0,
            approved: event.approved || false,
          }));
          setEvents(pendingEvents);
        } else {
          console.warn('Unexpected API response format:', response);
          setEvents([]);
        }
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError(err.message || "Something went wrong while fetching events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Approve event
  const handleApprove = async (id: string) => {
    try {
      const response = await apiFetch<ApproveResponse>(`/api/events/${id}/approve`, {
        method: 'POST',
      });
      
      if (response.message || response.event) {
  // Remove approved event from list
  setEvents((prev) => prev.filter((event) => event.id !== id));
        alert('Event approved successfully!');
      } else {
        setError(response.error || "Failed to approve event");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error approving event");
    }
  };

  // Decline event
  const handleDecline = async (id: string) => {
    try {
      // For decline, we can delete the event or just remove it from the list
      const confirmDelete = confirm('Are you sure you want to reject this event?');
      if (!confirmDelete) return;

      const response = await apiFetch<DeleteResponse>(`/api/events/${id}`, {
        method: 'DELETE',
      });
      
  if (response.message || !response.error) {
  // Remove rejected event from list
  setEvents((prev) => prev.filter((event) => event.id !== id));
        alert('Event rejected and removed!');
      } else {
        setError(response.error || "Failed to reject event");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error rejecting event");
    }
  };

  if (loading) return <div className={styles.loading}>Loading events...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Approve Submitted Events</h1>
      {events.length === 0 ? (
        <p className={styles.noEvents}>No pending events to approve.</p>
      ) : (
        <div className={styles.eventList}>
          {events.map((event) => {
            // Ensure we have safe values for rendering
            const safeStatus = event.status || 'pending';
            const isPending = safeStatus === 'pending';
            
            return (
              <div
                key={event.id}
                className={`${styles.eventCard} ${getCardClass(event.status)}`}
              >
                <div className={styles.cardHeader}>
                  <h2>{event.title}</h2>
                  {/* Category is now properly displayed */}
                  <span className={styles.category}>{event.category}</span>
                </div>
                <p className={styles.description}>{event.description}</p>
                <p className={styles.details}>
                  <strong>Date:</strong> {formatDate(event.start_date)}
                </p>
                <p className={styles.details}>
                  <strong>Location:</strong> {event.location}
                </p>
                <p className={styles.details}>
                  <strong>Category:</strong> {event.category} {/* Added category display */}
                </p>
                <p className={styles.details}>
                  <strong>Submitted By:</strong> {event.submitted_by_name}
                </p>
                <p className={styles.details}>
                  <strong>Capacity:</strong> {event.capacity} people
                </p>
                <p className={styles.details}>
                  <strong>Price:</strong> ${event.price}
                </p>
                <div className={styles.actions}>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApprove(event.id)}
                    disabled={!isPending}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.declineBtn}
                    onClick={() => handleDecline(event.id)}
                    disabled={!isPending}
                  >
                    Reject
                  </button>
                </div>
                <div className={styles.status}>
                  Status:{" "}
                  <span className={getStatusClass(event.status)}>
                    {getSafeStatus(event.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}