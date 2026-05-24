import express from "express";
import cors from "cors";
import ollama from "ollama";
import { z } from "zod";
import { buildVectorDB, retrieveContext } from "./rag";
import { calculateBMI, estimateCalories } from "./tools";

const app = express();
app.use(cors());
app.use(express.json());

const UserSchema = z.object({
  message: z.string(),
  profile: z.object({
    age: z.number(),
    gender: z.string(),
    heightCm: z.number(),
    weightKg: z.number(),
    goal: z.string(),
    dietType: z.string(),
    experience: z.string()
  })
});

app.post("/api/agent", async (req, res) => {
  try {
    const { message, profile } = UserSchema.parse(req.body);

    const context = await retrieveContext(message);

    const bmi = calculateBMI(profile.weightKg, profile.heightCm);

    const calories = estimateCalories(
      profile.weightKg,
      profile.heightCm,
      profile.age,
      profile.gender,
      profile.goal
    );

    const prompt = `
You are a helpful Gym AI Agent.

IMPORTANT RESPONSE RULES:
- Answer only in clean English.
- Do not use Hinglish.
- Use clear highlighted headings.
- After every heading, leave one blank line.
- Under each heading, write short and clean points.
- Keep the answer practical and easy to follow.

User Profile:
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.heightCm} cm
Weight: ${profile.weightKg} kg
Goal: ${profile.goal}
Diet Type: ${profile.dietType}
Experience: ${profile.experience}
BMI: ${bmi}
Estimated daily calories: ${calories}

RAG Knowledge:
${context}

User Question:
${message}

Format your answer exactly like this:

**Direct Answer**

Your short answer here.

**Diet Plan**

Meal 1: ...
Meal 2: ...
Meal 3: ...

**Exercise You Need To Do**

Push-ups: ...
Pull-ups: ...
Squats: ...

**Mistakes To Avoid**

Point 1...
Point 2...

**Safety Note**

A simple safety warning.
`;

    const response = await ollama.chat({
      model: "llama3.2:3b",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      answer: response.message.content,
      bmi,
      calories
    });
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Something went wrong"
    });
  }
});

app.listen(4000, async () => {
  await buildVectorDB();
  console.log("Backend running on http://localhost:4000");
});
