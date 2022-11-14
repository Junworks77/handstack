/// <reference path='syn.core.js' />
/// <reference path='syn.library.js' />

(function (context) {
    'use strict';
    var $validation = $validation || new syn.module();
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
