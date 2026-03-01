import { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Youtube,
  Linkedin,
  Twitter,
  Instagram,
  Zap,
} from "lucide-react";
import { ImageWithFallback } from "./components/imageWithFallback";

export default function App() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setEmailError("This email is already on the waitlist!");
        } else {
          setEmailError("Something went wrong. Please try again.");
        }
        return;
      }

      setEmailError("");
      setIsSubmitted(true);
      setEmail("");
    } catch {
      setEmailError("Cannot connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1583932692875-a42450d50acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMHdvcmtzcGFjZSUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzIzNzUzODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Content Repurposer Dashboard"
                  className="w-full h-auto"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-tr from-purple-600/20 to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-2xl max-w-xs"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Time saved per week
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      15+ hours
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      From 1 content → 10+ formats
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Content & Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center"
            >
              {/* Logo/Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 mb-6 self-start"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-semibold">
                  AI-Powered Content Repurposer
                </span>
              </motion.div>

              {/* Hero Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Turn 1 Content into
                <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  10+ Formats
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-8 leading-relaxed"
              >
                Upload a video, podcast, or article. Get TikToks, Twitter
                threads, LinkedIn posts, newsletters, and more—automatically
                generated by AI.
              </motion.p>

              {/* Platform Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="text-gray-400 text-sm">Works with:</span>
                <div className="flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-gray-400" />
                  <Linkedin className="w-5 h-5 text-gray-400" />
                  <Twitter className="w-5 h-5 text-gray-400" />
                  <Instagram className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 text-sm">+ more</span>
                </div>
              </motion.div>

              {/* Email Form or Success Message */}
              {!isSubmitted ? (
                <>
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className={`flex-1 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          emailError
                            ? "border-red-400 focus:ring-red-400"
                            : "border-white/20 focus:ring-purple-500"
                        }`}
                        required
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 bg-linear-to-r cursor-pointer from-purple-500 to-pink-500 text-white rounded-lg font-bold shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                              />
                            </svg>
                            Joining...
                          </span>
                        ) : (
                          "Get Early Access"
                        )}
                      </motion.button>
                    </div>

                    {/* Email Error */}
                    {emailError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                      >
                        <svg
                          className="w-5 h-5 text-red-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-red-300 text-sm">{emailError}</p>
                      </motion.div>
                    )}
                  </motion.form>

                  {/* Benefits */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>First 3 repurposing credits free</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Cancel anytime</span>
                    </div>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                >
                  <div className="text-white">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-16 h-16 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2 text-center">
                      Thank You!
                    </h2>
                    <p className="text-lg text-gray-300 text-center">
                      You'll receive an email when we launch.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
