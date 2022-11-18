syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnAdd_click: function () {
        syn.$res.add('addResource1', 'Hello World');
        syn.$l.get('txtAdd').value = syn.$res.addResource1;
    },
    btnAdd2_click: function () {
        syn.$res.add('addResource2', 'Hello World');
        syn.$l.get('txtRemove').value = syn.$res.addResource2;
    },
    btnRemove_click: function () {
        syn.$l.get('txtRemove').value = syn.$res.remove;
    }
})
