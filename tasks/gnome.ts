import { apiClient } from "../api";

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY!,
});

async function getGnome(msg: string, imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: msg },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
}

(async () => {
  const { token } = await apiClient.authorize("gnome");
  const task = await apiClient.getTask(token);

  const { msg, url: imageUrl } = task;

  console.log(task);

  const answer = await getGnome(msg, imageUrl);

  console.log(answer);

  const answerResponse = await apiClient.answer(token, answer);
  console.log(answerResponse);
})();
