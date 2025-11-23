'use client';

import { useState, useEffect } from 'react';
import { apiFetch, clearTokens } from '@/app/api/client';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

export default function AdminProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [currentAdmin, setCurrentAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    role: 'Admin',
    is_verified: false,
  });

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
          router.replace('/admin/login');
          return;
        }

        const data = await apiFetch<{
          full_name: string;
          email: string;
          phone: string;
          gender?: string;
          is_verified: boolean;
        }>('/api/admin/auth/profile/', { method: 'GET' });

        setCurrentAdmin({
          name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar: '',
          role: 'Admin',
          is_verified: !!data.is_verified,
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
        router.replace('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminProfile();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiFetch('/api/admin/auth/logout/', { method: 'POST' });
    } catch {}
    clearTokens();
    router.replace('/admin/login');
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading admin profile...</div>;
  }

  const initial = currentAdmin.name?.[0]?.toUpperCase() || 'A';

  return (
    <div className={styles.profileContainer}>
      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          {currentAdmin.avatar ? <img src={currentAdmin.avatar} alt="Admin Avatar" /> : <span>{initial}</span>}
        </div>

        <div className={styles.profileInfo}>
          <h2>{currentAdmin.name || 'Admin'}</h2>
          <p>{currentAdmin.role}</p>
        </div>

        <div className={styles.profileActions}>
          <button
            onClick={handleLogout}
            className={`${styles.actionButton} ${styles.danger}`}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.profileContent}>
        <div className={styles.profileSection}>
          <h3>Personal Information</h3>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <input type="text" value={currentAdmin.name} className={styles.formInput} disabled />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address</label>
            <input type="email" value={currentAdmin.email} className={styles.formInput} disabled />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number</label>
            <input type="tel" value={currentAdmin.phone} className={styles.formInput} disabled />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Verification</label>
            <input
              type="text"
              value={currentAdmin.is_verified ? 'Verified' : 'Not Verified'}
              className={styles.formInput}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}
