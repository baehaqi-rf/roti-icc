"use client";

import { motion } from "framer-motion";

export function MosqueSilhouette({ className }: { className?: string }) {
    return (
        <div className={`w-full overflow-hidden leading-[0] ${className}`}>
            <motion.svg
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                className="w-full h-auto opacity-30 fill-emerald-950 mix-blend-multiply"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 0.3 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </motion.svg>
            {/* Detailed Mosque Vectors */}
            <motion.svg
                viewBox="0 0 1000 300"
                className="absolute bottom-0 left-0 w-full h-[60%] fill-emerald-800 opacity-60"
                preserveAspectRatio="none"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 0.6 }}
                transition={{ duration: 1.2, delay: 0.3 }}
            >
                {/* Central Dome */}
                <path d="M350,300 L350,150 Q500,50 650,150 L650,300 Z" />
                {/* Minarets */}
                <rect x="250" y="100" width="40" height="200" />
                <polygon points="250,100 270,60 290,100" />

                <rect x="710" y="100" width="40" height="200" />
                <polygon points="710,100 730,60 750,100" />

                {/* Side Domes */}
                <path d="M100,300 L100,200 Q175,140 250,200 L250,300 Z" />
                <path d="M750,300 L750,200 Q825,140 900,200 L900,300 Z" />
            </motion.svg>

            {/* Background Layer (Darker) */}
            <motion.svg
                viewBox="0 0 1000 300"
                className="absolute bottom-0 left-0 w-full h-[80%] fill-emerald-900 -z-10"
                preserveAspectRatio="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                <path d="M0,300 L0,250 L1000,250 L1000,300 Z" />
            </motion.svg>
        </div>
    );
}
