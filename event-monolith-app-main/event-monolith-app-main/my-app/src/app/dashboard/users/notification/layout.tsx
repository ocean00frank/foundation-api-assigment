"use client";

import Link from "next/link";
import styles from "./notification.module.css";

interface NotificationLayoutProps {
  children: React.ReactNode;
  userName?: string;
}

export default function NotificationLayout({
  children,
  userName = "Notifications",
}: NotificationLayoutProps) {
  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Zambian Community Events</h2>
        </div>

        <nav className={styles.sidebarNav}>
          {/* Home */}
          <Link href="/dashboard/users/main" className={styles.navItem}>
            <svg
              className={styles.navIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>Home</span>
          </Link>

          {/* My Events */}
          <Link href="/dashboard/users/myEvents" className={styles.navItem}>
            <svg
              className={styles.navIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <span>My Events</span>
          </Link>

          {/* Submit Event */}
          <Link href="/dashboard/users/submitEvent" className={styles.navItem}>
            <svg
              className={styles.navIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11h3v-2h-3V8h-2v3H8v2h3v3h2v-3z" />
            </svg>
            <span>Submit Event</span>
          </Link>

          {/* Favorites */}
          <Link href="/dashboard/users/favorite" className={styles.navItem}>
            <svg
              className={styles.navIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Favorites</span>
          </Link>

          {/* Notifications */}
          <Link href="/dashboard/users/notification" className={`${styles.navItem} ${styles.active}`}>
            <svg
              className={styles.navIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span>Notifications</span>
          </Link>

          {/* Profile */}
          <Link href="/dashboard/users/profile" className={styles.navItem}>
            <svg
              className={styles.navIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>Profile</span>
          </Link>

          {/* Logout */}
          <Link href="/logout" className={styles.navItem}>
            <svg
              className={styles.navIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
            <span>Logout</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.dashboardMain}>
        {/* Header */}
        <header className={styles.dashboardHeader}>
          <h1>{userName}</h1>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
