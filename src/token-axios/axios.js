require("es6-promise").polyfill();
import axios from "axios";
+function(axios){
    let config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    function request_then(config) {
        config.timeout = 15000 ;
        // ((config.method == 'get' && config.params && config.params.loading) || (config.method == 'post' && config.data && config.data.loading)) && layer.load(1, { shade: [0.1,'#fff']});
        return config
    }
    function response_then(response){
        // 相应的数据统一有success状态码，true|false ddd
        ( response.config.hasOwnProperty('unload') && response.config.unload) && layer.closeAll('loading');
        if(response.data){
            if(response.data.code == 501){
                top.location.href = getUrl("login.html");
            }else return response.data;
        }else return response;
    }
    function response_error(error){
        layer.closeAll('loading');//关闭loading状态
        if(error.message.indexOf('timeout') > -1){
            layer.alert('请求超时,请稍后再查', {title:'提示信息',icon: 0});
            return
        }
        /* 判断token错误 登录页 如果状态码==501返回到登录页*/
        if(error.code == 501){
            top.location.href = getUrl("login.html");
        }return Promise.reject(error);
    }
    function addDefauls(axios){
        Object.assign(axios.defaults, config);
        // 添加请求拦截器
        axios.interceptors.request.use(request_then, error => error);
        // 添加响应拦截器
        axios.interceptors.response.use(response_then, response_error);
        return axios;
    }
    addDefauls(axios);
    let _create = axios.create;
    axios.create = (...args) => addDefauls(_create.apply(axios, args));
    /*
    * loading-> true 加载loading
    * unload-> true 关闭loading
    * */
    let _post = axios.post;
    axios.post = (url, data, params) => {
        ( params && params.loading) && layer.load(1, { shade: [0.3,'#fff']});
        return _post.call(axios, url, data, params)
    };
    let _get = axios.get;
    axios.get = (url, params) => {
        ( params && params.loading) && layer.load(1, { shade: [0.3,'#fff']});
        return _get.call(axios, url, params)
    };
}(axios);
export default axios;