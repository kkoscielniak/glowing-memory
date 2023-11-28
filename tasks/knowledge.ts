import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { apiClient } from "../api";

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY!,
});

type CurrencyData = {
  rates: {
    mid: number;
  }[];
};

type CountryData = {
  population: 37950802;
}[];

async function chooseTool(question: string): Promise<{
  toolName: string;
  parameter: string;
}> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: question,
    },
  ];

  const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "pick_tool",
        description:
          "Na podstawie pytania oceń jakiego narzędzia powinienem użyć aby otrzymać odpowiedź i z jakimi parametrami.",
        parameters: {
          type: "object",
          properties: {
            toolName: {
              type: "string",
              description:
                "Nazwa narzędzia do użycia\n\ne.g. dla pytań o konkretne państwo: `countries`\ndla pytań o walutę: `currency`\n dla pozostałych pytań: `general`",
            },
            parameter: {
              type: "string",
              description:
                "Nazwa parametru dla wybranego narzędzia\n\ne.g. dla pytań o państwo jest to pełna nazwa tego Państwa po angielsku (e.g. `Poland`)\ndla pytań o walutę kod waluty w formacie ISO 4217 (currency code)",
            },
          },
          required: ["toolName", "properties"],
        },
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages,
    tools,
    tool_choice: "auto",
  });
  const responseMessage = response.choices[0].message;

  const toolCalls = responseMessage.tool_calls;

  let answer;

  if (toolCalls) {
    for (const toolCall of toolCalls) {
      const { name: functionName } = toolCall.function;

      if (functionName === "pick_tool") {
        answer = JSON.parse(toolCall.function.arguments);
      }
    }
  }

  return answer;
}

async function getExchangeRage(currencyCode: string): Promise<CurrencyData> {
  const response = await fetch(
    `http://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}`
  );

  return response.json() as unknown as CurrencyData;
}

async function getCountryData(country: string): Promise<CountryData> {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${country}?fullText=true`
  );

  return response.json() as unknown as CountryData;
}

(async () => {
  const { token } = await apiClient.authorize("knowledge");
  const task = await apiClient.getTask(token);

  console.log(task);

  const tool = await chooseTool(task.question);
  console.log(tool);

  let answer;

  if (tool.toolName === "currency") {
    const currencyData = await getExchangeRage(tool.parameter);

    answer = currencyData.rates[0].mid;
  } else if (tool.toolName === "countries") {
    const countryData = await getCountryData(tool.parameter);

    answer = countryData[0].population;
  }

  console.log(answer);

  if (!answer) {
    console.log("Omitting the general knowledge for now. No time, sorry. :(");
    process.exit(1);
  }

  const answerResponse = await apiClient.answer(token, answer);
  console.log(answerResponse);
})();
