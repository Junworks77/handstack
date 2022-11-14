syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    pageLoad: function () {
    
    },

    btnGetControl_click: function () {
        var ctxButtonControl = $this.$contextmenu.getControl('ctxButtonControl');
        // https://github.com/mar10/jquery-ui-contextmenu
    },

    ctxButtonControl_close: function (evt, ui) {
        syn.$l.eventLog('ctxButtonControl_close', ui.cmd);
    },

    ctxButtonControl_create: function (evt, ui) {
        syn.$l.eventLog('ctxButtonControl_create', ui.cmd);
    },

    ctxButtonControl_beforeOpen: function (evt, ui) {
        syn.$l.eventLog('ctxButtonControl_beforeOpen', ui.cmd);
    },

    ctxButtonControl_open: function (evt, ui) {
        syn.$l.eventLog('ctxButtonControl_open', ui.cmd);
    },

    ctxButtonControl_select: function (evt, ui) {
        syn.$l.eventLog('ctxButtonControl_select', ui.cmd);
    }
});
