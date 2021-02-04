exports.handler = async (event) => {
  // access POST body details
  const found = JSON.parse(event.queryStringParameters.previous_cards);
  const hand_size = event.queryStringParameters.hand_size;
  const total_hands = event.queryStringParameters.total_hands || "1";
  const total_decks = event.queryStringParameters.total_decks || "1";

  const handSize = parseInt(hand_size);
  const totalHands = parseInt(total_hands);
  const totalDecks = parseInt(total_decks);

  if (!hand_size) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        hand: null,
        message: "Missing 'hand_size'. Include size as string (ie. '5')",
      }),
      headers: {
        "content-type": "application/json",
      },
    };
  }

  // detect format of 'previous_cards' parameter
  let previousCards;
  if (found instanceof Array) {
    if (found.length && found[0] instanceof Array) {
      previousCards = [];
      for (const arr of found) {
        previousCards.push(...arr);
      }
    } else if (found.length && typeof found[0] === "string") {
      previousCards = found;
    }
  } else if (typeof found === "string") {
    const found = found.trim("\n").replace(/\n/g, ", ").split(", ");
    previousCards = found.map((card) => {
      if (card.length > 16) {
        return card.split("Cards: ")[1];
      } else {
        return card;
      }
    });
  }

  // limits on how many cards are still available in deck
  if (handSize * totalHands > totalDecks * 52 - previousCards.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        hand: null,
        message: `Not enough cards in ${
          totalDecks > 1 ? `${totalDecks} decks` : "the deck"
        } (${
          totalDecks * 52
        } cards minus ${previousCards.length} previously delt cards) to deal ${hand_size} cards for ${total_hands} players.`,
      }),
      headers: {
        "content-type": "application/json",
      },
    };
  }

  // CONSTANTS
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

  // sets up Map and adds previous cards
  // rejects added to separate array
  const hand = new Map();
  const rejects = [];
  for (const card of previousCards) {
    const [pip, _, suit] = card.split(" ");
    if (PIP.includes(pip) && SUITS.includes(suit)) {
      if (!hand.get(card)) {
        hand.set(card, 1);
      } else {
        let amount = hand.get(card);
        hand.delete(card);
        hand.set(card, amount + 1);
      }
    } else {
      rejects.push(card);
    }
  }

  // main card generation
  const allHands = [];
  let allHandsStr = "";
  for (let i = 0; i < totalHands; i++) {
    let card = "";
    const playerHand = [];
    while (playerHand.length < handSize) {
      let randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
      let randomPip = PIP[Math.floor(Math.random() * PIP.length)];
      card = `${randomPip} of ${randomSuit}`;
      if (!hand.get(card)) {
        hand.set(card, 1);
        playerHand.push(card);
      } else if (hand.get(card) < totalDecks) {
        console.log(`${card}`);
        let amount = hand.get(card);
        hand.delete(card);
        hand.set(card, amount + 1);
        playerHand.push(card);
      }
    }
    allHands.push(playerHand);
    allHandsStr += `Player ${i + 1}'s Cards: ${playerHand.join(", ")}\n`;
  }

  // format response
  const cardHand = {
    asString: allHandsStr,
    asArray: allHands,
    rejects: rejects,
  };
  // sample reponse
  const sampleRes = [];
  for (const curr of hand.keys()) {
    sampleRes.push(curr);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(cardHand),
    headers: {
      "content-type": "application/json",
    },
  };
  return response;
};
