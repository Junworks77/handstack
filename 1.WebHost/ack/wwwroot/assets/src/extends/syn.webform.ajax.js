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
                                base.hook.extendLoad();
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
