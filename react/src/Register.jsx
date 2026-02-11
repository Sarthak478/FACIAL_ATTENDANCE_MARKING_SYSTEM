import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import './app.css';

const Register = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const requestRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // 1: Form, 2: Camera, 3: Processing, 4: Success, 5: Error
  const [view, setView] = useState(1); 
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);

  const RECORDING_DURATION_MS = 1500;

  const [formData, setFormData] = useState({ 
    userId: "", 
    name: "", 
    email: "",
    phoneNumber: "",
    role: "student" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateUserId = () => {
    const prefix = formData.role === "student" ? "STU" : "FAC";
    function getUnique4Digit() {
      let current = Number(localStorage.getItem("unique4Digit")) || 1000;
      if (current > 9999) {
        throw new Error("All numbers exhausted");
      }localStorage.setItem("unique4Digit", current + 1);
      return current;
    }const newId = `${prefix}-${getUnique4Digit()}`;
    setFormData((prev) => ({ ...prev, userId: newId }));
  };

  useEffect(() => {
    const initDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        detectorRef.current = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to init Face Detector:", err);
      }
    };
    initDetector();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (detectorRef.current) detectorRef.current.close();
    };
  }, []);

  const predictWebcam = () => {
    if (detectorRef.current && webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const startTimeMs = performance.now();
      const result = detectorRef.current.detectForVideo(video, startTimeMs);
      
      const hasFace = result.detections.length > 0;
      setFaceDetected(hasFace);
      
      // Auto-start Recording
      if (hasFace && !recording && progress === 0 && view === 2) {
        startRecording();
      }
      
      // Auto-ABORT if face lost
      if (!hasFace && recording) {
        abortRecording();
      }

      drawResults(result.detections);
    }
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  useEffect(() => {
    if (view === 2 && isLoaded) {
      requestRef.current = requestAnimationFrame(predictWebcam);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [view, isLoaded, recording, progress]);

  // --- 3. Drawing Logic (Red Border Restored) ---
  const drawResults = (detections) => {
    const canvas = canvasRef.current;
    if (!canvas || !webcamRef.current?.video) return;
    
    const ctx = canvas.getContext("2d");
    const video = webcamRef.current.video;
    
    if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
    if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (detections.length > 0) {
      const box = detections[0].boundingBox;
      
      // RESTORED: Red solid line if recording, Green dashed if just detecting
      ctx.strokeStyle = recording ? "#ef4444" : "#10b981"; 
      ctx.lineWidth = 4;
      ctx.setLineDash(recording ? [] : [10, 5]);

      const mirroredX = canvas.width - box.originX - box.width;
      
      ctx.strokeRect(mirroredX, box.originY, box.width, box.height);
    }
  };

  // --- 4. Recording Logic ---
  const startRecording = () => {
    setRecording(true);
    setRecordedChunks([]);
    
    const stream = webcamRef.current.stream;
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();

    let startTime = Date.now();
    const interval = setInterval(() => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        clearInterval(interval);
        return;
      }

      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / RECORDING_DURATION_MS) * 100, 100);
      setProgress(p);

      if (elapsed >= RECORDING_DURATION_MS) {
        clearInterval(interval);
        stopRecording();
      }
    }, 100);

    mediaRecorderRef.current.intervalId = interval; 
  };

  const abortRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      if (mediaRecorderRef.current.intervalId) clearInterval(mediaRecorderRef.current.intervalId);
    }
    setRecording(false);
    setProgress(0);
    setRecordedChunks([]);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // --- 5. Submission Logic ---
  useEffect(() => {
    if (!recording && progress === 100 && recordedChunks.length > 0) {

    if (!isSubmittingRef.current) {
     isSubmittingRef.current = true;
     submitRegistration();
  }    
}
  }, [recording, progress, recordedChunks]);

  const submitRegistration = async () => {
    isSubmittingRef.current = true;
    // SWITCH TO PROCESSING SCREEN
    setView(3); 
    
    try {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const faceData = new FormData();
      faceData.append("video", blob, "face_scan.webm");

      // 1. Python Call
      const pythonResponse = await axios.post("http://localhost:5000/train_face", faceData);
      const embeddingValue = pythonResponse.data.embedding;

      if (!embeddingValue || embeddingValue.length === 0) {
        throw new Error("AI Model returned empty embedding.");
      }

      // 2. Combine Data
      const fullRegistrationData = {
        ...formData,
        embedding: embeddingValue
      };

      // 3. Node.js Call
      await axios.post("http://localhost:4000/api/users/test-register", fullRegistrationData);
      
      // SUCCESS SCREEN
      setView(4); 

    } catch (err) {
      console.error(err);
      // ERROR SCREEN
      setView(5);
    }
  };

  // RESET FUNCTION
  const handleReset = () => {
    setView(1);
    setProgress(0);
    setRecordedChunks([]);
    setFormData({ userId: "", name: "", email: "", phoneNumber: "", role: "student" });
  };
  // ... existing code ...

  // ADD THIS: Define camera settings to limit FPS
  const videoConstraints = {
    width: 640,
    height: 480,
    frameRate: 10 // <--- This forces the camera to capture only 10 frames/sec
  };
