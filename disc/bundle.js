/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c11e0604a6786657a76f"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(10)(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var TypeCheckUtil = TypeCheckUtil || {
  isElement: function isElement(element) {
    return element instanceof Element;
  },
  isNode: function isNode(node) {
    return node instanceof Node;
  },
  isFunction: function isFunction(func) {
    return typeof func === 'function';
  }
};

var ElementClassNameUtil = ElementClassNameUtil || {
  addClassName: function addClassName(element, className) {
    if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError('params Error: except 2: element{Node}, className{String}');
    var oldClassName = element.className.trim();
    if (oldClassName.indexOf(className) >= 0) return false;
    className = oldClassName.length > 0 ? ' ' + className : className;
    element.className = oldClassName + className;
    return true;
  },
  removeClassName: function removeClassName(element, className) {
    if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError('params Error: except 2: element{Node}, className{String}');
    var oldClassName = element.className.trim();
    if (oldClassName.indexOf(className) < 0) return false;
    element.className = oldClassName.replace(className, '');
    return true;
  },
  include: function include(element, className) {
    if (!TypeCheckUtil.isNode(element) || !className) throw new TypeError('params Error: except 2: element{Node}, className{String}');
    return element.className.indexOf(className) >= 0;
  }
};

function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

function debounce(func, wait, options) {
  var lastArgs = void 0,
      lastThis = void 0,
      maxWait = void 0,
      result = void 0,
      timerId = void 0,
      lastCallTime = void 0;

  var lastInvokeTime = 0;
  var leading = false;
  var maxing = false;
  var trailing = true;

  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs;
    var thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime;
    var timeSinceLastInvoke = time - lastInvokeTime;
    var result = wait - timeSinceLastCall;

    return maxing ? Math.min(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime;
    var timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced() {
    var time = Date.now();
    var isInvoking = shouldInvoke(time);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

function throttle(func, wait, options) {
  var leading = true;
  var trailing = true;

  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

exports.TypeCheckUtil = TypeCheckUtil;
exports.ElementClassNameUtil = ElementClassNameUtil;
exports.throttle = throttle;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _note = __webpack_require__(5);

/**
 * 设置按钮点击handler
 * @param {*} target 
 */
var setClickHandler = function setClickHandler(target) {
  (0, _note.rotateToSetting)(target.getAttribute('data-id'));
};

/**
 * 关闭设置窗口handler
 * @param {*} target 
 */
/**
 * ------------------------------
 * 页面入口函数，初始化整个proj啦啦
 * @author LanceLou
 * ------------------------------
 */
var closeSetHandler = function closeSetHandler(target) {
  (0, _note.rotateToNoteDisplay)(target.getAttribute('data-id'));
};

/**
 * 添加note handler
 * @param {*} target 
 */
var addNoteHandler = function addNoteHandler(target) {};

var initEventLis = function initEventLis() {
  // popup图标点击事件监听 from chrome
  /**/
  // createNote();
  // createNote();
  chrome.runtime.onMessage.addListener(function (data, dender, sendResponse) {
    (0, _note.createNote)();
    sendResponse({ type: 'noteAdd', "num": (0, _note.getNoteListLength)() });
  });

  // 全局范围监听点击事件
  document.body.addEventListener('click', function (event) {
    var target = event.target;
    if (/[\w]*lc_color_k[\w]*/.test(target.className)) {
      (0, _note.setHandler)(event);
    }
    switch (target.className) {
      case 'set':
        setClickHandler(target);
        break;
      case 'btn-setOk':
        closeSetHandler(target);
        break;
      case 'btn-delete':
        (0, _note.removeANote)(target.parentNode.getAttribute('data-id'));
        break;
    }
  });

  // document.body.addEventListener('change', function(event){
  //   console.log(event.target);
  // });
};
var init = function init() {
  (0, _note.initNoteListByStorage)();
  initEventLis();
};

init();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitAllNoteList = exports.saveNoteList = exports.createNoteObj = undefined;

var _v = __webpack_require__(8);

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defconfig = {
  width: 220,
  height: 180
};

// 每块note设置独立化，不存在全局的用户设置和存储
var getInitAllNoteList = function getInitAllNoteList() {
  var pageUrl = window.location.href;
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get(pageUrl + 'note_list', function (data) {
      if (data) {
        resolve(data[pageUrl + 'note_list']);
      } else {
        reject(false);
      }
    });
  });
};

/**
 * 存储当前的noteList对象
 */
var saveNoteList = function saveNoteList(noteList) {
  var pageUrl = window.location.href;
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.set(_defineProperty({}, pageUrl + 'note_list', noteList), function (res) {
      console.log('saved success');
    });
  });
};

