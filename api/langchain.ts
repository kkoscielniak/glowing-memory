import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const embeddings = new OpenAIEmbeddings({
  maxConcurrency: 5,
  openAIApiKey: process.env.GPT_API_KEY,
});
