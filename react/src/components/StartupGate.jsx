import { useState, useEffect } from "react";
import axios from "axios";
import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision";

const CHECKS = {
  ai: true,             // Set to TRUE if you need Face Recognition (MediaPipe)
  nodeServer: true,     // Set to TRUE to check if Node.js (Port 4000) is running
  pythonServer: true    // Set to TRUE to check if Python (Port 5000) is running
};

const URLS = {
  node: "http://localhost:4000",
  python: "http://localhost:5000"
};

const StartupGate = ({ children }) => {
  const [status, setStatus] = useState("initializing"); 
  const [message, setMessage] = useState("System Startup...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const bootSystem = async () => {
      try {
        setStatus("loading");
        let currentProgress = 0;
        
        // Calculate total steps based on enabled checks
        const totalSteps = (CHECKS.ai ? 1 : 0) + (CHECKS.nodeServer ? 1 : 0) + (CHECKS.pythonServer ? 1 : 0);
        const stepSize = totalSteps > 0 ? 100 / totalSteps : 100;

        // 1. WAKE UP NODE SERVER
        if (CHECKS.nodeServer) {
          setMessage("Connecting to Main Database...");
          try {
            // We ping the root "/" or a specific health endpoint
            await axios.get(`${URLS.node}/`); 
          } catch (e) {
             // If root "/" isn't set up, you might get a 404, which is technically a response (server is up).
             // We throw only if network error (server down).
             if (e.code === "ERR_NETWORK") throw new Error("Node Server (Port 4000) Unreachable");
          }
          currentProgress += stepSize;
          setProgress(currentProgress);
        }

        // 2. WAKE UP PYTHON AI SERVER
        if (CHECKS.pythonServer) {
          setMessage("Initializing AI Engine...");
          try {
             await axios.get(`${URLS.python}/`);
          } catch (e) {
             if (e.code === "ERR_NETWORK") throw new Error("Python Server (Port 5000) Unreachable");
          }
          currentProgress += stepSize;
          setProgress(currentProgress);
        }

        // 3. LOAD MEDIAPIPE (Heavy Task)
        if (CHECKS.ai) {
          setMessage("Loading Biometric Models...");
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
          );
          // Initialize detector to cache WASM files
          await FaceDetector.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
          });
          currentProgress += stepSize;
          setProgress(currentProgress);
        }

        // DONE
        setMessage("System Ready.");
        setStatus("success");
        
        // Slight delay to show the 100% bar before switching
        setTimeout(() => {
           setStatus("complete"); 
        }, 800);

      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Startup Failed: " + (err.message || "Unknown Error"));
      }
    };

    bootSystem();
  }, []);


  if (status === "complete") {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center font-sans">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 text-center">
        
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className={`absolute inset-0 border-4 rounded-full transition-all duration-500
            ${status === 'error' ? 'border-red-500/30' : 'border-slate-700'}`}></div>
          
          <div className={`absolute inset-0 border-4 border-t-transparent rounded-full animate-spin
            ${status === 'error' ? 'border-red-500' : 'border-emerald-500'}`}
            style={{ animationDuration: '1.5s' }}></div>
            
          <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
            {status === 'error' ? '⚠' : '⚡'}
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${status === 'error' ? 'text-red-400' : 'text-white'}`}>
          {status === 'error' ? 'System Error' : 'Initializing'}
        </h2>
        <p className="text-slate-400 text-sm mb-6 h-6">{message}</p>

        {status !== 'error' && (
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2 border border-white/5">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500 ease-out shadow-[0_0_10px_#10b981]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {status === 'error' && (
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg transition-all"
          >
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
};

export default StartupGate;