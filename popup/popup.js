"use strict";

var rootContext = this;
var host = 'getvideo.p.rapidapi.com';

function fetchVideo(url, apiKey) {
  var target = "https://getvideo.p.rapidapi.com/?url=" + encodeURIComponent(url);
  return fetch(target, {
    method: 'GET',
    headers: {"x-rapidapi-host": host, "x-rapidapi-key": apiKey}
  }).then(resp => resp.json())
}

function addLinkTo(elt, id, filename) {
  var li = document.createElement('li');
  var linkName = elt.format + ' ' + elt.format_note;
  li.innerHTML += '<a href="#" id="' + id + '" filename="' + filename + '" class="link" url="' + elt.url + '"> ' + linkName + '</a>';

  document.querySelector('#linkList').appendChild(li);
}

browser.tabs.query({currentWindow: true, active: true})
.then(
    function (tabInfo) {
      var url = tabInfo[0].url;
      var context = rootContext;

      browser.storage.local.get('api-key').then((apiKey) => {
        context.fetchVideo(url, apiKey['api-key']).then(json => {
          var loading = document.querySelector('#loading');
          if (apiKey['api-key'] === undefined) {
            loading.innerHTML = "Please enter you API KEY in the addons setting !";
            return;
          }

          loading.parentNode.removeChild(loading);
          json.streams.forEach(function (elt, index) {
            var filename = json.title + elt.format + '.' + elt.extension;
            context.addLinkTo(elt, 'link_' + index, filename);
          });
        });
      });
    });

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("link")) {
    browser.tabs.query({currentWindow: true, active: true}).then(
        function (tabInfo) {
          var htmlElt = document.querySelector('#' + e.target.id);
          var url = htmlElt.getAttribute('url');
          var filename = htmlElt.getAttribute('filename');

          browser.downloads.download({
            url: url,
            filename: filename
          });
        });
  }
});
