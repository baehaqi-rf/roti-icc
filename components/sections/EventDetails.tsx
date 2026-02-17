"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EventDetails() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <section className="py-20 px-4 max-w-6xl mx-auto relative z-10">
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="grid md:grid-cols-2 gap-12 items-center"
            >
                <motion.div variants={item} className="space-y-6">
                    <h3 className="text-amber-500 font-serif text-2xl">The Gathering</h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-100 leading-tight">
                        Schedule & <br /> <span className="text-slate-500">Location</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        We cordially invite you to break your fast with us. Let's celebrate the spirit of Ramadan with good food and great company.
                    </p>

                    <div className="space-y-4 mt-8">
                        <DetailRow icon={Calendar} title="Date" content="Monday, March 23rd, 2026" />
                        <DetailRow icon={Clock} title="Time" content="17:00 WIB - Selesai" />
                        <DetailRow icon={MapPin} title="Venue" content="Umatis Resto, BSD City (Kavling Taman Kota Barat Lot No.II.6)" />
                    </div>
                </motion.div>

                <motion.div variants={item} className="relative">
                    {/* Map Placeholder or Image */}
                    <div className="aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                        {/* In a real app, embed Google Maps iframe here */}
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                            <MapPin className="w-16 h-16 text-amber-500 mb-2" />
                            <span className="sr-only">Map View</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 to-transparent">
                            <p className="text-white font-medium">Click to navigate</p>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                </motion.div>
            </motion.div>
        </section>
    );
}

function DetailRow({ icon: Icon, title, content }: { icon: any, title: string, content: string }) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{title}</p>
                <p className="text-lg text-slate-200">{content}</p>
            </div>
        </div>
    )
}
