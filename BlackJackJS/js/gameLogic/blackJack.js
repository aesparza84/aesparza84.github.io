import {Deck} from "../models/Deck.js";
import {Card} from "../models/Card.js";
import {Hand} from "../models/Hand.js";

let deck = new Deck;
let gameRunning = false;

let dealerHand = new Hand;
let playerHand = new Hand;
let isPlayerTurn = true;

const playerCardHolder = document
    .querySelector('#player-area')
    .querySelector('.card-holder');

const dealerCardHolder = document
    .querySelector('#dealer-area')
    .querySelector('.card-holder');

const dealerTotal = document
.querySelector('#dealer-area')
.querySelector('.hand-total');

const playerTotal = document
.querySelector('#player-area')
.querySelector('.hand-total');

//Player Btns
const btns = document.querySelector('#btn-group');
const hitbtn = document.querySelector('#btn-hit');
const standbtn = document.querySelector('#btn-stand');

const winResult = document.querySelector('#result-text');

let playerHasWon = false;

function setUpGame() {
    //clean rendering
    removeCards(playerCardHolder);
    removeCards(dealerCardHolder);
    resetResults();

    playerHasWon = false;

    deck.generateDeck();
    deck.shuffleDeck();

    playerHand.clearHand();
    dealerHand.clearHand();

    //Setup
    let playerDraw = true;
    for (let i = 0; i < 4; i++) {
        let card = deck.drawCard();
        
        if (playerDraw) {
            playerHand.addCardToHand(card);
            playerCardHolder.append(createCard(card.getRank(), card.getSuit(), false));
        }
        else {
            dealerHand.addCardToHand(card);
            dealerCardHolder.append(createCard(card.getRank(), card.getSuit(), true));
        }

        playerDraw = !playerDraw;
    }

    enablePlayerButtons();

    //check for a pre-win
    if (playerHand.getHandTotal() == 21)
        calculateWinner();

}

const startBtn = document.querySelector('#btn-start');
startBtn.addEventListener('click', x=>{
    setUpGame();

    // updateTotalText(dealerTotal, dealerHand);
    updateTotalText(playerTotal, playerHand);
    dealerTotal.innerText = 'Total: ?';
});

hitbtn.addEventListener('click', x=> {
    playerHit();
    displayTotals();
});

standbtn.addEventListener('click', x=>{   
    dealerDraw();
    disablePlayerButtons();
});

function playerHit() {
    let card = deck.drawCard();
    playerHand.addCardToHand(card);

    console.log('Player draws - '+card.cardToString());
    playerCardHolder.append(createCard(card.getRank(), card.getSuit(),false));
    updateTotalText(playerTotal, playerHand);

    if(playerHand.getHandTotal()>21) {
        calculateWinner();
    }
}

function delay(ms) {
    return new Promise(res => setTimeout(res,ms));
}

async function dealerDraw() {
    let underLimit = true;

    //Rendering
    flipHiddenCards(dealerCardHolder);
    updateTotalText(dealerTotal, dealerHand);

    //Delay
    await delay(2000);

    while (dealerHand.getHandTotal() <= 16 && deck.cards.length > 0) {
        let card = deck.drawCard();
        dealerHand.addCardToHand(card);
        console.log('Dealer draws - '+card.cardToString());
        dealerCardHolder.append(createCard(card.getRank(),card.getSuit()));
        updateTotalText(dealerTotal, dealerHand);

        //Delay
        await delay(2000);
    }

    calculateWinner();
}

function calculateWinner() {
    disablePlayerButtons();

    let playerTotal = playerHand.getHandTotal();
    let dealerTotal = dealerHand.getHandTotal();
    
    if (playerTotal == dealerTotal) {
        console.log('Tie Game');
        displayResult('Tie Game');
    }
    else if (playerTotal > dealerTotal 
        && playerTotal <=21) {
        console.log('Winner!');
        playerHasWon = true;
        displayResult('You Win');
    }
    else if(playerTotal < dealerTotal && dealerTotal > 21) {
        console.log('Winner!');
        playerHasWon = true;
        displayResult('You Win');
    }
    else {
        console.log('You Lose.');
        displayResult('You Lose');
    }
}

//Rendering

function displayTotals() {
    console.log('Player total - '+playerHand.getHandTotal());
    console.log('Dealer total - '+dealerHand.getHandTotal());
}

