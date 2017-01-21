"use strict";

var urlConvert = 'http://convert2mp3.net/en/index.php?p=call&';

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
    url : urlConvert+'format='+opts.format+'&url='+opts.url
  }).then(res => {
    tabs[res.id] = {};
  })
};

// send yt url to content_script page
function handleMessage(request, sender, sendResponse) {
  
  if (request.query === 'openTab' ) {
    createTab(request.opts);
  }

  if (request.query === 'clickDownload' ) {
    sendResponse(tabs[sender.tab.id]);
  }
  
  if (request.query === "closeTab" && tabs[sender.tab.id]) {
    delete tabs[sender.tab.id];
    browser.storage.local.get('close-tab').then((res) => {
      if (res['close-tab']) {
        setTimeout(function(){
          browser.tabs.remove(sender.tab.id);
        }, 3000);
      }
    });
  }
}

function defaultOptions() {
  browser.storage.local.get('close-tab').then((res) => {
    if (res['close-tab'] === undefined) {
      browser.storage.local.set({
        'close-tab': true
      });
    }
  });
}

defaultOptions();
browser.runtime.onMessage.addListener(handleMessage);