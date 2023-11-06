import { apiClient } from "../api";

(async () => {
  const { token } = await apiClient.authorize("whisper");

  const answerResponse = await apiClient.answer(
    token,
    "Cześć! Kiedy ostatnio korzystaliście z sztucznej inteligencji, czy zastanawialiście się nad tym, skąd czerpie ona swoją wiedzę? No pewnie, że tak, inaczej nie byłoby was tutaj na szkoleniu. Ale czy przemyśleliście możliwość dostosowania tej wiedzy do waszych własnych, indywidualnych potrzeb?"
  );

  console.log(answerResponse);
})();
