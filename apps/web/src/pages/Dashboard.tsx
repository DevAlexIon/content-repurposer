import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  LogOut,
  Zap,
  FileText,
  Clock,
  TrendingUp,
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  Loader,
  Sparkles,
} from "lucide-react";
import { logout, selectUser } from "../store/authSlice";
import "../assets/styles/dashboard.css";
import { useGetJobsQuery } from "../store/api/jobsApi";
import NewProjectModal from "../components/newProjectModal";

type JobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "done"
  | "error";

const StatusIcon = ({ status }: { status: JobStatus }) => {
  if (status === "completed")
    return <CheckCircle size={14} className="status-icon completed" />;
  if (status === "processing")
    return <Loader size={14} className="status-icon processing spin" />;
  if (status === "pending")
    return <Clock size={14} className="status-icon pending" />;
  if (status === "done")
    return <CheckCircle size={14} className="status-icon completed" />;
  if (status === "error")
    return <XCircle size={14} className="status-icon failed" />;
  return <XCircle size={14} className="status-icon failed" />;
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser)!;
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const { data: jobs = [], isLoading } = useGetJobsQuery(undefined, {
    pollingInterval: 5000,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="dash-root">
        <div className="dash-blob-1" />
        <div className="dash-blob-2" />
        <nav className="dash-nav">
          <div className="dash-nav-inner">
            <div className="dash-logo">
              <div className="dash-logo-icon">⚡</div>
              <span className="dash-logo-text">
                Repurposer<span>.ai</span>
              </span>
            </div>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          <p className="text-white/40 text-sm font-medium">
            Loading your projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-root">
      <div className="dash-blob-1" />
      <div className="dash-blob-2" />

      <nav className="dash-nav">
        <div className="dash-nav-inner">
          <div className="dash-logo">
            <div className="dash-logo-icon">⚡</div>
            <span className="dash-logo-text">
              Repurposer<span>.ai</span>
            </span>
          </div>
          <div className="dash-nav-right">
            <div className="dash-credits-pill">
              <Zap size={12} />
              <span>{user.credits} credits</span>
            </div>
            <div className="dash-avatar">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <button
              className="dash-logout"
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main className="dash-main">
        <motion.div
          className="dash-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="dash-title">
              Good morning, <span className="dash-title-name">{user.name}</span>{" "}
              👋
            </h1>
            <p className="dash-subtitle">
              Turn your content into multiple formats in seconds.
            </p>
          </div>
          <motion.button
            className="dash-new-btn"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={18} /> New Project <Sparkles size={14} />
          </motion.button>
        </motion.div>

        <motion.div
          className="dash-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            {
              label: "Total Projects",
              value: jobs.length,
              icon: <FileText size={18} />,
              color: "#7C3AED",
            },
            {
              label: "Formats Generated",
              value: jobs.filter((j) => j.status === "done").length * 4,
              icon: <TrendingUp size={18} />,
              color: "#06B6D4",
            },
            {
              label: "Hours Saved",
              value: "12h",
              icon: <Clock size={18} />,
              color: "#10B981",
            },
            {
              label: "Credits Left",
              value: user.credits,
              icon: <Zap size={18} />,
              color: "#F59E0B",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="dash-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div
                className="dash-stat-icon"
                style={{ color: s.color, background: `${s.color}18` }}
              >
                {s.icon}
              </div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="dash-section-header">
            <h2 className="dash-section-title">Recent Projects</h2>
            <span className="dash-section-count">{jobs.length} total</span>
          </div>
          <div className="dash-jobs">
            <AnimatePresence>
              {jobs.length === 0 ? (
                <div className="dash-empty">
                  <p>No projects yet — create your first one!</p>
                </div>
              ) : (
                jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    className={`dash-job-card ${hoveredJob === job.id ? "hovered" : ""} ${
                      job.status === "done"
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() =>
                      job.status === "done" ? navigate(`/jobs/${job.id}`) : null
                    }
                    transition={{ delay: 0.2 + i * 0.07 }}
                    onHoverStart={() => setHoveredJob(job.id)}
                    onHoverEnd={() => setHoveredJob(null)}
                    whileHover={{ y: -2 }}
                  >
                    <div className="dash-job-left">
                      <div className="dash-job-play">
                        <Play size={14} fill="currentColor" />
                      </div>
                      <div>
                        <div className="dash-job-title">
                          {job.input_text
                            ? job.input_text.slice(0, 30) + "..."
                            : job.input_url
                              ? new URL(job.input_url).hostname
                              : "Untitled"}
                        </div>
                        <div className="dash-job-meta">
                          <span className="dash-job-type">
                            {job.input_type === "url" ? "URL" : "Text"}
                          </span>
                          <span className="dash-job-dot">·</span>
                          <span className="dash-job-time">
                            {new Date(job.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="dash-job-right">
                      <div className="dash-job-status">
                        <StatusIcon status={job.status} />
                        <span className={`dash-job-status-text ${job.status}`}>
                          {job.status}
                        </span>
                      </div>
                      <ChevronRight size={16} className="dash-job-arrow" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
