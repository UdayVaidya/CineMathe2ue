import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
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

    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;

    // Wait for the video to be ready before playing to prevent errors
    return new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
        };
    });
};

export const detect = (landmarkerRef, videoRef, timestamp = performance.now()) => {
    if (!landmarkerRef.current || !videoRef.current || videoRef.current.readyState < 2) return null;

    const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        timestamp
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