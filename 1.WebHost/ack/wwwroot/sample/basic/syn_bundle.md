## syn.bundle

* 화면 개발에 필요한 다양한 소스를 하나의 파일로 합치고, 소스 코드를 난독화 및 공백을 제거하여 만든 파일
* 번들링 대상은 javascript, css 2개로 만들어지며 다음과 같이 사용

```html
 <!-- html -->
<head>
	<meta charset="utf-8">
	<title>QCN Application Framework Controls</title>
	<link rel="stylesheet" type="text/css" href="syn.bundle.css">
</head>
```

```html
 <!-- html -->
	</form>
	<script src="syn.bundle.js" type="text/javascript"></script>
	<script src="ui_script.js" type="text/javascript"></script>
</body>
</html>
```

### syn.bundle.css 스타일시트 원본 경로
	'Scripts/ExternalLibrary/lib/syn-css-1.0/font-awesome.css',
	'Scripts/ExternalLibrary/lib/syn-css-1.0/common.css',
	'Scripts/ExternalLibrary/lib/syn-css-1.0/navigation.css',
	'Scripts/ExternalLibrary/lib/syn-css-1.0/layout-enote.css',
	'Scripts/ExternalLibrary/lib/syn-css-1.0/code_highlighter.css',
	
	'Scripts/ExternalLibrary/highcharts.css',
	'Scripts/ExternalLibrary/handsontable.full.css',
	
	'Contents/StyleSheets/Layouts/Dialogs.css',
	'Contents/StyleSheets/Layouts/LoadingPage.css',
	'Contents/StyleSheets/Layouts/ProgressBar.css',
	'Contents/StyleSheets/Layouts/Tooltips.css',
	'Contents/StyleSheets/Layouts/WindowManager.css',
	'Contents/StyleSheets/UIControls/Control.css',
	
	'Scripts/ExternalLibrary/lib/tingle-0.15.2/tingle.css',
	'Scripts/ExternalLibrary/lib/tail.select-0.5.15/css/default/tail.select-light.css',
	'Scripts/ExternalLibrary/lib/pikaday-1.8.0/pikaday.css',
	'Scripts/ExternalLibrary/lib/ispin-2.0.1/ispin.css',
	'Scripts/ExternalLibrary/lib/flatpickr-4.6.3/flatpickr.css',
	'Scripts/ExternalLibrary/lib/filedrop-1.0.0/filedrop.css',
	'Scripts/ExternalLibrary/lib/css-checkbox-1.0.0/checkboxes.css',
	'Scripts/ExternalLibrary/lib/color-picker-1.0.0/color-picker.css',
	
	'Scripts/UIControls/Chart/Chart.css',
	'Scripts/UIControls/CheckBox/CheckBox.css',
	'Scripts/UIControls/ColorPicker/ColorPicker.css',
	'Scripts/UIControls/DatePicker/DatePicker.css',
	'Scripts/UIControls/DropDownCheckList/DropDownCheckList.css',
	'Scripts/UIControls/DropDownList/DropDownList.css',
	'Scripts/UIControls/RadioButton/RadioButton.css',
	'Scripts/UIControls/TextArea/TextArea.css',
	'Scripts/UIControls/TextBox/TextBox.css',
	'Scripts/UIControls/TextButton/TextButton.css',
	'Scripts/UIControls/TextEditor/TextEditor.css',
	'Scripts/UIControls/WebGrid/WebGrid.css'

### syn.bundle.js 자바스크립트 선언 순서

syn.bundle.js 파일은 다음과 같이 4개의 그룹으로 구성
- syn.scripts.js
- syn.js
- syn.domain.js
- syn.controls.js

|js명|설명|
|---|---|
|syn.scripts.js|프로젝트내 화면 개발에 필요한 모든 상용/무료 소스들을 포함|
|syn.js|Qrame.Javascript 소스|
|syn.domain.js|도메인 업무에 필요한 공통 기능 및 라이브러리 소스|
|syn.controls.js|화면 개발에 필요한 컨트롤 소스들을 포함|

개발 버전에서는 디버깅의 편의에 따라 다음과 같이 사용
```html
 <!-- html -->
<script src="/Scripts/syn.scripts.js" type="text/javascript"></script>
<script src="/Scripts/syn.js" type="text/javascript"></script>
<script src="/Scripts/syn.domain.js" type="text/javascript"></script>
<script src="/Scripts/syn.controls.js" type="text/javascript"></script>
```
운영 버전에서는 4개의 파일이 합쳐진 번들링 파일 사용
```html
 <!-- html -->
<script src="/Scripts/syn.bundle.js" type="text/javascript"></script>
```

