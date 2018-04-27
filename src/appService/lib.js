/**
 * Created by weikaiwei on 2017/8/7.
 */
import Vue from "vue";
import VueRouter from "vue-router";
import iview from "iview";
import {VeeValidate, config} from '../../lib/plugin/vee-validate';
import treeMenu from '../../lib/component/treeMenu';
// 使用带动画模块的版本，jquery.ztree插件需要
import jQuery from "../../lib/lib/jquery/jquery.more";
require("../token-axios/jquery.cookie")(jQuery);
import axios from "../token-axios/axios";
import NumberFormat from "../../lib/plugin/util/Number";
import DateFormat from "../../lib/plugin/util/Date";

// 自定义路由机制
require("../../lib/plugin/router");

Vue.use(VueRouter);
// 树组件
Vue.component(treeMenu.name, treeMenu);
Vue.use(iview);
// 校验框架
Vue.use(VeeValidate, config);

function getUrl(s){
    return `/api/${s}`;
}

Object.assign(self, {Vue, VueRouter, VeeValidate, axios, NumberFormat, DateFormat, getUrl});
