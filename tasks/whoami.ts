import { apiClient, gptClient } from "../api";

(async () => {
  const context: string[] = [];

  let weKnow = false;

  while (!weKnow) {
    const { token } = await apiClient.authorize("whoami");
    const { hint } = await apiClient.getTask(token);

    context.push(hint);

    const response = await gptClient.getCompletion(
      `
      Wskaż kim jest postać opisana m.in. tymi cechami.
      Jeżeli nie znasz odpowiedzi, zwróć {"answer":"idk"}. Jeżeli znasz odpowiedź, zwróć {"answer":"<imie nazwisko>"}.

      ###cechy
      ${context.join(", ")}
    `,
      {
        max_tokens: 2000,
      }
    );

    try {
      const { answer } = JSON.parse(response.choices[0].text);
      console.log({ hint, answer });

      if (answer !== "idk") {
        weKnow = true;
        const answerResponse = await apiClient.answer(token, answer);
        console.log(answerResponse);
      }
    } catch (err: any) {
      console.error(err);
    }
  }
})();
