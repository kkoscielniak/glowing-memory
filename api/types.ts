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
