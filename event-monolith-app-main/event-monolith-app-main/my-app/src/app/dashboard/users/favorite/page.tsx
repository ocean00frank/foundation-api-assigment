"use client";

import { useState, useEffect } from "react";
import FavoritesLayout from "./layout";
import styles from "./favorites.module.css";
import Link from "next/link";
import { apiFetch } from "@/app/api/client";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  joined?: boolean;
  attendeeCount?: number;
  capacity?: number;
  organizer?: string;
}

type FilterType = "all" | "upcoming" | "ongoing" | "past";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Fetch user's favorite events
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch("/api/notifications/favorites/");
        const data = await response.json();
        if (data.success && data.events) {
          setFavorites(data.events);
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  // Remove event from favorites
  const handleRemoveFavorite = async (eventId: number) => {
    setRemovingId(eventId);
    try {
      const response = await fetch(`/api/notifications/events/${eventId}/unfavorite/`, {
        method: "POST",
      });
      
      const data = await response.json();
      if (data.success) {
        setFavorites(prev => prev.filter(event => event.id !== eventId));
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };

  // Filter and search favorites
  const filteredFavorites = favorites.filter(event => {
    const matchesFilter = activeFilter === "all" || event.status === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get counts for each filter
  const filterCounts = {
    all: favorites.length,
    upcoming: favorites.filter(e => e.status === "upcoming").length,
    ongoing: favorites.filter(e => e.status === "ongoing").length,
    past: favorites.filter(e => e.status === "past").length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <FavoritesLayout userName="My Favorites">
      <div className={styles.page}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Favorite Events</h1>
            <p className={styles.subtitle}>
              Your saved events and activities. {favorites.length > 0 && 
                `You have ${favorites.length} favorite event${favorites.length !== 1 ? 's' : ''}.`
              }
            </p>
          </div>
        </header>

        {/* Filters and Search */}
        {favorites.length > 0 && (
          <div className={styles.controls}>
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={styles.searchIcon}>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder="Search your favorite events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
              {(['all', 'upcoming', 'ongoing', 'past'] as FilterType[]).map(filter => (
                <button
                  key={filter}
                  className={`${styles.filterTab} ${activeFilter === filter ? styles.active : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <span className={styles.filterCount}>({filterCounts[filter]})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your favorite events...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3>No favorite events found</h3>
            <p>
              {favorites.length === 0 
                ? "You haven't added any events to your favorites yet."
                : "No events match your current search and filter criteria."
              }
            </p>
            {favorites.length === 0 && (
              <Link href="/dashboard" className={styles.browseButton}>
                Browse Events
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.eventsGrid}>
              {filteredFavorites.map((event) => {
                const { date, time } = formatDate(event.date);
                
                return (
                  <div key={event.id} className={styles.eventCard}>
                    {/* Event Header */}
                    <div className={styles.eventHeader}>
                      <div className={styles.eventTitleSection}>
                        <h3 className={styles.eventTitle}>{event.title}</h3>
                        <span className={styles.eventCategory}>{event.category}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(event.id)}
                        disabled={removingId === event.id}
                        className={styles.removeButton}
                        title="Remove from favorites"
                      >
                        {removingId === event.id ? (
                          <div className={styles.miniSpinner}></div>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Event Description */}
                    <p className={styles.eventDescription}>{event.description}</p>

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
                      {event.capacity && (
                        <div className={styles.detailItem}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                          </svg>
                          <span>{event.attendeeCount || 0} / {event.capacity} attending</span>
                        </div>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className={styles.eventFooter}>
                      <span className={`${styles.status} ${styles[event.status]}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      <div className={styles.eventActions}>
                        {event.status === 'upcoming' && !event.joined && (
                          <button className={styles.joinButton}>Join Event</button>
                        )}
                        {event.joined && (
                          <span className={styles.joinedBadge}>You're attending</span>
                        )}
                        <button className={styles.viewButton}>View Details</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </FavoritesLayout>
  );
}