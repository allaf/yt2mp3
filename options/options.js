"use strict";

var saveOptions = function (e) {
  browser.storage.local.set({
    'api-key': document.querySelector('#api-key').value
  });
  e.preventDefault();
}

var restoreOptions = function () {
  browser.storage.local.get('api-key').then((res) => {
    document.querySelector('#api-key').value = res['api-key'];
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
