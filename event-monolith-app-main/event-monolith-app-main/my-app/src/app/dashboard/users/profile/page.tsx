'use client';

import { useState, useEffect } from 'react';
import { apiFetch, clearTokens } from '@/app/api/client';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();

  // ✅ Student data (will be fetched from API)
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    role: '', // Removed default "Pupil"
    is_verified: false,
  });

  const [showViewDetails, setShowViewDetails] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ✅ API call for fetching profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiFetch<{
          full_name: string;
          email: string;
          phone: string;
          gender?: string;
          role?: string;
          is_verified: boolean;
        }>('/api/auth/profile/', { method: 'GET' });

        setCurrentUser({
          name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar: '', // Keep avatar empty if not provided
          role: data.role || '', // Use API role if provided
          is_verified: data.is_verified,
        });
      } catch (e) {
        router.replace('/auth/login');
      }
    };
    loadProfile();
  }, [router]);

  return (
    <div className={styles.page}>
      {/* Top user bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topTitle}>Profile</h1>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Profile" />
              ) : (
                <span className={styles.avatarFallback}>
                  {currentUser.name?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{currentUser.name || 'User Name'}</span>
              {currentUser.role && <span className={styles.userRole}>{currentUser.role}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Profile shell */}
      <div className={styles.shell}>
        {/* Main profile content */}
        <main className={styles.profilePanel}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatarSection}>
              <div className={styles.profileAvatarLarge}>
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Profile" />
                ) : (
                  <span className={styles.avatarFallbackLarge}>
                    {currentUser.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <h2 className={styles.profileName}>{currentUser.name || 'User Full Name'}</h2>
              {currentUser.role && <p className={styles.profileRole}>{currentUser.role}</p>}
              <div className={styles.profileStatus}>
                <span className={styles.statusDot}></span>
                Active
              </div>
            </div>
          </div>

          <div className={styles.profileContent}>
            <div className={styles.profileCard}>
              <h3 className={styles.cardTitle}>Personal Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Full Name</div>
                  <div className={styles.infoValue}>{currentUser.name || 'Not set'}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Email Address</div>
                  <div className={styles.infoValue}>{currentUser.email || 'Not set'}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Phone Number</div>
                  <div className={styles.infoValue}>{currentUser.phone || 'Not set'}</div>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.primaryButton}
                onClick={() => setShowViewDetails(true)}
              >
                View Details
              </button>

              <button
                className={styles.secondaryButton}
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>

              <button
                className={styles.dangerButton}
                onClick={async () => {
                  try {
                    await apiFetch('/api/auth/logout/', { method: 'POST' });
                  } catch {}
                  clearTokens();
                  router.replace('/auth/login');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </main>

        {/* Info panel (optional extra info) */}
        <aside className={styles.infoPanel}>
          <div className={styles.infoCard}>
            <div className={styles.infoAvatar}>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Profile" />
              ) : (
                <span className={styles.avatarFallback}>
                  {currentUser.name?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
              <span className={`${styles.presenceDot} ${styles.online}`} aria-hidden />
            </div>
            <div className={styles.infoName}>{currentUser.name || 'User Name'}</div>
            {currentUser.role && <div className={styles.infoMeta}>{currentUser.role}</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
