/// <reference path="/Scripts/syn.js" />

(function (window) {
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $chart = syn.uicontrols.$chart || new syn.module();

    $chart.extend({
        name: 'syn.uicontrols.$chart',
        version: '1.0',
        chartControls: [],
        defaultSetting: {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['A', 'B', 'C']
            },
            yAxis: {
                title: {
                    text: 'Values'
                }
            },
            series: [{
                name: 'Series 1',
                data: [1, 0, 4]
            }, {
                name: 'Series 2',
                data: [5, 7, 3]
            }],
            dataType: 'string',
            belongID: null,
            controlText: null,
            validators: null,
            transactConfig: null,
            triggerConfig: null
        },

        controlLoad: function (elID, setting) {
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($chart.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod.hook.controlInit) {
                var moduleSettings = mod.hook.controlInit(elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
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

            parent.appendChild(wrapper);

            $chart.chartControls.push({
                id: elID,
                chart: Highcharts.chart(elID, setting),
                setting: $reflection.clone(setting)
            });
        },

        getValue: function (elID, meta) {
            var result = null;
            var chart = $chart.getChartControl(elID);
            if (chart) {
                result = [];
                var length = chart.series.length;
                for (var i = 0; i < length; i++) {
                    var serie = chart.series[i];
                    result.push({
                        name: serie.name,
                        data: serie.yData
                    });
                }
            }
            return result;
        },

        setValue: function (elID, value, meta) {
            var chart = $chart.getChartControl(elID);
            if (chart) {
                var seriesLength = chart.series.length;
                for (var i = seriesLength - 1; i > -1; i--) {
                    chart.series[i].remove();
                }
            }

            var length = value.length;
            for (var i = 0; i < length; i++) {
                var item = value[i];
                chart.addSeries(item);
            }
        },

        getChartControl: function (elID) {
            var result = null;

            var length = $chart.chartControls.length;
            for (var i = 0; i < length; i++) {
                var item = $chart.chartControls[i];
                if (item.id == elID) {
                    result = item.chart;
                    break;
                }
            }

            return result;
        },

        clear: function (elID, isControlLoad) {
            var chart = $chart.getChartControl(elID);
            while (chart.series.length > 0) {
                chart.series[0].remove(true);
            }
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$chart = $chart;
})(window);
