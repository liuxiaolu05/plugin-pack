/**
 * Created by weikaiwei on 2017/7/20.
 */
import Vue from "vue";
import jQuery from "../../lib/lib/jquery/jquery.common";
import axios from "../../lib/lib/axios";
require("fastclick");
Object.assign(window, {Vue, jQuery, $: jQuery, axios});