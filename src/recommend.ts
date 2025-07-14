import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "langchain/document";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// ✅ Product & Review Types
type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
  reason?: string; // ✅ Optional reason from LLM
};

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

// ✅ Load and parse product data
const rawData = fs.readFileSync(path.join(__dirname, "./products.json"), "utf-8");
const productData = JSON.parse(rawData);

const products: Product[] = productData.products.map((p: any) => ({
  brand: p.brand ?? "",
  id: p.id,
  title: p.title,
  description: p.description,
  category: p.category,
  price: p.price,
  discountPercentage: p.discountPercentage,
  rating: p.rating,
  stock: p.stock,
  tags: p.tags,
  sku: p.sku,
  weight: p.weight,
  dimensions: p.dimensions,
  warrantyInformation: p.warrantyInformation,
  shippingInformation: p.shippingInformation,
  availabilityStatus: p.availabilityStatus,
  reviews: p.reviews,
  returnPolicy: p.returnPolicy,
  minimumOrderQuantity: p.minimumOrderQuantity,
  meta: p.meta,
  images: p.images,
  thumbnail: p.thumbnail,
}));

// ✅ Setup vector store
let vectorStore: MemoryVectorStore;

async function setupVectorStore() {
  const docs = products.map(
    (product) =>
      new Document({
        pageContent: `${product.title}. ${product.description}. Price: $${product.price}`,
        metadata: { ...product },
      })
  );

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
}

setupVectorStore();

// ✅ Gemini LLM setup
export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-001",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
  maxRetries: 3,
});

// ✅ Main function to get recommendations
export async function getRecommendations(userQuery: string): Promise<Product[]> {
  if (!vectorStore) {
    throw new Error("Recommendation system is still initializing. Please try again shortly.");
  }

  const relevantDocs = await vectorStore.similaritySearch(userQuery, 5);

  if (relevantDocs.length === 0) {
    return [];
  }

  const context = relevantDocs
    .map(
      (doc) =>
        `Title: ${doc.metadata.title}\nDescription: ${doc.metadata.description}\nPrice: $${doc.metadata.price}\n`
    )
    .join("\n");
const prompt = `
You are a product recommendation assistant.

User query: "${userQuery}"

Here are some products:
${context}

Please recommend the top 3 products that best match the user's query.
Respond ONLY in raw JSON format (no markdown, no explanation, no extra text):

[
  {
    "title": "Product Title",
    "reason": "Why you're recommending it"
  }
]
`;



  const response = await llm.invoke(prompt);

  // ✅ Normalize Gemini response to string
  let content: string;
  if (typeof response.content === "string") {
    content = response.content;
  } else if (Array.isArray(response.content)) {
    content = response.content.map((c: any) => (typeof c === "string" ? c : c.text ?? "")).join("\n");
  } else if (typeof response.content === "object" && response.content !== null && "text" in response.content) {
    content = (response.content as any).text;
  } else {
    content = JSON.stringify(response.content);
  }

  // ✅ Parse LLM JSON response
  let parsed: { title: string; reason: string }[] = [];
 try {
  // Extract JSON from markdown code block if present
 const jsonMatch = content.match(/```json\n([\s\S]*?)```/i);
  const jsonString = jsonMatch ? jsonMatch[1] : content;

  parsed = JSON.parse(jsonString);
} catch (err) {
  console.error("❌ Failed to parse LLM response as JSON:", err);
  console.error("Raw content:", content);
  return [];
}

  
  const matchedProducts: Product[] = [];

  for (const rec of parsed) {
    const match = products.find(
  (p) =>
    rec.title.toLowerCase().includes(p.title.toLowerCase()) ||
    p.title.toLowerCase().includes(rec.title.toLowerCase())
);
    if (match) {
      matchedProducts.push({ ...match, reason: rec.reason });
    }
  }

  return matchedProducts;
}
