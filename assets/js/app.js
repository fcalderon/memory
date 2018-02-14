// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";
import ReactDOM from 'react-dom';
import React from 'react';
// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

import { Game } from "./game-component";


function init() {
  let root = document.getElementById('game');
  console.log(window.location.href);
  let userName = getParameterByName('user_name', window.location.href);
  if (!userName || userName == null) {
      userName = 'anonymous'
  }
  console.log(userName);
  if (root) {
      let channel = socket.channel('games:' + userName, {});
      ReactDOM.render(<Game channel={channel}/>, root);
  }
}

// Use jQuery to delay until page loaded.
$(init);

/**
 * Source StackOverflow
 *
 * https://stackoverflow.com/a/901144/3400198
 *
 * @param name
 * @param url
 * @returns {*}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}