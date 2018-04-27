/**对个别规则的提示语获取方法重写，把英文的字段提示通过参数修改成中文提示
 * Created by weikaiwei on 2017/8/13.
 */
export default {
    name: "zh_CN", messages: {
        after: function (n, e) {
            return " " + n + "必须在" + e[0] + "之后"
        }, alpha_dash: function (n) {
            return " " + n + "能够包含字母数字字符，包括破折号、下划线"
        }, alpha_num: function (n) {
            return n + " 只能包含字母数字字符."
        }, alpha_spaces: function (n) {
            return " " + n + " 只能包含字母字符，包括空格."
        }, alpha: function (n) {
            return " " + n + " 只能包含字母字符."
        }, before: function (n, e) {
            return " " + n + " 必须在" + e[0] + " 之前."
        }, between: function (n, e) {
            return " " + n + " 必须在" + e[0] + " " + e[1] + "之间."
        }, confirmed: function (n, e) {
            return " " + n + " 不能和" + e[0] + "匹配."
        }, date_between: function (n, e) {
            return " " + n + "必须在" + e[0] + "和" + e[1] + "之间."
        }, date_format: function (n, e) {
            return " " + n + "必须在在" + e[0] + "格式中."
        }, decimal: function (n, e) {
            void 0 === e && (e = ["*"]);
            var t = e[0];
            return " " + n + " 必须是数字的而且能够包含" + ("*" === t ? "" : t) + " 小数点."
        }, digits: function (n, e) {
            return " " + n + " 必须是数字，且精确到 " + e[0] + "数"
        }, dimensions: function (n, e) {
            return " " + n + "必须是 " + e[0] + " 像素到 " + e[1] + " 像素."
        }, email: function (n) {
            return " " + n + " 必须是有效的邮箱."
        }, ext: function (n) {
            return " " + n + " 必须是有效的文件."
        }, image: function (n) {
            return " " + n + " 必须是图片."
        }, in: function (n) {
            return " " + n + " 必须是一个有效值."
        }, ip: function (n) {
            return " " + n + " 必须是一个有效的地址."
        }, max: function (n, e) {
            return " " + n + " 不能大于" + e[0] + "字符."
        }, mimes: function (n) {
            return " " + n + " 必须是有效的文件类型."
        }, min: function (n, e) {
            return " " + n + " 必须至少有 " + e[0] + " 字符."
        }, not_in: function (n) {
            return " " + n + "必须是一个有效值."
        }, numeric: function (n) {
            return " " + n + " 只能包含数字字符."
        }, regex: function (n) {
            return " " + n + " 格式无效."
        },
        /**重写校验规则
         * @param n String 字段的name名称
         * @param b Array 规则传递的参数集合。第一个元素是中文名称
         * */
        required: function(n, b){
            return (b && b[0] || "该字段") + "不能为空";
        },
        size: function (n, e) {
            return " " + n + " 必须小于 " + e[0] + " KB."
        }, url: function (n) {
            return " " + n + "不是有效的url."
        }
    }, attributes: {}
};