/**
 * Created by weikaiwei on 2017/1/10.
 */
export default function extend() {
    var target = arguments[0] || {},//目标对象
        e = false,//是否进行深拷贝
        h = 1,//参数个数
        n = arguments.length,//实际传入的参数个数
        temp;// 临时保存源参数

    if (typeof target == 'boolean') {
        e = arguments[0];
        target = arguments[1] || {};
        //skip the boolean and target
        h = 2;
    }
    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && typeof target !== "function")
        target = {};
    // extend object itself if only one argument is passed
    if (n == h) {
        target = this;
        --h;
    }
    for (; h < n; h++) {
        temp = arguments[h];
        if (typeof temp != null) {
            for (var t in temp) {
                var src = target[t], copy = temp[t];
                // Prevent never-ending loop
                if (target === copy)
                    continue;
                if (e && temp[t] && typeof temp[t] == "object" && !temp[t].nodeType) {
                    //进行深拷贝
                    target[t] = extend(e, (src || {}), temp[t]);
                } else {
                    //浅拷贝
                    if (temp[t] != undefined) {
                        target[t] = temp[t];
                    }
                }
            }
        }
    }
    return target;
};
