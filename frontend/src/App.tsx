import { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    age: 19,
    gender: "male",
    heightCm: 173,
    weightKg: 76,
    goal: "fat loss",
    dietType: "vegetarian",
    experience: "beginner"
  });

  async function askAgent() {
    if (!message.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post("http://localhost:4000/api/agent", {
        message,
        profile
      });

      const formatted = `
BMI: ${res.data.bmi}
Calories Target: ${res.data.calories} kcal

${res.data.answer}
      `;

      setAnswer(formatted);
    } catch (err: any) {
      setAnswer("❌ Error: Backend or Ollama not running.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <h1 className="text-4xl font-bold text-center mb-2">
          Gym AI Agent 💪
        </h1>
        <p className="text-center text-yellow-200 mb-8">
          Diet + Workout + RAG AI Assistant
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* PROFILE */}
          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-5">
            <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

            {Object.entries(profile).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label className="block text-sm mb-1 capitalize">
                  {key}
                </label>

                <input
                  className="w-full p-3 rounded bg-black border border-yellow-600 text-yellow-300"
                  value={value}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      [key]:
                        key === "age" ||
                        key === "heightCm" ||
                        key === "weightKg"
                          ? Number(e.target.value)
                          : e.target.value
                    })
                  }
                />
              </div>
            ))}
          </div>

          {/* CHAT INPUT */}
          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-5">
            <h2 className="text-2xl font-semibold mb-4">Ask Gym Agent</h2>

            <textarea
              className="w-full h-40 p-3 rounded bg-black border border-yellow-600 text-yellow-300"
              placeholder="Example: Mere liye fat loss diet aur workout plan banao"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={askAgent}
              disabled={loading}
              className="mt-4 w-full bg-yellow-400 text-black font-bold p-3 rounded-xl hover:bg-yellow-300 transition"
            >
              {loading ? "Thinking..." : "Ask Agent"}
            </button>
          </div>
        </div>

        {/* RESPONSE */}
        {answer && (
          <div className="mt-8 bg-zinc-900 border border-yellow-500 rounded-2xl p-5 text-yellow-100 space-y-2">
            {answer.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;