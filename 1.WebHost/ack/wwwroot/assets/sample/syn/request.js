syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnQuery_click: function () {
        syn.$r.params['p1'] = 'aaa';
        syn.$r.params['p2'] = 'bbb';
        syn.$r.params['p3'] = 'ccc';
        syn.$l.get('txtQuery').value = syn.$r.query('p2');
    },
    btnUrl_click: function () {
        syn.$r.params['p1'] = 'aaa';
        syn.$r.params['p2'] = 'bbb';
        syn.$r.params['p3'] = 'ccc';
        syn.$l.get('txtUrl').value = syn.$r.url();
    },
    btnSetCookie_click: function () {
        syn.$r.setCookie('txtSetCookie', 'hello');
    },
    btnGetCookie_click: function () {
        syn.$l.get('txtGetCookie').value = syn.$r.getCookie('txtSetCookie');
    },
    btnDeleteCookie_click: function () {
        syn.$r.deleteCookie('txtSetCookie');
    },
})