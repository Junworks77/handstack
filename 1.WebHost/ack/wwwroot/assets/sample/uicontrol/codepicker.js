syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    frameEvent: function (eventName, jsonObject) {
        syn.$l.eventLog('ui_event', 'frameEvent - eventName: {0}, jsonObject: {1}'.format(eventName, JSON.stringify(jsonObject)));
    },

    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$codepicker.getValue('chpSubjectID')));
    },

    btnSetValue_click: function () {
        $this.$codepicker.setValue('chpSubjectID', 'HELLO');
    },

    btnClear_click: function () {
        $this.$codepicker.clear('chpSubjectID');
    },

    btnOpen_click: function () {
        $this.$codepicker.open('chpSubjectID');

    
    },

    btnSetText_click: function () {
        $this.$codepicker.setText('chpSubjectID', 'WORLD');
    },

    btnToParameterString_click: function () {
        var parameterObject = $this.$codepicker.toParameterObject('@ApplicationID:1;@ApplicationName:HELLO WORLD;');
        syn.$l.eventLog('btnToParameterString_click', JSON.stringify(parameterObject));
    },

    btnToParameterObject_click: function () {
        var parameterObject = $this.$codepicker.toParameterObject('@ApplicationID:1;@ApplicationName:HELLO WORLD;');
        parameterObject.ApplicationID = '0';
        var parameterString = $this.$codepicker.toParameterString(parameterObject);
        syn.$l.eventLog('btnToParameterObject_click', parameterString);
    },

    chpSubjectID_change: function (previousValue, previousText, changeValue) {
    }
});