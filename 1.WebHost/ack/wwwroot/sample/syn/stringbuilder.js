syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnAppend_click: function () {
        syn.$sb.append('Hello World, ');
    },
    btnAppendFormat_click: function () {
        syn.$sb.appendFormat('Hello {0}!!! {1}', 'World', 'Bye');
    },
    btnConvertToArray_click: function () {
        syn.$l.get('txtConvertToArray').value = syn.$sb.convertToArray('Apple');
    },
    btnClear_click: function () {
        syn.$sb.clear();
    },
    btnToString_click: function () {
        syn.$l.get('txtToString').value = syn.$sb.toString();
    }
})