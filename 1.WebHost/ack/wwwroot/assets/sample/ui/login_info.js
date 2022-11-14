syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    pageLoad: function () {
        syn.$l.eventLog('pageLoad', JSON.stringify(syn.Config));
        syn.$l.eventLog('sso', JSON.stringify(syn.$w.SSO));
        syn.$l.eventLog('appInfo', JSON.stringify(syn.$w.AppInfo));
    },
    
    btnLoginID_click: function () {
        // /syn.config.json 의 값을 사용자 로그인시 업데이트 처리
        syn.$l.eventLog('control_event', syn.$w.SSO.UserID);
    }
});