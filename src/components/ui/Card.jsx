import React from "react";
import { motion } from "framer-motion";

// Conversion strategy: Animated, premium-feel card for services, portfolio, pricing, etc.

export default function Card({ children, className = "", ...props }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
