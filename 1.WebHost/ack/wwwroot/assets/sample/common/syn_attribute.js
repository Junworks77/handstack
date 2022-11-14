syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnHelloworld_click: function() {
        syn.$l.get('txtApplicationName').value = 'hello world';
        $syn_attribute.$radio.setValue('rdoUseYN1', true);
    }
});