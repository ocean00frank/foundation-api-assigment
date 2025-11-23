"use client";

import { useState, useEffect } from "react";
import styles from "./notification.module.css";
import { apiFetch } from "@/app/api/client";

interface Notification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  event_title?: string;
  is_read: boolean;
  created_at: string;
  created_at_formatted: string;
  is_recent: boolean;
}

interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  notifications_today: number;
  notifications_this_week: number;
  notifications_by_type: Record<string, number>;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notificationType, setNotificationType] = useState<string>('');

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const params = new URLSearchParams();
        if (activeFilter !== 'all') {
          params.append('is_read', activeFilter === 'read' ? 'true' : 'false');
        }
        if (notificationType) {
          params.append('type', notificationType);
        }

        const response = await apiFetch<{
          success: boolean;
          notifications: Notification[];
          pagination: any;
        }>(`/api/notifications/?${params.toString()}`);

        if (response.success) {
          setNotifications(response.notifications);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [activeFilter, notificationType]);

  // Load notification stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await apiFetch<{
          success: boolean;
          stats: NotificationStats;
        }>('/api/notifications/stats/');

        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error('Failed to load notification stats:', error);
      }
    };

    loadStats();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await apiFetch<{success: boolean; message: string}>(
        `/api/notifications/${notificationId}/read/`,
        { method: 'POST' }
      );

      if (response.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId
              ? { ...notif, is_read: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await apiFetch<{success: boolean; message: string}>(
        '/api/notifications/mark-all-read/',
        { method: 'POST' }
      );

      if (response.success) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        if (stats) {
          setStats({ ...stats, unread_notifications: 0 });
        }
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_joined':
        return '✅';
      case 'event_left':
        return '👋';
      case 'event_favorited':
        return '❤️';
      case 'event_unfavorited':
        return '💔';
      case 'event_updated':
        return '📝';
      case 'event_cancelled':
        return '❌';
      case 'event_reminder':
        return '🔔';
      case 'new_event':
        return '🆕';
      case 'event_approved':
        return '✅';
      case 'event_rejected':
        return '❌';
      default:
        return '📢';
    }
  };

  // Get notification type display name
  const getNotificationTypeName = (type: string) => {
    switch (type) {
      case 'event_joined':
        return 'Event Joined';
      case 'event_left':
        return 'Event Left';
      case 'event_favorited':
        return 'Event Favorited';
      case 'event_unfavorited':
        return 'Event Unfavorited';
      case 'event_updated':
        return 'Event Updated';
      case 'event_cancelled':
        return 'Event Cancelled';
      case 'event_reminder':
        return 'Event Reminder';
      case 'new_event':
        return 'New Event';
      case 'event_approved':
        return 'Event Approved';
      case 'event_rejected':
        return 'Event Rejected';
      default:
        return 'Notification';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className={styles.notificationContainer}>
      <div className={styles.header}>
        <h1>Notifications</h1>
        <p>Stay updated with your event activities</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <h3>{stats.total_notifications}</h3>
              <p>Total Notifications</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔔</div>
            <div className={styles.statContent}>
              <h3>{stats.unread_notifications}</h3>
              <p>Unread</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statContent}>
              <h3>{stats.notifications_today}</h3>
              <p>Today</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📈</div>
            <div className={styles.statContent}>
              <h3>{stats.notifications_this_week}</h3>
              <p>This Week</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as 'all' | 'unread' | 'read')}
            className={styles.filterSelect}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>

          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Types</option>
            <option value="event_joined">Event Joined</option>
            <option value="event_left">Event Left</option>
            <option value="event_favorited">Event Favorited</option>
            <option value="event_updated">Event Updated</option>
            <option value="event_reminder">Event Reminder</option>
            <option value="new_event">New Event</option>
            <option value="event_approved">Event Approved</option>
            <option value="event_rejected">Event Rejected</option>
          </select>
        </div>

        <div className={styles.actions}>
          {stats && stats.unread_notifications > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className={styles.markAllReadBtn}
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className={styles.notificationsList}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>No notifications</h3>
            <p>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${
                !notification.is_read ? styles.unread : ''
              } ${notification.is_recent ? styles.recent : ''}`}
            >
              <div className={styles.notificationIcon}>
                {getNotificationIcon(notification.notification_type)}
              </div>
              
              <div className={styles.notificationContent}>
                <div className={styles.notificationHeader}>
                  <h3 className={styles.notificationTitle}>
                    {notification.title}
                  </h3>
                  <div className={styles.notificationMeta}>
                    <span className={styles.notificationType}>
                      {getNotificationTypeName(notification.notification_type)}
                    </span>
                    <span className={styles.notificationTime}>
                      {notification.created_at_formatted}
                    </span>
                  </div>
                </div>
                
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
                
                {notification.event_title && (
                  <div className={styles.eventInfo}>
                    <span className={styles.eventLabel}>Event:</span>
                    <span className={styles.eventTitle}>{notification.event_title}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.notificationActions}>
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={styles.markReadBtn}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
