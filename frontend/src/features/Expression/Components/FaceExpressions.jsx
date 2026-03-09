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

        const loop = (timestamp) => {
            if (!isRunning) return;
            try {
                if (videoRef.current && videoRef.current.paused) {
                    videoRef.current.play().catch(() => { });
                }
                const mood = detect(landmarkerRef, videoRef, timestamp);
                if (mood) {
                    setLiveMood(mood);
                }
            } catch (e) {
                // Ignore transient frame errors on tab switch
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

        // We no longer call setup() here. It will be called by handleStartCamera.
        window.__startCamera = setup;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isRunning && isReady) {
                if (videoRef.current && videoRef.current.paused) {
                    videoRef.current.play().catch(() => { });
                }
                const track = streamRef.current?.getTracks()[0];
                // If track was killed by OS when tab was in background, re-init.
                if (track && track.readyState === 'ended') {
                    setup();
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isRunning = false;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
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
            <div style={{
                width: "100%",
                height: "auto",
                aspectRatio: "4/3",
                backgroundColor: "#0a0a0a",
                border: "2px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                {!isReady && (
                    <button
                        onClick={() => window.__startCamera?.()}
                        className="toolbar-btn"
                        style={{ position: "absolute", zIndex: 10, padding: "12px 24px", color: "var(--clr-danger)", borderColor: "var(--clr-danger)" }}
                    >
                        [ START CAMERA ]
                    </button>
                )}
                <video
                    ref={videoRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        backgroundColor: "#000",
                        transform: "scaleX(-1)", // Mirror the camera so it looks natural
                        opacity: isReady ? 1 : 0.5
                    }}
                    playsInline
                    muted
                />
            </div>
            <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                color: isReady ? "var(--clr-danger)" : "var(--muted-color)",
                fontWeight: isReady ? "bold" : "normal",
                letterSpacing: "2px",
                height: "20px",
                marginBottom: "20px",
                marginTop: "20px",
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