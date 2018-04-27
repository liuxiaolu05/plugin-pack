/**对原始的number的一些方法的扩展。并不是直接扩展原始的number原型链，而是包装一下需要的Number对象，在该对象上进行方法扩展。
 * 模式关键字：
 * d：数字，位数是实际位数
 * 0：数字，位数不足补0
 * 小数部分（默认四舍五入）：
 * +：向上取整
 * -：向下取整
 * /：截断
 * 扩展的方法如下
 * toString：1、保留小数点的功能；2、数字加上分隔符的功能；3、数字加上掩码的功能（123456789  --> 12****89）
 * Created by weikaiwei on 2016/12/1.
 */
import type from "./../Type";
import extend from "./../Extend";
function m(){
        var ext = {
            /**把可转成数字的对象转换成扩展的Number对象
             * */
            parse: function(){
            },
            /**round、trunc、ceil、floor方法的统一封装
             * @param name String 必须 调用的方法名（round、trunc、ceil、floor中的一种）
             * @number Number 被操作的数，省略的时候使用this
             * @fixed Integer 截断开始的小数位，默认不要小数位
             * */
            merge: function(name){
                var number, fixed, unit, pow;
                /**如果有2个参数
                 * 1、第二个参数是fixed，被操作数是this（this必须是Number类型，否则认为是第二种情况）
                 * 2、第二个参数是被操作数，无fixed
                 * 3、第一个参数是被操作数，第二个参数是fixed
                 * */
                if(arguments.length == 2 && type.isNaN(this)){
                    number = arguments[1];
                }
                // 第二种情况
                else if(arguments.length < 3){
                    number = this;
                    fixed = arguments[1];
                }else{
                    number = arguments[1];
                    fixed = arguments[2];
                }
                // 不指定fixed默认是0
                fixed = Math.floor(fixed);
                fixed >= 0 || (fixed = 0);
                pow = Math.pow(10, fixed);
                unit = number < 0 ? -1 : 1;
                return Math[name](number * pow * unit) / pow * unit;
            },
            /**只入不舍
             * @n Number 被操作的数，省略的时候使用this
             * @fixed Integer 截断开始的小数位，默认不要小数位
             * */
            ceil: function(){
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift("ceil");
                return this.merge.apply(this, args);
            },
            /**只舍不入
             * @n Number 被操作的数，省略的时候使用this
             * @fixed Integer 截断开始的小数位，默认不要小数位
             * */
            floor: function(){
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift("floor");
                return this.merge.apply(this, args);
            },
            /**四舍五入（负数是5入6舍）
             * @n Number 被操作的数，省略的时候使用this
             * @fixed Integer 截断开始的小数位，默认不要小数位
             * */
            round: function(){
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift("round");
                return this.merge.apply(this, args);
            },
            /**小数点截断。es6中Math.trunc
             * @n Number 被操作的数，省略的时候使用this
             * @fixed Integer 截断开始的小数位，默认不要小数位
             * */
            trunc: function(){
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift("trunc");
                return this.merge.apply(this, args);
            },
            /**数字添加分隔符（默认是千位分隔符）
             * 支持2个参数：Number对象、配置参数
             * Object类型的视为配置参数，其他类型视为带转换成Number的对象
             * 如果参数中没有可视为Number的对象，this指代Number对象
             * */
            term: function (number, o){
                var formatStr, split, char, fixed, fixedMode, arr, integer, decimal;
                //Object类型的视为配置参数，其他类型视为可转换成Number的对象
                /**number参数不是预期的数值类型（或可转换成数值类型的字符串）
                 * 1、如果this是数值类型/对象，赋值给number参数；否则返回""
                 * 2、如果number是object类型，视为配置参数
                 */
                if(arguments.length < 2 && this.constructor == F){
                    o = number;
                    number = this;
                }
                if(type.isNaN(number)){
                    if(type.isNaN(this))return "";
                    type.isPlainObject(number) && (o = number);
                    number = this;
                }
                number = new F(number);
                if(type.isNumber(o))o = {fixed: o};
                o = extend({split: 3, char: ",", fixed: 0, prefix: "", fixedMode: 0, force: 1}, o);
                split = o.split, char = o.char, fixed = o.fixed;
                /**小数保留方式。默认（四舍五入）；1（截断）；2（只入不舍）；3（只舍不入）
                 * 1、四舍五入和向上取整的保留方式都可能会进位到个位数上，整数部分需要加上进位的数（1）
                 * */
                number = this[["round", "trunc", "ceil", "floor"][o.fixedMode]](number, fixed);
                //计算整数和小数部分的时候尽量避免算数运算，避免浮点数计算的精度不准问题
                arr = number.toString().split("."), integer = arr[0], decimal = arr[1] || "";
                decimal.replace(/^0(\.?)/, "$1");
                if(o.force){// 小数部分强制保留和fixed相同的位数，不足补0
                    for(var l = decimal.length; l < fixed; l++){
                        decimal += "0";
                    }
                }
                decimal = decimal.substring(0, fixed == 0 ? 0 : fixed + 1);//小数点占一位长度
                formatStr = integer.replace(new RegExp("(\\d)(?=(?:\\d{" + split +"})+$)", "g"), "$1" + char);
                decimal = formatStr + (decimal ? "." + decimal : "");
                return decimal.length ? (o.prefix + decimal) : "";
            },
            /**去掉分隔符
             * */
            determ: function(str, char){
                var reg = char instanceof RegExp ? char : new RegExp(char || ",", "g");
                return type.isString(str) ? str.replace(/\s/g, "").replace(reg, "") : str;
            }
        };
        /**支持使用函数调用的方式和new方式来生成一个对象实例
         * */
        function F(a){
            //先创建一个原始的Number对象实例，然后在实例的基础上添加扩展方法
            var obj = new Number(a);
            extend(obj, ext);
            return obj;
        }
        extend(F, Number, ext);
        return F;
}
export default m();
