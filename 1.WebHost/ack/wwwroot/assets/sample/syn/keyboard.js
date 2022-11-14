syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnAddKeyDown_click: function () {
        syn.$k.setElement(syn.$l.get('txtAddKeyDown'));
        syn.$k.addKeyDown(syn.$k.keyCodes.a, function () {
            alert('AddKeyDown!');
        });
    },
    btnRemoveKeyDown_click: function () {
        syn.$k.removeKeyDown(syn.$k.keyCodes.a);
    },
    btnAddKeyUp_click: function () {
        syn.$k.setElement(syn.$l.get('txtAddKeyUp'));
        syn.$k.addKeyUp(syn.$k.keyCodes.b, function () {
            alert('AddKeyUp!');
        });
    },
    btnRemoveKeyUp_click: function () {
        syn.$k.removeKeyUp(syn.$k.keyCodes.b);
    },
    btnAddKeyPress_click: function () {
        syn.$k.setElement(syn.$l.get('txtAddKeyPress'));
        syn.$k.addKeyUp(syn.$k.keyCodes.c, function () {
            alert('AddKeyPress!');
        });
    },
    btnRemoveKeyPress_click: function () {
        syn.$k.removeKeyUp(syn.$k.keyCodes.c);
    },
})
