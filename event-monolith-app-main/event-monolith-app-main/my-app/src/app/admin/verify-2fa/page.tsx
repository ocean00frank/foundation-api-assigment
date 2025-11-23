"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import styles from "./verify.module.css"

export default function AdminVerify2FA() {
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get("email") || ""
  const userRole = searchParams.get("role") || "ADMIN"

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
        console.log("✅ Admin verification successful, redirecting to dashboard...")
        
        // Store user data
        if (data.user) {
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }
        
        // Generate token for admin
        const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: "", // We'll need to handle this differently
          }),
        })

        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          if (loginData.token) {
            localStorage.setItem("access_token", loginData.token)
          }
        }

        // Redirect to admin dashboard
        router.push("/dashboard/admin/main")
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
    <div className={styles.container}>
      <div className={styles.card}>
        <Link href="/admin/login" className={styles.backButton}>
          ← Back
        </Link>
        
        <div className={styles.header}>
          <h1>Admin Verification</h1>
          <p className={styles.subtitle}>
            Enter the verification code sent to <strong>{email}</strong>
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={styles.codeInput}
              placeholder="Enter verification code"
            />
          </div>

          <div style={{ color: '#00D4AA', textAlign: 'center', fontSize: '0.875rem', marginBottom: '10px' }}>
            💡 For testing, use: <strong>mock-token</strong>
          </div>

          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.verifyBtn} ${isLoading ? styles.loading : ''}`}
          >
            {isLoading ? "Verifying..." : "Verify Admin Account"}
          </button>

          <div className={styles.resendCode}>
            <p>
              Didn't receive the code?
              <button type="button" className={styles.resendButton} disabled>
                Resend Code
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}