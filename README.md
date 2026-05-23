# 💪 Gym AI Agent

AI-powered fitness assistant using React, Node.js, and Ollama (local LLM).

---

## ⚡ Features

- Diet & workout generation
- BMI & calorie calculation
- RAG (knowledge-based answers)
- Local AI (no API cost)

---

## 🛠️ Tech Stack

Frontend:
- React + TypeScript
- Tailwind CSS
- Axios

Backend:
- Node.js + Express
- TypeScript
- Zod validation

AI:
- Ollama (llama3.2)
- Embeddings + RAG

---

## 🚀 How to Run Locally

### 1. Clone repo

```bash
git clone https://github.com/YOUR_USERNAME/gym-ai-agent.git
cd gym-ai-agent

install ollama 

```bash

ollama pull llama3.2:1b
ollama pull nomic-embed-text


---


Then just do:

```bash
git clone ...
cd gym-ai-agent

cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
