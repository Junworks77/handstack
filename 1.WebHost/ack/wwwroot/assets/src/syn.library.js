/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $library = $library || new syn.module();
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
