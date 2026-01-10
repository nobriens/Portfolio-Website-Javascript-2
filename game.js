// I watched this tutroial https://www.youtube.com/watch?v=VNs96uQoetw&t=5699s to understand how to make the game and adapt it for my website

// Game constants
const PHYSICS_GRAVITY = 0.5; //these control the physics and speed of the game
const JUMP_POWER = -14;
const MOVE_SPEED = 4;
const ENEMY_SPEED = 0.6;
const GAME_WIDTH = 800;
const GAME_FLOOR_Y = 540;

// Social link blocks config
const LINK_BLOCKS = { //I made it so when the player hits the surprise boxes they are redirected to my social pages, such as linkedin, behance and github
  linkedin: {
    url: "https://www.linkedin.com/in/neesan-o-brien-shea/",
    contactId: "linkedin",
  },
  behance: {
    url: "https://www.behance.net/neesanoshea",
    contactId: "behance",
  },
  github: {
    url: "https://github.com/nobriens",
    contactId: "github",
  },
};

//Represents the player character in the platformer. Also stores position, physics values and a reference to the DOM element. It includes behaviour such as resetting the player state//
class Player {
  constructor(element) {
    this.element = element;

    this.x = 50;
    this.y = 340;
    this.width = 45;
    this.height = 75;

    this.velX = 0;
    this.velY = 0;

    this.onBlock = false;
  }

  resetPosition() {
    this.x = 50;
    this.y = 340;
    this.velX = 0;
    this.velY = 0;
    this.onBlock = false;
  }
}

// Here is the playstate, it tracks the score, level and lives (however later on I made it so the player only has one life and there is only one level)
let waitingToStart = true;
let levels = []

let playState = {
  score: 0,
  level: 1,
  lives: 1,
  gamePlaying: true,
  keys: {}, // this stores the pressed keys
};

// This part was for the player's position, size and movement values
let hero = new Player(document.getElementById("mario"));

//Here are the game objects arrays, everything in the level is stored here
let gameObjects = {
  platforms: [],
  enemies: [],
  coins: [],
  surpriseBlocks: [],
  pipes: [],
};

// This intitiates the game and loads the level
function bootGame() {
  loadStage(playState.level - 1);
  gameLoop();
}

function loadStage(levelIndex) { // compared to the tutorial which had two levels, for my use case I only needed one so when the player completes this level it shows the win screen
  if (levelIndex >= levels.length) {
    showGameOver(true);
    return;
  }

  clearStage();

  const level = levels[levelIndex];

  const gameArea = document.getElementById("game-area");

  // This resets the player when completing the level
hero.resetPosition();
hero.element.className = "";
updateElementPos(hero.element, hero.x, hero.y);

  // Platforms
  level.platforms.forEach((platformData, index) => {
    const platform = createElement("div", `platform ${platformData.type}`, {
      left: platformData.x + "px",
      top: platformData.y + "px",
      width: platformData.width + "px",
      height: platformData.height + "px",
    });
    gameArea.appendChild(platform);
    gameObjects.platforms.push({
      element: platform,
      ...platformData,
      id: "platform-" + index,
    });
  });

  // Enemies
  level.enemies.forEach((enemyData, index) => {
    const enemy = createElement("div", `enemy ${enemyData.type}`, {
      left: enemyData.x + "px",
      top: enemyData.y + "px",
    });
    gameArea.appendChild(enemy);
    gameObjects.enemies.push({
      element: enemy,
      x: enemyData.x,
      y: enemyData.y,
      width: 40,
      height: 40,
      direction: -1,
      speed: ENEMY_SPEED,
      id: "enemy-" + index,
      alive: true,
    });
  });

  // Coins
  level.coins.forEach((coinData, index) => {
    const coin = createElement("div", "coin", {
      left: coinData.x + "px",
      top: coinData.y + "px",
    });
    gameArea.appendChild(coin);
    gameObjects.coins.push({
      element: coin,
      x: coinData.x,
      y: coinData.y,
      width: 40,
      height: 40,
      collected: false,
      id: "coin-" + index,
    });
  });

  // LinkedIn block
  level.surpriseBlocksLinkedin.forEach((blockData, index) => {
    const block = createElement("div", "surprise-blocklinkedin", {
      left: blockData.x + "px",
      top: blockData.y + "px",
    });
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
      element: block,
      x: blockData.x,
      y: blockData.y,
      width: 40,
      height: 40,
      type: blockData.type,
      hit: false,
      id: "block-linkedin-" + index,
    });
  });

  // Behance block
  level.surpriseBlocksBehance.forEach((blockData, index) => {
    const block = createElement("div", "surprise-blockbehance", {
      left: blockData.x + "px",
      top: blockData.y + "px",
    });
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
      element: block,
      x: blockData.x,
      y: blockData.y,
      width: 40,
      height: 40,
      type: blockData.type, 
      hit: false,
      id: "block-behance-" + index,
    });
  });

  // GitHub block
  level.surpriseBlocksGithub.forEach((blockData, index) => {
    const block = createElement("div", "surprise-blockgithub", {
      left: blockData.x + "px",
      top: blockData.y + "px",
    });
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
      element: block,
      x: blockData.x,
      y: blockData.y,
      width: 40,
      height: 40,
      type: blockData.type, // "github"
      hit: false,
      id: "block-github-" + index,
    });
  });

  // Pipe
  level.pipes.forEach((pipeData, index) => {
    const pipe = createElement("div", "pipe", {
      left: pipeData.x + "px",
      top: pipeData.y + "px",
      width: "80px",
      height: "80px",
    });

    gameArea.appendChild(pipe);

    gameObjects.pipes.push({
      element: pipe,
      x: pipeData.x,
      y: pipeData.y,
      width: 80,
      height: 80,
      id: "pipe-" + index,
    });
  });
}

