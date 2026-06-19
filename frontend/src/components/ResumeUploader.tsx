import { useState, useRef } from "react";
import { Upload, Key, FileCheck, AlertTriangle, Copy, Check, Shield } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/apiService";

export default function ResumeUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ resumeId: string; encryptionKey: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }

    const currentUser = getCurrentUser();
    
    // Attempt to parse existing uid from local storage or mock
    // If you don't use getCurrentUser id directly, pass a dummy generic user ID
    const userId = currentUser?.id || "user_12345";

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/resume/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.detail || "Upload failed");
      }

      setSuccessData({
        resumeId: result.resumeId,
        encryptionKey: result.encryptionKey,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
      // reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCopy = () => {
    if (successData) {
      const textToCopy = `Resume ID: ${successData.resumeId}\nEncryption Key: ${successData.encryptionKey}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload Resume (Secure)"}
      </button>

      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}

      {/* Success Modal overlay */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold font-display">Resume Secured!</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Your resume has been encrypted with military-grade AES-256 encryption. We do <strong>NOT</strong> store the raw encryption key. 
              You must save the details below to share your resume with employers. If you lose this key, the resume cannot be recovered.
            </p>

            <div className="bg-muted p-4 rounded-lg border border-border mb-4 font-mono text-xs break-all relative">
              <p className="mb-2 text-muted-foreground font-semibold">Resume ID:</p>
              <p className="mb-4">{successData.resumeId}</p>
              
              <p className="mb-2 text-muted-foreground font-semibold">Encryption Key:</p>
              <p className="text-primary font-bold">{successData.encryptionKey}</p>
              
              <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-md hover:bg-background border border-border transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4 text-secondary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>

            <button
              onClick={() => setSuccessData(null)}
              className="w-full rounded-xl gradient-primary py-3 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              I have saved my key
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
