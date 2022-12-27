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
    var newId = (players.length === 0)? "1" : Math.floor(players[players.length -1].id) + 1;
    var newValue = { name: txtNewValue.value, active: true, id: newId};
    players.push(newValue);
    addValueToList(newValue);    
    txtNewValue.value = "";
    chrome.storage.sync.set({players: players});
}

function addValueToList(value){
    var li = document.createElement("li");
    var del = document.createElement("button");
    del.textContent = "X";
    del.addEventListener('click', deleteValue);
    var chk = document.createElement("input");
    chk.type = "checkbox";
    chk.id = "chk" + value.id;
    chk.checked = value.active;
    chk.addEventListener('change', changeActive)
    li.append(chk);
    var name = document.createElement("label");
    name.textContent = value.name;
    name.htmlFor = "chk" + value.id;
    li.append(name);
    li.appendChild(del);
    playerList.appendChild(li);
}

function deleteValue(e){
    var child = e.target.parentNode;
    var parent = child.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, child);

    parent.removeChild(child);
    players.splice(index, 1);
    chrome.storage.sync.set({ players: players });
}

function changeActive(e){
    var id = e.target.id.substring(3);
    alert(id + ":" + e.target.checked);
    var indexToRemove;
    for (var i = 0; i < players.length; i++){
        if (players[i].id == id){
            indexToRemove = i;
        }
    }
    if (indexToRemove){
        players.splice(i, 1);
    }
    chrome.storage.sync.set({ players: players });
}