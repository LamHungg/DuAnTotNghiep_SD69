import React, { useState } from "react";
import {
  uploadImageToServer,
  uploadMultipleImages,
} from "../services/sanPhamService";

const ImageUploadTest = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [error, setError] = useState("");

  const handleSingleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      console.log("Uploading file:", file.name, file.size, file.type);

      const result = await uploadImageToServer(file);
      console.log("Upload result:", result);

      setUploadedUrls((prev) => [...prev, result]);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      setError("");

      console.log(
        "Uploading files:",
        files.map((f) => f.name)
      );

      const results = await uploadMultipleImages(files);
      console.log("Upload results:", results);

      setUploadedUrls((prev) => [...prev, ...results]);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Test Upload Ảnh</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Upload 1 ảnh</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleSingleUpload}
          disabled={uploading}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Upload nhiều ảnh</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleMultipleUpload}
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div style={{ color: "blue", marginBottom: "10px" }}>
          Đang upload...
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>Lỗi: {error}</div>
      )}

      {uploadedUrls.length > 0 && (
        <div>
          <h3>Ảnh đã upload ({uploadedUrls.length}):</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "10px",
            }}
          >
            {uploadedUrls.map((url, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "12px",
                    wordBreak: "break-all",
                  }}
                >
                  {url}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadTest;
