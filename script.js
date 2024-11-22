// Game variables
let deck = [];
let playerHand = [];
let dealerHand = [];
let isGameOver = false;
let balance = 1000; // Starting balance
let currentBet = 100; // Default bet per game

// DOM Elements
const messageEl = document.getElementById("message");
const playerCardsEl = document.getElementById("player-cards");
const dealerCardsEl = document.getElementById("dealer-cards");
const playerScoreEl = document.getElementById("player-score");
const dealerScoreEl = document.getElementById("dealer-score");
const dealBtn = document.getElementById("deal");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const againBtn = document.getElementById("again");
const balanceEl = document.getElementById("balance");
const betInputEl = document.getElementById("bet-input");

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

  // Shuffle deck
  deck = deck.sort(() => Math.random() - 0.5);
}

// Calculate hand score
function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  hand.forEach(card => {
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
  hand.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.textContent = `${card.value}${card.suit}`;
    element.appendChild(cardEl);
  });
}

// End game and update balance
function endGame() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) {
    messageEl.textContent = "You busted! Dealer wins.";
    balance -= currentBet;
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    messageEl.textContent = "You win!";
    balance += currentBet;
  } else if (playerScore < dealerScore) {
    messageEl.textContent = "Dealer wins!";
    balance -= currentBet;
  } else {
    messageEl.textContent = "It's a tie!";
  }


  // if (playerScore > 21) {
  //   messageEl.textContent = "You busted! Dealer wins.";
  //   messageEl.style.color = "red"; // Dealer wins message in red
  //   console.log("Message color:", messageEl.style.color);
  //   balance -= currentBet;
  // } else if (dealerScore > 21 || playerScore > dealerScore) {
  //   messageEl.textContent = "You win!";
  //   messageEl.style.color = "green"; // You win message in green
  //   console.log("Message color:", messageEl.style.color);
  //   balance += currentBet;
  // } else if (playerScore < dealerScore) {
  //   messageEl.textContent = "Dealer wins!";
  //   messageEl.style.color = "red"; // Dealer wins message in red
  //   console.log("Message color:", messageEl.style.color);
  //   balance -= currentBet;
  // } else {
  //   messageEl.textContent = "It's a tie!";
  //   messageEl.style.color = "black"; // Tie message in black or default color
  //   console.log("Message color:", messageEl.style.color);
  // }
  

  updateBalanceDisplay();
  hitBtn.disabled = true;
  standBtn.disabled = true;
  againBtn.disabled = false; // Enable "Again" button
  isGameOver = true;
}

// Dealer logic
function dealerPlay() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderHand(dealerHand, dealerCardsEl);
  dealerScoreEl.textContent = `Score: ${calculateScore(dealerHand)}`;
  endGame();
}

// Update balance display
function updateBalanceDisplay() {
  balanceEl.textContent = `Balance: $${balance}`;
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

  dealBtn.disabled = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  againBtn.disabled = true;
}

// Event Listeners
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
  dealerScoreEl.textContent = `Score: ?`;

  messageEl.textContent = "Your turn!";
  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
});

// hitBtn.addEventListener("click", () => {
//   playerHand.push(deck.pop());
//   renderHand(playerHand, playerCardsEl);
//   playerScoreEl.textContent = `Score: ${calculateScore(playerHand)}`;

//   if (calculateScore(playerHand) > 21) {
//     endGame();
//   }
// });

standBtn.addEventListener("click", () => {
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealerPlay();
});

againBtn.addEventListener("click", resetGame);

// Initialize game
updateBalanceDisplay();

// Check balance and reset if it reaches 0
function checkAndResetBalance() {
  if (balance <= 0) {
    alert("Your balance has reached $0. It has been reset to $1000.");
    balance = 1000;
    updateBalanceDisplay();
  }
}

// End game and update balance with a balance reset check
function endGame() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) {
    messageEl.textContent = "You busted! Dealer wins.";
    balance -= currentBet;
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    messageEl.textContent = "You win!";
    balance += currentBet;
  } else if (playerScore < dealerScore) {
    messageEl.textContent = "Dealer wins!";
    balance -= currentBet;
  } else {
    messageEl.textContent = "It's a tie!";
  }

  updateBalanceDisplay();
  checkAndResetBalance(); // Check and reset balance if needed
  hitBtn.disabled = true;
  standBtn.disabled = true;
  againBtn.disabled = false; // Enable "Again" button
  isGameOver = true;
}


// Automatically handle a score of 21
function handleBlackjack() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore === 21 || dealerScore === 21) {
    // Reveal all cards
    renderHand(dealerHand, dealerCardsEl);
    dealerScoreEl.textContent = `Score: ${dealerScore}`;
    
    if (playerScore === 21 && dealerScore === 21) {
      // Tie condition
      messageEl.textContent = "It's a tie! Both have 21.";
    } else if (playerScore === 21) {
      // Player wins
      messageEl.textContent = "Blackjack! You win!";
      balance += currentBet;
    } else {
      // Dealer wins
      messageEl.textContent = "Dealer has 21! Dealer wins.";
      balance -= currentBet;
    }

    updateBalanceDisplay();
    hitBtn.disabled = true;
    standBtn.disabled = true;
    againBtn.disabled = false; // Enable "Again" button
    isGameOver = true;
  }
}

// Modify existing functions to integrate the blackjack check
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
  dealerScoreEl.textContent = `Score: ?`;

  messageEl.textContent = "Your turn!";
  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;

  // Check for blackjack after dealing
  handleBlackjack();
});

hitBtn.addEventListener("click", () => {
  playerHand.push(deck.pop());
  renderHand(playerHand, playerCardsEl);
  playerScoreEl.textContent = `Score: ${calculateScore(playerHand)}`;

  // Check for blackjack after hitting
  handleBlackjack();

  if (calculateScore(playerHand) > 21) {
    endGame();
  }
});

standBtn.addEventListener("click", () => {
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealerPlay();
});

// Update dealerPlay function to check for blackjack
function dealerPlay() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderHand(dealerHand, dealerCardsEl);
  dealerScoreEl.textContent = `Score: ${calculateScore(dealerHand)}`;

  // Check for blackjack after dealer plays
  handleBlackjack();

  if (!isGameOver) {
    endGame();
  }
}

