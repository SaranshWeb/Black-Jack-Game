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
const exitFullscreenBtn = document.getElementById("exit-fullscreen");


// Fullscreen functionality
function toggleFullscreen() {
  const element = document.documentElement; // Select the <html> element for fullscreen
  if (!document.fullscreenElement) {
    // Enter fullscreen mode
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen(); // For Firefox
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // For Chrome, Safari, Opera
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // For IE/Edge
    }
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }
}

// Show/Hide Exit Fullscreen button based on Again button state
function updateExitFullscreenVisibility() {
  if (againBtn.disabled) {
    exitFullscreenBtn.style.display = "none";
  } else {
    exitFullscreenBtn.style.display = "inline-block";
  }
}


// Initialize Deck
function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }

  // Shuffle deck using Fisher-Yates algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
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

// Update balance display
function updateBalanceDisplay() {
  balanceEl.textContent = `Balance: $${balance}`;
}

// Update win/lose counters
function updateWinLoseDisplay() {
  winCountPEl.textContent = `Wins: ${win}`;
  loseCountPEl.textContent = `Losses: ${lose}`;
}

// Reset the game state
function resetGame() {
  playerHand = [];
  dealerHand = [];
  isGameOver = false;
  messageEl.textContent = "Place your bet and press 'Deal' to start.";
  messageEl.style.color = "white";
  playerScoreEl.textContent = "Score: 0";
  dealerScoreEl.textContent = "Score: 0";
  playerCardsEl.innerHTML = "";
  dealerCardsEl.innerHTML = "";
  dealBtn.disabled = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  againBtn.disabled = true;
}

// End game logic
function endGame() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) {
    messageEl.textContent = "You busted! Dealer wins.";
    messageEl.style.color = "red";
    balance -= currentBet;
    lose++;
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    messageEl.textContent = "You win!";
    messageEl.style.color = "green";
    balance += currentBet;
    win++;
  } else if (playerScore < dealerScore) {
    messageEl.textContent = "Dealer wins!";
    messageEl.style.color = "red";
    balance -= currentBet;
    lose++;
  } else {
    messageEl.textContent = "It's a tie!";
    messageEl.style.color = "gray";
  }

  updateBalanceDisplay();
  updateWinLoseDisplay();
  hitBtn.disabled = true;
  standBtn.disabled = true;
  againBtn.disabled = false;
  isGameOver = true;
}

// Dealer's turn
function dealerPlay() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderHand(dealerHand, dealerCardsEl);
  dealerScoreEl.textContent = `Score: ${calculateScore(dealerHand)}`;
  endGame();
}

// Handle blackjack
function handleBlackjack() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore === 21 || dealerScore === 21) {
    renderHand(dealerHand, dealerCardsEl);
    dealerScoreEl.textContent = `Score: ${dealerScore}`;
    isGameOver = true;

    if (playerScore === 21 && dealerScore === 21) {
      messageEl.textContent = "It's a tie! Both have Blackjack.";
      messageEl.style.color = "gray";
    } else if (playerScore === 21) {
      messageEl.textContent = "Blackjack! You win!";
      messageEl.style.color = "green";
      balance += currentBet;
      win++;
    } else {
      messageEl.textContent = "Dealer has Blackjack! Dealer wins.";
      messageEl.style.color = "red";
      balance -= currentBet;
      lose++;
    }

    updateBalanceDisplay();
    updateWinLoseDisplay();
    hitBtn.disabled = true;
    standBtn.disabled = true;
    againBtn.disabled = false;
  }
}

// Event listeners
dealBtn.addEventListener("click", () => {
  // Enter fullscreen mode
  toggleFullscreen();

  // Game logic for deal
  currentBet = parseInt(betInputEl.value) || 100;
  if (currentBet > balance) {
    messageEl.textContent = "Insufficient balance for this bet!";
    return;
  }

  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  renderHand(playerHand, playerCardsEl);
  renderHand(dealerHand.slice(0, 1), dealerCardsEl); // Hide one dealer card
  playerScoreEl.textContent = `Score: ${calculateScore(playerHand)}`;
  dealerScoreEl.textContent = `Score: ${calculateScore(dealerHand.slice(0, 1))}`;

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

exitFullscreenBtn.addEventListener("click", exitFullscreen);

// Initial check (ensure it's hidden when the game starts)
updateExitFullscreenVisibility();

// Initialize game
updateBalanceDisplay();
updateWinLoseDisplay();
resetGame();
