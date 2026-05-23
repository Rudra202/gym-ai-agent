import Ollama from "ollama";
import { gymKnowledge } from "./knowledge";

type DocVector = {
  title: string;
  text: string;
  embedding: number[];
};

let vectorDB: DocVector[] = [];

// cosine similarity function
function cosine(a: number[], b: number[]) {
  let dot = 0,
    normA = 0,
    normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// build vector database
export async function buildVectorDB() {
  vectorDB = [];

  for (const doc of gymKnowledge) {
    const res = await Ollama.embeddings({
      model: "nomic-embed-text",
      prompt: `${doc.title}\n${doc.text}`,
    });

    vectorDB.push({
      ...doc,
      embedding: res.embedding,
    });
  }

  console.log("Vector DB ready:", vectorDB.length);
}

// retrieve relevant context
export async function retrieveContext(query: string) {
  if (vectorDB.length === 0) {
    return "No knowledge available yet.";
  }

  const res = await Ollama.embeddings({
    model: "nomic-embed-text",
    prompt: query,
  });

  return vectorDB
    .map((doc) => ({
      ...doc,
      score: cosine(res.embedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((doc) => `Title: ${doc.title}\n${doc.text}`)
    .join("\n\n");
}