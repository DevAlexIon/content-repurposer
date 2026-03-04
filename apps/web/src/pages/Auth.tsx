import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { useFormik } from "formik";
import "../assets/styles/auth.css";
import { loginSchema, signupSchema } from "../validations/auth";
import { useDispatch } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../store/api/authApi";
import { setCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const result = await login({ email, password });
    if ("data" in result && result.data) {
      dispatch(setCredentials(result.data));
      navigate("/dashboard");
      return true;
    }
    return false;
  };

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: mode === "login" ? loginSchema : signupSchema,
    validateOnBlur: true,

    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");

      if (mode === "login") {
        const ok = await handleLogin(values.email, values.password);
        if (!ok) setServerError("Invalid email or password");
      } else {
        const result = await register({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        if ("data" in result) {
          await handleLogin(values.email, values.password);
        } else {
          setServerError("Could not create account. Email may already exist.");
        }
      }

      setSubmitting(false);
    },
  });

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setServerError("");
    formik.resetForm();
  };

  const stats = [
    { value: "15h", label: "saved per week" },
    { value: "10x", label: "faster creation" },
    { value: "4+", label: "output formats" },
  ];

  return (
    <div className="auth-root">
      <div className="auth-blob-1" />
      <div className="auth-blob-2" />

      {/* Left branding panel */}
      <div className="auth-left">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <span className="auth-logo-text">
            Repurposer<span>.ai</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="auth-headline">
            One piece of content.
            <br />
            <span className="auth-headline-gradient">Ten formats.</span>
          </h1>
          <p className="auth-subtitle">
            Upload your video, podcast, or article and get LinkedIn posts,
            Twitter threads, newsletters and TikTok scripts — instantly.
          </p>
        </motion.div>

        <motion.div
          className="auth-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="auth-stat-value">{s.value}</div>
              <div className="auth-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="auth-feature-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="auth-feature-icon">
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <div className="auth-feature-title">
              AI generates all formats simultaneously
            </div>
            <div className="auth-feature-desc">
              LinkedIn, Twitter thread, Newsletter, TikTok script — all in under
              60 seconds.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%" }}
        >
          {/* Tab switcher */}
          <div className="auth-tabs">
            <motion.div
              layoutId="tab-indicator"
              style={{
                position: "absolute",
                top: 4,
                bottom: 4,
                width: "calc(50% - 4px)",
                background: "rgba(139,92,246,0.25)",
                borderRadius: 8,
                border: "1px solid rgba(139,92,246,0.3)",
              }}
              animate={{ left: mode === "login" ? 4 : "50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              className={`tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => switchMode("signup")}
            >
              Create Account
            </button>
          </div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="auth-form-title">
                {mode === "login" ? "Welcome back" : "Start creating smarter"}
              </h2>
              <p className="auth-form-subtitle">
                {mode === "login"
                  ? "Sign in to access your dashboard"
                  : "Create your free account — 3 credits included"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Google button */}
          {/* <button className="google-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              />
              <path
                fill="#34A853"
                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
              />
              <path
                fill="#FBBC05"
                d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"
              />
              <path
                fill="#EA4335"
                d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
              />
            </svg>
            Continue with Google
          </button> */}

          <div className="auth-divider">or continue with email</div>

          {/* Form */}
          <form className="auth-form" onSubmit={formik.handleSubmit}>
            {/* Name field — signup only */}
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    className={`auth-input ${formik.touched.name && formik.errors.name ? "has-error" : ""}`}
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="auth-field-error">{formik.errors.name}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="auth-field">
              <input
                className={`auth-input ${formik.touched.email && formik.errors.email ? "has-error" : ""}`}
                type="email"
                name="email"
                placeholder="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="auth-field-error">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <input
                className={`auth-input password ${formik.touched.password && formik.errors.password ? "has-error" : ""}`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="auth-field-error">{formik.errors.password}</p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <motion.p
                className="auth-error-banner"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {serverError}
              </motion.p>
            )}

            {/* Forgot password */}
            {mode === "login" && (
              <button type="button" className="forgot-btn">
                Forgot password?
              </button>
            )}

            {/* Submit */}
            <button
              className="submit-btn"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <div className="spinner" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          {mode === "signup" && (
            <p className="auth-terms">
              By creating an account, you agree to our{" "}
              <span className="auth-terms-link">Terms</span> and{" "}
              <span className="auth-terms-link">Privacy Policy</span>
            </p>
          )}

          {/* Switch mode */}
          <p className="auth-switch">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
