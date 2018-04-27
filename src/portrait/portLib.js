/**
 * Created by weikaiwei on 2017/5/15.
 */
import Vue from "vue";
import MintUI from 'mint-ui';
import jQuery from "jquery";
import axios from "./axios";
import NumberFormat from "../plugins/util/Number";
import DateFormat from "../plugins/util/Date";
require("../plugins/commonAPI.js");
require("../plugins/models/ListData.js");
require("bootstrap");
Vue.use(MintUI);
require("extend")(self, {Vue, axios, jQuery, $: jQuery, NumberFormat, DateFormat});
require("./defaultConfig");