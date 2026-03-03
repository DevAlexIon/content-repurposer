import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, X, Link, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateJobMutation,
  type CreateJobRequest,
} from "../store/api/jobsApi";
import { decrementCredits, selectUser } from "../store/authSlice";
import Modal from "./modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type InputType = "url" | "text";

export default function NewProjectModal({ isOpen, onClose }: Props) {
  const [inputType, setInputType] = useState<InputType>("url");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const user = useSelector(selectUser)!;
  const [createJob, { isLoading }] = useCreateJobMutation();
  const dispatch = useDispatch();

  const handleClose = () => {
    setValue("");
    setError("");
    setInputType("url");
    onClose();
  };

  const handleSubmit = async () => {
    if (!value.trim()) {
      setError("Please enter a URL or some text.");
      return;
    }

    const body: CreateJobRequest =
      inputType === "url"
        ? { input_type: "url", input_url: value }
        : { input_type: "text", input_text: value };

    try {
      await createJob(body).unwrap();
      handleClose();
      dispatch(decrementCredits());
    } catch (err: unknown) {
      const message = (err as { data?: { error?: string } })?.data?.error;
      setError(message || "Something went wrong.");
    }
  };

  const types: {
    id: InputType;
    icon: React.ReactNode;
    label: string;
    desc: string;
  }[] = [
    {
      id: "url",
      icon: <Link size={16} />,
      label: "From URL",
      desc: "YouTube, article, podcast",
    },
    {
      id: "text",
      icon: <FileText size={16} />,
      label: "Paste Text",
      desc: "Blog post, transcript",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-0">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-purple-400 mb-1">
            New Project
          </p>
          <h2 className="text-xl font-bold text-white">
            What are we repurposing?
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Paste a URL or drop in your text directly.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 text-white/40 flex items-center justify-center hover:bg-white/10 hover:text-white/80 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-5">
        {/* Toggle */}
        <div className="grid grid-cols-2 gap-2">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setInputType(type.id);
                setValue("");
                setError("");
              }}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                inputType === type.id
                  ? "bg-purple-500/10 border-purple-500/35"
                  : "bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/12"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  inputType === type.id
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {type.icon}
              </div>
              <div>
                <div
                  className={`text-sm font-semibold ${inputType === type.id ? "text-purple-300" : "text-white"}`}
                >
                  {type.label}
                </div>
                <div className="text-xs text-white/35 mt-0.5">{type.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
            {inputType === "url" ? "Content URL" : "Your Text"}
          </label>
          {inputType === "url" ? (
            <input
              className={`w-full bg-white/4 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all font-[Sora] ${
                error
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-purple-500/50 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"
              }`}
              placeholder="https://youtube.com/watch?v=... or any article URL"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
            />
          ) : (
            <textarea
              rows={5}
              className={`w-full bg-white/4 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all resize-none font-[Sora] ${
                error
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-purple-500/50 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"
              }`}
              placeholder="Paste your blog post, transcript, or any text here..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
            />
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
          <p className="text-xs text-white/25">
            💡{" "}
            {inputType === "url"
              ? "We'll extract the content automatically"
              : "Minimum 100 characters recommended"}
          </p>
        </div>

        {/* Credits */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-500/6 border border-amber-500/15 rounded-xl">
          <span className="text-sm text-white/60">
            ⚡ This project will use{" "}
            <strong className="text-white">1 credit</strong>
          </span>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/12 border border-amber-500/20 px-3 py-1 rounded-full">
            {user.credits} left
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 px-6 pb-6">
        <button
          onClick={handleClose}
          className="flex-1 py-3 rounded-xl bg-white/4 border border-white/8 text-white/50 text-sm font-semibold hover:bg-white/7 hover:text-white/80 transition-all"
        >
          Cancel
        </button>
        <motion.button
          onClick={handleSubmit}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-2 py-3 rounded-xl bg-linear-to-br from-purple-600 to-purple-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_36px_rgba(124,58,237,0.5)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles size={14} /> Generate Content
            </>
          )}
        </motion.button>
      </div>
    </Modal>
  );
}
