"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lantern } from "../decorations/Lantern";
import { MosqueSilhouette } from "../decorations/MosqueSilhouette";
import { PalmLeaf } from "../decorations/PalmLeaf";
import { Archway } from "../decorations/Archway";

export function Hero() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Target Date: 23 March 2026 at 17:00
    useEffect(() => {
        const eventDate = new Date("2026-03-23T17:00:00");
        const timer = setInterval(() => {
            const now = new Date();
            const difference = eventDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-24 pb-20 overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">

            {/* Background Decorations */}
            <Archway className="opacity-60" />
            <PalmLeaf className="-top-20 -left-20 text-emerald-800" />
            <PalmLeaf className="-top-20 -right-20 text-emerald-800" mirror />

            {/* Hanging Lanterns */}
            <Lantern className="left-[10%] top-0 w-16" delay={0} duration={5} />
            <Lantern className="left-[20%] -top-10 w-12" delay={1} duration={6} />
            <Lantern className="right-[10%] top-0 w-16" delay={2} duration={5.5} />
            <Lantern className="right-[20%] -top-10 w-12" delay={1.5} duration={7} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
            >
                {/* Arabic Calligraphy Placeholder */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-4"
                >
                    <h3 className="font-serif text-3xl md:text-5xl text-amber-400 opacity-90 tracking-widest leading-loose">
                        رمضان مبارك
                    </h3>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-emerald-100/80 text-lg md:text-xl font-light tracking-wide mb-2"
                >
                    Selamat Menunaikan Ibadah Puasa
                </motion.p>

                <div className="relative">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)] mb-8 py-2">
                        MARHABAN YA <br /> RAMADHAN
                    </h1>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 px-8 py-3 rounded-full border border-amber-500/50 bg-emerald-900/30 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-8"
                >
                    <span className="text-amber-300 font-mono tracking-widest text-lg">
                        1447 Hijriah / 2026 Masehi
                    </span>
                </motion.div>

                {/* Countdown */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="grid grid-cols-4 gap-3 md:gap-6 text-center w-full max-w-2xl mb-8"
                >
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <TimeUnit value={timeLeft.minutes} label="Mins" />
                    <TimeUnit value={timeLeft.seconds} label="Secs" />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-emerald-200/60 max-w-md mx-auto italic"
                >
                    “Ramadhan membuka pintu langit, tinggal kita mengetuknya.”
                </motion.p>

            </motion.div>

            {/* Mosque Silhouette at Bottom */}
            <div className="absolute bottom-0 left-0 w-full z-0">
                <MosqueSilhouette />
            </div>

            {/* Bottom Gradient for clear RSVP section transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-950 to-transparent z-10 pointer-events-none" />
        </section>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center p-2 md:p-4 bg-emerald-950/40 backdrop-blur-sm border border-emerald-800/50 rounded-lg shadow-lg">
            <span className="text-2xl md:text-4xl font-mono font-bold text-amber-400 tabular-nums">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs text-emerald-400 uppercase tracking-widest mt-1">{label}</span>
        </div>
    )
}
