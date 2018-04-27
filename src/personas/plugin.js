/**
 * Created by liuxiaolu on 2017/11/1.
 */
import jQuery from "jquery";
Object.assign(self, { jQuery, $: jQuery});
import token from "../token-axios/jquery.cookie";
token(jQuery);
require("../../lib/lib/layer/layer");