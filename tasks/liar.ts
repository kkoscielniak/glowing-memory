import { apiClient, httpClient } from "../api";

(async () => {
  const { token } = await apiClient.authorize("liar");

  const { answer: chatBotAnswer } = (await httpClient.postFormUrlencoded(
    `https://zadania.aidevs.pl/task/${token}`,
    {
      question: "Is Warsaw the capitol of Poland?",
    }
  )) as unknown as { answer: string };

  const yesNo = chatBotAnswer.indexOf("Warsaw") !== -1 ? "YES" : "NO";

  const answerResponse = await apiClient.answer(token, yesNo);
  console.log(answerResponse);
})();
