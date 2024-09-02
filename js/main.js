
      const board = document.getElementById("TableDesCases");
      const moadl = document.getElementById("modal");
      const modalMessage = document.getElementById("modalMessage");

      let currentPlayer = "X";

      const rows = 20;
      const cols = 20;

      let gameBoard = [];

      for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
          row.push(null);
        }
        gameBoard.push(row);
      }

      function drawBoard(rows, cols) {
        board.innerHTML = "";

        board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
        board.style.gridTemplateRows = `repeat(${rows}, 30px)`;

        for (let i = 0; i < rows * cols; i++) {
          const caseDiv = document.createElement("div");
          caseDiv.classList.add("caseStyle");
          caseDiv.dataset.index = i;
          caseDiv.addEventListener("click", clickXO);
          board.appendChild(caseDiv);
        }
        updateHoverClass();
      }

      function clickXO(event) {
        const CasedivClick = event.target;
        const index = CasedivClick.dataset.index;
        console.log(index);
        const row = Math.floor(index / cols);
        const col = index % cols;

        if (gameBoard[row][col] !== null) {
          CasedivClick.style.cursor = "Not-allowed";
          return;
        }

        CasedivClick.textContent = currentPlayer;
        CasedivClick.classList.add(currentPlayer.toLowerCase());

        gameBoard[row][col] = currentPlayer;

        if (checkWinner(row, col, currentPlayer)) {
          moadl.style.display = "block";
          modalMessage.textContent = "Player  " + currentPlayer + " a gagné !";
          document.getElementById("turnParent").style.display = "none";
          
          return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        const turnMessage = document.getElementById("turnmessage");
        turnMessage.textContent = `Player ${currentPlayer} Turn`;
        turnMessage.classList.remove("x-turn", "o-turn");
        turnMessage.classList.add(currentPlayer === "X" ? "x-turn" : "o-turn");
        document.body.style.backgroundColor =
          currentPlayer === "O" ? "#007bff" : "#28a745";
        updateHoverClass();
      }

      function checkWinner(row, col, player) {

        let winningCells = [];

        let horizontalCount =  countInDirection(row, col, player, 1, 0,winningCells) + countInDirection(row, col, player, -1, 0,winningCells);

        let verticalCount = countInDirection(row, col, player, 0, 1,winningCells) + countInDirection(row, col, player, 0, -1,winningCells);

        let diagonalDescCount = countInDirection(row, col, player, 1, 1,winningCells) + countInDirection(row, col, player, -1, -1,winningCells);

       
        let diagonalAscCount = countInDirection(row, col, player, 1, -1,winningCells) + countInDirection(row, col, player, -1, 1,winningCells);

        if (
          horizontalCount >= 4 ||
          verticalCount >= 4 ||
          diagonalDescCount >= 4 ||
          diagonalAscCount >= 4
        ) {

            

            winningCells.push(document.querySelector(`[data-index="${row * cols + col}"]`));

            
            winningCells.forEach((cell, index) => {
                setTimeout(() => {
                    cell.classList.add("winning-cell");
                }, index * 100); 
            });

            

           
        
          updateScore(player);
          return true; 
        }

        return false; 
      }

      function countInDirection(row, col, player, rowDirection, colDirection,winningCells) {

        let currentRow = row + rowDirection; 
        let currentCol = col + colDirection; 
        let count = 0;
        
        
        while (
          currentRow >= 0 &&
          currentRow < rows &&
          currentCol >= 0 &&
          currentCol < cols &&
          gameBoard[currentRow][currentCol] === player
        ) {
          count++; 
          winningCells.push(document.querySelector(`.caseStyle[data-index="${currentRow * cols + currentCol }"]`));
          currentRow = currentRow + rowDirection; 
          currentCol = currentCol+ colDirection; 

        }

        return count; 
        
      }

     
      let scoreX = 0;
      let scoreO = 0;


      function saveScores() {
        localStorage.setItem('scoreX', scoreX);
        localStorage.setItem('scoreO', scoreO);
      }

      function updateScore(winner) {
        if (winner === "X") {
          scoreX++;
          document.getElementById("XscoreNumber").textContent = scoreX;
        } else if (winner === "O") {
          scoreO++;
          document.getElementById("OscoreNumber").textContent = scoreO;
        }
        saveScores();
      }

      function loadScores() {
        const storedScoreX = localStorage.getItem('scoreX');
        const storedScoreO = localStorage.getItem('scoreO');
        
        if (storedScoreX !== null) {
          scoreX = parseInt(storedScoreX, 10);
          document.getElementById("XscoreNumber").textContent = scoreX;
        }
        
        if (storedScoreO !== null) {
          scoreO = parseInt(storedScoreO, 10);
          document.getElementById("OscoreNumber").textContent = scoreO;
        }
      }
        
      
      window.onload = function() {
        loadScores();
        drawBoard(rows, cols);
      };
      

      
      

      




      function updateHoverClass() {
        const allCases = document.querySelectorAll(".caseStyle");
        allCases.forEach((DivCase) => {
          DivCase.classList.remove("x-hover", "o-hover");
          DivCase.classList.add(currentPlayer === "X" ? "x-hover" : "o-hover");
        });
      }

      function resetGame() {
        gameBoard = [];
        for (let i = 0; i < rows; i++) {
          let row = [];
          for (let j = 0; j < cols; j++) {
            row.push(null);
          }
          gameBoard.push(row);
        }

        drawBoard(rows, cols);
        currentPlayer = "X";
        document.body.style.backgroundColor = "#28a745";
      }

      drawBoard(rows, cols);

      function continuegame() {
        document.getElementById("turnParent").style.display = "flex";
        resetGame();
        moadl.style.display = "none";
      }

      function restartgame() {
        document.getElementById("turnParent").style.display = "flex";
        resetGame();
        scoreX = 0; 
        scoreO = 0; 
        saveScores();
        document.getElementById("XscoreNumber").textContent = scoreX;
        document.getElementById("OscoreNumber").textContent = scoreO;
        moadl.style.display = "none";
        document.body.style.backgroundColor = "#28a745";

      }
    