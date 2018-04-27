require("es6-promise").polyfill();
import axios from "axios";
module.exports = axios;
+function(axios){
    let config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    function response_then(response){
        // 相应的数据统一有success状态码，true|false ddd
        if(response.data){
            if(response.data.success){
                return response.data;
            }else{
                return Promise.reject(response.data);
            }
        }else return response;
    }
    function response_error(error){
        return Promise.reject(error);
    }
    function addDefauls(axios){
        for(let i in config){
            // axios.defauls[i] = config[i];
        }
        // 添加请求拦截器
        axios.interceptors.request.use(config => config, error => error);
        // 添加响应拦截器
        axios.interceptors.response.use(response_then, response_error);
        return axios;
    }
    addDefauls(axios);

    var _create = axios.create;
    axios.create = () => {
        let ajax = _create.apply(axios, arguments);
        return addDefauls(ajax);
    };

}(axios);