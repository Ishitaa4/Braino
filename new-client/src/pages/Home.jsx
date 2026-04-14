import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UploadDeck from "../components/UploadDeck.jsx";

export default function Home() {
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchDecks = async () => {
    const res = await axios.get("https://braino-pilu.onrender.com/api/decks");
    setDecks(res.data);

    const statsObj = {};
    await Promise.all(
      res.data.map(async (deck) => {
        const [cardsRes, dueRes] = await Promise.all([
          axios.get(`https://braino-pilu.onrender.com/api/decks/${deck._id}/cards`),
          axios.get(`https://braino-pilu.onrender.com/api/decks/${deck._id}/due`),
        ]);
        const all = cardsRes.data;
        const mastered = all.filter((c) => c.mastered).length;

        statsObj[deck._id] = {
          total: all.length,
          mastered,
          due: dueRes.data.length,
        };
      }),
    );
    setStats(statsObj);
  };

  const deleteDeck = async (deckId) => {
    await axios.delete(`https://braino-pilu.onrender.com/api/decks/${deckId}`);
    fetchDecks();
  };

 useEffect(() => {
  fetchDecks();
  const interval = setInterval(fetchDecks, 6000); 
  return () => clearInterval(interval);
}, []);

  const filtered = decks.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          background: "white",
          borderBottom: "2px solid #111",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.3rem",
              color: "#111",
              letterSpacing: "-0.5px",
            }}
          >
            BRAINO
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "auto", padding: "2rem" }}>
        {/* Hero */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            marginTop: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.8rem",
              fontWeight: 800,
              color: "#111",
              marginBottom: "0.5rem",
              letterSpacing: "-1px",
              lineHeight: 1.2,
            }}
          >
            Built for memory,
            <br />
            Not cramming🚀
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>
            Turn notes into memory
          </p>
        </div>

        {/* Upload Section */}
        <UploadDeck onUpload={fetchDecks} />

        {/* Search */}
        {decks.length > 0 && (
          <input
            type="text"
            placeholder="Search your decks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#eee",
              marginBottom: "1.5rem",
              outline: "none",
              fontSize: "0.95rem",
            }}
          />
        )}

        <h2 style={{ marginBottom: "1rem", color: "#111" }}>Your Decks</h2>

        {/* Empty */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <p style={{ fontSize: "2.5rem" }}>📚</p>
            <p>No decks yet. Upload a PDF to start!</p>
          </div>
        )}

        {/* Deck Cards */}
        {filtered.map((deck) => {
          const s = stats[deck._id] || {
            total: 0,
            mastered: 0,
            due: 0,
          };

          const masteredPct = s.total
            ? Math.round((s.mastered / s.total) * 100)
            : 0;

          return (
            <div
              key={deck._id}
              style={{
                background: "white",
                border: "1px solid #f1f1f1",
                borderRadius: "16px",
                padding: "1.2rem",
                marginBottom: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-3px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1rem", color: "#111" }}>
                    {deck.title}
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    {new Date(deck.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => navigate(`/practice/${deck._id}`)}
                    style={{
                      background: "#FFC700",
                      color: "#111",
                      border: "1px solid #111",
                      borderRadius: "8px",
                      padding: "0.5rem 0.5rem",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      boxShadow: "1px 1px 0px #111",
                      cursor: "pointer",
                    }}
                  >
                    Review
                  </button>

                  <button
                    onClick={() => deleteDeck(deck._id)}
                    style={{
                      background: "#fafafa",
                      color: "#111",
                      border: "1px solid #111",
                      borderRadius: "8px",
                      padding: "0.5rem 0.5rem",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      boxShadow: "1px 1px 0px #111",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Mastery bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.3rem",
                  marginTop: "1rem",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  Mastery
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#111",
                    fontWeight: 600,
                  }}
                >
                  {masteredPct}%
                </span>
              </div>
              <div
                style={{
                  background: "#e5e7eb",
                  borderRadius: "999px",
                  height: "5px",
                  marginBottom: "0.8rem",
                }}
              >
                <div
                  style={{
                    background: masteredPct === 100 ? "#059669" : "#111",
                    height: "5px",
                    borderRadius: "999px",
                    width: `${masteredPct}%`,
                    transition: "width 0.4s ease",
                    minWidth: masteredPct > 0 ? "8px" : "0",
                  }}
                />
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  fontSize: "0.78rem",
                  color: "#0d0f14",
                }}
              >
                <span>
                  📚 <strong style={{ color: "#111" }}>{s.total}</strong> total
                </span>
                <span>
                  ✅ <strong style={{ color: "#059669" }}>{s.mastered}</strong>{" "}
                  mastered
                </span>
                <span>
                  ⏰{" "}
                  <strong style={{ color: s.due > 0 ? "#d97706" : "#111" }}>
                    {s.due}
                  </strong>{" "}
                  due
                </span>
              </div>

              {/* Completion badge */}
              {masteredPct === 100 && (
                <div
                  style={{
                    marginTop: "0.8rem",
                    background: "#d1fae5",
                    color: "#059669",
                    borderRadius: "999px",
                    padding: "0.3rem 0.8rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  🎉 Yay! Deck Complete
                </div>
              )}

              {s.due === 0 && masteredPct < 100 && (
                <div
                  style={{
                    marginTop: "0.8rem",
                    background: "#f3f4f6",
                    color: "#6b7280",
                    borderRadius: "999px",
                    padding: "0.3rem 0.8rem",
                    fontSize: "0.78rem",
                    display: "inline-block",
                  }}
                >
                  ✓ All caught up
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
