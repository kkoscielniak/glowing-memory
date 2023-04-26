import { create, ApisauceInstance } from "apisauce";
import { CompletionResponse, ModerationResponse } from "./types";

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

  async getCompletion(prompt: string): Promise<CompletionResponse> {
    const { data, ok, originalError } = await this.api.post<CompletionResponse>(
      `/completions`,
      {
        model: "text-davinci-003",
        prompt,
      }
    );

    if (ok) {
      return data!;
    }

    throw originalError;
  }
}

export default new GptClient();
