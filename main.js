const gameBoard = (() => {
  //let board = ['', '', '', '', '', '', '', '', ''];
  let board = ['X', 'O', 'X', '', '', '', '', 'O', ''];

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

/////////////////
/////////////////
///////////////
///////////////////

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

/////////////////
/////////////////
///////////////
///////////////////

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
    minimax();

    //random
    min = Math.ceil(0);
    max = Math.floor(8);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const nextTurn = () => {
    activePlayer === player2
      ? (activePlayer = player1)
      : (activePlayer = player2);

    if (activePlayer === player2) {
      // move(computerMove());
      minimax();
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

    let box = [];

    const run = (state, sign) => {
      const printState = (board = state) => {
        console.log('RESULT CHECK FOR:');
        let line = '';
        for (let i = 0; i < board.length; i++) {
          let field = board[i];
          if (field === '') {
            field = '#';
          }

          line = line + field + ' ';

          if (i === 2 || i === 5 || i === 8) {
            console.log(`${line}\n`);
            line = '';
          }
        }
      };
      let scores = [];
      let states = [];

      const getResult = (state) => {
        let result = positionChecker(state);

        if (result !== null) {
          if (result === 'X') {
            return 10;
          }

          if (result === 'O') {
            return -10;
          }

          if (result === 'tie') {
            return 0;
          }

          return null;
        }
        console.log(`--- RESULT: ${result}`);
      };

      printState();
      let result = getResult(state);

      console.log(result);

      if (result === undefined) {
      
        availableFields = [];

        for (let i = 0; i < state.length; i++) {
          if (state[i] === '') {
            availableFields.push(i);
          }
        }

        console.log('AVAILABLE FIELDS: ' + availableFields);

        availableFields.forEach((field) => {
          let board = [...state];
          board[field] = sign;
          states.push({board, scores});
        });

        sign === 'O' ? (sign = 'X') : (sign = 'O');

        states.forEach((state) => {
          let foo = run(state.board, sign);

          console.log(foo);
          if (foo !== undefined) {
            state.scores.push(foo);
            printState(state);
            console.log(state.scores);
            console.log(states);
            box.push(state);
            console.dir(box);
          }
        });
      }
      return result;
    };
    console.dir(run(boardTest, activePlayer) + "fafafafafafa");
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

    console.log('----------------------------------');

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
              console.log(sign + ': Combo: ' + combo + ', counter:' + counter);
            }
          }
        });
      });
    });
    return result;
  };

  /////////////////////////////
  ////////////////////////////
  ////////////////////////////
  /////////////////////////////
  /////////////////////////////

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

    winCombos.forEach((combo) => {
      let counter = 0;
      combo.forEach((spot) => {
        // IESKO TIK VIENO SIGN, REIKTU TURBUT, KAD IESKOTU IR X IR O POZICIJO
        if (board[spot] === sign) {
          counter++;
          if (counter === 3) {
            console.log(
              'WINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN'
            );
            result = activePlayer;
          }
          console.log('Combo: ' + combo + ', counter:' + counter);
        }
      });
    });

    if (turnNumber === 9) {
      result = 'tie';
    }

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

  return { move, reset, runThroughBoard };
})();

/////////////////
/////////////////
///////////////
///////////////////
/////////////////
/////////////////
///////////////
///////////////////

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
