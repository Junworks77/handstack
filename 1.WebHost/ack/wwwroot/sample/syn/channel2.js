'use strict';
let $channel2 = {
    extends: [
        'parsehtml'
    ],
    hook: {
        pageLoad() {
            var channelID = syn.$r.query('channelID');
            if (window != window.parent && channelID) {
                var room = syn.$channel.rooms.connect({
                    context: window.parent,
                    scope: channelID
                });

                room.bind('request', function (evt, params) {
                    $l.eventLog('channel request', channelID + ': ' + JSON.stringify(params), 'Debug');
                });

                room.notify({
                    method: 'pageLoad',
                    params: syn.$d.getDocumentSize(document),
                    error: function (error, message) {
                        syn.$l.eventLog('channel response', 'error: ' + error + ' (' + message + ')', 'Error');
                    }
                });
            }
        }
    },
    event: {
    },
};
