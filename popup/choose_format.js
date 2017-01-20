
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("format")) {
    browser.tabs.query({currentWindow: true, active: true}).then(
      function(tabInfo){
        browser.runtime.sendMessage({
          query: 'openTab',
          opts: {
            format: e.target.id,
            url:tabInfo[0].url
          }
        }).then(function(resp) {
          submitForm(resp);
        });
      }
    );
  }
});
