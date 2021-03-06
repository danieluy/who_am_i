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
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	const Player = __webpack_require__(5);

	// window.addEventListener("beforeunload", function (e) {
	//   e.returnValue = "";
	//   return confirmationMessage;
	// });

	document.addEventListener("DOMContentLoaded", function (event) {
	  $main.init();
	});

	var $main = {

	  username: undefined,
	  gameId: undefined,
	  player: undefined,
	  game_started: false,
	  my_turn: undefined,
	  playersList: [],

	  init: function () {
	    this.socket = io();
	    this.domCache();
	    if (this.socket) {
	      this.socket.on('ERROR', this.errorHandler.bind(this));
	      this.socket.on('TEST', this.logTest.bind(this));
	      this.socket.on('inputCharacterDone', this.inputCharacterDone.bind(this));
	      this.socket.on('gameCreated', this.gameCreatedJoined.bind(this));
	      this.socket.on('updatePlayers', this.updatePlayers.bind(this));
	      this.socket.on('gameJoined', this.gameCreatedJoined.bind(this));
	      this.socket.on('gameStarted', this.gameStarted.bind(this));
	    }
	  },

	  logTest: function (data) {
	    console.log('<<< TEST >>>')
	    console.log(data)
	  },

	  domCache: function () {
	    this.start_wrapper = document.getElementsByClassName('start-wrapper')[0];
	    this.select_character_wrapper = document.getElementsByClassName('select-character-wrapper')[0];
	    this.start_game_wrapper_owner = document.getElementsByClassName('start-game-wrapper-owner')[0];
	    this.start_game_wrapper_not_owner = document.getElementsByClassName('start-game-wrapper-not-owner')[0];
	    this.players_wrapper = document.getElementById('players-wrapper');
	    this.players_preview_wrapper = document.getElementById('players-preview-wrapper');
	    this.new_game_button = document.getElementById('new-game-button');
	    this.join_game_button = document.getElementById('join-game-button');
	    this.input_character_button = document.getElementById('input-character-button');
	    this.game_id = document.getElementById('game-name');
	    this.character_name = document.getElementById('character-name');
	    this.player_name = document.getElementById('player-name');
	    this.start_game_button = document.getElementById('start-game-button');
	    this.domListeners();
	  },

	  domListeners: function () {
	    this.new_game_button.addEventListener('click', this.createGame.bind(this));
	    this.join_game_button.addEventListener('click', this.joinGame.bind(this));
	    this.input_character_button.addEventListener('click', this.inputCharacter.bind(this));
	    this.start_game_button.addEventListener('click', this.startGame.bind(this));
	  },

	  startGame: function () {
	    this.socket.emit('startGame', {
	      gameId: this.gameId
	    });
	  },

	  gameStarted: function () {
	    this.players_wrapper.classList.remove('hidden');
	    if (this.player.owner)
	      this.start_game_wrapper_owner.classList.add('hidden');
	    else
	      this.start_game_wrapper_not_owner.classList.add('hidden');
	    this.players_preview_wrapper.classList.add('hidden');
	    this.game_started = true;
	  },

	  createGame: function (e) {
	    this.username = this.player_name.value;
	    this.gameId = this.game_id.value;
	    this.socket.emit('createGame', {
	      gameId: this.gameId,
	      username: this.username
	    });
	  },

	  gameCreatedJoined: function (data) {
	    this.player = data.player;
	    this.start_wrapper.classList.add('hidden');
	    this.select_character_wrapper.classList.remove('hidden');
	  },

	  joinGame: function () {
	    this.username = this.player_name.value;
	    this.gameId = this.game_id.value;
	    this.socket.emit('joinGame', {
	      gameId: this.gameId,
	      username: this.username
	    });
	  },

	  inputCharacter: function () {
	    this.socket.emit('inputCharacter', {
	      gameId: this.gameId,
	      character: this.character_name.value
	    });
	  },

	  inputCharacterDone: function () {
	    this.select_character_wrapper.classList.add('hidden');
	    if (this.player.owner)
	      this.start_game_wrapper_owner.classList.remove('hidden');
	    else
	      this.start_game_wrapper_not_owner.classList.remove('hidden');
	    this.players_preview_wrapper.classList.remove('hidden');
	  },

	  updatePlayers: function (players) {
	    this.playersList = [];
	    for (var key in players) {
	      this.playersList.push(new Player({
	        id: players[key].id,
	        name: players[key].name,
	        owner: players[key].owner,
	        character: players[key].character || undefined
	      }));
	    }
	    if (this.game_started)
	      this.render.players.call(this);
	    else
	      this.render.playersPreview.call(this);
	  },

	  render: {
	    alertOk: function (message) {
	      console.log(message);
	      alert(message)
	    },
	    alertError: function (message) {
	      console.error(message);
	      alert(message)
	    },
	    playersPreview: function () {
	      this.players_preview_wrapper.innerHTML = '';
	      for (var i = 0; i < this.playersList.length; i++)
	        this.players_preview_wrapper.appendChild(this.playersList[i].preview());
	    },
	    players: function () {
	      this.players_wrapper.innerHTML = '';
	      for (var i = 0; i < this.playersList.length; i++) {
	        this.players_wrapper.appendChild(this.playersList[i].view());
	      }
	    }
	  },

	  // {
	  //   "id": "TOkdu-sy8e21ZeaEAAAC",
	  //   "name": "asd",
	  //   "owner": true,
	  //   "character": {
	  //     "id": "-ZAbcXaNevKkRXrqAAAE",
	  //     "description": "qwe",
	  //     "qa": []
	  //   }
	  // }
	  // {
	  //   "id": "-ZAbcXaNevKkRXrqAAAE",
	  //   "name": "qwe",
	  //   "owner": false,
	  //   "character": {
	  //     "id": "TOkdu-sy8e21ZeaEAAAC",
	  //     "qa": []
	  //   }
	  // }

	  errorHandler: function (err) {
	    if (err.code === 'parameterMismatch') {
	      console.error(err.message);
	      this.render.alertError(err.message);
	    }
	    if (err.code === 'duplicatedGame') {
	      console.error(err.message);
	      this.render.alertError(err.message);
	      this.username = undefined;
	      this.gameId = undefined;
	    }
	    if (err.code === 'noGame') {
	      console.error(err.message);
	      this.render.alertError(err.message);
	      this.username = undefined;
	      this.gameId = undefined;
	    }
	    if (err.code === 'duplicatedCharacter') {
	      console.error(err.message);
	      this.render.alertError(err.message);
	    }
	    if (err.code === 'unableToStart') {
	      console.error(err.message);
	      this.render.alertError(err.message);
	    }
	  }

	}

	module.exports = $main;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "/*--  Reset  -----------------------------------------------------------------*/\n*, html{\n  margin: 0px;\n  padding: 0px;\n  box-sizing: border-box;\n  font-family: Roboto, FreeSans, Helvetica, Arial, sans-serif;\n  color: rgba(255, 255, 255, .6);\n  font-size: 16px;\n}\nbody{\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n  font-family: Roboto, FreeSans, Helvetica, Arial, sans-serif;\n  color: #333;\n  font-size: 16px;\n  background-color: #8cc;\n  border: 20px solid rgba(255, 255, 255, .6);\n  box-shadow: inset 0 0 10px rgba(0, 0, 0, .25);\n}\nh1{\n  font-size: 3rem;\n  font-weight: 900;\n  text-align: center;\n  line-height: 90px;\n}\nh2{\n  font-size: 2rem;\n  font-weight: 500;\n  text-align: center;\n  line-height: 60px;\n}\n.start-wrapper,\n.select-character-wrapper{\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n  width: 50%;\n  min-height: 300px;\n  border: 10px solid rgba(255, 255, 255, .6);\n  box-shadow: 0 8px 20px rgba(0, 0, 0, .25);\n  background-color: #8dd;\n}\n.start-wrapper-section{\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n}\n.users-wrapper{\n  width: 50%;\n}\n.user-card{\n  width: 25%;\n}\n.user-name{\n  display: block;\n  font-size: 2rem;\n}\ninput{\n  background-color: transparent;\n  border-style: none;\n  color: #fff;\n  font-size: 1.5rem;\n  font-weight: 700;\n  padding: 20px;\n  text-align: center;\n}\nbutton{\n  background-color: transparent;\n  border-style: none;\n  color: rgba(255, 255, 255, .5);\n  font-size: 1.5rem;\n  font-weight: 700;\n  padding: 20px;\n  transition: color 300ms ease-out;\n}\nbutton:hover{\n  color: #fff;\n}\n.hidden{\n  display: none !important;\n}\n/*--  Players preview  --------------------------------------------------------------*/\n#players-preview-wrapper{\n  width: 50%;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.player-preview-wrapper{\n  height: 50px;\n  background-color: rgba(255, 255, 255, .25);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, .25);\n  padding: 10px;\n  border-style: none;\n  border-radius: 3px;\n  margin: 3px;\n}\n.player-preview-name{\n  line-height: 30px;\n  color: #fff;\n  font-weight: 500;\n  float: left;\n}\n.player-preview-owner{\n  float: left;\n  padding: 3px 0 3px 10px;\n}\n.player-preview-owner svg{\n  fill: #fff;\n}\n/*--  Placeholders  -----------------------------------------------------------------*/\n::-webkit-input-placeholder {\n  color: rgba(0, 0, 0, .25);\n  font-weight: 500;\n}\n:-moz-placeholder {\n  color: rgba(0, 0, 0, .25);\n  font-weight: 500;\n}\n::-moz-placeholder {\n  color: rgba(0, 0, 0, .25);\n  font-weight: 500;\n}\n:-ms-input-placeholder {\n  color: rgba(0, 0, 0, .25);\n  font-weight: 500;\n}", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	const Character = __webpack_require__(6);

	const Player = function (values) {

	  this.id = values.id; // :string
	  this.name = values.name; // :string
	  this.owner = values.owner; // :boolean
	  this.character = undefined; // :Character
	  if (values.character)
	    this.character = new Character(values.character);
	}

	Player.prototype.preview = function () {
	  let wrapper = document.createElement('div');
	  wrapper.classList.add('player-preview-wrapper');

	  let name = document.createElement('span');
	  name.classList.add('player-preview-name');
	  name.innerHTML = this.name;
	  wrapper.appendChild(name);

	  if (this.owner) {
	    let owner = document.createElement('span');
	    owner.classList.add('player-preview-owner');
	    owner.innerHTML =
	      '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'
	      + '<path d="M0 0h24v24H0z" fill="none"/>'
	      + '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>'
	      + '</svg>'
	    wrapper.appendChild(owner);
	  }

	  return wrapper;
	}

	Player.prototype.view = function () {
	  let wrapper = document.createElement('div');
	  wrapper.classList.add('player-wrapper');

	  let name = document.createElement('span');
	  name.classList.add('player-name');
	  name.innerHTML = this.name;
	  wrapper.appendChild(name);

	  if (this.owner) {
	    let owner = document.createElement('span');
	    owner.classList.add('player-owner');
	    owner.innerHTML =
	      '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'
	      + '<path d="M0 0h24v24H0z" fill="none"/>'
	      + '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>'
	      + '</svg>'
	    wrapper.appendChild(owner);
	  }

	  let character = this.character.view();
	  wrapper.appendChild(character);

	  return wrapper;
	}

	module.exports = Player;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	const Qa = __webpack_require__(7);

	const Character = function (values) {
	  this.id = values.id; // :string
	  this.description = undefined; // :string
	  this.qa = undefined; // :Array<Qa>
	  if (values.description)
	    this.description = values.description;
	  if (values.qa)
	    this.qa = values.qa.map(qa => new Qa(qa));
	}

	Character.prototype.view = function () {
	  let div = document.createElement('div');

	  let description = document.createElement('div');
	  description.innerHTML = this.description ? this.description :  '·········';
	  div.appendChild(description);

	  if (this.qa) {
	    let qas = document.createElement('div');
	    for (var i = 0; i < this.qa.length; i++) {
	      qas.appendChild(this.qa[i].view());
	    }
	    div.appendChild(qas);
	  }
	  
	  return div;
	}

	module.exports = Character;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	const Qa = function (values) {
	  this.question = values.q; // :string
	  this.answer = values.a; // :boolean
	}

	Qa.prototype.view = function () {
	  let div = document.createElement('div');

	  let question = document.createElement('div');
	  question.innerHTML = this.question;
	  div.appendChild(question);

	  let answer = document.createElement('div');
	  if (this.answer)
	    answer.innerHTML =
	      '<svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
	        '<path d="M0 0h24v24H0z" fill="none"/>' +
	        '<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>' +
	      '</svg>';
	  else
	    answer.innerHTML =
	      '<svg fill="#888" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
	        '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
	        '<path d="M0 0h24v24H0z" fill="none"/>' +
	      '</svg>';

	  div.appendChild(answer);

	  return div;
	}

	module.exports = Qa;




/***/ }
/******/ ]);