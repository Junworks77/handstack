syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    dataSource: null,
    pageLoad: function () {
        $this.dataSource = JSON.parse(syn.$l.get('txtSourceData').value);
    },

    btnFlat2Recursive_click: function () {
        var jsonRoot = syn.$l.flat2Nested($this.dataSource, 'id', 'parentId');
        syn.$l.eventLog('btnFlat2Recursive_click', JSON.stringify(jsonRoot));
    },

    btnRecursive2Flat_click: function () {
        var jsonRoot = syn.$l.flat2Nested($this.dataSource, 'id', 'parentId');
        var flatItems = syn.$l.nested2Flat(jsonRoot, 'id', 'parentId', 'items');
        syn.$l.eventLog('btnRecursive2Flat_click', JSON.stringify(flatItems));
    },

    btnFindRecursiveData_click: function () {
        var jsonRoot = syn.$l.flat2Nested($this.dataSource, 'id', 'parentId');
        var findItem = syn.$l.findNestedByID(jsonRoot, 10, 'id', 'items');
        syn.$l.eventLog('btnFindRecursiveData_click', JSON.stringify(findItem));
    }
});