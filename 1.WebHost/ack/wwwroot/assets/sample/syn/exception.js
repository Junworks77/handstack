syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnAdd_click: function () {
        syn.$e.add('exException', function () { alert('Exception 발생!'); }, 'Exception처리기 실행');
    },
    btnRemove_click: function () {
        syn.$e.remove('exException');
    },
    btnActionHandler_click: function () {
        syn.$e.actionHandler('exException');
    },
    btnExceptionHandler_click: function () {
        var func = syn.$e.exceptionHandler('exException');
        if (func) {
            func();
        }
    },
})