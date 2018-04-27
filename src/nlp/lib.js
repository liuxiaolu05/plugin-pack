/**
 * Created by liuxiaolu on 2017/7/4.
 */
import jQuery from "jquery";
import Vue from "vue";
import elementUI from "element-ui";

Vue.use(elementUI);//依赖
Object.assign(self, {jQuery, $: jQuery, Vue});