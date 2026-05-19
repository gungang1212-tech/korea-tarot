import { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

export default function Button({ variant = "primary", loading, children, className = "", ...props }: Props) {
  const base = "relative inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-purple-700 to-purple-600 text-white hover:from-purple-600 hover:to-purple-500 shadow-lg shadow-purple-900/50",
    secondary: "border border-gold-400/50 text-gold-300 hover:bg-gold-400/10 hover:border-gold-300",
    ghost: "text-purple-300 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          처리 중...
        </span>
      ) : children}
    </motion.button>
  );
}
