const gameBoard = (function (){
    const board = [[null,null,null],[null,null,null],[null,null,null]];

    function checkWin(){
        for(let i = 0; i < 3; i++){
            let result = board[i].every((currentValue,index,arr) => {
                if (index === 0){
                    return true;
                }
                else{
                    if (arr[index-1] === currentValue && currentValue !== null)
                    {
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            });
            if (result){
                return true;
            }       
        }
        for (let i = 0; i < 3; i++){
            if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] !== null){
                return true;
            }

        }
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] !== null){
            return true;
        }
        if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] !== null){
            return true;
        }
        return false;
    }

    function checkDraw(){
        for (elem of gameBoard.board.flat()){
            if (elem == null || elem === undefined){
                return false;
            }
        }
        return true;
    }
    return {board,checkWin,checkDraw};
})();

const Player = function(name,selection) {
    return {name,selection};
};
const gameFlow = (function(){
    const player1 = Player("Player1","X");
    const player2 = Player("Player2","0");
    function playRound(indexPosition){

        indexPosition = indexPosition.split("").map((item) => Number(item));
        if (gameBoard.board[indexPosition[0]][indexPosition[1]] == null){
            return indexPosition;
        }
        else{
            return false;
        }  
    }

    function positionInsert(player,position){
        gameBoard.board[position[0]][position[1]] = player.selection;
        domController.domInsert(position,player);
    }

    return {player1,player2,playRound,positionInsert};
    
})();

function gameController(strPos,currentPlayer,previousPlayer){
    if (!gameBoard.checkWin()){
        let position = gameFlow.playRound(strPos);
        if (position === false){
            return "empty";
        }
        gameFlow.positionInsert(currentPlayer,position);
            

        }
     if (gameBoard.checkWin()){
        console.log(`${currentPlayer.name} Wins!!`);
        return "win";
    }
    if (gameBoard.checkDraw()){
        console.log("draw");
        return "Draw";
    }
}



let domController = (function(){
    function gameStart(){
        let startBtn = document.querySelector(".start");
        let gameInProgress = document.querySelector(".gameInProgress");
        startBtn.addEventListener("click",(e) => {
            domController.getName();
            let startContainer = document.querySelector(".startContainer");
            startContainer.setAttribute("style","display: none");
            gameInProgress.classList.add("gameOn");
            let player1Div = document.querySelector(".player1");
            let player2Div = document.querySelector(".player2");
            player1Div.classList.add("on");
            gameInProgress.classList.add("one");
            fetchIndex(gameInProgress,player1Div,player2Div);
        });        
    }
    function fetchIndex(gameInProgress,player1Div,player2Div){
        let gridContainer = document.querySelector(".gridContainer");
        let currentPlayer = gameFlow.player1;
        let previousPlayer;
        gridContainer.addEventListener("click",function eventHandler(e){
            if (e.target.getAttribute("class") == "cell"){
                
                let result = gameController(e.target.getAttribute("id").slice(1),currentPlayer,previousPlayer);
                if (result != "empty" && (result != "win" && result!= "Draw") ){
                if (currentPlayer == gameFlow.player1){
                    e.target.style = "color: blue";
                    currentPlayer = gameFlow.player2;
                    gameInProgress.classList.remove("one");
                    gameInProgress.classList.add("two");
                    player1Div.classList.remove("on");
                    player2Div.classList.add("on");
                    previousPlayer = gameFlow.player1;
                }
                else{
                    currentPlayer = gameFlow.player1;
                    previousPlayer = gameFlow.player2;
                    gameInProgress.classList.remove("two");
                    gameInProgress.classList.add("one");
                    player1Div.classList.add("on");
                    player2Div.classList.remove("on");
                }
            }
                if (result == "win" || result == "Draw"){
                    gridContainer.removeEventListener("click",eventHandler);
                    resultHandler(result,currentPlayer);
                }

               
            }
    });
}
    function domInsert(id,player){
        id = id.join('');
        let gridCell = document.querySelector(`#c${id}`);
        gridCell.textContent = player.selection;
    }

    function getName(){
        let player1Name = document.querySelector("#name1");
        let player2Name = document.querySelector("#name2");
        player1Name = player1Name.value;
        player2Name = player2Name.value;
        gameFlow.player1.name = player1Name;
        gameFlow.player2.name = player2Name;
        let player1Div = document.querySelector(".player1");
        let player2Div = document.querySelector(".player2");
        player1Div.textContent = player1Name;
        player2Div.textContent = player2Name;
    }
    function resultHandler(result,currentPlayer){
        let dialog = document.querySelector("dialog");
        let resultBox = document.querySelector(".resultBox");
        let resultPara = document.querySelector(".resultPara");
        let playAgain = document.querySelector(".playAgain");
        if (result == "win")
        {
            resultPara.textContent = `${currentPlayer.name} Wins!!`;
        }
        else{
            resultPara.textContent = `DRAW!`;
        }
        dialog.showModal();
        playAgain.addEventListener("click",(e) => {
            dialog.close();
            window.location.reload();
        });
         
    }
    
    return {gameStart,fetchIndex,domInsert,getName};
    
})();

function finalController(){
    domController.gameStart();
}

finalController();