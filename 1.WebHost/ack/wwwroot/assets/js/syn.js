/*!
HAND Stack Javascript Library v1.0.0
https://syn.handshake.kr

Copyright 2022, HAND Stack
*/
var getGlobal = function () {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    if (typeof this !== 'undefined') return this;
    throw new Error('전역 객체를 찾을 수 없습니다');
};

var globalRoot = getGlobal();
globalRoot.devicePlatform = 'browser';
if ('AndroidScript' in globalRoot) {
    globalRoot.devicePlatform = 'android';
}
else if ('webkit' in globalRoot) {
    globalRoot.devicePlatform = 'ios';
}
else if ('process' in globalRoot && typeof module === 'object') {
    globalRoot.devicePlatform = 'node';
}

var syn = syn || function () { };
syn.module = function () { };
syn.module.extend = function (newType, staticType) {
    var extend = syn.module.prototype.extend;

    syn.module.prototyping = true;
    var prototype = new this;

    extend.call(prototype, newType);

    prototype.base = function () {
    };

    delete syn.module.prototyping;

    var constructor = prototype.constructor;
    var object = prototype.constructor = function () {
        if (!syn.module.prototyping) {
            if (this.constructing || this.constructor == object) {
                this.constructing = true;
                constructor.apply(this, arguments);

                delete this.constructing;
            }
            else if (arguments[0] != null) {
                return (arguments[0].extend || extend).call(arguments[0], prototype);
            }
        }
    };

    object.ancestor = this;
    object.extend = this.extend;
    object.each = this.each;
    object.implement = this.implement;
    object.prototype = prototype;
    object.toString = this.toString;
    object.valueOf = function (type) {
        return (type == 'object') ? object : constructor.valueOf();
    }

    extend.call(object, staticType);

    if (typeof object.init == 'function') {
        object.init();
    }

    return object;
};

syn.module.prototype = {
    extend(source, val) {
        if (arguments.length > 1) {
            var ancestor = this[source];
            if (ancestor && (typeof val == 'function') && (!ancestor.valueOf || ancestor.valueOf() != val.valueOf()) && /\bbase\b/.test(val)) {
                var method = val.valueOf();

                val = function () {
                    var previous = this.base || syn.module.prototype.base;
                    this.base = ancestor;
                    var returnValue = method.apply(this, arguments);
                    this.base = previous;
                    return returnValue;
                };

                val.valueOf = function (type) {
                    return (type == 'object') ? val : method;
                };

                val.toString = syn.module.toString;
            }
            this[source] = val;
        }
        else if (source) {
            var extend = syn.module.prototype.extend;

            if (!syn.module.prototyping && typeof this != 'function') {
                extend = this.extend || extend;
            }
            var prototype = { toSource: null }
            var hidden = ['constructor', 'toString', 'valueOf', 'concreate'];
            var i = syn.module.prototyping ? 0 : 1;
            while (key = hidden[i++]) {
                if (source[key] != prototype[key]) {
                    extend.call(this, key, source[key]);
                }
            }

            for (var key in source) {
                if (!prototype[key]) {
                    extend.call(this, key, source[key]);
                }
            }

            var concreate = source['concreate'];
            if (concreate) {
                concreate(source);
            }
        }
        return this;
    }
};

syn.module = syn.module.extend(
    {
        constructor() {
            this.extend(arguments[0]);
        },

        concreate() {
        }
    },
    {
        ancestor: Object,

        version: '1.0',

        each(els, func, props) {
            if (func == undefined || func.length == 0) {
                return;
            }

            for (var key in els) {
                if (typeof els[key] === 'object') {
                    func.apply(els[key], props);
                }
            }
        },

        implement() {
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (typeof arguments[i] === 'function') {
                    arguments[i](this.prototype);
                }
                else {
                    this.prototype.extend(arguments[i]);
                }
            }
            return this;
        },

        toString() {
            return String(this.valueOf());
        }
    });

globalRoot.syn = syn;

/// <reference path='syn.core.js' />

/// <code>
/// $exception.add('CustomException', errorHandler, 'Custom Exception 처리입니다.', 0);
/// 
/// try {
///     alert('error!!!' // ApplicationException 호출
///     throw e; // CustomException 호출
/// }
/// catch (e) {
///     if (e instanceof TypeError) {
///     }
///     else if (e instanceof RangeError) {
///     }
///     else if (e instanceof SyntaxError) {
///     }
///     else {
///     }
/// 
///     $exception.actionHandler('CustomException', e);
/// }
/// 
/// function errorHandler(exception) {
///     alert(exception.message + ' ' + this.message);
/// }
/// </code>
(function (context) {
    'use strict';
    var $exception = context.$exception || new syn.module();

    $exception.extend({
        version: '1.0',
        exceptions: [],

        add(id, func, message) {
            var errorInfo = [];
            errorInfo['message'] = message;
            errorInfo['id'] = id;
            errorInfo['func'] = func;

            this.exceptions[id] = errorInfo;
            return this;
        },

        remove(id) {
            this.exceptions[id] = null;
            return this;
        },

        actionHandler(id, exception) {
            this.exceptions[id].func(exception);
            return this;
        },

        exceptionHandler() {
            return this.exceptions[id].func;
        }
    });

    (function () {
        function applicationException(message, url) {
            alert(message + url);
            return true;
        };

        $exception.add('ApplicationException', applicationException, 'Exception Templete Message.', '99999');

        //window.onerror = applicationException;
    })();
    syn.$e = $exception;
})(globalRoot);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $resource = context.$resource || new syn.module();
    var document = context.document;

    $resource.extend({
        version: '1.0',
        localeID: 'ko-KR',
        fullyQualifiedLocale: {
            ko: 'ko-KR',
            en: 'en-US',
            ja: 'ja-JP',
            zh: 'zh-CN'
        },
        translations: {},
        translateControls: [],

        concreate() {
            return;
            var els = document.querySelectorAll('[syn-i18n]');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];

                var tagName = el.tagName.toUpperCase();
                var elID = el.getAttribute('id');
                var i18nOption = el.getAttribute('syn-i18n');

                if (i18nOption === undefined || i18nOption === null || i18nOption === '') {
                    continue;
                }

                var options = null;
                if (i18nOption.startsWith('{') == true) {
                    try {
                        options = eval('(' + i18nOption + ')');
                        if (options.options.bindSource === undefined || options.options.bindSource === null) {
                            options.bindSource = 'content';
                        }
                        else {
                            options.bindSource = options.options.bindSource;
                        }
                    } catch (error) {
                        console.log('$resource.concreate, tagName: "' + tagName + '", elID: "' + elID + '" syn-i18n 확인 필요, error: ' + error.message);
                    }
                }
                else {
                    options = {
                        key: i18nOption,
                        bindSource: 'content'
                    };
                }

                if (options && (options.key === undefined || options.key === null || options.key === '') == false) {
                    el.setAttribute('i18n-key', options.key);
                    var controlType = '';
                    var moduleName = null;

                    if (tagName.indexOf('SYN_') > -1) {
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
                                controlType = el.getAttribute('type').toLowerCase();
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
                                if (el.getAttribute('multiple') == null) {
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

                    var key = options.key;
                    var bindSource = options.bindSource;

                    delete options.key;
                    delete options.bindSource;

                    $resource.translateControls.push({
                        elID: elID,
                        key: key,
                        bindSource: bindSource,
                        tag: tagName,
                        module: moduleName,
                        type: controlType,
                        options: options
                    });
                }
                else {
                    console.log('$resource.concreate, tagName: "' + tagName + '", elID: "' + elID + '" key 확인 필요');
                }
            }

            $resource.setLocale($resource.localeID);
        },

        add(id, val) {
            this[id] = val;
        },

        remove(id) {
            this[id] = undefined;
        },

        interpolate(message, interpolations) {
            return Object.keys(interpolations).reduce(function (interpolated, key) {
                return interpolated.replace(new RegExp('#{s*' + key + 's*}', 'g'), interpolations[key]);
            }, message);
        },

        getControl(el) {
            var result = null;
            if ($object.isString(el) == true) {
                el = syn.$l.get(el);
            }

            if ($object.isNullOrUndefined(el) == false) {
                var elID = el.id;
                var tag = el.tagName;
                var key = el.getAttribute('i18n-key');

                if ($string.isNullOrEmpty(elID) == true) {
                    result = $resource.translateControls.find(function (item) { return item.tag == tag && item.key == key; });
                }
                else {
                    result = $resource.translateControls.find(function (item) { return item.elID == elID && item.tag == tag && item.key == key; });
                }
            }

            return result;
        },

        translatePage() {
            $resource.translateControls.forEach(function (control) {
                $resource.translateControl(control);
            });
        },

        translateElement(el, options) {
            var control = $resource.getControl(el);
            if ($object.isNullOrUndefined(control) == false) {
                $resource.translateControl(control, options);
            }
        },

        translateControl(control, options) {
            if ($object.isNullOrUndefined(control) == false) {
                var el = null;
                if ($string.isNullOrEmpty(control.elID) == false) {
                    el = syn.$l.get(control.elID);
                }
                else {
                    el = syn.$l.querySelector('{0}[i18n-key="{1}"]'.format(control.tag, control.key));
                }

                if ($object.isNullOrUndefined(control.module) == true) {
                    var bind = $resource.getBindSource(control);
                    el[bind] = $resource.translateText(control, options);
                }
                else {
                    if (syn.uicontrols) {
                        var controlModule = syn.uicontrols['$' + control.module];
                        if (controlModule && controlModule.setLocale) {
                            controlModule.setLocale(control.elID, $resource.translations, control, options);
                        }
                    }
                }
            }
        },

        translateText(control, options) {
            var result = '';
            if (control) {
                var key = control.key;
                var translation = $resource.translations[key];

                var text = null;
                if ($ref.isString(translation) == true) {
                    text = translation;
                }
                else if ($ref.isArray(translation) == true) {
                    text = translation[0];
                }
                else if ($ref.isObject(translation) == true) {
                    text = translation.Text;
                }

                if (/#{s*\w+s*}/g.test(text) == true) {
                    var interpolateOption = syn.$w.getSSOInfo();
                    if (interpolateOption) {
                        if (options) {
                            interpolateOption = syn.$w.argumentsExtend(interpolateOption, options);
                        }
                    }
                    else {
                        interpolateOption = options;
                    }

                    result = interpolateOption ? $resource.interpolate(text, interpolateOption) : text;
                }
                else {
                    result = text;
                }
            }

            return result;
        },

        getBindSource(control, defaultBind) {
            var result = null;
            switch (control.bindSource) {
                case 'text':
                    result = 'innerText';
                    break;
                case 'content':
                    result = 'textContent';
                    break;
                case 'html':
                    result = 'innerHTML';
                    break;
                case 'url':
                    result = 'src';
                    break;
                case 'placeholder':
                    result = 'placeholder';
                    break;
                case 'control':
                    result = 'controlText';
                    break;
            }

            return result;
        },

        async setLocale(localeID) {
            var localeUrl = '/assets/shared/language/' + localeID + '.json';
            var translations = await syn.$w.fetchJson(localeUrl);
            $resource.localeID = localeID;
            $resource.translations = translations;

            document.documentElement.lang = localeID.substring(0, 2);
            $resource.translatePage();
        }
    });

    syn.$res = $resource;
})(globalThis);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $browser = context.$browser || new syn.module();
    var document = context.document;

    $browser.extend({
        version: '1.0',

        appName: navigator.appName,
        appCodeName: navigator.appCodeName,
        appVersion: navigator.appVersion,
        cookieEnabled: navigator.cookieEnabled,
        pdfViewerEnabled: navigator.pdfViewerEnabled,
        platform: navigator.platform,
        devicePlatform: context.devicePlatform,
        userAgent: navigator.userAgent,
        devicePixelRatio: context.devicePixelRatio,
        screenWidth: screen.width,
        screenHeight: screen.height,
        language: (navigator.appName == 'Netscape') ? navigator.language : navigator.browserLanguage,
        isWebkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        isMac: navigator.appVersion.indexOf('Mac') != -1 || navigator.userAgent.indexOf('Macintosh') != -1,
        isLinux: navigator.appVersion.indexOf('Linux') != -1 || navigator.appVersion.indexOf('X11') != -1,
        isWindow: navigator.appVersion.indexOf('Win') != -1 || navigator.userAgent.indexOf('Windows') != -1,
        isOpera: navigator.appName == 'Opera',
        isIE: !!document.documentMode || (navigator.appName == 'Netscape' && navigator.userAgent.indexOf('trident') != -1) || (navigator.userAgent.indexOf('msie') != -1),
        isChrome: !!context.chrome && navigator.userAgent.indexOf('Edg') == -1,
        isEdge: !!context.chrome && navigator.userAgent.indexOf('Edg') > -1,
        isFF: typeof InstallTrigger !== 'undefined' || navigator.userAgent.indexOf('Firefox') !== -1,
        isSafari: /constructor/i.test(context.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]'; })(!context['safari'] || (typeof safari !== 'undefined' && context['safari'].pushNotification)),
        isMobile: (navigator.userAgentData && navigator.userAgentData.mobile == true) ? true : /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent),

        getSystemFonts() {
            var fonts = [
                '-apple-system',
                'BlinkMacSystemFont',
                'Cantarell',
                'Consolas',
                'Courier New',
                'Droid Sans',
                'Fira Sans',
                'Helvetica Neue',
                'Menlo',
                'Monaco',
                'Oxygen',
                'Roboto',
                'source-code-pro',
                'Segoe UI',
                'Ubuntu',
            ];
            return fonts
                .filter((font) => document.fonts.check('12px ' + font))
                .join(', ');
        },

        getCanvas2dRender() {
            var canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 50;

            var ctx = canvas.getContext('2d');
            if (!ctx) {
                return null;
            }

            ctx.font = '21.5px Arial';
            ctx.fillText('😉', 0, 20);

            ctx.font = '15.7px serif';
            ctx.fillText('abcdefghijklmnopqrtsuvwxyz', 0, 40);

            ctx.font = '20.5px Arial';
            var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'red');
            gradient.addColorStop(0.5, 'green');
            gradient.addColorStop(1.0, 'blue');
            ctx.fillStyle = gradient;
            ctx.fillText('Lorem ipsum!', 30, 20);

            ctx.beginPath();
            ctx.moveTo(170, 5);
            ctx.lineTo(160, 25);
            ctx.lineTo(185, 20);
            ctx.fill();

            return canvas.toDataURL();
        },

        getWebglRender() {
            var canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;

            var gl = canvas.getContext('webgl');
            if (!gl) {
                return null;
            }

            var vertices = [
                [-0.1, 0.8, 0.0],
                [-0.8, -0.8, 0.0],
                [0.8, -0.7, 0.0],
            ].flat();
            var vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            var indices = [0, 1, 2];
            var indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices),
                gl.STATIC_DRAW
            );

            var vertCode = 'attribute vec3 coordinates;void main(void) {gl_Position = vec4(coordinates, 1.0);}';
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertCode);
            gl.compileShader(vertexShader);

            var fragCode = 'void main(void) {gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);}';
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragCode);
            gl.compileShader(fragmentShader);

            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);

            var coordinatesAttribute = gl.getAttribLocation(program, 'coordinates');

            gl.vertexAttribPointer(coordinatesAttribute, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(coordinatesAttribute);

            gl.clearColor(1, 1, 1, 1);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

            return canvas.toDataURL();
        },

        getPlugins() {
            return Array.from(navigator.plugins)
                .map((plugin) => plugin.name + ': ' + plugin.filename)
                .join(', ');
        },

        async fingerPrint(length) {
            if ($object.isNullOrUndefined(length) == true) {
                length = 32;
            }

            if ($ref.isNumber(length) == false) {
                length = 32;
            }

            if (length < 1 || length > 64) {
                length = 32;
            }

            var computeComponents = {
                appName: $browser.appName,
                appCodeName: $browser.appCodeName,
                cookieEnabled: $browser.cookieEnabled,
                pdfViewerEnabled: $browser.pdfViewerEnabled,
                devicePixelRatio: $browser.devicePixelRatio,
                userAgent: $browser.userAgent,
                platform: $browser.platform,
                plugins: $browser.getPlugins(),
                dateFormat: new Date(0).toString(),
                fonts: $browser.getSystemFonts(),
                canvas2dRender: $browser.getCanvas2dRender(),
                webglRender: $browser.getWebglRender(),
                ipAddress: await $browser.getIpAddress()
            };

            return syn.$c.sha256(JSON.stringify(computeComponents)).substring(0, length);
        },

        windowWidth() {
            var ret = null;
            if (context.innerWidth) {
                ret = context.innerWidth;
            }
            else if (document.documentElement && document.documentElement.clientWidth) {
                ret = document.documentElement.clientWidth;
            }
            else if (document.body) {
                ret = document.body.offsetWidth;
            }

            return ret;
        },

        windowHeight() {
            var ret = null;
            if (context.innerHeight) {
                ret = context.innerHeight;
            }
            else if (document.documentElement && document.documentElement.clientHeight) {
                ret = document.documentElement.clientHeight;
            }
            else if (document.body) {
                ret = document.body.clientHeight;
            }

            return ret;
        },

        async getIpAddress() {
            var result = await syn.$r.httpRequest('GET', '/checkip', null, 1000);
            return result.status === 200 ? result.response : '127.0.0.1';
        }
    });
    syn.$b = $browser;
})(globalRoot);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $manipulation = context.$manipulation || new syn.module();
    var document = context.document;

    $manipulation.extend({
        version: "1.0",

        body() {
            return document;
        },

        documentElement() {
            return document.documentElement;
        },

        childNodes(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.childNodes;
        },

        firstChild(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.firstChild;
        },

        lastChild(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.lastChild;
        },

        nextSibling(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.nextSibling;
        },

        previousSibling(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.previousSibling;
        },

        siblings(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return [].slice.call(parent.children).filter(function (child) {
                return child !== el;
            });
        },

        parentNode(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.parentNode;
        },

        innerText(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.innerText;
        },

        nodeName(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.nodeName;
        },

        nodeType(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.nodeType;
        },

        nodeValue(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.nodeValue;
        },

        className(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.className;
        },

        removeAttribute(el, prop) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.removeAttribute(prop);
        },

        getAttribute(el, prop) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.getAttribute(prop);
        },

        setAttribute(el, prop, val) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.setAttribute(prop, val);
        },

        appendChild(el, node) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.appendChild(node);
        },

        cloneNode(el, isClone) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.cloneNode(isClone);
        },

        createElement(tagName) {
            return document.createElement(tagName);
        },

        createTextNode(data) {
            return document.createTextNode(data);
        },

        innerHTML(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.innerHTML;
        },

        outerHTML(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.outerHTML;
        },

        setStyle(el, prop, val) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.style[prop] = val;
            return this;
        },

        // syn.$w.addCssText(el, 'background:red;width:200px;height:200px;');
        addCssText(el, cssText) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el.style.cssText != undefined) {
                el.style.cssText = cssText;
            }
            return this;
        },

        // syn.$w.addStyle(el, { backgroundColor:'blue', color:'white', border:'2px solid red' });
        addStyle(el, objects) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            for (var prop in objects) {
                this.setStyle(el, prop, objects[prop]);
            }
            return this;
        },

        getStyle(el, prop) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.style[prop];
        },

        hasHidden(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return (el == null || el.offsetParent == null || context.getComputedStyle(el)['display'] == 'none');
        },

        getComputedStyle(el, prop) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return context.getComputedStyle(el)[prop];
        },

        addClass(el, css) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (this.hasClass(el, css) == false) {
                if (el.classList && el.classList.add) {
                    el.classList.add(css);
                }
                else {
                    el.className = (el.className + ' ' + css).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                }
            }
            return this;
        },

        hasClass(el, css) {
            var result = false;
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                if (el.classList && el.classList.contains) {
                    result = el.classList.contains(css);
                }
                else {
                    result = syn.$m.getClassRegEx(css).test(el.className);
                }
            }

            return result;
        },

        toggleClass(el, css) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                if (el.classList && el.classList.toggle) {
                    el.classList.toggle(css);
                }
            }

            return this;
        },

        removeClass(el, css) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                if (css === undefined) {
                    el.className = '';
                }
                else {
                    if (el.classList && el.classList.remove) {
                        el.classList.remove(css);
                    }
                    else {
                        var re = syn.$m.getClassRegEx(css);
                        el.className = el.className.replace(re, '');
                        re = null;
                    }

                }
            }

            return this;
        },

        append(el, tag, eid, styles, html) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var cl = document.createElement(tag);

            if (eid) {
                cl.id = eid;
            }

            if (styles) {
                this.addStyle(cl, styles);
            }

            if (html) {
                this.innerHTML(html);
            }

            el.appendChild(cl);
            return cl;
        },

        prepend(el, baseEl) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            baseEl.insertBefore(el, baseEl.firstChild);
        },

        copy(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.cloneNode(true);
        },

        empty(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                while (el.firstChild) {
                    syn.$w.purge(el.firstChild);

                    el.removeChild(node.firstChild);
                }
            }

            return this;
        },

        remove(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                syn.$w.purge(el);

                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }

            return this;
        },

        hasChild(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.hasChildNodes();
        },

        addControlStyles(els, css) {
            if (!css) {
                return;
            }

            var el = null;
            for (var i = 0; i < els.length; i++) {
                el = els[i];

                if (el != null) {
                    if (this.hasClass(el, css) == false) {
                        this.addClass(el, css);
                    }
                }
            }

            return this;
        },

        removeControlStyles(els, css) {
            if (!css) {
                return;
            }

            var el = null;

            for (var i = 0; i < els.length; i++) {
                el = els[i];

                if (el != null) {
                    if (this.hasClass(el, css) == true) {
                        this.removeClass(el, css);
                    }
                }
            }

            return this;
        },

        removeNode(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                el.parentNode.removeChild(el);
            }
        },

        insertAfter(item, target) {
            var parent = target.parentNode;
            if (target.nextElementSibling) {
                parent.insertBefore(item, target.nextElementSibling);
            } else {
                parent.appendChild(item);
            }
        },

        hide(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                el.style.display = 'none';
            }
        },

        hideAll(array) {
            for (var i = 0; i < array.length; i++) {
                this.hide(array[i]);
            }
        },

        show(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                el.style.display = 'block';
            }
        },

        showAll(array) {
            for (var i = 0; i < array.length; i++) {
                this.show(array[i]);
            }
        },

        toggle(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (context.getComputedStyle(el).display === 'block') {
                this.hide(el);
                return;
            }

            this.show(el);
        },

        parent(el, id) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var parent = el.parentElement;
            while (parent && parent.tagName != 'BODY') {
                if (parent.id == id) {
                    return parent;
                }

                parent = parent.parentElement;
            }

            return null;
        },

        //data : { tag, id, className, attributes : { key : value }, data : { key : value } }
        create(data) {
            var el = document.createElement(data.tag);
            if (data.id) {
                el.id = data.id;
            }

            if (data.className) {
                el.className = data.className;
            }

            if (data.style) {
                for (var prop in data.style) {
                    el.style[prop] = data.style[prop];
                }
            }

            if (data.attributes) {
                for (var prop in data.attributes) {
                    el.setAttribute(prop, data.attributes[prop]);
                }
            }

            if (data.data) {
                el.dataset = el.dataset ? result.dataset : {};
                for (var prop in data.data) {
                    el.dataset[prop] = data.data[prop];
                }
            }

            if (data.html) {
                el.innerHTML = data.html;
            }

            return el;
        },

        div(data) {
            if (!data) {
                data = new Object();
            }

            data.tag = 'div';
            return this.create(data);
        },

        label(data) {
            if (!data) {
                data = new Object();
            }

            data.tag = 'label';
            return this.create(data);
        },

        textField(data) {
            if (!data) {
                data = new Object();
            }

            data.tag = 'input';
            if (!data.attributes)
                data.attributes = new Object();

            data.attributes.type = 'text';

            return this.create(data);
        },

        checkbox(data) {
            if (!data) {
                data = new Object();
            }

            data.tag = 'input';
            if (!data.attributes)
                data.attributes = new Object();

            data.attributes.type = 'checkbox';

            return this.create(data);
        },

        each(array, handler) {
            for (var i = 0; i < array.length; i++) {
                handler(array[i], i);
            }
        },

        setActive(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.classList.add('active');
        },

        setUnactive(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.classList.remove('active');
        },

        select(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.selected = true;
            el.setAttribute('selected', 'selected');
        },

        deselect(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.selected = false;
            el.removeAttribute('selected');
        },

        check(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.checked = true;
        },

        uncheck(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.checked = false;
        },

        click(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el.fireEvent) {
                el.fireEvent('onclick');
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent('click', true, false);
                el.dispatchEvent(evObj);
            }
        },

        getClassRegEx(css) {
            return new RegExp('(^|\\s)' + css + '(\\s|$)');
        },
    });
    syn.$m = $manipulation;
})(globalRoot);

/// <reference path='syn.core.js' />
/// <reference path='syn.library.js' />

