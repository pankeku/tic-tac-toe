const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];
  const getBoard = () => {
    return board;
  };
  const getField = (index) => board[index];
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
    getField,
    setField,
    clear,
  };
})();

const Player = (name, sign) => {
  const getName = () => {
    return name;
  };

  const getSign = () => {
    return sign;
  };

  return {
    getName,
    getSign,
  };
};

const gameControl = (() => {
  let player1 = Player('Player', 'X');
  let player2 = Player('Computer', 'O');
  let turnNumber = 0;
  let activePlayer = player1;
  let gameOver = false;
  let easyMode = true;

  const toggleMode = () => {
    easyMode === true ? easyMode = false : easyMode = true;
  }

  const getAvailableFields = (board = gameBoard.getBoard()) => {
    let availableFields = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        availableFields.push(i);
      }
    }
    return availableFields;
  };

  const move = (square) => {
    if (gameOver === false) {
      let turn = () => {
        return gameBoard.setField(square, activePlayer.getSign());
      };

      let success = turn();

      if (success) {
        turnNumber++;

        checkForWin();
        nextTurn();
      }
    }
  };

  const nextTurn = () => {
    activePlayer === player2
      ? (activePlayer = player1)
      : (activePlayer = player2);

    if (activePlayer === player2) {
      const getRandom = (maxNumber = 8) => {
        min = Math.ceil(0);
        max = Math.floor(maxNumber);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let spot = minimax();

      if (easyMode === true) {
        let available = getAvailableFields();
        let random = available[getRandom(available.length - 1)];

        while (random === spot && available.length !== 0) {
          random = available[getRandom(available.length - 1)];
        }

        spot = random;
      }

      move(spot);
    }
  };

  const reset = () => {
    gameBoard.clear();
    turnNumber = 0;
    activePlayer = player1;
    gameOver = false;
  };

  const minimax = () => {
    let availableFields = [];
    let boardTest = [];
    let activePlayer = 'O';

    for (let i = 0; i < gameBoard.getBoard().length; i++) {
      boardTest[i] = gameBoard.getBoard()[i];
    }

    for (let i = 0; i < boardTest.length; i++) {
      if (boardTest[i] === '') {
        availableFields.push(i);
      }
    }

    const run = (state, sign, depth) => {
      let moves = [];

      let result = positionChecker(state);

      if (result === 'X') {
        return { score: 10 - depth };
      }

      if (result === 'O') {
        return { score: depth - 10 };
      }

      if (result === 'tie') {
        return { score: 0 };
      }

      for (let i = 0; i < state.length; i++) {
        if (state[i] === '') {
          let board = [...state];
          board[i] = sign;

          let move = {};
          move.index = i;

          if (sign === 'X') {
            let nextMove = run(board, 'O', depth + 1);
            move.score = nextMove.score;
          }

          if (sign === 'O') {
            let nextMove = run(board, 'X', depth + 1);
            move.score = nextMove.score;
          }

          moves.push(move);
        }
      }

      let bestMove;

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

    let bestMove = run(boardTest, activePlayer, 0);
    return bestMove.index;
  };

  const positionChecker = (board = gameBoard.getBoard()) => {
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

    let availableFields = [];

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        availableFields.push(i);
      }
    }

    let result = null;

    let signs = ['X', 'O'];

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

  const runThroughBoard = (board = gameBoard.getBoard()) => {
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

    let sign = activePlayer.getSign();

    if (turnNumber === 9) {
      result = 'tie';
    }

    winCombos.forEach((combo) => {
      let counter = 0;
      combo.forEach((spot) => {
        if (board[spot] === sign) {
          counter++;
          if (counter === 3) {
            result = activePlayer;
          }
        }
      });
    });

    return result;
  };

  const checkForWin = () => {
    let result = runThroughBoard();

    if (result !== 'tie' && result !== null) {
      displayControl.declareResult(activePlayer);
      gameOver = true;
    }

    if (result === 'tie') {
      displayControl.declareResult(undefined);
      gameOver = true;
    }
  };

  return { move, reset, runThroughBoard, toggleMode };
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
    if (player === undefined) {
      info.textContent = "It's a tie!";
      return;
    }
    info.textContent = `${player.getName()} won!`;
  };

  const clear = () => {
    info.textContent = '';
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
    squares.forEach((square) => {
      square.classList.remove('sign-x', 'sign-o');
    });
  });

  mode.addEventListener('click', () => {

    if (mode.textContent === 'Easy') {
      mode.textContent = "Hard";
      mode.classList.toggle('mode--hard');
      mode.classList.toggle('mode--easy');
    } else {
      mode.textContent = "Easy";
      mode.classList.toggle('mode--hard');
      mode.classList.toggle('mode--easy');
    }

    gameControl.toggleMode();
  })

  update();
  return { squares, update, declareResult };
})();
