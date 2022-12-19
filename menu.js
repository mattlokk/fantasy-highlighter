var players, hide, highlightColor;
var playerList = document.getElementById('playerList');

chrome.storage.sync.get('players', function(data){
    players = data.players;
    for (var i = 0; i < players.length; i++){
        addValueToList(players[i]);
    }
});

chrome.storage.sync.get('highlightColor', function(data){
    debugger;
    highlightColor = data.highlightColor;    
    document.getElementById('highlightColor').value = highlightColor;
    //document.getElementById('highlightColor').addEventListener('load',  focus);
});

chrome.storage.sync.get('hideIrrelevant', function(data){
    hide = data.hideIrrelevant;
    document.getElementById('chkHide').checked = hide;
});

document.getElementById('body').addEventListener('load',  focus);
document.getElementById('highlightColor').addEventListener('change',  changeColor);
document.getElementById('btnAddNewValue').addEventListener('click',  addNewValue);
document.getElementById('txtNewValue').addEventListener('keypress',  keyPress);
document.getElementById('chkHide').addEventListener('change',  changeHide);

function changeColor(e){    
    chrome.storage.sync.set({ highlightColor: e.target.value });
}

function changeHide(){
    hide = !hide;
    document.getElementById('chkHide').checked = hide;
    chrome.storage.sync.set({hideIrrelevant: hide});
    
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        chrome.tabs.reload(arrayOfTabs[0].id);
    });
}

function focus(){
    document.getElementById('txtNewValue').focus()
}

function keyPress(e){
    if(e.keyCode === 13){
        addNewValue();
    }
}

function addNewValue(){
    var txtNewValue = document.getElementById('txtNewValue');
    var newValue = txtNewValue.value;
    players.push(newValue);
    addValueToList(newValue);    
    txtNewValue.value = "";
    chrome.storage.sync.set({players: players});
}

function addValueToList(value){
    var li = document.createElement("li");
    li.textContent = value;
    var del = document.createElement("button");
    del.textContent = "X";
    del.addEventListener('click', function(e){
        var child = e.target.parentNode;
        var parent = child.parentNode;
        var index = Array.prototype.indexOf.call(parent.children, child);

        parent.removeChild(child);
        players.splice(index, 1);
        chrome.storage.sync.set({ players: players });
    });
    li.appendChild(del);
    playerList.appendChild(li);
}