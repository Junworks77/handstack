syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$checkbox.getValue('chkUseYN1')));
    },

    btnSetValue_click: function () {
        $this.$checkbox.setValue('chkUseYN1', true);
    },

    btnClear_click: function () {
        $this.$checkbox.clear('chkUseYN1');
    },

    btnToggleValue_click: function () {
        $this.$checkbox.toggleValue('chkUseYN2');
    },

    btnGetGroupNames_click: function () {
        syn.$l.eventLog('btnGetGroupNames_click', JSON.stringify($this.$checkbox.getGroupNames()));
    }
});