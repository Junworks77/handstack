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