return (
  <div className="fixed inset-0 z-50 w-screen h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative">
      
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-600 to-emerald-500 p-8 text-white shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight">Registration Portal</h2>
          <p className="text-emerald-50 mt-1 text-sm font-medium">
            {view === 1 && "Enter your details to enroll"}
            {view === 2 && "Face scan for identity verification"}
            {view === 3 && "Processing your registration..."}
            {view === 4 && "Registration complete!"}
            {view === 5 && "Registration failed"}
          </p>
        </div>
      </div>

      <div className="p-8 overflow-y-auto flex-1 flex flex-col justify-center">
        
        {/* VIEW 1: FORM */}
        {view === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input 
                  name="name" 
                  className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-slate-300" 
                  placeholder="Enter your name" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <input 
                  name="phoneNumber" 
                  type="tel" 
                  className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-slate-300" 
                  placeholder="+91 XXXXX XXXXX" 
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                name="email" 
                type="email" 
                className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-slate-300" 
                placeholder="your.email@college.edu" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
              <select 
                name="role" 
                className="w-full border-2 border-slate-200 p-3.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 cursor-pointer" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <button
              onClick={() => { generateUserId(); setView(2); }}
              disabled={!formData.name || !formData.email}
              className="w-full bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Proceed to Face Scan →
            </button>
          </div>
        )}

        {/* VIEW 2: CAMERA */}
        {view === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className={`relative w-full aspect-video bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl border-4 ${recording ? 'border-red-500 shadow-red-500/50' : 'border-slate-200'} transition-all duration-300`}>
              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-slate-900">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium">Initializing AI...</p>
                </div>
              )}
              
              <Webcam 
                ref={webcamRef} 
                audio={false} 
                videoConstraints={videoConstraints}
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" 
              />
              
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full z-20 pointer-events-none" 
              />
              
              {/* Status Badge */}
              {faceDetected && (
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
                    <div className={`backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-3 shadow-2xl ${recording ? 'bg-red-600/90' : 'bg-black/60'} transition-all duration-300`}>
                       <div className={`w-3 h-3 rounded-full ${recording ? 'bg-white animate-pulse' : 'bg-emerald-400'}`}></div>
                       {recording ? 'Fetching Face Data...' : 'Face Detected'}
                    </div>
                 </div>
              )}
            </div>

            <button 
              onClick={() => setView(1)} 
              className="w-full border-2 border-slate-300 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:border-slate-400"
            >
              ← Go Back
            </button>
          </div>
        )}

        {/* VIEW 3: PROCESSING (ANIMATED) */}
        {view === 3 && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500 py-12">
             <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-8 border-emerald-300 border-b-transparent rounded-full animate-spin animation-delay-150" style={{animationDirection: 'reverse'}}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-mono bg-linear-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg animate-pulse">
                    ◉_◉
                  </span>
                </div>
             </div>
             <div className="text-center">
                <h3 className="text-3xl font-bold text-slate-800 mb-2">Processing Registration</h3>
                <p className="text-slate-500">Analyzing biometric data and creating your profile...</p>
                <div className="flex gap-1 justify-center mt-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
             </div>
          </div>
        )}

        {/* VIEW 4: SUCCESS (HURRAY) */}
        {view === 4 && (
           <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500 py-12">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 opacity-20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-28 h-28 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                   <svg className="w-14 h-14 text-white animate-in zoom-in duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                   </svg>
                </div>
              </div>
              <div className="text-center">
                 <h3 className="text-4xl font-bold bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">Hurray!</h3>
                 <p className="text-slate-600 text-lg">You are registered successfully.</p>
                 <p className="text-slate-400 text-sm mt-1">Your profile has been created and activated.</p>
              </div>
              <button 
                onClick={handleReset} 
                className="w-full bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl mt-4 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                 Register Another Student
              </button>
           </div>
        )}

        {/* VIEW 5: ERROR (AAH) */}
        {view === 5 && (
           <div className="flex flex-col items-center justify-center space-y-8 animate-in shake duration-500 py-12">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 opacity-20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-28 h-28 bg-linear-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                   <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                   </svg>
                </div>
              </div>
              <div className="text-center">
                 <h3 className="text-4xl font-bold bg-linear-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">Oops!</h3>
                 <p className="text-slate-600 text-lg">Something went wrong.</p>
                 <p className="text-slate-400 text-sm mt-1">Please try scanning your face again.</p>
              </div>
              <div className="flex gap-4 w-full">
                 <button 
                   onClick={() => setView(2)} 
                   className="flex-1 bg-linear-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                 >
                    Try Again
                 </button>
                 <button 
                   onClick={handleReset} 
                   className="flex-1 border-2 border-slate-300 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:border-slate-400"
                 >
                    Cancel
                 </button>
              </div>
           </div>
        )}

      </div>
    </div>
  </div>
);
};

export default Register;
