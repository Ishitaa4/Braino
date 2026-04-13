import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Practice() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [session, setSession] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/decks/${deckId}/due`).then((res) => {
      if (res.data.length === 0) setDone(true);
      else setCards(res.data);
    });
  }, [deckId]);

  const handleRating = async (rating) => {
    await axios.patch(
      `http://localhost:5000/api/decks/cards/${cards[index]._id}/review`,
      { rating },
    );

    const result = {
      question: cards[index].front,
      answer: cards[index].back,
      rating,
    };
    const newSession = [...session, result];
    setSession(newSession);

    if (index + 1 >= cards.length) {
      setDone(true);
    } else {
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  // SESSION SUMMARY
  if (done && session.length > 0) {
    const total = session.length;
    const again = session.filter((s) => s.rating === 0).length;
    const hard = session.filter((s) => s.rating === 1).length;
    const good = session.filter((s) => s.rating === 2).length;
    const easy = session.filter((s) => s.rating === 3).length;
    const score = Math.round(((good + easy) / total) * 100);

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
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #eee",
            padding: "1rem 2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#fdfdfd",
            color: "#111",
            border: "1px solid #111",
            borderRadius: "8px",
            padding: "0.5rem 0.5rem",
            fontWeight: 500,
            fontSize: "0.9rem",
            boxShadow: "1px 1px 0px #111",
            cursor: "pointer",
            fontSize: "0.85rem",
            }}
          >
            ← Back
          </button>
          <span style={{ fontWeight: 600, color: "#111" }}>
            Session Summary
          </span>
        </div>

        <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
          {/* Score Card */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "3rem" }}>
              {score >= 80 ? "🏆" : score >= 50 ? "💪" : "📚"}
            </p>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#111",
                marginBottom: "0.3rem",
              }}
            >
              Session Complete!
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              You reviewed {total} cards
            </p>

            {/* Score circle */}
            <div
              style={{
                background: "#111",
                borderRadius: "50%",
                width: "90px",
                height: "90px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <span
                style={{ fontSize: "1.4rem", fontWeight: 800, color: "white" }}
              >
                {score}%
              </span>
              <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>
                score
              </span>
            </div>

            {/* Rating breakdown */}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {[
                {
                  label: "Again",
                  value: again,
                  bg: "#fee2e2",
                  color: "#dc2626",
                },
                { label: "Hard", value: hard, bg: "#fef3c7", color: "#d97706" },
                { label: "Good", value: good, bg: "#d1fae5", color: "#059669" },
                { label: "Easy", value: easy, bg: "#dbeafe", color: "#2563eb" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: stat.bg,
                    borderRadius: "12px",
                    padding: "0.6rem",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: stat.color }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card breakdown */}
          <h3 style={{ fontWeight: 600, marginBottom: "1rem", color: "#111" }}>
            Card Breakdown
          </h3>
          {session.map((s, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "1rem 1.2rem",
                marginBottom: "0.7rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                borderLeft: `4px solid ${
                  s.rating === 0
                    ? "#dc2626"
                    : s.rating === 1
                      ? "#d97706"
                      : s.rating === 2
                        ? "#059669"
                        : "#2563eb"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      color: "#111",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {s.question}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                    {s.answer}
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: "1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color:
                      s.rating === 0
                        ? "#dc2626"
                        : s.rating === 1
                          ? "#d97706"
                          : s.rating === 2
                            ? "#059669"
                            : "#2563eb",
                  }}
                >
                  {s.rating === 0
                    ? "Again"
                    : s.rating === 1
                      ? "Hard"
                      : s.rating === 2
                        ? "Good"
                        : "Easy"}
                </span>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate("/")}
            style={{
           background: "#111",
    color: "#fafafa",
    border: "2px solid #111",
    borderRadius: "8px",
    padding: "0.5rem 1.2rem",
    fontWeight: 700,
    fontSize: "0.9rem",
    width:"100%",
    boxShadow: "3px 3px 0px #111"
            }}
          >
            ← Back to Decks
          </button>
        </div>
      </div>
    );
  }

  // NO CARDS DUE
  if (done && session.length === 0)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1
          style={{ fontSize: "1.8rem", color: "#111", marginBottom: "0.5rem" }}
        >
          All caught up!
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
          No cards due today. Come back tomorrow!
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
           background: "#f7f5f0",
    color: "#111",
    border: "2px solid #111",
    borderRadius: "8px",
    padding: "0.5rem 1.2rem",
    fontWeight: 700,
    fontSize: "0.9rem",
    boxShadow: "3px 3px 0px #111"
          }}
        >
          ← Back to Decks
        </button>
      </div>
    );

  if (cards.length === 0)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );

  const card = cards[index];
  const progress = (index / cards.length) * 100;

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
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #eee",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#fdfdfd",
            color: "#111",
            border: "1px solid #111",
            borderRadius: "8px",
            padding: "0.5rem 0.5rem",
            fontWeight: 500,
            fontSize: "0.9rem",
            boxShadow: "1px 1px 0px #111",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          ← Back
        </button>
        <span style={{ fontWeight: 600, color: "#111" }}>Practice Session</span>
      </div>

      <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
        {/* Progress */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.4rem",
            }}
          >
            <span style={{ color: "#272829", fontSize: "0.85rem" }}>
              Card {index + 1} of {cards.length}
            </span>
            <span
              style={{ color: "#111", fontSize: "0.85rem", fontWeight: 500 }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            style={{
              background: "#e5e7eb",
              borderRadius: "999px",
              height: "6px",
            }}
          >
            <div
              style={{
                background: "#111",
                height: "6px",
                borderRadius: "999px",
                width: `${progress}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div
          onClick={() => setFlipped(!flipped)}
          style={{
            background: flipped ? "rgb(181, 182, 184)" : "white",
            border: "1px solid #eeeeee",
            borderRadius: "20px",
            padding: "2.5rem 2rem",
            minHeight: "200px",
            cursor: "pointer",
            marginBottom: "2rem",
            boxShadow: "0 6px 16px rgba(64, 64, 65, 0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              marginBottom: "1rem",
              color: flipped ? "#01010a" : "#121213",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {flipped ? "Answer" : "Tap to reveal"}
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              color: flipped ? "#312e2e" : "#312e2e",
              lineHeight: "1.6",
              transition: "color 0.3s ease",
            }}
          >
            {flipped ? card.back : card.front}
          </p>
        </div>

        {/* Rating */}
        {flipped && (
          <div
            style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}
          >
            {[
              { label: "Again", rating: 0, bg: "#e9b3b3", color: "#010916" },
              { label: "Hard", rating: 1, bg: "#e2d8ba", color: "#010813" },
              { label: "Good", rating: 2, bg: "#b0d1bf", color: "#00050e" },
              { label: "Easy", rating: 3, bg: "#dbeafe", color: "#00040c" },
            ].map((btn) => (
              <button
                key={btn.rating}
                onClick={() => handleRating(btn.rating)}
                style={{
                  background: btn.bg,
                  color: btn.color,
                  border: "none",
                  padding: "0.5rem 1rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  color: "#111",
                  borderRadius: "8px",

                  fontWeight: 500,
                  
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
