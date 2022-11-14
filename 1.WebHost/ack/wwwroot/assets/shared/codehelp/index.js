$w.initializeFormScript({
    gridID: 'grdCodeList',
    codeConfig: {
        dataSourceID: '',
        storeSourceID: null,
        searchValue: '',
        searchText: '',
        isMultiSelect: false,
        isAutoSearch: true,
        isOnlineData: false,
        parameters: ''
    },

    controlInit: function (elID, controlOptions) {
        switch (elID) {
            case $index.gridID:
                return syn.uicontrols.$grid.getInitializeColumns({
                    columns: [
                        ['empty', '', 10, false, 'text', false, 'left']
                    ]
                });
                break;
        }
    },

    pageLoad: function () {
        var parameterID = syn.$r.query('parameterID');
        if (parent && parameterID) {
            var setting = parent[parent.$w.pageScript].codePickerArguments[parameterID];

            if (setting.storeSourceID) {
                var dataSource = null;
                var mod = window[syn.$w.pageScript];
                if (mod.config && mod.config.dataSource && mod.config.dataSource[setting.storeSourceID] && setting.local == true) {
                    dataSource = mod.config.dataSource[setting.storeSourceID];
                }

                if (dataSource) {
                    if (parent && parent.document && dataSource.Description) {
                        var popupHeader = parent.document.querySelector('h3.mt-0.mb-0');
                        popupHeader.textContent = dataSource.Description;
                    }

                    $index.codeConfig = syn.$w.argumentsExtend(dataSource, $index.codeConfig);
                    $index.codeConfig = syn.$w.argumentsExtend($index.codeConfig, setting);
                    $index.initialize();
                }
                else {
                    if (setting.local == true) {
                        syn.$w.loadJson(syn.Config.SharedAssetUrl + 'code/{0}.json'.format(setting.dataSourceID), setting, function (setting, json) {
                            if (parent && parent.document && json.Description) {
                                var popupHeader = parent.document.querySelector('h3.mt-0.mb-0');
                                popupHeader.textContent = json.Description;
                            }

                            $index.codeConfig = syn.$w.argumentsExtend(json, $index.codeConfig);
                            $index.codeConfig = syn.$w.argumentsExtend($index.codeConfig, setting);
                            $index.initialize();
                        }, null, false);
                    }
                    else {
                        syn.$w.getDataSource(setting.dataSourceID, setting.parameters, function (json) {
                            if (parent && parent.document && json.Description) {
                                var popupHeader = parent.document.querySelector('h3.mt-0.mb-0');
                                popupHeader.textContent = json.Description;
                            }

                            $index.codeConfig = syn.$w.argumentsExtend(json, $index.codeConfig);
                            $index.codeConfig = syn.$w.argumentsExtend($index.codeConfig, setting);
                            $index.initialize();
                        });
                    }
                }
            }
        }
        else {
            alert('코드헬프 페이지는 단독으로 실행할 수 없습니다');
        }
    },

    initialize: function () {
        var columns = [];
        var codeConfig = $index.codeConfig;
        var scheme = codeConfig.Scheme;

        if (codeConfig.isMultiSelect == true) {
            columns.push(['IsSelect', '선택', 54, false, 'checkbox', false, 'center']);

            var items = $index.codeConfig.DataSource;
            var length = items.length;
            for (var i = 0; i < length; i++) {
                var item = items[i];
                item.IsSelect = 0;
            }
        }

        var length = scheme.length;
        for (var i = 0; i < length; i++) {
            var item = scheme[i];
            columns.push([item.ColumnID, item.ColumnText, 100, item.HiddenYN, 'text', true, 'left']);
        }

        var $grid = syn.uicontrols.$grid;
        var settings = $grid.getInitializeColumns({ columns: columns });
        settings.colHeaders.unshift('Flag');
        settings.columns.unshift({
            data: 'Flag',
            type: 'text'
        });
        settings.colWidths.unshift(10);

        $grid.updateSettings($index.gridID, settings);

        if (codeConfig.isAutoSearch == true) {
            if (codeConfig.searchValue == '' && codeConfig.searchText != '') {
                syn.$l.get('ddlSearchType').value = '2';
                syn.$l.get('txtSearch').value = codeConfig.searchText;
            }
            else if (codeConfig.searchValue != '' && codeConfig.searchText == '') {
                syn.$l.get('ddlSearchType').value = '1';
                syn.$l.get('txtSearch').value = codeConfig.searchValue;
            }

            $index.search();

            if (codeConfig.isMultiSelect == false) {
                var count = $grid.countRows($index.gridID);
                if (count == 1) {
                    var item = $grid.getSourceDataAtRow($index.gridID, 0);

                    var result = null;
                    var codeData = item[codeConfig.CodeColumnID];
                    var valueData = item[codeConfig.ValueColumnID];
                    if (codeData && valueData) {
                        result = [{
                            value: codeData,
                            text: valueData
                        }];
                    }
                    else {
                        syn.$l.eventLog('$codehelp.initialize', 'CodeID: {0} 또는 ValueID: {1} 확인 필요'.format(codeConfig.CodeColumnID, codeConfig.ValueColumnID), 'Error');
					}

                    $index.saveReturn(result);
                }
            }
            else {
                var count = $grid.countRows($index.gridID);
                if (0 < count) {
                    if (syn.$l.get('ddlSearchType').value == '1') {
                        var searchItems = codeConfig.searchValue.split(',');
                        for (var i = 0; i < count; i++) {
                            var item = $grid.getSourceDataAtRow($index.gridID, i);
                            var codeData = item[codeConfig.CodeColumnID];
                            if (codeData) {
                                if (searchItems.includes(item[codeConfig.CodeColumnID].toString()) == true) {
                                    $grid.setDataAtCell($index.gridID, i, 'IsSelect', '1');
                                }
                            }
                            else {
                                syn.$l.eventLog('$codehelp.initialize', 'CodeID: {0} 확인 필요'.format(codeConfig.CodeColumnID), 'Error');
                            }
                        }
                    }
                    else {
                        var searchItems = codeConfig.searchText.split(',');
                        for (var i = 0; i < count; i++) {
                            var item = $grid.getSourceDataAtRow($index.gridID, i);
                            var valueData = item[codeConfig.ValueColumnID];
                            if (valueData) {
                                if (searchItems.includes(item[codeConfig.ValueColumnID].toString()) == true) {
                                    $grid.setDataAtCell($index.gridID, i, 'IsSelect', '1');
                                }
                            }
                            else {
                                syn.$l.eventLog('$codehelp.initialize', 'ValueID: {0} 확인 필요'.format(codeConfig.ValueColumnID), 'Error');
                            }
                        }
                    }
                }
            }
        }
    },

    btnSearch_click: function () {
        $index.search();
    },

    txtSearch_keydown: function (keyboardEvent) {
        if (keyboardEvent.keyCode == 13) {
            $index.search();
            keyboardEvent.preventDefault();
        }
    },

    search: function () {
        var $grid = syn.uicontrols.$grid;
        var searchType = syn.uicontrols.$select.getValue('ddlSearchType');
        var search = syn.$l.get('txtSearch').value.trim();

        if (search == '') {
            $grid.loadData($index.gridID, $index.codeConfig.DataSource);
        }
        else {
            var items = $index.codeConfig.DataSource.filter(function (item) {
                return (item[$index.codeConfig.CodeColumnID].toString().indexOf(search) > -1 || item[$index.codeConfig.ValueColumnID].toString().indexOf(search) > -1);
            });

            $grid.loadData($index.gridID, items);
        }

        var settings = $this.$grid.getSettings($index.gridID);
        var hot = $this.$grid.getGridControl($index.gridID);
        var plugin = hot.getPlugin('autoColumnSize');

        if (plugin.isEnabled() == false) {
            plugin.enablePlugin();
        }

        setTimeout(function () {
            plugin.recalculateAllColumnsWidth();
            settings.colWidths = plugin.widths;
            $this.$grid.updateSettings($index.gridID, settings);
        });
    },

    saveReturn: function (result) {
        if (parent) {
            parent.$w.closeDialog(result);
        }
    },

    grdCodeList_afterOnCellDoubleClick: function (event, coords, td) {
        var result = null;

        if (coords.row > -1) {
            var $grid = syn.uicontrols.$grid;
            var codeConfig = $index.codeConfig;

            if (codeConfig.isMultiSelect == false) {
                var physicalRowIndex = $grid.getPhysicalRowIndex($index.gridID, coords.row);
                var item = $grid.getSourceDataAtRow($index.gridID, physicalRowIndex);
                var code = {
                    value: item[$index.codeConfig.CodeColumnID],
                    text: item[$index.codeConfig.ValueColumnID]
                };

                var code = syn.$w.argumentsExtend(item, code);
                delete code['Flag'];
                result = [code];

                $index.saveReturn(result);
            }
            else {
                var physicalRowIndex = $grid.getPhysicalRowIndex($index.gridID, coords.row);
                var item = $grid.getSourceDataAtRow($index.gridID, physicalRowIndex);
                $grid.setDataAtCell($index.gridID, coords.row, 'IsSelect', item.IsSelect == '1' ? '0' : '1');
            }
        }
    },

    btnConfirm_click: function () {
        var result = null;
        var codeConfig = $index.codeConfig;
        var $grid = syn.uicontrols.$grid;

        if (codeConfig.isMultiSelect == false) {
            var previousRow = $grid.getGridValue($index.gridID) == null ? -1 : $grid.getGridValue($index.gridID).previousRow;
            if (previousRow == null || previousRow == undefined) {
                previousRow = -1;
            }

            if (previousRow > -1) {
                var physicalRowIndex = $grid.getPhysicalRowIndex($index.gridID, previousRow);
                var item = $grid.getSourceDataAtRow($index.gridID, physicalRowIndex);
                var code = {
                    value: item[$index.codeConfig.CodeColumnID],
                    text: item[$index.codeConfig.ValueColumnID]
                };

                var code = syn.$w.argumentsExtend(item, code);
                delete code['Flag'];
                result = [code];
            }
        }
        else {
            result = [];
            var length = $grid.countRows($index.gridID);

            for (var rowIndex = 0; rowIndex < length; rowIndex++) {
                var physicalRowIndex = $grid.getPhysicalRowIndex($index.gridID, rowIndex);
                var item = $grid.getSourceDataAtRow($index.gridID, physicalRowIndex);
                if (item.IsSelect == true) {
                    var code = {
                        value: item[$index.codeConfig.CodeColumnID],
                        text: item[$index.codeConfig.ValueColumnID]
                    };

                    var code = syn.$w.argumentsExtend(item, code);
                    delete code['Flag'];
                    delete code['IsSelect'];
                    result.push(code);
                }
            }
        }

        $index.saveReturn(result);
    }
});