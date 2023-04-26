import { apiClient, gptClient } from "./api/index";

(async () => {
  const { token } = await apiClient.authorize("moderation");
  const { input } = await apiClient.getTask(token);

  const { results } = await gptClient.getModeration(input);

  const answer = results.map((result) => (result.flagged ? 1 : 0));

  const answerResponse = await apiClient.answer(token, answer);

  console.log(answerResponse);
})();
