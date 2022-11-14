syn.Config.IsViewMappingModel = false;

$w.initializeScript({
	childrenChannel: null,

	pageLoad: function () {
		var channelID = 'channelID';
		if (window != window.parent && channelID) {
			$this.childrenChannel = syn.$channel.connect({ window: window.parent, origin: '*', scope: channelID });
			$this.childrenChannel.bind('request', function (evt, params) {
				console.log(params);
			});
		}
	},

	btnChildren2Parent_click: function () {
		if ($this.childrenChannel != null) {
			$this.childrenChannel.notify({
				method: 'response',
				params: ['response data'],
				error: function (error, message) {
					console.log('response ERROR: ' + error + ' (' + message + ')');
				},
				success: function (val) {
					console.log('response function returns: ' + val);
				}
			});
		}
	}
});