// Helper functions
function updateElementPos(element, x, y) { // Moves a DOM element to match the x/y postion
  element.style.left = x + "px";
  element.style.top = y + "px";
}

// this creates a div
function createElement(type, className, styles = {}) {
  const element = document.createElement("div");
  element.className = className;
  Object.assign(element.style, styles);
  return element;
}

// this was used to clear all the keys as when being redirect to websites movement would get stuck
function resetInputState() {
  playState.keys = {};
  hero.velX = 0;
}

// win or lose screen
function showGameOver(won) {
  playState.gamePlaying = false;
  document.getElementById("game-over-title").textContent = won
    ? "Congratulations You won"
    : "Game over";
  document.getElementById("final-score").textContent = playState.score;
  document.getElementById("game-over").style.display = "block";
}

// this remoeves everything from the screen even though it is only one level I couldn't get the game to work without it
function clearStage() {
  Object.values(gameObjects)
    .flat()
    .forEach((obj) => {
      if (obj.element && obj.element.parentNode) {
        obj.element.remove();
      }
    });


    // Resets object arrays
  gameObjects = {
    platforms: [],
    enemies: [],
    coins: [],
    surpriseBlocks: [],
    pipes: [],
  };
}


// Input handling
document.addEventListener("keydown", (e) => {
  playState.keys[e.code] = true;

  // this was a necessary part of the code, as I need to make sure the arrow and space keys wouldn't scroll the page when the game was playing
  if (!waitingToStart &&
    (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "ArrowDown" ||
    e.code === "ArrowLeft" ||
    e.code === "ArrowRight"
    )
  ) {
    e.preventDefault();
  }

  // Starts game
  if (waitingToStart && e.code === "Space") {
    startGame();
  }
});

document.addEventListener("keyup", (e) => {
  playState.keys[e.code] = false;
});

// hides the start screen an starts game
function startGame() {
  waitingToStart = false;
  document.getElementById("game-start").style.display = "none";
}

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("game-area").addEventListener("click", () => {
  if (waitingToStart) startGame();
});

