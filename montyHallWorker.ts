declare var self: Worker;

self.onmessage = function (
  e: MessageEvent<{ switchDoor: boolean; iterations: number }>
) {
  const { switchDoor, iterations } = e.data;
  let wins = 0;

  for (let i = 0; i < iterations; i++) {
    const carBehind = Math.floor(Math.random() * 3);
    const playerChoice = Math.floor(Math.random() * 3);
    const won = switchDoor
      ? playerChoice !== carBehind
      : playerChoice === carBehind;
    if (won) wins++;
  }

  self.postMessage(wins);
};
