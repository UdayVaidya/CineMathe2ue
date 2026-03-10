import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

export const init = async ({ landmarkerRef, videoRef, streamRef, setLiveMood }) => {
    // START CAMERA FIRST - Browsers will auto-deny if we download models before asking for permissions
    // because the "user gesture" context expires after a few seconds.
    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;

    // Immediately wait for video to be ready and start playing
    await new Promise((resolve) => {
        if (videoRef.current.readyState >= 2) {
            resolve();
        } else {
            videoRef.current.onloadedmetadata = () => {
                resolve();
            };
        }
    });
    // Start playback right away so user sees themselves while downloading
    videoRef.current.play().catch(() => { });

    if (setLiveMood) setLiveMood("DOWNLOADING AI MODELS...");

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        }
    );
};

let lastVideoTime = -1;
let lastProcessedTime = -1;

export const detect = (landmarkerRef, videoRef, _ignoredTimestamp) => {
    if (!landmarkerRef.current || !videoRef.current || videoRef.current.readyState < 2) return null;

    // Skip frame if the video hasn't progressed to save resources and avoid duplicates
    if (videoRef.current.currentTime === lastVideoTime) {
        return null;
    }
    lastVideoTime = videoRef.current.currentTime;

    // Ensure timestamp is strictly monotonically increasing (MediaPipe enforces this)
    let now = performance.now();
    if (now <= lastProcessedTime) {
        now = lastProcessedTime + 1;
    }
    lastProcessedTime = now;

    const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        now
    );

    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");
        const eyeBlinkLeft = getScore("eyeBlinkLeft");
        const eyeBlinkRight = getScore("eyeBlinkRight");

        // console.log(getScore("eyeBlinkLeft"), getScore("eyeBlinkRight"))

        if (smileLeft > 0.5 && smileRight > 0.5) return "Happy 😄";
        if (jawOpen > 0.05 && browUp > 0.05) return "Surprised 😲";
        if (frownLeft > 0.005 && frownRight > 0.005) return "Sad 😢";
        if (eyeBlinkLeft > 0.5 || eyeBlinkRight > 0.5) return "Naughty 😜";
        return "Neutral 😐";
    }
    return null;
};