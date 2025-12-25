// utils/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Geminiの準備
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 埋め込み（ベクトル化）専用のモデルを指定します
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function generateEmbedding(text: string) {
  // 文章をGeminiに渡して、ベクトルに変換してもらいます
  const result = await model.embedContent(text);
  
  // 変換された数値（768個の数字の配列）を返します
  return result.embedding.values;
}