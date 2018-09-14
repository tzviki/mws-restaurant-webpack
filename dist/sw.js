/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/sw.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/idb/lib/idb.js":
/*!*************************************!*\
  !*** ./node_modules/idb/lib/idb.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n(function() {\n  function toArray(arr) {\n    return Array.prototype.slice.call(arr);\n  }\n\n  function promisifyRequest(request) {\n    return new Promise(function(resolve, reject) {\n      request.onsuccess = function() {\n        resolve(request.result);\n      };\n\n      request.onerror = function() {\n        reject(request.error);\n      };\n    });\n  }\n\n  function promisifyRequestCall(obj, method, args) {\n    var request;\n    var p = new Promise(function(resolve, reject) {\n      request = obj[method].apply(obj, args);\n      promisifyRequest(request).then(resolve, reject);\n    });\n\n    p.request = request;\n    return p;\n  }\n\n  function promisifyCursorRequestCall(obj, method, args) {\n    var p = promisifyRequestCall(obj, method, args);\n    return p.then(function(value) {\n      if (!value) return;\n      return new Cursor(value, p.request);\n    });\n  }\n\n  function proxyProperties(ProxyClass, targetProp, properties) {\n    properties.forEach(function(prop) {\n      Object.defineProperty(ProxyClass.prototype, prop, {\n        get: function() {\n          return this[targetProp][prop];\n        },\n        set: function(val) {\n          this[targetProp][prop] = val;\n        }\n      });\n    });\n  }\n\n  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {\n    properties.forEach(function(prop) {\n      if (!(prop in Constructor.prototype)) return;\n      ProxyClass.prototype[prop] = function() {\n        return promisifyRequestCall(this[targetProp], prop, arguments);\n      };\n    });\n  }\n\n  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {\n    properties.forEach(function(prop) {\n      if (!(prop in Constructor.prototype)) return;\n      ProxyClass.prototype[prop] = function() {\n        return this[targetProp][prop].apply(this[targetProp], arguments);\n      };\n    });\n  }\n\n  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {\n    properties.forEach(function(prop) {\n      if (!(prop in Constructor.prototype)) return;\n      ProxyClass.prototype[prop] = function() {\n        return promisifyCursorRequestCall(this[targetProp], prop, arguments);\n      };\n    });\n  }\n\n  function Index(index) {\n    this._index = index;\n  }\n\n  proxyProperties(Index, '_index', [\n    'name',\n    'keyPath',\n    'multiEntry',\n    'unique'\n  ]);\n\n  proxyRequestMethods(Index, '_index', IDBIndex, [\n    'get',\n    'getKey',\n    'getAll',\n    'getAllKeys',\n    'count'\n  ]);\n\n  proxyCursorRequestMethods(Index, '_index', IDBIndex, [\n    'openCursor',\n    'openKeyCursor'\n  ]);\n\n  function Cursor(cursor, request) {\n    this._cursor = cursor;\n    this._request = request;\n  }\n\n  proxyProperties(Cursor, '_cursor', [\n    'direction',\n    'key',\n    'primaryKey',\n    'value'\n  ]);\n\n  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [\n    'update',\n    'delete'\n  ]);\n\n  // proxy 'next' methods\n  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {\n    if (!(methodName in IDBCursor.prototype)) return;\n    Cursor.prototype[methodName] = function() {\n      var cursor = this;\n      var args = arguments;\n      return Promise.resolve().then(function() {\n        cursor._cursor[methodName].apply(cursor._cursor, args);\n        return promisifyRequest(cursor._request).then(function(value) {\n          if (!value) return;\n          return new Cursor(value, cursor._request);\n        });\n      });\n    };\n  });\n\n  function ObjectStore(store) {\n    this._store = store;\n  }\n\n  ObjectStore.prototype.createIndex = function() {\n    return new Index(this._store.createIndex.apply(this._store, arguments));\n  };\n\n  ObjectStore.prototype.index = function() {\n    return new Index(this._store.index.apply(this._store, arguments));\n  };\n\n  proxyProperties(ObjectStore, '_store', [\n    'name',\n    'keyPath',\n    'indexNames',\n    'autoIncrement'\n  ]);\n\n  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [\n    'put',\n    'add',\n    'delete',\n    'clear',\n    'get',\n    'getAll',\n    'getKey',\n    'getAllKeys',\n    'count'\n  ]);\n\n  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [\n    'openCursor',\n    'openKeyCursor'\n  ]);\n\n  proxyMethods(ObjectStore, '_store', IDBObjectStore, [\n    'deleteIndex'\n  ]);\n\n  function Transaction(idbTransaction) {\n    this._tx = idbTransaction;\n    this.complete = new Promise(function(resolve, reject) {\n      idbTransaction.oncomplete = function() {\n        resolve();\n      };\n      idbTransaction.onerror = function() {\n        reject(idbTransaction.error);\n      };\n      idbTransaction.onabort = function() {\n        reject(idbTransaction.error);\n      };\n    });\n  }\n\n  Transaction.prototype.objectStore = function() {\n    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));\n  };\n\n  proxyProperties(Transaction, '_tx', [\n    'objectStoreNames',\n    'mode'\n  ]);\n\n  proxyMethods(Transaction, '_tx', IDBTransaction, [\n    'abort'\n  ]);\n\n  function UpgradeDB(db, oldVersion, transaction) {\n    this._db = db;\n    this.oldVersion = oldVersion;\n    this.transaction = new Transaction(transaction);\n  }\n\n  UpgradeDB.prototype.createObjectStore = function() {\n    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));\n  };\n\n  proxyProperties(UpgradeDB, '_db', [\n    'name',\n    'version',\n    'objectStoreNames'\n  ]);\n\n  proxyMethods(UpgradeDB, '_db', IDBDatabase, [\n    'deleteObjectStore',\n    'close'\n  ]);\n\n  function DB(db) {\n    this._db = db;\n  }\n\n  DB.prototype.transaction = function() {\n    return new Transaction(this._db.transaction.apply(this._db, arguments));\n  };\n\n  proxyProperties(DB, '_db', [\n    'name',\n    'version',\n    'objectStoreNames'\n  ]);\n\n  proxyMethods(DB, '_db', IDBDatabase, [\n    'close'\n  ]);\n\n  // Add cursor iterators\n  // TODO: remove this once browsers do the right thing with promises\n  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {\n    [ObjectStore, Index].forEach(function(Constructor) {\n      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.\n      if (!(funcName in Constructor.prototype)) return;\n\n      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {\n        var args = toArray(arguments);\n        var callback = args[args.length - 1];\n        var nativeObject = this._store || this._index;\n        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));\n        request.onsuccess = function() {\n          callback(request.result);\n        };\n      };\n    });\n  });\n\n  // polyfill getAll\n  [Index, ObjectStore].forEach(function(Constructor) {\n    if (Constructor.prototype.getAll) return;\n    Constructor.prototype.getAll = function(query, count) {\n      var instance = this;\n      var items = [];\n\n      return new Promise(function(resolve) {\n        instance.iterateCursor(query, function(cursor) {\n          if (!cursor) {\n            resolve(items);\n            return;\n          }\n          items.push(cursor.value);\n\n          if (count !== undefined && items.length == count) {\n            resolve(items);\n            return;\n          }\n          cursor.continue();\n        });\n      });\n    };\n  });\n\n  var exp = {\n    open: function(name, version, upgradeCallback) {\n      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);\n      var request = p.request;\n\n      if (request) {\n        request.onupgradeneeded = function(event) {\n          if (upgradeCallback) {\n            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));\n          }\n        };\n      }\n\n      return p.then(function(db) {\n        return new DB(db);\n      });\n    },\n    delete: function(name) {\n      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);\n    }\n  };\n\n  if (true) {\n    module.exports = exp;\n    module.exports.default = module.exports;\n  }\n  else {}\n}());\n\n\n//# sourceURL=webpack:///./node_modules/idb/lib/idb.js?");

/***/ }),

