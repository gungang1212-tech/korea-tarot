import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = "", ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm text-purple-200 font-medium">{label}</label>}
    <input
      ref={ref}
      className={`w-full px-4 py-3 rounded-lg bg-navy-700/60 border ${
        error ? "border-red-500" : "border-purple-700/40"
      } text-white placeholder-purple-400/60 focus:outline-none focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/30 transition-all ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
));

Input.displayName = "Input";
export default Input;
