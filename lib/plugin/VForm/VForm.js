/**VForm --> Validate Form  使用amd规范编写，依赖jQuery
 * 支持函数调用和new操作符2种方式来生成VForm对象
 * 在指定的DOM作用域内（默认是根元素）：
 * 1、配置：指定DOM作用域，指定所有的元素数据和dom的映射关系
 * 2、赋值：按照指定的规则给元素映射value；
 * 3、取值：按照规则获取元素们的value集合，形成一个对象。过程中会根据元素配置的规则进行校验，自动生成错误提示。
 * 附带一个form提交的方法：有些情况下不能使用ajax方式提交数据
 * Created by weikaiwei on 2016/10/27.
 */
(function($){
    function m($, type){
        /**支持使用函数调用的方式和new方式来生成一个VForm对象
         * */
        function F(o){
            var vForm = {
                    _serial: Math.random().toString().substr(2),// 随机数整数化作为序列号
                    $scope: $(document),
                    /**数组类型，所有的字段声明。以下是每个字段的配置说明：
                     * name：字段名称，dom结构中应该有一个name等于这个配置的dom元素。特殊情况下也可以没有，比如一个日期元素映射2个字段（开始时间、结束时间），一个下拉也可能映射value和text
                     * get：字段值的get访问器。可以使用内置的get规则（"value"、"text"、"html"、"input"等等），也可以使用配置函数实现自定义的取值方式
                     * set: 字段值的set访问器。可以使用内置的set规则（"value"、"text"、"html"、"input"等等），也可以使用配置函数实现自定义的设值方式
                     * as：字段的取值/设置值的规则。如果字段的取值和设置值的方式都一样，比如输入框都是value，就不需要同时设置get和set字段的类型，笼统的使用as配置即可。get、set中任何一个，没有声明，都会自动使用as的声明
                     * type：字段值的类型。dom中的值默认都是字符串类型，在使用get/set的时候会根据声明转换成对应的类型。
                     * rule：校验规则。允许在html结构中声明data-rule，同时也可以在js的字段定义中声明“rule”。2者都定义以js中定义的为准。
                     *       规则可以是一个key（字符串，也可以是一串以空白字符分隔的多个规则id），对应的实现部分可以在全局的rules中，也可以在字段的私有rules中。
                     *       规则可以是一个直接实现检验的方法（匿名处理器），返回真值表示校验通过，否则表示失败。例：
                     *          @param value 当前字段的值
                     *          @param fieldName 当前字段的名称
                     *          @param data 其它已经通过检验的字段
                     *          @return boolean
                     *          函数中的this引用: {vForm: , value: 同上, filedName: 同上, data: 同上, tip: 方法体中设置使用的tip提示关键字, sg: 方法体m中设置的提示语，优先errorTip}
                     *          function(v){}
                     *       规则可以是一个数组，每个成员对象都只能是上述2种类型。
                     * rules：rule字段包含规则的key，rules中包含于key对应的具体校验方法。支持正则表达式和function校验器（同rule中的function规则）。
                     * wrap：包装处理器function。get --> rule --> rules --> wrap，校验成功后可以对字段值作进一步处理，比如说一个元素映射多个字段，元素自身可以不被包含到表单的data中。
                     *      @param value 当前字段的值（已经通过了校验）
                     *      @param data 按照声明顺序，当前已经通过校验的字段集合对象
                     *      this {vForm: , data: 同data, filedName: 当前字段的名称, item: 字段声明的field配置}
                     *      最好不要改变this中的内容
                     *      function(value, data){}
                     *
                     * */
                    fields: null,
                    rules: {
                        // 正则表达式不能校验出null和undefined
                        require: function(v){
                            return v != null && /\S+/.test(v.toString());
                        },
                        text: /^[\u4e00-\u9fa5\w]+$/,

                        //所有校验器验证空字符串的时候都返回true，表示可以没有值，如果有的话就必须正确。必需有值请配合使用require规则。
                        //数字，正负实数和0
                        number: /^([+-]?\d+?(\.\d*)?)?$/,
                        //正数（positive）pnumber
                        //负数（negative）nnumber
                        //非负数，无符号实数（0和正数）unumber
                        //非正数（0和负数）mnumber

                        //整数
                        int: /^([+-]?\d+)?$/,
                        //正整数（positive integer）
                        pint: function(v){return v === "" || /^\d+$/.test(v) && Number(v) > 0;},
                        //负整数（negative integer）
                        nint: function(v){return v === "" || /^-\d+$/.test(v) && Number(v) < 0;},
                        //非负整数，无符号整数（0和正整数）
                        uint: function(v){return v === "" || /^\d+$/.test(v) && Number(v) >= 0;},
                        //非正整数（0和负整数）
                        mint: function(v){return v === "" || /^-\d+$/.test(v) && Number(v) <= 0;}
                    },
                    errorTarget: null,//数组。校验的时候存放所有校验失败的dom元素
                    _exclude: null,//校验的时候设置一些可以不用校验的dom元素（保存的时候全部要校验，计算的时候人群名称不用校验）
                    set exclude(v){
                        if(!v){
                            this._exclude = [];
                        }else if(v instanceof Array){
                            this._exclude = v;
                        }else if(typeof v == "string"){
                            this._exclude = [v];
                        }
                    },
                    get exclude(){
                        return this._exclude || [];
                    },
                    find: function(){
                        return this.$scope.find.apply(this.$scope, arguments);
                    },
                    getElement: function(name){
                        type.isArray(name) || (name = [name]);
                        var $scope = this.$scope, $array = $();
                        name.forEach(function(item){
                            $array = $array.add($scope.find('[name=' + item + ']').filter(function(){return !$(this).data("forsubmit")}));
                        });
                        return $array;
                    },
                    getElementTip: function(name){
                        type.isArray(name) || (name = [name]);
                        return this.getElement(name.map(function(item){return item + '-error';}));
                    },
                    /**让浏览器定位到指定的元素上
                     * @param e 被定位的元素
                     * number类型，获取与fields中声明的顺序与指定索引相同的元素；
                     * string类型，默认定位到第一个校验不通过的元素身上
                     * */
                    locateElement: function(e){
                        var vForm = this, isNumber = type.isNumber(e), isString = type.isString(e);
                        if(isString || isNumber){
                            this.fields && this.fields.some(function(item, i){
                                if(isNumber && i == e || item.name == e){
                                    e = vForm.getElement(item.name)[0];
                                    return true;
                                }
                            });
                        }
                        //找不到合适的元素就不定位
                        if(e){
                            e.scrollIntoViewIfNeeded ? e.scrollIntoViewIfNeeded() : e.scrollIntoView();
                            //如果错误元素可以聚焦，并且非禁用和只读，让该元素获得焦点
                            ($(e).prop("disabled") || $(e).attr("disabled")) && !$(e).prop("readonly") && type.isFunction(e.focus) && e.focus();
                        }
                    },
                    //获取指定元素的值，未实现
                    getElementData: function(name){
                        return this.$scope.find('[name=' + name + ']');
                    },
                    /**数据的类型转换器
                     * */
                    dataConvert: function(value, vtype){
                        switch (vtype){
                            case "number":
                                return /^[+-]?\d+?(\.\d*)?$/.test(value) ? Number(value) : value;
                            case "boolean":
                                return !!value;
                            case "string":default:
                            return value == undefined ? value : value.toString();
                        }
                    },
                    _data: null,
                    _setData: function(v){
                        var vForm = this;
                        this._data = v;
                        //设置所有表单的值
                        this.fields.forEach(function(item){
                            var name = item.name, value =  vForm.dataConvert(v[name] === null || v[name] === undefined ? item.defaultValue : v[name], item.type),
                                $dom = vForm.getElement(name), set = item.set || item.as, outParam = {};
                            if(typeof set == "function"){
                                set.call(outParam, $dom, value, vForm, item);
                            }else{
                                switch(set){
                                    case "value":case "input"://文本框，编辑的时候如果是个空值，默认保持文本框中原有的值（默认值）
                                    value && $dom.val(value);
                                    break;
                                    case "radio":
                                        $dom.each(function(){
                                            $(this).prop("checked", $(this).val() === value);
                                        });
                                        break;
                                    case "checkbox"://checkbox是复选值，逗号分隔格式
                                        var arrValue = value.split(",");
                                        $dom.each(function(){
                                            $(this).prop("checked", arrValue.indexOf($(this).val()) > -1);
                                        });
                                        break;
                                    case "i-radio":
                                        $dom.each(function(){
                                            $(this).iCheck($(this).val() === value ? "check" :"uncheck");
                                        });
                                        break;
                                    case "i-checkbox"://checkbox是复选值，逗号分隔格式
                                        var arrValue = value.split(",");
                                        $dom.each(function(){
                                            $(this).iCheck(arrValue.indexOf($(this).val()) > -1 ? "check" :"uncheck");
                                        });
                                        break;
                                    case "html":
                                        $dom.html(value);
                                        break;
                                    case "text":
                                        $dom.text(value);
                                        break;
                                }
                            }
                        });
                    },
                    _getData: function(){
                        var vForm = this, _getData = {};
                        this.$scope.find('.error-tip').addClass("hide");
                        this.errorTarget = [];
                        //基本的表单元素使用循环一边获取它们的值一边校验。只要有一个校验错误，整个校验都是不通过的。按照需求需要继续把所有的错误都交验出来
                        this.fields.forEach(function(item){
                            var $target, fieldName = item.name, values, get = item.get || item.as, vResult = 1,
                                outParam = {vForm: this, data: _getData, filedName: fieldName, item: item};
                            if(vForm.exclude.indexOf(fieldName) > -1) return;
                            if(item.hasOwnProperty("for")){
                                $target = vForm.getElement(item.for);
                            }else $target = vForm.getElement(fieldName);
                            outParam.$el = $target;
                            if(type.isFunction(get)){
                                values = get.call(outParam, $target, vForm, _getData);
                            }else{
                                values = $target.map(function(){//表单元素radio和checkbox都是成组的，使用多个元素的方式来获取内容（对单组元素同样有效）
                                    var $this = $(this);
                                    if($this.prop("disabled") || $this.attr("disabled"))return null;
                                    switch(get){
                                        case "radio":case "checkbox":case "i-radio":case "i-checkbox":
                                        if(this.checked)return this.value;
                                        break;
                                        case "value":case "input":case "val":
                                        return $this.val();//有些非input控件重写了jQuery的val方法，能够像value一样获取值。这种情况下只能使用val方法二不能使用value属性
                                        case "html":
                                            return $this.html();
                                        case "text":
                                            //获取元素内部文本的方法，火狐不支持innerText，取而代之的是textContent。避免兼容问题，统一使用jquery的text方法获取
                                            return $this.text();
                                    }
                                }).toArray().join(",");
                            }
                            /**执行了元素的取值get配置后，检查outParam
                             * outParam.returnValue 默认（无）/1: 继续按照默认流程执行；0: 跳过跳过接下来的所有步骤
                             * outParam.validate 默认（无）/1: 执行校验；0: 跳过校验
                             * */
                            if(outParam.hasOwnProperty("returnValue") && !outParam.returnValue)return;
                            /**校验表单元素的内容是否满足自身声明的规则 data-rule的声明，data-rule可能是多个规则，可用逗号或空格分隔，按照顺序依次校验
                             * 被禁用（和被排除）的元素不用获取它的值，也不用校验（之前的错误提示也要清除）
                             */
                            values !== undefined && (values = vForm.dataConvert(values, item.type));
                            if((!outParam.hasOwnProperty("validate") || outParam.validate) && !($target.prop("disabled") || $target.attr("disabled"))){
                                /**字段校验器定义规则
                                 * 1、校验规则声明：允许在html结构中声明data-rule，同时也可以在js的字段定义中声明“rule”。2者都定义以js中定义的为准。
                                 * 2、默认使用全局校验器，如果定义了私有校验器，优先使用私有校验器。
                                 * */
                                var rule = vForm.serializeRule(item.hasOwnProperty("rule") ? item.rule : $target.data("rule"));
                                vResult = vForm.validate(values, fieldName, rule, item.rules, _getData, $target);
                            }
                            //校验通过，包装字段值
                            if(vResult){
                                /**如果配置了字段包装器wrap，使用包装器对值进行处理，否则就使用默认的方式处理
                                 * 如果包装器没有返回结果，这个字段的值将不纳入表单获取的数据中
                                 * @param value 当前字段的值
                                 * @param data 当前所有字段的结果集对象
                                 * @return 最后经过包装器处理后的最终结果
                                 * */
                                if(type.isFunction(item.wrap)){
                                    values = item.wrap.call(outParam, values, _getData);
                                }
                                //默认处理方式——忽略没有任何意义的undefined（null、""等其它空值都认为是有意义的）
                                values !== undefined && (_getData[fieldName] = values);
                            }
                        });
                        return _getData;
                    },
                    /**把支持的各种规则声明结构转换成统一的结构
                     * 支持：
                     * 1、字符串，可以包含一个或者多个规则关键字，在rules中应该存在与关键字对应的实现方法
                     * 2、function，直接实现一个匿名校验器
                     * 3、数组，包含上述2种格式
                     * 统一处理成数组格式，每个成员只包含单个的关键字或方法
                     * 不符合格式的规则将被忽略
                     * */
                    serializeRule: function(){
                        var arrRule = [];
                        function _serialize(rule, arrRule){
                            //数组类型的规则，迭代分解每一个成员的规则
                            if(type.isArray(rule)){
                                rule.forEach(function(rule){
                                    _serialize(rule, arrRule);
                                });
                            }
                            //字符串类型的规则尝试拆成单一规则，然后依次放到规则数组中
                            else if(type.isString(rule)){
                                rule.split(/[\s;]+/).forEach(function(rule){arrRule.push(rule)});
                            }else if(type.isFunction(rule)){
                                arrRule.push(rule);
                            }
                        }
                        for(var i = 0, l = arguments.length; i < l; i++){
                            _serialize(arguments[i], arrRule);
                        }
                        return arrRule;
                    },
                    /**功能：校验一个元素的值是否满足其校验规则
                     * @param fieldName 字段名称
                     * @param value 被校验的值
                     * @param ruleNames 校验规则的key
                     * @param rules 私有的校验规则实现
                     * @param _getData 这里不做任何处理，仅仅当做参数传递给自定义校验器
                     * @param $target 被校验的dom元素
                     * 返回值：校验成功返回true，失败返回false
                     * */
                    validate: function(value, fieldName, ruleNames, rules, _getData, $target){
                        var rule, ruleName, _this, $errorTipTarget, tipName, tipText, r;
                        rules || (rules = {});
                        type.isArray(ruleNames) || (ruleNames = this.serializeRule(ruleNames));
                        for(var i = 0, l = ruleNames.length; i < l; i++){
                            r = true;
                            _this = {vForm: this, data: _getData, filedName: fieldName};
                            tipName = ruleName = ruleNames[i];
                            //如果规则本身是个处理器（匿名处理器），按照处理器的规则进行校验
                            if(type.isFunction(ruleName)){
                                rule = ruleName;
                                tipName = "";
                                r = rule.call(_this, value, fieldName, _getData);
                            }else{
                                //根据校验器的名称获取对应的校验规则，优先使用私有校验器
                                rule = rules[ruleName] || this.rules[ruleName];
                                if(rule){
                                    /**自定义校验规则
                                     * @return Object {
                             *      result: 校验结果 true: 成功, false: 失败,
                             *      tip: 触发的tip提示配置（1个校验规则可能有多中提示结果，根据返回的关键字找到最合适的配置提示）
                             *      tipMsg: 具体的提示信息，忽略tip
                             * }
                                     * @return Boolean（非Object） 校验成功/失败
                                     * */
                                    if(typeof rule == "function"){
                                        r = rule.call(_this, value, fieldName, _getData);
                                    } else if(rule instanceof RegExp) {
                                        r = rule.test(value);
                                    }
                                }
                            }
                            if(!r){
                                $errorTipTarget = this.getElementTip(fieldName);
                                if(_this.hasOwnProperty("msg")){
                                    tipText = _this.msg;
                                } else {
                                    _this.tip && (tipName = _this.tip);
                                    //优先查找error-tip-规则名称所对应的错误提示语，如果没有，则使用error-tip属性上的提示语，如果没有则不做提示语的覆盖处理（当只有一种校验情况的时候，直接把提示语写在文档内部，不需要匹配）
                                    (tipText = $errorTipTarget.attr("error-tip-" + tipName)) === undefined && (tipText = $errorTipTarget.attr("error-tip"));
                                }
                                //如果没有与配置对应的tip，$errorTipTarget内部可能就存在错误提示（简写版）
                                tipText !== undefined && $errorTipTarget.text(tipText);
                                //显示错误提示标签
                                $errorTipTarget.removeClass("hide");
                                this.errorTarget.push(this.getElement(fieldName)[0]);
                                return false;
                            }
                        }
                        return true;
                    },
                    /**此功能应用在需要使用原始form表单提交的场景（比如文件下载的时候服务器端返回的是流文件，这种情况下就无法使用ajax方式）
                     * 把对象转换成表单元素，然后使用原始的表单方式向后台提交数据
                     * 参数 - iframe  0：不使用iframe，表单的target为target参数；1或空（默认空），表单的target默认对应一个隐藏的iframe，这个iframe自动生成
                     * 参数 - target form表单的target属性，指定了target参数则忽略iframe参数
                     * 参数 - fields Object类型 提交的数据
                     * 其它所有form表单的属性参数
                     * */
                    submit: function(o){
                        o = $.extend(true, {}, o);
                        var $form, $iframe, objFields = o.fields || {},
                            useIframe = o.hasOwnProperty("iframe") ? o.iframe : 1, targetName;
                        if(!o.hasOwnProperty("target")){
                            //使用iframe
                            if(useIframe){
                                targetName = o.hasOwnProperty("target") ? o.target : this._serial + (this.submit.hasOwnProperty("_serial") ? ++this.submit._serial : this.submit._serial = 1);
                                o.target = targetName;
                                $iframe = $('<iframe name="' + targetName + '" style="display: none">');
                                this.$scope.append($iframe);
                            }
                        }
                        // 去掉form表单属性外的参数
                        delete o.fields;
                        $form = $('<form>', $.extend({method: "post", "data-type": "form-submit", css: {display: "none"}}, o, name ? {name: name} : {}));
                        $form.empty();
                        for(var i in objFields){
                            $form.append($('<input data-forsubmit="1" type="hidden" name="' + i + '">').val(typeof objFields[i] == "object" ? JSON.stringify(objFields[i]) : objFields[i]));
                        }
                        this.$scope.append($form);
                        $form.submit();
                    }
                },
                //生成实例对象的时候允许重写方法属性
                _getData = vForm._getData,
                override = {
                    /**获取表单所有元素值方法
                     * 1.1、会跳过禁用的元素
                     * 1.2、对非禁用的元素进行规则校验
                     * 1.3、如果不是所有元素都校验通过了：
                     * 1.3.1、定位到第一个校验不通过的元素，显示错误提示
                     * 1.3.2、整体结果返回false
                     * 1.4、如果所有元素都通过校验
                     * 1.4.1、返回最终结果
                     *
                     * 2.1、如果定义了取值的方法，先执行默认方法获得元素的值，1.1，1.2
                     * 2.2、把2.1取出来的值回传给自定义的取值方法，然后自定义取值方法返回一个配置结果
                     * 2.3.1、如果没有返回配置结果，默认执行1.3，1.4
                     * 2.3.2、配置结果 === false，整体方法返回false
                     * 2.3.3、配置结果 {validate: 0}，跳过1.3.1
                     * */
                    getData: function(){
                        var data = _getData.apply(this, arguments), returnValue, errorEl;
                        //如果自定义了取值的方法，把默认取值的结果回传给自定义方法
                        if(o.getData){
                            returnValue = o.getData.call(this, data);
                            if(returnValue === false) return false;
                        }
                        if(!returnValue || returnValue.validate){
                            //默认定位到第一个校验不通过的元素上
                            if(this.errorTarget && (errorEl = this.errorTarget[0])){
                                this.locateElement(errorEl);
                                return false;
                            }
                        }
                        return data;
                    }
                };
            $.extend(true, vForm, o, override);
            return vForm;
        }
        return F;
    }
    if($){
        define(["native/Type"], function(type){
            return m($, type);
        });
    }else{
        define(["jQuery", "native/Type"], m);
    }
})(jQuery);