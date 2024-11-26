// Game variables
let deck = [];
let playerHand = [];
let dealerHand = [];
let isGameOver = false;
let balance = 1000; // Starting balance
let currentBet = 100; // Default bet per game
let win = 0;
let lose = 0;

// DOM Elements
const messageEl = document.getElementById("message");
//
const playerCardsEl = document.getElementById("player-cards");
const dealerCardsEl = document.getElementById("dealer-cards");
const playerScoreEl = document.getElementById("player-score");
const dealerScoreEl = document.getElementById("dealer-score");
const winCountPEl = document.getElementById("winCountP");
const loseCountPEl = document.getElementById("loseCountP");
const dealBtn = document.getElementById("deal");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const againBtn = document.getElementById("again");
const balanceEl = document.getElementById("balance");
const betInputEl = document.getElementById("bet-input");

// Initialize Deck
function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }

  // Shuffle deck
  deck = deck.sort(() => Math.random() - 0.5);
}

// Calculate hand score
function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  hand.forEach((card) => {
    if (card.value === "A") {
      aces += 1;
      score += 11;
    } else if (["K", "Q", "J"].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  });

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}

// Render hand
function renderHand(hand, element) {
  element.innerHTML = "";
  hand.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.textContent = `${card.value}${card.suit}`;
    element.appendChild(cardEl);
  });
}

// Check balance and reset if it reaches 0
function checkAndResetBalance() {
  if (balance <= 0) {
    alert("Your balance has reached $0. It has been reset to $1000.");
    balance = 1000;
    updateBalanceDisplay();
  }
}

// Update balance display
function updateBalanceDisplay() {
  balanceEl.textContent = `Balance: $${balance}`;
}

function winDisplay() {
  winCountPEl.textContent = `Wins: ${win}`;
}

function loseDisplay() {
  loseCountPEl.textContent = `Loses: ${lose}`;
}

// Reset the game state while keeping the balance intact
function resetGame() {
  playerHand = [];
  dealerHand = [];
  isGameOver = false;
  messageEl.textContent = "Place your bet and press 'Deal' to start.";
  playerScoreEl.textContent = "Score: 0";
  dealerScoreEl.textContent = "Score: 0";
  playerCardsEl.innerHTML = "";
  dealerCardsEl.innerHTML = "";
  messageEl.style.color = "white"; //
  messageEl.style.fontSize = "1em";
  dealBtn.disabled = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  againBtn.disabled = true;
}

// End game
function endGame() {
  if (isGameOver) return;

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) {
    messageEl.textContent = "You busted! Dealer wins.";
    messageEl.style.color = "red"; // Set color directly
    balance -= currentBet;
    lose = lose + 1;
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    messageEl.textContent = "You win!";
    messageEl.style.color = "#00ff00"; // Set color directly
    messageEl.style.fontSize = "2em";
    balance += currentBet;
    win = win + 1;
  } else if (playerScore < dealerScore) {
    messageEl.textContent = "Dealer wins!";
    messageEl.style.color = "red"; // Set color directly
    balance -= currentBet;
    lose = lose + 1;
  } else {
    messageEl.textContent = "It's a tie!";
    messageEl.style.color = "gray"; // Set color directly
  }

  updateBalanceDisplay();
  checkAndResetBalance();
  winDisplay();
  loseDisplay();
  hitBtn.disabled = true;
  standBtn.disabled = true;
  againBtn.disabled = false;
  isGameOver = true;
}

// Handle blackjack
function handleBlackjack() {
  if (isGameOver) return;

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore === 21 || dealerScore === 21) {
    renderHand(dealerHand, dealerCardsEl);
    dealerScoreEl.textContent = `Score: ${dealerScore}`;
    isGameOver = true;

    if (playerScore === 21 && dealerScore === 21) {
      messageEl.textContent = "It's a tie! Both have 21.";
      messageEl.style.color = "gray"; // Set color directly
    } else if (playerScore === 21) {
      messageEl.textContent = "Blackjack! You win!";
      messageEl.style.color = "#00ff00"; // Set color directly
      balance += currentBet;
      win = win + 1;
    } else {
      messageEl.textContent = "Dealer has 21! Dealer wins.";
      messageEl.style.color = "red"; // Set color directly
      balance -= currentBet;
      lose = lose + 1;
    }

    updateBalanceDisplay();
    hitBtn.disabled = true;
    standBtn.disabled = true;
    againBtn.disabled = false;
  }
}

// Dealer logic
function dealerPlay() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderHand(dealerHand, dealerCardsEl);
  dealerScoreEl.textContent = `Score: ${calculateScore(dealerHand)}`;

  if (!isGameOver) endGame();
}

// Event listeners
dealBtn.addEventListener("click", () => {
  currentBet = parseInt(betInputEl.value) || 100;
  if (currentBet > balance) {
    messageEl.textContent = "Insufficient balance for this bet!";
    return;
  }

  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  renderHand(playerHand, playerCardsEl);
  renderHand(dealerHand.slice(0, 1), dealerCardsEl);
  playerScoreEl.textContent = `Score: ${calculateScore(playerHand)}`;
  dealerScoreEl.textContent = `Score: ${calculateScore(dealerHand)}`;

  messageEl.textContent = "Your turn!";
  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;

  handleBlackjack();
});

hitBtn.addEventListener("click", () => {
  playerHand.push(deck.pop());
  renderHand(playerHand, playerCardsEl);
  playerScoreEl.textContent = `Score: ${calculateScore(playerHand)}`;
  dealerScoreEl.textContent = `Score: ${calculateScore(dealerHand)}`;

  handleBlackjack();

  if (calculateScore(playerHand) >= 21) {
    endGame();
  }
});

standBtn.addEventListener("click", () => {
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealerPlay();
});

againBtn.addEventListener("click", resetGame);

// Initialize
updateBalanceDisplay();
