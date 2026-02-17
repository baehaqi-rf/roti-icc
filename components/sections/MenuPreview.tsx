"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Coffee, Dessert } from "lucide-react";

export function MenuPreview() {
    const categories = [
        {
            title: "Takjil",
            icon: <Coffee className="w-6 h-6 text-amber-500" />,
            items: ["Kurma Ajwa", "Es Buah Segar", "Kolak Pisang", "Gorengan Platter"]
        },
        {
            title: "Main Course",
            icon: <Utensils className="w-6 h-6 text-amber-500" />,
            items: ["Nasi Kebuli Kambing", "Ayam Bakar Madu", "Sate Maranggi", "Capcay Seafood"]
        },
        {
            title: "Dessert",
            icon: <Dessert className="w-6 h-6 text-amber-500" />,
            items: ["Puding Mangga", "Klappertaart", "Buah Potong", "Ice Cream"]
        }
    ];

    return (
        <section className="py-20 px-4 relative z-10 bg-slate-900/50">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 mb-4">
                        Iftar Feast
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Indulge in a curated selection of traditional and modern delights, prepared to satisfy your palate after a day of fasting.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                        >
                            <Card className="bg-slate-800/40 border-slate-700 hover:border-amber-500/50 transition-colors duration-300 h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                                            {category.icon}
                                        </div>
                                        <CardTitle className="text-xl text-slate-100 font-serif">{category.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {category.items.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
