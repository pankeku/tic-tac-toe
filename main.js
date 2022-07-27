const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];
  const getBoard = () => {
    return board;
  };
  const setField = (index, sign) => {
    if (!isFieldTaken(index)) {
      board[index] = sign;
      return true;
    }
    return false;
  };

  const isFieldTaken = (index) => (board[index] !== '' ? true : false);

  const clear = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };

  return {
    getBoard,
    setField,
    clear,
    isFieldTaken,
  };
})();

const gameControl = (() => {
  let activePlayer = 'X';
  let gameOver = false;
  let modes = { easy: true, medium: false, hard: false };

  const move = (square) => {
    if (!gameOver && gameBoard.setField(square, activePlayer)) {
      checkResult();
      nextTurn();
    }
  };

  const nextTurn = () => {
    activePlayer === 'X' ? (activePlayer = 'O') : (activePlayer = 'X');

    if (activePlayer === 'O') {
      move(computerChoice());
    }
  };

  const computerChoice = () => {
    let square = minimax(gameBoard.getBoard(), activePlayer, 0).index;

    const randomNumber = (maxNumber) => {
      min = Math.ceil(0);
      max = Math.floor(maxNumber);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const randomSquare = () => {
      let available = availableSquares();
      let randomSquare = available[randomNumber(available.length - 1)];

      while (randomSquare === square && available.length !== 0) {
        randomSquare = available[randomNumber(available.length - 1)];
      }

      return randomSquare;
    };

    if (modes.easy) {
      square = randomSquare();
    }

    if (modes.medium) {
      let number = randomNumber(9);

      if (number < 3) {
        square = randomSquare();
      }
    }

    return square;
  };

  const reset = () => {
    gameBoard.clear();
    activePlayer = 'X';
    gameOver = false;
  };

  const minimax = (board, sign, depth) => {
    let moves = [];
    let bestMove;

    let result = evaluate(board);

    if (result === 'X') {
      return { score: 10 - depth };
    }

    if (result === 'O') {
      return { score: depth - 10 };
    }

    if (result === 'tie') {
      return { score: 0 };
    }

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        let newBoard = [...board];
        newBoard[i] = sign;

        let move = {};
        move.index = i;

        if (sign === 'X') {
          let nextMove = minimax(newBoard, 'O', depth + 1);
          move.score = nextMove.score;
        }

        if (sign === 'O') {
          let nextMove = minimax(newBoard, 'X', depth + 1);
          move.score = nextMove.score;
        }

        moves.push(move);
      }
    }

    if (sign === 'X') {
      let bestScore = -11;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    if (sign === 'O') {
      let bestScore = 11;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  };

  const evaluate = (board = gameBoard.getBoard()) => {
    let winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let result = null;

    let signs = ['X', 'O'];

    let availableFields = availableSquares(board);

    if (availableFields.length === 0) {
      result = 'tie';
    }

    winCombos.forEach((combo) => {
      signs.forEach((sign) => {
        let counter = 0;
        combo.forEach((spot) => {
          if (board[spot] === sign) {
            counter++;
            if (counter === 3) {
              result = sign;
            }
          }
        });
      });
    });

    return result;
  };

  const checkResult = () => {
    let result = evaluate();

    if (result !== 'tie' && result !== null) {
      displayControl.declareResult(activePlayer);
      gameOver = true;
    }

    if (result === 'tie') {
      displayControl.declareResult(undefined);
      gameOver = true;
    }
  };

  const toggleMode = () => {
    if (modes.hard) {
      modes.hard = false;
      modes.easy = true;
      return;
    }

    if (modes.medium) {
      modes.medium = false;
      modes.hard = true;
      return;
    }

    if (modes.easy) {
      modes.easy = false;
      modes.medium = true;
      return;
    }

    console.log(modes);
  };

  const availableSquares = (board = gameBoard.getBoard()) => {
    let availableFields = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        availableFields.push(i);
      }
    }
    return availableFields;
  };

  return { move, reset, toggleMode };
})();

const displayControl = (() => {
  const mode = document.querySelector('.mode');
  const grid = document.querySelector('.grid');
  const info = document.querySelector('.info');
  const reset = document.querySelector('.reset');

  for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    square.id = i;
    grid.appendChild(square);
  }

  const squares = Array.from(document.querySelectorAll('.grid div'));

  const update = () => {
    for (i = 0; i < gameBoard.getBoard().length; i++) {
      let field = gameBoard.getBoard()[i];
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
      gameControl.move(square.id);
      update();
    })
  );

  reset.addEventListener('click', () => {
    gameControl.reset();
    clear();
    update();
  });

  mode.addEventListener('click', () => {
    if (mode.textContent === 'Easy') {
      mode.textContent = 'Medium';
      mode.classList.toggle('mode--medium');
      mode.classList.toggle('mode--easy');
      gameControl.toggleMode();
      return;
    }

    if (mode.textContent === 'Medium') {
      mode.textContent = 'Hard';
      mode.classList.toggle('mode--hard');
      mode.classList.toggle('mode--medium');
      gameControl.toggleMode();
      return;
    }

    if (mode.textContent === 'Hard') {
      mode.textContent = 'Easy';
      mode.classList.toggle('mode--hard');
      mode.classList.toggle('mode--easy');
      gameControl.toggleMode();
      return;
    }
  });

  update();
  return {update, declareResult};
})();
