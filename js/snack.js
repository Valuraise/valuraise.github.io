"use strict";
/*globals document, console, XMLHttpRequest*/
(function(global) {
  var serverHost = "http://localhost:5001/showcacse/us-central1/widgets";
  init();
  injectStyles();

  function init() {
    var embeddedwidget = document.querySelector(".valuraise-snack-root");
    var id = embeddedwidget.getAttribute("data-valuraise-snack-id");
    var apiKey = embeddedwidget.getAttribute("data-api-key");
    var processed = embeddedwidget.getAttribute("valuraise-snack-processed");
    if (!id || processed === "done") {
      //skip this one as it has either already been processed, or lacks an ID
      //This is done to ensure logic is not executed twice in the event that the
      //user erroneously embeds the script tag more than once on a single page
      console.log("skipping element:", embeddedwidget);
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var embeddedWidget = document.querySelector(".valuraise-snack-root");
      embeddedWidget.innerHTML = this.responseText;
      embeddedWidget.setAttribute("valuraise-snack-processed", "done");

      var barXhr = new XMLHttpRequest();
      var closeBtn = embeddedWidget.querySelector(".valuraise-snack-close");
      var closeFunction = function() {
        document.getElementById("valuraise-snack").style.display = "none";
      };
      attachClickListener(closeBtn, closeFunction);
      barXhr.onload = function() {
        var ajaxContent = document
          .getElementById("valuraise-snack")
          .querySelector(".ajax-response-content");
        if (ajaxContent) {
          ajaxContent.innerHTML = this.responseText;
        }
        document.getElementById("valuraise-snack").style.display = "block";
      };
      barXhr.open("GET", serverHost + "/api/message/" + apiKey);
      barXhr.setRequestHeader("Content-type", "application/json");
      barXhr.send();
    };
    xhr.open("GET", serverHost + "/widget/snack?apiKey=" + apiKey);
    xhr.send();
  }

  function injectStyles() {
    var css = `
    
    .valuraise-snack {
      font-family: Arial, Helvetica, sans-serif;
      display: none; /* Hidden by default. Visible on click */
      min-width: 250px; /* Set a default minimum width */
      max-width: 350px;
      background-color: #333; /* Black background color */
      color: #fff; /* White text color */
      text-align: ; justify ;
      line-Height: 2;
      border-radius: 2px; /* Rounded borders */
      padding: 16px; /* Padding */
      position: fixed; /* Sit on top of the screen */
      z-index: 15; /* Add a z-index if needed */
      left: 45px; /* Center the snackbar */
      top: 45px; /* 10px from the bottom */
      border-radius: 5px 5px 5px 5px;
      word-wrap: break-word;
  }
  
  
  /* Animations to fade the snackbar in and out */
  @-webkit-keyframes fadein {
      from {bottom: 0; opacity: 0;} 
      to {bottom: 30px; opacity: 1;}
  }
  
  @keyframes fadein {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
  }
  
  @-webkit-keyframes fadeout {
      from {bottom: 30px; opacity: 1;} 
      to {bottom: 0; opacity: 0;}
  }
  
  @keyframes fadeout {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
  }


    /* The Close Button */
    .valuraise-snack-close {
      color: #aaa;
      float: right;
      font-size: 20px;
      font-weight: bold;
    }
    
    .valuraise-snack-close:hover,
    .valuraise-snack-close:focus {
      color: #f44336;
      text-decoration: none;
      cursor: pointer;
    }
    * {
      padding: 0;
      margin: 0;
    }
        
    .valuraise-snack-powred-by {
      font-size: 8px;
      font-weight: bold;
      color: #888;
    }`;
    var style = document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    var head = document.head || document.querySelector("head");
    head.appendChild(style);
  }
})();

function attachClickListener(elem, listner) {
  if (elem.addEventListener) {
    elem.addEventListener("click", listner);
  } else if (elem.attachEvent) {
    elem.attachEvent("onclick", listner);
  } else {
    elem.onclick = listner;
  }
}
