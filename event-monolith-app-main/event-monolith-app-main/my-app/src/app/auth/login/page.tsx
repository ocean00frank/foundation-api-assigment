"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../css/login.css"

export default function Login() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        // Try JSON first, then fallback to text. Provide clearer error info.
        let message = `Login failed (${response.status})`
        try {
          const errData = await response.json()
          message = errData?.error || errData?.detail || JSON.stringify(errData)
        } catch (_) {
          const text = await response.text().catch(() => "")
          if (text) message = text
        }
        
        // Provide specific error messages based on status codes
        if (response.status === 401) {
          message = "Invalid email or password. Please check your credentials."
        } else if (response.status === 403) {
          // Check if this is a verification error
          try {
            const errorData = await response.json()
            if (errorData.requiresVerification) {
              message = "Account not verified. Please check your email for verification."
              // Redirect to verification page based on user role
              const userRole = errorData.userRole || "USER"
              router.push(`/auth/verify-2fa?email=${encodeURIComponent(formData.get("email") as string)}&role=${userRole}`)
              return
            }
          } catch (_) {
            message = "Access denied. Please contact support."
          }
        } else if (response.status === 500) {
          message = "Server error. Please ensure the database is set up and try again."
        }
        
        throw new Error(message || "Login failed")
      }

      const data = await response.json()

      // ✅ Elysia.js login response: { token, user, message }
      if (data.token) {
        // Store token in localStorage
        localStorage.setItem("access_token", data.token)
        
        // Store user info if available
        if (data.user) {
          localStorage.setItem("user_data", JSON.stringify(data.user))
        }
        
        console.log("✅ Login successful, redirecting...")
        
        // ✅ Redirect based on user role
        if (data.user.role === "ADMIN") {
          router.push("/dashboard/admin/main") // Admin dashboard
        } else {
          router.push("/dashboard/users/main") // User dashboard
        }
        
      } else {
        throw new Error("Invalid response: Missing authentication token")
      }
    } catch (err: unknown) {
      console.error("❌ Login error:", err)
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Logo */}
      <Link href="/" className="login-logo">
        <Image
          src="/logo.svg"
          alt="Mainno Trust Home"
          width={150}
          height={70}
        />
      </Link>

      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">
          Sign in to continue your Event
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="mwelwa@gmail.com"
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              minLength={8}
              required
              placeholder="Enter your password"
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="remember-forgot">
            <label className="remember-me">
              <input type="checkbox" className="checkbox" disabled={isLoading} />
              Remember me
            </label>
            <Link href="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login to Account"}
          </button>

          <div className="login-footer">
            <p className="signup-text">
              Don't have an account?{" "}
              <Link href="/auth/register" className="signup-link">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}