/***/ "./src/sw.js":
/*!*******************!*\
  !*** ./src/sw.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb */ \"./node_modules/idb/lib/idb.js\");\n/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(idb__WEBPACK_IMPORTED_MODULE_0__);\n\r\nvar cacheId = 'udct-rest-001';\r\nvar cachesAdd = ['/', '/index.html', '/restaurant.html', '/css/styles.css',\r\n                 '/data/restaurants.json', '/js/dbhelper.js', '/js/main.js',\r\n                 '/js/restaurant_info.js'];\r\nself.addEventListener('install', e => {\r\n    e.waitUntil(\r\n        caches.open(cacheId).then(c => {\r\n            return c.addAll(cachesAdd)\r\n            .catch(error => {\r\n                console.log('Cache failed' + error);\r\n            });\r\n        })\r\n    );\r\n});\r\n\r\nself.addEventListener('fetch', e => {\r\n    let cacheRequest = e.request;\r\n    let urlRequest = new URL(e.request.url);\r\n    if (e.request.url.includes('restaurant')) {\r\n        const urlCache = 'restaurant.html';\r\n        cacheRequest = new Request(urlCache);\r\n    }\r\n\r\n    e.respondWith(\r\n        caches.match(cacheRequest).then(response => {\r\n            return (\r\n                response || fetch(e.request)\r\n                .then(fetchResponse => {\r\n                    return caches.open(cacheId).then(c => {\r\n                        c.put(e.request, fetchResponse.clone());\r\n                        return fetchResponse;\r\n                    });\r\n                })\r\n                .catch(error => {\r\n                    return new Response('Internet outage, oops', {\r\n                        status: 404,\r\n                        statusText: 'four oh four'\r\n                    });\r\n                })\r\n            );           \r\n        })\r\n    );\r\n});\n\n//# sourceURL=webpack:///./src/sw.js?");

/***/ })

/******/ });