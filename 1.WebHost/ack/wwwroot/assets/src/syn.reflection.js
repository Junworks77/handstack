/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $ref = $ref || new syn.module();

    $ref.extend({
        version: '1.0',

        getType(val) {
            var result = typeof val;
            if (result == 'object') {
                if (val) {
                    if (val instanceof Array || (!(val instanceof Object) && (Object.prototype.toString.call((val)) == '[object Array]') || typeof val.length == 'number' && typeof val.splice != 'undefined' && typeof val.propertyIsEnumerable != 'undefined' && !val.propertyIsEnumerable('splice'))) {
                        return 'array';
                    }

                    if (!(val instanceof Object) && (Object.prototype.toString.call((val)) == '[object Function]' || typeof val.call != 'undefined' && typeof val.propertyIsEnumerable != 'undefined' && !val.propertyIsEnumerable('call'))) {
                        return 'function';
                    }
                }
                else {
                    return 'null';
                }
            }
            else if (result == 'function' && typeof val.call == 'undefined') {
                return 'object';
            }

            return result;
        },

        defaultValue(type, isPrimitive) {
            if (typeof type !== 'string') {
                return '';
            }

            if (isPrimitive && isPrimitive == true) {
                switch (type) {
                    case 'boolean': return false;
                    case 'function': return function () { };
                    case 'null': return null;
                    case 'number': return 0;
                    case 'object': return {};
                    case 'string': return '';
                    case 'symbol': return Symbol();
                    case 'undefined': return void 0;
                }

                try {
                    var ctor = typeof this[type] === 'function' ? this[type] : eval(type);

                    return new ctor;
                } catch (e) {
                    return {};
                }
            }
            else {
                switch (type) {
                    case 'bool':
                    case 'boolean':
                        return false;
                    case 'int':
                    case 'number':
                        return 0;
                    default: return '';
                }
            }
        },

        isDefined(val) {
            return val !== undefined;
        },

        isNull(val) {
            return val === null;
        },

        isArray(val) {
            return this.getType(val) == 'array';
        },

        isDate(val) {
            var result = false;
            try {
                if ($string.isNullOrEmpty(val) == true) {
                    result = true;
                }
                else if (typeof val == 'string') {
                    if (val.includes('T') == true) {
                        var date = val.parseISOString();
                        result = typeof date.getFullYear == 'function';
                    }
                    else if ($date.isDate(val) == true) {
                        result = true;
                    }
                }
            } catch (e) {
            }

            return result;
        },

        isString(val) {
            return typeof val == 'string';
        },

        isNumber(val) {
            return typeof val == 'number';
        },

        isFunction(val) {
            return this.getType(val) == 'function';
        },

        isObject(val) {
            return typeof val == 'object';
        },

        isObjectEmpty(val) {
            if (typeof val == 'object') {
                for (var key in val) {
                    if (val.hasOwnProperty(key) == true) {
                        return false;
                    }
                }
            }
            return true;
        },

        isBoolean(val) {
            return typeof val == 'boolean';
        },

        isEmpty(val) {
            var result = false;
            if (typeof val == 'number' || typeof val == 'boolean' || typeof val == 'function' || (typeof val === 'object' && val instanceof Date)) {
                result = false;
            }
            else {
                result = (val == null || !(Object.keys(val) || val).length);
            }
            return result;
        },

        clone(val, isNested) {
            var result = null;

            if ($object.isNullOrUndefined(isNested) == true) {
                isNested = true;
            }

            if (this.isArray(val) == true) {
                result = JSON.parse(JSON.stringify(val));
            }
            else if (this.isObject(val) == true) {
                if (val) {
                    var types = [Number, String, Boolean], result;
                    types.forEach(function (type) {
                        if (val instanceof type) {
                            result = type(val);
                        }
                    });

                    if (isNested == true && Object.prototype.toString.call(val) === '[object Array]') {
                        result = [];
                        val.forEach(function (child, index, array) {
                            result[index] = this.clone(child);
                        });
                    }
                    else if (typeof val == 'object') {
                        if (val.nodeType && typeof val.cloneNode == 'function') {
                            result = val.cloneNode(true);
                        }
                        else if (!val.prototype) {
                            result = {};
                            for (var i in val) {
                                result[i] = this.clone(val[i]);
                            }
                        }
                        else {
                            if (val.constructor) {
                                result = new val.constructor();
                            }
                            else {
                                result = val;
                            }
                        }
                    }
                    else {
                        result = val;
                    }
                }
                else {
                    result = val;
                }
            }
            else if (this.isFunction(val) == true) {
                result = val.clone();
            }
            else {
                result = val;
            }

            return result;
        },

        /// var data = $ref.mergeDeep({}, $ref..defaults, data || {});
        deepClone(target) {
            if (arguments.length <= 1) {
                return target;
            }

            var sources = [].slice.apply(arguments);
            sources.shift();
            var source = sources.shift();

            if (isObject(target) && isObject(source)) {
                for (var key in source) {
                    if (isObject(source[key])) {
                        if (!target[key]) {
                            var obj = {};
                            obj[key] = {};
                            Object.assign(target, obj);
                        }
                        mergeDeep(target[key], source[key]);
                    } else {
                        var obj = {};
                        obj[key] = source[key];
                        Object.assign(target, obj);
                    }
                }
            }

            return mergeDeep.apply(null, [target].concat(sources));
        },

        cloneNode(val) {
            return val.cloneNode(true);
        },

        method(obj, funcName, func) {
            obj.prototype[funcName] = func;
            return this;
        },

        extend(to, from, overwrite) {
            var prop, hasProp;
            for (prop in from) {
                hasProp = to[prop] !== undefined;
                if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                    if ($ref.isDate(from[prop])) {
                        if (overwrite) {
                            to[prop] = new Date(from[prop].getTime());
                        }
                    }
                    else if ($ref.isArray(from[prop])) {
                        if (overwrite) {
                            to[prop] = from[prop].slice(0);
                        }
                    } else {
                        to[prop] = $ref.extend({}, from[prop], overwrite);
                    }
                } else if (overwrite || !hasProp) {
                    to[prop] = from[prop];
                }
            }
            return to;
        }
    });

    context.$ref = $ref;
})(globalRoot);
