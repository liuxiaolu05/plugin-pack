/**
 * Created by weikaiwei on 2017/5/15.
 */
import Vue from "vue";
import VueRouter from 'vue-router';
import MintUI from 'mint-ui';
// import iView from 'iview';
import {Table} from "iview";
import axios from "./axios";
import NumberFormat from "../plugins/util/Number";
import DateFormat from "../plugins/util/Date";

// Vue.use(VueRouter);
Vue.use(MintUI);
// Vue.use(iView);
Vue.component("i-table", Table);
+function(args){
    for(var i in args){
        window[i] = args[i];
    }
}({Vue, axios, NumberFormat, DateFormat});