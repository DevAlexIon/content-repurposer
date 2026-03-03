import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Copy, Check, Download } from "lucide-react";
import { useGetJobQuery } from "../store/api/jobsApi";

type FormatKey =
  | "linkedin_post"
  | "twitter_thread"
  | "newsletter"
  | "tiktok_script";

const FORMATS: { key: FormatKey; label: string; icon: string; type: string }[] =
  [
    {
      key: "linkedin_post",
      label: "LinkedIn",
      icon: "💼",
      type: "Professional network",
    },
    {
      key: "twitter_thread",
      label: "Twitter",
      icon: "𝕏",
      type: "Social media thread",
    },
    {
      key: "newsletter",
      label: "Newsletter",
      icon: "✉️",
      type: "Email newsletter",
    },
    {
      key: "tiktok_script",
      label: "TikTok",
      icon: "🎵",
      type: "Short-form video",
    },
  ];

export default function JobResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetJobQuery(id!);
  const [activeFormat, setActiveFormat] = useState<FormatKey>("linkedin_post");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportAll = () => {
    setExporting(true);
    try {
      const lines: string[] = [];
      FORMATS.forEach((f) => {
        const text = outputs[f.key];
        if (!text) return;
        lines.push(`${"=".repeat(50)}`);
        lines.push(`${f.icon} ${f.label.toUpperCase()}`);
        lines.push(`${"=".repeat(50)}\n`);
        lines.push(text);
        lines.push("\n");
      });
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `repurposer-${job!.id.slice(0, 8)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const job = data?.job;
  const outputs = job?.outputs ?? {};
  const current = FORMATS.find((f) => f.key === activeFormat)!;
  const content = outputs[activeFormat] ?? "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070710] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#070710] flex items-center justify-center text-white/40">
        Job not found
      </div>
    );
  }

  const wordCount = Object.values(outputs)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#070710] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-72 left-1/2 -translate-x-1/2 w-225 h-125 bg-[radial-gradient(ellipse,rgba(124,58,237,0.1)_0%,transparent_70%)]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[rgba(7,7,16,0.85)] backdrop-blur-xl border-b border-white/7">
        <div className="max-w-250 mx-auto px-6 h-14.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/7 text-white/50 text-xs font-semibold hover:bg-white/7 hover:text-white transition-all"
            >
              <ArrowLeft size={13} /> Dashboard
            </button>
            <div className="w-px h-4 bg-white/7" />
            <span className="text-sm font-semibold text-white/40 truncate max-w-75">
              {job.input_text?.slice(0, 50)}...
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Generated
          </div>
        </div>
      </nav>

      <main className="max-w-250 mx-auto px-6 py-9 relative z-10 flex flex-col gap-7">
        {/* Header */}
        <motion.div
          className="flex items-start justify-between gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-purple-400 flex items-center gap-2 mb-2 before:content-[''] before:w-4 before:h-px before:bg-purple-400">
              Results
            </p>
            <h1 className="text-2xl font-extrabold mb-2">
              Your content is ready ✦
            </h1>
            <div className="flex items-center gap-2 text-xs text-white/30 flex-wrap">
              <span>
                {job.input_type === "url" ? "🔗 URL input" : "📝 Text input"}
              </span>
              <span>·</span>
              <span>{FORMATS.length} formats generated</span>
              <span>·</span>
              <span>
                {new Date(job.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <button
            onClick={handleExportAll}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-sm font-semibold hover:bg-purple-500/18 transition-all shrink-0"
          >
            {exporting ? (
              <div className="w-4 h-4 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin" />
            ) : (
              <>
                <Download size={14} /> Export All
              </>
            )}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {[
            {
              value: FORMATS.length,
              label: "Formats Ready",
              color: "text-purple-400",
            },
            {
              value: `${wordCount}`,
              label: "Words Generated",
              color: "text-cyan-400",
            },
            { value: "~3h", label: "Time Saved", color: "text-green-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/3 border border-white/7 rounded-xl p-4 text-center"
            >
              <div className={`text-[22px] font-extrabold mb-1 ${s.color}`}>
                {s.value}
              </div>
              <div className="text-[10px] text-white/25 font-medium uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex items-center gap-1 bg-white/3 border border-white/7 rounded-xl p-1 w-fit"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFormat(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[9px] text-sm font-semibold transition-all border whitespace-nowrap ${
                activeFormat === f.key
                  ? "bg-purple-500/15 border-purple-500/25 text-purple-300"
                  : "border-transparent text-white/50 hover:bg-white/4 hover:text-white"
              }`}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </motion.div>

        {/* Content grid */}
        <motion.div
          className="grid gap-5"
          style={{ gridTemplateColumns: "1fr 300px" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {/* Main output */}
          <div className="bg-[#0e0e1a] border border-white/7 rounded-[18px] overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/7">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center text-[17px]"
                  style={{ background: "rgba(10,102,194,0.12)" }}
                >
                  {current.icon}
                </div>
                <div>
                  <div className="text-[15px] font-bold">
                    {current.label} Post
                  </div>
                  <div className="text-[11px] text-white/25 mt-0.5">
                    {current.type}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/4 border border-white/7 text-white/50 text-xs font-semibold hover:bg-white/7 transition-all">
                  ✏️ Edit
                </button>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    copied
                      ? "bg-green-500/10 border border-green-500/25 text-green-400"
                      : "bg-purple-500/8 border border-purple-500/20 text-purple-300 hover:bg-purple-500/15"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={12} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="px-6 py-5.5 text-sm leading-[1.85] text-white/82 whitespace-pre-wrap wrap-break-word">
              {content || (
                <span className="text-white/20">
                  No content for this format.
                </span>
              )}
            </div>

            <div className="px-6 py-3 border-t border-white/7 flex items-center justify-between text-[11px] text-white/25">
              <span>{content.length} characters</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-3">
            {/* Format nav */}
            <div className="bg-[#0e0e1a] border border-white/7 rounded-2xl overflow-hidden">
              <div className="px-4.5 py-3 border-b border-white/7 text-[11px] font-semibold text-white/25 uppercase tracking-wider">
                All Formats
              </div>
              {FORMATS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFormat(f.key)}
                  className={`w-full flex items-center gap-2.5 px-4.5 py-3 border-b border-white/4 last:border-0 transition-all text-left ${
                    activeFormat === f.key
                      ? "bg-purple-500/6"
                      : "hover:bg-white/3"
                  }`}
                >
                  <span className="text-[15px] w-5 text-center">{f.icon}</span>
                  <span
                    className={`text-[13px] font-medium flex-1 ${activeFormat === f.key ? "text-purple-300" : "text-white/50"}`}
                  >
                    {f.label}
                  </span>
                  {outputs[f.key] && (
                    <div className="w-4.5 h-4.5 rounded-full bg-green-500/12 border border-green-500/25 flex items-center justify-center text-[9px] text-green-400">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Original input */}
            <div className="bg-[#0e0e1a] border border-white/7 rounded-2xl overflow-hidden">
              <div className="px-4.5 py-3 border-b border-white/7 text-[11px] font-semibold text-white/25 uppercase tracking-wider">
                📄 Original Input
              </div>
              <div className="px-4.5 py-4 text-xs leading-relaxed text-white/45 max-h-40 overflow-y-auto">
                {job.input_text ?? job.input_url}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
