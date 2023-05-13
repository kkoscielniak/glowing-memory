import { apiClient, gptClient, httpClient } from "../api";

(async () => {
  const { token } = await apiClient.authorize("scraper");
  const task = await apiClient.getTask(token);
  const { msg, question } = task;

  try {
    const context = await httpClient.get(task.input as string);

    const response = await gptClient.getCompletion(
      `
      ${msg}
      ### Article
      ${context}
      ###
      Question: ${question}
    `,
      {
        max_tokens: 2000,
      }
    );

    const answer = response.choices[0].text;

    if (answer.length > 200) {
      throw new Error("Answer is too long");
    }

    const answerResponse = await apiClient.answer(token, answer);
    console.log(answerResponse);
  } catch (err: any) {
    console.error(err);
  }
})();
