function getCookie(id) {
    var start = document.cookie.indexOf(id + '=');
    var len = start + id.length + 1;

    if ((!start) && (id != document.cookie.substring(0, id.length))) {
        start = null;
        len = null;
        return null;
    }

    if (start == -1) {
        start = null;
        len = null;
        return null;
    }

    var end = document.cookie.indexOf(';', len);

    if (end == -1) {
        end = document.cookie.length;
    }

    return unescape(document.cookie.substring(len, end));
}

var backgroundColor = '#ed1c23';
var tokenID = getCookie('EasyWork.TokenID');
if (tokenID) {
    var roleID = tokenID.substring(27, 29);
    if (roleID == '10') {
        backgroundColor = '#192B80';
    }
    else if (roleID == '20') {
        backgroundColor = '#50417B';
    }
    else if (roleID == '50') {
        backgroundColor = '#530205';
    }
}
var style = document.createElement('style');
style.innerHTML = '.pl-container{position:absolute;top:0;left:0;background-color:#fff;width:100vw;height:100vh;z-index:999}.pl-cube-grid{position:absolute;left:50%;top:50%;margin:-20px 0 0 -20px;width:40px;height:40px}.pl-cube-grid .pl-cube{width:33%;height:33%;background-color:' + backgroundColor + ';float:left;-webkit-animation:pl-cubeGridScaleDelay 1.3s infinite ease-in-out;animation:pl-cubeGridScaleDelay 1.3s infinite ease-in-out}.pl-cube-grid .pl-cube1{-webkit-animation-delay:.2s;animation-delay:.2s}.pl-cube-grid .pl-cube2{-webkit-animation-delay:.3s;animation-delay:.3s}.pl-cube-grid .pl-cube3{-webkit-animation-delay:.4s;animation-delay:.4s}.pl-cube-grid .pl-cube4{-webkit-animation-delay:.1s;animation-delay:.1s}.pl-cube-grid .pl-cube5{-webkit-animation-delay:.2s;animation-delay:.2s}.pl-cube-grid .pl-cube6{-webkit-animation-delay:.3s;animation-delay:.3s}.pl-cube-grid .pl-cube7{-webkit-animation-delay:0s;animation-delay:0s}.pl-cube-grid .pl-cube8{-webkit-animation-delay:.1s;animation-delay:.1s}.pl-cube-grid .pl-cube9{-webkit-animation-delay:.2s;animation-delay:.2s}@-webkit-keyframes pl-cubeGridScaleDelay{0%,100%,70%{-webkit-transform:scale3D(1,1,1);transform:scale3D(1,1,1)}35%{-webkit-transform:scale3D(0,0,1);transform:scale3D(0,0,1)}}@keyframes pl-cubeGridScaleDelay{0%,100%,70%{-webkit-transform:scale3D(1,1,1);transform:scale3D(1,1,1)}35%{-webkit-transform:scale3D(0,0,1);transform:scale3D(0,0,1)}}.wtBorder{background-color:' + backgroundColor + ' !important;}';
document.head.appendChild(style);

// var pageBackground = document.createElement('div');
// pageBackground.id = 'pageLoader';
// pageBackground.classList.add('pl-container');
// pageBackground.innerHTML = '<div class="pl-cube-grid"><div class="pl-cube pl-cube1"></div><div class="pl-cube pl-cube2"></div><div class="pl-cube pl-cube3"></div><div class="pl-cube pl-cube4"></div><div class="pl-cube pl-cube5"></div><div class="pl-cube pl-cube6"></div><div class="pl-cube pl-cube7"></div><div class="pl-cube pl-cube8"></div><div class="pl-cube pl-cube9"></div></div>';
// document.body.appendChild(pageBackground);

