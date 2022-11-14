syn.Config.IsViewMappingModel = false;

$w.initializeScript({
	metaColumns: {
		"Flag": {
			"FieldID": "Flag",
			"DataType": "string"
		},
		"PersonID": {
			"FieldID": "PersonID",
			"DataType": "int"
		},
		"UserName": {
			"FieldID": "UserName",
			"DataType": "string"
		},
		"MaritalStatus": {
			"FieldID": "MaritalStatus",
			"DataType": "bool"
		},
		"ReligionYN": {
			"FieldID": "ReligionYN",
			"DataType": "bool"
		},
		"GenderType": {
			"FieldID": "GenderType",
			"DataType": "string"
		},
		"GenderTypeName": {
			"FieldID": "GenderType",
			"DataType": "string"
		},
		"CreateDateTime": {
			"FieldID": "CreateDateTime",
			"DataType": "string"
		}
	},

	grid_setValue: null,
	pageLoad: function () {
		$this.grid_setValue = $this.$grid.setValue;
		$this.$grid.setValue = function (elID, value, metaColumns) {
			$this.grid_setValue(elID, value, metaColumns);
		};
	},

	dataSource: [
		{ Flag: 'R', PersonID: '1235571', UserName: 'hello world: <a href="http://www.naver.com" target="_blank">Ted Right</a> <img src="https://raw.githubusercontent.com/dotnet/machinelearning-samples/master/images/app-type-e2e-black.png" style="vertical-align:middle;height: 22px;"/>', MaritalStatus: 0, ReligionYN: 1, GenderType: '1', GenderTypeName: '남성', CreateDateTime: '2020-02-01' },
		{ Flag: 'R', PersonID: '1235572', UserName: '<a href="http://www.naver.com" target="_blank">Frank Honest</a>', MaritalStatus: 0, ReligionYN: 0, GenderType: '1', GenderTypeName: '남성', CreateDateTime: '2020-03-01' },
		{ Flag: 'R', PersonID: '1235573', UserName: '<a href="http://www.naver.com" target="_blank">Joan Well</a>', MaritalStatus: 1, ReligionYN: 0, GenderType: '2', GenderTypeName: '여성', CreateDateTime: '2020-02-11' },
		{ Flag: 'R', PersonID: '1235574', UserName: '<a href="http://www.naver.com" target="_blank">Gail Polite</a>', MaritalStatus: 1, ReligionYN: 0, GenderType: '2', GenderTypeName: '여성', CreateDateTime: '2020-02-21' },
		{ Flag: 'R', PersonID: '1235575', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '235576', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '235577', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '235578', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '235579', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '2355710', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '3355711', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '3355712', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '3355713', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '3355714', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '3355715', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '3355716', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '2355717', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '2355718', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' },
		{ Flag: 'R', PersonID: '2355719', UserName: '<a href="http://www.naver.com" target="_blank">Michael Fair</a>', MaritalStatus: 0, ReligionYN: 1, GenderType: '3', GenderTypeName: '중성', CreateDateTime: '2020-04-01' }
	],

	btnPseudoStyle_click: function () {
		var gridPseudo = '.handsontable tbody tr td:nth-of-type({0}) {' +
			'            background-color: #f0f0f0;' +
			'            text-decoration: underline;' +
			'            color: black;' +
			'            font-weight: 900;' +
			'            cursor: pointer;' +
			'        }';

		var head = document.head || document.getElementsByTagName('head')[0];
		var sheet = document.getElementById('cssWeekendPseudoStyle');
		sheet.innerHTML = '';

		var styles = [];
		for (var i = 0; i < 10; i++) {
			styles.push(gridPseudo.format(i.toString()));
        }

		sheet.innerHTML = styles.join('\n\n');
		head.appendChild(sheet);
	},

	grdGrid_afterSelectionEnd: function (row, column, row2, column2, selectionLayerLevel) {
	},

	grdGrid_beforeKeyDown: function () {
	},

	grdGrid_afterCreateRow: function () {
		// $this.$grid.setDataAtCell('grdGrid', arguments[0], "MaritalStatus", true);
	},

	btnGetValueRow_click: function () {
		$l.eventLog('btnGetValue_click Row', JSON.stringify($this.$grid.getValue('grdGrid', 'Row', $this.metaColumns)));
	},

	btnGetValueList_click: function () {
		$l.eventLog('btnGetValue_click List', JSON.stringify($this.$grid.getValue('grdGrid', 'List', $this.metaColumns)));
	},

	btnSetValue_click: function () {
		$this.$grid.setValue('grdGrid', $ref.clone($this.dataSource), $this.metaColumns);
	},

	btnClear_click: function () {
		$this.$grid.clear('grdGrid');
	},

	btnGetInitializeColumns_click: function () {
		var columns = [
			['PersonID', '사용자ID', 200, false, 'numeric', false, 'left'],
			['UserName', '사용자', 200, false, 'text', false, 'left'],
			['GenderType', '성별ID', 200, false, 'text', false, 'left'],
			['GenderTypeName', '성별', 200, false, 'text', false, 'left']
		];

		var settings = $this.$grid.getInitializeColumns({ columns: columns });
		$l.eventLog('btnGetInitializeColumns_click Row', JSON.stringify(settings));
	},

	btnGetSettings_click: function () {
		var settings = $this.$grid.getSettings('grdGrid');

		if (settings.data && settings.data.length > 0) {
			var length = settings.data.length;
			for (var i = 0; i < length; i++) {
				settings.data[i].MaritalStatus = false;
			}

			var hot = $this.$grid.getGridControl('grdGrid');
			hot.render();

			// $this.$grid.updateSettings('grdGrid', settings);
		}
	},

	btnUpdateSettings_click: function () {
		var settings = $this.$grid.getSettings('grdGrid');
		settings.cells = function (row, col, prop) {
			if (prop == 'ReligionYN') {
				var cellProperties = {};
				cellProperties.readOnly = true;
				return cellProperties;
			}
			else if (settings.keyLockedColumns.length > 0) {
				var cellProperties = {};
				var hot = this.instance;
				var rowData = hot.getSourceDataAtRow(row);

				if (rowData) {
					if (rowData.Flag && rowData.Flag != 'C' && settings.keyLockedColumns.indexOf(prop) > -1) {
						cellProperties.readOnly = true;
					}
				}

				return cellProperties;
			}
		};

		$this.$grid.updateSettings('grdGrid', settings);
	},

	btnUpdateSettings1_click: function () {
		var settings = $this.$grid.getSettings('grdGrid');
		settings.cells = function (row, col, prop) {
			if (settings.keyLockedColumns.length > 0) {
				var cellProperties = {};
				var hot = this.instance;
				var rowData = hot.getSourceDataAtRow(row);

				if (rowData) {
					if (rowData.Flag && rowData.Flag != 'C' && settings.keyLockedColumns.indexOf(prop) > -1) {
						cellProperties.readOnly = true;
					}
				}

				return cellProperties;
			}
		};

		$this.$grid.updateSettings('grdGrid', settings);
	},

	btnUpdateSettings2_click: function () {
		var settings = $this.$grid.getSettings('grdGrid');
		settings.nestedHeaders = [
			['A', { label: 'B', colspan: 8 }, 'C'],
			['블라', '블라', '블라', 'Q', 'R', 'S', 'T', 'U', 'V', 'W']
		];

		var hot = $this.$grid.getGridControl('grdGrid');
		var plugin = hot.getPlugin('autoColumnSize');

		if (plugin.isEnabled() == false) {
			plugin.enablePlugin();
		}

		setTimeout(function () {
			plugin.recalculateAllColumnsWidth();
			settings.colWidths = plugin.widths;
			$this.$grid.updateSettings('grdGrid', settings);
		}, 100);
	},


	btnLoadData_click: function () {
		$this.$grid.loadData('grdGrid', $ref.clone($this.dataSource));
	},

	btnCountRows_click: function () {
		$l.eventLog('btnCountRows_click', JSON.stringify($this.$grid.countRows('grdGrid', true)));
	},

	rowCount: 0,
	btnInsertRow_click: function () {
		$this.$grid.insertRow('grdGrid', {
			amount: 1
		}, function (row) {
			$this.$grid.setDataAtCell('grdGrid', row, 2, $this.rowCount++);
			$this.$grid.selectCell('grdGrid', row, 2);
		});
	},

	btnRemoveRow_click: function () {
		$this.$grid.removeRow('grdGrid');
	},

	btnIsUpdateData_click: function () {
		$l.eventLog('btnIsUpdateData_click', JSON.stringify($this.$grid.isUpdateData('grdGrid')));
	},

	btnGetFlag_click: function () {
		$l.eventLog('btnGetFlag_click', JSON.stringify($this.$grid.getFlag('grdGrid', 0)));
	},

	btnSetFlag_click: function () {
		$this.$grid.setFlag('grdGrid', 0, 'U');
		$l.eventLog('btnGetFlag_click', JSON.stringify($this.$grid.getFlag('grdGrid', 0)));
	},

	btnGetDataAtCell_click: function () {
		$l.eventLog('btnGetDataAtCell_click', JSON.stringify($this.$grid.getDataAtCell('grdGrid', 0, 2)));
	},

	btnSetDataAtCell_click: function () {
		$this.$grid.setDataAtCell('grdGrid', 0, 2, 'HELLO WORLD');
		$l.eventLog('btnGetFlag_click', JSON.stringify($this.$grid.getDataAtCell('grdGrid', 0, 2)));
	},

	btnGetCellMeta_click: function () {
		$l.eventLog('btnGetCellMeta_click', JSON.stringify($this.$grid.getCellMeta('grdGrid', 0, 2)));
	},

	btnSetCellMeta_click: function () {
		$this.$grid.setCellMeta('grdGrid', 0, 2, 'key', 'value');
	},

	btnGetUpdateData_click: function () {
		$l.eventLog('btnGetUpdateData_click Row', JSON.stringify($this.$grid.getUpdateData('grdGrid', 'Row', $this.metaColumns)));
		$l.eventLog('btnGetUpdateData_click List', JSON.stringify($this.$grid.getUpdateData('grdGrid', 'List', $this.metaColumns)));
	},

	btnGetPhysicalRowIndex_click: function () {
		$l.eventLog('btnGetPhysicalRowIndex_click', JSON.stringify($this.$grid.getPhysicalRowIndex('grdGrid', 0)));
	},

	btnGetPhysicalColIndex_click: function () {
		$l.eventLog('btnGetPhysicalColIndex_click', JSON.stringify($this.$grid.getPhysicalColIndex('grdGrid', 2)));
	},

	btnGetSourceDataAtRow_click: function () {
		$l.eventLog('btnGetSourceDataAtRow_click', JSON.stringify($this.$grid.getSourceDataAtRow('grdGrid', 0)));
	},

	btnVisibleColumns_click: function () {
		$this.$grid.visibleColumns('grdGrid', [7], false);

		// setTimeout(function () {
		//     alert('click to show !!!');
		// 
		//     $this.$grid.visibleColumns('grdGrid', [1, 2], true);
		// }, 25);
	},

	btnVisibleRows_click: function () {
		$this.$grid.visibleRows('grdGrid', [1, 2], false);

		// setTimeout(function () {
		//     alert('click to show !!!');
		// 
		//     $this.$grid.visibleRows('grdGrid', [1, 2], true);
		// }, 25);
	},

	btnUnHiddenRows_click: function () {
		$this.$grid.unHiddenRows('grdGrid');
	},

	btnUnHiddenColumns_click: function () {
		$this.$grid.unHiddenColumns('grdGrid');
	},

	btnPropToCol_click: function () {
		$l.eventLog('btnPropToCol_click', JSON.stringify($this.$grid.propToCol('grdGrid', 'GenderType')));
	},

	btnColToProp_click: function () {
		$l.eventLog('btnColToProp_click', JSON.stringify($this.$grid.colToProp('grdGrid', 2)));
	},

	btnGetColHeader_click: function () {
		$l.eventLog('btnGetColHeader_click', JSON.stringify($this.$grid.getColHeader('grdGrid', 2)));
	},

	btnCountCols_click: function () {
		$l.eventLog('btnCountCols_click', JSON.stringify($this.$grid.countCols('grdGrid')));
	},

	btnGetSelected_click: function () {
		$l.eventLog('btnGetSelected_click', JSON.stringify($this.$grid.getSelected('grdGrid')));
	},

	btnGetActiveRowIndex_click: function () {
		$l.eventLog('btnGetActiveRowIndex_click', JSON.stringify($this.$grid.getActiveRowIndex('grdGrid')));
	},

	btnGetActiveColIndex_click: function () {
		$l.eventLog('btnGetActiveColIndex_click', JSON.stringify($this.$grid.getActiveColIndex('grdGrid')));
	},

	btnSelectCell_click: function () {
		$this.$grid.selectCell('grdGrid', 0, 2)
	},

	btnExportFile_click: function () {
		$this.$grid.exportFile('grdGrid', { filename: 'grid' });
	},

	btnExportAsString_click: function () {
		var value = $this.$grid.exportAsString('grdGrid');
		$l.eventLog('btnExportAsString_click', value);
	},

	btnImportFile_click: function () {
		$this.$grid.importFile('grdGrid');
	},

	btnGetGridControl_click: function () {
		var hot = $this.$grid.getGridControl('grdGrid');
	},

	btnGetGridSetting_click: function () {
		var gridSettings = $this.$grid.getGridSetting('grdGrid');
	},

	btnGetColumnWidths_click: function () {
		$l.eventLog('btnGetColumnWidths_click', JSON.stringify($this.$grid.getColumnWidths('grdGrid')));
	},

	btnScrollViewportTo_click: function () {
		$this.$grid.scrollViewportTo('grdGrid', 0, 2);
	},

	btnIsEmptyRow_click: function () {
		$l.eventLog('btnIsEmptyRow_click', JSON.stringify($this.$grid.isEmptyRow('grdGrid', 0)));
	},

	btnIsEmptyCol_click: function () {
		$l.eventLog('btnIsEmptyCol_click', JSON.stringify($this.$grid.isEmptyCol('grdGrid', 2)));
	},

	btnGetDataAtRow_click: function () {
		$l.eventLog('btnGetDataAtRow_click', JSON.stringify($this.$grid.getDataAtRow('grdGrid', 0)));
	},

	btnGetDataAtCol_click: function () {
		$l.eventLog('btnGetDataAtCol_click', JSON.stringify($this.$grid.getDataAtCol('grdGrid', 2)));
	},

	btnGetSourceDataAtCol_click: function () {
		$l.eventLog('btnGetSourceDataAtCol_click', JSON.stringify($this.$grid.getSourceDataAtCol('grdGrid', 2)));
	},

	btnSetDataAtRow_click: function () {
		$this.$grid.setDataAtRow('grdGrid', [[0, 0, 'U'], [0, 1, '7'], [0, 2, 'HELLO WORLD'], [0, 3, '2'], [0, 4, '여성']]);
	},

	btnValidateColumns_click: function () {
		$l.eventLog('btnValidateColumns_click', JSON.stringify($this.$grid.validateColumns('grdGrid', [0, 1, 2])));
	},

	btnValidateRows_click: function () {
		$l.eventLog('btnValidateRows_click', JSON.stringify($this.$grid.validateRows('grdGrid', [0, 1, 2])));
	},

	btnGetLogicalRowIndex_click: function () {
		$l.eventLog('btnGetFlag_click', JSON.stringify($this.$grid.getLogicalRowIndex('grdGrid', 0)));
	},

	btnGetLogicalColIndex_click: function () {
		$l.eventLog('btnGetLogicalColIndex_click', JSON.stringify($this.$grid.getLogicalColIndex('grdGrid', 2)));
	},

	btnGetFirstShowColIndex_click: function () {
		$l.eventLog('btnGetFirstShowColIndex_click', JSON.stringify($this.$grid.getFirstShowColIndex('grdGrid')));
	},

	btnGetLastShowColIndex_click: function () {
		$l.eventLog('btnGetLastShowColIndex_click', JSON.stringify($this.$grid.getLastShowColIndex('grdGrid')));
	},

	btnAddCondition_click: function () {
		$this.$grid.addCondition('grdGrid', 'GenderType', 'by_value', '1');
		$this.$grid.addCondition('grdGrid', 'CreateDateTime', 'lt', '2020-03-01');
	},

	btnRemoveCondition_click: function () {
		$this.$grid.removeCondition('grdGrid', 'GenderType');
	},

	btnClearConditions_click: function () {
		$this.$grid.clearConditions('grdGrid');
	},

	grdGrid_cellButtonClick: function (elID, row, column, prop, value) {
		$l.eventLog('grdGrid_cellButtonClick', '{0}, {1}, {2}, {3}, {4}'.format(elID, row, column, prop, value));
	},

	grdGrid_cellRadioClick: function (elID, row, column, prop, value) {
		$l.eventLog('grdGrid_cellRadioClick', '{0}, {1}, {2}, {3}, {4}'.format(elID, row, column, prop, value));
	},

	btnMerge_click: function () {
		$this.$grid.merge('grdGrid', 1, 1, 3, 1);

		$this.$grid.scrollViewportTo('grdGrid', 1, 1);
		setTimeout(function () {
			$this.$grid.scrollViewportTo('grdGrid', 0, 1);
		}, 25);
	},

	btnUnMerge_click: function () {
		var rowCount = $this.$grid.countRows('grdGrid');
		$this.$grid.unmerge('grdGrid', 1, 1, rowCount, 1);
	},

	isAlert: true,
	btnIsCellClassName_click: function () {
		alert($this.$grid.isCellClassName('grdGrid', 0, 3, 'my-class'));
	},

	btnSetCellClassName_click: function () {
		$this.$grid.setCellClassName('grdGrid', -1, -1, 'my-class', $this.isAlert);
		$this.isAlert = !$this.isAlert;
	},

	grdGrid_applyCells: function (elID, row, column, prop) {
		
	},

	grdGrid_customSummary: function (elID, columnID, col, columnData) {
		return '합계: 12345';
	},

	grdGrid_selectAllCheck: function (elID, col, checked) {
		var hot = $this.$grid.getGridControl(elID);
		var gridSettings = $this.$grid.getSettings(elID);

		if (gridSettings.data && gridSettings.data.length > 0) {
			var visiblePersonIDs = $this.$grid.getDataAtCol(elID, 'PersonID');
			var data = gridSettings.data;
			var filterdData = data.filter(function (item) {
				var result = false;
				if (visiblePersonIDs.indexOf(item.PersonID) > -1) {
					result = true;
				}

				return result;
			});

			var length = filterdData.length;
			var colProp = hot.colToProp(col);
			for (var i = 0; i < length; i++) {
				var flag = filterdData[i]['Flag'];
				if (flag == 'R') {
					filterdData[i]['Flag'] = 'U';
				}

				if (flag != 'S') {
					filterdData[i][colProp] = checked == true ? '1' : '0';
				}
			}
		}
	},

	btnRefreshSummary_click: function () {
		$this.$grid.refreshSummary('grdGrid');
	}
});