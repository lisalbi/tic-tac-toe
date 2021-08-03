(function() {
    const Gameboard = (()=> {
        let _gameboard = ['', '', '', '', '', '', '', '', ''];
        const getBoard = () => {
            return _gameboard;
        }
        const resetBoard = () => {
            _gameboard = ['', '', '', '', '', '', '', '', ''];
        }
        const updateBoard = (player, index) => {
            if (player === null) {
                _gameboard[index] = '';
            }
            else {
                _gameboard[index] = player.getSign();
            }
        }
        return {getBoard, resetBoard, updateBoard};
    })();
    
    const displayController = (()=> {
        const boardObjects = document.getElementsByClassName('field');
        const restartBtn = document.querySelector('#restart');
        const outcome = document.querySelector('#outcome');
        let activeGame = true;

        const restart = () => {
            restartBtn.textContent = 'Restart';
            Gameboard.resetBoard();
            displayBoard();
            outcome.textContent = '';
            activeGame = true;
        }
        restartBtn.addEventListener('click', restart);
        Array.from(boardObjects).forEach((boardObject, index) => {
            boardObject.addEventListener('click', function() {
                if (activeGame) {
                    gameController.humanTurn(index);
                } 
            });
        });
        
        const displayBoard = () => {
            document.querySelector('.whosTurn').textContent = gameController.whosTurn();
            for (i = 0; i < boardObjects.length; i++){
                boardObjects[i].textContent = Gameboard.getBoard()[i];
            }
        }
        const showOutcome = (winner) => {         
            restartBtn.textContent = 'Play Again';   
            activeGame = false;
            if (winner === 'tie') {
                outcome.textContent = 'It\'s a tie! 🎉';
            }
            else if (winner === 'x') {
                outcome.textContent = 'Congrats! You win! 🎉';
            }
            else {
                outcome.textContent = 'The AI wins! 🎉';
            }
        }

        return {
            restart,
            displayBoard,
            showOutcome
        };
    })();

    const Player = (sign) => {
        const getSign = () => {
            return sign;
        }
        return {
            getSign
        }
    }

    const gameController = (() => {
        const _humanPlayer = Player('x');
        const _aiPlayer = Player('o');
        const mode = 'smartAI';
        let currentPlayer = _humanPlayer;
        const checkForWin = () => {
            const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
            for (combo of winningCombos) {
                if (Gameboard.getBoard()[combo[0]] !== '' && Gameboard.getBoard()[combo[0]] === Gameboard.getBoard()[combo[1]] && 
                Gameboard.getBoard()[combo[1]] === Gameboard.getBoard()[combo[2]] &&
                Gameboard.getBoard()[combo[2]] === Gameboard.getBoard()[combo[0]]) {
                    return Gameboard.getBoard()[combo[0]];
                }
            }
            for (let i = 0; i < 9; i++) {
                if (!Gameboard.getBoard()[i]) {
                    return null;
                }
            }
            return 'tie';
        }


        const humanTurn = (index)=> {
            if (Gameboard.getBoard()[index] === '') {
                Gameboard.updateBoard(currentPlayer, index);
                displayController.displayBoard();
                if (checkForWin() !== null) {
                    endGame(checkForWin());
                }
                else {
                    currentPlayer = _aiPlayer;
                    setTimeout(aiTurn, 500);
                }
            }
        }

        const aiTurn = () => {
            if (Gameboard.getBoard().includes('')) {
                let index;
                if (mode === 'randomAI') {
                    while (true) {
                        index = Math.floor(Math.random() * 9);
                        if (Gameboard.getBoard()[index] === '') {
                            break;
                        }
                    }
                }
                else {
                    console.log('smart ai...');
                    index = bestMove();
                }
                Gameboard.updateBoard(currentPlayer, index);
                displayController.displayBoard();
                if (checkForWin() !== null) {
                    endGame(checkForWin());
                }
                else {
                    currentPlayer = _humanPlayer;
                }
            }
        }

        function bestMove() {
            let bestScore = -Infinity;
            let move;
            for (let i = 0; i < 9; i++) {
                if (Gameboard.getBoard()[i] === '') {
                    Gameboard.updateBoard(_aiPlayer, i);
                    let score = minimax(Gameboard.getBoard(), 0, false);
                    Gameboard.updateBoard(null, i);
                    if (score > bestScore) {
                        bestScore = score;
                        move = i;
                    }
                }
            }
            return move;
          }
          
          let scores = {
            o: 10,
            x: -10,
            tie: 0
          };
          
          function minimax(board, depth, isMaximizing) {
            let result = checkForWin();
            if (result !== null) {
              return scores[result];
            }
          
            if (isMaximizing) {
              let bestScore = -Infinity;
              for (let i = 0; i < 9; i++) {
                  if (Gameboard.getBoard()[i] === '') {
                    Gameboard.updateBoard(_aiPlayer, i);
                    let score = minimax(board, depth + 1, false);
                    Gameboard.updateBoard(null, i);
                    bestScore = Math.max(score, bestScore);
                  }
              }
              return bestScore;
            } else {
              let bestScore = Infinity;
              for (let i = 0; i < 9; i++) {
                  if (Gameboard.getBoard()[i] === '') {
                    Gameboard.updateBoard(_humanPlayer, i);
                    let score = minimax(board, depth + 1, true);
                    Gameboard.updateBoard(null, i);
                    bestScore = Math.min(score, bestScore);
                  }
              }
              return bestScore;
            }
          }
          

    

        const whosTurn = () => {
            if (currentPlayer === _humanPlayer) {
                return 'Human turn';
            }
            else {
                return 'AI turn';
            }
        }

        const endGame = (winner) => {
            currentPlayer = _humanPlayer;
            displayController.showOutcome(winner);
        }

        return {
            checkForWin,
            humanTurn,
            aiTurn,
            whosTurn,
            endGame
        };

    })();

})();
