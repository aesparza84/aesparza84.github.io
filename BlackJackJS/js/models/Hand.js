export class Hand {
    hand = [];

    addCardToHand(card) {
        this.hand.push(card);
    }

    clearHand() {
        this.hand = [];
    }

    getHandTotal() {
        if (this.hand.length == 0)
            return 0;

        let total = 0;
        this.hand.forEach((card)=> {
            total += card.getRank();
        });

        return total;
    }

    readCards(user) {
        this.hand.forEach((card)=>{
            console.log(user+" has a "+card.cardToString());
        });
    }
}