/**
 * Created by weikaiwei on 2017/1/10.
 */
export default (function m(){
    return {
        _toString: Object.prototype.toString,
        objectString: function(obj){
            return this._toString.call(obj)
        },
        isPlainObject: function (obj) {
            return this._toString.call(obj) == '[object Object]';
        },
        /**根据jQuery的isEmptyObject方法
         * 不能迭代的对象直接返回true，比如null、undefined、NaN。
         * 所有能够被迭代的对象（包括number、boolean、string等），只要成员不为空，就都返回false；否则返回true。
         * 这里从新定义为：不是对象类型的直接返回false，对象和数组迭代内部元素，为空返回true，否则返回false。
         * */
        isEmptyObject: function (obj) {
            var r = false;
            if(obj instanceof Object){
                for(var i in obj){
                    return false;
                }
                return true;
            }
            return false;
        },
        isArray: function (obj) {
            return this.objectString(obj) == '[object Array]';
        },
        isNumber: function (obj){
            return this.objectString(obj) == '[object Number]';
        },
        isBoolean: function (obj){
            return this.objectString(obj) == '[object Boolean]';
        },
        isString: function (obj){
            return this.objectString(obj) == '[object String]';
        },
        isFunction: function (obj){
            return this.objectString(obj) == '[object Function]';
        },
        isDate: function (obj){
            return this.objectString(obj) == '[object Date]';
        },
        // 是否是合法日期
        isValidDate: function (obj){
            return this.isDate(obj) && this.objectString() != 'Invalid Date';
        },
        // 不是日期，或者不是合法日期
        isInvalidDate: function (obj){
            return !this.isDate(obj) || this.objectString() == 'Invalid Date';
        },
        /**null、false、true、空字符串(以及所有都是空白字符的字符串) 使用传统的isNaN方法都返回false，使用这个方法将这些值排除
         * */
        isNaN: function(n){
            return n == null || this.isBoolean(n) || (this.isString(n) && /^\s*$/.test(n)) || window.isNaN(n);
        }
    };
})();