function displayResult(winLoss){
    winResult.innerText = winLoss;

    if (playerHasWon) {
        winResult.classList.add('gr-text');
    }
    else {
        winResult.classList.add('red-text');
    }
}

function resetResults() {
    winResult.classList.remove('gr-text');
    winResult.classList.remove('red-text');
    winResult.innerText = '';
}

function enablePlayerButtons() {
    btns.style.visibility = 'visible';
}

function disablePlayerButtons() {
    btns.style.visibility = 'hidden';
}

function flipHiddenCards(cardHolder) {

    for (let i = 0; i < cardHolder.children.length; i++){
        cardHolder.children[i].querySelector('.flipped').classList.remove('flipped');
    }

}


function removeCards(cardHolder){
    while(cardHolder.firstChild) { 
        cardHolder.removeChild(cardHolder.lastChild);
    }
}

// function createCard(rank, suit){
//     const cardDiv = document.createElement('div');
//     const cardContent = document.createElement('div');
//     const cardHeader = document.createElement('div');
//     const cardMain = document.createElement('div');
//     const cardFooter = document.createElement('div');
    
//     const headerRank = document.createElement('p');
//     const mainText = document.createElement('p');
//     const mainRank = document.createElement('span');
//     const mainSuit = document.createElement('span');
//     const footerRank = document.createElement('p');

//     cardDiv.classList.add('card');
//     cardContent.classList.add('card-content');
//     cardHeader.classList.add('card-header');
//     cardMain.classList.add('card-main');
//     cardFooter.classList.add('card-footer');

//     headerRank.classList.add('rank');
//     mainSuit.classList.add('suit');
//     mainRank.classList.add('rank');
//     footerRank.classList.add('rank');   

//     //put together
//     cardDiv.append(cardContent);
//     cardContent.append(cardHeader);
//     cardContent.append(cardMain);
//     cardContent.append(cardFooter);

//     cardHeader.append(headerRank);

//     mainText.append(mainRank);
//     mainText.append(mainSuit);
//     cardMain.append(mainText);

//     cardFooter.append(footerRank);

//     headerRank.innerText = rank;
//     mainRank.innerText = rank;
//     mainSuit.innerText = suit;
//     footerRank.innerText = rank;

//     return cardDiv;
// }

function createCard(rank, suit, flipped){
    const cardDiv = document.createElement('div');

    const cardInner = document.createElement('div');
    cardInner.append(createCardContent(rank,suit,true)); //Create the front face
    cardInner.append(createCardContent('?','',false));    //Create the back face (?)
    cardInner.classList.add('card-inner');

    if (flipped) {
        cardInner.classList.add('flipped');
    }

    //put together
    cardDiv.classList.add('card');
    cardDiv.append(cardInner);
    return cardDiv;
}

function createCardContent(rank, suit, isFrontFace) {
    const cardContent = document.createElement('div');
    const cardHeader = document.createElement('div');
    const cardMain = document.createElement('div');
    const cardFooter = document.createElement('div');
    
    const headerRank = document.createElement('p');
    const mainText = document.createElement('p');
    const mainRank = document.createElement('span');
    const mainSuit = document.createElement('span');
    const footerRank = document.createElement('p');

    if (isFrontFace) {
        cardContent.classList.add('card-content');
    }
    else {
        cardContent.classList.add('card-back');
    }

    cardHeader.classList.add('card-header');
    cardMain.classList.add('card-main');
    cardFooter.classList.add('card-footer');

    headerRank.classList.add('rank');
    mainSuit.classList.add('suit');
    mainRank.classList.add('rank');
    footerRank.classList.add('rank');   

    //Put together
    cardContent.append(cardHeader);
    cardContent.append(cardMain);
    cardContent.append(cardFooter);

    cardHeader.append(headerRank);

    mainText.append(mainRank);
    mainText.append(mainSuit);
    cardMain.append(mainText);

    cardFooter.append(footerRank);

    headerRank.innerText = rank;
    mainRank.innerText = rank;
    mainSuit.innerText = suit;
    footerRank.innerText = rank;
    
    return cardContent;
}

function updateTotalText(totalElement, hand) {
    totalElement.innerText = 'Total: '+ hand.getHandTotal();
}

disablePlayerButtons();

//Dealer rules
//Hit: The dealer must hit if their total is 16 points or fewer.    
//Stand: The dealer must stand if their total is 17 points or more.
