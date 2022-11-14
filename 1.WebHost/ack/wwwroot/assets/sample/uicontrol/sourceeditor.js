syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$sourceeditor.getValue('txtEditor1')));
    },

    btnSetValue_click: function () {
        $this.$sourceeditor.setValue('txtEditor1', 'function hello() {\n\talert("Hello world!");\n}');
    },

    btnClear_click: function () {
        $this.$sourceeditor.clear('txtEditor1');
    }
});