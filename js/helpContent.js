"use strict";
/*globals document, console, XMLHttpRequest*/
(function(global) {
  var serverHost = "http://localhost:5001/showcacse/us-central1/widgets";
  init();
  injectStyles();

  function init() {
    var valuraisewidget = document.querySelector(".valuraise-help-modal-root");
    var id = valuraisewidget.getAttribute("data-valuraise-help-modal-id");
    var apiKey = valuraisewidget.getAttribute("data-api-key");
    var processed = valuraisewidget.getAttribute(
      "valuraise-help-modal-processed"
    );
    if (!id || processed === "done") {
      //skip this one as it has either already been processed, or lacks an ID
      //This is done to ensure logic is not executed twice in the event that the
      //user erroneously embeds the script tag more than once on a single page
      console.log("skipping element:", valuraisewidget);
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var valuraiseWidget = document.querySelector(
        ".valuraise-help-modal-root"
      );
      valuraiseWidget.innerHTML = this.responseText;
      valuraiseWidget.setAttribute("valuraise-help-modal-processed", "done");
      var valuraiseWidgetButton = valuraiseWidget.querySelector(
        ".valuraise-help-modal-show-button"
      );
      if (!valuraiseWidgetButton) {
        return;
      }
      var valuraiseWidgetButtonFunction = function() {
        //TODO disable the button temporarily to prevent accidental double-click
        var valuraiseWidget = document.querySelector(
          ".valuraise-help-modal-root"
        );
        var barXhr = new XMLHttpRequest();
        var path = window.location;
        var modal = document.getElementById("valuraise-help-modal");
        var closeBtn = valuraiseWidget.querySelector(
          ".valuraise-help-modal-close"
        );
        modal.style.display = "block";
        var closeFunction = function() {
          document.getElementById("valuraise-help-modal").style.display =
            "none";
        };
        attachClickListener(closeBtn, closeFunction);
        barXhr.onload = function() {
          var result = JSON.parse(this.responseText);
          var ajaxContent = document
            .getElementById("valuraise-help-modal")
            .querySelector(".ajax-response-content");
          if (ajaxContent) {
            ajaxContent.innerHTML = JSON.stringify(result);
          }
        };
        barXhr.open(
          "GET",
          serverHost + "/api/help/" + apiKey + "/?path=" + path.pathname
        );
        barXhr.setRequestHeader("Content-type", "application/json");
        barXhr.send();
      };
      attachClickListener(valuraiseWidgetButton, valuraiseWidgetButtonFunction);
    };
    xhr.open("GET", serverHost + "/widget/helpContent?apiKey=" + apiKey);
    xhr.send();
  }

  function injectStyles() {
    var css = `.valuraise-help-modal-content {
      font-family: Arial, Helvetica, sans-serif;
    }
    .valuraise-help-modal {
      display: none; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 10; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0, 0, 0); /* Fallback color */
      background-color: rgba(0, 0, 0, 0.6); /* Black w/ opacity */
    }
    
    /* Modal Content/Box */
    .valuraise-help-modal-content {
      background-color: #fefefe;
      margin: 15% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 80%; /* Could be more or less, depending on screen size */
      border-radius: 6px 6px 6px 6px;
    }
    
    /* The Close Button */
    .valuraise-help-modal-close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    
    .valuraise-help-modal-close:hover,
    .valuraise-help-modal-close:focus {
      color: #f44336;
      text-decoration: none;
      cursor: pointer;
    }
    * {
      padding: 0;
      margin: 0;
    }
    
    .valuraise-help-modal-show-button {
      text-decoration: none;
      border-radius: 0 4px 4px 0px;
      position: fixed;
      width: 28px;
      height: 60px;
      top: 50%;
      left: 0px;
      background-color: #ff5722;
      text-align: center;
      z-index: 9;
      -webkit-transition-duration: 0.2s; /* Safari */
      transition-duration: 0.2s;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }
    
    .valuraise-help-modal-show-button:hover {
      text-decoration: none;
      background-color: #e64a19;
      width: 100px;
    }
    .valuraise-help-modal-show-button-help-text {
      text-decoration: none;   
      font-size: 16px;
      font-family: Arial, Helvetica, sans-serif;
      visibility: hidden;
      opacity: 0;
      display: block;
      color: white;
      font-weight: bold;
      transition: visibility 0s, opacity 0.5s linear;
    }
    
    .valuraise-help-modal-show-button:hover
      .valuraise-help-modal-show-button-help-text {
      text-decoration: none;
      visibility: visible;
      opacity: 1;
    }
    
    .valuraise-help-modal-show-button-float:hover .float-button {
      margin-top: 11px;
      color: white;
    }
    
    .float-button {
      margin-top: 20px;
      color:white;
    }
    
    .valuraise-help-modal-powred-by {
      font-size: 10px;
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
