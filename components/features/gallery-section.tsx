"use client";

import { FadeIn } from "@/components/animations/fade-in";

export function GallerySection() {
    const images = [
        "/images/gallery-1.jpg", // Placeholder
        "/images/gallery-2.jpg",
        "/images/gallery-3.jpg",
        "/images/gallery-4.jpg",
        "/images/gallery-5.jpg",
        "/images/gallery-6.jpg",
    ];

    return (
        <section className="py-20 px-4 bg-emerald-950 text-white">
            <div className="max-w-6xl mx-auto space-y-12">
                <FadeIn className="text-center">
                    <h2 className="text-4xl md:text-5xl font-cursive text-emerald-200">Galeri Kebersamaan</h2>
                </FadeIn>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((src, i) => (
                        <FadeIn key={i} delay={i * 0.1} className="aspect-square relative group overflow-hidden rounded-xl bg-emerald-900">
                            {/* Placeholder for real images */}
                            <div className="absolute inset-0 flex items-center justify-center text-emerald-700 font-bold text-lg group-hover:scale-110 transition-transform duration-500">
                                Foto {i + 1}
                            </div>
                            {/* Actual image tag would go here */}
                            {/* <Image src={src} alt={`Gallery ${i}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" /> */}
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
