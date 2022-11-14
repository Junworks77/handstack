/// <reference path="/Scripts/syn.js" />

(function (window) {
    jQuery.extend($.fn.fmatter, {
        textFormatter(cellvalue, options, rowObject) {
            return "<input id='".concat(options.rowId, "_", options.pos.toString(), "_text' gid='", options.gid, "' col='", options.pos, "' type='text' datatype='text' class='ui_textbox' textEditType='Text' value='", cellvalue, "' onfocus='$text.textbox_focus(event);' onchange='$grid.dataChangeEventer(event);' />");
        },

        codepickerFormatter(cellvalue, options, rowObject) {
            var dataOptions = options.colModel.dataoptions;
            var code = "";
            var val = "";

            if (cellvalue && cellvalue.indexOf('ⅰ') > -1) {
                var codes = cellvalue.split('ⅰ');
                code = codes[0];
                val = codes[1];
            }
            return "<div style='width:85%;'><input id='".concat(options.rowId, "_", options.pos.toString(), "_codepicker' gid='", options.gid, "' col='", options.pos, "' QueryID='", dataOptions.queryID, "' ParameterFormatString='", dataOptions.parameterFormatString, "' TextField='", dataOptions.textField, "' ValueField='", dataOptions.valueField, "' DialogWidth='", dataOptions.dialogWidth, "' DialogHeight='", dataOptions.dialogHeight, "' HiddenCols='", dataOptions.hiddenCols, "' IsAutoSearch='", dataOptions.isAutoSearch, "' type='text' datatype='codepicker' value='", val, "' maxlength='10' onfocus='$text.textbox_focus(event);' onchange='$grid.dataChangeEventer(event);' onkeydown='$codePicker.jqGridOnKeyDown (event);'/><input type='hidden' id='", options.rowId, "_", options.pos.toString(), "_value' value='" + code + "' /><input type='button' id='", options.rowId, "_", options.pos.toString(), "_button' onclick='$codePicker.jqGridCodePicker (event);' value='...' /></div>");
        },

        selectFormatter(cellvalue, options, rowObject) {
            var result = "";
            var isData = false;
            var items = "";
            var itemData = null;
            var val = "";
            var selectOption = null;
            if ($grid.selectOptions.length > 0) {
                for (var i in $grid.selectOptions) {
                    selectOption = $grid.selectOptions[i];
                    if (selectOption.gid == options.gid && selectOption.pos == options.pos) {
                        val = selectOption.val;
                        items = selectOption.items;
                        isData = true;
                        break;
                    }
                }
            }

            if (items.length > 0) {
                if (val === cellvalue) {
                }
                else {
                    items = items.replace(" selected", "").replace("value='" + cellvalue + "'", "value='" + cellvalue + "' selected");
                }
            }
            else {
                if (options.colModel.dataoptions != null) {
                    $.each(options.colModel.dataoptions.value.split(";"), function (key, value) {
                        itemData = value.split(":");

                        if (itemData[0] === cellvalue) {
                            items += "<option value='".concat(itemData[0], "' selected>", itemData[1], "</option>");
                        }
                        else {
                            items += "<option value='".concat(itemData[0], "'>", itemData[1], "</option>");
                        }
                    });
                }
            }

            if (isData == false) {
                var itemOptions = { "gid": options.gid, "pos": options.pos, "val": cellvalue, "items": items };
                $grid.selectOptions.push(itemOptions);
                itemOptions = null;
            }

            result = "<select id='".concat(options.rowId, "_", options.pos.toString(), "_select' gid='", options.gid, "' col='", options.pos, "' datatype='select' value='", cellvalue, "' onchange='$grid.dataChangeEventer(event);'>", items, "</select>");

            isData = null;
            items = null;
            itemData = null;
            val = null;
            selectOption = null;

            try {
                return result;
            }
            finally {
                result = null;
            }
        },

        checkboxFormatter(cellvalue, options, rowObject) {
            var result = "";
            var checked = "";
            if ((cellvalue.toLowerCase() === "true")) {
                checked = "checked";
            }

            result = "<input id='".concat(options.rowId, "_", options.pos.toString(), "_checkbox' gid='", options.gid, "' col='", options.pos, "' type='checkbox' datatype='checkbox' ", checked, " value='", cellvalue, "' onmouseover='$grid.checkboxDataChecker(event);' onchange='$grid.dataChangeEventer(event);' />");

            checked = null;
            try {
                return result;
            }
            finally {
                result = null;
            }
        },

        buttonFormatter(cellvalue, options, rowObject) {
            var result = "";

            if (cellvalue) {
                result = "<input id='".concat(options.rowId, "_", options.pos.toString(), "_button' gid='", options.gid, "' col='", options.pos, "' type='button' datatype='button' class='ui_textbutton small' value='", cellvalue, "' onclick='$grid.buttonClickEventer(event);' onchange='$grid.dataChangeEventer(event);' />");
            }

            try {
                return result;
            }
            finally {
                result = null;
            }
        },


        radioFormatter(cellvalue, options, rowObject) {
            var items = "";
            var itemData = null;

            if (options.colModel.dataoptions != null) {
                $.each(options.colModel.dataoptions.value.split(";"), function (key, value) {
                    itemData = value.split(":");

                    if (itemData[0] === cellvalue) {
                        items += "<input class='ui_radio' id='".concat(options.rowId, "_", options.pos.toString(), key, "' gid='", options.gid, "' col='", options.pos, "' type='radio' datatype='radio' name='", options.rowId, "_", options.pos.toString(), "_radiogroup' value='", itemData[0], "' checked onchange='$grid.dataChangeEventer(this);' /><label for='", options.rowId, "_", options.pos.toString(), key, "'>", itemData[1], "</label>");
                    }
                    else {
                        items += "<input class='ui_radio' id='".concat(options.rowId, "_", options.pos.toString(), key, "' gid='", options.gid, "' col='", options.pos, "' type='radio' datatype='radio' name='", options.rowId, "_", options.pos.toString(), "_radiogroup' value='", itemData[0], "' onchange='$grid.dataChangeEventer(this);' /><label for='", options.rowId, "_", options.pos.toString(), key, "'>", itemData[1], "</label>");
                    }
                });
            }

            itemData = null;
            try {
                return items;
            }
            finally {
                items = null;
            }
        },

        dateFormatter(cellvalue, options, rowObject) {
            var result = "";
            result = "<div style='width:85%;'><input id='".concat(options.rowId, "_", options.pos.toString(), "_date' gid='", options.gid, "' col='", options.pos, "' type='text' datatype='date' value='", cellvalue, "' maxlength='10' onfocus='$text.textbox_focus(event);' onblur='$text.date_textbox_blur(this, event);' onkeydown='return $text.numeric_textbox_keydown(event);' onchange='$grid.dataChangeEventer(event);' /><input type='button' id='", options.rowId, "_", options.pos.toString(), "_button' onclick='jqGridCalendar (event);' value='...' /></div>");

            try {
                return result;
            }
            finally {
                result = null;
            }
        },

        imageFormatter(cellvalue, options, rowObject) {
            var result = "";
            result = "<img id='".concat(options.rowId, "_", options.pos.toString(), "_image' gid='", options.gid, "' col='", options.pos, "' datatype='image' src='", cellvalue, "' />");

            try {
                return result;
            }
            finally {
                result = null;
            }
        },

        numberFormatter(cellvalue, options, rowObject) {
            var result = "";
            result = "<input id='".concat(options.rowId, "_", options.pos.toString(), "_number' gid='", options.gid, "' col='", options.pos, "' type='text' datatype='number' class='ui_textbox numeric' textEditType='Numeric' value='", cellvalue.toCurrency(), "' onfocus='$text.numeric_textbox_focus(event);' onblur='$text.numeric_textbox_blur(this, event);' onkeydown='return $text.numeric_textbox_keydown(event);' onchange='$grid.dataChangeEventer(event);' />");

            try {
                return result;
            }
            finally {
                result = null;
            }
        }
    });

    jQuery.extend($.fn.fmatter.textFormatter, {
        unformat(cellvalue, options, cell) {
            return $('input', cell).val();
        }
    });

    jQuery.extend($.fn.fmatter.codepickerFormatter, {
        unformat(cellvalue, options, cell) {
            return $('input[id*=_value]', cell).val() + "ⅰ" + $('input[id*=_codepicker]', cell).val();
        }
    });

    jQuery.extend($.fn.fmatter.selectFormatter, {
        unformat(cellvalue, options, cell) {
            return $('select', cell).val();
        }
    });

    jQuery.extend($.fn.fmatter.checkboxFormatter, {
        unformat(cellvalue, options, cell) {
            return $('input', cell).val();
        }
    });

    jQuery.extend($.fn.fmatter.buttonFormatter, {
        unformat(cellvalue, options, cell) {
            return $('input', cell).val();
        }
    });

    jQuery.extend($.fn.fmatter.numberFormatter, {
        unformat(cellvalue, options, cell) {
            return $('input', cell).val().toNumberString();
        }
    });

    jQuery.extend($.fn.fmatter.radioFormatter, {
        unformat(cellvalue, options, cell) {
            return $radio.getValue($('input', cell)[0].name);
        }
    });

    jQuery.extend($.fn.fmatter.dateFormatter, {
        unformat(cellvalue, options, cell) {
            return $('input', cell).val();
        }
    });

    jQuery.extend($.fn.fmatter.imageFormatter, {
        unformat(cellvalue, options, cell) {
            return $('img', cell).attr('src');
        }
    });

    syn.uicontrols = syn.uicontrols || new syn.module();

    var $jqgrid = $jqgrid || new syn.module();

    $jqgrid.extend({
        name: 'syn.uicontrols.$jqgrid',
        version: '1.0',

        sortDatas: [],
        selectOptions: [],
        radioOptions: [],
        pagingSettings: [],
        lastRowID: null,
        isMouseDown: false,
        gridOptions: {
            caption: null,
            autoWidth: true,
            gridWidth: 250,
            gridHeight: '200px',
            multiSelect: false,
            multiSelectWidth: 20,
            dataType: 'json',
            rowNumbers: true,
            sortAble: true,
            sortName: '',
            sortOrder: 'asc',
            isPagingLayout: false,
            viewRecords: true,
            gridView: true,
            frozenColumns: false,
            colModels: [
                {
                    name: 'ColumnID1',
                    label: '컬럼명 1',
                    align: 'left',
                    key: false,
                    width: 100,
                    edittype: 'text',
                    frozen: false,
                    hidden: false,
                    resizable: true,
                    sortable: true,
                    sorttype: 'text',
                    dataedittype: ''
                },
                {
                    name: 'ColumnID2',
                    label: '컬럼명 2',
                    align: 'left',
                    key: false,
                    width: 100,
                    edittype: 'text',
                    frozen: false,
                    hidden: false,
                    resizable: true,
                    sortable: true,
                    sorttype: 'text',
                    dataedittype: ''
                },
                {
                    name: 'ColumnID3',
                    label: '컬럼명 3',
                    align: 'left',
                    key: false,
                    width: 100,
                    edittype: 'text',
                    frozen: false,
                    hidden: false,
                    resizable: true,
                    sortable: true,
                    sorttype: 'text',
                    dataedittype: ''
                }
            ]
        },

        controlLoad(elID, setting) {
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($jqgrid.gridOptions, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod.hook.controlInit) {
                setting.colModels.length = 0;
                var moduleHotSettings = mod.hook.controlInit(elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleHotSettings);
            }

            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var dataField = el.getAttribute('syn-datafield');
            var html = '<table id="{0}" name="{0}" syn-datafield="{1}"></table>'.format(elID, dataField);

            var parent = el.parentNode;
            var wrapper = document.createElement('div');
            wrapper.innerHTML = html;

            parent.appendChild(wrapper);

            setTimeout(function () {
                $jqgrid.init(elID, setting);
            }, 25);
        },

        init(elID, setting) {
            syn.$l.addEvent(document, 'contextmenu', function (e) { return false; });
            syn.$l.addEvent(document, 'mousedown', function (e) {
                $jqgrid.isMouseDown = true;
            });

            syn.$l.addEvent(document, 'mousemove', function (e) {
                if (e.ctrlKey == true && $jqgrid.isMouseDown == true) {
                    $jqgrid.isMouseDown = true;
                }
                else {
                    $jqgrid.isMouseDown = false;
                }
            });

            var pathname = location.pathname;
            if (!$w.pageScript) {
                if (pathname.split('/').length > 0) {
                    var filename = pathname.split('/')[location.pathname.split('/').length - 1];
                    syn.$w.extend({ pageScript: '$' + filename.substring(0, filename.indexOf('.')) });
                }
            }

            var grid = $('#' + elID);
            var gridOptions = setting;

            if (gridOptions.colModels.length > 0) {
                if (gridOptions.multiSelect) {
                    grid.jqGrid({
                        datatype: 'local',
                        editurl: 'clientArray',
                        scrollOffset: 0,
                        shrinkToFit: false,
                        loadonce: false,
                        gridview: gridOptions.gridView,
                        multiselect: gridOptions.multiSelect,
                        multikey: 'ctrlKey',
                        multiselectWidth: 20,
                        colNames: gridOptions.colNames,
                        colModel: gridOptions.colModels,
                        rowNum: 1000,
                        loadtext: 'loading',
                        ondblClickRow() {
                        },
                        onRightClickRow() {
                        }
                    });
                }
                else if (gridOptions.rowNumbers) {
                    grid.jqGrid({
                        datatype: 'local',
                        editurl: 'clientArray',
                        scrollOffset: 0,
                        shrinkToFit: false,
                        loadonce: false,
                        gridview: gridOptions.gridView,
                        rownumbers: false, //gridOptions.rowNumbers,
                        rownumWidth: 20,
                        colNames: gridOptions.colNames,
                        colModel: gridOptions.colModels,
                        rowNum: 1000,
                        loadtext: 'loading',
                        ondblClickRow() {
                        },
                        onRightClickRow() {
                        }
                    });
                }
            }

            //grid.jqGrid('setCaption', gridOptions.caption);
            grid.jqGrid('setGridState', 'state', 'hidden');

            if (grid.jqGrid('getGridParam', 'gridstate') == 'visible') {
                $('#' + elID + '_Box a.ui-jqgrid-titlebar-close').css('display', 'none');
            }

            grid[0].isPagingLayout = gridOptions.isPagingLayout;
            grid[0].sortAble = gridOptions.sortAble;
            if (gridOptions.isPagingLayout == true) {
                var gridHeight = parseInt(gridOptions.gridHeight.replace('px', '')) - 20;
                if (gridHeight < 0) {
                    gridHeight = 0;
                }
                gridOptions.gridHeight = gridHeight.toString() + 'px';

                var navButtons = syn.$l.querySelectorAll('#' + elID + '_Navigation span.bt');
                syn.$l.addEvent(navButtons[0], 'click', $jqgrid.navigationStart);
                syn.$l.addEvent(navButtons[1], 'click', $jqgrid.navigationPreview);
                syn.$l.addEvent(navButtons[2], 'click', $jqgrid.navigationNext);
                syn.$l.addEvent(navButtons[3], 'click', $jqgrid.navigationEnd);
                gridHeight = null;
            }

            grid.jqGrid('setGridHeight', (parseInt(gridOptions.gridHeight.replace('px', '')) - 24).toString() + 'px');
            grid.jqGrid('gridResize', { minWidth: '350', maxWidth: gridOptions.gridWidth, minHeight: '80', maxHeight: gridOptions.gridHeight });

            if (gridOptions.frozenColumns == true) {
                grid.jqGrid('setFrozenColumns');
            }

            var gridParams = {};
            gridParams.datatype = gridOptions.dataType;
            gridParams.sortable = gridOptions.sortAble;
            gridParams.sortname = gridOptions.sortName;
            gridParams.sortorder = gridOptions.sortOrder;
            gridParams.viewrecords = gridOptions.viewRecords;

            $jqgrid.setControlSize(elID, $(syn.$l.get(elID + '_Box').parentElement).width(), false);

            if (syn.$w.pageScript) {
                var mod = window[syn.$w.pageScript];
                if (mod) {
                    gridParams.beforeSelectRow = $jqgrid.webGrid_beforeSelectRow;
                    gridParams.onSortCol = $jqgrid.webGrid_onSortCol;

                    if (mod.event[elID + '_ondblClickRow']) {
                        gridParams.ondblClickRow = mod.event[elID + '_ondblClickRow'];
                    }

                    if (mod.event[elID + '_onRightClickRow']) {
                        gridParams.onRightClickRow = mod.event[elID + '_onRightClickRow'];
                    }

                    if (mod.event[elID + '_onSelectRow']) {
                        gridParams.onSelectRow = mod.event[elID + '_onSelectRow'];
                    }

                    if (mod.event[elID + '_onSelectAll']) {
                        gridParams.onSelectAll = mod.event[elID + '_onSelectAll'];
                    }

                    if (mod.event[elID + '_resizeStart']) {
                        gridParams.resizeStart = mod.event[elID + '_resizeStart'];
                    }

                    if (mod.event[elID + '_resizeStop']) {
                        gridParams.resizeStop = mod.event[elID + '_resizeStop'];
                    }
                }
            }

            grid.jqGrid('setGridParam', gridParams);
        },

        webGrid_onCodePickerCallback(elID, rowData) {
            var el = syn.$l.get(elID);
            var gridID = el.getAttribute('gid');
            var mod = window[$webform.pageScript];
            if (mod) {
                var codePickerCallback = mod.event[gridID + '_onCodePickerCallback'];
                if (codePickerCallback) {
                    var rowid = el.id.split('_')[0];
                    var colid = $jqgrid.getColumnID(gridID, $.jgrid.getCellIndex(el.parentElement.parentElement));
                    codePickerCallback(gridID, rowid, colid, rowData);
                }
            }
        },

        webGrid_onSortCol(index, iCol, sortorder) {
            var target = event.target || event.srcElement;
            var gridID = target.parentNode.id.split('_')[0];
            var grid = syn.$l.get(gridID);
            var mod = window[syn.$w.pageScript];
            if (mod) {
                var headerClick = mod.event[gridID + '_onHeaderClick'];
                if (headerClick) {
                    headerClick(gridID, iCol);
                    return 'stop';
                }
            }

            if (grid) {
                if (grid.sortAble == true) {
                    if (grid.isPagingLayout == true) {
                        var pagingSettings = $jqgrid.getPagingSettings(gridID);
                        if (pagingSettings) {
                            var JsonObject = null;
                            if (sortorder == 'asc') {
                                JsonObject = JSLINQ(pagingSettings.originalJsonObject)
                                    .OrderBy(function (item) { return item[index]; })
                                    .Select(function (item) { return item; });
                            }
                            else {
                                JsonObject = JSLINQ(pagingSettings.originalJsonObject)
                                    .OrderByDescending(function (item) { return item[index]; })
                                    .Select(function (item) { return item; });
                            }

                            $jqgrid.pageBinding(gridID, JsonObject.items, pagingSettings.viewCount);
                        }
                    }
                    else {
                        // 그리드의 전체 RowStatus를 백업
                        $jqgrid.sortDatas = $jqgrid.getAllRowStatus(gridID);

                        var jGrid = $('#' + gridID);
                        if (jGrid.jqGrid('getGridParam', 'datatype') == 'json') {
                            var dataJsonObject = [];
                            var dataIDs = jGrid.jqGrid('getDataIDs');
                            for (var i = 0, l = dataIDs.length; i < l; i++) {
                                dataJsonObject.push(jGrid.jqGrid('getRowData', dataIDs[i]));
                            }

                            var JsonObject = null;
                            if (sortorder == 'asc') {
                                JsonObject = JSLINQ(dataJsonObject)
                                    .OrderBy(function (item) { return item[index]; })
                                    .Select(function (item) { return item; });
                            }
                            else {
                                JsonObject = JSLINQ(dataJsonObject)
                                    .OrderByDescending(function (item) { return item[index]; })
                                    .Select(function (item) { return item; });
                            }

                            $jqgrid.dataBinding(gridID, JsonObject.items);
                        }
                    }

                    if (mod) {
                        var sortCol = mod.event[gridID + '_onSortCol'];
                        if (sortCol) {
                            return sortCol(index, iCol, sortorder);
                        }
                    }
                }
                else {
                    return 'stop';
                }
            }
            else {
                return 'stop';
            }
        },

        webGrid_onSortingCol(index, iCol, sortorder) {
            var target = event.target || event.srcElement;
            var gridID = target.parentNode.id.split('_')[0];
            var rowStatus = null;

            // 정렬후 RowStatus 복원
            if ($jqgrid.sortDatas) {
                for (var i = 0, l = $jqgrid.sortDatas.length; i < l; i++) {
                    rowStatus = $jqgrid.sortDatas[i];
                    $jqgrid.updateRowStatus(gridID, rowStatus.rowid, rowStatus.flag);

                    if (rowStatus.flag == 'D') {
                        $jqgrid.setRowColor(gridID, rowStatus.rowid, '#fde5d6');
                    }
                }
            }

            var mod = window[syn.$w.pageScript];
            if (mod) {
                var sortingCol = mod.event[gridID + '_onSortingCol'];
                if (sortingCol) {
                    return sortingCol(index, iCol, sortorder);
                }
            }
        },

        webGrid_beforeSelectRow(rowid, e) {
            var grid = $('#' + e.delegateTarget.id);
            if (grid.jqGrid('getGridParam', 'multiselect')) {
                if ($.jgrid.getCellIndex(e.target) == 0 || (grid.jqGrid('getGridParam', 'multikey') == 'ctrlKey' && e.ctrlKey)) {
                    grid.jqGrid('setSelection', rowid, false);
                }
            }
            else {
                $jqgrid.resetFocusRow(e.delegateTarget.id);
                $jqgrid.focusRow(e.delegateTarget.id, rowid);
            }

            var mod = window[$webform.pageScript];
            if (mod) {
                var beforeSelectRow = mod.event[e.delegateTarget.id + '_beforeSelectRow'];
                if (beforeSelectRow) {
                    beforeSelectRow(arguments[0], arguments[1]);
                }
            }
        },

        addRow(elID, rowData, position, srcrowid) {
            var newId = $.jgrid.randId(elID);
            $('#' + elID).jqGrid('addRowData', newId, rowData, position, srcrowid);
            $('#' + newId).addClass('I');
            return newId;
        },

        pageBinding(elID, jsonObject, viewCount, isReadOnly) {
            var originalJsonObject = $reflection.clone(jsonObject);
            var rowCount = jsonObject.length;
            var pageViewCount = viewCount;
            if (syn.$l.get(elID).isPagingLayout == true) {
                if (!viewCount) {
                    if (syn.$b.isMobile == true) {
                        pageViewCount = 200;
                    }
                    else {
                        pageViewCount = 500;
                    }
                }

                var val = {};
                var gridRowCount = jsonObject.length;
                var gridTotalPages = gridRowCount % pageViewCount > 0 ? Math.floor(gridRowCount / pageViewCount) + 1 : Math.floor(gridRowCount / (pageViewCount == 0 ? 1 : pageViewCount));
                var spliceJsonObjects = [];

                for (var i = 0; i < gridTotalPages; i++) {
                    spliceJsonObjects.push(jsonObject.splice(0, pageViewCount));
                }

                val.gridid = elID;
                val.rowCount = gridRowCount; // 총 Rows수
                val.viewCount = pageViewCount; // 한 화면에 보여질 Rows수
                val.totalPages = gridTotalPages; // 총 Page 수
                val.currentPageIndex = 1; // 현재 Page 위치
                val.jsonObjects = spliceJsonObjects; // Splice JSON 데이터
                val.originalJsonObject = originalJsonObject; // JSON 데이터

                //2013-01-24 이동호 추가
                var pagingSetting = null;
                for (var i = 0; i < $jqgrid.pagingSettings.length; i++) {
                    pagingSetting = $jqgrid.pagingSettings[i];

                    if (pagingSetting) {
                        if (pagingSetting.gridid == elID) {
                            delete $jqgrid.pagingSettings[i];
                        }
                    }
                }

                $jqgrid.pagingSettings.push(val);

                if (spliceJsonObjects.length > 0) {
                    jsonObject = spliceJsonObjects[0];
                }
            }

            $jqgrid.dataBinding(elID, jsonObject, false, isReadOnly);
            syn.$l.querySelector('#' + elID + '_Navigation dt').innerText = 'Rows : ' + rowCount.toString();
            syn.$l.querySelector('#' + elID + '_Navigation dd > .page').innerText = '1 / ' + gridTotalPages;
        },

        getPagingSettings(elID) {
            var val = null;
            var pagingSetting = null;
            for (var i = 0; i < $jqgrid.pagingSettings.length; i++) {
                pagingSetting = $jqgrid.pagingSettings[i];

                if (pagingSetting) {
                    if (pagingSetting.gridid == elID) {
                        val = pagingSetting;
                        break;
                    }
                }
            }

            return val;
        },

        navigationStart(e) {
            var el = e.target || e.srcElement || e;
            var elID = el.parentElement.parentElement.id.replace('_Navigation', '');
            var pagingSetting = $jqgrid.getPagingSettings(elID);

            if (pagingSetting != null) {
                var jsonObject = pagingSetting.jsonObjects[0];
                var isContinue = true;
                var mod = window[$webform.pageScript];
                if (mod) {
                    var beforeNavigation = mod.event[elID + '_beforeNavigation'];
                    if (beforeNavigation) {
                        isContinue = beforeNavigation(elID, $jqgrid.isUpdateDatas(elID), pagingSetting.currentPageIndex, 1);
                    }
                }

                if (isContinue == true) {
                    pagingSetting.currentPageIndex = 1;
                    $jqgrid.dataBinding(elID, jsonObject);
                    syn.$l.querySelector('#' + elID + '_Navigation dd > .page').innerText = '1 / ' + pagingSetting.totalPages.toString();
                }

                if (mod) {
                    var afterNavigation = mod.event[elID + '_afterNavigation'];
                    if (afterNavigation) {
                        isContinue = afterNavigation(elID);
                    }
                }
            }
        },

        navigationPreview(e) {
            var el = e.target || e.srcElement || e;
            var elID = el.parentElement.parentElement.id.replace('_Navigation', '');
            var pagingSetting = $jqgrid.getPagingSettings(elID);

            if (pagingSetting != null) {
                var jsonObject = null;
                var isContinue = true;
                var mod = window[$webform.pageScript];

                if (pagingSetting.currentPageIndex > 1) {
                    if (mod) {
                        var beforeNavigation = mod.event[elID + '_beforeNavigation'];
                        if (beforeNavigation) {
                            isContinue = beforeNavigation(elID, $jqgrid.isUpdateDatas(elID), pagingSetting.currentPageIndex, (pagingSetting.currentPageIndex - 1));
                        }
                    }

                    if (isContinue == true) {
                        pagingSetting.currentPageIndex--;
                        jsonObject = pagingSetting.jsonObjects[pagingSetting.currentPageIndex - 1];

                        $jqgrid.dataBinding(elID, jsonObject);
                        syn.$l.querySelector('#' + elID + '_Navigation dd > .page').innerText = pagingSetting.currentPageIndex.toString() + ' / ' + pagingSetting.totalPages.toString();
                    }
                }

                if (mod) {
                    var afterNavigation = mod.event[elID + '_afterNavigation'];
                    if (afterNavigation) {
                        isContinue = afterNavigation(elID);
                    }
                }
            }
        },

        navigationNext(e) {
            var el = e.target || e.srcElement || e;
            var elID = el.parentElement.parentElement.id.replace('_Navigation', '');
            var pagingSetting = $jqgrid.getPagingSettings(elID);

            if (pagingSetting != null) {
                var jsonObject = null;
                var isContinue = true;
                var mod = window[$webform.pageScript];

                if (pagingSetting.currentPageIndex < pagingSetting.totalPages) {
                    if (mod) {
                        var beforeNavigation = mod.event[elID + '_beforeNavigation'];
                        if (beforeNavigation) {
                            isContinue = beforeNavigation(elID, $jqgrid.isUpdateDatas(elID), pagingSetting.currentPageIndex, (pagingSetting.currentPageIndex + 1));
                        }
                    }

                    if (isContinue == true) {
                        pagingSetting.currentPageIndex++;
                        jsonObject = pagingSetting.jsonObjects[pagingSetting.currentPageIndex - 1];

                        $jqgrid.dataBinding(elID, jsonObject);
                        syn.$l.querySelector('#' + elID + '_Navigation dd > .page').innerText = pagingSetting.currentPageIndex.toString() + ' / ' + pagingSetting.totalPages.toString();
                    }
                }

                if (mod) {
                    var afterNavigation = mod.event[elID + '_afterNavigation'];
                    if (afterNavigation) {
                        isContinue = afterNavigation(elID);
                    }
                }
            }
        },

        navigationEnd(e) {
            var el = e.target || e.srcElement || e;
            var elID = el.parentElement.parentElement.id.replace('_Navigation', '');
            var pagingSetting = $jqgrid.getPagingSettings(elID);

            if (pagingSetting != null) {
                var jsonObject = pagingSetting.jsonObjects[pagingSetting.jsonObjects.length - 1];
                var isContinue = true;
                var mod = window[$webform.pageScript];

                if (mod) {
                    var beforeNavigation = mod.event[elID + '_beforeNavigation'];
                    if (beforeNavigation) {
                        isContinue = beforeNavigation(elID, $jqgrid.isUpdateDatas(elID), pagingSetting.currentPageIndex, pagingSetting.totalPages);
                    }
                }

                if (isContinue == true) {
                    pagingSetting.currentPageIndex = pagingSetting.totalPages;
                    $jqgrid.dataBinding(elID, jsonObject);
                    syn.$l.querySelector('#' + elID + '_Navigation dd > .page').innerText = pagingSetting.totalPages.toString() + ' / ' + pagingSetting.totalPages.toString();
                }

                if (mod) {
                    var afterNavigation = mod.event[elID + '_afterNavigation'];
                    if (afterNavigation) {
                        isContinue = afterNavigation(elID);
                    }
                }
            }
        },

        isUpdateDatas(elID) {
            var val = false;
            var flag = '';
            var row = null;
            var el = null;
            var grid = $('#' + elID);
            var gridTable = grid[0];

            for (var i = 1, l = gridTable.rows.length; i < l; i++) {
                el = gridTable.rows[i];
                flag = syn.$m.hasClass(el, 'I') == true ? 'I' : $m.hasClass(el, 'U') == true ? 'U' : $m.hasClass(el, 'D') == true ? 'D' : '';

                switch (flag) {
                    case 'I':
                    case 'U':
                    case 'D':
                        return true;
                        break;
                }
            }
            return val;
        },

        dataBinding(elID, jsonObject, isAdd, isReadOnly) {
            var row = null;
            var grid = $('#' + elID);

            if (!isAdd) {
                isAdd = false;
            }

            if (isAdd == false) {
                grid.jqGrid('clearGridData');
            }

            if (isReadOnly) {
                for (var i = 0, l = jsonObject.length; i < l; i++) {
                    grid.jqGrid('addRowData', $.jgrid.randId(elID), jsonObject[i]);
                }
            }
            else {
                var newId = null;
                for (var i = 0, l = jsonObject.length; i < l; i++) {
                    newId = $.jgrid.randId(elID);
                    grid.jqGrid('addRowData', newId, jsonObject[i]);
                    $('#' + newId).addClass('R');
                }
            }
        },

        bulkBinding(elID, jsonObject, isReadOnly) {
            var grid = $('#' + elID);
            $.jgrid.uidPref = elID;
            var el = null;
            var gridTable = grid[0];

            grid.jqGrid('setGridParam', { datatype: 'json', loadonce: true });
            gridTable.addJSONData(jsonObject);
            grid.jqGrid('setGridParam', { datatype: 'local', loadonce: true });

            if (isReadOnly) {
            }
            else {
                for (var i = 1, l = gridTable.rows.length; i < l; i++) {
                    $m.addClass(gridTable.rows[i], 'R');
                }
            }
        },

        restoreHideRow(elID, rowid) {
            var rowControl = $('#' + rowid);
            if (rowid) {
                rowControl.removeClass('D').addClass('R').show();
                $jqgrid.setRowColor(elID, rowid, '');
            }

            rowControl = null;
        },

        deleteRow(elID, rowid) {
            var grid = $('#' + elID);
            var rowControl = $('#' + rowid);

            if (rowid) {
                if (rowControl.hasClass('I')) {
                    grid.jqGrid('delRowData', rowid);
                }
                else if (rowControl.hasClass('R')) {
                    rowControl.removeClass('R').addClass('D');
                    $jqgrid.setRowColor(elID, rowid, '#fde5d6');
                }
                else if (rowControl.hasClass('U')) {
                    rowControl.removeClass('U').addClass('D');
                    $jqgrid.setRowColor(elID, rowid, '#fde5d6');
                }
            }
            else {
                var selrow = grid.jqGrid('getGridParam', 'selrow');
                if (selrow == null) {
                    alert('Please select the rows to be deleted.');
                }
                else {
                    if (rowControl.hasClass('I')) {
                        grid.jqGrid('delRowData', rowid);
                    }
                    else {
                        rowControl.addClass('D');
                        $jqgrid.setRowColor(elID, rowid, '#fde5d6');
                    }
                }
            }
        },

        hiddenRow(elID, rowid) {
            var grid = $('#' + elID);
            var rowControl = $('#' + rowid);

            if (rowid) {
                if (rowControl.hasClass('I')) {
                    grid.jqGrid('delRowData', rowid);
                }
                else if (rowControl.hasClass('R')) {
                    rowControl.removeClass('R').addClass('D').hide();
                }
                else if (rowControl.hasClass('U')) {
                    rowControl.removeClass('U').addClass('D').hide();
                }
            }
            else {
                var selrow = grid.jqGrid('getGridParam', 'selrow');
                if (selrow == null) {
                    alert('Please select the rows to be hidden.');
                }
                else {
                    if (rowControl.hasClass('I')) {
                        grid.jqGrid('delRowData', rowid);
                    }
                    else {
                        rowControl.addClass('D').hide();
                    }
                }
            }
        },

        editRow(elID, rowid) {
            syn.$l.get(rowid).gridRowObject = $jqgrid.getRowData(elID, rowid);
            $('#' + elID).jqGrid('editRow', rowid);
        },

        saveRow(elID, rowid) {
            $('#' + elID).jqGrid('saveRow', rowid, false, 'clientArray');

            var rowControl = $('#' + rowid);

            if (rowControl.hasClass('R')) {
                rowControl.removeClass('R');
                rowControl.addClass('U');
            }
        },

        restoreRow(elID, rowid) {
            //$('#' + elID).jqGrid('restoreRow', rowid);
            $jqgrid.saveRow(elID, rowid);
            var row = syn.$l.get(rowid);
            if (row.gridRowObject) {
                $jqgrid.updateRow(elID, rowid, row.gridRowObject);
                row.gridRowObject = undefined;
            }
        },

        updateRow(elID, rowid, jsonObject) {
            var grid = $('#' + elID);
            var rowControl = $('#' + rowid);

            if (rowControl.hasClass('I') || rowControl.hasClass('R') || rowControl.hasClass('U')) {
                grid.jqGrid('updateRow', rowid, jsonObject);
            }

            if (rowControl.hasClass('R')) {
                rowControl.removeClass('R');
                rowControl.addClass('U');
            }
        },

        updateRowStatus(elID, rowid, statusFlag) {
            var rowControl = $('#' + rowid);

            rowControl.removeClass('I').removeClass('R').removeClass('U').removeClass('D');
            rowControl.addClass(statusFlag);
        },

        updateRowsStatus(elID, statusFlag) {
            var grid = $('#' + elID);
            var dataIDs = grid.jqGrid('getDataIDs');

            for (var i = 0, l = dataIDs.length; i < l; i++) {
                $jqgrid.updateRowStatus(elID, dataIDs[i], statusFlag);
            }
        },

        colHidden(elID, colid, isHidden) {
            var grid = $('#' + elID);

            if (isHidden) {
                grid.jqGrid('hideCol', colid);
            }
            else {
                grid.jqGrid('showCol', colid);
            }
        },

        deleteSelectedRow(elID) {
            var grid = $('#' + elID);
            var selarrrow = null;
            selarrrow = grid.jqGrid('getGridParam', 'selarrrow');
            for (var i = selarrrow.length - 1; i >= 0; i--) {
                this.deleteRow(elID, selarrrow[i]);
            }
        },

        gridExportJson(elID) {
            return $('#' + elID).jqGrid('jqGridExport', { exptype: 'jsonstring' });
        },

        gridImportJson(elID, jsonString) {
            $('#' + elID).jqGrid('jqGridImport', { imptype: 'jsonstring', impstring: jsonString });
        },

        getFocusRowID(elID) {
            return $('#' + elID).jqGrid('getGridParam', 'selrow');
        },

        focusRow(elID, rowid) {
            $('#' + elID).jqGrid('setSelection', rowid, true);
        },

        resetFocusRow(elID) {
            $('#' + elID).jqGrid('resetSelection');
        },

        autoSizeMode(elID, shrink) {
            $('#' + elID).jqGrid('setGridWidth', $('#' + elID).jqGrid('getGridParam', 'width'), shrink);
        },

        getRowID(elID, rowIndex) {
            return $('#' + elID).jqGrid('getDataIDs')[rowIndex];
        },

        getRowIndex(elID, rowID) {
            return $('#' + elID)[0].rows[rowID].rowIndex;
        },

        getRowCount(elID) {
            return $('#' + elID).jqGrid('getDataIDs').length;
        },

        getVisibleRowCount(elID) {
            var grid = $('#' + elID);
            var gridTable = grid[0];
            var rowCount = 0;
            var flag = '';

            for (var i = 1; i < gridTable.rows.length; i++) {
                el = gridTable.rows[i];
                flag = syn.$m.hasClass(el, 'I') == true ? 'I' : $m.hasClass(el, 'U') == true ? 'U' : $m.hasClass(el, 'D') == true ? 'D' : 'R';

                switch (flag) {
                    case 'I':
                    case 'U':
                    case 'R':
                        rowCount++;
                        break;
                }
            }

            return rowCount;
        },

        getCellText(elID, rowid, colid) {
            var grid = $('#' + elID);
            var val = grid.jqGrid('getCell', rowid, colid);
            var colModels = grid.jqGrid('getGridParam', 'colModel');
            var colModel = null;

            if (colModels) {
                var selectValue = '';
                for (var i = 0; i < colModels.length; i++) {
                    colModel = colModels[i];

                    if (colModel.name === colid && (colModel.edittype === 'select' || colModel.dataedittype === 'datalist')) {
                        if (colModel.edittype === 'select') {
                            if (colModel.dataoptions != null) {
                                $.each(colModel.editoptions.value.split(';'), function (key, value) {
                                    selectData = value.split(':');

                                    if (val == selectData[0]) {
                                        selectValue = selectData[1];
                                    }
                                });
                            }
                        }
                        else if (colModel.dataedittype === 'datalist') {
                            if (colModel.dataoptions != null) {
                                $.each(colModel.dataoptions.value.split(';'), function (key, value) {
                                    selectData = value.split(':');

                                    if (val == selectData[0]) {
                                        selectValue = selectData[1];
                                    }
                                });
                            }
                        }

                        if (selectValue.length > 0) {
                            val = selectValue;
                            break;
                        }
                    }
                }
            }

            if (val === false) {
                val = '';
            }

            return val;
        },

        getCellValue(elID, rowid, colid) {
            var grid = $('#' + elID);
            var val = grid.jqGrid('getCell', rowid, colid);
            var colModels = grid.jqGrid('getGridParam', 'colModel');
            var colModel = null;

            if (colModels) {
                var selectValue = '';
                for (var i = 0; i < colModels.length; i++) {
                    colModel = colModels[i];

                    if (colModel.name === colid && (colModel.edittype === 'select' || colModel.dataedittype === 'datalist')) {
                        if (colModel.edittype === 'select') {
                            $.each(colModel.editoptions.value.split(';'), function (key, value) {
                                selectData = value.split(':');

                                if (val == selectData[0]) {
                                    selectValue = selectData[0];
                                }
                            });
                        }
                        else if (colModel.dataedittype === 'datalist') {
                            $.each(colModel.dataoptions.value.split(';'), function (key, value) {
                                selectData = value.split(':');

                                if (val == selectData[0]) {
                                    selectValue = selectData[0];
                                }
                            });
                        }

                        if (selectValue.length > 0) {
                            val = selectValue;
                            break;
                        }
                    }
                }
            }

            if (val === false) {
                val = '';
            }

            return val;
        },

        setCellText(elID, rowid, colid, value) {
            var grid = $('#' + elID);
            var rowData = grid.jqGrid('getRowData', rowid);
            var val = rowData[colid];
            var rowControl = $('#' + rowid);

            if (val == undefined) {
            }
            else {
                rowData[colid] = value;
                grid.jqGrid('updateRow', rowid, rowData);

                if (rowControl.hasClass('R')) {
                    rowControl.removeClass('R');
                    rowControl.addClass('U');
                }
            }
        },

        setCellValue(elID, rowid, colid, value) {
            var grid = $('#' + elID);
            var rowData = grid.jqGrid('getRowData', rowid);
            var val = rowData[colid];
            var rowControl = $('#' + rowid);

            if (val == undefined) {
            }
            else {
                rowData[colid] = value;
                grid.jqGrid('updateRow', rowid, rowData);

                if (rowControl.hasClass('R')) {
                    rowControl.removeClass('R');
                    rowControl.addClass('U');
                }
            }
        },

        getColumnCollection(elID) {
            return $('#' + elID).jqGrid('getGridParam', 'colModel');
        },

        getColumn(elID, colid) {
            return $('#' + elID).jqGrid('getCol', colid);
        },

        getColumnID(elID, colIndex) {
            var colData = $('#' + elID).jqGrid('getGridParam', 'colModel')[colIndex];
            var val = undefined;

            if (colData != undefined) {
                val = colData.name;
            }

            return val;
        },

        setHeaderText(elID, colName, value) {
            $('#' + elID).jqGrid('setLabel', colName, value);
        },

        getRowData(elID, rowid) {
            return $('#' + elID).jqGrid('getRowData', rowid);
        },

        getCellIndex(targetElement) {
            var val;

            try {
                val = $.jgrid.getCellIndex(targetElement);
            }
            catch (e) {
                val = undefined;
            }

            return val;
        },

        setControlSize(elID, width, shrink, height) {
            var grid = $('#' + elID);
            grid.jqGrid('setGridWidth', width, shrink);

            if (height) {
                grid.jqGrid('setGridHeight', height);
            }
        },

        setColumnWidth(elID, colIndex, colWidth) {
            var grid = $('#' + elID);
            var colData = grid.jqGrid('getGridParam', 'colModel')[colIndex];

            if (colData == undefined) {
                alert('컬럼 인덱스에 맞는 컬럼 정보를 찾을 수 없습니다.');
            }
            else {
                grid.jqGrid('setColProp', colData.name, { width: colWidth });
            }
        },

        dataClear(elID) {
            $('#' + elID).jqGrid('clearGridData');

            if (syn.$l.get(elID).isPagingLayout == true) {
                var pagingSetting = null;
                for (var i = 0; i < $jqgrid.pagingSettings.length; i++) {
                    pagingSetting = $jqgrid.pagingSettings[i];

                    if (pagingSetting) {
                        if (pagingSetting.gridid == elID) {
                            delete $jqgrid.pagingSettings[i];
                            break;
                        }
                    }
                }

                syn.$l.querySelector('#' + elID + '_Navigation dt').innerText = 'Rows : 0';
                syn.$l.querySelector('#' + elID + '_Navigation dd > .page').innerText = '1 / 1';
                pagingSetting = null;
            }
        },

        getUpdateRowID(elID, dataClass) {
            var grid = $('#' + elID);
            var gridTable = grid[0];
            var ids = [], i = 0, l, j = 0;
            var el = null;

            l = gridTable.rows.length;
            if (l && l > 0) {
                while (i < l) {
                    el = gridTable.rows[i];
                    if (syn.$m.hasClass(el, dataClass) == true) {
                        ids[j] = el.id;
                        j++;
                    }
                    i++;
                }
            }

            return ids;
        },

        getAllRowStatus(elID) {
            var grid = $('#' + elID);
            var gridTable = grid[0];
            var ids = [], i = 0, j = 0, l;
            var el = null;
            var flag = '';

            l = gridTable.rows.length;
            for (var i = 1; i < l; i++) {
                el = gridTable.rows[i];
                flag = syn.$m.hasClass(el, 'I') == true ? 'I' : $m.hasClass(el, 'U') == true ? 'U' : $m.hasClass(el, 'D') == true ? 'D' : 'R';

                ids[j] = { 'rowid': el.id, 'flag': flag };
                j++;
            }

            return ids;
        },

        getUpdateDatasByXML(elID, columns) {
            var el = null;
            var grid = $('#' + elID);
            var gridTable = grid[0];
            var l = gridTable.rows.length;
            var flag = '';
            var row = null;

            syn.$sb.clear();
            syn.$sb.append('<' + elID + '>');

            if (columns) {
                for (var i = 0; i < gridTable.rows.length; i++) {
                    el = gridTable.rows[i];

                    flag = syn.$m.hasClass(el, 'I') == true ? 'I' : $m.hasClass(el, 'U') == true ? 'U' : $m.hasClass(el, 'D') == true ? 'D' : '';
                    switch (flag) {
                        case 'I':
                        case 'U':
                        case 'D':
                            row = grid.getRowData(el.id);

                            syn.$sb.append("<rows flag='' + flag + '' ");
                            for (var col in row) {
                                if ($array.contains(columns, col) == true) {
                                    syn.$sb.append(col.toString() + "='' + row[col].toString().replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;').replace(/\n/gi, '&#10;').replace(/'/gi, '&apos;') + '' ");
                                }
                            }
                            syn.$sb.append('/>');
                            break;
                    }
                }
            }
            else {
                for (var i = 0; i < gridTable.rows.length; i++) {
                    el = gridTable.rows[i];

                    flag = syn.$m.hasClass(el, 'I') == true ? 'I' : $m.hasClass(el, 'U') == true ? 'U' : $m.hasClass(el, 'D') == true ? 'D' : '';
                    switch (flag) {
                        case 'I':
                        case 'U':
                        case 'D':
                            row = grid.getRowData(el.id);

                            syn.$sb.append("<rows flag='' + flag + '' ");
                            for (var col in row) {
                                syn.$sb.append(col.toString() + "='' + row[col].toString().replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;').replace(/\n/gi, '&#10;').replace(/'/gi, '&apos;') + '' ");
                            }
                            syn.$sb.append('/>');
                            break;
                    }
                }
            }

            syn.$sb.append('</' + elID + '>');

            return syn.$sb.toString();
        },

        getUpdateDatas(elID, columns) {
            var val = {};
            val.gridID = elID;
            val.rows = new Array();

            var flag = '';
            var row = null;
            var el = null;
            var grid = $('#' + elID);
            var gridTable = grid[0];
            var tmpRow = [];

            if (columns) {
                for (var i = 0; i < gridTable.rows.length; i++) {
                    el = gridTable.rows[i];
                    flag = syn.$m.hasClass(el, 'I') == true ? 'I' : $m.hasClass(el, 'U') == true ? 'U' : $m.hasClass(el, 'D') == true ? 'D' : '';

                    switch (flag) {
                        case 'I':
                        case 'U':
                        case 'D':
                            row = grid.getRowData(el.id);

                            for (var col in row) {
                                if ($array.contains(columns, col) == true) {
                                    tmpRow[col] = row[col];
                                }
                            }

                            row.flag = flag;
                            val.rows.push(tmpRow);
                            tmpRow = [];
                            break;
                    }
                }
            }
            else {
                for (var i = 0; i < gridTable.rows.length; i++) {
                    el = gridTable.rows[i];
                    flag = syn.$m.hasClass(el, 'I') == true ? 'I' : $m.hasClass(el, 'U') == true ? 'U' : $m.hasClass(el, 'D') == true ? 'D' : '';

                    switch (flag) {
                        case 'I':
                        case 'U':
                        case 'D':
                            row = grid.getRowData(el.id);
                            row.flag = flag;
                            val.rows.push(row);
                            break;
                    }
                }
            }

            return val;
        },

        setMergeHeader(elID, useColSpan, headers) {
            $('#' + elID).jqGrid('setGroupHeaders', { useColSpanStyle: useColSpan, groupHeaders: headers });
        },

        getCellStyle(elID, rowid, colid, style) {
            var el = syn.$l.querySelector('#' + elID + ' #' + rowid + ' > td[aria-describedby*=' + colid + ']');
            var result = null;

            if (el) {
                result = syn.$w.getStyle(el, style);
            }

            return result;
        },

        getRowStyle(elID, rowid, style) {
            var el = syn.$l.querySelector('#' + elID + ' #' + rowid);
            var result = null;

            if (el) {
                result = syn.$w.getStyle(el, style);
            }

            return result;
        },

        setCellColor(elID, rowid, colid, foreColor, backColor) {
            var grid = $('#' + elID);
            if (foreColor) {
                $('#' + elID).jqGrid('setCell', rowid, colid, '', { 'color': foreColor });
            }

            if (backColor) {
                $('#' + elID).jqGrid('setCell', rowid, colid, '', { 'background-color': backColor });
            }
        },

        setRowColor(elID, rowid, backColor) {
            $m.setStyle(syn.$l.get(rowid), 'background-color', backColor);
        },

        setColumnsColor(elID, colids, foreColor, backColor) {
            var grid = $('#' + elID);
            var gridTable = $('#' + elID)[0];
            var rowid = null;
            var el = null;
            if ($reflection.isArray(colids) == true) {
                if (foreColor && backColor) {
                    for (var i = 1, l = gridTable.rows.length; i < l; i++) {
                        el = gridTable.rows[i];
                        rowid = el.id;
                        for (var j = 0; j < colids.length; j++) {
                            grid.jqGrid('setCell', rowid, colids[j], '', { 'color': foreColor });
                            grid.jqGrid('setCell', rowid, colids[j], '', { 'background-color': backColor });
                        }
                    }
                }
                else if (foreColor && !backColor) {
                    for (var i = 1, l = gridTable.rows.length; i < l; i++) {
                        el = gridTable.rows[i];
                        for (var j = 0; j < colids.length; j++) {
                            grid.jqGrid('setCell', el.id, colids[j], '', { 'color': foreColor });
                        }
                    }
                }
                else if (!foreColor && backColor) {
                    for (var i = 1, l = gridTable.rows.length; i < l; i++) {
                        el = gridTable.rows[i];
                        for (var j = 0; j < colids.length; j++) {
                            grid.jqGrid('setCell', el.id, colids[j], '', { 'background-color': backColor });
                        }
                    }
                }
            }
            else {
                if (foreColor && backColor) {
                    for (var i = 1, l = gridTable.rows.length; i < l; i++) {
                        el = gridTable.rows[i];
                        rowid = el.id;
                        grid.jqGrid('setCell', rowid, colids, '', { 'color': foreColor });
                        grid.jqGrid('setCell', rowid, colids, '', { 'background-color': backColor });
                    }
                }
                else if (foreColor && !backColor) {
                    for (var i = 1, l = gridTable.rows.length; i < l; i++) {
                        el = gridTable.rows[i];
                        grid.jqGrid('setCell', el.id, colids, '', { 'color': foreColor });
                    }
                }
                else if (!foreColor && backColor) {
                    for (var i = 1, l = gridTable.rows.length; i < l; i++) {
                        el = gridTable.rows[i];
                        grid.jqGrid('setCell', el.id, colids, '', { 'background-color': backColor });
                    }
                }
            }
        },

        checkboxDataChecker(e) {
            var el = e.target;
            if (!el) {
                el = e;
            }

            if ($jqgrid.isMouseDown == true && $jqgrid.lastRowID != el.id) {
                if (el.checked == true) {
                    el.checked = false;
                }
                else {
                    el.checked = true;
                }

                $jqgrid.dataChangeEventer(el);
            }

            $jqgrid.lastRowID = el.id;
        },

        buttonClickEventer(e) {
            var el = e.target;
            if (!el) {
                el = e;
            }
            var gid = el.getAttribute('gid');
            var colIndex = el.getAttribute('col');
            var type = el.getAttribute('type');
            var rowId = el.id.split('_')[0];

            if (window[syn.$w.pageScript]) {
                var func = window[syn.$w.pageScript][gid + '_buttonClick'];
                if (func) {
                    func(el, gid, rowId, colIndex);
                }
            }
        },

        dataChangeEventer(e) {
            var el = e.target;
            if (!el) {
                el = e;
            }
            var gid = el.getAttribute('gid');
            var colIndex = el.getAttribute('col');
            var type = el.getAttribute('datatype');
            var rowid = el.id.split('_')[0];
            var rowObject = $jqgrid.getRowData(gid, rowid);

            rowObject[$jqgrid.getColumnID(gid, colIndex)] = function (el, type) {
                var val = '';
                switch (type) {
                    case 'checkbox':
                        val = el.checked.toString().toLowerCase();
                        break;
                    case 'select':
                        val = el.options[el.selectedIndex].value;
                        break;
                    case 'radio':
                        val = $radio.getValue(rowid + '_' + colIndex + '_radiogroup');
                        break;
                    case 'date':
                        $text.date_textbox_blur(el, event);
                        val = el.value;
                        break;
                    case 'codepicker':
                        var text = '';
                        var value = '';
                        if (el.resultValue) {
                            text = el.resultValue['textField'];
                            value = el.resultValue['valueField'];
                        }
                        else {
                            text = el.value;
                            value = syn.$l.get(el.id.replace('_codepicker', '_value')).value;
                        }

                        syn.$l.get(el.id.replace('_codepicker', '_value')).value = value;
                        el.value = text;
                        val = value + 'ⅰ' + text;
                        text = null;
                        value = null;
                        break;
                    default:
                        val = el.value;
                        break;
                }

                return val;
            }(el, type);

            var mod = window[$webform.pageScript];
            if (mod) {
                var func = mod.event[gid + '_beforeUpdateRow'];
                if (func) {
                    func(gid, rowid, colIndex, rowObject);
                }
            }

            $jqgrid.updateRow(gid, rowid, rowObject);

            var row = syn.$l.get(rowid);
            if (syn.$m.hasClass(row, 'R') == true) {
                $m.removeClass(row, 'R');
                $m.addClass(row, 'U');
            }
        },

        clear(elID, isControlLoad) {
        },

        setLocale(elID, translations, control, options) {
        }
    });
    syn.uicontrols.$jqgrid = $jqgrid;

})(window);