// 获取note落地的随机位置
var getRandomPos = function getRandomPos() {
  var scrollTop = window.scrollY;
  return {
    top: scrollTop + Math.random() * 50,
    right: Math.random() * 50
  };
};

/**
 * 根据用户config创建一个note描述对象
 * @param {*} config 
 */
function createNoteObj() {
  var lingGredentBGCIndex = Math.floor(Math.random() * 6);
  var defaultConfig = {
    id: (0, _v2.default)(),
    content: '',
    lingGredentBGCIndex: lingGredentBGCIndex,
    width: defconfig.width,
    height: defconfig.height,
    pos: getRandomPos(), //页面位置
    editLastTime: new Date().getTime(),
    archTargetPos: { top: 0, left: 0 }, //未知参数，暂存
    isSetTarget: false //未知参数，暂存
  };
  return Object.assign(defaultConfig);
}

exports.createNoteObj = createNoteObj;
exports.saveNoteList = saveNoteList;
exports.getInitAllNoteList = getInitAllNoteList;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
var global = {};
(function (global) {
  'use strict';

  var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
    var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
    var timezoneClip = /[^-+\dA-Z]/g;

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc, gmt) {

      // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
      if (arguments.length === 1 && kindOf(date) === 'string' && !/\d/.test(date)) {
        mask = date;
        date = undefined;
      }

      date = date || new Date();

      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      if (isNaN(date)) {
        throw TypeError('Invalid date');
      }

      mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default']);

      // Allow setting the utc/gmt argument via the mask
      var maskSlice = mask.slice(0, 4);
      if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
        mask = mask.slice(4);
        utc = true;
        if (maskSlice === 'GMT:') {
          gmt = true;
        }
      }

      var _ = utc ? 'getUTC' : 'get';
      var d = date[_ + 'Date']();
      var D = date[_ + 'Day']();
      var m = date[_ + 'Month']();
      var y = date[_ + 'FullYear']();
      var H = date[_ + 'Hours']();
      var M = date[_ + 'Minutes']();
      var s = date[_ + 'Seconds']();
      var L = date[_ + 'Milliseconds']();
      var o = utc ? 0 : date.getTimezoneOffset();
      var W = getWeek(date);
      var N = getDayOfWeek(date);
      var flags = {
        d: d,
        dd: pad(d),
        ddd: dateFormat.i18n.dayNames[D],
        dddd: dateFormat.i18n.dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: dateFormat.i18n.monthNames[m],
        mmmm: dateFormat.i18n.monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad(Math.round(L / 10)),
        t: H < 12 ? 'a' : 'p',
        tt: H < 12 ? 'am' : 'pm',
        T: H < 12 ? 'A' : 'P',
        TT: H < 12 ? 'AM' : 'PM',
        Z: gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
        o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
        W: W,
        N: N
      };

      return mask.replace(token, function (match) {
        if (match in flags) {
          return flags[match];
        }
        return match.slice(1, match.length - 1);
      });
    };
  }();

  dateFormat.masks = {
    'default': 'ddd mmm dd yyyy HH:MM:ss',
    'shortDate': 'm/d/yy',
    'mediumDate': 'mmm d, yyyy',
    'longDate': 'mmmm d, yyyy',
    'fullDate': 'dddd, mmmm d, yyyy',
    'shortTime': 'h:MM TT',
    'mediumTime': 'h:MM:ss TT',
    'longTime': 'h:MM:ss TT Z',
    'isoDate': 'yyyy-mm-dd',
    'isoTime': 'HH:MM:ss',
    'isoDateTime': 'yyyy-mm-dd\'T\'HH:MM:sso',
    'isoUtcDateTime': 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
    'expiresHeaderFormat': 'ddd, dd mmm yyyy HH:MM:ss Z'
  };

  // Internationalization strings
  dateFormat.i18n = {
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  /**
   * Get the ISO 8601 week number
   * Based on comments from
   * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
   *
   * @param  {Object} `date`
   * @return {Number}
   */
  function getWeek(date) {
    // Remove time components of date
    var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Change date to Thursday same week
    targetThursday.setDate(targetThursday.getDate() - (targetThursday.getDay() + 6) % 7 + 3);

    // Take January 4th as it is always in week 1 (see ISO 8601)
    var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

    // Change date to Thursday same week
    firstThursday.setDate(firstThursday.getDate() - (firstThursday.getDay() + 6) % 7 + 3);

    // Check if daylight-saving-time-switch occurred and correct for it
    var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
    targetThursday.setHours(targetThursday.getHours() - ds);

    // Number of weeks between target Thursday and first Thursday
    var weekDiff = (targetThursday - firstThursday) / (86400000 * 7);
    return 1 + Math.floor(weekDiff);
  }

  /**
   * Get ISO-8601 numeric representation of the day of the week
   * 1 (for Monday) through 7 (for Sunday)
   * 
   * @param  {Object} `date`
   * @return {Number}
   */
  function getDayOfWeek(date) {
    var dow = date.getDay();
    if (dow === 0) {
      dow = 7;
    }
    return dow;
  }

  /**
   * kind-of shortcut
   * @param  {*} val
   * @return {String}
   */
  function kindOf(val) {
    if (val === null) {
      return 'null';
    }

    if (val === undefined) {
      return 'undefined';
    }

    if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object') {
      return typeof val === 'undefined' ? 'undefined' : _typeof(val);
    }

    if (Array.isArray(val)) {
      return 'array';
    }

    return {}.toString.call(val).slice(8, -1).toLowerCase();
  };

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return dateFormat;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = dateFormat;
  } else {
    global.dateFormat = dateFormat;
  }
})(undefined);

