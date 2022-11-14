## syn-datafield

* 거래 요청 및 응답이 필요한 사용자 입력에 대응하는 UI 컨트롤에 선언
* syn-datafield 속성 선언시 id 속성 필수이며 헝그리안 표기법을 권장
* syn-datafield 속성은 거래에 요청/응답에 대응하는 ID를 선언하며 대응할 필요가 없을 경우 생략 가능
```html
 <!-- html -->
 <input type="text" id="txtApplicationID" syn-datafield="ApplicationID" />
 <input type="text" id="txtApplicationName" syn-datafield="ApplicationName" />
 <select id="ddlApplicationType" syn-datafield="ApplicationType"></select>
 <input type="text" id="txtRemark" syn-datafield />
```
* 다음의 HTML 및 커스텀 태그에 선언 가능
	* BUTTON
	* INPUT [type]
		* hidden
		* text
		* password
		* color
		* email
		* number
		* search
		* tel
		* url
		* submit
		* reset
		* button
		* radio
		* checkbox
	* TEXTAREA
	* SELECT (multiple)
	* SYN_GRID
	* SYN_CHART (예정)
	* SYN_CODEPICKER
	* SYN_COLORPICKER
	* SYN_DATEPICKER
	* SYN_EDITOR

* 다음의 HTML 및 커스텀 태그에 헝그리안 표기법 권장
	* btn - BUTTON
	* txt - INPUT [type]
		* hidden
		* text
		* password
		* color
		* email
		* number
		* search
		* tel
		* url
	* btn - INPUT [type]
		* submit
		* reset
		* button
	* rdo - INPUT [type]
		* radio
	* chk - INPUT [type]
		* checkbox
	* txt - TEXTAREA
	* ddl - SELECT (multiple)
	* grd - SYN_GRID
	* cht - SYN_CHART (예정)
	* chp - SYN_CODEPICKER
	* clp - SYN_COLORPICKER
	* dtp - SYN_DATEPICKER
	* txt - SYN_EDITOR

## syn-events
* syn-datafield 속성이 선언되어 있는 UI 컨트롤에 문자열 배열로 HTML 이벤트 및 컨트롤 이벤트 핸들러 선언 가능
* javascript에서 [컨트롤ID]_[이벤트명] 으로 핸들러를 처리
* [HTML 이벤트 목록](https://www.w3schools.com/tags/ref_eventattributes.asp)

```html
 <!-- html -->
 <select id="ddlSelecteAppID" syn-events="['click', 'change']"></select>
 <button type="button" id="btnAddRow" syn-events="['click']">행추가</button>
```

```js
// javascript
{
     ddlSelecteAppID_click: function() { },
     ddlSelecteAppID_change: function() { },
     btnAddRow_click: function() { }
}
```

## syn-options
* 사용자 입력에 대응하는 UI 컨트롤의 모양과 기능을 제어하는 옵션
* 컨트롤에 따라 지원하는 옵션 항목이 다르며 대소문자를 구분
* JSON 문법을 사용하며, 문법 오류시 실행시 오류 발생

```html
 <!-- html -->
<input id="chkUseYN" type="checkbox" syn-datafield="UseYN" value="test" checked="checked" syn-options="{textContent: '사용여부', toQafControl: true}">
<input id="rdoUseYN1" name="rdoUseYN" type="radio" syn-datafield="RadioUseYN" syn-options="{textContent: '사용'}">
<input id="rdoUseYN2" name="rdoUseYN" type="radio" syn-datafield="RadioUseYN" checked="checked" syn-options="{textContent: '미사용', toQafControl: true}">
```

### 기본 옵션
```js
// javascript
defaultSetting: {
    dataType: 'string', // 거래에 전달되는 데이터 타입 (string, int, bool, date)
    belongID: null, // 거래 요청/응답에 대응하는 FunctionID
    transactConfig: null, // 거래 요청/응답에 대응하는 환경설정 (자세한 내용은 거래 샘플 참조)
    triggerConfig: null // 화면 단위 기능 이벤트에 대응하는 환경설정 (자세한 내용은 화면 샘플 참조)
}
```