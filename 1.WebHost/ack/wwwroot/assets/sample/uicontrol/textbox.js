syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$textbox.getValue('txtApplicationID')));
    },

    btnSetValue_click: function () {
        $this.$textbox.setValue('txtApplicationID', '안녕하세요');
    },

    btnClear_click: function () {
        $this.$textbox.clear('txtApplicationID');
    }
});