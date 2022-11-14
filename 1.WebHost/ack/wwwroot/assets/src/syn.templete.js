﻿/// <summary>
/// (개발용) 신규 모듈 개발 템플릿입니다.
/// </summary>
(function (context) {
    var $templete = $templete || new syn.module();
    var document = window.document;

    $templete.extend({
        version: "1.0",

        method() {
            return this;
        }
    });
    context.$templete = context.$t = syn.$t = context.$templete || $templete;
})(globalRoot);

if (typeof module === 'object' && module.exports) {
    module.exports = global.$templete;
}

/// <summary>
/// (개발용) 기존 모듈 확장 개발 템플릿입니다.
/// </summary>
(function ($templete) {
    if (!$templete) {
        $templete = new syn.module();
    }

    var document = null;
    if (typeof module === 'object' && module.exports) {
    }
    else {
        document = window.document;
    }

    $templete.extend({
        extendVersion: "1.0",

        method() {
            return this;
        }
    });
})($templete || globalRoot.$templete);
