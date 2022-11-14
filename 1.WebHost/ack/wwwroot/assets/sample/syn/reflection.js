syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetType_click: function () {
        syn.$l.get('txtGetType').value = $reflection.getType('txtGetType')
    },
    btnIsDefined_click: function () {
        syn.$l.get('txtIsDefined').value = $reflection.isDefined('txtGetType');
    },
    btnIsNull_click: function () {
        if (pIsNull !== null) {
            syn.$l.get('txtIsNull').value = $reflection.isNull('pIsNull');
        }
        else
            syn.$l.get('txtIsNull').value = ('isNull!');
    },
    btnIsArray_click: function () {
        var ar = ['aaa', 'bbb', 'ccc'];
        syn.$l.getElementsById('pIsArray').innerHTML = ar
        syn.$l.get('txtIsArray').value = $reflection.isArray(ar);
    },
    btnIsDate_click: function () {
        alert($reflection.isDate(syn.$l.getElementsById('txtIsDate').value));
    },
    btnIsString_click: function () {
        var isstring = 'Hello World';
        syn.$l.getElementsById('pIsString').innerHTML = isstring
        syn.$l.get('txtIsString').value = $reflection.isString(isstring);
    },
    btnIsNumber_click: function () {
        var isnumber = 123456789;
        syn.$l.getElementsById('pIsNumber').innerHTML = isnumber
        syn.$l.get('txtIsNumber').value = $reflection.isNumber(isnumber);
    },
    btnIsFunction_click: function () {
        var isfunc = '$reflection.isNull';
        syn.$l.getElementsById('pIsFunction').innerHTML = isfunc
        syn.$l.get('txtIsFunction').value = $reflection.isFunction($reflection.isNull);
    },
    btnIsObject_click: function () {
        var member = {
            id: 'h960502',
            name: 'aaa'
        };
        syn.$l.getElementsById('pIsObject').innerHTML = member.name;
        syn.$l.get('txtIsObject').value = $reflection.isObject(member);
    },
    btnIsBoolean_click: function () {
        var isbool = true;
        syn.$l.getElementsById('pIsBoolean').innerHTML = isbool
        syn.$l.get('txtIsBoolean').value = $reflection.isBoolean(isbool);
    },
    btnClone_click: function () {
        var fruit = {
            apple: 'apple',
            banana: 'banana'
        };
        syn.$l.getElementsById('pClone').innerHTML = fruit.apple
        syn.$l.get('txtClone').value = $reflection.clone(fruit.apple);
        //cloneNode
    },
    btnMethod_click: function () {
        var targetObject = () => { };
        $reflection.method(targetObject, 'addFunc', function () {
            alert('addFunc !');
        });

        targetObject.prototype.addFunc();
    },
})