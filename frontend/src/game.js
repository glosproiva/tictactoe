const DISPLAY_MODE_START = 0; 
const DISPLAY_MODE_PLAY = 1; 

const PLAY_MODE_SELECTED = 0; 
const PLAY_MODE_FIGTH = 1; 

const WINNER_AI = 0; 
const WINNER_PLAYER = 1; 

const ID_HISTORY = "his_"; 

const API_PATH = "http://localhost:25670/v1/"

document.getElementById("historymode").style.display = "none";
document.getElementById("playmode").style.display = "none";

var display_mode = DISPLAY_MODE_START; 
var play_mode = PLAY_MODE_SELECTED; 

var player = 'X';
var ai = 'O';

var board_size = 3; 
var board = [];
var playboard = []; //=> {index:play}
var winner_forms = []; //=> array(array()); 

var currentTurn = player;
var game_status =  -1; 
var callCount = 0;





function renderBoard() {
    var count = 0;
    var table = '<table border="1">';

    for (var i = 0; i < board_size; i++) {
        table += '<tr>';
        for (var j = 0; j < board_size; j++) {
            table += '<td id="' + count + '" onclick="place(' + count + ')"></td>';
            count++;
        }
        table += '</tr>';
    }
    table += '</table>';

    document.getElementById("board").innerHTML = table;
}

function initPlaymode(){ 
    
    var optiontext = "<option style='display:none;' selected></option>"; 
    for(var i = 3 ; i < 7;i++)
    {
        optiontext += "<option value='" + i + "'>" + i + "x" + i + "</option>"; 
    }

    document.getElementById("choose_size").innerHTML = optiontext; 
    
}

function initBoard(){
    game_status = -1; 
    board = []; 
    playboard = []; 
    winner_forms = []; 
    for (var i = 0; i < board_size * board_size; i++){ 
        board.push(i); 
    }

    //  console.log("check board : " + JSON.stringify(board)); 

    //column scan -> 
    var goal_term = []; 
    for(var i = 0 ; i < board_size;i++)
    {
        goal_term = []; 
        for(var j = 0 ; j < board_size;j++)
        {
            var point = (i*board_size) + j * 1;
            goal_term.push(point);  
        }
        winner_forms.push(goal_term); 

    }
   
    //row scan 
    goal_term = []; 
    for(var i = 0 ; i < board_size;i++)
    {
        goal_term = []; 
        for(var j = 0; j < board_size;j++)
        {
            var point = i + (j*board_size) * 1; 
            goal_term.push(point);  
        }
        winner_forms.push(goal_term); 
    }
    

    goal_term = []; 
    for(var i = 0 ; i < board_size; i++)
    {
        var point = (i * board_size) + i * 1; 
        goal_term.push(point);  
    }
    winner_forms.push(goal_term); 

    goal_term = []; 
    for(var i = 0 ; i < board_size; i++)
    {
        var point = ((i + 1) * board_size) - (i + 1 * 1); 
        goal_term.push(point);  
    }
    winner_forms.push(goal_term); 

    //  console.log(" test : " + JSON.stringify(winner_forms));
}

function place(index) {
    // console.log("current board : " + JSON.stringify(board)); 
    if (board[index] == ai || board[index] == player) {
        alert('Cannot place this position');
        return;
    }

    board[index] = currentTurn;
    playboard.push(index + ":" + currentTurn); 
    // console.log("play board : " + JSON.stringify(playboard)); 
    // console.log("new board : " + JSON.stringify(board)); 
    var data = '<h3>' + currentTurn + '</h3>';
    document.getElementById(index).innerHTML = data;


    setTimeout(function () {
        if (winning(board, currentTurn)) {
            // -------- Compare x and o 
            if(currentTurn == player)
            {
                game_status = WINNER_PLAYER; 
            }
            else 
            {
                game_status = WINNER_AI; 
            }
            alert(currentTurn + ' is win');
            endgame(); 
        } else {
            changeTurn();
        }
    }, 100);
}

function isOver() {
    // console.log("isover : " + getAvailableMove(board).length); 
    return winning(board, ai) || winning(board, player) || getAvailableMove(board).length == 0;
}

