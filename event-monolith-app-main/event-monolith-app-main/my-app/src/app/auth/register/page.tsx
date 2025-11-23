"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { apiFetch } from "@/app/api/client";
import { useRouter } from "next/navigation";
import "../../css/register.css";

export default function Register() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Password strength regex
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and a special symbol."
      );
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const payload = {
      email: formData.get("email") as string,
      password: password,
      role: "ATTENDEE", // Default role for new users
    };

    try {
      const data = await apiFetch<{ token?: string; user?: any; message?: string }>(
        `/api/auth/signup`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      // Save token and redirect
      if (data.token) {
        localStorage.setItem("access_token", data.token);
        
        setSuccess("✅ Registration successful! Redirecting to dashboard...");
        
        // Store user info if available
        if (data.user) {
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }
        
        setTimeout(() => {
          router.push(`/auth/verify-2fa?email=${encodeURIComponent(payload.email)}&role=ATTENDEE`);
        }, 1500);
      } else {
        setSuccess("✅ Registration successful! Redirecting to dashboard...");
        setTimeout(() => {
          router.push(`/auth/verify-2fa?email=${encodeURIComponent(payload.email)}&role=ATTENDEE`);
        }, 1500);
      }

      // Reset form if it exists
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
    } catch (err: unknown) {
      console.error("❌ Fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Logo */}
      <Link href="/" className="register-logo">
        <Image src="/logo.svg" alt="Mainno Trust Home" width={150} height={70} />
      </Link>

      <div className="register-card">
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">
          Join hundreds of Zambian pupils achieving academic excellence
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              required
              placeholder="+260 XXX XXX XXX"
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="student@example.com"
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select
              name="gender"
              id="gender"
              className="form-select"
              required
              disabled={isLoading}
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Create a strong password"
              className="form-input"
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirm your password"
              className="form-input"
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <div className="terms-agreement">
            <label className="terms-label">
              <input type="checkbox" className="terms-checkbox" required disabled={isLoading} />
              I agree to the{" "}
              <Link href="/terms" className="terms-link">Terms & Conditions</Link> and{" "}
              <Link href="/privacy" className="terms-link">Privacy Policy</Link>
            </label>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>

          <div className="register-footer">
            <p className="login-text">
              Already have an account?{" "}
              <Link href="/auth/login" className="login-link">
                Login Here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
