<template>
    <ul class="tree-menu" :class="{'tree-list-root': isRoot()}">
        <li class="tree-node" v-for="item in menuList"
            :class="{'leaf-node': isLeaf(item),'select-node': isSelected(item), 'open-node': getState(item, 'isOpen'), 'close-node': getState(item, 'isClose')}"
        >
            <!-- 叶节点 -->
            <div class="tree-item" v-if="isLeaf(item)" @click="trigger($event, 'click', item)">
                <div class="tree-content">
                    <i v-if="item[icon] != null" class="icon" :class="item[icon]"></i>
                    <span class="node-text">{{item[text]}}</span>
                </div>
            </div>
            <!-- 非叶节点 -->
            <template v-else>
                <div class="tree-item" @click="trigger($event, 'click', item)">
                    <div class="tree-content">
                        <i v-if="item[icon] != null" class="icon" :class="item[icon]"></i>
                        <span class="node-text">{{item[text]}}</span>
                        <i class="node-arrow ivu-icon ivu-icon-ios-arrow-down ivu-menu-submenu-title-icon"
                           :class="{'ivu-menu-opened': isOpen(item)}"
                        ></i>
                    </div>
                </div>
                <tree-menu class="tree-sub" ref="subtree" v-show="isOpen(item)" :value="item[children]"
                           :root="root" :parent="item"
                           :select="select" :key-field="keyField" :text="text" :children="children" :icon="icon"
                           :multiple="multiple" :accordion="accordion"
                ></tree-menu>
            </template>
        </li>
    </ul>
