"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Clock, Shirt, Info } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { StarryBackground } from "@/components/decorations/StarryBackground";
import { Lantern } from "@/components/decorations/Lantern";
import { MosqueSilhouette } from "@/components/decorations/MosqueSilhouette";
import { PalmLeaf } from "@/components/decorations/PalmLeaf";
import { Archway } from "@/components/decorations/Archway";
import { RSVPForm } from "@/components/sections/RSVPForm";

export default function Home() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const eventDate = new Date("2026-02-23T17:00:00");
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
    <main className="h-[100svh] w-full overflow-hidden bg-emerald-950 text-emerald-50 relative flex flex-col font-sans">
      <StarryBackground />
      <AudioPlayer />

      {/* Background Decorations (Persistent) */}
      <div className="absolute inset-0 pointer-events-none">
        <Archway className="opacity-40" />
        <PalmLeaf className="-top-20 -left-20 text-emerald-800" />
        <PalmLeaf className="-top-20 -right-20 text-emerald-800" mirror />
        <div className="absolute bottom-0 left-0 w-full z-0 opacity-50">
          <MosqueSilhouette />
        </div>
      </div>

      <AnimatePresence mode="wait" custom={step}>

        {/* STEP 1: HERO / COVER */}
        {step === 1 && (
          <motion.section
            key="step1"
            className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
          >
            {/* Text Content */}
            <div className="relative z-20 flex flex-col items-center">
              <motion.h3
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="font-serif text-2xl md:text-4xl text-amber-400 opacity-90 tracking-widest leading-loose mb-2"
              >
                Integrated Contact Center
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-emerald-200/80 text-lg md:text-xl tracking-[0.3em] font-bold uppercase mb-6"
              >
                ROTI - BUKBER
              </motion.p>

              <div className="relative mb-8">
                <h1 className="text-5xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-[0_2px_15px_rgba(245,158,11,0.4)] py-2">
                  RAMADHAN <br /> NIGHT
                </h1>
              </div>

              {/* Countdown */}
              <div className="grid grid-cols-4 gap-3 md:gap-6 mb-10">
                <TimeUnit value={timeLeft.days} label="Days" />
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <TimeUnit value={timeLeft.minutes} label="Mins" />
                <TimeUnit value={timeLeft.seconds} label="Secs" />
              </div>

              <Button
                onClick={nextStep}
                size="lg"
                className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300/30 transition-all hover:scale-105"
              >
                Buka Undangan <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-emerald-400/50 text-xs font-serif italic tracking-widest"
              >
                Icc.Improvement Proudly Present
              </motion.p>
            </div>

            {/* Lanterns for Step 1 */}
            <Lantern className="left-[10%] top-0 w-16" delay={0} duration={5} />
            <Lantern className="right-[10%] top-0 w-16" delay={0.5} duration={5.5} />
          </motion.section>
        )}

        {/* STEP 2: INTRO / QUOTE */}
        {step === 2 && (
          <motion.section
            key="step2"
            className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-emerald-900/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-emerald-700/50 shadow-2xl max-w-lg mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-amber-400 mb-8">Assalamu'alaikum Wr. Wb.</h2>
              <div className="space-y-4 italic text-emerald-100 font-serif leading-relaxed text-lg md:text-xl">
                <p>“Ramadhan membuka pintu langit, tinggal kita mengetuknya.”</p>
                <p className="pt-4 text-emerald-300/90 not-italic font-sans text-base leading-relaxed">
                  Dengan segala kerendahan hati, kami mengundang Bapak/Ibu untuk hadir dalam acara <span className="text-amber-400 font-semibold">ROTI</span> - Buka Puasa Bersama Keluarga Besar Integrated Contact Center 2026.
                </p>
                <p className="text-emerald-200/80 font-serif italic text-lg mt-2 font-medium">
                  "Join us and enjoy the fun together"
                </p>
              </div>



              <div className="mt-8 flex gap-3 justify-center">
                <Button onClick={prevStep} variant="ghost" className="text-emerald-300 hover:text-white hover:bg-emerald-800">Back</Button>
                <Button onClick={nextStep} className="rounded-full px-8 bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/30">
                  Lihat Detail Acara <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
            <Lantern className="left-[5%] -top-10 w-12" delay={0} duration={6} />
          </motion.section>
        )}

        {/* STEP 3: EVENT DETAILS */}
        {step === 3 && (
          <motion.section
            key="step3"
            className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-emerald-900/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-emerald-700/50 shadow-2xl max-w-2xl mx-auto w-full">
              <h2 className="text-3xl font-serif text-amber-400 mb-8 border-b border-emerald-800 pb-4 inline-block">Detail Acara</h2>

              <div className="space-y-4 text-left">
                <DetailItem icon={Calendar} title="Hari & Tanggal" content="Senin, 23 Februari 2026" />
                <DetailItem icon={Clock} title="Waktu" content="17:00 WIB - Selesai" />
                <DetailItem icon={MapPin} title="Tempat" content="Umatis Resto, BSD City (Kavling Taman Kota Barat Lot No.II.6)" />
                <DetailItem icon={Shirt} title="Dress Code" content="Baju Muslim (Koko/Gamis)" />
              </div>

              <div className="mt-8 flex gap-3 justify-center">
                <Button onClick={prevStep} variant="ghost" className="text-emerald-300 hover:text-white hover:bg-emerald-800">Back</Button>
                <Button
                  onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=Umatis+Resto+BSD+City", "_blank")}
                  className="rounded-full px-8 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold"
                >
                  Lihat Map
                </Button>
                <Button onClick={nextStep} variant="ghost" size="icon" className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-900/50 rounded-full w-12 h-12">
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </motion.section>
        )}

        {/* STEP 4: RSVP / CLOSING */}
        {step === 4 && (
          <motion.section
            key="step4"
            className="flex-1 flex flex-col items-center justify-center p-6 relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full max-w-md">
              <RSVPForm />

              <div className="mt-8 text-center space-y-4">
                <p className="text-emerald-300/80 italic text-sm">
                  "Tiada kesan tanpa kehadiranmu. Semoga kita semua diberikan sehat walafiat sehingga dapat hadir bersama kami."
                </p>
                <Button onClick={prevStep} variant="ghost" className="text-emerald-400 hover:text-white">Back</Button>
              </div>
            </div>
          </motion.section>
        )}

      </AnimatePresence>
    </main>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center p-2 md:p-4 bg-emerald-950/60 backdrop-blur-md border border-amber-500/30 rounded-lg shadow-lg">
      <span className="text-2xl md:text-3xl font-mono font-bold text-amber-400 tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs text-emerald-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
  )
}

function DetailItem({ icon: Icon, title, content }: { icon: any, title: string, content: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800 hover:border-amber-500/50 transition-colors group">
      <div className="p-2 bg-emerald-900 rounded-lg text-amber-500 group-hover:text-amber-400">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-emerald-100 text-sm uppercase tracking-wide">{title}</h3>
        <p className="text-emerald-200 text-base md:text-lg">{content}</p>
      </div>
    </div>
  )
}
