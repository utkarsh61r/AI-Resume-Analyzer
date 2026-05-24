import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadResume } from '../services/api';
import toast from 'react-hot-toast';

export default function UploadZone({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedId, setUploadedId] = useState(null);

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length > 0) {
      const err = rejected[0].errors[0];
      toast.error(err.code === 'file-too-large' ? 'File too large (max 5MB)' : 'Only PDF files accepted');
      return;
    }
    const f = accepted[0];
    setFile(f);
    await doUpload(f);
  }, []);

  const doUpload = async (f) => {
    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append('resume', f);
      const { data } = await uploadResume(formData, setProgress);
      setUploadedId(data.resumeId);
      toast.success('Resume uploaded successfully!');
      onUploaded?.(data.resumeId, f.name);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: uploading || !!uploadedId,
  });

  const reset = () => {
    setFile(null);
    setProgress(0);
    setUploadedId(null);
    onUploaded?.(null, null);
  };

  if (uploadedId) {
    return (
      <div className="glass rounded-2xl p-8 text-center animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Upload Complete</h3>
        <p className="text-slate-400 text-sm mb-1">{file?.name}</p>
        <p className="text-slate-500 text-xs mb-5">
          {file ? (file.size / 1024).toFixed(0) + ' KB' : ''}
        </p>
        <div className="flex gap-3 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm">
            <FileText className="w-4 h-4" />
            Ready to analyze
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
          >
            Upload different
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
            : 'border-white/15 hover:border-indigo-500/50 hover:bg-white/[0.03]'
          }
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isDragActive
              ? 'bg-indigo-500/25 border border-indigo-400/50 scale-110'
              : 'bg-white/[0.06] border border-white/10'
            }`}>
            {uploading ? (
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            ) : (
              <Upload className={`w-8 h-8 transition-colors ${isDragActive ? 'text-indigo-400' : 'text-slate-400'}`} />
            )}
          </div>

          {uploading ? (
            <div className="space-y-3 w-full max-w-xs">
              <p className="text-slate-300 font-medium">Uploading {file?.name}...</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-indigo-400 text-sm font-medium">{progress}%</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-white font-semibold text-lg mb-1">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-slate-400 text-sm">or click to browse files</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> PDF only
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>Max 5MB</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File tips */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: '✓', label: 'PDF format', color: 'text-emerald-400' },
          { icon: '✓', label: 'Max 5MB', color: 'text-emerald-400' },
          { icon: '✓', label: 'ATS ready', color: 'text-emerald-400' },
        ].map((tip, i) => (
          <div key={i} className="glass rounded-xl py-2.5 px-3">
            <span className={`text-xs font-medium ${tip.color}`}>{tip.icon} {tip.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
