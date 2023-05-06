import { apiClient, gptClient } from "../api";
import { ChatCompletionMessage } from "../api/types";

const messages: ChatCompletionMessage[] = [];
const answers: string[] = [];

const x = [
  "Pizza to jedno z najpopularniejszych dań na całym świecie, a jej historia sięga aż do starożytnego Rzymu. Pierwsze wzmianki o podobnym daniu do pizzy pochodzą z III wieku p.n.e., a przyrządzano je z ciasta z mąki, wody i soli, które następnie pieczono na rozgrzanych kamieniach. Wraz z upływem czasu i rozwojem kuchni włoskiej pizza zyskała różnorodne warianty, a jej popularność wciąż rośnie.\n" +
    "\n" +
    "Rozwój pizzy w Polsce\n" +
    "\n" +
    "W Polsce pizza zaczęła zyskiwać na popularności dopiero w latach 90. XX wieku, kiedy to na naszym rynku pojawiły się pierwsze restauracje specjalizujące się w tym daniu. Obecnie w Polsce działa już wiele sieciowych i lokalnych pizzerii, które oferują różnorodne warianty pizzy.\n" +
    "\n" +
    "Najpopularniejsze rodzaje pizzy\n" +
    "\n" +
    "Włoska pizza to danie bardzo uniwersalne, które można przygotować na wiele sposobów. W zależności od regionu Włoch, w którym jest przygotowywana, różni się składnikami i sposobem przyrządzenia. Najbardziej znane rodzaje pizzy to margherita, capricciosa, quattro formaggi, diavola czy marinara. W pizzeriach można także zamawiać pizze na dowóz lub zabrać je na wynos.\n" +
    "\n" +
    "Pizza wegetariańska i dla wegan\n" +
    "\n" +
    "Coraz więcej osób decyduje się na dietę wegetariańską lub wegańską, dlatego też coraz więcej pizzerii oferuje w swoim menu pizzę z samymi warzywami lub z dodatkiem mleka roślinnego. W ten sposób każdy może znaleźć dla siebie odpowiedni wariant pizzy.\n" +
    "\n" +
    "Podsumowanie\n" +
    "\n" +
    "Pizza to danie, które zyskało sobie wielu miłośników na całym świecie, a jej historia sięga starożytności. W Polsce pizza zaczęła zyskiwać na popularności w latach 90. XX wieku, a obecnie jest jednym z najchętniej zamawianych dań w pizzeriach. Dzięki różnorodności składników każdy może znaleźć dla siebie odpowiedni wariant pizzy, a wegetarianie i weganie także mają wiele opcji do wyboru.",
  "Klasyczna włoska pizza składa się z kilku podstawowych składników: ciasta, sosu pomidorowego, sera mozzarella oraz dodatków. Oto lista niezbędnych składników, które należy przygotować przed rozpoczęciem wypieku pizzy:\n" +
    "\n" +
    "1. Ciasto - do przygotowania ciasta potrzebne będą mąka, woda, drożdże, sól oraz oliwa z oliwek. Ciasto powinno być elastyczne i miękkie.\n" +
    "\n" +
    "2. Sos pomidorowy - podstawowy sos do pizzy, który można przygotować z pomidorów, cebuli, czosnku, oliwy z oliwek, soli i pieprzu. Sos powinien być gęsty i dobrze zmielony.\n" +
    "\n" +
    "3. Ser mozzarella - to najważniejszy składnik pizzy. Ser ten powinien być świeży i dobrze odsączony z wody.\n" +
    "\n" +
    "4. Dodatki - w zależności od preferencji, na pizzę można dodać wiele różnych składników, takich jak: pieczarki, cebula, papryka, szynka, kiełbasa, owoce morza, oliwki, ananas, rukola, suszone pomidory, salami, boczek, ser feta, ser żółty, kurczak, krewetki, tuńczyk, kapary, jajko czy suszone zioła.\n" +
    "\n" +
    "Dodatkowo do wypieku pizzy przydatne będą narzędzia takie jak: blacha do pieczenia, papier do pieczenia, wałek do ciasta, nożyczki kuchenne, łyżka do nakładania sosu, łyżka do nakładania dodatków oraz piekarnik nagrzany do temperatury 220-250 stopni Celsiusza.",

  "Robienie pizzy w domu może być świetnym sposobem na spędzenie czasu z rodziną lub przyjaciółmi. Przygotowanie pizzy w domu jest łatwe i zabawne, a do tego pozwala na stworzenie własnej, unikalnej wersji tego przysmaku. Oto krok po kroku jak przygotować pyszną pizzę w domu.\n" +
    "\n" +
    "1. Przygotowanie ciasta: Do miski wsypujemy 500g mąki, dajemy 1,5 łyżeczki soli, 1,5 łyżeczki cukru i 1,5 łyżeczki suchych drożdży. Wlewamy 300 ml ciepłej wody oraz 3 łyżki oliwy z oliwek i mieszamy wszystko ręką lub mikserem z hakiem przez około 10 minut, aż ciasto będzie gładkie i elastyczne. Odstawiamy w ciepłym miejscu do wyrośnięcia przez około 1 godzinę.\n" +
    "\n" +
    "2. Przygotowanie sosu: Do rondla wrzucamy puszki pomidorów, cebulę, czosnek, sól, pieprz, łyżkę cukru, łyżkę oliwy z oliwek i gotujemy na wolnym ogniu przez około 30 minut, aż sos zgęstnieje.\n" +
    "\n" +
    "3. Przygotowanie dodatków: Kroi się dodatki na małe kawałki, np. pieczarki, cebulę, paprykę, szynkę, boczek itp.\n" +
    "\n" +
    "4. Włączenie piekarnika: Piekarnik należy włączyć na 220-250 stopni Celsjusza z funkcją góra-dół.\n" +
    "\n" +
    "5. Przygotowanie blachy: Blachę do pieczenia należy posmarować oliwą z oliwek lub wyłożyć papierem do pieczenia.\n" +
    "\n" +
    "6. Rozwałkowanie ciasta: Rozwałkowujemy ciasto na stolnicy, a na koniec przenosimy je na blachę.\n" +
    "\n" +
    "7. Nakładanie sosu i dodatków: Na ciasto nakładamy sos, równomiernie rozprowadzając go na całej powierzchni. Następnie dodajemy wybrane składniki.\n" +
    "\n" +
    "8. Pieczenie pizzy: Blachę z pizzą wkładamy do piekarnika i pieczemy przez około 15-20 minut, aż pizza będzie dobrze wypieczona.\n" +
    "\n" +
    "9. Podanie pizzy: Po upieczeniu pizzy, wyjmujemy ją z piekarnika, kroimy na kawałki i podajemy na gorąco.\n" +
    "\n" +
    "Teraz możemy cieszyć się pyszną, domową pizzą!",
];

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
