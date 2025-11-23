"use client"
import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin-login.module.css";
import { apiFetch } from "@/app/api/client";

interface FormErrors {
  email?: string;
  password?: string;
  backend?: string;
}

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Use Elysia backend - same login endpoint for all users
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error || `Login failed (${response.status})`);
      }

      const data = await response.json();

      // Check if user is admin
      if (data.user && data.user.role !== "ADMIN") {
        setErrors({ backend: "Access denied. Admin credentials required." });
        return;
      }

      // Check if admin needs 2FA verification
      if (data.requiresVerification || (data.user && !data.user.isVerified)) {
        // Store email for 2FA
        localStorage.setItem("admin_email", email);
        router.push(`/admin/verify-2fa?email=${encodeURIComponent(email)}&role=ADMIN`);
        return;
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem("access_token", data.token);
        
        if (data.user) {
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }

        // Redirect to admin dashboard
        router.push("/dashboard/admin/main");
      } else {
        throw new Error("Invalid response: Missing authentication token");
      }
    } catch (error: any) {
      setErrors({ backend: error?.message || "Login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.adminLoginCard}>
        <div className={styles.adminLoginHeader}>
          <img 
            src="/logo.svg" 
            alt="Mainno Trust Logo" 
            className={styles.adminLogo}
          />
          <div className={styles.adminLockIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h1>Restricted Area</h1>
          <p>Welcome Admin, please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.adminLoginForm}>
          {errors.backend && (
            <div className={styles.errorMessage}>{errors.backend}</div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              className={errors.email ? styles.error : ""}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordInputContainer}>
              <input
                
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={errors.password ? styles.error : ""}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>

          <div className={styles.formOptions}>
            <label className={styles.checkboxContainer}>
              <input type="checkbox" />
              <span className={styles.checkmark}></span>
              Remember me
            </label>
            <Link href="/dashboard/admin/main" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className={`${styles.loginButton} ${isLoading ? styles.loading : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.adminLoginFooter}>
          <p>© 2025 Mainno Trust. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