var agent = navigator.userAgent.toLowerCase();
var isIE = (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
if (isIE == true) {
    !function (t, e) { "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.ES6Promise = e() }(this, function () { "use strict"; function t(t) { var e = typeof t; return null !== t && ("object" === e || "function" === e) } function e(t) { return "function" == typeof t } function n(t) { W = t } function r(t) { z = t } function o() { return function () { return process.nextTick(a) } } function i() { return "undefined" != typeof U ? function () { U(a) } : c() } function s() { var t = 0, e = new H(a), n = document.createTextNode(""); return e.observe(n, { characterData: !0 }), function () { n.data = t = ++t % 2 } } function u() { var t = new MessageChannel; return t.port1.onmessage = a, function () { return t.port2.postMessage(0) } } function c() { var t = setTimeout; return function () { return t(a, 1) } } function a() { for (var t = 0; t < N; t += 2) { var e = Q[t], n = Q[t + 1]; e(n), Q[t] = void 0, Q[t + 1] = void 0 } N = 0 } function f() { try { var t = Function("return this")().require("vertx"); return U = t.runOnLoop || t.runOnContext, i() } catch (e) { return c() } } function l(t, e) { var n = this, r = new this.constructor(v); void 0 === r[V] && x(r); var o = n._state; if (o) { var i = arguments[o - 1]; z(function () { return T(o, r, i, n._result) }) } else j(n, r, t, e); return r } function h(t) { var e = this; if (t && "object" == typeof t && t.constructor === e) return t; var n = new e(v); return w(n, t), n } function v() { } function p() { return new TypeError("You cannot resolve a promise with itself") } function d() { return new TypeError("A promises callback cannot return that same promise.") } function _(t, e, n, r) { try { t.call(e, n, r) } catch (o) { return o } } function y(t, e, n) { z(function (t) { var r = !1, o = _(n, e, function (n) { r || (r = !0, e !== n ? w(t, n) : A(t, n)) }, function (e) { r || (r = !0, S(t, e)) }, "Settle: " + (t._label || " unknown promise")); !r && o && (r = !0, S(t, o)) }, t) } function m(t, e) { e._state === Z ? A(t, e._result) : e._state === $ ? S(t, e._result) : j(e, void 0, function (e) { return w(t, e) }, function (e) { return S(t, e) }) } function b(t, n, r) { n.constructor === t.constructor && r === l && n.constructor.resolve === h ? m(t, n) : void 0 === r ? A(t, n) : e(r) ? y(t, n, r) : A(t, n) } function w(e, n) { if (e === n) S(e, p()); else if (t(n)) { var r = void 0; try { r = n.then } catch (o) { return void S(e, o) } b(e, n, r) } else A(e, n) } function g(t) { t._onerror && t._onerror(t._result), E(t) } function A(t, e) { t._state === X && (t._result = e, t._state = Z, 0 !== t._subscribers.length && z(E, t)) } function S(t, e) { t._state === X && (t._state = $, t._result = e, z(g, t)) } function j(t, e, n, r) { var o = t._subscribers, i = o.length; t._onerror = null, o[i] = e, o[i + Z] = n, o[i + $] = r, 0 === i && t._state && z(E, t) } function E(t) { var e = t._subscribers, n = t._state; if (0 !== e.length) { for (var r = void 0, o = void 0, i = t._result, s = 0; s < e.length; s += 3)r = e[s], o = e[s + n], r ? T(n, r, o, i) : o(i); t._subscribers.length = 0 } } function T(t, n, r, o) { var i = e(r), s = void 0, u = void 0, c = !0; if (i) { try { s = r(o) } catch (a) { c = !1, u = a } if (n === s) return void S(n, d()) } else s = o; n._state !== X || (i && c ? w(n, s) : c === !1 ? S(n, u) : t === Z ? A(n, s) : t === $ && S(n, s)) } function M(t, e) { try { e(function (e) { w(t, e) }, function (e) { S(t, e) }) } catch (n) { S(t, n) } } function P() { return tt++ } function x(t) { t[V] = tt++, t._state = void 0, t._result = void 0, t._subscribers = [] } function C() { return new Error("Array Methods must be provided an Array") } function O(t) { return new et(this, t).promise } function k(t) { var e = this; return new e(L(t) ? function (n, r) { for (var o = t.length, i = 0; i < o; i++)e.resolve(t[i]).then(n, r) } : function (t, e) { return e(new TypeError("You must pass an array to race.")) }) } function F(t) { var e = this, n = new e(v); return S(n, t), n } function Y() { throw new TypeError("You must pass a resolver function as the first argument to the promise constructor") } function q() { throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.") } function D() { var t = void 0; if ("undefined" != typeof global) t = global; else if ("undefined" != typeof self) t = self; else try { t = Function("return this")() } catch (e) { throw new Error("polyfill failed because global object is unavailable in this environment") } var n = t.Promise; if (n) { var r = null; try { r = Object.prototype.toString.call(n.resolve()) } catch (e) { } if ("[object Promise]" === r && !n.cast) return } t.Promise = nt } var K = void 0; K = Array.isArray ? Array.isArray : function (t) { return "[object Array]" === Object.prototype.toString.call(t) }; var L = K, N = 0, U = void 0, W = void 0, z = function (t, e) { Q[N] = t, Q[N + 1] = e, N += 2, 2 === N && (W ? W(a) : R()) }, B = "undefined" != typeof window ? window : void 0, G = B || {}, H = G.MutationObserver || G.WebKitMutationObserver, I = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process), J = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, Q = new Array(1e3), R = void 0; R = I ? o() : H ? s() : J ? u() : void 0 === B && "function" == typeof require ? f() : c(); var V = Math.random().toString(36).substring(2), X = void 0, Z = 1, $ = 2, tt = 0, et = () => { function t(t, e) { this._instanceConstructor = t, this.promise = new t(v), this.promise[V] || x(this.promise), L(e) ? (this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 0 === this.length ? A(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(e), 0 === this._remaining && A(this.promise, this._result))) : S(this.promise, C()) } return t.prototype._enumerate = function (t) { for (var e = 0; this._state === X && e < t.length; e++)this._eachEntry(t[e], e) }, t.prototype._eachEntry = function (t, e) { var n = this._instanceConstructor, r = n.resolve; if (r === h) { var o = void 0, i = void 0, s = !1; try { o = t.then } catch (u) { s = !0, i = u } if (o === l && t._state !== X) this._settledAt(t._state, e, t._result); else if ("function" != typeof o) this._remaining--, this._result[e] = t; else if (n === nt) { var c = new n(v); s ? S(c, i) : b(c, t, o), this._willSettleAt(c, e) } else this._willSettleAt(new n(function (e) { return e(t) }), e) } else this._willSettleAt(r(t), e) }, t.prototype._settledAt = function (t, e, n) { var r = this.promise; r._state === X && (this._remaining--, t === $ ? S(r, n) : this._result[e] = n), 0 === this._remaining && A(r, this._result) }, t.prototype._willSettleAt = function (t, e) { var n = this; j(t, void 0, function (t) { return n._settledAt(Z, e, t) }, function (t) { return n._settledAt($, e, t) }) }, t }(), nt = () => { function t(e) { this[V] = P(), this._result = this._state = void 0, this._subscribers = [], v !== e && ("function" != typeof e && Y(), this instanceof t ? M(this, e) : q()) } return t.prototype["catch"] = function (t) { return this.then(null, t) }, t.prototype["finally"] = function (t) { var n = this, r = n.constructor; return e(t) ? n.then(function (e) { return r.resolve(t()).then(function () { return e }) }, function (e) { return r.resolve(t()).then(function () { throw e }) }) : n.then(t, t) }, t }(); return nt.prototype.then = l, nt.all = O, nt.race = k, nt.resolve = h, nt.reject = F, nt._setScheduler = n, nt._setAsap = r, nt._asap = z, nt.polyfill = D, nt.Promise = nt, nt });
    ES6Promise.polyfill();
}

