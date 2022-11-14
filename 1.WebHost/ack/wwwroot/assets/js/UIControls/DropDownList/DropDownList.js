/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $select = syn.uicontrols.$select || new syn.module();

    $select.extend({
        name: 'syn.uicontrols.$select',
        version: '1.0',
        selectControls: [],
        defaultSetting: {
            elID: '',
            required: false,
            animate: false,
            local: true,
            search: false,
            multiSelectAll: false,
            width: '100%',
            classNames: null,
            dataSourceID: null,
            storeSourceID: null,
            parameters: null, // @ParameterValue:HELLO WORLD;
            selectedValue: null,
            toQafControl: true,
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
        },

        controlLoad: function (elID, setting) {
            setting = syn.$w.argumentsExtend($select.defaultSetting, setting);
            var mod = window[syn.$w.pageScript];
            if (mod && mod.hook.controlInit) {
                var moduleSettings = mod.hook.controlInit(elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            setting.elID = elID;
            setting.storeSourceID = setting.storeSourceID || setting.dataSourceID;

            var el = syn.$l.get(elID);
            el.setAttribute('syn-options', JSON.stringify(setting));
            $select.addControlSetting(el, setting);

            if (setting.storeSourceID) {
                syn.$w.addReadyCount();
                var dataSource = null;
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID] && setting.local == true) {
                    dataSource = mod.config.dataSource[setting.storeSourceID];
                }

                if (dataSource) {
                    $select.loadData(setting.elID, dataSource, setting.required);
                    if (setting.selectedValue) {
                        $select.setValue(setting.elID, setting.selectedValue);
                    }
                    syn.$w.removeReadyCount();
                } else {
                    if (setting.local == true) {
                        syn.$w.loadJson(syn.Config.SharedAssetUrl + 'code/{0}.json'.format(setting.dataSourceID), setting, function (setting, json) {
                            if (json) {
                                mod.config.dataSource[setting.storeSourceID] = json;
                                $select.loadData(setting.elID, json, setting.required);
                                if (setting.selectedValue) {
                                    $select.setValue(setting.elID, setting.selectedValue);
                                }
                            }
                            syn.$w.removeReadyCount();
                        }, false);
                    } else {
                        syn.$w.getDataSource(setting.dataSourceID, setting.parameters, function (json) {
                            if (json) {
                                mod.config.dataSource[setting.storeSourceID] = json;
                                $select.loadData(setting.elID, json, setting.required);
                                if (setting.selectedValue) {
                                    $select.setValue(setting.elID, setting.selectedValue);
                                }
                            }

                            syn.$w.removeReadyCount();
                        });
                    }
                }
            }

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        dataRefresh: function (elID, setting, callback) {
            setting = syn.$w.argumentsExtend($select.defaultSetting, setting);
            setting.elID = elID;
            setting.storeSourceID = setting.storeSourceID || setting.dataSourceID;

            var el = syn.$l.get(elID);
            el.setAttribute('syn-options', JSON.stringify(setting));

            if (setting.dataSourceID) {
                var mod = window[syn.$w.pageScript];
                if (mod && mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID]) {
                    delete mod.config.dataSource[setting.storeSourceID];
                }

                if (mod && mod.hook.controlInit) {
                    var moduleSettings = mod.hook.controlInit(elID, setting);
                    setting = syn.$w.argumentsExtend(setting, moduleSettings);
                }

                var dataSource = null;
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID]) {
                    dataSource = mod.config.dataSource[setting.storeSourceID];
                }

                if (dataSource) {
                    $select.loadData(setting.elID, dataSource, setting.required);
                    if (setting.selectedValue) {
                        $select.setValue(setting.elID, setting.selectedValue);
                    }

                    if (callback) {
                        callback();
                    }
                } else {
                    if (setting.local == true) {
                        syn.$w.loadJson(syn.Config.SharedAssetUrl + 'code/{0}.json'.format(setting.dataSourceID), setting, function (setting, json) {
                            mod.config.dataSource[setting.storeSourceID] = json;
                            $select.loadData(setting.elID, json, setting.required);
                            if (setting.selectedValue) {
                                $select.setValue(setting.elID, setting.selectedValue);
                            }

                            if (callback) {
                                callback();
                            }
                        }, false);
                    } else {
                        syn.$w.getDataSource(setting.dataSourceID, setting.parameters, function (json) {
                            mod.config.dataSource[setting.storeSourceID] = json;
                            $select.loadData(setting.elID, json, setting.required);
                            if (setting.selectedValue) {
                                $select.setValue(setting.elID, setting.selectedValue);
                            }

                            if (callback) {
                                callback();
                            }
                        });
                    }
                }
            }
        },

        addControlSetting: function (el, setting) {
            var picker = null;
            if (setting.toQafControl == true) {
                picker = tail.select(el, setting);

                picker.on('open', function () {
                    var picker = $select.getControl(this.e.id).picker;
                    if ($string.toBoolean(picker.selectedDisabled) == true) {
                        picker.selectValue = picker.value();
                        picker.label.style.backgroundColor = '#f2f2f2';
                        picker.label.style.color = '#999';
                    }
                    else {
                        picker.label.style.backgroundColor = '';
                        picker.label.style.color = '';
                    }

                    var options = this.e.options;
                    var length = options.length;
                    var maxTextLength = 0;
                    var maxTextIndex = 0;

                    if (length > 0) {
                        for (var i = 0; i < length; i++) {
                            var option = options[i];
                            var textLength = option.textContent.length;
                            if (maxTextLength < textLength) {
                                maxTextLength = textLength;
                                maxTextIndex = i;
                            }
                        }

                        var textSize = syn.$d.measureSize(options[maxTextIndex].textContent);

                        if (textSize) {
                            var textWidth = parseInt(textSize.width.replace('px', '')) + 50;
                            if (textWidth > 600) {
                                textWidth = 600;
                            }

                            if (syn.$d.getSize(this.dropdown).width < textWidth) {
                                this.dropdown.style.width = textWidth.toString() + 'px';
                            }
                        }
                    }
                });

                picker.on('close', function () {
                    var picker = $select.getControl(this.e.id).picker;
                    if ($string.toBoolean(picker.selectedDisabled) == true) {
                        $select.setValue(this.e.id, picker.selectValue);
                        picker.label.style.backgroundColor = '#f2f2f2';
                        picker.label.style.color = '#999';
                    }
                    else {
                        picker.label.style.backgroundColor = '';
                        picker.label.style.color = '';
                    }
                });

                setTimeout(function () {
                    picker.select.picker = picker;
                    syn.$l.addEvent(picker.select, 'focus', function (evt) {
                        $this.context.tabOrderFocusID = this.picker.e.id;
                        $this.context.focusControl = this.picker.e;
                    });
                });
            }

            $select.selectControls.push({
                id: el.id,
                picker: picker,
                setting: $ref.clone(setting)
            });
        },

        getValue: function (elID, meta) {
            var result = '';
            var el = syn.$l.get(elID);
            if (el) {
                result = el.value;
            }

            return result;
        },

        setValue: function (elID, value, meta) {
            var el = syn.$l.get(elID);
            if (el) {
                el.value = value;
                $select.controlReload(elID);
            }
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);
            if (el) {
                el.value = '';
                $select.controlReload(elID);
            }
        },

        loadData: function (elID, dataSource, required) {
            var el = syn.$l.get(elID);
            if ($object.isNullOrUndefined(required) == true) {
                required = false;
            }

            el.options.length = 0;

            if (syn.$b.isIE == true) {
                var options = el.options;
                if (required == false) {
                    el.add(document.createElement('option'));
                }

                var length = dataSource.DataSource.length;
                for (var i = 0; i < length; i++) {
                    var item = dataSource.DataSource[i];
                    var option = document.createElement('option');
                    option.value = item[dataSource.CodeColumnID];
                    option.text = item[dataSource.ValueColumnID];
                    el.add(option);
                }
            } else {
                var options = [];
                if (required == false) {
                    options.push('<option value="">항목 선택...</option>');
                }

                var length = dataSource.DataSource.length;
                for (var i = 0; i < length; i++) {
                    var item = dataSource.DataSource[i];
                    options.push('<option value=\"'.concat(item[dataSource.CodeColumnID], '">', item[dataSource.ValueColumnID], '</option>'));
                }

                el.innerHTML = options.join('');
            }

            $select.setSelectedDisabled(elID, false);
            $select.controlReload(elID);
        },

        controlReload: function (elID) {
            var el = syn.$l.get(elID);
            if (el) {
                var control = $select.getControl(elID);
                if (control) {
                    if (control.picker) {
                        control.picker.reload();
                    }
                }
            }
        },

        getSelectedIndex: function (elID) {
            var result = '';
            var el = syn.$l.get(elID);
            if (el) {
                result = el.options.selectedIndex;
            }

            return result;
        },

        setSelectedIndex: function (elID, index) {
            var el = syn.$l.get(elID);
            if (el) {
                if (el.options.length > index) {
                    el.selectedIndex = index;
                    $select.controlReload(elID);
                }
            }
        },

        setSelectedValue: function (elID, value) {
            var el = syn.$l.get(elID);
            if (el) {
                var length = el.options.length;
                for (var i = 0; i < length; i++) {
                    var item = el.options[i];
                    if (item.value == value) {
                        el.selectedIndex = i;
                        $select.controlReload(elID);
                        break;
                    }
                }
            }
        },

        setSelectedText: function (elID, text) {
            var el = syn.$l.get(elID);
            if (el) {
                var length = el.options.length;
                for (var i = 0; i < length; i++) {
                    var item = el.options[i];
                    if (item.text == text) {
                        el.selectedIndex = i;
                        $select.controlReload(elID);
                        break;
                    }
                }
            }
        },

        getSelectedValue: function (elID) {
            var result = '';
            var el = syn.$l.get(elID);
            if (el) {
                if (el.options.selectedIndex > -1) {
                    result = el.options[el.options.selectedIndex].value;
                }
            }

            return result;
        },

        getSelectedText: function (elID) {
            var result = '';
            var el = syn.$l.get(elID);
            if (el) {
                if (el.options.selectedIndex > -1) {
                    result = el.options[el.options.selectedIndex].text;
                }
            }

            return result;
        },

        disabled: function (elID, value) {
            if ($object.isNullOrUndefined(value) == true) {
                value = false;
            }

            value = $string.toBoolean(value);

            $this.$select.getControl(elID).picker.config('disabled', value);
        },

        setSelectedDisabled: function (elID, value) {
            var el = syn.$l.get(elID);
            if (el) {
                var selectdValue = $select.getSelectedValue(elID);
                var length = el.options.length;

                var selectedDisabled = $string.toBoolean(value);
                if (selectedDisabled == true) {
                    for (var i = 0; i < length; i++) {
                        var item = el.options[i];
                        if (item.value == selectdValue) {
                            item.disabled = false;
                        }
                        else {
                            item.disabled = true;
                        }
                    }
                }
                else {
                    for (var i = 0; i < length; i++) {
                        var item = el.options[i];
                        item.disabled = false;
                    }
                }

                $select.controlReload(elID);

                var picker = $select.getControl(elID).picker;
                picker.selectedDisabled = selectedDisabled;

                if (selectedDisabled == true) {
                    picker.label.style.backgroundColor = '#f2f2f2';
                    picker.label.style.color = '#999';
                }
                else {
                    picker.label.style.backgroundColor = '';
                    picker.label.style.color = '';
                }
            }
        },

        getControl: function (elID) {
            var result = null;
            var length = $select.selectControls.length;
            for (var i = 0; i < length; i++) {
                var item = $select.selectControls[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$select = $select;
})(window);