function changeTurn() {
    if (isOver()) {
        //------- draw -------
        game_status = -1; 
        alert('Draw');
        endgame(); 
        return;
    }

    currentTurn = currentTurn == ai ? player : ai;

    if (currentTurn == ai) {
        //var bestAiMove = minimax(cloneBoard(board), ai);
        var bestAiMove = check(cloneBoard(board), ai); 
        place(bestAiMove.index);
        
    } else { 
        // if(getAvailableMove(board).length == 0)
        // {
        //     //------- draw -------
        //     alert('Draw');
        //     endgame(); 
        // }

    }
}

function cloneBoard() {
    tmpBoard = [];
    for (var i = 0; i < board.length; i++) {
        tmpBoard[i] = board[i];
    }
    // console.log("check tmpBoard : " + JSON.stringify(tmpBoard)); 
    return tmpBoard;
}

function check(tmpBoard, ontrun){ 
    // var aiCount = board.filter(s=>s == ai); 
    // if (isOver()) {
    //     //------- draw -------
    //     alert('Draw');
    //     endgame(); 
    //     return;
    // }

    var availableMoves = getAvailableMove(tmpBoard);
    // find ai win
    let playerCount = 0;
    let aiCount = 0;
    let nextpoint =0; 
    let inext = 0; 
    let count = 0; 
    let cmp = 0; 

    for(var winner_group of winner_forms)
    {
        playerCount = 0; 
        aiCount = 0; 
        for(var index of winner_group)
        {
            if(board[index] == ai)
            {
                aiCount++; 
            }
            else if(board[index] == player)
            {
                playerCount++; 
            }
        }

        if(board.length - availableMoves.length  == 1 && playerCount == 0)
        {
            return { index:winner_group[0] } ; 
        }
        else 
        {
            //ai win 
            if(aiCount == board_size - 1 && (playerCount + aiCount) != board_size) 
            {   //console.log("ai win");
                for(var i of winner_group)
                {
                    if(board[i] != ai)
                    {
                        return { 
                            index:i
                        }; 
                    }
                }
            }

            //Block player win
            if(playerCount == board_size-1 && (playerCount + aiCount) != board_size )
            { //console.log("block player");
                for(var i of winner_group)
                {
                    if(board[i] != player)
                    {
                        return { 
                            index:i
                        }; 
                    }
                }
            }

            
            if(playerCount < aiCount)
            {
                if(cmp < aiCount)
                {   
                    cmp = aiCount; 
                    nextpoint = count; 
                }
            }
        }

        count++; 
    }

    

    // count = 0; 
    // var way2win = new Map(); 
    // for(var v of board)
    // {
    //     var ispoint = false; 
    //     playerCount = 0; 
    //     aiCount = 0; 
    //     if(v != ai && v != player)
    //     {
    //         for(var winner_group of winner_forms)
    //         {
    //             for(var index of winner_group)
    //             {
    //                 if(count == index)
    //                 {
    //                     ispoint = true; 
    //                 }

    //                 if(board[index] == ai)
    //                 {
    //                     aiCount++; 
    //                 }
    //                 else if(board[index] == player)
    //                 {
    //                     playerCount++; 
    //                 }
    //             }

    //             if(ispoint)
    //             {
    //                 if(playerCount == 0)
    //                 {
    //                     if(way2win.has(count))
    //                     {
    //                         var r = way2win.get(count); 
    //                         r++; 
    //                         way2win.set(count,r); 
    //                     }
    //                     else 
    //                     {
    //                         way2win.set(count,0); 
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     count++; 
    // }

    // var findindex = -1; 
    // var cmppoint = -1; 
    // way2win.forEach(function (value, key) {
    //     if(cmppoint < value)
    //     {
    //         findindex = key; 
    //     }
    // }); 

    // if(findindex > -1)
    // {
    //      console.log("best way"); 
    //     return { index: findindex}; 
    // }

    // for(var winner_group of winner_forms)
    // {
    //     playerCount = 0; 
    //     aiCount = 0; 
    //     for(var index of winner_group)
    //     {
    //         if(board[index] == ai)
    //         {
    //             aiCount++; 
    //         }
    //         else if(board[index] == player)
    //         {
    //             playerCount++; 
    //         }
    //     }

    //     if(playerCount == 0 && aiCount == 0)
    //     {console.log("new opp : " + playerCount);
    //         return {
    //             index:winner_group[0]
    //         };
    //     }

    //     if(playerCount < aiCount)
    //     {
    //         if(cmp < aiCount)
    //         {   
    //             cmp = aiCount; 
    //             nextpoint = count; 
    //         }
    //     }
    // }

    for(var i of winner_forms[nextpoint])
    {       //console.log("next win: " + i); 
        if(board[i] != ai && board[i] != player)
        {     //console.log("next win 2: " + i); 
            return { 
                index:i
            };
        }
    }

    // console.log("test : " + inext + " val  =" + board[inext]); 
    if(inext == 0 && (board[inext] == ai || board[inext] == player ))
    {
        // console.log("index 2: " + inext); 
        for(var index of availableMoves)
        {
            inext = index; 
            break; 
        }
    }
    // console.log("index : " + inext); 

    return {index:inext}; 

}

