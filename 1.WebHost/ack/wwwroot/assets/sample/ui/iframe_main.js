syn.Config.IsViewMappingModel = false;

$w.initializeScript({
	childrenChannel: null,

	pageLoad: function () {

	},

	btnChildrenConnect_click: function () {
		var channelID = 'channelID';
		var iframeChannel = syn.$w.iframeChannels.find(function (item) { return item.id == channelID });
		if (iframeChannel == undefined) {
			var iframe = syn.$l.get('childIFrame');
			var contentWindow = iframe.contentWindow;
			var frameMessage = {
				id: channelID,
				channel: syn.$channel.connect({
					debugOutput: true,
					window: contentWindow,
					origin: '*',
					scope: channelID
				})
			};

			frameMessage.channel.bind('response', function (evt, val) {
				debugger;
			});

			$w.iframeChannels.push(frameMessage);
		}
	},

	btnChildrenLoad_click: function () {
		var iframe = syn.$l.get('childIFrame');
		iframe.src = 'iframe_child.html';
	},

	btnParent2Children_click: function () {
		var channelID = 'channelID';
		var length = syn.$w.iframeChannels.length;
		for (var i = 0; i < length; i++) {
			var frameMessage = syn.$w.iframeChannels[i];

			if (channelID == frameMessage.id) {
				frameMessage.channel.call({
					method: 'request',
					params: ['request data'],
					error: function (error, message) {
						debugger;
						console.log('request ERROR: ' + error + ' (' + message + ')');
					},
					success: function (val) {
						debugger;
						console.log('request function returns: ' + val);
					}
				});
			}
		}
	}
});