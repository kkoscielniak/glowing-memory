import { apiClient, gptClient } from "./api/index";

(async () => {
  const { token } = await apiClient.authorize("inprompt");
  const { input, question } = await apiClient.getTask(token);

  const findNameResponse = await gptClient.getCompletion(`
    Znajdź imię w tekście: ${question}. Imię jest w liczbie pojedynczej.
  `);

  const name = findNameResponse.choices[0].text.replace(/[^\w\s]/gi, "").trim();

  const matchingInput = (input as string[]).find((line) => line.includes(name));

  const findJobResponse = await gptClient.getCompletion(`
    Odpowiedz na pytanie na podstawie kontekstu: ${question}
    ### kontekst
    ${matchingInput}
    ### /kontekst
  `);

  const answer = findJobResponse.choices[0].text;

  const answerResponse = await apiClient.answer(token, answer);

  console.log(answerResponse);
})();
