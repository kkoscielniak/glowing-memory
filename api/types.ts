export type AuthorizeResponse = {
  code: number;
  message: string;
  token: string;
};

export type TaskResponse = {
  code: number;
  msg: string;
  input: string | string[];
  question?: string;
  blog?: string;
};

type ModerationResult = {
  flagged: boolean;
  categories: object;
  category_scores: object;
};

export type ModerationResponse = {
  id: string;
  model: string;
  results: ModerationResult[];
};

export type CompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: any;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionAssistantMessage = {
  index: number;
  message: string;
  finish_reason: string;
  // logprobs: any;
};

export type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionAssistantMessage[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};
