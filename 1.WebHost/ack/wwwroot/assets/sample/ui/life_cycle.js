syn.Config.IsViewMappingModel = false;
/*
$layout.menus.push({
	PROGRAMID: 990,
	PROGRAMNAME: 'life_cycle',
	PARENTID: 9,
	PARENTNM: 'EasyWork 시스템',
	VIEWYN: '1',
	FNREAD: '1',
	FNUPDATE: '1',
	FN_PRINT: 'Y',
	FNEXCEL: '1',
	FNPREPRINT: '1',
	FOLDERYN: '0',
	ASSEMBLYNAME: 'UI',
	CLASSNAME: 'life_cycle',
	SORTNUM: 99,
	PROGRAMPATH: '/sample/UI/life_cycle.html'
});
 */
$w.initializeScript({
    callCount: 0,
    // window.onload후 처음 호출되며, 화면을 구성전 사전 작업이 필요할 경우 사용
    pageInit: function () {
        syn.$l.eventLog('lifecycle', 'callCount: {0}, pageInit'.format(++$this.callCount));
    },

    // Qrame 컨트롤이 보여지기 전 호출되며, 컨트롤 옵션을 프로그래밍할 경우 사용
    controlInit: function (elID, options) {
        syn.$l.eventLog('lifecycle', 'callCount: {0}, controlInit - elID: {1}, options: {2}'.format(++$this.callCount, elID, JSON.stringify(options)));
    },

    // Qrame 컨트롤에 대응 모듈이 없을 경우 호출, 일반적으로 사용되지 않음
    controlLoad: function (elID, options) {
        syn.$l.eventLog('lifecycle', 'callCount: {0}, controlLoad - elID: {1}, options: {2}'.format(++$this.callCount, elID, JSON.stringify(options)));
    },

    // 화면 구성 완료후 호출
    pageLoad: function () {
        syn.$l.eventLog('lifecycle', 'callCount: {0}, pageLoad'.format(++$this.callCount));
    },

    // MainFrame에서 화면 탭을 닫을 때 호출, 화면에서 탭을 닫을려면 true, 아니면 false를 통해 제어 가능 (강제 탭 닫기시에는 안 물어봄)
    pageClosed: function () {
        syn.$l.eventLog('lifecycle', 'callCount: {0}, pageClosed'.format(++$this.callCount));
        return true;
    },

    // MainFrame에서 화면 탭 전환이 있을 경우 호출, isVisible이 true이면 보임, false이면 숨김
    pageVisible: function (isVisible) {
        syn.$l.eventLog('lifecycle', 'callCount: {0}, pageVisible - isVisible: {1}'.format(++$this.callCount, isVisible));
    },

    // MainFrame에서 화면 재조정 이벤트가 있을 경우 호출
    pageResizing: function () {
        syn.$l.eventLog('lifecycle', 'callCount: {0}, pageResizing'.format(++$this.callCount));
    },

    // 업무 이벤트
    frameEvent: function (eventName, jsonObject) {
        /*
         eventName 목록
            codeInit - 코드도움 호출전 설정값 확인 호출
            codeReturn - 코드도움에서 코드값이 반환될때 호출
            buttonCommand - frame 명령 호출
            storegeChanging - 화면 데이터 저장소 변경시 호출
            transactionException - 거래시 서버 예외 발생시 호출
            sessionDestroy - 프로그램 세션 만료시 호출
            enterKeyDown - 화면내 엔터키 입력 이벤트 호출 (반환값(bool)에 따라 이벤트 버블링을 결정)
            beforeSubmit - submit 이벤트 호출 (반환값(bool)에 따라 이벤트 버블링을 결정)
            tabOrderControls - 화면 탭 순서 컨트롤 목록
         */
        syn.$l.eventLog('ui_event', 'frameEvent - eventName: {0}, jsonObject: {1}'.format(eventName, JSON.stringify(jsonObject)));
    }
});