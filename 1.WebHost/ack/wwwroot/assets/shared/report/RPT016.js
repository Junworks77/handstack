syn.Config.IsViewMappingModel = false;

$w.initializeFormScript({
	pageLoad: function () {
		$l.get('lblDOCUMENT_NO').textContent = 'HELLO WORLD';
	}
});