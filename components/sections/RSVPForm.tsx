"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    nik: z.string().min(1, "NIK is required").regex(/^\d+$/, "NIK must be a number"),
});

type FormValues = z.infer<typeof formSchema>;

export function RSVPForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            nik: "",
        },
    });

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('rsvp')
                .insert([
                    { name: data.name, nik: data.nik, attendance: true },
                ])

            if (error) throw error;

            console.log("Form Submitted:", data);
            setIsSubmitting(false);
            setIsSuccess(true);
        } catch (error) {
            console.error("Error submitting RSVP:", error);
            alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
            setIsSubmitting(false);
        }
    }

    return (
        <section className="py-10 px-4 relative z-10" id="rsvp">
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 shadow-2xl relative overflow-hidden">
                        {/* Decorative border gradient */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                        <CardHeader>
                            <CardTitle className="text-3xl text-center font-serif text-slate-100">
                                Confirm Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnimatePresence mode="wait">
                                {isSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-10 space-y-4"
                                    >
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-medium text-slate-100">Thank You!</h3>
                                        <p className="text-slate-400 text-center">Your attendance has been confirmed.</p>
                                        <Button
                                            variant="link"
                                            className="text-amber-500"
                                            onClick={() => setIsSuccess(false)}
                                        >
                                            Register another guest
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-slate-300">Name</label>
                                            <Input
                                                {...form.register("name")}
                                                className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-amber-500 focus:ring-amber-500"
                                                placeholder="Enter your full name"
                                            />
                                            {form.formState.errors.name && (
                                                <p className="text-red-400 text-xs">{form.formState.errors.name.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="nik" className="text-sm font-medium text-slate-300">NIK</label>
                                            <Input
                                                {...form.register("nik")}
                                                type="number"
                                                className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-amber-500 focus:ring-amber-500"
                                                placeholder="Masukan NIK Kamu"
                                            />
                                            {form.formState.errors.nik && (
                                                <p className="text-red-400 text-xs">{form.formState.errors.nik.message}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Send Confirmation
                                                    <Send className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
