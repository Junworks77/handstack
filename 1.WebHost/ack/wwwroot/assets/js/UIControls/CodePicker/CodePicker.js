/// <reference path="/Scripts/syn.js.js" />
/// <reference path="/Scripts/syn.domain.js" />

(function (window) {
    'use strict';
    var $codepicker = $codepicker || new syn.module();

    $codepicker.extend({
        name: 'syn.uicontrols.$codepicker',
        version: '1.0',
        defaultSetting: {
            dataSourceID: null,
            storeSourceID: null,
            local: true,
            parameters: '',
            label: '',
            labelWidth: '',
            codeElementID: '',
            codeElementWidth: '50%',
            textElementID: '',
            textElementWidth: '50%',
            required: false,
            readonly: false,
            textBelongID: null,
            textDataFieldID: null,
            searchValue: '',
            searchText: '',
            isMultiSelect: false,
            isAutoSearch: true,
            isOnlineData: false,
            viewType: '',
            dataType: 'string',
            belongID: null,
            getter: false,
            setter: false,
            controlText: null,
            validators: null,
            transactConfig: null,
            triggerConfig: null
        },

        addModuleList: function (el, moduleList, setting, controlType) {
            var elementID = el.getAttribute('id');
            var dataField = el.getAttribute('syn-datafield');
            var formDataField = el.closest('form') ? el.closest('form').getAttribute('syn-datafield') : '';

            moduleList.push({
                id: elementID,
                formDataFieldID: formDataField,
                field: dataField,
                module: this.name,
                type: controlType
            });

            moduleList.push({
                id: elementID + '_Text',
                formDataFieldID: formDataField,
                field: setting.textDataFieldID,
                module: syn.uicontrols.$textbox.name,
                type: 'text'
            });
        },

        controlLoad: function (elID, setting) {
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($codepicker.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod.hook.controlInit) {
                var moduleSettings = mod.hook.controlInit(elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            mod.event[elID + '_Button_click'] = () => {
                if (event) {
                    var el = (this && this.id.indexOf('_Button') > -1) ? this : event.currentTarget;
                    var elID = el.id.replace('_Button', '').replace('_Code', '').replace('_Text', '');
                    var qafOptions = JSON.parse(syn.$l.get(elID + '_hidden').getAttribute('syn-options'));
                    qafOptions.elID = elID;
                    qafOptions.viewType = 'form';
                    qafOptions.codeElementID = elID + '_Code';
                    qafOptions.textElementID = elID + '_Text';
                    qafOptions.searchValue = syn.$l.get(qafOptions.codeElementID).value;
                    qafOptions.searchText = syn.$l.get(qafOptions.textElementID).value;

                    var inputValue = syn.$l.get(qafOptions.codeElementID).value;
                    var inputText = syn.$l.get(qafOptions.textElementID).value;
                    syn.uicontrols.$codepicker.find(qafOptions, function (result) {
                        if (result && result.length > 0) {
                            var changeHandler = mod.event[elID + '_change'];
                            if (changeHandler) {
                                changeHandler(inputValue, inputText, result);
                            }
                        }

                        var returnHandler = mod.hook['frameEvent'];
                        if (returnHandler) {
                            returnHandler.call(this, 'codeReturn', {
                                elID: elID,
                                result: result
                            });
                        }
                    });
                }
            };

            mod.event[elID + '_Code_keydown'] = function (evt) {
                var el = event.currentTarget;
                var elID = el.id.replace('_Code', '');

                syn.$l.get(elID + '_Text').value = '';

                if (evt.keyCode == 13) {
                    mod.event[elID + '_Button_click'].apply(this, evt);
                }
            };

            mod.event[elID + '_Text_keydown'] = function (evt) {
                var el = event.currentTarget;
                var elID = el.id.replace('_Text', '');

                syn.$l.get(elID + '_Code').value = '';

                if (evt.keyCode == 13) {
                    mod.event[elID + '_Button_click'].apply(this, evt);
                }
            };

            var dataField = el.getAttribute('syn-datafield');
            var html = '<span class="inGroup item" style="width:{0};">'.format(setting.codeElementWidth);

            if ($ref.isArray(setting.belongID) == true) {
                html = html + '<input type="text" id="{0}_Code" syn-datafield="{1}" class="textBox" syn-options="{editType: \'text\', dataType: \'string\', belongID: {2}}" syn-events="[\'keydown\']" {3} {4} baseID="{5}" />'.format(elID, dataField, '[\'' + setting.belongID.join('\',\'') + '\']', setting.readonly == true ? 'readonly="readonly"' : '', setting.required == true ? 'required="required"' : '', elID);
            }
            else {
                html = html + '<input type="text" id="{0}_Code" syn-datafield="{1}" class="textBox" syn-options="{editType: \'text\', dataType: \'string\', belongID: \'{2}\'}" syn-events="[\'keydown\']" {3} {4} baseID="{5}" />'.format(elID, dataField, setting.belongID, setting.readonly == true ? 'readonly="readonly"' : '', setting.required == true ? 'required="required"' : '', elID);
            }

            html = html + '<button type="button" id="{0}_Button" type="button" syn-events="[\'click\']" class="icon-search" {1} baseID="{2}"></button></span>'.format(elID, setting.readonly == true ? 'disabled="disabled"' : '', elID);

            if (setting.textDataFieldID) {
                if ($ref.isArray(setting.textBelongID) == true) {
                    html = html + '<input type="text" id="{0}_Text" style="width:{1}" class="item textBox" syn-datafield="{2}" syn-options="{editType: \'text\', dataType: \'string\', belongID: {3}}" syn-events="[\'keydown\']" {4} {5} baseID="{6}" />'.format(elID, setting.textElementWidth, setting.textDataFieldID, '[\'' + setting.textBelongID.join('\',\'') + '\']', setting.readonly == true ? 'readonly="readonly"' : '', setting.required == true ? 'required="required"' : '', elID);
                }
                else {
                    html = html + '<input type="text" id="{0}_Text" style="width:{1}" class="item textBox" syn-datafield="{2}" syn-options="{editType: \'text\', dataType: \'string\', belongID: \'{3}\'}" syn-events="[\'keydown\']" {4} {5} baseID="{6}" />'.format(elID, setting.textElementWidth, setting.textDataFieldID, setting.textBelongID, setting.readonly == true ? 'readonly="readonly"' : '', setting.required == true ? 'required="required"' : '', elID);
                }
            }
            else {
                if ($ref.isArray(setting.textBelongID) == true) {
                    html = html + '<input type="text" id="{0}_Text" style="width:{1}" class="item textBox" syn-options="{editType: \'text\', dataType: \'string\', belongID: {2}}" syn-events="[\'keydown\']" {3} {4} baseID="{5}" />'.format(elID, setting.textElementWidth, '[\'' + setting.textBelongID.join('\',\'') + '\']', setting.readonly == true ? 'readonly="readonly"' : '', setting.required == true ? 'required="required"' : '', elID);
                }
                else {
                    html = html + '<input type="text" id="{0}_Text" style="width:{1}" class="item textBox" syn-options="{editType: \'text\', dataType: \'string\', belongID: \'{2}\'}" syn-events="[\'keydown\']" {3} {4} baseID="{5}" />'.format(elID, setting.textElementWidth, setting.textBelongID, setting.readonly == true ? 'readonly="readonly"' : '', setting.required == true ? 'required="required"' : '', elID);
                }
            }

            var parent = el.parentNode;
            var wrapper = syn.$m.create({
                tag: 'span',
                id: elID,
                className: 'formControl codePicker'
            });
            wrapper.innerHTML = html;
            parent.appendChild(wrapper);

            var codeEL = syn.$l.get(elID + '_Code');
            syn.$l.addEvent(codeEL, 'focus', function (evt) {
                var el = evt.srcElement || evt.target;
                var mod = window[syn.$w.pageScript];
                if (mod) {
                    mod.context.focusControl = el;
                }
            });
            syn.uicontrols.$textbox.controlLoad(codeEL.id, eval('(' + codeEL.getAttribute('syn-options') + ')'));

            var textEL = syn.$l.get(elID + '_Text');
            syn.$l.addEvent(textEL, 'focus', function (evt) {
                var el = evt.srcElement || evt.target;
                var mod = window[syn.$w.pageScript];
                if (mod) {
                    mod.context.focusControl = el;
                }
            });
            syn.uicontrols.$textbox.controlLoad(textEL.id, eval('(' + textEL.getAttribute('syn-options') + ')'));

            var buttonEL = syn.$l.get(elID + '_Button');
            syn.$l.addEvent(buttonEL, 'focus', function (evt) {
                var el = evt.srcElement || evt.target;
                var mod = window[syn.$w.pageScript];
                if (mod) {
                    mod.context.focusControl = el;
                }
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        find: function (setting, callback) {
            if ($object.isNullOrUndefined(setting.dataSourceID) == true) {
                syn.$l.eventLog('$codepicker.find', 'dataSourceID 설정 없음', 'Debug');
                return;
            }

            setting.storeSourceID = setting.storeSourceID || setting.dataSourceID;
            var parameterID = setting.elID + setting.viewType + setting.dataSourceID;
            var mod = window[syn.$w.pageScript];
            if (mod) {
                if (mod.hook.frameEvent) {
                    var codeSetting = mod.hook.frameEvent('codeInit', setting);
                    setting = syn.$w.argumentsExtend(setting, codeSetting);
                }

                var applicationIDPattern = /(\@ApplicationID)\s*:/;
                if (applicationIDPattern.test(setting.parameters) == false) {
                    setting.parameters = '@ApplicationID:{0};'.format(syn.Config.ApplicationID) + setting.parameters;
                }

                var companyNoPattern = /(\@CompanyNo)\s*:/;
                if (syn.$w.SSO && syn.$w.SSO.WorkCompanyNo && companyNoPattern.test(setting.parameters) == false) {
                    setting.parameters = '@CompanyNo:{0};'.format(syn.$w.SSO.WorkCompanyNo) + setting.parameters;
                }

                var localeIDPattern = /(\@LocaleID)\s*:/;
                if (localeIDPattern.test(setting.parameters) == false) {
                    setting.parameters = '@LocaleID:{0};'.format(syn.Config.Program.LocaleID) + setting.parameters;
                }

                mod.codePickerArguments = mod.codePickerArguments || {};
                mod.codePickerArguments[parameterID] = setting;
            }

            var dialogOptions = $ref.clone(syn.$w.dialogOptions);
            dialogOptions.minWidth = 480;
            dialogOptions.minHeight = 360;
            dialogOptions.caption = (setting.controlText ? setting.controlText : setting.dataSourceID) + ' 코드도움';

            syn.$w.showUIDialog(syn.Config.SharedAssetUrl + 'codehelp/index.html?parameterID={0}'.format(parameterID), dialogOptions, function (result) {
                if (result && result.length > 0) {
                    var value = '';
                    var text = '';
                    if (setting.isMultiSelect == false) {
                        var item = result[0];
                        value = item.value;
                        text = item.text;
                    } else {
                        var values = [];
                        var texts = [];
                        var length = result.length;
                        for (var i = 0; i < length; i++) {
                            var item = result[i];
                            values.push(item.value);
                            texts.push(item.text);
                        }

                        value = values.join();
                        text = texts.join();
                    }

                    if (setting.viewType == 'form') {
                        syn.$l.get(setting.codeElementID).value = value;
                        if (setting.textElementID) {
                            syn.$l.get(setting.textElementID).value = text;
                        }
                    } else if (setting.viewType == 'grid') {
                        var $grid = syn.uicontrols.$grid;
                        var row = $grid.getActiveRowIndex(setting.elID);
                        $grid.setDataAtCell(setting.elID, row, setting.codeColumnID, value);
                        if (setting.textColumnID) {
                            $grid.setDataAtCell(setting.elID, row, setting.textColumnID, text);
                        }
                    }
                }

                if (callback) {
                    callback(result);
                }
            });
        },

        toParameterString: function (jsonObject) {
            return jsonObject ? Object.entries(jsonObject).reduce(function (queryString, _ref, index) {
                var key = _ref[0],
                    val = _ref[1];
                if (key.indexOf('@') == -1) {
                    queryString += typeof val === 'string' ? '@' + key + ":" + val + ';' : '';
                }
                return queryString;
            }, '') : '';
        },

        toParameterObject: function (parameters) {
            return (parameters.match(/([^?:;]+)(:([^;]*))/g) || []).reduce(function (a, v) {
                return a[v.slice(0, v.indexOf(':')).replace('@', '')] = v.slice(v.indexOf(':') + 1), a;
            }, {});
        },

        getValue: function (elID, meta) {
            var result = false;
            var el = syn.$l.get(elID + '_Code');
            result = el.value;

            return result;
        },

        setValue: function (elID, value, meta) {
            var el = syn.$l.get(elID + '_Code');
            el.value = value;
        },

        setText: function (elID, value, meta) {
            var el = syn.$l.get(elID + '_Text');
            el.value = value;
        },

        clear: function (elID, isControlLoad) {
            syn.$l.get(elID + '_Code').value = '';
            syn.$l.get(elID + '_Text').value = '';
        },

        open: function (elID) {
            syn.$l.trigger(elID + '_Button', 'click');
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$codepicker = $codepicker;
})(window);
