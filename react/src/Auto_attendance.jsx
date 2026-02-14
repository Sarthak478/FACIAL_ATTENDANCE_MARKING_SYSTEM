import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const AutoAttendance = () => {
    const webcamRef = useRef(null);

    const [status, setStatus] = useState("Initializing Camera...");
    const [borderColor, setBorderColor] = useState("#cbd5e1");
    const [lastUser, setLastUser] = useState(null);

    const isMounted = useRef(true);
    const isProcessing = useRef(false);
    const lastAttemptTime = useRef(0);
    const LOOP_DELAY = 800;
    const SUCCESS_COOLDOWN = 3000;

    const b64toBlob = async (base64Data) => {
        const r = await fetch(base64Data);
        return await r.blob();
    };

    const processFrame = async () => {
        if (!isMounted.current) return;
        if (isProcessing.current) return;

        const now = Date.now();
        if (now - lastAttemptTime.current < LOOP_DELAY) return;

        isProcessing.current = true;
        lastAttemptTime.current = now;

        try {
            if (!webcamRef.current) return;

            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return;

            setStatus("Scanning face...");
            setBorderColor("#2563eb");

            const blob = await b64toBlob(imageSrc);
            const formData = new FormData();
            formData.append("file", blob, "capture.jpg");

            const pythonResponse = await axios.post(
                "http://localhost:5001/generate_embedding",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const vector = pythonResponse.data.embedding;
            if (!vector || vector.length === 0) return;

            const nodeResponse = await axios.post(
                "http://localhost:4000/api/daily/mark",
                { vector }
            );

            if (nodeResponse.data.success) {
                const userName = nodeResponse.data.user.name;

                setBorderColor("#16a34a");
                setStatus(`Attendance Marked: ${userName}`);
                setLastUser({
                    name: userName,
                    time: new Date().toLocaleTimeString()
                });

                speakName(userName);

                await new Promise(r => setTimeout(r, SUCCESS_COOLDOWN));

                setBorderColor("#cbd5e1");
                setStatus("Ready for next student");
            }

        } catch (err) {
            setBorderColor("#dc2626");
            setStatus("Face not recognized");
        } finally {
            isProcessing.current = false;
        }
    };

    useEffect(() => {
        isMounted.current = true;

        const interval = setInterval(() => {
            processFrame();
        }, 200);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
        };
    }, []);

    const speakName = (name) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Attendance marked for ${name}`);
            window.speechSynthesis.speak(utterance);
        }
    };

    const styles = {
        page: {
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to right, #eef2ff, #f8fafc)",
            fontFamily: "Segoe UI, sans-serif"
        },
        card: {
            width: "600px",
            padding: "40px",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            textAlign: "center"
        },
        title: {
            fontSize: "1.9rem",
            fontWeight: "600",
            marginBottom: "10px",
            color: "#1e293b"
        },
        subtitle: {
            fontSize: "0.95rem",
            color: "#64748b",
            marginBottom: "25px"
        },
        status: {
            fontSize: "1rem",
            fontWeight: "500",
            marginBottom: "20px",
            color:
                borderColor === "#16a34a"
                    ? "#16a34a"
                    : borderColor === "#dc2626"
                    ? "#dc2626"
                    : "#334155"
        },
        cameraWrapper: {
            display: "flex",
            justifyContent: "center",
            padding: "10px",
            borderRadius: "12px",
            border: `4px solid ${borderColor}`,
            transition: "0.3s ease",
            marginBottom: "20px"
        },
        webcam: {
            borderRadius: "10px"
        },
        history: {
            marginTop: "10px",
            padding: "12px",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
            fontSize: "0.95rem",
            color: "#334155"
        },
        footer: {
            marginTop: "20px",
            fontSize: "0.85rem",
            color: "#94a3b8"
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.title}>Student Attendance System</div>
                <div style={styles.subtitle}>
                    Face Recognition Based Automatic Marking
                </div>

                <div style={styles.status}>{status}</div>

                <div style={styles.cameraWrapper}>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={480}
                        height={360}
                        videoConstraints={{ facingMode: "user" }}
                        style={styles.webcam}
                    />
                </div>

                {lastUser && (
                    <div style={styles.history}>
                        Last Marked: <strong>{lastUser.name}</strong> at {lastUser.time}
                    </div>
                )}

                <div style={styles.footer}>
                    Please stand in front of the camera. Attendance will be marked automatically.
                </div>
            </div>
        </div>
    );
};

export default AutoAttendance;
