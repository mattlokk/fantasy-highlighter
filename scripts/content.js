//chrome.storage.sync.clear();

var highlightColor;

chrome.storage.sync.get('players', function (data) {
  if(!data.players){
    chrome.storage.sync.set({ players: []});
  }
});

chrome.storage.sync.get('hideIrrelevant', function (data) {
  if(!data.hideIrrelevant){
    chrome.storage.sync.set({ hideIrrelevant: false });
  }
});

chrome.storage.sync.get('highlightColor', function (data) {
  if(!data.highlightColor){
    chrome.storage.sync.set({ highlightColor: "#330000" });
  }
  else{
    highlightColor = data.highlightColor;
  }
});

document.body.addEventListener('DOMNodeInserted', highlightPosts);

function highlightPosts() {
  chrome.storage.sync.get('players', (playerData) => {
      var players = playerData.players;
      chrome.storage.sync.get('hideIrrelevant', (hideData) => {
        var p = Array.prototype.slice.call(document.querySelectorAll("p"));
        for (var i = 0; i < p.length; i++) {
          var found = false;
          if (p[i].className === "title") {
            for (var j = 0; j < players.length; j++) {
              if (p[i].textContent.toLowerCase().indexOf(players[j].name.toLowerCase()) > -1) {
                found = true;
              }
            }
            if (found) {
              p[i].style.backgroundColor = highlightColor;
              p[i].parentElement.style.backgroundColor = highlightColor;
              p[i].parentElement.parentElement.style.backgroundColor = highlightColor;
              p[i].parentElement.parentElement.parentElement.style.backgroundColor = highlightColor;
            }
            else if (hideData.hideIrrelevant) {
              p[i].parentElement.parentElement.parentElement.style.display = "none";
            }
          }
        }
      });
    });
}