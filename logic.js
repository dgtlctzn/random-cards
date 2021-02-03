const SUITS = ["Hearts", "Diamonds", "Spades", "Clubs"];
const PIP = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
  "Ace",
];

const allHands = [];
const hand = [];
let allHandsStr = "";
for (let i = 0; i < 10; i++) {
  let card = "";
  const playerHand = [];
  let i = 0;
  while (playerHand.length < 5) {
    let randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
    let randomPip = PIP[Math.floor(Math.random() * PIP.length)];
    card = `${randomPip} of ${randomSuit}`;
    if (!hand.includes(card)) {
      hand.push(card);
      playerHand.push(card)
    }
  }
  allHands.push(playerHand);
  allHandsStr += `Player ${i + 1}'s Cards: ${hand.join(", ")}\n`;
}
const found = [];
for (const currHand of allHands) {
    for (const card of currHand) {
        found.push(card);
    }
}
console.log(found.length);
const mySet = new Set(found);
console.log(mySet.size);