/**对vee-validate校验插件使用统一配置
 * 1、中文提示的统一配置
 * Created by weikaiwei on 2017/8/13.
 */
import VeeValidate from 'vee-validate';
import messages from './zh_CN';
VeeValidate.Validator.updateDictionary({
    zh_CN: messages
});
const config = {
    errorBagName: 'errors', // change if property conflicts.
    delay: 0,
    locale: 'zh_CN',
    messages: null,
    strict: true
};
export {VeeValidate, config};