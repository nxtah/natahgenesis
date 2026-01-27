import React from "react";
import { motion } from "framer-motion";

// Conversion strategy: Magnetic, animated, accessible CTA. Supports WhatsApp, icons, and pulse.

export default function Button({
  children,
  href,
  onClick,
  icon,
  variant = "primary", // primary | outline | ghost
  fullWidth = false,
  className = "",
  target,
  rel,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-benhur focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";
  const variants = {
    primary:
      "bg-benhur text-white hover:bg-blue-900 active:scale-95 shadow-lg px-6 py-3 text-lg",
    outline:
      "border-2 border-benhur text-benhur bg-white hover:bg-blue-50 active:scale-95 px-6 py-3 text-lg",
    ghost:
      "bg-transparent text-benhur hover:bg-blue-50 active:scale-95 px-4 py-2",
  };
  const width = fullWidth ? "w-full" : "";

  const Comp = href ? "a" : "button";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={width}
    >
      <Comp
        href={href}
        onClick={onClick}
        className={`${base} ${variants[variant]} ${width} ${className}`}
        target={target}
        rel={rel}
        {...props}
      >
        {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
        {children}
      </Comp>
    </motion.div>
  );
}
