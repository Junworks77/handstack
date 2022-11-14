syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$editor.getValue('txtEditor')));
    },

    btnSetValue_click: function () {
        $this.$editor.setValue('txtEditor', '안녕하세요');
    },

    btnClear_click: function () {
        $this.$editor.clear('txtEditor');
    },

    btnExecCommand_click: function () {
        $this.$editor.execCommand('txtEditor', 'bold');
        $this.$editor.execCommand('txtEditor', 'backColor', '#0000FF');
    },

    btnInsertImage_click: function () {
        $this.$editor.execCommand('txtEditor', 'insertimage', 'http://www.handstack.kr/editor/assets/sample.png');
    }
});