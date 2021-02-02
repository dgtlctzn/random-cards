exports.handler = async (event) => {
    const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
    const pip = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
    const hand = [];
    let card = "";
    while (hand.length < 5) {
        let randomSuit = suits[Math.floor(Math.random() * suits.length)];
        let randomPip = pip[Math.floor(Math.random() * pip.length)];
        card = `${randomPip} of ${randomSuit}`;
        if (!hand.includes(card)) {
            hand.push(card);
        }
    }
    const cardHand = {
        asString: `Your cards: ${hand.join(", ")}`,
        asArray: hand
    }
        const response = {
        statusCode: 200,
        body: JSON.stringify(cardHand),
    };
    return response;
};
