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
    // access POST body details
    const postBody = JSON.parse(event.body);
    const found = postBody.previous_cards;
    const hand_size = postBody.hand_size;
    const total_hands = postBody.total_hands || 1;
    const total_decks = postBody.total_decks || 1;
    const aces = postBody.aces || "high";

    const handSize = parseInt(hand_size);
    const totalHands = parseInt(total_hands);
    const totalDecks = parseInt(total_decks);
    const aceValue = aces === "low" ? 1 : 11;

    // basic error handling for post body parameters
    if (!handSize) {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: null,
          message: "Missing 'hand_size'. Specify a number from 1 to 52",
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
    } else {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: null,
          message:
            "'previous_cards' must be an array of strings or an array of arrays of strings",
        })
      );
    }
    //   else if (typeof found === "string") {
    //       const foundArr = found.trim("\n").replace(/\n/g, ", ").split(", ");
    //       return foundArr;
    //       previousCards = foundArr.map((card) => {
    //           if (card.length > 16) {
    //               return card.split("Cards: ")[1];
    //           }
    //           else {
    //               return card;
    //           }
    //       });
    //   }

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

    // if no cards detected in 'previous_cards' send error message
    if (!hand.size) {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: {
            rejects,
          },
          message: "No previous cards detected. Use GET route for a new hand",
        })
      );
    }

    // limits on how many cards are still available in deck
    if (handSize * totalHands > totalDecks * 52 - hand.size) {
      return sendRes(
        400,
        JSON.stringify({
          success: false,
          hand: null,
          message: `Not enough cards in ${
            totalDecks > 1 ? `${totalDecks} decks` : "the deck"
          } (${totalDecks * 52} cards minus ${
            hand.size
          } previously delt cards) to deal ${handSize} cards for ${totalHands} players.`,
        })
      );
    }

    // main card generation
    const allHands = [];
    const scores = [];
    let totalScore = 0;
    const acesByHand = [];
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

    // format response
    const cardHand = {
      asString: allHandsStr,
      asArray: allHands,
      scores: {
        total: totalScore,
        byHand: scores,
        acesByHand,
      },
      rejects: rejects,
    };
    return sendRes(
      200,
      JSON.stringify({
        success: true,
        hand: cardHand,
        message: `${
          totalDecks > 1 ? `${totalDecks} decks` : "1 deck"
        }. ${totalHands} hand${
          totalHands > 1 ? "s" : ""
        }. ${handSize} cards delt${totalHands > 1 ? " per hand." : "."}`,
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