(function () {
    var loader = {
        name: 'syn.loader',
        version: '1.0',
        resources: [],
        htmlFiles: [],
        scriptFiles: [],
        styleFiles: [],
        start: (new Date()).getTime(),
        logTimer: null,
        logCount: 0,
        argArgs: '',
        currentLoadedCount: 0,
        remainLoadedCount: 0,
        isEnableModuleLogging: sessionStorage.getItem('EnableModuleLogging') === 'true', // sessionStorage.setItem('EnableModuleLogging', true)
        isMinify: !(sessionStorage.getItem('DisableMinifyBundle') === 'true'), // sessionStorage.setItem('DisableMinifyBundle', true)
        isForceBundle: sessionStorage.getItem('EnableForceBundle') === 'true', // sessionStorage.setItem('EnableForceBundle', true)

        endsWith: function (str, suffix) {
            if (str === null || suffix === null) {
                return false;
            }
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },

        loadFiles: function () {
            loader.currentLoadedCount = 0;
            loader.remainLoadedCount = loader.htmlFiles.length + loader.scriptFiles.length + loader.styleFiles.length;

            function finishLoad() {
                if (loader.remainLoadedCount === loader.currentLoadedCount) {
                    loader.loadCallback();
                }
            }

            if (loader.htmlFiles.length > 0) {
                for (var i = 0; i < loader.htmlFiles.length; i++) {
                    var htmlFile = loader.htmlFiles[i];
                    var htmlObject = loader.toUrlObject(htmlFile);
                    var id = htmlObject.id || 'id_' + Math.random().toString(8);
                    loader.loadText(id, htmlFile);
                }
            }

            for (var i = 0; i < loader.styleFiles.length; i++) {
                var styleFile = loader.styleFiles[i];
                loader.eventLog('request', 'loading style ' + styleFile);

                var style = document.createElement('link');
                style.rel = 'stylesheet';
                style.href = styleFile + (styleFile.indexOf('?') > -1 ? '&' : '?') + loader.argArgs;
                style.type = 'text/css';

                if (styleFile.indexOf('dark_mode') > -1) {
                    style.id = 'dark_mode';
                }

                style.onload = function (evt) {
                    loader.eventLog('loaded', 'loaded style: ' + evt.target.href);
                    loader.currentLoadedCount++;
                    finishLoad();
                };
                style.onerror = function (evt) {
                    loader.eventLog('load error', 'loaded fail style: ' + evt.target.href);
                    loader.currentLoadedCount++;
                    finishLoad();
                };

                document.head.appendChild(style);
            }

            if (loader.scriptFiles.length > 0) {
                loader.loadScript(0);
            }
        },

        loadScript: function (i) {
            loader.eventLog('request', 'loading script ' + loader.scriptFiles[i]);

            var loadNextScript = () => {
                var nextIndex = i + 1;
                if (nextIndex < loader.scriptFiles.length) {
                    loader.loadScript(nextIndex);
                }
            };

            var src = loader.scriptFiles[i];
            src = src + (src.indexOf('?') > -1 ? '&' : '?') + loader.argArgs;

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.defer = 'defer';
            script.onload = function (evt) {
                loader.eventLog('loaded', 'Loaded script: ' + evt.target.src);
                loader.currentLoadedCount++;

                if (loader.remainLoadedCount === loader.currentLoadedCount) {
                    loader.loadCallback();
                }
                else {
                    loadNextScript();
                }
            };
            script.onerror = function (evt) {
                loader.eventLog('load error', 'Loaded fail script: ' + evt.target.src);
                loader.currentLoadedCount++;

                if (loader.remainLoadedCount === loader.currentLoadedCount) {
                    loader.loadCallback();
                }
                else {
                    loadNextScript();
                }
            };

            document.body.appendChild(script);
        },

        loadText: function (id, url) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url + (url.indexOf('?') > -1 ? '&' : '?') + 'noCache=' + (new Date()).getTime(), true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        if (xhr.status == 0) {
                            loader.eventLog('$w.loadText', 'X-Requested transfort error');
                        }
                        else {
                            loader.eventLog('$w.loadText', 'response status - {0}' + xhr.statusText + xhr.responseText);
                        }
                        return;
                    }

                    var script = document.createElement('script');
                    script.id = id;
                    script.type = 'text/html';
                    script.defer = 'defer';
                    script.innerHTML = xhr.responseText;

                    var head;
                    if (document.getElementsByTagName('head')) {
                        head = document.getElementsByTagName('head')[0];
                    }
                    else {
                        document.documentElement.insertBefore(document.createElement('head'), document.documentElement.firstChild);
                        head = document.getElementsByTagName('head')[0];
                    }

                    head.appendChild(script);
                }
            }
            xhr.send();
        },

        toUrlObject: function (url) {
            return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function (a, v) {
                return a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a;
            }, {});
        },

        request: function (resources) {
            loader.resources = resources;
            var length = resources.length;
            for (var i = 0; i < length; ++i) {
                var resource = resources[i];
                if (loader.endsWith(resource, '.css')) {
                    loader.styleFiles.push(resource);
                }
                else if (loader.endsWith(resource, '.js')) {
                    loader.scriptFiles.push(resource);
                }
                else if (loader.endsWith(resource, '.html') || resource.indexOf('.html?') > -1) {
                    loader.htmlFiles.push(resource);
                }
                else {
                    loader.eventLog('unknown filetype', resource);
                }
            }

            if (window.qafConfigName == 'syn.config.json') {
                var styleFiles = '/api/Bundle/Processing.css?files=' + JSON.stringify(loader.styleFiles) + (loader.isForceBundle == true ? '&force=1' : '') + '' + (loader.isMinify == true ? '' : '&minify=0');
                loader.eventLog('request', 'styleFiles: ' + styleFiles, 'Debug');
                loader.styleFiles.length = 0;
                loader.styleFiles.push(styleFiles);

                var scriptFiles = '/api/Bundle/Processing.js?files=' + JSON.stringify(loader.scriptFiles) + (loader.isForceBundle == true ? '&force=1' : '') + '' + (loader.isMinify == true ? '' : '&minify=0');
                loader.eventLog('request', 'scriptFiles: ' + scriptFiles, 'Debug');
                loader.scriptFiles.length = 0;
                loader.scriptFiles.push(scriptFiles);

                var moduleFile = '';
                if (window.moduleFile) {
                    moduleFile = window.moduleFile;
                }
                else {
                    var pathname = location.pathname;
                    if (pathname.split('/').length > 0) {
                        moduleFile = pathname.split('/')[location.pathname.split('/').length - 1];
                        moduleFile = moduleFile.split('.').length == 2 ? (moduleFile.indexOf('.') > -1 ? moduleFile.substring(0, moduleFile.indexOf('.')) : moduleFile) : '';
                    }
                }

                if (moduleFile.length > 0 && window[moduleFile] == undefined) {
                    loader.scriptFiles.push(moduleFile.indexOf('.js') > -1 ? moduleFile : moduleFile + '.js');
                }
            }

            loader.loadFiles();
        },

        getDefinedResources: function () {
            var result = [];
            var qafControlList = [];
            var synControls = document.querySelectorAll('[syn-datafield],[syn-options],[syn-events]');
            for (var i = 0; i < synControls.length; i++) {
                var qafControl = synControls[i];
                if (qafControl.tagName) {
                    var tagName = qafControl.tagName.toUpperCase();
                    var controlType = '';
                    var moduleName = null;

                    if (tagName.indexOf('QAF_') > -1) {
                        moduleName = tagName.substring(4).toLowerCase();
                        controlType = moduleName;
                    }
                    else {
                        switch (tagName) {
                            case 'BUTTON':
                                moduleName = 'button';
                                controlType = 'button';
                                break;
                            case 'INPUT':
                                controlType = qafControl.getAttribute('type').toLowerCase();
                                switch (controlType) {
                                    case 'hidden':
                                    case 'text':
                                    case 'password':
                                    case 'color':
                                    case 'email':
                                    case 'number':
                                    case 'search':
                                    case 'tel':
                                    case 'url':
                                        moduleName = 'textbox';
                                        break;
                                    case 'submit':
                                    case 'reset':
                                    case 'button':
                                        moduleName = 'button';
                                        break;
                                    case 'radio':
                                        moduleName = 'radio';
                                        break;
                                    case 'checkbox':
                                        moduleName = 'checkbox';
                                        break;
                                }
                                break;
                            case 'TEXTAREA':
                                moduleName = 'textarea';
                                controlType = 'textarea';
                                break;
                            case 'SELECT':
                                if (qafControl.getAttribute('multiple') == null) {
                                    moduleName = 'select';
                                    controlType = 'select';
                                }
                                else {
                                    moduleName = 'multiselect';
                                    controlType = 'multiselect';
                                }
                                break;
                            default:
                                break;
                        }
                    }

                    if (moduleName) {
                        qafControlList.push({
                            module: moduleName,
                            type: controlType ? controlType : qafControl.tagName.toLowerCase()
                        });
                    }
                }
            }

            result = qafControlList.filter(function (control, idx, arr) {
                return qafControlList.findIndex(function (item) {
                    return item.module === control.module && item.type === control.type;
                }) === idx;
            });

            result.unshift({
                module: 'before-default',
                type: 'before-default',
                css: [],
                js: [
                    '/assets/lib/jquery-3.6.0/jquery-3.6.0.js',
                    '/assets/lib/jquery.alertmodal.js',
                    '/assets/lib/jquery.simplemodal.js',
                    '/assets/lib/jquery.WM.js',
                    '/assets/lib/nanobar-0.4.2/nanobar.js',
                    '/assets/lib/Notifier.js',
                    '/assets/lib/clipboard-2.0.4/clipboard.js',
                    '/assets/js/syn.js',
                    '/assets/js/syn.domain.js'
                ]
            });

            for (var i = 0; i < result.length; i++) {
                var item = result[i];

                switch (item.module) {
                    case 'textbox':
                        item.css = ['/assets/js/UIControls/TextBox/TextBox.css'];
                        item.js = [
                            '/assets/lib/jquery.maskedinput-1.3.js',
                            '/assets/lib/ispin-2.0.1/ispin.js',
                            '/assets/lib/superplaceholder-1.0.0/superplaceholder.js',
                            '/assets/lib/vanilla-masker-1.1.1/vanilla-masker.js',
                            '/assets/js/UIControls/TextBox/TextBox.js'
                        ];
                        break;
                    case 'button':
                        item.css = ['/assets/js/UIControls/TextButton/TextButton.css'];
                        item.js = ['/assets/js/UIControls/TextButton/TextButton.js'];
                        break;
                    case 'radio':
                        item.css = ['/assets/js/UIControls/RadioButton/RadioButton.css'];
                        item.js = ['/assets/js/UIControls/RadioButton/RadioButton.js'];
                        break;
                    case 'checkbox':
                        item.css = [
                            '/assets/lib/css-checkbox-1.0.0/checkboxes.css',
                            '/assets/js/UIControls/CheckBox/CheckBox.css'
                        ];
                        item.js = ['/assets/js/UIControls/CheckBox/CheckBox.js'];
                        break;
                    case 'textarea':
                        item.css = [
                            '/assets/lib/codemirror-5.50.2/codemirror.css',
                            '/assets/js/UIControls/TextArea/TextArea.css'
                        ];
                        item.js = [
                            '/assets/lib/codemirror-5.50.2/codemirror.js',
                            '/assets/js/UIControls/TextArea/TextArea.js'
                        ];
                        break;
                    case 'select':
                        item.css = [
                            '/assets/lib/tail.select-0.5.15/css/default/tail.select-light.css',
                            '/assets/js/UIControls/DropDownList/DropDownList.css'
                        ];
                        item.js = [
                            '/assets/lib/tail.select-0.5.15/js/tail.select.js',
                            '/assets/js/UIControls/DropDownList/DropDownList.js'
                        ];
                        break;
                    case 'multiselect':
                        item.css = [
                            '/assets/lib/tail.select-0.5.15/css/default/tail.select-light.css',
                            '/assets/js/UIControls/DropDownCheckList/DropDownCheckList.css'
                        ];
                        item.js = [
                            '/assets/lib/tail.select-0.5.15/js/tail.select.js',
                            '/assets/js/UIControls/DropDownCheckList/DropDownCheckList.js'
                        ];
                        break;
                    case 'chartjs':
                        item.css = [
                            '/assets/lib/chartjs-2.9.3/Chart.css',
                            '/assets/js/UIControls/Chart/ChartJS.css'
                        ];
                        item.js = [
                            '/assets/lib/chartjs-2.9.3/Chart.bundle.js',
                            '/assets/lib/chartjs-plugin-colorschemes-0.4.0/chartjs-plugin-colorschemes.js',
                            '/assets/js/UIControls/Chart/ChartJS.js'
                        ];
                        break;
                    case 'codepicker':
                        item.css = ['/assets/js/UIControls/CodePicker/CodePicker.css'];
                        item.js = ['/assets/js/UIControls/CodePicker/CodePicker.js'];
                        break;
                    case 'colorpicker':
                        item.css = [
                            '/assets/lib/color-picker-1.0.0/color-picker.css',
                            '/assets/js/UIControls/ColorPicker/ColorPicker.css'
                        ];
                        item.js = [
                            '/assets/lib/color-picker-1.0.0/color-picker.js',
                            '/assets/js/UIControls/ColorPicker/ColorPicker.js'
                        ];
                        break;
                    case 'contextmenu':
                        item.css = [
                            '/assets/lib/jquery-ui-contextmenu-1.18.1/jquery-ui.css',
                            '/assets/js/UIControls/ContextMenu/ContextMenu.css'
                        ];
                        item.js = [
                            '/assets/lib/jquery-ui-contextmenu-1.18.1/jquery-ui.js',
                            '/assets/lib/jquery-ui-contextmenu-1.18.1/jquery.ui-contextmenu.js',
                            '/assets/js/UIControls/ContextMenu/ContextMenu.js'
                        ];
                        break;
                    case 'data':
                        item.css = ['/assets/js/UIControls/DataSource/DataSource.css'];
                        item.js = ['/assets/js/UIControls/DataSource/DataSource.js'];
                        break;
                    case 'datepicker':
                        item.css = [
                            '/assets/lib/pikaday-1.8.0/pikaday.css',
                            '/assets/js/UIControls/TextBox/TextBox.css',
                            '/assets/js/UIControls/DatePicker/DatePicker.css'
                        ];
                        item.js = [
                            '/assets/lib/jquery.maskedinput-1.3.js',
                            '/assets/lib/ispin-2.0.1/ispin.js',
                            '/assets/lib/moment-2.24.0/moment.js',
                            '/assets/lib/pikaday-1.8.0/pikaday.js',
                            '/assets/lib/superplaceholder-1.0.0/superplaceholder.js',
                            '/assets/js/UIControls/TextBox/TextBox.js',
                            '/assets/js/UIControls/DatePicker/DatePicker.js'
                        ];
                        break;
                    case 'fileclient':
                        item.css = ['/assets/js/UIControls/FileClient/FileClient.css'];
                        item.js = ['/assets/js/UIControls/FileClient/FileClient.js'];
                        break;
                    case 'list':
                        item.css = ['/assets/js/UIControls/GridList/GridList.css'];
                        item.js = [
                            '/assets/lib/datatable-1.10.21/datatables.js',
                            '/assets/lib/datatable-1.10.21/dataTables.checkboxes.js',
                            '/assets/js/UIControls/GridList/GridList.js'
                        ];
                        break;
                    case 'htmleditor':
                        item.css = ['/assets/js/UIControls/HtmlEditor/HtmlEditor.css'];
                        item.js = ['/assets/js/UIControls/HtmlEditor/HtmlEditor.js'];
                        break;
                    case 'jsoneditor':
                        item.css = ['/assets/js/UIControls/JsonEditor/JsonEditor.css'];
                        item.js = ['/assets/js/UIControls/JsonEditor/JsonEditor.js'];
                        break;
                    case 'organization':
                        item.css = [
                            '/assets/lib/orgchart-3.1.1/jquery.orgchart.css',
                            '/assets/js/UIControls/OrganizationView/OrganizationView.css'
                        ];
                        item.js = [
                            '/assets/lib/orgchart-3.1.1/jquery.orgchart.js',
                            '/assets/js/UIControls/OrganizationView/OrganizationView.js'
                        ];
                        break;
                    case 'sourceeditor':
                        item.css = ['/assets/js/UIControls/SourceEditor/SourceEditor.css'];
                        item.js = ['/assets/js/UIControls/SourceEditor/SourceEditor.js'];
                        break;
                    case 'editor':
                        item.css = ['/assets/js/UIControls/TextEditor/TextEditor.css'];
                        item.js = ['/assets/js/UIControls/TextEditor/TextEditor.js'];
                        break;
                    case 'tree':
                        item.css = [
                            '/assets/lib/fancytree-2.38.0/skin-win8/ui.fancytree.css',
                            '/assets/js/UIControls/TreeView/TreeView.css'
                        ];
                        item.js = [
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.ui-deps.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.persist.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.multi.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.dnd5.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.filter.js',
                            '/assets/js/UIControls/TreeView/TreeView.js'
                        ];
                        break;
                    case 'grid':
                        item.css = [
                            '/assets/js/UIControls/DataSource/DataSource.css',
                            '/assets/js/UIControls/CodePicker/CodePicker.css',
                            '/assets/lib/handsontable-7.4.2/handsontable.full.css',
                            '/assets/js/UIControls/WebGrid/WebGrid.css'
                        ];
                        item.js = [
                            '/assets/js/UIControls/DataSource/DataSource.js',
                            '/assets/js/UIControls/CodePicker/CodePicker.js',
                            '/assets/lib/papaparse-5.3.0/papaparse.js',
                            '/assets/lib/sheetjs-0.16.8/xlsx.core.min.js',
                            '/assets/lib/handsontable-7.4.2/handsontable.full.js',
                            '/assets/lib/handsontable-7.4.2/languages/ko-KR.js',
                            '/assets/js/UIControls/WebGrid/WebGrid.js'
                        ];
                        break;
                }
            }

            result.push({
                module: 'after-default',
                type: 'after-default',
                css: [
                    // syn.domain.js
                    '/assets/css/Layouts/Dialogs.css',
                    '/assets/css/Layouts/LoadingPage.css',
                    '/assets/css/Layouts/ProgressBar.css',
                    '/assets/css/Layouts/Tooltips.css',
                    '/assets/css/Layouts/WindowManager.css',
                    '/assets/css/UIControls/Control.css',

                    // 프로젝트 화면 디자인
                    '/assets/css/systemFont.css',
                    '/assets/css/common.css',
                    '/assets/css/system.css',
                    '/assets/css/remixicon.css',

                    // syn-utilities 화면 유틸리티
                    '/assets/css/syn-utilities.css'
                ],
                js: ['/assets/lib/master-1.17.4/index.js']
            });

            return result;
        },

        loadCallback: function () {
            var isDarkMode = localStorage.getItem('isDarkMode') === 'true';
            if (location.pathname.startsWith('/views/') == true && isDarkMode == true) {
                syn.$w.loadStyle('/assets/css/dark_mode.css', 'dark_mode');
            }

            loader.eventLog('loadCallback', 'done');
        },

        eventLog: function (event, data) {
            if (loader.isEnableModuleLogging == false) {
                return;
            }

            var now = (new Date()).getTime(),
                diff = now - loader.start,
                value, div, text;

            value = loader.logCount.toString() +
                '@' + (diff / 1000).toString() +
                '[' + event + '] ' + JSON.stringify(data);

            if (window.console) {
                console.log(value);
            }
            else {
                div = document.createElement('DIV');
                text = document.createTextNode(value);

                div.appendChild(text);

                var eventlogs = document.getElementById('eventlogs');
                if (eventlogs) {
                    eventlogs.appendChild(div);

                    clearTimeout(loader.logTimer);
                    loader.logTimer = setTimeout(function () {
                        eventlogs.scrollTop = eventlogs.scrollHeight;
                    }, 10);
                }
                else {
                    document.body.appendChild(div);
                }
            }

            loader.logCount++;
        }
    };

    window.qafConfigName = sessionStorage.getItem('qafConfigName') || 'syn.config.json';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                window.qafConfig = JSON.parse(xhr.responseText);

                var loadFiles = null;
                var htmlFiles = [];
                var styleFiles = [];
                var jsFiles = [];

                if (window.qafConfigName == 'syn.config.json' && (window.qafLagacyLoadModule === undefined || window.qafLagacyLoadModule !== true)) {
                    var definedResource = loader.getDefinedResources();
                    var cssList = definedResource.map(function (item) { return item.css });
                    var jsList = definedResource.map(function (item) { return item.js });

                    for (var i = 0; i < cssList.length; i++) {
                        styleFiles = styleFiles.concat(cssList[i]);
                    }

                    for (var i = 0; i < jsList.length; i++) {
                        jsFiles = jsFiles.concat(jsList[i]);
                    }

                    /*
                    <script type="text/javascript">
                        function pageLoadFiles(styleFiles, jsFiles, htmlFiles) {
                            styleFiles.push('/assets/js/UIControls/GridList/GridList.css');
                            jsFiles.push('/assets/lib/datatable-1.10.21/datatables.js');
                            jsFiles.push('/assets/js/UIControls/GridList/GridList.js');
                        }
                    </script>
                     */
                    if (window.pageLoadFiles) {
                        pageLoadFiles(jsFiles, styleFiles, htmlFiles);
                        loadFiles = styleFiles.concat(jsFiles).concat(htmlFiles);
                    }
                    else {
                        loadFiles = styleFiles.concat(jsFiles);
                    }

                    var roleID = null;
                    var member = JSON.parse(sessionStorage.getItem('member'));;
                    if (member != null) {
                        result = JSON.parse(decodeURIComponent(atob(member).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join('')));

                        roleID = result.Roles[0];
                    }

                    if (roleID != null) {
                        // loadFiles.push('/assets/css/system_' + roleID + '.css');
                    }

                    loadFiles.push('/assets/css/company/system_' + (getCookie('FileBusinessID') || location.hostname) + '.css');
                    if (window.beforeLoadFiles && window.beforeLoadFiles.length > 0) {
                        for (var i = window.beforeLoadFiles.length - 1; i >= 0; i--) {
                            loadFiles.unshift(window.beforeLoadFiles[i]);
                        }
                    }

                    if (window.afterLoadFiles && window.afterLoadFiles.length > 0) {
                        for (var i = window.afterLoadFiles.length - 1; i >= 0; i--) {
                            loadFiles.push(window.afterLoadFiles[i]);
                        }
                    }
                }
                else {
                    if (qafConfig.Environment == 'Development') {
                        styleFiles = [
                            // syn.scripts.js
                            '/assets/lib/handsontable-7.4.2/handsontable.full.css',
                            '/assets/lib/datatable-1.10.21/datatables.css',
                            '/assets/lib/datatable-1.10.21/dataTables.checkboxes.css',
                            '/assets/lib/tingle-0.15.2/tingle.css',
                            '/assets/lib/tail.select-0.5.15/css/default/tail.select-light.css',
                            '/assets/lib/ispin-2.0.1/ispin.css',
                            '/assets/lib/flatpickr-4.6.3/flatpickr.css',
                            '/assets/lib/filedrop-1.0.0/filedrop.css',
                            '/assets/lib/css-checkbox-1.0.0/checkboxes.css',
                            '/assets/lib/color-picker-1.0.0/color-picker.css',
                            '/assets/lib/codemirror-5.50.2/codemirror.css',
                            '/assets/lib/chartjs-2.9.3/Chart.css',
                            '/assets/lib/fancytree-2.38.0/skin-win8/ui.fancytree.css',
                            '/assets/lib/jquery-ui-contextmenu-1.18.1/jquery-ui.css',
                            '/assets/lib/orgchart-3.1.1/jquery.orgchart.css',

                            // syn.domain.js
                            '/assets/css/Layouts/Dialogs.css',
                            '/assets/css/Layouts/LoadingPage.css',
                            '/assets/css/Layouts/ProgressBar.css',
                            '/assets/css/Layouts/Tooltips.css',
                            '/assets/css/Layouts/WindowManager.css',
                            '/assets/css/UIControls/Control.css',

                            // syn.controls.js
                            '/assets/js/UIControls/Chart/ChartJS.css',
                            '/assets/js/UIControls/CheckBox/CheckBox.css',
                            '/assets/js/UIControls/ColorPicker/ColorPicker.css',
                            '/assets/js/UIControls/ContextMenu/ContextMenu.css',
                            '/assets/js/UIControls/DataSource/DataSource.css',
                            '/assets/js/UIControls/DatePicker/DatePicker.css',
                            '/assets/js/UIControls/DropDownCheckList/DropDownCheckList.css',
                            '/assets/js/UIControls/DropDownList/DropDownList.css',
                            '/assets/js/UIControls/FileClient/FileClient.css',
                            '/assets/js/UIControls/GridList/GridList.css',
                            '/assets/js/UIControls/OrganizationView/OrganizationView.css',
                            '/assets/js/UIControls/RadioButton/RadioButton.css',
                            '/assets/js/UIControls/TextArea/TextArea.css',
                            '/assets/js/UIControls/TextBox/TextBox.css',
                            '/assets/js/UIControls/TextButton/TextButton.css',
                            '/assets/js/UIControls/TextEditor/TextEditor.css',
                            '/assets/js/UIControls/HtmlEditor/HtmlEditor.css',
                            '/assets/js/UIControls/TreeView/TreeView.css',
                            '/assets/js/UIControls/WebGrid/WebGrid.css',

                            // 프로젝트 화면 디자인
                            '/assets/css/systemFont.css',
                            '/assets/css/common.css',
                            '/assets/css/system.css',
                            '/assets/css/remixicon.css',

                            // syn-utilities 화면 유틸리티
                            '/assets/css/syn-utilities.css'
                        ];

                        jsFiles = [
                            '/assets/js/syn.scripts.js',
                            '/assets/js/syn.js',
                            '/assets/js/syn.domain.js',
                            '/assets/js/syn.controls.js',
                            '/assets/lib/master-1.17.4/index.js'
                        ];
                    }
                    else {
                        if (qafConfig.IsDebugMode == true) {
                            styleFiles = [
                                '/assets/css/syn.bundle.css'
                            ];

                            jsFiles = [
                                '/assets/js/syn.bundle.js'
                            ];
                        }
                        else {
                            styleFiles = [
                                '/assets/css/syn.bundle.min.css'
                            ];

                            jsFiles = [
                                '/assets/js/syn.bundle.min.js'
                            ];
                        }

                        jsFiles.push('/assets/lib/master-1.17.4/index.js');
                    }

                    /*
                    <script type="text/javascript">
                        function pageLoadFiles(styleFiles, jsFiles, htmlFiles) {
                            styleFiles.push('/assets/js/UIControls/GridList/GridList.css');
                            jsFiles.push('/assets/lib/datatable-1.10.21/datatables.js');
                            jsFiles.push('/assets/js/UIControls/GridList/GridList.js');
                        }
                    </script>
                     */
                    if (window.pageLoadFiles) {
                        pageLoadFiles(jsFiles, styleFiles, htmlFiles);
                        loadFiles = styleFiles.concat(jsFiles).concat(htmlFiles);
                    }
                    else {
                        loadFiles = styleFiles.concat(jsFiles);
                    }

                    var roleID = null;
                    var member = JSON.parse(sessionStorage.getItem('member'));;
                    if (member != null) {
                        result = JSON.parse(decodeURIComponent(atob(member).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join('')));

                        roleID = result.Roles[0];
                    }

                    if (roleID != null) {
                        // loadFiles.push('/assets/css/system_' + roleID + '.css');
                    }

                    loadFiles.push('/assets/css/company/system_' + (getCookie('FileBusinessID') || location.hostname) + '.css');
                    if (window.beforeLoadFiles && window.beforeLoadFiles.length > 0) {
                        for (var i = window.beforeLoadFiles.length - 1; i >= 0; i--) {
                            loadFiles.unshift(window.beforeLoadFiles[i]);
                        }
                    }

                    if (window.afterLoadFiles && window.afterLoadFiles.length > 0) {
                        for (var i = window.afterLoadFiles.length - 1; i >= 0; i--) {
                            loadFiles.push(window.afterLoadFiles[i]);
                        }
                    }

                    var moduleFile = '';
                    if (window.moduleFile) {
                        moduleFile = window.moduleFile;
                    }
                    else {
                        var pathname = location.pathname;
                        if (pathname.split('/').length > 0) {
                            moduleFile = pathname.split('/')[location.pathname.split('/').length - 1];
                            moduleFile = moduleFile.split('.').length == 2 ? (moduleFile.indexOf('.') > -1 ? moduleFile.substring(0, moduleFile.indexOf('.')) : moduleFile) : '';
                        }
                    }

                    if (moduleFile.length > 0 && window[moduleFile] == undefined) {
                        loadFiles.push(moduleFile.indexOf('.js') > -1 ? moduleFile : moduleFile + '.js');
                    }
                }

                loader.argArgs = getCookie('syn.iscache') == 'true' ? '' : 'bust=' + new Date().getTime();
                loader.request(loadFiles);
            }
            else {
                loader.eventLog('unknown filetype', resource);
                loader.eventLog('loadJson', ' ' + window.qafConfigName + ', ' + xhr.status.toString() + ', ' + xhr.responseText, 'Error');
            }
        }
    };
    xhr.open('GET', '/' + window.qafConfigName, true);
    xhr.send();
}());

