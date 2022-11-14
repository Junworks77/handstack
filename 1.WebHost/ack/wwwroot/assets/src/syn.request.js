/// <reference path='syn.library.js' />
/// <reference path='syn.browser.js' />

(function (context) {
    'use strict';
    var $request = $request || new syn.module();
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

            var xhr = new syn.$w.xmlHttp();
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

            var xhr = new syn.$w.xmlHttp();
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

            var xhr = new syn.$w.xmlHttp();
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

            var xhr = new syn.$w.xmlHttp();
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