(function (context) {
    'use strict';
    var $dimension = context.$dimension || new syn.module();
    var document = context.document;

    $dimension.extend({
        version: '1.0',

        getDocumentSize(el) {
            el = ($ref.isString(el) == true ? syn.$l.get(el) : el) || context;
            var result =
            {
                width: el.scrollMaxX ? el.innerWidth + el.scrollMaxX : document.documentElement.scrollWidth || document.body.scrollWidth || 0,
                height: el.scrollMaxY ? el.innerHeight + el.scrollMaxY : document.documentElement.scrollHeight || document.body.scrollHeight || 0,
                fullWidth: Math.max(
                    document.body.scrollWidth, document.documentElement.scrollWidth,
                    document.body.offsetWidth, document.documentElement.offsetWidth,
                    document.body.clientWidth, document.documentElement.clientWidth
                ),
                fullHeight: Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                )
            }

            return result;
        },

        getWindowSize(el) {
            el = ($ref.isString(el) == true ? syn.$l.get(el) : el) || context;
            var result =
            {
                width: el.innerWidth ? el.innerWidth : document.documentElement.clientWidth || document.body.clientWidth || 0,
                height: el.innerHeight ? el.innerHeight : document.documentElement.clientHeight || document.body.clientHeight || 0
            };

            return result;
        },


        getScrollPosition(el) {
            el = ($ref.isString(el) == true ? syn.$l.get(el) : el) || context;

            var result =
            {
                left: el.pageXOffset || el.scrollLeft || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
                top: el.pageYOffset || el.scrollTop || document.documentElement.scrollTop || document.body.scrollTop || 0
            };

            return result;
        },

        getMousePosition(e) {
            e = e || context.event || top.context.event;
            var scroll = syn.$d.getScrollSize();
            var result =
            {
                x: e.pageX || e.clientX + scroll.x || 0,
                y: e.pageY || e.clientY + scroll.y || 0,
                relativeX: e.layerX || e.offsetX || 0,
                relativeY: e.layerY || e.offsetY || 0
            };

            return result;
        },

        offset(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var rect = el.getBoundingClientRect();
            var scrollLeft = context.pageXOffset || document.documentElement.scrollLeft;
            var scrollTop = context.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            }
        },

        offsetLeft(el) {
            var result = 0;
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            while (typeof el !== 'undefined' && el && el.parentNode !== context) {
                if (el.offsetLeft) {
                    result += el.offsetLeft;
                }
                el = el.parentNode;
            }

            return result;
        },

        parentOffsetLeft(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el = el || top.document.documentElement || top.document.body;
            return el.parentNode === el.offsetParent ? el.offsetLeft : (syn.$d.offsetLeft(el) - syn.$d.offsetLeft(el.parentNode));
        },

        offsetTop(el) {
            var result = 0;

            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            while (typeof el !== 'undefined' && el && el.parentNode !== context) {
                if (el.offsetTop) {
                    result += el.offsetTop;
                }
                el = el.parentNode;
            }

            return result;
        },

        parentOffsetTop(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el = el || top.document.documentElement || top.document.body;
            return el.parentNode === el.offsetParent ? el.offsetTop : (syn.$d.offsetTop(el) - syn.$d.offsetTop(el.parentNode));
        },

        getBounds(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var top = syn.$d.offsetTop(el);
            var left = syn.$d.offsetLeft(el);
            var bottom = top + el.offsetHeight;
            var right = left + el.offsetWidth;

            var result =
            {
                top: top,
                left: top,
                parentTop: syn.$d.parentOffsetTop(el),
                parentLeft: syn.$d.parentOffsetLeft(el),
                bottom: bottom,
                right: right,
                center:
                {
                    x: left + (right - left) / 2,
                    y: top + (bottom - top) / 2
                }
            };

            return result;
        },

        getCenter(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var top = syn.$d.offsetTop(el);
            var left = syn.$d.offsetLeft(el);
            var bottom = top + el.offsetHeight;
            var right = left + el.offsetWidth;

            var result =
            {
                x: left + (right - left) / 2,
                y: top + (bottom - top) / 2
            };

            return result;
        },

        getPosition(el, center) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var result =
            {
                top: syn.$d.offsetTop(el),
                left: syn.$d.offsetLeft(el)
            };

            var pl = el.offsetParent;

            while (pl) {
                result.left += syn.$d.offsetLeft(pl);
                result.top += syn.$d.offsetTop(pl);
                pl = pl.offsetParent;
            }

            if (center) {
                result.left += el.offsetWidth / 2;
                result.top += el.offsetHeight / 2;
            }

            return result;
        },

        getSize(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var styles = context.getComputedStyle(el);
            var result =
            {
                width: el.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight),
                height: el.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom),
                clientWidth: el.clientWidth,
                clientHeight: el.clientHeight,
                offsetWidth: el.offsetWidth,
                offsetHeight: el.offsetHeight,
                marginWidth: el.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight),
                marginHeight: el.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom),
            };

            return result;
        },

        measureWidth(text, fontSize) {
            var el = document.createElement('div');

            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.whiteSpace = 'nowrap';
            el.style.left = '-9999px';

            if (fontSize) {
                el.style.fontSize = fontSize;
            }
            el.innerText = text;

            document.body.appendChild(el);
            var width = context.getComputedStyle(el).width;
            document.body.removeChild(el);
            return width;
        },

        measureHeight(text, width, fontSize) {
            var el = document.createElement('div');

            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.width = width;
            el.style.left = '-9999px';

            if (fontSize) {
                el.style.fontSize = fontSize;
            }
            el.innerText = text;

            document.body.appendChild(el);
            var height = context.getComputedStyle(el).height;
            document.body.removeChild(el);
            return height;
        },

        measureSize(text, fontSize) {
            if ($object.isNullOrUndefined(text) == true) {
                return null;
            }

            var width = syn.$d.measureWidth(text, fontSize);
            return {
                width: width,
                height: syn.$d.measureHeight(text, width, fontSize)
            };
        }
    });
    syn.$d = $dimension;
})(globalRoot);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $ref = context.$ref || new syn.module();

    $ref.extend({
        version: '1.0',

        getType(val) {
            var result = typeof val;
            if (result == 'object') {
                if (val) {
                    if (val instanceof Array || (!(val instanceof Object) && (Object.prototype.toString.call((val)) == '[object Array]') || typeof val.length == 'number' && typeof val.splice != 'undefined' && typeof val.propertyIsEnumerable != 'undefined' && !val.propertyIsEnumerable('splice'))) {
                        return 'array';
                    }

                    if (!(val instanceof Object) && (Object.prototype.toString.call((val)) == '[object Function]' || typeof val.call != 'undefined' && typeof val.propertyIsEnumerable != 'undefined' && !val.propertyIsEnumerable('call'))) {
                        return 'function';
                    }
                }
                else {
                    return 'null';
                }
            }
            else if (result == 'function' && typeof val.call == 'undefined') {
                return 'object';
            }

            return result;
        },

        defaultValue(type, isPrimitive) {
            if (typeof type !== 'string') {
                return '';
            }

            if (isPrimitive && isPrimitive == true) {
                switch (type) {
                    case 'boolean': return false;
                    case 'function': return function () { };
                    case 'null': return null;
                    case 'number': return 0;
                    case 'object': return {};
                    case 'string': return '';
                    case 'symbol': return Symbol();
                    case 'undefined': return void 0;
                }

                try {
                    var ctor = typeof this[type] === 'function' ? this[type] : eval(type);

                    return new ctor;
                } catch (e) {
                    return {};
                }
            }
            else {
                switch (type) {
                    case 'bool':
                    case 'boolean':
                        return false;
                    case 'int':
                    case 'number':
                        return 0;
                    default: return '';
                }
            }
        },

        isDefined(val) {
            return val !== undefined;
        },

        isNull(val) {
            return val === null;
        },

        isArray(val) {
            return this.getType(val) == 'array';
        },

        isDate(val) {
            var result = false;
            try {
                if ($string.isNullOrEmpty(val) == true) {
                    result = true;
                }
                else if (typeof val == 'string') {
                    if (val.includes('T') == true) {
                        var date = val.parseISOString();
                        result = typeof date.getFullYear == 'function';
                    }
                    else if ($date.isDate(val) == true) {
                        result = true;
                    }
                }
            } catch (e) {
            }

            return result;
        },

        isString(val) {
            return typeof val == 'string';
        },

        isNumber(val) {
            return typeof val == 'number';
        },

        isFunction(val) {
            return this.getType(val) == 'function';
        },

        isObject(val) {
            return typeof val == 'object';
        },

        isObjectEmpty(val) {
            if (typeof val == 'object') {
                for (var key in val) {
                    if (val.hasOwnProperty(key) == true) {
                        return false;
                    }
                }
            }
            return true;
        },

        isBoolean(val) {
            return typeof val == 'boolean';
        },

        isEmpty(val) {
            var result = false;
            if (typeof val == 'number' || typeof val == 'boolean' || typeof val == 'function' || (typeof val === 'object' && val instanceof Date)) {
                result = false;
            }
            else {
                result = (val == null || !(Object.keys(val) || val).length);
            }
            return result;
        },

        clone(val, isNested) {
            var result = null;

            if ($object.isNullOrUndefined(isNested) == true) {
                isNested = true;
            }

            if (this.isArray(val) == true) {
                result = JSON.parse(JSON.stringify(val));
            }
            else if (this.isObject(val) == true) {
                if (val) {
                    var types = [Number, String, Boolean], result;
                    types.forEach(function (type) {
                        if (val instanceof type) {
                            result = type(val);
                        }
                    });

                    if (isNested == true && Object.prototype.toString.call(val) === '[object Array]') {
                        result = [];
                        val.forEach(function (child, index, array) {
                            result[index] = this.clone(child);
                        });
                    }
                    else if (typeof val == 'object') {
                        if (val.nodeType && typeof val.cloneNode == 'function') {
                            result = val.cloneNode(true);
                        }
                        else if (!val.prototype) {
                            result = {};
                            for (var i in val) {
                                result[i] = this.clone(val[i]);
                            }
                        }
                        else {
                            if (val.constructor) {
                                result = new val.constructor();
                            }
                            else {
                                result = val;
                            }
                        }
                    }
                    else {
                        result = val;
                    }
                }
                else {
                    result = val;
                }
            }
            else if (this.isFunction(val) == true) {
                result = val.clone();
            }
            else {
                result = val;
            }

            return result;
        },

        /// var data = $ref.mergeDeep({}, $ref..defaults, data || {});
        deepClone(target) {
            if (arguments.length <= 1) {
                return target;
            }

            var sources = [].slice.apply(arguments);
            sources.shift();
            var source = sources.shift();

            if (isObject(target) && isObject(source)) {
                for (var key in source) {
                    if (isObject(source[key])) {
                        if (!target[key]) {
                            var obj = {};
                            obj[key] = {};
                            Object.assign(target, obj);
                        }
                        mergeDeep(target[key], source[key]);
                    } else {
                        var obj = {};
                        obj[key] = source[key];
                        Object.assign(target, obj);
                    }
                }
            }

            return mergeDeep.apply(null, [target].concat(sources));
        },

        cloneNode(val) {
            return val.cloneNode(true);
        },

        method(obj, funcName, func) {
            obj.prototype[funcName] = func;
            return this;
        },

        extend(to, from, overwrite) {
            var prop, hasProp;
            for (prop in from) {
                hasProp = to[prop] !== undefined;
                if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                    if ($ref.isDate(from[prop])) {
                        if (overwrite) {
                            to[prop] = new Date(from[prop].getTime());
                        }
                    }
                    else if ($ref.isArray(from[prop])) {
                        if (overwrite) {
                            to[prop] = from[prop].slice(0);
                        }
                    } else {
                        to[prop] = $ref.extend({}, from[prop], overwrite);
                    }
                } else if (overwrite || !hasProp) {
                    to[prop] = from[prop];
                }
            }
            return to;
        }
    });

    context.$ref = $ref;
})(globalRoot);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $crytography = context.$crytography || new syn.module();

    $crytography.extend({
        version: '1.0',

        base64Encode(val) {
            if (globalRoot.devicePlatform === 'node') {
                return Buffer.from(val).toString('base64');
            }
            else {
                return btoa(encodeURIComponent(val).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                    return String.fromCharCode(parseInt(p1, 16));
                }));
            }
        },

        base64Decode(val) {
            if (globalRoot.devicePlatform === 'node') {
                return Buffer.from(val, 'base64').toString();
            }
            else {
                return decodeURIComponent(atob(val).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            }
        },

        utf8Encode: function (unicodeString) {
            if (typeof unicodeString != 'string') {
                throw new TypeError('parameter ‘unicodeString’ is not a string');
            }

            var utf8String = unicodeString.replace(/[\u0080-\u07ff]/g, function (c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            }).replace(/[\u0800-\uffff]/g,
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                });
            return utf8String;
        },

        utf8Decode: function (utf8String) {
            if (typeof utf8String != 'string') {
                throw new TypeError('parameter ‘utf8String’ is not a string');
            }

            var unicodeString = utf8String.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
                function (c) {
                    var cc = (c.charCodeAt(0) & 0x0f) << 12 | (c.charCodeAt(1) & 0x3f) << 6 | c.charCodeAt(2) & 0x3f;
                    return String.fromCharCode(cc);
                }).replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,
                    function (c) {
                        var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                        return String.fromCharCode(cc);
                    });
            return unicodeString;
        },

        sha256(s) {
            var chrsz = 8;
            var hexcase = 0;

            function safe_add(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }

            function S(X, n) { return (X >>> n) | (X << (32 - n)); }
            function R(X, n) { return (X >>> n); }
            function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
            function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
            function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
            function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
            function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
            function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

            function core_sha256(m, l) {

                var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
                    0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
                    0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
                    0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
                    0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
                    0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
                    0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
                    0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
                    0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
                    0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
                    0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

                var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

                var W = new Array(64);
                var a, b, c, d, e, f, g, h, i, j;
                var T1, T2;

                m[l >> 5] |= 0x80 << (24 - l % 32);
                m[((l + 64 >> 9) << 4) + 15] = l;

                for (var i = 0; i < m.length; i += 16) {
                    a = HASH[0];
                    b = HASH[1];
                    c = HASH[2];
                    d = HASH[3];
                    e = HASH[4];
                    f = HASH[5];
                    g = HASH[6];
                    h = HASH[7];

                    for (var j = 0; j < 64; j++) {
                        if (j < 16) W[j] = m[j + i];
                        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                        T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                        h = g;
                        g = f;
                        f = e;
                        e = safe_add(d, T1);
                        d = c;
                        c = b;
                        b = a;
                        a = safe_add(T1, T2);
                    }

                    HASH[0] = safe_add(a, HASH[0]);
                    HASH[1] = safe_add(b, HASH[1]);
                    HASH[2] = safe_add(c, HASH[2]);
                    HASH[3] = safe_add(d, HASH[3]);
                    HASH[4] = safe_add(e, HASH[4]);
                    HASH[5] = safe_add(f, HASH[5]);
                    HASH[6] = safe_add(g, HASH[6]);
                    HASH[7] = safe_add(h, HASH[7]);
                }
                return HASH;
            }

            function str2binb(str) {
                var bin = Array();
                var mask = (1 << chrsz) - 1;
                for (var i = 0; i < str.length * chrsz; i += chrsz) {
                    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                }
                return bin;
            }

            function binb2hex(binarray) {
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for (var i = 0; i < binarray.length * 4; i++) {
                    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                        hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                }
                return str;
            }

            s = syn.$c.utf8Encode(s);
            return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
        },

        encrypt(value, key) {
            if ($object.isNullOrUndefined(value) == true) {
                return null;
            }

            var keyLength = 6;
            if ($object.isNullOrUndefined(key) == true) {
                key = '';
                key = syn.$c.sha256(key).substring(0, keyLength);
            }
            else {
                keyLength = key.length;
            }

            key = syn.$c.sha256(key).substring(0, keyLength);

            var encrypt = function (content, passcode) {
                var result = [];
                var passLen = passcode.length;
                for (var i = 0; i < content.length; i++) {
                    var passOffset = i % passLen;
                    var calAscii = (content.charCodeAt(i) + passcode.charCodeAt(passOffset));
                    result.push(calAscii);
                }
                return JSON.stringify(result);
            };

            return escape(syn.$c.base64Encode(encrypt(value, key) + '.' + key));
        },

        decrypt(value, key) {
            var result = null;

            if ($object.isNullOrUndefined(value) == true) {
                return result;
            }

            try {
                value = syn.$c.base64Decode(unescape(value));

                if (value.indexOf('.') === -1) {
                    return result;
                }

                var source = value.split('.');
                var decrypt = function (content, passcode) {
                    var str = '';

                    var keyLength = 6;
                    if ($object.isNullOrUndefined(key) == true) {
                        key = '';
                        key = syn.$c.sha256(key).substring(0, keyLength);
                    }
                    else {
                        keyLength = key.length;
                    }

                    if (passcode == syn.$c.sha256(key).substring(0, keyLength)) {
                        debugger;
                        var result = [];
                        var codesArr = JSON.parse(content);
                        var passLen = passcode.length;
                        for (var i = 0; i < codesArr.length; i++) {
                            var passOffset = i % passLen;
                            var calAscii = (codesArr[i] - passcode.charCodeAt(passOffset));
                            result.push(calAscii);
                        }
                        for (var i = 0; i < result.length; i++) {
                            var ch = String.fromCharCode(result[i]);
                            str += ch;
                        }
                    }

                    return str;
                }

                result = decrypt(source[0], source[1]);
            } catch (error) {
                syn.$l.eventLog('$c.decrypt', error, 'Error');
            }
            return result;
        },

        LZString: (function () {
            var f = String.fromCharCode;
            var keyStrBase64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var keyStrUriSafe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';
            var baseReverseDic = {};

            function getBaseValue(alphabet, character) {
                if (!baseReverseDic[alphabet]) {
                    baseReverseDic[alphabet] = {};
                    for (var i = 0; i < alphabet.length; i++) {
                        baseReverseDic[alphabet][alphabet.charAt(i)] = i;
                    }
                }
                return baseReverseDic[alphabet][character];
            }

            var LZString = {
                compressToBase64(input) {
                    if (input == null) return '';
                    var res = LZString._compress(input, 6, function (a) { return keyStrBase64.charAt(a); });
                    switch (res.length % 4) {
                        default:
                        case 0: return res;
                        case 1: return res + '===';
                        case 2: return res + '==';
                        case 3: return res + '=';
                    }
                },

                decompressFromBase64(input) {
                    if (input == null) return '';
                    if (input == '') return null;
                    return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
                },

                compressToUTF16(input) {
                    if (input == null) return '';
                    return LZString._compress(input, 15, function (a) { return f(a + 32); }) + ' ';
                },

                decompressFromUTF16(compressed) {
                    if (compressed == null) return '';
                    if (compressed == '') return null;
                    return LZString._decompress(compressed.length, 16384, function (index) { return compressed.charCodeAt(index) - 32; });
                },

                compressToUint8Array(uncompressed) {
                    var compressed = LZString.compress(uncompressed);
                    var buf = new Uint8Array(compressed.length * 2);

                    for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
                        var current_value = compressed.charCodeAt(i);
                        buf[i * 2] = current_value >>> 8;
                        buf[i * 2 + 1] = current_value % 256;
                    }
                    return buf;
                },

                decompressFromUint8Array(compressed) {
                    if ($object.isNullOrUndefined(compressed) == true) {
                        return LZString.decompress(compressed);
                    } else {
                        var buf = new Array(compressed.length / 2);
                        for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                            buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
                        }

                        var result = [];
                        buf.forEach(function (c) {
                            result.push(f(c));
                        });
                        return LZString.decompress(result.join(''));
                    }
                },

                compressToEncodedURIComponent(input) {
                    if (input == null) return '';
                    return LZString._compress(input, 6, function (a) { return keyStrUriSafe.charAt(a); });
                },

                decompressFromEncodedURIComponent(input) {
                    if (input == null) return '';
                    if (input == '') return null;
                    input = input.replace(/ /g, '+');
                    return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
                },

                compress(uncompressed) {
                    return LZString._compress(uncompressed, 16, function (a) { return f(a); });
                },

                _compress(uncompressed, bitsPerChar, getCharFromInt) {
                    if (uncompressed == null) return '';
                    var i, value,
                        context_dictionary = {},
                        context_dictionaryToCreate = {},
                        context_c = '',
                        context_wc = '',
                        context_w = '',
                        context_enlargeIn = 2,
                        context_dictSize = 3,
                        context_numBits = 2,
                        context_data = [],
                        context_data_val = 0,
                        context_data_position = 0,
                        ii;

                    for (ii = 0; ii < uncompressed.length; ii += 1) {
                        context_c = uncompressed.charAt(ii);
                        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                            context_dictionary[context_c] = context_dictSize++;
                            context_dictionaryToCreate[context_c] = true;
                        }

                        context_wc = context_w + context_c;
                        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                            context_w = context_wc;
                        } else {
                            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                                if (context_w.charCodeAt(0) < 256) {
                                    for (i = 0; i < context_numBits; i++) {
                                        context_data_val = (context_data_val << 1);
                                        if (context_data_position == bitsPerChar - 1) {
                                            context_data_position = 0;
                                            context_data.push(getCharFromInt(context_data_val));
                                            context_data_val = 0;
                                        } else {
                                            context_data_position++;
                                        }
                                    }
                                    value = context_w.charCodeAt(0);
                                    for (i = 0; i < 8; i++) {
                                        context_data_val = (context_data_val << 1) | (value & 1);
                                        if (context_data_position == bitsPerChar - 1) {
                                            context_data_position = 0;
                                            context_data.push(getCharFromInt(context_data_val));
                                            context_data_val = 0;
                                        } else {
                                            context_data_position++;
                                        }
                                        value = value >> 1;
                                    }
                                } else {
                                    value = 1;
                                    for (i = 0; i < context_numBits; i++) {
                                        context_data_val = (context_data_val << 1) | value;
                                        if (context_data_position == bitsPerChar - 1) {
                                            context_data_position = 0;
                                            context_data.push(getCharFromInt(context_data_val));
                                            context_data_val = 0;
                                        } else {
                                            context_data_position++;
                                        }
                                        value = 0;
                                    }
                                    value = context_w.charCodeAt(0);
                                    for (i = 0; i < 16; i++) {
                                        context_data_val = (context_data_val << 1) | (value & 1);
                                        if (context_data_position == bitsPerChar - 1) {
                                            context_data_position = 0;
                                            context_data.push(getCharFromInt(context_data_val));
                                            context_data_val = 0;
                                        } else {
                                            context_data_position++;
                                        }
                                        value = value >> 1;
                                    }
                                }
                                context_enlargeIn--;
                                if (context_enlargeIn == 0) {
                                    context_enlargeIn = Math.pow(2, context_numBits);
                                    context_numBits++;
                                }
                                delete context_dictionaryToCreate[context_w];
                            } else {
                                value = context_dictionary[context_w];
                                for (i = 0; i < context_numBits; i++) {
                                    context_data_val = (context_data_val << 1) | (value & 1);
                                    if (context_data_position == bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = value >> 1;
                                }


                            }
                            context_enlargeIn--;
                            if (context_enlargeIn == 0) {
                                context_enlargeIn = Math.pow(2, context_numBits);
                                context_numBits++;
                            }

                            context_dictionary[context_wc] = context_dictSize++;
                            context_w = String(context_c);
                        }
                    }

                    if (context_w !== '') {
                        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                            if (context_w.charCodeAt(0) < 256) {
                                for (i = 0; i < context_numBits; i++) {
                                    context_data_val = (context_data_val << 1);
                                    if (context_data_position == bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                }
                                value = context_w.charCodeAt(0);
                                for (i = 0; i < 8; i++) {
                                    context_data_val = (context_data_val << 1) | (value & 1);
                                    if (context_data_position == bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = value >> 1;
                                }
                            } else {
                                value = 1;
                                for (i = 0; i < context_numBits; i++) {
                                    context_data_val = (context_data_val << 1) | value;
                                    if (context_data_position == bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = 0;
                                }
                                value = context_w.charCodeAt(0);
                                for (i = 0; i < 16; i++) {
                                    context_data_val = (context_data_val << 1) | (value & 1);
                                    if (context_data_position == bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = value >> 1;
                                }
                            }
                            context_enlargeIn--;
                            if (context_enlargeIn == 0) {
                                context_enlargeIn = Math.pow(2, context_numBits);
                                context_numBits++;
                            }
                            delete context_dictionaryToCreate[context_w];
                        } else {
                            value = context_dictionary[context_w];
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }


                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                    }

                    value = 2;
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }

                    while (true) {
                        context_data_val = (context_data_val << 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data.push(getCharFromInt(context_data_val));
                            break;
                        }
                        else context_data_position++;
                    }
                    return context_data.join('');
                },

                decompress(compressed) {
                    if (compressed == null) return '';
                    if (compressed == '') return null;
                    return LZString._decompress(compressed.length, 32768, function (index) { return compressed.charCodeAt(index); });
                },

                _decompress(length, resetValue, getNextValue) {
                    var dictionary = [],
                        next,
                        enlargeIn = 4,
                        dictSize = 4,
                        numBits = 3,
                        entry = '',
                        result = [],
                        i,
                        w,
                        bits, resb, maxpower, power,
                        c,
                        data = { val: getNextValue(0), position: resetValue, index: 1 };

                    for (i = 0; i < 3; i += 1) {
                        dictionary[i] = i;
                    }

                    bits = 0;
                    maxpower = Math.pow(2, 2);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }

                    switch (next = bits) {
                        case 0:
                            bits = 0;
                            maxpower = Math.pow(2, 8);
                            power = 1;
                            while (power != maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                    data.position = resetValue;
                                    data.val = getNextValue(data.index++);
                                }
                                bits |= (resb > 0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                            c = f(bits);
                            break;
                        case 1:
                            bits = 0;
                            maxpower = Math.pow(2, 16);
                            power = 1;
                            while (power != maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                    data.position = resetValue;
                                    data.val = getNextValue(data.index++);
                                }
                                bits |= (resb > 0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                            c = f(bits);
                            break;
                        case 2:
                            return '';
                    }
                    dictionary[3] = c;
                    w = c;
                    result.push(c);
                    while (true) {
                        if (data.index > length) {
                            return '';
                        }

                        bits = 0;
                        maxpower = Math.pow(2, numBits);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }

                        switch (c = bits) {
                            case 0:
                                bits = 0;
                                maxpower = Math.pow(2, 8);
                                power = 1;
                                while (power != maxpower) {
                                    resb = data.val & data.position;
                                    data.position >>= 1;
                                    if (data.position == 0) {
                                        data.position = resetValue;
                                        data.val = getNextValue(data.index++);
                                    }
                                    bits |= (resb > 0 ? 1 : 0) * power;
                                    power <<= 1;
                                }

                                dictionary[dictSize++] = f(bits);
                                c = dictSize - 1;
                                enlargeIn--;
                                break;
                            case 1:
                                bits = 0;
                                maxpower = Math.pow(2, 16);
                                power = 1;
                                while (power != maxpower) {
                                    resb = data.val & data.position;
                                    data.position >>= 1;
                                    if (data.position == 0) {
                                        data.position = resetValue;
                                        data.val = getNextValue(data.index++);
                                    }
                                    bits |= (resb > 0 ? 1 : 0) * power;
                                    power <<= 1;
                                }
                                dictionary[dictSize++] = f(bits);
                                c = dictSize - 1;
                                enlargeIn--;
                                break;
                            case 2:
                                return result.join('');
                        }

                        if (enlargeIn == 0) {
                            enlargeIn = Math.pow(2, numBits);
                            numBits++;
                        }

                        if (dictionary[c]) {
                            entry = dictionary[c];
                        } else {
                            if (c === dictSize) {
                                entry = w + w.charAt(0);
                            } else {
                                return null;
                            }
                        }
                        result.push(entry);

                        dictionary[dictSize++] = w + entry.charAt(0);
                        enlargeIn--;

                        w = entry;

                        if (enlargeIn == 0) {
                            enlargeIn = Math.pow(2, numBits);
                            numBits++;
                        }

                    }
                }
            };
            return LZString;
        })()
    });
    syn.$c = $crytography;
})(globalRoot);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $stringbuilder = context.$stringbuilder || new syn.module();

    $stringbuilder.extend({
        version: '1.0',

        datas: [],

        append(val) {
            this.datas.push(val);
        },

        appendFormat(pattern) {
            var vals = this.convertToArray(arguments).slice(1);
            this.datas[this.datas.length] = pattern.replace(/\{(\d+)\}/g, function (pattern, index) {
                return vals[index].toString();
            });
        },

        convertToArray() {
            if (!arguments) {
                return [];
            }

            if (arguments.toArray) {
                return arguments.toArray();
            }

            var args = arguments[0];
            var len = args.length
            var results = new Array(len);

            while (len--) {
                results[len] = args[len];
            }

            return results;
        },

        clear() {
            this.datas.length = 0;
        },

        toString(flag) {
            if ($object.isNullOrUndefined(flag) == true) {
                flag = '\n';
            }
            return this.datas.join('');
        }
    });
    syn.$sb = $stringbuilder;
})(globalRoot);

/// <reference path='syn.core.js' />
/// <reference path='syn.library.js' />

(function (context) {
    'use strict';
    var $keyboard = context.$keyboard || new syn.module();

    $keyboard.extend({
        version: '1.0',

        keyCodes: {
            'backspace': 8,
            'tab': 9,
            'enter': 13,
            'shift': 16,
            'control': 17,
            'alt': 18,
            'capslock': 20,
            'escape': 27,
            'space': 32,
            'pageup': 33,
            'pagedown': 34,
            'end': 35,
            'home': 36,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'delete': 46,
            'semicolon': 186,
            'colon': 186,
            'equal': 187,
            'plus': 187,
            'comma': 188,
            'less': 188,
            'minus': 189,
            'underscore': 189,
            'period': 190,
            'greater': 190,
            'slash': 191,
            'questionmark': 191,
            'backtick': 192,
            'tilde': 192,
            'openingsquarebracket': 219,
            'openingcurlybracket': 219,
            'backslash': 220,
            'pipe': 220,
            'closingsquarebracket': 221,
            'closingcurlybracket': 221,
            'singlequote': 222,
            'doublequote': 222,
            'clear': 12,
            'meta': 91,
            'contextmenu': 93,
            'numpad0': 96,
            'numpad1': 97,
            'numpad2': 98,
            'numpad3': 99,
            'numpad4': 100,
            'numpad5': 101,
            'numpad6': 102,
            'numpad7': 103,
            'numpad8': 104,
            'numpad9': 105,
            'multiply': 106,
            'add': 107,
            'subtract': 109,
            'decimal': 110,
            'divide': 111,
            '0': 48,
            '1': 49,
            '2': 50,
            '3': 51,
            '4': 52,
            '5': 53,
            '6': 54,
            '7': 55,
            '8': 56,
            '9': 57,
            'a': 65,
            'b': 66,
            'c': 67,
            'd': 68,
            'e': 69,
            'f': 70,
            'g': 71,
            'h': 72,
            'i': 73,
            'j': 74,
            'k': 75,
            'l': 76,
            'm': 77,
            'n': 78,
            'o': 79,
            'p': 80,
            'q': 81,
            'r': 82,
            's': 83,
            't': 84,
            'u': 85,
            'v': 86,
            'w': 87,
            'x': 88,
            'y': 89,
            'z': 90,
            'f1': 112,
            'f2': 113,
            'f3': 114,
            'f4': 115,
            'f5': 116,
            'f6': 117,
            'f7': 118,
            'f8': 119,
            'f9': 120,
            'f10': 121,
            'f11': 122,
            'f12': 123
        },

        keyboardEL: null,

        setElement(el) {
            this.keyboardEL = context.keyboardEL = el;
            keyboardEL.keyObject = [];
            keyboardEL.keyObject['keydown'] = [];
            keyboardEL.keyObject['keyup'] = [];
            keyboardEL.keyObject['keypress'] = [];

            function handler(evt) {
                var eventType = evt.type;
                var keyCode = evt.keyCode;
                context.keyboardEvent = arguments[0];
                context.documentEvent = evt;

                if (keyboardEL.keyObject[eventType][keyCode] != null) {
                    var val = keyboardEL.keyObject[eventType][keyCode](evt);
                    if (val === false) {
                        evt.returnValue = false;
                        evt.cancel = true;
                        if (evt.preventDefault) {
                            evt.preventDefault();
                        }

                        if (evt.stopPropagation) {
                            evt.stopPropagation();
                        }
                        return false;
                    }
                }
            };

            syn.$l.addEvent(keyboardEL, 'keypress', handler);
            syn.$l.addEvent(keyboardEL, 'keydown', handler);
            syn.$l.addEvent(keyboardEL, 'keyup', handler);
            return this;
        },

        addKeyDown(keyCode, func) {
            keyboardEL.keyObject['keydown'][keyCode] = func;
            return this;
        },

        removeKeyDown(keyCode) {
            keyboardEL.keyObject['keydown'][keyCode] = null;
            return this;
        },

        addKeyUp(keyCode, func) {
            keyboardEL.keyObject['keyup'][keyCode] = func;
            return this;
        },

        removeKeyUp(keyCode) {
            keyboardEL.keyObject['keyup'][keyCode] = null;
            return this;
        },

        addKeyPress(keyCode, func) {
            keyboardEL.keyObject['keypress'][keyCode] = func;
            return this;
        },

        removeKeyPress(keyCode) {
            keyboardEL.keyObject['keypress'][keyCode] = null;
            return this;
        }
    });
    syn.$k = $keyboard;
})(globalRoot);

/// <reference path='syn.core.js' />
/// <reference path='syn.library.js' />

