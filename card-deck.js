// converts card string to score
const pipToScore = (pip, aceVal) => {
  let score = 0;
  if (pip.length > 2 && pip !== "Ace") {
    score += 10;
  } else if (pip === "Ace") {
    score += aceVal;
  } else {
    score += parseInt(pip);
  }
  return score;
};

exports.handler = async (event) => {
  try {
    let hand_size;
    let total_hands;
    let total_decks;
    let aces = "high";
    if (event.queryStringParameters) {
      hand_size = event.queryStringParameters.hand_size;
      total_hands = event.queryStringParameters.total_hands || "1";
      total_decks = event.queryStringParameters.total_decks || "1";
      aces = event.queryStringParameters.aces;
    }
    const handSize = parseInt(hand_size);
    const totalHands = parseInt(total_hands);
    const totalDecks = parseInt(total_decks);
    const aceValue = aces === "low" ? 1 : 11;
    if (!hand_size) {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: null,
          message: "Missing query parameter 'hand_size'",
        })
      );
    }
    if (handSize < 1 || handSize > 52 || isNaN(handSize)) {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: null,
          message: "Invalid hand size. Must be between one 1 and 52",
        })
      );
    }
    if (totalHands < 1 || isNaN(totalHands)) {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: null,
          message: "Invalid number of hands",
        })
      );
    }
    if (totalDecks < 1 || totalDecks > 8 || isNaN(totalDecks)) {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: null,
          message: "Invalid number of decks. Must be between one 1 and 8",
        })
      );
    }
    if (handSize * totalHands > totalDecks * 52) {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: null,
          message: `Not enough cards in ${
            totalDecks > 1 ? `${totalDecks} decks` : "the deck"
          } (${
            totalDecks * 52
          } cards) to deal ${hand_size} cards for ${total_hands} players.`,
        })
      );
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
    const scores = [];
    let totalScore = 0;
    const acesByHand = [];
    const hand = new Map();
    let allHandsStr = "";
    for (let i = 0; i < totalHands; i++) {
      let card = "";
      let score = 0;
      let aceCount = 0;
      const playerHand = [];
      while (playerHand.length < handSize) {
        let randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
        let randomPip = PIP[Math.floor(Math.random() * PIP.length)];
        card = `${randomPip} of ${randomSuit}`;
        if (!hand.get(card)) {
          hand.set(card, 1);
          playerHand.push(card);
          let currScore = pipToScore(randomPip, aceValue);
          score += currScore;
          totalScore += currScore;
          if (randomPip === "Ace") {
            aceCount++;
          }
        } else if (hand.get(card) < totalDecks) {
          console.log(`${card}`);
          let amount = hand.get(card);
          hand.delete(card);
          hand.set(card, amount + 1);
          playerHand.push(card);
          let currScore = pipToScore(randomPip, aceValue);
          score += currScore;
          totalScore += currScore;
          if (randomPip === "Ace") {
            aceCount++;
          }
        }
      }
      allHands.push(playerHand);
      allHandsStr += `Player ${i + 1}'s Cards: ${playerHand.join(", ")}\n`;
      scores.push(score);
      acesByHand.push(aceCount);
    }
    const cardHand = {
      asString: allHandsStr,
      asArray: allHands,
      scores: {
        total: totalScore,
        byHand: scores,
        acesByHand,
      },
    };
    return sendRes(
      200,
      JSON.stringify({
        success: true,
        hand: cardHand,
        message: `${
          totalDecks > 1 ? `${totalDecks} decks` : "1 deck"
        }. ${total_hands} hand${
          total_hands > 1 ? "s" : ""
        }. ${hand_size} cards delt${total_hands > 1 ? " per hand." : "."}`,
      })
    );
  } catch (err) {
    console.log(err);
    return sendRes(500, {
      success: false,
      hand: null,
      message: "Looks like the server was delt a bad hand",
    });
  }
};

const sendRes = (status, body) => {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "X-Requested-With": "*",
    },
    body: body,
  };
};
