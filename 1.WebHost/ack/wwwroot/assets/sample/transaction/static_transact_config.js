$w.initializeScript({
	btnRetrieve_click: function () {
		$w.transaction('R01', function (responseObject, addtional) {
			$l.eventLog('btnRetrieve_click', JSON.stringify(responseObject));
		});
	}
});
