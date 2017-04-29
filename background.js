"use strict";

var urlConvert = 'http://convert2mp3.net/en/index.php?p=call&';

var youtube = /^https?:\/\/www.youtube.com\/watch/i;
var dm = /^https?:\/\/www.dailymotion.com\/video/i;
var clipfish=/^https?:\/\/www.clipfish.de\/.*\/video\//i;
 
var tabs = {};

// show extension
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.match(youtube) || tab.url.match(dm) || tab.url.match(clipfish)) {
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
        browser.storage.local.get('close-tab-delay').then((delay) => {
          setTimeout(function(){
            browser.tabs.remove(sender.tab.id);
          }, delay['close-tab-delay']*1000);
        });
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
  browser.storage.local.get('close-tab-delay').then((res) => {
    if (res['close-tab-delay'] === undefined) {
      browser.storage.local.set({
        'close-tab-delay': 3
      });
    }
  });
}

defaultOptions();
browser.runtime.onMessage.addListener(handleMessage);