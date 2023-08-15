(function webpackUniversalModuleDefinition(root, factory) {
	if (typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if (typeof define === 'function' && define.amd) define([], factory);
	else {
		var a = factory();
		for (var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
	return /******/ (() => {
		// webpackBootstrap
		/******/ 'use strict';
		/******/ var __webpack_modules__ = {
			/***/ electron:
				/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
				/***/ (module) => {
					module.exports = require('electron');

					/***/
				},

			/******/
		};
		/************************************************************************/
		/******/ // The module cache
		/******/ var __webpack_module_cache__ = {};
		/******/
		/******/ // The require function
		/******/ function __webpack_require__(moduleId) {
			/******/ // Check if module is in cache
			/******/ var cachedModule = __webpack_module_cache__[moduleId];
			/******/ if (cachedModule !== undefined) {
				/******/ return cachedModule.exports;
				/******/
			}
			/******/ // Create a new module (and put it into the cache)
			/******/ var module = (__webpack_module_cache__[moduleId] = {
				/******/ // no module.id needed
				/******/ // no module.loaded needed
				/******/ exports: {},
				/******/
			});
			/******/
			/******/ // Execute the module function
			/******/ __webpack_modules__[moduleId](
				module,
				module.exports,
				__webpack_require__
			);
			/******/
			/******/ // Return the exports of the module
			/******/ return module.exports;
			/******/
		}
		/******/
		/************************************************************************/
		/******/ /* webpack/runtime/compat get default export */
		/******/ (() => {
			/******/ // getDefaultExport function for compatibility with non-harmony modules
			/******/ __webpack_require__.n = (module) => {
				/******/ var getter =
					module && module.__esModule
						? /******/ () => module['default']
						: /******/ () => module;
				/******/ __webpack_require__.d(getter, { a: getter });
				/******/ return getter;
				/******/
			};
			/******/
		})();
		/******/
		/******/ /* webpack/runtime/define property getters */
		/******/ (() => {
			/******/ // define getter functions for harmony exports
			/******/ __webpack_require__.d = (exports, definition) => {
				/******/ for (var key in definition) {
					/******/ if (
						__webpack_require__.o(definition, key) &&
						!__webpack_require__.o(exports, key)
					) {
						/******/ Object.defineProperty(exports, key, {
							enumerable: true,
							get: definition[key],
						});
						/******/
					}
					/******/
				}
				/******/
			};
			/******/
		})();
		/******/
		/******/ /* webpack/runtime/hasOwnProperty shorthand */
		/******/ (() => {
			/******/ __webpack_require__.o = (obj, prop) =>
				Object.prototype.hasOwnProperty.call(obj, prop);
			/******/
		})();
		/******/
		/******/ /* webpack/runtime/make namespace object */
		/******/ (() => {
			/******/ // define __esModule on exports
			/******/ __webpack_require__.r = (exports) => {
				/******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
					/******/ Object.defineProperty(exports, Symbol.toStringTag, {
						value: 'Module',
					});
					/******/
				}
				/******/ Object.defineProperty(exports, '__esModule', { value: true });
				/******/
			};
			/******/
		})();
		/******/
		/************************************************************************/
		var __webpack_exports__ = {};
		// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
		(() => {
			/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/
			__webpack_require__.r(__webpack_exports__);
			/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ =
				__webpack_require__(/*! electron */ 'electron');
			/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default =
				/*#__PURE__*/ __webpack_require__.n(
					electron__WEBPACK_IMPORTED_MODULE_0__
				);
			// Disable no-unused-vars, broken for spread args
			/* eslint no-unused-vars: off */

			const electronHandler = {
				ipcRenderer: {
					sendMessage(channel, ...args) {
						electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(
							channel,
							...args
						);
					},
					on(channel, func) {
						const subscription = (_event, ...args) => func(...args);
						electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(
							channel,
							subscription
						);
						return () => {
							electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(
								channel,
								subscription
							);
						};
					},
					once(channel, func) {
						electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.once(
							channel,
							(_event, ...args) => func(...args)
						);
					},
				},
				// https://gist.github.com/samcodee/d4320006d366a2c47048014644ddc375
				electronStore: {
					get(val, def) {
						const x =
							electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.sendSync(
								'electron-store-get',
								val,
								def
							);
						return x;
					},
					set(property, val) {
						electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(
							'electron-store-set',
							property,
							val
						);
					},
					// Other method you want to add like has(), reset(), etc.
				},
			};
			electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld(
				'electron',
				electronHandler
			);
		})();

		/******/ return __webpack_exports__;
		/******/
	})();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05BLGlEQUFpRDtBQUNqRCxnQ0FBZ0M7QUFDd0M7QUFJeEUsTUFBTSxlQUFlLEdBQUc7SUFDdEIsV0FBVyxFQUFFO1FBQ1gsV0FBVyxDQUFDLE9BQWlCLEVBQUUsR0FBRyxJQUFlO1lBQy9DLGlEQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxFQUFFLENBQUMsT0FBaUIsRUFBRSxJQUFrQztZQUN0RCxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQXdCLEVBQUUsR0FBRyxJQUFlLEVBQUUsRUFBRSxDQUNwRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNoQixpREFBVyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFdEMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsaURBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQztRQUNKLENBQUM7UUFDRCxJQUFJLENBQUMsT0FBaUIsRUFBRSxJQUFrQztZQUN4RCxpREFBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztLQUNGO0lBQ0Qsb0VBQW9FO0lBQ3BFLGFBQWEsRUFBRTtRQUNiLEdBQUcsQ0FBQyxHQUFRLEVBQUUsR0FBUTtZQUNwQixNQUFNLENBQUMsR0FBRyxpREFBVyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0QsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBQ0QsR0FBRyxDQUFDLFFBQWEsRUFBRSxHQUFRO1lBQ3pCLGlEQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQ0QseURBQXlEO0tBQzFEO0NBQ0YsQ0FBQztBQUVGLG1EQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZ29kbW9kZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vZ29kbW9kZS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9nb2Rtb2RlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2dvZG1vZGUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZ29kbW9kZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZ29kbW9kZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2dvZG1vZGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9nb2Rtb2RlLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIERpc2FibGUgbm8tdW51c2VkLXZhcnMsIGJyb2tlbiBmb3Igc3ByZWFkIGFyZ3Ncbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogb2ZmICovXG5pbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciwgSXBjUmVuZGVyZXJFdmVudCB9IGZyb20gJ2VsZWN0cm9uJztcblxuZXhwb3J0IHR5cGUgQ2hhbm5lbHMgPSAnaXBjLWV4YW1wbGUnO1xuXG5jb25zdCBlbGVjdHJvbkhhbmRsZXIgPSB7XG4gIGlwY1JlbmRlcmVyOiB7XG4gICAgc2VuZE1lc3NhZ2UoY2hhbm5lbDogQ2hhbm5lbHMsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICB9LFxuICAgIG9uKGNoYW5uZWw6IENoYW5uZWxzLCBmdW5jOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkKSB7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCAuLi5hcmdzOiB1bmtub3duW10pID0+XG4gICAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgICBpcGNSZW5kZXJlci5vbihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfTtcbiAgICB9LFxuICAgIG9uY2UoY2hhbm5lbDogQ2hhbm5lbHMsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICAgIGlwY1JlbmRlcmVyLm9uY2UoY2hhbm5lbCwgKF9ldmVudCwgLi4uYXJncykgPT4gZnVuYyguLi5hcmdzKSk7XG4gICAgfSxcbiAgfSxcbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vc2FtY29kZWUvZDQzMjAwMDZkMzY2YTJjNDcwNDgwMTQ2NDRkZGMzNzVcbiAgZWxlY3Ryb25TdG9yZToge1xuICAgIGdldCh2YWw6IGFueSwgZGVmOiBhbnkpIHtcbiAgICAgIGNvbnN0IHggPSBpcGNSZW5kZXJlci5zZW5kU3luYygnZWxlY3Ryb24tc3RvcmUtZ2V0JywgdmFsLCBkZWYpO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSxcbiAgICBzZXQocHJvcGVydHk6IGFueSwgdmFsOiBhbnkpIHtcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoJ2VsZWN0cm9uLXN0b3JlLXNldCcsIHByb3BlcnR5LCB2YWwpO1xuICAgIH0sXG4gICAgLy8gT3RoZXIgbWV0aG9kIHlvdSB3YW50IHRvIGFkZCBsaWtlIGhhcygpLCByZXNldCgpLCBldGMuXG4gIH0sXG59O1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbicsIGVsZWN0cm9uSGFuZGxlcik7XG5cbmV4cG9ydCB0eXBlIEVsZWN0cm9uSGFuZGxlciA9IHR5cGVvZiBlbGVjdHJvbkhhbmRsZXI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
