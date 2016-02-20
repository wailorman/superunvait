var background =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	eval("'use strict';if (chrome.tabs) {\n    console.log('tabs api was found');\n    chrome.tabs.onUpdated.addListener(function (tabId, data, tab) {\n\n\n        console.log('its a ibb tools background script (under listener)');\n\n        var shouldDisplayPageActionButton = tab.url.indexOf('//ok.ru/') > -1;\n\n        if (shouldDisplayPageActionButton) {\n            chrome.pageAction.show(tabId);}});} else \n\n\n\n{\n    console.error('tabs api wasn\\'t found');}\n\n\nconsole.log('its a ibb tools background script');\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB1YmxpY1xcc3JjXFxiYWNrZ3JvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJhQUFBLElBQUksT0FBTyxJQUFQLEVBQWE7QUFDYixZQUFRLEdBQVIsdUJBRGE7QUFFYixXQUFPLElBQVAsQ0FBWSxTQUFaLENBQXNCLFdBQXRCLENBQWtDLFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxHQUFkLEVBQXFCOzs7QUFHbkQsZ0JBQVEsR0FBUix1REFIbUQ7O0FBS25ELFlBQU0sZ0NBQWdDLElBQUksR0FBSixDQUFRLE9BQVIsQ0FBZ0IsVUFBaEIsSUFBOEIsQ0FBQyxDQUFELENBTGpCOztBQU9uRCxZQUFJLDZCQUFKLEVBQW1DO0FBQy9CLG1CQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBdUIsS0FBdkIsRUFEK0IsQ0FBbkMsQ0FQOEIsQ0FBbEMsQ0FGYSxDQUFqQjs7OztBQWNLO0FBQ0QsWUFBUSxLQUFSLDJCQURDLENBZEw7OztBQWtCQSxRQUFRLEdBQVIiLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZVJvb3QiOiJDOi9qZXRCcmFpbnNQcm9qZWN0cy9zdXBlcnVudmFpdCIsInNvdXJjZXNDb250ZW50IjpbImlmIChjaHJvbWUudGFicykge1xyXG4gICAgY29uc29sZS5sb2coYHRhYnMgYXBpIHdhcyBmb3VuZGApO1xyXG4gICAgY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZCwgZGF0YSwgdGFiKT0+IHtcclxuXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBpdHMgYSBpYmIgdG9vbHMgYmFja2dyb3VuZCBzY3JpcHQgKHVuZGVyIGxpc3RlbmVyKWApO1xyXG5cclxuICAgICAgICBjb25zdCBzaG91bGREaXNwbGF5UGFnZUFjdGlvbkJ1dHRvbiA9IHRhYi51cmwuaW5kZXhPZignLy9vay5ydS8nKSA+IC0xO1xyXG5cclxuICAgICAgICBpZiAoc2hvdWxkRGlzcGxheVBhZ2VBY3Rpb25CdXR0b24pIHtcclxuICAgICAgICAgICAgY2hyb21lLnBhZ2VBY3Rpb24uc2hvdyh0YWJJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG59ZWxzZXtcclxuICAgIGNvbnNvbGUuZXJyb3IoYHRhYnMgYXBpIHdhc24ndCBmb3VuZGApO1xyXG59XHJcblxyXG5jb25zb2xlLmxvZyhgaXRzIGEgaWJiIHRvb2xzIGJhY2tncm91bmQgc2NyaXB0YCk7Il19\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/src/background.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/src/background.js?");

/***/ }
/******/ ]);