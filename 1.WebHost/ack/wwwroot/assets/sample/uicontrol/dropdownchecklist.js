$w.initializeScript({
    pageLoad: function () {
    },

    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$multiselect.getValue('ddlFileExtension')));
    },

    btnSetValue_click: function () {
        $this.$multiselect.setValue('ddlFileExtension', ['02', '05']);
    },

    btnClear_click: function () {
        $this.$multiselect.clear('ddlFileExtension');
    },

    btnLoadData_click: function () {
        var dataSource = {
            CodeColumnID: 'CodeID',
            ValueColumnID: 'CodeValue',
            DataSource: [
                {
                    CodeID: '0',
                    CodeValue: '남자'
                },
                {
                    CodeID: '1',
                    CodeValue: '여자'
                },
                {
                    CodeID: '2',
                    CodeValue: '공개안함'
                }
            ]
        };

        $this.$multiselect.loadData('ddlFileExtension', dataSource, true);
    },

    btnControlReload_click: function () {
        $this.$multiselect.controlReload('ddlFileExtension');
    },

    btnGetSelectedIndex_click: function () {
        syn.$l.eventLog('btnGetSelectedIndex_click', $this.$multiselect.getSelectedIndex('ddlFileExtension'));
    },

    btnSetSelectedIndex_click: function () {
        $this.$multiselect.setSelectedIndex('ddlFileExtension', 3);
    },

    btnGetSelectedValue_click: function () {
        syn.$l.eventLog('btnGetSelectedValue_click', $this.$multiselect.getSelectedValue('ddlFileExtension'));
    },

    btnGetSelectedText_click: function () {
        syn.$l.eventLog('btnGetSelectedText_click', $this.$multiselect.getSelectedText('ddlFileExtension'));
    },

    btnSetSelectedValue_click: function () {
        $this.$multiselect.setSelectedValue('ddlFileExtension', '1');

        setTimeout(function () {
            var values = [];
            values.push('1');
            values.push('2');
            values.push('3');
            values.push('4');
            $this.$multiselect.setSelectedValue('ddlFileExtension', values);
        }, 10000);
    },

    btnSetSelectedText_click: function () {
        syn.$l.eventLog('btnSetSelectedText_click', $this.$multiselect.setSelectedText('ddlFileExtension', '중2'));

        setTimeout(function () {
            var values = [];
            values.push('초4');
            values.push('초5');
            values.push('초6');
            $this.$multiselect.setSelectedText('ddlFileExtension', values);
        }, 10000);
    },

    btnGetControl_click: function () {
        var picker = $this.$multiselect.getControl('ddlFileExtension');
        // https://github.com/pytesNET/tail.select/wiki 메서드 참조
    },

    btnDataRefresh_click: function () {
        $this.$multiselect.dataRefresh('ddlBusinessRank', {
            dataSourceID: 'ZCB001',
            parameters: '@CodeGroupID:CMM013;',
            local: false,
            toQafControl: false,
            required: true,
            selectedValue: ['2', '5', '7']
        });
    }
});