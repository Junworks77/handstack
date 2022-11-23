/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $stringbuilder = context.$stringbuilder || new syn.module();

    $stringbuilder.extend({
        version: '1.0',

        datas: [],

        append(val) {
            this.datas.push(val);
        },

        appendFormat(pattern) {
            var vals = this.convertToArray(arguments).slice(1);
            this.datas[this.datas.length] = pattern.replace(/\{(\d+)\}/g, function (pattern, index) {
                return vals[index].toString();
            });
        },

        convertToArray() {
            if (!arguments) {
                return [];
            }

            if (arguments.toArray) {
                return arguments.toArray();
            }

            var args = arguments[0];
            var len = args.length
            var results = new Array(len);

            while (len--) {
                results[len] = args[len];
            }

            return results;
        },

        clear() {
            this.datas.length = 0;
        },

        toString(flag) {
            if ($object.isNullOrUndefined(flag) == true) {
                flag = '\n';
            }
            return this.datas.join('');
        }
    });
    syn.$sb = $stringbuilder;
})(globalRoot);
