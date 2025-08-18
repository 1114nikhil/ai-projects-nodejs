import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { CreateEmbeddingResponse } from "openai/resources";
import OpenAI from "openai";

const openai = new OpenAI();
type Food = {
  name: string;
  description: string;
};

type FoodWithEmbeddings = Food & {
  embedding: number[];
};

const dotProduct = (a: number[], b: number[]) => {
  return a.reduce((acc, val, index) => acc + val * (b[index] ?? 0), 0);
};

// angle between vector
const cosineSimilarity = (a: number[], b: number[]) => {
  const dot = dotProduct(a, b);
  const normA = Math.sqrt(dotProduct(a, a));
  const normB = Math.sqrt(dotProduct(b, b));
  return dot / (normA * normB);
};
const generateEmbeddings = async (input: string | string[]) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
  });
  console.log(response.data);
  return response;
};

const loadInputJson = <T>(fileName: string): T => {
  const path = join(__dirname, fileName);
  const rawInputData = readFileSync(path);
  return JSON.parse(rawInputData.toString());
};

const saveEmbaddingToJson = (embedding: any, fileName: string) => {
  const embeddingStrings = JSON.stringify(embedding);
  const buffer = Buffer.from(embeddingStrings);
  const path = join(__dirname, fileName);
  writeFileSync(path, buffer);
  console.log(`Embedding file save to ${path}`);
};

const data = loadInputJson<Food[]>("food.json");

console.log("What food do you like?");

process.stdin.addListener("data", async (input) => {
  let userInput = input.toString().trim();
  await recomendFoods(userInput);
});

const recomendFoods = async (input: string) => {
  const embedding = await generateEmbeddings(input);

  const foodWithEmbeddings = await getFoodEmbeddings();

  const similarities = foodWithEmbeddings.map((food) => ({
    input: food.name,
    similarity: cosineSimilarity(food.embedding, embedding.data[0]!.embedding),
  }));
  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarity - a.similarity
  );
  console.log(`Recommended foods based on ${input}`);
  console.log(sortedSimilarities);
};
const getFoodEmbeddings = async () => {
  const fileName = "foodEmbeddings.json";
  const filePath = join(__dirname, fileName);
  if (existsSync(filePath)) {
    const descriptionEmbeddings = loadInputJson<FoodWithEmbeddings[]>(fileName);
    return descriptionEmbeddings;
  } else {
    const descriptionEmbeddings = await generateEmbeddings(
      data.map((food) => food.description)
    );
    const foodWithEmbeddings: FoodWithEmbeddings[] = data.map((food, i) => ({
      ...food,
      embedding: descriptionEmbeddings.data[i]!.embedding,
    }));
    saveEmbaddingToJson(foodWithEmbeddings, fileName);
    return foodWithEmbeddings;
  }
};
