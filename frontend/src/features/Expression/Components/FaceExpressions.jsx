import { useEffect, useRef, useState } from "react";
import { init, detect, stopCamera } from "../Utils/utils";

export default function FaceExpression({ onMoodChange }) {
    const videoRef      = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef  = useRef(null);
    const streamRef     = useRef(null);
    const isRunningRef  = useRef(false);   // ref so closures always see latest value
    const isReadyRef    = useRef(false);

    const [liveMood, setLiveMood] = useState("Initializing...");
    const [isReady,  setIsReady]  = useState(false);

    useEffect(() => {
        isRunningRef.current = true;
        isReadyRef.current   = false;

        const loop = (timestamp) => {
            if (!isRunningRef.current) return;
            try {
                if (videoRef.current && videoRef.current.paused) {
                    videoRef.current.play().catch(() => {});
                }
                const mood = detect(landmarkerRef, videoRef, timestamp);
                if (mood) setLiveMood(mood);
            } catch (_) {
                // Ignore transient frame errors
            }
            animationRef.current = requestAnimationFrame(loop);
        };

        const setup = async () => {
            try {
                if (isRunningRef.current) setLiveMood("AWAITING CAMERA...");
                await init({ landmarkerRef, videoRef, streamRef, setLiveMood });
                if (isRunningRef.current) {
                    isReadyRef.current = true;
                    setIsReady(true);
                    loop();
                }
            } catch (err) {
                console.error("Camera/AI Init Error:", err);
                if (isRunningRef.current) {
                    setLiveMood(
                        err.name === "NotAllowedError"
                            ? "CAMERA BLOCKED IN BROWSER"
                            : "INIT FAILED: " + (err.message?.substring(0, 20) ?? "Unknown")
                    );
                }
            }
        };

        setup();

        // Re-init if the OS killed the camera track while window was in background
        const handleVisibilityChange = () => {
            if (
                document.visibilityState === "visible" &&
                isRunningRef.current &&
                isReadyRef.current
            ) {
                if (videoRef.current?.paused) {
                    videoRef.current.play().catch(() => {});
                }
                const track = streamRef.current?.getTracks()[0];
                if (track && track.readyState === "ended") {
                    setup();
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // ── Cleanup: runs when route changes away from /mood ─────────────────
        return () => {
            isRunningRef.current = false;
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            stopCamera({ landmarkerRef, videoRef, streamRef, animationRef });
            setIsReady(false);
            setLiveMood("Initializing...");
        };
    }, []);

    const handleDetectClick = () => {
        if (!isReadyRef.current || liveMood.includes("Initializing")) return;
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
                <video
                    ref={videoRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        backgroundColor: "#000",
                        transform: "scaleX(-1)",
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
                        [<span className="animate-pulse" style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "var(--clr-danger)", borderRadius: "50%", boxShadow: "0 0 8px var(--clr-danger)" }} />
                        {" "}LIVE: {liveMood.toUpperCase()} ]
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