document.onkeydown = function (evt) {
    if (evt.ctrlKey == true && evt.altKey == true && evt.shiftKey == true) {
        if (evt.keyCode == '68') {
            if (window.parent && window.parent.$w && window.parent.$w.pageScript == '$MainFrame') {
                window.parent.$MainFrame.toogleDarkMode();
            }
            else {
                var isDarkMode = (window.localStorage && localStorage.getItem('isDarkMode') == 'true');
                var urlFlag = '?darkMode=' + (!isDarkMode).toString();
                if (isDarkMode == false) {
                    localStorage.setItem('isDarkMode', true);

                    syn.$w.loadStyle('/assets/css/dark_mode.css' + urlFlag, 'dark_mode');
                }
                else {
                    localStorage.setItem('isDarkMode', false);

                    $m.remove(syn.$l.get('dark_mode'));
                }
            }
        }
        else if (evt.keyCode == '69') {
            if (window.parent && window.parent.$w && window.parent.$w.pageScript == '$MainFrame') {
                window.parent.$MainFrame.toogleDeveloperMode();
            }
            else {
                window.qafConfigName = sessionStorage.getItem('qafConfigName') || 'syn.config.json';
                if (window.qafConfigName == 'syn.config.json') {
                    sessionStorage.setItem('qafConfigName', 'syn.config.dev.json');
                }
                else {
                    sessionStorage.setItem('qafConfigName', 'syn.config.json');
                }
            }
        }
    }
}