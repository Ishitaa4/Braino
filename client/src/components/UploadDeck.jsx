import { useState } from "react";
import axios from "axios";

export default function UploadDeck({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const res = await axios.post("http://localhost:5000/api/decks/upload", formData);
      setMessage(`✅ Created ${res.data.cardCount} cards from "${res.data.deck.title}"`);
      onUpload();
    } catch (err) {
      setMessage("❌ Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "2rem",
      border: "2px dashed #d1d5db",
      textAlign: "center",
    }}>
      <p style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>📄</p>
      <h2 style={{ fontWeight: 600, color: "#111", marginBottom: "0.3rem" }}>Upload a PDF</h2>
      <p style={{ color: "#9ca3af", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
        Drop your study material and we'll turn it intto flashcards that stick
      </p>

      <input
        type="file"
        accept=".pdf"
        onChange={e => setFile(e.target.files[0])}
        style={{ fontSize: "0.85rem", marginBottom: "1rem" }}
      />
      <br />

      <button
  onClick={handleUpload}
  disabled={loading || !file}
  onMouseDown={e => e.currentTarget.style.transform = "translate(1px, 1px)"}
  onMouseUp={e => e.currentTarget.style.transform = "translate(0, 0)"}
  onMouseLeave={e => e.currentTarget.style.transform = "translate(0, 0)"}
  style={{
    background: loading || !file ? "#f3f4f6" : "#FFC700",
    color: loading || !file ? "#9ca3af" : "#111",
    border: "1px solid #111",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontWeight: 500,
    fontSize: "0.9rem",
    boxShadow: loading || !file ? "none" : "1px 1px 0px #111",
    cursor: loading || !file ? "not-allowed" : "pointer",
    transition: "all 0.15s ease",
    marginTop: "0.3rem"
  }}
>
  {loading ? "⏳ Generating..." : "✨ Generate Cards"}
</button>

      {loading && (
        <div style={{ marginTop: "1.2rem" }}>
          <p style={{ color: "#9ca3af", fontSize: "0.82rem", marginBottom: "0.8rem" }}>
            Extracting key concepts...
          </p>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: "#f3f4f6",
              borderRadius: "8px",
              height: "38px",
              marginBottom: "0.5rem",
              animation: "pulse 1.5s infinite"
            }} />
          ))}
        </div>
      )}

      {message && (
        <p style={{
          marginTop: "1rem",
          fontSize: "0.85rem",
          color: message.includes("✅") ? "#16a34a" : "#dc2626",
          fontWeight: 500
        }}>
          {message}
        </p>
      )}
    </div>
  );
}