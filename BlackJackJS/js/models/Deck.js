import {Card, Suits } from "./Card.js";

export class Deck {
    cards = [];

    generateDeck() {
        if (this.cards.length > 0) {
            this.cards = [];
        }

        Object.values(Suits).forEach((suit) => {
            for (let i = 1; i <= 13; i++) {
                if (i == 1) {
                    this.cards.push(new Card(11, suit, "Ace")); 
                }
                else if (i == 11) {
                    this.cards.push(new Card(10, suit, "Jack")); 
                }
                else if (i == 12) {
                    this.cards.push(new Card(10, suit, "Queen")); 
                }
                else if (i == 13) {
                    this.cards.push(new Card(10, suit, "King")); 
                }                
                else {
                    this.cards.push(new Card(i, suit, i)); 
                }
            }
        });
    }

    shuffleDeck() {
        console.log('shuffling...');
        
        for (let i = this.cards.length-1; i >= 0; i--) {
            let index = Math.floor(Math.random() * (i+1));
            
            let hold = this.cards[i];
            this.cards[i] = this.cards[index];
            this.cards[index] = hold;
        }
    }

    drawCard() {
        return this.cards.pop();
    }
}
