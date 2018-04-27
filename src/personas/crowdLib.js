/**人群管理api
 * Created by weikaiwei on 2017/9/10.
 */

import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import iView from "iview";
import axios from "../token-axios/axios";
import NumberFormat from "../../lib/plugin/util/Number";
import DateFormat from "../../lib/plugin/util/Date";
import Selection from "e:/workspace/plugins/src/components/selection";

Vue.use(Vuex);// 使用Vuex
Vue.use(VueRouter);// 使用路由器
Vue.use(iView);// 使用iView
Vue.component(Selection.name, Selection);
function getUrl(s) {
    return `/api/${s}`;
}
Object.assign(self, {Vue, Vuex, VueRouter, axios, getUrl, NumberFormat, DateFormat});

