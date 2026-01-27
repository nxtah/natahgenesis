import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Conversion strategy: Cinematic scroll storytelling, fade/translate/scale, crossfade backgrounds, disables heavy effects on mobile
export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  stagger = 0.1,
  bgCrossfade = false, // enables background crossfade effect
  ...props
}) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Section entry/exit animation
  const variants = {
    hidden: isMobile
      ? { opacity: 0, y: 20 }
      : { opacity: 0, y: 40, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay,
        staggerChildren: stagger,
        when: "beforeChildren",
        duration: 0.7,
        ease: "easeOut",
      },
    },
    exit: isMobile
      ? { opacity: 0, y: 20 }
      : { opacity: 0, y: 40, scale: 0.98 },
  };

  // Optional background crossfade effect
  const bgMotion = bgCrossfade
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.7, ease: "easeOut" },
      }
    : {};

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      exit="exit"
      variants={variants}
      className={className}
      {...props}
    >
      {bgCrossfade && (
        <motion.div
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          {...bgMotion}
        />
      )}
      {children}
    </motion.section>
  );
}
