require("es6-promise").polyfill();
import axios from "axios";
(function(axios){
    let config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    function response_then(response){
        // 相应的数据统一有success状态码，true|false ddd
        if(response.data){
            // if(response.data.code == 0){
                return response.data;
            // }else{
                // return Promise.reject(response.data);
            // }
        }else return response;
    }
    function response_error(error){
        return Promise.reject(error);
    }
    function addDefauls(axios){
        Object.assign(axios.defaults, config);
        // 添加请求拦截器
        axios.interceptors.request.use(config => config, error => error);
        // 添加响应拦截器
        axios.interceptors.response.use(response_then, response_error);
        return axios;
    }
    addDefauls(axios);
    let _create = axios.create;
    axios.create = (...args) => addDefauls(_create.apply(axios, args));

}(axios));
export default axios;