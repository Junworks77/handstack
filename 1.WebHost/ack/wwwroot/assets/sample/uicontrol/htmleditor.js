syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    pageLoad: function () {
    },

    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$htmleditor.getValue('txtHtmlEditor')));
    },

    btnSetValue_click: function () {
        $this.$htmleditor.setValue('txtHtmlEditor', '안녕하세요');
    },

    btnClear_click: function () {
        $this.$htmleditor.clear('txtHtmlEditor');
    },

    btnExecCommand_click: function () {
        $this.$htmleditor.execCommand('txtHtmlEditor', 'bold');
        $this.$htmleditor.execCommand('txtHtmlEditor', 'backColor', '#0000FF');
    },

    btnInsertImage_click: function () {
        $this.$htmleditor.execCommand('txtHtmlEditor', 'insertimage', 'http://www.handstack.kr/editor/assets/sample.png');
    },

    txtHtmlEditor_documentReady: function (elID, editor) {
        syn.$l.eventLog('txtHtmlEditor_documentReady', elID);
    }
});