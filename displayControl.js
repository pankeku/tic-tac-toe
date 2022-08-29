import {getBoard} from './gameBoard.js';
import {move, reset, toggleMode} from './gameControl.js';

const mode = document.querySelector('.mode');
const grid = document.querySelector('.grid');
const info = document.querySelector('.info');
const resetButton = document.querySelector('.reset');

for (let i = 0; i < 9; i++) {
  const square = document.createElement('div');
  square.id = i;
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const update = () => {
  for (let i = 0; i < getBoard().length; i++) {
    let field = getBoard()[i];
    if (field === 'X') {
      squares[i].classList.add('sign-x');
    }
    if (field === 'O') {
      squares[i].classList.add('sign-o');
    }
  }
};

const declareResult = (player) => {

  if (player === 'X') {
    info.textContent = 'Yellow wins!';
    return;
  }

  if (player === 'O') {
    info.textContent = 'Red wins!';
    return;
  }

  info.textContent = 'Tie!';
};

const clear = () => {
  info.textContent = '';

  squares.forEach((square) => {
    square.classList.remove('sign-x', 'sign-o');
  });
};

squares.forEach((square) =>
  square.addEventListener('click', () => {
    move(square.id);
    update();
  })
);

resetButton.addEventListener('click', () => {
  reset();
  update();
});

mode.addEventListener('click', () => {
  if (mode.textContent === 'Easy') {
    mode.textContent = 'Medium';
    mode.classList.toggle('mode--medium');
    mode.classList.toggle('mode--easy');
    toggleMode();
    return;
  }

  if (mode.textContent === 'Medium') {
    mode.textContent = 'Hard';
    mode.classList.toggle('mode--hard');
    mode.classList.toggle('mode--medium');
    toggleMode();
    return;
  }

  if (mode.textContent === 'Hard') {
    mode.textContent = 'Easy';
    mode.classList.toggle('mode--hard');
    mode.classList.toggle('mode--easy');
    toggleMode();
    return;
  }
});

export {update, declareResult, clear};