(function (context) {
    'use strict';
    var $validation = context.$validation || new syn.module();
    var document = context.document;

    $validation.extend({
        version: '1.0',
        element: null,
        isContinue: true,
        invalidMessages: [],
        validations: [],

        // syn.$v.setElement(syn.$l.get('Text1'));
        setElement(el) {
            this.element = el;
            if (!this.validations[el.id]) {
                if (!el.validObject) {
                    this.clear();
                }

                this.validations[el.id] = el;
            }

            return this;
        },

        // syn.$v.required(syn.$l.get('Text1'), 'Required 검사가 실패했습니다.');
        // syn.$v.validateForm();
        required(el, invalidMessage) {
            this.setElement(el);
            this.addRequired(true, invalidMessage);
            return this;
        },

        // syn.$v.addRequired(true, 'Required 검사가 실패했습니다.');
        addRequired(isRequired, invalidMessage) {
            this.element.required = isRequired;
            this.element.invalidMessage = invalidMessage;
            return this;
        },

        // syn.$v.addPattern('NumberFormat', { 'expr': /[0-9]/, 'invalidMessage': 'Pattern 검사가 실패했습니다.' });
        addPattern(id, val) {
            if (this.element.validObject) {
                this.element.validObject['pattern'][id] = val;
            }
            return this;
        },

        // syn.$v.addRange('OverFlowCheck', { 'min': 0, 'max': 100, 'minOperator': '<', 'maxOperator': '>', 'invalidMessage': 'Range 검사가 실패했습니다.' });
        addRange(id, val) {
            if (this.element.validObject) {
                this.element.validObject['range'][id] = val;
            }
            return this;
        },

        // syn.$v.addCustom('CustomVaild', { 'func': 'customVaildation', 'functionParam1': 'ok', 'invalidMessage': 'Custom 검사가 실패했습니다.' });
        addCustom(id, val) {
            if (this.element.validObject) {
                this.element.validObject['custom'][id] = val;
            }
            return this;
        },

        remove(id) {
            this.element.validObject['pattern'][id] = null;
            this.element.validObject['range'][id] = null;
            this.element.validObject['custom'][id] = null;
            return this;
        },

        clear() {
            this.element.validObject = [];
            this.element.validObject['pattern'] = [];
            this.element.validObject['range'] = [];
            this.element.validObject['custom'] = [];
            this.element.required = false;
            this.element.invalidMessage = '';
            this.invalidMessages = [];
            return this;
        },

        // v.validateControl(syn.$l.get('Text1'))
        validateControl(el) {
            if (this.element !== el) {
                this.element = el;
            }

            var isValidate = true;
            var result = false;

            if (el.required) {
                if (el.value.length > 0) {
                    result = true;
                }
                else {
                    result = false;
                    isValidate = false;
                    this.invalidMessages[this.invalidMessages.length.toString()] = el.invalidMessage;

                    if (this.isContinue == false) {
                        return isValidate;
                    }
                }
            }

            for (var valid in el.validObject) {
                if (valid === 'pattern') {
                    var pattern = null;
                    var expr = null;

                    for (var validType in el.validObject[valid]) {
                        var pattern = el.validObject[valid][validType];
                        var expr = pattern.expr;
                        result = expr.test(el.value);

                        if (result == false) {
                            isValidate = false;
                            this.invalidMessages[this.invalidMessages.length.toString()] = pattern.invalidMessage;

                            if (this.isContinue == false) {
                                break;
                            }
                        }
                    }
                }
                else if (valid === 'range') {
                    var range = null;
                    var min = null;
                    var max = null;
                    var minOperator = null;
                    var maxOperator = null;

                    for (var validType in el.validObject[valid]) {
                        range = el.validObject[valid][validType];
                        min = range.min;
                        max = range.max;
                        minOperator = range.minOperator;
                        maxOperator = range.maxOperator;

                        try {
                            result = eval(min.toString() + ' ' + minOperator.toString() + ' ' + el.value + '&&' + max.toString() + ' ' + maxOperator.toString() + ' ' + el.value);
                        } catch (error) {
                            syn.$l.eventLog('$v.validateControl', 'elID: "{0}" 유효성 range 검사 오류 '.format(el.id) + error.message, 'Warning');
                        }

                        if (result == false) {
                            isValidate = false;
                            this.invalidMessages[this.invalidMessages.length.toString()] = range.invalidMessage;

                            if (this.isContinue == false) {
                                break;
                            }
                        }
                    }
                }
                else if (valid === 'custom') {
                    var custom = null;
                    var func = null;
                    var parameters = null;

                    for (var validType in el.validObject[valid]) {
                        custom = el.validObject[valid][validType];
                        func = custom.func;
                        parameters = [];

                        for (var parameterName in custom) {
                            if (parameterName !== 'func') {
                                parameters[parameterName] = custom[parameterName];
                            }
                        }

                        try {
                            if ($this) {
                                result = eval('window[syn.$w.pageScript]["' + func + '"]').call(parameters, custom);
                            }
                            else {
                                result = eval(func).call(parameters, custom);
                            }
                        } catch (error) {
                            syn.$l.eventLog('$v.validateControl', 'elID: "{0}" 유효성 custom 검사 오류 '.format(el.id) + error.message, 'Warning');
                        }

                        if (result == false) {
                            isValidate = false;
                            this.invalidMessages[this.invalidMessages.length.toString()] = custom.invalidMessage;

                            if (this.isContinue == false) {
                                break;
                            }
                        }
                    }
                }
            }

            return isValidate;
        },

        // syn.$v.validateControls(syn.$l.get('Text1', 'Text2', 'Text3'))
        validateControls(els) {
            var isValidate = true;
            var result = true;
            var el = null;

            if (els.type) {
                el = els;
                isValidate = this.validateControl(el);
            }
            else if (els.length) {
                for (var i = 0, len = els.length; i < len; i++) {
                    el = els[i];
                    result = this.validateControl(el);

                    if (result == false) {
                        isValidate = false;
                    }
                }
            }

            return isValidate;
        },

        // syn.$v.validateForm()
        validateForm() {
            var isValidate = true;
            var result = false;
            for (var eid in this.validations) {
                result = this.validateControl(this.validations[eid]);

                if (result == false) {
                    isValidate = false;
                }
            }

            return isValidate;
        },

        // syn.$v.toInvalidMessages()
        toInvalidMessages() {
            var result = '';

            for (var i = 0; i < this.invalidMessages.length; i++) {
                result += this.invalidMessages[i] + '\r\n';
            }

            this.invalidMessages = [];
            return result;
        },

        init() {
            var el = null;
            for (var eid in this.validations) {
                this.element = this.validations[eid];
                this.clear();
            }

            this.validations = [];
        },

        valueType: new function () {
            this.valid = 0;
            this.valueMissing = 1;
            this.typeMismatch = 2;
            this.patternMismatch = 3;
            this.tooLong = 4;
            this.rangeUnderflow = 5;
            this.rangeOverflow = 6;
            this.stepMismatch = 7;
        },

        validType: new function () {
            this.required = 0;
            this.pattern = 1;
            this.range = 2;
            this.custom = 3;
        },

        regexs: new function () {
            this.alphabet = /^[a-zA-Z]*$/;
            this.juminNo = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-?[1-4][0-9]{6}$/;
            this.numeric = /^-?[0-9]*(\.[0-9]+)?$/;
            this.email = /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i;
            this.url = /^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#&+_\?\/\w \.\-=]*$/i;
            this.ipAddress = /^(?:\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|null)$/;
            this.date = /^\d{4}-\d{2}-\d{2}$/;
            this.mobilePhone = /^01([0|1|6|7|8|9])(\d{7,8})/;
            this.seoulPhone = /^02(\d{7,8})/;
            this.areaPhone = /^0([0|3|4|5|6|7|8|])([0|1|2|3|4|5|])(\d{7,8})/;
            this.onesPhone = /^050([2|5])(\d{7,8})/;
            this.float = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;
            this.isoDate = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
        }
    });
    syn.$v = $validation;
})(globalRoot);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $date = context.$date || new syn.module();
    var $array = context.$array || new syn.module();
    var $string = context.$string || new syn.module();
    var $number = context.$number || new syn.module();
    var $object = context.$object || new syn.module();

    (function () {
        var UID = {
            current: 0,
            getNew() {
                this.current++;
                return this.current;
            }
        };

        if (globalRoot.devicePlatform === 'browser') {
            HTMLElement.prototype.pseudoStyle = function (virtualSelector, prop, value) {
                var $that = this;
                var sheetID = 'pseudoStyles';
                var head = document.head || document.getElementsByTagName('head')[0];
                var sheet = document.getElementById(sheetID) || document.createElement('style');
                sheet.id = sheetID;
                var className = 'pseudoStyle' + UID.getNew();

                $that.className += ' ' + className;

                sheet.innerHTML += ' .' + className + ':' + virtualSelector + '{' + prop + ':' + value + '}';
                head.appendChild(sheet);
                return this;
            };

            HTMLElement.prototype.controlPseudoStyle = function (virtualSelector, styleValue) {
                var $that = this;
                var sheetID = 'controlPseudoStyles';
                var head = document.head || document.getElementsByTagName('head')[0];
                var sheet = document.getElementById(sheetID) || document.createElement('style');
                sheet.id = sheetID;
                var className = 'controlPseudoStyle' + UID.getNew();

                $that.className += ' ' + className;

                sheet.innerHTML += '#{0} {1} {2}'.format($that.id, virtualSelector, styleValue);
                head.appendChild(sheet);
                return this;
            };
        }

        if (!Function.prototype.clone) {
            Function.prototype.clone = function () {
                var that = this;
                var result = function T() { return that.apply(this, arguments); };
                for (var key in this) {
                    result[key] = this[key];
                }

                return result;
            };
        }

        if (!Object.assign) {
            Object.assign = function clone(obj) {
                if (obj === null || typeof (obj) !== 'object')
                    return obj;

                var copy = obj.constructor();

                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = obj[attr];
                    }
                }

                return copy;
            }
        }

        if (!Object.entries) {
            Object.entries = function (obj) {
                var ownProps = Object.keys(obj),
                    i = ownProps.length,
                    resArray = new Array(i);
                while (i--)
                    resArray[i] = [ownProps[i], obj[ownProps[i]]];

                return resArray;
            }
        }

        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                var val = this.replace(/^\s+/, '');
                for (var i = val.length - 1; i > 0; i--) {
                    if (/\S/.test(val.charAt(i))) {
                        val = val.substring(0, i + 1);
                        break;
                    }
                }

                return val;
            };
        }

        if (!String.prototype.includes) {
            String.prototype.includes = function (val) {
                return this.indexOf(val) !== -1;
            };
        }

        if (!String.prototype.format) {
            String.prototype.format = function () {
                var val = this;
                for (var i = 0, len = arguments.length; i < len; i++) {
                    var exp = new RegExp('\{' + i.toString() + '+?\}', 'g');
                    val = val.replace(exp, arguments[i]);
                }

                return val;
            };
        }

        if (!String.prototype.parseISOString) {
            String.prototype.parseISOString = function () {
                var val = this;
                var result = null;

                if (val && val.includes('T') == true) {
                    var date = val.split(/\D+/);
                    result = new Date(Date.UTC(date[0], --date[1], date[2], date[3], date[4], date[5], date[6]));
                }

                return result;
            }
        }

        if (!Array.prototype.includes) {
            Object.defineProperty(Array.prototype, 'includes', {
                value(searchElement, fromIndex) {
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);
                    var len = o.length >>> 0;
                    if (len === 0) {
                        return false;
                    }

                    var n = fromIndex | 0;
                    var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                    function sameValueZero(x, y) {
                        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
                    }

                    while (k < len) {
                        if (sameValueZero(o[k], searchElement)) {
                            return true;
                        }
                        k++;
                    }
                    return false;
                }
            });
        }

        if (!Array.prototype.filter) {
            Array.prototype.filter = function (func, thisArg) {
                'use strict';
                if (!((typeof func === 'Function' || typeof func === 'function') && this))
                    throw new TypeError();

                var len = this.length >>> 0,
                    res = new Array(len),
                    t = this, c = 0, i = -1;
                if (thisArg === undefined) {
                    while (++i !== len) {
                        if (i in this) {
                            if (func(t[i], i, t)) {
                                res[c++] = t[i];
                            }
                        }
                    }
                }
                else {
                    while (++i !== len) {
                        if (i in this) {
                            if (func.call(thisArg, t[i], i, t)) {
                                res[c++] = t[i];
                            }
                        }
                    }
                }

                res.length = c;
                return res;
            };
        }

        if (!Array.prototype.map) {
            Array.prototype.map = function (callback, thisArg) {
                var T, A, k;

                if (this == null) {
                    throw new TypeError(' this is null or not defined');
                }

                var O = Object(this);
                var len = O.length >>> 0;
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }

                if (arguments.length > 1) {
                    T = thisArg;
                }

                A = new Array(len);
                k = 0;
                while (k < len) {
                    var kValue, mappedValue;

                    if (k in O) {
                        kValue = O[k];
                        mappedValue = callback.call(T, kValue, k, O);
                        A[k] = mappedValue;
                    }
                    k++;
                }

                return A;
            };
        }

        if (!Date.prototype.toISOString) {
            Date.prototype.toISOString = function () {
                var date = this;

                function pad(n) { return (n < 10 ? '0' : '') + n }
                function padd(n) { return (n < 100 ? '0' : '') + pad(n) }

                return date.getUTCFullYear() + '-' +
                    pad(date.getUTCMonth() + 1) + '-' +
                    pad(date.getUTCDate()) +
                    'T' + pad(date.getUTCHours()) + ':' +
                    pad(date.getUTCMinutes()) + ':' +
                    pad(date.getUTCSeconds()) + '.' +
                    padd(date.getMilliseconds()) + 'Z';
            }
        }

        if (globalRoot.devicePlatform === 'node') {
        }
        else {
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
            }

            if (!Element.prototype.closest) {
                Element.prototype.closest = function (s) {
                    var el = this;

                    do {
                        if (el.matches(s)) return el;
                        el = el.parentElement || el.parentNode;
                    } while (el !== null && el.nodeType === 1);
                    return null;
                };
            }
        }
    })();

    $date.extend({
        version: '1.0',
        interval: {
            yyyy: { units: 1000 * 60 * 60 * 24 * 365, measure: 'year' },
            m: { units: 1000 * 60 * 60 * 24 * 30, measure: 'month' },
            d: { units: 1000 * 60 * 60 * 24, measure: 'day' },
            q: { units: (1000 * 60 * 60 * 24 * 30) * 3, measure: 'quarter' },
            h: { units: 60000 * 60, measure: 'hour' },
            n: { units: 60000, measure: 'minute' },
            s: { units: 1000, measure: 'second' },
        },
        minutes: 60000,

        toUTC(date) {
            if (typeof date === 'string') {
                var expr = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(date);
                if (expr) {
                    return new Date(Date.UTC(+expr[1], +expr[2] - 1, +expr[3], +expr[4], +expr[5], +expr[6]));
                }
            }
            return null;
        },

        clear(date, isTimeOnly) {
            date.setYear(0);
            date.setMonth(0);
            date.setDate(0);

            if (isTimeOnly === true) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
            }

            return date;
        },

        now(date) {
            date = new Date();
            return date;
        },

        clone(date) {
            return new Date(date.getTime());
        },

        isBetween(date, start, end) {
            return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
        },

        equals(date, targetDate) {
            return date.toDateString() == (targetDate || new Date()).toDateString();
        },

        isToday(date) {
            return $date.equals(date, new Date());
        },

        toString(date, format) {
            var result = '';
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate().toString();
            var hours = date.getHours().toString().length == 1 ? '0' + date.getHours().toString() : date.getHours().toString();
            var minutes = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
            var seconds = date.getSeconds().toString().length == 1 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
            var milliseconds = date.getMilliseconds().toString();
            var week = ['일', '월', '화', '수', '목', '금', '토'];

            month = month.toString().length == 1 ? '0' + month.toString() : month.toString();

            switch (format) {
                case 'd':
                    result = year.toString().concat('-', month, '-', day);
                    break;
                case 't':
                    result = hours.toString().concat(':', minutes, ':', seconds);
                    break;
                case 'a':
                    result = year.toString().concat('-', month, '-', day, ' ', hours, ':', minutes, ':', seconds);
                    break;
                case 'f':
                    result = year.toString().concat(month, day, hours, minutes, seconds, milliseconds);
                    break;
                case 'w':
                    result = week[date.getDay()];
                    break;
                case 'n':
                    var dayOfWeek = week[date.getDay()];
                    result = year.toString().concat('년', month, '월', day, '일', '(', dayOfWeek, ')');
                    break;
                default:
                    result = date.getDate();
            }

            return result;
        },

        addHour(date, val) {
            return new Date(date.setTime(date.getTime() + (val * 60 * 60 * 1000)));
        },

        addDay(date, val) {
            return new Date(date.setDate(date.getDate() + val));
        },

        addWeek(date, val) {
            return new Date(date.setDate(date.getDate() + (val * 7)));
        },

        addMonth(date, val) {
            return new Date(date.setMonth(date.getMonth() + val));
        },

        addYear(date, val) {
            return new Date(date.setFullYear(date.getFullYear() + val));
        },

        getFirstDate(date) {
            return new Date(date.setDate(1));
        },

        getLastDate(date) {
            date = $date.addMonth(date, 1);
            return $date.addDay(new Date(date.setDate(1)), -1);
        },

        // var date1 = new Date();
        // var date2 = new Date();
        // date2 = date2.addDay(3);
        // $date.diff('h', date1, date2); // 포맷값(yyyy, m, d, q, h, n, s)
        diff(itv, start, end) {
            if ($ref.isString(start) == true) {
                start = new Date(start);
            }

            if ($ref.isString(end) == true) {
                end = new Date(end);
            }

            var period1 = this.toString(start, 'd');
            var splitDate1 = period1.split('-');
            var periodYear1 = splitDate1[0];
            var periodMonth1 = splitDate1[1] - 1;
            var periodDay1 = splitDate1[2];

            var period2 = this.toString(end, 'd');
            var splitDate2 = period2.split('-');
            var periodYear2 = splitDate2[0];
            var periodMonth2 = splitDate2[1] - 1;
            var periodDay2 = splitDate2[2];

            var do1 = new Date(periodYear1, periodMonth1, periodDay1);
            do1.setHours(0);
            do1.setMinutes(0);
            do1.setSeconds(0);
            var period1Time = do1.getTime();

            var do2 = new Date(periodYear2, periodMonth2, periodDay2);
            do2.setHours(0);
            do2.setMinutes(0);
            do2.setSeconds(0);
            var period2Time = do2.getTime();
            var adjust = null;

            if (do2 > do1) {
                adjust = (do2.getTimezoneOffset() - do1.getTimezoneOffset()) * $date.minutes;
            }
            else {
                adjust = (do1.getTimezoneOffset() - do2.getTimezoneOffset()) * $date.minutes;
            }

            if (typeof $date.interval[itv] != 'undefined') {
                var diff = Math.ceil(period2Time - period1Time) - adjust;
                var timeDiff = Math.floor(diff / $date.interval[itv].units);

                return parseInt(timeDiff);
            }
            else {
                return -1;
            }
        },

        toTicks(date) {
            return ((date.getTime() * 10000) + 621355968000000000);
        },

        // alert($date.isDate('2012-12-31')); // true
        // alert($date.isDate('2012-12-31T00:00:00')); // true
        // alert($date.isDate('2012-12-32')); // false
        isDate(val) {
            var result = false;
            var scratch = null;

            scratch = new Date(val);
            if (scratch.toString() == 'NaN' || scratch.toString() == 'Invalid Date') {
                if (syn.$b.isSafari == true && syn.$b.isChrome == false) {
                    var parts = val.match(/(\d+)/g);
                    scratch = new Date(parts[0], parts[1] - 1, parts[2]);
                    if (scratch.toString() == 'NaN' || scratch.toString() == 'Invalid Date') {
                        result = false;
                    }
                    else {
                        result = true;
                    }
                }
                else {
                    result = false;
                }
            }
            else {
                result = true;
            }

            return result;
        },

        isISOString(val) {
            var date = new Date(val);
            return !Number.isNaN(date.valueOf()) && date.toISOString() === val;
        },

        calcWeekOfMonth(year, month, weekStand) {
            var result = [];
            var date = new Date(year, month);

            // 월요일을 중심으로한 주차 구하기(일요일 0 월요일 1 ~ 토요일 6 )
            var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
            var week = null;

            if ($object.isNullOrUndefined(weekStand) == true) {
                weekStand = 8; // 월요일 고정
            }

            var firstWeekEndDate = true;
            var thisMonthFirstWeek = firstDay.getDay();

            for (var num = 1; num <= 6; num++) {
                // 마지막월과 첫번째월이 다른경우 빠져나온다.
                if (lastDay.getMonth() != firstDay.getMonth()) {
                    break;
                }

                week = {};

                // 한주의 시작일은 월의 첫번째 월요일로 설정
                if (firstDay.getDay() <= 1) {
                    // 한주의 시작일이 일요일이라면 날짜값을 하루 더해준다.
                    if (firstDay.getDay() == 0) {
                        firstDay.setDate(firstDay.getDate() + 1);
                    }

                    week.weekStartDate = firstDay.getFullYear().toString() + '-' + $this.numberPad((firstDay.getMonth() + 1).toString(), 2) + '-' + $this.numberPad(firstDay.getDate().toString(), 2);
                }

                if (weekStand > thisMonthFirstWeek) {
                    if (firstWeekEndDate) {
                        if (weekStand - firstDay.getDay() == 1) {
                            firstDay.setDate(firstDay.getDate() + (weekStand - firstDay.getDay()) - 1);
                        }

                        if (weekStand - firstDay.getDay() > 1) {
                            firstDay.setDate(firstDay.getDate() + (weekStand - firstDay.getDay()) - 1);
                        }

                        firstWeekEndDate = false;
                    } else {
                        firstDay.setDate(firstDay.getDate() + 6);
                    }
                } else {
                    firstDay.setDate(firstDay.getDate() + (6 - firstDay.getDay()) + weekStand);
                }

                // 월요일로 지정한 데이터가 존재하는 경우에만 마지막 일의 데이터를 담는다.
                if (typeof week.weekStartDate !== 'undefined') {
                    week.weekEndDate = firstDay.getFullYear().toString() + '-' + $this.numberPad((firstDay.getMonth() + 1).toString(), 2) + '-' + $this.numberPad(firstDay.getDate().toString(), 2);
                    result.push(week);
                }

                firstDay.setDate(firstDay.getDate() + 1);
            }

            return result;
        }
    });
    context.$date = $date;

    $string.extend({
        version: '1.0',

        toDate(val) {
            return new Date((val - 621355968000000000) / 10000);
        },

        br(val) {
            return val.replace(/(\r\n|\r|\n)/g, '<br />');
        },

        isBusinessNo(val) {
            var result = false;
            var valueMap = val.replace(/-/gi, '').split('').map(function (item) {
                return parseInt(item, 10);
            });

            if (valueMap.length === 10) {
                try {
                    var multiply = [1, 3, 7, 1, 3, 7, 1, 3, 5];
                    var checkSum = 0;

                    for (var i = 0; i < multiply.length; ++i) {
                        checkSum += multiply[i] * valueMap[i];
                    }

                    checkSum += parseInt((multiply[8] * valueMap[8]) / 10, 10);
                    result = Math.floor(valueMap[9]) === ((10 - (checkSum % 10)) % 10);
                } catch (e) {
                    result = false;
                }
            }

            return result;
        },

        interpolate(text, json, options = null) {
            var result = null;

            if (json != null) {
                options = syn.$w.argumentsExtend({
                    defaultValue: null,
                    separator: '\n',
                }, options);

                var replaceFunc = function (text, item) {
                    return text.replace(/\${([^${}]*)}/g,
                        function (pattern, key) {
                            var value = item[key];
                            return typeof value === 'string' || typeof value === 'number' ? value : (options.defaultValue == null ? pattern : options.defaultValue);
                        }
                    )
                };

                if ($ref.isArray(json) == false) {
                    result = replaceFunc(text, json);
                }
                else {
                    var values = [];
                    for (var key in json) {
                        var item = json[key];
                        values.push(replaceFunc(text, item));
                    }

                    result = values.join(options.separator);
                }
            }

            return result;
        },

        isNullOrEmpty(val) {
            if (val === undefined || val === null || val === '') {
                return true;
            }
            else {
                return false;
            }
        },

        sanitizeHTML(val) {
            return val.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
                .replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
        },

        // 참조(http://www.ascii.cl/htmlcodes.htm)
        toHtmlChar(val) {
            return val.replace(/&/g, '&amp;').replace(/\'/g, '&quot;').replace(/\'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        toCharHtml(val) {
            return val.replace(/&amp;/g, '&').replace(/&quot;/g, '\'').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        },

        toAscii(val) {
            return (val.trim().replace(/[^0-9a-zA-Z\value]/g, ''));
        },

        isAscii(val) {
            return /^[\x00-\x7F]*$/.test(val);
        },

        length(val) {
            var result = 0;
            for (var i = 0, len = val.length; i < len; i++) {
                if (val.charCodeAt(i) > 127) {
                    result += 2;
                }
                else {
                    result++;
                }
            }

            return result;
        },

        substring(val, len) {
            var currentLength = 0;
            if ($object.isNullOrUndefined(len) == true) {
                len = val.length;
            }

            for (var i = 0; i < val.length; i++) {
                if (val.charCodeAt(i) > 127) {
                    currentLength += 2;
                }
                else {
                    currentLength += 1;
                }

                if (currentLength > len) {
                    return val.substring(0, i);
                }
            }

            return val;
        },

        split(val, len) {
            var i = 0;
            var result = [];
            while (i < val.length) {
                var substr = $string.substring(val, len);
                if (substr) {
                    result.push(substr);
                    val = val.replace(substr, '');
                }
                else {
                    break;
                }
            }

            return result;
        },

        isNumber(num, opt) {
            num = String(num).replace(/^\s+|\s+$/g, "");

            if (typeof opt == "undefined" || opt == "1") {
                var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
            } else if (opt == "2") {
                var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
            } else if (opt == "3") {
                var regex = /^[0-9]+(\.[0-9]+)?$/g;
            } else {
                var regex = /^[0-9]$/g;
            }

            if (regex.test(num)) {
                num = num.replace(/,/g, "");
                return isNaN(num) ? false : true;
            } else {
                return false;
            }
        },

        capitalize(val) {
            return val.replace(/\b([a-z])/g, function (val) {
                return val.toUpperCase()
            });
        },

        // toJson('col1;col2\na;b\nc;d', ';');
        toJson(val, option) {
            option = option || {};
            var delimeter = option.delimeter || ',';
            var newline = option.newline || '\n';
            var meta = option.meta || {};
            var i, row, lines = val.split(RegExp('{0}'.format(newline), 'g'));
            var headers = lines[0].split(delimeter);
            for (i = 0; i < headers.length; i++) {
                headers[i] = headers[i].replace(/(^[\s"]+|[\s"]+$)/g, '');
            }
            var result = [];
            var lineLength = lines.length;
            var headerLength = headers.length;
            if ($ref.isEmpty(meta) == true) {
                for (i = 1; i < lineLength; i++) {
                    row = lines[i].split(delimeter);
                    var item = {};
                    for (var j = 0; j < headerLength; j++) {
                        item[headers[j]] = $string.toDynamic(row[j]);
                    }
                    result.push(item);
                }
            }
            else {
                for (i = 1; i < lineLength; i++) {
                    row = lines[i].split(delimeter);
                    var item = {};
                    for (var j = 0; j < headerLength; j++) {
                        var columnName = headers[j];
                        item[columnName] = $string.toParseType(row[j], meta[columnName]);
                    }
                    result.push(item);
                }
            }
            return result;
        },

        toParameterObject(parameters) {
            return (parameters.match(/([^?:;]+)(:([^;]*))/g) || []).reduce(function (a, v) {
                return a[v.slice(0, v.indexOf(':')).replace('@', '')] = v.slice(v.indexOf(':') + 1), a;
            }, {});
        },

        toNumber(val) {
            var result = 0;
            try {
                result = parseFloat(($object.isNullOrUndefined(val) == true ? 0 : val) === 0 || val === '' ? '0' : val.toString().replace(/,/g, ''));
            } catch (error) {
                console.log(error);
            }

            return result;
        },

        toBoolean(val) {
            return (val === 'true' || val === 'True' || val === 'TRUE' || val === 'Y' || val == '1');
        },

        toDynamic(val, emptyIsNull) {
            var result;
            if (emptyIsNull == undefined) {
                emptyIsNull = false;
            }

            if (emptyIsNull == true && val === '') {
                result = null;
            }
            else {
                if (val === 'true' || val === 'True' || val === 'TRUE') {
                    result = true;
                }
                else if (val === 'false' || val === 'False' || val === 'FALSE') {
                    result = false;
                }
                else if ($validation.regexs.float.test(val)) {
                    result = $string.toNumber(val);
                }
                else if ($validation.regexs.isoDate.test(val)) {
                    result = new Date(val);
                }
                else {
                    result = val;
                }
            }

            return result;
        },

        toParseType(val, metaType, emptyIsNull) {
            var result;

            if (emptyIsNull == undefined) {
                emptyIsNull = false;
            }

            if (emptyIsNull == true && val === '') {
                result = null;
            }
            else {
                switch (metaType) {
                    case 'string':
                        result = val;
                        break;
                    case 'bool':
                        result = $string.toBoolean(val);
                        break;
                    case 'number':
                    case 'int':
                        result = $object.isNullOrUndefined(val) == true ? null : $string.isNumber(val) == true ? $string.toNumber(val) : null;
                        break;
                    case 'date':
                        if ($validation.regexs.isoDate.test(val)) {
                            result = new Date(val);
                        }
                        break;
                    default:
                        result = val;
                        break;
                }
            }

            return result;
        },

        toNumberString(val) {
            return val.replace(/,/g, '');
        },

        toCurrency(val, localeID, options) {
            var result = null;
            if ($string.isNumber(val) == false) {
                return result;
            }

            if ($object.isNullOrUndefined(localeID) == true) {
                var x = val.toString().split('.');
                var x1 = x[0];

                var x2 = x.length > 1 ? '.' + x[1] : '';
                var expr = /(\d+)(\d{3})/;

                while (expr.test(x1)) {
                    x1 = x1.replace(expr, '$1' + ',' + '$2');
                }

                result = x1 + x2;
            }
            else {
                // https://ko.wikipedia.org/wiki/ISO_4217
                var formatOptions = syn.$w.argumentsExtend({
                    style: 'currency',
                    currency: 'KRW'
                }, options);

                result = Intl.NumberFormat(localeID, formatOptions).format(val);
            }

            return result;
        },

        digits(val, length, fix) {
            var fix = fix || '0';
            var digit = '';

            if (this.length < length) {
                for (var i = 0; i < length - val.length; i++) {
                    digit += fix;
                }
            }

            return digit + val;
        },

        toClipboard(val) {
            if (globalRoot.devicePlatform === 'node') {
            }
            else {
                var el = document.createElement('textarea');
                el.value = val;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                var selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                if (selected) {
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(selected);
                }
            }
        }
    });
    context.$string = $string;

    $array.extend({
        version: '1.0',

        distinct(arr) {
            var derived = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (this.contains(derived, arr[i]) == false) {
                    derived.push(arr[i])
                }
            }

            return derived;
        },

        sort(arr, order) {
            var temp = null;

            if (order) {
                order = true;
            }

            if (order == true) {
                for (var i = 0, ilen = arr.length; i < ilen; i++) {
                    for (var j = 0, jlen = arr.length; j < jlen; j++) {
                        if (arr[i] < arr[j]) {
                            temp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = temp;
                        }
                    }
                }
            }
            else {
                for (var i = 0, ilen = arr.length; i < ilen; i++) {
                    for (var j = 0, jlen = arr.length; j < jlen; j++) {
                        if (arr[i] > arr[j]) {
                            temp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = temp;
                        }
                    }
                }
            }

            temp = null;
        },

        objectSort(objectArr, prop, order) {
            if ($object.isNullOrUndefined(order) == true) {
                order = true;
            }

            if (order == true) {
                objectArr.sort(
                    function (v1, v2) {
                        var prop1 = v1[prop];
                        var prop2 = v2[prop];

                        if (prop1 < prop2) {
                            return -1;
                        }

                        if (prop1 > prop2) {
                            return 1;
                        }

                        return 0;
                    }
                );
            }
            else {
                objectArr.sort(
                    function (v1, v2) {
                        var prop1 = v1[prop];
                        var prop2 = v2[prop];

                        if (prop1 < prop2) {
                            return 1;
                        }

                        if (prop1 > prop2) {
                            return -1;
                        }

                        return 0;
                    }
                );
            }
        },

        shuffle(arr) {
            var i = arr.length, j;
            var temp = null;
            while (i--) {
                j = Math.floor((i + 1) * Math.random());
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        },

        lastIndexOf(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return i;
                }
            }

            return -1;
        },

        add(arr, val) {
            arr.push(val);
        },

        addAt(arr, index, val) {
            if (arr.length - 1 <= index) {
                arr.splice(index, 0, val);
            }
        },

        remove(arr) {
            arr.pop();
        },

        removeAt(arr, index) {
            if (index <= (arr.length - 1)) {
                arr.splice(index, 1);
            }
        },

        removeID(arr, id, val) {
            var itemToFind = arr.find(function (item) { return item[id] == val })
            var idx = arr.indexOf(itemToFind)
            if (idx > -1) {
                arr.splice(idx, 1)
            }
        },

        contains(arr, val) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === val) {
                    return true;
                }
            }

            return false;
        },

        addProp(arr, prop, val) {
            arr.push({ 'prop': prop, 'val': val });
        },

        union(sourceArray, targetArray) {
            var result = [];
            var temp = {}
            for (var i = 0; i < sourceArray.length; i++) {
                temp[sourceArray[i]] = 1;
            }

            for (var i = 0; i < targetArray.length; i++) {
                temp[targetArray[i]] = 1;

            }

            for (var k in temp) {
                result.push(k)
            };
            return result;
        },

        difference(sourceArray, targetArray) {
            return sourceArray.filter(function (x) {
                return !targetArray.includes(x);
            });
        },

        intersection(sourceArray, targetArray) {
            return sourceArray.filter(function (x) {
                return targetArray.includes(x);
            });
        },

        symmetryDifference(sourceArray, targetArray) {
            return sourceArray.filter(function (x) {
                return !targetArray.includes(x);
            }).concat(targetArray.filter(function (x) {
                return !sourceArray.includes(x);
            }));
        },

        getValue(items, parameterName, defaultValue, parameterProperty, valueProperty) {
            var result = null;

            if (items && items.length > 0) {
                var parseParameter = null;
                if (parameterProperty) {
                    parseParameter = items.find(function (item) { return item[parameterProperty] == parameterName; });
                }
                else {
                    parseParameter = items.find(function (item) { return item.ParameterName == parameterName; });
                }

                if (parseParameter) {
                    if (valueProperty) {
                        result = parseParameter[valueProperty];
                    }
                    else {
                        result = parseParameter.Value;
                    }
                }
                else {
                    if (defaultValue === undefined) {
                        result = '';
                    }
                    else {
                        result = defaultValue;
                    }
                }
            }

            return result;
        },

        // var value = [79, 5, 18, 5, 32, 1, 16, 1, 82, 13];
        ranks(value, asc) {
            var result = [];
            if ($object.isNullOrUndefined(value) == false && $ref.isArray(value) == true) {
                if ($object.isNullOrUndefined(asc) == true) {
                    asc = false;
                }
                else {
                    asc = $string.toBoolean(asc);
                }

                if (asc == true) {
                    for (var i = 0; i < value.length; i++) {
                        value[i] = - + value[i];
                    }
                }

                var sorted = value.slice().sort(function (a, b) {
                    return b - a;
                });
                result = value.map(function (v) {
                    return sorted.indexOf(v) + 1;
                });
            }

            return result;
        }
    });
    context.$array = $array;

    $number.extend({
        version: '1.0',

        duration(ms) {
            if (ms < 0) ms = -ms;
            var time = {
                year: 0,
                week: 0,
                day: Math.floor(ms / 86400000),
                hour: Math.floor(ms / 3600000) % 24,
                minute: Math.floor(ms / 60000) % 60,
                second: Math.floor(ms / 1000) % 60,
                millisecond: Math.floor(ms) % 1000
            };

            if (time.day > 365) {
                time.year = time.day % 365;
                time.day = Math.floor(time.day / 365);
            }

            if (time.day > 7) {
                time.week = time.day % 7;
                time.day = Math.floor(time.day / 7);
            }

            return time;
        },

        // $number.toByte(123456789, 3, false);
        toByte(num, precision, addSpace) {
            if (precision === void 0) {
                precision = 3;
            }

            if (addSpace === void 0) {
                addSpace = true;
            }

            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            if (Math.abs(num) < 1) return num + (addSpace ? ' ' : '') + units[0];
            var exponent = Math.min(Math.floor(Math.log10(num < 0 ? -num : num) / 3), units.length - 1);
            var n = Number(((num < 0 ? -num : num) / Math.pow(1024, exponent)).toPrecision(precision));
            return (num < 0 ? '-' : '') + n + (addSpace ? ' ' : '') + units[exponent];
        },

        isRange(num, low, high) {
            return num >= low && num <= high;
        },

        limit(num, low, high) {
            return num < low ? low : (num > high ? high : num);
        },

        limitAbove(num, high) {
            return Math.min(high, num);
        },

        limitBelow(num, low) {
            return Math.max(low, this);
        },

        mod(num, val) {
            return num >= 0 ? num % val : (num % val + Math.abs(val)) % val;
        },

        // 10.9.percent(100.5); // 10
        // 10.9.percent(100.5, 1); // 10.9
        percent(num, val, precision) {
            var precision = precision || 0;
            var result = Math.pow(10, precision);

            return Math.round((num * 100 / val) * result) / result;
        },

        random(start, end) {
            if ($string.isNullOrEmpty(start) == true) {
                start = 0;
            }

            if ($string.isNullOrEmpty(end) == true) {
                end = 10;
            }

            return Math.floor((Math.random() * (end - start + 1)) + start);
        }
    });
    context.$number = $number;

    $object.extend({
        version: '1.0',

        isNullOrUndefined(val) {
            if (val === undefined || val === null) {
                return true;
            }
            else {
                return false;
            }
        },

        // toCSV([{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }], ['a', 'b'], ';');
        toCSV(obj, opt) {
            if (typeof obj !== 'object') return null;
            opt = opt || {};
            var scopechar = opt.scopechar || '/';
            var delimeter = opt.delimeter || ',';
            var newline = opt.newline || '\n';
            if (Array.isArray(obj) === false) obj = [obj];
            var curs, name, i, key, queue, values = [], rows = [], headers = {}, headersArr = [];
            for (i = 0; i < obj.length; i++) {
                queue = [obj[i], ''];
                rows[i] = {};
                while (queue.length > 0) {
                    name = queue.pop();
                    curs = queue.pop();
                    if (curs !== null && typeof curs === 'object') {
                        for (key in curs) {
                            if (curs.hasOwnProperty(key)) {
                                queue.push(curs[key]);
                                queue.push(name + (name ? scopechar : '') + key);
                            }
                        }
                    } else {
                        if (headers[name] === undefined) headers[name] = true;
                        rows[i][name] = curs;
                    }
                }
                values[i] = [];
            }

            for (key in headers) {
                if (headers.hasOwnProperty(key)) {
                    headersArr.push(key);
                    for (i = 0; i < obj.length; i++) {
                        values[i].push(rows[i][key] === undefined
                            ? ''
                            : rows[i][key]);
                    }
                }
            }
            for (i = 0; i < obj.length; i++) {
                values[i] = values[i].join(delimeter);
            }
            return headersArr.join(delimeter) + newline + values.join(newline);
        },

        toParameterString(jsonObject) {
            return jsonObject ? Object.entries(jsonObject).reduce(function (queryString, _ref, index) {
                var key = _ref[0],
                    val = _ref[1];
                if (key.indexOf('@') == -1) {
                    queryString += typeof val === 'string' ? '@' + key + ":" + val + ';' : '';
                }
                return queryString;
            }, '') : '';
        }
    });
    context.$object = $object;
})(globalRoot);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $library = context.$library || new syn.module();
    var document = null;
    if (globalRoot.devicePlatform === 'node') {
    }
    else {
        document = context.document;

        (function () {
            if (typeof context.CustomEvent !== 'function') {
                var CustomEvent = function (event, params) {
                    params = params || { bubbles: false, cancelable: false, detail: undefined };
                    var evt = document.createEvent('CustomEvent');
                    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                    return evt;
                }

                CustomEvent.prototype = context.Event.prototype;
                context.CustomEvent = CustomEvent;
            }

            context['events'] = function () {
                var items = [];

                return {
                    items: items,
                    add(el, eventName, handler) {
                        items.push(arguments);
                    },
                    remove(el, eventName, handler) {
                        var i = items.indexOf(arguments);
                        if (i > -1) {
                            delete items[i];
                        }
                    },
                    flush() {
                        var i, item;
                        for (i = items.length - 1; i >= 0; i = i - 1) {
                            item = items[i];
                            if (item[0].removeEventListener) {
                                item[0].removeEventListener(item[1], item[2], item[3]);
                            }
                            if (item[1].substring(0, 2) != 'on') {
                                item[1] = 'on' + item[1];
                            }
                            if (item[0].detachEvent) {
                                item[0].detachEvent(item[1], item[2]);
                            }
                            item[0][item[1]] = null;
                        }

                        syn.$w.purge(document.body);
                    }
                }
            }();
        })();
    }

    $library.extend({
        version: '1.0',
        prefixs: ['webkit', 'moz', 'ms', 'o', ''],

        eventMap: {
            // 'mousedown': 'touchstart',
            // 'mouseup': 'touchend',
            // 'mousemove': 'touchmove'
        },

        // syn.$l.guid();
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        // syn.$l.uuid();
        uuid() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
                return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
            });
        },

        stringToArrayBuffer(value, isTwoByte) {
            var bufferCount = 1;
            if (isTwoByte && isTwoByte === true) {
                bufferCount = 2;
            }

            var result = new ArrayBuffer(value.length * bufferCount);
            var bufView = new Uint8Array(result);
            for (var i = 0, strLen = value.length; i < strLen; i++) {
                bufView[i] = value.charCodeAt(i);
            }
            return result;
        },

        arrayBufferToString(buffer) {
            var arrayBuffer = new Uint8Array(buffer);
            var s = String.fromCharCode.apply(null, arrayBuffer);
            return decodeURIComponent(s);
        },

        random(len) {
            var len = len || 8;
            var val = '';

            while (val.length < len) {
                val += Math.random().toString(36).substr(2);
            }

            return val.substr(0, len);
        },

        execPrefixFunc(el, func) {
            var prefixs = syn.$l.prefixs;
            var i = 0, m, t;
            while (i < prefixs.length && !el[m]) {
                m = func;
                if (prefixs[i] == '') {
                    m = m.substr(0, 1).toLowerCase() + m.substr(1);
                }
                m = prefixs[i] + m;
                t = typeof el[m];
                if (t != 'undefined') {
                    prefixs = [prefixs[i]];
                    return (t == 'function' ? el[m]() : el[m]);
                }
                i++;
            }
        },

        dispatchClick(el, options) {
            try {
                el = $ref.isString(el) == true ? syn.$l.get(el) : el;
                options = syn.$w.argumentsExtend({
                    canBubble: true,
                    cancelable: true,
                    view: context,
                    detail: 0,
                    screenX: 0,
                    screenY: 0,
                    clientX: 80,
                    clientY: 20,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    button: 0,
                    relatedTarget: null
                }, options);

                var evt = document.createEvent('MouseEvents');

                // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
                evt.initMouseEvent('click', options.canBubble, options.cancelable, options.view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, options.relatedTarget);
                el.dispatchEvent(evt);
            } catch (error) {
                syn.$l.eventLog('$l.dispatchClick', error, 'Warning');
            }
        },

        // http://www.w3schools.com/html5/html5_ref_eventattributes.asp
        addEvent(el, type, func) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;

            if (func && $ref.isFunction(func) == true) {
                if (el.addEventListener) {
                    el.addEventListener(type, func, false);
                }
                else if (el.attachEvent) {
                    el.attachEvent('on' + type, func);
                }
                else {
                    el['on' + type] = el['e' + type + func];
                }

                events.add(el, type, func);

                if ($ref.isString(type) == true && type.toLowerCase() === 'resize') {
                    func();
                }
            }
        },

        addLive(target, type, fn) {
            $library.addEvent(context || document, type, function (e) {
                var found, el = e.target || e.srcElement;
                while (el && !(found = el.id == target.id)) {
                    el = el.parentElement;
                }

                if (found) {
                    fn.call(el, e);
                }
            });

            return target;
        },

        removeEvent(el, type, func) {
            if (func && $ref.isFunction(func) == true) {
                el = $ref.isString(el) == true ? syn.$l.get(el) : el;
                if (el.removeEventListener) {
                    el.removeEventListener(type, func, false);
                }
                else if (el.detachEvent) {
                    el.detachEvent('on' + type, func);
                }
                else {
                    el['on' + type] = null;
                }

                events.remove(el, type, func);
            }
        },

        hasEvent(el, type) {
            var item = null;
            var result = false;
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            for (var i = 0, len = events.items.length; i < len; i++) {
                item = events.items[i];

                if (item && item[0] instanceof context.constructor || item[0] instanceof document.constructor) {
                    if (item[1] == type) {
                        result = true;
                        break;
                    }
                }
                else {
                    if (item && item[0].id) {
                        if (item[0].id == el.id && item[1] == type) {
                            result = true;
                            break;
                        }
                    }
                }
            }

            return result;
        },

        trigger(el, type, value) {
            var item = null;
            var action = null;
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;

            for (var i = 0, len = events.items.length; i < len; i++) {
                item = events.items[i];

                if (item[0] instanceof context.constructor || item[0] instanceof document.constructor) {
                    if (item[1] == type) {
                        action = item[2];
                        break;
                    }
                }
                else {
                    if (item[0].id) {
                        if (item[0].id == el.id && item[1] == type) {
                            action = item[2];
                            break;
                        }
                    }
                }
            }

            if (action) {
                if (value) {
                    action.call(el, value);
                }
                else {
                    action.call(el);
                }
            }

            return this;
        },

        triggerEvent(el, type, customData) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;

            if (context.CustomEvent) {
                if (customData) {
                    el.dispatchEvent(new CustomEvent(type, { detail: customData }));
                }
                else {
                    el.dispatchEvent(new CustomEvent(type));
                }
            }
            else if (document.createEvent) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(type, false, true);

                if (customData) {
                    el.dispatchEvent(evt, customData);
                }
                else {
                    el.dispatchEvent(evt);
                }
            }
            else if (el.fireEvent) {
                var evt = document.createEventObject();
                evt.eventType = type;
                if (customData) {
                    el.fireEvent('on' + evt.eventType, customData);
                }
                else {
                    el.fireEvent('on' + evt.eventType);
                }
            }

            return el;
        },

        addBind(query, type, func) {
            if (func && $ref.isFunction(func) == true) {
                var items = document.querySelectorAll(query);
                var length = items.length;
                for (var i = 0; i < length; i++) {
                    var el = items[i];
                    syn.$l.addEvent(el, type, func);
                }
            }
        },

        // <summary>
        // pub/sub 이벤트 허브를 제공하는 객체를 생성합니다
        // </summary>
        // var hub = syn.$l.createEventHub();
        // hub.on('message', function () {
        //     return console.log('Message event fired' + arguments[0].data);
        // });
        // hub.emit('message', {data: 'helloworld'});
        createEventHub() {
            return {
                hub: Object.create(null),
                emit: function emit(event, data) {
                    (this.hub[event] || []).forEach(function (handler) {
                        return handler(data);
                    });
                },
                on: function on(event, handler) {
                    if (!this.hub[event]) this.hub[event] = [];
                    this.hub[event].push(handler);
                },
                off: function off(event, handler) {
                    var i = (this.hub[event] || []).findIndex(function (h) {
                        return h === handler;
                    });
                    if (i > -1) this.hub[event].splice(i, 1);
                    if (this.hub[event].length === 0) delete this.hub[event];
                }
            };
        },

        get() {
            var result = [];
            var find = null;
            var eid = '';

            for (var i = 0, len = arguments.length; i < len; i++) {
                eid = arguments[i];

                if ($ref.isString(eid) == true) {
                    find = document.getElementById(eid);
                }

                result.push(find);
            }

            if (result.length == 1) {
                return find;
            }
            else {
                return result;
            }
        },

        querySelector() {
            var result = [];
            var find = null;
            var query = '';

            for (var i = 0, len = arguments.length; i < len; i++) {
                query = arguments[i];

                if (typeof query == 'string') {
                    find = document.querySelector(query);
                }

                result.push(find);
            }

            if (result.length == 1) {
                return find;
            }
            else {
                return result;
            }
        },

        getName() {
            var result = [];
            var els = [];
            var tag = '';

            for (var i = 0, len = arguments.length; i < len; i++) {
                tag = arguments[i];

                if (typeof tag == 'string') {
                    els = document.getElementsByTagName(tag);
                }

                for (var find in els) {
                    if (typeof els[find] == 'object') {
                        result.push(els[find]);
                    }
                }
            }

            if (result.length == 1) {
                return els;
            }
            else {
                return result;
            }
        },

        querySelectorAll() {
            var result = [];
            var els = [];
            var query = '';

            for (var i = 0, len = arguments.length; i < len; i++) {
                query = arguments[i];

                if (typeof query == 'string') {
                    els = document.querySelectorAll(query);
                }

                for (var find in els) {
                    if (typeof els[find] == 'object') {
                        result.push(els[find]);
                    }
                }
            }

            query = null;

            if (result.length == 1) {
                return els;
            }
            else {
                return result;
            }
        },

        getElementsById() {
            var result = [];
            var find = null;
            var el = '';

            for (var i = 0; i < arguments.length; i++) {
                el = arguments[i];

                if (typeof el == 'string') {
                    find = document.getElementById(el);
                }

                if (arguments.length == 1) {
                    return find;
                }

                result.push(find);
            }

            return result;
        },

        getElementsByClassName() {
            var result = [];
            var find = null;
            var el = '';

            for (var i = 0; i < arguments.length; i++) {
                el = arguments[i];

                if (typeof el == 'string') {
                    find = document.getElementsByClassName(el);
                }

                if (arguments.length == 1) {
                    return find;
                }

                for (var i = 0; i < find.length; i++) {
                    result.push(find[i]);
                }
            }

            return result;
        },

        getElementsByTagName() {
            var result = [];
            var elements = [];
            var el = '';

            for (var i = 0; i < arguments.length; i++) {
                el = arguments[i];

                if (typeof el == 'string') {
                    elements = document.getElementsByTagName(el);
                }

                if (arguments.length == 1) {
                    return elements;
                }

                for (var find in elements) {
                    if (typeof elements[find] == 'object') {
                        result.push(elements[find]);
                    }
                }
            }
            return result;
        },

        clone(target) {
            function T() { }
            T.prototype = target;
            return new T;
        },

        method(target, id, fn) {
            target.prototype[id] = fn;
            return this;
        },

        toEnumText(enumObject, value) {
            var text = null;
            for (var k in enumObject) {
                if (enumObject[k] == value) {
                    text = k;
                    break;
                }
            }
            return text;
        },

        prettyJSON(json, isHtml) {
            if (isHtml === true) {
                if (typeof json != 'string') {
                    json = JSON.stringify(json, undefined, 2);
                }
                json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    var cls = 'number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'key';
                        } else {
                            cls = 'string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'boolean';
                    } else if (/null/.test(match)) {
                        cls = 'null';
                    }
                    return '<span class="' + cls + '">' + match + '</span>';
                });
            }
            else {
                return JSON.stringify(json, null, 2);
            }
        },

        prettyTSD(tsd, isString) {
            var result = null;
            isString = isString == undefined ? false : isString;
            try {
                var Value = tsd.split('＾');
                if (Value.length > 1) {
                    var meta = $string.toParameterObject(Value[0]);
                    result = $string.toJson(Value[1], { delimeter: '｜', newline: '↵', meta: meta });
                }
                else {
                    result = $string.toJson(Value[0], { delimeter: '｜', newline: '↵' });
                }
            } catch (error) {
                result = error;
            }

            return isString == true ? result : syn.$l.prettyJSON(result);
        },

        // syn.$l.text2Json('AAA,BBB,CCC\n111,222,333\n444,555,666');
        text2Json(data, delimiter, newLine) {
            if (delimiter == undefined) {
                delimiter = ',';
            }

            if (newLine == undefined) {
                newLine = '\n';
            }

            var titles = data.slice(0, data.indexOf(newLine)).split(delimiter);
            return data
                .slice(data.indexOf(newLine) + 1)
                .split(newLine)
                .map(function (v) {
                    var values = v.split(delimiter);
                    return titles.reduce(function (obj, title, index) {
                        return (obj[title] = values[index]), obj;
                    }, {});
                });
        },

        // syn.$l.json2Text(syn.$l.text2Json('AAA,BBB,CCC\n111,222,333\n444,555,666'), ['AAA','BBB','CCC']);
        json2Text(arr, columns, delimiter, newLine) {
            function _toConsumableArray(arr) {
                return (
                    _arrayWithoutHoles(arr) ||
                    _iterableToArray(arr) ||
                    _unsupportedIterableToArray(arr) ||
                    _nonIterableSpread()
                );
            }

            function _nonIterableSpread() {
                throw new TypeError('유효하지 않은 데이터 타입');
            }

            function _unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === 'Object' && o.constructor) n = o.constructor.name;
                if (n === 'Map' || n === 'Set') return Array.from(o);
                if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                    return _arrayLikeToArray(o, minLen);
            }

            function _iterableToArray(iter) {
                if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter))
                    return Array.from(iter);
            }

            function _arrayWithoutHoles(arr) {
                if (Array.isArray(arr)) return _arrayLikeToArray(arr);
            }

            function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            }

            if (delimiter == delimiter) {
                delimiter = ',';
            }

            if (newLine == undefined) {
                newLine = '\n';
            }

            return [columns.join(delimiter)]
                .concat(
                    _toConsumableArray(
                        arr.map(function (obj) {
                            return columns.reduce(function (acc, key) {
                                return ''
                                    .concat(acc)
                                    .concat(!acc.length ? '' : delimiter, '"')
                                    .concat(!obj[key] ? '' : obj[key], '"');
                            }, '');
                        })
                    )
                )
                .join(newLine);
        },

        nested2Flat(data, itemID, parentItemID, childrenID) {
            var result = [];

            if (data) {
                if ($object.isNullOrUndefined(childrenID) == true) {
                    childrenID = 'items';
                }

                var root = $ref.clone(data, false);
                delete root[childrenID];
                root[parentItemID] = null;
                result.push(root);

                syn.$l.parseNested2Flat(data, result, itemID, parentItemID, childrenID);
            }
            else {
                syn.$l.eventLog('$l.nested2Flat', '필수 데이터 확인 필요', 'Warning');
            }

            return result;
        },

        parseNested2Flat(data, newData, itemID, parentItemID, childrenID) {
            var result = null;

            if ($object.isNullOrUndefined(childrenID) == true) {
                childrenID = 'items';
            }

            var items = data[childrenID];
            if (data && items) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    var cloneItem = $ref.clone(item, false);
                    delete cloneItem[childrenID];
                    cloneItem[parentItemID] = data[itemID];

                    newData.push(cloneItem);

                    if (item[childrenID] && item[childrenID].length > 0) {
                        syn.$l.parseNested2Flat(item, newData, itemID, parentItemID, childrenID);
                    }
                }
            }

            return result;
        },

        flat2Nested(data, itemID, parentItemID, childrenID) {
            var result = null;

            if (data && itemID && parentItemID) {
                if ($object.isNullOrUndefined(childrenID) == true) {
                    childrenID = 'items';
                }

                var root = data.find(function (item) { return item[parentItemID] == null });
                var json = syn.$l.parseFlat2Nested(data, root, [], itemID, parentItemID, childrenID);
                root[childrenID] = json[childrenID];
                result = root;
            }
            else {
                syn.$l.eventLog('$l.flat2Nested', '필수 데이터 확인 필요', 'Warning');
            }

            return result;
        },

        parseFlat2Nested(data, root, newData, itemID, parentItemID, childrenID) {
            if ($object.isNullOrUndefined(childrenID) == true) {
                childrenID = 'items';
            }

            var child = data.filter(function (item) { return item[parentItemID] == root[itemID] });
            if (child.length > 0) {
                if (!newData[childrenID]) {
                    newData[childrenID] = [];
                }
                for (var i = 0; i < child.length; i++) {
                    newData[childrenID].push($ref.clone(child[i]));
                    syn.$l.parseFlat2Nested(data, child[i], newData[childrenID][i], itemID, parentItemID, childrenID);
                }
            }
            return newData;
        },

        findNestedByID(data, findID, itemID, childrenID) {
            var result = null;

            if ($object.isNullOrUndefined(childrenID) == true) {
                childrenID = 'items';
            }

            var items = data[childrenID];
            if (data && items) {
                if (data[itemID] == findID) {
                    result = data;

                    return result;
                }

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    if (item[itemID] == findID) {
                        result = item;

                        return result;
                    }
                    else if (item[childrenID] && item[childrenID].length > 0) {
                        result = syn.$l.findNestedByID(item, findID, itemID, childrenID);

                        if (result) {
                            return result;
                        }
                    }
                }
            }

            return result;
        },

        extend(toObject, fromObject) {
            if (arguments[2]) {
                for (var i = 2, len = arguments.length; i < len; i++) {
                    toObject.prototype[arguments[i]] = fromObject.prototype[arguments[i]];
                }
            }
            else {
                for (var fn in fromObject.prototype) {
                    if (!toObject.prototype[fn]) {
                        toObject.prototype[fn] = fromObject.prototype[fn];
                    }
                }
            }
            return this;
        },

        logLevel: new function () {
            this.Verbose = 0;
            this.Debug = 1;
            this.Information = 2;
            this.Warning = 3;
            this.Error = 4;
            this.Fatal = 5;
        },

        start: (new Date()).getTime(),
        eventLogTimer: null,
        eventLogCount: 0,
        eventLog(event, data, logLevel) {
            var message = typeof data == 'object' ? data.message : data;
            var stack = typeof data == 'object' ? data.stack : data;
            if (logLevel) {
                if ($ref.isString(logLevel) == true) {
                    logLevel = syn.$l.logLevel[logLevel];
                }
            }
            else {
                logLevel = 0;
            }

            if (syn.Config && syn.Config.UIEventLogLevel) {
                if (syn.$l.logLevel[syn.Config.UIEventLogLevel] > logLevel) {
                    return;
                }
            }

            var logLevelText = syn.$l.toEnumText(syn.$l.logLevel, logLevel);
            var now = (new Date()).getTime(),
                diff = now - syn.$l.start,
                value, div, text;

            if (globalRoot.devicePlatform === 'node') {
                value = syn.$l.eventLogCount.toString() +
                    '@' + (diff / 1000).toString().format('0.000') +
                    ' [' + event + '] ' + (message === stack ? message : stack);

                switch (logLevelText) {
                    case 'Debug':
                        globalRoot.$logger.debug(value);
                        break;
                    case 'Information':
                        globalRoot.$logger.info(value);
                        break;
                    case 'Warning':
                        globalRoot.$logger.warn(value);
                        break;
                    case 'Error':
                        globalRoot.$logger.error(value);
                        break;
                    case 'Fatal':
                        globalRoot.$logger.fatal(value);
                        break;
                    default:
                        globalRoot.$logger.trace(value);
                        break;
                }
            }
            else {
                value = syn.$l.eventLogCount.toString() +
                    '@' + (diff / 1000).toString().format('0.000') +
                    ' [' + logLevelText + '] ' +
                    '[' + event + '] ' + (message === stack ? message : stack);

                if (context.console) {
                    console.log(value);
                }
                else {
                    div = document.createElement('DIV');
                    text = document.createTextNode(value);

                    div.appendChild(text);

                    var eventlogs = document.getElementById('eventlogs');
                    if (eventlogs) {
                        eventlogs.appendChild(div);

                        clearTimeout(syn.$l.eventLogTimer);
                        syn.$l.eventLogTimer = setTimeout(function () {
                            eventlogs.scrollTop = eventlogs.scrollHeight;
                        }, 10);
                    }
                    else {
                        document.body.appendChild(div);
                    }
                }

                if (context.bound) {
                    bound.browserEvent('browser', {
                        ID: 'EventLog',
                        Data: value
                    }, function (error, json) {
                        if (error) {
                            console.log('browser EventLog - {0}'.format(error));
                        }
                    });
                }
            }

            syn.$l.eventLogCount++;
        },

        moduleEventLog(moduleID, event, data, logLevel) {
            var message = typeof data == 'object' ? data.message : data;
            var stack = typeof data == 'object' ? data.stack : data;
            if (logLevel) {
                if ($ref.isString(logLevel) == true) {
                    logLevel = syn.$l.logLevel[logLevel];
                }
            }
            else {
                logLevel = 0;
            }

            if (syn.Config && syn.Config.UIEventLogLevel) {
                if (syn.$l.logLevel[syn.Config.UIEventLogLevel] > logLevel) {
                    return;
                }
            }

            var logLevelText = syn.$l.toEnumText(syn.$l.logLevel, logLevel);
            var now = (new Date()).getTime(),
                diff = now - syn.$l.start,
                value;

            value = syn.$l.eventLogCount.toString() +
                '@' + (diff / 1000).toString().format('0.000') +
                ' [' + event + '] ' + (message === stack ? message : stack);

            var moduleLibrary = syn.getModuleLibrary(moduleID);
            if (moduleLibrary) {
                var logger = moduleLibrary.logger;
                switch (logLevelText) {
                    case 'Debug':
                        logger.debug(value);
                        break;
                    case 'Information':
                        logger.info(value);
                        break;
                    case 'Warning':
                        logger.warn(value);
                        break;
                    case 'Error':
                        logger.error(value);
                        break;
                    case 'Fatal':
                        logger.fatal(value);
                        break;
                    default:
                        logger.trace(value);
                        break;
                }
            }
            else {
                console.log('ModuleID 확인 필요 - {0}'.format(moduleID));
            }

            syn.$l.eventLogCount++;
        }
    });

    syn.$l = $library;
    if (globalRoot.devicePlatform === 'node') {
        delete syn.$l.addEvent;
        delete syn.$l.addLive;
        delete syn.$l.removeEvent;
        delete syn.$l.hasEvent;
        delete syn.$l.trigger;
        delete syn.$l.triggerEvent;
        delete syn.$l.addBind;
        delete syn.$l.get;
        delete syn.$l.querySelector;
        delete syn.$l.getName;
        delete syn.$l.querySelectorAll;
        delete syn.$l.getElementsById;
        delete syn.$l.getElementsByClassName;
        delete syn.$l.getElementsByTagName;
    }
    else {
        delete syn.$l.moduleEventLog;

        context.onevent = syn.$l.addEvent;
        context.bind = syn.$l.addBind;
        context.trigger = syn.$l.trigger;
        /*
        context.$traversing = context.$t = syn.$t = context.$traversing || $traversing;
        context.get = $traversing.get;
        context.querySelector = $traversing.querySelector;
        context.getName = $traversing.getName;
        context.querySelectorAll = $traversing.querySelectorAll;
        */

        syn.$l.addEvent(context, 'unload', events.flush);

        /*
        function orientation_changed ()
        {
            if ( is_portrait() )
            {
                //do something
            }
            else if ( is_landscape() )
            {
                // do something else
            }
            clearTimeout(context.t);
            delete context.t;
        }

        context.t = undefined;
        context.onorientationchange = function (event)
        {
            context.t = setTimeout('orientation_changed();', 250);
        }

        function is_landscape()
        {
            var uagent = navigator.userAgent.toLowerCase();
            if ( uagent.search('ipad') > -1 )
            {
                var r = ( context.orientation == 90 || context.orientation == -90 );
            }
            else
            {
                var r = ( screen.width > screen.height );
            }
            return r;
        }

        function is_portrait()
        {
            var uagent = navigator.userAgent.toLowerCase();
            if ( uagent.search('ipad') > -1 )
            {
                var r = ( context.orientation == 0 || context.orientation == 180 );
            }
            else
            {
                var r = ( screen.width < screen.height );
            }
            return r;
        }
        */
    }
})(globalRoot);

