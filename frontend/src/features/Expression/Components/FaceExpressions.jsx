import { useEffect, useRef, useState } from "react";
import { init, detect } from "../Utils/utils";

export default function FaceExpression({ onMoodChange }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);

    const [liveMood, setLiveMood] = useState("Initializing...");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isRunning = true;

        const loop = () => {
            if (!isRunning) return;
            const mood = detect(landmarkerRef, videoRef);
            if (mood) {
                setLiveMood(mood);
            }
            animationRef.current = requestAnimationFrame(loop);
        };

        const setup = async () => {
            try {
                await init({ landmarkerRef, videoRef, streamRef });
                if (isRunning) {
                    setIsReady(true);
                    loop(); // Start smooth continuous tracking
                }
            } catch (err) {
                console.error("Camera/AI Init Error:", err);
                if (isRunning) setLiveMood("Camera access denied.");
            }
        };

        setup();

        return () => {
            isRunning = false;
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (landmarkerRef.current) landmarkerRef.current.close();
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const handleDetectClick = () => {
        if (!isReady || liveMood.includes("Initializing")) return;
        // Pass the locked-in mood to the parent
        onMoodChange(liveMood);
    };

    return (
        <div style={{ textAlign: "center", width: "100%", maxWidth: "450px" }}>
            <video
                ref={videoRef}
                style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "0px", // Brutalist UI has no rounded corners
                    marginBottom: "15px",
                    backgroundColor: "#000",
                    border: "2px solid var(--border-color)", // Stronger border
                    transform: "scaleX(-1)" // Mirror the camera so it looks natural
                }}
                playsInline
                muted
            />
            <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                color: isReady ? "var(--clr-danger)" : "var(--muted-color)",
                fontWeight: isReady ? "bold" : "normal",
                letterSpacing: "2px",
                height: "20px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
            }}>
                {isReady ? (
                    <>
                        [ <span className="animate-pulse" style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--clr-danger)', borderRadius: '50%', boxShadow: '0 0 8px var(--clr-danger)' }}></span> LIVE: {liveMood.toUpperCase()} ]
                    </>
                ) : `[ ${liveMood.toUpperCase()} ]`}
            </div>

            <button
                className="toolbar-btn toolbar-btn--danger"
                style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    width: "100%",
                    padding: "16px",
                    opacity: isReady ? 1 : 0.5,
                    cursor: isReady ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease"
                }}
                onClick={handleDetectClick}
                disabled={!isReady}
            >
                {isReady ? "LOCK TARGET & FETCH" : "WARMING UP SCANNER..."}
            </button>
        </div>
    );
}