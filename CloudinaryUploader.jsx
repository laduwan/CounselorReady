// DROP INTO: client/src/components/CourseBuilder/CloudinaryUploader.jsx
import { useState, useRef } from "react";
import { C } from "./constants";
import { S } from "./styles";

function CloudinaryUploader({ onUpload, context = "general", currentImage = null, label = "Upload Image", compact = false }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState(null);
  const [alt, setAlt] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || "https://api.counselorready.com/api";

  const processFile = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("Max 10MB"); return; }
    if (!file.type.startsWith("image/")) { setError("Images only"); return; }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("context", context);
      formData.append("alt", alt);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/images/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || data.error || "Upload failed");
      const result = data.data || data;
      setPreview(result.thumbnailUrl || result.url);
      onUpload(result);
    } catch (err) {
      // Fallback to local preview if API unavailable
      try {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          const fallback = { url, publicId: `${context}_${Date.now()}`, width: img.width, height: img.height, alt, thumbnailUrl: url, mediumUrl: url, largeUrl: url };
          setPreview(url);
          onUpload(fallback);
        };
        img.onerror = () => setError("Failed to load image");
        img.src = url;
      } catch (e2) {
        setError(err.message || "Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => processFile(e.target.files?.[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files?.[0]); };

  if (compact) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input type="file" ref={fileRef} accept="image/*" onChange={handleFileInput} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ background: C.green, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, opacity: uploading ? 0.6 : 1 }}>
          {uploading ? "â³" : "ðŸ“·"} {label}
        </button>
        {preview && <img src={preview} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover" }} />}
        {error && <span style={{ color: C.danger, fontSize: 11 }}>{error}</span>}
      </span>
    );
  }

  return (
    <div>
      <input type="file" ref={fileRef} accept="image/*" onChange={handleFileInput} style={{ display: "none" }} />
      <div onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{ border: `2px dashed ${dragOver ? C.green : C.border}`, borderRadius: 10, padding: preview ? 8 : 28, textAlign: "center", cursor: "pointer", background: dragOver ? C.greenFaded : (preview ? C.bg : "#fff"), position: "relative", transition: "all 0.2s" }}>
        {preview ? (
          <div style={{ position: "relative" }}>
            <img src={preview} alt={alt} style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8, display: "block", margin: "0 auto" }} />
            <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>Click to replace</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>ðŸ“·</div>
            <div style={{ fontWeight: 600, color: C.navy, fontSize: 14 }}>{label}</div>
            <div style={{ color: C.textLight, fontSize: 12, marginTop: 4 }}>Drag & drop or click Â· Max 10MB</div>
            {uploading && <div style={{ marginTop: 10, background: C.green, borderRadius: 4, height: 4, width: "60%", margin: "10px auto 0" }} />}
          </div>
        )}
      </div>
      <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)}
        placeholder="Alt text for accessibility"
        style={{ ...S.input, marginTop: 8, fontSize: 12 }} />
      {error && <p style={{ color: C.danger, fontSize: 12, marginTop: 4 }}>âš  {error}</p>}
    </div>
  );
}

export default CloudinaryUploader;
