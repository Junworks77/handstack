syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnTrim_click: function () {
        syn.$l.get('txtTrim').value = syn.$l.get('txtTrim').value.trim();
    },
    btnIncludes_click: function () {
        var val = 'hello world !!!';
        syn.$l.get('txtIncludes').value = val.includes('world');
    },
    btnIncludes_click: function () {
        var val = 'hello world !!!';
        syn.$l.get('txtIncludes').value = val.includes('world');
    },
    btnToUTC_click: function () {
        var $date = $date;
        alert($date.toUTC(syn.$l.get('txtToUTC').value));
    },
    btnClear_click: function () {
        var $date = $date;
        syn.$l.get('txtClear').value = $date.toString($date.clear(new Date(), true), 'd');
    },
    btnNow_click: function () {
        var $date = $date;
        syn.$l.get('txtNow').value = $date.now(new Date());
    },
    btnClone_click: function () {
        var $date = $date;
        syn.$l.get('txtClone').value = $date.toString($date.clone(new Date()), 'd');
    },
    btnIsBetween_click: function () {
        var $date = $date;
        syn.$l.get('txtIsBetween').value = $date.isBetween(new Date(), new Date('2019-10-22T03:24:00'), new Date('2019-10-31T03:24:00'));
    },
    btnEquals_click: function () {
        var $date = $date;
        var date1 = new Date(2019, 10, 23);
        var date2 = new Date(2019, 10, 23);
        syn.$l.get('txtEquals').value = $date.equals(date1, date2);
    },
    btnIsToday_click: function () {
        var $date = $date;
        var date1 = new Date();
        var date2 = new Date(2019, 10, 23);
        syn.$l.get('txtIsToday').value = 'date1 - ' + $date.isToday(date1).toString();
        setTimeout(function () {
            syn.$l.get('txtIsToday').value = 'date2 - ' + $date.isToday(date2).toString();
        }, 3000);
    },
    btnToString_click: function () {
        var $date = $date;
        syn.$l.get('txtToString').value = $date.toString(new Date(), 'd');
    },
    btnAddDay_click: function () {
        var $date = $date;
        syn.$l.get('txtAddDay').value =
            $date.toString($date.addDay(new Date(), 5), 'd');
    },
    btnAddWeek_click: function () {
        var $date = $date;
        syn.$l.get('txtAddWeek').value =
            $date.toString($date.addWeek(new Date(), 5), 'd');
    },
    btnAddMonth_click: function () {
        var $date = $date;
        syn.$l.get('txtAddMonth').value =
            $date.toString($date.addMonth(new Date(), 5), 'd');
    },
    btnAddYear_click: function () {
        var $date = $date;
        syn.$l.get('txtAddYear').value =
            $date.toString($date.addYear(new Date(), 5), 'd');
    },
    btnGetFirstDate_click: function () {
        var $date = $date;
        syn.$l.get('txtGetFirstDate').value = $date.toString($date.getFirstDate(new Date()), 'd');
    },
    btnGetLastDate_click: function () {
        var $date = $date;
        syn.$l.get('txtGetLastDate').value = $date.toString($date.getLastDate(new Date()), 'd');
    },
    btnDiff_click: function () {
        var $date = $date;
        var date1 = new Date();
        var date2 = new Date();
        date2 = $date.addDay(date2, 3);

        syn.$l.get('txtDiff').value = $date.diff('h', date1, date2);
    },
    btnToTicks_click: function () {
        var $date = $date;
        syn.$l.get('txtToTicks').value = $date.toTicks(new Date());
    },
    btnIsDate_click: function () {
        var $date = $date;
        syn.$l.get('txtIsDate').value = $date.isDate('2019-10-24');
    },
    btntoDate_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txttoDate').value = $string.toDate(637074762874700000);
    },
    btnBr_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtBr').value = $string.br('\r\n');
    },
    btnToHtmlChar_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtToHtmlChar').value = $string.toHtmlChar('&') + ', ' +
            $string.toHtmlChar('\'') + ', ' + $string.toHtmlChar('<') + ', ' +
            $string.toHtmlChar('>');
    },
    btnToCharHtml_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtToCharHtml').value = $string.toCharHtml('&amp;') + ', ' +
            $string.toCharHtml('&quot;') + ', ' + $string.toCharHtml('&#39;') + ', ' +
            $string.toCharHtml('&lt;') + ', ' + $string.toCharHtml('&gt;');
    },
    btnIsAscii_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtIsAscii').value = $string.isAscii('adddd');
    },
    btnToAscii_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtToAscii').value = $string.toAscii('a한글dddd');
    },
    btnLength_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtLength').value = $string.length(syn.$l.get('txtLength').value);
    },
    btnIsNumber_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtIsNumber').value = $string.isNumber('123456789');
    },
    btnCapitalize_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtCapitalize').value = $string.capitalize('hello world');
    },
    btnToNumber_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtToNumber').value = $string.toNumber('123,456,3344.0010');
    },
    btnToNumberString_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtToNumberString').value = $string.toNumberString('1234563344.0010');
    },
    btnToCurrency_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtToCurrency').value = $string.toCurrency('100000000000');
    },
    btnDigits_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtDigits').value = $string.digits('hello', '10', '0');
    },
    btnDistinct_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Banana', 'Mango', 'Cherry'];
        syn.$l.get('txtDistinct').value = $array.distinct(arr);
    },
    btnSort_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        $array.sort(arr, syn.$l.get('chkSort').checked);
        syn.$l.get('txtSort').value = JSON.stringify(arr);
    },
    btnObjectSort_click: function () {
        var $array = syn.lib.$array;
        var arr = [{ name: 'Apple', age: 10 }, { name: 'Banana', age: 5 }];
        $array.objectSort(arr, 'age', syn.$l.get('chkObjectSort').checked);
        syn.$l.get('txtObjectSort').value = JSON.stringify(arr);
    },
    btnShuffle_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        $array.shuffle(arr);
        syn.$l.get('txtsShuffle').value = JSON.stringify(arr);
    },
    btnLastIndexOf_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        syn.$l.get('txtLastIndexOf').value = $array.lastIndexOf(arr, 'Cherry');
    },
    btnArrAddClear_click: function () {
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        syn.$l.get('txtArrClear').value = arr;
    },
    btnArrClear_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        $array.clear(arr);
        syn.$l.get('txtArrClear').value = arr.length;
    },
    btnAdd_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        $array.add(arr, 'hello world');
        syn.$l.get('txtAdd').value = JSON.stringify(arr);
    },
    btnAddAt_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        $array.addAt(5, arr, 'hello world');
        syn.$l.get('txtAddAt').value = JSON.stringify(arr);
    },
    btnRemove_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        $array.remove(arr);
        syn.$l.get('txtRemove').value = JSON.stringify(arr);
    },
    btnRemoveAt_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        $array.removeAt(arr, 3);
        syn.$l.get('txtRemoveAt').value = arr.length;
    },
    btnContains_click: function () {
        var $array = syn.lib.$array;
        var arr = ['Apple', 'Banana', 'Mango', 'Cherry'];
        syn.$l.get('txtContains').value = $array.contains(arr, 'Apple');
    },
    btnAddProp_click: function () {
        var $array = syn.lib.$array;
        var arr = [{ name: 'Apple' }, { name: 'Banana' }];
        $array.addProp(arr, 'name', 'Mango');
        syn.$l.get('txtAddProp').value = JSON.stringify(arr);
    },
    btnNumberToCurrency_click: function () {
        var $string = syn.lib.$string;
        syn.$l.get('txtNumberToCurrency').value = $string.toCurrency(1000000000);
    },
    btnIsRange_click: function () {
        var $number = syn.lib.$number;
        syn.$l.get('txtIsRange').value = $number.isRange(syn.$l.get('txtIsRange').value, 1, 100);
    },
    btnLimit_click: function () {
        var $number = syn.lib.$number;
        syn.$l.get('txtLimit').value = $number.limit(syn.$l.get('txtLimit').value, 1, 100);
    },
    btnLimitAbove_click: function () {
        var $number = syn.lib.$number;
        syn.$l.get('txtLimitAbove').value = $number.limitAbove(syn.$l.get('txtLimitAbove').value, 100);
    },
    btnLimitBelow_click: function () {
        var $number = syn.lib.$number;
        syn.$l.get('txtLimitBelow').value = $number.limitBelow(syn.$l.get('txtLimitBelow').value, 1);
    },
    btnMod_click: function () {
        var $number = syn.lib.$number;
        syn.$l.get('txtMod').value = $number.mod(syn.$l.get('txtMod').value, 1000);
    },
    btnPercent_click: function () {
        var $number = syn.lib.$number;
        syn.$l.get('txtPercent').value = $number.percent(syn.$l.get('txtPercent').value, 250) + '%';
    },
})