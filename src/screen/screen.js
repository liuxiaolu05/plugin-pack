/**
 * Created by weikaiwei on 2017/7/7.
 */
import Vue from "vue";
import jQuery from "../../lib/lib/jquery/jquery.common";
import echarts from "../../lib/lib/echarts/echarts.common.min";
import axios from "../../lib/lib/axios";
import ObjectModel from "../../lib/plugin/model/ObjectModel";
import NumberFormat from "../../lib/plugin/util/Number";
import DateFormat from "../../lib/plugin/util/Date";
Object.assign(window, {Vue, jQuery, $: jQuery, echarts, axios, ObjectModel, NumberFormat, DateFormat});