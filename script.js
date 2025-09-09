let character, obstacle, scoreDisplay;
let jumping = false, gameInterval, scoreInterval;
let score = 0;

function startGame(img) {
  document.getElementById('character-select').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  character = document.getElementById('character');
  obstacle = document.getElementById('obstacle');
  scoreDisplay = document.getElementById('score');

  character.style.backgroundImage = `url(${img})`;

  createStars();

  setTimeout(moveObstacle, 1000);

  scoreInterval = setInterval(() => {
    score++;
    scoreDisplay.textContent = "Score: " + score;
  }, 200);

  document.addEventListener('keydown', jump);
  document.addEventListener('click', jump);
  document.addEventListener('touchstart', jump);
}

function jump(e) {
  if (jumping) return;
  if (e.type === 'keydown' && e.code !== 'Space') return;

  playJumpSound(); // 🎵 play jump sound

  jumping = true;
  let pos = parseInt(window.getComputedStyle(character).bottom) || 10;
  let jumpHeight = 160;

  let up = setInterval(() => {
    if (pos >= jumpHeight) {
      clearInterval(up);
      let down = setInterval(() => {
        if (pos <= 10) {
          clearInterval(down);
          jumping = false;
        }
        pos -= 5;
        character.style.bottom = pos + 'px';
      }, 20);
    }
    pos += 5;
    character.style.bottom = pos + 'px';
  }, 20);
}

function moveObstacle() {
  const game = document.getElementById('game');
  const gameWidth = game.offsetWidth;
  let pos = gameWidth;

  gameInterval = setInterval(() => {
    if (pos < -30) pos = gameWidth;
    pos -= 3;
    obstacle.style.left = pos + 'px';

    let characterBottom = parseInt(window.getComputedStyle(character).bottom);
    let characterLeft = character.offsetLeft;
    let characterRight = characterLeft + character.offsetWidth;

    let obstacleLeft = pos;
    let obstacleRight = pos + obstacle.offsetWidth;

    if (obstacleLeft < characterRight && obstacleRight > characterLeft && characterBottom < obstacle.offsetHeight) {
      clearInterval(gameInterval);
      clearInterval(scoreInterval);
      playGameOverSound(); // 🎵 game-over sound
      document.getElementById('final-score').textContent = score;
      document.getElementById('game-over-overlay').style.display = 'flex';
    }
  }, 20);
}

function createStars() {
  const gameArea = document.getElementById('game');
  for (let i = 0; i < 30; i++) {
    let star = document.createElement('div');
    star.classList.add('star');
    let size = Math.random() * 3 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.top = Math.random() * 200 + 'px';
    star.style.left = Math.random() * 600 + 'px';
    gameArea.appendChild(star);
  }
}

function restartGame() {
  window.location.reload();
}

/* Web Audio API Sounds */
function playJumpSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(400, ctx.currentTime); // pitch
  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.1); // short beep
}

function playGameOverSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.5); // longer beep
}
