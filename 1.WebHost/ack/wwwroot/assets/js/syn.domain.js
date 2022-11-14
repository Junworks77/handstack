(function ($resource) {
    /// <summary>
    /// 다국어 처리를 위한 문자열 리소스를 확장하는 모듈입니다. 
    /// </summary>
    if (!$resource) {
        $resource = new syn.module();
    }

    $resource.extend({
        labels: [],
        messages: [],
        mimeType: {
            'html': 'text/html'
            , 'htm': 'text/html'
            , 'css': 'text/css'
            , 'xml': 'text/xml'
            , 'mml': 'text/mathml'
            , 'txt': 'text/plain'
            , 'jad': 'text/vnd.sun.j2me.app-descriptor'
            , 'wml': 'text/vnd.wap.wml'
            , 'htc': 'text/x-component'
            , 'gif': 'image/gif'
            , 'jpeg': 'image/jpeg'
            , 'jpg': 'image/jpeg'
            , 'png': 'image/png'
            , 'tif': 'image/tiff'
            , 'tiff': 'image/tiff'
            , 'wbmp': 'image/vnd.wap.wbmp'
            , 'ico': 'image/x-icon'
            , 'jng': 'image/x-jng'
            , 'bmp': 'image/x-ms-bmp'
            , 'svg': 'image/svg+xml'
            , 'webp': 'image/webp'
            , 'js': 'application/x-javascript'
            , 'atom': 'application/atom+xml'
            , 'rss': 'application/rss+xml'
            , 'jar': 'application/java-archive'
            , 'war': 'application/java-archive'
            , 'ear': 'application/java-archive'
            , 'hqx': 'application/mac-binhex40'
            , 'pdf': 'application/pdf'
            , 'ps': 'application/postscript'
            , 'eps': 'application/postscript'
            , 'ai': 'application/postscript'
            , 'rtf': 'application/rtf'
            , 'doc': 'application/msword'
            , 'docx': 'application/msword'
            , 'xls': 'application/vnd.ms-excel'
            , 'xlsx': 'application/vnd.ms-excel'
            , 'ppt': 'application/vnd.ms-powerpoint'
            , 'pptx': 'application/vnd.ms-powerpoint'
            , 'wmlc': 'application/vnd.wap.wmlc'
            , 'kml': 'application/vnd.google-earth.kml+xml'
            , 'kmz': 'application/vnd.google-earth.kmz'
            , '7z': 'application/x-7z-compressed'
            , 'cco': 'application/x-cocoa'
            , 'jardiff': 'application/x-java-archive-diff'
            , 'jnlp': 'application/x-java-jnlp-file'
            , 'run': 'application/x-makeself'
            , 'rar': 'application/x-rar-compressed'
            , 'rpm': 'application/x-redhat-package-manager'
            , 'sea': 'application/x-sea'
            , 'swf': 'application/x-shockwave-flash'
            , 'sit': 'application/x-stuffit'
            , 'tcl': 'application/x-tcl'
            , 'tk': 'application/x-tcl'
            , 'der': 'application/x-x509-ca-cert'
            , 'pem': 'application/x-x509-ca-cert'
            , 'crt': 'application/x-x509-ca-cert'
            , 'xpi': 'application/x-xpinstall'
            , 'xhtml': 'application/xhtml+xml'
            , 'zip': 'application/zip'
            , 'bin': 'application/octet-stream'
            , 'exe': 'application/octet-stream'
            , 'dll': 'application/octet-stream'
            , 'deb': 'application/octet-stream'
            , 'dmg': 'application/octet-stream'
            , 'eot': 'application/octet-stream'
            , 'iso': 'application/octet-stream'
            , 'img': 'application/octet-stream'
            , 'msi': 'application/octet-stream'
            , 'ewp': 'application/octet-stream'
            , 'msm': 'application/octet-stream'
            , 'mid': 'audio/midi'
            , 'midi': 'audio/midi'
            , 'mp3': 'audio/mpeg'
            , 'ogg': 'audio/ogg'
            , 'ra': 'audio/x-realaudio'
            , '3gpp': 'video/3gpp'
            , '3gp': 'video/3gpp'
            , 'mpeg': 'video/mpeg'
            , 'mpg': 'video/mpeg'
            , 'mov': 'video/quicktime'
            , 'flv': 'video/x-flv'
            , 'mng': 'video/x-mng'
            , 'asx': 'video/x-ms-asf'
            , 'asf': 'video/x-ms-asf'
            , 'wmv': 'video/x-ms-wmv'
            , 'avi': 'video/x-msvideo'
            , 'm4v': 'video/mp4'
            , 'mp4': 'video/mp4'
        },

        addStringResource(id, val) {
            /// <summary>
            /// 다국어 문자열 리소스를 추가합니다. 중복되는 키가 있을 경우 덮어씁니다.
            /// &#10;&#10;
            /// example :&#10;
            /// &#10;$res.add("addResource1": {title:"타이틀입니다.", text:"메시지입니다."});
            /// &#10;alert($res.messages.addResource1.title);
            /// &#10;alert($res.messages.addResource1.title);
            /// </summary>
            /// <param name="id" type="String">다국어 문자열 리소스 키입니다.</param>
            /// <param name="val" type="Object">다국어 문자열 값입니다.</param>
            /// <returns type="Type" />
            if ($ref.typeOf(val) === "object") {
                this.messages[id] = val;
                return this.messages;
            }
            else {
                this.labels[id] = val;
                return this.labels;
            }

            return this;
        }
    });
})(syn.$res);
(function (window) {
    /// <summary>
    /// UI화면에 표현되는 프로그래스 바를 관리합니다.
    /// </summary>
    var $progressBar = $progressBar || new syn.module();

    $progressBar.extend({
        version: "1.0",
        max: 10,
        actual: 0,
        intervalID: 0,
        message: 0,
        status: 0, // init: 0, load: 1, bind: 2, complete: 3

        // 프로그래스 바를 표현여부입니다.
        isProgress: false,

        show(message, width) {
            /// <summary>
            /// 프로그래스 바를 표현합니다.
            /// </summary>
            $progressBar.message = message;
            syn.$l.querySelector('.ui_progressbar').style['display'] = 'block';
            $progressBar.isProgress = true;
            if (width) {
                if (width > 500) {
                    width = 500;
                }

                $('.progressBar').width(width);
                syn.$l.querySelector('.progressBar').style.marginLeft = (-(width / 2)).toString() + 'px';
            }

            var message = syn.$l.querySelector('.message');
            message.innerText = $progressBar.message;

            if (parent.$layout) {
                parent.$layout.buttonAction = false;
            }

            $progressBar.intervalID = setInterval($progressBar.progress, 1000);
            message = null;
        },

        clear() {
            /// <summary>
            /// 프로그래스 바를 숨깁니다.
            /// </summary>
            syn.$l.removeEvent(syn.$l.querySelector('.message'), 'click', function () { $progressBar.close(); });
            clearInterval($progressBar.intervalID);
            $progressBar.actual = 0;
            $progressBar.intervalID = 0;
            $progressBar.message = '';

            syn.$l.querySelector('.message').innerText = '';
            $progressBar.isProgress = false;
            if (parent.$layout) {
                parent.$layout.buttonAction = true;
            }
        },

        close() {
            /// <summary>
            /// 프로그래스 바를 숨깁니다.
            /// </summary>
            this.clear();

            syn.$m.setStyle(syn.$l.querySelector(".ui_progressbar"), "display", "none");
        },

        progress() {
            /// <summary>
            /// 프로그래스 바 진행률을 업데이트합니다.
            /// </summary>
            if ($progressBar.actual >= $progressBar.max) {
                syn.$l.addEvent(syn.$l.querySelector(".message"), "click", function () { $progressBar.close(); });
                clearInterval($progressBar.intervalID);
            }

            $progressBar.actual++;
        }
    });
    window.$progressBar = window.$progressBar || $progressBar;
})(window);
(function ($webform) {
    if (!$webform) {
        $webform = new syn.module();
    }

    syn.uicontrols = syn.uicontrols || new syn.module();

    $webform.extend({
        SSO: null,
        AppInfo: null,

        nanobar: new Nanobar(),
        isPerformanceLog: false,
        dialogResult: null,
        alertResult: null,

        isShowDialog: false,
        isShowAlert: false,

        dialogOptions:
        {
            opacity: 0,
            overlayId: 'simplemodal-overlay',
            containerId: 'simplemodal-container',
            closeHTML: '<a class="modalCloseImg icon-delete" title="Close"></a>',
            minWidth: 320,
            minHeight: 240,
            modal: true,
            escClose: false,
            overlayClose: false,
            persist: true,
            fixed: false,
            isHidden: false,
            scrolling: false,
            onOpen: null,
            //            onOpen(dialog)
            //            {
            //                dialog.overlay.fadeIn('fast', function ()
            //                {
            //                    dialog.data.hide();
            //                    dialog.container.fadeIn('fast', function ()
            //                    {
            //                        dialog.data.slideDown('fast');
            //                    });
            //                });
            //            },
            onClose(dialog) {
                //                dialog.data.fadeOut('fast', function ()
                //                {
                //                    $.modal.close();
                //                });
                $webform.isShowDialog = false;
                if (parent.$layout) {
                    parent.$layout.buttonAction = true;
                }

                if ($.modal.impl.o.isHidden) {
                    $.modal.impl.o.hide();
                }
                else {
                    $.modal.close();
                }

                if ($.modal.impl.o.onCallback) {
                    if (syn.$b.isIE) {
                        window.focus();
                    }

                    $.modal.impl.o.onCallback(syn.$w.dialogResult);
                    syn.$w.dialogResult = null;
                }

                if (syn.$v.focusElement) {
                    syn.$v.focusElement.focus();
                    syn.$v.focusElement = null;
                }
            },
            onShow(dialog) {
            },
            onCallback: null
        },

        alertOptions:
        {
            opacity: 0,
            overlayId: 'alertmodal-overlay',
            containerId: 'alertmodal-container',
            dataId: 'alertmodal-data',
            closeClass: 'alertmodal-close',
            closeHTML: '<a class="modalCloseImg icon-delete" title="Close"></a>',
            minWidth: 380,
            minHeight: 240,
            dialogIcon: 1,
            dialogButtons: 1,
            textHeight: null,
            autoSize: false,
            modal: true,
            escClose: false,
            overlayClose: false,
            persist: true,
            fixed: false,
            isHidden: false,
            onOpen: null,
            onClose(dialog) {
                $webform.isShowAlert = false;
                if (parent.$layout) {
                    parent.$layout.buttonAction = true;
                }

                if ($.alert.impl.o.isHidden) {
                    $.alert.impl.o.hide();
                }
                else {
                    $.alert.close();
                }

                if ($.alert.impl.o.onCallback) {
                    if (syn.$b.isIE) {
                        window.focus();
                    }

                    $.alert.impl.o.onCallback(syn.$w.alertResult);
                    syn.$w.alertResult = null;
                }

                if (syn.$v.focusElement) {
                    syn.$v.focusElement.focus();
                    syn.$v.focusElement = null;
                }
            },
            onShow(dialog) {
            },
            onCallback: null
        },

        iframeChannels: [],

        popupOptions: {
            target: null,
            debugOutput: false,
            isCloseHidden: false,
            isCloseButton: true,
            isModal: true,
            baseELID: '',
            title: null,
            projectID: '',
            itemID: '',
            src: '',
            origin: '*',
            scope: 'default_channel',
            notifyActions: [],
            top: 50,
            left: 50,
            width: 640,
            height: 480
        },

        // strQueryID=HDS|RPT|RPT000|RPT00100&strCOMPANY_NO=1&strDOCUMENT_NO=002
        // syn.$w.lagacyPrintPdfDocument({
        //     strQueryID: 'HDS|RPT|RPT000|RPT00100',
        //     strCOMPANY_NO: '1',
        //     strDOCUMENT_NO: '002',
        // });
        lagacyPrintPdfDocument(pdfOption) {
            try {
                var userNo = (syn.$w.AppInfo.getWorkConcurrentValue(syn.$w.SSO.WorkCompanyNo, 'User') || syn.$w.SSO.UserNo);

                var defaultPdfOption = {
                    strLoginCompanyNo: syn.$w.SSO.WorkCompanyNo,
                    strLoginUserNo: userNo,
                    strPRINT_TYPE: ''
                };

                if (syn.Config && syn.Config.Environment) {
                    defaultPdfOption.strENV = syn.Config.Environment.substring(0, 1);
                }

                pdfOption = syn.$w.argumentsExtend(defaultPdfOption, pdfOption);

                var url = '/api/PdfManager/ParseUrlToPdf?base64QueryString=' + syn.$c.base64Encode('?appID=HDS' + syn.$r.toQueryString(pdfOption));
                printJS(url);
            } catch (error) {
                syn.$l.eventLog('$w.parsePdfUrl', ' error: ' + error.message, 'Error');
            }
        },

        // strQueryID=HDS|RPT|RPT000|RPT00100&strCOMPANY_NO=1&strDOCUMENT_NO=002
        // syn.$w.printPdfDocument({
        //     REPORT_ID: 'RPT001',
        //     COMPANY_NO: '1',
        //     DOCUMENT_NO: '002',
        //     PRINT_TYPE: 'WORK_'
        // });
        printPdfDocument(pdfOption) {
            try {
                var userNo = (syn.$w.AppInfo.getWorkConcurrentValue(syn.$w.SSO.WorkCompanyNo, 'User') || syn.$w.SSO.UserNo);

                var defaultPdfOption = {
                    REPORT_ID: '',
                    COMPANY_NO: syn.$w.SSO.WorkCompanyNo,
                    DOCUMENT_FORM_ID: '',
                    DOCUMENT_NO: '',
                    EMPLOYEE_NO: userNo,
                    PRINT_TYPE: '',
                    ENV: 'D'
                };

                if (syn.Config && syn.Config.Environment) {
                    defaultPdfOption.ENV = syn.Config.Environment.substring(0, 1);
                }

                pdfOption = syn.$w.argumentsExtend(defaultPdfOption, pdfOption);
                var url = '/api/PdfManager/CrownixPdfDownload?appID=HDS' + syn.$r.toQueryString(pdfOption);
                printJS(url);
            } catch (error) {
                syn.$l.eventLog('$w.parsePdfUrl', ' error: ' + error.message, 'Error');
            }
        },

        // strQueryID=HDS|RPT|RPT000|RPT00100&strCOMPANY_NO=1&strDOCUMENT_NO=002
        // var url = syn.$w.getPdfDocumentUrl({
        //     strQueryID: 'HDS|RPT|RPT000|RPT00100',
        //     strCOMPANY_NO: '1',
        //     strDOCUMENT_NO: '002',
        // });
        getPdfDocumentUrl(pdfOption) {
            try {
                var userNo = (syn.$w.AppInfo.getWorkConcurrentValue(syn.$w.SSO.WorkCompanyNo, 'User') || syn.$w.SSO.UserNo);

                var defaultPdfOption = {
                    strLoginCompanyNo: syn.$w.SSO.WorkCompanyNo,
                    strLoginUserNo: userNo
                };

                pdfOption = syn.$w.argumentsExtend(defaultPdfOption, pdfOption);

                return '/api/PdfManager/ParseUrlToPdf?base64QueryString=' + syn.$c.base64Encode('?appID=HDS' + syn.$r.toQueryString(pdfOption));
            } catch (error) {
                syn.$l.eventLog('$w.getPdfDocumentUrl', ' error: ' + error.message, 'Error');
            }
        },

        executeChannelMessage(executeName, methodName, parameters, callback, channelID) {
            var frameMessage = syn.$w.iframeChannels.find(function (item) { return item.id == (channelID || $this.channelID) });
            if ($object.isNullOrUndefined(frameMessage) == false) {
                frameMessage.channel[executeName]({
                    method: methodName,
                    params: parameters,
                    error(error, message) {
                        syn.$l.eventLog('$w.executeChannelMessage', methodName + ' error: ' + error + ' (' + message + ')', 'Error');

                        if (callback) {
                            callback(error, message);
                        }
                    },
                    success(val) {
                        syn.$l.eventLog('$w.executeChannelMessage', methodName + ' returns: ' + val, 'Debug');

                        if (callback) {
                            callback(null, val);
                        }
                    }
                });
            }
        },

        serviceClientException(title, message, stack) {
            if (syn.$w.domainTransactionLoaderEnd) {
                syn.$w.domainTransactionLoaderEnd();
            }

            if ($.modal) {
                $.modal.close();
            }

            if ($progressBar) {
                $progressBar.close();
            }

            if (syn.$w.alert && $.alert) {
                var alertOptions = $ref.clone(syn.$w.alertOptions);
                alertOptions.minWidth = 480;
                alertOptions.minHeight = 285;
                alertOptions.stack = stack;
                alertOptions.autoSize = true;
                syn.$w.alert(message, title, alertOptions);
            }
            else {
                console.log(title, message);
            }
            return false;
        },

        setServiceObjectHeader(jsonObject) {
            $timeTracker.Init(jsonObject.RequestID);
            $timeTracker.recordSave(jsonObject.ServiceID, jsonObject.ServiceID + ' prepare serviceObject');
        },

        serviceClientCallback(jsonObject) {
            $timeTracker.Init(jsonObject.ResponseID);
            $timeTracker.recordSave(jsonObject.ServiceID, jsonObject.ServiceID + ' serviceClient complete');
        },

        serviceClientInterceptor(clientTag, xhr) {
            if (syn.$w.domainTransactionLoaderEnd) {
                syn.$w.domainTransactionLoaderEnd();
            }

            if (clientTag == "ROQKFWKTLFGODZNJFL") {
                if ($ && $.modal) {
                    $.modal.close();
                }

                if ($progressBar) {
                    $progressBar.close();
                }

                var alertOptions = $ref.clone(syn.$w.alertOptions);
                alertOptions.minWidth = 480;
                alertOptions.minHeight = 320;
                syn.$w.alert(JSON.parse(xhr.responseText).Result.replace(/↓/g, '\n\n'), 'Execute SQL', alertOptions);
                return false;
            }
            else {
                if ($progressBar) {
                    $progressBar.close();
                }

                try {
                    var response = JSON.parse(xhr.responseText);
                    var acknowledge = response.Acknowledge;
                    var exceptionText = response.ExceptionText;
                    if (acknowledge == 0 && exceptionText.match(/(ORA-20[0-9]{3})/) != null) {
                        if (exceptionText.indexOf('ORA-20999') > -1) {
                            var parseText = /ORA\-20999: (.*?)\n/.exec(exceptionText);
                            if (parseText != null && parseText.length > 1) {
                                var message = parseText[1];
                                syn.$w.statusMessage(message);
                                syn.$w.alert(message);
                            }
                            return false;
                        }

                        var mod = globalThis[$w.pageScript];
                        if (mod && mod.hook.afterTransaction) {
                            var addtionalData = {};
                            addtionalData.exceptionText = exceptionText;
                            mod.afterTransaction(null, response.TH.FUNC_CD, null, addtionalData);
                        }
                        return false;
                    }
                    else if (acknowledge == 0 && exceptionText.match(/(QAF-20[0-9]{3})/) != null) {
                        if (exceptionText.indexOf('QAF-20999') > -1) {
                            var parseText = /QAF\-20999: (.*?)\n/.exec(exceptionText);
                            if (parseText != null && parseText.length > 1) {
                                var message = parseText[1];
                                syn.$w.statusMessage(message);
                                syn.$w.alert(message);
                            }
                            return false;
                        }

                        var mod = globalThis[$w.pageScript];
                        if (mod && mod.hook.afterTransaction) {
                            var addtionalData = {};
                            addtionalData.exceptionText = exceptionText;
                            mod.afterTransaction(null, response.TH.FUNC_CD, null, addtionalData);
                        }
                        return false;
                    }
                } catch (error) {
                    syn.$l.eventLog('serviceClientInterceptor', error, 'Error');
                }

                return true;
            }
        },

        setServiceClientHeader(xhr) {
            var isContinue = true;
            var evt = window.event || parent.event || parent.window.event;

            if (syn.$l.get('hdfExteriorLinkage') != null && syn.$l.get('hdfExteriorLinkage').value == 'false') {
                if (parent.$MainFrame) {
                    if (parent.$MainFrame.timerRunning == false) {
                        syn.$w.alert($res.messages.SessionDestroyed.text);
                        $progressBar.close();
                        isContinue = false;
                    }
                }
            }

            if (evt && evt.ctrlKey == true && evt.altKey == true) {
                syn.$w.clientTag = 'ROQKFWKTLFGODZNJFL';
                xhr.setRequestHeader('ClientTag', 'ROQKFWKTLFGODZNJFL');
            }
            else {
                syn.$w.clientTag = 'UUNOLkV4cGVydEFwcA==';
                xhr.setRequestHeader('ClientTag', 'UUNOLkV4cGVydEFwcA==');

                var tabID = syn.$r.query('tabID');
                if (tabID) {
                    var tabInfo = syn.$r.query('tabID').split('$');
                    xhr.setRequestHeader('CategoryID', tabInfo[3]);
                    xhr.setRequestHeader('MenuID', tabInfo[0]);
                }
            }

            if (location.href.toLowerCase().indexOf('/views/ui/') > -1 || location.href.toLowerCase().indexOf('/views/shared/') > -1 || location.href.toLowerCase().indexOf('/sample/') > -1) {
                var member = syn.$w.getStorage('member');
                if ($string.isNullOrEmpty(member) == false) {
                    xhr.setRequestHeader('EasyWork.Member', member);
                }                
            }

            return isContinue;
        },

        getFetchClientOptions(options) {
            var result = null;
            var defaultSetting = {
                method: "GET",
                headers: {
                }
            };

            result = syn.$w.argumentsExtend(defaultSetting, options);
            var evt = window.event || parent.event || parent.window.event;

            if (syn.$l.get('hdfExteriorLinkage') != null && syn.$l.get('hdfExteriorLinkage').value == 'false') {
                if (parent.$MainFrame) {
                    if (parent.$MainFrame.timerRunning == false) {
                        syn.$w.alert($res.messages.SessionDestroyed.text);
                        $progressBar.close();
                        isContinue = false;
                    }
                }
            }

            if (evt && evt.ctrlKey == true && evt.altKey == true) {
                result.headers['ClientTag'] = 'ROQKFWKTLFGODZNJFL';
            }
            else {
                result.headers['ClientTag'] = 'UUNOLkV4cGVydEFwcA==';

                var tabID = syn.$r.query('tabID');
                if (tabID) {
                    var tabInfo = syn.$r.query('tabID').split('$');
                    result.headers['CategoryID'] = tabInfo[3];
                    result.headers['MenuID'] = tabInfo[0];
                }
            }

            if (location.href.toLowerCase().indexOf('/views/ui/') > -1 || location.href.toLowerCase().indexOf('/views/shared/') > -1 || location.href.toLowerCase().indexOf('/sample/') > -1) {
                var member = syn.$w.getStorage('member');
                if ($string.isNullOrEmpty(member) == false) {
                    result.headers['EasyWork.Member'] = member;
                }
            }

            return result;
        },

        serviceClient(url, jsonObject, callBack, async, token) {
            if (!jsonObject) {
                alert('서비스 호출에 필요한 jsonObject가 구성되지 않았습니다.');
                return;
            }

            var jsonString = JSON.stringify(jsonObject);

            var xhr = this.xmlHttp();

            if (url.split('?').length == 1) {
                url = url + '?noCacheIE=' + (new Date()).getTime();
            }
            else {
                url = url + '&noCacheIE=' + (new Date()).getTime();
            }

            if (!async) {
                async = true;
            }

            xhr.open($webform.method, url, async);
            xhr.setRequestHeader('Accept-Language', this.localeID);

            if (this.setServiceClientHeader) {
                if (this.setServiceClientHeader(xhr) == false) {
                    return;
                }
            }

            if (token !== undefined) {
                xhr.setRequestHeader('User-Token', token);
            }

            if (async === false) {
                xhr.setRequestHeader('X-Requested-With', 'Qrame ServiceClient');
                xhr.setRequestHeader('content-type', 'application/json');
                xhr.send(jsonString);

                return xhr;
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status == 0) {
                        return;
                    }
                    else if (xhr.status !== 200) {
                        if (xhr.responseText.length > 0) {
                            alert(xhr.responseText || xhr.statusText);
                        }
                    }

                    try {
                        if (syn.$w.clientTag && syn.$w.clientTag == 'ROQKFWKTLFGODZNJFL' && syn.$w.serviceClientInterceptor) {
                            if (syn.$w.serviceClientInterceptor(url, xhr) === false) {
                                return;
                            }
                        }
                    }
                    catch (e) {
                        // ajax 요청중에 웹 페이지가 close되었을 경우 return 처리입니다.
                        return;
                    }

                    var contentType = 'text';
                    var errorText = '';
                    var serviceID = '';

                    try {
                        var jsonObject = JSON.parse(xhr.responseText);
                        contentType = jsonObject.ReturnType;
                        serviceID = jsonObject.ServiceID;
                        $timeTracker.Init(jsonObject.ResponseID);

                        if (contentType === 'error') {
                            errorText = jsonObject.ExceptionText;
                        }

                        if (contentType === 'warning') {
                            var mod = window[syn.$w.pageScript];
                            if (mod && mod.hook.serviceClientException) {
                                mod.hook.serviceClientException(url, jsonObject, xhr);
                            }
                            else {
                                syn.$l.eventLog('$w.serviceClient', 'ServiceID : ' + serviceID + ', ' + jsonObject.Result, 'Warning');
                            }
                        }
                        else if (contentType.indexOf('text') > -1 || contentType.indexOf('json') > -1) {
                            if (callBack) {
                                callBack(jsonObject);
                            }
                        }
                        else if (contentType.indexOf('xml') > -1) {
                            if (callBack) {
                                callBack(xhr.responseXML);
                            }
                        }
                        else {
                            if (syn.$w.serviceClientException) {
                                if (syn.$w.serviceClientException(url, jsonObject, xhr) === false) {
                                    syn.$l.eventLog('$w.serviceClient', 'ServiceID : ' + serviceID + ', ' + errorText, 'Warning');
                                }
                            }
                            else {
                                syn.$l.eventLog('$w.serviceClient', 'ServiceID : ' + serviceID + ', ' + errorText, 'Warning');
                            }

                            var mod = window[syn.$w.pageScript];
                            if (mod && mod.hook.serviceClientException) {
                                mod.hook.serviceClientException(url, jsonObject, xhr);
                            }
                        }

                        if ($progressBar.isProgress == true) {
                            $progressBar.close();
                        }

                        if (jsonObject.ServiceID) {
                            $timeTracker.recordSave(jsonObject.ServiceID, jsonObject.ServiceID + ' serviceClient complete');
                        }
                    }
                    catch (e) {
                        if ($progressBar.isProgress == true) {
                            $progressBar.close();
                        }
                        return;
                    }

                    mod = null;
                    contentType = null;
                    errorText = null;
                    serviceID = null;
                    pageScript = null;
                    url = null;
                    jsonObject = null
                    xhr = null;
                    return;
                }
            }
            xhr.setRequestHeader('X-Requested-With', 'Qrame ServiceClient');
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(jsonString);
        },

        getActiveTabInfo() {
            var tabInfo = null;
            if (parent.$layout) {
                tabInfo = parent.$layout.getActiveTab();
            }
            else {
                syn.$w.alert('getActiveTabInfo 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }

            try {
                return tabInfo;
            }
            finally {
                tabInfo = null;
            }
        },

        getCurrentTabInfo() {
            var tabObject = null;

            var tabID = syn.$r.query('tabID');
            if (tabID) {
                var tabInfo = tabID.split('$');
                tabObject =
                {
                    tabID: tabID,
                    projectID: tabInfo[0],
                    itemID: tabInfo[1],
                    menuID: tabInfo[2],
                    parentMenuID: tabInfo[3]
                }
            }

            return tabObject;
        },

        getTabInfo(projectID, itemID) {
            var menuObject = null;
            if (parent.$layout) {
                menuObject = parent.$layout.getTabInfo(projectID, itemID);
            }
            else {
                syn.$w.alert('getTabInfo 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }

            return menuObject;
        },

        setTabTitleText(val) {
            var tabID = syn.$r.query('tabID');
            if (tabID && val) {
                if (parent.$layout) {
                    var tabHead = parent.$l.get(tabID);
                    if (tabHead) {
                        tabHead.querySelector('span').textContent = val;
                    }
                }
                else {
                    syn.$w.alert('setTabTitleText 함수는 UI 화면내에서만 호출 할 수 있습니다');
                }
            }
        },

        getTabContentHeight(projectID, itemID) {
            var tabID = null;
            if (parent.$layout) {
                if (projectID && itemID) {
                    tabID = parent.$layout.getActiveTabID(projectID, itemID);
                }
                else {
                    tabID = syn.$r.query('tabID');
                }
            }
            else {
                syn.$l.eventLog('syn.domain', 'getTabContentHeight 함수는 UI 화면내에서만 호출 할 수 있습니다', 'Warning');
                return;
            }

            try {
                var result = 0;
                result = $(parent.$l.get(tabID + '$i')).height();
                var documentHeight = $(document.body).height();

                if (result < documentHeight) {
                    result = documentHeight;
                }

                return result;
            }
            finally {
                tabID = null;
            }
        },

        triggerUICommand(projectID, itemID, func, val) {
            if (parent.$layout) {
                var tabID = parent.$layout.getActiveTabID(projectID, itemID);
                if (tabID) {
                    parent.$layout.focusTabUI(tabID);
                    var pageWindow = parent.$layout.getActiveTabContent(tabID);
                    if (pageWindow) {
                        var pageScript = pageWindow[pageWindow['$w'].pageScript];
                        var targetFunction = pageScript[func];

                        if (targetFunction) {
                            targetFunction(val);
                        }
                    }
                }
                else {
                    syn.$w.addTabUI(projectID, itemID, function (tabID) {
                        if (parent && parent.$MainFrame) {
                            var tabLI = parent.document.querySelector('ul[class="mainTabUI"] > li[id="' + tabID + '"]');
                            if (tabLI) {
                                parent.syn.$m.setStyle(tabLI, 'display', 'block');
                            }
                        }

                        var tryCount = 0;
                        var readyCheckID = setInterval(function () {
                            if (tryCount > 10) {
                                clearInterval(readyCheckID);
                                return;
                            }

                            if (tabID) {
                                var pageWindow = parent.$layout.getActiveTabContent(tabID);
                                if (pageWindow && pageWindow['$w']) {
                                    clearInterval(readyCheckID);

                                    var pageWebform = pageWindow['$w'];
                                    var pageScript = pageWindow[pageWebform.pageScript];
                                    var remainingTriggerIntervalID = setInterval(function () {
                                        clearInterval(remainingTriggerIntervalID);
                                        if (pageWebform.isPageLoad == true) {
                                            var targetFunction = pageScript[func];

                                            if (targetFunction) {
                                                targetFunction(val);
                                            }
                                        }
                                    }, 250);
                                }
                            }
                        }, 600);

                        return false;
                    });
                }
            }
            else {
                syn.$w.alert('triggerUICommand 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }
        },

        setUIStorage(projectID, itemID, storageKey, val) {
            if (parent.$layout) {
                var menuID = '{0}${1}'.format(projectID, itemID);
                if (val) {
                    syn.$w.setStorage(menuID + '~' + storageKey, val);

                    var tabID = parent.$layout.getActiveTabID(projectID, itemID);
                    var pageWindow = parent.$layout.getActiveTabContent(tabID);;
                    if (pageWindow) {
                        var pageScript = pageWindow[pageWindow['$w'].pageScript];
                        parent.$layout.layout_UIStoregeChanging(pageScript, tabID, storageKey);
                    }
                }
                else {
                    syn.$w.removeStorage(menuID + '~' + storageKey);
                }
            }
            else {
                syn.$w.alert('setUIStorage 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }
        },

        getUIStorage(storageKey) {
            if (parent.$layout) {
                var tabInfo = syn.$w.getCurrentTabInfo();
                var menuID = '{0}${1}'.format(tabInfo.projectID, tabInfo.itemID);

                return syn.$w.getStorage(menuID + '~' + storageKey);
            }
            else {
                syn.$w.alert('getUIStorage 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }
        },

        domainTransactionLoaderStart() {
            syn.$w.domainTransactionLoaderEnd();

            var mod = window[syn.$w.pageScript];
            if (mod && $object.isNullOrUndefined(mod.isTransactionLoader) == true) {
                mod.isTransactionLoader = true;
            }

            if (mod.isTransactionLoader == true && location.pathname.substring(0, 6) === '/views') {
                syn.$w.nanobar.go(100);
                syn.$w.transactionLoaderID = setInterval(function () {
                    syn.$w.nanobar.go(100);
                }, 1000);
            }
        },

        domainTransactionLoaderEnd() {
            if (syn.$w.transactionLoaderID) {
                clearInterval(syn.$w.transactionLoaderID);
                syn.$w.transactionLoaderID = null;
            }
        },

        progressMessage(val) {
            if ($progressBar) {
                if ($progressBar.isProgress == true) {
                    $progressBar.close();
                }

                $progressBar.show(val);
            }

            if (parent.$layout) {
                var tabInfo = syn.$w.getCurrentTabInfo();

                if (tabInfo) {
                    parent.$layout.setStatusMessage(tabInfo.tabID, val);
                }
            }
        },

        closeProgressMessage() {
            if ($progressBar) {
                if ($progressBar.isProgress == true) {
                    $progressBar.close();
                }
            }
        },

        statusMessage(val) {
            if (parent.$layout) {
                var tabInfo = syn.$w.getCurrentTabInfo();
                if (tabInfo) {
                    parent.$layout.setStatusMessage(tabInfo.tabID, val);
                }
                else {
                    syn.$l.eventLog('statusMessage', val, 'Information');
                }
            }
        },

        addTabUI(projectID, itemID, callback) {
            if (parent.$layout) {
                var tabID = syn.$r.query('tabID');
                if (tabID != '') {
                    var menu_node = null;
                    var menu_nodes = parent.$layout.menus.filter(function (item) { return item.ASSEMBLYNAME == projectID && item.CLASSNAME == itemID });
                    if (menu_nodes.length > 0) {
                        menu_node = menu_nodes[0];
                    }
                    else {
                        syn.$w.alert('메뉴 정보가 올바르지 않습니다', '정보');
                        return;
                    }

                    var url = '';

                    if (menu_node.PROGRAMPATH) {
                        url = menu_node.PROGRAMPATH;
                    }
                    else {
                        url = '/views/{0}/{1}.html'.format(menu_node.ASSEMBLYNAME, menu_node.CLASSNAME);
                    }

                    if (event && event.ctrlKey == true) {
                        url = url.replace('views', 'designs');
                    }

                    parent.$layout.addTabUI(menu_node.ASSEMBLYNAME, menu_node.CLASSNAME, menu_node.PROGRAMID, menu_node.PARENTID, url, callback);
                }
                else {
                    syn.$w.alert('addTabUI 함수는 UI 화면내에서만 호출 할 수 있습니다');
                }
            }
            else {
                syn.$w.alert('addTabUI 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }
        },

        closeTabID(tabID) {
            if (parent.$layout) {
                parent.$layout.closeTabID(tabID);
            }
            else {
                syn.$w.alert('closeTabID 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }
        },

        closeTabUI(projectID, itemID) {
            if (parent.$layout) {
                var tabID = parent.$layout.getActiveTabID(projectID, itemID);
                parent.$layout.closeTabID(tabID);
            }
            else {
                syn.$w.alert('closeTabUI 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }
        },

        isTabUI(projectID, itemID) {
            var result = false;
            if (parent.$layout) {
                var tabID = parent.$layout.getActiveTabID(projectID, itemID);
                if (tabID) {
                    result = true;
                }
            }
            else {
                syn.$w.alert('isTabUI 함수는 UI 화면내에서만 호출 할 수 있습니다');
            }

            return result;
        },

        closeDialog(result) {
            syn.$w.dialogResult = result;
            $.modal.close();
        },

        closeAlertDialog(result) {
            syn.$w.alertResult = result;
            $.alert.close();
        },

        notify(text, caption, options) {
            switch (options) {
                case 'info':
                    Notifier.notify(text, caption);
                    break;
                case 'warning':
                    Notifier.notify(text, caption);
                    break;
                case 'error':
                    Notifier.notify(text, caption);
                    break;
                case 'question':
                    Notifier.notify(text, caption);
                    break;
                default:
                    Notifier.notify(text, caption);
                    break;
            }
        },

        alert(text, caption, options, callback) {
            var el = document.createElement('div');
            var dl = syn.$m.append(el, 'dl');
            var dt = syn.$m.append(dl, 'dt');
            var dd = syn.$m.append(dl, 'dd');
            var elCaption = syn.$m.append(dd, 'div');
            var elText = syn.$m.append(dd, 'p');

            if (options && options.autoSize == true) {
                var textSize = syn.$d.measureSize(options.stack);

                if (textSize) {
                    var textWidth = parseInt(textSize.width.replace('px', '')) + 35;
                    var textHeight = parseInt(textSize.height.replace('px', ''));

                    if (textWidth > 800) {
                        textWidth = 800;
                    }

                    if (textWidth > options.minWidth) {
                        options.minWidth = textWidth;
                    }

                    if (textHeight > (options.minHeight - 160)) {
                        if (textHeight > 600) {
                            textHeight = 600;
                        }
                        options.minHeight = textHeight + 160;
                        options.textHeight = textHeight;
                    }
                }
            }

            if (options && options.stack) {
                var elStack = syn.$m.append(el, 'div');
                var textHeight = options.textHeight ? options.textHeight : 160;
                syn.$m.addCssText(elStack, 'margin: 15px; height: {0}px; overflow: auto; color: #000'.format(textHeight));
                elStack.innerHTML = options.stack.replace(/(\n|\r\n)/gm, '<br />');
            }

            var elButtons = syn.$m.append(el, 'div');
            var elIcon = syn.$m.append(dt, 'span');

            syn.$m.addCssText(elIcon, 'color: #434343; font-size: 72px; margin-top: 20px;');
            syn.$m.addClass(elButtons, 'btn-area');

            syn.$m.setStyle(el, 'display', 'none');

            elText.innerHTML = text.replace(/(\n|\r\n)/gm, '<br />');
            elCaption.innerText = caption ? caption : '';

            if (options) {
                options.close = false;
            }
            else {
                options = $ref.clone(syn.$w.alertOptions);
                options.dialogIcon = '1'; // 1:Information, 2:Warning, 3:Question, 4:Error (default:1)
                options.dialogButtons = '1'; // 1:OK, 2:OKCancel, 3:YesNo, 4:YesNoCancel (default:1)
                options.close = false;
            }

            if (options.dialogIcon) {
                switch (options.dialogIcon) {
                    case '1': // 1:Information
                        syn.$m.addClass(elIcon, 'ri-information-line');
                        break;
                    case '2': // 2:Warning
                        syn.$m.addClass(elIcon, 'ri-error-warning-line');
                        break;
                    case '3': // 3:Question
                        syn.$m.addClass(elIcon, 'ri-question-line');
                        break;
                    case '4': // 4:Error
                        syn.$m.addClass(elIcon, 'ri-alarm-warning-line');
                        break;
                    default: // 1:Information
                        syn.$m.addClass(elIcon, 'ri-information-line');
                        break;
                }
            }

            if (options.dialogButtons) {
                var button1 = null;
                var button2 = null;
                var button3 = null;
                switch (options.dialogButtons) {
                    case '1': // 1:OK
                        button1 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button1.value = '확인';
                        button1.data = 'OK';
                        break;
                    case '2': // 2:OKCancel
                        button1 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button1.value = '확인';
                        button1.data = 'OK';

                        button2 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button2.value = '취소';
                        button2.data = 'Cancel';
                        break;
                    case '3': // 3:YesNo
                        button1 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button1.value = '예';
                        button1.data = 'Yes';

                        button2 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button2.value = '아니오';
                        button2.data = 'No';
                        break;
                    case '4': // 4:YesNoCancel
                        button1 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button1.value = '예';
                        button1.data = 'Yes';

                        button2 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button2.value = '아니오';
                        button2.data = 'No';

                        button3 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button3.value = '취소';
                        button3.data = 'Cancel';
                        break;
                    default: // 1:OK
                        button1 = $('<input type="button"/>').appendTo(elButtons)[0];
                        button1.value = '확인';
                        button1.data = 'OK';
                        break;
                }

                var buttonCallback = function (e) {
                    var el = e.target || e;
                    syn.$w.closeAlertDialog(el.data);
                };

                syn.$m.addClass(button1, 'btn');
                syn.$m.addClass(button1, 'btn-primary');
                syn.$l.addEvent(button1, 'click', buttonCallback);

                if (button2) {
                    syn.$m.addClass(button2, 'btn');
                    syn.$m.addClass(button2, 'btn-default');
                    syn.$l.addEvent(button2, 'click', buttonCallback);
                }

                if (button3) {
                    syn.$m.addClass(button3, 'btn');
                    syn.$m.addClass(button3, 'btn-default');
                    syn.$l.addEvent(button3, 'click', buttonCallback);
                }

                button1 = null;
                button2 = null;
                button3 = null;
            }

            if (options) {
                if (callback) {
                    options.onCallback = callback;
                }
                $.alert(el, options);
            }
            else {
                if (callback) {
                    syn.$w.alertOptions.onCallback = callback;
                }
                $.alert(el, syn.$w.alertOptions);
            }

            if (parent.$layout) {
                $webform.isShowAlert = true;
                parent.$layout.buttonAction = false;
            }

            el = null;
            elCaption = null;
            elText = null;
            elIcon = null;
            elButtons = null;
        },

        showDialog(el, options, callback) {
            if (options) {
                if (callback) {
                    options.onCallback = callback;
                }
                $.modal(el, options);
            }
            else {
                if (callback) {
                    syn.$w.dialogOptions.onCallback = callback;
                }
                $.modal(el, syn.$w.dialogOptions);
            }

            if (parent.$layout) {
                $webform.isShowDialog = true;
                parent.$layout.buttonAction = false;
            }

            var modelEL = document.getElementById('simplemodal-container');
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            function elementDrag(evt) {
                evt = evt || window.event;
                evt.preventDefault();
                pos1 = pos3 - evt.clientX;
                pos2 = pos4 - evt.clientY;
                pos3 = evt.clientX;
                pos4 = evt.clientY;
                modelEL.style.top = (modelEL.offsetTop - pos2) + 'px';
                modelEL.style.left = (modelEL.offsetLeft - pos1) + 'px';
            }

            function closeDragElement() {
                syn.$l.removeEvent(document, 'mouseup', closeDragElement);
                syn.$l.removeEvent(document, 'mousemove', elementDrag);
            }

            function dragMouseDown(evt) {
                evt = evt || window.event;
                evt.preventDefault();
                pos3 = evt.clientX;
                pos4 = evt.clientY;

                syn.$l.addEvent(document, 'mouseup', closeDragElement);
                syn.$l.addEvent(document, 'mousemove', elementDrag);
            }

            var modelHeader = syn.$l.querySelector('#simplemodal-container .simplemodal-data h3');
            if (modelHeader) {
                syn.$l.addEvent(modelHeader, 'mousedown', dragMouseDown);
            } else {
                syn.$l.addEvent(modelEL, 'mousedown', dragMouseDown);
            }
        },

        showUIDialog(src, options, callback) {
            var el = document.createElement('div');
            syn.$m.addClass(el, 'simplemodal-data');
            syn.$m.setStyle(el, 'display', 'none');

            var h3 = syn.$m.append(el, 'h3');
            syn.$m.addClass(h3, 'mt-0');
            syn.$m.addClass(h3, 'mb-0');
            h3.innerText = options.caption ? options.caption : src;

            var iframe = syn.$m.append(el, 'iframe');
            syn.$m.setStyle(iframe, 'border', '0px');
            iframe.setAttribute('name', 'syn-repository');

            options.onShow = function (dialog) {
                iframe.setAttribute('src', src);
            }

            if (options.scrolling) {
                iframe.scrolling = 'yes';
            }
            else {
                iframe.scrolling = 'no';
            }

            if (options) {
                options.persist = false;
                if (callback) {
                    options.onCallback = callback;
                }

                iframe.width = '100%';
                iframe.height = (options.minHeight - 40).toString();

                $.modal(el, options);
            }
            else {
                options.persist = false;
                if (callback) {
                    syn.$w.dialogOptions.onCallback = callback;
                }

                iframe.width = '100%';
                iframe.height = '320';

                $.modal(el, syn.$w.dialogOptions);
            }

            if (parent.$layout) {
                $webform.isShowDialog = true;
                parent.$layout.buttonAction = false;
            }

            var modelEL = document.getElementById('simplemodal-container');
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            function elementDrag(evt) {
                evt = evt || window.event;
                evt.preventDefault();
                pos1 = pos3 - evt.clientX;
                pos2 = pos4 - evt.clientY;
                pos3 = evt.clientX;
                pos4 = evt.clientY;
                modelEL.style.top = (modelEL.offsetTop - pos2) + 'px';
                modelEL.style.left = (modelEL.offsetLeft - pos1) + 'px';
            }

            function closeDragElement() {
                syn.$l.removeEvent(document, 'mouseup', closeDragElement);
                syn.$l.removeEvent(document, 'mousemove', elementDrag);
            }

            function dragMouseDown(evt) {
                evt = evt || window.event;
                evt.preventDefault();
                pos3 = evt.clientX;
                pos4 = evt.clientY;

                syn.$l.addEvent(document, 'mouseup', closeDragElement);
                syn.$l.addEvent(document, 'mousemove', elementDrag);
            }

            var modelHeader = syn.$l.querySelector('#simplemodal-container .simplemodal-data h3');
            if (modelHeader) {
                syn.$l.addEvent(modelHeader, 'mousedown', dragMouseDown);
            } else {
                syn.$l.addEvent(modelEL, 'mousedown', dragMouseDown);
            }
        },

        windowOpen(elID, options, callback) {
            if (options.isCloseHidden == true) {
                $.fn.WM_close = syn.$w.windowHide;
            }

            if (syn.$l.get(elID)) {
                syn.$w.alert(elID + '는 사용 중인 팝업 ID 입니다');
                return;
            }

            if (window == top || window.parent.$w.pageScript == '$MainFrame') {
                var popupOptions = syn.$w.argumentsExtend(syn.$w.popupOptions, options);
                if (popupOptions.projectID && popupOptions.itemID && (popupOptions.src == null || popupOptions.src == undefined || popupOptions.src.trim() == '')) {
                    if (parent.$layout && parent.$layout.autocomplete_nodes) {
                        var menu_node = parent.$layout.autocomplete_nodes.find(function (item) { return (item.ASSEMBLYNAME == popupOptions.projectID && item.CLASSNAME == popupOptions.itemID) });
                        if (menu_node) {
                            var url = '';
                            if (menu_node.PROGRAMPATH) {
                                url = menu_node.PROGRAMPATH;
                            }
                            else {
                                if (menu_node.CLASSNAME.indexOf('|') > -1) {
                                    var menuCommand = menu_node.CLASSNAME.split('|')[0];
                                    var menuPath = menu_node.CLASSNAME.split('|')[1];
                                    if (menuCommand == 'URL') {
                                        url = menuPath;
                                    }
                                }
                                else {
                                    url = '/views/{0}/{1}.html'.format(menu_node.ASSEMBLYNAME, menu_node.CLASSNAME);
                                }
                            }

                            popupOptions.title = $object.isNullOrUndefined(popupOptions.title) == true ? menu_node.PROGRAMNAME : popupOptions.title;
                            popupOptions.src = url;
                        }
                    }
                }

                if (popupOptions.src == null || popupOptions.src == undefined || popupOptions.src.trim() == '') {
                    syn.$l.eventLog('syn.domain.windowOpen', '{0}메뉴ID 또는 URL 속성 확인 필요'.format(popupOptions.itemID ? popupOptions.itemID : ''), 'Warning');
                    return;
                }

                if (popupOptions.notifyActions.length == 0) {
                    syn.$l.eventLog('syn.domain.windowOpen', 'notifyActions 속성 확인 필요', 'Warning');
                    return;
                }

                var channelID = popupOptions.channelID ? popupOptions.channelID : null;
                popupOptions.title = $object.isNullOrUndefined(popupOptions.title) == false ? popupOptions.title : elID;
                
                if (popupOptions.title === '') {
                    popupOptions.title = ' ';
                }

                syn.$r.path = popupOptions.src;
                syn.$r.params = [];
                syn.$r.params['baseELID'] = (popupOptions.baseELID ? popupOptions.baseELID : elID);
                if (channelID) {
                    syn.$r.params['channelID'] = channelID;
                }

                var options = syn.$r.toUrlObject(popupOptions.src);
                for (var prop in options) {
                    syn.$r.params[prop] = options[prop];
                }

                if ($string.isNullOrEmpty(syn.$w.SSO.WorkCompanyNo) == false && syn.$r.params.hasOwnProperty('companyNo') == false) {
                    syn.$r.params['companyNo'] = syn.$w.SSO.WorkCompanyNo;
                }

                popupOptions.src = syn.$r.url();
                var windowHandle = $.WM_open(elID, popupOptions.src, popupOptions.target, popupOptions);
                if (options.isCloseButton == false) {
                    windowHandle.find('.horizbuts').hide();
                }

                windowHandle.find('.closebut').addClass('ri-close-line');

                if (windowHandle) {
                    var windowOffset = windowHandle.offset();
                    if (windowOffset.top < 0) {
                        windowHandle.offset({ top: 0 });
                    }

                    if (windowOffset.left < 0) {
                        windowHandle.offset({ left: 0 });
                    }

                    windowHandle.attr('channelID', channelID ? channelID : '');
                    windowHandle.attr('baseELID', popupOptions.baseELID);
                    if (popupOptions.isModal == true) {
                        var overlayEL = syn.$m.createElement('div');
                        var overlayZIndex = windowHandle.css('zIndex');
                        windowHandle.attr('overlayZIndex', overlayZIndex);
                        overlayEL.id = elID + '_overlay';
                        syn.$m.setStyle(overlayEL, 'z-index', (overlayZIndex - 1));
                        syn.$m.addClass(overlayEL, 'modal_overlay');
                        syn.$m.appendChild(document.body, overlayEL);
                    }

                    var contentWindow = windowHandle.find('iframe')[0].contentWindow;
                    syn.$l.addEvent(contentWindow, 'load', function () {
                        if (callback) {
                            callback(elID);
                        }
                    });

                    if (channelID) {
                        var frameMessage = {
                            elID: elID,
                            windowHandle: windowHandle,
                            id: channelID,
                            channel: syn.$channel.connect({
                                debugOutput: popupOptions.debugOutput,
                                window: contentWindow,
                                origin: popupOptions.origin,
                                scope: channelID
                            })
                        };

                        for (var i = 0; i < popupOptions.notifyActions.length; i++) {
                            var notifyAction = popupOptions.notifyActions[i];
                            frameMessage.channel.bind(notifyAction.actionID, notifyAction.handler);
                        }

                        syn.$w.iframeChannels.push(frameMessage);
                    }
                }
            }
            else {
                if (window.parent) {
                    setTimeout(function () {
                        window.parent.$w.windowOpen(elID, options, callback);
                    });
                }
                else {
                    syn.$l.eventLog('windowOpen', 'Qrame 화면에서만 호출 가능', 'Error');
                }
            }
        },

        windowShow(elID) {
            var windowForm = syn.$l.get(elID);
            if (windowForm) {
                syn.$m.setStyle(windowForm, 'display', 'block');
            }

            $('#' + elID).WM_raise();
        },

        windowHide(elID) {
            if (elID) {
                if (syn.$l.get(elID)) {
                    syn.$m.setStyle(syn.$l.get(elID), 'display', 'none');
                }
            }
            else {
                if (this.filter('.window').length > 0) {
                    syn.$m.setStyle(this.filter('.window')[0], 'display', 'none');
                }
            }

            $('#' + elID).WM_raise();
        },

        windowClose(elID) {
            if (window == top || window.parent.$w.pageScript == '$MainFrame') {
                var iframeChannels = syn.$w.iframeChannels.filter(function (item) { return item.elID == elID });
                if (iframeChannels.length > 0) {
                    var iframeChannel = iframeChannels[0];
                    var windowHandle = iframeChannel.windowHandle;
                    var channel = iframeChannel.channel;
                    channel.destroy();

                    var baseELID = windowHandle.attr('baseELID');
                    if (baseELID != '') {
                        $('#' + baseELID).closest('.window').WM_raise();
                    }
                    var windowOverlayID = windowHandle.attr('id') + '_overlay';
                    $('#' + windowOverlayID).remove();
                    windowHandle.WM_close();
                }
            }
            else {
                if (window.parent) {
                    window.parent.$w.windowClose(elID);
                }
            }
        },

        getUpdateParameters(cssSelector) {
            var result = [];
            var controls = [];

            if (cssSelector) {
                controls = syn.$l.querySelectorAll(cssSelector + ' *[bindingID]');
            }
            else {
                controls = syn.$l.querySelectorAll('input[type="text"], input[type="button"], input[type="checkbox"], input[type="hidden"], button, select, textarea');
            }

            var control = null;
            var bindingID = null;

            for (var i = 0; i < controls.length; i++) {
                control = controls[i];
                bindingID = control.getAttribute('bindingID');
                if (bindingID) {
                    switch (control.type.toLowerCase()) {
                        case 'checkbox':
                            result.push({ 'prop': bindingID, 'val': control.checked });
                            break;
                        default:
                            if (control.getAttribute('TextEditType') == 'Numeric') {
                                result.push({ 'prop': bindingID, 'val': control.value.toNumberString() });
                            }
                            else {
                                result.push({ 'prop': bindingID, 'val': control.value });
                            }
                            break;
                    }
                }
            }

            controls = syn.$l.querySelectorAll('input[type="radio"]');
            control = null;
            var elemIDs = [];
            var elID = '';

            for (var i = 0; i < controls.length; i++) {
                control = controls[i];
                bindingID = control.getAttribute('bindingID');

                if (bindingID) {
                    elemIDs.push(bindingID);
                }
            }

            elemIDs = $array.distinct(elemIDs);

            var radioButtons = null;
            for (var i = 0; i < elemIDs.length; i++) {
                elID = elemIDs[i];
                if ($radio) {
                    result.push({ 'prop': elID, 'val': $radio.getValue(elID) });
                }
                else {
                    radioButtons = document.getElementsByName(elID);
                    for (var j = 0; j < radioButtons.length; j++) {
                        if (radioButtons[j].checked) {
                            result.push({ 'prop': elID, 'val': radioButtons[j].value })
                            break;
                        }
                    }
                }
            }
            return result;
        },

        getSSOInfo() {
            var result = null;

            var member = syn.$w.getStorage('member', false);
            if (member == null) {
                if (syn.$r.getCookie('EasyWork.Member')) {
                    var value = syn.$c.base64Decode(syn.$r.getCookie('EasyWork.Member'));
                    result = JSON.parse(value);
                }
            }
            else {
                result = JSON.parse(syn.$c.base64Decode(member));
            }

            return result;
        },

        getAppInfo() {
            var result = null;

            var addtional = syn.$w.getStorage('addtional', false);
            if (addtional == null) {
                if (syn.$r.getCookie('EasyWork.Addtional')) {
                    var value = syn.$c.base64Decode(syn.$r.getCookie('EasyWork.Addtional'));
                    result = JSON.parse(value);
                }
            }
            else {
                result = JSON.parse(syn.$c.base64Decode(addtional));
            }

            if ($object.isNullOrUndefined(result) == false) {
                // GetNo - Company, User, Department, Position
                // GetName - Department, Position
                var getWorkConcurrentValue = function (companyNo, concurrentID, typeID) {
                    var result = null;
                    if ($object.isNullOrUndefined(typeID) == true) {
                        typeID = 'No';
                    }

                    if (syn.$w.AppInfo.CONCURRENTYN == 'Y') {
                        if ($object.isNullOrUndefined(syn.$w.SSO.WorkUserNo) == false) {
                            var index = syn.$w.AppInfo.CONCURRENTUSERNO.split(',').indexOf(syn.$w.SSO.WorkUserNo.toString());
                            if (index > -1) {
                                var concurrentItem = syn.$w.AppInfo['CONCURRENT' + concurrentID.toUpperCase() + typeID.toUpperCase()];
                                if ($object.isNullOrUndefined(concurrentItem) == false) {
                                    var concurrentCompany = syn.$w.AppInfo['CONCURRENTCOMPANYNO'];
                                    if ($object.isNullOrUndefined(concurrentCompany) == false) {
                                        var i = concurrentCompany.split(',').indexOf(companyNo.toString());
                                        if (i > -1 && concurrentCompany.split(',')[i] == companyNo) {
                                            result = concurrentItem.split(',')[index];
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            var index = syn.$w.AppInfo.CONCURRENTCOMPANYNO.split(',').indexOf(companyNo.toString());
                            if (index > -1) {
                                var concurrentItem = syn.$w.AppInfo['CONCURRENT' + concurrentID.toUpperCase() + typeID.toUpperCase()];
                                if ($object.isNullOrUndefined(concurrentItem) == true) {
                                    result = null;
                                }
                                else {
                                    result = concurrentItem.split(',')[index];
                                }
                            }
                        }
                    }
                    else if (syn.$w.AppInfo.CONCURRENTYN == 'N') {
                        var concurrentValue = syn.$w.SSO[concurrentID + typeID];
                        if ($object.isNullOrUndefined(concurrentValue) == true) {
                            result = null;
                        }
                        else {
                            result = concurrentValue;
                        }
                    }

                    return result;
                }

                result.getWorkConcurrentValue = getWorkConcurrentValue;
                result.getWorkUserInfo = function (companyNo, callback) {
                    var userNo = getWorkConcurrentValue(companyNo, 'User');

                    if ($string.isNullOrEmpty(companyNo) == false && $string.isNullOrEmpty(userNo) == false && callback) {
                        var directObject = {
                            ProgramID: 'HDS',
                            BusinessID: 'CMM',
                            SystemID: 'BP01',
                            TransactionID: 'CMM030',
                            FunctionID: 'GD01',
                            DataTransactionInterface: 'Row|Form',
                            InputObjects: [
                                { prop: 'COMPANY_NO', val: companyNo.toString() },
                                { prop: 'EMPLOYEE_NO', val: userNo }
                            ]
                        };

                        syn.$w.transactionDirect(directObject, function (response) {
                            var result = null;
                            if (response && response.length > 0) {
                                result = response[0].Value;
                                if ($string.isNullOrEmpty(result.ErrorMessage) == false) {
                                    syn.$l.eventLog('getWorkUserInfo', '겸직 사용자 정보 조회 오류, ErrorMessage: {0}'.format(result.ErrorMessage), 'Error');
                                }
                                else {
                                    callback(Object.keys(result).length > 0 ? result : null);
                                }
                            }
                            else {
                                syn.$l.eventLog('getWorkUserInfo', '겸직 사용자 정보 조회 오류, directObject: {0}'.format(JSON.stringify(directObject)), 'Error');
                            }
                        });
                    }
                }
            }

            return result;
        },

        setAppInfo(appInfo) {
            var today = new Date();
            today.setTime(today.getTime());

            var expires = 1000 * 60 * 60 * 24;
            var expiresDate = new Date(today.getTime() + (expires));
            var value = syn.$c.base64Encode(escape(JSON.stringify(appInfo)));
            document.cookie = 'EasyWork.Addtional=EasyWork.Addtional=' + value + ((expires) ? ';path=/;expires=' + expiresDate.toGMTString() : '');
        },

        execPrefixFunc(el, func) {
            var prefixs = ['webkit', 'moz', 'ms', 'o', ''];
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

        updateValue(el, bindingID) {
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    result[bindingID] = control.checked;
                    break;
                case 'text':
                    result[bindingID] = control.value;
                    break;
                default:
                    result[bindingID] = control.value;
                    break;
            }
        },

        initializeFormReset(el) {
            syn.$l.get('form1').reset();
            var els = syn.$l.querySelectorAll('select,checkbox');

            for (var i = 0; i < els.length; i++) {
                switch (els[i].type.toLowerCase()) {
                    case 'radio':
                        els[i].checked = false;
                        break;
                    case 'checkbox':
                        els[i].checked = false;
                        break;
                    case 'text':
                        els[i].value = '';
                    case 'select-one':
                        els[i].selectedIndex = 0;
                        break;
                    default:
                        els[i].value = '';
                        break;
                }
            }

            if (el) {
                el.focus();
            }

            els = null;
            el = null;

            return this;
        },

        initializeValue(el) {
            if (el.type !== undefined) {
                switch (el.type.toLowerCase()) {
                    case 'radio':
                        el.checked = el.getAttribute('IsDefaultChecked');
                        break;
                    case 'checkbox':
                        el.checked = false;
                        break;
                    case 'text':
                    case 'textarea':
                        el.value = '';
                        if (el.getAttribute('Booltoday') == 'True') {
                            el.value = (new Date()).getNow('d');
                        }
                        break;
                    case 'select-one':
                        el.selectedIndex = 0;
                        break;
                }
            }
            else if (el.className == 'grd_control') {
                $grid.dataClear(el.id.replace('_Box', ''));
            }
        },

        bindingValue(el, val) {
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    el.checked = val == '1' ? true : false;
                    break;
                case 'radio':
                    el.checked = el.value == val ? true : false;
                    break;
                case 'text':
                    if (el.getAttribute('TextEditType') == 'Numeric') {
                        el.value = val.toCurrency();
                    }
                    else {
                        el.value = val;
                    }
                    break;
                case 'select':
                    el.value = val;
                    break;
                default:
                    el.value = val;
                    break;
            }
        },

        getPersonPicturePath(businessID, personID) {
            var modValue = Number(personID) / 1000;
            var path = '\\' + businessID + '\\';

            if (isNaN(modValue)) {
                path += (modValue * 1000).toString() + '\\';
            }
            else {
                path += ((Number(modValue.toString().substring(0, modValue.toString().indexOf(''))) + 1) * 1000).toString() + '\\';
            }

            return path;
        },

        getPersonPictureNM(personID) {
            var fileNM = '0000000000' + personID;

            return fileNM.substring(fileNM.length, fileNM.length - 10);
        },

        getAuth(categoryID, worshipDeptID) {
            var jsonObject = {};
            jsonObject.RequestID = syn.$l.guid();
            jsonObject.ReturnType = 'json';
            jsonObject.ServiceID = 'GetAuth';
            jsonObject.NameValues = [];

            if (!worshipDeptID) {
                worshipDeptID = '0';
            }

            jsonObject.NameValues.push({ 'prop': 'categoryID', 'val': categoryID });
            jsonObject.NameValues.push({ 'prop': 'worshipDeptID', 'val': worshipDeptID });

            var responseData = syn.$w.serviceClient('/RESTFul/ZZ/', jsonObject, '', false);
            var jsonObject = JSON.parse(responseData.responseText);
            var resultData = JSON.parse(jsonObject.Result);

            if (resultData.gridJson[0].rows.length > 0) {
                syn.$w.Author = {};
                for (var i = 0; i < resultData.gridJson[0].rows.length; i++) {
                    syn.$w.Author[resultData.gridJson[0].rows[i].cell[0]] = resultData.gridJson[0].rows[i].cell[1];
                }
            }
        },

        getMailBody(contents) {
            syn.$sb.clear();
            syn.$sb.append('<HTML><HEAD><TITLE></TITLE></HEAD>');
            syn.$sb.append('<BODY vLink=#0048ff aLink=#0048ff link=#6666ff leftMargin=0  topMargin=30 marginheight=0 marginwidth=0>');
            syn.$sb.append('<TABLE cellSpacing=0 cellPadding=0 width=666 align=center border=0>');
            syn.$sb.append('<TBODY>');
            syn.$sb.append('<TR>');
            syn.$sb.append('<TD height=44 width=666></TD></TR>')
            syn.$sb.append('<TR>');
            syn.$sb.append('<TD></TD></TR>');
            syn.$sb.append('<TR>');
            syn.$sb.append('<TD>');
            syn.$sb.append('<TABLE cellSpacing=0 cellPadding=0 width=530 align=center border=0>');
            syn.$sb.append('<TBODY>');
            syn.$sb.append('<TR>');
            syn.$sb.append('<TD height=100>');
            syn.$sb.append('<FONT style=FONT-SIZE: 9pt; PADDING-BOTTOM: 1px; LINE-HEIGHT: 140%;FONT-FAMILY: 굴림, arial, verdana color=#333333 size=2>');
            syn.$sb.append('<BR>');
            syn.$sb.append(contents);
            syn.$sb.append('</FONT>');
            syn.$sb.append('</TD>');
            syn.$sb.append('</TR>');
            syn.$sb.append('</TBODY>');
            syn.$sb.append('</TABLE>');
            syn.$sb.append('</TD>');
            syn.$sb.append('</TR>');
            syn.$sb.append('<TR>');
            syn.$sb.append('<TD height=40><BR>');
            syn.$sb.append('</TD>');
            syn.$sb.append('</TR>');
            syn.$sb.append('<TR>');
            syn.$sb.append('<TD style="PADDING-RIGHT: 15px; PADDING-LEFT: 12px; FONT-SIZE: 9pt; PADDING-BOTTOM: 5px; COLOR: gray; PADDING-TOP: 5px; FONT-FAMILY: 굴림체" height=40 align=right>');
            syn.$sb.append('※본 메일은 발신 전용 메일입니다');
            syn.$sb.append('</TD></TR></TBODY></TABLE></BODY></HTML>');

            return syn.$sb.toString();
        },

        fireResizeEvent(contents) {
            if (document.createEvent) {
                var e = document.createEvent('HTMLEvents');
                e.initEvent('resize', true, false);
                document.body.dispatchEvent(e);

            }
            else if (document.createEventObject) {
                document.body.fireEvent('onresize');
            }
        },

        getDataSource(dataSourceID, parameters, callback) {
            var error = null;

            if (dataSourceID) {
                var mod = window[syn.$w.pageScript];
                if (mod && mod.config) {
                    var transactionObject = syn.$w.transactionObject('LD01', 'Json');
                    transactionObject.ProgramID = 'HDS';
                    transactionObject.BusinessID = 'SMP';
                    transactionObject.SystemID = 'BOP01';
                    transactionObject.TransactionID = 'SMP110';
                    transactionObject.ScreenID = syn.$w.pageScript.replace('$', '');

                    if (parameters == null || parameters == undefined) {
                        parameters = '';
                    }

                    var applicationIDPattern = /(\@ApplicationID)\s*:/;
                    if (applicationIDPattern.test(parameters) == false) {
                        parameters = '@ApplicationID:{0};'.format(1) + parameters;
                    }

                    var companyNoPattern = /(\@CompanyNo)\s*:/;
                    if (syn.$w.SSO && syn.$w.SSO.WorkCompanyNo && companyNoPattern.test(parameters) == false) {
                        parameters = '@CompanyNo:{0};'.format(syn.$w.SSO.WorkCompanyNo) + parameters;
                    }

                    var localeIDPattern = /(\@LocaleID)\s*:/;
                    if (localeIDPattern.test(parameters) == false) {
                        parameters = '@LocaleID:{0};'.format(syn.Config.Program.LocaleID) + parameters;
                    }

                    var inputObjects = [];
                    inputObjects.push({ prop: 'ApplicationID', val: 1 });
                    inputObjects.push({ prop: 'CodeHelpID', val: dataSourceID });
                    inputObjects.push({ prop: 'Parameters', val: parameters });

                    if (syn.$w.SSO && syn.$w.SSO.WorkCompanyNo) {
                        inputObjects.push({ prop: 'CompanyNo', val: syn.$w.SSO.WorkCompanyNo });
                    }

                    transactionObject.Inputs.push(inputObjects);
                    transactionObject.InputsItemCount.push(1);

                    var config = {};
                    config.programID = 'HDS';
                    config.businessID = 'SMP';
                    config.systemID = 'BOP01';
                    config.transactionID = 'SMP110';
                    config.ScreenID = syn.$w.pageScript.replace('$', '');

                    syn.$w.executeTransaction(config, transactionObject, function (responseData) {
                        if (responseData.length > 0) {
                            if (callback && responseData[0].Value && responseData[0].Value.CodeColumnID != null) {
                                callback(responseData[0].Value);
                            }
                            else {
                                callback(null);
                            }
                        }
                        else {
                            syn.$l.eventLog('getDataSource', 'DataSourceID: "{0}" 데이터 없음'.format(dataSourceID));
                        }
                    });
                }
                else {
                    syn.$l.eventLog('getDataSource', 'Qrame 화면에서만 호출 가능', 'Error');
                }
            }
        },

        // EasyWork 알림톡
        sendAlarmTalk(mobilePhone, messageContent, templateID, callback) {
            var directObject = {
                ProgramID: 'HDS',
                BusinessID: 'KKO',
                SystemID: 'BP01',
                TransactionID: 'KKO010',
                FunctionID: 'IF01',
                DataTransactionInterface: 'Row|Form',
                InputObjects: [
                    { prop: 'USER_ID', val: (syn.$w.AppInfo.getWorkConcurrentValue(syn.$w.SSO.WorkCompanyNo, 'User') || syn.$w.SSO.UserNo) },
                    { prop: 'PHONE_NO', val: mobilePhone },
                    { prop: 'MESSAGE_CONTENT', val: messageContent },
                    { prop: 'MESSAGE_TEMPLATE_ID', val: templateID }
                ]
            };

            syn.$w.transactionDirect(directObject, function (response) {
                var result = null;
                var error = null;
                if (response && response.length > 0) {
                    result = response[0].Value;
                    if ($string.isNullOrEmpty(result.ErrorMessage) == false) {
                        error = result.ErrorMessage;
                        syn.$l.eventLog('sendAlarmTalk', '알림톡 발송 오류, ErrorMessage: {0}'.format(result.ErrorMessage), 'Error');
                    }   
                }
                else {
                    error = '알림톡 발송 오류';
                    syn.$l.eventLog('sendAlarmTalk', '알림톡 발송 오류, directObject: {0}'.format(JSON.stringify(directObject)), 'Error');
                }

                if (callback) {
                    callback(error, result);
                }
            });
        },

        // 회사별 메신저 syn.$w.sendMattermostPost('2', 'HDSMTMA01', {인증번호: '1234'}, {emailID: 'handstack@handstack.kr'});
        sendMattermostPost(companyNo, templateID, templateParameters, receiver) {
            if ($string.isNullOrEmpty(companyNo) == false && $string.isNullOrEmpty(templateID) == false && $object.isNullOrUndefined(receiver) == false) {
                var userNo = syn.$w.AppInfo.getWorkConcurrentValue(companyNo, 'User');
                var mattermostConfig = syn.$w.AppInfo.COMPANYCONFIG.find(function (item) { return item.CODE == 'MTM000'; });
                if ($object.isNullOrUndefined(mattermostConfig) == false && mattermostConfig.VALUE4 == 'Y' && $object.isNullOrUndefined(receiver.emailID) == false) {
                    var formData = new FormData();
                    formData.append('companyNo', companyNo);
                    formData.append('userNo', userNo);
                    formData.append('templateCode', templateID);
                    formData.append('emailID', receiver.emailID);
                    formData.append('parameters', $object.isNullOrUndefined(templateParameters) == true ? '' : JSON.stringify(templateParameters));;

                    syn.$r.httpDataSubmit(formData, '/api/MessageSender/SendMattermostPost');
                }
            }
        },

        // 회사별 알림톡 & 메신저 syn.$w.sendAlarmMessage('2', 'HDSSMPA01', {인증번호: '1234'}, {phoneNo: '01000000000', emailID: 'handstack@handstack.kr'});
        sendAlarmMessage(companyNo, templateID, templateParameters, receiver) {
            if ($string.isNullOrEmpty(companyNo) == false && $string.isNullOrEmpty(templateID) == false && $object.isNullOrUndefined(receiver) == false) {
                var userNo = syn.$w.AppInfo.getWorkConcurrentValue(companyNo, 'User');
                var alramTalkConfig = syn.$w.AppInfo.COMPANYCONFIG.find(function (item) { return item.CODE == 'ART000'; });
                if ($object.isNullOrUndefined(alramTalkConfig) == false && alramTalkConfig.VALUE4 == 'Y' && $object.isNullOrUndefined(receiver.phoneNo) == false) {
                    var formData = new FormData();
                    formData.append('companyNo', companyNo);
                    formData.append('userNo', userNo);
                    formData.append('templateCode', templateID);
                    formData.append('phoneNo', receiver.phoneNo);
                    formData.append('parameters', $object.isNullOrUndefined(templateParameters) == true ? '' : JSON.stringify(templateParameters));;

                    syn.$r.httpDataSubmit(formData, '/api/MessageSender/SendAlarmTalk');
                }

                var mattermostConfig = syn.$w.AppInfo.COMPANYCONFIG.find(function (item) { return item.CODE == 'MTM000'; });
                if ($object.isNullOrUndefined(mattermostConfig) == false && mattermostConfig.VALUE4 == 'Y' && $object.isNullOrUndefined(receiver.emailID) == false) {
                    var formData = new FormData();
                    formData.append('companyNo', companyNo);
                    formData.append('userNo', userNo);
                    formData.append('templateCode', templateID);
                    formData.append('emailID', receiver.emailID);
                    formData.append('parameters', $object.isNullOrUndefined(templateParameters) == true ? '' : JSON.stringify(templateParameters));;

                    syn.$r.httpDataSubmit(formData, '/api/MessageSender/SendMattermostPost');
                }
            }
        },

        documentMeta(companyNo, categoryID, itemID, callback) {
            if ($object.isNullOrUndefined(companyNo) == false
                && $object.isNullOrUndefined(categoryID) == false
                && $object.isNullOrUndefined(itemID) == false
                && (window == top || window.parent.$w.pageScript == '$MainFrame')) {
                var directObject = {
                    ProgramID: 'HDS',
                    BusinessID: 'CMM',
                    TransactionID: 'CMM070',
                    FunctionID: 'GD01',
                    DataTransactionInterface: 'Row|Form',
                    InputObjects: [
                        { prop: 'COMPANY_NO', val: companyNo },
                        { prop: 'CATEGORY_NO', val: categoryID },
                        { prop: 'DOCUMENT_NO', val: itemID }
                    ]
                };

                syn.$w.transactionDirect(directObject, function (result) {
                    if (result && result.length > 0) {
                        var item = result[0].Value;
                        if (callback) {
                            callback(item);
                        }
                        else {
                            syn.$l.eventLog('documentMeta', JSON.stringify(item), 'Debug');
                        }
                    }
                    else {
                        syn.$w.alert('문서 메타 정보를 조회 할 수 없습니다');
                    }
                });
            }
            else {
                syn.$w.alert('필수 항목 확인 필요');
            }
        },

        openReport(queryID, jsonObject, reportUrl) {
            if (queryID) {
                if (jsonObject == null || jsonObject == undefined) {
                    jsonObject = {
                        strDummy: 'X'
                    };
                }

                jsonObject = syn.$w.argumentsExtend({
                    strQueryID: queryID
                }, jsonObject);

                var url = reportUrl ? reportUrl : 'http://pdf.qcnservice.co.kr/EPrint.aspx';
                if (url.indexOf('?') > -1) {
                    url = url + syn.$r.toQueryString(jsonObject);
                }
                else {
                    url = url + '?' + syn.$r.toQueryString(jsonObject).substring(1);
                }

                if (syn.Config && syn.Config.Environment) {
                    url = url + '&strENV=' + syn.Config.Environment.substring(0, 1);
                }

                window.open(url, jsonObject.strQueryID);
            }
            else {
                syn.$w.alert('레포트 요청 정보 확인 필요');
            }
        },

        codeCacheClear(options) {
            options = syn.$w.argumentsExtend({
                url: null,
                callback: null
            }, options);

            var url = null;
            if ($string.isNullOrEmpty(options.url) == true) {
                var apiService = syn.Config.DomainAPIServer;
                if (apiService.Port && apiService.Port != '') {
                    url = '{0}://{1}:{2}{3}'.format(apiService.Protocol, apiService.IP, apiService.Port, apiService.Path);
                }
                else {
                    url = '{0}://{1}{3}'.format(apiService.Protocol, apiService.IP, apiService.Path);
                }

                url = url + '/CacheClear';
            }
            else {
                url = options.url;
            }

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        if (options.callback) {
                            options.callback(xhr.responseText);
                        }
                    }
                    else {
                        syn.$l.eventLog('$w.getCacheClearUrl', 'async url: ' + url + ', status: ' + xhr.status.toString() + ', responseText: ' + xhr.responseText, 'Error');
                    }
                }
            };
            xhr.open('GET', url, true);
            xhr.send();
        }
    });
})(syn.$w);
(function (window) {
    var $timeTracker = new syn.module();

    $timeTracker.extend({
        serviceUrl: '/RESTFul/TimeLogger/',

        recordTimeID: syn.$l.guid(),
        recordPosition: 'UI',
        recordStartTime: $date.toTicks(new Date()),
        recordEndTime: '',
        isLoggingResetTime: false,
        entryLog:
        {
            typeName: '',
            comment: '',
            machineName: '',
            osVersion: '',
            methodName: ''
        },

        Init(guid, tickDateTime) {
            $timeTracker.recordTimeID = guid ? guid : syn.$l.guid();
            $timeTracker.startDateTicks = tickDateTime ? tickDateTime : $date.toTicks(new Date());
            $timeTracker.endDateTicks = '';
        },

        recordSave(methodName, comment) {
            var typeName = syn.$l.get('moduleScript') ? syn.$l.get('moduleScript').value : 'Untitle ModuleType';
            var isPerformanceLog = syn.$r.getCookie('isPerformanceLog');
            if (isPerformanceLog === 'true' || syn.$w.isPerformanceLog) {
                // var entryLog = $ref.clone($timeTracker.entryLog);
                // entryLog.typeName = typeName;
                // entryLog.comment = comment;
                // entryLog.machineName = syn.$b.appName;
                // entryLog.osVersion = syn.$b.appVersion;
                // entryLog.methodName = methodName;
                // 
                // $timeTracker.endDateTicks = $date.toTicks(new Date());
                // var traceTicks = ($timeTracker.endDateTicks - $timeTracker.startDateTicks).toString();
                // 
                // var jsonObject = {};
                // jsonObject.RequestID = syn.$l.guid();
                // jsonObject.ReturnType = 'json';
                // jsonObject.ServiceID = 'RecordSave';
                // jsonObject.NameValues = [];
                // 
                // jsonObject.NameValues.push({ 'prop': 'recordTimeID', 'val': $timeTracker.recordTimeID });
                // jsonObject.NameValues.push({ 'prop': 'recordPosition', 'val': $timeTracker.recordPosition });
                // jsonObject.NameValues.push({ 'prop': 'recordStartTime', 'val': $timeTracker.recordStartTime });
                // jsonObject.NameValues.push({ 'prop': 'recordEndTime', 'val': $timeTracker.recordEndTime });
                // jsonObject.NameValues.push({ 'prop': 'isLoggingResetTime', 'val': $timeTracker.isLoggingResetTime });
                // jsonObject.NameValues.push({ 'prop': 'entryLog', 'val': JSON.stringify(entryLog) });
                // 
                // syn.$w.basicServiceClient($timeTracker.serviceUrl, jsonObject);
            }
        }
    });
    window.$timeTracker = window.$timeTracker || $timeTracker;
})(window);
(function (window) {
    /// <summary>
    /// UI내에서 유효성 검사기능을 제공하는 모듈입니다.
    /// </summary>
    var $validation = syn.$v || new syn.module();
    var document = window.document;

    $validation.extend({
        version: '1.0',

        /// <summary>
        /// 유효성 검사후 입력 포커스를 부여할 element입니다.
        /// </summary>
        focusElement: null,

        /// <summary>
        /// 전체 유효성 검사(validateForm)시 검증 예외가 발생하면 다음 유효성 검사를 수행할지 결정합니다.
        /// </summary>
        isContinue: true,

        clear() {
            /// <summary>
            /// 유효성 검사기를 초기화합니다.
            /// </summary>
            /// <returns type='Type'></returns>
            var els = syn.$l.querySelectorAll('.need');
            for (var i = 0; i < els.length; i++) {
                syn.$m.removeClass(els[i], 'need');
            }

            els = null;
            return this;
        },

        validateControl(el) {
            /// <summary>
            /// HTML Element에 선언된 유효성 검사기를 실행합니다.
            /// &#10;&#10;
            /// example :&#10;
            /// &#10;$v.validateControl(syn.$l.get('Text1'))
            /// </summary>
            /// <param name='el' domElement='true'>HTML Element입니다.</param>
            /// <returns type='Type'></returns>
            var isValidate = true;
            var result = false;

            if (el.value.length > 0) {
                result = true;
                syn.$m.removeClass(el, 'need');
            }
            else {
                result = false;
                isValidate = false;

                if (syn.$w.hasClass(el, 'need') == false) {
                    syn.$m.addClass(el, 'need');
                }

                if (!this.focusElement) {
                    this.focusElement = el;
                }

                if (this.isContinue == false) {
                    return isValidate;
                }
            }

            result = null;

            try {
                return isValidate;
            }
            finally {
                isValidate = null;
            }
        },

        validateControls(els) {
            /// <summary>
            /// HTML Element에 선언된 유효성 검사기를 실행합니다.
            /// &#10;&#10;
            /// example :&#10;
            /// &#10;$v.validateControls(syn.$l.get('Text1', 'Text2', 'Text3'))
            /// </summary>
            /// <param name='el' domElement='true' optional='true'>HTML Element입니다.</param>
            /// <returns type='Type'></returns>
            var isValidate = true;
            var result = true;
            var el = null;

            if (!els) {
                els = syn.$l.querySelectorAll('.required');
            }

            if (els.type) {
                el = els;
                isValidate = this.validateControl(el);
            }
            else if (els.length) {
                for (var i = 0; i < els.length; i++) {
                    el = els[i];
                    result = this.validateControl(el);

                    if (result == false) {
                        isValidate = false;
                    }
                }
            }

            el = null;
            result = null;

            try {
                return isValidate;
            }
            finally {
                isValidate = null;
            }
        },

        // 'require', 'numeric', 'ipaddress', 'email', 'date', 'url'
        transactionValidate(controlModule, controlInfo, options, requestType) {
            if ((controlInfo.module == 'syn.uicontrols.$button' ||
                controlInfo.module == 'syn.uicontrols.$textbox' ||
                controlInfo.module == 'syn.uicontrols.$radio' ||
                controlInfo.module == 'syn.uicontrols.$select' ||
                controlInfo.module == 'syn.uicontrols.$multiselect' ||
                controlInfo.module == 'syn.uicontrols.$codepicker' ||
                controlInfo.module == 'syn.uicontrols.$colorpicker' ||
                controlInfo.module == 'syn.uicontrols.$datepicker' ||
                controlInfo.module == 'syn.uicontrols.$editor' ||
                controlInfo.module == 'syn.uicontrols.$jsoneditor' ||
                controlInfo.module == 'syn.uicontrols.$htmleditor' ||
                controlInfo.module == 'syn.uicontrols.$sourceeditor' ||
                controlInfo.module == 'syn.uicontrols.$files'
            ) && options.validators && options.validators.length > 0) {
                var valiationFunc = function (message) {
                    syn.$w.alert(message, null, null, function () {
                        syn.$l.get(controlInfo.id).focus();
                    });
                    syn.$w.statusMessage(message);
                    if ($progressBar.isProgress == true) {
                        $progressBar.close();
                    }
                    return false;
                };

                var controlText = options.controlText;
                var value = controlModule.getValue(controlInfo.id);
                if (options.validators.indexOf('require') > -1) {
                    if (value == '' || value == null) {
                        var message = '{0} 항목은 반드시 입력 해야합니다'.format(controlText);
                        return valiationFunc(message);
                    }

                    if (options.validators.indexOf('numeric') > -1) {
                        if (isNaN(value) == true) {
                            var message = '{0} 항목은 숫자값만 입력할 수 있습니다'.format(controlText);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('ipaddress') > -1) {
                        if (regexs.ipaddress.test(value) == false) {
                            var message = '{0} 항목은 IP 주소만 입력할 수 있습니다'.format(controlText);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('email') > -1) {
                        if (regexs.email.test(value) == false) {
                            var message = '{0} 항목은 이메일 주소만 입력할 수 있습니다'.format(controlText);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('date') > -1) {
                        var isDateCheck = true;
                        if (regexs.date.test(value) == false) {
                            isDateCheck = false;
                        };

                        var date = new Date(value);
                        var dateNum = date.getTime();
                        if (!dateNum && dateNum !== 0) {
                            isDateCheck = false;
                        }

                        isDateCheck = (date.toISOString().slice(0, 10) === value);

                        if (isDateCheck == false) {
                            var message = '{0} 항목은 "YYYY-MM-DD" 형식의 올바른 일자만 입력할 수 있습니다'.format(controlText);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('url') > -1) {
                        if (regexs.url.test(value) == false) {
                            var message = '{0} 항목은 웹 URL 주소만 입력할 수 있습니다'.format(controlText);
                            return valiationFunc(message);
                        }
                    }
                }
            }
            else if (controlInfo.module == 'syn.uicontrols.$grid' && requestType == 'Row' && options.validators && options.validators.length > 0) {
                var valiationFunc = function (message) {
                    syn.$w.alert(message);
                    syn.$w.statusMessage(message);
                    if ($progressBar.isProgress == true) {
                        $progressBar.close();
                    }
                    return false;
                };

                var controlText = options.controlText;
                var columnName = controlModule.getColHeader(controlInfo.id, controlModule.propToCol(controlInfo.id, options.data));
                var row = controlModule.getActiveRowIndex(controlInfo.id);
                var col = controlModule.propToCol(controlInfo.id, options.data);
                var flag = controlModule.getDataAtCell(controlInfo.id, row, 'Flag');
                if (flag != 'D') {
                    return true;
                }
                else {
                    var value = controlModule.getDataAtCell(controlInfo.id, row, col);
                    if (options.validators.indexOf('require') > -1) {
                        if (value === '' || value == null) {
                            var message = '{0} 그리드의 {1} 컬럼은 반드시 입력 해야입니다'.format(controlText, columnName);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('numeric') > -1) {
                        if (isNaN(value) == true) {
                            var message = '{0} 그리드의 {1} 컬럼은 숫자값만 입력할 수 있습니다'.format(controlText, columnName);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('ipaddress') > -1) {
                        if (regexs.ipaddress.test(value) == false) {
                            var message = '{0} 그리드의 {1} 컬럼은 IP 주소만 입력할 수 있습니다'.format(controlText, columnName);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('email') > -1) {
                        if (regexs.email.test(value) == false) {
                            var message = '{0} 그리드의 {1} 컬럼은 이메일 주소만 입력할 수 있습니다'.format(controlText, columnName);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('date') > -1) {
                        var isDateCheck = true;
                        if (regexs.date.test(value) == false) {
                            isDateCheck = false;
                        };

                        var date = new Date(value);
                        var dateNum = date.getTime();
                        if (!dateNum && dateNum !== 0) {
                            isDateCheck = false;
                        }

                        isDateCheck = (date.toISOString().slice(0, 10) === value);

                        if (isDateCheck == false) {
                            var message = '{0} 그리드의 {1} 컬럼은 "YYYY-MM-DD" 형식의 올바른 일자만 입력할 수 있습니다'.format(controlText, columnName);
                            return valiationFunc(message);
                        }
                    }

                    if (options.validators.indexOf('url') > -1) {
                        if (regexs.url.test(value) == false) {
                            var message = '{0} 그리드의 {1} 컬럼은 웹 URL 주소만 입력할 수 있습니다'.format(controlText, columnName);
                            return valiationFunc(message);
                        }
                    }
                }
            }
            else if (controlInfo.module == 'syn.uicontrols.$grid' && requestType == 'List' && options.validators && options.validators.length > 0) {
                var valiationFunc = function (message) {
                    syn.$w.alert(message);
                    syn.$w.statusMessage(message);
                    if ($progressBar.isProgress == true) {
                        $progressBar.close();
                    }
                    return false;
                };

                var controlText = options.controlText;
                var columnName = controlModule.getColHeader(controlInfo.id, controlModule.propToCol(controlInfo.id, options.data));
                var flagData = controlModule.getSourceDataAtCol(controlInfo.id, 'Flag');
                var rowData = controlModule.getSourceDataAtCol(controlInfo.id, options.data);

                var vaildateData = [];
                var length = flagData.length;
                for (var i = 0; i < length; i++) {
                    if (flagData[i] != 'D') {
                        vaildateData.push(rowData[i]);
                    }
                }

                if (options.validators.indexOf('require') > -1) {
                    if (vaildateData.filter(function (row) { return (row === '' || row == null) }).length > 0) {
                        var message = '{0} 그리드의 {1} 컬럼은 반드시 입력 해야입니다'.format(controlText, columnName);
                        return valiationFunc(message);
                    }
                }

                if (options.validators.indexOf('unique') > -1) {
                    if (vaildateData.filter(function (row, index) { return (vaildateData.indexOf(row) !== index) }).length > 0) {
                        var message = '{0} 그리드의 {1} 컬럼은 중복값을 입력할 수 없습니다'.format(controlText, columnName);
                        return valiationFunc(message);
                    }
                }

                if (options.validators.indexOf('numeric') > -1) {
                    if (vaildateData.filter(function (row) { return isNaN(row) }).length > 0) {
                        var message = '{0} 그리드의 {1} 컬럼은 숫자값만 입력할 수 있습니다'.format(controlText, columnName);
                        return valiationFunc(message);
                    }
                }

                if (options.validators.indexOf('ipaddress') > -1) {
                    if (vaildateData.filter(function (row) { return !regexs.ipaddress.test(row) }).length > 0) {
                        var message = '{0} 그리드의 {1} 컬럼은 IP 주소만 입력할 수 있습니다'.format(controlText, columnName);
                        return valiationFunc(message);
                    }
                }

                if (options.validators.indexOf('email') > -1) {
                    if (vaildateData.filter(function (row) { return !regexs.email.test(row) }).length > 0) {
                        var message = '{0} 그리드의 {1} 컬럼은 이메일 주소만 입력할 수 있습니다'.format(controlText, columnName);
                        return valiationFunc(message);
                    }
                }

                if (options.validators.indexOf('date') > -1) {
                    if (vaildateData.filter(function (row) {
                        if (regexs.date.test(row) == false) {
                            return true;
                        };

                        var date = new Date(row);
                        var dateNum = date.getTime();
                        if (!dateNum && dateNum !== 0) {
                            return true;
                        }

                        return !(date.toISOString().slice(0, 10) === row);
                    }).length > 0) {
                        var message = '{0} 그리드의 {1} 컬럼은 "YYYY-MM-DD" 형식의 올바른 일자만 입력할 수 있습니다'.format(controlText, columnName);
                        return valiationFunc(message);
                    }
                }

                if (options.validators.indexOf('url') > -1) {
                    if (vaildateData.filter(function (row) { return !regexs.url.test(row) }).length > 0) {
                        var message = '{0} 그리드의 {1} 컬럼은 웹 URL 주소만 입력할 수 있습니다'.format(controlText, columnName);
                        return valiationFunc(message);
                    }
                }
            }

            return true;
        }
    });
})(window);
function domainLibraryLoad() {
    /// <summary>
    /// syn.domain.js를 이용하는 모든 웹 페이지에 필요한 도메인 사이트 전용 초기화 업무를 구현합니다.
    /// </summary>
    if ($ref.isBoolean(syn.Config.IsClientCaching) == true) {
        syn.$r.setCookie('syn.iscache', syn.Config.IsClientCaching, null, '/');
    }

    // document.onselectstart = function () { return false; };
    // document.oncontextmenu = function () { return false; };

    if (syn.Config.IsDebugMode == false) {
    }

    // 서버 컨트롤의 초기화 함수를 실행합니다. (페이지 뷰 속도를 향상하기 위해 script defer 처리가 되어 컨트롤 초기화 함수를 분리합니다.)
    if (window['controlInit']) {
        controlInit();
    }

    // var tokenID = syn.$w.getStorage('easywork_tokenID', true);
    // if (tokenID == null && syn.$r.getCookie('EasyWork.TokenID')) {
    //     tokenID = syn.$r.getCookie('EasyWork.TokenID');
    //     syn.$w.setStorage('easywork_tokenID', tokenID, true);
    // }
    // else {
    //     if (tokenID && syn.$r.getCookie('EasyWork.TokenID')) {
    //         var cookieTokenID = syn.$r.getCookie('EasyWork.TokenID');
    //         if (tokenID != cookieTokenID) {
    //             if (top.$MainFrame) {
    //                 top.$MainFrame.logout();
    //             }
    //         }
    //     }
    // }

    if (syn.$w.getStorage('member') == null && syn.$r.getCookie('EasyWork.Member')) {
        var member = syn.$r.getCookie('EasyWork.Member');
        syn.$w.setStorage('member', member, false);
    }

    if (syn.$w.getStorage('addtional') == null && syn.$r.getCookie('EasyWork.Addtional')) {
        var addtional = syn.$r.getCookie('EasyWork.Addtional');
        syn.$w.setStorage('addtional', addtional, false);
    }

    if (syn.$w.getStorage('bearerToken') == null && syn.$r.getCookie('EasyWork.BearerToken')) {
        var bearerToken = syn.$r.getCookie('EasyWork.BearerToken');
        syn.$w.setStorage('bearerToken', bearerToken, false);
    }

    window.bearerToken = null;
    if (syn.$r.getCookie('EasyWork.BearerToken')) {
        window.bearerToken = syn.$r.getCookie('EasyWork.BearerToken');
    }

    syn.$w.SSO = syn.$w.getSSOInfo() || {
        TokenID: '',
        CompanyID: '',
        CompanyNo: '',
        CompanyName: '',
        UserID: '',
        UserNo: '',
        UserName: '',
        BusinessTel: '',
        BusinessEMail: '',
        DepartmentID: '',
        DepartmentName: '',
        PositionID: '',
        PositionName: '',
        Roles: [],
        Claims: []
    };

    syn.$w.SSO.WorkCompanyNo = (syn.$r.query('companyNo') || syn.$r.query('CompanyNo') || syn.$r.query('companyNO') || syn.$r.query('CompanyNO') || syn.$r.query('COMPANYNO') || syn.$r.query('companyno')) || syn.$w.SSO.CompanyNo;
    syn.$w.SSO.WorkUserNo = (syn.$r.query('employeeNo') || syn.$r.query('EmployeeNo') || syn.$r.query('employeeNO') || syn.$r.query('EmployeeNO') || syn.$r.query('EMPLOYEENO') || syn.$r.query('employeeno')) || null;

    syn.$w.AppInfo = syn.$w.getAppInfo() || {};
    syn.$w.AppInfo.config = syn.Config.IsViewMappingModel;

    var mod = window[syn.$w.pageScript];
    if (mod && mod.hook.pageInit) {
        mod.hook.pageInit();
        mod.config = syn.$w.argumentsExtend({
            programID: null,
            businessID: null,
            systemID: null,
            transactionID: null,
            dataSource: {},
            transactions: []
        }, mod.config);
    }

    // 프로그래스 바 표현에 필요한 html을 생성 시켜주는 스크립트를 추가합니다.
    var ui_progressbar = document.createElement('div');
    ui_progressbar.id = 'ui_progressbar';
    syn.$m.addClass(ui_progressbar, 'ui_progressbar');

    var overlay = document.createElement('div');
    syn.$m.addClass(overlay, 'overlay');

    var progressBar = document.createElement('span');
    syn.$m.addClass(progressBar, 'progressBar');

    var loading = document.createElement('span');
    syn.$m.addClass(loading, 'loading');
    var message = document.createElement('span');
    syn.$m.addClass(message, 'message');

    ui_progressbar.appendChild(overlay);
    ui_progressbar.appendChild(progressBar);
    progressBar.appendChild(loading);
    progressBar.appendChild(message);

    document.body.appendChild(ui_progressbar);

    // 현재 웹 페이지가 외부 시스템에서 연결 되었을 경우, 사용 권한 에러 처리를 위해 parent 접근을 수행하지 않습니다.


    // 부모의 리소스가 있는 경우 부모의 리소스($resource)를 상속받습니다.
    if (parent.$res) {
        $res = parent.$res;
    }

    // 웹 페이지 로딩시 현재 브라우저의 세션이 파기 되었는지 서버에 확인하는 함수를 호출합니다.
    var sessionTokenDestroyed = syn.$l.get('SessionTokenDestroyed');
    if (sessionTokenDestroyed) {
        if (parent.$MainFrame && !window.$MainFrame) {
            return;
            parent.$MainFrame.isConnectedSession();
        }
    }

    syn.$k.setElement(document);

    if (window === parent && parent.$MainFrame) {
        syn.$k.addKeyDown('121', frameKeyEventHandler); // F10
        syn.$k.addKeyDown('13', frameKeyEventHandler); // ENTER
        syn.$k.addKeyDown('27', frameKeyEventHandler); // ESC
        syn.$k.addKeyDown('9', frameKeyEventHandler); // TAB
        syn.$k.addKeyDown('8', frameKeyEventHandler); // Backspace

        syn.$k.addKeyDown('37', frameKeyEventHandler); // LEFT
        syn.$k.addKeyDown('38', frameKeyEventHandler); // UP
        syn.$k.addKeyDown('39', frameKeyEventHandler); // RIGHT
        syn.$k.addKeyDown('40', frameKeyEventHandler); // DOWN
    }

    // 부모 객체($MainFrame)가 있는 웹 페이지의 경우 현재 페이지의 문서 객체(document.body)의 Height을 부모에 전달하고 단축키 이벤트에 따라 부모에 전달하도록 설정합니다.
    if (window !== parent && (parent.$MainFrame || $string.isNullOrEmpty(syn.$r.query('baseELID')) == false)) {
        // Ctrl, Alt, Shift 특수키 조합에 따라 UI 탭 포커스를 변경하거나, 즐겨찾기 UI 탭 호출하도록 단축키 지정
        // syn.$k.addKeyDown('49', uiKeyEventHandler);
        // syn.$k.addKeyDown('50', uiKeyEventHandler);
        // syn.$k.addKeyDown('51', uiKeyEventHandler);
        // syn.$k.addKeyDown('52', uiKeyEventHandler);
        // syn.$k.addKeyDown('53', uiKeyEventHandler);
        // syn.$k.addKeyDown('54', uiKeyEventHandler);
        // syn.$k.addKeyDown('55', uiKeyEventHandler);
        // syn.$k.addKeyDown('56', uiKeyEventHandler);
        // syn.$k.addKeyDown('57', uiKeyEventHandler);
        syn.$k.addKeyDown('88', uiKeyEventHandler); // 현재탭닫기 X

        syn.$k.addKeyDown('37', uiKeyEventHandler); // LEFT
        syn.$k.addKeyDown('38', uiKeyEventHandler); // UP
        syn.$k.addKeyDown('39', uiKeyEventHandler); // RIGHT
        syn.$k.addKeyDown('40', uiKeyEventHandler); // DOWN
    }

    syn.$k.addKeyDown('68', uiKeyEventHandler); // 삭제 D
    syn.$k.addKeyDown('70', uiKeyEventHandler); // 조회 F
    syn.$k.addKeyDown('83', uiKeyEventHandler); // 저장 S
    syn.$k.addKeyDown('80', uiKeyEventHandler); // 출력 P
    syn.$k.addKeyDown('69', uiKeyEventHandler); // 파일 내보내기 E

    syn.$k.addKeyDown('13', uiKeyEventHandler); // ENTER
    syn.$k.addKeyDown('27', uiKeyEventHandler); // ESC
    syn.$k.addKeyDown('9', uiKeyEventHandler); // TAB
    syn.$k.addKeyDown('8', uiKeyEventHandler); // Backspace

    var apiService = null;
    var apiServices = syn.$w.getStorage('apiServices', false);
    if (apiServices) {
        apiService = apiServices[syn.Config.SystemID + syn.Config.DomainServerType];
        if ((apiServices.BearerToken == null || apiServices.BearerToken == undefined) && window.bearerToken) {
            apiServices.BearerToken = window.bearerToken;
            syn.$w.setStorage('apiServices', apiServices, false);
        }
    }
    else {
        if (syn.Config.DomainAPIServer != null) {
            apiService = syn.Config.DomainAPIServer;
            apiServices = {};
            if (window.bearerToken) {
                apiServices.BearerToken = window.bearerToken;
            }
            apiServices[syn.Config.SystemID + syn.Config.DomainServerType] = apiService;

            syn.$w.setStorage('apiServices', apiServices, false);
        }
    }

    if (apiService == null) {
        var apiFind = syn.$w.xmlHttp();
        apiFind.open('GET', syn.Config.ApiFindUrl + '?systemID={0}&serverType={1}'.format(syn.Config.SystemID, syn.Config.DomainServerType), true);

        apiFind.setRequestHeader('Accept-Language', syn.$w.localeID);
        apiFind.setRequestHeader('X-Requested-With', 'QAF ServiceClient');
        apiFind.setRequestHeader('content-type', 'application/json');
        apiFind.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var apiService = JSON.parse(apiFind.responseText);
                if (apiService.ExceptionText) {
                    syn.$l.eventLog('apiFind', 'SystemID: {0}, ServerType: {1}, Message: {2}'.format(syn.Config.SystemID, syn.Config.DomainServerType, apiService.ExceptionText), 'Verbose');
                }
                else {
                    apiServices = {};
                    if (window.bearerToken) {
                        apiServices.BearerToken = window.bearerToken;
                    }
                    apiServices[syn.Config.SystemID + syn.Config.DomainServerType] = apiService;

                    syn.$w.setStorage('apiServices', apiServices, false);
                    syn.$l.eventLog('apiFind', 'systemApi: {0}'.format(JSON.stringify(apiService)), 'Verbose');
                }
            }
        };
        apiFind.send();
    }
    else {
        syn.$l.eventLog('apiFind', 'systemApi: {0}'.format(JSON.stringify(apiService)), 'Verbose');
    }
}

function domainPageLoad() {
    var el = syn.$l.get('pageLoader');
    if (el) {
        el.parentNode.removeChild(el);
    }

    $('body').on('mouseover', 'a:not(.nav-link)', function (e) {
        var $link = $(this);
        var href = $link.attr('href') || $link.data('href');

        $link.off('click.chrome');
        $link.on('click.chrome', function () {
            window.location.href = href;
        }).attr('data-href', href)
            .css({ cursor: 'pointer' })
            .removeAttr('href');
    });

    if (document.forms) {
        for (var i = 0; i < document.forms.length; i++) {
            var form = document.forms[i];
            syn.$m.removeClass(form, 'hidden');
            if (form.style.display.toUpperCase() == 'NONE' && $string.toBoolean(form.getAttribute('hidden')) == false) {
                form.style.display = '';
            }
        }
    }

    syn.$m.removeClass(document.body, 'hidden');
    if (document.body.style.display.toUpperCase() == 'NONE' && $string.toBoolean(document.body.getAttribute('hidden')) == false) {
        document.body.style.display = '';
    }

    var mod = window[syn.$w.pageScript];
    if (mod && mod.uicontrols && mod.uicontrols.$grid) {
        for (var i = 0; i < mod.uicontrols.$grid.gridControls.length; i++) {
            mod.uicontrols.$grid.gridControls[i].hot.render();
        }
    }
}

function frameKeyEventHandler() {
    if (keyboardEvent && documentEvent && (keyboardEvent === documentEvent)) {
        var el = documentEvent.target || documentEvent.srcElement || null;

        switch (documentEvent.keyCode) {
            case 13: // ENTER
                return true;
                break;
            case 9: // TAB
                return true;
                break;
            case 27: // ESC
                if (keyboardEvent && keyboardEvent.view && keyboardEvent.view.$w) {
                    if (keyboardEvent.view.$w.transactionLoaderID == null) {
                        var uiContext = keyboardEvent.view;
                        var el = uiContext.$w.activeControl();

                        if (el && uiContext.syn && uiContext.syn.uicontrols) {
                            if (el.id) {
                                var colorControl = uiContext.syn.uicontrols.$colorpicker.getControl(el.id);
                                if (colorControl) {
                                    if (colorControl.picker.visible == true) {
                                        colorControl.picker.exit();
                                    }
                                }

                                var dateControl = syn.uicontrols.$datepicker.getControl(el.id);
                                if (dateControl) {
                                    if (dateControl.picker.isVisible() == true) {
                                        dateControl.picker.hide();
                                    }
                                }
                            }
                        }

                        if (uiContext.$w.isShowDialog == true) {
                            uiContext.$w.closeDialog();
                            return false;
                        }

                        if (uiContext.parent.$w.isShowDialog == true) {
                            uiContext.parent.$w.closeDialog();
                            return false;
                        }

                        if (uiContext.$w.iframeChannels) {
                            var iframeChannels = uiContext.$w.iframeChannels;
                            var channelCount = iframeChannels.length;
                            if (channelCount == 0) {
                                for (var i = 0; i < 10; i++) {
                                    uiContext = uiContext.parent;
                                    iframeChannels = uiContext.$w.iframeChannels;
                                    channelCount = iframeChannels.length;

                                    if (channelCount > 0) {
                                        break;
                                    }
                                }
                            }

                            if (channelCount > 0) {
                                var channel = uiContext.$w.iframeChannels[(channelCount - 1)];
                                var isCloseButton = (channel.windowHandle.find('.horizbuts').length > 0 && channel.windowHandle.find('.horizbuts')[0].style.display != 'none');

                                if (isCloseButton == true) {
                                    var elID = uiContext.$w.iframeChannels[(channelCount - 1)].elID;
                                    if (channelCount > 1) {
                                        var baseELID = uiContext.$w.iframeChannels[(channelCount - 2)].elID;
                                        uiContext.$('#' + baseELID).WM_raise();
                                    }

                                    uiContext.$w.windowClose(elID);
                                }
                            }
                        }
                    }
                }
                break;
            case 37: // LEFT
            case 38: // UP
            case 39: // RIGHT
            case 40: // DOWN
                if (documentEvent.ctrlKey == true && documentEvent.shiftKey == true) {
                    var actionID = null;
                    if (documentEvent.keyCode == 37) {
                        actionID = 'prev';
                    }
                    else if (documentEvent.keyCode == 38) {
                        actionID = 'first';
                    }
                    else if (documentEvent.keyCode == 39) {
                        actionID = 'next';
                    }
                    else if (documentEvent.keyCode == 40) {
                        actionID = 'last';
                    }

                    if (actionID) {
                        $layout.moveTabUI(actionID);
                    }
                }
                break;
            case 121: // F10
                if (documentEvent.ctrlKey == true && documentEvent.shiftKey == true) {
                    var alertOptions = $ref.clone(syn.$w.alertOptions);
                    alertOptions.minWidth = 600;
                    alertOptions.stack = JSON.stringify(syn.$w.SSO);
                    syn.$w.alert('로그인 사용자 정보', '정보', alertOptions);
                }
                break;
            case 8: // Backspace 이전
                if (el != null) {
                    var tagName = el.tagName;
                    if (tagName) {
                        tagName = tagName.toUpperCase();

                        if (tagName == 'INPUT') {
                            return true;
                        }
                    }
                }
        }

        return false;
    }
}

function uiKeyEventHandler() {
    /// <summary>
    /// UI 화면의 단축키 이벤트핸들러입니다.
    /// </summary>
    var func = null;
    if (keyboardEvent && documentEvent && (keyboardEvent === documentEvent)) {
        parent.keyboardEvent = keyboardEvent;
        parent.documentEvent = documentEvent;
        var mod = window[syn.$w.pageScript];
        if ($number.isRange(documentEvent.keyCode, 49, 57) == true) {
            func = parent.$MainFrame.numericUITrigger;
        }
        else {
            switch (documentEvent.keyCode) {
                case 68: // 삭제 D
                case 70: // 조회 F
                case 83: // 저장 S
                case 80: // 출력 P
                case 69: // 파일 내보내기 E
                    if (parent && parent.$MainFrame) {
                        func = parent.$MainFrame.shortcutUITrigger;
                    }
                    else {
                        if (syn.$w.transactionLoaderID == null && documentEvent.ctrlKey == true && documentEvent.shiftKey == false && documentEvent.altKey == true) {
                            var actionID = null;
                            switch (documentEvent.keyCode) {
                                case 68: // 삭제 D
                                    actionID = 'delete';
                                    break;
                                case 69: // 파일 내보내기 E
                                    actionID = 'export';
                                    break;
                                case 70: // 조회 F
                                    actionID = 'search';
                                    break;
                                case 83: // 저장 S
                                    actionID = 'save';
                                    break;
                                case 80: // 출력 P
                                    actionID = 'print';
                                    break;
                            }

                            if (actionID) {
                                var mod = window[syn.$w.pageScript];
                                if (mod && mod.hook.frameEvent) {
                                    mod.hook.frameEvent('buttonCommand', {
                                        actionID: actionID
                                    });
                                }
                            }
                        }
                    }
                    break;
                case 88: // 현재탭닫기 X
                    if (parent && parent.$MainFrame) {
                        if (syn.$w.transactionLoaderID == null && documentEvent.ctrlKey == true && documentEvent.shiftKey == true) {
                            var tabInfo = parent.$layout.getActiveTab();
                            if (tabInfo) {
                                parent.$layout.closeTabID(tabInfo.tabID);
                            }
                        }
                    }
                    break;
                case 37: // LEFT
                case 38: // UP
                case 39: // RIGHT
                case 40: // DOWN
                    if (parent && parent.$MainFrame && documentEvent.ctrlKey == true && documentEvent.shiftKey == true) {
                        var actionID = null;
                        if (documentEvent.keyCode == 37) {
                            actionID = 'prev';
                        }
                        else if (documentEvent.keyCode == 38) {
                            actionID = 'first';
                        }
                        else if (documentEvent.keyCode == 39) {
                            actionID = 'next';
                        }
                        else if (documentEvent.keyCode == 40) {
                            actionID = 'last';
                        }

                        if (actionID) {
                            parent.$layout.moveTabUI(actionID);
                        }
                    }
                    break;
                case 13: // ENTER
                    if (syn.$w.transactionLoaderID == null) {
                        var el = syn.$w.activeControl();
                        // 포커스 중인 'input,select,textarea,button,syn 컨트롤에 따라 실행 명령을 다르게 처리
                        if (el && el.tagName) {
                            var tagName = el.tagName.toUpperCase();
                            if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA' || tagName == 'BUTTON') {
                                return true;
                            }
                        }
                    }

                    // 서드파티에서 ENTER를 의도치않게 사용되는 것을 방지
                    return false;
                    break;
                case 9: // TAB
                    if (syn.$w.transactionLoaderID == null && mod.context.tabOrderControls) {
                        var tabOrderControls = mod.context.tabOrderControls.filter(function (item) {
                            var result = false;
                            var el = syn.$l.get(item.elID);
                            if (el && el.tagName.toUpperCase() == 'SELECT' && el.getAttribute('syn-datafield') != null) {
                                var multipe = el.getAttribute('multiple');
                                if (multipe == null || multipe === false) {
                                    var control = mod.uicontrols.$select.getControl(el.id);
                                }
                                else {
                                    var control = mod.uicontrols.$multiselect.getControl(el.id);
                                }

                                if (control) {
                                    result = syn.$m.hasHidden(control.picker.select) == false;
                                }
                            }
                            else {
                                result = syn.$m.hasHidden(item.elID) == false;
                            }

                            return result;
                        });

                        if (tabOrderControls && tabOrderControls.length > 0) {
                            if (mod.context.tabOrderFocusID == null) {
                                mod.context.tabOrderFocusID = tabOrderControls[0].elID;
                            }

                            var findTabOrderControl = tabOrderControls.find(function (item) { return item.elID == mod.context.tabOrderFocusID; });
                            if (findTabOrderControl != null) {
                                var tabOrderIndex = tabOrderControls.indexOf(findTabOrderControl);
                                if (tabOrderIndex < tabOrderControls.length) {
                                    tabOrderIndex = tabOrderIndex + 1;

                                    if (tabOrderIndex == tabOrderControls.length) {
                                        tabOrderIndex = 0;
                                    }
                                }
                                else {
                                    tabOrderIndex = 0;
                                }

                                var focusEL = null;
                                var focusControl = tabOrderControls[tabOrderIndex];
                                var el = syn.$l.get(focusControl.elID);
                                if (el && el.tagName.toUpperCase() == 'SELECT' && el.getAttribute('syn-datafield') != null) {
                                    var multipe = el.getAttribute('multiple');
                                    if (multipe == null || multipe === false) {
                                        var control = mod.uicontrols.$select.getControl(el.id);
                                    }
                                    else {
                                        var control = mod.uicontrols.$multiselect.getControl(el.id);
                                    }

                                    if (control) {
                                        focusEL = control.picker.select;
                                    }
                                    mod.context.focusControl = el;
                                }
                                else {
                                    focusEL = el;
                                    mod.context.focusControl = focusEL;
                                }

                                if (focusEL) {
                                    mod.context.tabOrderFocusID = focusControl.elID;
                                    setTimeout(function () {
                                        focusEL.focus();
                                    });
                                }
                            }
                        }
                        return false;
                    }
                    break;
                case 27: // ESC
                    if (syn.$w.transactionLoaderID == null) {
                        var el = syn.$w.activeControl();
                        if (el && syn && syn.uicontrols) {
                            if (el.id) {
                                var colorControl = syn.uicontrols.$colorpicker.getControl(el.id);
                                if (colorControl) {
                                    if (colorControl.picker.visible == true) {
                                        colorControl.picker.exit();
                                        return false;
                                    }
                                }

                                var dateControl = syn.uicontrols.$datepicker.getControl(el.id);
                                if (dateControl) {
                                    if (dateControl.picker.isVisible() == true) {
                                        dateControl.picker.hide();
                                        return false;
                                    }
                                }
                            }
                        }

                        if (syn.$w.isShowDialog == true) {
                            syn.$w.closeDialog();
                            return false;
                        }

                        if (parent.$w.isShowDialog == true) {
                            parent.$w.closeDialog();
                            return false;
                        }

                        var context = syn.$w.context;
                        var iframeChannels = context.$w.iframeChannels;
                        var channelCount = iframeChannels.length;
                        if (channelCount == 0) {
                            for (var i = 0; i < 5; i++) {
                                context = context.parent;
                                iframeChannels = context.$w.iframeChannels;
                                channelCount = iframeChannels.length;

                                if (channelCount > 0) {
                                    break;
                                }
                            }
                        }

                        if (channelCount > 0) {
                            var channel = context.$w.iframeChannels[(channelCount - 1)];
                            if (channel && channel.windowHandle) {
                                var isCloseButton = (channel.windowHandle.find('.horizbuts').length > 0 && channel.windowHandle.find('.horizbuts')[0].style.display != 'none');

                                if (isCloseButton == true) {
                                    var elID = channel.elID;
                                    if (channelCount > 1) {
                                        var baseELID = context.$w.iframeChannels[(channelCount - 2)].elID;
                                        context.$('#' + baseELID).WM_raise();
                                    }

                                    context.$w.windowClose(elID);
                                }
                            }
                            return false;
                        }
                    }
                    break;
                case 8: // Backspace 이전
                    var evt = event || e;
                    var el = evt.srcElement || evt.target;
                    var tagName = el.tagName;
                    if (tagName) {
                        tagName = tagName.toUpperCase();

                        if (tagName == 'INPUT' || tagName == 'TEXTAREA' || tagName == 'IFRAME') {
                        }
                        else {
                            return false;
                        }
                    }
            }
        }
    }

    try {
        if (func) {
            return func();
        }

        return true;
    }
    catch (error) {
        syn.$l.eventLog('uiKeyEventHandler', error, 'Error');
        return false;
    }
}

/// <reference path="/Scripts/syn.js" />
(function (window) {
    /// <summary>
    /// FileUpload $boardfileclientUI 컨트롤 모듈입니다.
    /// </summary>
    var $bfile = syn.uicontrols.$bfile || new syn.module();

    $bfile.extend({
        name: 'syn.uicontrols.$bfile',
        version: '1.0',
        setting: {},
        clientID: '',
        fileUploadOptions: null,
        isLoad: false,
        defaultSetting: {
            elementID: null,
            repositoryID: '',
            dependencyID: '',
            fileUpdateCallback: '$bfile.doUpload_Callback',
            uploadCount: 8,
            uploadExtensions: '*/*',
            uploadDependencyID: null,
            readonly: false
        },

        controlLoad(elID, setting) {
            var el = syn.$l.get(elID);
            $bfile.setting = syn.$w.argumentsExtend($bfile.defaultSetting, setting);
            $bfile.setting.elementID = elID;
            $bfile.clientID = setting.clientID;
            var mod = window[syn.$w.pageScript];
            if (mod && mod.hook.controlInit) {
                var moduleSettings = mod.hook.controlInit(elID, $bfile.setting);
                $bfile.setting = syn.$w.argumentsExtend($bfile.setting, moduleSettings);
            }
            $bfile.setting.elID = elID;

            $bfile.fileUploadOptions = syn.$w.argumentsExtend($bfile.defaultSetting, setting);
            $bfile.fileUploadOptions.elementID = $bfile.clientID;
            $bfile.fileUploadOptions.elID = $bfile.clientID;

            var el = syn.$l.get($bfile.setting.elementID);

            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify($bfile.setting));
            el.style.display = 'none';

            var dataFieldID = el.getAttribute('syn-datafield');
            var events = el.getAttribute('syn-events');
            var value = el.value ? el.value : '';
            var name = el.name ? el.name : '';
            var html = '';

            if (events) {
                html = '<input type="hidden" id="{0}" name="{1}" syn-datafield="{2}" value="{3}" syn-options="{4}" syn-events={5}>'.format(elID, name, dataFieldID, value, JSON.stringify($bfile.setting), '[\'' + eval(events).join('\',\'') + '\']');
            }
            else {
                html = '<input type="hidden" id="{0}" name="{1}" syn-datafield="{2}" value="{3}" syn-options="{4}">'.format(elID, name, dataFieldID, value, JSON.stringify($bfile.setting));
            }
            html += '<div class="buttonWrap" style="position: relative;border-top:0;">';
            html += '<h3 style="position: absolute;top:35px;margin-left:5px;margin-top:-6px;">';
            html += '첨부파일( <data id="bFileCount">0</data> / ' + $bfile.setting.uploadCount + ' )';
            html += '</h3 >';
            if ($bfile.setting.readonly != true) {
                html += '<h4 style = "position:absolute;top:35px;margin-left:5px;margin-top:-6px;font-weight:600">';
                html += '각 첨부파일 당 최대 120MB까지 업로드 가능 합니다.';
                html += '</h4 >';
                html += '<button type="button" id="btnBFileUpload" class="txtBtn" >파일추가</button>';
            }
            html += '</div >';

            html += '<div class="fileInfo" style="min-height:55px;">';
            html += '<ul id="divFileInfos" style="height:55px;overflow:scroll;">';
            html += '</ul>';
            html += '</div>';
            html += '<div id="' + $bfile.setting.elementID + '_ui_hiddden" style="display:none;">';
            html += '</div>';
            var parent = el.parentNode;
            var wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            parent.appendChild(wrapper);

            setTimeout(function () {
                $bfile.clientInit();
            }, 100);
        },

        clientInit() {
            var setting = syn.uicontrols.$fileclient.getFileSetting($bfile.fileUploadOptions.elementID);
            if (!setting) {
                setTimeout(function () {
                    $bfile.clientInit();
                }, 100);
                return;
            }
            $bfile.fileUploadOptions.repositoryID = setting.repositoryID;
            setting = syn.$w.argumentsExtend(setting, $bfile.fileUploadOptions);

            syn.uicontrols.$fileclient.init($bfile.fileUploadOptions.elementID, syn.$l.get($bfile.setting.elementID + '_ui_hiddden'), setting, $bfile.fileChangeHandler);

            if (document.forms.length > 0) {
                var form = document.forms[0];
                if (syn.$l.get('syn-repository') == null) {
                    var repositoryTarget = syn.$m.append(form, 'iframe', 'syn-repository', { display: 'none' });
                    repositoryTarget.name = 'syn-repository';
                }
                form.enctype = 'multipart/form-data';
                form.target = 'syn-repository';
                form.method = 'post';
                form.action = syn.Config.FileManagerServer + '/api/filemanager';
            }

            if ($bfile.setting.readonly != true) {
                syn.$l.addEvent(syn.$l.get('btnBFileUpload'), 'click', function (e) {
                    $bfile.btnBFileUpload_click();
                });

                $bfile.initUploadUI();
            }
        },

        addUI() {
            if ($bfile.setting.readonly == true) {
                return;
            }

            var setting = syn.uicontrols.$fileclient.getFileSetting($bfile.fileUploadOptions.elementID);
            syn.uicontrols.$fileclient.addFileUI(setting.elementID, setting.accept);
        },

        btnBFileUpload_click() {
            var el = syn.$l.get($bfile.setting.clientID + '_filesName_1');
            if (el) {
                el.click();
            }
        },

        getValue(elID, meta) {
            var result = '';
            var el = syn.$l.get(elID);
            return result;
        },

        setValue(elID, value, meta) {
            var el = syn.$l.get(elID);
        },

        delete(elID) {
            var dependencyID = syn.uicontrols.$fileclient.getDependencyID(elID);

            syn.uicontrols.$fileclient.deleteItems(elID, dependencyID, function (result) {
                syn.$l.eventLog('file delete', JSON.stringify(result));
            });
        },

        clear(elID, isControlLoad) {
            var el = syn.$l.get(elID);
        },

        fileChangeHandler(el, fileItem) {
            var setting = syn.uicontrols.$fileclient.getFileSetting($bfile.fileUploadOptions.elementID);
            syn.uicontrols.$fileclient.doUpload($bfile.fileUploadOptions.elementID, setting);
        },

        doUpload_Callback(repositoryID, repositoryItems) {
            $bfile.fileUploadUI();
        },

        setDependencyID(setDependencyID) {
            if ($string.isNullOrEmpty(setDependencyID) == true) {
                $bfile.fileUploadUI();
                return;
            }

            var dependencyID = syn.uicontrols.$fileclient.getDependencyID($bfile.fileUploadOptions.elementID);
            if (dependencyID == setDependencyID)
                return;

            if ($string.isNullOrEmpty(dependencyID) == true) {
                setTimeout(function () {
                    $bfile.setDependencyID(setDependencyID);
                }, 200)
                return;
            }

            syn.uicontrols.$fileclient.setDependencyID($bfile.fileUploadOptions.elementID, setDependencyID);
            $bfile.fileUploadUI();

        },

        updateDependencyID(setDependencyID) {
            if ($string.isNullOrEmpty(setDependencyID) == true) {
                $bfile.fileUploadUI();
                return;
            }

            var dependencyID = syn.uicontrols.$fileclient.getDependencyID($bfile.fileUploadOptions.elementID);
            if (dependencyID == setDependencyID)
                return;

            if ($string.isNullOrEmpty(dependencyID) == true) {
                setTimeout(function () {
                    $bfile.updateDependencyID(setDependencyID);
                }, 200)
                return;
            }
            syn.uicontrols.$fileclient.updateDependencyID($bfile.fileUploadOptions.elementID, dependencyID, setDependencyID, function (result) {
                syn.uicontrols.$fileclient.setDependencyID($bfile.fileUploadOptions.elementID, setDependencyID);
            });
        },

        fileUploadUI() {
            var setting = syn.uicontrols.$fileclient.getFileSetting($bfile.fileUploadOptions.elementID);
            if (setting == null) {
                setTimeout(function () { $bfile.fileUploadUI(); }, 100)
                return;
            }

            syn.$l.get('divFileInfos').innerHTML = '';
            syn.$l.get('bFileCount').innerHTML = '0';
            syn.$l.get($bfile.setting.elementID + '_ui_hiddden').innerHTML = '';
            var uploadDependencyID = syn.uicontrols.$fileclient.getDependencyID($bfile.fileUploadOptions.elementID);


            syn.uicontrols.$fileclient.getItems(setting.elementID, uploadDependencyID, function (repositoryItems) {
                syn.$l.get('bFileCount').innerHTML = repositoryItems.length;

                // Repository에 등록된 uploadCount와 업로드된 아이템의 갯수를 비교하여 FileUpload UI 항목를 화면에 추가합니다.
                if ($bfile.setting.uploadCount > repositoryItems.length) {
                    $bfile.addUI();
                }

                // 업로드된 아이템의 갯수만큼 FileDownload UI 항목를 화면에 추가합니다.
                if (repositoryItems.length > 0) {
                    for (var i = 0; i < repositoryItems.length; i++) {
                        repositoryItem = repositoryItems[i];

                        var li = syn.$m.append(syn.$l.get('divFileInfos'), 'li', repositoryItem.ItemID);

                        var link = syn.$m.append(li, 'a', repositoryItem.ItemID + '_link');
                        link.href = 'javascript: void(0)';
                        link.downloadPath = repositoryItem.AbsolutePath;
                        link.download = repositoryItem.FileName;
                        syn.$l.addEvent(link, 'click', function () {
                            var downloadPath = this.downloadPath;
                            var download = this.download;
                            syn.$r.blobUrlToData(downloadPath, function (blob) {
                                syn.$r.blobToDownload(blob, download);
                            });
                            return false;
                        });
                        link.innerHTML = '<i class="ri-attachment-2 grid_icon"></i>' + repositoryItem.FileName;
                        if ($bfile.setting.readonly != true) {
                            var span = syn.$m.append(li, 'span', repositoryItem.ItemID + '_span');
                            syn.$l.addEvent(span, 'click', $bfile.btnAttachFileDelete_click);
                            span.innerText = '삭제';
                            span.item = repositoryItem;
                        }
                    }
                }
            });
        },

        initUploadUI() {
            syn.$l.get('divFileInfos').innerHTML = '';
            syn.$l.get('bFileCount').innerHTML = '0';
            syn.$l.get($bfile.setting.elementID + '_ui_hiddden').innerHTML = '';
            $bfile.addUI();
        },

        btnAttachFileDelete_click(e) {
            var alertOptions = $ref.clone(syn.$w.alertOptions);
            alertOptions.dialogIcon = '2';
            alertOptions.dialogButtons = '3';
            syn.$w.alert($res.removeConfirm, syn.$res.delete, alertOptions, function (result) {
                if (result == 'Yes') {
                    var elButton = e.target || e;
                    var el = syn.$l.get(elButton.item.ItemID);
                    var itemID = elButton.item.ItemID;
                    if (itemID) {
                        syn.uicontrols.$fileclient.deleteItem($bfile.fileUploadOptions.elementID, itemID, function (result) {
                            if (result.Result == true) {
                                $bfile.initUploadUI();
                                $bfile.fileUploadUI();
                            }
                            else {
                                syn.$w.alert(result.Message, '경고');
                            }
                        });
                    }
                }
            });
        }
    });
    syn.uicontrols.$bfile = $bfile;
})(window);
