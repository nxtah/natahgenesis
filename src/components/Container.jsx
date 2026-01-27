import React from "react";

// Max-width wrapper for consistent layout
// Fluid, responsive container for all content (see global layout rules)
// - Mobile: 100% width, px-4
// - Tablet: 100% width, px-8
// - Desktop: max-w-[1600px], px-12
// - XL: max-w-[1800px], px-24
// Always centered, never boxed on desktop
export default function Container({ children, className = "" }) {
  return (
    <div
      className={`w-full mx-auto px-4 md:px-8 lg:px-12 2xl:px-24
        max-w-full
        lg:max-w-[1600px]
        2xl:max-w-[1800px]
        ${className}`}
    >
      {children}
    </div>
  );
}
