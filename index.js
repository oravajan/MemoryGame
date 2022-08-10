class Card {
    static empty = document.getElementById('cards').querySelector('.empty')

    constructor(id, img) {
        this.id = id;
        this.facingUp = false;
        this.img = img;
    }

    draw(x, y) {
        let img = this.facingUp ? this.img : Card.empty;
        CONTEXT.drawImage(img, x, y, CARD_SIZE, CARD_SIZE);
    }
}

function createCards() {
    let cardImgs = document.getElementById('cards').querySelectorAll('img.card')

    let array = [];
    for (let i = 0; i < cardImgs.length; i++) {
        let card = new Card(i, cardImgs[i]);
        let card2 = new Card(i, cardImgs[i]);
        array.push(card, card2);
    }

    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function drawBoard() {
    CONTEXT.clearRect(0, 0, BOARD.width, BOARD.height);
    let x = SPACE, y = SPACE;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            cards[col + COLUMNS * row].draw(x, y);
            x += CARD_SIZE + SPACE;
        }
        x = SPACE;
        y += CARD_SIZE + SPACE;
    }
    PLAYER_1_SCORE_TEXT.textContent = String(player1Score);
    PLAYER_2_SCORE_TEXT.textContent = String(player2Score);
    if (player1Turn)
        BODY_STYLE.backgroundColor = "lightpink";
    else
        BODY_STYLE.backgroundColor = "lightblue";
}

function update(e) {
    if (!playing)
        return;
    const size = BOARD.clientWidth / COLUMNS;
    const x = e.offsetX;
    const y = e.offsetY;
    if (x < 0 || y < 0 || x >= BOARD.clientWidth || y >= BOARD.clientHeight)
        return;
    const id = Math.floor(x / size) + COLUMNS * Math.floor(y / size);
    turn(id);
    drawBoard();
}

function turn(id) {
    let card = cards[id];
    if (card.facingUp)
        return;
    card.facingUp = true;
    if (lastCard) {
        if (lastCard.id === card.id) {
            updateScore();
        } else {
            playing = false;
            setTimeout((card, lastCard) => {
                card.facingUp = false;
                lastCard.facingUp = false;
                player1Turn = !player1Turn;
                drawBoard();
                playing = true;
            }, 1000, card, lastCard);
        }
        lastCard = null;
    } else {
        lastCard = card;
    }
}

function updateScore() {
    if (player1Turn)
        player1Score++;
    else
        player2Score++;

    if (player1Score + player2Score === cards.length / 2) {
        playing = false;
        if (player1Score > player2Score) {
            END_SCREEN.childNodes[1].textContent = 'Player 1 WINS!';
            END_SCREEN.style.color = 'red';
        } else if (player2Score > player1Score) {
            END_SCREEN.childNodes[1].textContent = 'Player 2 WINS!';
            END_SCREEN.style.color = 'blue';
        } else {
            END_SCREEN.childNodes[1].textContent = 'DRAW!';
        }

        END_SCREEN.style.display = 'flex';
    }
}

function restartGame() {
    player1Turn = true;
    player1Score = 0;
    player2Score = 0;
    cards = createCards()
    END_SCREEN.style.display = 'none';
    playing = true;
    drawBoard();
}

const BOARD = document.querySelector('#board');
BOARD.addEventListener('click', update, false);
const CONTEXT = BOARD.getContext('2d');
const PLAYER_1_SCORE_TEXT = document.querySelector('#score1');
const PLAYER_2_SCORE_TEXT = document.querySelector('#score2');
const END_SCREEN = document.querySelector('#endScreen');
document.querySelector('#restartButton').addEventListener('click', restartGame, false);
const BODY_STYLE = document.body.style;

const SPACE = 5;
const COLUMNS = 6;
const ROWS = 6;
const CARD_SIZE = (BOARD.width - (COLUMNS + 1) * SPACE) / COLUMNS;

let cards = createCards();
let player1Turn = true;
let lastCard = null;
let player1Score = 0;
let player2Score = 0;
let playing = true;

window.onload = drawBoard;
