$w.initializeScript({
    beforeTransaction: function (transactConfig) {
        syn.$l.eventLog('ui_event', 'beforeTransaction - transactConfig: {0}'.format(JSON.stringify(transactConfig)));
        return true;
    },

    afterTransaction: function (error, functionID, responseData, addtionalData) {
        syn.$l.eventLog('ui_event', 'afterTransaction - error: {0}, functionID: {1}, response: {2}, addtionalData: {3}'.format(JSON.stringify(error), functionID, JSON.stringify(responseData), JSON.stringify(addtionalData)));
    }
});
