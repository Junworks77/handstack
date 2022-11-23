'use strict';
let $channel = {
    extends: [
        'parsehtml'
    ],
    hook: {
        pageLoad() {
            var channelID = 'local-channelID';
            var iframe = syn.$l.get('ifmChannel');
            iframe.src = 'channel2.html?channelID=' + channelID;

            var room = syn.$channel.rooms.connect({
                debugOutput: true,
                context: iframe.contentWindow,
                scope: channelID
            });

            room.bind('pageLoad', function (evt, val) {
                debugger;
            });
        }
    },
    event: {
    },
};
