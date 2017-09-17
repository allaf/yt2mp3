"use strict";

browser.runtime.sendMessage({
  query : 'clickDownload'
}).then(res => {
  if (res) {
    browser.storage.local.get('dropbox').then((res) => {
      var saveBtn;
      if (res['dropbox']) {
        saveBtn = document.querySelector('a.dropbox-dropin-btn');
      } else {
        saveBtn = document.querySelector('a.btn.btn-success');
      }
      saveBtn.click();
    });      

    // close tab
    browser.runtime.sendMessage({
      query : 'closeTab'
    });
  }
});

