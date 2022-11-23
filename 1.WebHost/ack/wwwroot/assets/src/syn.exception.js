/// <reference path='syn.core.js' />

/// <code>
/// $exception.add('CustomException', errorHandler, 'Custom Exception 처리입니다.', 0);
/// 
/// try {
///     alert('error!!!' // ApplicationException 호출
///     throw e; // CustomException 호출
/// }
/// catch (e) {
///     if (e instanceof TypeError) {
///     }
///     else if (e instanceof RangeError) {
///     }
///     else if (e instanceof SyntaxError) {
///     }
///     else {
///     }
/// 
///     $exception.actionHandler('CustomException', e);
/// }
/// 
/// function errorHandler(exception) {
///     alert(exception.message + ' ' + this.message);
/// }
/// </code>
(function (context) {
    'use strict';
    var $exception = context.$exception || new syn.module();

    $exception.extend({
        version: '1.0',
        exceptions: [],

        add(id, func, message) {
            var errorInfo = [];
            errorInfo['message'] = message;
            errorInfo['id'] = id;
            errorInfo['func'] = func;

            this.exceptions[id] = errorInfo;
            return this;
        },

        remove(id) {
            this.exceptions[id] = null;
            return this;
        },

        actionHandler(id, exception) {
            this.exceptions[id].func(exception);
            return this;
        },

        exceptionHandler() {
            return this.exceptions[id].func;
        }
    });

    (function () {
        function applicationException(message, url) {
            alert(message + url);
            return true;
        };

        $exception.add('ApplicationException', applicationException, 'Exception Templete Message.', '99999');

        //window.onerror = applicationException;
    })();
    syn.$e = $exception;
})(globalRoot);
