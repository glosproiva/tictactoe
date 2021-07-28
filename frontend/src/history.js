var game_history = []; 
var current_trun_history; 
var current_history; 

function replayBoardHistory(){ 
    cleanBoardHistory(); 
    document.getElementById("back_btn").disabled = true; 
    document.getElementById("replay_btn").disabled = true; 

    current_trun_history = 0; 
    replaypointhistory(); 
}

function replaypointhistory(){ 
    setTimeout(function () {
        var size = current_history.board_size * current_history.board_size;
        if( current_trun_history < size)
        {
            unpackPointHistory(current_trun_history); 
            replaypointhistory(); 
        }
        else 
        {
            document.getElementById("back_btn").disabled = false; 
            document.getElementById("replay_btn").disabled = false; 
        }
        current_trun_history++;
    },300); 
}

function unpackPointHistory(index){ 
    var pack = current_history.all_trun.split(",");
    // console.log("get  pack : " + JSON.stringify(pack)); 
    if(index < pack.length)
    {
        var v = pack[index].split(":"); 
        if(v.length > 1) 
        {
            pointBoardHistory(v[0],v[1]); 
        }
    }
  
}

function allPointBoardHistory(){
    // cleanBoardHistory(); 
    renderBoardHistory(); 
    if(current_history != null) 
    {
        var size = current_history.board_size * current_history.board_size; 
        if(size != null) 
        {
           var pack = current_history.all_trun.split(",");
           for(var i = 0 ; i < pack.length;i++)
           {
            unpackPointHistory(i); 
           }
        }
    }
}

function pointBoardHistory(index,pl){ 
    if(current_history != null) 
    {
        var size = current_history.board_size * current_history.board_size; 
        if(size != null) 
        {
            document.getElementById(ID_HISTORY + index).innerText = pl; 
        }
    }
}

function cleanBoardHistory(){ 
    if(current_history != null) 
    {
        var size = current_history.board_size * current_history.board_size; 
        if(size != null) 
        {
            for(var i = 0 ; i < size;i++) 
            {
                document.getElementById(ID_HISTORY + i).innerText = ""; 
            }
        }
    }
}

function renderBoardHistory(){ 
    var count = 0;
    var table = '<table border="1">';

    for (var i = 0; i < board_size; i++) {
        table += '<tr>';
        for (var j = 0; j < board_size; j++) {
            table += '<td id="' + ID_HISTORY + count + '"></td>';
            count++;
        }
        table += '</tr>';
    }
    table += '</table>';

    document.getElementById("board_his").innerHTML = table;
}

function displayhislbl(size,win){ 
    document.getElementById("history_lbl_size").innerText = win + " (" + size + "x" + size + ")"; 
}

function selected_history(){ 
    var index = document.getElementById("choose_history").value; 
    if(index < game_history.length) 
    {
        current_history = game_history[index]; 
        displayhislbl(current_history.board_size,current_history.winner); 
        allPointBoardHistory(); 
    }
    
}