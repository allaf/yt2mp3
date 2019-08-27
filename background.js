"use strict";

//TODO style popup.html
//TODO loading gif
//TODO access via context menu
//TODO request video links only on url change and not every on click

var youtube = /^https?:\/\/www.youtube.com\/watch/i;

// Show extension in top bar
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.match(youtube)) {
    browser.pageAction.show(tab.id);
  }
});


/***** OPTIONS ****/
function defaultOptions() {
  browser.storage.local.get('api-key').then((res) => {
    if (res['api-key'] === undefined) {
      browser.storage.local.set({'api-key': ''});
    }
  });
}

defaultOptions();