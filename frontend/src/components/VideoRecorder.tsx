import { useState, useRef, useEffect } from "react";
import { Video, Square, Play, Trash2, Camera } from "lucide-react";
import { toast } from "sonner";

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob | null) => void;
}

const VideoRecorder = ({ onVideoRecorded }: VideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (videoRef.current) {
      if (recordedBlob) {
        videoRef.current.srcObject = null;
        videoRef.current.src = URL.createObjectURL(recordedBlob);
      } else if (stream) {
        videoRef.current.removeAttribute('src');
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
    }
  }, [stream, recordedBlob]);

  const startCamera = async () => {
    try {
      if (!window.isSecureContext) {
        toast.error("Camera requires HTTPS or Localhost", {
          description: "Browsers block camera access on non-secure IP addresses. Try using localhost:8080 if you are on the host machine."
        });
        return;
      }
      const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(ms);
    } catch (err) {
      toast.error("Microphone/Camera access denied");
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      onVideoRecorded(blob);
      stopCamera();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  };

  const clearRecording = () => {
    setRecordedBlob(null);
    onVideoRecorded(null);
    startCamera();
  };

  const playRecording = () => {
    if (videoRef.current && recordedBlob) {
        videoRef.current.play();
    }
  };

  return (
    <div className="w-full flex justify-center flex-col items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {!stream && !recordedBlob ? (
          <div className="text-center text-muted-foreground p-4">
             <Camera className="mx-auto h-8 w-8 mb-2 opacity-50" />
             <p className="text-sm font-medium">Record a short video introduction (optional) to stand out.</p>
             <button onClick={startCamera} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md font-bold text-sm hover:scale-105 transition-transform">
               Enable Camera
             </button>
          </div>
        ) : (
          <video 
             ref={videoRef} 
             autoPlay 
             muted={!recordedBlob} 
             playsInline 
             controls={!!recordedBlob}
             className="w-full h-full object-contain" 
          />
        )}
        
        {isRecording && (
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm pl-2 pr-4 py-1 rounded-full border border-red-500/50">
             <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
             <span className="text-xs font-bold text-red-500">REC</span>
          </div>
        )}
      </div>

      {stream && !isRecording && !recordedBlob && (
        <button onClick={startRecording} className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-md">
           <Video className="h-4 w-4" /> Start Recording
        </button>
      )}

      {isRecording && (
        <button onClick={stopRecording} className="flex items-center gap-2 px-6 py-2 bg-black hover:bg-gray-800 text-white border border-red-500 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-md">
           <Square className="h-4 w-4 text-red-500" /> Stop Recording
        </button>
      )}

      {recordedBlob && (
        <div className="flex gap-2">
           <button onClick={playRecording} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors rounded-lg font-bold text-sm">
             <Play className="h-4 w-4" /> Play
           </button>
           <button onClick={clearRecording} className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors rounded-lg font-bold text-sm">
             <Trash2 className="h-4 w-4" /> Retake
           </button>
        </div>
      )}
    </div>
  );
};
export default VideoRecorder;
