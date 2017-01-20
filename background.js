var urlConvert = 'http://convert2mp3.net/en/';

var vimeo = /https:\/\/vimeo.com\/\d+/i;
var youtube = /^https?:\/\/www.youtube.com\/watch/i;
var dm = /^https?:\/\/www.dailymotion.com\/video/i;

var tabs = {};

// show extension
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.match(youtube) || tab.url.match(vimeo) || tab.url.match(dm)) {
    browser.pageAction.show(tab.id);
  }
});

var createTab = function(opts) {
  browser.tabs.create({
    url : urlConvert
  }).then(function(tab) {
    tabs[tab.id] = opts;
    browser.tabs.executeScript(tab.id, {file : 'jquery.js'}).then(
      function() {
        browser.tabs.executeScript(tab.id, {file : 'content_script_submit.js'});
      }
    );
  });
};

function reset(tabId) {
  delete tabs[tabId];
}

// send yt url to content_script page
function handleMessage(request, sender, sendResponse) {
  
  if (request.query === 'openTab' ) {
    createTab(request.opts);
  }
  
  if (request.query === "options") {
    sendResponse(tabs[sender.tab.id]);
  }
  
  if (request.query === "closeTab") {
    reset(sender.tab.id);
    setTimeout(function(){
      browser.tabs.remove(sender.tab.id);
    }, 3000);
  }
}

browser.runtime.onMessage.addListener(handleMessage);
