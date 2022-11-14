syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$jsoneditor.getValue('txtEditor')));
    },

    btnSetValue_click: function () {
        var defaultSetting = {
            width: '100%',
            height: '240px',
            mode: 'code',
            modes: ['code', 'tree'],
            indentation: 4,
            escapeUnicode: false,
            dataType: 'string',
            belongID: null,
            transactConfig: null,
            triggerConfig: null
        }
        $this.$jsoneditor.setValue('txtEditor', JSON.stringify(defaultSetting));
    },

    btnClear_click: function () {
        $this.$jsoneditor.clear('txtEditor');
    },

    btnToXml_click: function () {
        var jsonValue = $this.$jsoneditor.getValue('txtEditor');
        var xmlValue = $this.$jsoneditor.toXml(JSON.parse(jsonValue));
        syn.$l.eventLog('btnToXml_click', xmlValue);
    }
});