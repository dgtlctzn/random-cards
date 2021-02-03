exports.handler = async (event) => {
  try {
    let hand_size;
    let total_hands;
    let total_decks;
    if (event.queryStringParameters) {
      hand_size = event.queryStringParameters.hand_size;
      total_hands = event.queryStringParameters.total_hands || "1";
      total_decks = event.queryStringParameters.total_decks || "1";
    }
    const handSize = parseInt(hand_size);
    const totalHands = parseInt(total_hands);
    const totalDecks = parseInt(total_decks);
    if (!hand_size) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          hand: null,
          message: "Missing query parameter 'hand_size'",
        }),
      };
    }
    if (handSize < 1 || handSize > 52) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          hand: null,
          message: "Invalid hand size. Must be between one 1 and 52",
        }),
      };
    }
    if (totalDecks > 8) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          hand: null,
          message: "Invalid number of decks. Must be between one 1 and 8",
        }),
      };
    }
    if (handSize * totalHands > totalDecks * 52) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          hand: null,
          message: `Not enough cards in ${
            total_decks > 1 ? `${total_decks} decks` : "the deck"
          } (${
            totalDecks * 52
          } cards) to deal ${hand_size} cards for ${total_hands} players.`,
        }),
      };
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
    const hand = new Map();
    let allHandsStr = "";
    for (let i = 0; i < totalHands; i++) {
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
    const cardHand = {
      asString: allHandsStr,
      asArray: allHands,
    };
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        hand: cardHand,
        message: `${total_hands} hand${
          total_hands > 1 ? "s" : ""
        }. ${hand_size} cards delt${total_hands > 1 ? " per hand." : "."}`,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: null,
    };
  }
};
