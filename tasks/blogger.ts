import { apiClient, gptClient } from "../api";
import { ChatCompletionMessage } from "../api/types";

const messages: ChatCompletionMessage[] = [];
const answers: string[] = [];

(async () => {
  const { token } = await apiClient.authorize("blogger");
  const { msg, blog } = await apiClient.getTask(token);

  const blogMessages = (blog! as unknown as string[]).map(
    (message: string) => ({
      role: "user",
      content: message,
    })
  ) as ChatCompletionMessage[];

  messages.push({
    role: "system",
    content: `You are a blogger's assistant. ${msg} in Polish`,
  });

  for (const [index, message] of blogMessages.entries()) {
    messages.push(message);

    console.log({ iteration: index, messages });

    const chatResponse = await gptClient.getChatCompletion(messages);

    const answer = chatResponse.choices[0]
      .message as unknown as ChatCompletionMessage;

    messages.push(answer);
    answers.push(answer.content);
  }

  const answerResponse = await apiClient.answer(token, answers);

  console.log(answerResponse);
})();
