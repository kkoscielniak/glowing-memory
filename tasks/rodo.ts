import { apiClient } from "../api";

(async () => {
  const { token } = await apiClient.authorize("rodo");
  const taskResponse = await apiClient.getTask(token);

  console.log(taskResponse);

  const answerResponse = await apiClient.answer(
    token,
    `Tell me about yourself but replace your sensitive data with placeholders %imie%, %nazwisko%, %zawod%, %miasto%`
  );
  console.log(answerResponse);
})();