exports.default = global.dateFormat;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _eventListenerInit = Symbol('eventListenerInit'),
    _getMouseDeltaXY = Symbol('getMouseDeltaXY'),
    _checkInMoveTarget = Symbol('checkInMoveTarget'),
    _moveTheTarget = Symbol('moveTheTarget'),
    _triggerMoveListener = Symbol('triggerMoveListener');

var ElementMouseMove = function () {
  function ElementMouseMove(wrapper, mouseTarget, moveTarget) {
    _classCallCheck(this, ElementMouseMove);

    if (!_util.TypeCheckUtil.isNode(wrapper) || !_util.TypeCheckUtil.isNode(mouseTarget) || !_util.TypeCheckUtil.isNode(moveTarget)) {
      throw new TypeError('param error: except 3 params and all param is Node or it\'s sub class');
    }
    this.wrapper = wrapper;
    this.mouseTarget = mouseTarget;
    this.moveTarget = moveTarget;

    // wrapper 属性 需要left，top  moveTarget的暂时不使用，因为这个rect是静态的
    this.wrapperRect = this.wrapper.getBoundingClientRect();

    // 鼠标是否按下
    this.isMoveDown = false;

    // 鼠标按下的位置，方便计算delta x 与 y
    this.mouseDownPoint = { x: 0, y: 0 };

    // moveTaregt移动的回调函数
    this.moveCallbackList = [];

    this[_eventListenerInit]();
  }

  /**
   * getTopLeft: 返回moveTarget元素距离wrapper元素的左上角的距离(正值)
   * @return {Object} the topLeft delta(Width)
   */


  _createClass(ElementMouseMove, [{
    key: 'getTopLeft',
    value: function getTopLeft() {
      var moveTargetRect = this.moveTarget.getBoundingClientRect();
      return { x: moveTargetRect.left, y: moveTargetRect.top };
    }

    /**
     * addMoveListenerCallback: 添加移动事件的监听回调函数
     * @param {Function} callback 移动监听回调函数
     * @param {Object}   context  回调函数执行上下文
     */

  }, {
    key: 'addMoveListenerCallback',
    value: function addMoveListenerCallback(callback, context) {
      this.moveCallbackList.push({ callback: callback, context: context });
    }

    /**
     * _triggerMoveListener: 触发所有当前movetarget对象移动的监听器，将当前movetarget相对于wrapper的左上角的位置传给回调{x: , y: }
     *
     */

  }, {
    key: _triggerMoveListener,
    value: function value(curPos) {
      this.moveCallbackList.map(function (item) {
        return item.callback.call(item.context, curPos);
      });
    }
  }, {
    key: _checkInMoveTarget,
    value: function value(position) {
      var moveTargetRect = this.moveTarget.getBoundingClientRect();
      if (position.x < moveTargetRect.left || position.x > moveTargetRect.left + moveTargetRect.width || position.y < moveTargetRect.top || position.y > moveTargetRect.top + moveTargetRect.height) {
        return false;
      }
      return true;
    }

    /**
     * _getMouseDeltaXY: 根据当前鼠标的位置计算鼠标自按下后移动的距离，可负值
     * @return {Object} the detlaX and deltaY
     */

  }, {
    key: _getMouseDeltaXY,
    value: function value(curPostion) {
      var delta = {};
      delta.x = curPostion.x - this.mouseDownPoint.x;
      delta.y = curPostion.y - this.mouseDownPoint.y;

      return delta;
    }
  }, {
    key: _moveTheTarget,
    value: function value(delta) {
      var rect = this.moveTarget.getBoundingClientRect();
      this.moveTarget.style.left = rect.left + delta.x + 'px';
      this.moveTarget.style.top = rect.top + delta.y + 'px';
    }

    /**
     * _eventListenerInit: 初始化事件监听
     */

  }, {
    key: _eventListenerInit,
    value: function value() {
      var self = this;
      this.mouseTarget.addEventListener('mousedown', function (event) {
        if (self[_checkInMoveTarget]({ x: event.clientX, y: event.clientY })) {
          // 定制版 start
          self.mouseTarget.style.zIndex = "99999";
          // 定制版 end
          self.isMoveDown = true;
        }
        self.mouseDownPoint.x = event.clientX;
        self.mouseDownPoint.y = event.clientY;
      });

      // 鼠标作用dom上的移动事件监听，注意是否跑出有效区域
      this.mouseTarget.addEventListener('mousemove', function (event) {
        if (!self[_checkInMoveTarget]({ x: event.clientX, y: event.clientY })) {
          // 跑出有效区域
          return;
        }
        if (!self.isMoveDown) return;
        var delta = self[_getMouseDeltaXY]({ x: event.clientX, y: event.clientY + window.scrollY });

        // 1px为一个移动单位，"节流"
        if (Math.abs(delta.x) <= 1 && Math.abs(delta.y) <= 1) return;

        // console.log(delta);
        self[_moveTheTarget](delta);

        self.mouseDownPoint.x = event.clientX;
        self.mouseDownPoint.y = event.clientY;

        self[_triggerMoveListener](self.getTopLeft());
      });

      // 鼠标跑出mouseTarget区域，取消mousedowm
      this.mouseTarget.addEventListener('mouseout', function (event) {
        self.isMoveDown = false;
        // 定制版 start
        self.mouseTarget.style.zIndex = "9999";
        // 定制版 end
      });

      this.mouseTarget.addEventListener('mouseup', function (event) {
        self.isMoveDown = false;
        // 定制版 start
        self.mouseTarget.style.zIndex = "9999";
        // 定制版 end
      });
    }
  }]);

  return ElementMouseMove;
}();

