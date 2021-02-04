const sample = [
  ["7 of Hearts", "5 of Diamonds", "5 of Spades", "9 of Hearts"],
  ["3 of Diamonds", "Jack of Diamonds", "King of Spades", "2 of Hearts"],
  ["5 of Clubs", "2 of Spades", "King of Diamonds", "9 of Diamonds"],
];

sample2 = [
  [
    "Queen of Hearts",
    "Ace of Hearts",
    "9 of Clubs",
    "King of Hearts",
    "6 of Hearts",
    "4 of Diamonds",
    "4 of Clubs",
    "10 of Spades",
    "9 of Hearts",
    "7 of Clubs",
    "3 of Clubs",
    "7 of Diamonds",
    "8 of Bitches"
  ],
];

sample3 = [
  "Queen of Hearts",
  "Ace of Hearts",
  "9 of Clubs",
  "King of Hearts",
  "6 of Hearts",
  "4 of Diamonds",
  "4 of Clubs",
  "10 of Spades",
  "9 of Hearts",
  "7 of Clubs",
  "3 of Clubs",
  "7 of Diamonds",
];

sample4 =
  "Player 1's Cards: Queen of Hearts, Ace of Hearts, 9 of Clubs, King of Hearts, 6 of Hearts, 4 of Diamonds, 4 of Clubs, 10 of Spades, 9 of Hearts, 7 of Clubs, 3 of Clubs, 7 of Diamonds\n";

const awsPostRoute = async (event) => {
  // exports.handler = async (event) => {
  // const pipList = event.join().split(",").length;
  // console.log(pipList)
  let previousCards;
  if (event instanceof Array) {
    console.log("you got an array");
    if (event[0] instanceof Array) {
      console.log("2d array");
      previousCards = [];
      for (const arr of event) {
        previousCards.push(...arr);
      }
    } else if (typeof event[0] === "string") {
      console.log("1d array");
      previousCards = event;
    }
  } else if (typeof event === "string") {
    console.log("you got a string");
  }
  const hand = new Map();
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

  const rejects = [];
  for (const card of previousCards) {
    const [pip, _, suit] = card.split(" ");
    if (PIP.includes(pip) && SUITS.includes(suit)) {
      if (!hand.get(card)) {
        hand.set(card, 1);
      } else if (hand.get(card) < totalDecks) {
        let amount = hand.get(card);
        hand.delete(card);
        hand.set(card, amount + 1);
      }
    } else {
      rejects.push(card);
    }
  }
  console.log(hand);
  console.log(rejects)
  // const response = {
  //     statusCode: 200,
  //     body: JSON.stringify('Hello from Lambda!'),
  // };
  // return response;
};

awsPostRoute(sample2);
