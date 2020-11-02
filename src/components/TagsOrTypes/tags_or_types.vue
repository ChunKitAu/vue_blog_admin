<template>
    <Row>
        <Col span="16" offset="4">
            <div style="text-align: center">
                <Card :bordered="false">
                    <Tag type="dot" closable :color="color[Math.floor((Math.random()*4)+1)]" size="large"
                         v-for="item in data" @on-close="delTag(item.id)">
                        {{ item.name}} {{item.num}}
                    </Tag>
                    <Button icon="ios-add" type="dashed" size="small" @click="modal = true">添加标签</Button>

                    <Modal v-model="modal" title="添加"
                           @on-ok="addTag" @on-cancel="cancel">
                        name: <Input v-model="input_value" placeholder="需要添加的名称" style="width: 300px"/>
                    </Modal>
                </Card>
            </div>
        </Col>
    </Row>
</template>

<script>
    import {getTags, getTypes, addTag, addType, delTag, delType} from "../../api/apis";

    export default {
        name: "tags_or_types",
        data() {
            return {
                path: '',
                data: [],
                color: ['primary', 'success', 'error', 'warning'],
                modal: false,
                input_value: '',
            }
        },
        methods: {
            //确认 添加 对话框
            addTag() {
                var _this = this;
                if (_this.path === 'tags') {
                    addTag({"name": _this.input_value}).then(res => {
                        if (res.data.code === 200) {
                            this.$Message.info('添加成功！');
                            _this.getData();
                        } else {
                            this.$Message.warning('错误！');
                        }
                    })
                } else if (_this.path === 'types') {
                    addType({"name": _this.input_value}).then(res => {
                        if (res.data.code === 200) {
                            this.$Message.info('添加成功！');
                            _this.getData();
                        } else {
                            this.$Message.warning('错误！');
                        }
                    })
                }
                _this.input_value = '';
            },
            //取消 添加 对话框
            cancel() {
                this.input_value = '';
            },


            //删除
            delTag(id) {
                var _this = this;
                if (confirm('是否删除') === true) {
                    //确认
                    if (_this.path === 'tags') {
                        delTag(id).then(res => {
                            if (res.data.code === 200) {
                                this.$Message.info('删除成功');
                                _this.getData();
                            }
                        }).catch(res=>{
                            this.$Message.error('删除失败');
                        })
                    } else if (_this.path === 'types') {
                        delType(id).then(res => {
                            if (res.data.code === 200) {
                                this.$Message.info('删除成功');
                                _this.getData();
                            }
                        }).catch(res=>{
                            this.$Message.error('删除失败');
                        })
                    }
                }
            },


            changePath() {
                var _this = this
                _this.path = _this.$route.name;
            },
            getData() {
                var _this = this;
                _this.data = [];
                if (_this.path === 'tags') {
                    //获取标签
                    getTags({
                        page: 1,
                        size: 100,
                    }).then(res => {
                        this.data = res.data.data
                    })
                } else if (_this.path === 'types') {
                    //获取分类
                    getTypes({
                        page: 1,
                        size: 100,
                    }).then(res => {
                        this.data = res.data.data
                    })
                }
            },

        },
        mounted() {
            var _this = this;
            _this.changePath();
            _this.getData();
        },
        watch: {
            $route: function () {
                var _this = this;
                _this.changePath();
                _this.getData();
            }
        }
    }
</script>

<style scoped>

</style>
