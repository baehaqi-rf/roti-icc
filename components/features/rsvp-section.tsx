"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/fade-in";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const rsvpSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    guests: z.coerce.number().min(1, "Minimal 1 orang"),
    status: z.enum(["Hadir", "Tidak Hadir"]),
});

type RsvpFormValues = z.infer<typeof rsvpSchema>;

export function RsvpSection() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<RsvpFormValues>({
        resolver: zodResolver(rsvpSchema),
        defaultValues: {
            name: "",
            guests: 1,
            status: "Hadir",
        },
    });

    const onSubmit = async (data: RsvpFormValues) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("rsvps").insert([
                {
                    name: data.name,
                    guests: data.guests,
                    status: data.status,
                    created_at: new Date().toISOString()
                }
            ]);

            if (error) throw error;

            setIsSuccess(true);
        } catch (error) {
            console.error("Error submitting RSVP:", error);
            alert("Gagal mengirim konfirmasi. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="rsvp" className="min-h-screen w-full flex items-center justify-center p-4 bg-emerald-50/50 relative">
            <FadeIn className="w-full max-w-md relative z-10">
                <Card className="border-emerald-100 shadow-xl shadow-emerald-100/50 backdrop-blur-sm bg-white/90">
                    <CardHeader className="text-center space-y-4">
                        <CardTitle className="text-4xl text-emerald-800 font-cursive">Konfirmasi Kehadiran</CardTitle>
                        <CardDescription className="text-emerald-600/80">
                            Mohon isi formulir di bawah ini untuk mengonfirmasi kehadiran Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isSuccess ? (
                            <FadeIn className="text-center space-y-6 py-8">
                                <div className="text-6xl animate-bounce">✅</div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-emerald-800">Terima Kasih!</h3>
                                    <p className="text-emerald-600">Konfirmasi kehadiran Anda telah kami terima.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-4 border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                                    onClick={() => {
                                        setIsSuccess(false);
                                        form.reset();
                                    }}
                                >
                                    Kirim Konfirmasi Lain
                                </Button>
                            </FadeIn>
                        ) : (
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-emerald-900">Nama Lengkap</label>
                                    <Input
                                        {...form.register("name")}
                                        placeholder="Masukkan nama Anda"
                                        className="bg-white/50 border-emerald-100 focus-visible:ring-emerald-500"
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-emerald-900">Jumlah Tamu</label>
                                    <Input
                                        {...form.register("guests")}
                                        type="number"
                                        min={1}
                                        className="bg-white/50 border-emerald-100 focus-visible:ring-emerald-500"
                                    />
                                    {form.formState.errors.guests && (
                                        <p className="text-sm text-red-500">{form.formState.errors.guests.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-emerald-900">Status</label>
                                    <select
                                        {...form.register("status")}
                                        className="flex h-10 w-full rounded-md border border-emerald-100 bg-white/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                                    >
                                        <option value="Hadir">Hadir</option>
                                        <option value="Tidak Hadir">Tidak Hadir</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    variant="premium"
                                    className="w-full text-white font-bold tracking-wide shadow-emerald-200/50"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                    {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </FadeIn>

            {/* Decorative Blob */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -z-10" />
        </section>
    );
}
