'use strict';
let $browser = {
    extends: [
        'parsehtml'
    ],
    event: {
        btnBase64Encode_click: function () {
            syn.$l.get('txtBase64Encode').value = syn.$c.base64Encode(syn.$l.get('txtBase64Encode').value);
        },
        btnBase64Decode_click: function () {
            syn.$l.get('txtBase64Decode').value = syn.$c.base64Decode(syn.$l.get('txtBase64Decode').value);
        },
        btnUtf8Encode_click: function () {
            syn.$l.get('txtUtf8Encode').value = syn.$c.utf8Encode(syn.$l.get('txtUtf8Encode').value);
        },
        btnUtf8Decode_click: function () {
            syn.$l.get('txtUtf8Decode').value = syn.$c.utf8Decode(syn.$l.get('txtUtf8Decode').value);
        },
    },
};
