import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { apiClient } from "../api";

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY!,
});

type ToolData = {
  tool: "ToDo" | "Calendar";
  desc: string;
  date?: string;
};

async function pickTool(description: string): Promise<ToolData> {
  const today = new Date().toISOString().split("T")[0];

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a personal assistant. You are helping your boss to organize his life.

        Today is ${today}
        `,
    },
    {
      role: "user",
      content: description,
    },
  ];

  const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "pick_tool",
        description: `
          Zwraca informację jakiego narzędzia potrzebuje użytkownik aby wykonać daną czynność, np. 

          - "pojutrze kupić 1kg ziemniaków" -> narzędzie "Calendar", 
          - "zadzwonić do mamy" -> narzędzie "ToDo" 
          - "zrobić zakupy" -> narzędzie "ToDo"
          - "zrobić zakupy w poniedziałek" -> narzędzie "Calendar"
          `,
        parameters: {
          type: "object",
          properties: {
            tool: {
              type: "string",
              description:
                "Zwraca informację czy prośba użytkownika wymaga użycia narzędzia ToDo czy Calendar.",
              enum: ["ToDo", "Calendar"],
            },
            desc: {
              type: "string",
              description:
                "Zwraca informację na temat tego co użytkownik chce zrobić (tj. jaką informację zapisać w wybranym narzędziu).",
            },
            date: {
              type: "string",
              description:
                "Zwraca informację na temat daty w formacie YYYY-MM-DD, jeśli została podana przez użytkownika.",
            },
          },
          required: ["tool", "desc"],
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
  const { tool_calls: calls } = responseMessage;

  let toolData: ToolData;

  if (calls) {
    for (const call of calls) {
      const { name: functionName } = call.function;

      if (functionName === "pick_tool") {
        toolData = JSON.parse(call.function.arguments) as ToolData;
      }
    }
  }

  return toolData!;
}

(async () => {
  const { token } = await apiClient.authorize("tools");
  const task = await apiClient.getTask(token);

  console.log(task);

  const answer = await pickTool(task.question);

  console.log(answer);

  const answerResponse = await apiClient.answer(token, answer);
  console.log(answerResponse);
})();