/// <reference path='syn.library.js' />
/// <reference path='syn.browser.js' />

(function (context) {
    'use strict';
    var $request = context.$request || new syn.module();
    var document = null;
    if (globalRoot.devicePlatform === 'node') {
    }
    else {
        document = context.document;
    }

    $request.extend({
        version: '1.0',
        params: [],
        path: (globalRoot.devicePlatform === 'node') ? '' : location.pathname,

        // syn.$r.params['p1'] = '1';
        // syn.$r.params['p2'] = '2';
        // syn.$r.params['p3'] = '3';
        // alert(syn.$r.query('p2')); // 2
        query(param, url) {
            if (url === undefined) {
                url = location.href;
            }

            return function (url) {
                var url = url.split('?');
                var query = ((url.length == 1) ? url[0] : url[1]).split('&');
                var keyPair = null;

                for (var i = 0; i < query.length; i++) {
                    keyPair = query[i].split('=');
                    syn.$r.params[keyPair[0]] = keyPair[1];
                }

                url = null;
                query = null;
                keyPair = null;

                return syn.$r.params;
            }(url)[param];
        },

        // syn.$r.toQueryString({ page: '1', size: '2kg', key: undefined })
        toQueryString(jsonObject) {
            return jsonObject ? Object.entries(jsonObject).reduce(function (queryString, _ref, index) {
                var key = _ref[0],
                    val = _ref[1];
                queryString += typeof val === 'string' ? '&' + key + "=" + val : '';
                return queryString;
            }, '') : '';
        },

        // syn.$r.toUrlObject('http://url.com/page?name=Adam&surname=Smith)
        toUrlObject(url) {
            return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function (a, v) {
                return a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a;
            }, {});
        },

        async isCorsEnabled(url) {
            var response = await fetch(url, { method: 'HEAD' });
            var result = (response.status >= 200 && response.status <= 299);
            if (result == false) {
                syn.$l.eventLog('$w.isCorsEnabled', '{0}, {1}:{2}'.format(url, response.status, response.statusText), 'Error');
            }

            return result;
        },

        // var result = await syn.$r.httpRequest('GET', '/index');
        httpRequest(method, url, data, timeout, callback) {
            if ($object.isNullOrUndefined(data) == true) {
                data = {};
            }

            var contentType = 'application/json';
            var formData = null;
            if ($object.isNullOrUndefined(data.body) == false) {
                contentType = null;
                var params = data.body;
                if (method.toUpperCase() == 'GET') {
                    var paramUrl = url + ((url.split('?').length > 1) ? '&' : '?');

                    for (var key in params) {
                        paramUrl += key + '=' + params[key].toString() + '&';
                    }

                    url = encodeURI(paramUrl.substring(0, paramUrl.length - 1));
                }
                else {
                    formData = new FormData();

                    for (var key in params) {
                        formData.append(key, params[key].toString());
                    }
                }
            }

            if ($object.isNullOrUndefined(timeout) == true) {
                timeout = 0;
            }

            var xhr = syn.$w.xmlHttp();
            xhr.timeout = timeout;
            xhr.open(method, url, true);

            if (syn.$w.setServiceClientHeader) {
                if (syn.$w.setServiceClientHeader(xhr) == false) {
                    return;
                }
            }

            if (callback) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200) {
                            if (xhr.status == 0) {
                                syn.$l.eventLog('$r.httpRequest', 'X-Requested transfort error', 'Fatal');
                            }
                            else {
                                syn.$l.eventLog('$r.httpRequest', 'response status - {0}'.format(xhr.statusText) + xhr.responseText, 'Error');
                            }
                            return;
                        }

                        if (callback) {
                            callback({
                                status: xhr.status,
                                response: xhr.responseText
                            });
                        }
                    }
                }

                if (formData == null) {
                    if (data != {}) {
                        xhr.send(JSON.stringify(data));
                    } else {
                        xhr.send();
                    }
                }
                else {
                    xhr.send(formData);
                }
            }
            else if (globalRoot.Promise) {
                return new Promise(function (resolve) {
                    xhr.onload = function () {
                        return resolve({
                            status: xhr.status,
                            response: xhr.responseText
                        });
                    };
                    xhr.onerror = function () {
                        return resolve({
                            status: xhr.status,
                            response: xhr.responseText
                        });
                    };

                    if (contentType != null) {
                        xhr.setRequestHeader('Content-Type', contentType);
                    }

                    if (formData == null) {
                        if (data != {}) {
                            xhr.send(JSON.stringify(data));
                        } else {
                            xhr.send();
                        }
                    }
                    else {
                        xhr.send(formData);
                    }
                });
            }
            else {
                syn.$l.eventLog('$w.httpRequest', '지원하지 않는 기능. 매개변수 확인 필요', 'Error');
            }
        },

        // syn.$r.httpSubmit('frmMain', '/index');
        httpSubmit(formID, url, method) {
            if ($object.isNullOrUndefined(formID) == true) {
                return false;
            }

            var form = syn.$l.get(formID);
            if (form) {
                form.method = $object.isNullOrUndefined(method) == true ? 'POST' : method;
                form.action = url;
                form.submit();
            }
            else {
                return false;
            }
        },

        // var formData = new FormData();
        // formData.append('test1', 'aaaa');
        // var result = await syn.$r.httpDataSubmit(formData, '/index');
        // console.log('status:', result.status)
        // console.log('response:', result.response)
        httpDataSubmit(formData, url, timeout, callback) {
            if ($object.isNullOrUndefined(timeout) == true) {
                timeout = 0;
            }

            var xhr = syn.$w.xmlHttp();
            xhr.open('POST', url, true);

            if (syn.$w.setServiceClientHeader) {
                if (syn.$w.setServiceClientHeader(xhr) == false) {
                    return;
                }
            }

            xhr.timeout = timeout;

            if (callback) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200) {
                            if (xhr.status == 0) {
                                syn.$l.eventLog('$r.httpDataSubmit', 'X-Requested transfort error', 'Error');
                            }
                            else {
                                syn.$l.eventLog('$r.httpDataSubmit', 'response status - {0}'.format(xhr.statusText) + xhr.responseText, 'Error');
                            }
                            return;
                        }

                        if (callback) {
                            callback({
                                status: xhr.status,
                                response: xhr.responseText
                            });
                        }
                    }
                }
                xhr.send(formData);
            }
            else if (globalRoot.Promise) {
                return new Promise(function (resolve) {
                    xhr.onload = function () {
                        return resolve({
                            status: xhr.status,
                            response: xhr.responseText
                        });
                    };
                    xhr.onerror = function () {
                        return resolve({
                            status: xhr.status,
                            response: xhr.responseText
                        });
                    };

                    xhr.send(formData);
                });
            }
            else {
                syn.$l.eventLog('$r.httpDataSubmit', '지원하지 않는 기능. 매개변수 확인 필요', 'Error');
            }
        },

        createBlobUrl: (globalRoot.URL && URL.createObjectURL && URL.createObjectURL.bind(URL)) || (globalRoot.webkitURL && webkitURL.createObjectURL && webkitURL.createObjectURL.bind(webkitURL)) || globalRoot.createObjectURL,
        revokeBlobUrl: (globalRoot.URL && URL.revokeObjectURL && URL.revokeObjectURL.bind(URL)) || (globalRoot.webkitURL && webkitURL.revokeObjectURL && webkitURL.revokeObjectURL.bind(webkitURL)) || globalRoot.revokeObjectURL,

        blobToDataUri(blob, callback) {
            if ($object.isNullOrUndefined(callback) == true) {
                syn.$l.eventLog('$r.blobToDataUri', 'blob 결과 callback 확인 필요', 'Warning');
                return;
            }

            var reader = new FileReader();
            reader.onloadend = function () {
                var base64data = reader.result;
                callback(base64data);
            }
            reader.onerror = function () {
                syn.$l.eventLog('$r.blobToDataUri', reader.error, 'Error');
                reader.abort();
            }
            reader.readAsDataURL(blob);
        },

        blobToDownload(blob, fileName) {
            if (context.navigator && context.navigator.msSaveOrOpenBlob) {
                context.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                var blobUrl = syn.$r.createBlobUrl(blob);
                var link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName;

                syn.$l.dispatchClick(link);

                setTimeout(function () {
                    syn.$r.revokeBlobUrl(blobUrl);
                    if (link.remove) {
                        link.remove();
                    }
                }, 100);
            }
        },

        blobUrlToData(url, callback) {
            if ($object.isNullOrUndefined(callback) == true) {
                syn.$l.eventLog('$r.blobUrlToData', 'blob 결과 callback 확인 필요', 'Warning');
                return;
            }

            var xhr = syn.$w.xmlHttp();
            xhr.open('GET', url);

            if (syn.$w.setServiceClientHeader) {
                if (syn.$w.setServiceClientHeader(xhr) == false) {
                    return;
                }
            }

            xhr.responseType = 'blob';
            xhr.onload = function () {
                callback(xhr.response);
            }
            xhr.onerror = function () {
                syn.$l.eventLog('$r.blobUrlToData', 'url: {0}, status: {1}'.format(url, xhr.statusText), 'Warning');
            }
            xhr.send();
        },

        blobUrlToDataUri(url, callback) {
            if ($object.isNullOrUndefined(callback) == true) {
                syn.$l.eventLog('$r.blobUrlToDataUri', 'blob 결과 callback 확인 필요', 'Warning');
                return;
            }

            var xhr = syn.$w.xmlHttp();
            xhr.open('GET', url);

            if (syn.$w.setServiceClientHeader) {
                if (syn.$w.setServiceClientHeader(xhr) == false) {
                    return;
                }
            }

            xhr.responseType = 'blob';
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    var base64data = reader.result;
                    setTimeout(function () {
                        syn.$r.revokeBlobUrl(url);
                    }, 25);
                    callback(null, base64data);
                }
                reader.onerror = function () {
                    syn.$l.eventLog('$r.blobUrlToDataUri', reader.error, 'Error');
                    reader.abort();
                    callback(reader.error.message, null);
                }
                reader.readAsDataURL(xhr.response);
            }
            xhr.onerror = function () {
                syn.$l.eventLog('$r.blobUrlToDataUri', 'url: {0}, status: {1}'.format(url, xhr.statusText), 'Warning');
                callback('url: {0}, status: {1}'.format(url, xhr.statusText), null);
            }
            xhr.send();
        },

        url() {
            var url = syn.$r.path.split('?');
            var param = '';

            param = syn.$r.path + ((syn.$r.path.length > 0 && url.length > 1) ? '&' : '?');

            for (var key in this.params) {
                if (typeof (syn.$r.params[key]) == 'string') {
                    param += key + '=' + syn.$r.params[key] + '&';
                }
            }

            if ($b) {
                if (syn.$b.isIE == true) {
                    param += '&noCache=' + (new Date()).getTime();
                }
            }
            else {
                if (navigator.appName === 'Microsoft Internet Explorer') {
                    param += '&noCache=' + (new Date()).getTime();
                }
            }

            this.params = [];
            return encodeURI(param.substring(0, param.length - 1));
        },

        getCookie(id) {
            var matches = document.cookie.match(
                new RegExp(
                    '(?:^|; )' +
                    id.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
                    '=([^;]*)'
                )
            );
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },

        setCookie(id, val, expires, path, domain, secure) {
            if ($object.isNullOrUndefined(expires) == true) {
                expires = new Date((new Date()).getTime() + (1000 * 60 * 60 * 24));
            }

            if ($object.isNullOrUndefined(path) == true) {
                path = '/';
            }

            document.cookie = id + '=' + encodeURI(val) + ((expires) ? ';expires=' + expires.toGMTString() : '') + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ((secure) ? ';secure' : '');
            return this;
        },

        deleteCookie(id, path, domain) {
            if (syn.$r.getCookie(id)) {
                document.cookie = id + '=' + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
            }
            return this;
        }
    });
    syn.$r = $request;
})(globalRoot);

