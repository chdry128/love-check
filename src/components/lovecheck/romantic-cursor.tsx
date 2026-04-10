"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  opacity: number;
}

const MAX_HEARTS = 12;
const HEART_LIFETIME = 0.8; // seconds
const THROTTLE_MS = 80;

let heartIdCounter = 0;

export function RomanticCursor() {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef<number>(0);
  const heartsRef = useRef<HeartParticle[]>([]);
  const isTouchDevice = useRef(false);
  const prefersReducedMotion = useRef(false);
  const mountedRef = useRef(false);

  const removeHeart = useCallback((id: number) => {
    setHearts((prev) => {
      const filtered = prev.filter((h) => h.id !== id);
      heartsRef.current = filtered;
      return filtered;
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Check for touch device
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = motionQuery.matches;

    // Don't run on touch devices or when reduced motion is preferred
    if (isTouchDevice.current || prefersReducedMotion.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();

      // Throttle to max 1 heart per 80ms
      if (now - lastTimeRef.current < THROTTLE_MS) return;
      lastTimeRef.current = now;

      // Skip if not mounted
      if (!mountedRef.current) return;

      // Create heart with random variations
      const heart: HeartParticle = {
        id: heartIdCounter++,
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        rotation: (Math.random() - 0.5) * 30, // -15 to +15 degrees
        size: 10 + Math.random() * 4, // 10-14px
        opacity: 0.7 + Math.random() * 0.3, // Slight random opacity variation
      };

      // Add heart, enforce max limit
      const updated = [...heartsRef.current, heart];
      if (updated.length > MAX_HEARTS) {
        updated.splice(0, updated.length - MAX_HEARTS);
      }
      heartsRef.current = updated;
      setHearts(updated);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
      if (e.matches) {
        heartsRef.current = [];
        setHearts([]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      motionQuery.removeEventListener("change", handleMotionChange);
      heartsRef.current = [];
    };
  }, []);

  // Don't render on touch devices or with reduced motion preference
  if (
    typeof window !== "undefined" &&
    (isTouchDevice.current || prefersReducedMotion.current)
  ) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 9998,
        overflow: "visible",
      }}
    >
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{
              opacity: heart.opacity,
              scale: 0.8,
              y: 0,
            }}
            animate={{
              opacity: 0,
              scale: 0.3,
              y: -10,
            }}
            exit={{
              opacity: 0,
              scale: 0.2,
            }}
            transition={{
              duration: HEART_LIFETIME,
              ease: "easeOut",
            }}
            onAnimationComplete={() => removeHeart(heart.id)}
            style={{
              position: "fixed",
              left: heart.x,
              top: heart.y,
              transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`,
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          >
            <svg
              width={heart.size}
              height={heart.size}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill={
                  Math.random() > 0.5
                    ? `oklch(0.65 0.2 15 / ${heart.opacity})`
                    : `oklch(0.59 0.22 15 / ${heart.opacity})`
                }
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Alias export matching the task spec naming convention.
 * The component is integrated as `RomanticCursor` in page.tsx.
 */
export { RomanticCursor as RomanticCursorTrail };
