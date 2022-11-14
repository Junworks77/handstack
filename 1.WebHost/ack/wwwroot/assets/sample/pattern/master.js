$w.initializeScript({
	frameEvent: function (eventName, jsonObject) {
		if (eventName == 'buttonCommand') {
			switch (jsonObject.actionID) {
				case 'search':
					break;
				case 'save':
					break;
				case 'delete':
					break;
				case 'print':
					break;
				case 'export':
					break;
				case 'refresh':
					break;
			}
		}
	},

	beforeTransaction: function (transactConfig) {
	},

	afterTransaction: function (error, functionID) {
	},

	beforeTrigger: function (elID, action, params) {
	},

	afterTrigger: function (error, action, response) {
	},

	pageLoad: function () {
	},

	//btnAddRow_click: function () {
	//	$AA010.$grid.insertRow('grdGrid', {
	//		fields: {
	//		}
	//	}, function (row) {
	//		var col = $AA010.$grid.propToCol('grdGrid', 'ApplicationID');
	//		$AA010.$grid.selectCell('grdGrid', row, col);
	//
	//		setTimeout(function () {
	//			var hot = $AA010.$grid.getGridControl('grdGrid');
	//			var cell = hot.getCell(row, 2);
	//			cell.style.background = "#ff4c42";
	//		}, 25);
	//	});
	//},

	//btnRemoveRow_click: function () {
	//	$AA010.$grid.removeRow('grdGrid', function (row) {
	//		if (row > 0) {
	//			$AA010.$grid.selectCell('grdGrid', (row - 1), $AA010.$grid.propToCol('grdGrid', 'ApplicationID'));
	//		}
	//	});
	//},

	txtApplicationName_click: function () {
		var triggerOptions = syn.$w.getTriggerOptions('txtApplicationName');
		$l.get('txtApplicationName').value = 'click !!! ' + (triggerOptions.callText ? triggerOptions.callText : '');
	},

	btnGridRetrieve_click: function () {
		$AA010.$grid.clear('grdGrid');
		// syn.$w.transaction('R01', {
		// 	form: ['CodeMaster', 'defailMaster'],
		// 	grid: ['CodeDetail']
		// }, function (error, responseData) {
		// });
	
		var transactConfig = {
			functionID: 'R01',
			inputs: [{ type: 'Row' }],
			outputs: [{ type: 'Grid', dataFieldID: 'CodeDetail' }]
		};
	
		$w.transactionAction(transactConfig);
	},

	btnGridSave_click: function () {
		$w.transaction('M01', function (error, responseData) {
			if (error) {

			}
			else {
				document.getElementById('btnGridRetrieve').click();
			}
		});
	}
});