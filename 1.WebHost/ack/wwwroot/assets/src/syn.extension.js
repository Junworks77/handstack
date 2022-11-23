/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $date = context.$date || new syn.module();
    var $array = context.$array || new syn.module();
    var $string = context.$string || new syn.module();
    var $number = context.$number || new syn.module();
    var $object = context.$object || new syn.module();

    (function () {
        var UID = {
            current: 0,
            getNew() {
                this.current++;
                return this.current;
            }
        };

        if (globalRoot.devicePlatform === 'browser') {
            HTMLElement.prototype.pseudoStyle = function (virtualSelector, prop, value) {
                var $that = this;
                var sheetID = 'pseudoStyles';
                var head = document.head || document.getElementsByTagName('head')[0];
                var sheet = document.getElementById(sheetID) || document.createElement('style');
                sheet.id = sheetID;
                var className = 'pseudoStyle' + UID.getNew();

                $that.className += ' ' + className;

                sheet.innerHTML += ' .' + className + ':' + virtualSelector + '{' + prop + ':' + value + '}';
                head.appendChild(sheet);
                return this;
            };

            HTMLElement.prototype.controlPseudoStyle = function (virtualSelector, styleValue) {
                var $that = this;
                var sheetID = 'controlPseudoStyles';
                var head = document.head || document.getElementsByTagName('head')[0];
                var sheet = document.getElementById(sheetID) || document.createElement('style');
                sheet.id = sheetID;
                var className = 'controlPseudoStyle' + UID.getNew();

                $that.className += ' ' + className;

                sheet.innerHTML += '#{0} {1} {2}'.format($that.id, virtualSelector, styleValue);
                head.appendChild(sheet);
                return this;
            };
        }

        if (!Function.prototype.clone) {
            Function.prototype.clone = function () {
                var that = this;
                var result = function T() { return that.apply(this, arguments); };
                for (var key in this) {
                    result[key] = this[key];
                }

                return result;
            };
        }

        if (!Object.assign) {
            Object.assign = function clone(obj) {
                if (obj === null || typeof (obj) !== 'object')
                    return obj;

                var copy = obj.constructor();

                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = obj[attr];
                    }
                }

                return copy;
            }
        }

        if (!Object.entries) {
            Object.entries = function (obj) {
                var ownProps = Object.keys(obj),
                    i = ownProps.length,
                    resArray = new Array(i);
                while (i--)
                    resArray[i] = [ownProps[i], obj[ownProps[i]]];

                return resArray;
            }
        }

        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                var val = this.replace(/^\s+/, '');
                for (var i = val.length - 1; i > 0; i--) {
                    if (/\S/.test(val.charAt(i))) {
                        val = val.substring(0, i + 1);
                        break;
                    }
                }

                return val;
            };
        }

        if (!String.prototype.includes) {
            String.prototype.includes = function (val) {
                return this.indexOf(val) !== -1;
            };
        }

        if (!String.prototype.format) {
            String.prototype.format = function () {
                var val = this;
                for (var i = 0, len = arguments.length; i < len; i++) {
                    var exp = new RegExp('\{' + i.toString() + '+?\}', 'g');
                    val = val.replace(exp, arguments[i]);
                }

                return val;
            };
        }

        if (!String.prototype.parseISOString) {
            String.prototype.parseISOString = function () {
                var val = this;
                var result = null;

                if (val && val.includes('T') == true) {
                    var date = val.split(/\D+/);
                    result = new Date(Date.UTC(date[0], --date[1], date[2], date[3], date[4], date[5], date[6]));
                }

                return result;
            }
        }

        if (!Array.prototype.includes) {
            Object.defineProperty(Array.prototype, 'includes', {
                value(searchElement, fromIndex) {
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);
                    var len = o.length >>> 0;
                    if (len === 0) {
                        return false;
                    }

                    var n = fromIndex | 0;
                    var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                    function sameValueZero(x, y) {
                        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
                    }

                    while (k < len) {
                        if (sameValueZero(o[k], searchElement)) {
                            return true;
                        }
                        k++;
                    }
                    return false;
                }
            });
        }

        if (!Array.prototype.filter) {
            Array.prototype.filter = function (func, thisArg) {
                'use strict';
                if (!((typeof func === 'Function' || typeof func === 'function') && this))
                    throw new TypeError();

                var len = this.length >>> 0,
                    res = new Array(len),
                    t = this, c = 0, i = -1;
                if (thisArg === undefined) {
                    while (++i !== len) {
                        if (i in this) {
                            if (func(t[i], i, t)) {
                                res[c++] = t[i];
                            }
                        }
                    }
                }
                else {
                    while (++i !== len) {
                        if (i in this) {
                            if (func.call(thisArg, t[i], i, t)) {
                                res[c++] = t[i];
                            }
                        }
                    }
                }

                res.length = c;
                return res;
            };
        }

        if (!Array.prototype.map) {
            Array.prototype.map = function (callback, thisArg) {
                var T, A, k;

                if (this == null) {
                    throw new TypeError(' this is null or not defined');
                }

                var O = Object(this);
                var len = O.length >>> 0;
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }

                if (arguments.length > 1) {
                    T = thisArg;
                }

                A = new Array(len);
                k = 0;
                while (k < len) {
                    var kValue, mappedValue;

                    if (k in O) {
                        kValue = O[k];
                        mappedValue = callback.call(T, kValue, k, O);
                        A[k] = mappedValue;
                    }
                    k++;
                }

                return A;
            };
        }

        if (!Date.prototype.toISOString) {
            Date.prototype.toISOString = function () {
                var date = this;

                function pad(n) { return (n < 10 ? '0' : '') + n }
                function padd(n) { return (n < 100 ? '0' : '') + pad(n) }

                return date.getUTCFullYear() + '-' +
                    pad(date.getUTCMonth() + 1) + '-' +
                    pad(date.getUTCDate()) +
                    'T' + pad(date.getUTCHours()) + ':' +
                    pad(date.getUTCMinutes()) + ':' +
                    pad(date.getUTCSeconds()) + '.' +
                    padd(date.getMilliseconds()) + 'Z';
            }
        }

        if (globalRoot.devicePlatform === 'node') {
        }
        else {
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
            }

            if (!Element.prototype.closest) {
                Element.prototype.closest = function (s) {
                    var el = this;

                    do {
                        if (el.matches(s)) return el;
                        el = el.parentElement || el.parentNode;
                    } while (el !== null && el.nodeType === 1);
                    return null;
                };
            }
        }
    })();

    $date.extend({
        version: '1.0',
        interval: {
            yyyy: { units: 1000 * 60 * 60 * 24 * 365, measure: 'year' },
            m: { units: 1000 * 60 * 60 * 24 * 30, measure: 'month' },
            d: { units: 1000 * 60 * 60 * 24, measure: 'day' },
            q: { units: (1000 * 60 * 60 * 24 * 30) * 3, measure: 'quarter' },
            h: { units: 60000 * 60, measure: 'hour' },
            n: { units: 60000, measure: 'minute' },
            s: { units: 1000, measure: 'second' },
        },
        minutes: 60000,

        toUTC(date) {
            if (typeof date === 'string') {
                var expr = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(date);
                if (expr) {
                    return new Date(Date.UTC(+expr[1], +expr[2] - 1, +expr[3], +expr[4], +expr[5], +expr[6]));
                }
            }
            return null;
        },

        clear(date, isTimeOnly) {
            date.setYear(0);
            date.setMonth(0);
            date.setDate(0);

            if (isTimeOnly === true) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
            }

            return date;
        },

        now(date) {
            date = new Date();
            return date;
        },

        clone(date) {
            return new Date(date.getTime());
        },

        isBetween(date, start, end) {
            return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
        },

        equals(date, targetDate) {
            return date.toDateString() == (targetDate || new Date()).toDateString();
        },

        isToday(date) {
            return $date.equals(date, new Date());
        },

        toString(date, format) {
            var result = '';
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate().toString();
            var hours = date.getHours().toString().length == 1 ? '0' + date.getHours().toString() : date.getHours().toString();
            var minutes = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
            var seconds = date.getSeconds().toString().length == 1 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
            var milliseconds = date.getMilliseconds().toString();
            var week = ['일', '월', '화', '수', '목', '금', '토'];

            month = month.toString().length == 1 ? '0' + month.toString() : month.toString();

            switch (format) {
                case 'd':
                    result = year.toString().concat('-', month, '-', day);
                    break;
                case 't':
                    result = hours.toString().concat(':', minutes, ':', seconds);
                    break;
                case 'a':
                    result = year.toString().concat('-', month, '-', day, ' ', hours, ':', minutes, ':', seconds);
                    break;
                case 'f':
                    result = year.toString().concat(month, day, hours, minutes, seconds, milliseconds);
                    break;
                case 'w':
                    result = week[date.getDay()];
                    break;
                case 'n':
                    var dayOfWeek = week[date.getDay()];
                    result = year.toString().concat('년', month, '월', day, '일', '(', dayOfWeek, ')');
                    break;
                default:
                    result = date.getDate();
            }

            return result;
        },

        addHour(date, val) {
            return new Date(date.setTime(date.getTime() + (val * 60 * 60 * 1000)));
        },

        addDay(date, val) {
            return new Date(date.setDate(date.getDate() + val));
        },

        addWeek(date, val) {
            return new Date(date.setDate(date.getDate() + (val * 7)));
        },

        addMonth(date, val) {
            return new Date(date.setMonth(date.getMonth() + val));
        },

        addYear(date, val) {
            return new Date(date.setFullYear(date.getFullYear() + val));
        },

        getFirstDate(date) {
            return new Date(date.setDate(1));
        },

        getLastDate(date) {
            date = $date.addMonth(date, 1);
            return $date.addDay(new Date(date.setDate(1)), -1);
        },

        // var date1 = new Date();
        // var date2 = new Date();
        // date2 = date2.addDay(3);
        // $date.diff('h', date1, date2); // 포맷값(yyyy, m, d, q, h, n, s)
        diff(itv, start, end) {
            if ($ref.isString(start) == true) {
                start = new Date(start);
            }

            if ($ref.isString(end) == true) {
                end = new Date(end);
            }

            var period1 = this.toString(start, 'd');
            var splitDate1 = period1.split('-');
            var periodYear1 = splitDate1[0];
            var periodMonth1 = splitDate1[1] - 1;
            var periodDay1 = splitDate1[2];

            var period2 = this.toString(end, 'd');
            var splitDate2 = period2.split('-');
            var periodYear2 = splitDate2[0];
            var periodMonth2 = splitDate2[1] - 1;
            var periodDay2 = splitDate2[2];

            var do1 = new Date(periodYear1, periodMonth1, periodDay1);
            do1.setHours(0);
            do1.setMinutes(0);
            do1.setSeconds(0);
            var period1Time = do1.getTime();

            var do2 = new Date(periodYear2, periodMonth2, periodDay2);
            do2.setHours(0);
            do2.setMinutes(0);
            do2.setSeconds(0);
            var period2Time = do2.getTime();
            var adjust = null;

            if (do2 > do1) {
                adjust = (do2.getTimezoneOffset() - do1.getTimezoneOffset()) * $date.minutes;
            }
            else {
                adjust = (do1.getTimezoneOffset() - do2.getTimezoneOffset()) * $date.minutes;
            }

            if (typeof $date.interval[itv] != 'undefined') {
                var diff = Math.ceil(period2Time - period1Time) - adjust;
                var timeDiff = Math.floor(diff / $date.interval[itv].units);

                return parseInt(timeDiff);
            }
            else {
                return -1;
            }
        },

        toTicks(date) {
            return ((date.getTime() * 10000) + 621355968000000000);
        },

        // alert($date.isDate('2012-12-31')); // true
        // alert($date.isDate('2012-12-31T00:00:00')); // true
        // alert($date.isDate('2012-12-32')); // false
        isDate(val) {
            var result = false;
            var scratch = null;

            scratch = new Date(val);
            if (scratch.toString() == 'NaN' || scratch.toString() == 'Invalid Date') {
                if (syn.$b.isSafari == true && syn.$b.isChrome == false) {
                    var parts = val.match(/(\d+)/g);
                    scratch = new Date(parts[0], parts[1] - 1, parts[2]);
                    if (scratch.toString() == 'NaN' || scratch.toString() == 'Invalid Date') {
                        result = false;
                    }
                    else {
                        result = true;
                    }
                }
                else {
                    result = false;
                }
            }
            else {
                result = true;
            }

            return result;
        },

        isISOString(val) {
            var date = new Date(val);
            return !Number.isNaN(date.valueOf()) && date.toISOString() === val;
        },

        calcWeekOfMonth(year, month, weekStand) {
            var result = [];
            var date = new Date(year, month);

            // 월요일을 중심으로한 주차 구하기(일요일 0 월요일 1 ~ 토요일 6 )
            var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
            var week = null;

            if ($object.isNullOrUndefined(weekStand) == true) {
                weekStand = 8; // 월요일 고정
            }

            var firstWeekEndDate = true;
            var thisMonthFirstWeek = firstDay.getDay();

            for (var num = 1; num <= 6; num++) {
                // 마지막월과 첫번째월이 다른경우 빠져나온다.
                if (lastDay.getMonth() != firstDay.getMonth()) {
                    break;
                }

                week = {};

                // 한주의 시작일은 월의 첫번째 월요일로 설정
                if (firstDay.getDay() <= 1) {
                    // 한주의 시작일이 일요일이라면 날짜값을 하루 더해준다.
                    if (firstDay.getDay() == 0) {
                        firstDay.setDate(firstDay.getDate() + 1);
                    }

                    week.weekStartDate = firstDay.getFullYear().toString() + '-' + $this.numberPad((firstDay.getMonth() + 1).toString(), 2) + '-' + $this.numberPad(firstDay.getDate().toString(), 2);
                }

                if (weekStand > thisMonthFirstWeek) {
                    if (firstWeekEndDate) {
                        if (weekStand - firstDay.getDay() == 1) {
                            firstDay.setDate(firstDay.getDate() + (weekStand - firstDay.getDay()) - 1);
                        }

                        if (weekStand - firstDay.getDay() > 1) {
                            firstDay.setDate(firstDay.getDate() + (weekStand - firstDay.getDay()) - 1);
                        }

                        firstWeekEndDate = false;
                    } else {
                        firstDay.setDate(firstDay.getDate() + 6);
                    }
                } else {
                    firstDay.setDate(firstDay.getDate() + (6 - firstDay.getDay()) + weekStand);
                }

                // 월요일로 지정한 데이터가 존재하는 경우에만 마지막 일의 데이터를 담는다.
                if (typeof week.weekStartDate !== 'undefined') {
                    week.weekEndDate = firstDay.getFullYear().toString() + '-' + $this.numberPad((firstDay.getMonth() + 1).toString(), 2) + '-' + $this.numberPad(firstDay.getDate().toString(), 2);
                    result.push(week);
                }

                firstDay.setDate(firstDay.getDate() + 1);
            }

            return result;
        }
    });
    context.$date = $date;

    $string.extend({
        version: '1.0',

        toDate(val) {
            return new Date((val - 621355968000000000) / 10000);
        },

        br(val) {
            return val.replace(/(\r\n|\r|\n)/g, '<br />');
        },

        isBusinessNo(val) {
            var result = false;
            var valueMap = val.replace(/-/gi, '').split('').map(function (item) {
                return parseInt(item, 10);
            });

            if (valueMap.length === 10) {
                try {
                    var multiply = [1, 3, 7, 1, 3, 7, 1, 3, 5];
                    var checkSum = 0;

                    for (var i = 0; i < multiply.length; ++i) {
                        checkSum += multiply[i] * valueMap[i];
                    }

                    checkSum += parseInt((multiply[8] * valueMap[8]) / 10, 10);
                    result = Math.floor(valueMap[9]) === ((10 - (checkSum % 10)) % 10);
                } catch (e) {
                    result = false;
                }
            }

            return result;
        },

        interpolate(text, json, options = null) {
            var result = null;

            if (json != null) {
                options = syn.$w.argumentsExtend({
                    defaultValue: null,
                    separator: '\n',
                }, options);

                var replaceFunc = function (text, item) {
                    return text.replace(/\${([^${}]*)}/g,
                        function (pattern, key) {
                            var value = item[key];
                            return typeof value === 'string' || typeof value === 'number' ? value : (options.defaultValue == null ? pattern : options.defaultValue);
                        }
                    )
                };

                if ($ref.isArray(json) == false) {
                    result = replaceFunc(text, json);
                }
                else {
                    var values = [];
                    for (var key in json) {
                        var item = json[key];
                        values.push(replaceFunc(text, item));
                    }

                    result = values.join(options.separator);
                }
            }

            return result;
        },

        isNullOrEmpty(val) {
            if (val === undefined || val === null || val === '') {
                return true;
            }
            else {
                return false;
            }
        },

        sanitizeHTML(val) {
            return val.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
                .replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
        },

        // 참조(http://www.ascii.cl/htmlcodes.htm)
        toHtmlChar(val) {
            return val.replace(/&/g, '&amp;').replace(/\'/g, '&quot;').replace(/\'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        toCharHtml(val) {
            return val.replace(/&amp;/g, '&').replace(/&quot;/g, '\'').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        },

        toAscii(val) {
            return (val.trim().replace(/[^0-9a-zA-Z\value]/g, ''));
        },

        isAscii(val) {
            return /^[\x00-\x7F]*$/.test(val);
        },

        length(val) {
            var result = 0;
            for (var i = 0, len = val.length; i < len; i++) {
                if (val.charCodeAt(i) > 127) {
                    result += 2;
                }
                else {
                    result++;
                }
            }

            return result;
        },

        substring(val, len) {
            var currentLength = 0;
            if ($object.isNullOrUndefined(len) == true) {
                len = val.length;
            }

            for (var i = 0; i < val.length; i++) {
                if (val.charCodeAt(i) > 127) {
                    currentLength += 2;
                }
                else {
                    currentLength += 1;
                }

                if (currentLength > len) {
                    return val.substring(0, i);
                }
            }

            return val;
        },

        split(val, len) {
            var i = 0;
            var result = [];
            while (i < val.length) {
                var substr = $string.substring(val, len);
                if (substr) {
                    result.push(substr);
                    val = val.replace(substr, '');
                }
                else {
                    break;
                }
            }

            return result;
        },

        isNumber(num, opt) {
            num = String(num).replace(/^\s+|\s+$/g, "");

            if (typeof opt == "undefined" || opt == "1") {
                var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
            } else if (opt == "2") {
                var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
            } else if (opt == "3") {
                var regex = /^[0-9]+(\.[0-9]+)?$/g;
            } else {
                var regex = /^[0-9]$/g;
            }

            if (regex.test(num)) {
                num = num.replace(/,/g, "");
                return isNaN(num) ? false : true;
            } else {
                return false;
            }
        },

        capitalize(val) {
            return val.replace(/\b([a-z])/g, function (val) {
                return val.toUpperCase()
            });
        },

        // toJson('col1;col2\na;b\nc;d', ';');
        toJson(val, option) {
            option = option || {};
            var delimeter = option.delimeter || ',';
            var newline = option.newline || '\n';
            var meta = option.meta || {};
            var i, row, lines = val.split(RegExp('{0}'.format(newline), 'g'));
            var headers = lines[0].split(delimeter);
            for (i = 0; i < headers.length; i++) {
                headers[i] = headers[i].replace(/(^[\s"]+|[\s"]+$)/g, '');
            }
            var result = [];
            var lineLength = lines.length;
            var headerLength = headers.length;
            if ($ref.isEmpty(meta) == true) {
                for (i = 1; i < lineLength; i++) {
                    row = lines[i].split(delimeter);
                    var item = {};
                    for (var j = 0; j < headerLength; j++) {
                        item[headers[j]] = $string.toDynamic(row[j]);
                    }
                    result.push(item);
                }
            }
            else {
                for (i = 1; i < lineLength; i++) {
                    row = lines[i].split(delimeter);
                    var item = {};
                    for (var j = 0; j < headerLength; j++) {
                        var columnName = headers[j];
                        item[columnName] = $string.toParseType(row[j], meta[columnName]);
                    }
                    result.push(item);
                }
            }
            return result;
        },

        toParameterObject(parameters) {
            return (parameters.match(/([^?:;]+)(:([^;]*))/g) || []).reduce(function (a, v) {
                return a[v.slice(0, v.indexOf(':')).replace('@', '')] = v.slice(v.indexOf(':') + 1), a;
            }, {});
        },

        toNumber(val) {
            var result = 0;
            try {
                result = parseFloat(($object.isNullOrUndefined(val) == true ? 0 : val) === 0 || val === '' ? '0' : val.toString().replace(/,/g, ''));
            } catch (error) {
                console.log(error);
            }

            return result;
        },

        toBoolean(val) {
            return (val === 'true' || val === 'True' || val === 'TRUE' || val === 'Y' || val == '1');
        },

        toDynamic(val, emptyIsNull) {
            var result;
            if (emptyIsNull == undefined) {
                emptyIsNull = false;
            }

            if (emptyIsNull == true && val === '') {
                result = null;
            }
            else {
                if (val === 'true' || val === 'True' || val === 'TRUE') {
                    result = true;
                }
                else if (val === 'false' || val === 'False' || val === 'FALSE') {
                    result = false;
                }
                else if ($validation.regexs.float.test(val)) {
                    result = $string.toNumber(val);
                }
                else if ($validation.regexs.isoDate.test(val)) {
                    result = new Date(val);
                }
                else {
                    result = val;
                }
            }

            return result;
        },

        toParseType(val, metaType, emptyIsNull) {
            var result;

            if (emptyIsNull == undefined) {
                emptyIsNull = false;
            }

            if (emptyIsNull == true && val === '') {
                result = null;
            }
            else {
                switch (metaType) {
                    case 'string':
                        result = val;
                        break;
                    case 'bool':
                        result = $string.toBoolean(val);
                        break;
                    case 'number':
                    case 'int':
                        result = $object.isNullOrUndefined(val) == true ? null : $string.isNumber(val) == true ? $string.toNumber(val) : null;
                        break;
                    case 'date':
                        if ($validation.regexs.isoDate.test(val)) {
                            result = new Date(val);
                        }
                        break;
                    default:
                        result = val;
                        break;
                }
            }

            return result;
        },

        toNumberString(val) {
            return val.replace(/,/g, '');
        },

        toCurrency(val, localeID, options) {
            var result = null;
            if ($string.isNumber(val) == false) {
                return result;
            }

            if ($object.isNullOrUndefined(localeID) == true) {
                var x = val.toString().split('.');
                var x1 = x[0];

                var x2 = x.length > 1 ? '.' + x[1] : '';
                var expr = /(\d+)(\d{3})/;

                while (expr.test(x1)) {
                    x1 = x1.replace(expr, '$1' + ',' + '$2');
                }

                result = x1 + x2;
            }
            else {
                // https://ko.wikipedia.org/wiki/ISO_4217
                var formatOptions = syn.$w.argumentsExtend({
                    style: 'currency',
                    currency: 'KRW'
                }, options);

                result = Intl.NumberFormat(localeID, formatOptions).format(val);
            }

            return result;
        },

        digits(val, length, fix) {
            var fix = fix || '0';
            var digit = '';

            if (this.length < length) {
                for (var i = 0; i < length - val.length; i++) {
                    digit += fix;
                }
            }

            return digit + val;
        },

        toClipboard(val) {
            if (globalRoot.devicePlatform === 'node') {
            }
            else {
                var el = document.createElement('textarea');
                el.value = val;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                var selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                if (selected) {
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(selected);
                }
            }
        }
    });
    context.$string = $string;

    $array.extend({
        version: '1.0',

        distinct(arr) {
            var derived = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (this.contains(derived, arr[i]) == false) {
                    derived.push(arr[i])
                }
            }

            return derived;
        },

        sort(arr, order) {
            var temp = null;

            if (order) {
                order = true;
            }

            if (order == true) {
                for (var i = 0, ilen = arr.length; i < ilen; i++) {
                    for (var j = 0, jlen = arr.length; j < jlen; j++) {
                        if (arr[i] < arr[j]) {
                            temp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = temp;
                        }
                    }
                }
            }
            else {
                for (var i = 0, ilen = arr.length; i < ilen; i++) {
                    for (var j = 0, jlen = arr.length; j < jlen; j++) {
                        if (arr[i] > arr[j]) {
                            temp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = temp;
                        }
                    }
                }
            }

            temp = null;
        },

        objectSort(objectArr, prop, order) {
            if ($object.isNullOrUndefined(order) == true) {
                order = true;
            }

            if (order == true) {
                objectArr.sort(
                    function (v1, v2) {
                        var prop1 = v1[prop];
                        var prop2 = v2[prop];

                        if (prop1 < prop2) {
                            return -1;
                        }

                        if (prop1 > prop2) {
                            return 1;
                        }

                        return 0;
                    }
                );
            }
            else {
                objectArr.sort(
                    function (v1, v2) {
                        var prop1 = v1[prop];
                        var prop2 = v2[prop];

                        if (prop1 < prop2) {
                            return 1;
                        }

                        if (prop1 > prop2) {
                            return -1;
                        }

                        return 0;
                    }
                );
            }
        },

        shuffle(arr) {
            var i = arr.length, j;
            var temp = null;
            while (i--) {
                j = Math.floor((i + 1) * Math.random());
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        },

        lastIndexOf(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return i;
                }
            }

            return -1;
        },

        add(arr, val) {
            arr.push(val);
        },

        addAt(arr, index, val) {
            if (arr.length - 1 <= index) {
                arr.splice(index, 0, val);
            }
        },

        remove(arr) {
            arr.pop();
        },

        removeAt(arr, index) {
            if (index <= (arr.length - 1)) {
                arr.splice(index, 1);
            }
        },

        removeID(arr, id, val) {
            var itemToFind = arr.find(function (item) { return item[id] == val })
            var idx = arr.indexOf(itemToFind)
            if (idx > -1) {
                arr.splice(idx, 1)
            }
        },

        contains(arr, val) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === val) {
                    return true;
                }
            }

            return false;
        },

        addProp(arr, prop, val) {
            arr.push({ 'prop': prop, 'val': val });
        },

        union(sourceArray, targetArray) {
            var result = [];
            var temp = {}
            for (var i = 0; i < sourceArray.length; i++) {
                temp[sourceArray[i]] = 1;
            }

            for (var i = 0; i < targetArray.length; i++) {
                temp[targetArray[i]] = 1;

            }

            for (var k in temp) {
                result.push(k)
            };
            return result;
        },

        difference(sourceArray, targetArray) {
            return sourceArray.filter(function (x) {
                return !targetArray.includes(x);
            });
        },

        intersection(sourceArray, targetArray) {
            return sourceArray.filter(function (x) {
                return targetArray.includes(x);
            });
        },

        symmetryDifference(sourceArray, targetArray) {
            return sourceArray.filter(function (x) {
                return !targetArray.includes(x);
            }).concat(targetArray.filter(function (x) {
                return !sourceArray.includes(x);
            }));
        },

        getValue(items, parameterName, defaultValue, parameterProperty, valueProperty) {
            var result = null;

            if (items && items.length > 0) {
                var parseParameter = null;
                if (parameterProperty) {
                    parseParameter = items.find(function (item) { return item[parameterProperty] == parameterName; });
                }
                else {
                    parseParameter = items.find(function (item) { return item.ParameterName == parameterName; });
                }

                if (parseParameter) {
                    if (valueProperty) {
                        result = parseParameter[valueProperty];
                    }
                    else {
                        result = parseParameter.Value;
                    }
                }
                else {
                    if (defaultValue === undefined) {
                        result = '';
                    }
                    else {
                        result = defaultValue;
                    }
                }
            }

            return result;
        },

        // var value = [79, 5, 18, 5, 32, 1, 16, 1, 82, 13];
        ranks(value, asc) {
            var result = [];
            if ($object.isNullOrUndefined(value) == false && $ref.isArray(value) == true) {
                if ($object.isNullOrUndefined(asc) == true) {
                    asc = false;
                }
                else {
                    asc = $string.toBoolean(asc);
                }

                if (asc == true) {
                    for (var i = 0; i < value.length; i++) {
                        value[i] = - + value[i];
                    }
                }

                var sorted = value.slice().sort(function (a, b) {
                    return b - a;
                });
                result = value.map(function (v) {
                    return sorted.indexOf(v) + 1;
                });
            }

            return result;
        }
    });
    context.$array = $array;

    $number.extend({
        version: '1.0',

        duration(ms) {
            if (ms < 0) ms = -ms;
            var time = {
                year: 0,
                week: 0,
                day: Math.floor(ms / 86400000),
                hour: Math.floor(ms / 3600000) % 24,
                minute: Math.floor(ms / 60000) % 60,
                second: Math.floor(ms / 1000) % 60,
                millisecond: Math.floor(ms) % 1000
            };

            if (time.day > 365) {
                time.year = time.day % 365;
                time.day = Math.floor(time.day / 365);
            }

            if (time.day > 7) {
                time.week = time.day % 7;
                time.day = Math.floor(time.day / 7);
            }

            return time;
        },

        // $number.toByte(123456789, 3, false);
        toByte(num, precision, addSpace) {
            if (precision === void 0) {
                precision = 3;
            }

            if (addSpace === void 0) {
                addSpace = true;
            }

            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            if (Math.abs(num) < 1) return num + (addSpace ? ' ' : '') + units[0];
            var exponent = Math.min(Math.floor(Math.log10(num < 0 ? -num : num) / 3), units.length - 1);
            var n = Number(((num < 0 ? -num : num) / Math.pow(1024, exponent)).toPrecision(precision));
            return (num < 0 ? '-' : '') + n + (addSpace ? ' ' : '') + units[exponent];
        },

        isRange(num, low, high) {
            return num >= low && num <= high;
        },

        limit(num, low, high) {
            return num < low ? low : (num > high ? high : num);
        },

        limitAbove(num, high) {
            return Math.min(high, num);
        },

        limitBelow(num, low) {
            return Math.max(low, this);
        },

        mod(num, val) {
            return num >= 0 ? num % val : (num % val + Math.abs(val)) % val;
        },

        // 10.9.percent(100.5); // 10
        // 10.9.percent(100.5, 1); // 10.9
        percent(num, val, precision) {
            var precision = precision || 0;
            var result = Math.pow(10, precision);

            return Math.round((num * 100 / val) * result) / result;
        },

        random(start, end) {
            if ($string.isNullOrEmpty(start) == true) {
                start = 0;
            }

            if ($string.isNullOrEmpty(end) == true) {
                end = 10;
            }

            return Math.floor((Math.random() * (end - start + 1)) + start);
        }
    });
    context.$number = $number;

    $object.extend({
        version: '1.0',

        isNullOrUndefined(val) {
            if (val === undefined || val === null) {
                return true;
            }
            else {
                return false;
            }
        },

        // toCSV([{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }], ['a', 'b'], ';');
        toCSV(obj, opt) {
            if (typeof obj !== 'object') return null;
            opt = opt || {};
            var scopechar = opt.scopechar || '/';
            var delimeter = opt.delimeter || ',';
            var newline = opt.newline || '\n';
            if (Array.isArray(obj) === false) obj = [obj];
            var curs, name, i, key, queue, values = [], rows = [], headers = {}, headersArr = [];
            for (i = 0; i < obj.length; i++) {
                queue = [obj[i], ''];
                rows[i] = {};
                while (queue.length > 0) {
                    name = queue.pop();
                    curs = queue.pop();
                    if (curs !== null && typeof curs === 'object') {
                        for (key in curs) {
                            if (curs.hasOwnProperty(key)) {
                                queue.push(curs[key]);
                                queue.push(name + (name ? scopechar : '') + key);
                            }
                        }
                    } else {
                        if (headers[name] === undefined) headers[name] = true;
                        rows[i][name] = curs;
                    }
                }
                values[i] = [];
            }

            for (key in headers) {
                if (headers.hasOwnProperty(key)) {
                    headersArr.push(key);
                    for (i = 0; i < obj.length; i++) {
                        values[i].push(rows[i][key] === undefined
                            ? ''
                            : rows[i][key]);
                    }
                }
            }
            for (i = 0; i < obj.length; i++) {
                values[i] = values[i].join(delimeter);
            }
            return headersArr.join(delimeter) + newline + values.join(newline);
        },

        toParameterString(jsonObject) {
            return jsonObject ? Object.entries(jsonObject).reduce(function (queryString, _ref, index) {
                var key = _ref[0],
                    val = _ref[1];
                if (key.indexOf('@') == -1) {
                    queryString += typeof val === 'string' ? '@' + key + ":" + val + ';' : '';
                }
                return queryString;
            }, '') : '';
        }
    });
    context.$object = $object;
})(globalRoot);
