"use client";

import { motion } from "framer-motion";

export function PalmLeaf({ className, mirror = false }: { className?: string; mirror?: boolean }) {
    return (
        <motion.div
            className={`absolute z-0 pointer-events-none opacity-40 ${className}`}
            initial={{ rotate: mirror ? 10 : -10, opacity: 0 }}
            animate={{
                rotate: mirror ? [10, 5, 10] : [-10, -5, -10],
                opacity: 0.4
            }}
            transition={{
                rotate: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                opacity: { duration: 1 }
            }}
        >
            <svg
                width="300"
                height="300"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-48 h-48 md:w-96 md:h-96 text-emerald-800 fill-current"
                style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
            >
                <path d="M50 100 Q 60 50 10 0 C 40 20 50 40 50 100 Z" />
                <path d="M50 100 Q 65 60 40 10 C 60 30 65 50 50 100 Z" />
                <path d="M50 100 Q 70 70 70 20 C 80 40 80 60 50 100 Z" />
                <path d="M50 100 Q 40 70 20 20 C 30 40 30 60 50 100 Z" />

                {/* Detailed Fronds */}
                <path d="M50 90 Q 20 60 5 30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M50 85 Q 30 55 15 25" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M50 80 Q 40 50 25 20" stroke="currentColor" strokeWidth="0.5" fill="none" />

                <path d="M50 90 Q 80 60 95 30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M50 85 Q 70 55 85 25" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M50 80 Q 60 50 75 20" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </svg>
        </motion.div>
    );
}
