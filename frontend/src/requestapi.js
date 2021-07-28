function request_api(path,data,callback)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", path, true); 
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Response
            var response = this.responseText;
            response = JSON.parse(response); 
            callback(response); 
        } else if (this.status == 204){ 

        }else { 
            console.log(JSON.stringify(this)); 
            alert("request error code : " + this.status); 
        }
    };
    xhttp.send(JSON.stringify(data));
}

function request_get_gamehistory() 
{
    request_api(API_PATH + "gethistory",{},function(res){
        console.log("test get hist : " + JSON.stringify(res)); 
        if(res.result != 1)
        {
            alert(" get history error : " + res.message);
            return; 
        }

        game_history = []; 
        document.getElementById("choose_history").innerText = ""; 
        var option_text = ""; 
        var i = 0; 
        for(var his of res.value) 
        {
             var w = "Draw"; 
            if(his.winner == WINNER_PLAYER)
            {
                w = "player win"; 
            }
            else if (his.winner == WINNER_AI)
            {
                w = "com win"; 
            }

            game_history.push({
                "board_size":his.board_size,
                "winner": w, 
                "all_trun":his.all_trun
            }); 

            var i = game_history.length -1; 
            option_text += "<option value='" + i + "'>" + w + " (" + his.board_size + "x" + his.board_size + ")</option>" ; 

        }

        document.getElementById("choose_history").innerHTML = option_text; 
    }); 
}

function request_save_gamehistory()
{
    var win_num = -1; 


    var play_str = ""; 
    for(var info of playboard)
    {
        if(play_str != "") 
        {
            play_str += ","; 
        }

        play_str += info;
    }

    var data = { 
        "board_size":board_size * 1,
        "winner":game_status * 1,
        "all_trun":play_str
    }
    request_api(API_PATH + "savehistory",data,function(res){
        if(res.result != 1)
        {
            alert("save game error : " + res.message);
        }
    }); 
}