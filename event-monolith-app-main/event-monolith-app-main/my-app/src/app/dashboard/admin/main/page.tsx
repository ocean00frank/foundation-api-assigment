"use client";

import { useState, useEffect } from "react";
import styles from "./main.module.css";
import { apiFetch } from "@/app/api/client";

interface Event {
  id: number;
  title: string;
  organizer: string;
  date: string;
  location: string;
  status: string;
  attendees?: number;
  capacity?: number;
}

export default function AdminMainPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiFetch("/api/events/all");
        if (response.events && Array.isArray(response.events)) {
          // Transform backend events to match frontend format
          const transformedEvents = response.events.map((event: any) => ({
            id: event.id,
            title: event.title,
            organizer: event.organizer?.email || 'Unknown',
            date: event.date,
            location: event.location,
            status: event.approved ? 'Approved' : 'Pending',
            attendees: event.rsvps?.length || 0,
            capacity: event.capacity || 'Unlimited',
          }));
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on status
  const filteredEvents = events.filter(event => 
    filter === "all" || event.status.toLowerCase() === filter
  );

  // Handle delete event
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.error) {
        setEvents((prev) => prev.filter((event) => event.id !== id));
        alert("Event deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete event");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete event");
    }
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get counts for quick stats
  const eventCounts = {
    all: events.length,
    approved: events.filter(e => e.status === "Approved").length,
    pending: events.filter(e => e.status === "Pending").length,
    rejected: events.filter(e => e.status === "Rejected").length,
  };

  return (
    <div className={styles.adminContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1>All Events</h1>
          <p>Manage and monitor all community events</p>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{eventCounts.all}</span>
            <span className={styles.statLabel}>Total Events</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{eventCounts.approved}</span>
            <span className={styles.statLabel}>Approved</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{eventCounts.pending}</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{eventCounts.rejected}</span>
            <span className={styles.statLabel}>Rejected</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button 
            className={`${styles.filterTab} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            All Events
          </button>
          <button 
            className={`${styles.filterTab} ${filter === "approved" ? styles.active : ""}`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button 
            className={`${styles.filterTab} ${filter === "pending" ? styles.active : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button 
            className={`${styles.filterTab} ${filter === "rejected" ? styles.active : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
        </div>

        {/* Events Table */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No events found{filter !== "all" ? ` with status "${filter}"` : ""}.</p>
            {filter !== "all" && (
              <button 
                className={styles.clearFilterButton}
                onClick={() => setFilter("all")}
              >
                Show All Events
              </button>
            )}
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.eventTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Organizer</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr key={event.id}>
                    <td>{index + 1}</td>
                    <td className={styles.titleCell}>{event.title}</td>
                    <td>{event.organizer}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{event.location}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          event.status === "Approved"
                            ? styles.success
                            : event.status === "Pending"
                            ? styles.pending
                            : styles.failed
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(event.id)}
                        title="Delete event"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 
                            20.1 18 19V7H6V19ZM19 4H15.5L14.79 
                            3.29C14.61 3.11 14.35 3 14.09 
                            3H9.91C9.65 3 9.39 3.11 9.21 
                            3.29L8.5 4H5V6H19V4Z"
                          />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}