/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $channel = context.$channel || new syn.module();
    var document = context.document;

    $channel.extend({
        version: "1.0",

        connections: [],
        rooms: (function () {
            var currentTransactionID = Math.floor(Math.random() * 1000001);
            var boundChannels = {};

            function addChannel(channelWindow, origin, scope, handler) {
                function hasWin(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].channelWindow === channelWindow) {
                            return true;
                        }
                    }
                    return false;
                }

                var exists = false;

                if (origin === '*') {
                    for (var k in boundChannels) {
                        if (!boundChannels.hasOwnProperty(k)) {
                            continue;
                        }

                        if (k === '*') {
                            continue;
                        }

                        if (typeof boundChannels[k][scope] === 'object') {
                            exists = hasWin(boundChannels[k][scope]);
                            if (exists) {
                                break;
                            }
                        }
                    }
                } else {
                    if ((boundChannels['*'] && boundChannels['*'][scope])) {
                        exists = hasWin(boundChannels['*'][scope]);
                    }
                    if (!exists && boundChannels[origin] && boundChannels[origin][scope]) {
                        exists = hasWin(boundChannels[origin][scope]);
                    }
                }

                if (exists) {
                    syn.$l.eventLog('$channel.addChannel', 'origin: ' + origin + ', scope: ' + scope + '에 해당하는 채널이 이미 있습니다', 'Warning');
                    return;
                }

                if (typeof boundChannels[origin] != 'object') {
                    boundChannels[origin] = {};
                }

                if (typeof boundChannels[origin][scope] != 'object') {
                    boundChannels[origin][scope] = [];
                }

                boundChannels[origin][scope].push({
                    channelWindow: channelWindow,
                    handler: handler
                });
            }

            function removeChannel(channelWindow, origin, scope) {
                var arr = boundChannels[origin][scope];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].channelWindow === channelWindow) {
                        arr.splice(i, 1);
                    }
                }
                if (boundChannels[origin][scope].length === 0) {
                    delete boundChannels[origin][scope];
                }
            }

            function isArray(obj) {
                if (Array.isArray) {
                    return Array.isArray(obj);
                }
                else {
                    return (obj.constructor.toString().indexOf('Array') != -1);
                }
            }

            var transactionMessages = {};

            var onPostMessage = function (evt) {
                try {
                    if ($string.isNullOrEmpty(evt.data) == true) {
                        return;
                    }

                    var parsedMessage = JSON.parse(evt.data);
                    if (typeof parsedMessage !== 'object' || parsedMessage === null) {
                        syn.$l.eventLog('$channel.onPostMessage', 'postMessage data 확인 필요', 'Warning');
                        return;
                    }
                } catch (error) {
                    return;
                }

                var sourceWindow = evt.source;
                var channelOrigin = evt.origin;
                var channelScope = null;
                var messageID = null;
                var methodName = null;

                if (typeof parsedMessage.method === 'string') {
                    var ar = parsedMessage.method.split('::');
                    if (ar.length == 2) {
                        channelScope = ar[0];
                        methodName = ar[1];
                    } else {
                        methodName = parsedMessage.method;
                    }
                }

                if (typeof parsedMessage.id !== 'undefined') {
                    messageID = parsedMessage.id;
                }

                if (typeof methodName === 'string') {
                    var delivered = false;
                    if (boundChannels[channelOrigin] && boundChannels[channelOrigin][channelScope]) {
                        for (var j = 0; j < boundChannels[channelOrigin][channelScope].length; j++) {
                            if (boundChannels[channelOrigin][channelScope][j].channelWindow === sourceWindow) {
                                boundChannels[channelOrigin][channelScope][j].handler(channelOrigin, methodName, parsedMessage);
                                delivered = true;
                                break;
                            }
                        }
                    }

                    if (!delivered && boundChannels['*'] && boundChannels['*'][channelScope]) {
                        for (var j = 0; j < boundChannels['*'][channelScope].length; j++) {
                            if (boundChannels['*'][channelScope][j].channelWindow === sourceWindow) {
                                boundChannels['*'][channelScope][j].handler(channelOrigin, methodName, parsedMessage);
                                break;
                            }
                        }
                    }
                }
                else if (typeof messageID != 'undefined') {
                    if (transactionMessages[messageID]) {
                        transactionMessages[messageID](channelOrigin, methodName, parsedMessage);
                    }
                }
            };

            if (context.addEventListener) {
                context.addEventListener('message', onPostMessage, false);
            }
            else if (context.attachEvent) {
                context.attachEvent('onmessage', onPostMessage);
            }

            var connectChannel = {
                connect(options) {
                    var channelID = options.scope || syn.$l.random();

                    var channel = $channel.findChannel(channelID);
                    if (channel) {
                        syn.$l.eventLog('$channel.connect', 'channelID: {0} 중복 확인 필요'.format(channelID), 'Warning');
                        return;
                    }

                    var debug = function (message) {
                        if (options.debugOutput) {
                            try {
                                if (typeof message !== 'string') {
                                    message = JSON.stringify(message);
                                }
                            }
                            catch (error) {
                                syn.$l.eventLog('$channel.debug', 'channelID: {0}, message: {1}'.format(channelID, error.message), 'Error');
                            }

                            syn.$l.eventLog('$channel.debug', 'channelID: {0}, message: {1}'.format(channelID, message), 'Information');
                        }
                    };

                    if (typeof options != 'object') {
                        syn.$l.eventLog('$channel.options', '유효한 매개변수 없이 호출된 채널 빌드', 'Error');
                        return;
                    }

                    if (!options.context || !options.context.postMessage) {
                        syn.$l.eventLog('$channel.context', '필수 매개변수 없이 호출된 채널 빌드', 'Error');
                        return;
                    }

                    if (context === options.context) {
                        syn.$l.eventLog('$channel.context', '동일한 화면에서 거래되는 채널 생성은 허용되지 않음', 'Error');
                        return;
                    }

                    if (!options.origin) {
                        options.origin = '*';
                    }

                    var validOrigin = false;
                    if (typeof options.origin === 'string') {
                        var oMatch;
                        if (options.origin === '*') {
                            validOrigin = true;
                        }
                        else if (null !== (oMatch = options.origin.match(/^https?:\/\/(?:[-a-zA-Z0-9_\.])+(?::\d+)?/))) {
                            options.origin = oMatch[0].toLowerCase();
                            validOrigin = true;
                        }
                    }

                    if (!validOrigin) {
                        syn.$l.eventLog('$channel.origin', '유효한 origin 없이 호출된 채널 빌드', 'Error');
                        return;
                    }

                    if (typeof options.scope !== 'undefined') {
                        if (typeof options.scope !== 'string') {
                            syn.$l.eventLog('$channel.scope', 'scope는 문자열이어야 함', 'Error');
                            return;
                        }

                        if (options.scope.split('::').length > 1) {
                            syn.$l.eventLog('$channel.scope', 'scope에는 이중 콜론 ("::")이 포함될 수 없음', 'Error');
                            return;
                        }
                    }

                    var registrationMappingMethods = {};
                    var sendRequests = {};
                    var receivedRequests = {};
                    var ready = false;
                    var pendingQueue = [];

                    var createTransaction = function (id, origin, callbacks) {
                        var shouldDelayReturn = false;
                        var completed = false;

                        return {
                            origin: origin,
                            invoke(callbackName, v) {
                                if (!receivedRequests[id]) {
                                    syn.$l.eventLog('$channel.invoke', '존재하지 않는 트랜잭션의 콜백 호출 시도: ' + id, 'Warning');
                                    return;
                                }

                                var valid = false;
                                for (var i = 0; i < callbacks.length; i++) {
                                    if (callbackName === callbacks[i]) {
                                        valid = true;
                                        break;
                                    }
                                }
                                if (!valid) {
                                    syn.$l.eventLog('$channel.invoke', '존재하지 않는 콜백 호출 시도: ' + callbackName, 'Warning');
                                    return;
                                }

                                postMessage({ id: id, callback: callbackName, params: v });
                            },
                            error(error, message) {
                                completed = true;
                                if (!receivedRequests[id]) {
                                    syn.$l.eventLog('$channel.error', '존재하지 않는 메시지의 호출 시도: ' + id, 'Warning');
                                    return;
                                }

                                delete receivedRequests[id];

                                postMessage({ id: id, error: error, message: message });
                            },
                            complete(v) {
                                completed = true;
                                if (!receivedRequests[id]) {
                                    syn.$l.eventLog('$channel.complete', '존재하지 않는 메시지의 호출 시도: ' + id, 'Warning');
                                    return;
                                }

                                delete receivedRequests[id];
                                postMessage({ id: id, result: v });
                            },
                            delayReturn(delay) {
                                if (typeof delay === 'boolean') {
                                    shouldDelayReturn = (delay === true);
                                }
                                return shouldDelayReturn;
                            },
                            completed() {
                                return completed;
                            }
                        };
                    };

                    var setTransactionTimeout = function (transactionID, timeout, method) {
                        return setTimeout(function () {
                            if (sendRequests[transactionID]) {
                                var message = '"' + method + '" 타임아웃 (' + timeout + 'ms) ';
                                (1, sendRequests[transactionID].error)('timeout_error', message);
                                delete sendRequests[transactionID];
                                delete transactionMessages[transactionID];
                            }
                        }, timeout);
                    };

                    var onMessage = function (origin, method, data) {
                        if (typeof options.gotMessageObserver === 'function') {
                            try {
                                options.gotMessageObserver(origin, data);
                            } catch (error) {
                                debug('gotMessageObserver() 오류: ' + error.toString());
                            }
                        }

                        if (data.id && method) {
                            if (registrationMappingMethods[method]) {
                                var transaction = createTransaction(data.id, origin, data.callbacks ? data.callbacks : []);
                                receivedRequests[data.id] = {};
                                try {
                                    if (data.callbacks && isArray(data.callbacks) && data.callbacks.length > 0) {
                                        for (var i = 0; i < data.callbacks.length; i++) {
                                            var path = data.callbacks[i];
                                            var params = data.params;
                                            var pathItems = path.split('/');
                                            for (var j = 0; j < pathItems.length - 1; j++) {
                                                var cp = pathItems[j];
                                                if (typeof params[cp] !== 'object') {
                                                    params[cp] = {};
                                                }
                                                params = params[cp];
                                            }
                                            params[pathItems[pathItems.length - 1]] = (function () {
                                                var callbackName = path;
                                                return function (data) {
                                                    return transaction.invoke(callbackName, data);
                                                };
                                            })();
                                        }
                                    }
                                    var resp = registrationMappingMethods[method](transaction, data.params);
                                    if (!transaction.delayReturn() && !transaction.completed()) {
                                        transaction.complete(resp);
                                    }
                                } catch (e) {
                                    var error = 'runtime_error';
                                    var message = null;
                                    if (typeof e === 'string') {
                                        message = e;
                                    } else if (typeof e === 'object') {
                                        if (e && isArray(e) && e.length == 2) {
                                            error = e[0];
                                            message = e[1];
                                        }
                                        else if (typeof e.error === 'string') {
                                            error = e.error;
                                            if (!e.message) {
                                                message = '';
                                            }
                                            else if (typeof e.message === 'string') {
                                                message = e.message;
                                            }
                                            else {
                                                e = e.message;
                                            }
                                        }
                                    }

                                    if (message === null) {
                                        try {
                                            message = JSON.stringify(e);
                                            if (typeof (message) == 'undefined') {
                                                message = e.toString();
                                            }
                                        } catch (e2) {
                                            message = e.toString();
                                        }
                                    }

                                    transaction.error(error, message);
                                }
                            }
                        } else if (data.id && data.callback) {
                            if (!sendRequests[data.id] || !sendRequests[data.id].callbacks || !sendRequests[data.id].callbacks[data.callback]) {
                                debug('유효하지 않는 콜백, id:' + data.id + ' (' + data.callback + ')');
                            } else {
                                sendRequests[data.id].callbacks[data.callback](data.params);
                            }
                        } else if (data.id) {
                            if (!sendRequests[data.id]) {
                                debug('유효하지 않는 응답: ' + data.id);
                            } else {
                                if (data.error) {
                                    (1, sendRequests[data.id].error)(data.error, data.message);
                                } else {
                                    if (data.result !== undefined) {
                                        (1, sendRequests[data.id].success)(data.result);
                                    }
                                    else {
                                        (1, sendRequests[data.id].success)();
                                    }
                                }
                                delete sendRequests[data.id];
                                delete transactionMessages[data.id];
                            }
                        } else if (method) {
                            if (registrationMappingMethods[method]) {
                                registrationMappingMethods[method]({ origin: origin }, data.params);
                            }
                        }
                    };

                    addChannel(options.context, options.origin, ((typeof options.scope === 'string') ? options.scope : ''), onMessage);

                    var scopeMethod = function (data) {
                        if (typeof options.scope === 'string' && options.scope.length) data = [options.scope, data].join('::');
                        return data;
                    };

                    var postMessage = function (message, force) {
                        if (!message) {
                            syn.$l.eventLog('$channel.postMessage', 'null 메시지로 postMessage 호출', 'Error');
                            return;
                        }

                        var verb = (ready ? 'post ' : 'queue ');
                        debug(verb + ' message: ' + JSON.stringify(message));
                        if (!force && !ready) {
                            pendingQueue.push(message);
                        } else {
                            if (typeof options.postMessageObserver === 'function') {
                                try {
                                    options.postMessageObserver(options.origin, message);
                                } catch (e) {
                                    debug('postMessageObserver() 확인 필요: ' + e.toString());
                                }
                            }

                            options.context.postMessage(JSON.stringify(message), options.origin);
                        }
                    };

                    var onReady = function (transaction, type) {
                        debug('ready message received');
                        if (ready) {
                            syn.$l.eventLog('$channel.onReady', 'ready 메시지 확인 필요', 'Warning');
                            return;
                        }

                        if (type === 'T') {
                            channelID += '-R';
                        } else {
                            channelID += '-L';
                        }

                        boundMessage.unbind('__ready');
                        ready = true;
                        debug('ready message accepted');

                        if (type === 'T') {
                            boundMessage.notify({ method: '__ready', params: 'A' });
                        }

                        while (pendingQueue.length) {
                            postMessage(pendingQueue.pop());
                        }

                        if (typeof options.onReady === 'function') {
                            options.onReady(boundMessage);
                        }
                    };

                    var boundMessage = {
                        unbind(method) {
                            if (registrationMappingMethods[method]) {
                                if (!(delete registrationMappingMethods[method])) {
                                    syn.$l.eventLog('$channel.unbind', 'registrationMappingMethods 삭제 확인 필요: ' + method, 'Warning');
                                    return;
                                }

                                return true;
                            }
                            return false;
                        },
                        bind(method, callback) {
                            if (!method || typeof method !== 'string') {
                                syn.$l.eventLog('$channel.bind', 'method 매개변수 확인 필요', 'Warning');
                                return;
                            }

                            if (!callback || typeof callback !== 'function') {
                                syn.$l.eventLog('$channel.bind', 'callback 매개변수 확인 필요', 'Warning');
                                return;
                            }

                            if (registrationMappingMethods[method]) {
                                syn.$l.eventLog('$channel.bind', method + ' method 중복 확인 필요', 'Warning');
                                return;
                            }

                            registrationMappingMethods[method] = callback;
                            return this;
                        },
                        call(data) {
                            if (!data) {
                                syn.$l.eventLog('$channel.call', '매개변수 확인 필요', 'Warning');
                                return;
                            }

                            if (!data.method || typeof data.method !== 'string') {
                                syn.$l.eventLog('$channel.call', 'method 매개변수 확인 필요', 'Warning');
                                return;
                            }

                            if (!data.success || typeof data.success !== 'function') {
                                syn.$l.eventLog('$channel.call', 'callback 매개변수 확인 필요', 'Warning');
                                return;
                            }

                            var callbacks = {};
                            var callbackNames = [];
                            var seen = [];

                            var pruneFunctions = function (path, params) {
                                if (seen.indexOf(params) >= 0) {
                                    syn.$l.eventLog('$channel.pruneFunctions', 'recursive params 데이터 없음', 'Warning');
                                    return;
                                }
                                seen.push(params);

                                if (typeof params === 'object') {
                                    for (var k in params) {
                                        if (!params.hasOwnProperty(k)) {
                                            continue;
                                        }

                                        var np = path + (path.length ? '/' : '') + k;
                                        if (typeof params[k] === 'function') {
                                            callbacks[np] = params[k];
                                            callbackNames.push(np);
                                            delete params[k];
                                        } else if (typeof params[k] === 'object') {
                                            pruneFunctions(np, params[k]);
                                        }
                                    }
                                }
                            };
                            pruneFunctions('', data.params);

                            var message = { id: currentTransactionID, method: scopeMethod(data.method), params: data.params };
                            if (callbackNames.length) {
                                message.callbacks = callbackNames;
                            }

                            if (data.timeout) {
                                setTransactionTimeout(currentTransactionID, data.timeout, scopeMethod(data.method));
                            }

                            sendRequests[currentTransactionID] = { callbacks: callbacks, error: data.error, success: data.success };
                            transactionMessages[currentTransactionID] = onMessage;

                            currentTransactionID++;

                            postMessage(message);
                        },
                        notify(data) {
                            if (!data) {
                                throw 'missing arguments to notify function';
                                syn.$l.eventLog('$channel.notify', 'notify params 데이터 없음', 'Warning');
                                return;
                            }

                            if (!data.method || typeof data.method !== 'string') {
                                syn.$l.eventLog('$channel.notify', 'method 매개변수 확인 필요', 'Warning');
                                return;
                            }

                            postMessage({ method: scopeMethod(data.method), params: data.params });
                        },
                        destroy() {
                            removeChannel(options.context, options.origin, ((typeof options.scope === 'string') ? options.scope : ''));
                            if (context.removeEventListener) {
                                context.removeEventListener('message', onMessage, false);
                            }
                            else if (context.detachEvent) {
                                context.detachEvent('onmessage', onMessage);
                            }

                            ready = false;
                            registrationMappingMethods = {};
                            receivedRequests = {};
                            sendRequests = {};
                            options.origin = null;
                            pendingQueue = [];
                            channelID = '';
                            debug('채널 삭제');
                        }
                    };

                    boundMessage.bind('__ready', onReady);
                    setTimeout(function () {
                        postMessage({ method: scopeMethod('__ready'), params: 'T' }, true);
                    }, 0);

                    boundMessage.options = options;
                    $channel.connections.push(boundMessage);
                    return boundMessage;
                }
            };

            return connectChannel;
        })(),

        findChannel(channelID) {
            return $channel.connections.find((item) => { return item.options.scope == channelID });
        },

        // syn.$channel.call('local-channelID', 'pageLoad', '?')
        call(channelID, evt, params) {
            var connection = $channel.findChannel(channelID);
            if (connection) {
                var val = {
                    method: evt,
                    params: params
                };

                if (connection.options.debugOutput === true) {
                    val.error = function (error, message) {
                        syn.$l.eventLog('$channel.call.error', '"{0}" call error: {1}, message: {2}'.format(evt, error, message), 'Information');
                    };

                    val.success = function (val) {
                        syn.$l.eventLog('$channel.call.success', '"{0}" call returns: {1}'.format(evt, val), 'Information');
                    };
                }

                connection.call(val);
            }
        },

        // syn.$channel.notify('local-channelID', 'pageLoad', '?')
        notify(channelID, evt, params) {
            var connection = $channel.findChannel(channelID);
            if (connection) {
                var val = {
                    method: evt,
                    params: params
                };

                if (connection.options.debugOutput === true) {
                    val.error = function (error, message) {
                        syn.$l.eventLog('$channel.notify.error', '"{0}" notify error: {1}, message: {2}'.format(evt, error, message), 'Information');
                    };

                    val.success = function (val) {
                        syn.$l.eventLog('$channel.notify.success', '"{0}" notify returns: {1}'.format(evt, val), 'Information');
                    };
                }

                connection.notify(val);
            }
        }
    });
    syn.$channel = $channel;
})(globalRoot);

/// <reference path='syn.core.js' />
/// <reference path='syn.library.js' />

