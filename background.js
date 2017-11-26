"use strict";

/*
Create all the context menu items.
*/
var ytUrlPattern = "https://www.youtube.com/watch?v=*";
var dmUrlPattern = "http://www.dailymotion.com/video/*";
var clipFishUrlPattern = "http://www.clipfish.de/*/video/*";
var urlPatterns = [ytUrlPattern, dmUrlPattern, clipFishUrlPattern];

function addMenuEntry(id) {
  browser.contextMenus.create({
    id: id,
    title: id,
    contexts: ["link"],
    targetUrlPatterns: urlPatterns
  });
}

function addAllEntries() {  
  addMenuEntry("mp3");
  addMenuEntry("m4a");
  addMenuEntry("aac");
  addMenuEntry("flac");
  addMenuEntry("ogg");
  addMenuEntry("wma");
  
  browser.contextMenus.create({
    id: "sep",
    type: "separator",
    contexts: ["link"],
    targetUrlPatterns: urlPatterns
  });
  
  addMenuEntry("avi");
  addMenuEntry("wmv");
  addMenuEntry("3gp");
  addMenuEntry("mp4");
}

addAllEntries();

browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "mp3":
    case "m4a":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "mp4":
    case "avi":
    case "wmv":
    case "3gp":
      createTab({
        format: info.menuItemId,
        url: info.linkUrl
      });
      break;
  }
});


//////////////////////////////////
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
  var cleanUrl = opts.url.replace(/time_continue=\d+&/,'');
  browser.tabs.create({
    url : urlConvert+'format='+opts.format+'&url='+cleanUrl,
    active: false
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