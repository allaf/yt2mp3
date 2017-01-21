"use strict";

browser.runtime.sendMessage({
  query : 'clickDownload'
}).then(res => {
  if (res) {
    document.querySelector('a.btn.btn-success').click();

    // close tab
    browser.runtime.sendMessage({
      query : 'closeTab'
    });
  }
});