exports.default = ElementMouseMove;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNoteListLength = exports.setHandler = exports.removeANote = exports.updateNoteContent = exports.rotateToNoteDisplay = exports.rotateToSetting = exports.createNote = exports.updateNote = exports.initNoteListByStorage = undefined;

var _config = __webpack_require__(2);

var _util = __webpack_require__(0);

var _mouseDownMove = __webpack_require__(4);

var _mouseDownMove2 = _interopRequireDefault(_mouseDownMove);

var _dateFormat = __webpack_require__(3);

var _dateFormat2 = _interopRequireDefault(_dateFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lingGredentBGC = ['linear-gradient(to bottom, #DAFFA7, #A5FF65)', 'linear-gradient(to bottom, #C0D7FF, #86A3FF)', 'linear-gradient(to bottom, #F3D7FF, #E29EFF)', 'linear-gradient(to bottom, #FFC9FA, #FF87F6)', 'linear-gradient(to bottom, #E7E7E7, #B6B6B6)', 'linear-gradient(to bottom, #D6F7FF, #8FE4FF)'];
// 调用者自行管理，config不保存这些信息
// 键为唯一值ID, 所有配置信息列表
var noteList = {};
// note dom列表，id为键
var noteDomList = {};
// note 设置dom列表
var noteSetDomList = {};
// note edit eventLis list
var noteDomEditEventLisList = {};
// note setting react eventLis list
var noteDomRectSetEventLisList = {};

/**
 * 根据storage读取的noteList初始化界面上的DOM
 * @param {*} noteList 
 */
var initNoteListByStorage = function initNoteListByStorage() {
  // //--------------------for test--------------------
  // let noteListArr = [];
  // noteListArr.push(createNoteObj());
  // noteListArr.push(createNoteObj());
  // //--------------------for test--------------------
  (0, _config.getInitAllNoteList)().then(function (res) {
    // let noteDom = null;
    // 可直接存储结构化数据，而不需序列化
    // 开始数据填充
    res = res || {};
    for (var key in res) {
      noteList[key] = res[key];
      document.body.appendChild(createANote(res[key]));
    }
    // 发送初始化信息给background环境，表示，页面note初始化
    sendNoteInitMessage();
  }, function (error) {
    console.log('storage read error', error);
  });
};

/**
 * 创建note setting dom
 * @param {*} config 
 */
var createNoteSettingDom = function createNoteSettingDom(config) {
  var settingDom = document.createElement('div');
  var htmlTemplate = '\n        <form action="">\n          <label class="item-label">\u7EB8\u5F20\u989C\u8272</label>\n          <div class="lc_color_panel" data-id="' + config.id + '">\n            <span class="lc_color_k1 ' + (config.lingGredentBGCIndex === 0 ? "selected" : "") + '" data-index="0">\u221A</span>\n            <span class="lc_color_k2 ' + (config.lingGredentBGCIndex === 1 ? "selected" : "") + '" data-index="1">\u221A</span>\n            <span class="lc_color_k3 ' + (config.lingGredentBGCIndex === 2 ? "selected" : "") + '" data-index="2">\u221A</span>\n            <span class="lc_color_k4 ' + (config.lingGredentBGCIndex === 3 ? "selected" : "") + '" data-index="3">\u221A</span>\n            <span class="lc_color_k5 ' + (config.lingGredentBGCIndex === 4 ? "selected" : "") + '" data-index="4">\u221A</span>\n            <span class="lc_color_k6 ' + (config.lingGredentBGCIndex === 5 ? "selected" : "") + '" data-index="5">\u221A</span>\n          </div>\n          <label class="item-label">\u7EB8\u5F20\u5927\u5C0F</label>\n          <div class="sizeSet" data-id="' + config.id + '">\n            <label for="">\u957F(width):</label> <input type="text" name="width" value="' + config.width + '">\n            <label for="">\u9AD8(height):</label> <input type="text" name="height" value="' + config.height + '">\n          </div>\n        </form>\n        <button class="btn-setOk" data-id="' + config.id + '">\u5B8C\u6210</button>';
  settingDom.innerHTML = htmlTemplate;
  settingDom.className = 'lc_noteSet';
  settingDom.style.cssText = 'width: ' + config.width + 'px; height: ' + config.height + 'px; top: ' + config.pos.top + 'px; right: ' + config.pos.right + 'px';
  noteSetDomList[config.id] = settingDom;
  initRectSettingEventLis(config.id);
  return settingDom;
};

/**
 * 创建note dom
 * @param {*} config 
 */
var createNoteDom = function createNoteDom(config) {
  var note = document.createElement('div');
  var html = '<div class="lc_note_item_header" data-id="' + config.id + '">\n                <span class="btn-delete">\xD7</span>\n                <span class="btn-close">-</span>\n              </div>\n              <div class="lc_note_item_body" contenteditable="true">' + config.content + '</div>\n              <div class="lc_note_item_footer">Edit in ' + (0, _dateFormat2.default)(new Date(config.editLastTime), 'yyyy/mm/dd') + '\n                <a class="set" data-id="' + config.id + '"></a>\n              </div>';
  note.innerHTML = html;
  note.className = 'lc_note_item';
  note.setAttribute('data-id', config.id);
  note.style.cssText = 'background: ' + lingGredentBGC[config.lingGredentBGCIndex] + '; width: ' + config.width + 'px; height: ' + config.height + 'px; top: ' + config.pos.top + 'px; right: ' + config.pos.right + 'px';
  noteDomList[config.id] = note;
  return note;
};

/**
 * 创建一个note dom，包括其设置界面的dom
 * @param {*} config 
 */
var createANote = function createANote(config) {
  var container = document.createElement('div');
  container.className = 'noteContainer';
  container.appendChild(createNoteDom(config));
  container.appendChild(createNoteSettingDom(config));
  initNoteDomContentEditListener(config.id);
  bindNoteToMousemove(config.id);
  return container;
};

/**
 * 将note进行鼠标拖动绑定，同时进行set dom对应的dom同步移动
 * @param {*} id 
 */
var bindNoteToMousemove = function bindNoteToMousemove(id) {
  var noteDom = noteDomList[id];
  var noteSetDom = noteSetDomList[id];
  var mouseMoveObj = new _mouseDownMove2.default(document.body, noteDom, noteDom);
  mouseMoveObj.addMoveListenerCallback(function (data) {
    noteSetDom.style.left = data.x + 'px';
    noteSetDom.style.top = data.y + 'px';
    updateNotePosition(id, data);
  });
};

/**
 * 无参型note创建函数，主要用于外部调用创建一个note
 * 
 */
var createNote = function createNote() {
  var config = (0, _config.createNoteObj)();
  noteList[config.id] = config;
  document.body.appendChild(createANote(config));
  // 存储最新的数据
  (0, _config.saveNoteList)(noteList);
};

/**
 * 旋转指定note至setting界面('背面')
 * @param {*} id
 */
var rotateToSetting = function rotateToSetting(id) {
  var noteDom = noteDomList[id];
  var noteSetDom = noteSetDomList[id];

  _util.ElementClassNameUtil.removeClassName(noteDom, 'lc_noteItem_show');
  _util.ElementClassNameUtil.removeClassName(noteSetDom, 'lc_noteSet_hidden');

  _util.ElementClassNameUtil.addClassName(noteDom, 'lc_noteItem_rotate_toHidden');
  _util.ElementClassNameUtil.addClassName(noteSetDom, 'lc_noteSet_rotate_toShow');
  setTimeout(function () {
    // 动画结束，去除动画过度class
    _util.ElementClassNameUtil.removeClassName(noteDom, 'lc_noteItem_rotate_toHidden');
    _util.ElementClassNameUtil.removeClassName(noteSetDom, 'lc_noteSet_rotate_toShow');

    // 设置当前状态class
    _util.ElementClassNameUtil.addClassName(noteDom, 'lc_noteItem_hidden');
    _util.ElementClassNameUtil.addClassName(noteSetDom, 'lc_noteSet_show');
  }, 670);
};

/**
 * 旋转指定note至note的display界面
 * @param {*} id 
 */
var rotateToNoteDisplay = function rotateToNoteDisplay(id) {
  var noteDom = noteDomList[id];
  var noteSetDom = noteSetDomList[id];

  _util.ElementClassNameUtil.removeClassName(noteDom, 'lc_noteItem_hidden');
  _util.ElementClassNameUtil.removeClassName(noteSetDom, 'lc_noteSet_show');

  _util.ElementClassNameUtil.addClassName(noteDom, 'lc_noteItem_rotate_toShow');
  _util.ElementClassNameUtil.addClassName(noteSetDom, 'lc_noteSet_rotate_toHidden');
  setTimeout(function () {
    // 动画结束，去除原动画过度class
    _util.ElementClassNameUtil.removeClassName(noteDom, 'lc_noteItem_rotate_toShow');
    _util.ElementClassNameUtil.removeClassName(noteSetDom, 'lc_noteSet_rotate_toHidden');

    // 设置当前状态class
    _util.ElementClassNameUtil.addClassName(noteDom, 'lc_noteItem_show');
    _util.ElementClassNameUtil.addClassName(noteSetDom, 'lc_noteSet_hidden');

    setHandler({ type: 'save', id: id });
  }, 670);
};

/**
 * 更新noteList, 更新对应的note dom以及set dom
 * @param {*} config 
 * @param {*} id 
 */
var updateNote = function updateNote(config, id) {
  if (!config) return;
  var originConfig = noteList[id];
  // 更新dom
  Object.keys(config).map(function (key) {
    if (key === 'lingGredentBGCIndex') {
      noteDomList[id].style.background = lingGredentBGC[config[key]];
    } else if (key === 'width') {
      noteDomList[id].style.width = noteSetDomList[id].style.width = config[key] + 'px';
    } else if (key === 'height') {
      noteDomList[id].style.height = noteSetDomList[id].style.height = config[key] + 'px';
    }
  });
  config = Object.assign({}, noteList[id], config);
  noteList[id] = config;
  // 存储最新的数据
  (0, _config.saveNoteList)(noteList);
};

/**
 * 用户输入，更新当前note by id 同时部署函数节流
 * 最后更改时间不进行dom同步更新，只进行保存，页面reload时进行展示
 * @param {*} content 
 * @param {*} id 
 */
var updateNoteContent = (0, _util.throttle)(function (content, id) {
  noteList[id].content = content;
  noteList[id].editLastTime = new Date().getTime();

  // save content
  (0, _config.saveNoteList)(noteList);
}, 500);

/**
 * 移除一个note by id，分别从配置List，dom List，dom set List中移除
 * @param {*} id 
 */
var removeANote = function removeANote(id) {
  var targetNote = noteDomList[id];
  var targetSetNote = noteSetDomList[id];
  // delete dom
  targetNote.parentNode.removeChild(targetNote);
  targetSetNote.parentNode.removeChild(targetSetNote);
  // 清除事件监听
  noteDomEditEventLisList[id]();
  // delete data
  delete noteList[id];
  delete noteDomList[id];
  delete noteSetDomList[id];

  // save delete
  (0, _config.saveNoteList)(noteList);
  sendNoteDeleteMessage();
};

var editHandler = function editHandler(event) {
  var target = event.target;
  updateNoteContent(target.innerHTML, target.previousElementSibling.getAttribute('data-id'));
};
var initNoteDomContentEditListener = function initNoteDomContentEditListener(id) {
  noteDomList[id].addEventListener('keyup', editHandler);
  noteDomEditEventLisList[id] = function () {
    noteDomList[id].removeEventListener('focus', editHandler);
  };
};

// setting event management
var setHandler = function () {
  var customConfigTemp = {};

  var chooseColor = function chooseColor(colorId, id) {
    customConfigTemp[id] = customConfigTemp[id] || {};
    customConfigTemp[id].lingGredentBGCIndex = colorId;

    // 更新dom
    var noteSettindDom = noteSetDomList[id];
    var panes = noteSettindDom.querySelectorAll('span');
    _util.ElementClassNameUtil.removeClassName(noteSettindDom.querySelector('span.selected'), 'selected');
    _util.ElementClassNameUtil.addClassName(panes[colorId], 'selected');
  };
  var setRect = function setRect(name, value, id) {
    customConfigTemp[id] = customConfigTemp[id] || {};
    customConfigTemp[id][name] = value;
  };
  var save = function save(id) {
    updateNote(customConfigTemp[id], id);
  };
  return function (event) {
    var target = event.target;
    // 此处进行派发
    switch (event.type) {
      case 'change':
        setRect(target.name, target.value, target.parentNode.getAttribute('data-id'));
        break;
      case 'click':
        if (/[\w]*lc_color_k[\w]*/.test(target.className)) {
          chooseColor(target.getAttribute('data-index'), target.parentNode.getAttribute('data-id'));
        }
        break;
      case 'save':
        save(event.id);
    }
  };
}();
var updateNotePosition = (0, _util.throttle)(function (id, pos) {
  noteList[id].pos.top = pos.y;
  noteList[id].pos.right = document.body.getBoundingClientRect().width - pos.x - noteList[id].width;
  (0, _config.saveNoteList)(noteList);
}, 300);
var initRectSettingEventLis = function initRectSettingEventLis(id) {
  var inputs = noteSetDomList[id].querySelectorAll('input');
  var callbacks = [];
  Array.prototype.map.call(inputs, function (input) {
    input.addEventListener('change', setHandler);
    callbacks.push(function () {
      input.removeEventListener('change', setHandler);
    });
  });
  // noteSetDomList[id].addEventListener('change', setHandler);
  noteDomRectSetEventLisList[id] = function () {
    callbacks.map(function (cb) {
      cb();
    });
  };
};

var getNoteListLength = function getNoteListLength() {
  return Object.keys(noteList).length;
};

var sendNoteDeleteMessage = function sendNoteDeleteMessage() {
  chrome.runtime.sendMessage(null, { type: 'noteDelete', num: getNoteListLength() });
};
var sendNoteInitMessage = function sendNoteInitMessage() {
  chrome.runtime.sendMessage(null, { type: 'noteInit', num: getNoteListLength() });
};

exports.initNoteListByStorage = initNoteListByStorage;
exports.updateNote = updateNote;
exports.createNote = createNote;
exports.rotateToSetting = rotateToSetting;
exports.rotateToNoteDisplay = rotateToNoteDisplay;
exports.updateNoteContent = updateNoteContent;
exports.removeANote = removeANote;
exports.setHandler = setHandler;
exports.getNoteListLength = getNoteListLength;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(7);
var bytesToUuid = __webpack_require__(6);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map