syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    clickCount: 0,
    pageLoad: function () {
        syn.$l.addEvent(window, 'resize', function () {
            syn.$l.eventLog('window_event', 'resize');
        });

        syn.$l.addEvent(document.body, 'click', function () {
            syn.$l.eventLog('document.body', 'click {0}'.format($this.clickCount++));
        });

        syn.$l.addEvent('btnDynamicEvent', 'click', $this.btnDynamicEvent_click);
    },

    btnDynamicEvent_click: function () {
        syn.$l.eventLog('control_event', 'btnDynamicEvent_click !!!');
    },

    ddlApplicationType_change: function () {
        syn.$l.eventLog('control_event', 'change - {0}'.format(syn.$l.get('ddlApplicationType').value));
    },

    txtApplicationID_change: function () {
        syn.$l.eventLog('control_event', 'change - {0}'.format(syn.$l.get('txtApplicationID').value));
    }
});