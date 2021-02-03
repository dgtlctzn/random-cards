exports.handler = async (event) => {
  try {
    const { hand_size } = event.queryStringParameters;
    if (!hand_size) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          hand: null,
          message: 'Missing query parameter "hand_size"',
        }),
      };
      return response;
    }
    const handSize = parseInt(hand_size);
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
    const cardHand = {
      asString: `Your cards: ${hand.join(", ")}`,
      asArray: hand,
    };
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        hand: cardHand,
        message: `${hand_size} cards delt`,
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
