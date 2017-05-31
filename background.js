var lastTabId = 0;
var tab_clicks = {};
var timer = null;

chrome.tabs.onSelectionChanged.addListener(function(tabId) {
  lastTabId = tabId;
  chrome.pageAction.show(lastTabId);
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  lastTabId = tabs[0].id;
  chrome.pageAction.show(lastTabId);
});

// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  // chrome.tabs.sendMessage(tab.id, {addNote: 'nothing'}, function () {});
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, {}, function(response) {
      // 初始化完成
      clearInterval(timer);
      drawIcon(response.num);
    });
  });
});

chrome.runtime.onMessage.addListener(function(data, dender, sendResponse){
  clearInterval(timer);
  drawIcon(data.num);
});

function drawIcon(num) {
  chrome.pageAction.setIcon({imageData: draw(num), tabId: lastTabId});
  return true;
}

function draw(num) {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#FFEB55";
  context.fillRect(0, 0, canvas.width, canvas.height);
  if (num) {
    context.fillStyle = "#9BE7FF";
    context.fillRect(canvas.width -14, canvas.height-15, canvas.width, canvas.height);
    context.strokeText(num || '', canvas.width-12, canvas.height-3);
  }
  return context.getImageData(0, 0, 25, 25);
}

timer = setInterval(function(){
  drawIcon();
}, 2000);


