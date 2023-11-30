import { apiClient, gptClient } from "../api";
import { ChatCompletionMessage } from "../api/types";

(async () => {
  const { token } = await apiClient.authorize("ownapipro");
  const task = await apiClient.getTask(token);

  console.log({ task });

  const answerResponse = await apiClient.answer(token, "ENDPOINT_HERE");

  console.log(answerResponse);
})();
