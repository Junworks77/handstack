$w.initializeScript({
	pageInit: function () {
		//var uiOption = syn.ContextData.UIOption;
		//$l.get('txtApplicationID').value = uiOption.ApplicationID;
		//$l.get('txtProjectID').value = uiOption.ProjectID;
		//$l.get('txtProjectDirectoryID').value = uiOption.ParentMenuID;
		//$l.get('txtProjectItemID').value = uiOption.MenuID;
	},

	pageLoad: function () {

	},

	frameEvent: function (eventName, jsonObject) {
	},

	beforeTrigger: function (triggerID, action, params) {
	},

	afterTrigger: function (error, action, response) {
	},

	beforeTransaction: function (transactConfig) {
	},

	afterTransaction: function (error, functionID, responseData, addtionalData) {
	},

	btnRetrieve_click: function () {
		$w.transaction('R01', function (responseObject) {
		});
	},

	grdGrid_afterSelectionEnd: function (row, column, row2, column2, selectionLayerLevel) {
	},

	grdGrid_afterChange: function (changes) {
		var elID = 'grdGrid';
		if (changes && changes.length > 0) {
			var change = changes[0];
			var columnID = change[1];
			var oldValue = change[2];
			var newValue = change[3];
			oldValue = oldValue == undefined ? '' : oldValue;
			if (columnID == 'ServiceID' && oldValue != newValue) {
				var row = $this.$grid.getActiveRowIndex(elID);
				var codeValue = [
					[row, 4, 1],
					[row, 5, 2],
					[row, 6, 3]
				];

				$this.$grid.setDataAtRow(elID, codeValue);
			}
		}
	}
})
