syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnChildNodes_click: function () {
        var child = syn.$m.childNodes(document.body);
        var txt = ''
        var i;
        for (i = 0; i < child.length; i++) {
            txt = txt + child[i].nodeName + '<br>';
        }
        syn.$l.get('txtChildNodes').value = txt;
    },
    btnFirstChild_click: function () {
        syn.$l.get('txtFirstChild').value = syn.$m.firstChild(document.body);
    },
    btnLastChild_click: function () {
        syn.$l.get('txtLastChild').value = syn.$m.lastChild(document.body);
    },
    btnNextSibling_click: function () {
        var x = syn.$l.getElementsById('item1');
        syn.$l.get('txtNextSibling').value = syn.$m.nextSibling(x).textContent;
    },
    btnPreviousSibling_click: function () {
        var x = syn.$l.getElementsById('item2');
        syn.$l.get('txtPreviousSibling').value = syn.$m.previousSibling(x).textContent;
    },
    btnParentNode_click: function () {
        var x = syn.$l.get('item1');
        syn.$l.get('txtParentNode').value = syn.$m.parentNode(x).nodeName;
    },
    btnInnerText_click: function () {
        syn.$l.get('inText').innerText = 'World!';
    },
    btnNodeName_click: function () {
        syn.$l.get('txtNodeName').value = syn.$m.nodeName(syn.$l.get('inText'));
    },
    btnNodeType_click: function () {
        syn.$l.get('txtNodeType').value = syn.$m.nodeType(syn.$l.get('inText'));
    },
    btnClassName_click: function () {
        syn.$l.get('txtClassName').value = syn.$m.className(syn.$l.get('pClassNameId'));
    },
    btnRemoveAttribute_click: function () {
        $m.removeAttribute(syn.$l.get('aRemoveAttribute'), 'href');
    },
    btnGetAttribute_click: function () {
        syn.$l.get('txtGetAttribute').value = syn.$m.getAttribute(syn.$l.get('pgetAttributeId'), 'class');
    },
    btnSetAttribute_click: function () {
        $m.setAttribute(syn.$l.get('aSetAttribute'), 'href', 'http://www.naver.com');
    },
    btnAppendChild_click: function () {
        var appendnode = document.createElement('LI');
        var textnode = document.createTextNode('Mango');
        $m.appendChild(syn.$l.get('myList'), textnode, appendnode);
    },
    btnCloneNode_click: function () {
        var itm = syn.$l.get('myList2').lastChild;
        var cln = itm.cloneNode(true);
        syn.$l.get('myList1').appendChild(cln);
    },
    btnCreateElement_click: function () {
        var para = syn.$m.createElement(syn.$l.get('pCreatElement'), 'button');
        para.innerText = "New Button";
        syn.$l.get('pCreatElement').appendChild(para);
    },
    btnCreateTextNode_click: function () {
        var t = syn.$m.createTextNode(syn.$l.get('pCreateTextNode'), "Hello World");
        syn.$l.get('pCreateTextNode').appendChild(t);
    },
    btnInnerHTML_click: function () {
        syn.$l.get('pInnerHTML').innerHTML = 'World!';
    },
    btnOuterHTML_click: function () {
        syn.$l.get('pOuterHTML').innerText = syn.$l.get('pOuterHTML').outerHTML;
    },
    btnSetStyle_click: function () {
        $m.setStyle(syn.$l.get('pSetStyle'), 'color', 'red');
    },
    btnAddCssText_click: function () {
        $m.addCssText(syn.$l.get('pAddCssText'), 'background-color:lightblue');
    },
    btnAddStyle_click: function () {
        $m.addStyle(syn.$l.get('pAddStyle'), { backgroundColor: 'blue', color: 'white', border: '2px solid red' });
    },
    btnAddGetStyle_click: function () {
        $m.addStyle(syn.$l.get('pGetStyle'), { backgroundColor: 'blue', color: 'white', border: '2px solid red' });
    },
    btnGetStyle_click: function () {
        syn.$l.get('txtGetStyle').value = syn.$m.getStyle(syn.$l.get('pGetStyle'), 'backgroundColor');
    },
    btnAddClass_click: function () {
        $m.addClass(syn.$l.get('pAddClass'), 'pAddClassStyle');
    },
    btnHasClass_click: function () {
        syn.$l.get('txtHasClass').value = syn.$m.hasClass(syn.$l.get('pAddClass'), 'pAddClassStyle');
    },
    btnAddControlStyles_click: function () {
        $m.addControlStyles(syn.$l.getName('input'), 'pAddClassStyle');
    },
    btnRemoveControlStyles_click: function () {
        $m.removeControlStyles(syn.$l.getName('input'), 'pAddClassStyle');
    },
    btnRemoveNode_click: function () {
        $m.removeNode('myListRemoveNode');
    },
    btnHide_click: function () {
        $m.hide(syn.$l.get('pHide'));
    },
    btnShow_click: function () {
        $m.show(syn.$l.get('pHide'));
    },
    btnHideAll_click: function () {
        var hidearr = [$l.get('phideAll1'), syn.$l.get('phideAll2'), syn.$l.get('phideAll3'), syn.$l.get('phideAll4')]
        $m.hideAll(hidearr);
    },
    btnShowAll_click: function () {
        var hidearr = [$l.get('phideAll1'), syn.$l.get('phideAll2'), syn.$l.get('phideAll3'), syn.$l.get('phideAll4')]
        $m.showAll(hidearr);
    },
    btnParent_click: function () {
        syn.$l.get('txtParent').value = syn.$m.parent(syn.$l.get('txtParent'), 'parentTD').outerHTML;
    },
    btnCreate_click: function () {
        syn.$l.get('txtCreate').value = syn.$m.create({ tag: 'p', id: 'pCreate', className: 'pAddClassStyle' }).outerHTML;
    },
    btnDiv_click: function () {
        var fruit = {
            id: 'apple',
            className: 'banana'
        };
        syn.$l.get('txtDiv').value = syn.$m.div(fruit).outerHTML;
    },
    btnLabel_click: function () {
        var labelCreate = {
            id: 'idLabel',
            className: 'classLabel'
        };
        syn.$l.get('txtLabel').value = syn.$m.label(labelCreate).outerHTML;
    },
    btnTextField_click: function () {
        var textfieldCreate = {
            id: 'idTextField',
            className: 'classTextField'
        };
        syn.$l.get('txtTextField').value = syn.$m.textField(textfieldCreate).outerHTML;
    },
    btnCheckbox_click: function () {
        var checkboxCreate = {
            id: 'idCheckbox'
        };
        syn.$l.get('txtCheckbox').value = syn.$m.checkbox(checkboxCreate).outerHTML;
    },
    btnEach_click: function () {
        var fruits = ["apple", "orange", "cherry"];
        $m.each(fruits, function (item) {
            alert(item.toUpperCase());
        });
    },
    btnActive_click: function () {
        alert('Active Button Active!');
    },
    btnSetActive_click: function () {
        $m.setActive(syn.$l.get('btnActive'));
    },
    btnSetUnActive_click: function () {
        $m.setUnactive(syn.$l.get('btnActive'));
    },
    btnSelect_click: function () {
        $m.select(syn.$l.get('banana'));
    },
    btnDeSelect_click: function () {
        $m.deselect(syn.$l.get('banana'));
    },
    btnCheck_click: function () {
        $m.check(syn.$l.get('myCheck'));
    },
    btnUnCheck_click: function () {
        $m.uncheck(syn.$l.get('myCheck'));
    },
    btnClick_click: function () {
        alert('Click Event!');
    },
})