"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import "../../css/login.css"
import "./verify.css"

export default function Verify2FA() {
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get("email") || ""
  const userRole = searchParams.get("role") || "ATTENDEE"

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verificationToken: verificationCode,
        }),
      })

      if (!response.ok) {
        let message = `Verification failed (${response.status})`
        try {
          const errData = await response.json()
          message = errData?.error || errData?.detail || JSON.stringify(errData)
        } catch (_) {
          const text = await response.text().catch(() => "")
          if (text) message = text
        }
        throw new Error(message || "Verification failed")
      }

      const data = await response.json()

      if (data.message === "User verified successfully" || data.user?.isVerified) {
        console.log("✅ Verification successful, redirecting to login...")
        
        // Redirect back to login with success message
        router.push(`/auth/login?verified=true&email=${encodeURIComponent(email)}&role=${userRole}`)
      } else {
        console.log("Response data:", data)
        throw new Error(data.error || "Invalid verification response")
      }
    } catch (err: unknown) {
      console.error("❌ Verification error:", err)
      setError(
        err instanceof Error ? err.message : "Verification failed. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <Link href="/auth/login" className="back-button">
          ← Back
        </Link>
        
        <div className="auth-header">
          <h1>Verify Your Account</h1>
          <p className="subtitle">
            Enter the verification code sent to <strong>{email}</strong>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="code-input-container">
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="code-input"
              placeholder="Enter verification code"
            />
          </div>

          <div style={{ color: '#00D4AA', textAlign: 'center', fontSize: '0.875rem', marginBottom: '10px' }}>
            💡 For testing, use: <strong>mock-token</strong>
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`verify-btn ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </button>

          <div className="resend-code">
            <p>
              Didn't receive the code?
              <button type="button" className="resend-button" disabled>
                Resend Code
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}