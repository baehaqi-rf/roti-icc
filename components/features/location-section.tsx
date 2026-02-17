"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

            <FadeIn className="text-center space-y-4 mb-16">
                <h2 className="text-4xl md:text-5xl font-cursive text-emerald-800">Waktu & Tempat</h2>
                <p className="text-emerald-600/80">Insya Allah acara akan dilaksanakan pada:</p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
                <FadeIn delay={0.2} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-emerald-900">Hari & Tanggal</h3>
                        <p className="text-emerald-700">Sabtu, 15 Maret 2026</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.4} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-emerald-900">Waktu</h3>
                        <p className="text-emerald-700">17:30 - Selesai</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.6} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-emerald-900">Lokasi</h3>
                        <p className="text-emerald-700">Hotel Grand Mercure</p>
                        <p className="text-sm text-emerald-600/60">Jl. BSD Boulevard, Tangerang</p>
                    </div>
                </FadeIn>
            </div>

            <FadeIn delay={0.8} className="w-full max-w-4xl h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0526012693757!2d106.61836177499066!3d-6.25608109373241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fb56b2513963%3A0x6b772290453303c0!2sGrand%20Mercure%20Jakarta%20Kemayoran!5e0!3m2!1sen!2sid!4v1707886664000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </FadeIn>

            <FadeIn delay={1.0} className="mt-8">
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Buka di Google Maps
                </Button>
            </FadeIn>
        </section>
    );
}