// Game loop
function gameLoop() {
  if (waitingToStart) {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (!playState.gamePlaying) return;

  update();
  requestAnimationFrame(gameLoop);
}

// ===============================
// >>> NEW — CLEAN UPDATE FLOW <<<
// ===============================
function capturePreviousHeroState() {
  return {
    x: hero.x,
    y: hero.y,
    bottom: hero.y + hero.height,
    top: hero.y
  };
}

function update() {

  const prev = capturePreviousHeroState();

  handlePlayerInput();
  applyPhysics();
  constrainToWorld();

  handlePlatformCollisions(prev);
  handlePipeCollisions(prev);

  updateEnemies(prev);
  collectCoins();
  handleSurpriseBlocks(prev);

  checkPipeWin();
  checkFallingDeath();

  renderHero();
  updateScoreDisplay();
}


// ===============================
// Player movement
// ===============================
function handlePlayerInput() {

  if (playState.keys["ArrowLeft"] || playState.keys["KeyA"]) {
    hero.velX = -MOVE_SPEED;
  }
  else if (playState.keys["ArrowRight"] || playState.keys["KeyD"]) {
    hero.velX = MOVE_SPEED;
  }
  else {
    hero.velX *= 0.8;
  }

  if (playState.keys["Space"] && hero.onBlock) {
    hero.velY = JUMP_POWER;
    hero.onBlock = false;
  }
}

function applyPhysics() {
  if (!hero.onBlock) {
    hero.velY += PHYSICS_GRAVITY;
  }

  hero.x += hero.velX;
  hero.y += hero.velY;
}

function constrainToWorld() {

  if (hero.x <= 0) {
    hero.x = 0;
    hero.velX *= -1;
  }

  if (hero.x + hero.width >= GAME_WIDTH) {
    hero.x = GAME_WIDTH - hero.width;
    hero.velX *= -1;
  }
}


// ===============================
// Platforms & pipes
// ===============================
function handlePlatformCollisions(prev) {

  hero.onBlock = false;

  for (let platform of gameObjects.platforms) {
    if (isTouching(hero, platform)) {

      const landingOnTop =
        hero.velY > 0 &&
        prev.bottom <= platform.y;

      if (landingOnTop) {
        hero.y = platform.y - hero.height;
        hero.velY = 0;
        hero.onBlock = true;
      }
    }
  }
}

function handlePipeCollisions(prev) {

  for (let pipe of gameObjects.pipes) {
    if (isTouching(hero, pipe)) {

      const landingOnTop =
        hero.velY > 0 &&
        prev.bottom <= pipe.y;

      if (landingOnTop) {
        hero.y = pipe.y - hero.height;
        hero.velY = 0;
        hero.onBlock = true;
      }
    }
  }
}


// ===============================
// Enemies
// ===============================
function updateEnemies(prev) {

  for (let enemy of gameObjects.enemies) {

    if (!enemy.alive) continue;

    enemy.x += enemy.speed * enemy.direction;

let enemyOnPlatform = false;

for (let platform of gameObjects.platforms) {

  const feetAreOnTop =
    enemy.y + enemy.height >= platform.y - 2 &&
    enemy.y + enemy.height <= platform.y + 2;

  const fullyOnPlatform =
    enemy.x >= platform.x &&
    enemy.x + enemy.width <= platform.x + platform.width;

  if (feetAreOnTop && fullyOnPlatform) {
    enemyOnPlatform = true;
    break;
  }
}

// If stepping off — turn around
if (!enemyOnPlatform) {
  enemy.direction *= -1;
}

    if (enemy.x <= 0) enemy.direction = 1;
    if (enemy.x + enemy.width >= GAME_WIDTH) enemy.direction = -1;

    updateElementPos(enemy.element, enemy.x, enemy.y);

    handleEnemyCollision(enemy, prev);
  }
}

function handleEnemyCollision(enemy, prev) {

  if (!isTouching(hero, enemy)) return;

  const stomped =
    hero.velY > 0 &&
    prev.bottom <= enemy.y;

  if (stomped) {
    enemy.alive = false;
    enemy.element.remove();
    hero.velY = JUMP_POWER * 0.7;
    playState.score += 100;
  }
  else {
    handlePlayerDeath();
  }
}


// ===============================
// Coins
// ===============================
function collectCoins() {

  for (let coin of gameObjects.coins) {

    if (!coin.collected && isTouching(hero, coin)) {
      coin.collected = true;
      coin.element.remove();
      playState.score += 50;
    }
  }
}


// ===============================
// Surprise blocks
// ===============================
function handleSurpriseBlocks(prev) {

  for (let block of gameObjects.surpriseBlocks) {

    const isHitFromBelow =
      !block.hit &&
      isTouching(hero, block) &&
      hero.velY < 0 &&
      prev.top >= block.y + block.height;

    if (!isHitFromBelow) continue;

    block.hit = true;
    block.element.classList.add("hit");

    const info = LINK_BLOCKS[block.type];
    if (!info) continue;

    resetInputState();
    highlightContactLink(info.contactId);

    if (info.url) window.open(info.url, "_blank");

    playState.score += 150;
  }
}


// ===============================
// Win & death conditions
// ===============================
function checkPipeWin() {

  for (let pipe of gameObjects.pipes) {

    const standingOnPipe =
      hero.onBlock &&
      hero.x + hero.width > pipe.x &&
      hero.x < pipe.x + pipe.width &&
      Math.abs(hero.y + hero.height - pipe.y) < 5;

    if (standingOnPipe && playState.keys["ArrowDown"]) {
      showGameOver(true);
    }
  }
}

function checkFallingDeath() {
  if (hero.y > GAME_FLOOR_Y) {
    handlePlayerDeath();
  }
}


// ===============================
// Rendering
// ===============================
function renderHero() {
  updateElementPos(hero.element, hero.x, hero.y);
}

function updateScoreDisplay() {
  document.getElementById("score").textContent = playState.score;
}


// ===============================
// Collision
// ===============================
function isTouching(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}


// ===============================
// Restart / Death
// ===============================
function handlePlayerDeath() {
  playState.lives--;
  if (playState.lives <= 0) {
    showGameOver(false);
  }
}

function restartStage() {
  playState.score = 0;
  playState.level = 1;
  playState.lives = 1;
  playState.gamePlaying = true;
  playState.keys = {};

  waitingToStart = true;
  resetInputState();

  document.getElementById("game-over").style.display = "none";
  document.getElementById("game-start").style.display = "block";

  loadStage(0);
  gameLoop();
}

document.getElementById("restart-button").addEventListener("click", restartStage);


// ===============================
// Highlight social links
// ===============================
function highlightContactLink(contactId) {
  if (!contactId) return;
  const el = document.querySelector(`.contact-link[data-id="${contactId}"]`);
  if (!el) return;

  el.classList.add("hit-from-game");
  setTimeout(() => {
    el.classList.remove("hit-from-game");
  }, 1000);
}


// Loads level data from an external JSON file. This keeps the game content separate from the game logic.//
window.addEventListener("DOMContentLoaded", () => {
  fetch("levels.json")
    .then((res) => {
      if (!res.ok) throw new Error("HTTP error " + res.status);
      return res.json();
    })
    .then((data) => {
      levels = data.levels;
      bootGame();
    })
    .catch((err) => console.error("Error loading levels.json:", err));
});