syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    pageLoad: function () {
    },

    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$textarea.getValue('txtTextarea')));
    },

    btnSetValue_click: function () {
        $this.$textarea.setValue('txtTextarea', '안녕하세요');
    },

    btnClear_click: function () {
        $this.$textarea.clear('txtTextarea');
    },

    txtTextarea_blur: function () {
        $this.$textarea.setValue('txtTextarea', '안녕하세요');
    }
});