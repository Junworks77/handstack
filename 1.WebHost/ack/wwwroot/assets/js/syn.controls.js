/// <reference path="syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $chartjs = syn.uicontrols.$chartjs || new syn.module();

    if (window.Chart) {
        Chart.defaults.global.defaultFontColor = '#666';
        Chart.defaults.global.defaultFontFamily = "Noto Sans KR, 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
        Chart.defaults.global.defaultFontSize = 12;
        Chart.defaults.global.defaultFontStyle = 'normal';

        Chart.defaults.global.legend.position = 'bottom';
        Chart.defaults.global.legend.align = 'start';
        Chart.defaults.global.legend.onClick = function (e, legendItem) {
            var el = e.target || e.srcElement;
            var control = $chartjs.getChartControl(el.id);
            if (control) {
                var mod = window[syn.$w.pageScript];
                /*
                chtChart4_legendClick: function (elID, chart, legendItem) {
                    var index = legendItem.datasetIndex;
                    var ci = chart;
                    var meta = ci.getDatasetMeta(index);

                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

                    ci.update();
                }
                 */
                var eventHandler = '{0}_legendClick'.format(el.id);
                if (mod && mod[eventHandler]) {
                    mod[eventHandler](el.id, control.chart, legendItem);
                }
            }
        }

        Chart.defaults.global.elements.line.fill = false;

        Chart.plugins.register({
            beforeDraw: function (c) {
                var ctx = c.chart.ctx;
                ctx.fillStyle = (window.localStorage && localStorage.getItem('isDarkMode') == 'true') ? 'rgba(0, 0, 0, 0)' : '#fff';
                ctx.fillRect(0, 0, c.chart.width, c.chart.height);
            }
        });

        Chart.defaults.global.defaultTheme = {
            maintainAspectRatio: false,
            responsiveAnimationDuration: 0,
            showLines: true,
            layout: {
                padding: 8
            },
            legend: {
                display: true,
                fontColor: '#ccc'
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.2)',
                        zeroLineColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    ticks: {
                        fontColor: '#ccc'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.2)',
                        zeroLineColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#ccc'
                    }
                }]
            },
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0,
                intersect: false
            },
            title: {
                display: false,
                fontSize: 16,
                text: ''
            },
            tooltips: {
                position: 'nearest',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFontColor: '#fff',
                bodyFontColor: '#fff'
            },
            plugins: {
                colorschemes: {
                    scheme: 'brewer.Paired12'
                }
            }
        };

        Chart.defaults.global.darkTheme = {
            maintainAspectRatio: false,
            responsiveAnimationDuration: 0,
            showLines: true,
            layout: {
                padding: 8
            },
            legend: {
                display: true,
                fontColor: '#ccc'
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.2)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.5)'
                    },
                    ticks: {
                        fontColor: '#ccc'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.2)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.5)'
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#ccc'
                    }
                }]
            },
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0,
                intersect: false
            },
            title: {
                display: false,
                fontSize: 16,
                text: ''
            },
            tooltips: {
                position: 'nearest',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                titleFontColor: '#000',
                bodyFontColor: '#000'
            },
            plugins: {
                colorschemes: {
                    scheme: 'brewer.Paired12'
                }
            }
        };
    }

    $chartjs.extend({
        name: 'syn.uicontrols.$chartjs',
        version: '1.0',
        chartControls: [],
        randomSeed: Date.now(),
        defaultSetting: {
            labelID: '',
            series: [],
            type: 'line', // bar, line, pie, doughnut, horizontalBar, radar
            data: {},
            options: null,
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($chartjs.defaultSetting, setting);
            var isDarkMode = (window.localStorage && localStorage.getItem('isDarkMode') == 'true');
            if (isDarkMode == false) {
                setting.options = syn.$w.argumentsExtend($ref.clone(Chart.defaults.global.defaultTheme), setting.options);
            }
            else {
                setting.options = syn.$w.argumentsExtend($ref.clone(Chart.defaults.global.darkTheme), setting.options);
            }

            /*
            // https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html
            controlInit: function (elID, settings) {
                if (elID == 'chtChart1' || elID == 'chtChart2' || elID == 'chtChart3') {
                    settings.options.scales.yAxes[0].ticks.min = 0;
                    settings.options.scales.yAxes[0].ticks.max = 100;
                }

                if (elID == 'chtChart1' || elID == 'chtChart2' || elID == 'chtChart3') {
                    settings.options.plugins.colorschemes.scheme = 'tableau.ClassicGray5';
                }

                if (elID == 'chtChart4') {
                    settings.options.plugins.colorschemes.scheme = 'tableau.ClassicBlueRed6';
                }
            },
            */
            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            if ($string.isNullOrEmpty(setting.labelID) == true) {
                syn.$l.eventLog('$chartjs.controlLoad', 'labelID 정보 확인 필요', 'Debug');
                return;
            }

            setting.width = el.style.width || 320;
            setting.height = el.style.height || 240;

            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var parent = el.parentNode;
            var wrapper = document.createElement('div');
            wrapper.style.width = setting.width;
            wrapper.style.height = setting.height;
            wrapper.style.position = 'relative';
            wrapper.className = 'chart-container';
            wrapper.innerHTML = '<canvas id="{0}"></canvas>'.format(elID);

            parent.appendChild(wrapper);

            syn.$l.addEvent(syn.$l.get(elID), 'click', function (evt) {
                var el = evt.target || evt.srcElement;
                var control = $chartjs.getChartControl(el.id);
                if (control) {
                    var chart = control.chart;
                    // chart.getElementAtEvent(evt);
                    // chart.getDatasetAtEvent(evt);
                    var activePoints = chart.getElementsAtEventForMode(evt, 'point', control.config);
                    if (activePoints.length > 0) {
                        var firstPoint = activePoints[0];
                        var label = chart.data.labels[firstPoint._index];
                        var value = chart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
                        console.log(label + ": " + value);
                    }
                }
            });

            $chartjs.chartControls.push({
                id: elID,
                chart: new Chart(elID, setting),
                config: setting,
                value: null
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            return '';
        },

        setValue: function (elID, value, metaColumns) {
            var error = '';
            var control = $chartjs.getChartControl(elID);
            if (control) {
                control.config.data.labels.length = 0;
                control.config.data.datasets.length = 0;
                if (value && value.length > 0) {
                    var item = value[0];

                    for (var column in item) {
                        var isTypeCheck = false;
                        var metaColumn = metaColumns[column];
                        if (metaColumn) {
                            switch (metaColumn.DataType.toLowerCase()) {
                                case 'string':
                                    isTypeCheck = item[column] == null || $ref.isString(item[column]);
                                    break;
                                case 'bool':
                                    if (item[column] == null || item[column] == '1' || item[column] == '0') {
                                        isTypeCheck = true;
                                    }
                                    else {
                                        isTypeCheck = $ref.isBoolean(item[column]);
                                    }
                                    break;
                                case 'number':
                                case 'int':
                                    isTypeCheck = item[column] == null || $string.isNumber(item[column]) || $ref.isNumber(item[column]);
                                    break;
                                case 'date':
                                    isTypeCheck = item[column] == null || $ref.isDate(item[column]);
                                    break;
                                default:
                                    isTypeCheck = false;
                                    break;
                            }

                            if (isTypeCheck == false) {
                                error = '바인딩 데이터 타입과 매핑 정의가 다름, 바인딩 ID - "{0}", 타입 - "{1}"'.format(column, metaColumn.DataType);
                                break;
                            }
                        } else {
                            continue;
                        }
                    }

                    if (error == '') {
                        var columnKeys = [];
                        for (var key in item) {
                            if (control.config.labelID != key) {
                                columnKeys.push(key);
                            }
                        }

                        var labels = value.map(function (item) { return item[control.config.labelID] });
                        control.config.data.labels = labels;

                        var length = columnKeys.length;
                        for (var i = 0; i < length; i++) {
                            var columnID = columnKeys[i];

                            if (control.config.series && control.config.series.length > 0) {
                                var series = control.config.series.find(function (item) { return item.columnID == columnID });
                                if (series) {
                                    var labelName = series.label ? series.label : series.columnID;
                                    var data = value.map(function (item) { return item[columnID] });

                                    var dataset = {
                                        label: labelName,
                                        data: data,
                                        fill: series.fill
                                    };

                                    control.config.data.datasets.push(dataset);
                                }
                            }
                            else {
                                var labelName = columnID;
                                var data = value.map(function (item) { return item[columnID] });

                                var dataset = {
                                    label: labelName,
                                    data: data,
                                    fill: false
                                };

                                control.config.data.datasets.push(dataset);
                            }
                        }
                    } else {
                        syn.$l.eventLog('$chartjs.setValue', error, 'Debug');
                    }
                }

                control.chart.update();
            }
        },

        randomScalingFactor: function (min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 100 : max;
            return Math.round($chartjs.rand(min, max));
        },

        rand: function (min, max) {
            var seed = $chartjs.randomSeed;
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            $chartjs.randomSeed = (seed * 9301 + 49297) % 233280;
            return min + ($chartjs.randomSeed / 233280) * (max - min);
        },

        toImage: function (elID, fileID) {
            var control = $chartjs.getChartControl(elID);
            if (control) {
                var fileName = '{0}.png'.format(fileID || elID);
                var base64Image = control.chart.toBase64Image();

                if (download) {
                    download(base64Image, fileName, 'image/png');
                }
                else {
                    var a = document.createElement('a');
                    a.href = base64Image
                    a.download = fileName;
                    a.click();
                }
            }
        },

        getChartControl: function (elID) {
            var result = null;

            var length = $chartjs.chartControls.length;
            for (var i = 0; i < length; i++) {
                var item = $chartjs.chartControls[i];
                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        clear: function (elID, isControlLoad) {
            var control = $chartjs.getChartControl(elID);
            if (control) {
                control.config.data.labels.length = 0;
                control.config.data.datasets.length = 0;
                control.chart.update();
            }
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$chartjs = $chartjs;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $checkbox = syn.uicontrols.$checkbox || new syn.module();

    $checkbox.extend({
        name: 'syn.uicontrols.$checkbox',
        version: '1.0',
        defaultSetting: {
            contents: '',
            toQafControl: false,
            disabled: false,
            checkedValue: '1',
            uncheckedValue: '0',
            dataType: 'string',
            belongID: null,
            getter: false,
            setter: false,
            controlText: null,
            textContent: '',
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($checkbox.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            if (setting.toQafControl == true) {
                el.setAttribute('id', el.id + '_hidden');
                el.setAttribute('syn-options', JSON.stringify(setting));
                el.style.display = 'none';

                var dataFieldID = el.getAttribute('syn-datafield');
                var events = el.getAttribute('syn-events');
                var value = el.value;
                var checked = el.checked;
                var disabled = setting.disabled || el.disabled;
                var html = '';
                if (events) {
                    html = '<input class="ui_checkbox" id="{0}" name="{1}" type="checkbox" syn-datafield="{2}" value="{3}" {4} {5} syn-events={6}>'.format(elID, name, dataFieldID, value, checked == true ? 'checked="checked"' : '', disabled == true ? 'disabled="disabled"' : '', '[\'' + eval(events).join('\',\'') + '\']');
                }
                else {
                    html = '<input class="ui_checkbox" id="{0}" name="{1}" type="checkbox" syn-datafield="{2}" value="{3}" {4} {5}>'.format(elID, name, dataFieldID, value, checked == true ? 'checked="checked"' : '', disabled == true ? 'disabled="disabled"' : '');
                }

                if ($ref.isString(setting.textContent) == true) {
                    html = html + '<label class="ml-1" for="{0}">{1}</label>'.format(elID, setting.textContent);
                }

                var parent = el.parentNode;
                var wrapper = syn.$m.create({
                    tag: 'span',
                    className: 'formControl'
                });
                wrapper.innerHTML = html;

                parent.appendChild(wrapper);
                syn.$l.get(elID).setAttribute('syn-options', JSON.stringify(setting));
            }
            else {
                el.setAttribute('syn-options', JSON.stringify(setting));
            }

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = null;
            var el = syn.$l.get(elID);
            if (el) {
                var qafOptions = el.getAttribute('syn-options');
                if (qafOptions) {
                    var options = JSON.parse(qafOptions);
                    if (options.checkedValue && options.uncheckedValue) {
                        if (el.checked == true) {
                            result = options.checkedValue;
                        }
                        else {
                            result = options.uncheckedValue;
                        }
                    }
                }
                else {
                    result = el.checked;
                }
            }
            else {
                result = '';
            }

            return result;
        },

        setValue: function (elID, value, meta) {
            var el = syn.$l.get(elID);
            if (value) {
                value = value.toString().toUpperCase();
                el.checked = (value == 'TRUE' || value == 'Y' || value == '1');
            }
            else {
                el.checked = false;
            }
        },

        toggleValue: function (elID) {
            var el = syn.$l.get(elID);
            if (el.checked == false) {
                el.checked = true;
            } else {
                if (el.checked == true) {
                    el.checked = false;
                }
            }
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);
            el.checked = false;
        },

        getGroupNames: function () {
            var value = [];
            var els = syn.$l.querySelIDectorAll('input[type=\'checkbox\']');
            for (var i = 0; i < els.length; i++) {
                value.push(els[i].name);
            }

            return $array.distinct(value);
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$checkbox = $checkbox;
})(window);
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
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            mod[elID + '_Button_click'] = () => {
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
                            var changeHandler = mod[elID + '_change'];
                            if (changeHandler) {
                                changeHandler(inputValue, inputText, result);
                            }
                        }

                        var returnHandler = mod['frameEvent'];
                        if (returnHandler) {
                            returnHandler.call(this, 'codeReturn', {
                                elID: elID,
                                result: result
                            });
                        }
                    });
                }
            };

            mod[elID + '_Code_keydown'] = function (evt) {
                var el = event.currentTarget;
                var elID = el.id.replace('_Code', '');

                syn.$l.get(elID + '_Text').value = '';

                if (evt.keyCode == 13) {
                    mod[elID + '_Button_click'].apply(this, evt);
                }
            };

            mod[elID + '_Text_keydown'] = function (evt) {
                var el = event.currentTarget;
                var elID = el.id.replace('_Text', '');

                syn.$l.get(elID + '_Code').value = '';

                if (evt.keyCode == 13) {
                    mod[elID + '_Button_click'].apply(this, evt);
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
                if (mod['frameEvent']) {
                    var codeSetting = mod['frameEvent']('codeInit', setting);
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
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $colorpicker = syn.uicontrols.$colorpicker || new syn.module();

    $colorpicker.extend({
        name: 'syn.uicontrols.$colorpicker',
        version: '1.0',
        colorControls: [],
        defaultSetting:
        {
            elID: '',
            defaultColor: null,
            defineColors: ['FF0000', 'FF4000', 'FF8000', 'FFBF00', 'FFFF00', 'BFFF00', '80FF00', '40FF00', '00FF00', '00FFFF', '00BFFF', '0080FF', '0040FF', '8000FF', 'BF00FF', 'FF00FF', 'FF0080', 'FF0080', '848484', '000000'],
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($colorpicker.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            setting.elID = elID;
            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var dataField = el.getAttribute('syn-datafield');

            var html = '<div class="control">' +
                '<input type="text" class="form-control" id="{0}" syn-datafield="{1}" syn-options="{editType: \'text\', maskPattern: \'#SSSSSS\', dataType: \'string\', belongID: \'{2}\'}" />'.format(elID, dataField, setting.belongID) +
                '<button type="button" id="{0}_Button" type="button" class="btn btn-default btn-code-search"></button>'.format(elID) +
                '</div>';

            var parent = el.parentNode;
            var wrapper = syn.$m.create({
                tag: 'div',
                id: elID + '_box',
                className: 'control-set'
            });
            wrapper.innerHTML = html;

            parent.appendChild(wrapper);

            syn.uicontrols.$textbox.controlLoad(elID);

            setting.field = syn.$l.get(elID);
            setting.trigger = syn.$l.get(elID + '_Button');

            syn.$l.addEvent(setting.trigger, 'click', function (e) {
                picker[picker.visible ? 'exit' : 'enter']();
            });

            var picker = new CP(setting.field);
            if ($ref.isString(setting.defaultColor) == true) {
                picker.set(setting.defaultColor);
            }

            var box = document.createElement('span');
            box.className = 'color-pickers';
            picker.self.appendChild(box);

            var span = null;
            for (var i = 0, j = setting.defineColors.length; i < j; ++i) {
                span = document.createElement('span');
                span.title = '#' + setting.defineColors[i];
                span.style.backgroundColor = '#' + setting.defineColors[i];
                syn.$l.addEvent(span, 'click', function (e) {
                    picker.set(this.title);
                    picker.fire("change", [this.title.slice(1)], 'main-change');
                    e.stopPropagation();
                });
                box.appendChild(span);
            }

            var code = document.createElement('input');

            picker.source.onclick = function (e) {
                e.preventDefault();
            };

            code.className = 'color-picker-code';
            code.pattern = '^#[A-Fa-f0-9]{6}$';
            code.type = 'text';

            picker.on("enter", function () {
                code.value = '#' + CP._HSV2HEX(this.get());
            });

            picker.on("change", function (color) {
                this.source.value = '#' + color;
                code.value = '#' + color;
                code.style.backgroundColor = '#' + color;
            });

            picker.self.appendChild(code);

            function update() {
                if (this.value.length) {
                    picker.set(this.value);
                    picker.fire("change", [this.value.slice(1)]);
                }
            }

            code.oncut = update;
            code.onpaste = update;
            code.onkeyup = update;
            code.oninput = update;

            $colorpicker.colorControls.push({
                id: elID,
                picker: picker,
                setting: $ref.clone(setting)
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = null;
            var dateControl = $colorpicker.getControl(elID);

            if (dateControl) {
                result = dateControl.picker.field.value;
            }

            return result;
        },

        setValue: function (elID, value, meta) {
            var dateControl = $colorpicker.getControl(elID);
            if (dateControl) {
                dateControl.picker.field.value = value;
            }
        },

        colorConvert: function (convertType, value) {
            return CP[convertType](value);
        },

        clear: function (elID, isControlLoad) {
            var dateControl = $colorpicker.getControl(elID);
            if (dateControl) {
                dateControl.picker.clear();
            }
        },

        getControl: function (elID) {
            var result = null;
            var length = $colorpicker.colorControls.length;
            for (var i = 0; i < length; i++) {
                var item = $colorpicker.colorControls[i];

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
    syn.uicontrols.$colorpicker = $colorpicker;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $contextmenu = syn.uicontrols.$contextmenu || new syn.module();

    $contextmenu.extend({
        name: 'syn.uicontrols.$contextmenu',
        version: '1.0',
        menuControls: [],
        eventHooks: [
            'close',
            'create',
            'beforeOpen',
            'open',
            'select'
        ],
        defaultSetting: {
            target: 'targetCSSSelector',
            delegate: 'delegateCSSSelector',
            autoFocus: true,
            closeOnWindowBlur: true,
            hide: false,
            show: false,
            menu: [
                // uiIcon: https://api.jqueryui.com/theming/icons/
                { title: 'Cut', cmd: 'cut' },
                { title: 'Copy', cmd: 'copy', uiIcon: 'ui-icon-copy' },
                { title: '---' },
                {
                    title: 'More', children: [
                        { title: 'Sub 1', cmd: 'sub1' },
                        { title: 'Sub 2', cmd: 'sub1' }
                    ]
                }
            ],
            dataType: 'string',
            belongID: null,
            getter: false,
            setter: false,
            controlText: null,
            validators: null,
            transactConfig: null,
            triggerConfig: null
        },

        controlLoad: function (elID, setting) {
            var el = syn.$l.get(elID);
            setting = syn.$w.argumentsExtend($contextmenu.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var hookEvents = el.getAttribute('syn-events');
            try {
                if (hookEvents) {
                    hookEvents = eval(hookEvents);
                }
            } catch (error) {
                syn.$l.eventLog('ContextMenu_controlLoad', error.toString(), 'Debug');
            }

            for (var i = 0; i < hookEvents.length; i++) {
                var hookEvent = hookEvents[i];
                if ($contextmenu.eventHooks.indexOf(hookEvent) > -1) {
                    if ($object.isNullOrUndefined(setting[hookEvent]) == true) {
                        setting[hookEvent] = function (evt, ui) {
                            var eventName = $contextmenu.eventHooks.find(function (item) { return item.toLowerCase() == evt.type.replace('contextmenu', '') });
                            var mod = window[syn.$w.pageScript];
                            if (mod) {
                                var eventHandler = mod['{0}_{1}'.format(elID, eventName)];
                                if (eventHandler) {
                                    eventHandler.apply(syn.$l.get(elID), [evt, ui]);
                                }
                            }
                        }
                    }
                }
            }

            $contextmenu.menuControls.push({
                id: elID,
                context: $(setting.target).contextmenu(setting),
                config: setting
            });
        },

        getValue: function (elID, meta) {
            // 지원 안함
            return null;
        },

        setValue: function (elID, value, meta) {
            // 지원 안함
        },

        clear: function (elID, isControlLoad) {
            // 지원 안함
        },

        getControl: function (elID) {
            var result = null;
            var length = $contextmenu.menuControls.length;
            for (var i = 0; i < length; i++) {
                var item = $contextmenu.menuControls[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        close: function (elID) {
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                context.contextmenu('close');
            }
        },

        enableEntry: function (elID, cmd, flag) {
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                context.contextmenu('enableEntry', cmd, flag);
            }
        },

        getEntry: function (elID, cmd) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('getEntry', cmd);
            }

            return result;
        },

        setEntry: function (elID, cmd, data) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('setEntry', cmd, data);
            }

            return result;
        },

        updateEntry: function (elID, cmd, data) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('updateEntry', cmd, data);
            }

            return result;
        },

        showEntry: function (elID, cmd, flag) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('showEntry', cmd, flag);
            }

            return result;
        },

        getEntryWrapper: function (elID, cmd) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('getEntryWrapper', cmd);
            }

            return result;
        },

        getMenu: function (elID) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('getMenu');
            }

            return result;
        },

        isOpen: function (elID) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('isOpen');
            }

            return result;
        },

        open: function (elID, targetOrEvent, extraData) {
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                context.contextmenu('open', targetOrEvent, extraData);
            }
        },

        setIcon: function (elID, cmd, icon) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('setIcon', cmd, icon);
            }

            return result;
        },

        setTitle: function (elID, cmd, title) {
            var result = null;
            var context = $contextmenu.getControl(elID).context;
            if (context) {
                result = context.contextmenu('setTitle', cmd, title);
            }

            return result;
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$contextmenu = $contextmenu;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $data = syn.uicontrols.$data || new syn.module();

    $data.extend({
        name: 'syn.uicontrols.$data',
        version: '1.0',
        bindingList: [],
        storeList: [],

        propertyEvent: true,
        defaultSetting: {
            dataSourceID: '',
            storeType: 'Form',
            dataItems: [],
            dataType: 'string',
            belongID: null,
            getter: false,
            setter: false,
            controlText: null,
            validators: null,
            transactConfig: null,
            triggerConfig: null
        },

        controlLoad: function (elID, setting) {
            var el = syn.$l.get(elID);
            setting = syn.$w.argumentsExtend($data.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            $this.store[setting.dataSourceID] = setting.storeType == 'Form' ? {} : [];
            $data.storeList.push({
                id: elID,
                dataSourceID: setting.dataSourceID,
                storeType: setting.storeType,
                columns: setting.columns
            });
        },

        getValue: function (elID, meta) {
            var result = null;
            $data.propertyEvent = false;
            var metaStore = $data.getMetaStore(elID);
            if (metaStore) {
                result = $this.store[metaStore.dataSourceID];
            }
            $data.propertyEvent = true;

            return result;
        },

        setValue: function (elID, value, meta) {
            // 지원 안함
        },

        clear: function (elID, isControlLoad) {
            // 지원 안함
        },

        getMetaStore: function (elID) {
            var result = null;
            var length = $data.storeList.length;
            for (var i = 0; i < length; i++) {
                var item = $data.storeList[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        reactionGetValue: function (elID, dataSourceID, dataFieldID) {
            var result = null;
            var bindingInfo = $data.bindingList.find(function (item) {
                return (item.elID == elID && item.dataSourceID == dataSourceID && item.dataFieldID == dataFieldID);
            });

            if (bindingInfo) {
                var storeInfo = $data.storeList.find(function (item) {
                    return (item.dataSourceID == bindingInfo.dataSourceID);
                });

                if (bindingInfo.controlType == 'grid' || bindingInfo.controlType == 'list' || bindingInfo.controlType == 'chart') {
                    var metaItems = {};
                    var length = storeInfo.columns.length;
                    for (var i = 0; i < length; i++) {
                        var metaItem = storeInfo.columns[i];

                        metaItems[metaItem.data] = {
                            FieldID: metaItem.data,
                            DataType: metaItem.dataType
                        };
                    }

                    var getType = storeInfo.storeType == 'Form' ? 'Row' : 'List';
                    result = bindingInfo.controlModule.getValue(elID, getType, metaItems);
                }
                else {
                    result = bindingInfo.controlModule.getValue(elID);
                }
            }

            return result;
        },

        reactionSetValue: function (elID, dataSourceID, dataFieldID, value) {
            var bindingInfo = $data.bindingList.find(function (item) {
                return (item.elID == elID && item.dataSourceID == dataSourceID && item.dataFieldID == dataFieldID);
            });

            if (bindingInfo) {
                var storeInfo = $data.storeList.find(function (item) {
                    return (item.dataSourceID == bindingInfo.dataSourceID);
                });

                if (bindingInfo.controlType == 'grid' || bindingInfo.controlType == 'list' || bindingInfo.controlType == 'chart') {
                    var metaItems = {};
                    var length = storeInfo.columns.length;
                    for (var i = 0; i < length; i++) {
                        var metaItem = storeInfo.columns[i];

                        metaItems[metaItem.data] = {
                            FieldID: metaItem.data,
                            DataType: metaItem.dataType
                        };
                    }

                    bindingInfo.controlModule.setValue(elID, value, metaItems);
                }
                else {
                    bindingInfo.controlModule.setValue(elID, value);
                }
            }
        },

        bindingSource: function (elID, dataSourceID) {
            var dataSource = $this.store[dataSourceID];
            var el = syn.$l.get(elID + '_hidden') || syn.$l.get(elID);
            if (el) {
                var tagName = el.tagName.toUpperCase();
                var controlModule = null;
                var controlType = null;

                if (tagName.indexOf('QAF_') > -1) {
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
                            controlType = el.getAttribute('type').toLowerCase();
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
                            if (el.getAttribute('multiple') == null) {
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

                var dataFieldID = el.getAttribute('syn-datafield');
                if (dataFieldID) {
                    var binding = null;

                    if (controlType == 'grid' || controlType == 'list' || controlType == 'chart') {
                        binding = $data.bindingList.find(function (item) {
                            return (item.dataSourceID == dataSourceID);
                        });
                    }
                    else {
                        binding = $data.bindingList.find(function (item) {
                            return (item.elID == elID && item.dataSourceID == dataSourceID && item.dataFieldID == dataFieldID);
                        });
                    }

                    if (binding == null) {
                        $data.bindingList.push({
                            elID: elID,
                            dataSourceID: dataSourceID,
                            dataFieldID: dataFieldID,
                            controlModule: controlModule,
                            controlType: controlType
                        });

                        Object.defineProperty(dataSource, dataFieldID, {
                            get: function () {
                                if ($data.propertyEvent == true) {
                                    return $data.reactionGetValue(elID, dataSourceID, dataFieldID);
                                }
                            },
                            set: function (value) {
                                if ($data.propertyEvent == true) {
                                    $data.reactionSetValue(elID, dataSourceID, dataFieldID, value);
                                }
                            },
                            configurable: true,
                            enumerable: true
                        });
                    }
                    else {
                        syn.$l.eventLog('$data.bindingSource', 'binding 정보 확인 필요 - elID: {0}, dataSourceID: {1}, dataFieldID: {2}, controlType: {3}, '.format(elID, dataSourceID, dataFieldID, controlType), 'Warning');
                    }
                }
                else {
                    syn.$l.eventLog('$data.bindingSource', 'dataFieldID 확인 필요', 'Warning');
                }
            }
            else {
                syn.$l.eventLog('$data.bindingSource', '"{0}" elID 확인 필요'.format(elID), 'Warning');
            }
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$data = $data;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $datepicker = syn.uicontrols.$datepicker || new syn.module();

    $datepicker.extend({
        name: 'syn.uicontrols.$datepicker',
        version: '1.0',
        dateControls: [],
        defaultSetting: {
            elID: '',
            width: '100%',
            defaultDate: null,
            setDefaultDate: false,
            minDate: null,
            maxDate: null,
            bound: true,
            format: 'YYYY-MM-DD',
            ariaLabel: '날짜를 선택하세요',
            i18n: {
                previousMonth: '이전 달',
                nextMonth: '다음 달',
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
                weekdaysShort: ['일', '월', '화', '수', '목', '금', '토']
            },
            showWeekNumber: false,
            showMonthAfterYear: true,
            yearSuffix: '년',
            firstDay: 0,
            useRangeSelect: false,
            rangeStartControlID: null,
            rangeEndControlID: null,
            numberOfMonths: 1,
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
            var el = syn.$l.get(elID);
            setting = syn.$w.argumentsExtend($datepicker.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            if (setting.useRangeSelect === true) {
                if ($object.isNullOrUndefined(setting.rangeStartControlID) == true) {
                    setting.rangeStartControlID = elID;
                }

                if ($object.isNullOrUndefined(setting.rangeEndControlID) == true) {
                    setting.rangeEndControlID = elID;
                }
            }

            setting.elID = elID;
            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var dataField = el.getAttribute('syn-datafield');
            var events = el.getAttribute('syn-events');
            var html = '';
            if (events) {
                html = '<input type="text" class="item textBox" id="{0}" syn-datafield="{1}" syn-options="{editType: \'date\', maskPattern: \'9999-99-99\', dataType: \'string\', belongID: \'{2}\'}" syn-events={3} />'.format(elID, dataField, setting.belongID, '[\'' + eval(events).join('\',\'') + '\']') +
                    '<button type="button" id="{0}_Button" type="button" class="icon-calendar"></button>'.format(elID);
            }
            else {
                html = '<input type="text" class="item textBox" id="{0}" syn-datafield="{1}" syn-options="{editType: \'date\', maskPattern: \'9999-99-99\', dataType: \'string\', belongID: \'{2}\'}" />'.format(elID, dataField, setting.belongID) +
                    '<button type="button" id="{0}_Button" type="button" class="icon-calendar"></button>'.format(elID);
            }

            var parent = el.parentNode;
            var wrapper = syn.$m.create({
                tag: 'span',
                className: 'formControl inputGroup',
                style: { width: setting.width }
            });
            wrapper.innerHTML = html;

            parent.appendChild(wrapper);

            syn.uicontrols.$textbox.controlLoad(elID, eval('(' + syn.$l.get(elID).getAttribute('syn-options') + ')'));

            setting.field = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend({
                onOpen: function () {
                    var elID = this._o.elID;
                    var date = this.getDate();
                    $datepicker.updateRangeDate(elID, date);

                    var mod = window[syn.$w.pageScript];
                    var selectFunction = '{0}_onselect'.format(elID);
                    if (mod && mod[selectFunction]) {
                        mod[selectFunction](elID, date);
                    }
                },
                onClose: function () {
                    var elID = this._o.elID;
                    var date = this.getDate();
                    $datepicker.updateRangeDate(elID, date);

                    var mod = window[syn.$w.pageScript];
                    var selectFunction = '{0}_onselect'.format(elID);
                    if (mod && mod[selectFunction]) {
                        mod[selectFunction](elID, date);
                    }
                },
                onSelect: function (date) {
                    if (!date) {
                        return;
                    }

                    var elID = this._o.elID;
                    $datepicker.updateRangeDate(elID, date);

                    var mod = window[syn.$w.pageScript];
                    var selectFunction = '{0}_onselect'.format(elID);
                    if (mod && mod[selectFunction]) {
                        mod[selectFunction](elID, date);
                    }
                }
            }, setting);

            var picker = new Pikaday(setting);
            syn.$l.addEvent(syn.$l.get(elID + '_Button'), 'click', function (e) {
                picker[picker.isVisible() ? 'hide' : 'show']();
            });

            $datepicker.dateControls.push({
                id: elID,
                picker: picker,
                setting: $ref.clone(setting)
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = null;
            var dateControl = $datepicker.getControl(elID);

            if (dateControl) {
                result = dateControl.picker._o.field.value;
            }

            return result;
        },

        setValue: function (elID, value, meta) {
            var dateControl = $datepicker.getControl(elID);
            if (dateControl) {
                dateControl.picker._o.field.value = value;
            }
        },

        clear: function (elID, isControlLoad) {
            var dateControl = $datepicker.getControl(elID);
            if (dateControl) {
                dateControl.picker.clear();
            }
        },

        getControl: function (elID) {
            var result = null;
            var length = $datepicker.dateControls.length;
            for (var i = 0; i < length; i++) {
                var item = $datepicker.dateControls[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        updateRangeDate: function (elID, date) {
            var el = syn.$l.get(elID);
            if (el) {
                var control = $datepicker.getControl(elID);
                if (control) {
                    if (control.setting.useRangeSelect === true) {
                        if (control.setting.rangeStartControlID == elID) {
                            var startPicker = control.picker;
                            var endPicker = null;
                            var targetControl = $datepicker.getControl(control.setting.rangeEndControlID);
                            if (targetControl) {
                                endPicker = targetControl.picker;
                            }

                            if (startPicker && endPicker) {
                                $datepicker.updateStartDate(startPicker, endPicker, date);
                            }
                        }
                        else if (control.setting.rangeEndControlID == elID) {
                            var startPicker = null;
                            var endPicker = control.picker;
                            var targetControl = $datepicker.getControl(control.setting.rangeStartControlID);
                            if (targetControl) {
                                startPicker = targetControl.picker;
                            }

                            if (startPicker && endPicker) {
                                $datepicker.updateEndDate(startPicker, endPicker, date);
                            }
                        }
                    }
                }
            }
        },

        updateStartDate: function (startPicker, endPicker, startDate) {
            startPicker.setStartRange(startDate);
            endPicker.setStartRange(startDate);
            endPicker.setMinDate(startDate);
        },

        updateEndDate: function (startPicker, endPicker, endDate) {
            startPicker.setEndRange(endDate);
            startPicker.setMaxDate(endDate);
            endPicker.setEndRange(endDate);
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$datepicker = $datepicker;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $multiselect = syn.uicontrols.$multiselect || new syn.module();

    $multiselect.extend({
        name: 'syn.uicontrols.$multiselect',
        version: '1.0',
        selectControls: [],
        defaultSetting: {
            elID: '',
            required: false,
            animate: false,
            local: true,
            search: false,
            multiSelectAll: true,
            width: '100%',
            classNames: null,
            dataSourceID: null,
            storeSourceID: null,
            parameters: null, // @ParameterValue:HELLO WORLD;
            selectedValue: null,
            toQafControl: false,
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
            setting = syn.$w.argumentsExtend($multiselect.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            setting.elID = elID;
            setting.storeSourceID = setting.storeSourceID || setting.dataSourceID;

            var el = syn.$l.get(elID);
            el.setAttribute('syn-options', JSON.stringify(setting));
            $multiselect.addControlSetting(el, setting);

            if (setting.storeSourceID) {
                syn.$w.addReadyCount();
                var dataSource = null;
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID] && setting.local == true) {
                    dataSource = mod.config.dataSource[setting.storeSourceID];
                }

                if (dataSource) {
                    $multiselect.loadData(setting.elID, dataSource, setting.required);
                    if (setting.selectedValue) {
                        $multiselect.setValue(setting.elID, setting.selectedValue);
                    }
                    syn.$w.removeReadyCount();
                } else {
                    if (setting.local == true) {
                        syn.$w.loadJson(syn.Config.SharedAssetUrl + 'code/{0}.json'.format(setting.dataSourceID), setting, function (setting, json) {
                            if (json) {
                                mod.config.dataSource[setting.storeSourceID] = json;
                                $multiselect.loadData(setting.elID, json, setting.required);
                                if (setting.selectedValue) {
                                    $multiselect.setValue(setting.elID, setting.selectedValue);
                                }
                            }
                            syn.$w.removeReadyCount();
                        }, false);
                    } else {
                        syn.$w.getDataSource(setting.dataSourceID, setting.parameters, function (json) {
                            if (json) {
                                mod.config.dataSource[setting.storeSourceID] = json;
                                $multiselect.loadData(setting.elID, json, setting.required);
                                if (setting.selectedValue) {
                                    $multiselect.setValue(setting.elID, setting.selectedValue);
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
            setting = syn.$w.argumentsExtend($multiselect.defaultSetting, setting);
            setting.elID = elID;
            setting.storeSourceID = setting.storeSourceID || setting.dataSourceID;

            var el = syn.$l.get(elID);
            el.setAttribute('syn-options', JSON.stringify(setting));

            if (setting.dataSourceID) {
                var mod = window[syn.$w.pageScript];
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID]) {
                    delete mod.config.dataSource[setting.storeSourceID];
                }

                if (mod && mod['controlInit']) {
                    var moduleSettings = mod['controlInit'](elID, setting);
                    setting = syn.$w.argumentsExtend(setting, moduleSettings);
                }

                var dataSource = null;
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID]) {
                    dataSource = mod.config.dataSource[setting.storeSourceID];
                }

                if (dataSource) {
                    $multiselect.loadData(setting.elID, dataSource, setting.required);
                    if (setting.selectedValue) {
                        $multiselect.setValue(setting.elID, setting.selectedValue);
                    }

                    if (callback) {
                        callback();
                    }
                } else {
                    if (setting.local == true) {
                        syn.$w.loadJson(syn.Config.SharedAssetUrl + 'code/{0}.json'.format(setting.dataSourceID), setting, function (setting, json) {
                            mod.config.dataSource[setting.storeSourceID] = json;
                            $multiselect.loadData(setting.elID, json, setting.required);
                            if (setting.selectedValue) {
                                $multiselect.setValue(setting.elID, setting.selectedValue);
                            }

                            if (callback) {
                                callback();
                            }
                        }, false);
                    } else {
                        syn.$w.getDataSource(setting.dataSourceID, setting.parameters, function (json) {
                            mod.config.dataSource[setting.storeSourceID] = json;
                            $multiselect.loadData(setting.elID, json, setting.required);
                            if (setting.selectedValue) {
                                $multiselect.setValue(setting.elID, setting.selectedValue);
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
                    var picker = $multiselect.getControl(this.e.id).picker;
                    if ($string.toBoolean(picker.selectedDisabled) == true) {
                        picker.selectValues = picker.value();
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
                    var picker = $multiselect.getControl(this.e.id).picker;
                    if ($string.toBoolean(picker.selectedDisabled) == true) {
                        $multiselect.setValue(this.e.id, picker.selectValues);
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

            $multiselect.selectControls.push({
                id: el.id,
                picker: picker,
                setting: $ref.clone(setting)
            });
        },

        getValue: function (elID, meta) {
            var result = [];
            var el = syn.$l.get(elID);
            if (el) {
                var length = el.options.length;
                for (var i = 0; i < length; i++) {
                    var item = el.options[i];
                    if (item.selected == true) {
                        result.push(item.value);
                    }
                }
            }

            return result.join(',');
        },

        setValue: function (elID, value, selected) {
            var el = syn.$l.get(elID);
            if (el) {
                if ($ref.isBoolean(selected) == false) {
                    selected = true;
                }

                var length = el.options.length;
                for (var i = 0; i < length; i++) {
                    el.options[i].selected == false;
                }

                if ($object.isNullOrUndefined(value) == false) {
                    if ($ref.isArray(value) == false) {
                        value = value.split(',');
                    }

                    var valueLength = value.length;
                    for (var i = 0; i < valueLength; i++) {
                        var valueItem = value[i];
                        for (var j = 0; j < length; j++) {
                            var item = el.options[j];
                            if (item.value == valueItem) {
                                item.selected = selected;
                                break;
                            }
                        }
                    }
                }

                $multiselect.controlReload(elID);
            }
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);
            if (el) {
                var length = el.options.length;
                for (var i = 0; i < length; i++) {
                    var item = el.options[i];
                    item.selected = false;
                }

                $multiselect.controlReload(elID);
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

            $multiselect.setSelectedDisabled(elID, false);
            $multiselect.controlReload(elID);
        },

        controlReload: function (elID) {
            var el = syn.$l.get(elID);
            if (el) {
                var control = $multiselect.getControl(elID);
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
                el.options.selectedIndex = index;
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

        setSelectedValue: function (elID, value) {
            var el = syn.$l.get(elID);
            if (el) {
                var length = el.options.length;
                for (var i = 0; i < length; i++) {
                    var item = el.options[i];

                    if ($ref.isString(value) == true) {
                        if (item.value == value) {
                            item.selected = true;
                        }
                    }
                    else if ($ref.isArray(value) == true) {
                        if (value.indexOf(item.value) > -1) {
                            item.selected = true;
                        }
                    }
                }
                $multiselect.controlReload(elID);
            }
        },

        setSelectedText: function (elID, text) {
            var el = syn.$l.get(elID);
            if (el) {
                var length = el.options.length;
                for (var i = 0; i < length; i++) {
                    var item = el.options[i];

                    if ($ref.isString(text) == true) {
                        if (item.text == text) {
                            item.selected = true;
                        }
                    }
                    else if ($ref.isArray(text) == true) {
                        if (text.indexOf(item.text) > -1) {
                            item.selected = true;
                        }
                    }
                }
                $multiselect.controlReload(elID);
            }
        },

        disabled: function (elID, value) {
            if ($object.isNullOrUndefined(value) == true) {
                value = false;
            }

            value = $string.toBoolean(value);

            $this.$multiselect.getControl(elID).picker.config('disabled', value);
        },

        setSelectedDisabled: function (elID, value) {
            var el = syn.$l.get(elID);
            if (el) {
                var selectdValue = $multiselect.getValue(elID).split(',');
                var length = el.options.length;

                var selectedDisabled = $string.toBoolean(value);
                if (selectedDisabled == true) {
                    for (var i = 0; i < length; i++) {
                        var item = el.options[i];
                        if (selectdValue.indexOf(item.value) > -1) {
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

                $multiselect.controlReload(elID);

                var picker = $multiselect.getControl(elID).picker;
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
            var length = $multiselect.selectControls.length;
            for (var i = 0; i < length; i++) {
                var item = $multiselect.selectControls[i];

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
    syn.uicontrols.$multiselect = $multiselect;
})(window);
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
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
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
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID]) {
                    delete mod.config.dataSource[setting.storeSourceID];
                }

                if (mod && mod['controlInit']) {
                    var moduleSettings = mod['controlInit'](elID, setting);
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
/// <reference path="/Scripts/syn.js" />
/// <reference path="/Scripts/syn.domain.js" />

(function (window) {
    'use strict';
    window.fileUploadOptions = null;

    /// <summary>
    /// FileUpload $fileclient 컨트롤 모듈입니다.
    /// </summary>
    var $fileclient = $fileclient || new syn.module();

    $fileclient.extend({
        name: 'syn.uicontrols.$fileclient',
        version: '1.0',

        fileManagers: [],
        fileControls: [],
        businessID: '',

        mimeType: {
            'html': 'text/html'
            , 'htm': 'text/html'
            , 'css': 'text/css'
            , 'xml': 'text/xml'
            , 'txt': 'text/plain'
            , 'gif': 'image/gif'
            , 'jpeg': 'image/jpeg'
            , 'jpg': 'image/jpeg'
            , 'png': 'image/png'
            , 'tif': 'image/tiff'
            , 'ico': 'image/x-icon'
            , 'bmp': 'image/x-ms-bmp'
            , 'svg': 'image/svg+xml'
            , 'webp': 'image/webp'
            , 'js': 'application/x-javascript'
            , 'pdf': 'application/pdf'
            , 'rtf': 'application/rtf'
            , 'doc': 'application/msword'
            , 'docx': 'application/msword'
            , 'xls': 'application/vnd.ms-excel'
            , 'xlsx': 'application/vnd.ms-excel'
            , 'ppt': 'application/vnd.ms-powerpoint'
            , 'pptx': 'application/vnd.ms-powerpoint'
            , '7z': 'application/x-7z-compressed'
            , 'zip': 'application/zip'
            , 'bin': 'application/octet-stream'
            , 'exe': 'application/octet-stream'
            , 'dll': 'application/octet-stream'
            , 'iso': 'application/octet-stream'
            , 'msi': 'application/octet-stream'
            , 'mp3': 'audio/mpeg'
            , 'ogg': 'audio/ogg'
            , 'mp4': 'video/mp4'
        },

        isFileAPIBrowser: false,

        defaultSetting: {
            elementID: null,
            dialogTitle: '파일 업로드',
            tokenID: '',
            repositoryID: '',
            dependencyID: '',
            businessID: '',
            isQafRepositoryID: true, // syn.config.js의 ApplicationID 3 자리 + ProjectID 3 자리 + FileServerType 1자리로 7자리를 구성
            fileUpdateCallback: null,
            accept: '*/*', // .gif, .jpg, .png, .doc, audio/*,video/*,image/*
            uploadUrl: '',
            fileChangeHandler: undefined,
            custom1: undefined,
            custom2: undefined,
            custom3: undefined,
            minHeight: 360,
            fileManagerServer: '',
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
            var el = syn.$l.get(elID);
            setting = syn.$w.argumentsExtend($fileclient.defaultSetting, setting);
            setting.elementID = elID;

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            setting.uploadType = null;
            setting.uploadUrl = null;

            if (syn.Config && syn.Config.FileManagerServer) {
                setting.fileManagerServer = syn.Config.FileManagerServer;
            }

            if ($string.isNullOrEmpty(setting.fileManagerServer) == true) {
                syn.$l.eventLog('$fileclient.controlLoad', '파일 컨트롤 초기화 오류, 파일 서버 정보 확인 필요', 'Warning');
                return;
            }

            if (syn.Config.FileBusinessIDSource && syn.Config.FileBusinessIDSource != 'None') {
                if (syn.Config.FileBusinessIDSource == 'Cookie') {
                    $fileclient.businessID = syn.$r.getCookie('FileBusinessID');
                }
                else if (syn.Config.FileBusinessIDSource == 'SessionStorage') {
                    $fileclient.businessID = syn.$w.getStorage('FileBusinessID');
                }
            }

            if ($string.isNullOrEmpty($fileclient.businessID) == true) {
                $fileclient.businessID = syn.$w.SSO.WorkCompanyNo;
            }

            if ($string.isNullOrEmpty($fileclient.businessID) == true) {
                syn.$l.eventLog('$fileclient.controlLoad', '파일 컨트롤 초기화 오류, 파일 업무 ID 정보 확인 필요', 'Warning');
                return;
            }

            if (setting.isQafRepositoryID == true) {
                if (setting.repositoryID && setting.repositoryID.length > 7) {
                    setting.repositoryID = syn.Config.ApplicationID + syn.Config.ProjectID + syn.Config.FileServerType + setting.repositoryID.substring(7);
                }
            }

            syn.$w.loadJson(setting.fileManagerServer + '/api/filemanager/GetRepository?repositoryID={0}'.format(setting.repositoryID), setting, function (setting, repositoryData) {
                setting.dialogTitle = repositoryData.RepositoryName;
                setting.storageType = repositoryData.StorageType;
                setting.isMultiUpload = repositoryData.IsMultiUpload;
                setting.isAutoPath = repositoryData.IsAutoPath;
                setting.policyPathID = repositoryData.PolicyPathID;
                setting.uploadType = repositoryData.UploadType;
                setting.uploadExtensions = repositoryData.UploadExtensions;
                setting.accept = repositoryData.UploadExtensions;
                setting.uploadCount = repositoryData.UploadCount;
                setting.uploadSizeLimit = repositoryData.UploadSizeLimit;

                if (setting.uploadType == 'Single') {
                    setting.uploadUrl = syn.Config.SharedAssetUrl + 'upload/SingleFile.html';
                }
                else if (setting.uploadType == 'Profile') {
                    setting.uploadUrl = syn.Config.SharedAssetUrl + 'upload/ProfilePicture.html';
                }
                else if (setting.uploadType == 'Multi') {
                    setting.uploadUrl = syn.Config.SharedAssetUrl + 'upload/MultiFiles.html';
                }
                else if (setting.uploadType == 'ImageLink') {
                    setting.uploadUrl = syn.Config.SharedAssetUrl + 'upload/ImageLinkFiles.html';
                }

                setting.elID = elID;
                el.setAttribute('id', el.id + '_hidden');
                el.setAttribute('syn-options', JSON.stringify(setting));
                el.style.display = 'none';

                var dataFieldID = el.getAttribute('syn-datafield');
                var events = el.getAttribute('syn-events');
                var value = el.value ? el.value : '';
                var name = el.name ? el.name : '';
                var html = '';
                if (events) {
                    html = '<input type="hidden" id="{0}" name="{1}" syn-datafield="{2}" value="{3}" syn-events={4}>'.format(elID, name, dataFieldID, value, '[\'' + eval(events).join('\',\'') + '\']');
                }
                else {
                    html = '<input type="hidden" id="{0}" name="{1}" syn-datafield="{2}" value="{3}">'.format(elID, name, dataFieldID, value);
                }

                var parent = el.parentNode;
                var wrapper = document.createElement('div');
                wrapper.innerHTML = html;

                parent.appendChild(wrapper);

                syn.$l.get(elID).setAttribute('syn-options', JSON.stringify(setting));

                $fileclient.fileControls.push({
                    id: elID,
                    setting: $ref.clone(setting)
                });
            }, function () {
                if ($string.isNullOrEmpty(setting.uploadUrl) == true) {
                    syn.$w.alert('{0}에 대한 파일 서버 저장 정보 확인 필요'.format(setting.repositoryID));
                }
            }, true, true);

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        moduleInit: function () {
            syn.$l.addEvent(window, 'message', function (e) {
                var repositoryData = e.data;
                if ((syn.Config.FileManagerServer + '/api/filemanager').indexOf(e.origin) > -1 && repositoryData && repositoryData.action == 'UploadFiles') {
                    if (window.$progressBar) {
                        $progressBar.close();
                    }

                    if (repositoryData.callback) {
                        var mod = window[syn.$w.pageScript];
                        if (mod) {
                            var clientCallback = null;
                            clientCallback = mod[repositoryData.callback];
                            if ($object.isNullOrUndefined(clientCallback) == true) {
                                try {
                                    clientCallback = eval('$this.' + repositoryData.callback);
                                } catch (error) {
                                    syn.$l.eventLog('clientCallback', error, 'Warning');
                                }
                            }

                            if (clientCallback) {
                                var result = {
                                    elID: repositoryData.elementID,
                                    repositoryID: repositoryData.repositoryID,
                                    items: repositoryData.repositoryItems
                                };

                                var items = [];
                                for (var i = 0; i < repositoryData.repositoryItems.length; i++) {
                                    var item = repositoryData.repositoryItems[i];
                                    items.push(item.ItemID);
                                }

                                if (repositoryData.elementID) {
                                    syn.$l.get(repositoryData.elementID).value = items.join(',');
                                }

                                clientCallback('upload', result);
                            }
                        }
                    }
                }

                $.modal.close();
            });
        },

        getFileSetting: function (elID) {
            var result = null;

            var length = $fileclient.fileControls.length;
            for (var i = 0; i < length; i++) {
                var item = $fileclient.fileControls[i];
                if (item.id == elID) {
                    result = item.setting;
                    break;
                }
            }

            return result;
        },

        getValue: function (elID, meta) {
            return syn.$l.get(elID).value;
        },

        setValue: function (elID, value, meta) {
            var el = syn.$l.get(elID);
            el.value = value ? value : '';
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);
            el.value = '';
        },

        init: function (elID, fileContainer, repositoryData, fileChangeHandler) {
            var dependencyID = $fileclient.getTemporaryDependencyID(elID);
            $fileclient.fileManagers.push({ 'elID': elID, 'container': fileContainer, 'datas': repositoryData, 'dependencyID': dependencyID, 'filechange': fileChangeHandler });

            if (window.File && window.FileList) {
                $fileclient.isFileAPIBrowser = true;
            }

            if (fileContainer != null) {
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
            }
        },

        getRepositoryUrl: function (repositoryID) {
            var val = null;
            var container = null;
            for (var i = 0; i < $fileclient.fileManagers.length; i++) {
                container = $fileclient.fileManagers[i];

                if (container.datas && container.datas.repositoryID == repositoryID) {
                    val = container.datas.fileManagerServer + '/api/filemanager';
                    break;
                }
            }

            return val;
        },

        getFileManager: function (elID) {
            var val = null;
            var container = null;
            for (var i = 0; i < $fileclient.fileManagers.length; i++) {
                container = $fileclient.fileManagers[i];

                if (container.elID == elID) {
                    val = container;
                    break;
                }
            }

            return val;
        },

        getFileMaxIndex: function (elID) {
            var val = 1;
            var indexs = [];
            var files = syn.$l.querySelectorAll('[id*="' + elID + '_filesName"]');
            for (var i = 1; i <= files.length; i++) {
                indexs.push(i);
            }

            val = indexs[indexs.length - 1];

            if (val == undefined) {
                val = 0;
            }

            val++;

            return val;
        },

        addFileUI: function (elID, accept) {
            var manager = $fileclient.getFileManager(elID);

            if (manager) {
                var container = manager.container;
                var li = document.createElement('li');
                var fileSpan = document.createElement('span');
                var file = document.createElement('input');
                var remove = document.createElement('span');

                fileSpan.appendChild(file);
                li.appendChild(fileSpan);
                li.appendChild(remove);
                container.appendChild(li);

                var index = $fileclient.getFileMaxIndex(elID).toString();

                file.id = elID + '_filesName_' + index;
                file.name = 'files';
                file.type = 'file';
                file.multiple = false;

                if (accept) {
                    file.accept = accept;
                }

                syn.$m.addClass(file, 'ui_textbox');
                syn.$m.addClass(file, 'file');

                syn.$m.addClass(remove, 'btn');

                syn.$l.addEvent(file, 'change', function (e) {
                    var fileElem = e.target;
                    var fileItem = null;
                    var fileIndex = null;
                    var idx = fileElem.id.split('_');
                    var manager = $fileclient.getFileManager(idx[0]);

                    if (manager && manager.filechange) {
                        fileIndex = idx[idx.length - 1];

                        if ($fileclient.isFileAPIBrowser == true) {
                            var fileObject = fileElem.files[0];
                            fileItem = {
                                name: fileObject.name,
                                size: fileObject.size,
                                type: fileObject.type,
                                index: fileIndex
                            };
                        }
                        else {
                            var image = new Image();
                            image.src = fileElem.value;
                            fileItem = {
                                name: image.nameProp,
                                size: undefined,
                                type: $fileclient.getFileMimeType(image.nameProp),
                                index: fileIndex
                            };
                        }

                        manager.filechange(fileElem, fileItem);
                    }
                });

                remove.id = elID + '_filesRemove_' + index;
                remove.name = elID + '_filesRemove_' + index;
                remove.type = 'button';
                remove.index = index;
                remove.value = '삭제';
                syn.$l.addEvent(remove, 'click', function (evt) {
                    var el = evt.srcElement || evt.target;
                    var elFile = syn.$l.get(el.id.replace('_filesRemove_', '_filesName_'))
                    elFile.value = '';
                });
            }
            else {
                syn.$w.alert(elID + ' 파일 관리자가 지정되지 않았습니다.');
            }
        },

        getFileMimeType: function (fileName) {
            var result = 'application/octet-stream';
            var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (ext) {
                if ($resource && $resource.mimeType) {
                    if ($resource.mimeType.hasOwnProperty(ext) == true) {
                        result = $resource.mimeType[ext];
                    }
                }
                else {
                    if ($fileclient.mimeType.hasOwnProperty(ext) == true) {
                        result = $fileclient.mimeType[ext];
                    }
                }
            }

            return result;
        },

        prependChild: function (elID, nextSibling) {
            var manager = $fileclient.getFileManager(elID);
            var container = manager.container;
            var childNodes = container.childNodes;
            var lastIndex = childNodes.length - 1;

            if (nextSibling) {
                container.insertBefore(childNodes[lastIndex], nextSibling);
            }
        },

        getRepositoryID: function (elID) {
            var val = '';
            var manager = $fileclient.getFileManager(elID);
            if (manager) {
                val = manager.datas.repositoryID;
            }

            return val;
        },

        getDependencyID: function (elID) {
            var val = '';
            var manager = $fileclient.getFileManager(elID);
            if (manager) {
                val = manager.dependencyID;
            }

            return val;
        },

        setDependencyID: function (elID, dependencyID) {
            var manager = $fileclient.getFileManager(elID);
            if (manager) {
                manager.dependencyID = dependencyID;
            }
        },

        doUpload: function (elID, fileUploadOptions) {
            var manager = $fileclient.getFileManager(elID);
            var uploadItem = null;

            if (manager) {
                var isContinue = false;
                if (manager.datas.uploadExtensions.indexOf('*/*') == -1) {
                    var allowExtensions = manager.datas.uploadExtensions.split(';');
                    var uploadItems = syn.$l.querySelectorAll("[id*='_filesName_']");
                    for (var i = 0; i < manager.datas.uploadCount; i++) {
                        uploadItem = uploadItems[i];
                        if (uploadItem == undefined) {
                            break;
                        }

                        for (var j = 0; j < allowExtensions.length; j++) {
                            if (uploadItem.value == '') {
                                isContinue = true;
                                break;
                            }
                            else if (uploadItem.value.substring(uploadItem.value.lastIndexOf('.') + 1, uploadItem.value.length).toLowerCase() === allowExtensions[j].toLowerCase()) {
                                isContinue = true;
                                break;
                            }
                        }

                        if (isContinue == false) {
                            break;
                        }
                    }
                }
                else {
                    var uploadItems = syn.$l.querySelectorAll("[id*='_filesName_']");
                    if (uploadItems.length > 0) {
                        for (var i = 0; i < uploadItems.length; i++) {
                            uploadItem = uploadItems[i];
                            if ($string.isNullOrEmpty(uploadItem.value) == false) {
                                isContinue = true;
                            }
                        }

                        if (isContinue == false) {
                            syn.$w.alert('업로드할 파일을 선택해야합니다');
                            return;
                        }
                    }
                }

                if (isContinue == true && document.forms.length > 0) {
                    if (syn.$l.get('syn-repository') != null) {
                        syn.$r.params = [];
                        var repositoryID = $fileclient.getRepositoryID(elID);

                        syn.$r.path = $fileclient.getRepositoryUrl(repositoryID) + '/UploadFiles';
                        syn.$r.params['elementID'] = fileUploadOptions.elementID;
                        syn.$r.params['repositoryID'] = repositoryID;
                        syn.$r.params['dependencyID'] = $fileclient.getDependencyID(elID);
                        syn.$r.params['custompath1'] = fileUploadOptions.custom1;
                        syn.$r.params['custompath2'] = fileUploadOptions.custom2;
                        syn.$r.params['custompath3'] = fileUploadOptions.custom3;

                        if ($string.isNullOrEmpty(fileUploadOptions.profileFileName) == false) {
                            syn.$r.params['fileName'] = fileUploadOptions.profileFileName;
                        }

                        if (manager.datas.fileUpdateCallback) {
                            syn.$r.params['callback'] = manager.datas.fileUpdateCallback;
                        }

                        if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                            syn.$r.params['businessID'] = $fileclient.businessID;
                        }

                        var form = document.forms[0];
                        form.action = syn.$r.url();
                        form.submit();

                        if (window.$progressBar) {
                            $progressBar.show('파일 업로드 중입니다...');
                        }
                    }
                    else {
                        syn.$w.alert('doUpload 메서드를 지원하지 않는 화면입니다.');
                    }
                }
                else {
                    if ($object.isNullOrUndefined(uploadItem) == true) {
                        syn.$w.alert('이전에 업로드 한 파일을 삭제해야합니다');
                    }
                    else {
                        syn.$w.alert(manager.datas.uploadExtensions + '확장자를 가진 파일을 업로드 해야합니다');
                    }
                }
            }
            else {
                syn.$w.alert(elID + ' 파일 관리자가 지정되지 않았습니다.');
            }
        },

        getUploadUrl: function (repositoryID, dependencyID, isSingleUpload, fileName) {
            if ($object.isNullOrUndefined(isSingleUpload) == true) {
                isSingleUpload = true;
            }

            syn.$r.path = syn.Config.FileManagerServer + '/api/filemanager/' + (isSingleUpload == true ? 'UploadFile' : 'UploadFiles');
            syn.$r.params['repositoryID'] = repositoryID;
            syn.$r.params['dependencyID'] = dependencyID;
            syn.$r.params['responseType'] = 'json';

            if (isSingleUpload == true && $string.isNullOrEmpty(fileName) == false) {
                syn.$r.params['fileName'] = fileName;
            }

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            return syn.$r.url();
        },

        getFileAction: function (options, callback) {
            if ($object.isNullOrUndefined(options.action) == true) {
                syn.$l.eventLog('getFileAction', '필수 입력 정보 확인 필요', 'Warning');
                return;
            }

            syn.$r.path = syn.Config.FileManagerServer + '/api/filemanager/ActionHandler';
            var action = options.action;
            syn.$r.params['action'] = action;
            switch (action) {
                case 'GetItem':
                    syn.$r.params['repositoryID'] = options.repositoryID;
                    syn.$r.params['itemID'] = options.itemID;
                    break;
                case 'GetItems':
                    syn.$r.params['repositoryID'] = options.repositoryID;
                    syn.$r.params['dependencyID'] = options.dependencyID;
                    break;
                case 'UpdateDependencyID':
                    syn.$r.params['repositoryID'] = options.repositoryID;
                    syn.$r.params['sourceDependencyID'] = options.sourceDependencyID;
                    syn.$r.params['targetDependencyID'] = options.targetDependencyID;
                    break;
                case 'UpdateFileName':
                    syn.$r.params['repositoryID'] = options.repositoryID;
                    syn.$r.params['itemID'] = options.itemID;
                    syn.$r.params['fileName'] = options.fileName;
                    break;
                case 'DeleteItem':
                    syn.$r.path = syn.Config.FileManagerServer + '/api/filemanager/RemoveItem';
                    syn.$r.params['repositoryID'] = options.repositoryID;
                    syn.$r.params['itemID'] = options.itemID;
                    break;
                case 'DeleteItems':
                    syn.$r.path = syn.Config.FileManagerServer + '/api/filemanager/RemoveItems';
                    syn.$r.params['repositoryID'] = options.repositoryID;
                    syn.$r.params['dependencyID'] = options.dependencyID;
                    break;
                default:
                    syn.$l.eventLog('getFileAction', 'action 확인 필요', 'Warning');
                    return;
                    break;
            }

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            $fileclient.executeProxy(syn.$r.url(), callback);
        },

        getItem: function (elID, itemID, callback) {
            var setting = $fileclient.getFileSetting(elID);
            if (setting == null) {
                var fileManager = $fileclient.getFileManager(elID);
                if (fileManager) {
                    setting = fileManager.datas;
                }
            }

            if (setting) {
                syn.$r.path = setting.fileManagerServer + '/api/filemanager/ActionHandler';
                syn.$r.params['action'] = 'GetItem';
                syn.$r.params['repositoryID'] = setting.repositoryID;
                syn.$r.params['itemID'] = itemID;
            }
            else {
                var repositoryID = $fileclient.getRepositoryID(elID);
                syn.$r.path = $fileclient.getRepositoryUrl(repositoryID) + '/ActionHandler';
                syn.$r.params['action'] = 'GetItem';
                syn.$r.params['repositoryID'] = repositoryID;
                syn.$r.params['itemID'] = itemID;
            }

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            $fileclient.executeProxy(syn.$r.url(), callback);
        },

        getItems: function (elID, dependencyID, callback) {
            var setting = $fileclient.getFileSetting(elID);
            if (setting == null) {
                var fileManager = $fileclient.getFileManager(elID);
                if (fileManager) {
                    setting = fileManager.datas;
                }
            }

            if (setting) {
                syn.$r.path = setting.fileManagerServer + '/api/filemanager/ActionHandler';
                syn.$r.params['action'] = 'GetItems';
                syn.$r.params['repositoryID'] = setting.repositoryID;
                syn.$r.params['dependencyID'] = dependencyID;
            }
            else {
                var repositoryID = $fileclient.getRepositoryID(elID);
                syn.$r.path = $fileclient.getRepositoryUrl(repositoryID) + '/ActionHandler';
                syn.$r.params['action'] = 'GetItems';
                syn.$r.params['repositoryID'] = repositoryID;
                syn.$r.params['dependencyID'] = dependencyID;
            }

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            $fileclient.executeProxy(syn.$r.url(), callback);
        },

        updateDependencyID: function (elID, sourceDependencyID, targetDependencyID, callback) {
            var setting = $fileclient.getFileSetting(elID);
            syn.$r.path = setting.fileManagerServer + '/api/filemanager/ActionHandler';
            syn.$r.params['action'] = 'UpdateDependencyID';
            syn.$r.params['repositoryID'] = setting.repositoryID;
            syn.$r.params['sourceDependencyID'] = sourceDependencyID;
            syn.$r.params['targetDependencyID'] = targetDependencyID;

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            $fileclient.executeProxy(syn.$r.url(), callback);
        },

        updateFileName: function (elID, itemID, fileName, callback) {
            var setting = $fileclient.getFileSetting(elID);
            syn.$r.path = setting.fileManagerServer + '/api/filemanager/ActionHandler';
            syn.$r.params['action'] = 'UpdateFileName';
            syn.$r.params['repositoryID'] = setting.repositoryID;
            syn.$r.params['itemID'] = itemID;
            syn.$r.params['fileName'] = fileName;

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            $fileclient.executeProxy(syn.$r.url(), callback);
        },

        /*
    직접 파일 업로드 구현 필요
    btnReviewImageUpload_click: async function () {
        if ($this.inValidFileNames.length > 0) {
            syn.$w.alert($this.inValidFileNames.join(', ') + ' 파일은 업로드 할 수 없는 파일 형식입니다')
            return;
        }

        syn.$l.get('btnReviewImageUpload').value = '업로드 중...';
        $this.$fileclient.fileUpload('fleReviewImageUpload', '06', '6', function (upload) {
            syn.$l.get('btnReviewImageUpload').value = '전송';

            if (upload.status == 200) {
                var uploadResult = null;
                try {
                    uploadResult = JSON.parse(upload.response);

                    if (uploadResult.Result == true) {
                        $this.remainingCount = uploadResult.RemainingCount;
                        var uploadFiles = uploadResult.FileUploadResults;
                    }
                    else {
                        syn.$w.alert('첨부파일을 업로드 하지 못했습니다');
                    }
                } catch {
                    syn.$w.alert('첨부파일을 업로드 하지 못했습니다');
                }
            }
        });
    },

    fleReviewImageUpload_change: function (evt) {
        var el = evt.target || evt.srcElement;
        if (el.files.length > $this.remainingCount) {
            syn.$l.get('fleReviewImageUpload').value = '';
            syn.$w.alert('{0} 파일 갯수 이상 업로드 할 수 없습니다'.format($this.uploadOptions.uploadCount));
        }

        $this.inValidFileNames = [];
        var acceptTypes = $this.uploadOptions.accept.split(';');

        for (var i = (el.files.length - 1); i >= 0; i--) {
            var file = el.files[i];
            var fileExtension = file.name.split('.')[1];
            if (acceptTypes.indexOf(fileExtension) == -1) {
                $this.inValidFileNames.push(file.name);
            }
        }

        if ($this.inValidFileNames.length > 0) {
            syn.$w.alert($this.inValidFileNames.join(', ') + ' 파일은 업로드 할 수 없는 파일 형식입니다')
        }
    },
         */
        fileUpload: function (el, repositoryID, dependencyID, callback, uploadUrl) {
            var result = null;
            var url = '';
            if ($object.isNullOrUndefined(uploadUrl) == true) {
                url = syn.Config.FileManagerServer + '/api/filemanager/UploadFiles?repositoryID={0}&dependencyID={1}&responseType=json&callback=none'.format(repositoryID, dependencyID);
            }
            else {
                url = uploadUrl;
            }

            if ($string.isNullOrEmpty($this.$fileclient.businessID) == false) {
                url = url + '&businessID=' + $this.$fileclient.businessID;
            }

            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el && el.type.toUpperCase() == 'FILE') {
                var formData = new FormData();
                for (var i = 0; i < el.files.length; i++) {
                    formData.append('files', el.files[i]);
                }

                var xhr = new syn.$w.xmlHttp();
                xhr.open('POST', url, true);
                xhr.onload = () => {
                    if (callback) {
                        callback({
                            status: xhr.status,
                            response: xhr.responseText
                        });
                    }
                };
                xhr.onerror = () => {
                    if (callback) {
                        callback({
                            status: xhr.status,
                            response: xhr.responseText
                        });
                    }
                };

                xhr.send(formData);
            }
        },

        fileDownload: function (options) {
            var downloadRequest = null;
            if ($ref.isString(options) == true) {
                var elID = options;
                var setting = $fileclient.getFileSetting(elID);
                var itemID = syn.$l.get(elID) ? syn.$l.get(elID).value : null;

                if (setting && itemID) {
                    downloadRequest = JSON.stringify({
                        RepositoryID: setting.repositoryID,
                        ItemID: itemID,
                        FileMD5: '',
                        TokenID: setting.tokenID,
                        BusinessID: $fileclient.businessID
                    });
                }
                else {
                    syn.$l.eventLog('fileDownload', '"{0}"에 대한 요청 정보 확인 필요'.format(elID), 'Debug');
                    return;
                }
            }
            else {
                if (options.repositoryID && options.itemID) {
                    downloadRequest = JSON.stringify({
                        RepositoryID: options.repositoryID,
                        ItemID: options.itemID,
                        FileMD5: options.fileMD5,
                        TokenID: options.tokenID,
                        BusinessID: $fileclient.businessID
                    });
                }
                else {
                    syn.$l.eventLog('fileDownload', '"{0}"에 대한 요청 정보 확인 필요'.format(elID), 'Debug');
                    return;
                }
            }

            syn.$r.path = (options.fileManagerServer || syn.Config.FileManagerServer) + '/api/filemanager/DownloadFile';

            var http = syn.$w.xmlHttp();
            http.open('POST', syn.$r.url(), true);
            http.setRequestHeader('Content-type', 'qrame/json-message');
            http.responseType = 'blob';
            http.onload = function (e) {
                if (http.status == 200) {
                    if (http.getResponseHeader('Qrame_ModelType') == 'DownloadResult') {
                        var qrameResult = syn.$c.base64Decode(http.getResponseHeader('Qrame_Result'));
                        var downloadResult = JSON.parse(qrameResult);
                        if (downloadResult.Result == true) {
                            syn.$r.blobToDownload(http.response, downloadResult.FileName);
                        }
                        else {
                            syn.$l.eventLog('fileDownload', '파일 다운로드 실패: "{0}"'.format(downloadResult.Message), 'Debug');
                        }
                    }
                    else {
                        syn.$l.eventLog('fileDownload', 'itemID: "{0}" 파일 다운로드 응답 오류'.format(JSON.stringify(options)), 'Debug');
                    }
                }
                else {
                    syn.$l.eventLog('fileDownload', '파일 다운로드 오류, status: "{0}"'.format(http.statusText), 'Debug');
                }
            }

            http.send(downloadRequest);
        },

        httpDownloadFile: function (repositoryID, itemID, fileMD5, tokenID) {
            if (document.forms.length > 0 && syn.$l.get('repositoryDownload') == null) {
                var form = document.forms[0];
                var repositoryDownload = syn.$m.append(form, 'iframe', 'repositoryDownload', { display: 'none' });
                repositoryDownload.name = 'repositoryDownload';
                repositoryDownload.width = '100%';
            }

            syn.$r.path = syn.Config.FileManagerServer + '/api/filemanager/HttpDownloadFile';
            syn.$r.params['repositoryID'] = repositoryID;
            syn.$r.params['itemID'] = itemID;
            syn.$r.params['fileMD5'] = fileMD5;
            syn.$r.params['tokenID'] = tokenID;

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            syn.$l.get('repositoryDownload').src = syn.$r.url();
        },

        virtualDownloadFile: function (repositoryID, fileName, subDirectory) {
            if (document.forms.length > 0 && syn.$l.get('repositoryDownload') == null) {
                var form = document.forms[0];
                var repositoryDownload = syn.$m.append(form, 'iframe', 'repositoryDownload', { display: 'none' });
                repositoryDownload.name = 'repositoryDownload';
            }

            syn.$r.path = syn.Config.FileManagerServer + '/api/filemanager/VirtualDownloadFile';
            syn.$r.params['repositoryID'] = repositoryID;
            syn.$r.params['fileName'] = fileName;
            syn.$r.params['subDirectory'] = subDirectory;

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            syn.$l.get('repositoryDownload').src = syn.$r.url();
        },

        virtualDeleteFile: function (repositoryID, fileName, subDirectory) {
            syn.$r.path = syn.Config.FileManagerServer + '/api/filemanager/virtualDeleteFile';
            syn.$r.params['repositoryID'] = repositoryID;
            syn.$r.params['fileName'] = fileName;
            syn.$r.params['subDirectory'] = subDirectory;

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            $fileclient.executeProxy(syn.$r.url(), function (response) {
                if (response.Result == false) {
                    syn.$l.eventLog('virtualDeleteFile', response.Message);
                }
            });
        },

        deleteItem: function (elID, itemID, callback) {
            var setting = $fileclient.getFileSetting(elID);
            if (setting == null) {
                var fileManager = $fileclient.getFileManager(elID);
                if (fileManager) {
                    setting = fileManager.datas;
                }
            }

            if (setting) {
                syn.$r.path = setting.fileManagerServer + '/api/filemanager/RemoveItem';
                syn.$r.params['repositoryID'] = setting.repositoryID;
                syn.$r.params['itemID'] = itemID;
            }
            else {
                var repositoryID = $fileclient.getRepositoryID(elID);
                syn.$r.path = $fileclient.getRepositoryUrl(repositoryID) + '/RemoveItem';
                syn.$r.params['repositoryID'] = repositoryID;
                syn.$r.params['itemID'] = itemID;
            }

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            $fileclient.executeProxy(syn.$r.url(), function (response) {
                if (setting.uploadType == 'Single' || setting.uploadType == 'Profile') {
                    if (response && response.Result == true) {
                        var el = syn.$l.get(elID);
                        if (el) {
                            el.value = '';
                        }
                    }
                }
                else {
                    if (response && response.Result == true) {
                        var el = syn.$l.get(elID);
                        if (el) {
                            var items = [];
                            var uploadItems = el.value.split(',');
                            for (var i = 0; i < uploadItems.length; i++) {
                                var uploadItem = uploadItems[i];
                                if (uploadItem != itemID) {
                                    items.push(uploadItem);
                                }
                            }

                            el.value = items.join(',');
                        }
                    }
                }

                if (callback) {
                    callback(response);
                }
            });
        },

        deleteItems: function (elID, dependencyID, callback) {
            var setting = $fileclient.getFileSetting(elID);
            if (setting == null) {
                var fileManager = $fileclient.getFileManager(elID);
                if (fileManager) {
                    setting = fileManager.datas;
                }
            }

            if (setting) {
                syn.$r.path = setting.fileManagerServer + '/api/filemanager/RemoveItems';
                syn.$r.params['repositoryID'] = setting.repositoryID;
                syn.$r.params['dependencyID'] = dependencyID;
            }
            else {
                var repositoryID = $fileclient.getRepositoryID(elID);
                syn.$r.path = $fileclient.getRepositoryUrl(repositoryID) + '/RemoveItems';
                syn.$r.params['repositoryID'] = repositoryID;
                syn.$r.params['dependencyID'] = dependencyID;
            }

            if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                syn.$r.params['businessID'] = $fileclient.businessID;
            }

            $fileclient.executeProxy(syn.$r.url(), function (response) {
                if (response && response.Result == true) {
                    var el = syn.$l.get(elID);
                    if (el) {
                        el.value = '';
                    }
                }

                if (callback) {
                    callback(response);
                }
            });
        },

        uploadBlob: function (options, callback) {
            options = syn.$w.argumentsExtend({
                repositoryID: null,
                dependencyID: null,
                blobInfo: null,
                mimeType: 'application/octet-stream',
                fileName: null
            }, options);

            if ($string.isNullOrEmpty(options.repositoryID) == false && $string.isNullOrEmpty(options.dependencyID) == false && options.blobInfo) {
                syn.$r.path = syn.Config.FileManagerServer + '/api/filemanager/UploadFile';
                syn.$r.params['repositoryID'] = options.repositoryID;
                syn.$r.params['dependencyID'] = options.dependencyID;

                if ($string.isNullOrEmpty($fileclient.businessID) == false) {
                    syn.$r.params['businessID'] = $fileclient.businessID;
                }

                var xhr = syn.$w.xmlHttp();
                xhr.open('POST', syn.$r.url());
                xhr.onload = () => {
                    if (xhr.status != 200) {
                        syn.$l.eventLog('$fileclient.uploadBlob', 'HTTP Error code: {0}, text: {1}'.format(xhr.status, xhr.statusText), 'Warning');
                        return;
                    }

                    try {
                        if (callback) {
                            callback(JSON.parse(xhr.responseText));
                        }
                    } catch (error) {
                        syn.$w.alert('Blob 파일 업로드 오류: {0}'.format(error.message));
                        syn.$l.eventLog('$fileclient.uploadBlob', error, 'Warning');
                    }
                };

                xhr.onerror = () => {
                    syn.$l.eventLog('$fileclient.uploadBlob', 'HTTP Error code: {0}, text: {1}'.format(xhr.status, xhr.statusText), 'Warning');
                };

                var formData = new FormData();
                var fileName = options.fileName || 'blob-' + syn.$l.random(24);
                formData.append('file', options.blobInfo, fileName);
                xhr.send(formData);
            }
            else {
                var message = 'Blob 파일 업로드 필수 항목 확인 필요';
                syn.$w.alert(message);
                syn.$l.eventLog('$fileclient.uploadBlob', message, 'Warning');
            }
        },

        uploadDataUri: function (options, callback) {
            options = syn.$w.argumentsExtend({
                repositoryID: null,
                dependencyID: null,
                dataUri: null,
                mimeType: null,
                fileName: null
            }, options);

            if ($string.isNullOrEmpty(options.repositoryID) == false && $string.isNullOrEmpty(options.dependencyID) == false && $string.isNullOrEmpty(options.dataUri) == false) {
                options.blobInfo = syn.$w.dataUriToBlob(options.dataUri);
                options.mimeType = options.blobInfo.type;
                $fileclient.uploadBlob(options, callback);
            }
            else {
                var message = 'DataUri 파일 업로드 필수 항목 확인 필요';
                syn.$w.alert(message);
                syn.$l.eventLog('$fileclient.uploadDataUri', message, 'Warning');
            }
        },

        uploadBlobUri: function (options, callback) {
            options = syn.$w.argumentsExtend({
                repositoryID: null,
                dependencyID: null,
                blobUri: null,
                mimeType: null,
                fileName: null
            }, options);

            if ($string.isNullOrEmpty(options.repositoryID) == false && $string.isNullOrEmpty(options.dependencyID) == false && $string.isNullOrEmpty(options.blobUri) == false) {
                syn.$r.blobUrlToData(options.blobUri, function (blobInfo) {
                    options.blobInfo = blobInfo;
                    options.mimeType = options.blobInfo.type;
                    $fileclient.uploadBlob(options, callback);
                });
            }
            else {
                var message = 'BlobUri 파일 업로드 필수 항목 확인 필요';
                syn.$w.alert(message);
                syn.$l.eventLog('$fileclient.uploadBlobUri', message, 'Warning');
            }
        },

        uploadUI: function (uploadOptions) {
            var dialogOptions = $ref.clone(syn.$w.dialogOptions);
            dialogOptions.minWidth = 420;
            dialogOptions.minHeight = 320;

            uploadOptions = syn.$w.argumentsExtend(dialogOptions, uploadOptions);
            dialogOptions.minWidth = uploadOptions.minWidth;
            dialogOptions.minHeight = uploadOptions.minHeight;

            dialogOptions.caption = uploadOptions.dialogTitle;

            if (uploadOptions.repositoryID == '' || uploadOptions.uploadUrl == '') {
                syn.$w.alert('uploadOptions에 repositoryID 또는 uploadUrl이 입력되지 않았습니다.');
                return;
            }

            if (uploadOptions.uploadUrl.indexOf('?') > -1) {
                uploadOptions.uploadUrl += '&repositoryID=' + uploadOptions.repositoryID;
            }
            else {
                uploadOptions.uploadUrl += '?repositoryID=' + uploadOptions.repositoryID;
            }

            uploadOptions.uploadUrl += '&companyNo=' + syn.$w.SSO.WorkCompanyNo;

            fileUploadOptions = uploadOptions;
            syn.$w.showUIDialog(uploadOptions.uploadUrl, dialogOptions);
        },

        toFileLengthString: function (fileLength) {
            var val = '0 KB';
            if (fileLength < 0) {
                fileLength = 0;
            }

            if (fileLength < 1048576.0) {
                val = (fileLength / 1024.0).toString() + ' KB';
            }
            if (fileLength < 1073741824.0) {
                val = ((fileLength / 1024.0) / 1024.0).toString() + ' MB';
            }

            return val;
        },

        executeProxy: function (url, callback) {
            var xhr = new syn.$w.xmlHttp();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        if (callback) {
                            callback(JSON.parse(xhr.responseText));
                        }
                    }
                    else {
                        syn.$l.eventLog('$fileclient.executeProxy', 'async url: ' + url + ', status: ' + xhr.status.toString() + ', responseText: ' + xhr.responseText, 'Error');
                    }
                }
            };

            xhr.open('GET', url, true);
            xhr.send();
        },

        getTemporaryDependencyID: function (prefix) {
            return prefix + syn.$l.random(24);
        },

        setLocale: function (elID, translations, control, options) {
        }
    });

    $fileclient.moduleInit();

    syn.uicontrols.$fileclient = $fileclient;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $list = syn.uicontrols.$list || new syn.module();

    /*
    // 업무 화면 사용자 검색 필터 처리 필요
    var listDataTable = $this.$list.getControl('lstDataTable');
    $('#toDate, #fromDate').unbind().bind('keyup', function () {
        listDataTable.table.draw();
    });

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var min = Date.parse($('#fromDate').val());
            var max = Date.parse($('#toDate').val());
            var targetDate = Date.parse(data[5]);

            if ((isNaN(min) && isNaN(max)) ||
                (isNaN(min) && targetDate <= max) ||
                (min <= targetDate && isNaN(max)) ||
                (targetDate >= min && targetDate <= max)) {
                return true;
            }
            return false;
        }
    );
    */

    $list.extend({
        name: 'syn.uicontrols.$list',
        version: '1.0',
        listControls: [],
        defaultSetting: {
            width: '100%',
            height: '300px',
            paging: true,
            ordering: true,
            info: true,
            searching: true,
            select: true,
            lengthChange: false,
            autoWidth: true,
            pageLength: 50,
            orderCellsTop: true,
            fixedHeader: true,
            responsive: true,
            checkbox: false,
            order: [],
            sScrollY: '0px',
            footerCallback: function () {
                // 업무 화면 footer 영역에 사용자 지정 집계 구현
                // <tfoot>
                //     <tr>
                //         <th colspan="2" style="text-align:right;white-space:nowrap;">TOTAL : </th>
                //         <th colspan="6" style="text-align:left;white-space:nowrap;"></th>
                //     </tr>
                // </tfoot>
                // var api = this.api();
                // var result = 0;
                // api.column(7, { search: 'applied' }).data().each(function (data, index) {
                //     result += parseFloat(data);
                // });
                // $(api.column(3).footer()).html(result.toLocaleString() + '원');
            },
            fnDrawCallback: function () {
                var $dataTable = this.dataTable();
                var $dataTableWrapper = this.closest('.dataTables_wrapper');
                setTimeout(function () {
                    // $dataTable.fnAdjustColumnSizing(false);

                    if (typeof (TableTools) != 'undefined') {
                        var tableTools = TableTools.fnGetInstance(table);
                        if (tableTools != null && tableTools.fnResizeRequired()) {
                            tableTools.fnResizeButtons();
                        }
                    }

                    var panelHeight = $dataTableWrapper.parent().height();
                    var paginateHeight = $dataTableWrapper.find('.dataTables_paginate').height();

                    var toolbarHeights = 0;
                    $dataTableWrapper.find('.fg-toolbar').each(function (i, obj) {
                        toolbarHeights = toolbarHeights + $(obj).height();
                    });

                    var scrollHeadHeight = 0;
                    $dataTableWrapper.find('.dataTables_scrollHead').each(function (i, obj) {
                        scrollHeadHeight = scrollHeadHeight + $(obj).height();
                    });

                    var height = panelHeight - toolbarHeights - scrollHeadHeight - paginateHeight;
                    var elScrollY = $dataTableWrapper.find('.dataTables_scrollBody');
                    elScrollY.height(height);
                    elScrollY.css({ 'maxHeight': (height).toString() + 'px' });
                    $dataTable._fnScrollDraw();
                }, 150);
            },
            language: {
                emptyTable: '데이터가 없습니다',
                info: '_START_ - _END_ \/ _TOTAL_',
                infoEmpty: '0 - 0 \/ 0',
                infoFiltered: '(총 _MAX_ 개)',
                infoThousands: ',',
                lengthMenu: '페이지당 줄수 _MENU_',
                loadingRecords: '읽는중...',
                processing: '처리중...',
                search: '검색:',
                zeroRecords: '검색 결과가 없습니다',
                paginate: {
                    first: '처음',
                    last: '마지막',
                    next: '다음',
                    previous: '이전'
                }
            },
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
            var el = syn.$l.get(elID);
            setting = syn.$w.argumentsExtend($list.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            setting.width = el.style.width || setting.width;
            setting.height = el.style.height || setting.height;

            el.setAttribute('id', elID + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var parent = el.parentNode;
            var wrapper = document.createElement('div');
            wrapper.style.width = setting.width;
            wrapper.style.height = setting.height;
            wrapper.style.position = 'relative';
            wrapper.className = 'list-container';

            var headers = [];

            headers.push('<thead><tr>');

            if (setting.checkbox === true) {
                // $this.$list.getControl('lstDataTable').table.column(0).checkboxes.selected().toArray();
                setting.columnDefs = [{
                    targets: 0,
                    checkboxes: {
                        selectRow: true
                    }
                }];

                setting.select = {
                    style: 'multi'
                };

                delete setting.sScrollY;
                delete setting.fnDrawCallback;
            };

            for (var i = 0; i < setting.columns.length; i++) {
                var column = setting.columns[i];
                headers.push('<th>{0}</th>'.format(column.title));

                delete column.title;
            }
            headers.push('</tr></thead>');

            wrapper.innerHTML = '<table id="' + elID + '" class="display" style="width:100%">' + headers.join('') + '</table>';

            parent.appendChild(wrapper);

            if (setting.searching === true) {
                $('#{0} thead tr'.format(elID)).clone(true).appendTo('#{0} thead'.format(elID));
                $('#{0} thead tr:eq(1) th'.format(elID)).each(function (i) {
                    var title = $(this).text();
                    $(this).html('<input type="text" class="dataTables_searchtext" />');

                    $('input', this).on('keyup change', function () {
                        var elID = this.closest('.dataTables_wrapper').id.split('_')[0];
                        var table = $this.$list.getControl(elID).table;
                        if (table.column(i).search() !== this.value) {
                            table.column(i).search(this.value).draw();
                        }
                    });
                });

                if (setting.checkbox === true) {
                    $('#lstDataTable thead tr:eq(1) th:first-child input').hide();
                }
            }

            var elDataTable = $('#' + elID);
            var table = elDataTable.DataTable(setting);

            var gridHookEvents = syn.$l.get(elID + '_hidden').getAttribute('syn-events');
            try {
                if (gridHookEvents) {
                    gridHookEvents = eval(gridHookEvents);
                }
            } catch (error) {
                syn.$l.eventLog('GridList_controlLoad', error.toString(), 'Debug');
            }

            if (gridHookEvents) {
                for (var i = 0; i < gridHookEvents.length; i++) {
                    var hook = gridHookEvents[i];

                    var mod = window[syn.$w.pageScript];
                    if (mod) {
                        var eventHandler = mod['{0}_{1}'.format(elID, hook)];
                        if (eventHandler) {
                            switch (hook) {
                                case 'select':
                                    table.on('select', function (e, dt, type, indexes) {
                                        table[type](indexes).nodes().to$().addClass('custom-selected');
                                        if (type === 'row') {
                                            var data = table.rows(indexes).data();
                                            var eventHandler = mod['{0}_{1}'.format(elID, hook)];
                                            eventHandler.apply(syn.$l.get(elID), [data, e, dt, type, indexes]);
                                        }
                                    });
                                    break;
                                case 'deselect':
                                    table.on('deselect', function (e, dt, type, indexes) {
                                        var eventHandler = mod['{0}_{1}'.format(elID, hook)];
                                        eventHandler.apply(syn.$l.get(elID), [e, dt, type, indexes]);
                                    });
                                    break;
                                case 'dblclick':
                                    $('#{0}_wrapper table tbody'.format(elID)).on('dblclick', 'tr', function () {
                                        var data = table.row(this).data();
                                        var eventHandler = mod['{0}_{1}'.format(elID, hook)];
                                        eventHandler.apply(syn.$l.get(elID), [this, data]);
                                    });
                                    break;
                            }
                        }
                    }
                }
            }

            $list.listControls.push({
                id: elID,
                table: table,
                list: elDataTable.dataTable(),
                config: setting,
                value: null
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = null;
            var listControl = $('#' + elID).DataTable();

            if (listControl.context) {
                result = listControl.data().toArray();
            }

            return result;
        },

        setValue: function (elID, value, meta) {
            var listControl = $list.getControl(elID);
            if (listControl) {
                listControl.list.fnClearTable();
                listControl.list.fnAddData(value);
            }
        },

        clear: function (elID, isControlLoad) {
            var listControl = $list.getControl(elID);
            if (listControl) {
                listControl.list.fnClearTable();
                listControl.table.columns().search('').draw();
                var els = document.getElementById(elID + '_wrapper').querySelectorAll('.dataTables_searchtext');
                for (var i = 0; i < els.length; i++) {
                    var el = els[i];
                    el.value = '';
                }
            }
        },

        getControl: function (elID) {
            var result = null;
            var length = $list.listControls.length;
            for (var i = 0; i < length; i++) {
                var item = $list.listControls[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        setCellData: function (elID, row, col, value) {
            var control = $list.getControl(elID);
            if (control) {
                if ($ref.isString(col) == true) {
                    col = $list.propToCol(elID, col);
                }

                var cell = control.table.cell(row, col);
                if (cell.length > 0) {
                    control.table.cell(row, col).data(value).draw();
                }
            }
        },

        propToCol: function (elID, columnName) {
            var result = -1;
            var control = $list.getControl(elID);
            if (control) {
                var columns = control.table.settings().toArray()[0].aoColumns;
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].data == columnName) {
                        result = i;
                        break;
                    }
                }
            }

            return result;
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$list = $list;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $organization = syn.uicontrols.$organization || new syn.module();

    $organization.extend({
        name: 'syn.uicontrols.$organization',
        version: '1.0',
        organizationControls: [],
        eventHooks: [
            'nodedrop',
            'select',
            'click'
        ],
        defaultSetting: {
            width: '100%',
            height: '300px',
            itemID: 'id',
            parentItemID: 'parentID',
            childrenID: 'children',
            reduceMap: {
                key: 'id',
                title: 'title',
                parentID: 'parentID',
            },
            nodeTitle: 'name',
            nodeContent: 'title',
            direction: 't2b',
            pan: false,
            zoom: false,
            zoominLimit: 2,
            zoomoutLimit: 0.8,
            draggable: false,
            className: 'top-level',
            verticalLevel: 4,
            nodeTemplate: null, // $this.elID_nodeTemplate: function (data) {}
            createNode: null, // $this.elID_createNode: function ($node, data) {}
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
            var el = syn.$l.get(elID);
            setting = syn.$w.argumentsExtend($organization.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            setting.width = el.style.width || setting.width;
            setting.height = el.style.height || setting.height;

            el.setAttribute('id', elID + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            if (setting.nodeTemplate != null && $ref.isString(setting.nodeTemplate) == true) {
                setting.nodeTemplate = eval(setting.nodeTemplate);
            }

            if (setting.createNode != null && $ref.isString(setting.createNode) == true) {
                setting.createNode = eval(setting.createNode);
            }

            var hookEvents = el.getAttribute('syn-events');
            try {
                if (hookEvents) {
                    hookEvents = eval(hookEvents);
                }
            } catch (error) {
                syn.$l.eventLog('OrganizationView_controlLoad', error.toString(), 'Debug');
            }

            var parent = el.parentNode;
            var wrapper = document.createElement('div');
            wrapper.style.width = setting.width;
            wrapper.style.height = setting.height;
            wrapper.className = 'organization-container';
            wrapper.innerHTML = '<div id="' + elID + '"></div>';
            parent.appendChild(wrapper);

            setting.data = {};
            var orgchart = $('#' + elID).orgchart(setting);

            for (var i = 0; i < hookEvents.length; i++) {
                var hookEvent = hookEvents[i];
                if ($organization.eventHooks.indexOf(hookEvent) > -1) {
                    if ($object.isNullOrUndefined(setting[hookEvent]) == true) {
                        switch (hookEvent) {
                            case 'nodedrop':
                                setting[hookEvent] = function (evt, params) {
                                    var mod = window[syn.$w.pageScript];
                                    if (mod) {
                                        var eventHandler = mod['{0}_{1}'.format(elID, 'nodedrop')];
                                        if (eventHandler) {
                                            eventHandler.apply(syn.$l.get(elID), [evt, params]);
                                        }
                                    }
                                }

                                orgchart.$chart.on('nodedrop.orgchart', setting[hookEvent]);
                                break;
                            case 'select':
                                setting[hookEvent] = function (evt) {
                                    var mod = window[syn.$w.pageScript];
                                    if (mod) {
                                        var that = $(this);
                                        var eventHandler = mod['{0}_{1}'.format(elID, 'select')];
                                        if (eventHandler) {
                                            eventHandler.apply(syn.$l.get(elID), [evt, that]);
                                        }
                                    }
                                }

                                orgchart.$chartContainer.on('click', '.node', setting[hookEvent]);
                                break;
                            case 'click':
                                setting[hookEvent] = function (evt) {
                                    var mod = window[syn.$w.pageScript];
                                    if (mod) {
                                        var eventHandler = mod['{0}_{1}'.format(elID, 'click')];
                                        if (eventHandler) {
                                            eventHandler.apply(syn.$l.get(elID), [evt, $(evt.target).closest('.node').length]);
                                        }
                                    }
                                }

                                orgchart.$chartContainer.on('click', '.orgchart', setting[hookEvent]);
                                break;
                        }
                    }
                }
            }

            $organization.organizationControls.push({
                id: elID,
                orgchart: orgchart,
                config: setting
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = null;
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart) {
                var setting = $organization.getControl(elID).config;
                var map = setting.reduceMap;
                var jsonRoot = orgchart.getHierarchy();
                var flatValue = syn.$l.nested2Flat(jsonRoot, setting.itemID, setting.parentItemID, setting.childrenID);

                var reduceSource = [];
                var length = flatValue.length;
                for (var i = 0; i < length; i++) {
                    var item = flatValue[i];

                    var dataItem = item.data;
                    if (dataItem) {
                        dataItem[map.key] = item.key;
                        dataItem[map.title] = item.title;
                        dataItem[map.parentID] = item.parentID;
                        reduceSource.push(dataItem);
                    }
                }

                result = reduceSource;
            }
            return result;
        },

        setValue: function (elID, value, meta) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart) {
                var setting = $organization.getControl(elID).config;
                var map = setting.reduceMap;
                var reduceSource = [];
                var length = value.length;
                for (var i = 0; i < length; i++) {
                    var item = value[i];

                    reduceSource.push({
                        id: item[map.key],
                        key: item[map.key],
                        title: item[map.title],
                        parentID: item[map.parentID],
                        data: $ref.clone(item, false)
                    });
                }

                var nestedValue = syn.$l.flat2Nested(reduceSource, setting.itemID, setting.parentItemID, setting.childrenID);
                orgchart.init({ data: nestedValue });

                var nodedropFunc = setting['nodedrop'];
                if (nodedropFunc) {
                    orgchart.$chart.on('nodedrop.orgchart', nodedropFunc);
                }
            }
        },

        clear: function (elID, isControlLoad) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart) {
                orgchart.init({ data: null });
            }
        },

        getControl: function (elID) {
            var result = null;
            var length = $organization.organizationControls.length;
            for (var i = 0; i < length; i++) {
                var item = $organization.organizationControls[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        init: function (elID, newOptions) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart) {
                orgchart.init(newOptions);
            }
        },

        addParent: function (elID, data) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart) {
                orgchart.addParent($('#' + elID).find('.node:first'), data);
            }
        },

        addSiblings: function (elID, node, data) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.addSiblings(node, data);
            }
        },

        addChildren: function (elID, node, data) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.addChildren(node, data);
            }
        },

        removeNodes: function (elID, node) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.removeNodes(node);
            }
        },

        getHierarchy: function (elID, includeNodeData) {
            var result = null;
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart) {
                if ($object.isNullOrUndefined(includeNodeData) == true) {
                    includeNodeData = false;
                }

                result = orgchart.getHierarchy(includeNodeData);
            }

            return result;
        },

        hideParent: function (elID, node) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.hideParent(node);
            }
        },

        showParent: function (elID, node) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.showParent(node);
            }
        },

        showChildren: function (elID, node) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.showChildren(node);
            }
        },

        hideSiblings: function (elID, node, direction) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.hideSiblings(node, direction);
            }
        },

        showSiblings: function (elID, node, direction) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.showSiblings(node, direction);
            }
        },

        getNodeState: function (elID, node, relation) {
            var result = null;
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                if ($object.isNullOrUndefined(relation) == true) {
                    relation = 'children'; // "parent", "children", "siblings"
                }

                result = orgchart.getNodeState(node, relation);
            }

            return result;
        },

        getRelatedNodes: function (elID, node, relation) {
            var result = null;
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                if ($object.isNullOrUndefined(relation) == true) {
                    relation = 'children'; // "parent", "children", "siblings"
                }

                result = orgchart.getRelatedNodes(node, relation);
            }
            return result;
        },

        setChartScale: function (elID, node, newScale) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart && node) {
                orgchart.setChartScale(node, newScale);
            }
        },

        export: function (elID, fileName, fileExtension) {
            var orgchart = $organization.getControl(elID).orgchart;
            if (orgchart) {
                if ($object.isNullOrUndefined(fileName) == true) {
                    fileName = syn.$l.random();
                }

                orgchart.export(fileName, fileExtension);
            }
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$organization = $organization;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    var $radio = $radio || new syn.module();

    $radio.extend({
        name: 'syn.uicontrols.$radio',
        version: '1.0',
        defaultSetting: {
            contents: '',
            toQafControl: false,
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($radio.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            if (setting.toQafControl == true) {
                el.setAttribute('id', el.id + '_hidden');
                el.setAttribute('syn-options', JSON.stringify(setting));
                el.style.display = 'none';
                var dataFieldID = el.getAttribute('syn-datafield');
                var events = el.getAttribute('syn-events');
                var value = el.value;
                var checked = el.checked;
                var name = el.name;
                var html = '';
                if (events) {
                    html = '<input class="ui_radio" id="{0}" name="{1}" type="radio" syn-datafield="{2}" value="{3}" {4} syn-events={5}>'.format(elID, name, dataFieldID, value, checked == true ? 'checked="checked"' : '', '[\'' + eval(events).join('\',\'') + '\']');
                }
                else {
                    html = '<input class="ui_radio" id="{0}" name="{1}" type="radio" syn-datafield="{2}" value="{3}" {4}>'.format(elID, name, dataFieldID, value, checked == true ? 'checked="checked"' : '');
                }

                if ($ref.isString(setting.textContent) == true) {
                    html = html + '<label for="{0}">{1}</label>'.format(elID, setting.textContent);
                }

                var parent = el.parentNode;
                var wrapper = syn.$m.create({
                    tag: 'span',
                    className: 'formControl'
                });
                wrapper.innerHTML = html;

                parent.appendChild(wrapper);
                syn.$l.get(elID).setAttribute('syn-options', JSON.stringify(setting));
            }
            else {
                el.setAttribute('syn-options', JSON.stringify(setting));
            }

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = false;
            var el = syn.$l.get(elID);
            result = el.checked;

            return result;
        },

        setValue: function (elID, value, meta) {
            var el = syn.$l.get(elID);
            el.checked = value;
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);
            el.checked = false;
        },

        getGroupNames: function () {
            var value = [];
            var els = syn.$l.querySelectorAll('input[type=\'radio\']');
            for (var i = 0; i < els.length; i++) {
                value.push(els[i].name);
            }

            return $array.distinct(value);
        },

        getGroupValue: function (group) {
            var result = null;
            var els = syn.$l.querySelectorAll('input[type="radio"][name="{0}"]'.format(group));
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.id.indexOf('_hidden') == -1 && el.checked == true) {
                    result = el.value;
                    break;
                }
            }

            return result;
        },

        selectedValue: function (group, value) {
            var els = syn.$l.querySelectorAll('input[type="radio"][name="{0}"]'.format(group));
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (els[i].id.indexOf('_hidden') == -1 && els[i].value === value) {
                    els[i].checked = true;
                    break;
                }
            }
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$radio = $radio;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $textarea = syn.uicontrols.$textarea || new syn.module();

    $textarea.extend({
        name: 'syn.uicontrols.$textarea',
        version: '1.0',
        textControls: [],
        defaultSetting: {
            width: '100%',
            height: '240px',
            indentUnit: 4,
            lineNumbers: true,
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($textarea.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            setting.elementID = elID;
            setting.width = el.style.width || setting.width;
            setting.height = el.style.height || setting.height;
            el.style.width = setting.width;
            el.style.height = setting.height;

            el.setAttribute('syn-options', JSON.stringify(setting));

            var events = el.getAttribute('syn-events');
            var editor = null;

            if (setting.toQafControl == true) {
                if (el.getAttribute('maxlength') || el.getAttribute('maxlengthB')) {
                    if (el.getAttribute('maxlengthB')) {
                        el.setAttribute('maxlength', el.getAttribute('maxlengthB'));
                    }
                    setting.maxLength = el.getAttribute('maxlength');
                }

                editor = CodeMirror.fromTextArea(el, setting);

                if ($object.isNullOrUndefined(setting.maxLength) == false) {
                    editor.on('blur', function (cm, change) {
                        var el = syn.$l.get(editor.options.elementID);
                        var maxLength = 0;
                        var maxLengthB = el.getAttribute('maxlengthB');
                        if ($string.isNullOrEmpty(maxLengthB) == false) {
                            maxLength = parseInt(maxLengthB);
                        }
                        else {
                            maxLength = cm.getOption('maxLength');
                        }

                        var length = maxLength;
                        var textLength = $string.length(cm.getValue());

                        if (textLength > length) {
                            var alertOptions = $ref.clone(syn.$w.alertOptions);
                            // alertOptions.stack = '영어외에는 2자리씩 계산되며, 현재 {1}글자를 입력했습니다'.format($string.toCurrency(textLength));
                            syn.$w.alert($res.textMaxLength.format($string.toCurrency(length)), '정보', alertOptions, function (result) {
                                editor.focus();
                            });
                        }

                        return true;
                    });
                }

                if (events) {
                    events = eval(events);
                    for (var i = 0; i < events.length; i++) {
                        var editorEvent = events[i];
                        var eventHandler = mod[el.id + '_' + editorEvent];
                        if (eventHandler) {
                            editor.on(editorEvent, eventHandler);
                        }
                    }
                }

                editor.setSize(setting.width, setting.height);
                setTimeout(function () {
                    editor.refresh();
                }, 30);
            }
            else {
                if (el.getAttribute('maxlength') || el.getAttribute('maxlengthB')) {
                    if (el.getAttribute('maxlengthB')) {
                        el.setAttribute('maxlength', el.getAttribute('maxlengthB'));
                    }
                    syn.$l.addEvent(el, 'blur', $textarea.event_blur);
                }
            }

            $textarea.textControls.push({
                id: elID,
                editor: editor,
                setting: $ref.clone(setting)
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID) {
            var result = null;
            var textControl = $textarea.getControl(elID);

            if (textControl && textControl.editor) {
                result = textControl.editor.getValue();
            }
            else {
                var el = syn.$l.get(elID);
                if (el) {
                    result = el.value;
                }
            }

            return result;
        },

        setValue: function (elID, value) {
            var textControl = $textarea.getControl(elID);

            if (textControl && textControl.editor) {
                textControl.editor.setValue(value);
            }
            else {
                var el = syn.$l.get(elID);
                if (el) {
                    el.value = value;
                }
            }
        },

        clear: function (elID, isControlLoad) {
            var textControl = $textarea.getControl(elID);

            if (textControl && textControl.editor) {
                textControl.editor.setValue('');
            }
            else {
                var el = syn.$l.get(elID);
                if (el) {
                    el.value = '';
                }
            }
        },

        getControl: function (elID) {
            var result = null;
            var length = $textarea.textControls.length;
            for (var i = 0; i < length; i++) {
                var item = $textarea.textControls[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        event_blur: function (e) {
            var el = e.target || e.srcElement || e;
            var maxLengthB = el.getAttribute('maxlengthB');
            if ($string.isNullOrEmpty(maxLengthB) == false) {
                var length = parseInt(maxLengthB);
                var textLength = $string.length(el.value);

                if (textLength > length) {
                    var alertOptions = $ref.clone(syn.$w.alertOptions);
                    // alertOptions.stack = '영어외에는 2자리씩 계산되며, 현재 {1}글자를 입력했습니다'.format($string.toCurrency(textLength));
                    syn.$w.alert($res.textMaxLength.format($string.toCurrency(length)), '정보', alertOptions);

                    el.focus();
                }
            }
            else {
                var maxLength = el.getAttribute('maxlength');
                if ($string.isNullOrEmpty(maxLength) == false) {
                    var length = parseInt(maxLength);
                    var textLength = el.value.length;

                    if (textLength > length) {
                        var alertOptions = $ref.clone(syn.$w.alertOptions);
                        // alertOptions.stack = '영어외에는 2자리씩 계산되며, 현재 {1}글자를 입력했습니다'.format($string.toCurrency(textLength));
                        syn.$w.alert($res.textMaxLength.format($string.toCurrency(length)), '정보', alertOptions);

                        el.focus();
                    }
                }
            }
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$textarea = $textarea;
})(window);
/// <reference path="/Scripts/syn.js" />
/// <reference path="/Scripts/externallibrary/lib/superplaceholder-1.0.0/superplaceholder.js" />

(function (window) {
    'use strict';
    var $textbox = $textbox || new syn.module();

    $textbox.extend({
        name: 'syn.uicontrols.$textbox',
        version: '1.0',
        defaultSetting: {
            editType: 'text',
            formatNumber: true,
            maskPattern: null,
            maxCount: null,
            minCount: 0,
            placeText: [],
            defaultSetValue: '0',
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($textbox.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            el.setAttribute('syn-options', JSON.stringify(setting));

            if ($ref.isEmpty(setting.placeText) == false) {
                superplaceholder({
                    el: el,
                    sentences: $ref.isString(setting.placeText) == true ? [setting.placeText] : setting.placeText
                });
            }

            switch (setting.editType) {
                case 'text':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    break;
                case 'english':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_english_blur);
                    syn.$l.addEvent(el, 'keydown', $textbox.event_english_keydown);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');
                    break;
                case 'number':
                    syn.$l.addEvent(el, 'focus', $textbox.event_numeric_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_number_blur);
                    syn.$l.addEvent(el, 'keypress', $textbox.event_numeric_keypress);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');

                    VMasker(el).maskNumber();
                    break;
                case 'numeric':
                    syn.$l.addEvent(el, 'focus', $textbox.event_numeric_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_numeric_blur);
                    syn.$l.addEvent(el, 'keypress', $textbox.event_numeric_keypress);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');

                    VMasker(el).maskNumber();
                    break;
                case 'spinner':
                    syn.$l.addEvent(el, 'focus', $textbox.event_numeric_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_numeric_blur);
                    syn.$l.addEvent(el, 'keypress', $textbox.event_numeric_keypress);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');
                    if (el.offsetWidth) {
                        el.offsetWidth = el.offsetWidth <= 28 ? 0 : el.offsetWidth - 28;
                    }

                    new ISpin(el, {
                        wrapperClass: 'ispin-wrapper',
                        buttonsClass: 'ispin-button',
                        step: 1,
                        pageStep: 10,
                        disabled: false,
                        repeatInterval: 100,
                        wrapOverflow: false,
                        parse: Number,
                        format: String
                    });
                    VMasker(el).maskNumber();
                    break;
                case 'year':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_year_blur);
                    break;
                case 'date':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_date_blur);
                    break;
                case 'hour':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_hour_blur);
                    syn.$l.addEvent(el, 'keypress', $textbox.event_numeric_keypress);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');
                    break;
                case 'minute':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_minute_blur);
                    syn.$l.addEvent(el, 'keypress', $textbox.event_numeric_keypress);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');
                    break;
                case 'yearmonth':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_yearmonth_blur);
                    break;
                case 'homephone':
                    syn.$l.addEvent(el, 'focus', $textbox.event_phone_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_homephone_blur);
                    syn.$l.addEvent(el, 'keypress', $textbox.event_numeric_keypress);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');
                    break;
                case 'mobilephone':
                    syn.$l.addEvent(el, 'focus', $textbox.event_phone_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_mobilephone_blur);
                    syn.$l.addEvent(el, 'keypress', $textbox.event_numeric_keypress);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');
                    break;
                case 'email':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_email_blur);
                    syn.$m.setStyle(el, 'ime-mode', 'inactive');
                    break;
                case 'juminno':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_juminno_blur);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');

                    if ($string.isNullOrEmpty(setting.maskPattern) == true) {
                        VMasker(el).maskPattern('999999-9999999');
                    }
                    break;
                case 'businessno':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_businessno_blur);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');

                    if ($string.isNullOrEmpty(setting.maskPattern) == true) {
                        VMasker(el).maskPattern('999-99-99999');
                    }
                    break;
                case 'corporateno':
                    syn.$l.addEvent(el, 'focus', $textbox.event_focus);
                    syn.$l.addEvent(el, 'blur', $textbox.event_corporateno_blur);
                    syn.$m.setStyle(el, 'ime-mode', 'disabled');

                    if ($string.isNullOrEmpty(setting.maskPattern) == true) {
                        VMasker(el).maskPattern('999999-9999999');
                    }
                    break;
            }

            if (el.getAttribute('maxlength') || el.getAttribute('maxlengthB')) {
                if (el.getAttribute('maxlengthB')) {
                    el.setAttribute('maxlength', el.getAttribute('maxlengthB'));
                }
                syn.$l.addEvent(el, 'blur', $textbox.event_blur);
            }

            if ($string.isNullOrEmpty(setting.maskPattern) == false) {
                VMasker(el).maskPattern(setting.maskPattern);
            }

            if (setting.contents) {
                $textbox.setValue(elID, setting.contents);
            }

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        event_english_keydown: function (e) {
            var evt = evt || window.event;
            var charCode = evt.which || event.keyCode;
            var value = false;
            if ((charCode > 7 && charCode < 47) == true || (charCode > 64 && charCode < 91) == true || (charCode > 47 && charCode < 58) == true || (charCode > 95 && charCode < 123) == true) {
            }
            else {
                var el = e.target || e.srcElement || e;
                el.value = el.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');

                e.returnValue = false;
                e.cancel = true;
                if (e.preventDefault) {
                    e.preventDefault();
                }

                value = false;
            }

            value = true;

            return value;
        },

        event_numeric_keypress: function (e) {
            var evt = e || window.event;
            var el = e.target || e.srcElement || e;
            var charCode = evt.which || event.keyCode;
            var value = false;
            if (charCode > 31 && (charCode < 48 || charCode > 57 || charCode == 45 || charCode == 109)) {
                if (charCode == 45 || charCode == 109) {
                    var val = el.value;
                    if (val.startsWith('-') == true && val.split('-').length <= 2 || val.split('-').length == 1) {
                        return true;
                    }
                }

                e.returnValue = false;
                e.cancel = true;
                if (e.preventDefault) {
                    e.preventDefault();
                }

                value = false;
            }

            value = true;
            return value;
        },

        event_focus: function (e) {
            var el = e.target || e.srcElement || e;

            if (el.value.length > 0) {
                $textbox.rangeMoveCaret(el);
            }
        },

        event_phone_focus: function (e) {
            var el = e.target || e.srcElement || e;
            if (el.value.length > 0) {
                el.value = el.value.replace(/-/g, '');
                $textbox.rangeMoveCaret(el);
            }
        },

        event_numeric_focus: function (e) {
            var el = e.target || e.srcElement || e;
            if (el.value.length > 0) {
                el.value = $string.toNumberString(el.value);
                $textbox.rangeMoveCaret(el);
            }
        },

        event_blur: function (e) {
            var el = e.target || e.srcElement || e;
            var maxLengthB = el.getAttribute('maxlengthB');
            if ($string.isNullOrEmpty(maxLengthB) == false) {
                var length = parseInt(el.getAttribute('maxLengthB'));
                var textLength = $string.length(el.value);

                if (textLength > length) {
                    var alertOptions = $ref.clone(syn.$w.alertOptions);
                    // alertOptions.stack = '영어외에는 2자리씩 계산되며, 현재 {1}글자를 입력했습니다'.format($string.toCurrency(textLength));
                    syn.$w.alert($res.textMaxLength.format($string.toCurrency(length)), '정보', alertOptions);

                    el.focus();
                    $textbox.event_focus(el);
                }
            }
            else {
                var maxLength = el.getAttribute('maxlength');
                if ($string.isNullOrEmpty(maxLength) == false) {
                    var length = parseInt(el.getAttribute('maxlength'));
                    var textLength = el.value.length;

                    if (textLength > length) {
                        var alertOptions = $ref.clone(syn.$w.alertOptions);
                        // alertOptions.stack = '영어외에는 2자리씩 계산되며, 현재 {1}글자를 입력했습니다'.format($string.toCurrency(textLength));
                        syn.$w.alert($res.textMaxLength.format($string.toCurrency(length)), '정보', alertOptions);

                        el.focus();
                        $textbox.event_focus(el);
                    }
                }
            }
        },

        event_hour_blur: function (e) {
            var el = e.target || e.srcElement || e;

            if (el.value.length > 0) {
                if (parseInt(el.value) > 23) {
                    el.value = '23';
                }

                if (el.value.length == 1) {
                    el.value = el.value.padStart(2, '0');
                }
            }
        },

        event_minute_blur: function (e) {
            var el = e.target || e.srcElement || e;
            if (el.value.length > 0) {
                if (parseInt(el.value) > 59) {
                    el.value = '59';
                }

                if (el.value.length == 1) {
                    el.value = el.value.padStart(2, '0');
                }
            }
        },

        event_english_blur: function (e) {
            var el = e.target || e.srcElement || e;
            el.value = el.value.replace(/[^a-z0-9]/gi, '');
        },

        event_number_blur: function (e) {
            var el = e.target || e.srcElement || e;
            var qafOptions = JSON.parse(el.getAttribute('syn-options'));

            if ($object.isNullOrUndefined(qafOptions.maxCount) == false) {
                if ($string.toNumber(el.value) > qafOptions.maxCount) {
                    el.value = qafOptions.maxCount;
                }
            }

            if ($object.isNullOrUndefined(qafOptions.minCount) == false) {
                if ($string.toNumber(el.value) < qafOptions.minCount) {
                    el.value = qafOptions.minCount;
                }
            }

            var val = el.value;
            if (val.startsWith('-') == true && val.length == 1 || val.trim().length == 0) {
                el.value = '0';
            }
        },

        event_numeric_blur: function (e) {
            var el = e.target || e.srcElement || e;
            var qafOptions = JSON.parse(el.getAttribute('syn-options'));

            if ($object.isNullOrUndefined(qafOptions.maxCount) == false) {
                if ($string.toNumber(el.value) > qafOptions.maxCount) {
                    el.value = qafOptions.maxCount;
                }
            }

            if ($object.isNullOrUndefined(qafOptions.minCount) == false) {
                if ($string.toNumber(el.value) < qafOptions.minCount) {
                    el.value = qafOptions.minCount;
                }
            }

            if (el.value.length > 0 && qafOptions.formatNumber === true) {
                el.value = $string.toCurrency(el.value);
            }

            var val = el.value;
            if (val.startsWith('-') == true && val.length == 1 || val.trim().length == 0) {
                el.value = '0';
            }
        },

        event_homephone_blur: function (e) {
            var el = e.target || e.srcElement || e;
            el.value = el.value.replace(/-/g, '');
            var value = el.value;

            if (value.length > 0) {
                el.setAttribute('placeholder', '');
                if (value.length == 12) {
                    if (syn.$v.regexs.onesPhone.test(value) == true) {
                        el.value = value.substr(0, 4).concat('-', value.substr(4, 4), '-', value.substr(8, 4));
                    } else {
                        el.value = '';
                    }
                } else {
                    if (value.length == 9) {
                        if (syn.$v.regexs.seoulPhone.test(value) == true) {
                            el.value = value.substr(0, 2).concat('-', value.substr(2, 3), '-', value.substr(5, 4));
                        } else {
                            el.value = '';
                        }
                    } else if (value.length == 10) {
                        if (value.substring(0, 2) == '02') {
                            if (syn.$v.regexs.seoulPhone.test(value) == true) {
                                el.value = value.substr(0, 2).concat('-', value.substr(2, 4), '-', value.substr(6, 4));
                            } else {
                                el.value = '';
                            }
                        } else {
                            if (syn.$v.regexs.areaPhone.test(value) == true) {
                                el.value = value.substr(0, 3).concat('-', value.substr(3, 3), '-', value.substr(6, 4));
                            }
                            else {
                                el.value = '';
                            }
                        }
                    } else if (value.length == 11) {
                        if (syn.$v.regexs.areaPhone.test(value) == true) {
                            el.value = value.substr(0, 3).concat('-', value.substr(3, 4), '-', value.substr(7, 4));
                        }
                        else if (syn.$v.regexs.mobilePhone.test(value) == true) {
                            el.value = value.substr(0, 3).concat('-', value.substr(3, 4), '-', value.substr(7, 4));
                        }
                        else {
                            el.value = '';
                        }
                    } else {
                        el.value = '';
                    }
                }

                if (el.value == '') {
                    el.setAttribute('placeholder', '전화번호 확인 필요');
                }
            }
        },

        event_mobilephone_blur: function (e) {
            var el = e.target || e.srcElement || e;
            el.value = el.value.replace(/-/g, '');
            var value = el.value;

            if (value.length > 0) {
                el.setAttribute('placeholder', '');
                if (syn.$v.regexs.mobilePhone.test(value) == true) {
                    if (value.length == 10) {
                        el.value = value.substr(0, 3).concat('-', value.substr(3, 3), '-', value.substr(6, 4));
                    } else if (value.length == 11) {
                        el.value = value.substr(0, 3).concat('-', value.substr(3, 4), '-', value.substr(7, 4));
                    } else {
                        el.value = '';
                    }
                } else {
                    el.value = '';
                }

                if (el.value == '') {
                    el.setAttribute('placeholder', '전화번호 확인 필요');
                }
            }
        },

        event_email_blur: function (e) {
            var el = e.target || e.srcElement || e;
            var value = el.value;

            if (el.value.length > 0) {
                el.setAttribute('placeholder', '');
                if (syn.$v.regexs.email.test(value) == false) {
                    el.setAttribute('placeholder', '이메일 확인 필요');
                    el.value = '';
                }
            }
        },

        event_year_blur: function (e) {
            var el = e.target || e.srcElement || e;
            if (el.value.length > 0) {
                el.setAttribute('placeholder', '');
                if (el.value == '0000' || $date.isDate(el.value) == false) {
                    el.setAttribute('placeholder', '년도 확인 필요');
                    el.value = '';
                }
            }
        },

        event_yearmonth_blur: function (e) {
            var el = e.target || e.srcElement || e;
            if (el.value.length > 0) {
                el.setAttribute('placeholder', '');
                if (el.value == '0000-00' || $date.isDate(el.value + '-01') == false) {
                    el.setAttribute('placeholder', '년월 확인 필요');
                    el.value = '';
                }
            }
        },

        event_date_blur: function (e) {
            var el = e.target || e.srcElement || e;
            if (el.value.length > 0) {
                el.setAttribute('placeholder', '');
                var value = el.value;
                if (value.length == 8) {
                    value = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8);
                }

                if ($date.isDate(value) == true) {
                    el.value = value;
                } else {
                    el.setAttribute('placeholder', '일자 확인 필요');
                    el.value = '';
                }
            }
        },

        event_juminno_blur: function (e) {
            var el = e.target || e.srcElement || e;
            var val = el.value;

            if (val.length > 0) {
                el.setAttribute('placeholder', '');
                if (syn.$v.regexs.juminNo.test(val) == false) {
                    el.setAttribute('placeholder', '주민등록번호 확인 필요');
                    el.value = '';
                }
                else {
                    if (val.length == 13) {
                        val = val.substring(0, 6) + '-' + val.substring(6, 13);
                    }
                    el.value = val;
                }
            }
        },

        event_businessno_blur: function (e) {
            var el = e.target || e.srcElement || e;
            var val = el.value;
            if (val.length > 0) {
                el.setAttribute('placeholder', '');
                if ($string.isBusinessNo(val) == false) {
                    el.setAttribute('placeholder', '사업자번호 확인 필요');
                    el.value = '';
                }
                else {
                    if (val.length != 12) {
                        val = val.replace(/-/gi, '');
                        val = val.substring(0, 3) + '-' + val.substring(3, 5) + '-' + val.substring(5);
                    }

                    el.value = val;
                }
            }
        },

        event_corporateno_blur: function (e) {
            var el = e.target || e.srcElement || e;
            var val = el.value;
            if (val.length > 0) {
                el.setAttribute('placeholder', '');
                if ($string.isCorporateNo(val) == false) {
                    el.setAttribute('placeholder', '법인번호 확인 필요');
                    el.value = '';
                }
                else {
                    if (val.length != 14) {
                        val = val.replace(/-/gi, '');
                        val = val.substring(0, 6) + '-' + val.substring(6);
                    }

                    el.value = val;
                }
            }
        },

        rangeMoveCaret: function (e) {
            var begin = 0;
            var end = 0;

            var el = e.target ? e.target : e;
            end = el.value.length;

            var moveCaret = () => {
                if (el.setSelectionRange) {
                    el.setSelectionRange(begin, end);
                } else if (el.createTextRange) {
                    var range = el.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', begin);
                    range.select();
                }
            };

            (syn.$b.isIE ? moveCaret : function () { setTimeout(moveCaret, 0) })();
        },

        getValue: function (elID) {
            var result = '';
            var el = syn.$l.get(elID);

            if (el) {
                var setting = JSON.parse(el.getAttribute('syn-options'));
                switch (setting.editType) {
                    case 'text':
                    case 'english':
                    case 'number':
                    case 'spinner':
                    case 'date':
                    case 'hour':
                    case 'minute':
                    case 'yearmonth':
                    case 'homephone':
                    case 'mobilephone':
                    case 'email':
                    case 'juminno':
                    case 'businessno':
                    case 'corporateno':
                        var mod = window[syn.$w.pageScript];
                        if (setting.getter === true && mod['frameEvent']) {
                            result = mod.hook.frameEvent('controlGetValue', {
                                elID: elID,
                                value: el.value
                            });

                            if ($object.isNullOrUndefined(result) == true) {
                                result = el.value;
                            }
                        }
                        else {
                            result = el.value;
                        }
                        break;
                    case 'numeric':
                        result = el.value.replace(/,/g, '');
                        break;
                    default:
                        result = '';
                        break;
                }
            }

            return result;
        },

        setValue: function (elID, value) {
            var el = syn.$l.get(elID);
            if (el) {
                if (value != undefined && value != null) {
                    var result = '';
                    var setting = JSON.parse(el.getAttribute('syn-options'));
                    switch (setting.editType) {
                        case 'text':
                        case 'english':
                        case 'number':
                        case 'spinner':
                        case 'date':
                        case 'hour':
                        case 'minute':
                        case 'yearmonth':
                        case 'homephone':
                        case 'mobilephone':
                        case 'email':
                        case 'juminno':
                        case 'businessno':
                        case 'corporateno':
                            var mod = window[syn.$w.pageScript];
                            if (setting && setting.setter === true && mod['frameEvent']) {
                                result = mod.hook.frameEvent('controlSetValue', {
                                    elID: elID,
                                    value: value
                                });

                                if ($object.isNullOrUndefined(result) == true) {
                                    el.value = result;
                                }
                            }
                            else {
                                el.value = value;
                            }
                            break;
                        case 'numeric':
                            if (value.indexOf(',') > -1) {
                                el.value = value;
                            }
                            else {
                                el.value = $string.isNumber(value) == true ? $string.toCurrency(value) : value;
                            }
                            break;
                        default:
                            el.value = '';
                            break;
                    }
                }
                else {
                    var triggerOptions = syn.$w.getTriggerOptions(elID);
                    if (triggerOptions && triggerOptions.value) {
                        el.value = triggerOptions.value;
                    }
                }
            }
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);
            if (el) {
                var options = JSON.parse(el.getAttribute('syn-options'));
                el.value = $ref.defaultValue(options.dataType);
            }
        },

        setLocale: function (elID, translations, control, options) {
            var el = syn.$l.get(elID);
            debugger;
            var bind = $resource.getBindSource(control, 'placeholder');
            if (bind != null) {
                var value = $resource.translateText(control, options);;
                el[bind] = value;

                if (bind == 'placeholder') {
                    var setting = JSON.parse(el.getAttribute('syn-options'));
                    if (setting) {
                        setting.placeText = value;
                        if ($ref.isEmpty(setting.placeText) == false) {
                            superplaceholder({
                                el: el,
                                sentences: $ref.isString(setting.placeText) == true ? [setting.placeText] : setting.placeText
                            });
                        }

                        el.setAttribute('syn-options', JSON.stringify(setting));
                    }
                }
                else if (bind == 'controlText') {
                    var setting = JSON.parse(el.getAttribute('syn-options'));
                    if (setting) {
                        setting.controlText = value;
                        el.setAttribute('syn-options', JSON.stringify(setting));
                    }
                }
            }
        }
    });
    syn.uicontrols.$textbox = $textbox;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    var $button = $button || new syn.module();

    $button.extend({
        name: 'syn.uicontrols.$button',
        version: '1.0',
        defaultSetting: {
            color: 'default',
            toQafControl: false,
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($button.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            if (setting.toQafControl == true) {
                var color = 'btn-{0}'.format(setting.color);
                if (syn.$m.hasClass(el, color) == false) {
                    syn.$m.addClass(el, 'btn');
                    syn.$m.addClass(el, color);
                }
            }

            el.setAttribute('syn-options', JSON.stringify(setting));

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = false;
            var el = syn.$l.get(elID);
            result = el.value;

            return result;
        },

        setValue: function (elID, value, meta) {
            var el = syn.$l.get(elID);
            el.value = value;
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);
            el.value = '';
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$button = $button;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $editor = syn.uicontrols.$editor || new syn.module();

    $editor.extend({
        name: 'syn.uicontrols.$editor',
        version: '1.0',
        contentHtmlUrl: syn.Config.SharedAssetUrl + 'html/content.html',
        defaultSetting: {
            width: '100%',
            height: '240px',
            contents: '',
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($editor.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            el.setAttribute('id', elID + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));

            if (syn.$l.get('htmlEditorOption') == null) {
                var popups = [];
                popups.push('<div id="textEditor_fontFamily" class="editorPop">');
                popups.push('<ul class="textEditor_fontFamily" elID="{0}">'.format(elID));
                popups.push('<li style="font-family: 굴림;" role="한국어" value="굴림">굴림</li>');
                popups.push('<li style="font-family: 돋움;" role="한국어" value="돋움">돋움</li>');
                popups.push('<li style="font-family: 맑은 고딕;" role="한국어" value="맑은 고딕">맑은 고딕</li>');
                popups.push('<li style="font-family: 궁서;" role="한국어" value="궁서">궁서</li>');
                popups.push('<li style="font-family: Arial;" role="영어" value="Arial">Arial</li>');
                popups.push('<li style="font-family: Verdana;" role="영어" value="Verdana">Verdana</li>');
                popups.push('<li style="font-family: Meiryo;" role="일본어" value="Meiryo">Meiryo</li>');
                popups.push('<li style="font-family: MS Song;" role="일본어" value="MS Song">MS Song</li>');
                popups.push('<li style="font-family: Simplified Arabic;" role="중국어" value="Simplified Arabic">Simplified Arabic</li>');
                popups.push('<li style="font-family: Mingliu;" role="중국어" value="Mingliu">Mingliu</li>');
                popups.push('</ul>');
                popups.push('</div>');
                popups.push('<div id="textEditor_fontSize" class="editorPop">');
                popups.push('<ul class="textEditor_fontSize" elID="{0}">'.format(elID));
                popups.push('<li style="font-size: 12px;" value="1">가나다라 (12px)</li>');
                popups.push('<li style="font-size: 13px;" value="2">가나다라 (13px)</li>');
                popups.push('<li style="font-size: 16px;" value="3">가나다라 (16px)</li>');
                popups.push('<li style="font-size: 18px;" value="4">가나다라 (18px)</li>');
                popups.push('<li style="font-size: 24px;" value="5">가나다라 (24px)</li>');
                popups.push('<li style="font-size: 32px;" value="6">가나다라 (32px)</li>');
                popups.push('<li style="font-size: 36px;" value="7">가나다라 (36px)</li>');
                popups.push('</ul>');
                popups.push('</div>');
                popups.push('<div id="textEditor_colorScheme" class="editorPop">');
                popups.push('<ul class="textEditor_colorScheme" elID="{0}">'.format(elID));
                popups.push('<li style="background: #000000;" value="#000000">#000000</li>');
                popups.push('<li style="background: #008ace;" value="#008ace">#008ace</li>');
                popups.push('<li style="background: #ff7700;" value="#ff7700">#ff7700</li>');
                popups.push('<li style="background: #64b41a;" value="#64b41a">#64b41a</li>');
                popups.push('<li style="background: #fee100;" value="#fee100">#fee100</li>');
                popups.push('<li style="background: #cc0000;" value="#cc0000">#cc0000</li>');
                popups.push('<li style="background: #ef4423;" value="#ef4423">#ef4423</li>');
                popups.push('<li style="background: #34526f;" value="#34526f">#34526f</li>');
                popups.push('<li style="background: #00a0d1;" value="#00a0d1">#00a0d1</li>');
                popups.push('<li style="background: #21759b;" value="#21759b">#21759b</li>');
                popups.push('<li style="background: #d54e21;" value="#d54e21">#d54e21</li>');
                popups.push('<li style="background: #464646;" value="#464646">#464646</li>');
                popups.push('<li style="background: #5e8b1d;" value="#5e8b1d">#5e8b1d</li>');
                popups.push('<li style="background: #0060a3;" value="#0060a3">#0060a3</li>');
                popups.push('<li style="background: #f7f7f7;" value="#f7f7f7">#f7f7f7</li>');
                popups.push('</ul>');
                popups.push('</div>');

                syn.$m.append(document.body, 'div', 'htmlEditorOption', { display: 'none' });
                syn.$l.get('htmlEditorOption').innerHTML = popups.join('');
            }

            var elButtonID = 'btn_qafeditor_{0}'.format(elID);
            var data =
                '<div>' +
                '<div class="buttonGroup">' +
                '<button type="button" class="txtBtn icon-save" id="{0}_fontfamily" value="font-family" command="fontname" option="fontFamily" class="textEditorIcon font" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_fontsize" value="font-size" command="fontsize" option="fontSize" class="textEditorIcon size" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_cut" value="Cut" command="cut" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_copy" value="Copy" command="copy" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_paste" value="Paste" command="paste" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_bold" value="Bold" command="bold" class="textEditorIcon bold" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_italic" value="Italic" command="italic" class="textEditorIcon italic" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_underline" value="Underline" command="underline" class="textEditorIcon underline" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_strike" value="&lt;s&gt;" command="strikethrough" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_hr" value="&lt;hr /&gt;" command="inserthorizontalrule" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_undo" value="Undo" command="undo" class="textEditorIcon undo" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_redo" value="Redo" command="redo" class="textEditorIcon redo" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_bgcolor" value="bgcolor" command="backcolor" option="colorScheme" class="textEditorIcon forecolor" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_fgcolor" value="fgcolor" command="forecolor" option="colorScheme" class="textEditorIcon backcolor" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_left" value="left" command="justifyleft" class="textEditorIcon jleft" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_right" value="right" command="justifyright" class="textEditorIcon jright" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_center" value="center" command="justifycenter" class="textEditorIcon jcenter" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_justify" value="justify" command="justifyfull" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_ol" value="&lt;ol&gt;" command="insertorderedlist" class="textEditorIcon ol" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_ul" value="&lt;ul&gt;" command="insertunorderedlist" class="textEditorIcon ul" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_p" value="&lt;p&gt;" command="insertparagraph" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_indent" value="indent" command="indent" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_outdent" value="outdent" command="outdent" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_del" value="del" command="delete" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_image" value="&lt;img /&gt;" command="insertimage" class="textEditorIcon image" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_link" value="&lt;a&gt;" command="createLink" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_unlink" value="unlink" command="unlink" />'.format(elButtonID) +
                '</div>' +
                '<div class="qaf__texteditor__form">' +
                '<iframe id="{0}" class="ui_editor" style="overflow:auto; width:{1}; height: {2}" src="{3}" syn-options="{dataType: \'string\', belongID: \'{4}\'}" scrolling="yes">'.format(elID, setting.width, setting.height, $editor.contentHtmlUrl, setting.belongID) +
                '{0}'.format(setting.contents) +
                '</iframe>' +
                '</div>' +
                '</div>';
            el.innerHTML = data;

            var buttons = syn.$l.querySelectorAll('[id*=\'' + elID + '_editbutton\']');
            for (var i = 0; i < buttons.length; i++) {
                syn.$l.addEvent(buttons[i], 'click', function (e) {
                    var el = e.target || e.srcElement || e;
                    var iframe = syn.$l.get(el.id.replace('_editbutton', ''));
                    var command = el.getAttribute('command');
                    var bool = false;
                    var option = el.getAttribute('option') || null;

                    $editor.execCommand(iframe.id, command, option);

                    el = null;
                    iframe = null;
                    command = null;
                    bool = null;
                    option = null;
                });
            }

            var list = syn.$l.querySelectorAll('#textEditor_fontFamily li', '#textEditor_fontSize li', '#textEditor_colorScheme li');
            for (var i = 0; i < list.length; i++) {
                syn.$l.addEvent(list[i], 'click', function (e) {
                    var el = e.target || e.srcElement || e;
                    var value = {};
                    value.elID = el.parentElement.getAttribute('elID');
                    value.option = el.getAttribute('value');

                    syn.$w.closeDialog(value);
                });
            }

            var el = syn.$l.get(elID);
            el.onload = () => {
                $editor.setValue(elID, setting.contents);
            }

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        // execCommand 명령어입니다. command는 http://www.quirksmode.org/dom/execCommand.html 참조
        execCommand: function (el, command, option) {
            if ($ref.isString(el) == true) {
                el = syn.$l.get(el);
            }
            var bool = false;

            el.contentWindow.focus();
            if (command.toLowerCase() == 'insertimage') {
                if (option) {
                    $editor.insertImage(el, option);
                } else {

                }
            } else {
                if (option) {
                    var dialogOptions = $ref.clone(syn.$w.dialogOptions);

                    var isPopupOpen = true;
                    switch (option) {
                        case 'fontFamily':
                            dialogOptions.minWidth = 160;
                            dialogOptions.minHeight = 240;
                            break;
                        case 'fontSize':
                            dialogOptions.minWidth = 280;
                            dialogOptions.minHeight = 200;
                            break;
                        case 'colorScheme':
                            dialogOptions.minWidth = 160;
                            dialogOptions.minHeight = 81;
                            break;
                        default:
                            isPopupOpen = false;
                            break;
                    }

                    if (isPopupOpen == true) {
                        $editor.selection = el.contentWindow.getSelection();
                        if ($editor.selection) {
                            $editor.range = $editor.selection.getRangeAt(0);
                        } else {
                            $editor.range = el.contentDocument.createRange();
                        }

                        syn.$w.showDialog(syn.$l.get('textEditor_' + option), dialogOptions, function (value) {
                            if (value) {
                                if ($editor.range && syn.$b.isIE) {
                                    if ($editor.selection) {
                                        $editor.selection.removeAllRanges();
                                        $editor.selection.addRange($editor.range);
                                    }
                                }

                                var el = syn.$l.get(value.elID);
                                el.contentDocument.execCommand(command, false, value.option);
                                if (command.toLowerCase() == 'fontsize') {
                                    var fontSize = { 1: 12, 2: 13, 3: 16, 4: 18, 5: 24, 6: 32, 7: 36 };
                                    var fontArray = el.contentDocument.getElementsByTagName('font');
                                    var size = '';
                                    for (var i = 0; i < fontArray.length; i++) {
                                        size = fontArray[i].getAttribute('size');
                                        if (size) {
                                            fontArray[i].removeAttribute('size');
                                            fontArray[i].style.fontSize = fontSize[size] + 'px';
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        if (command.toLowerCase() == 'backcolor') {
                            if (syn.$b.isIE == true) {
                                el.contentDocument.execCommand("hilitecolor", false, option);
                            } else {
                                el.contentDocument.execCommand("backcolor", false, option);
                            }

                        } else {
                            el.contentDocument.execCommand(command, bool, option);
                        }
                    }

                } else {
                    el.contentDocument.execCommand(command, bool, option);
                }
            }
        },

        insertImage: function (el, imageUrl) {
            if ($ref.isString(el) == true) {
                el = syn.$l.get(el);
            }

            el.focus();
            var sel = el.contentDocument.selection;
            if (sel) {
                var textRange = sel.createRange();
                el.contentDocument.execCommand('insertImage', false, imageUrl);
                textRange.collapse(false);
                textRange.select();
                textRange = null;
            } else {
                el.contentDocument.execCommand('insertImage', false, imageUrl);
            }
        },

        insertHTML: function (el, html) {
            if ($ref.isString(el) == true) {
                el = syn.$l.get(el);
            }

            el.focus();
            var sel = el.contentDocument.selection;
            if (sel) {
                var textRange = sel.createRange();
                el.contentDocument.execCommand('insertHTML', false, html);
                textRange.collapse(false);
                textRange.select();
                textRange = null;
            } else {
                el.contentDocument.execCommand('insertHTML', false, html);
            }
        },

        stripScripts: function (html) {
            var div = document.createElement('div');
            div.innerHTML = html;
            var scripts = div.getElementsByTagName('script');
            var i = scripts.length;
            while (i--) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }

            return div.innerHTML;
        },

        getValue: function (elID) {
            var el = syn.$l.get(elID);
            return $editor.stripScripts(el.contentDocument.body.innerHTML);
        },

        setValue: function (elID, value) {
            var el = syn.$l.get(elID);

            el.contentDocument.body.innerHTML = value;
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);

            el.contentDocument.body.innerHTML = '';
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$editor = $editor;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (context) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $htmleditor = syn.uicontrols.$htmleditor || new syn.module();

    $htmleditor.extend({
        name: 'syn.uicontrols.$htmleditor',
        version: '1.0',
        businessID: '',
        editorControls: [],
        defaultSetting: {
            businessID: '',
            selector: '',
            fileManagerServer: '',
            repositoryID: null,
            dependencyID: null,
            relative_urls: false,
            remove_script_host: false,
            convert_urls: false,
            isNumberTempDependency: true,
            isQafRepositoryID: true, // syn.config.js의 ApplicationID 3 자리 + ProjectID 3 자리 + FileServerType 1자리로 7자리를 구성
            height: 300,
            imageFileSizeLimit: 300000,
            viewerHtml: '<html><head><base href="/"><style type="text/css">body { font-family: \'맑은 고딕\', 돋움체; font-size: 12px; }</style><link type="text/css" rel="stylesheet" href="/assets/bundle/lib/tinymce-5.6.0/skins/ui/oxide/content.min.css"><link type="text/css" rel="stylesheet" href="/assets/bundle/lib/tinymce-5.6.0/skins/content/default/content.min.css"></head><body id="tinymce" class="mce-content-body">{0}<script>document.onselectstart = () => { return false; }; document.oncontextmenu = () => { return false; }; document.addEventListener && document.addEventListener("click", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === "A" && !(e.ctrlKey && !e.altKey)) {e.preventDefault();}}}, false);</script></body></html>',
            language: 'ko_KR',
            // plugins: [
            //     'autolink link image lists print preview hr anchor pagebreak',
            //     'searchreplace visualblocks visualchars code insertdatetime media nonbreaking',
            //     'table template paste powerpaste export powerpaste advcode help'
            // ],
            plugins: ['autolink link image lists print hr anchor pagebreak searchreplace visualblocks visualchars code insertdatetime media nonbreaking table paste advcode help'],
            // toolbar: 'styleselect | bold italic forecolor backcolor table | alignleft aligncenter alignright | bullist numlist outdent indent | link image media | preview export code help',
            toolbar: 'styleselect | bold italic forecolor backcolor table | alignleft aligncenter alignright | link image | code help',
            menubar: false, // 'file edit view insert format tools table help',
            content_style: 'body { font-family: \'맑은 고딕\', 돋움체; font-size: 12px; }',
            powerpaste_word_import: 'merge',
            powerpaste_googledocs_import: 'merge',
            defaultHtmlContent: null,
            table_default_attributes: { 'border': '1', 'width': '100%' },
            table_default_styles: { 'border-collapse': 'collapse', 'width': '100%' },
            table_responsive_width: false,
            limitTableWidth: null,
            verify_html: false,
            table_sizing_mode: 'fixed',
            images_file_types: 'jpeg,jpg,png,gif,bmp,webp,JPEG,JPG,PNG,GIF,BMP,WEBP',
            paste_data_images: true,
            resize: false,
            allowExternalLink: false,
            prefixHtml: '',
            suffixHtml: '',
            limitGuideLineWidth: '',
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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($htmleditor.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            if ($string.isNullOrEmpty(setting.repositoryID) == false) {
                if (syn.Config.FileBusinessIDSource && syn.Config.FileBusinessIDSource != 'None') {
                    if (syn.Config.FileBusinessIDSource == 'Cookie') {
                        $htmleditor.businessID = syn.$r.getCookie('FileBusinessID');
                    }
                    else if (syn.Config.FileBusinessIDSource == 'SessionStorage') {
                        $htmleditor.businessID = syn.$w.getStorage('FileBusinessID');
                    }
                }

                if ($string.isNullOrEmpty($htmleditor.businessID) == true) {
                    $htmleditor.businessID = syn.$w.SSO.WorkCompanyNo;
                }

                if ($string.isNullOrEmpty($htmleditor.businessID) == true) {
                    syn.$l.eventLog('$htmleditor.controlLoad', '파일 컨트롤 초기화 오류, 파일 업무 ID 정보 확인 필요', 'Warning');
                    return;
                }

                if (setting.isQafRepositoryID == true) {
                    if (setting.repositoryID && setting.repositoryID.length > 7) {
                        setting.repositoryID = syn.Config.ApplicationID + syn.Config.ProjectID + syn.Config.FileServerType + setting.repositoryID.substring(7);
                    }
                }

                if (syn.Config && syn.Config.FileManagerServer) {
                    setting.fileManagerServer = syn.Config.FileManagerServer;
                }

                if ($string.isNullOrEmpty(setting.fileManagerServer) == true) {
                    syn.$l.eventLog('$htmleditor.fileManagerServer', 'HTML 편집기 업로드 초기화 오류, 파일 서버 정보 확인 필요', 'Debug');
                    return;
                }

                if ($string.isNullOrEmpty(setting.dependencyID) == true) {
                    if (setting.isNumberTempDependency == true) {
                        setting.dependencyID = $date.toTicks(new Date()).toString();
                    }
                    else {
                        setting.dependencyID = syn.uicontrols.$fileclient.getTemporaryDependencyID(elID);
                    }
                }

                setting.paste_preprocess = function (plugin, args) {
                    // console.log(args.content);
                    // debugger;
                    // $this.blobUrlToString(args.content.substring(10, args.content.length - 2));
                    // args.content += ' preprocess';
                };

                setting.paste_postprocess = function (plugin, args) {
                    if (args.node.firstElementChild && args.node.firstElementChild.tagName == 'TABLE' && (args.mode && args.mode == 'merge') == false) {
                        var table = args.node.firstElementChild;
                        table.border = '1';
                        table.cellspacing = '0';
                        table.cellpadding = '0';
                        syn.$m.setStyle(table, 'border-collapse', 'collapse');

                        var headers = table.querySelectorAll('thead tr:first-child td');
                        var headerLength = headers.length;
                        if (headerLength > 0) {
                            for (var i = 0; i < headerLength; i++) {
                                var header = headers[i];
                                syn.$m.setStyle(header, 'background-color', '#ecf0f1');
                            }
                        }
                        else {
                            headers = table.querySelectorAll('tr:first-child td');
                            headerLength = headers.length;
                            if (headerLength > 0) {
                                for (var i = 0; i < headerLength; i++) {
                                    var header = headers[i];
                                    syn.$m.setStyle(header, 'background-color', '#ecf0f1');
                                }
                            }
                        }
                    }
                };

                setting.images_upload_handler = function (file, success, failure) {
                    var uploadHandler = function (blobInfo, success, failure) {
                        var xhr = syn.$w.xmlHttp();
                        xhr.withCredentials = false;

                        var targetUrl = setting.fileManagerServer + '/api/filemanager/UploadFile?RepositoryID={0}&DependencyID={1}'.format(setting.repositoryID, setting.dependencyID);

                        if ($string.isNullOrEmpty($htmleditor.businessID) == false) {
                            targetUrl = targetUrl + '&businessID=' + $htmleditor.businessID;
                        }

                        xhr.open('POST', targetUrl);
                        xhr.onload = () => {
                            if (xhr.status != 200) {
                                var error = 'HTTP Error code: {0}, text: {1}'.format(xhr.status, xhr.statusText);
                                syn.$l.eventLog('$htmleditor.images_upload_handler', error, 'Warning');
                                failure(error);
                                return;
                            }

                            try {
                                var response = JSON.parse(xhr.responseText);

                                if (response && response.Result == true) {
                                    syn.$r.path = setting.fileManagerServer + '/api/filemanager/ActionHandler';
                                    syn.$r.params['action'] = 'GetItem';
                                    syn.$r.params['repositoryID'] = setting.repositoryID;
                                    syn.$r.params['itemID'] = response.ItemID;

                                    if ($string.isNullOrEmpty($htmleditor.businessID) == false) {
                                        syn.$r.params['businessID'] = $htmleditor.businessID;
                                    }

                                    var xhrGetItem = new syn.$w.xmlHttp();
                                    xhrGetItem.onreadystatechange = () => {
                                        if (xhrGetItem.readyState === XMLHttpRequest.DONE) {
                                            if (xhrGetItem.status === 200) {
                                                var result = JSON.parse(xhrGetItem.responseText);
                                                // response.location = setting.fileManagerServer + '/api/filemanager/HttpDownloadFile?RepositoryID={0}&ItemID={1}'.format(setting.repositoryID, response.ItemID);
                                                response.location = result.AbsolutePath;
                                                success(response.location);

                                                setTimeout(function () {
                                                    var uploadedImage = tinymce.activeEditor.$('img[src$="' + response.location + '"]')
                                                    if (uploadedImage.length > 0) {
                                                        var width = blobInfo.width;
                                                        var height = blobInfo.height;

                                                        tinymce.activeEditor.dom.setStyle(uploadedImage, 'width', width);
                                                        tinymce.activeEditor.dom.setStyle(uploadedImage, 'height', height);

                                                        uploadedImage.attr('width', width);
                                                        uploadedImage.attr('height', height);

                                                        uploadedImage.after('&nbsp;');
                                                    }
                                                }, 100);
                                            }
                                            else {
                                                syn.$l.eventLog('$htmleditor.images_upload_handler', 'async url: ' + url + ', status: ' + xhrGetItem.status.toString() + ', responseText: ' + xhrGetItem.responseText, 'Error');
                                            }
                                        }
                                    };

                                    xhrGetItem.open('GET', syn.$r.url(), true);
                                    xhrGetItem.send();
                                } else {
                                    var error = response.Message;
                                    syn.$w.alert('이미지 업로드 실패: {0}'.format(error));
                                    syn.$l.eventLog('$htmleditor.images_upload_handler', error, 'Warning');
                                    failure(error);
                                    return;
                                }
                            } catch (error) {
                                syn.$w.alert('이미지 업로드 오류: {0}'.format(error.message));
                                syn.$l.eventLog('$htmleditor.images_upload_handler', error, 'Warning');
                                failure(error);
                            }
                        };

                        xhr.onerror = () => {
                            var error = 'HTTP Error code: {0}, text: {1}'.format(xhr.status, xhr.statusText);
                            syn.$l.eventLog('$htmleditor.images_upload_handler', error, 'Warning');
                            failure(error);
                        };

                        var formData = new FormData();
                        formData.append('file', blobInfo.blob, blobInfo.fileName);
                        xhr.send(formData);
                    }

                    var fileSize = file.blob().size;
                    if (setting.imageFileSizeLimit < fileSize) {
                        var message = '에디터에 표시 가능한 이미지 파일크기는 {0} 미만입니다'.format($number.toByte(setting.imageFileSizeLimit));
                        syn.$w.alert(message);

                        var blobUri = file.blobUri();
                        syn.$r.revokeBlobUrl(blobUri);
                        failure(message);

                        var tempImage = tinymce.activeEditor.$('img[src$="' + blobUri + '"]')
                        if (tempImage.length > 0) {
                            tempImage.remove();
                        }
                    }
                    else {
                        try {
                            var mod = window[syn.$w.pageScript];
                            var eventHandler = mod['{0}_beforeUploadImageResize'.format(elID)];
                            if (eventHandler) {
                                // txtCONTENTS_beforeUploadImageResize: function (elID, blobInfo, callback) {
                                //     $this.$htmleditor.resizeImage(blobInfo, 320).then(function (adjustBlob) {
                                //         callback(adjustBlob);
                                // 
                                //         var editor = $this.$htmleditor.getHtmlEditor(elID);
                                //         editor.execCommand('mceRepaint');
                                //     });
                                // },
                                eventHandler.apply(el, [elID, file, function (adjustBlobInfo) {
                                    uploadHandler({
                                        blob: adjustBlobInfo.blob,
                                        width: adjustBlobInfo.width,
                                        height: adjustBlobInfo.height,
                                        fileName: file.filename()
                                    }, success, failure);
                                }]);
                            }
                            else {
                                $htmleditor.resizeImage(file.blob(), 0).then(function (adjustBlob) {
                                    uploadHandler({
                                        blob: adjustBlobInfo.blob,
                                        width: adjustBlobInfo.width,
                                        height: adjustBlobInfo.height,
                                        fileName: file.filename()
                                    }, success, failure);

                                    var editor = $this.$htmleditor.getHtmlEditor(elID);
                                    editor.execCommand('mceRepaint');
                                });
                            }
                        } catch (error) {
                            syn.$l.eventLog('$htmleditor.images_upload_handler', error.toString(), 'Error');
                        }
                    }
                };
            }
            else {
                syn.$l.eventLog('$htmleditor.fileManagerServer', 'HTML 편집기 파일 업로드 초기화 오류, repositoryID 정보 확인 필요', 'Debug');
                return;
            }

            setting.width = el.style.width || 320;
            setting.height = el.style.height || 240;

            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var parent = el.parentNode;
            var wrapper = document.createElement('div');
            wrapper.style.width = setting.width
            wrapper.style.height = setting.height
            wrapper.id = elID;
            wrapper.innerHTML = $string.isNullOrEmpty(el.innerHTML) == true ? '<div></div>' : el.innerHTML;

            parent.appendChild(wrapper);
            setting.selector = '#' + elID;

            setting.init_instance_callback = function (editor) {
                var el = syn.$l.get(elID);
                var setInitValue = el.getAttribute('setInitValue');
                if (setInitValue) {
                    editor.setContent(setInitValue);
                }

                editor.on('keydown', function (e) {
                    var key = e.keyCode || e.which;

                    if (key == 9) {
                        editor.execCommand('mceInsertContent', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
                        tinymce.dom.Event.cancel(e);
                        e.preventDefault();
                        return;
                    }
                });

                editor.on('ObjectResized', function (e) {
                    if (e.target.nodeName == 'TABLE') {
                        var table = e.target;
                        if ($string.isNullOrEmpty(setting.limitTableWidth) == false && setting.limitTableWidth < table.style.width) {
                            table.style.width = setting.limitTableWidth;
                        }

                        if ($string.isNullOrEmpty(table.style.width) == false) {
                            table.setAttribute('width', table.style.width);
                        }

                        if ($string.isNullOrEmpty(table.style.height) == false) {
                            table.setAttribute('height', table.style.height);
                        }

                        var tds = e.target.querySelectorAll('td');
                        var length = tds.length;
                        for (var i = 0; i < length; i++) {
                            var td = tds[i];
                            if ($string.isNullOrEmpty(td.style.width) == false) {
                                td.setAttribute('width', td.style.width);
                            }

                            if ($string.isNullOrEmpty(td.style.height) == false) {
                                td.setAttribute('height', td.style.height);
                            }
                        }
                    }

                    if (e.target.nodeName == 'IMG') {
                        var selectedImage = tinymce.activeEditor.selection.getNode();

                        var mod = window[syn.$w.pageScript];
                        var eventHandler = mod['{0}_imageResized'.format(elID)];
                        if (eventHandler) {
                            // txtCONTENTS_imageResized: function (elID, evt, editor, selectedImage) {
                            //     if (evt.width > 600) {
                            //         var ratio = (evt.width / evt.height);
                            //         evt.width = 600;
                            //         evt.height = parseFloat(evt.width / ratio);
                            //         tinymce.activeEditor.dom.setStyle(selectedImage, 'width', evt.width);
                            //         tinymce.activeEditor.dom.setStyle(selectedImage, 'height', evt.height);
                            // 
                            //         selectedImage.setAttribute('width', evt.width);
                            //         selectedImage.setAttribute('height', evt.height);
                            //     }
                            // }
                            eventHandler.apply(el, [elID, e, editor, selectedImage]);
                        }
                    }
                });

                if ($string.isNullOrEmpty(setting.defaultHtmlContent) == false) {
                    editor.setContent(setting.defaultHtmlContent);
                }

                $htmleditor.editorControls.push({
                    id: elID,
                    editor: editor,
                    setting: $ref.clone(setting)
                });

                if (setting.readonly == true) {
                    Array.from(editor.getDoc().querySelectorAll('a')).map(function (el) {
                        el.target = '_blank';
                    });
                }

                if (setting.readonly == true && setting.allowExternalLink == true) {
                    Array.from(editor.getDoc().querySelectorAll('.mce-object-iframe')).map(function (el) {
                        el.setAttribute('data-mce-selected', '2');
                    });
                }

                var mod = window[syn.$w.pageScript];
                var eventHandler = mod['{0}_documentReady'.format(elID)];
                if (eventHandler) {
                    eventHandler.apply(el, [elID, editor]);
                }
            };

            tinymce.init(setting);
            if ($string.isNullOrEmpty(setting.limitGuideLineWidth) == false) {
                syn.$l.get(elID).controlPseudoStyle(' + div .tox-edit-area:after', '{content: "";width: 2px;height: 100%;background: #EF4444 repeat-y;top: 0px;left: {0};position: absolute;display: inline-block;}'.format(setting.limitGuideLineWidth))
            }

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        resizeImage: function (file, maxSize) {
            var reader = new FileReader();
            var image = new Image();
            var canvas = document.createElement('canvas');
            var dataURItoBlob = function (dataURI) {
                var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
                    atob(dataURI.split(',')[1]) :
                    unescape(dataURI.split(',')[1]);
                var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var max = bytes.length;
                var ia = new Uint8Array(max);
                for (var i = 0; i < max; i++)
                    ia[i] = bytes.charCodeAt(i);
                return new Blob([ia], { type: mime || 'image/jpeg' });
            };
            var resize = () => {
                var width = image.width;
                var height = image.height;
                if (width > height) {
                    if (maxSize <= 0) {
                        maxSize = 600;
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    }
                    else {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    }
                } else {
                    if (maxSize <= 0) {
                        maxSize = 600;
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }
                    else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/jpeg');
                return {
                    blob: dataURItoBlob(dataUrl),
                    width: width,
                    height: height,
                };
            };
            return new Promise(function (success, failure) {
                var blob = file.blob();
                if (!blob.type.match(/image.*/)) {
                    failure(new Error("이미지 파일 확인 필요"));
                    return;
                }
                reader.onload = function (readerEvent) {
                    image.onload = () => { return success(resize()); };
                    image.src = readerEvent.target.result;
                };
                reader.readAsDataURL(blob);
            });
        },

        getHtmlEditor: function (elID) {
            var editor = null;

            var length = $htmleditor.editorControls.length;
            for (var i = 0; i < length; i++) {
                var item = $htmleditor.editorControls[i];
                if (item.id == elID) {
                    editor = item.editor;
                    break;
                }
            }

            return editor;
        },

        getHtmlSetting: function (elID) {
            var setting = null;

            var length = $htmleditor.editorControls.length;
            for (var i = 0; i < length; i++) {
                var item = $htmleditor.editorControls[i];
                if (item.id == elID) {
                    setting = item.setting;
                    break;
                }
            }

            return setting;
        },

        // mode - design, readonly
        setMode: function (elID, mode) {
            var editor = $htmleditor.getHtmlEditor(elID);
            if (editor) {
                editor.setMode(mode);
            }
        },

        insertContent: function (elID, content) {
            var editor = $htmleditor.getHtmlEditor(elID);
            if (editor) {
                editor.insertContent(content);
            }
        },

        // https://www.tiny.cloud/docs-3x/reference/TinyMCE3x@Command_identifiers/
        execCommand: function (elID, command, uiState, value, args) {
            var result = false;
            var editor = $htmleditor.getHtmlEditor(elID);
            if (editor) {
                if ($object.isNullOrUndefined(uiState) == true) {
                    uiState = false;
                }
                result = editor.execCommand(command, uiState, value, args);
            }

            return result;
        },

        isDirty: function (elID) {
            var result = false;
            var editor = $htmleditor.getHtmlEditor(elID);
            if (editor) {
                result = editor.isDirty();
            }

            return result;
        },

        updateDependencyID: function (elID, targetDependencyID, callback) {
            var setting = $htmleditor.getHtmlSetting(elID);
            syn.$r.path = setting.fileManagerServer + '/api/filemanager/ActionHandler';
            syn.$r.params['action'] = 'UpdateDependencyID';
            syn.$r.params['repositoryID'] = setting.repositoryID;
            syn.$r.params['sourceDependencyID'] = setting.dependencyID;
            syn.$r.params['targetDependencyID'] = targetDependencyID;

            syn.uicontrols.$fileclient.executeProxy(syn.$r.url(), callback);
        },

        getDependencyID: function (elID) {
            var val = '';
            var setting = $htmleditor.getHtmlSetting(elID);
            if (setting) {
                val = setting.dependencyID;
            }

            return val;
        },

        setDependencyID: function (elID, dependencyID) {
            var setting = $htmleditor.getHtmlSetting(elID);
            if (setting) {
                setting.dependencyID = dependencyID;
            }
        },

        getValue: function (elID, meta) {
            var result = null;
            var editor = $htmleditor.getHtmlEditor(elID);
            if (editor) {
                result = editor.getContent();
                var setting = $htmleditor.getHtmlSetting(elID);
                if ($string.isNullOrEmpty(setting.limitTableWidth) == false) {
                    var tables = result.match(/<table[^>]*>(.*?)/gmi);
                    if ($string.isNullOrEmpty(tables) == false) {
                        for (var i = 0; i < tables.length; i++) {
                            var html = tables[i];
                            if (html.indexOf('width=') == -1) {
                                result = result.replace(html, html.substring(0, (html.length - 1)) + ' width="{0}">'.format(setting.limitTableWidth))
                            }
                        }
                    }
                }

                if ($string.isNullOrEmpty(setting.prefixHtml) == false) {
                    result = setting.prefixHtml + result;
                }

                if ($string.isNullOrEmpty(setting.suffixHtml) == false) {
                    result = result + setting.suffixHtml;
                }
            }

            result = result.replace(/&amp;/gm, '&');
            result = result.replace(/\<p\>\<\/p\>/gm, '\<p\>&nbsp;\<\/p\>');
            result = result.replace(/\<p style="text-align: left;"\>\<\/p\>/gm, '\<p style="text-align: left;"\>&nbsp;\<\/p\>');
            result = result.replace(/\<p style="text-align: center;"\>\<\/p\>/gm, '\<p style="text-align: center;"\>&nbsp;\<\/p\>');
            result = result.replace(/\<p style="text-align: right;"\>\<\/p\>/gm, '\<p style="text-align: right;"\>&nbsp;\<\/p\>');

            return result;
        },

        setValue: function (elID, value, meta) {
            var editor = $htmleditor.getHtmlEditor(elID);

            var controlOptions = syn.$l.get('{0}_hidden'.format(elID)).getAttribute('syn-options');
            if ($object.isNullOrUndefined(controlOptions) == false) {
                var setting = JSON.parse(controlOptions);
                if ($string.isNullOrEmpty(setting.prefixHtml) == false) {
                    if ($string.isNullOrEmpty(setting.prefixHtml) == false && value.startsWith(setting.prefixHtml) == true) {
                        value = value.replace(setting.prefixHtml, '');
                    }
                }

                if ($string.isNullOrEmpty(setting.suffixHtml) == false) {
                    if ($string.isNullOrEmpty(setting.suffixHtml) == false && value.endsWith(setting.suffixHtml) == true) {
                        value = value.replace(setting.suffixHtml, '');
                    }
                }
            }

            if (editor) {
                editor.setContent(value);
            }
            else {
                syn.$l.get(elID).setAttribute("setInitValue", value);
            }
        },

        clear: function (elID, isControlLoad) {
            var editor = $htmleditor.getHtmlEditor(elID);
            if (editor) {
                editor.setContent('');
            }
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$htmleditor = $htmleditor;
})(globalThis);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $tree = syn.uicontrols.$tree || new syn.module();

    $tree.extend({
        name: 'syn.uicontrols.$tree',
        version: '1.0',
        treeControls: [],
        eventHooks: [
            'blurTree',
            'focusTree',
            'activate',
            'beforeActivate',
            'beforeExpand',
            'beforeSelect',
            'blur',
            'click',
            'collapse',
            'createNode',
            'dblclick',
            'expand',
            'focus',
            'keydown',
            'keypress',
            'select'
        ],
        defaultSetting: {
            width: '100%',
            height: '300px',
            itemID: 'id',
            parentItemID: 'parentID',
            childrenID: 'children',
            reduceMap: {
                key: 'key',
                title: 'title',
                parentID: 'parentID',
                folder: 'folder',
                icon: false
            },
            toggleEffect: false,
            checkbox: false,
            extensions: ['persist', 'multi', 'filter'], // https://github.com/mar10/fancytree/wiki/ExtensionIndex
            persist: {
                expandLazy: false,
                expandOpts: {
                    noAnimation: false,
                    noEvents: false
                },
                overrideSource: true,
                store: 'session',
                types: 'active expanded focus selected'
            },
            multi: {
                mode: 'sameParent'
            },
            filter: {
                counter: false,
                mode: 'hide'
            },
            source: [],
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
            var el = syn.$l.get(elID);

            $tree.defaultSetting.persist = false;
            $tree.defaultSetting.multi = false;

            setting = syn.$w.argumentsExtend($tree.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod['controlInit']) {
                var moduleSettings = mod['controlInit'](elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            setting.width = el.style.width || setting.width;
            setting.height = el.style.height || setting.height;

            el.setAttribute('id', elID + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var hookEvents = el.getAttribute('syn-events');
            try {
                if (hookEvents) {
                    hookEvents = eval(hookEvents);
                }
            } catch (error) {
                syn.$l.eventLog('TreeView_controlLoad', error.toString(), 'Debug');
            }

            for (var i = 0; i < hookEvents.length; i++) {
                var hookEvent = hookEvents[i];
                if ($tree.eventHooks.indexOf(hookEvent) > -1) {
                    if ($object.isNullOrUndefined(setting[hookEvent]) == true) {
                        setting[hookEvent] = function (evt, data) {
                            var eventName = $tree.eventHooks.find(function (item) { return item.toLowerCase() == evt.type.replace('fancytree', '') });
                            var mod = window[syn.$w.pageScript];
                            if (mod) {
                                var eventHandler = mod['{0}_{1}'.format(elID, eventName)];
                                if (eventHandler) {
                                    eventHandler.apply(syn.$l.get(elID), [evt, data]);
                                }
                            }
                        }
                    }
                }
            }

            var parent = el.parentNode;
            var wrapper = document.createElement('div');
            wrapper.style.width = setting.width;
            wrapper.style.height = setting.height;
            wrapper.className = 'tree-container border';
            wrapper.innerHTML = '<div id="' + elID + '"></div>';
            parent.appendChild(wrapper);

            $tree.treeControls.push({
                id: elID,
                element: $('#' + elID).fancytree(setting),
                tree: $.ui.fancytree.getTree('#' + elID),
                config: setting
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = null;
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                var setting = $tree.getControl(elID).config;
                var map = setting.reduceMap;
                var jsonRoot = tree.toDict(true);
                var flatValue = syn.$l.nested2Flat(jsonRoot, setting.itemID, setting.parentItemID, setting.childrenID);

                var reduceSource = [];
                var length = flatValue.length;
                for (var i = 0; i < length; i++) {
                    var item = flatValue[i];

                    var dataItem = item.data;
                    if (dataItem) {
                        dataItem[map.key] = item.key;
                        dataItem[map.title] = item.title;
                        dataItem[map.parentID] = item.parentID;
                        dataItem[map.folder] = item.folder;
                        reduceSource.push(dataItem);
                    }
                }

                result = reduceSource;
            }
            return result;
        },

        setValue: function (elID, value, meta) {
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                var setting = $tree.getControl(elID).config;
                var map = setting.reduceMap;
                var reduceSource = [];
                var length = value.length;
                for (var i = 0; i < length; i++) {
                    var item = value[i];

                    reduceSource.push({
                        key: item[map.key],
                        title: item[map.title],
                        parentID: item[map.parentID],
                        folder: $string.toBoolean(item[map.folder]),
                        icon: false,
                        data: $ref.clone(item, false)
                    });
                }

                var nestedValue = syn.$l.flat2Nested(reduceSource, setting.itemID, setting.parentItemID, setting.childrenID);
                tree.reload([nestedValue]);
            }
        },

        clear: function (elID, isControlLoad) {
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                tree.reload([]);
            }
        },

        getControl: function (elID) {
            var result = null;
            var length = $tree.treeControls.length;
            for (var i = 0; i < length; i++) {
                var item = $tree.treeControls[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        getActiveNode: function (elID) {
            var result = null;
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                result = tree.getActiveNode();
            }

            return result;
        },

        toogleEnabled: function (elID) {
            var result = false;
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                result = !tree.options.disabled;
                tree.enable(!result);
            }

            return result;
        },

        getRootNodeID: function (elID) {
            var result = null;
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                result = tree.rootNode.key.replace('root_', '');
            }

            return result;
        },

        activateKey: function (elID, key) {
            if ($object.isNullOrUndefined(key) == true) {
                return;
            }

            var tree = $tree.getControl(elID).tree;
            if (tree) {
                tree.activateKey(key);
            }
        },

        expendLevel: function (elID, level) {
            if ($object.isNullOrUndefined(level) == true) {
                level = 1;
            }

            var tree = $tree.getControl(elID).tree;
            if (tree) {
                tree.visit(function (node) {
                    if (node.getLevel() < level) {
                        node.setExpanded(true);
                    }
                });
            }
        },

        collapseLevel: function (elID, level) {
            if ($object.isNullOrUndefined(level) == true) {
                level = 1;
            }

            var tree = $tree.getControl(elID).tree;
            if (tree) {
                tree.visit(function (node) {
                    if (node.getLevel() < level) {
                        node.setExpanded(false);
                    }
                });
            }
        },

        expandAll: function (elID) {
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                tree.expandAll();
            }
        },

        collapseAll: function (elID) {
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                tree.expandAll(false);
            }
        },

        getSelectedNodes: function (elID) {
            var result = [];
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                result = tree.getSelectedNodes();
            }

            return result;
        },

        filterNodes: function (elID, filter) {
            var result = [];
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                tree.filterNodes(filter, { autoExpand: true });
            }

            return result;
        },

        filterBranches: function (elID, filter) {
            var result = [];
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                tree.filterBranches(filter, { autoExpand: true, leavesOnly: true });
            }

            return result;
        },

        clearFilter: function (elID) {
            var result = [];
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                result = tree.clearFilter();
            }

            return result;
        },

        setSelectedAll: function (elID, node) {
            var result = [];
            var tree = $tree.getControl(elID).tree;
            if (tree) {
                var isSelected = node.isSelected();
                node.visit(function (childNode) {
                    childNode.setSelected(isSelected);
                });
            }

            return result;
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$tree = $tree;
})(window);
/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    if (window.Handsontable) {
        var textEditor = Handsontable.editors.TextEditor.prototype.extend();

        Handsontable.validators.registerValidator('require', function (query, callback) {
            var result = false;
            if ($string.isNullOrEmpty(query) == true) {
                result = false;
            } else {
                result = true;
            }
            if (callback) {
                callback(result);
            }
            return result;
        });


        Handsontable.cellTypes.registerCellType('codehelp', {
            editor: textEditor,
            renderer: function (instance, td, row, column, prop, value, cellProperties) {
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                var button;
                var label;

                label = document.createElement('SPAN');
                label.textContent = value;

                button = document.createElement('BUTTON');
                button.classList.add('codehelp');
                button.classList.add('icon-search');
                button.tag = [instance, td, row, column, prop, value, cellProperties];

                Handsontable.dom.addEvent(button, 'click', function (evt) {
                    evt.preventDefault();

                    var el = evt.currentTarget;
                    var hot = el.tag[0];
                    var row = el.tag[2];
                    var col = el.tag[3];
                    var columnName = el.tag[4];

                    var columnInfos = hot.getSettings().columns;
                    var columnInfo = columnInfos.filter(function (item) { return item.data == columnName; })[0];

                    var elID = hot.rootElement.id;
                    var qafOptions = syn.$w.argumentsExtend(syn.uicontrols.$codepicker.defaultSetting, columnInfo);
                    qafOptions.elID = elID;
                    qafOptions.controlType = 'grid';

                    syn.uicontrols.$codepicker.find(qafOptions, function (result) {
                        if (result && columnInfo.codeColumnID && columnInfo.textColumnID) {
                            var gridValue = [];
                            gridValue.push([row, hot.propToCol(columnInfo.codeColumnID), result[0].value]);
                            gridValue.push([row, col, result[0].text]);
                            hot.setDataAtCell(gridValue);
                        }

                        var mod = window[syn.$w.pageScript];
                        if (mod) {
                            var returnHandler = mod.hook.frameEvent;
                            if (returnHandler) {
                                returnHandler.call(this, 'codeReturn', {
                                    elID: elID,
                                    row: row,
                                    col: col,
                                    columnName: columnName,
                                    result: result
                                });
                            }
                        }
                    });
                });

                Handsontable.dom.empty(td);
                td.appendChild(button);
                td.appendChild(label);

                if (cellProperties && cellProperties.className) {
                    var classNames = cellProperties.className.split(' ');
                    for (var i = 0; i < classNames.length; i++) {
                        var className = classNames[i];
                        if (className != '') {
                            syn.$m.addClass(td, className);
                        }
                    }
                }

                return td;
            },
            validator: function (query, callback) {
                callback(true);
            },
            allowInvalid: true
        });

        Handsontable.cellTypes.registerCellType('button', {
            renderer: function (instance, td, row, column, prop, value, cellProperties) {
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                if ($string.isNullOrEmpty(value) == false) {
                    var columnOptions = instance.getSettings().columns[column].columnOptions;
                    var button = document.createElement('BUTTON');
                    button.classList.add('celltype');

                    if (columnOptions) {
                        if (columnOptions.clearBorder == true) {
                            button.style.border = '0px';
                            button.style.backgroundColor = 'transparent';
                            button.style.textDecoration = 'underline';
                        }

                        if (columnOptions.color) {
                            button.style.color = columnOptions.color;
                        }

                        if (columnOptions.bold == true) {
                            button.style.fontWeight = '900';
                        }
                    }

                    if (value.indexOf && value.indexOf('|') > -1) {
                        var values = value.split('|');
                        button.classList.add(values[0]);
                        value = values[1];
                    }

                    button.tag = [instance, td, row, column, prop, value, cellProperties];
                    button.setAttribute('data', value);
                    button.textContent = (columnOptions && $string.toBoolean(columnOptions.toCurrency) == true) ? $string.toCurrency(value) : value;

                    syn.$l.addEvent(button, 'click', function (evt) {
                        evt.preventDefault();

                        var el = event.target || event.srcElement;
                        var mod = window[syn.$w.pageScript];

                        if (mod) {
                            var eventHandler = mod.event['{0}_cellButtonClick'.format(instance.elID)];
                            if (eventHandler) {
                                eventHandler.apply(el, [instance.elID, row, column, prop, value]);
                            }
                        }
                    });

                    Handsontable.dom.empty(td);
                    td.appendChild(button);

                    if (cellProperties && cellProperties.className) {
                        var classNames = cellProperties.className.split(' ');
                        for (var i = 0; i < classNames.length; i++) {
                            var className = classNames[i];
                            if (className != '') {
                                syn.$m.addClass(td, className);
                            }
                        }
                    }
                }

                return td;
            },
            validator: function (query, callback) {
                callback(true);
            },
            allowInvalid: true
        });

        Handsontable.cellTypes.registerCellType('safehtml', {
            editor: textEditor,
            renderer: function (instance, td, row, column, prop, value, cellProperties) {
                var escaped = Handsontable.helper.stringify(value);

                var stripTags = function (input, allowed) {
                    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

                    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

                    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                    });
                };

                escaped = stripTags(escaped, '<em><p><br><b><u><strong><a><big><img>');
                td.innerHTML = escaped;

                if (cellProperties && cellProperties.className) {
                    var classNames = cellProperties.className.split(' ');
                    for (var i = 0; i < classNames.length; i++) {
                        var className = classNames[i];
                        if (className != '') {
                            syn.$m.addClass(td, className);
                        }
                    }
                }

                return td;
            },
            validator: function (query, callback) {
                callback(true);
            },
            allowInvalid: true
        });

        Handsontable.cellTypes.registerCellType('image', {
            editor: textEditor,
            renderer: function (instance, td, row, column, prop, value, cellProperties) {
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                var escaped = Handsontable.helper.stringify(value),
                    img;

                if (escaped.indexOf('http') === 0) {
                    img = document.createElement('IMG');
                    img.src = value;

                    Handsontable.dom.addEvent(img, 'click', function (e) {
                        e.preventDefault();
                    });

                    Handsontable.dom.empty(td);
                    td.appendChild(img);
                } else {
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                }

                if (cellProperties && cellProperties.className) {
                    var classNames = cellProperties.className.split(' ');
                    for (var i = 0; i < classNames.length; i++) {
                        var className = classNames[i];
                        if (className != '') {
                            syn.$m.addClass(td, className);
                        }
                    }
                }

                return td;
            },
            validator: function (query, callback) {
                callback(true);
            },
            allowInvalid: true
        });

        Handsontable.cellTypes.registerCellType('radio', {
            renderer: function (instance, td, row, column, prop, value, cellProperties) {
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                var inputID = 'rdo_{0}_{1}_{2}'.format(instance.elID, row, column);
                var input = document.createElement('INPUT');
                input.id = inputID;
                input.type = 'radio';
                syn.$m.addClass(input, 'ui_radio');

                var label = document.createElement('LABEL');
                label.setAttribute('for', inputID);

                if (value) {
                    if ($string.toBoolean(value) === true) {
                        input.checked = true;
                    }
                    else {
                        input.checked = false;
                    }
                }

                Handsontable.dom.addEvent(label, 'click', function (evt) {
                    evt.preventDefault();

                    var el = syn.$l.get((event.target || event.srcElement).getAttribute('for'));
                    var mod = window[syn.$w.pageScript];
                    var gridSettings = instance.getSettings();
                    var readonly = gridSettings.columns[column].readOnly;
                    var cellMeta = instance.getCellMeta(row, column);
                    if (readonly === false && cellMeta.readOnly == false) {
                        if (gridSettings.data && gridSettings.data.length > 0) {
                            var data = gridSettings.data;
                            var length = data.length;
                            for (var i = 0; i < length; i++) {
                                if ($string.toBoolean(data[i][prop]) == true) {
                                    if (data[i]['Flag'] == 'R') {
                                        data[i]['Flag'] = 'U';
                                    }

                                    data[i][prop] = 0;
                                    var radio = syn.$l.get('rdo_{0}_{1}_{2}'.format(instance.elID, i, column));
                                    if (radio) {
                                        radio.checked = false;
                                    }
                                }
                            }
                        }

                        el.checked = !el.checked;
                        instance.setDataAtCell(row, column, (el.checked === true ? 1 : 0));

                        if (mod) {
                            var eventHandler = mod.event['{0}_cellRadioClick'.format(instance.elID)];
                            if (eventHandler) {
                                eventHandler.apply(el, [instance.elID, row, column, prop, (el.checked === true ? 1 : 0)]);
                            }
                        }
                        instance.render();
                    }
                });

                Handsontable.dom.empty(td);
                td.appendChild(input);
                td.appendChild(label);

                if (cellProperties && cellProperties.className) {
                    var classNames = cellProperties.className.split(' ');
                    for (var i = 0; i < classNames.length; i++) {
                        var className = classNames[i];
                        if (className != '') {
                            syn.$m.addClass(td, className);
                        }
                    }
                }

                return td;
            },
            validator: function (query, callback) {
                callback(true);
            },
            allowInvalid: true
        });

        Handsontable.cellTypes.registerCellType('checkbox2', {
            renderer: function (instance, td, row, column, prop, value, cellProperties) {
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                var inputID = 'chk_qafgrid_{0}_{1}_{2}'.format(instance.elID, row, column);
                var input = document.createElement('INPUT');
                input.id = inputID;
                input.type = 'checkbox';
                syn.$m.addClass(input, 'ui_checkbox');

                var label = document.createElement('LABEL');
                label.setAttribute('for', inputID);

                if (value) {
                    if ($string.toBoolean(value) === true) {
                        input.checked = true;
                    }
                    else {
                        input.checked = false;
                    }
                }

                Handsontable.dom.addEvent(label, 'click', function (evt) {
                    evt.preventDefault();

                    var el = syn.$l.get((event.target || event.srcElement).getAttribute('for'));
                    var mod = window[syn.$w.pageScript];
                    var readonly = instance.getSettings().columns[column].readOnly;

                    var cellMeta = instance.getCellMeta(row, column);
                    if (readonly == false || cellMeta.readOnly == false) {
                        el.checked = !el.checked;
                        instance.setDataAtCell(row, column, (el.checked === true ? 1 : 0));
                        if (mod) {
                            var eventHandler = mod.event['{0}_cellCheckboxClick'.format(instance.elID)];
                            if (eventHandler) {
                                eventHandler.apply(el, [instance.elID, row, column, prop, (el.checked === true ? 1 : 0)]);
                            }
                        }
                    }
                });

                Handsontable.dom.empty(td);
                td.appendChild(input);
                td.appendChild(label);

                if (cellProperties && cellProperties.className) {
                    var classNames = cellProperties.className.split(' ');
                    for (var i = 0; i < classNames.length; i++) {
                        var className = classNames[i];
                        if (className != '') {
                            syn.$m.addClass(td, className);
                        }
                    }
                }

                return td;
            },
            validator: function (query, callback) {
                callback(true);
            },
            allowInvalid: true
        });
    }

    syn.uicontrols = syn.uicontrols || new syn.module();
    var $grid = syn.uicontrols.$grid || new syn.module();

    $grid.extend({
        name: 'syn.uicontrols.$grid',
        version: '1.0',
        defaultHotSettings: {
            licenseKey: 'non-commercial-and-evaluation',
            language: 'ko-KR',
            data: [],
            colWidths: 120,
            // rowHeights: 23.87,
            rowHeaders: false,
            copyPaste: true,
            beforePaste: function (data, coords) {
                return false;
            },
            autoColumnSize: false,
            stretchH: 'none',
            undo: false,
            observeChanges: false,
            observeDOMVisibility: true,
            currentRowClassName: 'currentRow',
            manualColumnResize: true,
            manualRowResize: false,
            manualColumnMove: false,
            manualRowMove: false,
            manualColumnFreeze: false,
            autoInsertRow: false,
            isRemoveRowHidden: true,
            autoWrapRow: true,
            outsideClickDeselects: true,
            selectionMode: 'range',
            sortIndicator: false,
            columnSorting: true,
            wordWrap: false,
            dropdownMenu: false,
            filters: true,
            isContainFilterHeader: false,
            firstShowColIndex: null,
            lastShowColIndex: null,
            fillHandle: false,
            contextMenu: {
                items: {
                    "copy": {
                        name: '내용복사'
                    },
                    "hidden_columns_hide": {
                        name: '컬럼 숨김',
                        callback: function (key, selection, clickEvent) {
                            if (selection && selection.length > 0) {
                                var range = selection[0];
                                var startIndex = range.start.col;
                                var endIndex = range.end.col;
                                var targetColumns = [];

                                for (startIndex; startIndex <= endIndex; startIndex++) {
                                    targetColumns.push(startIndex);
                                }

                                $grid.visibleColumns(this.elID, targetColumns, false);

                                var mod = window[syn.$w.pageScript];
                                if (mod) {
                                    var eventHandler = mod.event['{0}_{1}'.format(this.elID, 'afterHiddenColumns')];
                                    if (eventHandler) {
                                        eventHandler.apply(syn.$l.get(this.elID), [targetColumns]);
                                    }
                                }
                            }
                        }
                    },
                    "hidden_columns_show": {
                        name: '컬럼 표시',
                        callback: function (key, selection, clickEvent) {
                            if (selection && selection.length > 0) {
                                var range = selection[0];
                                var startIndex = range.start.col;
                                var endIndex = range.end.col;
                                var targetColumns = [];

                                for (startIndex; startIndex <= endIndex; startIndex++) {
                                    targetColumns.push(startIndex);
                                }

                                $grid.visibleColumns(this.elID, targetColumns, true);

                                var mod = window[syn.$w.pageScript];
                                if (mod) {
                                    var eventHandler = mod.event['{0}_{1}'.format(this.elID, 'afterUnHiddenColumns')];
                                    if (eventHandler) {
                                        eventHandler.apply(syn.$l.get(this.elID), targetColumns);
                                    }
                                }
                            }
                        }
                    },
                    "columns_chooser": {
                        name: '컬럼 표시 선택',
                        callback: function (key, selection, clickEvent) {
                            var hot = this;
                            var elID = this.elID;
                            var dialogOptions = $ref.clone(syn.$w.dialogOptions);
                            dialogOptions.minWidth = 240;
                            dialogOptions.minHeight = 240;

                            var columnChooler = syn.$l.get('columnChooserHtml');
                            if (!columnChooler) {
                                var wrapper = syn.$m.create({
                                    tag: 'div',
                                    id: 'columnChooserHtml'
                                });
                                wrapper.style.display = 'none';
                                wrapper.innerHTML = '<h3 class="mt-0 mb-0">컬럼 표시 선택</h3><div class="btn-area"><input type="button" id="btnColumnApply" class="btn btn-primary" value="컬럼 표시 적용"></div><ul class="row" id="lstChooseColumns" style = "overflow: auto; height: 150px; width:360px; padding-top:10px; padding-left:10px;" > <li><input type="checkbox" id="a"><label for="a">컬럼명</label></li></ul>';
                                document.body.appendChild(wrapper);
                                columnChooler = syn.$l.get('columnChooserHtml');
                            }

                            Handsontable.dom.addEvent(columnChooler.querySelector('#btnColumnApply'), 'click', function () {
                                var result = [];
                                var liELs = syn.$l.get('lstChooseColumns').children;
                                for (var i = 0; i < liELs.length; i++) {
                                    var liEL = liELs[i];
                                    var columnID = liEL.children[0].id.split('_')[2];
                                    var isHidden = !liEL.children[0].checked;
                                    result.push({
                                        col: i,
                                        colID: columnID,
                                        isHidden: isHidden
                                    });
                                }
                                syn.$w.closeDialog(result);
                            });

                            var ulEL = columnChooler.querySelector('ul');
                            ulEL.innerHTML = '';

                            var gridSettings = hot.getSettings();
                            var colHeaders = hot.getSettings().colHeaders;
                            var gridColumns = gridSettings.columns;
                            for (var i = 1; i < gridColumns.length; i++) {
                                var colHeader = colHeaders[i];
                                var gridColumn = gridColumns[i];

                                var liEL = syn.$m.createElement('li');
                                var liEL = syn.$m.create({ tag: 'li', className: 'col-12' });
                                syn.$m.setStyle(liEL, 'padding-top', '10px');
                                var checkboxID = '{0}_checkbox_{1}'.format(elID, gridColumn.data);
                                var isHidden = $grid.isColumnHidden(elID, i);
                                var checkEL = syn.$m.create({ tag: 'input', id: checkboxID, attributes: { type: 'checkbox' } });
                                checkEL.checked = !isHidden;
                                var labelEL = syn.$m.create({ tag: 'label', id: '{0}_label_{1}'.format(elID, gridColumn.data), attributes: { for: checkboxID } });
                                syn.$m.setStyle(labelEL, 'padding-left', '10px');
                                labelEL.textContent = colHeader;

                                syn.$m.appendChild(liEL, checkEL);
                                syn.$m.appendChild(liEL, labelEL);
                                syn.$m.appendChild(ulEL, liEL);
                            }

                            syn.$w.showDialog(syn.$l.get('columnChooserHtml'), dialogOptions, function (result) {
                                if (result) {
                                    var showColumns = [];
                                    var hideColumns = [];
                                    for (var i = 1; i < gridColumns.length; i++) {
                                        var item = result[i - 1];
                                        if (item) {
                                            if (item.isHidden == false) {
                                                showColumns.push(i);
                                            }
                                            else {
                                                hideColumns.push(i)
                                            }
                                        }
                                    }

                                    $grid.visibleColumns(elID, showColumns, true);
                                    $grid.visibleColumns(elID, hideColumns, false);
                                }
                            });
                        }
                    }
                }
            },
            hiddenColumns: {
                columns: [0],
                indicators: false
            },
            deleteKeyColumns: [],
            keyLockedColumns: [],
            summarys: [],
            exportColumns: [],
            transactConfig: null,
            triggerConfig: null
        },
        gridControls: [],
        handsontableHooks: null,
        gridHooks: [],
        gridCodeDatas: [],

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
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($grid.defaultHotSettings, setting);

            if (setting.columns) {
                var moduleHotSettings = $grid.getInitializeColumns(setting, elID);
                setting = syn.$w.argumentsExtend(setting, moduleHotSettings);
            }

            var mod = window[syn.$w.pageScript];
            if (mod && mod.hook.controlInit) {
                var moduleHotSettings = mod.hook.controlInit(elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleHotSettings);
            }

            setting.elementID = elID;
            setting.colHeaders = setting.colHeaders || ['Flag', 'A', 'B', 'C'];
            if (setting.colHeaders.indexOf('Flag') == -1) {
                setting.colHeaders.unshift('Flag');
                setting.colWidths.unshift(10);
            }

            setting.columns = setting.columns || [{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }];
            var isFlagColumn = false;
            var columnCount = setting.columns.length;
            for (var i = 0; i < columnCount; i++) {
                var column = setting.columns[i];
                if (column.data == 'Flag') {
                    isFlagColumn = true;
                    break;
                }
            }

            if (isFlagColumn == false) {
                setting.columns.unshift({
                    data: 'Flag',
                    type: 'text',
                    readOnly: true
                });
            }

            if (setting.dropdownMenu === true) {
                setting.dropdownMenu = ['filter_by_condition', 'filter_operators', 'filter_by_condition2', 'filter_action_bar'];
            }
            else {
                setting.dropdownMenu = false;
            }

            var debounceFn = Handsontable.helper.debounce(function (colIndex, event) {
                var el = (event.target || event.srcElement);
                colIndex = $grid.getActiveColIndex(el.gridID);
                var hot = $grid.getGridControl(el.gridID);
                var filtersPlugin = hot.getPlugin('filters');

                if (filtersPlugin.isEnabled() == false) {
                    filtersPlugin.enablePlugin();
                }

                filtersPlugin.clearConditions(colIndex);

                if (event.target.value.length > 0) {
                    filtersPlugin.addCondition(colIndex, 'contains', [event.target.value]);
                }
                filtersPlugin.filter();
            }, 100);

            var isSummary = false;
            if (setting.summarys && setting.summarys.length > 0) {
                isSummary = true;
                setting.fixedRowsBottom = 1;
                setting.cells = function (row, column, prop) {
                    var hot = this.instance;

                    var gridValue = $grid.getGridValue(hot.elID);
                    if (gridValue.applyCells == true) {
                        var gridSettings = hot.getSettings();
                        if (gridSettings.summarys && gridSettings.summarys.length > 0) {
                            var lastRowIndex = gridSettings.data.length - 1;
                            if (row === lastRowIndex) {
                                var cellProperties = {};

                                // 고정 행 모든 컬럼 cell 타입을 text로 변경
                                cellProperties.type = 'text';
                                cellProperties.readOnly = true;
                                cellProperties.className = 'summaryRow';

                                var summaryColumn = gridSettings.columns.find(function (item) { return item.data == prop });
                                if (summaryColumn && summaryColumn.className && summaryColumn.className.indexOf(cellProperties.className) == -1) {
                                    cellProperties.className += ' ' + summaryColumn.className;
                                }

                                return cellProperties;
                            }
                        }
                    }

                    var mod = window[syn.$w.pageScript];
                    if (mod) {
                        var eventHandler = mod.event['{0}_applyCells'.format(hot.elID)];
                        if (eventHandler) {
                            var cellProperties = eventHandler.apply(hot, [hot.elID, row, column, prop]);
                            if (cellProperties) {
                                return cellProperties;
                            }
                        }
                    }
                };
            }
            else {
                setting.cells = function (row, column, prop) {
                    var mod = window[syn.$w.pageScript];
                    if (mod) {
                        var hot = this.instance;
                        var eventHandler = mod.event['{0}_applyCells'.format(hot.elID)];
                        if (eventHandler) {
                            var cellProperties = eventHandler.apply(hot, [hot.elID, row, column, prop]);
                            if (cellProperties) {
                                return cellProperties;
                            }
                        }
                    }
                };
            }

            setting.beforeColumnSort = function (currentSortConfig, destinationSortConfigs) {
                var hot = this;
                var gridSettings = hot.getSettings();
                if (gridSettings.summarys && gridSettings.summarys.length > 0) {
                    var gridValue = $grid.getGridValue(hot.elID);
                    gridValue.applyCells = false;

                    var gridSettings = hot.getSettings();
                    var itemToFind = gridSettings.data.find(function (item) { return item['Flag'] == 'S' });
                    if (itemToFind) {
                        var rowIndex = gridSettings.data.indexOf(itemToFind);
                        if (rowIndex > -1) {
                            gridSettings.data.splice(rowIndex, 1);
                        }
                    }
                }
            }

            setting.afterColumnSort = function (currentSortConfig, destinationSortConfigs) {
                var hot = this;
                var gridSettings = hot.getSettings();
                if (gridSettings.summarys && gridSettings.summarys.length > 0) {
                    $grid.renderSummary(hot);
                }
            };

            setting.afterGetColHeader = function (col, TH) {
                if (typeof col !== 'number') {
                    return col;
                }

                if (col >= 0 && setting.isContainFilterHeader == true && TH.childElementCount < 2) {
                    var div = document.createElement('div');
                    var input = document.createElement('input');

                    div.className = 'filterHeader';
                    input.gridID = elID;

                    Handsontable.dom.addEvent(input, 'contextmenu', function (evt) {
                        Handsontable.dom.stopImmediatePropagation(evt);
                        if (evt.preventDefault) {
                            evt.preventDefault();
                        }

                        return false;
                    });

                    Handsontable.dom.addEvent(input, 'keydown', function (evt) {
                        debounceFn(col, evt);
                    });

                    Handsontable.dom.addEvent(input, 'focus', function (evt) {
                        var mod = window[syn.$w.pageScript];
                        if (mod) {
                            mod.context.focusControl = syn.$l.get(input.gridID);
                        }
                    });

                    div.appendChild(input);
                    TH.appendChild(div);
                }

                var childElementCount = $ref.isArray(setting.dropdownMenu) == true ? 3 : 2;
                var column = setting.columns[col];
                if (column && column.isSelectAll === true) {
                    childElementCount = childElementCount + 2;
                }

                if (col >= 0 && column && (column.type == 'checkbox' || column.type == 'checkbox2') && column.isSelectAll === true && TH.firstElementChild.childElementCount < childElementCount) {
                    if (TH.firstElementChild.childElementCount != 3 && syn.$m.hasClass(TH, 'hiddenHeader') == false) {
                        var inputID = 'chk_qafgrid_All_{0}_{1}'.format(elID, col);
                        if (syn.$l.get(inputID) != null) {
                            syn.$m.remove(syn.$l.get(inputID));
                            syn.$m.remove(syn.$l.querySelector('label[for="' + inputID + '"]'));
                        }
                        var input = document.createElement('input');
                        input.id = inputID;
                        input.type = 'checkbox';
                        input.setAttribute('columnSelectAll', '1');
                        input.gridID = elID;
                        input.checked = column.toogleChecked == 1 ? true : false;
                        syn.$m.addClass(input, 'ui_checkbox');

                        var label = document.createElement('LABEL');
                        label.setAttribute('for', inputID);

                        if (input.checked == true) {
                            syn.$m.addClass(label, 'ui_checkbox');
                        }
                        else {
                            syn.$m.removeClass(label, 'ui_checkbox');
                        }

                        Handsontable.dom.addEvent(label, 'click', function (event) {
                            var el = syn.$l.get((event.target || event.srcElement).getAttribute('for'));
                            el.checked = !el.checked;
                            var toogleChecked = el.checked ? 1 : 0;
                            column.toogleChecked = toogleChecked;

                            var label = event.target || event.srcElement;
                            if (el.checked == true) {
                                syn.$m.addClass(label, 'ui_checkbox');
                            }
                            else {
                                syn.$m.removeClass(label, 'ui_checkbox');
                            }

                            var mod = window[syn.$w.pageScript];
                            var eventHandler = mod.event['{0}_selectAllCheck'.format(input.gridID)];
                            if (eventHandler) {
                                eventHandler.apply(el, [input.gridID, col, $string.toBoolean(column.toogleChecked.toString())]);
                                var hot = $grid.getGridControl(el.gridID);
                                hot.render();
                            }
                            else {
                                var hot = $grid.getGridControl(el.gridID);
                                var gridSettings = $grid.getSettings(el.gridID);

                                if (gridSettings.data && gridSettings.data.length > 0) {
                                    var data = gridSettings.data;
                                    var length = data.length;
                                    var colProp = hot.colToProp(col);
                                    for (var i = 0; i < length; i++) {
                                        var flag = data[i]['Flag'];
                                        if (flag == 'R') {
                                            data[i]['Flag'] = 'U';
                                        }

                                        if (flag != 'S') {
                                            data[i][colProp] = toogleChecked;
                                        }
                                    }
                                }
                                hot.render();
                            }

                            event.stopImmediatePropagation();
                        });

                        syn.$m.prepend(label, TH.firstElementChild);
                        syn.$m.prepend(input, TH.firstElementChild);
                    }
                }
                else {
                    var checkbox = TH.querySelector('input[type="checkbox"]');
                    if (col >= 0 && column && (column.type == 'checkbox' || column.type == 'checkbox2') && checkbox != null) {
                        TH.firstElementChild.removeChild(checkbox);

                        var label = TH.querySelector('label[for]');
                        TH.firstElementChild.removeChild(label);
                    }
                }
            };

            if (setting.isContainFilterHeader == true) {
                setting.className = 'contain-filter-header';
            }

            setting.width = setting.width || '100%';
            setting.height = setting.height || 240;

            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var parent = el.parentNode;
            var wrapper = document.createElement('div');
            if (isSummary == true) {
                syn.$m.addClass(wrapper, 'summaryRow');
            }
            wrapper.id = elID;

            parent.appendChild(wrapper);

            var fileEL = document.createElement('input');
            fileEL.id = '{0}_ImportFile'.format(elID);
            fileEL.type = 'file';
            fileEL.style.display = 'none';
            fileEL.accept = '.csv, .xls, .xlsx';
            Handsontable.dom.addEvent(fileEL, 'change', $grid.importFileLoad);
            parent.appendChild(fileEL);

            el = syn.$l.get(elID);

            if (!$grid.handsontableHooks) {
                $grid.handsontableHooks = Handsontable.hooks.getRegistered();
            }

            $grid.gridHooks = [
                'afterChange',
                'afterCreateRow',
                'afterRemoveRow',
                'hiddenRow',
                'beforeOnCellMouseDown',
                'afterSelectionEnd',
                'beforeKeyDown'
            ];

            var gridHookEvents = syn.$l.get(el.id + '_hidden').getAttribute('syn-events');
            try {
                if (gridHookEvents) {
                    gridHookEvents = eval(gridHookEvents);
                }
            } catch (error) {
                syn.$l.eventLog('WebGrid_controlLoad', error.toString(), 'Debug');
            }

            if (gridHookEvents) {
                for (var i = 0; i < gridHookEvents.length; i++) {
                    var hook = gridHookEvents[i];
                    if ($grid.gridHooks.indexOf(hook) == -1) {
                        $grid.gridHooks.push(hook);
                    }
                }
            }

            $grid.gridHooks.forEach(function (hook) {
                setting[hook] = () => {
                    var elID = this.rootElement.id;
                    var $grid = syn.uicontrols.$grid;
                    var mod = window[syn.$w.pageScript];
                    var hot = $grid.getGridControl(elID);
                    // syn.$l.eventLog('gridHooks', 'elID: {0}, hook: {1}'.format(elID, hook), 'Debug');
                    var defaultGridHooks = [
                        'afterChange',
                        'afterCreateRow',
                        'afterRemoveRow',
                        'hiddenRow',
                        'beforeOnCellMouseDown',
                        'afterSelectionEnd',
                        'beforeKeyDown'
                    ];

                    var gridValue = $grid.getGridValue(elID);
                    if (defaultGridHooks.indexOf(hook) == -1) {
                        if (gridValue.passSelectCellEvent == true) {
                        }
                        else {
                            if (mod) {
                                var eventHandler = mod.event['{0}_{1}'.format(elID, hook)];
                                if (eventHandler) {
                                    eventHandler.apply(syn.$l.get(elID), arguments);
                                }
                            }
                        }
                        return;
                    }

                    if (gridValue) {
                        if (hook == 'afterChange' && (gridValue.eventName == 'insertRow' || gridValue.eventName == 'removeRow')) {
                            gridValue.eventName == '';
                            return;
                        }
                    }

                    if (hook == 'beforeKeyDown') {
                        var evt = arguments[0];
                        if (evt.keyCode == 13) {
                            Handsontable.dom.stopImmediatePropagation(evt);
                        }
                        else if (evt.shiftKey == true && evt.keyCode == 9) {
                            var selected = hot.getSelected()[0];
                            var currentRow = selected[0];
                            var currentCol = selected[1];
                            var firstCol = $grid.getFirstShowColIndex(elID);
                            var lastCol = $grid.getLastShowColIndex(elID);

                            if (currentRow > 0 && currentCol == firstCol) {
                                Handsontable.dom.stopImmediatePropagation(evt);
                                if (evt.preventDefault) {
                                    evt.preventDefault();
                                }

                                hot.selectCell((currentRow - 1), lastCol);
                            }
                            else if (currentRow == 0 && currentCol == firstCol) {
                                Handsontable.dom.stopImmediatePropagation(evt);
                                if (evt.preventDefault) {
                                    evt.preventDefault();
                                }

                                var lastRow = hot.countRows() - 1;
                                if (lastRow > -1) {
                                    hot.selectCell(lastRow, lastCol);
                                }
                            }
                        }
                        else if (evt.keyCode == 9) {
                            var selected = hot.getSelected()[0];
                            var currentRow = selected[0];
                            var currentCol = selected[1];
                            var firstCol = $grid.getFirstShowColIndex(elID);
                            var lastCol = $grid.getLastShowColIndex(elID);
                            var lastRow = hot.countRows() - 1;

                            if (currentRow < lastRow && currentCol == lastCol) {
                                Handsontable.dom.stopImmediatePropagation(evt);
                                if (evt.preventDefault) {
                                    evt.preventDefault();
                                }

                                hot.selectCell((currentRow + 1), firstCol);
                            }
                            else if (currentRow == lastRow && currentCol == lastCol) {
                                Handsontable.dom.stopImmediatePropagation(evt);
                                if (evt.preventDefault) {
                                    evt.preventDefault();
                                }

                                if (setting.autoInsertRow == true) {
                                    $grid.insertRow(elID, {
                                        amount: 1
                                    }, function (row) {
                                        hot.selectCell(row, firstCol);
                                    });

                                    Handsontable.dom.stopImmediatePropagation(evt);
                                    if (evt.preventDefault) {
                                        evt.preventDefault();
                                    }
                                }
                                else {
                                    hot.selectCell(0, firstCol);
                                }
                            }
                        }
                    } else if (hook == 'afterChange' || hook == 'afterCreateRow' || hook == 'afterRemoveRow' || hook == 'hiddenRow') {
                        if (hook == 'afterChange' && arguments[1] == 'loadData') {
                            return;
                        }
                        else if (hook == 'afterChange' && arguments[1] == 'edit' && arguments[0][0][1] == 'Flag') {
                            return;
                        }

                        var rowIndex;
                        if (hook == 'afterCreateRow') {
                            var method_index = arguments[0];
                            var method_amount = arguments[1];
                            var method_source = arguments[2];

                            rowIndex = method_index;

                            // var columns = setting.columns;
                            // var defaultFields = method_source ? method_source : {};
                            // var defalutValue = '';
                            // 
                            // var defaultValues = [];
                            // for (var amount = 0; amount < method_amount; amount++) {
                            //     var amountIndex = rowIndex + amount;
                            //     var length = columns.length;
                            //     for (var i = 0; i < length; i++) {
                            //         var column = columns[i];
                            //         if (column.type == 'numeric') {
                            //             defalutValue = 0;
                            //         } else if (column.type == 'checkbox') {
                            //             defalutValue = false;
                            //         }
                            // 
                            //         if (defaultFields[column.data]) {
                            //             defalutValue = defaultFields[column.data];
                            //         }
                            // 
                            //         defaultValues.push([amountIndex, i, defalutValue]);
                            //         defalutValue = '';
                            //     }
                            // }
                            // 
                            // if (defaultValues.length > 0) {
                            //     defaultValues[0][2] = 'C'
                            //     hot.setDataAtCell(defaultValues);
                            //     return;
                            // }
                        } else if (hook == 'afterChange') {
                            var method_changes = arguments[0];
                            var method_source = arguments[1];

                            rowIndex = method_changes[0][0];

                            var columnName = method_changes[0][1];
                            var changeValue = method_changes[0][3];
                            var columnInfos = hot.getSettings().columns;
                            // var colIndex = hot.propToCol(columnName);
                            var columnInfo = columnInfos.filter(function (item) { return item.data == columnName; })[0];
                            if (columnInfo.type == 'dropdown') {
                                var dataSource = columnInfo.dataSource;
                                if (dataSource) {
                                    if (columnInfo.required == false && changeValue == '') {
                                        method_changes[0][4] = '';

                                        hot.setDataAtCell(rowIndex, hot.propToCol(columnInfo.codeColumnID), '');
                                    }
                                    else {
                                        for (var j = 0; j < dataSource.DataSource.length; j++) {
                                            var item = dataSource.DataSource[j];
                                            if (item[dataSource.ValueColumnID] == changeValue) {
                                                var code = item[dataSource.CodeColumnID];
                                                method_changes[0][4] = code;

                                                hot.setDataAtCell(rowIndex, hot.propToCol(columnInfo.codeColumnID), code);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (hook == 'afterRemoveRow') {
                            var method_index = arguments[0];
                            var method_amount = arguments[1];

                            rowIndex = method_index;
                        } else if (hook == 'hiddenRow') {
                            var method_rows = arguments[0];

                            rowIndex = method_rows[0];
                        }

                        if (rowIndex || rowIndex == 0) { } else {
                            return;
                        }

                        var physicalRowIndex = hot.toPhysicalRow(rowIndex); // Handsontable.hooks.run(hot, 'modifyRow', rowIndex);
                        var rowData = hot.getSourceDataAtRow(physicalRowIndex);
                        // var rowMeta = hot.getCellMetaAtRow(physicalRowIndex);
                        var rowFlag = rowData && rowData.Flag ? rowData.Flag : 'C';

                        if (hook == 'afterCreateRow') {
                            rowFlag = 'C';
                        } else if (hook == 'afterChange') {
                            if (rowFlag == 'R' && method_changes[0][2] != method_changes[0][3]) {
                                rowFlag = 'U';
                            }
                        } else if (hook == 'hiddenRow') {
                            if (rowFlag == 'R' || rowFlag == 'U') {
                                rowFlag = 'D';
                            }
                        }

                        if (hook == 'afterRemoveRow') {

                        } else {
                            var cellRowFlag = hot.getDataAtCell(rowIndex, 0);
                            if (cellRowFlag != rowFlag) {
                                hot.setDataAtCell(rowIndex, 0, rowFlag);

                                if (hook == 'afterCreateRow' && rowFlag == 'C') {

                                }
                            }
                        }
                    }
                    else if (hook == 'beforeOnCellMouseDown') {
                        var event = arguments[0];
                        var coords = arguments[1];
                        var td = arguments[2];

                        if (coords.row === -1 && event.target.nodeName === 'INPUT') {
                            event.stopImmediatePropagation();
                            this.deselectCell();
                        }

                        if (coords.row == -1) {
                            var gridValue = $grid.getGridValue(elID);
                            gridValue.colHeaderClick = true;
                            gridValue.previousRow = coords.row;
                            gridValue.previousCol = coords.col;
                        }

                        var now = new Date().getTime();
                        if (!(td.lastClick && now - td.lastClick < 200)) {
                            td.lastClick = now;
                        } else {
                            hook = 'afterOnCellDoubleClick';
                        }
                    }

                    if (mod) {
                        var el = syn.$l.get(elID);
                        var elHidden = syn.$l.get(elID + '_hidden');
                        var gridHookEvents = elHidden.getAttribute('syn-events');
                        try {
                            if (gridHookEvents) {
                                gridHookEvents = eval(gridHookEvents);
                            }
                        } catch (error) {
                            syn.$l.eventLog('WebGrid_gridHookEvents', error.toString(), 'Debug');
                        }

                        if (gridHookEvents) {
                            if (gridHookEvents.indexOf(hook) > -1) {
                                if (gridValue.passSelectCellEvent == true) {
                                }
                                else {
                                    if (mod) {
                                        var eventHandler = mod.event['{0}_{1}'.format(elID, hook)];
                                        if (eventHandler) {
                                            eventHandler.apply(el, arguments);
                                        }
                                    }
                                }
                            }
                        }

                        // if (syn.$l && syn.$l.hasEvent(el, hook) == true) {
                        //     var options = eval('(' + elHidden.getAttribute('syn-options') + ')');
                        //     if (options.transactConfig) {
                        //         var gridValue = $grid.getGridValue(elID);
                        //         var previousRow = -1;
                        //         if (gridValue) {
                        //             previousRow = gridValue.previousRow;
                        //         }
                        //         var currentRow = $grid.getActiveRowIndex(elID);
                        //         if (gridValue.colHeaderClick == false && currentRow != previousRow) {
                        //             syn.$l.trigger(el, hook, options.transactConfig);
                        //         }
                        //     }
                        // 
                        //     if (options.triggerConfig) {
                        //         var gridValue = $grid.getGridValue(elID);
                        //         var previousRow = -1;
                        //         if (gridValue) {
                        //             previousRow = gridValue.previousRow;
                        //         }
                        //         var currentRow = $grid.getActiveRowIndex(elID);
                        //         if (gridValue.colHeaderClick == false && currentRow != previousRow) {
                        //             syn.$l.trigger(el, hook, options.transactConfig);
                        //         }
                        //         syn.$l.trigger(el, hook, options.triggerConfig);
                        //     }
                        // }
                    }

                    if (hook == 'afterOnCellDoubleClick') {
                        hook = 'beforeOnCellMouseDown';
                    }

                    if (hook == 'afterSelectionEnd') {
                        var gridValue = $grid.getGridValue(elID);
                        gridValue.colHeaderClick = false;
                        gridValue.previousRow = arguments[0];
                        gridValue.previousCol = arguments[1];

                        if (mod) {
                            mod.context.focusControl = syn.$l.get(elID);
                        }
                    }
                }
            });

            var handsontable = new Handsontable(el, setting);
            handsontable.elID = elID;

            var wtHolder = syn.$l.get(elID).querySelector('.wtHolder');
            wtHolder.gridID = elID;
            Handsontable.dom.addEvent(wtHolder, 'click', function (evt) {
                var mod = window[syn.$w.pageScript];
                if (mod) {
                    mod.context.focusControl = syn.$l.get(wtHolder.gridID);
                }
            });

            $grid.gridControls.push({
                id: elID,
                hot: handsontable,
                setting: $ref.clone(setting),
                value: {
                    eventName: '',
                    colHeaderClick: false,
                    applyCells: false,
                    previousRow: -1,
                    previousCol: -1
                }
            });

            if ($grid.gridCodeDatas.length > 0) {
                var length = $grid.gridCodeDatas.length;
                for (var i = 0; i < length; i++) {
                    syn.$w.addReadyCount();
                    var codeData = $grid.gridCodeDatas[i];
                    $grid.dataRefresh(codeData.elID, codeData.type);
                }
            }

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        dataRefresh: function (elID, setting) {
            var defaultSetting = {
                columnName: null,
                codeColumnID: null,
                required: true,
                local: true,
                dataSourceID: null,
                storeSourceID: null,
                dataSource: null,
                parameters: null,
                selectedValue: null
            }

            setting = syn.$w.argumentsExtend(defaultSetting, setting);
            setting.elID = elID;
            setting.storeSourceID = setting.storeSourceID || setting.dataSourceID;

            if (setting.columnName && setting.storeSourceID) {
                var mod = window[syn.$w.pageScript];
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID]) {
                    delete mod.config.dataSource[setting.storeSourceID];
                }

                if (mod && mod.hook.controlInit) {
                    var moduleSettings = mod.hook.controlInit(elID, setting);
                    setting = syn.$w.argumentsExtend(setting, moduleSettings);
                }

                var dataSource = null;
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.dataSourceID]) {
                    dataSource = mod.config.dataSource[setting.storeSourceID];
                }

                var hot = $grid.getGridControl(elID);
                var gridSettings = hot.getSettings();
                var columnInfos = gridSettings.columns;
                var colIndex = hot.propToCol(setting.columnName);
                var columnInfo = columnInfos[colIndex];
                if (columnInfo.type == 'dropdown') {
                    var loadData = function (columnInfo, dataSource, setting) {
                        columnInfo.dataSource = dataSource;
                        columnInfo.storeSourceID = setting.storeSourceID;
                        columnInfo.local = setting.local;
                        columnInfo.required = setting.required;
                        columnInfo.codeColumnID = setting.codeColumnID || columnInfo.codeColumnID;
                        var source = [];

                        if (columnInfo.required == false) {
                            source.push('');
                        }

                        for (var j = 0; j < dataSource.DataSource.length; j++) {
                            var item = dataSource.DataSource[j];
                            source.push(item[dataSource.ValueColumnID]);
                        }
                        columnInfo.source = source;
                        $grid.updateSettings(setting.elID, gridSettings);

                        if (setting.selectedValue) {
                            var row = $grid.getActiveRowIndex(elID);

                            if (row > -1) {
                                var codeColIndex = hot.propToCol(columnInfo.codeColumnID);
                                var selectedText = '';
                                var length = columnInfo.dataSource.DataSource.length;
                                for (var i = 0; i < length; i++) {
                                    var item = columnInfo.dataSource.DataSource[i];
                                    if (item.CodeID == setting.selectedValue) {
                                        selectedText = item.CodeValue;
                                        break;
                                    }
                                }

                                var codeValue = [
                                    [row, codeColIndex, setting.selectedValue],
                                    [row, colIndex, selectedText]
                                ];
                                hot.setDataAtCell(codeValue);
                            }
                        }
                    }

                    if (dataSource) {
                        loadData(columnInfo, dataSource, setting);
                        syn.$w.removeReadyCount();
                    } else {
                        if (setting.local == true) {
                            syn.$w.loadJson(syn.Config.SharedAssetUrl + 'code/{0}.json'.format(setting.dataSourceID), setting, function (setting, json) {
                                if (json) {
                                    mod.config.dataSource[setting.storeSourceID] = json;
                                    loadData(columnInfo, json, setting);
                                }
                                syn.$w.removeReadyCount();
                            }, false);
                        } else {
                            syn.$w.getDataSource(setting.dataSourceID, setting.parameters, function (json) {
                                if (json) {
                                    mod.config.dataSource[setting.storeSourceID] = json;
                                    loadData(columnInfo, json, setting);
                                }
                                syn.$w.removeReadyCount();
                            });
                        }
                    }
                }
            }
        },

        // columns = [{
        //    0 columnID: '',
        //    1 columnName: '',
        //    2 width: '',
        //    3 isHidden: '',
        //    4 columnType: '',
        //    5 readOnly: '',
        //    6 alignConstants: '',
        //    7 belongID: '',
        //    8 validators: ['require', 'unique', 'number', 'ipaddress', 'email', 'date', 'dateformat']
        //    9 options: { sorting: true, placeholder: 'Empty Cell' }
        // }]
        getInitializeColumns: function (settings, elID) {
            var columns = settings.columns;
            var gridSetting = {
                colHeaders: [],
                columns: [],
                colWidths: [],
                hiddenColumns: {
                    columns: [0],
                    indicators: false
                }
            };

            var length = columns.length;
            for (var i = 0; i < length; i++) {
                var column = columns[i];

                var columnInfo = {
                    data: column[0],
                    type: 'text',
                    filter: true,
                    isHidden: column[3],
                    readOnly: column[5],
                    className: 'ht' + syn.lib.$string.capitalize(column[6]),
                    belongID: column[7],
                    validators: null
                }

                if (column.length > 8 && column[8]) {
                    columnInfo.validators = column[8];

                    if (columnInfo.validators.indexOf('require') > -1) {
                        columnInfo.className = columnInfo.className + ' required';
                    }
                }

                if (column.length > 9 && column[9]) {
                    var columnOptions = column[9];

                    if ($string.isNullOrEmpty(columnOptions.placeholder) == false) {
                        columnInfo.placeholder = columnOptions.placeholder;
                    }

                    if (columnOptions.sorting == true) {
                    }
                    else {
                        columnInfo.columnSorting = {
                            indicator: false,
                            headerAction: false,
                            compareFunctionFactory: function compareFunctionFactory() {
                                return function comparator() {
                                    return 0;
                                };
                            }
                        };
                    }

                    if ((columnInfo.type == 'checkbox' || columnInfo.type == 'checkbox2') && columnOptions.isRadioTheme == true) {
                        columnInfo.className = columnInfo.className + ' required';
                    }

                    columnInfo.columnOptions = columnOptions;
                }

                if (column.length != 10 && settings.columnSorting == false) {
                    columnInfo.columnSorting = {
                        indicator: false,
                        headerAction: false,
                        compareFunctionFactory: function compareFunctionFactory() {
                            return function comparator() {
                                return 0;
                            };
                        }
                    };
                }

                var dataSource = null;
                var type = column[4];
                if ($ref.isString(type) == true) {
                    columnInfo.type = type;
                    if ((columnInfo.type == 'dropdown' || columnInfo.type == 'codehelp')) {
                        syn.$l.eventLog('getInitializeColumns', '"{0}" 컬럼 타입은 객체로 선언 필요'.format(type), 'Warning');
                    }
                    else if (columnInfo.type == 'checkbox' || columnInfo.type == 'checkbox2') {
                        columnInfo.isSelectAll = false;
                        columnInfo.checkedTemplate = '1';
                        columnInfo.uncheckedTemplate = '0';
                        columnInfo.allowInvalid = false;
                    }
                    else if (columnInfo.type == 'numeric' || columnInfo.type == 'date' || columnInfo.type == 'time' || columnInfo.type == 'autocomplete') {
                        columnInfo.allowInvalid = false;
                        if (columnInfo.type == 'numeric') {
                            if (type.numericFormat) {
                                columnInfo.numericFormat = type.numericFormat;
                            }
                            else if (type.numericFormat == false) {
                            }
                            else {
                                columnInfo.numericFormat = {
                                    pattern: '0,00',
                                    culture: 'ko-KR'
                                }
                            }
                        }
                        else if (columnInfo.type == 'date') {
                            columnInfo.dateFormat = type.timeFormat;
                            columnInfo.correctFormat = type.correctFormat;
                            columnInfo.defaultDate = type.defaultDate;
                            columnInfo.datePickerConfig = type.datePickerConfig;
                        }
                        else if (columnInfo.type == 'time') {
                            columnInfo.timeFormat = type.timeFormat;
                            columnInfo.correctFormat = type.correctFormat;
                        }
                    }
                }
                else {
                    columnInfo.type = type.columnType;

                    if ((columnInfo.type == 'dropdown' || columnInfo.type == 'codehelp')) {
                        var storeSourceID = type.storeSourceID || type.dataSourceID;
                        if (storeSourceID) {
                            var mod = window[syn.$w.pageScript];
                            if (mod.config && mod.config.dataSource && mod.config.dataSource[storeSourceID]) {
                                dataSource = mod.config.dataSource[storeSourceID];
                            }
                        }
                    }
                    else if (columnInfo.type == 'checkbox' || columnInfo.type == 'checkbox2') {
                        columnInfo.isSelectAll = $object.isNullOrUndefined(type.isSelectAll) == false && type.isSelectAll === true ? true : false;
                        columnInfo.checkedTemplate = $object.isNullOrUndefined(type.checkedTemplate) == false ? type.checkedTemplate : '1';
                        columnInfo.uncheckedTemplate = $object.isNullOrUndefined(type.uncheckedTemplate) == false ? type.uncheckedTemplate : '1';
                        columnInfo.allowInvalid = $object.isNullOrUndefined(type.allowInvalid) == false && type.allowInvalid === true ? true : false;
                    }
                    else if (columnInfo.type == 'numeric' || columnInfo.type == 'date' || columnInfo.type == 'time' || columnInfo.type == 'autocomplete') {
                        columnInfo.allowInvalid = false;
                        if (columnInfo.type == 'numeric') {
                            if (type.numericFormat) {
                                columnInfo.numericFormat = type.numericFormat;
                            }
                            else if (type.numericFormat == false) {
                            }
                            else {
                                columnInfo.numericFormat = {
                                    pattern: '0,00',
                                    culture: 'ko-KR'
                                }
                            }
                        }
                        else if (columnInfo.type == 'date') {
                            columnInfo.dateFormat = type.timeFormat;
                            columnInfo.correctFormat = type.correctFormat;
                            columnInfo.defaultDate = type.defaultDate;
                            columnInfo.datePickerConfig = type.datePickerConfig;
                        }
                        else if (columnInfo.type == 'time') {
                            columnInfo.timeFormat = type.timeFormat;
                            columnInfo.correctFormat = type.correctFormat;
                        }
                    }
                }

                if (columnInfo.type == 'dropdown') {
                    var source = [];
                    if (dataSource) {
                        for (var j = 0; j < dataSource.DataSource.length; j++) {
                            var item = dataSource.DataSource[j];
                            source.push(item[dataSource.ValueColumnID]);
                        }
                    }
                    else {
                        if (elID) {
                            type.columnName = column[0];
                            if (type.local === true) {
                                $grid.dataRefresh(elID, type);
                            }
                            else {
                                $grid.gridCodeDatas.push({
                                    elID: elID,
                                    type: type
                                });
                            }
                        }
                    }

                    columnInfo.dataSource = dataSource;
                    columnInfo.dataSourceID = type.dataSourceID;
                    columnInfo.storeSourceID = type.storeSourceID || type.dataSourceID;
                    columnInfo.local = (type.local === true);
                    columnInfo.codeBelongID = type.codeBelongID;
                    columnInfo.codeColumnID = type.codeColumnID;
                    columnInfo.codeColumnType = type.codeColumnType ? type.codeColumnType : 'text';
                    columnInfo.codeColumnHidden = type.codeColumnHidden == undefined ? true : type.codeColumnHidden;
                    columnInfo.source = source;
                    columnInfo.strict = true;
                    columnInfo.trimWhitespace = false;
                    columnInfo.wordWrap = false;
                    columnInfo.allowInvalid = false;
                } else if (columnInfo.type == 'codehelp') {
                    columnInfo.dataSource = dataSource;
                    columnInfo.dataSourceID = type.dataSourceID;
                    columnInfo.storeSourceID = type.storeSourceID || type.dataSourceID;
                    columnInfo.local = type.local;
                    columnInfo.codeColumnID = type.codeColumnID ? type.codeColumnID : column[0];
                    columnInfo.textColumnID = type.textColumnID ? type.textColumnID : column[0];
                    columnInfo.parameters = type.parameters ? type.parameters : '';
                } else if (columnInfo.type == 'date') {
                    columnInfo.dateFormat = type.dateFormat ? type.dateFormat : 'YYYY-MM-DD';
                    columnInfo.correctFormat = true;
                    columnInfo.datePickerConfig = {
                        format: columnInfo.dateFormat,
                        ariaLabel: '날짜를 선택하세요',
                        i18n: {
                            previousMonth: '이전 달',
                            nextMonth: '다음 달',
                            months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                            weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
                            weekdaysShort: ['일', '월', '화', '수', '목', '금', '토']
                        },
                        showWeekNumber: false,
                        showMonthAfterYear: true,
                        yearSuffix: '년',
                        firstDay: 0,
                        numberOfMonths: 1
                    }
                }

                if (columnInfo.type == 'dropdown') {
                    var hiddenColumnInfo = {
                        data: columnInfo.codeColumnID,
                        type: columnInfo.codeColumnType,
                        filter: true,
                        readOnly: true,
                        className: 'htLeft',
                        belongID: columnInfo.codeBelongID ? columnInfo.codeBelongID : $ref.clone(column[7])
                    }

                    if (columnInfo.codeColumnHidden == true) {
                        gridSetting.colHeaders.push(column[1] + '_$HIDDEN');
                        columnInfo.columnText = column[1] + '_$HIDDEN';
                    }
                    else {
                        gridSetting.colHeaders.push(column[1] + '_코드');
                        columnInfo.columnText = column[1] + '_코드';
                    }
                    gridSetting.columns.push(hiddenColumnInfo);
                    gridSetting.colWidths.push(column[2]);
                }

                gridSetting.colHeaders.push(column[1]);
                columnInfo.columnText = column[1];
                gridSetting.columns.push(columnInfo);
                gridSetting.colWidths.push(column[2]);
            }

            var headerLength = gridSetting.colHeaders.length;
            for (var i = 0; i < headerLength; i++) {
                var colHeader = gridSetting.colHeaders[i];
                if (colHeader.indexOf('_$HIDDEN') > -1) {
                    gridSetting.hiddenColumns.columns.push((i + 1));
                }
            }

            for (var i = 0; i < headerLength; i++) {
                var columnInfo = gridSetting.columns[i];
                if (columnInfo.isHidden == true) {
                    gridSetting.hiddenColumns.columns.push((i + 1));
                }
            }

            return gridSetting;
        },

        merge: function (elID, startRow, startColumn, endRow, endColumn) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var mergePlugin = hot.getPlugin('mergeCells');

                if (mergePlugin.isEnabled() == false) {
                    mergePlugin.enablePlugin();
                }

                mergePlugin.merge(startRow, startColumn, endRow, endColumn);
            }
        },

        unmerge: function (elID, startRow, startColumn, endRow, endColumn) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var mergePlugin = hot.getPlugin('mergeCells');

                if (mergePlugin.isEnabled() == false) {
                    mergePlugin.enablePlugin();
                }

                mergePlugin.unmerge(startRow, startColumn, endRow, endColumn);
            }
        },

        addCondition: function (elID, col, name, args) {
            /*
            name에 들어갈수 있는 조건
            begins_with: 로 시작
            between: 사이
            by_value: 값
            contains: 포함
            empty: 비우기
            ends_with: 로 끝나다
            eq: 같음
            gt:  보다 큰
            gte: 크거나 같음
            lt: 이하
            lte: 이하거나 같음
            none: 없음 (필터 없음)
            not_between: 사이가 아님
            not_contains: 포함하지 않음
            not_empty: 비우지 않음
            neq: 같지 않다
             */
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var filtersPlugin = hot.getPlugin('filters');

                if (filtersPlugin.isEnabled() == false) {
                    filtersPlugin.enablePlugin();
                }

                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }

                if ($ref.isString(args) == true) {
                    args = [args];
                }

                filtersPlugin.addCondition(col, name, args);
                filtersPlugin.filter();
            }
        },

        removeCondition: function (elID, col) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var filtersPlugin = hot.getPlugin('filters');

                if (filtersPlugin.isEnabled() == false) {
                    filtersPlugin.enablePlugin();
                }

                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }

                filtersPlugin.removeConditions(col);
                filtersPlugin.filter();
            }
        },

        clearConditions: function (elID) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var filtersPlugin = hot.getPlugin('filters');

                if (filtersPlugin.isEnabled() == false) {
                    filtersPlugin.enablePlugin();
                }

                filtersPlugin.clearConditions();
                filtersPlugin.filter();
            }
        },

        countRows: function (elID, isIncludeHidden) {
            var result = 0;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var hiddenRowCount = 0;
                if (isIncludeHidden === true) {
                    var hiddenRowsPlugin = hot.getPlugin('hiddenRows');

                    if (hiddenRowsPlugin.isEnabled() == false) {
                        hiddenRowsPlugin.enablePlugin();
                    }
                    hiddenRowCount = hiddenRowsPlugin ? hiddenRowsPlugin.hiddenRows.length : 0;
                }
                var sourceRowCount = hot.countSourceRows();
                result = (sourceRowCount - hiddenRowCount);
            }

            return result;
        },

        countRenderedRows: function (elID) {
            var result = -1;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.countRenderedRows();
            }

            return result;
        },

        countRenderedCols: function (elID) {
            var result = -1;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.countRenderedCols();
            }

            return result;
        },

        insertRow: function (elID, setting, callback) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                setting = syn.$w.argumentsExtend({
                    index: hot.countRows(),
                    amount: 1
                }, setting);

                hot.alter('insert_row', setting.index, setting.amount);
                hot.render();
            }

            var gridValue = $grid.getGridValue(elID);
            gridValue.eventName = 'insertRow';

            var row = (setting && setting.index) ? setting.index : 0;
            var gridSetting = hot.getSettings();
            if (gridSetting) {
                var checkboxDefaultValues = [];
                var columns = gridSetting.columns;
                var length = columns.length;
                for (var col = 0; col < length; col++) {
                    var column = columns[col];
                    if (col >= 0 && (column.type == 'checkbox' || column.type == 'checkbox2')) {
                        var defaultValue = false;
                        if (column.uncheckedTemplate != undefined || column.uncheckedTemplate != null) {
                            defaultValue = column.uncheckedTemplate;
                        }
                        checkboxDefaultValues.push([row, col, defaultValue]);
                    }
                }

                if (checkboxDefaultValues.length > 0) {
                    hot.setDataAtCell(checkboxDefaultValues);
                }
            }

            var triggerOptions = syn.$w.getTriggerOptions(elID);
            if (triggerOptions) {
                if (triggerOptions.sourceValueID && triggerOptions.targetColumnID) {
                    var mod = window[syn.$w.pageScript];
                    if (mod) {
                        var synControls = mod.context.synControls;
                        if (synControls && synControls.length > 0) {
                            if ($ref.isString(triggerOptions.sourceValueID) == true && $ref.isString(triggerOptions.targetColumnID) == true) {
                                var keyValues = triggerOptions.sourceValueID.split('@');
                                var dataFieldID = keyValues[0];
                                var dataColumnID = keyValues[1];
                                var items = synControls.filter(function (item) {
                                    return item.field == dataFieldID;
                                });

                                if (items.length == 1) {
                                    var controlInfo = items[0];

                                    if (controlInfo.type == 'grid') {
                                        var targetCol = hot.propToCol(triggerOptions.targetColumnID);
                                        var sourceGridID = controlInfo.id;
                                        var sourceRow = $grid.getActiveRowIndex(sourceGridID);
                                        var sourceCol = $grid.propToCol(sourceGridID, dataColumnID);
                                        var sourceValue = $grid.getDataAtCell(sourceGridID, sourceRow, sourceCol);
                                        hot.setDataAtCell(row, targetCol, sourceValue);
                                    }
                                    else {
                                        var col = hot.propToCol(triggerOptions.targetColumnID);
                                        var el = syn.$l.querySelector('[syn-datafield="{0}"] #{1}'.format(dataFieldID, dataColumnID));
                                        if (el) {
                                            hot.setDataAtCell(row, col, el.value);
                                        }
                                    }
                                }
                                else {
                                    syn.$l.eventLog('insertRow', '{0} 컬럼 ID 중복 또는 존재여부 확인 필요'.format(dataFieldID), 'Debug');
                                }
                            }
                            else if ($ref.isArray(triggerOptions.sourceValueID) == true && $ref.isArray(triggerOptions.targetColumnID) == true) {
                                var length = triggerOptions.sourceValueID.length;
                                for (var i = 0; i < length; i++) {
                                    var sourceValueID = triggerOptions.sourceValueID[i];
                                    var keyValues = sourceValueID.split('@');
                                    var dataFieldID = keyValues[0];
                                    var dataColumnID = keyValues[1];
                                    var items = synControls.filter(function (item) {
                                        return item.field == dataFieldID;
                                    });

                                    if (items.length == 1) {
                                        var controlInfo = items[0];

                                        if (controlInfo.type == 'grid') {
                                            var targetCol = hot.propToCol(triggerOptions.targetColumnID[i]);
                                            var sourceGridID = controlInfo.id;
                                            var sourceRow = $grid.getActiveRowIndex(sourceGridID);
                                            var sourceCol = $grid.propToCol(sourceGridID, dataColumnID);
                                            var sourceValue = $grid.getDataAtCell(sourceGridID, sourceRow, sourceCol);
                                            hot.setDataAtCell(row, targetCol, sourceValue);
                                        }
                                        else {
                                            var col = hot.propToCol(triggerOptions.targetColumnID[i]);
                                            var el = syn.$l.querySelector('[syn-datafield="{0}"] #{1}'.format(dataFieldID, dataColumnID));
                                            if (el) {
                                                hot.setDataAtCell(row, col, el.value);
                                            }
                                        }
                                    }
                                    else {
                                        syn.$l.eventLog('insertRow', '{0} 컬럼 ID 중복 또는 존재여부 확인 필요'.format(dataFieldID), 'Debug');
                                    }
                                }
                            }
                        }
                    }
                }

                if (triggerOptions.focusColumnID) {
                    var col = hot.propToCol(triggerOptions.focusColumnID);
                    hot.selectCell(row, col);
                }
            }

            if (callback) {
                callback(row);
            }

            gridValue.eventName = '';
        },

        removeRow: function (elID, callback, rowIndex) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($object.isNullOrUndefined(rowIndex) == true) {
                    var selected = hot.getSelected();
                    if (selected) {
                        rowIndex = selected[0][0];
                    }
                    else {
                        rowIndex = $grid.getActiveRowIndex(elID);
                    }
                }

                if ($grid.isRowHidden(elID, rowIndex) == true) {
                    return;
                }

                if ($object.isNullOrUndefined(rowIndex) == true) {
                    rowIndex = hot.countSourceRows() - 1;
                }

                if (rowIndex > -1) {
                    var gridValue = $grid.getGridValue(elID);
                    gridValue.eventName = 'removeRow';

                    var physicalRowIndex = hot.toPhysicalRow(rowIndex);

                    var rowData = hot.getSourceDataAtRow(physicalRowIndex);
                    var rowFlag = rowData && rowData.Flag ? rowData.Flag : 'C';

                    if (rowFlag == 'D') {
                        rowFlag = 'U';
                        hot.setDataAtCell(rowIndex, 0, rowFlag);

                        for (var i = 0; i < hot.countCols(); i++) {
                            var cellMeta = hot.getCellMeta(rowIndex, i)['className'];
                            cellMeta = cellMeta.replace(' removeRow', '');
                            hot.setCellMeta(rowIndex, i, 'className', cellMeta);
                        }
                        hot.render();
                    }
                    else {
                        if (rowFlag == 'R' || rowFlag == 'U') {
                            rowFlag = 'D';
                        }

                        if (rowFlag == 'C' || rowFlag == 'S') {
                        } else {
                            hot.setDataAtCell(rowIndex, 0, rowFlag);
                        }

                        if (rowFlag == 'C') {
                            hot.alter('remove_row', rowIndex);

                            var countRows = hot.countSourceRows();
                            var triggerOptions = syn.$w.getTriggerOptions(elID);
                            if (triggerOptions && triggerOptions.focusColumnID) {
                                var col = hot.propToCol(triggerOptions.focusColumnID);
                                if (rowIndex > 0 && rowIndex >= countRows) {
                                    rowIndex = countRows - 1;
                                    hot.selectCell(rowIndex, col);
                                }
                                else {
                                    hot.selectCell(rowIndex - 1, col);
                                }
                            }
                        } else if (rowFlag != 'S') {
                            var gridSettings = hot.getSettings();
                            if (gridSettings.isRemoveRowHidden === true) {
                                $grid.visibleRows(elID, rowIndex, false);
                            }
                            else {
                                for (var i = 0; i < hot.countCols(); i++) {
                                    hot.setCellMeta(rowIndex, i, 'className', hot.getCellMeta(rowIndex, i)['className'] + ' removeRow');
                                }
                            }
                            hot.render();
                        }
                    }

                    if (callback) {
                        callback(rowIndex);
                    }

                    gridValue.eventName = '';
                }
            }
        },

        loadData: function (elID, objectData, callback) {
            var hot = $grid.getGridControl(elID);
            if (hot) {

                var gridValue = $grid.getGridValue(elID);
                gridValue.applyCells = false;

                hot.deselectCell();
                $grid.clearConditions(elID);
                $grid.unHiddenRows(elID);

                var checkELs = syn.$l.querySelectorAll('div.handsontable > div table input[type=checkbox][columnSelectAll]');
                for (var i = 0; i < checkELs.length; i++) {
                    var checkEL = checkELs[i];
                    checkEL.checked = false;
                }

                var labelELs = syn.$l.querySelectorAll('div.handsontable > div table label.ui_checkbox');
                for (var i = 0; i < labelELs.length; i++) {
                    var labelEL = labelELs[i];
                    syn.$m.removeClass(labelEL, 'ui_checkbox');
                }

                var length = objectData.length;
                for (var i = 0; i < length; i++) {
                    objectData[i].Flag = 'R';
                }

                hot.loadData(objectData);

                var setting = hot.getSettings();
                for (var i = 0; i < setting.columns.length; i++) {
                    var column = setting.columns[i];
                    if (column.toogleChecked) {
                        column.toogleChecked = 0;
                    }
                }

                gridValue.colHeaderClick = false;
                gridValue.previousRow = -1;
                gridValue.previousCol = -1;

                if (setting.columnSorting != false) {
                    var columnSortingPlugin = hot.getPlugin('columnSorting');

                    if (columnSortingPlugin.isEnabled() == false) {
                        columnSortingPlugin.enablePlugin();
                    }

                    if (columnSortingPlugin.isSorted() == true) {
                        columnSortingPlugin.sort(columnSortingPlugin.sortColumn, columnSortingPlugin.sortOrder);
                    }
                }

                gridValue.applyCells = true;
            }

            if (callback) {
                callback();
            }
        },

        getFirstShowColIndex: function (elID) {
            var result = 0;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var settings = hot.getSettings();
                if (settings.firstShowColIndex) {
                    result = settings.firstShowColIndex;
                }
                else {
                    var countCols = (hot.countCols() - 1);
                    var cols = [];
                    for (var i = 0; i <= countCols; i++) {
                        cols.push(i);
                    }

                    if (settings.hiddenColumns && settings.hiddenColumns.columns && settings.hiddenColumns.columns.length > 0) {
                        var length = settings.hiddenColumns.columns.length;
                        for (var i = 0; i < length; i++) {
                            var hiddenCol = settings.hiddenColumns.columns[i];
                            for (var j = (cols.length - 1); j > -1; j--) {
                                if (hiddenCol == cols[j]) {
                                    $array.removeAt(cols, j);
                                    break;
                                }
                            }
                        }

                        result = cols[0];
                    }
                }
            }

            return result;
        },

        getLastShowColIndex: function (elID) {
            var result = 0;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var settings = hot.getSettings();
                if (settings.lastShowColIndex) {
                    result = settings.lastShowColIndex;
                }
                else {
                    result = (hot.countCols() - 1);
                    var cols = [];
                    for (var i = 0; i <= result; i++) {
                        cols.push(i);
                    }

                    if (settings.hiddenColumns && settings.hiddenColumns.columns && settings.hiddenColumns.columns.length > 0) {
                        var length = settings.hiddenColumns.columns.length;
                        for (var i = 0; i < length; i++) {
                            var hiddenCol = settings.hiddenColumns.columns[i];
                            for (var j = (cols.length - 1); j > -1; j--) {
                                if (hiddenCol == cols[j]) {
                                    $array.removeAt(cols, i);
                                    break;
                                }
                            }
                        }

                        result = cols[(cols.length - 1)];
                    }
                }
            }

            return result;
        },

        updateSettings: function (elID, settings, isDataClear) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if (isDataClear && isDataClear == true) {
                    $grid.clear(elID);
                }

                hot.updateSettings(settings);
                hot.render();
            }
        },

        getSettings: function (elID) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.getSettings();
            }

            return result;
        },

        isUpdateData: function (elID) {
            var result = false;
            var gridSettings = $grid.getSettings(elID);
            if (gridSettings) {
                if (gridSettings.data && gridSettings.data.length > 0) {
                    var length = gridSettings.data.length;
                    for (var i = 0; i < length; i++) {
                        var flag = gridSettings.data[i]['Flag'];
                        if ($string.isNullOrEmpty(flag) == true || flag == 'R' || flag == 'S') {
                            continue;
                        }
                        else {
                            result = true;
                            break;
                        }
                    }
                }
            }

            return result;
        },

        getFlag: function (elID, row) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                return hot.getDataAtCell(row, 'Flag');
            }
        },

        setFlag: function (elID, row, flagValue) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var col = hot.propToCol('Flag');
                var flag = hot.getDataAtCell(row, col);
                if (flag != 'S') {
                    hot.setDataAtCell(row, col, flagValue);
                }
            }
        },

        getDataAtCell: function (elID, row, col) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                return hot.getDataAtCell(row, col);
            }
        },

        scrollViewportTo: function (elID, row, column, snapToBottom, snapToRight) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.scrollViewportTo(row, column, snapToBottom, snapToRight);
            }

            return result;
        },

        isEmptyRow: function (elID, row) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.isEmptyRow(row);
            }

            return result;
        },

        isEmptyCol: function (elID, col) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }
                result = hot.isEmptyCol(col);
            }

            return result;
        },

        getDataAtRow: function (elID, row) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.getDataAtRow(row);
            }

            return result;
        },

        getSourceDataAtRow: function (elID, row) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.getSourceDataAtRow(row);
            }

            return result;
        },

        getDataAtCol: function (elID, col) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }
                result = hot.getDataAtCol(col);
            }

            return result;
        },

        getSourceDataAtCol: function (elID, col) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }
                result = hot.getSourceDataAtCol(col);
            }

            return result;
        },

        getRowHeader: function (elID, row) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.getRowHeader(row);
            }

            return result;
        },

        setDataAtCell: function (elID, row, col, value, source) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }
                hot.setDataAtCell(row, col, value, source);
            }
        },

        setDataAtRow: function (elID, values) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                hot.setDataAtCell(values);
            }
        },

        isCellClassName: function (elID, row, col, className) {
            var result = false;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }

                var meta = hot.getCellMeta(row, col)['className'];
                result = (meta != null && meta.indexOf(className) > -1);
            }

            return result;
        },

        // className: .handsontable .my-class {background: #fea!important;}
        setCellClassName: function (elID, row, col, className, isApply) {
            if ($object.isNullOrUndefined(className) == true) {
                syn.$l.eventLog('$grid.setCellClassName', 'className 확인 필요', 'Warning');
            }
            else {
                var hot = $grid.getGridControl(elID);
                if (hot) {
                    if ($ref.isString(col) == true) {
                        col = hot.propToCol(col);
                    }

                    if ($object.isNullOrUndefined(isApply) == true) {
                        isApply = false;
                    }

                    var execute = function (row, col, className, isApply) {
                        var meta = hot.getCellMeta(row, col)['className'];
                        if (meta) {
                            if (isApply === true) {
                                if (meta.indexOf(className) == -1) {
                                    hot.setCellMeta(row, col, 'className', hot.getCellMeta(row, col)['className'] + ' ' + className);
                                }
                            }
                            else {
                                if (meta.indexOf(className) > -1) {
                                    meta = meta.replace(' ' + className, '');
                                    hot.setCellMeta(row, col, 'className', meta);
                                }
                            }
                        }
                        else {
                            hot.setCellMeta(row, col, 'className', className);
                        }
                    }

                    if (row == -1 && col == -1) {
                        var rowCount = hot.countRows();
                        var colCount = hot.countCols();
                        for (var i = 0; i < rowCount; i++) {
                            for (var j = 0; j < colCount; j++) {
                                execute(i, j, className, isApply);
                            }
                        }
                    }
                    else if (row == -1 && col > -1) {
                        var rowCount = hot.countRows();
                        for (var i = 0; i < rowCount; i++) {
                            execute(i, col, className, isApply);
                        }
                    }
                    else if (row > -1 && col == -1) {
                        var colCount = hot.countCols();
                        for (var i = 0; i < colCount; i++) {
                            execute(row, i, className, isApply);
                        }
                    }
                    else {
                        execute(row, col, className, isApply);
                    }

                    hot.render();
                }
            }
        },

        setCellMeta: function (elID, row, col, key, value) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }
                hot.setCellMeta(row, col, key, value);
            }
        },

        setDataAtRowProp: function (elID, row, col, value, source) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }
                hot.setDataAtRowProp(row, col, value, source);
            }
        },

        getCellMeta: function (elID, row, col) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }
                result = hot.getCellMeta(row, col);
            }
            return result;
        },

        getCellMetaAtRow: function (elID, row) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.getCellMetaAtRow(row);
            }
            return result;
        },

        getUpdateData: function (elID, requestType, metaColumns) {
            var result = [];
            var hot = $grid.getGridControl(elID);
            if (metaColumns) {
                if (requestType == 'Row') {
                    var physicalRowIndex = hot.toPhysicalRow($grid.getActiveRowIndex(elID));

                    if (physicalRowIndex != null && physicalRowIndex > -1) {
                        var rowData = hot.getSourceDataAtRow(physicalRowIndex);
                        var rowFlag = rowData.Flag ? rowData.Flag : 'C';
                        var rowMeta = hot.getCellMetaAtRow(physicalRowIndex);
                        if (rowFlag && rowFlag != 'S') {
                            rowData = $ref.clone(rowData);

                            var data = {};
                            data.Flag = rowFlag;

                            for (var key in metaColumns) {
                                var column = metaColumns[key];
                                var rowValue = rowData[key];

                                data[column.FieldID] = rowValue;
                                if (rowValue === undefined) {
                                    data[column.FieldID] = column.DataType == 'number' ? null : $ref.defaultValue(column.DataType);
                                } else {
                                    data[column.FieldID] = rowValue;
                                }
                            }

                            result.push(data);
                        }
                    }
                } else if (requestType == 'List') {
                    var length = hot.countSourceRows();

                    for (var rowIndex = 0; rowIndex < length; rowIndex++) {
                        var physicalRowIndex = hot.toPhysicalRow(rowIndex);

                        if (physicalRowIndex == null) {
                            continue;
                        }

                        var rowData = hot.getSourceDataAtRow(physicalRowIndex);
                        var rowFlag = rowData.Flag ? rowData.Flag : 'C';
                        var rowMeta = hot.getCellMetaAtRow(physicalRowIndex);
                        if (rowFlag && rowFlag != 'S') {
                            if (rowFlag != 'R') {
                                rowData = $ref.clone(rowData);

                                var data = {};
                                data.Flag = rowFlag;

                                for (var key in metaColumns) {
                                    var column = metaColumns[key];
                                    var rowValue = rowData[key];

                                    data[column.FieldID] = rowValue;
                                    if (rowValue === undefined) {
                                        data[column.FieldID] = column.DataType == 'number' ? null : $ref.defaultValue(column.DataType);
                                    } else {
                                        data[column.FieldID] = rowValue;
                                    }
                                }

                                result.push(data);
                            }
                        }
                    }
                }
            } else {
                syn.$l.eventLog('getUpdateData', 'Input Mapping 설정 없음', 'Debug');
            }

            return result;
        },

        validateColumns: function (elID, columns, callback) {
            var result = false;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.validateColumns(columns, callback);
            }
            return result;
        },

        validateRows: function (elID, rows, callback) {
            var result = false;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.validateRows(rows, callback);
            }
            return result;
        },

        getPhysicalRowIndex: function (elID, logicalRowIndex) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.toPhysicalRow(logicalRowIndex);
            }
            return result;
        },

        getPhysicalColIndex: function (elID, logicalColIndex) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.toPhysicalColumn(logicalColIndex);
            }
            return result;
        },

        getLogicalRowIndex: function (elID, physicalRowIndex) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.toVisualRow(physicalRowIndex);
            }
            return result;
        },

        getLogicalColIndex: function (elID, physicalColIndex) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.toVisualColumn(physicalColIndex);
            }
            return result;
        },

        unHiddenColumns: function (elID) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var hiddenPlugin = hot.getPlugin('hiddenColumns');

                if (hiddenPlugin.isEnabled() == false) {
                    hiddenPlugin.enablePlugin();
                }

                var colCount = hot.countCols();
                var columns = [];
                for (var i = 0; i < colCount; i++) {
                    if (hot.colToProp(i) == 'Flag') {
                        continue;
                    }

                    if (hiddenPlugin.isHidden(i) == true) {
                        columns.push(i);
                    }
                }

                $grid.visibleColumns(elID, columns, true);
            }
        },

        isColumnHidden: function (elID, colIndex, isPhysicalIndex) {
            var result = false;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var hiddenPlugin = hot.getPlugin('hiddenColumns');

                if (hiddenPlugin.isEnabled() == false) {
                    hiddenPlugin.enablePlugin();
                }

                result = hiddenPlugin.isHidden(colIndex, isPhysicalIndex);
            }

            return result;
        },

        visibleColumns: function (elID, columns, isShow) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var hiddenPlugin = hot.getPlugin('hiddenColumns');

                if (hiddenPlugin.isEnabled() == false) {
                    hiddenPlugin.enablePlugin();
                }

                var gridSettings = hot.getSettings();
                var gridColumns = gridSettings.columns;

                if (isShow == true) {
                    if ($ref.isNumber(columns) == true) {
                        gridColumns[columns].isHidden = false;
                        hiddenPlugin.showColumn(columns);
                    } else {
                        for (var i = 0; i < columns.length; i++) {
                            var column = gridColumns[columns[i]];
                            column.isHidden = false;
                        }
                        hiddenPlugin.showColumns(columns);
                    }
                } else {
                    if ($ref.isNumber(columns) == true) {
                        gridColumns[columns].isHidden = true;
                        hiddenPlugin.hideColumn(columns);
                    } else {
                        for (var i = 0; i < columns.length; i++) {
                            var column = gridColumns[columns[i]];
                            column.isHidden = true;
                        }
                        hiddenPlugin.hideColumns(columns);
                    }
                }
                hot.render();
            }
        },

        unHiddenRows: function (elID) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var hiddenPlugin = hot.getPlugin('hiddenRows');

                if (hiddenPlugin.isEnabled() == false) {
                    hiddenPlugin.enablePlugin();
                }

                var rowCount = hot.countRows();
                var rows = [];
                for (var i = 0; i < rowCount; i++) {
                    if (hiddenPlugin.isHidden(i) == true) {
                        rows.push(i);
                    }
                }

                $grid.visibleRows(elID, rows, true);
            }
        },

        isRowHidden: function (elID, rowIndex, isPhysicalIndex) {
            var result = false;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var hiddenPlugin = hot.getPlugin('hiddenRows');

                if (hiddenPlugin.isEnabled() == false) {
                    hiddenPlugin.enablePlugin();
                }

                result = hiddenPlugin.isHidden(rowIndex, isPhysicalIndex);
            }

            return result;
        },

        visibleRows: function (elID, rows, isShow) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var hiddenRowsPlugin = hot.getPlugin('hiddenRows');

                if (hiddenRowsPlugin.isEnabled() == false) {
                    hiddenRowsPlugin.enablePlugin();
                }

                if (isShow == true) {
                    if ($ref.isNumber(rows) == true) {
                        hiddenRowsPlugin.showRow(rows);
                    } else {
                        hiddenRowsPlugin.showRows(rows);
                    }
                } else {
                    if ($ref.isNumber(rows) == true) {
                        hiddenRowsPlugin.hideRow(rows);
                    } else {
                        hiddenRowsPlugin.hideRows(rows);
                    }
                }
                hot.render();
            }
        },

        propToCol: function (elID, columnName) {
            var result = -1;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.propToCol(columnName);
            }

            return result;
        },

        getColHeader: function (elID, col) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.getColHeader(col);
            }

            return result;
        },

        colToProp: function (elID, col) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.colToProp(col);
            }

            return result;
        },

        countCols: function (elID) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.countCols();
            }

            return result;
        },

        getSelected: function (elID) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.getSelected();
            }

            return result;
        },

        getActiveRowIndex: function (elID) {
            var result = -1;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var selected = hot.getSelected();
                if (selected && selected.length > 0) {
                    result = hot.getSelected()[0][0];
                }
                else {
                    var gridValue = $grid.getGridValue(elID);
                    result = gridValue.previousRow;
                }
            }

            return result;
        },

        getActiveColIndex: function (elID) {
            var result = -1;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var selected = hot.getSelected();
                if (selected && selected.length > 0) {
                    result = hot.getSelected()[0][1];
                }
                else {
                    var gridValue = $grid.getGridValue(elID);
                    result = gridValue.previousCol;
                }
            }

            return result;
        },

        selectCell: function (elID, row, column, endRow, endColumn, scrollToCell, changeListener) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                if (row === -1) {
                    var hiddenRowCount = 0;
                    var hiddenRowsPlugin = hot.getPlugin('hiddenRows');

                    if (hiddenRowsPlugin.isEnabled() == false) {
                        hiddenRowsPlugin.enablePlugin();
                    }
                    hiddenRowCount = hiddenRowsPlugin ? hiddenRowsPlugin.hiddenRows.length : 0;
                    var sourceRowCount = hot.countSourceRows();
                    row = (sourceRowCount - hiddenRowCount) - 1;
                }

                hot.selectCell(row, column, endRow, endColumn, scrollToCell, changeListener);
            }
        },

        getExportPlugin: function (elID, options) {
            var result = null;
            var hot = $grid.getGridControl(elID);
            if (hot) {
                result = hot.getPlugin('exportFile');
                if (result.isEnabled() == false) {
                    result.enablePlugin();
                }
            }

            return result;
        },

        exportAsString: function (elID, options) {
            var result = null;

            var exportPlugin = $grid.getExportPlugin(elID, options);
            if (exportPlugin) {
                if ($object.isNullOrUndefined(options) == true) {
                    options = {};
                }

                var hot = $grid.getGridControl(elID);
                options = syn.$w.argumentsExtend({
                    exportHiddenRows: false,
                    exportHiddenColumns: false,
                    rowHeaders: false,
                    bom: false,
                    columnDelimiter: ',',
                    range: options.range ? options.range : [0, 1, hot.countRows(), hot.countCols() - 1],
                    filename: '{0}_{1}_{2}'.format(syn.$w.pageScript, elID, $date.toTicks(new Date()))
                }, options);

                options.columnHeaders = false;

                var gridColumns = hot.getSettings().columns;
                var exportColumns = [];
                var lowEnd = options.range ? options.range[1] : 1;
                var highEnd = options.range ? options.range[3] : hot.countCols() - 1;
                for (var i = lowEnd; i <= highEnd; i++) {
                    exportColumns.push(gridColumns[i]);
                }

                var columnIDs = exportColumns
                    .filter(function (item) { return options.exportHiddenColumns == true || item.isHidden == false; })
                    .map(function (item) { return item.columnText; });

                var exportString = exportPlugin.exportAsString('csv', options);
                result = columnIDs.join(',') + '\r\n' + exportString;
            }

            return result;
        },

        exportFile: function (elID, options) {
            var exportPlugin = $grid.getExportPlugin(elID, options);
            if (exportPlugin) {
                if ($object.isNullOrUndefined(options) == true) {
                    options = {};
                }

                options = syn.$w.argumentsExtend({
                    fileType: 'excel',
                    exportHiddenRows: false,
                    exportHiddenColumns: false,
                    columnHeaders: true,
                    rowHeaders: false,
                    bom: false,
                    columnDelimiter: ','
                }, options);

                if (options.fileType == 'excel') {
                    var hot = $grid.getGridControl(elID);
                    var gridSettings = hot.getSettings();

                    var gridColumns = gridSettings.columns;
                    var exportColumns = [];
                    var lowEnd = options.range ? options.range[1] : 1;
                    var highEnd = options.range ? options.range[3] : hot.countCols() - 1;
                    for (var i = lowEnd; i <= highEnd; i++) {
                        exportColumns.push(gridColumns[i]);
                    }

                    var columnIndexs = exportColumns
                        .filter(function (item) { return options.exportHiddenColumns == true || item.isHidden == false; })
                        .map(function (item, index) {
                            return {
                                index: hot.propToCol(item.data),
                                type: item.type
                            }
                        });

                    var defaultExportColumns = gridSettings.exportColumns
                        .map(function (item, index) {
                            return {
                                index: hot.propToCol(item.columnID),
                                type: item.type
                            }
                        });

                    columnIndexs = $ref.extend(columnIndexs, defaultExportColumns);

                    var columnLength = columnIndexs.length;
                    var colWidths = gridSettings.colWidths;
                    var wsCols = [];
                    for (var i = 0; i < columnLength; i++) {
                        var columnIndex = columnIndexs[i].index;
                        wsCols.push({ wpx: colWidths[columnIndex] });
                    }

                    var value = $grid.exportAsString(elID, options);
                    var data = Papa.parse(value).data;
                    var dataLength = data.length;
                    var div = document.createElement("DIV");
                    for (var i = 0; i < columnLength; i++) {
                        if (columnIndexs[i].type == 'numeric') {
                            for (var j = 1; j < dataLength; j++) {
                                data[j][i] = $string.toParseType(data[j][i], 'number');
                            }
                        }
                        else if (columnIndexs[i].type.indexOf('html') > -1) {
                            for (var j = 1; j < dataLength; j++) {
                                div.innerHTML = data[j][i];
                                data[j][i] = div.textContent || div.innerText || '';
                            }
                        }
                    }
                    div = null;

                    var wb = XLSX.utils.book_new();
                    var newWorksheet = XLSX.utils.aoa_to_sheet(data);
                    newWorksheet['!cols'] = wsCols;
                    XLSX.utils.book_append_sheet(wb, newWorksheet, 'Sheet1');
                    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
                    syn.$r.blobToDownload(new Blob([syn.$l.stringToArrayBuffer(wbout)], { type: "application/octet-stream" }), options.filename + '.xlsx');
                }
                else if (options.fileType == 'csv') {
                    var hot = $grid.getGridControl(elID);
                    options = syn.$w.argumentsExtend({
                        range: options.range ? options.range : [0, 1, hot.countRows(), hot.countCols()],
                        filename: '{0}_{1}_{2}'.format(syn.$w.pageScript, elID, $date.toTicks(new Date()))
                    }, options);

                    exportPlugin.downloadFile('csv', options);
                }
            }
        },

        importFile: function (elID, callback) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var fileEL = syn.$l.get('{0}_ImportFile'.format(elID));
                fileEL.callback = callback;
                fileEL.click();
            }
        },

        importFileLoad: function (evt) {
            var el = evt.srcElement || evt.target;
            var elID = el.id.split('_')[0];
            var gridSettings = $grid.getSettings(elID);

            var validExts = ['.csv', '.xls', '.xlsx'];
            var fileName = el.files[0].name;
            var fileExtension = fileName.substring(fileName.lastIndexOf('.') == -1 ? fileName.length : fileName.lastIndexOf('.'))

            if (fileExtension && validExts.indexOf(fileExtension) < 0) {
                syn.$w.alert('{0} 확장자를 가진 파일만 가능합니다'.format(validExts.toString()));
                return false;
            }

            var reader = new FileReader();
            reader.onload = function (file) {
                var columnDelimiter = ',';
                el.value = '';
                var data = file.target.result;
                var hot = $grid.getGridControl(elID);
                if (fileExtension == '.csv') {
                    var lines = data.split(/\r\n|\n/);

                    if (lines.length == 0) {
                        $grid.clear(elID);
                    }
                    else if (lines.length > 0) {
                        var result = [];
                        var headers = lines[0].split(columnDelimiter);
                        var bindColumns = [];
                        var columns = gridSettings.columns.map(function (item) { return item.data; });
                        var columnTypes = gridSettings.columns.map(function (item) { return item.type; });
                        for (var i = 0; i < headers.length; i++) {
                            var value = headers[i];
                            value = value.replace(/^["]/, '');
                            value = value.replace(/["]$/, '');
                            headers[i] = value;

                            var colIndex = gridSettings.colHeaders.indexOf(value);
                            if (colIndex == -1) {
                                syn.$w.alert('올바른 형식의 파일이 아닙니다.\n파일을 확인해주세요.'.format(gridSettings.controlText));
                                return false;
                            }

                            var columnIndex = hot.propToCol(columns[colIndex]);
                            bindColumns.push({
                                headerIndex: i,
                                columnID: columns[colIndex],
                                columnIndex: columnIndex,
                                columnType: columnTypes[colIndex]
                            });
                        }

                        var line = lines[1];
                        var values = line.split(columnDelimiter);
                        for (var i = 0; i < bindColumns.length; i++) {
                            var bindColumn = bindColumns[i];
                            var value = values[i];
                            value = value.replace(/^["]/, '');
                            value = value.replace(/["]$/, '');

                            var isTypeCheck = true;
                            switch (bindColumn.columnType) {
                                case 'checkbox':
                                case 'checkbox2':
                                    isTypeCheck = $string.toBoolean(value);
                                    break;
                                case 'numeric':
                                    if (value == null) {
                                        value = 0;
                                    }

                                    isTypeCheck = $ref.isNumber(value) == true ? true : $string.isNumber(value);
                                    break;
                                case 'date':
                                    if (value == null) {
                                        isTypeCheck = true;
                                    } else {
                                        isTypeCheck = $ref.isDate(value);
                                    }
                                    break;
                                default:
                                    if (value == null) {
                                        value = '';
                                    }

                                    isTypeCheck = $ref.isString(value);
                                    break;
                            }

                            if (isTypeCheck == false) {
                                syn.$w.alert('올바른 형식의 파일이 아닙니다.\n파일을 확인해주세요.');
                                return false;
                            }
                        }

                        for (var i = 1; i < lines.length; i++) {
                            line = lines[i];
                            if ($string.isNullOrEmpty(line) == false) {
                                var obj = {};
                                var values = lines[i].split(columnDelimiter);
                                for (var j = 0; j < bindColumns.length; j++) {
                                    var bindColumn = bindColumns[j];
                                    var value = values[j];
                                    if ($object.isNullOrUndefined(value) == true) {
                                        value = '';
                                    }
                                    else {
                                        value = value.replace(/^["]/, '');
                                        value = value.replace(/["]$/, '');
                                    }

                                    if (bindColumn.columnType == 'numeric') {
                                        if (value != null) {
                                            value = $ref.isNumber(value) == true ? value : Number(value);
                                        }
                                    }

                                    obj[bindColumn.columnID] = value;
                                }

                                result.push(obj);
                            }
                        }
                    }
                }
                else {
                    var columns = gridSettings.columns.map(function (item) { return item.data; });
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var sheet = workbook.Sheets[workbook.SheetNames[0]];
                    var range = XLSX.utils.decode_range(sheet['!ref']);
                    for (var C = range.s.c; C <= range.e.c; ++C) {
                        var cellref = XLSX.utils.encode_cell({ c: C, r: 0 });
                        var cell = sheet[cellref];
                        if (cell == undefined) {
                            break;
                        }

                        var columnText = cell.v;
                        var colIndex = gridSettings.colHeaders.indexOf(columnText);
                        if (colIndex == -1) {
                            syn.$w.alert('올바른 형식의 파일이 아닙니다.\n파일을 확인해주세요.'.format(gridSettings.controlText));
                            return false;
                        }

                        var columnID = columns[colIndex];
                        cell.v = columnID;
                        cell.h = columnID;
                        cell.w = columnID;
                    }

                    result = XLSX.utils.sheet_to_json(sheet);
                }

                var metaColumns = {};
                for (var k = 0; k < gridSettings.columns.length; k++) {
                    var column = gridSettings.columns[k];
                    var dataType = 'string'
                    switch (column.type) {
                        case 'radio':
                        case 'checkbox':
                        case 'checkbox2':
                            dataType = 'bool';
                            break;
                        case 'numeric':
                            dataType = 'int';
                            break;
                        case 'date':
                            dataType = 'string';
                            break;
                    }

                    metaColumns[column.data] = {
                        FieldID: column.data,
                        DataType: dataType
                    };
                }

                $grid.clear(elID);
                $grid.setValue(elID, result, metaColumns);
                var col = hot.propToCol('Flag');

                var rowCount = hot.countRows(elID);
                var flags = [];
                for (var i = 0; i < rowCount; i++) {
                    flags.push([i, col, 'C']);
                }
                hot.setDataAtCell(flags);

                if (el.callback) {
                    el.callback(fileName);
                }
            };

            if (fileExtension == '.csv') {
                reader.readAsText(el.files[0]);
            }
            else {
                reader.readAsBinaryString(el.files[0]);
            }
        },

        getGridControl: function (elID) {
            var result = null;

            var length = $grid.gridControls.length;
            for (var i = 0; i < length; i++) {
                var item = $grid.gridControls[i];
                if (item.id == elID) {
                    result = item.hot;
                    break;
                }
            }

            return result;
        },

        getGridValue: function (elID) {
            var result = null;

            var length = $grid.gridControls.length;
            for (var i = 0; i < length; i++) {
                var item = $grid.gridControls[i];
                if (item.id == elID) {
                    result = item.value;
                    break;
                }
            }

            return result;
        },

        getGridSetting: function (elID) {
            var result = null;

            var length = $grid.gridControls.length;
            for (var i = 0; i < length; i++) {
                var item = $grid.gridControls[i];
                if (item.id == elID) {
                    result = item.setting;
                    break;
                }
            }

            return result;
        },

        getColumnWidths: function (elID) {
            var result = [];

            var hot = $grid.getGridControl(elID);
            if (hot) {
                var colCount = hot.countCols();

                for (var i = 0; i < colCount; i++) {
                    result.push(hot.getColWidth(i));
                }
            }

            return result;
        },

        setColumnWidth: function (elID, col, width) {
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var columnResizePlugin = hot.getPlugin('manualColumnResize');

                if (columnResizePlugin.isEnabled() == false) {
                    columnResizePlugin.enablePlugin();
                }

                if ($ref.isString(col) == true) {
                    col = hot.propToCol(col);
                }

                if ($ref.isNumber(width) == true) {
                    columnResizePlugin.setManualSize(col, width);
                }
            }
        },

        setControlSize: function (elID, size) {
            var el = syn.$l.get(elID);
            if (el && size) {
                if (size.width) {
                    el.style.width = size.width;
                }

                if (size.height) {
                    el.style.height = size.height;
                }

                $grid.getGridControl(elID).render();
            }
        },

        getValue: function (elID, requestType, metaColumns) {
            var result = [];
            var items = $grid.getUpdateData(elID, requestType, metaColumns);
            var length = items.length;
            for (var i = 0; i < length; i++) {
                var item = items[i];

                var row = [];
                for (var key in item) {
                    var serviceObject = { prop: key, val: item[key] };
                    row.push(serviceObject);
                }
                result.push(row);
            }
            return result;
        },

        setValue: function (elID, value, metaColumns) {
            var error = '';
            var hot = $grid.getGridControl(elID);
            if (hot) {
                var gridSettings = hot.getSettings();
                if (gridSettings && value && value.length > 0) {
                    var item = value[0];

                    for (var column in item) {
                        var isTypeCheck = false;
                        var metaColumn = metaColumns[column];
                        if (metaColumn) {
                            switch (metaColumn.DataType.toLowerCase()) {
                                case 'string':
                                    isTypeCheck = item[column] == null || $ref.isString(item[column]) || $string.isNumber(item[column]);
                                    break;
                                case 'bool':
                                    isTypeCheck = $string.toBoolean(item[column]);
                                    break;
                                case 'number':
                                case 'int':
                                    isTypeCheck = item[column] == null || $string.isNumber(item[column]) || $ref.isNumber(item[column]);
                                    break;
                                case 'date':
                                    isTypeCheck = item[column] == null || $ref.isDate(item[column]);
                                    break;
                                default:
                                    isTypeCheck = false;
                                    break;
                            }

                            if (isTypeCheck == false) {
                                error = '바인딩 데이터 타입과 매핑 정의가 다름, 바인딩 ID - "{0}", 타입 - "{1}"'.format(column, metaColumn.DataType);
                                break;
                            }
                        } else {
                            continue;
                        }
                    }

                    if (error == '') {
                        var columnInfos = gridSettings.columns;
                        var dropdownColumns = [];

                        for (var i = 0; i < columnInfos.length; i++) {
                            var columnInfo = columnInfos[i];
                            if (columnInfo.type == 'dropdown') {
                                dropdownColumns.push(columnInfo);
                            }
                        }

                        if (dropdownColumns.length > 0) {
                            for (var i = 0; i < dropdownColumns.length; i++) {
                                var columnInfo = dropdownColumns[i];
                                var dataSource = columnInfo.dataSource;
                                if (dataSource) {
                                    for (var j = 0; j < value.length; j++) {
                                        var code = value[j][columnInfo.codeColumnID];
                                        for (var k = 0; k < dataSource.DataSource.length; k++) {
                                            var item = dataSource.DataSource[k];
                                            if (item[dataSource.CodeColumnID] == code) {
                                                value[j][columnInfo.data] = item[dataSource.ValueColumnID];
                                                break;
                                            }
                                        }

                                    }
                                }
                            }
                        }

                        $grid.loadData(elID, value);
                        $grid.renderSummary(hot);
                    } else {
                        syn.$l.eventLog('syn.uicontrols.$grid', error, 'Debug');
                    }
                } else {
                    $grid.loadData(elID, []);
                    $grid.renderSummary(hot);
                }
            }
        },

        renderSummary: function (hot) {
            var gridSettings = hot.getSettings();
            if (gridSettings.summarys && gridSettings.summarys.length > 0) {
                var setting = {
                    index: hot.countRows(),
                    amount: 1
                };

                hot.alter('insert_row', setting.index, setting.amount);
                hot.render();

                var gridValue = $grid.getGridValue(hot.elID);
                gridValue.applyCells = true;

                $grid.refreshSummary(hot.elID);
            }
        },

        refreshSummary: function (elID) {
            var hot = $grid.getGridControl(elID);
            var gridSettings = hot.getSettings();
            if (gridSettings.summarys && gridSettings.summarys.length > 0) {
                var lastRowIndex = gridSettings.data.length - 1;
                var rowValue = [];
                var length = gridSettings.summarys.length;
                var calcFunction = function (val) {
                    return ($string.isNullOrEmpty(val) == true || $string.isNumber(val) == false) ? 0 : parseFloat($ref.isNumber(val) ? val : $string.toNumber(val));
                };

                for (var i = 0; i < length; i++) {
                    var summary = 0;
                    var summaryColumn = gridSettings.summarys[i];
                    var col = hot.propToCol(summaryColumn.columnID);
                    var columnMap = gridSettings.data.map(function (item) { return item.Flag && item.Flag != 'S' && item[summaryColumn.columnID]; });
                    if (columnMap.length > 0) {
                        var columnData = JSON.parse(JSON.stringify(columnMap));
                        switch (summaryColumn.type) {
                            case 'min':
                                $array.sort(columnData, true);
                                var val = columnData[0];
                                summary = calcFunction(val);
                                break;
                            case 'max':
                                $array.sort(columnData, false);
                                var val = columnData[0];
                                summary = calcFunction(val);
                                break;
                            case 'avg':
                                for (var j = 0; j < columnData.length; j++) {
                                    var val = columnData[j];
                                    summary += calcFunction(val);
                                }

                                summary = summary / columnData.length;
                                break;
                            case 'sum':
                                for (var j = 0; j < columnData.length; j++) {
                                    var val = columnData[j];
                                    summary += calcFunction(val);
                                }
                                break;
                            case 'count':
                                summary = columnData.length - 1;
                                break;
                            case 'custom':
                                var mod = window[syn.$w.pageScript];
                                if (mod) {
                                    var eventHandler = mod.event['{0}_customSummary'.format(hot.elID)];
                                    if (eventHandler) {
                                        summary = eventHandler.apply(hot, [hot.elID, summaryColumn.columnID, col, columnData]);
                                    }
                                }
                                break;
                        }

                        if (summaryColumn.type != 'custom') {
                            if ($object.isNullOrUndefined(summaryColumn.fixed) == true) {
                                summary = summary.toFixed(summaryColumn.type == 'avg' ? 1 : 0);
                            }
                            else {
                                summary = summary.toFixed(summaryColumn.fixed);
                            }

                            if ($object.isNullOrUndefined(summaryColumn.format) == true) {
                                summary = $string.toCurrency(summary);
                            }
                            else {
                                if (summaryColumn.format === true) {
                                    summary = $string.toCurrency(summary);
                                }
                                else {
                                    summary = summary.toString();
                                }
                            }
                        }

                        rowValue.push([lastRowIndex, col, summary]);
                    }
                }

                rowValue.push([lastRowIndex, 0, 'S']);
                hot.setDataAtCell(rowValue);
            }
        },

        clear: function (elID, isControlLoad) {
            $grid.loadData(elID, []);
        },

        setLocale: function (elID, translations, control, options) {
            var el = syn.$l.get(elID);
            var bind = $resource.getBindSource(control);
            if (bind != null) {
                var value = $resource.translateText(control, options);
                if (value) {
                    el[bind] = value;
                }
            }
            // debugger;
        }
    });
    syn.uicontrols.$grid = $grid;
})(window);

