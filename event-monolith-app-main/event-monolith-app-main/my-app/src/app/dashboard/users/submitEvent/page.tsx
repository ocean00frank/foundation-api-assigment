'use client';

import { useState, useEffect } from 'react';
import styles from './submitEvent.module.css';
import { apiFetch } from '@/app/api/client';

interface SubmittedEvent {
  id: number;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  adminFeedback?: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: string;
  tags: string;
  image: string;
}

// API Response Interfaces
interface ApiResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

interface EventCreationResponse {
  event?: any;
  error?: string;
  message?: string;
  success?: boolean;
}

export default function SubmitEventPage() {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'general',
    capacity: '',
    tags: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [submittedEvents, setSubmittedEvents] = useState<SubmittedEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'submissions'>('create');

  // Load user's submitted events
  useEffect(() => {
    const loadSubmittedEvents = async () => {
      try {
        // Try to load from backend - this endpoint will be created later
        // For now, just set empty array
        setSubmittedEvents([]);
      } catch (error) {
        console.error('Failed to load submissions:', error);
        setSubmittedEvents([]);
      }
    };
    loadSubmittedEvents();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      // Combine date and time
      const combinedDateTime = `${formData.date}T${formData.time}:00.000Z`;
      
      // Prepare payload for backend
      const payload = {
        title: formData.title,
        description: formData.description,
        date: combinedDateTime,
        location: formData.location,
        image: formData.image || null,
      };

      const response = await apiFetch<EventCreationResponse>('/api/events', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Type guard to safely access response properties
      if (response && typeof response === 'object' && 'event' in response) {
        setStatus('success');
        setMessage('✅ Event submitted successfully! Waiting for admin approval.');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category: 'general',
          capacity: '',
          tags: '',
          image: '',
        });
        
        // Switch to submissions tab
        setActiveTab('submissions');
      } else {
        const errorMessage = (response as EventCreationResponse).error || 'Failed to submit event.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : '❌ Something went wrong while submitting the event.');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingEvents = submittedEvents.filter(event => event.status === 'pending');
  const approvedEvents = submittedEvents.filter(event => event.status === 'approved');
  const rejectedEvents = submittedEvents.filter(event => event.status === 'rejected');

  return (
    <div className={styles.submitPage}>
      <header className={styles.header}>
        <h1>Submit an Event</h1>
        <p>
          Fill in the details below to submit your event. 
          Once reviewed by the admin, it will appear in the community feed.
        </p>
      </header>

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'create' ? styles.active : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create New Event
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'submissions' ? styles.active : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          My Submissions
          {pendingEvents.length > 0 && (
            <span className={styles.pendingBadge}>{pendingEvents.length}</span>
          )}
        </button>
      </div>

      {/* Create Event Form */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a detailed description about the event"
              rows={4}
              required
            />
          </div>

          {/* Date and Time */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Event Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="time">Event Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className={styles.formGroup}>
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location or venue"
              required
            />
          </div>

          {/* Category and Capacity */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="general">General</option>
                <option value="sports">Sports</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="community">Community</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="capacity">Capacity (Optional)</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Max attendees"
                min="1"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className={styles.formGroup}>
            <label htmlFor="image">Event Image URL (Optional)</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/event-image.jpg"
            />
            <small>Add a link to your event image</small>
          </div>

          {/* Tags */}
          <div className={styles.formGroup}>
            <label htmlFor="tags">Tags (Optional)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., workshop, free, family-friendly"
            />
            <small>Separate tags with commas</small>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Submitting...
              </>
            ) : (
              'Submit Event for Approval'
            )}
          </button>
        </form>
      )}

      {/* My Submissions */}
      {activeTab === 'submissions' && (
        <div className={styles.submissionsSection}>
          {/* Status Summary */}
          <div className={styles.statusSummary}>
            <div className={styles.statusItem}>
              <span className={styles.statusCount}>{pendingEvents.length}</span>
              <span className={styles.statusLabel}>Pending</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusCount}>{approvedEvents.length}</span>
              <span className={styles.statusLabel}>Approved</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusCount}>{rejectedEvents.length}</span>
              <span className={styles.statusLabel}>Rejected</span>
            </div>
          </div>

          {/* Submissions List */}
          {submittedEvents.length === 0 ? (
            <div className={styles.emptySubmissions}>
              <p>You haven't submitted any events yet.</p>
            </div>
          ) : (
            <div className={styles.submissionsList}>
              {submittedEvents.map((event) => (
                <div key={event.id} className={styles.submissionCard}>
                  <div className={styles.submissionHeader}>
                    <h3>{event.title}</h3>
                    <span className={`${styles.statusBadge} ${styles[event.status]}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  <p className={styles.submissionDate}>
                    Submitted: {new Date(event.submittedAt).toLocaleDateString()}
                  </p>
                  {event.adminFeedback && (
                    <p className={styles.adminFeedback}>
                      <strong>Admin Feedback:</strong> {event.adminFeedback}
                    </p>
                  )}
                  {event.status === 'approved' && (
                    <div className={styles.managementActions}>
                      <button className={styles.manageBtn}>Manage Event</button>
                      <button className={styles.notifyBtn}>Send Notification</button>
                      <button className={styles.viewAttendeesBtn}>View Attendees</button>
                    </div>
                  )}
                  {event.status === 'rejected' && (
                    <div className={styles.managementActions}>
                      <button className={styles.resubmitBtn}>Resubmit</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status Messages */}
      {status !== 'idle' && (
        <div
          className={`${styles.message} ${
            status === 'success' ? styles.success : styles.error
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}