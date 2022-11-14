syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    beforeTrigger: function (triggerID, action, params) {
        syn.$l.eventLog('ui_event', 'beforeTrigger - triggerID: {0}, action: {1}, params: {2}'.format(triggerID, action, JSON.stringify(params)));
        return true;
    },
    
    afterTrigger: function (error, action, response) {
        syn.$l.eventLog('ui_event', 'afterTrigger - error: {0}, response: {1}'.format(JSON.stringify(error), JSON.stringify(response)));
    },
    
    txtApplicationID_change: function () {
        var triggerOptions = syn.$w.getTriggerOptions('txtApplicationID');
        if (triggerOptions && triggerOptions.value) {
            syn.$l.eventLog('control_event', 'triggerEvent change - {0}'.format(triggerOptions.value));
        }
        else {
            syn.$l.eventLog('control_event', 'change - {0}'.format(syn.$l.get('txtApplicationID').value));
        }
    }
});