"use client";

import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/animations/text-reveal";
import { FadeIn } from "@/components/animations/fade-in";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
    const scrollToRSVP = () => {
        document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-black -z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] -z-10" />

            {/* Decorative Particles (Optional: could be a separate component) */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="z-10 text-center px-4 space-y-8 max-w-4xl">
                <FadeIn delay={0.2} className="text-emerald-400 font-medium tracking-[0.2em] uppercase text-sm md:text-base">
                    Undangan Buka Puasa Bersama
                </FadeIn>

                <div className="flex justify-center">
                    <TextReveal
                        text="Ramadhan Penuh Berkah"
                        className="text-5xl md:text-7xl lg:text-8xl font-bold font-cursive text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-emerald-200 drop-shadow-sm justify-center py-2"
                    />
                </div>

                <FadeIn delay={0.8} className="max-w-lg mx-auto text-emerald-100/90 text-lg md:text-xl font-light leading-relaxed">
                    Mari jalin silaturahmi di bulan yang suci ini. Kehadiranmu adalah kebahagiaan bagi kami.
                </FadeIn>

                <FadeIn delay={1.2} className="pt-4">
                    <Button
                        size="lg"
                        variant="premium"
                        className="rounded-full px-8 py-6 text-lg h-auto shadow-emerald-900/50 hover:shadow-emerald-500/30"
                        onClick={scrollToRSVP}
                    >
                        Konfirmasi Kehadiran
                    </Button>
                </FadeIn>
            </div>

            {/* Scroll Indicator */}
            <FadeIn delay={2} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-emerald-500/50">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowDown className="w-6 h-6" />
                </motion.div>
            </FadeIn>
        </section>
    )
}
