/**
 * Created by weikaiwei on 2017/6/6.
 * 依赖axios的api
 * 必要参数：1、ajax对象；2、setData方法
 */
window.ListData = (function(){
    function ListData(o){
        this.initData = o;
        this.clearData();
    }
    ListData.prototype = {
        // get: function (){}, // 向服务器端发送请求，需要根据实际情况进行重写
        /**具体发送请求的方法，如有需要可以进行重写
         * */
        get: function (params){
            return this.ajax.get(this.url, {params: params});
        },
        setData: function(){}, // 需要根据实际情况进行重写
        /**
         * 如果请求响应的时间太短，比如会造成页面loading闪烁，可以设置during参数让请求响应过程的时间不短于during
         * @param p 发送到服务器端的参数
         * @param o 修改ListData对象的属性
         * */
        load: function(p, o){
            var params, i, dataCollection = this, startTime = new Date().getTime();
            dataCollection.state.data = 1;
            dataCollection.state.result = 0;
            dataCollection.state.complete = 1;
            if(o){
                for(i in o){
                    this[i] = o[i];
                }
            }
            params = {pageSize: this.pageSize, currPage: this.currPage < 1 ? i : this.currPage};
            // 保存每次搜索的参数
            this.params = p;
            if(p){
                for(i in p){
                    params[i] = p[i];
                }
            }
            function delay(callback){
                var t = dataCollection.during - (new Date().getTime() - startTime);
                return t > 0 ? new Promise(function(resolve){
                    setTimeout(function() {
                        resolve(callback());
                    }, t);
                }) : callback();
            }
            return this.get(params).then(function(data){
                return delay(function(){
                    dataCollection.state.data = 2;
                    return dataCollection.setData && dataCollection.setData(data);
                });
            }).catch(function(){
                return delay(function(){
                    dataCollection.state.data = 3;
                });
            }).then(function(list){
                if(dataCollection.action == "nextPage"){
                    list && (list = (dataCollection.data || []).concat(list));
                }
                dataCollection.state.complete = 2;
                dataCollection.data = list || (dataCollection.type == "array" ? [] : {});
                dataCollection.state.result = function(data){
                    if(data){
                        for(var i in data){
                            return true;
                        }
                    }
                    return false;
                }(list);
            });
        },
        /**刷新数据
         * */
        refresh: function(){
            this.currPage = 1;
            this.action = "refresh";
            return this.load(this.params);
        },
        /**加载下一页的数据
         * */
        nextPage: function(){
            if(this.totalPage >= this.currPage + 1){
                this.currPage++;
                this.action = "nextPage";
                return this.load(this.params);
            }
            return {
                then: function(callback){
                    return {
                        catch: function(callback){
                            return (typeof callback == "function") && callback({allLoaded: true});
                        }
                    }
            }};
        },
        /**把数据设置成初始状态
         * */
        clearData: function(){
            var defaults = {
                state: {
                    data: 0, // 数据加载状态：0：未开始；1：加载中；2：加载成功；3：加载失败
                    complete: 0, // 数据加载状态是否完成。0：初始状态；1：加载中；2：加载完成
                    result: 0 // 是否有数据。0：无数据；1：有数据
                },
                type: "array",
                // ajax: null, // 请求数据需要提供一个axios对象   不重置
                // url: null, // 不重置
                during: 400, // 请求响应时间至少during毫秒
                params: null,
                // data: [],
                pageSize: 10,
                currPage: 1,
                totalCount: 0,
                totalPage: 0
            }, dataType = {
                array: [],
                object: {}
            }, i;
            for(i in defaults){
                this[i] = defaults[i];
            }
            if(this.initData){
                for(i in this.initData){
                    this[i] = this.initData[i];
                }
            }
            this.data = dataType[this.type] || [];
        }
    };
    return ListData;
}());