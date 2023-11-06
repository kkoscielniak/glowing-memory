import { create, ApisauceInstance } from "apisauce";
import {
  ChatCompletionMessage,
  ChatCompletionResponse,
  CompletionResponse,
  ModerationResponse,
} from "./types";

class GptClient {
  private readonly api: ApisauceInstance;

  constructor() {
    this.api = create({
      baseURL: "https://api.openai.com/v1",
      headers: {
        Authorization: `Bearer ${process.env.GPT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getModeration(input: string | string[]): Promise<ModerationResponse> {
    const { data, ok, originalError } = await this.api.post<ModerationResponse>(
      `/moderations`,
      {
        input,
        model: "text-moderation-latest",
      }
    );

    if (ok) {
      return data!;
    }

    throw originalError;
  }

  async getCompletion(
    prompt: string,
    options?: any
  ): Promise<CompletionResponse> {
    const { data, ok, originalError } = await this.api.post<CompletionResponse>(
      `/completions`,
      {
        model: "text-davinci-003",
        prompt,
        ...options,
      }
    );

    if (ok) {
      return data!;
    }

    throw new Error(originalError.message);
  }

  async getChatCompletion(
    messages: ChatCompletionMessage[],
    temperature?: number
  ): Promise<ChatCompletionResponse> {
    const { data, ok, originalError } =
      await this.api.post<ChatCompletionResponse>(`/chat/completions`, {
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: temperature || 0.7,
      });

    if (ok) {
      return data!;
    }

    console.error(originalError.response?.data);

    throw originalError;
  }

  async getEmbedding(input: string | string[]): Promise<unknown> {
    const { data, ok, originalError } = await this.api.post<unknown>(
      `/embeddings`,
      {
        input,
        model: "text-embedding-ada-002",
      }
    );

    if (ok) {
      return data!;
    }

    throw originalError;
  }
}

export default new GptClient();
