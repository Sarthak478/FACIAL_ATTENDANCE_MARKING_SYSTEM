import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const PYTHON_API = "http://localhost:5001/generate_embedding"; 
const NODE_LOGIN_API = "http://localhost:4000/api/users/admin-login";

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
    const webcamRef = useRef(null);

    const [status, setStatus] = useState("Initializing...");
    const [borderColor, setBorderColor] = useState("#cbd5e1");

    const isMounted = useRef(true);
    const isProcessing = useRef(false);
    const lastAttemptTime = useRef(0);
    const LOOP_DELAY = 500; 
    // 1. HELPER: Convert Base64 to Blob
    const b64toBlob = async (base64Data) => {
        const r = await fetch(base64Data);
        return await r.blob();
    };

    // 2. MAIN LOOP: Capture -> Python -> Node
    const processFrame = async () => {
        if (!isMounted.current || isProcessing.current) return;

        const now = Date.now();
        if (now - lastAttemptTime.current < LOOP_DELAY) return;

        isProcessing.current = true;
        lastAttemptTime.current = now;

        try {
            if (!webcamRef.current) return;
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return; // Camera not ready

            setStatus("Scanning...");
            setBorderColor("#3b82f6"); // Blue (Active)

            // --- A. Send to Python (Get Vector) ---
            const blob = await b64toBlob(imageSrc);
            const formData = new FormData();
            formData.append("file", blob, "capture.jpg");

            let vector = null;
            try {
                const pythonResponse = await axios.post(PYTHON_API, formData, { 
                    headers: { "Content-Type": "multipart/form-data" } 
                });
                vector = pythonResponse.data.embedding;
            } catch (pyErr) {
                // If Python fails (no face detected), just ignore and try next frame
                return; 
            }

            if (!vector || vector.length === 0) return;

            // --- B. Send to Node (Verify Admin) ---
            const nodeResponse = await axios.post(NODE_LOGIN_API, { vector });

            if (nodeResponse.data.success) {
                const adminName = nodeResponse.data.admin.name;
                
                setBorderColor("#22c55e");
                setStatus(`Welcome, ${adminName}`);
                
                // Stop the loop
                isMounted.current = false; 

                // Wait 1 second then login
                setTimeout(() => {
                    onLoginSuccess();
                }, 1000);
            } else {
                // Face found, but not an Admin
                setBorderColor("#ef4444"); 
                setStatus("Access Denied");
            }

        } catch (err) {
            // General error (Network/Server dead)
            // We keep it 'Scanning' instead of showing a scary error
            console.error("Login Loop Error:", err);
            setBorderColor("#f59e0b"); 
            setStatus("Connecting...");
        } finally {
            isProcessing.current = false;
        }
    };

    // 3. START/STOP LOOP
    useEffect(() => {
        isMounted.current = true;
        const interval = setInterval(processFrame, 500); 
        return () => {
            isMounted.current = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                
                <div className="bg-slate-50 p-6 text-center border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800">Admin Login</h2>
                    <p className="text-slate-500 text-sm mt-1">Look at the camera to verify access</p>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div 
                        className="relative rounded-xl overflow-hidden shadow-lg transition-colors duration-300"
                        style={{ border: `4px solid ${borderColor}` }}
                    >
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={480}
                            height={360}
                            videoConstraints={{ facingMode: "user" }}
                        />
                    </div>

                    <div className="mt-6 font-semibold text-lg animate-pulse" style={{ color: borderColor }}>
                        {status}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 flex justify-center border-t border-slate-100">
                    <button 
                        onClick={onCancel}
                        className="px-8 py-2.5 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;