$w.initializeScript({
    frameEvent: function (eventName, jsonObject) {
        if (eventName == 'codeInit') {
            syn.$l.eventLog('ui_event', 'frameEvent - eventName: {0}, jsonObject: {1}'.format(eventName, JSON.stringify(jsonObject)));
            var parameterObject = $this.$codepicker.toParameterObject(jsonObject.parameters);
            parameterObject.ApplicationID = '1';
            jsonObject.parameters = $this.$codepicker.toParameterString(parameterObject);
        }
        else if (eventName == 'codeReturn') {
            syn.$l.eventLog('ui_event', 'frameEvent - eventName: {0}, jsonObject: {1}'.format(eventName, JSON.stringify(jsonObject)));
        }
    },

    pageFormInit: function () {
        $this.config.dataSource['MONTHWEEK'] = $this.calcMonthBetweenWeek('2021', '08');
    },

    ddlComboBox6_change: function () {
        syn.$l.eventLog('ddlComboBox6_change', syn.$l.get('ddlComboBox6').value);
    },

    btnUpdateDataSource_click: function () {
        var year = syn.$l.get('txtYear').value;
        var month = syn.$l.get('txtMonth').value;

        $this.config.dataSource['MONTHWEEK'] = $this.calcMonthBetweenWeek(year, month);
        $this.$select.loadData('ddlComboBox6', $this.config.dataSource['MONTHWEEK'], true);
    },

    calcMonthBetweenWeek: function (year, month) {
        var result = {
            CodeColumnID: 'CodeID',
            ValueColumnID: 'CodeValue',
            DataSource: []
        };

        if ($ref.isString(year) == true && $string.toNumber(year)) {
            year = parseInt(year);
        }

        if ($ref.isString(month) == true && $string.toNumber(month)) {
            month = parseInt(month);
        }

        month = (month - 1);
        var monthDays = (new Date(year, (month + 1), 0)).getDate();

        result.DataSource.length = 0;
        var offset = 1;
        var startWeekDay = '01';
        var endWeekDay = '01';

        for (var i = 1; i <= monthDays; i++) {
            var day = (new Date(year, month, i)).getDay();
            if ((day == 0) && i > 1) {
                var endWeekDay = i.toString().padStart(2, '0');

                result.DataSource.push({
                    CodeID: startWeekDay + '-' + endWeekDay,
                    CodeValue: offset.toString() + '주차'
                });

                offset = offset + 1;
                var startWeekDay = (i + 1).toString().padStart(2, '0');
            }
        }

        if (endWeekDay < monthDays) {
            result.DataSource.push({
                CodeID: startWeekDay + '-' + monthDays,
                CodeValue: offset.toString() + '주차'
            });
        }

        return result;
    },

    btnDataRefresh_click: function () {
        $this.$grid.dataRefresh('grdGrid', {
            columnName: 'GenderTypeName',
            dataSourceID: 'CH003',
            parameters: '@ApplicationID:1;',
            local: false,
            required: true
        });

        // $this.$grid.dataRefresh('grdGrid', {
        //     columnName: 'GenderTypeName',
        //     dataSourceID: 'ZCB001',
        //     parameters: '@CodeGroupID:CMM013;',
        //     local: false,
        //     required: true,
        //     selectedValue: '2'
        // });
    }
});