function minimax(tmpBoard, ontrun) {
    callCount++;
    //  console.log("test call : " + callCount)
    var availableMoves = getAvailableMove(tmpBoard);
    if (winning(tmpBoard, ontrun)) {
        return {
            score: -10
        };
    } else if (winning(tmpBoard, ai)) {
        return {
            score: 10
        };
    } else if (availableMoves.length === 0) {
        return {
            score: 0
        };
    } else {
        var moves = [];

        for (var i = 0; i < availableMoves.length; i++) {
            var move = {};
            move.index = availableMoves[i];

            tmpBoard[move.index] = ontrun;

            if (ontrun == ai) {
                var result = minimax(tmpBoard, player);
                move.score = result.score;
            } else {
                var result = minimax(tmpBoard, ai);
                move.score = result.score;
            }

            tmpBoard[move.index] = move.index;

            moves.push(move);
        }

        var bestMove;
        if (ontrun === ai) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

}

function winning(tmpBoard, player) {
    var towin = false; 
    for(var winner_group of winner_forms)
    {  //console.log("winner_group is " + JSON.stringify(winner_group)); 
        var iswin = true;
        for(var index of winner_group)
        { //console.log("index is " + JSON.stringify(index)); 
            if(tmpBoard[index] != player)
            {
                iswin = false; 
                break;  
            }
        }

        if(iswin)
        {
            towin = true; 
            break; 
        }
    }

    return towin; 
}

function getAvailableMove(tmpBoard) {
    var x =  tmpBoard.filter(s => s != player && s != ai);
    return x; 
}

function endgame(){ 
    click_back(); 
    //send to database 
    request_save_gamehistory(); 
}



function selected_boardsize(){ 
    if(play_mode == PLAY_MODE_SELECTED)
    {
        play_mode = PLAY_MODE_FIGTH; 
        document.getElementById("playmode_select").style.display = "none";
        document.getElementById("playmode_play").style.display = "block";

        board_size = document.getElementById("choose_size").value; 
        document.getElementById("lbl_size").innerText = board_size + "x" + board_size; 
        currentTurn = player;
        initBoard(); 
        renderBoard();
    }
}

function click_playgame(){ 
    document.getElementById("startmode").style.display = "none";
    document.getElementById("historymode").style.display = "none";
    document.getElementById("playmode").style.display = "block";

    play_mode = PLAY_MODE_SELECTED; 
    document.getElementById("playmode_select").style.display = "block";
    document.getElementById("playmode_play").style.display = "none";
}

function click_history(){ 
    request_get_gamehistory(); 

    document.getElementById("startmode").style.display = "none";
    document.getElementById("historymode").style.display = "block";
    document.getElementById("playmode").style.display = "none";
}

function click_back(){
    document.getElementById("startmode").style.display = "block";
    document.getElementById("historymode").style.display = "none";
    document.getElementById("playmode").style.display = "none";
}


initPlaymode(); 