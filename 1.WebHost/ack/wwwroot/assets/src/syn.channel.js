﻿/// <reference path='syn.core.js' />

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
