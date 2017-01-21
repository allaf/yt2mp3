"use strict";

function saveOptions(e) {
  browser.storage.local.set({
    'close-tab': document.querySelector("#close-tab").checked
  });
  e.preventDefault();
}

function restoreOptions() {
  browser.storage.local.get('close-tab').then((res) => {
    document.querySelector("#close-tab").checked = res['close-tab']!==undefined ? res['close-tab']: true;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
