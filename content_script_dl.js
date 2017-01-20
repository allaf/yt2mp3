
$(function() {
  // click download button
  $('a.btn.btn-success')[0].click();

  // close tab
  browser.runtime.sendMessage({
    query : 'closeTab'
  });
});


