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
const totalDecks = 1;

const allHands = [];
const hand = new Map();
let allHandsStr = "";
for (let i = 0; i < 5; i++) {
  let card = "";
  const playerHand = [];
  while (playerHand.length < 10) {
    let randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
    let randomPip = PIP[Math.floor(Math.random() * PIP.length)];
    card = `${randomPip} of ${randomSuit}`;
    if (!hand.get(card)) {
      hand.set(card, 1);
      playerHand.push(card);
    } else if (hand.get(card) < totalDecks) {
      console.log(`${card}`)
      let amount = hand.get(card);
      hand.delete(card);
      hand.set(card, amount + 1)
      playerHand.push(card);
    }
  }
  allHands.push(playerHand);
  allHandsStr += `Player ${i + 1}'s Cards: ${playerHand.join(", ")}\n`;
}
// const found = [];
// for (const currHand of allHands) {
//     for (const card of currHand) {
//         found.push(card);
//     }
// }
// console.log(found.length);
// const mySet = new Set(found);
// console.log(mySet.size);
// console.log(allHands)
console.log(hand)
console.log(allHandsStr)