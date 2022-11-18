'use strict';
let $crytography = {
    event: {
        btnBase64Encode_click() {
            syn.$l.get('txtBase64Encode').value = syn.$c.base64Encode(syn.$l.get('txtBase64Encode').value);
        },
        btnBase64Decode_click() {
            syn.$l.get('txtBase64Decode').value = syn.$c.base64Decode(syn.$l.get('txtBase64Decode').value);
        },
    },
};
