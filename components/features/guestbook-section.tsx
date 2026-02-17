"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Send, MessageCircleHeart } from "lucide-react";

interface Wish {
    id: number;
    name: string;
    message: string;
    created_at: string;
}

export function GuestBookSection() {
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        // Fetch initial wishes
        const fetchWishes = async () => {
            const { data } = await supabase
                .from("wishes")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(20);
            if (data) setWishes(data);
        };

        fetchWishes();

        // Subscribe to realtime changes
        const channel = supabase
            .channel("realtime wishes")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "wishes" }, (payload) => {
                const newWish = payload.new as Wish;
                setWishes((prev) => [newWish, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleSend = async () => {
        if (!name || !message) return;
        setIsSending(true);

        try {
            await supabase.from("wishes").insert([{ name, message, created_at: new Date().toISOString() }]);
            setMessage(""); // Keep name, clear message
        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section className="py-20 px-4 bg-emerald-50/30 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 text-9xl opacity-5 pointer-events-none">✨</div>
            <div className="absolute bottom-10 right-10 text-9xl opacity-5 pointer-events-none">🌙</div>

            <div className="max-w-3xl mx-auto space-y-12 relative z-10">
                <FadeIn className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                        <MessageCircleHeart className="w-6 h-6" />
                        <span className="uppercase tracking-widest text-sm font-semibold">Buku Tamu</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-cursive text-emerald-800">Doa & Ucapan</h2>
                    <p className="text-emerald-600/80 max-w-lg mx-auto">
                        Kirimkan doa terbaik dan ucapan hangat untuk menyemarakkan acara buka puasa bersama kita.
                    </p>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Input
                                    placeholder="Nama Anda"
                                    className="md:w-1/3 bg-white border-emerald-100 focus-visible:ring-emerald-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    placeholder="Tulis ucapan yang baik..."
                                    className="flex-1 bg-white border-emerald-100 focus-visible:ring-emerald-500"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isSending || !message || !name}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]"
                                >
                                    {isSending ? <Loader2 className="animate-spin w-4 h-4" /> : <div className="flex items-center gap-2">Kirim <Send className="w-3 h-3" /></div>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar p-2">
                    {wishes.length === 0 ? (
                        <div className="text-center py-12 space-y-4 opacity-50">
                            <div className="text-4xl grayscale">💌</div>
                            <p className="text-emerald-800 italic">Belum ada ucapan. Jadilah yang pertama mengirimkan doa!</p>
                        </div>
                    ) : (
                        wishes.map((wish, i) => (
                            <FadeIn key={wish.id} delay={i < 5 ? 0.3 + (i * 0.1) : 0} direction="left">
                                <div className="p-5 rounded-2xl bg-white border border-emerald-50 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center font-bold text-emerald-700 shrink-0 border border-white shadow-sm group-hover:scale-110 transition-transform">
                                        {wish.name ? wish.name.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-emerald-900">{wish.name}</h4>
                                            <span className="text-[10px] text-emerald-400/80 bg-emerald-50 px-2 py-1 rounded-full">
                                                {wish.created_at ? new Date(wish.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Baru saja"}
                                            </span>
                                        </div>
                                        <p className="text-emerald-700/80 text-sm mt-1 leading-relaxed">{wish.message}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
