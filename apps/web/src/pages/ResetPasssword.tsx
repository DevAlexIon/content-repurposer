import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "../assets/styles/auth.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validLink, setValidLink] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) {
      setValidLink(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, accessToken }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const strength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981"];

  return (
    <div className="auth-root">
      <div className="auth-blob-1" />
      <div className="auth-blob-2" />

      <div
        style={{
          margin: "auto",
          width: "100%",
          maxWidth: 440,
          padding: "0 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div
            className="auth-logo"
            style={{ marginBottom: 40, justifyContent: "center" }}
          >
            <div className="auth-logo-icon">⚡</div>
            <span className="auth-logo-text">
              Repurposer<span>.ai</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* Invalid link */}
            {!validLink && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "40px 32px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 16,
                }}
              >
                <AlertCircle
                  size={48}
                  color="#ef4444"
                  style={{ margin: "0 auto 16px" }}
                />
                <h2 className="auth-form-title" style={{ color: "#ef4444" }}>
                  Invalid link
                </h2>
                <p className="auth-form-subtitle" style={{ marginBottom: 24 }}>
                  This reset link is invalid or has expired. Please request a
                  new one.
                </p>
                <button
                  className="submit-btn"
                  onClick={() => navigate("/login")}
                >
                  Back to Login <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Success */}
            {validLink && success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "40px 32px",
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 16,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                >
                  <CheckCircle
                    size={56}
                    color="#10b981"
                    style={{ margin: "0 auto 20px" }}
                  />
                </motion.div>
                <h2 className="auth-form-title">Password updated!</h2>
                <p className="auth-form-subtitle">
                  Your password has been changed. Redirecting to login...
                </p>
                <div
                  style={{
                    marginTop: 24,
                    height: 3,
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      background: "#10b981",
                      borderRadius: 99,
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Form */}
            {validLink && !success && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "36px 32px",
                }}
              >
                <h2 className="auth-form-title" style={{ marginBottom: 6 }}>
                  Set new password
                </h2>
                <p className="auth-form-subtitle" style={{ marginBottom: 28 }}>
                  Choose a strong password for your account.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="auth-field">
                    <input
                      className="auth-input password"
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password strength */}
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{ marginTop: -8, marginBottom: 12 }}
                    >
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 3,
                              borderRadius: 99,
                              background:
                                i <= strength
                                  ? strengthColor[strength]
                                  : "rgba(255,255,255,0.1)",
                              transition: "background 0.3s",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: strengthColor[strength],
                          margin: 0,
                        }}
                      >
                        {strengthLabel[strength]}
                      </p>
                    </motion.div>
                  )}

                  <div className="auth-field">
                    <input
                      className={`auth-input ${confirmPassword && password !== confirmPassword ? "has-error" : ""}`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="auth-field-error">Passwords do not match</p>
                    )}
                  </div>

                  {error && (
                    <motion.p
                      className="auth-error-banner"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    className="submit-btn"
                    type="submit"
                    disabled={
                      loading ||
                      (confirmPassword.length > 0 &&
                        password !== confirmPassword)
                    }
                  >
                    {loading ? (
                      <div className="spinner" />
                    ) : (
                      <>
                        Update Password <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <p className="auth-switch" style={{ marginTop: 20 }}>
                  Remember your password?{" "}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => navigate("/login")}
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
