"use client";

import { motion } from "framer-motion";

export function Archway({ className }: { className?: string }) {
    return (
        <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
            <svg
                viewBox="0 0 400 800"
                preserveAspectRatio="none"
                className="w-full h-full fill-none stroke-amber-500/30"
                style={{ strokeWidth: "2" }}
            >
                {/* Main Arch Shape */}
                <path d="M 0 800 L 0 200 Q 200 -50 400 200 L 400 800" />

                {/* Inner Detail */}
                <path d="M 20 800 L 20 210 Q 200 -10 380 210 L 380 800" className="stroke-amber-400/20" />
            </svg>

            {/* Decorative corner patterns (Geometric Islamic Pattern Simulation) */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-amber-500/20 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-amber-500/20 rounded-tr-3xl" />
        </div>
    );
}
