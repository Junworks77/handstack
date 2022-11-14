$w.initializeScript({
    pageLoad: function () {

    },

    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$select.getValue('ddlFileExtension')));
    },

    btnSetValue_click: function () {
        $this.$select.setValue('ddlFileExtension', '02');
    },

    btnClear_click: function () {
        $this.$select.clear('ddlFileExtension');
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

        $this.$select.loadData('ddlFileExtension', dataSource, true);
    },

    btnControlReload_click: function () {
        $this.$select.controlReload('ddlFileExtension');
    },

    btnSelectRowIndex_click: function () {
        $this.$select.selectRowIndex('ddlFileExtension', 3);
    },

    btnGetSelectedIndex_click: function () {
        syn.$l.eventLog('btnGetSelectedIndex_click', $this.$select.getSelectedIndex('ddlFileExtension'));
    },

    btnSetSelectedIndex_click: function () {
        $this.$select.setSelectedIndex('ddlFileExtension', 3);
    },

    btnGetSelectedValue_click: function () {
        syn.$l.eventLog('btnGetSelectedValue_click', $this.$select.getSelectedValue('ddlFileExtension'));
    },

    btnGetSelectedText_click: function () {
        syn.$l.eventLog('btnGetSelectedText_click', $this.$select.getSelectedText('ddlFileExtension'));
    },

    btnSetSelectedValue_click: function () {
        syn.$l.eventLog('btnSetSelectedValue_click', $this.$select.setSelectedValue('ddlFileExtension', '1'));
    },

    btnSetSelectedText_click: function () {
        syn.$l.eventLog('btnSetSelectedText_click', $this.$select.setSelectedText('ddlFileExtension', '초2'));
    },

    btnGetControl_click: function () {
        var picker = $this.$select.getControl('ddlFileExtension');
        // https://github.com/pytesNET/tail.select/wiki 메서드 참조
    },

    btnDataRefresh_click: function () {
        $this.$select.dataRefresh('ddlBusinessRank', {
            dataSourceID: 'ZCB001',
            parameters: '@CodeGroupID:CMM013;@CodeGroupID:CMM013;',
            local: false,
            toQafControl: false,
            required: true,
            selectedValue: '5'
        }, function () {
            alert('do....');
        });
    }
});