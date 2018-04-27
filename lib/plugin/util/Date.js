/**Date 返回一个Date对象，在该对象上重写了toString方法以便支持各种模式格式化方式
 * 添加了convert方法：可以使用指定模式来转换日期对象
 * 添加toDate方法：指定的日期对象的基础上进行日期时间上的偏移
 * Created by weikaiwei on 2016/12/19.
 */
import type from "./Type";
import extend from "./Extend";
function m(){
    var ext = {
        /**把字符串按照特定的模式解析成日期对象
         * @param dateString String|number时间戳 必须 日期字符串
         * @param format String 可选 解析格式。不传入则按照常规的方式解析
         * */
        parseDate: function(dateString, format){
            var date;
            if(type.isDate(dateString))date = dateString;
            // 时间戳
            else if(type.isNumber(dateString)){
                date = new Date(dateString);
            }else if(!format){
                date = new Date(dateString.replace(/[^\d\s:]+/g, "/").replace(/(\s)+/g, "$1"));
            }else{
                date = new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                var dateMap = {
                    y: "FullYear",
                    Y: "FullYear",
                    m: "Month",
                    M: "Month",
                    d: "Date",
                    D: "Date",
                    h: "Hours",
                    H: "Hours",
                    i: "Minutes",
                    I: "Minutes",
                    s: "Seconds",
                    S: "Seconds",
                }, charts = "", char1, char2, mode;
                for(var i = 0, l = format.length; i < l; i++){
                    char1 = format.charAt(i);
                    char2 || (char2 = char1);
                    // 只匹配设定的模式
                    if(dateMap[char1]){
                        // 模式切换了，比如从y变成m，设置日期的y，然后模式转到m，开始下一轮匹配
                        if(char1 != char2){
                            if(mode = dateMap[char2]){
                                date["set" + mode](mode == "Month" ? charts-1 : charts);
                                charts = "";
                            }
                        }
                        charts += dateString.charAt(i);
                        char2 = char1;
                    }
                }
                if(charts){
                    date["set" + dateMap[char1]](charts);
                }
            }
            if(type.isInvalidDate(date)) throw "日期格式不正确";
            return extend(date, ext);
        },
        /**把日期对象（或者是合法的日期字符串、时间戳）转换成指定模式的日期对象
         * @param format 日期格式化模式 模式匹配过程严格按照年月日时分秒（YMDHis）的顺序（format中只要出现就行），只要一个模式匹配不上，该模式后面的模式全部忽略
         * 无参数：this是被转换的日期对象
         * 1个参数：第一个是转换的格式，this是被转换的日期对象
         * 2个参数：第一个是要转换的日期对象，第二个是转换的格式
         * */
        convert: function(date, format){
            if(arguments.length < 2){
                if(type.isDate(this)){
                    date = this;
                    format = "YMDHis";
                }else{
                    date = this;
                }
            }
            if(type.isInvalidDate(date)){
                if(type.isString(date)){
                    date = new Date(date.replace(/[^\d\s:]+/g, "/").replace(/(\s)+/g, "$1"));
                }else if(date == undefined){
                    date = new Date();
                }else {
                    date = new Date(date);//其它格式，比如时间戳等
                }
            }
            //先把对象转换成普通的日期对象，然后再转成指定格式的日期对象
            var map = [["Y", "YYYY"], ["M", "/MM"], ["D", "/DD"], ["H", " HH"], ["i", ":ii"], ["s", ":ss"]]
                , char, chars = "";
            if(format){
                for(var i = 0, l = map.length; i < l; i++){
                    char = map[i];
                    // 只要一个模式匹配不上，该模式后面的模式全部忽略
                    if(format.indexOf(char[0]) == -1)break;
                    chars += char[1];
                }
                date = new Date(this.toString(date, chars));
            }
            return extend(date, ext);
        },
        /**把日期对象（或者是合法的日期字符串、时间戳）格式化输出成指定的模式字符串
         * 支持2个参数：
         * 无参数：this是被转换的日期对象
         * 1个参数：第一个是转换的格式，this是被转换的日期对象
         * 2个参数：第一个是要转换的日期对象，第二个是转换的格式
         * */
        toString: function (date, format) {
            arguments.length < 2 && (format = date, date = this);
            date instanceof Date || (date = this.parseDate(date));
            function dateFormat(n, len){
                var arr = n.toString().split("."), integer = arr[0], decimal = arr[1];
                for(var i = 0, l = len - integer.length; i < l; i++){
                    integer = "0" + integer;
                }
                return integer;
            }
            var reg = /Y{1,4}|M{1,2}|D{1,2}|H{1,2}|i{1,2}|s{1,2}/ig,
                y = date.getFullYear(),
                M = date.getMonth() + 1,
                d = date.getDate(),
                h = date.getHours(),
                m = date.getMinutes(),
                s = date.getSeconds(),
                arr = [y, M, d, h, m, s], map = "YMDHIS";
            return (format || "YYYY-MM-DD HH:II:SS").replace(reg, function(a){
                var f = a.charAt(0).toUpperCase(), index = map.indexOf(f);
                return f == "Y" ? arr[index].toString().slice(-a.length) : dateFormat(arr[index], a.length);
            });
        },
        /**在指定的日期对象的基础上进行日期时间上的偏移
         * 指定一个日期，给定一个偏移量，计算出指定日期在指定的日上偏移后的新日期对象
         * @param date，Date 指定的日期，只有一个参数的情况下this指代date
         * @param offset, Object 偏移量{year: , month: , date: }
         *      如果offset是数值类型，则视为天数
         * @return 返回偏移后的日期对象，不改变当前日期对象
         * */
        toDate: function (date, offset) {
            arguments.length < 2 && (offset = date, date = this);
            date = this.parseDate(date || new Date);
            offset || (offset = 0);
            typeof offset == "number" && (offset = {year: 0, month: 0, date: offset, hour: 0, minute: 0, second: 0});
            return this.parseDate(new Date(date.getFullYear() + (offset.year || 0), date.getMonth() + (offset.month || 0), date.getDate() + (offset.date || 0), date.getHours() + (offset.hour || 0), date.getMinutes() + (offset.minute || 0), date.getSeconds() + (offset.second || 0)));
        },
        /**给出一组参数，批量重置日期对应的值
         * @param date，Date 指定的日期，只有一个参数的情况下this指代date
         * @param options, Object 重置参数{year: , month: 0—11, date: ,hour: , minute, second: }
         * @return 返回重置后的日期对象，不改变当前日期对象
         * */
        set: function(date, options){
            arguments.length < 2 && (options = date, date = this);
            date = this.parseDate(date || new Date);
            options || (options = 0);
            typeof options == "number" && (options = {year: 0, month: 0, date: options, hour: 0, minute: 0, second: 0});
            return this.parseDate(new Date(
                options.hasOwnProperty("year") ? options.year : date.getFullYear(),
                options.hasOwnProperty("month") ? options.month : date.getMonth(),
                options.hasOwnProperty("date") ? options.date : date.getDate(),
                options.hasOwnProperty("hour") ? options.hour : date.getHours(),
                options.hasOwnProperty("minute") ? options.minute : date.getMinutes(),
                options.hasOwnProperty("second") ? options.second : date.getSeconds()
            ));
        },
        /**获取当前的日期（默认YMDHis），支持format模式
         * */
        now: function(format){
            var now = new Date();
            return format ? this.convert(now, format) : extend(now, ext);
        },
        toNative: function(date){
            arguments.length < 1 && (date = this);
            return new Date(date.getTime());
        }
    };
    /**支持使用函数调用的方式和new方式来生成一个对象实例
     * 原生Date对象初始化最多支持6个参数
     * */
    function F(){
        //先返回一个日期对象，然后重写这个日期对象的方法
        var date;
        switch (arguments.length){
            case 1:
                if(type.isString(arguments[0])){
                    date = ext.parseDate(arguments[0]);
                }else{
                    date = new Date(arguments[0]);
                }
                break;
            case 2:
                if(type.isString(arguments[0]) && type.isString(arguments[1])){
                    date = ext.parseDate(arguments[0], arguments[1]);
                }else{
                    date = new Date(arguments[0], arguments[1]);
                }
                break;
            case 3: date = new Date(arguments[0], arguments[1], arguments[2]);break;
            case 4: date = new Date(arguments[0], arguments[1], arguments[2], arguments[3]);break;
            case 5: date = new Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);break;
            case 6: date = new Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);break;
            default: date = new Date();
        }
        extend(date, ext);
        return date;
    }
    extend(F, Date, ext);
    return F;
}
export default m();
