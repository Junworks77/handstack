syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$radio.getValue('rdoUseYN1')));
    },

    btnSetValue_click: function () {
        $this.$radio.setValue('rdoUseYN1', true);
    },

    btnClear_click: function () {
        $this.$radio.clear('rdoUseYN1');
    },

    btnSelectedValue_click: function () {
        $this.$radio.selectedValue('rdoUseYN', 'value 2');
    },

    btnGetGroupNames_click: function () {
        syn.$l.eventLog('btnGetGroupNames_click', JSON.stringify($this.$radio.getGroupNames()));
    },

    rdoUseYN1_change: function () {
        console.log('rdoUseYN1_change');
    },

    rdoUseYN2_change: function () {
        console.log('rdoUseYN2_change');
    },

    rdoUseYN3_change: function () {
        console.log('rdoUseYN3_change');
    }
});