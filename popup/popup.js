"use strict";

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("format")) {
    browser.tabs.query({currentWindow: true, active: true}).then(
      function(tabInfo){
        var quality = document.querySelector('#' + e.target.id).getAttribute('quality');
        var format = document.querySelector('#' + e.target.id).getAttribute('name');
        browser.runtime.sendMessage({
          query: 'openTab',
          opts: {
            format: format,
            quality: quality,
            url:tabInfo[0].url
          }
        }).then(function(resp) {
          submitForm(resp);
        });
      }
    );
  }
});
