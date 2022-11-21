/// <reference path='syn.core.js' />
/// <reference path='syn.library.js' />

(function (context) {
    'use strict';
    var $webform = $webform || new syn.module();
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
