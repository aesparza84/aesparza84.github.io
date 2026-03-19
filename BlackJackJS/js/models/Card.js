export class Card {
    constructor(rank, suit, name) {
        this.rank = rank;
        this.suit = suit;
        this.name = name;
    }
    
    cardToString() {
        return `${this.name} of ${this.suit}`;
    }

    getRank(){
        return this.rank;
    }

    getSuit() {
        return this.suit;
    }
}

export const Suits = Object.freeze({
    CLUBS: "♣",
    DIAMONDS: "♦",
    HEARTS: "♥",
    SPADES: "♠"
});