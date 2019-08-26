"use strict";

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
    // if (res['api-key'] === undefined) {
    //   browser.storage.local.set({
    //     'api-key': undefined
    //   });
    // }
  });
}

defaultOptions();