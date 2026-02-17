"use client";

import { motion } from "framer-motion";

interface LanternProps {
    className?: string;
    delay?: number;
    duration?: number;
}

export function Lantern({ className, delay = 0, duration = 6 }: LanternProps) {
    return (
        <motion.div
            className={`absolute z-10 pointer-events-none ${className}`}
            initial={{ y: -100, opacity: 0 }}
            animate={{
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0],
                opacity: 1
            }}
            transition={{
                y: {
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                },
                rotate: {
                    duration: duration * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                },
                opacity: { duration: 1, delay: 0.5 }
            }}
        >
            {/* Simple Lantern SVG */}
            <svg
                width="100"
                height="180"
                viewBox="0 0 100 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-auto drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
            >
                {/* String */}
                <line x1="50" y1="0" x2="50" y2="40" stroke="#fbbf24" strokeWidth="2" />

                {/* Top Cap */}
                <path d="M30 40 L70 40 L60 55 L40 55 Z" fill="#b45309" />

                {/* Body Main */}
                <path d="M25 55 L75 55 L85 110 L15 110 Z" fill="#d97706" className="opacity-90" />

                {/* Body Bottom */}
                <path d="M15 110 L85 110 L70 140 L30 140 Z" fill="#d97706" className="opacity-90" />

                {/* Bottom Cap */}
                <path d="M35 140 L65 140 L60 145 L40 145 Z" fill="#b45309" />

                {/* Tassel */}
                <path d="M50 145 L50 170" stroke="#fbbf24" strokeWidth="2" />
                <circle cx="50" cy="175" r="3" fill="#fbbf24" />

                {/* Inner Glow / Pattern */}
                <path d="M40 70 L60 70 L55 95 L45 95 Z" fill="#fbbf24" className="opacity-60 mix-blend-screen animate-pulse" />
            </svg>
        </motion.div>
    );
}
