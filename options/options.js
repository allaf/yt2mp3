"use strict";

var saveOptions = function(e) {
  browser.storage.local.set({
    'close-tab': document.querySelector('#close-tab').checked,
    'close-tab-delay': document.querySelector('#close-tab-delay').value,
    'dropbox': document.querySelector('#dropbox').checked,
  });
  e.preventDefault();
}

var restoreOptions = function() {
  
  browser.storage.local.get('close-tab').then((res) => {
    document.querySelector('#close-tab').checked = res['close-tab']!==undefined ? res['close-tab']: true;
    toggleTime(document.querySelector('#close-tab'));
  });
  
  browser.storage.local.get('close-tab-delay').then((res) => {    
    document.querySelector('#close-tab-delay').value = res['close-tab-delay']!==undefined ? res['close-tab-delay']: 3;
  });
  
  browser.storage.local.get('dropbox').then((res) => {
    document.querySelector('#dropbox').checked = res['dropbox']!==undefined ? res['dropbox']: false;
  });
  
}

var toggleTime = function (elt) {
  if (elt.target) elt = elt.target;
  document.querySelector('#close-tab-delay-zone').style.display = elt.checked ? '' : 'none';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector("#close-tab").onchange = toggleTime;
