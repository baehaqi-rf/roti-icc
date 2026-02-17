"use client";

import { useEffect, useRef } from "react";

export function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // 1. Attempt Auto-play immediately
        audio.volume = 1.0;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Auto-play prevented. 
                // 2. Add a one-time click listener to the document to start music on interaction.
                const enableAudio = () => {
                    audio.play().catch(e => console.error("Play failed:", e));
                    document.removeEventListener('click', enableAudio);
                };
                document.addEventListener('click', enableAudio);
            });
        }

        return () => {
            // Cleanup logic if needed, though the listener removes itself.
        };
    }, []);

    return (
        <div className="hidden">
            <audio
                ref={audioRef}
                loop
                preload="auto"
                onError={(e) => console.error("Audio playback error:", e)}
            >
                <source src="/music/ramadhan.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}
