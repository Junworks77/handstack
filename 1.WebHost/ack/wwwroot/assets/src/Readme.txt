문제
1. 현업에서 이미 사용중인 특정 자바스크립트 프레임워크
2. 현업에서 jQuery, prototype, ASP.NET Ajax 등등을 같이 사용하기를 요청
3. 현업에서 jQuery, prototype, ASP.NET Ajax 등등을 아예 사용하지 않기를 요청
4. 특정 자바스크립트 프레임워크기반으로 독자적인 라이브러리 구축시 종속성
5. 범용 프레임워크와 도메인 프레임워크간의 통합
6. 개발자가 특정 자바스크립트 프레임워크 기반으로 많음
7. 유지보수, 생산성 차원에서 일관적인 자바스크립트 코드 품질을 요청
8. 최소한의 학습 곡선을 요청

컨셉
특정 프레임워크나 라이브러리에 종속적이지 않아야 한다
제공하는 기능이 화면 개발자가 이해하기 쉬워야 한다
타 프레임워크와 융합이 잘 이뤄져야 한다.
현업에 따라 프레임워크 변경 작업이 있어서는 안된다.

참고
자바스크립트 압축 사이트
http://closure-compiler.appspot.com/home
http://fmarcia.info/jsmin/test.html

JSON Formatter & Validator
http://jsonformatter.curiousconcept.com/ 

// 디버깅을 방해하도록 처리
setInterval(function () { eval("setTimeout(function () {eval(\"debugger;\");}, 1000);"); }, 1000);