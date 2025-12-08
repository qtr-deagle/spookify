import { useMusic } from "@/context/MusicContext";
import { useEffect, useRef } from "react";

export function AudioPlayer() {
    const { currentSong, isPlaying, volume } = useMusic();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        audioRef.current.src = `/${currentSong.url}`; // ✅ ensure correct path
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [currentSong, isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    return <audio ref={audioRef} />;
}