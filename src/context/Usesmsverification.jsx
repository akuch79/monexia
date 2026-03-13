import { useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Africa's Talking SMS Verification
// Docs: https://developers.africastalking.com/docs/sms/sending
//
// Setup:
//   1. Sign up at africastalking.com (free)
//   2. Get your API key from the dashboard
//   3. Add to .env:  VITE_AT_API_KEY=your_key
//                    VITE_AT_USERNAME=your_username
//
// NOTE: SMS sending must go through YOUR BACKEND to keep the API key secret.
//       The backend endpoint is POST /api/sms/send-otp
//       See server/routes/sms.js for the backend code.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

// Generate a 6-digit OTP
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

export function useSmsVerification() {
  const [otp,         setOtp]         = useState("");
  const [sentOtp,     setSentOtp]     = useState(null);   // stored to verify against
  const [otpSent,     setOtpSent]     = useState(false);
  const [verified,    setVerified]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [countdown,   setCountdown]   = useState(0);

  // Start a 60-second resend countdown
  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP to phone number
  const sendOtp = useCallback(async (phone) => {
    if (!phone?.trim()) return { success:false, error:"Enter a phone number." };
    setLoading(true);
    setError("");

    const code = generateOTP();

    try {
      // In production: call your backend which uses Africa's Talking SDK
      // Backend keeps the AT API key secret
      const res = await fetch(`${API_BASE}/sms/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: code }),
      });

      if (!res.ok) throw new Error("SMS service unavailable.");

      setSentOtp(code);
      setOtpSent(true);
      startCountdown();
      setLoading(false);
      return { success:true };

    } catch (e) {
      // DEVELOPMENT FALLBACK: show OTP in console when backend isn't running
      console.warn("⚠ SMS backend not running. Dev mode: OTP is", code);
      setSentOtp(code);
      setOtpSent(true);
      startCountdown();
      setLoading(false);
      // In dev, show the code in the UI so you can test
      return { success:true, devOtp: code };
    }
  }, []);

  // Verify the OTP entered by user
  const verifyOtp = useCallback((entered) => {
    if (!entered?.trim()) { setError("Enter the OTP."); return false; }
    if (entered.trim() === sentOtp) {
      setVerified(true);
      setError("");
      return true;
    }
    setError("Incorrect OTP. Please try again.");
    return false;
  }, [sentOtp]);

  const reset = () => {
    setOtp(""); setSentOtp(null); setOtpSent(false);
    setVerified(false); setError(""); setCountdown(0);
  };

  return { otp, setOtp, otpSent, verified, loading, error, countdown, sendOtp, verifyOtp, reset };
}