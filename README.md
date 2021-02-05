[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
# Random Cards API


## Description
Random Cards is an API for generating random playing cards from a standard 52 card deck, making it ideal for use in a simple card game application. The size of each hand, amount of hands, and number of decks can be configured in the GET route query parameters. The response returns cards both as a string (for display purposes) and as a array (for programmatic use). The POST route can be used to submit previously delt cards to remove them from the stack and get another draw. The API is hosted on AWS lambda. 

[https://8b5qreoqz7.execute-api.us-east-1.amazonaws.com/randomCards](https://8b5qreoqz7.execute-api.us-east-1.amazonaws.com/randomCards?hand_size=5)

## GET Route

Query Param | Required | Description
------|----------|------------
`hand_size` | true | the amount of cards desired for each hand
`total_hands` | false | the amount of hands or players to recieve the set hand size. If left blank defaults to one
`total_decks` | false | the amount of decks that random cards are selected from. If left blank defaults to one. Must be between 1 and 8


### Response
A sample JSON response for a hand size of 2, a total hands size of 2, and a deck size of 1 is as follows:

```JSON
{
    "success": true,
    "hand": {
        "asString": "Player 1's Cards: 4 of Diamonds, Ace of Clubs\nPlayer 2's Cards: 7 of Diamonds, 3 of Clubs\n",
        "asArray": [
            [
                "4 of Diamonds",
                "Ace of Clubs"
            ],
            [
                "7 of Diamonds",
                "3 of Clubs"
            ]
        ],
    },
    "message": "1 deck. 2 hands. 2 cards delt per hand."
}
```

### Limits
Once cards are pulled from the deck and in a hand they are no longer available to be delt. The following limit applies:
```JavaScript
hand_size * total_hands <= total_decks * 52
```

## POST Route
Post Body | Required | Description
------|----------|------------
`previous_cards` | true | `asArray`  response from a previous GET request (an array of card arrays) or a single array of delt cards
`hand_size` | true | the amount of cards desired for each hand
`total_hands` | false | the amount of hands or players to recieve the set hand size. If left blank defaults to one
`total_decks` | false | the amount of decks that random cards are selected from. If left blank defaults to one. Must be between 1 and 8

### Limits
The post route adds the following limit to the amount of cards that can be drawn:
```
hand_size * total_hands <= total_decks * 52 - (length of previous_cards)
```

### Response
The POST response is the same as the GET response with an added array of cards that were not recognized:
```JSON
{
    "success": true,
    "hand": {
        "asString": "Player 1's Cards: Jack of Clubs\n",
        "asArray": [["Jack of Clubs"]],
        "rejects": ["Queen of England"]
    },
    "message": "1 deck. 1 hand. 1 card delt."
}
```
## Questions
Github profile: [dgtlctzn](https://github.com/dgtlctzn)

If you have any questions about the project please contact josephperry720@gmail.com
## License
This project is covered under the GNU license