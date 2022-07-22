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
  let player1 = Player('Linas', 'X');
  let player2 = Player('NPC', 'O');
  let turnNumber = 0;
  let activePlayer = player1;
  let gameOver = false;

  const move = (square) => {
    if (gameOver === false) {
      let turn = () => {
        return gameBoard.setField(square, activePlayer.getSign());
      };

      let success = turn();

      if (activePlayer === player2 && !success) {
        while (!success) {
          square = computerMove();
          success = turn();
        }
      }

      if (success) {
        turnNumber++;
        checkForWin();
        nextTurn();
      }
    }
  };

  const computerMove = () => {
    min = Math.ceil(0);
    max = Math.floor(8);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const nextTurn = () => {
    activePlayer === player2
      ? (activePlayer = player1)
      : (activePlayer = player2);

    if (activePlayer === player2) {
      move(computerMove());
    }
  };

  const reset = () => {
    gameBoard.clear();
    turnNumber = 0;
    activePlayer = player1;
    gameOver = false;
  };

  const checkForWin = () => {
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

    winCombos.forEach((combo) => {
      let counter = 0;
      combo.forEach((spot) => {
        if (gameBoard.getBoard()[spot] === activePlayer.getSign()) {
          counter++;
          if (counter === 3) {
            displayControl.declareResult(activePlayer);
            gameOver = true;
          }
          console.log('Combo: ' + combo + ', counter:' + counter);
        }
      });
    });

    if (turnNumber === 9) {
      displayControl.declareResult(undefined);
      gameOver = true;
    }
  };

  return { move, reset };
})();

const displayControl = (() => {
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
      squares[i].textContent = gameBoard.getBoard()[i];
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
  });

  update();
  return { squares, update, declareResult };
})();
