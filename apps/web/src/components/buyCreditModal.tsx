import { useState } from "react";
import { motion } from "motion/react";
import { Zap, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import Modal from "./modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 10,
    price: "$10",
    desc: "Perfect pentru început",
    color: "purple",
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 50,
    price: "$29",
    desc: "Cel mai popular",
    color: "cyan",
    badge: "Best Value",
  },
];

export default function BuyCreditsModal({ isOpen, onClose }: Props) {
  const user = useSelector(selectUser)!;
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (packageId: string) => {
    setLoading(packageId);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/billing/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageId, userId: user.id }),
        },
      );
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-start justify-between p-6 pb-0">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-purple-400 mb-1">
            Credits
          </p>
          <h2 className="text-xl font-bold text-white">Buy Credits</h2>
          <p className="text-sm text-white/40 mt-1">
            You have <strong className="text-white">{user.credits}</strong>{" "}
            credits left.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 text-white/40 flex items-center justify-center hover:bg-white/10 hover:text-white/80 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative p-5 rounded-2xl border transition-all ${
              pkg.color === "cyan"
                ? "bg-cyan-500/5 border-cyan-500/20"
                : "bg-purple-500/5 border-purple-500/20"
            }`}
          >
            {pkg.badge && (
              <div className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-bold text-cyan-400">
                {pkg.badge}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white mb-0.5">
                  {pkg.name}
                </div>
                <div className="text-xs text-white/40">{pkg.desc}</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Zap size={12} className="text-amber-400" />
                  <span className="text-sm font-bold text-white">
                    {pkg.credits} credits
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="text-2xl font-extrabold text-white">
                  {pkg.price}
                </div>
                <motion.button
                  onClick={() => handleBuy(pkg.id)}
                  disabled={loading !== null}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
                    pkg.color === "cyan"
                      ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30"
                      : "bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
                  }`}
                >
                  {loading === pkg.id ? (
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    "Buy Now"
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