(function (context) {
    'use strict';
    var $webform = context.$webform || new syn.module();
    var document = null;
    if (globalRoot.devicePlatform === 'node') {
    }
    else {
        $webform.context = context;
        $webform.document = context.document;
        document = context.document;
    }

    $webform.extend({
        version: '1.0',
        localeID: 'ko-KR',
        isPageLoad: false,
        transactionLoaderID: null,
        pageReadyTimeout: 60000,
        eventAddReady: (globalRoot.devicePlatform === 'node') ? null : new CustomEvent('addready'),
        eventRemoveReady: (globalRoot.devicePlatform === 'node') ? null : new CustomEvent('removeready'),
        mappingModule: true,
        moduleReadyIntervalID: null,
        remainingReadyIntervalID: null,
        remainingReadyCount: 0,

        defaultControlOptions: {
            value: '',
            text: '',
            dataType: 'string',
            bindingID: '',
            resourceKey: '',
            localeID: 'ko-KR',
            required: false,
            tooltip: ''
        },

        setStorage(prop, val, isLocal, ttl) {
            if (isLocal == undefined || isLocal == null) {
                isLocal = false;
            }

            if (globalRoot.devicePlatform === 'node') {
                if (isLocal == true) {
                    localStorage.setItem(prop, JSON.stringify(val));
                }
                else {
                    if (ttl == undefined || ttl == null) {
                        ttl = 1200000;
                    }

                    var now = new Date();
                    var item = {
                        value: val,
                        expiry: now.getTime() + ttl,
                        ttl: ttl
                    };
                    localStorage.setItem(prop, JSON.stringify(item));
                }
            }
            else {
                if (isLocal == true) {
                    localStorage.setItem(prop, JSON.stringify(val));
                }
                else {
                    sessionStorage.setItem(prop, JSON.stringify(val));
                }
            }

            return this;
        },

        getStorage(prop, isLocal) {
            var result = null;
            var val = null;

            if (isLocal == undefined || isLocal == null) {
                isLocal = false;
            }

            if (globalRoot.devicePlatform === 'node') {
                if (isLocal == true) {
                    val = localStorage.getItem(prop);
                }
                else {
                    var itemStr = localStorage.getItem(prop)
                    if (!itemStr) {
                        return null;
                    }
                    var item = JSON.parse(itemStr)
                    var now = new Date()
                    if (now.getTime() > item.expiry) {
                        localStorage.removeItem(prop);
                        return null;
                    }

                    result = item.value;

                    var ttl = item.ttl;
                    var now = new Date();
                    var item = {
                        value: result,
                        expiry: now.getTime() + ttl,
                        ttl: ttl
                    };
                    localStorage.setItem(prop, JSON.stringify(item));
                }
            }
            else {
                if (isLocal == true) {
                    result = JSON.parse(localStorage.getItem(prop));
                }
                else {
                    result = JSON.parse(sessionStorage.getItem(prop));
                }
            }

            return result;
        },

        removeStorage(prop, isLocal) {
            if (isLocal == undefined || isLocal == null) {
                isLocal = false;
            }

            if (globalRoot.devicePlatform === 'node') {
                localStorage.removeItem(prop);
            }
            else {
                if (isLocal == true) {
                    localStorage.removeItem(prop);
                }
                else {
                    sessionStorage.removeItem(prop);
                }
            }
        },

        storageLength(isLocal) {
            var result = 0;
            if (isLocal == undefined || isLocal == null) {
                isLocal = false;
            }

            if (globalRoot.devicePlatform === 'node') {
                result = localStorage.length;
            }
            else {
                if (isLocal == true) {
                    result = localStorage.length;
                }
                else {
                    result = sessionStorage.length;
                }
            }

            return result;
        },

        storageKey(index, isLocal) {
            var result = null;
            if (isLocal == undefined || isLocal == null) {
                isLocal = false;
            }

            if (globalRoot.devicePlatform === 'node') {
                result = localStorage.key(index);
            }
            else {
                if (isLocal == true) {
                    result = localStorage.key(index);
                }
                else {
                    result = sessionStorage.key(index);
                }
            }

            return result;
        },

        createBlob(data, type) {
            try {
                return new Blob([data], { type: type });
            } catch (e) {
                var BlobBuilder = globalRoot.BlobBuilder || globalRoot.WebKitBlobBuilder || globalRoot.MozBlobBuilder || globalRoot.MSBlobBuilder;
                var builder = new BlobBuilder();
                builder.append(data.buffer || data);
                return builder.getBlob(type);
            }
        },

        dataUriToBlob(dataUri) {
            var result = null;

            try {
                var byteString = syn.$c.base64Decode(dataUri.split(',')[1]);
                var mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                result = new Blob([ab], { type: mimeString });
            } catch (error) {
                syn.$l.eventLog('$w.dataUriToBlob', error, 'Warning');
            }
            return result;
        },

        dataUriToText(dataUri) {
            var result = null;

            try {
                result = {
                    value: syn.$c.base64Decode(dataUri.split(',')[1]),
                    mime: dataUri.split(',')[0].split(':')[1].split(';')[0]
                };
            } catch (error) {
                syn.$l.eventLog('$w.dataUriToText', error, 'Warning');
            }
            return result;
        },

        textContent(el, text) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var cl = el.cloneNode(false);
            cl.textContent = text;
            el.parentNode.replaceChild(cl, el);
        },

        outerHtml(el, html) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var cl = el.cloneNode(false);
            cl.outerHtml = html;
            el.parentNode.replaceChild(cl, el);
        },

        innerHTML(el, html) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var cl = el.cloneNode(false);
            cl.innerHTML = html;
            el.parentNode.replaceChild(cl, el);
        },

        innerText(el, text) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var cl = el.cloneNode(false);
            cl.innerText = text;
            el.parentNode.replaceChild(cl, el);
        },

        activeControl() {
            var result = null;
            var evt = event || context.event;
            if (globalRoot.$this) {
                if (evt) {
                    result = (evt && evt.target || evt.srcElement) || $this.context.focusControl || document.activeElement;
                }
                else {
                    result = $this.context.focusControl || document.activeElement;
                }
            }

            return result;
        },

        hasAutoFocus() {
            var el = document.createElement('input');
            return "autofocus" in el;
        },

        createTouchEvent(name, e) {
            var events = document.createEvent('MouseEvents');

            events.initMouseEvent(
                name,
                e.bubbles,
                e.cancelable,
                e.view,
                e.detail,
                e.screenX,
                e.screenY,
                e.clientX,
                e.clientY,
                e.ctrlKey,
                e.altKey,
                e.shiftKey,
                e.metaKey,
                e.button,
                e.relatedTarget
            );

            return events;
        },

        async contentLoaded() {
            syn.$l.addEvent(document, 'addready', function () {
                syn.$w.remainingReadyCount++;
            });

            syn.$l.addEvent(document, 'removeready', function () {
                syn.$w.remainingReadyCount--;
            });

            if (syn.$l.get('moduleScript')) {
                syn.$w.extend({ pageScript: syn.$l.get('moduleScript').value });
            }
            else {
                var pathname = location.pathname;
                if (pathname.split('/').length > 0) {
                    var filename = pathname.split('/')[location.pathname.split('/').length - 1];
                    syn.$w.extend({ pageScript: '$' + (filename.indexOf('.') > -1 ? filename.substring(0, filename.indexOf('.')) : filename) });
                }

                var input = document.createElement('input');
                input.id = 'moduleScript';
                input.type = 'text';
                input.style.display = 'none';
                input.value = syn.$w.pageScript;
                document.body.appendChild(input);

                if (document.forms) {
                    for (var i = 0; i < document.forms.length; i++) {
                        syn.$l.addEvent(document.forms[i], 'submit', function (e) {
                            var result = false;
                            var el = e.target || e.srcElement;
                            if ($this && $this.hook && $this.hook.frameEvent) {
                                result = $this.hook.frameEvent('beforeSubmit', {
                                    el: el,
                                    evt: e
                                });

                                if ($object.isNullOrUndefined(result) == true || $string.toBoolean(result) == false) {
                                    result = false;
                                }
                            }

                            if (result == false) {
                                e.returnValue = false;
                                e.cancel = true;
                                if (e.preventDefault) {
                                    e.preventDefault();
                                }

                                if (e.stopPropagation) {
                                    e.stopPropagation();
                                }
                                return false;
                            }
                        });
                    }
                }
            }

            var pageLoad = function () {
                if ($object.isNullOrUndefined(syn.$w.SSO) == true) {
                    var sso = {
                        TokenID: '',
                        UserID: '',
                        UserName: '',
                        BusinessTel: '',
                        BusinessEMail: '',
                        DepartmentID: '',
                        DepartmentName: '',
                        PositionID: '',
                        PositionName: '',
                        CompanyNo: '',
                        CompanyName: '',
                        Roles: [],
                        Claims: []
                    }

                    if (syn.$w.getSSOInfo) {
                        syn.$w.SSO = syn.$w.getSSOInfo() || sso;
                    }
                    else {
                        syn.$w.SSO = sso;
                    }
                }

                var mod = context[syn.$w.pageScript];
                if (mod && mod.hook.pageLoad) {
                    mod.hook.pageLoad();
                }

                if (context.domainPageLoad) {
                    context.domainPageLoad();
                }
                else {
                    var hidden = null;
                    if (document.forms) {
                        for (var i = 0; i < document.forms.length; i++) {
                            var form = document.forms[i];
                            hidden = form.getAttribute('hidden');
                            if ($object.isNullOrUndefined(hidden) == false && $string.toBoolean(hidden) == false) {
                                form.removeAttribute('hidden');
                                syn.$m.removeClass(form, 'hidden');
                                form.style.display = '';
                            }
                        }
                    }

                    hidden = document.body.getAttribute('hidden');
                    if ($object.isNullOrUndefined(hidden) == false && $string.toBoolean(hidden) == false) {
                        document.body.removeAttribute('hidden');
                        syn.$m.removeClass(document.body, 'hidden');
                        document.body.style.display = '';
                    }
                }

                setTimeout(function () {
                    if (mod && mod.context.synControls && ($object.isNullOrUndefined(mod.context.tabOrderControls) == true || mod.context.tabOrderControls.length == 0)) {
                        var synTagNames = [];
                        var syn_tags = document.body.outerHTML.match(/<(syn_).+?>/gi);
                        if (syn_tags) {
                            var synControlCount = syn_tags.length;
                            for (var i = 0; i < synControlCount; i++) {
                                var syn_tag = syn_tags[i];
                                var tagName = syn_tag.substring(1, syn_tag.indexOf(' ')).toUpperCase();
                                synTagNames.push(tagName);
                            }
                        }

                        synTagNames = $array.distinct(synTagNames);
                        var findElements = document.querySelectorAll('input,select,textarea,button' + (synTagNames.length > 0 ? ',' + synTagNames.join(',') : ''));
                        var els = [];
                        var length = findElements.length;
                        for (var idx = 0; idx < length; idx++) {
                            var el = findElements[idx];
                            if (el && el.style && el.style.display == 'none' || el.type == 'hidden') {
                                if (el.id && el.tagName.toUpperCase() == 'SELECT' && (el.getAttribute('syn-datafield') != null || el.getAttribute('syn-datafield') != undefined)) {
                                    els.push(el);
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                if (el.id && el.id.includes('btn_syneditor_') == false && el.id.includes('chk_syngrid_') == false && el.id.includes('_hidden') == false) {
                                    els.push(el);
                                }
                                else if (el.id && el.tagName.toUpperCase() == 'SELECT' && (el.getAttribute('syn-datafield') != null || el.getAttribute('syn-datafield') != undefined)) {
                                    els.push(el);
                                }
                                else if (el.id && el.tagName.includes('SYN_') == true) {
                                    els.push(el);
                                }
                            }
                        }

                        var items = [];
                        var i = 0;
                        length = els.length;
                        for (var idx = 0; idx < length; idx++) {
                            var el = els[idx];
                            if (el.id && el.id.includes('btn_syneditor_') == false && el.id.includes('chk_syngrid_') == false && el.id.includes('_hidden') == false) {
                                var elID = el.id;
                                var offset = syn.$d.offset(el);
                                var baseID = el.getAttribute('baseID');
                                if (baseID) {
                                    elID = baseID;
                                }

                                var setting = mod.context.synControls.find(function (item) { return item.id == elID });

                                if (setting) {
                                    if (setting.type == 'datepicker') {
                                        offset = syn.$d.offset(el.parentElement);
                                    }
                                    else if (setting.type == 'colorpicker') {
                                        offset = syn.$d.offset(el.parentElement.parentElement);
                                    }

                                    items.push({
                                        elID: el.id,
                                        tagName: el.tagName,
                                        formID: setting.formDataFieldID,
                                        type: setting.type,
                                        top: offset.top,
                                        left: offset.left
                                    });
                                }
                            }
                            else if (el.id && el.tagName.toUpperCase() == 'SELECT' && (el.getAttribute('syn-datafield') != null || el.getAttribute('syn-datafield') != undefined)) {
                                var offset = null;
                                if (el.getAttribute('multiple') === false) {
                                    var control = mod.uicontrols.$select.getControl(el.id);
                                    if (control) {
                                        offset = syn.$d.offset(control.picker.select);
                                    }
                                }
                                else {
                                    var control = mod.uicontrols.$multiselect.getControl(el.id);
                                    if (control) {
                                        offset = syn.$d.offset(control.picker.select);
                                    }
                                }

                                if (offset) {
                                    var setting = mod.context.synControls.find(function (item) { return item.id == el.id });

                                    if (setting) {
                                        items.push({
                                            elID: el.id,
                                            tagName: el.tagName,
                                            formID: setting.formDataFieldID,
                                            type: setting.type,
                                            top: offset.top,
                                            left: offset.left
                                        });
                                    }
                                }
                            }
                            else if (el.id && el.tagName.includes('SYN_') == true) {
                                var elID = el.id.replace('_hidden', '');
                                var offset = null;
                                if (el.tagName == 'SYN_DATEPICKER') {
                                    // var offset = syn.$d.offset(el);
                                }
                                else if (el.tagName == 'SYN_COLORPICKER') {
                                    // var offset = syn.$d.offset(el);
                                }

                                if (offset) {
                                    var setting = mod.context.synControls.find(function (item) { return item.id == elID });
                                    if (setting) {
                                        items.push({
                                            elID: elID,
                                            tagName: el.tagName,
                                            formID: setting.formDataFieldID,
                                            type: setting.type,
                                            top: offset.top,
                                            left: offset.left
                                        });
                                    }
                                }
                            }

                            i = i + 1;
                        }

                        mod.context.focusControl = null;
                        mod.context.tabOrderFocusID = null;
                        mod.context.tabOrderControls = items;

                        if (mod && mod.hook.frameEvent) {
                            mod.hook.frameEvent('tabOrderControls', mod.context.tabOrderControls);
                        }

                        if (mod.context.tabOrderControls.length > 0) {
                            if (mod.config) {
                                // html (html defined), tdlr (top > down > left > right), lrtd (left > right > top > down)
                                if ($string.isNullOrEmpty(mod.context.tapOrderFlow) == true) {
                                    mod.context.tapOrderFlow = 'html';
                                }

                                if (mod.context.tapOrderFlow == 'tdlr') {
                                    mod.context.tabOrderControls.sort(
                                        function (a, b) {
                                            if (a.top === b.top) {
                                                return a.left - b.left;
                                            }
                                            return a.top > b.top ? 1 : -1;
                                        });
                                }
                                else if (mod.context.tapOrderFlow == 'lrtd') {
                                    mod.context.tabOrderControls.sort(
                                        function (a, b) {
                                            if (a.left === b.left) {
                                                return a.top - b.top;
                                            }
                                            return a.left > b.left ? 1 : -1;
                                        });
                                }
                            }
                            else {
                                mod.context.tabOrderControls.sort(
                                    function (a, b) {
                                        if (a.top === b.top) {
                                            return a.left - b.left;
                                        }
                                        return a.top > b.top ? 1 : -1;
                                    });
                            }
                        }

                        var focusEL = syn.$l.querySelector("[autofocus]")
                        if (focusEL && focusEL.id && focusEL.tagName) {
                            var tagName = focusEL.tagName.toUpperCase();
                            var tags = 'input,select,textarea,button'.toUpperCase().split(',');
                            if (tags.indexOf(tagName) > -1) {
                                mod.context.focusControl = focusEL;
                                mod.context.tabOrderFocusID = focusEL.id;
                                setTimeout(function () {
                                    focusEL.focus();
                                });
                            }
                        }
                    }
                });
            }

            var pageFormInit = function () {
                var mod = context[syn.$w.pageScript];
                if (mod && mod.hook.pageFormInit) {
                    mod.hook.pageFormInit();
                }

                var synControlList = [];
                var synControls = document.querySelectorAll('[syn-datafield],[syn-options],[syn-events]');
                for (var i = 0; i < synControls.length; i++) {
                    var synControl = synControls[i];
                    if (synControl.tagName) {
                        var tagName = synControl.tagName.toUpperCase();
                        var dataField = synControl.getAttribute('syn-datafield');
                        var elementID = synControl.getAttribute('id');
                        var formDataField = synControl.closest('form') ? synControl.closest('form').getAttribute('syn-datafield') : '';
                        var controlType = '';

                        var controlOptions = synControl.getAttribute('syn-options') || null;
                        if (controlOptions != null) {
                            try {
                                controlOptions = eval('(' + controlOptions + ')');
                            } catch (error) {
                                syn.$l.eventLog('$w.contentLoaded', 'elID: "{0}" syn-options 확인 필요 '.format(elementID) + error.message, 'Warning');
                            }
                        }
                        else {
                            controlOptions = {};
                        }

                        var controlModule = null;
                        if (syn.uicontrols) {
                            if (tagName.indexOf('SYN_') > -1) {
                                var moduleName = tagName.substring(4).toLowerCase();
                                controlModule = syn.uicontrols['$' + moduleName];
                                controlType = moduleName;
                            }
                            else {
                                switch (tagName) {
                                    case 'BUTTON':
                                        controlModule = syn.uicontrols.$button;
                                        controlType = 'button';
                                        break;
                                    case 'INPUT':
                                        controlType = synControl.getAttribute('type').toLowerCase();
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
                                                controlModule = syn.uicontrols.$textbox;
                                                break;
                                            case 'submit':
                                            case 'reset':
                                            case 'button':
                                                controlModule = syn.uicontrols.$button;
                                                break;
                                            case 'radio':
                                                controlModule = syn.uicontrols.$radio;
                                                break;
                                            case 'checkbox':
                                                controlModule = syn.uicontrols.$checkbox;
                                                break;
                                        }
                                        break;
                                    case 'TEXTAREA':
                                        controlModule = syn.uicontrols.$textarea;
                                        controlType = 'textarea';
                                        break;
                                    case 'SELECT':
                                        if (synControl.getAttribute('multiple') == null) {
                                            controlModule = syn.uicontrols.$select;
                                            controlType = 'select';
                                        }
                                        else {
                                            controlModule = syn.uicontrols.$multiselect;
                                            controlType = 'multiselect';
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                        syn.$l.addEvent(synControl.id, 'focus', function (evt) {
                            $this.context.focusControl = evt.target || evt.currentTarget || evt.srcElement;
                            if ($this.context.focusControl) {
                                $this.context.tabOrderFocusID = $this.context.focusControl.id;
                            }
                            else {
                                $this.context.tabOrderFocusID = null;
                            }
                        });

                        if (controlModule) {
                            if (controlModule.addModuleList) {
                                controlModule.addModuleList(synControl, synControlList, controlOptions, controlType);
                            }

                            controlModule.controlLoad(elementID, controlOptions);
                        }
                        else {
                            if (elementID) {
                                synControlList.push({
                                    id: elementID,
                                    formDataFieldID: formDataField,
                                    field: dataField,
                                    module: null,
                                    type: controlType ? controlType : synControl.tagName.toLowerCase()
                                });
                            }

                            if ($this && $this.controlLoad) {
                                $this.controlLoad(elementID, controlOptions);
                            }
                        }
                    }
                }

                var synEventControls = document.querySelectorAll('[syn-events]');
                for (var i = 0; i < synEventControls.length; i++) {
                    var synControl = synEventControls[i];
                    var events = null;

                    try {
                        events = eval('(' + synControl.getAttribute('syn-events') + ')');
                    } catch (error) {
                        syn.$l.eventLog('$w.contentLoaded', 'elID: "{0}" syn-events 확인 필요 '.format(synControl.id) + error.message, 'Warning');
                    }

                    if (events && $this.event) {
                        var length = events.length;
                        for (var j = 0; j < length; j++) {
                            var event = events[j];

                            var func = $this.event[synControl.id + '_' + event];
                            if (func) {
                                syn.$l.addEvent(synControl.id, event, func);
                            }
                        }
                    }
                }

                var synOptionControls = document.querySelectorAll('[syn-options]');
                for (var i = 0; i < synOptionControls.length; i++) {
                    var synControl = synOptionControls[i];
                    var elID = synControl.id.replace('_hidden', '');
                    var options = null;

                    try {
                        var el = syn.$l.get(synControl.id + '_hidden') || syn.$l.get(synControl.id);
                        options = eval('(' + el.getAttribute('syn-options') + ')');
                    } catch (error) {
                        syn.$l.eventLog('$w.contentLoaded', 'elID: "{0}" syn-options 확인 필요'.format(synControl.id) + error.message, 'Warning');
                    }

                    if (options && options.transactConfig && options.transactConfig.triggerEvent) {
                        if ($ref.isString(options.transactConfig.triggerEvent) == true) {
                            syn.$l.addEvent(elID, options.transactConfig.triggerEvent, function (transactConfig) {
                                var el = this;
                                if (transactConfig && $object.isNullOrUndefined(transactConfig.triggerEvent) == true) {
                                    var options = eval('(' + el.getAttribute('syn-options') + ')');
                                    transactConfig = options.transactConfig;
                                }
                                else {
                                    var options = eval('(' + el.getAttribute('syn-options') + ')');
                                    if (options && options.transactConfig) {
                                        transactConfig = options.transactConfig;
                                    }
                                }

                                if (transactConfig) {
                                    syn.$w.transactionAction(transactConfig);
                                }
                            });
                        }
                        else if ($ref.isArray(options.transactConfig.triggerEvent) == true) {
                            var triggerFunction = function (transactConfig) {
                                var el = this;
                                if (transactConfig && $object.isNullOrUndefined(transactConfig.triggerEvent) == true) {
                                    var options = eval('(' + el.getAttribute('syn-options') + ')');
                                    transactConfig = options.transactConfig;
                                }
                                else {
                                    var options = eval('(' + el.getAttribute('syn-options') + ')');
                                    if (options && options.transactConfig) {
                                        transactConfig = options.transactConfig;
                                    }
                                }

                                if (transactConfig) {
                                    syn.$w.transactionAction(transactConfig);
                                }
                            };

                            for (var key in options.transactConfig.triggerEvent) {
                                var eventName = options.transactConfig.triggerEvent[key];
                                syn.$l.addEvent(elID, eventName, triggerFunction);
                            }
                        }
                    }

                    if (options && options.triggerConfig && options.triggerConfig.triggerEvent) {
                        if ($ref.isString(options.triggerConfig.triggerEvent) == true) {
                            syn.$l.addEvent(elID, options.triggerConfig.triggerEvent, function (triggerConfig) {
                                var el = this;
                                if (triggerConfig && $object.isNullOrUndefined(triggerConfig.triggerEvent) == true) {
                                    var options = eval('(' + el.getAttribute('syn-options') + ')');
                                    triggerConfig = options.triggerConfig;
                                }
                                else {
                                    var options = eval('(' + el.getAttribute('syn-options') + ')');
                                    if (options && options.triggerConfig) {
                                        triggerConfig = options.triggerConfig;
                                    }
                                }

                                if (triggerConfig) {
                                    syn.$w.triggerAction(triggerConfig);
                                }
                            });
                        }
                        else if ($ref.isArray(options.triggerConfig.triggerEvent) == true) {
                            var triggerFunction = function (triggerConfig) {
                                var el = this;
                                if (triggerConfig && $object.isNullOrUndefined(triggerConfig.triggerEvent) == true) {
                                    var options = eval('(' + el.getAttribute('syn-options') + ')');
                                    triggerConfig = options.triggerConfig;
                                }
                                else {
                                    var options = eval('(' + el.getAttribute('syn-options') + ')');
                                    if (options && options.triggerConfig) {
                                        triggerConfig = options.triggerConfig;
                                    }
                                }

                                if (triggerConfig) {
                                    syn.$w.triggerAction(triggerConfig);
                                }
                            };

                            for (var key in options.triggerConfig.triggerEvent) {
                                var eventName = options.triggerConfig.triggerEvent[key];
                                syn.$l.addEvent(elID, eventName, triggerFunction);
                            }
                        }
                    }
                }

                var elem = document.createElement('input');
                elem.type = 'hidden';
                elem.id = 'synControlList';
                elem.textContent = JSON.stringify(synControlList);;
                document.body.appendChild(elem);

                if (mod) {
                    mod.context.synControls = synControlList;
                }
                else {
                    context.synControls = synControlList;
                }

                syn.$w.remainingReadyIntervalID = setInterval(function () {
                    if (syn.$w.remainingReadyCount == 0) {
                        clearInterval(syn.$w.remainingReadyIntervalID);
                        syn.$w.remainingReadyIntervalID = null;
                        pageLoad();
                        syn.$w.isPageLoad = true;
                    }
                }, 25);

                setTimeout(function () {
                    if (syn.$w.remainingReadyIntervalID != null) {
                        clearInterval(syn.$w.remainingReadyIntervalID);
                        syn.$w.remainingReadyIntervalID = null;
                        syn.$l.eventLog('pageLoad', '화면 초기화 오류, remainingReadyCount: {0} 확인 필요'.format(syn.$w.remainingReadyCount), 'Fatal');
                    }
                }, syn.$w.pageReadyTimeout);
            };

            if (syn.$w.mappingModule == true) {
                setTimeout(async function () {
                    var module = await syn.$w.fetchScript(syn.$w.pageScript.replace('$', ''));

                    if (syn.$l.get('moduleScript')) {
                        syn.$w.extend({ pageScript: syn.$l.get('moduleScript').value });
                    }

                    var mod = context[syn.$w.pageScript] || new syn.module();
                    mod.config = {};
                    mod.prop = {};
                    mod.model = {};
                    mod.hook = {};
                    mod.event = {};
                    mod.message = {};
                    mod.transaction = {};
                    mod.method = {};
                    mod.store = {};
                    mod.uicontrols = {};
                    mod.context = {};

                    mod.extend(module);
                    context[syn.$w.pageScript] = mod;
                    context['$this'] = mod;

                    if (syn.uicontrols) {
                        for (var control in syn.uicontrols) {
                            mod.uicontrols[control] = syn.uicontrols[control];
                        }
                    }

                    if (context.domainLibraryLoad) {
                        domainLibraryLoad();
                    }

                    syn.$l.addEvent(document, 'pageReady', pageFormInit);
                    context.pageFormReady = true;
                    setTimeout(function () {
                        syn.$l.removeEvent(document, 'pageReady', pageFormInit);

                        if (syn.$w.remainingReadyIntervalID != null) {
                            syn.$l.eventLog('pageReady', '화면 초기화 오류, loader 또는 dispatchEvent 확인 필요', 'Fatal');
                        }
                    }, syn.$w.pageReadyTimeout);
                }, 25);
            }
            else {
                pageLoad();
                syn.$w.isPageLoad = true;
            }
        },

        addReadyCount() {
            if (syn.$w.eventAddReady && syn.$w.isPageLoad == false) {
                document.dispatchEvent(syn.$w.eventAddReady);
            }
        },

        removeReadyCount() {
            if (syn.$w.eventRemoveReady && syn.$w.isPageLoad == false) {
                document.dispatchEvent(syn.$w.eventRemoveReady);
            }
        },

        createSelection(el, start, end) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el.createTextRange) {
                var newend = end - start;
                var selRange = el.createTextRange();
                selRange.collapse(true);
                selRange.moveStart('character', start);
                selRange.moveEnd('character', newend);
                selRange.select();
                newend = null;
                selRange = null;
            }
            else if (el.setSelectionRange) {
                el.setSelectionRange(start, end);
            }

            el.focus();
        },

        argumentsExtend() {
            var extended = {};

            for (var key in arguments) {
                var argument = arguments[key];
                for (var prop in argument) {
                    if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                        extended[prop] = argument[prop];
                    }
                }
            }

            return extended;
        },

        loadJson(url, setting, success, callback, async, isForceCallback) {
            if (async == undefined || async == null) {
                async = true;
            }

            if (isForceCallback == undefined || isForceCallback == null) {
                isForceCallback = false;
            }

            var xhr = new XMLHttpRequest();
            if (async === true) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            if (success) {
                                success(setting, JSON.parse(xhr.responseText));
                            }

                            if (callback) {
                                callback();
                            }
                        }
                        else {
                            syn.$l.eventLog('$w.loadJson', 'async url: ' + url + ', status: ' + xhr.status.toString() + ', responseText: ' + xhr.responseText, 'Error');
                        }

                        if (xhr.status !== 200 && callback && isForceCallback == true) {
                            callback();
                        }
                    }
                };
                xhr.open('GET', url, true);

                if (syn.$w.setServiceClientHeader) {
                    if (syn.$w.setServiceClientHeader(xhr) == false) {
                        return;
                    }
                }

                xhr.send();
            }
            else {
                xhr.open('GET', url, false);

                if (syn.$w.setServiceClientHeader) {
                    if (syn.$w.setServiceClientHeader(xhr) == false) {
                        return;
                    }
                }

                xhr.send();

                if (xhr.status === 200) {
                    if (success) {
                        success(setting, JSON.parse(xhr.responseText));
                    }

                    if (callback) {
                        callback();
                    }
                }
                else {
                    syn.$l.eventLog('$w.loadJson', 'sync url: ' + url + ', status: ' + xhr.status.toString() + ', responseText: ' + xhr.responseText, 'Error');
                }

                if (callback && isForceCallback == true) {
                    callback();
                }
            }
        },

        getTriggerOptions(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return JSON.parse(el.getAttribute('triggerOptions'));
        },

        triggerAction(triggerConfig) {
            if ($this) {
                var isContinue = true;

                var defaultParams = {
                    args: [],
                    options: {}
                };

                triggerConfig.params = syn.$w.argumentsExtend(defaultParams, triggerConfig.params);

                if ($this.beforeTrigger) {
                    isContinue = $this.beforeTrigger(triggerConfig.triggerID, triggerConfig.action, triggerConfig.params);
                }

                if ($object.isNullOrUndefined(isContinue) == true || isContinue == true) {
                    var el = syn.$l.get(triggerConfig.triggerID);
                    var triggerResult = null;
                    var trigger = null;

                    // $로 시작하면 uicontrol 컨트롤 메서드, 아니면 화면 컨트롤 이벤트명
                    if (triggerConfig.action.indexOf('$') > -1) {
                        trigger = $this;
                        var currings = triggerConfig.action.split('.');
                        if (currings.length > 0) {
                            for (var i = 0; i < currings.length; i++) {
                                var curring = currings[i];
                                if (trigger) {
                                    trigger = trigger[curring];
                                }
                                else {
                                    trigger = context[curring];
                                }
                            }
                        }
                        else {
                            trigger = context[triggerConfig.action];
                        }
                    }
                    else {
                        trigger = $this[triggerConfig.triggerID + '_' + triggerConfig.action];
                    }

                    if (trigger) {
                        el.setAttribute('triggerOptions', JSON.stringify(triggerConfig.params.options));

                        if (triggerConfig.action.indexOf('$') > -1) {
                            $array.addAt(triggerConfig.params.args, 0, triggerConfig.triggerID);
                        }

                        triggerResult = trigger.apply(el, triggerConfig.params.args);
                        if ($this.afterTrigger) {
                            $this.afterTrigger(null, triggerConfig.action, {
                                elID: triggerConfig.triggerID,
                                result: triggerResult
                            });
                        }
                    }
                    else {
                        if ($this.afterTrigger) {
                            $this.afterTrigger('{0} trigger 확인 필요'.format(triggerConfig.action), triggerConfig.action, null);
                        }
                    }
                }
                else {
                    if ($this.afterTrigger) {
                        $this.afterTrigger('beforeTrigger continue false', triggerConfig.action, null);
                    }
                }
            }
        },

        transactionAction(transactConfig) {
            if (transactConfig && $this && $this.config) {
                if ($object.isNullOrUndefined(transactConfig.noProgress) == true) {
                    transactConfig.noProgress = false;
                }

                if (syn.$w.progressMessage && transactConfig.noProgress == false) {
                    syn.$w.progressMessage($res.progress);
                }

                try {
                    if ($object.isNullOrUndefined($this.config.transactions) == true) {
                        $this.config.transactions = [];
                    }

                    var isContinue = true;

                    if ($this.beforeTransaction) {
                        isContinue = $this.beforeTransaction(transactConfig);
                    }

                    if ($object.isNullOrUndefined(isContinue) == true || isContinue == true) {
                        var transactions = $this.config.transactions;
                        for (var i = 0; i < transactions.length; i++) {
                            if (transactConfig.functionID == transactions[i].FunctionID) {
                                transactions.splice(i, 1);
                                break;
                            }
                        }

                        var synControlList = $this.context.synControls;
                        var transactionObject = {};
                        transactionObject.FunctionID = transactConfig.functionID;
                        transactionObject.transactionResult = $object.isNullOrUndefined(transactConfig.transactionResult) == true ? true : transactConfig.transactionResult === true;
                        transactionObject.Inputs = [];
                        transactionObject.Outputs = [];

                        if (transactConfig.inputs) {
                            var inputs = transactConfig.inputs;
                            var inputsLength = inputs.length;
                            for (var i = 0; i < inputsLength; i++) {
                                var inputConfig = inputs[i];
                                var input = {
                                    RequestType: inputConfig.type,
                                    DataFieldID: inputConfig.dataFieldID ? inputConfig.dataFieldID : document.forms.length > 0 ? document.forms[0].getAttribute('syn-datafield') : '',
                                    Items: {}
                                };

                                var synControlConfigs = null;
                                if (inputConfig.type == 'Row') {
                                    var synControlConfigs = synControlList.filter(function (item) {
                                        return item.formDataFieldID == input.DataFieldID && ['grid', 'chart', 'chartjs'].indexOf(item.type) == -1;
                                    });

                                    if (synControlConfigs && synControlConfigs.length > 0) {
                                        for (var k = 0; k < synControlConfigs.length; k++) {
                                            var synControlConfig = synControlConfigs[k];

                                            var el = syn.$l.get(synControlConfig.id + '_hidden') || syn.$l.get(synControlConfig.id);
                                            var options = el.getAttribute('syn-options');
                                            if (options == null) {
                                                continue;
                                            }

                                            var synOptions = null;

                                            try {
                                                synOptions = JSON.parse(options);
                                            } catch (e) {
                                                synOptions = eval('(' + options + ')');
                                            }

                                            if (synOptions == null || synControlConfig.field == '') {
                                                continue;
                                            }

                                            var isBelong = false;
                                            if (synOptions.belongID) {
                                                if ($ref.isString(synOptions.belongID) == true) {
                                                    isBelong = transactConfig.functionID == synOptions.belongID;
                                                }
                                                else if ($ref.isArray(synOptions.belongID) == true) {
                                                    isBelong = synOptions.belongID.indexOf(transactConfig.functionID) > -1;
                                                }
                                            }

                                            if (isBelong == true) {
                                                input.Items[synControlConfig.field] = {
                                                    FieldID: synControlConfig.field,
                                                    DataType: synOptions.dataType
                                                };
                                            }
                                        }
                                    }
                                    else {
                                        var synControlConfigs = synControlList.filter(function (item) {
                                            return item.field == input.DataFieldID && item.type == 'grid';
                                        });

                                        if (synControlConfigs && synControlConfigs.length > 0) {
                                            for (var k = 0; k < synControlConfigs.length; k++) {
                                                var synControlConfig = synControlConfigs[k];

                                                var el = syn.$l.get(synControlConfig.id + '_hidden') || syn.$l.get(synControlConfig.id);
                                                var synOptions = JSON.parse(el.getAttribute('syn-options'));

                                                if (synOptions == null) {
                                                    continue;
                                                }

                                                for (var l = 0; l < synOptions.columns.length; l++) {
                                                    var column = synOptions.columns[l];
                                                    var dataType = 'string'
                                                    switch (column.columnType) {
                                                        case 'checkbox':
                                                            dataType = 'bool';
                                                            break;
                                                        case 'numeric':
                                                            dataType = 'int';
                                                            break;
                                                        case 'date':
                                                            dataType = 'date';
                                                            break;
                                                    }

                                                    var isBelong = false;
                                                    if (column.data == 'Flag') {
                                                        isBelong = true;
                                                    }
                                                    else if (column.belongID) {
                                                        if ($ref.isString(column.belongID) == true) {
                                                            isBelong = transactConfig.functionID == column.belongID;
                                                        }
                                                        else if ($ref.isArray(column.belongID) == true) {
                                                            isBelong = column.belongID.indexOf(transactConfig.functionID) > -1;
                                                        }
                                                    }

                                                    if (isBelong == true) {
                                                        input.Items[column.data] = {
                                                            FieldID: column.data,
                                                            DataType: dataType
                                                        };
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            if ($this.$data && $this.$data.storeList.length > 0) {
                                                for (var k = 0; k < $this.$data.storeList.length; k++) {
                                                    var store = $this.$data.storeList[k];
                                                    if (store.storeType == 'Form' && store.dataSourceID == input.DataFieldID) {
                                                        for (var l = 0; l < store.columns.length; l++) {
                                                            var column = store.columns[l];
                                                            var isBelong = false;
                                                            if ($ref.isString(column.belongID) == true) {
                                                                isBelong = transactConfig.functionID == column.belongID;
                                                            }
                                                            else if ($ref.isArray(column.belongID) == true) {
                                                                isBelong = column.belongID.indexOf(transactConfig.functionID) > -1;
                                                            }

                                                            if (isBelong == true) {
                                                                input.Items[column.data] = {
                                                                    FieldID: column.data,
                                                                    DataType: column.dataType
                                                                };
                                                            }
                                                        }

                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (inputConfig.type == 'List') {
                                    var synControlConfigs = synControlList.filter(function (item) {
                                        return item.field == input.DataFieldID && item.type == 'grid';
                                    });

                                    if (synControlConfigs && synControlConfigs.length == 1) {
                                        var synControlConfig = synControlConfigs[0];

                                        var el = syn.$l.get(synControlConfig.id + '_hidden') || syn.$l.get(synControlConfig.id);
                                        var synOptions = JSON.parse(el.getAttribute('syn-options'));

                                        if (synOptions == null) {
                                            continue;
                                        }

                                        for (var k = 0; k < synOptions.columns.length; k++) {
                                            var column = synOptions.columns[k];
                                            var dataType = 'string'
                                            switch (column.columnType) {
                                                case 'checkbox':
                                                    dataType = 'bool';
                                                    break;
                                                case 'numeric':
                                                    dataType = 'int';
                                                    break;
                                                case 'date':
                                                    dataType = 'date';
                                                    break;
                                            }

                                            var isBelong = false;
                                            if (column.data == 'Flag') {
                                                isBelong = true;
                                            }
                                            else if (column.belongID) {
                                                if ($ref.isString(column.belongID) == true) {
                                                    isBelong = transactConfig.functionID == column.belongID;
                                                }
                                                else if ($ref.isArray(column.belongID) == true) {
                                                    isBelong = column.belongID.indexOf(transactConfig.functionID) > -1;
                                                }
                                            }

                                            if (isBelong == true) {
                                                input.Items[column.data] = {
                                                    FieldID: column.data,
                                                    DataType: dataType
                                                };
                                            }
                                        }
                                    }
                                    else {
                                        var isMapping = false;
                                        if ($this.$data && $this.$data.storeList.length > 0) {
                                            for (var k = 0; k < $this.$data.storeList.length; k++) {
                                                var store = $this.$data.storeList[k];
                                                if (store.storeType == 'Grid' && store.dataSourceID == input.DataFieldID) {
                                                    isMapping = true;
                                                    for (var l = 0; l < store.columns.length; l++) {
                                                        var column = store.columns[l];
                                                        var isBelong = false;
                                                        if ($ref.isString(column.belongID) == true) {
                                                            isBelong = transactConfig.functionID == column.belongID;
                                                        }
                                                        else if ($ref.isArray(column.belongID) == true) {
                                                            isBelong = column.belongID.indexOf(transactConfig.functionID) > -1;
                                                        }

                                                        if (isBelong == true) {
                                                            input.Items[column.data] = {
                                                                FieldID: column.data,
                                                                DataType: column.dataType
                                                            };
                                                        }
                                                    }

                                                    break;
                                                }
                                            }
                                        }

                                        if (isMapping == false) {
                                            syn.$l.eventLog('$w.transactionAction', '{0} 컬럼 ID 중복 또는 존재여부 확인 필요'.format(input.DataFieldID), 'Warning');
                                        }
                                    }
                                }

                                transactionObject.Inputs.push(input);
                            }
                        }

                        if (transactConfig.outputs) {
                            var outputs = transactConfig.outputs;
                            var outputsLength = outputs.length;
                            var synControls = $this.context.synControls;
                            for (var i = 0; i < outputsLength; i++) {
                                var outputConfig = outputs[i];
                                var output = {
                                    ResponseType: outputConfig.type,
                                    DataFieldID: outputConfig.dataFieldID ? outputConfig.dataFieldID : '',
                                    Items: {}
                                };

                                var synControlConfigs = null;
                                if (outputConfig.type == 'Form') {
                                    var synControlConfigs = synControlList.filter(function (item) {
                                        return item.formDataFieldID == output.DataFieldID && ['grid', 'chart', 'chartjs'].indexOf(item.type) == -1;
                                    });

                                    if (synControlConfigs && synControlConfigs.length > 0) {
                                        for (var k = 0; k < synControlConfigs.length; k++) {
                                            var synControlConfig = synControlConfigs[k];

                                            var el = syn.$l.get(synControlConfig.id + '_hidden') || syn.$l.get(synControlConfig.id);
                                            var options = el.getAttribute('syn-options');
                                            if (options == null) {
                                                continue;
                                            }

                                            var synOptions = null;

                                            try {
                                                synOptions = JSON.parse(options);
                                            } catch (e) {
                                                synOptions = eval('(' + options + ')');
                                            }

                                            if (synOptions == null || synControlConfig.field == '') {
                                                continue;
                                            }

                                            output.Items[synControlConfig.field] = {
                                                FieldID: synControlConfig.field,
                                                DataType: synOptions.dataType
                                            };

                                            if (outputConfig.clear == true) {
                                                if (synControls && synControls.length == 1) {
                                                    var bindingControlInfos = synControls.filter(function (item) {
                                                        return item.field == outputConfig.dataFieldID;
                                                    });

                                                    if (bindingControlInfos.length == 1) {
                                                        var controlInfo = bindingControlInfos[0];
                                                        if (controlInfo.module == null) {
                                                            continue;
                                                        }

                                                        var controlID = controlInfo.id;
                                                        var controlField = controlInfo.field;
                                                        var controlModule = null;
                                                        var currings = controlInfo.module.split('.');
                                                        if (currings.length > 0) {
                                                            for (var l = 0; l < currings.length; l++) {
                                                                var curring = currings[l];
                                                                if (controlModule) {
                                                                    controlModule = controlModule[curring];
                                                                }
                                                                else {
                                                                    controlModule = context[curring];
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            controlModule = context[controlInfo.module];
                                                        }

                                                        if (controlModule.clear) {
                                                            controlModule.clear(controlID);
                                                        }
                                                    }
                                                    else {
                                                        syn.$l.eventLog('$w.transactionAction', '{0} DataFieldID 중복 또는 존재여부 확인 필요'.format(outputConfig.dataFieldID), 'Warning');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        if ($this.$data && $this.$data.storeList.length > 0) {
                                            for (var k = 0; k < $this.$data.storeList.length; k++) {
                                                var store = $this.$data.storeList[k];
                                                if (store.storeType == 'Form' && store.dataSourceID == output.DataFieldID) {
                                                    for (var l = 0; l < store.columns.length; l++) {
                                                        var column = store.columns[l];

                                                        output.Items[column.data] = {
                                                            FieldID: column.data,
                                                            DataType: column.dataType
                                                        };
                                                    }

                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (outputConfig.type == 'Grid') {
                                    var synControlConfigs = synControlList.filter(function (item) {
                                        return item.field == output.DataFieldID && item.type == 'grid';
                                    });

                                    if (synControlConfigs && synControlConfigs.length == 1) {
                                        var synControlConfig = synControlConfigs[0];

                                        var el = syn.$l.get(synControlConfig.id + '_hidden') || syn.$l.get(synControlConfig.id);
                                        var synOptions = JSON.parse(el.getAttribute('syn-options'));

                                        if (synOptions == null) {
                                            continue;
                                        }

                                        for (var k = 0; k < synOptions.columns.length; k++) {
                                            var column = synOptions.columns[k];
                                            var dataType = 'string'
                                            switch (column.type) {
                                                case 'checkbox':
                                                    dataType = 'bool';
                                                    break;
                                                case 'numeric':
                                                    dataType = 'int';
                                                    break;
                                                case 'date':
                                                    dataType = 'date';
                                                    break;
                                            }

                                            output.Items[column.data] = {
                                                FieldID: column.data,
                                                DataType: dataType
                                            };
                                        }

                                        if (outputConfig.clear == true) {
                                            if (synControls && synControls.length > 0) {
                                                var bindingControlInfos = synControls.filter(function (item) {
                                                    return item.field == output.DataFieldID;
                                                });

                                                var controlInfo = bindingControlInfos[0];
                                                var controlModule = null;
                                                var currings = controlInfo.module.split('.');
                                                if (currings.length > 0) {
                                                    for (var i = 0; i < currings.length; i++) {
                                                        var curring = currings[i];
                                                        if (controlModule) {
                                                            controlModule = controlModule[curring];
                                                        }
                                                        else {
                                                            controlModule = context[curring];
                                                        }
                                                    }
                                                }
                                                else {
                                                    controlModule = context[controlInfo.module];
                                                }

                                                if (controlModule.clear) {
                                                    controlModule.clear(controlInfo.id);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        synControlConfigs = synControlList.filter(function (item) {
                                            return item.field == output.DataFieldID && ['chart', 'chartjs'].indexOf(item.type) > -1;
                                        });

                                        if (synControlConfigs && synControlConfigs.length == 1) {
                                            var synControlConfig = synControlConfigs[0];

                                            var el = syn.$l.get(synControlConfig.id + '_hidden') || syn.$l.get(synControlConfig.id);
                                            var synOptions = JSON.parse(el.getAttribute('syn-options'));

                                            if (synOptions == null) {
                                                continue;
                                            }

                                            for (var k = 0; k < synOptions.series.length; k++) {
                                                var column = synOptions.series[k];
                                                output.Items[column.columnID] = {
                                                    FieldID: column.columnID,
                                                    DataType: column.dataType ? column.dataType : 'string'
                                                };
                                            }

                                            if (outputConfig.clear == true) {
                                                if (synControls && synControls.length == 1) {
                                                    var bindingControlInfos = synControls.filter(function (item) {
                                                        return item.field == outputConfig.dataFieldID;
                                                    });

                                                    if (bindingControlInfos.length == 1) {
                                                        var controlInfo = bindingControlInfos[0];
                                                        if (controlInfo.module == null) {
                                                            continue;
                                                        }

                                                        var controlID = controlInfo.id;
                                                        var controlField = controlInfo.field;
                                                        var controlModule = null;
                                                        var currings = controlInfo.module.split('.');
                                                        if (currings.length > 0) {
                                                            for (var l = 0; l < currings.length; l++) {
                                                                var curring = currings[l];
                                                                if (controlModule) {
                                                                    controlModule = controlModule[curring];
                                                                }
                                                                else {
                                                                    controlModule = context[curring];
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            controlModule = context[controlInfo.module];
                                                        }

                                                        if (controlModule.clear) {
                                                            controlModule.clear(controlID);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            var isMapping = false;
                                            if ($this.$data && $this.$data.storeList.length > 0) {
                                                for (var k = 0; k < $this.$data.storeList.length; k++) {
                                                    var store = $this.$data.storeList[k];
                                                    if (store.storeType == 'Grid' && store.dataSourceID == output.DataFieldID) {
                                                        isMapping = true;

                                                        for (var l = 0; l < store.columns.length; l++) {
                                                            var column = store.columns[l];

                                                            output.Items[column.data] = {
                                                                FieldID: column.data,
                                                                DataType: column.dataType
                                                            };
                                                        }

                                                        break;
                                                    }
                                                }
                                            }

                                            if (isMapping == false) {
                                                syn.$l.eventLog('$w.transactionAction', '{0} DataFieldID 중복 또는 존재여부 확인 필요'.format(output.DataFieldID), 'Warning');
                                            }
                                        }
                                    }
                                }

                                transactionObject.Outputs.push(output);
                            }
                        }

                        $this.config.transactions.push(transactionObject);
                        syn.$w.transaction(transactConfig.functionID, function (responseObject, addtionalData) {
                            var error = null;
                            if (responseObject && responseObject.errorText.length > 0) {
                                error = responseObject.errorText[0];
                                syn.$l.eventLog('$w.transaction.callback', error, 'Error');
                            }

                            var callbackResult = null;
                            if (transactConfig.callback && $ref.isFunction(transactConfig.callback) == true) {
                                callbackResult = transactConfig.callback(error, responseObject, addtionalData);
                            }

                            if (callbackResult == null || callbackResult === true) {
                                if ($this.afterTransaction) {
                                    $this.afterTransaction(null, transactConfig.functionID, responseObject, addtionalData);
                                }
                            }
                            else if (callbackResult === false) {
                                if ($this.afterTransaction) {
                                    $this.afterTransaction('callbackResult continue false', transactConfig.functionID, null, null);
                                }
                            }

                            if (transactConfig.callback && $ref.isArray(transactConfig.callback) == true) {
                                setTimeout(function () {
                                    var eventData = {
                                        error: error,
                                        responseObject: responseObject,
                                        addtionalData: addtionalData
                                    }
                                    syn.$l.trigger(transactConfig.callback[0], transactConfig.callback[1], eventData);
                                });
                            }
                        }, transactConfig.triggerMessage);
                    }
                    else {
                        if (syn.$w.closeProgressMessage) {
                            syn.$w.closeProgressMessage();
                        }

                        if ($this.afterTransaction) {
                            $this.afterTransaction('beforeTransaction continue false', transactConfig.functionID, null, null);
                        }
                    }
                } catch (error) {
                    syn.$l.eventLog('$w.transactionAction', error, 'Error');

                    if (syn.$w.closeProgressMessage) {
                        syn.$w.closeProgressMessage();
                    }
                }
            }
        },

        /*
        var directObject = {
            ProgramID: 'SVU',
            BusinessID: 'ZZW',
            SystemID: 'BP01',
            TransactionID: 'ZZA010',
            FunctionID: 'L01',
            DataTransactionInterface: 'Row|Form',
            transactionResult: true,
            InputObjects: [
                { prop: 'ApplicationID', val: '' },
                { prop: 'ProjectID', val: '' },
                { prop: 'TransactionID', val: '' }
            ]
        };

        syn.$w.transactionDirect(directObject, function (responseData, addtionalData) {
            debugger;
        });
        */
        transactionDirect(directObject, callback) {
            directObject.transactionResult = $object.isNullOrUndefined(directObject.transactionResult) == true ? true : directObject.transactionResult === true;
            var transactionObject = syn.$w.transactionObject(directObject.FunctionID, 'Json');

            transactionObject.ProgramID = directObject.ProgramID;
            transactionObject.BusinessID = directObject.BusinessID;
            transactionObject.SystemID = directObject.SystemID;
            transactionObject.TransactionID = directObject.TransactionID;
            transactionObject.DataTransactionInterface = directObject.DataTransactionInterface || 'Row|Form';
            transactionObject.transactionResult = $object.isNullOrUndefined(directObject.transactionResult) == true ? true : directObject.transactionResult === true;

            if (globalRoot.devicePlatform === 'node') {
                transactionObject.ScreenID = directObject.ScreenID || directObject.TransactionID;
            }
            else {
                transactionObject.ScreenID = syn.$w.pageScript.replace('$', '');
            }

            if (directObject.InputLists && directObject.InputLists.length > 0) {
                for (var key in directObject.InputLists) {
                    transactionObject.Inputs.push(directObject.InputLists[key]);
                }
                transactionObject.InputsItemCount.push(directObject.InputLists.length);
            }
            else {
                transactionObject.Inputs.push(directObject.InputObjects);
                transactionObject.InputsItemCount.push(1);
            }

            syn.$w.executeTransaction(directObject, transactionObject, function (responseData, addtionalData) {
                if (callback) {
                    callback(responseData, addtionalData);
                }
            });
        },

        transaction(functionID, callback, options) {
            var errorText = '';
            try {
                if (syn.$w.domainTransactionLoaderStart) {
                    syn.$w.domainTransactionLoaderStart();
                }

                options = syn.$w.argumentsExtend({
                    message: '',
                    dynamic: 'N',
                    authorize: 'N',
                    commandType: 'D',
                    returnType: 'Json',
                    transactionScope: 'N',
                    transactionLog: 'Y'
                }, options);

                if (options) {

                    if ($string.isNullOrEmpty(options.message) == false && syn.$w.progressMessage) {
                        syn.$w.progressMessage(options.message);
                    }
                }

                var responseObject = {
                    errorText: [],
                    outputStat: []
                };

                if ($this && $this.config && $this.config.transactions) {
                    var transactions = $this.config.transactions.filter(function (item) {
                        return item.functionID == functionID;
                    });

                    if (transactions.length == 1) {
                        var transaction = transactions[0];
                        var transactionObject = syn.$w.transactionObject(transaction.functionID, 'Json');

                        transactionObject.programID = $this.config.programID;
                        transactionObject.businessID = $this.config.businessID;
                        transactionObject.systemID = $this.config.systemID;
                        transactionObject.transactionID = $this.config.transactionID;
                        transactionObject.screenID = syn.$w.pageScript.replace('$', '');
                        transactionObject.options = options;

                        // synControls 컨트롤 목록
                        var synControls = $this.context.synControls;

                        // Input Mapping
                        var inputLength = transaction.inputs.length;
                        for (var inputIndex = 0; inputIndex < inputLength; inputIndex++) {
                            var inputMapping = transaction.inputs[inputIndex];
                            var inputObjects = [];

                            if (inputMapping.requestType == 'Row') {
                                var bindingControlInfos = synControls.filter(function (item) {
                                    return item.field == inputMapping.dataFieldID;
                                });

                                if (bindingControlInfos.length == 1) {
                                    var controlInfo = bindingControlInfos[0];

                                    if (['grid', 'chart'].indexOf(controlInfo.type) > -1) {
                                        var dataFieldID = inputMapping.dataFieldID; // syn-datafield

                                        var controlValue = '';
                                        if (synControls && synControls.length > 0) {
                                            bindingControlInfos = synControls.filter(function (item) {
                                                return item.field == dataFieldID;
                                            });

                                            if (bindingControlInfos.length == 1) {
                                                var controlInfo = bindingControlInfos[0];
                                                var controlModule = null;
                                                var currings = controlInfo.module.split('.');
                                                if (currings.length > 0) {
                                                    for (var i = 0; i < currings.length; i++) {
                                                        var curring = currings[i];
                                                        if (controlModule) {
                                                            controlModule = controlModule[curring];
                                                        }
                                                        else {
                                                            controlModule = context[curring];
                                                        }
                                                    }
                                                }
                                                else {
                                                    controlModule = context[controlInfo.module];
                                                }

                                                var el = syn.$l.get(controlInfo.id + '_hidden') || syn.$l.get(controlInfo.id);
                                                var synOptions = JSON.parse(el.getAttribute('syn-options'));

                                                for (var k = 0; k < synOptions.columns.length; k++) {
                                                    var column = synOptions.columns[k];
                                                    if (column.validators && $validation.transactionValidate) {
                                                        column.controlText = synOptions.controlText || '';
                                                        var isValidate = $validation.transactionValidate(controlModule, controlInfo, column, inputMapping.requestType);

                                                        if (isValidate == false) {
                                                            if ($this.hook.afterTransaction) {
                                                                $this.hook.afterTransaction('validators continue false', functionID, column, null);
                                                            }

                                                            if (syn.$w.domainTransactionLoaderEnd) {
                                                                syn.$w.domainTransactionLoaderEnd();
                                                            }

                                                            return false;
                                                        }
                                                    }
                                                }

                                                inputObjects = controlModule.getValue(controlInfo.id, 'Row', inputMapping.items)[0];
                                            }
                                            else {
                                                syn.$l.eventLog('$w.transaction', '"{0}" Row List Input Mapping 확인 필요'.format(dataFieldID), 'Warning');
                                            }
                                        }
                                    }
                                    else {
                                        for (var key in inputMapping.items) {
                                            var meta = inputMapping.items[key];
                                            var dataFieldID = key; // syn-datafield
                                            var fieldID = meta.fieldID; // DbColumnID
                                            var dataType = meta.dataType;
                                            var serviceObject = { prop: fieldID, val: '' };

                                            var controlValue = '';
                                            if (synControls.length > 0) {
                                                bindingControlInfos = synControls.filter(function (item) {
                                                    return item.field == dataFieldID && item.formDataFieldID == inputMapping.dataFieldID;
                                                });

                                                if (bindingControlInfos.length == 1) {
                                                    var controlInfo = bindingControlInfos[0];
                                                    var controlModule = null;
                                                    var currings = controlInfo.module.split('.');
                                                    if (currings.length > 0) {
                                                        for (var i = 0; i < currings.length; i++) {
                                                            var curring = currings[i];
                                                            if (controlModule) {
                                                                controlModule = controlModule[curring];
                                                            }
                                                            else {
                                                                controlModule = context[curring];
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        controlModule = context[controlInfo.module];
                                                    }

                                                    var el = syn.$l.get(controlInfo.id + '_hidden') || syn.$l.get(controlInfo.id);
                                                    var synOptions = JSON.parse(el.getAttribute('syn-options'));

                                                    if (synOptions.validators && $validation.transactionValidate) {
                                                        var isValidate = $validation.transactionValidate(controlModule, controlInfo, synOptions, inputMapping.requestType);

                                                        if (isValidate == false) {
                                                            if ($this.hook.afterTransaction) {
                                                                $this.hook.afterTransaction('validators continue false', functionID, synOptions, null);
                                                            }

                                                            if (syn.$w.domainTransactionLoaderEnd) {
                                                                syn.$w.domainTransactionLoaderEnd();
                                                            }

                                                            return false;
                                                        }
                                                    }

                                                    controlValue = controlModule.getValue(controlInfo.id, meta);

                                                    if ($object.isNullOrUndefined(controlValue) == true && dataType == 'int') {
                                                        controlValue = 0;
                                                    }
                                                }
                                                else {
                                                    syn.$l.eventLog('$w.transaction', '"{0}" Row Control Input Mapping 확인 필요'.format(dataFieldID), 'Warning');
                                                }
                                            }

                                            serviceObject.val = controlValue;
                                            inputObjects.push(serviceObject);
                                        }
                                    }
                                }
                                else {
                                    if ($this.$data && $this.$data.storeList.length > 0) {
                                        for (var key in inputMapping.items) {
                                            var isMapping = false;
                                            var meta = inputMapping.items[key];
                                            var dataFieldID = key; // syn-datafield
                                            var fieldID = meta.fieldID; // DbColumnID
                                            var dataType = meta.dataType;
                                            var serviceObject = { prop: fieldID, val: '' };

                                            var controlValue = '';
                                            for (var k = 0; k < $this.$data.storeList.length; k++) {
                                                var store = $this.$data.storeList[k];
                                                if (store.storeType == 'Form' && store.dataSourceID == inputMapping.dataFieldID) {
                                                    isMapping = true;
                                                    bindingControlInfos = store.columns.filter(function (item) {
                                                        return item.data == dataFieldID;
                                                    });

                                                    if (bindingControlInfos.length == 1) {
                                                        var controlInfo = bindingControlInfos[0];
                                                        controlValue = $this.store[store.dataSourceID][controlInfo.data];

                                                        if (!controlValue && dataType == 'int') {
                                                            controlValue = 0;
                                                        }

                                                        if ($object.isNullOrUndefined(controlValue) == true) {
                                                            controlValue = '';
                                                        }
                                                    }
                                                    else {
                                                        syn.$l.eventLog('$w.transaction', '"{0}" Row Input Mapping 확인 필요'.format(dataFieldID), 'Warning');
                                                    }

                                                    break;
                                                }
                                            }

                                            if (isMapping == true) {
                                                serviceObject.val = controlValue;
                                                inputObjects.push(serviceObject);
                                            }
                                            else {
                                                syn.$l.eventLog('$w.transaction', '{0} Row 컨트롤 ID 중복 또는 존재여부 확인 필요'.format(inputMapping.dataFieldID), 'Warning');
                                            }
                                        }
                                    }
                                }

                                transactionObject.inputs.push(inputObjects); // transactionObject.inputs.push($ref.clone(inputObjects));
                                transactionObject.inputsItemCount.push(1);
                            }
                            else if (inputMapping.requestType == 'List') {
                                var dataFieldID = inputMapping.dataFieldID; // syn-datafield

                                var controlValue = '';
                                if (synControls && synControls.length > 0) {
                                    var bindingControlInfos = synControls.filter(function (item) {
                                        return item.field == dataFieldID;
                                    });

                                    if (bindingControlInfos.length == 1) {
                                        var controlInfo = bindingControlInfos[0];
                                        var controlModule = null;
                                        var currings = controlInfo.module.split('.');
                                        if (currings.length > 0) {
                                            for (var i = 0; i < currings.length; i++) {
                                                var curring = currings[i];
                                                if (controlModule) {
                                                    controlModule = controlModule[curring];
                                                }
                                                else {
                                                    controlModule = context[curring];
                                                }
                                            }
                                        }
                                        else {
                                            controlModule = context[controlInfo.module];
                                        }

                                        var el = syn.$l.get(controlInfo.id + '_hidden') || syn.$l.get(controlInfo.id);
                                        var synOptions = JSON.parse(el.getAttribute('syn-options'));

                                        for (var k = 0; k < synOptions.columns.length; k++) {
                                            var column = synOptions.columns[k];
                                            column.controlText = synOptions.controlText || '';
                                            if (column.validators && $validation.transactionValidate) {
                                                var isValidate = $validation.transactionValidate(controlModule, controlInfo, column, inputMapping.requestType);

                                                if (isValidate == false) {
                                                    if ($this.hook.afterTransaction) {
                                                        $this.hook.afterTransaction('validators continue false', functionID, column, null);
                                                    }

                                                    if (syn.$w.domainTransactionLoaderEnd) {
                                                        syn.$w.domainTransactionLoaderEnd();
                                                    }

                                                    return false;
                                                }
                                            }
                                        }

                                        inputObjects = controlModule.getValue(controlInfo.id, 'List', inputMapping.items);
                                    }
                                    else {
                                        var isMapping = false;
                                        if ($this.$data && $this.$data.storeList.length > 0) {
                                            for (var k = 0; k < $this.$data.storeList.length; k++) {
                                                var store = $this.$data.storeList[k];
                                                if (store.storeType == 'Grid' && store.dataSourceID == dataFieldID) {
                                                    isMapping = true;
                                                    var bindingInfo = $this.$data.bindingList.find(function (item) {
                                                        return (item.dataSourceID == store.dataSourceID && item.controlType == 'grid');
                                                    });

                                                    if (bindingInfo) {
                                                        inputObjects = $this.store[store.dataSourceID][bindingInfo.dataFieldID];
                                                    }
                                                    else {
                                                        var controlValue = [];
                                                        var items = $this.store[store.dataSourceID];
                                                        var length = items.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item = items[i];

                                                            var row = [];
                                                            for (var key in item) {
                                                                var serviceObject = { prop: key, val: item[key] };
                                                                row.push(serviceObject);
                                                            }
                                                            controlValue.push(row);
                                                        }

                                                        inputObjects = controlValue;
                                                    }

                                                    break;
                                                }
                                            }
                                        }

                                        if (isMapping == false) {
                                            syn.$l.eventLog('$w.transaction', '"{0}" List Input Mapping 확인 필요'.format(dataFieldID), 'Warning');
                                        }
                                    }
                                }

                                for (var key in inputObjects) {
                                    transactionObject.inputs.push(inputObjects[key]);
                                }
                                transactionObject.inputsItemCount.push(inputObjects.length);
                            }
                        }

                        syn.$w.executeTransaction($this.config, transactionObject, function (responseData, addtionalData) {
                            var isDynamicOutput = false;
                            for (var i = 0; i < transaction.outputs.length; i++) {
                                if (transaction.outputs[i].responseType == 'Dynamic') {
                                    isDynamicOutput = true;
                                    break;
                                }
                            }

                            if (isDynamicOutput == true) {
                                responseObject.outputStat.push({
                                    fieldID: 'Dynamic',
                                    Count: 1,
                                    DynamicData: responseData
                                });
                            }
                            else {
                                if (responseData.length == transaction.outputs.length) {
                                    // synControls 컨트롤 목록
                                    var synControls = $this.context.synControls;

                                    // Output Mapping을 설정
                                    var outputLength = transaction.outputs.length;
                                    for (var outputIndex = 0; outputIndex < outputLength; outputIndex++) {
                                        var outputMapping = transaction.outputs[outputIndex];
                                        var dataMapItem = responseData[outputIndex];
                                        var responseFieldID = dataMapItem['id'];
                                        var outputData = dataMapItem['value'];

                                        if ($this.outputDataBinding) {
                                            $this.outputDataBinding(functionID, responseFieldID, outputData);
                                        }

                                        if (outputMapping.responseType == 'Form') {
                                            if ($object.isNullOrUndefined(outputData) == true || outputData.length) {
                                                responseObject.outputStat.push({
                                                    fieldID: responseFieldID,
                                                    Count: 0
                                                });
                                            }
                                            else {
                                                responseObject.outputStat.push({
                                                    fieldID: responseFieldID,
                                                    Count: 1
                                                });

                                                for (var key in outputMapping.items) {
                                                    var meta = outputMapping.items[key];
                                                    var dataFieldID = key; // syn-datafield
                                                    var fieldID = meta.fieldID; // DbColumnID

                                                    var controlValue = outputData[fieldID];
                                                    if (controlValue != undefined && synControls && synControls.length > 0) {
                                                        var bindingControlInfos = synControls.filter(function (item) {
                                                            return item.field == dataFieldID && item.formDataFieldID == outputMapping.dataFieldID;
                                                        });

                                                        if (bindingControlInfos.length == 1) {
                                                            var controlInfo = bindingControlInfos[0];
                                                            var controlModule = null;
                                                            var currings = controlInfo.module.split('.');
                                                            if (currings.length > 0) {
                                                                for (var i = 0; i < currings.length; i++) {
                                                                    var curring = currings[i];
                                                                    if (controlModule) {
                                                                        controlModule = controlModule[curring];
                                                                    }
                                                                    else {
                                                                        controlModule = context[curring];
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                controlModule = context[controlInfo.module];
                                                            }

                                                            controlModule.setValue(controlInfo.id, controlValue, meta);
                                                        }
                                                        else {
                                                            var isMapping = false;
                                                            if ($this.$data && $this.$data.storeList.length > 0) {
                                                                for (var k = 0; k < $this.$data.storeList.length; k++) {
                                                                    var store = $this.$data.storeList[k];
                                                                    if ($object.isNullOrUndefined($this.store[store.dataSourceID]) == true) {
                                                                        $this.store[store.dataSourceID] = {};
                                                                    }

                                                                    if (store.storeType == 'Form' && store.dataSourceID == outputMapping.dataFieldID) {
                                                                        isMapping = true;
                                                                        bindingControlInfos = store.columns.filter(function (item) {
                                                                            return item.data == dataFieldID;
                                                                        });

                                                                        if (bindingControlInfos.length == 1) {
                                                                            $this.store[store.dataSourceID][dataFieldID] = controlValue;
                                                                        }

                                                                        break;
                                                                    }
                                                                }
                                                            }

                                                            if (isMapping == false) {
                                                                errorText = '"{0}" Form Output Mapping 확인 필요'.format(dataFieldID);
                                                                responseObject.errorText.push(errorText);
                                                                syn.$l.eventLog('$w.transaction', errorText, 'Error');
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (outputMapping.responseType == 'Grid') {
                                            if (outputData.length && outputData.length > 0) {
                                                responseObject.outputStat.push({
                                                    fieldID: responseFieldID,
                                                    Count: outputData.length
                                                });
                                                var dataFieldID = outputMapping.dataFieldID; // syn-datafield
                                                if (synControls && synControls.length > 0) {
                                                    var bindingControlInfos = synControls.filter(function (item) {
                                                        return item.field == dataFieldID;
                                                    });

                                                    if (bindingControlInfos.length == 1) {
                                                        var controlInfo = bindingControlInfos[0];
                                                        var controlModule = null;
                                                        var currings = controlInfo.module.split('.');
                                                        if (currings.length > 0) {
                                                            for (var i = 0; i < currings.length; i++) {
                                                                var curring = currings[i];
                                                                if (controlModule) {
                                                                    controlModule = controlModule[curring];
                                                                }
                                                                else {
                                                                    controlModule = context[curring];
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            controlModule = context[controlInfo.module];
                                                        }

                                                        controlModule.setValue(controlInfo.id, outputData, outputMapping.items);
                                                    }
                                                    else {
                                                        var isMapping = false;
                                                        if ($this.$data && $this.$data.storeList.length > 0) {
                                                            for (var k = 0; k < $this.$data.storeList.length; k++) {
                                                                var store = $this.$data.storeList[k];
                                                                if ($object.isNullOrUndefined($this.store[store.dataSourceID]) == true) {
                                                                    $this.store[store.dataSourceID] = [];
                                                                }

                                                                if (store.storeType == 'Grid' && store.dataSourceID == outputMapping.dataFieldID) {
                                                                    isMapping = true;
                                                                    var bindingInfos = $this.$data.bindingList.filter(function (item) {
                                                                        return (item.dataSourceID == store.dataSourceID && item.controlType == 'grid');
                                                                    });

                                                                    var length = outputData.length;
                                                                    for (var i = 0; i < length; i++) {
                                                                        outputData[i].Flag = 'R';
                                                                    }

                                                                    if (bindingInfos.length > 0) {
                                                                        for (var binding_i = 0; binding_i < bindingInfos.length; binding_i++) {
                                                                            var bindingInfo = bindingInfos[binding_i];
                                                                            $this.store[store.dataSourceID][bindingInfo.dataFieldID] = outputData;
                                                                        }
                                                                    }
                                                                    else {
                                                                        $this.store[store.dataSourceID] = outputData;
                                                                    }
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        if (isMapping == false) {
                                                            errorText = '"{0}" Grid Output Mapping 확인 필요'.format(dataFieldID);
                                                            responseObject.errorText.push(errorText);
                                                            syn.$l.eventLog('$w.transaction', errorText, 'Error');
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                responseObject.outputStat.push({
                                                    fieldID: responseFieldID,
                                                    Count: 0
                                                });
                                            }
                                        }
                                        else if (outputMapping.responseType == 'Chart') {
                                            if (outputData.length && outputData.length > 0) {
                                                responseObject.outputStat.push({
                                                    fieldID: responseFieldID,
                                                    Count: outputData.length
                                                });
                                                var dataFieldID = outputMapping.dataFieldID; // syn-datafield

                                                if (synControls && synControls.length > 0) {
                                                    var bindingControlInfos = synControls.filter(function (item) {
                                                        return item.field == dataFieldID;
                                                    });

                                                    if (bindingControlInfos.length == 1) {
                                                        var controlInfo = bindingControlInfos[0];
                                                        var controlModule = null;
                                                        var currings = controlInfo.module.split('.');
                                                        if (currings.length > 0) {
                                                            for (var i = 0; i < currings.length; i++) {
                                                                var curring = currings[i];
                                                                if (controlModule) {
                                                                    controlModule = controlModule[curring];
                                                                }
                                                                else {
                                                                    controlModule = context[curring];
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            controlModule = context[controlInfo.module];
                                                        }

                                                        controlModule.setValue(controlInfo.id, outputData, outputMapping.items);
                                                    }
                                                    else {
                                                        errorText = '"{0}" Chart Output Mapping 확인 필요'.format(dataFieldID);
                                                        responseObject.errorText.push(errorText);
                                                        syn.$l.eventLog('$w.transaction', errorText, 'Error');
                                                    }
                                                }
                                            }
                                            else {
                                                responseObject.outputStat.push({
                                                    fieldID: responseFieldID,
                                                    Count: 0
                                                });
                                            }
                                        }
                                    }
                                }
                                else {
                                    errorText = '"{0}" 기능의 거래 응답 정의와 데이터 갯수가 다릅니다'.format(transaction.functionID);
                                    responseObject.errorText.push(errorText);
                                    syn.$l.eventLog('$w.transaction', errorText, 'Error');
                                }
                            }

                            if (callback) {
                                callback(responseObject, addtionalData);
                            }

                            if (syn.$w.domainTransactionLoaderEnd) {
                                syn.$w.domainTransactionLoaderEnd();
                            }
                        });
                    }
                    else {
                        errorText = '"{0}" 거래 중복 또는 존재여부 확인 필요'.format(functionID);
                        responseObject.errorText.push(errorText);
                        syn.$l.eventLog('$w.transaction', errorText, 'Error');

                        if (callback) {
                            callback(responseObject);
                        }

                        if (syn.$w.domainTransactionLoaderEnd) {
                            syn.$w.domainTransactionLoaderEnd();
                        }
                    }
                }
                else {
                    errorText = '화면 매핑 정의 데이터가 없습니다';
                    responseObject.errorText.push(errorText);
                    syn.$l.eventLog('$w.transaction', errorText, 'Error');

                    if (callback) {
                        callback(responseObject);
                    }

                    if (syn.$w.domainTransactionLoaderEnd) {
                        syn.$w.domainTransactionLoaderEnd();
                    }
                }
            } catch (error) {
                syn.$l.eventLog('$w.transaction', error, 'Error');

                if (syn.$w.domainTransactionLoaderEnd) {
                    syn.$w.domainTransactionLoaderEnd();
                }
            }
        },

        scrollToTop() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            if (scrollTop > 0) {
                context.requestAnimationFrame(syn.$w.scrollToTop);
                context.scrollTo(0, scrollTop - scrollTop / 8);
            }
        },

        setFavicon(url) {
            var favicon = document.querySelector('link[rel="icon"]');

            if (favicon) {
                favicon.href = url;
            } else {
                var link = document.createElement('link');
                link.rel = 'icon';
                link.href = url;

                document.head.appendChild(link);
            }
        },

        fileDownload(url, fileName) {
            var downloadFileName = '';
            if (fileName) {
                downloadFileName = fileName;
            }
            else {
                var match = url.toString().match(/.*\/(.+?)\./);
                if (match && match.length > 1) {
                    downloadFileName = match[1];
                }
            }

            var link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', downloadFileName);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        sleep(ms, callback) {
            if (callback) {
                setTimeout(callback, ms);
            }
            else if (globalRoot.Promise) {
                return new Promise(function (resolve) {
                    return setTimeout(resolve, ms);
                });
            }
            else {
                syn.$l.eventLog('$w.sleep', '지원하지 않는 기능. 매개변수 확인 필요', 'Debug');
            }
        },

        purge(el) {
            var a = el.attributes, i, l, n;
            if (a) {
                for (i = a.length - 1; i >= 0; i -= 1) {
                    n = a[i].name;
                    if (typeof el[n] === 'function') {
                        el[n] = null;
                    }
                }
            }
            a = el.childNodes;
            if (a) {
                l = a.length;
                for (i = 0; i < l; i += 1) {
                    syn.$w.purge(el.childNodes[i]);
                }
            }
        }
    });

    if (syn && !syn.Config) {
        syn.Config = {};
    }

    syn.$w = $webform;
    if (globalRoot.devicePlatform === 'node') {
        var fs = require('fs');
        var path = require('path');

        if (process.env.SYN_CONFIG) {
            syn.Config = JSON.parse(process.env.SYN_CONFIG);
        }

        if (syn.Config && $string.isNullOrEmpty(syn.Config.DataSourceFilePath) == true) {
            syn.Config.DataSourceFilePath = path.join(process.cwd(), 'BusinessContract/Database/DataSource.xml');
        }

        delete syn.$w.isPageLoad;
        delete syn.$w.pageReadyTimeout;
        delete syn.$w.eventAddReady;
        delete syn.$w.eventRemoveReady;
        delete syn.$w.moduleReadyIntervalID;
        delete syn.$w.remainingReadyIntervalID;
        delete syn.$w.remainingReadyCount;
        delete syn.$w.defaultControlOptions;
        delete syn.$w.initializeScript;
        delete syn.$w.innerHTML;
        delete syn.$w.innerText;
        delete syn.$w.activeControl;
        delete syn.$w.hasAutoFocus;
        delete syn.$w.createTouchEvent;
        delete syn.$w.contentLoaded;
        delete syn.$w.addReadyCount;
        delete syn.$w.removeReadyCount;
        delete syn.$w.createSelection;
        delete syn.$w.getTriggerOptions;
        delete syn.$w.triggerAction;
        delete syn.$w.transactionAction;
        delete syn.$w.transaction;
        delete syn.$w.scrollToTop;
        delete syn.$w.setFavicon;
        delete syn.$w.fileDownload;
        delete syn.$w.sleep;
    }
    else {
        if (context.CefSharp) {
            syn.bindObjects = syn.bindObjects || [];
            if (context.contextCreatedData) {
                syn.Config = context.contextCreatedData.Config;
                var contextData = $webform.argumentsExtend(context.contextCreatedData, {});
                delete contextData.Config;

                syn.ContextData = contextData;
            }

            if (CefSharp.IsObjectCached('bound') == true) {
                var object = {};
                object.BindID = 'bound';
                object.Success = true;
                object.TypeName = bound.toString();
                syn.bindObjects.push(object);
            }
        }
        else {
            var pathname = location.pathname;
            if (pathname.split('/').length > 0) {
                var filename = pathname.split('/')[location.pathname.split('/').length - 1];
                $webform.extend({ pageScript: '$' + (filename.indexOf('.') > -1 ? filename.substring(0, filename.indexOf('.')) : filename) });
            }

            syn.$l.addEvent(context, 'load', function () {
                var mod = context[syn.$w.pageScript];
                if (mod && mod.hook.windowLoad) {
                    mod.hook.windowLoad();
                }
            });

            var urlArgs = syn.$r.getCookie('syn.iscache') == 'true' ? '' : '?bust=' + new Date().getTime();
            var isAsyncLoad = syn.$b.isIE == false;

            globalRoot.isLoadConfig = false;
            if (context.synConfig) {
                syn.Config = syn.$w.argumentsExtend(synConfig, syn.Config);
                context.synConfig = undefined;

                globalRoot.isLoadConfig = true;
                setTimeout(async function () {
                    await $webform.contentLoaded();
                });
            }
            else {
                $webform.loadJson('/' + (context.synConfigName || 'syn.config.json') + urlArgs, null, function (setting, json) {
                    syn.Config = syn.$w.argumentsExtend(json, syn.Config);

                    globalRoot.isLoadConfig = true;
                    setTimeout(async function () {
                        await $webform.contentLoaded();
                    });
                }, null, isAsyncLoad);
            }

            if (globalRoot.devicePlatform === 'browser') {
                syn.$b.appName = syn.Config.HostName;
                syn.$b.appCodeName = syn.Config.ApplicationID;
            }
        }
    }
})(globalRoot);

/// <reference path='../syn.core.js' />
/// <reference path='../syn.webform.js' />
(function (context, $webform) {
    'use strict';
    if (!$webform) {
        $webform = new syn.module();
    }

    var document = null;
    if (globalRoot.devicePlatform === 'node') {
    }
    else {
        document = context.document;
    }

    $webform.extend({
        method: 'POST',

        setServiceObject(value) {
            var message = typeof value == 'string' ? value : JSON.stringify(value);
            syn.$l.eventLog('$w.setServiceObject', message, 'Verbose');
            return this;
        },

        setServiceClientHeader(xhr) {
            var isContinue = true;
            xhr.setRequestHeader('CertificationKey', 'UUNOLkV4cGVydEFwcA==');

            try {
                return isContinue;
            }
            finally {
                isContinue = null;
            }
            return this;
        },

        xmlParser(xml) {
            var parser = new globalRoot.DOMParser();
            return parser.parseFromString(xml, 'text/xml');
        },

        proxyHttp(url) {
            return new Proxy({}, {
                get: function get(target, path) {
                    return async function (raw, method, headers) {
                        if ($ref.isString(raw) == true) {
                            if ($object.isNullOrUndefined(method) == true) {
                                method = 'POST';
                            }

                            if ($object.isNullOrUndefined(headers) == true) {
                                headers = new Headers();
                                headers.append("Content-Type", "application/json");
                            }

                            var data = {
                                method: method,
                                headers: headers,
                                body: raw,
                                redirect: 'follow'
                            };

                            var response = await fetch(url + "/" + path, data);
                        }
                        else {
                            if ($object.isNullOrUndefined(method) == true) {
                                method = 'GET';
                            }

                            var data = Object.assign({}, {
                                method: method,
                                headers: null,
                                redirect: 'follow'
                            }, raw || {});

                            var response = await fetch(url + "/" + path, data);
                        }

                        if (response.ok == true) {
                            return response.json();
                        }
                        return Promise.resolve({ error: 'Request 정보 확인 필요' });
                    };
                }
            });
        },

        xmlHttp() {
            return new globalThis.XMLHttpRequest();
        },

        // syn.$w.loadScript('/js/script.js');
        loadScript(url, scriptID) {
            var head;
            var resourceID;
            if (document.getElementsByTagName('head')) {
                head = document.getElementsByTagName('head')[0];
            }
            else {
                document.documentElement.insertBefore(document.createElement('head'), document.documentElement.firstChild);
                head = document.getElementsByTagName('head')[0];
            }

            resourceID = scriptID || 'id_' + syn.$l.random();

            var el = document.createElement('script');

            el.setAttribute('type', 'text/javascript');
            el.setAttribute('src', url + (url.indexOf('?') > -1 ? '&' : '?') + 'noCache=' + (new Date()).getTime());
            el.setAttribute('id', resourceID);

            head.insertBefore(el, head.firstChild);

            return this;
        },

        // syn.$w.loadStyle('/css/style.css');
        loadStyle(url, styleID) {
            var head;
            var resourceID;
            if (document.getElementsByTagName('head')) {
                head = document.getElementsByTagName('head')[0];
            }
            else {
                document.documentElement.insertBefore(document.createElement('head'), document.documentElement.firstChild);
                head = document.getElementsByTagName('head')[0];
            }

            resourceID = styleID || 'id_' + syn.$l.random();

            var el = document.createElement('link');

            el.setAttribute('rel', 'stylesheet');
            el.setAttribute('type', 'text/css');
            el.setAttribute('href', url + (url.indexOf('?') > -1 ? '&' : '?') + 'noCache=' + (new Date()).getTime());
            el.setAttribute('id', resourceID);

            head.appendChild(el);

            return this;
        },

        async fetchScript(moduleUrl) {
            var result = null;
            var moduleName;
            if (moduleUrl.split('/').length > 1) {
                moduleName = moduleUrl.split('/')[location.pathname.split('/').length - 1];
                moduleName = moduleName.split('.').length == 2 ? (moduleName.indexOf('.') > -1 ? moduleName.substring(0, moduleName.indexOf('.')) : moduleName) : '';
            }
            else {
                moduleName = moduleUrl;
            }

            var moduleScript;
            if ($string.isNullOrEmpty(moduleName) == false) {
                try {
                    var module;
                    moduleScript = await syn.$w.fetchText(moduleUrl + '.js');

                    if (moduleScript) {
                        var moduleFunction = "return (function() {var module = {};(function (window, module) {'use strict';" + moduleScript + ";var $module = new syn.module();$module.extend($" + moduleName + ");module.exports = $module;})(typeof window !== 'undefined' ? window : {},typeof module !== 'undefined' ? module : {});return module.exports;})();";
                        module = new Function(moduleFunction).call(globalRoot);
                    }
                    else {
                        module = new syn.module();
                    }

                    if (module.extends && $ref.isArray(module.extends) == true) {
                        for (var i = 0; i < module.extends.length; i++) {
                            var name = module.extends[i];
                            var result = await syn.$w.fetchText(name + '.js');
                            var moduleText = result.substring(result.indexOf('{')).replace(/;\r\n?$/, '');
                            var base = eval('(' + moduleText + ')');

                            var $base = new syn.module();
                            $base.extend(base);

                            module = syn.$w.argumentsExtend($base, module);
                            module.config = syn.$w.argumentsExtend($base.config, module.config);
                            module.prop = syn.$w.argumentsExtend($base.prop, module.prop);
                            module.hook = syn.$w.argumentsExtend($base.hook, module.hook);
                            module.event = syn.$w.argumentsExtend($base.event, module.event);
                            module.model = syn.$w.argumentsExtend($base.model, module.model);
                            module.transaction = syn.$w.argumentsExtend($base.transaction, module.transaction);
                            module.method = syn.$w.argumentsExtend($base.method, module.method);
                            module.message = syn.$w.argumentsExtend($base.message, module.message);

                            if ($base.hook && $base.hook.extendLoad) {
                                base.hook.extendLoad(module);
                            }
                        }
                    }

                    result = module;
                }
                catch (error) {
                    syn.$l.eventLog('$w.fetchScript', error, 'Warning');
                    if (moduleScript) {
                        syn.$l.eventLog('$w.fetchScript', '<script src="{0}.js"></script> 문법 확인 필요'.format(moduleUrl), 'Information');
                    }
                }
            }

            return result;
        },

        fetchText(url) {
            var fetchOptions = {};
            if (syn.$w.getFetchClientOptions) {
                fetchOptions = syn.$w.getFetchClientOptions(fetchOptions);
            }

            if (syn.$r.getCookie('syn.iscache') != 'true') {
                url = url + (url.indexOf('?') > -1 ? '&' : '?') + 'bust=' + new Date().getTime();
            }

            return new Promise(function (resolve, reject) {
                fetch(url, fetchOptions).then(function (response) {
                    return response.text();
                }).then(function (text) {
                    return resolve(text);
                }).catch(function (error) {
                    syn.$l.eventLog('$w.fetchText', error, 'Error');
                    return reject(null);
                });
            });
        },

        fetchJson(url) {
            var fetchOptions = {};
            if (syn.$w.getFetchClientOptions) {
                fetchOptions = syn.$w.getFetchClientOptions(fetchOptions);
            }

            if (syn.$r.getCookie('syn.iscache') != 'true') {
                url = url + (url.indexOf('?') > -1 ? '&' : '?') + 'bust=' + new Date().getTime();
            }

            return new Promise(function (resolve, reject) {
                fetch(url, fetchOptions).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    return resolve(json);
                }).catch(function (error) {
                    syn.$l.eventLog('$w.fetchJson', error, 'Error');
                    return reject(null);
                });
            });
        },

        serviceObject(serviceID, returnType) {
            var dataType = 'json';
            if (returnType) {
                dataType = returnType;
            }

            var jsonObject = {};
            jsonObject.RequestID = syn.$l.guid();
            jsonObject.ReturnType = dataType;
            jsonObject.ServiceID = serviceID;
            jsonObject.NameValues = [];

            if (this.setServiceObject) {
                this.setServiceObject(jsonObject);
            }

            dataType = null;
            return jsonObject;
        },

        transactionObject(functionID, returnType) {
            var dataType = 'Json';
            if (returnType) {
                dataType = returnType;
            }

            var jsonObject = {};
            jsonObject.programID = '';
            jsonObject.businessID = '';
            jsonObject.systemID = '';
            jsonObject.transactionID = '';
            jsonObject.dataMapInterface = null;
            jsonObject.transactionResult = true;
            jsonObject.functionID = functionID;
            jsonObject.screenID = '';
            jsonObject.requestID = syn.$l.guid();
            jsonObject.returnType = dataType;
            jsonObject.resultAlias = [];
            jsonObject.inputsItemCount = [];
            jsonObject.inputs = [];

            if (syn.$w.setServiceObject) {
                syn.$w.setServiceObject(jsonObject);
            }

            return jsonObject;
        },

        dynamicTypeObject: new function () {
            this.DataSet = '0';
            this.Json = '1';
            this.Scalar = '2';
            this.NonQuery = '3';
            this.SQLText = '4';
            this.SchemeOnly = '5';
            this.CodeHelp = '6';
            this.Xml = '7';
            this.DynamicJson = '8';
        },

        async executeTransaction(config, transactionObject, callback, async, token) {
            if ($object.isNullOrUndefined(config) == true || $object.isNullOrUndefined(transactionObject) == true) {
                if (globalRoot.devicePlatform === 'browser') {
                    alert('서비스 호출에 필요한 거래 정보가 구성되지 않았습니다');
                }

                syn.$l.eventLog('$w.executeTransaction', '서비스 호출에 필요한 거래 정보 확인 필요', 'Error');
                return;
            }

            var apiService = null;
            if (globalRoot.devicePlatform === 'node') {
                var apiServices = syn.$w.getStorage('apiServices', false);
                if (apiServices) {
                    apiService = apiServices[syn.Config.SystemID + syn.Config.DomainServerType];
                    if ($object.isNullOrUndefined(apiServices.BearerToken) == true && globalRoot.bearerToken) {
                        apiServices.BearerToken = globalRoot.bearerToken;
                        syn.$w.setStorage('apiServices', apiServices, false);
                    }
                }
                else {
                    if (syn.Config.DomainAPIServer != null) {
                        apiService = syn.Config.DomainAPIServer;
                        apiServices = {};
                        if (token || globalRoot.bearerToken) {
                            apiServices.BearerToken = token || globalRoot.bearerToken;
                        }
                        apiServices[syn.Config.SystemID + syn.Config.DomainServerType] = apiService;

                        syn.$w.setStorage('apiServices', apiServices, false);
                        syn.$l.eventLog('$w.executeTransaction', 'apiService 확인 필요 systemApi: {0}'.format(JSON.stringify(apiService)), 'Warning');
                    }
                    else {
                        syn.$l.eventLog('$w.executeTransaction', '서비스 호출에 필요한 BP 정보가 구성되지 확인 필요', 'Error');
                    }
                }
            }

            var apiServices = syn.$w.getStorage('apiServices', false);
            if (apiServices) {
                apiService = apiServices[syn.Config.SystemID + syn.Config.DomainServerType];
            }

            if (apiService == null) {
                syn.$l.eventLog('$w.executeTransaction', 'apiService 확인 필요', 'Fatal');
            }
            else {
                if (apiService.exceptionText) {
                    syn.$l.eventLog('$w.executeTransaction', 'apiService 확인 필요 SystemID: {0}, ServerType: {1}, Message: {2}'.format(config.systemID, syn.Config.DomainServerType, apiService.exceptionText), 'Fatal');
                    return;
                }

                // var ipAddress = syn.$w.getStorage('ipAddress', false);
                // if ($object.isNullOrUndefined(ipAddress) == true && $string.isNullOrEmpty(syn.Config.FindClientIPServer) == false) {
                //     var response = await fetch(syn.Config.FindClientIPServer, {
                //         method: 'GET',
                //         redirect: 'follow',
                //         timeout: 1000
                //     });
                //
                //     if (response.status == 200) {
                //         ipAddress = await response.text();
                //         syn.$w.setStorage('ipAddress', ipAddress);
                //     }
                // }
                var ipAddress = 'localhost';

                var url = '';
                if (apiService.Port && apiService.Port != '') {
                    url = '{0}://{1}:{2}{3}'.format(apiService.Protocol, apiService.IP, apiService.Port, apiService.Path);
                }
                else {
                    url = '{0}://{1}{2}'.format(apiService.Protocol, apiService.IP, apiService.Path);
                }

                url = '/transact/api/transaction/execute';
                var requestDateTime = $date.toString(new Date(), 'f');
                // -- 36바이트 = AppID 3자리 + ProjectID 3자리 + 거래ID 6자리 + 기능ID 3자리 + 환경ID 1자리 + Timestamp (yyyyMMddhhmmssfff) 17자리 + 버퍼 3바이트
                var requestID = config.programID.concat(config.businessID, transactionObject.transactionID, transactionObject.functionID, syn.Config.Environment.substring(0, 1), requestDateTime, syn.$l.random(3)).toUpperCase();
                var globalID = '';
                if (apiService.RequestID) {
                    globalID = apiService.RequestID;
                }
                else {
                    globalID = requestID;
                }

                var transactionRequest = {
                    accessToken: apiServices.BearerToken,
                    action: 'SYN', // "SYN: Request/Response, PSH: Execute/None, ACK: Subscribe",
                    kind: 'BIZ', // "DBG: Debug, BIZ: Business, URG: Urgent, FIN: Finish",
                    clientTag: syn.Config.SystemID.concat('|', syn.Config.HostName, '|', syn.Config.Program.ProgramName, '|', syn.Config.Environment.substring(0, 1) + (syn.$w.SSO ? '|' + syn.$w.SSO.TokenID : '')),
                    loadOptions: {
                        encryptionType: syn.Config.Transaction.EncryptionType, // "P:Plain, F:Full, H:Header, B:Body",
                        encryptionKey: syn.Config.Transaction.EncryptionKey, // "P:프로그램, K:KMS 서버, G:GlobalID 키",
                        platform: syn.$b.platform
                    },
                    requestID: requestID,
                    version: syn.Config.Transaction.ProtocolVersion,
                    environment: syn.Config.Environment.substring(0, 1),
                    system: {
                        programID: config.programID,
                        version: syn.Config.SystemVersion,
                        routes: [
                            {
                                systemID: config.systemID,
                                requestTick: (new Date()).getTime()
                            }
                        ],
                        localeID: syn.Config.Program.LocaleID,
                        hostName: globalRoot.devicePlatform == 'browser' ? location.host : syn.Config.HostName,
                    },
                    interface: {
                        devicePlatform: globalRoot.devicePlatform,
                        interfaceID: syn.Config.Transaction.MachineTypeID,
                        sourceIP: ipAddress,
                        sourcePort: 0,
                        sourceMAC: '',
                        connectionType: globalRoot.devicePlatform == 'node' ? 'unknown' : navigator.connection.effectiveType,
                        timeout: syn.Config.TransactionTimeout
                    },
                    transaction: {
                        globalID: globalID,
                        businessID: config.businessID,
                        transactionID: transactionObject.transactionID,
                        functionID: transactionObject.functionID,
                        commandType: '',
                        simulationType: syn.Config.Transaction.SimulationType, // "D:더미 P:운영 T:테스트",
                        terminalGroupID: globalRoot.devicePlatform == 'browser' ? (syn.$w.SSO ? '{0}|{1}|{2}'.format(syn.$w.SSO.CompanyID, syn.$w.SSO.DepartmentID, syn.$w.SSO.Claims.join(',')) : '') : syn.Config.Program.BranchCode,
                        operatorID: globalRoot.devicePlatform == 'browser' ? (syn.$w.SSO ? syn.$w.SSO.UserID : '') : syn.Config.Program.ProgramName,
                        screenID: transactionObject.screenID,
                        dataFormat: syn.Config.Transaction.DataFormat,
                        compressionYN: syn.Config.Transaction.CompressionYN,
                        maskings: []
                    },
                    payLoad: {
                        property: {},
                        mapID: '',
                        dataMapInterface: '',
                        dataMapCount: [],
                        dataMapSet: []
                    }
                };

                if ($object.isNullOrUndefined(transactionObject.options) == false) {
                    for (var key in transactionObject.options) {
                        var item = transactionObject.options[key];

                        if (key == 'encryptionType' || key == 'encryptionKey' || key == 'platform') {
                            throw new Error('{0} 옵션 사용 불가'.format(key));
                        }
                        else {
                            transactionRequest.loadOptions[key] = item;
                        }
                    }

                    var dynamic = transactionRequest.loadOptions['dynamic'];
                    if ($string.isNullOrEmpty(dynamic) == false && $string.toBoolean(dynamic) == false) {
                        delete transactionRequest.loadOptions['dynamic'];
                        delete transactionRequest.loadOptions['authorize'];
                        delete transactionRequest.loadOptions['commandType'];
                        delete transactionRequest.loadOptions['returnType'];
                        delete transactionRequest.loadOptions['transactionScope'];
                        delete transactionRequest.loadOptions['transactionLog'];
                    }

                    var action = transactionRequest.loadOptions['action'];
                    if ($string.isNullOrEmpty(action) == false) {
                        transactionRequest.action = action;
                        delete transactionRequest.loadOptions['action'];
                    }

                    var kind = transactionRequest.loadOptions['kind'];
                    if ($string.isNullOrEmpty(kind) == false) {
                        transactionRequest.kind = kind;
                        delete transactionRequest.loadOptions['kind'];
                    }

                    delete transactionRequest.loadOptions['message'];
                }

                var mod = context[syn.$w.pageScript];
                if (mod && mod.hook.payLoadProperty) {
                    var property = {};
                    property = mod.hook.payLoadProperty(transactionObject.transactionID, transactionObject.functionID);
                    if ($object.isNullOrUndefined(property) == true) {
                        property = {};
                    }

                    transactionRequest.payLoad.property = property;
                }

                if (config.transactions) {
                    var transactions = config.transactions.filter(function (item) {
                        return item.functionID == transactionObject.functionID;
                    });

                    if (transactions.length == 1) {
                        var transaction = transactions[0];

                        var inputs = transaction.inputs.map(function (item) { return item.requestType; }).join(',');
                        var outputs = transaction.outputs.map(function (item) { return item.responseType; }).join(',');
                        transactionRequest.payLoad.dataMapInterface = '{0}|{1}'.format(inputs, outputs);
                    }
                }
                else if (transactionObject.dataMapInterface) {
                    transactionRequest.payLoad.dataMapInterface = transactionObject.dataMapInterface;
                }

                if (transactionRequest.transaction.dataFormat == 'J' || transactionRequest.transaction.dataFormat == 'T') {
                }
                else {
                    throw new Error('transaction.dataFormat 확인 필요: {0}'.format(transactionRequest.transaction.dataFormat));
                }

                // SynCryptoHelper, AesCryptoHelper, CryptoJS를 활용한 기능 개발
                if (mod && mod.hook.payLoadMasking) {
                    var maskings = [
                        {
                            mapDataNo: 0,
                            targetID: "TargetID",
                            decryptKey: "DecryptKey"
                        }
                    ];
                    maskings = mod.hook.payLoadMasking(transactionObject.transactionID, transactionObject.functionID);
                    if ($object.isNullOrUndefined(maskings) == true) {
                        maskings = [];
                    }

                    // payLoad 데이터 마스킹 처리

                    transactionRequest.transaction.maskings = maskings;
                }

                transactionRequest.payLoad.dataMapCount = transactionObject.inputsItemCount;
                transactionRequest.payLoad.dataMapSet = [];
                transactionRequest.payLoad.dataMapSetRaw = [];
                var length = transactionObject.inputs.length;

                for (var i = 0; i < length; i++) {
                    var inputs = transactionObject.inputs[i];

                    var reqInputs = [];
                    for (var j = 0; j < inputs.length; j++) {
                        var item = inputs[j];

                        reqInputs.push({
                            id: item.prop,
                            value: item.val
                        });
                    }

                    if (syn.Config.Transaction.CompressionYN == 'Y') {
                        if (transactionRequest.transaction.dataFormat == 'J') {
                            transactionRequest.payLoad.dataMapSetRaw.push(syn.$c.LZString.compressToBase64(JSON.stringify(reqInputs)));
                        }
                        else {
                            transactionRequest.payLoad.dataMapSetRaw.push(syn.$c.LZString.compressToBase64($object.toCSV(reqInputs, { delimeter: '｜', newline: '↵' })));
                        }
                    }
                    else {
                        if (transactionRequest.transaction.dataFormat == 'J') {
                            transactionRequest.payLoad.dataMapSet.push(reqInputs);
                        }
                        else {
                            transactionRequest.payLoad.dataMapSetRaw.push($object.toCSV(reqInputs, { delimeter: '｜', newline: '↵' }));
                        }
                    }
                }

                if (transactionRequest.action == 'PSH') {
                    var blob = new Blob([JSON.stringify(transactionRequest)], { type: 'application/json; charset=UTF-8' });
                    navigator.sendBeacon(url, blob);

                    if (syn.$w.domainTransactionLoaderEnd) {
                        syn.$w.domainTransactionLoaderEnd();
                    }

                    if (syn.$w.closeProgressMessage) {
                        syn.$w.closeProgressMessage();
                    }
                }
                else {
                    var xhr = syn.$w.xmlHttp();
                    xhr.open(syn.$w.method, url, true);
                    xhr.setRequestHeader('Accept-Language', syn.$w.localeID);
                    //xhr.setRequestHeader('User-Agent', 'XmlHttpRequest');
                    xhr.setRequestHeader('Server-SystemID', config.systemID);
                    xhr.setRequestHeader('Server-BusinessID', config.businessID);

                    if (syn.$w.setServiceClientHeader) {
                        if (syn.$w.setServiceClientHeader(xhr) == false) {
                            return;
                        }
                    }

                    if (async !== undefined && xhr.async == true) {
                        xhr.async = async;

                        if (xhr.async == false) {
                            xhr.setRequestHeader('X-Requested-With', 'HAND Stack ServiceClient');
                            // xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.send(transactionRequest);

                            return xhr;
                        }
                    }

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status !== 200) {
                                if (xhr.status == 0) {
                                    syn.$l.eventLog('$w.executeTransaction', 'X-Requested transfort error', 'Fatal');
                                }
                                else {
                                    syn.$l.eventLog('$w.executeTransaction', 'response status - {0}'.format(xhr.statusText) + xhr.responseText, 'Error');
                                }

                                if (syn.$w.domainTransactionLoaderEnd) {
                                    syn.$w.domainTransactionLoaderEnd();
                                }
                                return;
                            }

                            if (syn.$w.clientTag && syn.$w.serviceClientInterceptor) {
                                if (syn.$w.serviceClientInterceptor(syn.$w.clientTag, xhr) === false) {
                                    return;
                                }
                            }

                            try {
                                var transactionResponse = JSON.parse(xhr.responseText);
                                if (transactionObject.transactionResult == true) {
                                    if (transactionResponse.acknowledge == 1) {
                                        var jsonResult = [];
                                        debugger;

                                        var mdo = transactionResponse.message;
                                        if (transactionResponse.result.dataSet != null && transactionResponse.result.dataSet.length > 0) {
                                            var mapID = transactionResponse.result.mapID;
                                            var dataMapItem = transactionResponse.result.dataSet;
                                            var length = dataMapItem.length;
                                            for (var i = 0; i < length; i++) {
                                                var item = dataMapItem[i];

                                                if (transactionResponse.transaction.simulationType == syn.$w.dynamicTypeObject.CodeHelp) {
                                                    jsonResult.push({
                                                        id: item.id,
                                                        value: item.value
                                                    });
                                                    continue;
                                                }

                                                if (transactionResponse.transaction.dataFormat == 'J') {
                                                    if (transactionResponse.transaction.compressionYN == 'Y') {
                                                        jsonResult.push({
                                                            id: item.id,
                                                            value: JSON.parse(syn.$c.LZString.decompressFromBase64(item.value))
                                                        });
                                                    }
                                                    else {
                                                        jsonResult.push({
                                                            id: item.id,
                                                            value: item.value
                                                        });
                                                    }
                                                }
                                                else {
                                                    if (config.transactions) {
                                                        var transaction = config.transactions.find(function (item) {
                                                            return item.functionID == transactionObject.functionID;
                                                        });

                                                        if (transaction) {
                                                            var value = null;
                                                            if ($ref.isEmpty(item.value) == false) {
                                                                value = transactionResponse.transaction.compressionYN == 'Y' ? syn.$c.LZString.decompressFromBase64(item.value).split('＾') : item.value.split('＾');
                                                                var meta = $string.toParameterObject(value[0]);
                                                                value = $string.toJson(value[1], { delimeter: '｜', newline: '↵', meta: meta });

                                                                var outputMapping = transaction.outputs[i];
                                                                if (outputMapping.responseType == 'Form') {
                                                                    value = value[0];
                                                                }
                                                            }

                                                            jsonResult.push({
                                                                id: item.id,
                                                                value: value
                                                            });
                                                        }
                                                    }
                                                    else {
                                                        var value = transactionResponse.transaction.compressionYN == 'Y' ? syn.$c.LZString.decompressFromBase64(item.value).split('＾') : item.value.split('＾');
                                                        var meta = $string.toParameterObject(value[0]);
                                                        value = $string.toJson(value[1], { delimeter: '｜', newline: '↵', meta: meta });

                                                        jsonResult.push({
                                                            id: item.id,
                                                            value: value
                                                        });
                                                    }
                                                }
                                            }
                                        }

                                        if (callback) {
                                            var addtionalData = {};
                                            if (mdo.additions && mdo.additions.length > 0) {
                                                for (var i = 0; i < mdo.mdo.additions.length; i++) {
                                                    var addition = mdo.mdo.additions[i];

                                                    if (addition.code == 'F' && $object.isNullOrUndefined(addtionalData[addition.code]) == true) {
                                                        addtionalData[addition.code] = addition.text;
                                                    }
                                                    else if (addition.code == 'P') {

                                                    }
                                                    else if (addition.code == 'S') {

                                                    }
                                                }
                                            }

                                            try {
                                                callback(jsonResult, addtionalData);
                                            } catch (error) {
                                                syn.$l.eventLog('$w.executeTransaction callback', error, 'Error');
                                            }
                                        }
                                    }
                                    else {
                                        var errorText = transactionResponse.exceptionText;
                                        var errorMessage = '거래: {0}, 기능: {1} 수행중 예외가 발생하였습니다'.format(transactionRequest.transaction.transactionID, transactionRequest.transaction.functionID);
                                        if (syn.$w.serviceClientException) {
                                            syn.$w.serviceClientException('요청오류', errorMessage, errorText);
                                        }

                                        syn.$l.eventLog('$w.executeTransaction', errorText, 'Warning');

                                        if (globalRoot.devicePlatform === 'browser') {
                                            if ($this && $this.hook && $this.hook.frameEvent) {
                                                $this.hook.frameEvent('transactionException', {
                                                    transactionID: transactionRequest.transaction.transactionID,
                                                    functionID: transactionRequest.transaction.functionID,
                                                    errorText: errorText,
                                                    errorMessage: errorMessage
                                                });
                                            }
                                        }
                                        else {
                                            if (callback) {
                                                try {
                                                    callback([], null);
                                                } catch (error) {
                                                    syn.$l.eventLog('$w.executeTransaction callback', error, 'Error');
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (callback) {
                                        if (transactionResponse && transactionResponse.acknowledge && transactionResponse.acknowledge == 1) {
                                            try {
                                                var mdo = transactionResponse.message;
                                                if (transactionResponse.result.dataSet != null && transactionResponse.result.dataSet.length > 0) {
                                                    var mapID = transactionResponse.result.mapID;
                                                    var dataMapItem = transactionResponse.result.dataSet;
                                                    var length = dataMapItem.length;
                                                    for (var i = 0; i < length; i++) {
                                                        var item = dataMapItem[i];
                                                        if (transactionResponse.transaction.dataFormat == 'J') {
                                                            if (transactionResponse.transaction.compressionYN == 'Y') {
                                                                item.value = JSON.parse(syn.$c.LZString.decompressFromBase64(item.value));
                                                            }
                                                        }
                                                        else {
                                                            item.value = transactionResponse.transaction.compressionYN == 'Y' ? syn.$c.LZString.decompressFromBase64(item.value) : item.value;
                                                        }
                                                    }
                                                }
                                            } catch (error) {
                                                syn.$l.eventLog('$w.executeTransaction', error, 'Error');
                                            }
                                        }

                                        try {
                                            callback(transactionResponse);
                                        } catch (error) {
                                            syn.$l.eventLog('$w.executeTransaction callback', error, 'Error');
                                        }
                                    }
                                }
                            }
                            catch (error) {
                                var errorMessage = '거래: {0}, 기능: {1} 수행중 오류가 발생하였습니다'.format(transactionRequest.transaction.transactionID, transactionRequest.transaction.functionID);
                                if (syn.$w.serviceClientException) {
                                    syn.$w.serviceClientException('오류', errorMessage, error.stack);
                                }

                                syn.$l.eventLog('$w.executeTransaction', error, 'Error');

                                if (globalRoot.devicePlatform === 'browser') {
                                    if ($this && $this.hook && $this.hook.frameEvent) {
                                        $this.hook.frameEvent('transactionError', {
                                            transactionID: transactionRequest.transaction.transactionID,
                                            functionID: transactionRequest.transaction.functionID,
                                            errorText: error.message,
                                            errorMessage: errorMessage
                                        });
                                    }
                                }
                                else {
                                    if (callback) {
                                        try {
                                            callback([], null);
                                        } catch (error) {
                                            syn.$l.eventLog('$w.executeTransaction callback', error, 'Error');
                                        }
                                    }
                                }
                            }

                            if (syn.$w.domainTransactionLoaderEnd) {
                                syn.$w.domainTransactionLoaderEnd();
                            }
                        }
                    }
                    xhr.setRequestHeader('X-Requested-With', 'HAND Stack ServiceClient');
                    // xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.timeout = syn.Config.TransactionTimeout;
                    xhr.send(JSON.stringify(transactionRequest));
                }
            }
        }
    });
})(globalRoot, syn.$w);

/// <reference path='../syn.core.js' />
/// <reference path='../syn.webform.js' />
/// <reference path='../syn.browser.js' />

(function (context, $webform) {
    'use strict';
    if (!$webform) {
        $webform = new syn.module();
    }

    var document = context.document;

    $webform.extend({
        xmlFormData: null,
        jsonFormData: null,

        getUpdateData(cssSelector) {
            var result = {};
            result.pageUrl = syn.$r.url();

            var els = [];
            if (cssSelector) {
                els = syn.$l.querySelectorAll(cssSelector + " *[bindingID]");
            }
            else {
                els = syn.$l.querySelectorAll("input[type='text'], input[type='button'], input[type='checkbox'], input[type='hidden'], button, select, textarea");
            }

            var el = null;
            var bindingID = null;
            for (var i = 0; i < els.length; i++) {
                el = els[i];
                bindingID = el.getAttribute('bindingID');
                if (bindingID) {
                    syn.$w.updateValue(el, bindingID);
                }
            }

            els = syn.$l.querySelectorAll('input[type="radio"]');
            el = null;
            var eids = [];
            var eid = '';

            for (var i = 0; i < els.length; i++) {
                el = els[i];
                bindingID = el.getAttribute('bindingID');

                if (bindingID) {
                    eids.push(bindingID);
                }
            }

            eids = $array.distinct(eids);

            for (var i = 0; i < eids.length; i++) {
                eid = eids[i];
                if ($radio) {
                    result[eid] = $radio.getValue(eid);
                }
                else {
                    var radioButtons = document.getElementsByName(eid);
                    for (var j = 0; j < radioButtons.length; j++) {
                        if (radioButtons[j].checked) {
                            result[eid] = radioButtons[j].value
                            break;
                        }
                    }
                }
            }

            return result;
        },

        updateValue(el, bindingID) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    result[bindingID] = el.checked;
                    break;
                case 'text':
                    result[bindingID] = el.value;
                    break;
                default:
                    result[bindingID] = el.value;
                    break;
            }

            return this;
        },

        initializeForm(el, cssSelector) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var bl = null;
            var els = [];

            if (cssSelector) {
                els = syn.$l.querySelectorAll(cssSelector + ' *[bindingID]');
            }
            else {
                els = syn.$l.querySelectorAll('*[bindingID]');
            }

            for (var i = 0; i < els.length; i++) {
                bl = els[i];
                syn.$w.initializeValue(bl);
            }

            if (el) {
                el.focus();
            }

            return this;
        },

        initializeValue(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            switch (el.type.toLowerCase()) {
                case 'radio':
                    el.checked = false;
                    break;
                case 'checkbox':
                    el.checked = false;
                    break;
                case 'text':
                    el.value = '';
                    break;
                default:
                    el.value = '';
                    break;
            }

            return this;
        },

        formBinding(jsonObject, cssSelector) {
            var val = '';
            var els = null;
            for (var colID in jsonObject) {
                if (cssSelector) {
                    els = syn.$l.querySelectorAll(cssSelector + ' *[bindingID=' + colID + ']');
                }
                else {
                    els = syn.$l.querySelectorAll('*[bindingID=' + colID + ']');
                }
                if (els.length > 0) {
                    val = jsonObject[colID];

                    if (els.length > 1) {
                        for (var i = 0; i < els.length; i++) {
                            syn.$w.bindingValue(els[i], val);
                        }
                    }
                    else {
                        syn.$w.bindingValue(els[0], val);
                    }
                }
            }

            return this;
        },

        bindingValue(el, val) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    el.checked = val;
                    break;
                case 'radio':
                    el.checked = val;
                    break;
                case 'text':
                    el.value = val;
                    break;
                case 'select':
                    el.value = val;
                    break;
                default:
                    el.value = val;
                    break;
            }

            return this;
        }
    });
})(globalRoot, syn.$w);

(function (context, $res) {
    if (!$res) {
        throw new Error("$res 리소스 객체가 없습니다.");
    }
    $res.add('localeID', 'ko-KR');

    $res.add('progress', '진행 중입니다.');
    $res.add('appendTo', '신규 입력 상태입니다.');
    $res.add('appendPre', '화면 구성 중...');
    $res.add('retrieve', '정상적으로 조회되었습니다.');
    $res.add('retrieveException', '데이터를 조회하는 과정에서 문제가 발생하였습니다.');
    $res.add('retrievePre', '데이터 조회 중...');
    $res.add('save', '정상적으로 저장되었습니다.');
    $res.add('saveException', '데이터를 저장하는 과정에서 문제가 발생하였습니다.');
    $res.add('savePre', '저장 중...');
    $res.add('update', '정상적으로 수정되었습니다.');
    $res.add('updateException', '데이터를 수정하는 과정에서 문제가 발생하였습니다.');
    $res.add('updatePre', '수정 중...');
    $res.add('remove', '정상적으로 삭제되었습니다.');
    $res.add('removeException', '데이터를 삭제하는 과정에서 문제가 발생하였습니다.');
    $res.add('removePre', '삭제 중...');
    $res.add('copyAppend', '기존 데이터를 복사하여 입력 상태로 전환했습니다.');
    $res.add('userInfoNothing', '사용자 정보에 문제가 발생했습니다.');

    $res.add('isLogOut', '정말로 로그아웃 하시겠습니까?');
    $res.add('waiting', '잠시만 기다려주세요...');
    $res.add('notElemnet', '컨트롤이 발견되지 않았습니다. 쿼리나 HTML 디자인을 살펴보세요');
    $res.add('dualElemnet', '"{0}"의 아이디는 현재 페이지에서 중복된 이름 또는 아이디의 컨트롤로 발견되었습니다.');
    $res.add('requiredKeyData', '필수 입력 항목 오류');
    $res.add('requiredInsertData', '아래 항목은 필수 입력 항목입니다.');
    $res.add('errorMessage', '에러가 발생했습니다.');
    $res.add('serverErrorMessage', '서버에서 에러가 발생했습니다.');
    $res.add('initialComplete', '화면 구성 완료');
    $res.add('initialException', '화면 구성 실패');
    $res.add('isDateTimeInsert', '"{0}" 포맷의 날짜와 시간을 입력해야 합니다.');
    $res.add('isDateInsert', '"{0}" 포맷의 날짜를 입력해야 합니다.');
    $res.add('isTimeInsert', '"{0}" 포맷의 시간을 입력해야 합니다.');
    $res.add('isNumericInsert', '숫자를 입력해야 합니다.');
    $res.add('forceSave', '편집중인 데이터를 저장하시겠습니까?');
    $res.add('textMaxLength', '입력 가능한 "{0}"자리수를 넘었습니다');

    $res.add('create', '입력');
    $res.add('read', '조회');
    $res.add('find', '검색');
    $res.add('edit', '수정');
    $res.add('delele', '삭제');
    $res.add('removeStatusNo', '삭제 가능한 상태가 아닙니다. 데이터를 조회한 후 삭제 해야 합니다.');
    $res.add('removeConfirm', '정말로 삭제 하시겠습니까?');
    $res.add('notData', '데이터가 없습니다.');
    $res.add('notCondData', '입력하신 조건에 맞는 데이터가 없습니다.');
    $res.add('notRetrieveCond', '조회에 필요한 항목이 입력되지 않았습니다.');
    $res.add('notDateBetween', '기간이 올바르게 설정되지 않았습니다.');
    $res.add('notDate', '정확한 날짜를 입력 하거나 선택해야 합니다.');
    $res.add('notFindCond', '검색에 필요한 문장을 입력해야 합니다. 정확한 검색을 위해 두글자 이상 입력해야 합니다.');
    $res.add('selectData', '데이터를 선택해야 합니다.');
    $res.add('selectAll', '전체');
    $res.add('saveExcel', '엑셀 다운로드 중입니다.');
    $res.add('saveExcelComplete', '엑셀 파일을 다운로드 했습니다.');
    $res.add('saveExcelFail', '엑셀 파일 다운로드를 실패 했습니다');
    $res.add('notSupportContent', '지원 하지 않는 컨텐츠 타입입니다.');
})(globalRoot, syn.$res);
