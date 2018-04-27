/**
 * Created by liuxiaolu on 2017/7/7.
 */

import Vue from "vue";
import VueRouter from "vue-router";
import {VeeValidate, config} from '../../lib/plugin/vee-validate';
import iView from "iview";
import axios from "../token-axios/axios";
var Echarts = require("../../lib/lib/echarts/echarts.common.min").echarts;
require("./com");

Vue.use(VueRouter);// 使用路由器
Vue.use(iView);//依赖
// 校验框架
Vue.use(VeeValidate, config);
function getUrl(s){
    return `/api/${s}`;
}
Object.assign(self, {Vue, VueRouter, axios, Echarts, getUrl});