</template>
<script>
    export default {
        name: 'tree-menu',
        props: {
            value: {default: null},
            root: {default: null}, // 根节点的数据，数组
            rootState: {default: null}, // 根节点的数据状态，数组
            parent: {default: null},
            keyField: {default: "id"},
            text: {default: "name"},
            children: {default: "children"},
            select: {default: "selected"},
            icon: {default: "icon"},

            multiple: {default: false}, // 是否开启多选
            accordion: {default: false}, // 手风琴模式。同级树节点一次只能展开一个
        },
        data: function(){
            return {
                // 状态数据，记录一个树节点的状态变化，不关联到原始的数据上
                state: {
                    // key: { // 节点的唯一标识
                    //    index: 数据的唯一标志，如果没有指定id，这个值将起作用。父index_子index
                    //    isOpen: 1, //展开
                    //    isClose: 0, //收回
                    //    isSelected: 0, //是否选中
                    //    isLeaf: 0, // 是否叶节点
                    // }
                }
            }
        },
        computed: {
            menuList: {
                get: function(){
                    var value = this.value, parent = this.parent, type;
                    !value && parent && (value = parent[this.children]);
                    type = Object.prototype.toString.call(value);
                    if(type == "[object Object]"){
                        return [value];
                    }else if(type == "[object Array]"){
                        return value
                    }
                    return [];
                }
            }
        },
        methods: {
            isRoot: function(){
                return !this.parent;
            },
            isLeaf: function(node){
                return !(node[this.children] && node[this.children].length);
            },
            isOpen: function(node){
                return this.state[node[this.keyField]] && this.state[node[this.keyField]].isOpen;
            },
            isSelected: function(node){
                return this.state[node[this.keyField]] && this.state[node[this.keyField]].isSelected;
            },
            getState: function(node, stateName){
                // 如果不指明stateName，返回整个state对象
                return arguments.length < 2 ? this.state[node[this.keyField]] : this.state[node[this.keyField]] && this.state[node[this.keyField]][stateName];
            },
            setState: function (node, stateName, value) {
                this.state[node[this.keyField]][stateName] = value
            },
            /**展开/关闭节点。
             * @node Object 节点数据对象
             * @flag Boolean true，展开节点；false，关闭节点。不指定该参数则设置与node相反的状态
             * */
            toggleItem: function(node, flag){
                var state = this.getState(node);
                if(!state.isLeaf){
                    arguments.length < 2 && (flag = !this.isOpen(node));
                    state.isOpen = flag;
                    state.isClose = !flag;
                    // 手风琴
                    this.emit(flag ? "open" : "close", node, state);
                }
            },
            toggleSelect: function(node, flag){
                var state = this.getState(node), nodeKey = state.key, keyField = this.keyField;
                arguments.length < 2 && (flag = !this.isOpen(node));
                state.isSelected = flag;
                /**multiple==false模式下，选中状态具有互斥性
                 * 从根节点开始层层遍历，取消当前节点之外的节点选中状态
                 * */
                if(!this.multiple){
                    this.everyNode(function(node, state){
                        if(state.key != nodeKey){
                            state.isSelected = 0;
                        }
                    });
                }
                this.emit("select", node, state);
            },
            /**遍历所有节点的方法，通过回调来处理每个节点。
             * @node Object|Array 被递归遍历的节点
             * @callback Function 每次迭代处理节点的方法。返回true，停止遍历
             * */
            everyNode: function(callback){
                var rootState = this.root || {}, data = rootState.data, map = rootState.map, state = rootState.state;
                for(var i in map){
                    if(callback.call(this, map[i], state[i])){
                        return;
                    }
                }
            },
            /**把事件冒泡给父节点，一直冒泡到树组件的根节点上，然后进行事件派发
             * @param e String 事件类型
             * @param node 触发事件的原始节点数据。冒泡的过程中始终不应该被改变
             * @param state 参数node所对应的数据状态（最多在此方法第一次被调用的时候初始化）。冒泡的过程中始终不应该被改变
             * */
            emit: function(e, node, state){
                var $parent = this.$parent;
                state || (state = this.getState(node));
                if(this.isRoot()){
                    // 事件冒泡到根节点上，手动触发
                    this.$emit(e, node, state, this.value, this.state);
                }else{
                    if($parent.name === this.name && $parent.emit){
                        $parent.emit.call($parent, e, node, state);
                    }
                }
            },
            /**处理trigger事件中的具体逻辑，以及连锁触发的二次事件。
             * */
            trigger: function(e, eType, node){
                var state = this.getState(node);
                switch (eType){
                    case "click":
                        e.stopPropagation();
                        // 叶节点不能展开/关闭，只能选中
                        if(!state.isLeaf)this.toggleItem(node);
                        this.toggleSelect(node);
                        break;
                    case "open":
                    case "close":
                        if(!state.isLeaf)this.toggleItem(node);
                        break;
                }
            },
            // 数据变化时要执行的重构方法
            dataChange: function(){
                // 初始化数据格式
                this.serialize();
            },
            serialize: function(){
                var $this = this, treeData = this.menuList, state = {}, keyFiled = this.keyField, selectField = this.select,
                    isRoot = !(this.root && this.root.data && this.root.data.length), parent, rootData, rootMap, rootState;
                parent = this.parent;
                if(parent){
                    parent[this.children] = treeData;
                }
                /**当前数据是根节点的数据
                 * 1、初始化根节点的root和rootState字段
                 * 2、root和rootState字段使用扁平化的数据结构（map结构，方便查找）
                 * */
                if(isRoot){
                    this.root = {
                        data: [],
                        map: {},
                        state: {}
                    };
                }
                rootData = this.root.data;
                rootMap = this.root.map;
                rootState = this.root.state;
                // 整理节点集合，给每个节点数据保存一条对应的状态数据
                treeData.forEach(function(item, index){
                    // 如果数据没有指定key，使用keyIndex作为唯一标识
                    var keyIndex = ((parent && parent.keyIndex ? parent.keyIndex + "_" : "") + index), key = item[keyFiled] || keyIndex,
                        isLeaf = $this.isLeaf(item);
                    state[key] = {
                        key: key,
                        keyIndex: keyIndex,
                        parent: parent,
                        isRoot: isRoot,
                        isLeaf: isLeaf,
                        isOpen: isLeaf ? 0 : 1, // 默认都是open状态
                        isClose: isLeaf ? 0 : 0,
                        isSelected: item[selectField]
                    };
                    rootData.push(item);
                    rootMap[key] = item;
                    rootState[key] = state[key];
                });
                this.state = state;
            }
        },
        watch: {
            "value": function(){
                this.dataChange();
            }
        },
        created: function(){
            this.dataChange();
        }
    };
</script>