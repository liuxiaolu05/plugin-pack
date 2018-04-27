/**
 * Created by weikaiwei on 2017/5/7.
 */
(function(){
    /* ajax默认配置 start */
    /**与后台接口的约定
     * 1、list接口（使用实体bean的接口）和get请求（使用requestParam的接口）使用 contentType = "application/x-www-form-urlencoded"
     * 2、其他请求使用contentType = "application/json"，后台使用@RequestBody注解
     * */
    (function($){
        var _ajax = $.ajax;
        if(!_ajax)return;
        $.ajaxSetup({
            dataType: "json",
            contentType: "application/json",
            cache: false
        });
        $.ajax = function(o){
            // if((o.type || $.ajaxSetup().type).toLowerCase() == "get"){
            //     o.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
            // }
            if((o.contentType || $.ajaxSetup().contentType) == "application/json" && o.data){
                o.data = JSON.stringify(o.data);
            }
            return _ajax(o);
        };

    }(window.Zepto || window.jQuery));

    // axios
    (function(axios){
        if(!axios)return;
        var config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        function response_then(response){
            return response.data;
        }
        function response_error(error){
            return Promise.reject(error);
        }
        function addDefauls(axios){
            for(var i in config){
                // axios.defaults[i] = config[i];
            }
            // 添加请求拦截器
            // axios.interceptors.request.use(config => config, error => error);
            // 添加响应拦截器
            axios.interceptors.response.use(response_then, response_error);
            return axios;
        }
        addDefauls(axios);
        var _create = axios.create;
        axios.create = function (){
            var ajax = _create.apply(axios, arguments);
            return addDefauls(ajax);
        };
    }(window.axios));
    /* ajax默认配置 end */
}());
