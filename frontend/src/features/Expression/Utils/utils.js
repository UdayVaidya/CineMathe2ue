import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

// Module-level timestamps — reset on each init() call so remounts work cleanly
let lastVideoTime = -1;
let lastProcessedTime = -1;

export const stopCamera = ({ landmarkerRef, videoRef, streamRef, animationRef }) => {
    // Cancel animation loop
    if (animationRef?.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
    }
    // Stop all camera tracks (turns off the camera light)
    if (streamRef?.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
    // Detach srcObject so the browser releases the device
    if (videoRef?.current) {
        videoRef.current.srcObject = null;
    }
    // Close mediapipe landmarker
    if (landmarkerRef?.current) {
        try { landmarkerRef.current.close(); } catch (_) {}
        landmarkerRef.current = null;
    }
};

export const init = async ({ landmarkerRef, videoRef, streamRef, setLiveMood }) => {
    // Reset timestamps every init so remounts don't fail MediaPipe's monotonic check
    lastVideoTime = -1;
    lastProcessedTime = -1;

    // Request camera first — browser permission prompt must happen before model download
    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;

    await new Promise((resolve) => {
        if (videoRef.current.readyState >= 2) {
            resolve();
        } else {
            videoRef.current.onloadedmetadata = () => resolve();
        }
    });
    videoRef.current.play().catch(() => {});

    if (setLiveMood) setLiveMood("DOWNLOADING AI MODELS...");

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
    });
};

export const detect = (landmarkerRef, videoRef, _ignoredTimestamp) => {
    if (!landmarkerRef.current || !videoRef.current || videoRef.current.readyState < 2) return null;

    if (videoRef.current.currentTime === lastVideoTime) return null;
    lastVideoTime = videoRef.current.currentTime;

    let now = performance.now();
    if (now <= lastProcessedTime) now = lastProcessedTime + 1;
    lastProcessedTime = now;

    const results = landmarkerRef.current.detectForVideo(videoRef.current, now);

    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;
        const getScore = (name) => blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft  = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen    = getScore("jawOpen");
        const browUp     = getScore("browInnerUp");
        const frownLeft  = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");
        const eyeBlinkLeft  = getScore("eyeBlinkLeft");
        const eyeBlinkRight = getScore("eyeBlinkRight");

        if (smileLeft > 0.5 && smileRight > 0.5) return "Happy 😄";
        if (jawOpen > 0.05 && browUp > 0.05)     return "Surprised 😲";
        if (frownLeft > 0.005 && frownRight > 0.005) return "Sad 😢";
        if (eyeBlinkLeft > 0.5 || eyeBlinkRight > 0.5) return "Naughty 😜";
        return "Neutral 😐";
    }
    return null;
};