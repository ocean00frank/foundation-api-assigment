"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./addEvent.module.css";
import { apiFetch } from "@/app/api/client";

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

interface ApiResponse {
  success?: boolean;
  message?: string;
  event?: any;
  error?: string;
  [key: string]: any;
}

interface CreateEventResponse {
  event?: any;
  error?: string;
  message?: string;
  success?: boolean;
}

interface UploadResponse {
  url?: string;
  error?: string;
  success?: boolean;
}

const initialFormData: EventFormData = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  category: "general",
  capacity: "",
  tags: "",
  image: "",
};

export default function AddEventPage() {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [imagePreview, setImagePreview] = useState("");

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('eventDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        setCharCount(draftData.description.length);
        if (draftData.image) {
          setImagePreview(draftData.image);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const hasData = formData.title || formData.description || formData.location;
    if (hasData) {
      const timer = setTimeout(() => {
        localStorage.setItem('eventDraft', JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  // Handle input changes with useCallback for performance
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update character count for description
    if (name === 'description') {
      setCharCount(value.length);
    }

    // Update image preview
    if (name === 'image') {
      setImagePreview(value);
    }
  }, []);

  // Enhanced validation
  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Event title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.date) return "Date is required";
    if (!formData.location.trim()) return "Location is required";
    
    // Validate description length
    if (formData.description.length < 10) {
      return "Description should be at least 10 characters long";
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "Event date cannot be in the past";

    // Validate capacity if provided
    if (formData.capacity && parseInt(formData.capacity) < 1) {
      return "Capacity must be at least 1";
    }

    // Validate image URL if provided
    if (formData.image && !isValidUrl(formData.image)) {
      return "Please enter a valid image URL";
    }

    return null;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setStatus('error');
      setMessage('Please upload a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setStatus('error');
      setMessage('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result: UploadResponse = await response.json();
      
      // Type guard to check if response has url
      if (result.url) {
        setFormData(prev => ({ ...prev, image: result.url as string }));
        setImagePreview(result.url as string);
        setStatus('success');
        setMessage('✅ Image uploaded successfully!');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ Failed to upload image. Please try again or use a URL.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem('eventDraft');
    setFormData(initialFormData);
    setCharCount(0);
    setImagePreview("");
    setStatus('idle');
    setMessage("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage("");

    // Enhanced validation
    const validationError = validateForm();
    if (validationError) {
      setStatus('error');
      setMessage(validationError);
      setLoading(false);
      return;
    }

    try {
      // Combine date and time
      const combinedDateTime = `${formData.date}T${formData.time}:00.000Z`;
      
      const response = await apiFetch<CreateEventResponse>('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: combinedDateTime,
          location: formData.location,
          image: formData.image || null,
        }),
      });

      // Type guard to check if response has event
      if (response && typeof response === 'object' && 'event' in response) {
        setStatus('success');
        setMessage('✅ Event created successfully! It is now live in the community.');
        
        // Clear draft and reset form
        clearDraft();
      } else {
        const errorMessage = (response as CreateEventResponse).error || 'Failed to create event';
        throw new Error(errorMessage);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : '❌ Failed to create event. Please try again.');
      console.error('Create event error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Create New Event</h1>
        <p className={styles.subtitle}>
          Add events directly to the community. Admin-created events are automatically approved.
        </p>
        
        {/* Draft indicator */}
        {localStorage.getItem('eventDraft') && (
          <div className={styles.draftIndicator}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            Draft auto-saved
            <button 
              type="button" 
              onClick={clearDraft}
              className={styles.clearDraftButton}
            >
              Clear Draft
            </button>
          </div>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit} id="main-content">
        {/* Title */}
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
              <path d="M5 4v3h5.5v12h3V7H19V4z"/>
            </svg>
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            className={styles.input}
            required
            maxLength={100}
          />
          <div className={styles.charCount}>
            {formData.title.length}/100
          </div>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
              <path d="M3 5v14h18V5H3zm16 12H5V7h14v10z"/>
            </svg>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your event in detail..."
            className={styles.textarea}
            rows={5}
            required
            minLength={10}
            maxLength={1000}
          />
          <div className={styles.charCount}>
            {charCount}/1000 {charCount < 10 && "(Minimum 10 characters)"}
          </div>
        </div>

        {/* Date and Time */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.1 0 2-.89 2-2V6c0-1.11-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7v-5z"/>
              </svg>
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="time" className={styles.label}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        {/* Location */}
        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location or venue"
            className={styles.input}
            required
            maxLength={200}
          />
        </div>

        {/* Category and Capacity */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              </svg>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="general">General</option>
              <option value="sports">Sports</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
              <option value="community">Community</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="arts">Arts & Culture</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="capacity" className={styles.label}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Max attendees"
              min="1"
              max="100000"
              className={styles.input}
            />
          </div>
        </div>

        {/* Tags */}
        <div className={styles.formGroup}>
          <label htmlFor="tags" className={styles.label}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
              <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
            </svg>
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., workshop, free, family-friendly"
            className={styles.input}
          />
          <small className={styles.helperText}>Separate tags with commas</small>
        </div>

        {/* Image Section */}
        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            Event Image
          </label>
          
          {/* Image Upload Option */}
          <div className={styles.imageUploadSection}>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
              disabled={loading}
            />
            <label htmlFor="image-upload" className={styles.fileInputLabel}>
              {loading ? 'Uploading...' : 'Upload Image'}
            </label>
            <span className={styles.uploadOr}>or</span>
          </div>

          {/* Image URL Input */}
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/event-image.jpg"
            className={styles.input}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Event preview" />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, image: "" }));
                  setImagePreview("");
                }}
                className={styles.removeImageButton}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className={styles.formActions}>
          <button 
            type="button"
            onClick={clearDraft}
            className={styles.secondaryButton}
            disabled={loading}
          >
            Clear Form
          </button>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                Creating Event...
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
                Create Event
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {status !== 'idle' && (
          <div 
            role="alert"
            aria-live="polite"
            className={`${styles.message} ${status === 'success' ? styles.success : styles.error}`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}