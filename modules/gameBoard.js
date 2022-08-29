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

  const clearBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };

  export {
    getBoard,
    setField,
    clearBoard,
    isFieldTaken,
  };