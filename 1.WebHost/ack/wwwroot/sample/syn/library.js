syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGuid_click: function () {
        syn.$l.get('txtGuid').value = syn.$l.guid();
    },
    btnRandom_click: function () {
        syn.$l.get('txtRandom').value = syn.$l.random();
    },
    btnAddEvent_click: function () {
        //addLive
        syn.$l.addEvent('paddEvent', 'click', function () {
            alert('World!');
        });
    },
    addRemoveEventFunction: function () {

        alert('World!');
    },
    btnAddRemoveEvent_click: function () {
        syn.$l.addEvent('premoveEvent', 'click', $syn_library.addRemoveEventFunction);
    },
    btnRemoveEvent_click: function () {
        syn.$l.removeEvent(syn.$l.get('premoveEvent'), 'click', $syn_library.addRemoveEventFunction);
    },
    btnHasEvent_click: function () {
        syn.$l.get('txtHasEvent').value = syn.$l.hasEvent(syn.$l.get('paddEvent'), 'click');
    },
    btnTrigger_click: function () {
        //triggerEvent
        syn.$l.trigger(syn.$l.get('paddEvent'), 'click');
    },
    btnAddBind_click: function () {
        syn.$l.addBind('input', 'click', function () { alert('addBind!') });
    },
    btnGet_click: function () {
        syn.$l.get('txtGet').value = syn.$l.get('btnAddBind', 'btnHasEvent');
    },
    btnQuerySelector_click: function () {
        syn.$l.get('txtQuerySelector').value = syn.$l.querySelector('p').innerHTML;
    },
    btnGetName_click: function () {
        // getElementsByTagName
        var x = syn.$l.getName("li");
        syn.$l.get('txtGetName').value = x[1].innerHTML;
    },
    btnQuerySelectorAll_click: function () {
        var x = syn.$l.querySelectorAll('p');
        syn.$l.get('txtQuerySelectorAll').value = x[4].innerHTML;
    },
    btnGetElementsById_click: function () {
        syn.$l.getElementsById('pgetElementsById').innerHTML = 'World!'
    },
    btnGetElementsByClassName_click: function () {
        var x = syn.$l.getElementsByClassName("pGetClassName");
        x[0].innerHTML = "Hello World!";
    }
})