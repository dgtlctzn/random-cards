exports.handler = async (event) => {
  try {
    let hand_size;
    let total_hands;
    if (event.queryStringParameters) {
      hand_size = event.queryStringParameters.hand_size;
      total_hands = event.queryStringParameters.total_hands || 1;
    }
    if (!hand_size) {
      const errResponse = {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          hand: null,
          message: "Missing query parameter 'hand_size'",
        }),
      };
      return errResponse;
    }
    const handSize = parseInt(hand_size);
    const totalHands = parseInt(total_hands);
    if (handSize < 1 || handSize > 52) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          hand: null,
          message: "Invalid hand size. Must be between one 1 and 52",
        }),
      };
      return response;
    }
    if (handSize * totalHands > 52) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          hand: null,
          message: `Not enough cards in the deck (52 cards) to deal ${hand_size} cards for ${total_hands} players.`,
        }),
      };
      return response;
    }
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
    let allHandsStr = "";
    for (let i = 0; i < totalHands; i++) {
      const hand = [];
      let card = "";
      while (hand.length < handSize) {
        let randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
        let randomPip = PIP[Math.floor(Math.random() * PIP.length)];
        card = `${randomPip} of ${randomSuit}`;
        if (!hand.includes(card)) {
          hand.push(card);
        }
      }
      allHands.push(hand);
      allHandsStr += `Player ${i + 1}'s Cards: ${hand.join(", ")}\n`;
    }
    const cardHand = {
      asString: allHandsStr,
      asArray: allHands,
    };
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        hand: cardHand,
        message: `${total_hands} hand${
          total_hands > 1 ? "s" : ""
        }. ${hand_size} cards delt${total_hands > 1 ? " per hand." : "."}`,
      }),
    };
    return response;
  } catch (err) {
    console.log(err);
    const response = {
      statusCode: 500,
      body: null,
    };
    return response;
  }
};
