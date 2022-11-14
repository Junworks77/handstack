## Qrame 컨트롤
업무 화면에 필요한 컨트롤 기능으로 자체 개발 또는 오픈 소스 및 상용 소스를 고도화해서 사용
자세한 내용은 [#1735](http://redmine.handstack.kr/redmine/issues/1735) 일감 참조

* 오픈 소스 및 상용 소스를 참조할 경우 syn.scripts.js에 포함
* 화면 컨트롤은 syn.controls.js에 포함되며, syn.scripts.js가 먼저 선언
* Qrame에서 제공하는 컨트롤은 도메인 업무에 따라 추가, 삭제, 변경됨
* 컨트롤의 제공되는 기능은 업무 및 요건에 따라 다르나, 다음의 사항을 준수 필요

### 속성
name: 'syn.uicontrols.$control', - 컨트롤 네임스페이스
version: '1.0', -- 컨트롤 버전
defaultSetting: {
	toQafControl: false, - INPUT, SELECT, TEXTAREA등 Plain HTML 요소를 커스텀 UI로 대체 여부
	dataType: 'string', - string, int, bool, (date 예정)으로 서버 거래에 필요한 데이터 타입
	belongID: null, - 서버 거래 대상 Function ID
	transactConfig: null, - 동적 서버 거래 설정
	triggerConfig: null - 이벤트 핸들러 처리 설정
}

### 이벤트
controlLoad: function (elID, setting) - 화면에서 컨트롤의 로드 업무를 처리
* elID - Element ID
* setting - syn-options에 설정된 JSON 환경설정

### 메서드
getValue: function (elID, meta) {}, - 컨트롤의 값을 조회
setValue: function (elID, value, meta) {}, - 컨트롤의 값을 설정
clear: function (elID, isControlLoad) {} - 컨트롤의 값을 초기화