각 그룹에 대한 원본 소스는 다음과 같다

### syn.scripts.js 자바스크립트 원본 경로
	'Scripts/ExternalLibrary/jquery-3.3.1.js',
	'Scripts/ExternalLibrary/jquery.alertmodal.js',
	'Scripts/ExternalLibrary/jquery.simplemodal.js',
	'Scripts/ExternalLibrary/jquery.maskedinput-1.3.js',
	'Scripts/ExternalLibrary/jquery.WM.js',
	'Scripts/ExternalLibrary/JSLINQ.js',
	'Scripts/ExternalLibrary/numbro.js',
	'Scripts/ExternalLibrary/handsontable.full.js',
	'Scripts/ExternalLibrary/highcharts.js',
	'Scripts/ExternalLibrary/multiselect.js',
	'Scripts/ExternalLibrary/datepicker.js',
	'Scripts/ExternalLibrary/Notifier.js',
	'scripts/externallibrary/lib/clipboard-2.0.4/clipboard.js',
	'scripts/externallibrary/lib/color-picker-1.0.0/color-picker.js',
	'scripts/externallibrary/lib/filedrop-1.0.0/filedrop.js',
	'scripts/externallibrary/lib/flatpickr-4.6.3/flatpickr.js',
	'scripts/externallibrary/lib/iframe-resizer-4.2.6/iframeresizer.js',
	'scripts/externallibrary/lib/ispin-2.0.1/ispin.js',
	'scripts/externallibrary/lib/moment-2.24.0/moment.js',
	'scripts/externallibrary/lib/numbro-2.1.1/numbro.js',
	'scripts/externallibrary/lib/pikaday-1.8.0/pikaday.js',
	'scripts/externallibrary/lib/superplaceholder-1.0.0/superplaceholder.js',
	'scripts/externallibrary/lib/tingle-0.15.2/tingle.js',
	'scripts/externallibrary/lib/tail.select-0.5.15/js/tail.select.js',
	'scripts/externallibrary/lib/vanilla-masker-1.1.1/vanilla-masker.js'
	
### syn.js 자바스크립트 원본 경로
    'src/syn.core.js',
    'src/syn.exception.js',
    'src/syn.resource.js',
    'src/syn.browser.js',
    'src/syn.manipulation.js',
    'src/syn.dimension.js',
    'src/syn.reflection.js',
    'src/syn.crytography.js',
    'src/syn.stringbuilder.js',
    'src/syn.keyboard.js',
    'src/syn.vaildation.js',
    'src/syn.extension.js',
    'src/syn.library.js',
    'src/syn.webform.js',
    'src/syn.request.js',
    'src/extends/syn.webform.ajax.js',
    'src/extends/syn.webform.data.js',
    'src/lang/syn.resource.ko-KR.js',

### syn.domain.js 자바스크립트 원본 경로
	'Scripts/ExternalLibrary/syn.domain.resource.js',
	'Scripts/ExternalLibrary/syn.domain.progressBar.js',
	'Scripts/ExternalLibrary/syn.domain.webform.js',
	'Scripts/ExternalLibrary/syn.domain.timetracker.js',
	'Scripts/ExternalLibrary/syn.domain.vaildation.js',
	'Scripts/ExternalLibrary/syn.domain.init.js'
	
### syn.controls.js 자바스크립트 원본 경로
    'Scripts/UIControls/Chart/Chart.js',
    'Scripts/UIControls/CheckBox/CheckBox.js',
    'Scripts/UIControls/CodePicker/CodePicker.js',
    'Scripts/UIControls/ColorPicker/ColorPicker.js',
    'Scripts/UIControls/DatePicker/DatePicker.js',
    'Scripts/UIControls/DropDownCheckList/DropDownCheckList.js',
    'Scripts/UIControls/DropDownList/DropDownList.js',
    'Scripts/UIControls/RadioButton/RadioButton.js',
    'Scripts/UIControls/TextArea/TextArea.js',
    'Scripts/UIControls/TextBox/TextBox.js',
    'Scripts/UIControls/TextButton/TextButton.js',
    'Scripts/UIControls/TextEditor/TextEditor.js',
    'Scripts/UIControls/WebGrid/WebGrid.js'

번들링에 관련된 파일은 프레임워크 개발자가 유지 관리를 담당하며, 주요 변경사항에 대해서는 사전에 공지함