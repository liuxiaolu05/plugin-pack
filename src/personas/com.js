/**
 * Created by liuxiaolu on 2017/7/17.
 */
var subMenu=[
    { "name":"数据总览",
        "icon":"icon-Userinsightinto" ,
        "list":[
            {"name":"数据总览","url":"./overview/overview.html"}
        ]
    },
    {
        "name":"小区分析",
        "icon":"icon-Smartmarketing" ,
        "list":[
            {"key":"village","url":"./village/villageOverview.html"},
            {"key":"dataAnalysis","url":"./dataAnalysis/dataAnalysis.html"},
            {"key":"property","url":"./property/property-information.html"},
            {"key":"heatMap","url":"./heatMap/heatMap.html"}
        ]
    }
];
var comUtils = {
    toThousands: function (num) {
        /**
         * 千分制
         */
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    // 根据参数名称获取value
    getUrlParameter: function (paramKey) {
        var sURLVariables, i, sParameterName, sPageURL = window.location.search.substring(1);
        if (sPageURL) {
            sURLVariables = sPageURL.split("&");
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split("=");
                if (sParameterName[0] === paramKey) return sParameterName[1]
            }
        }else {
            return false
        }
    },
    slideChange:function(){
        var href=window.location.href;
        subMenu.forEach(function(val,index){
            val.list.forEach(function(v,i){
                var url=v.url.split('/')[1];
                if(href.indexOf(url)>-1){
                    window.parent.vm_.activeMenu=v.url;
                    window.parent.vm_.open=val.name
                }
            })
        })
    },
    getDefaultTime: function (num){
        var end = new Date(),start = new Date(),timeNum = 3600 * 1000 * 24;
        start.setTime(start.getTime() - timeNum * num);
        end.setTime(end.getTime() - timeNum);
        return {start:start, end:end};
    },
    initDate: function (num){
        var myDate = comUtils.getDefaultTime(num),
            start = myDate.start,
            end = myDate.end;

        var start_year = start.getFullYear(),
            start_month = parseInt(start.getMonth()) + 1,
            start_date = start.getDate(),
            startStr = start_year+"-"+ (start_month<10 ? '0' :'')+start_month+"-"+ (start_date < 10 ? '0' : '') + start_date;

        var end_year = end.getFullYear(),
            end_month = parseInt(end.getMonth()) + 1,
            end_date = end.getDate(),
            endStr = end_year + "-" + (end_month < 10 ? '0' :'') + end_month + "-" + (end_date < 10 ? '0' : '') + end_date;
        return {
            startTime: startStr,
            endTime: endStr
        }
    },
    help:function(obj,text,cont){
        obj.renderHeader=function (h){
            return h('div',
                {
                    style: {
                        display:'inline-block'
                    }

                },[
                    h('span',{

                    },text),
                    h('Tooltip',{
                        attrs:{
                            content:cont,
                            placement:'top'
                        },
                        style: {
                            display:'inline-block'
                        }
                    },[
                        h('Icon',{
                            attrs: {
                                //class:'iconfont icon-bangzhu1'
                                type:'ios-help-outline'
                            },
                            style:{
                                fontSize:'15px',
                                color:'#ccc',
                                marginLeft:'3px',
                                cursor:'pointer',
                                width:'16px',
                                height:'16px',
                                fontWeight:700,
                                verticalAlign:'middle'
                            }
                        })
                    ])
                ])
        }
    }
};
comUtils.slideChange();
~function (pro) {
    //判断是否存在于数据中
    pro.selfContains = selfContains;
    function selfContains(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }
}(Array.prototype);
Object.assign(self,{subMenu,comUtils});
