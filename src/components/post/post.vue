<style scoped>
    .markdown{
        z-index: 1 !important;
    }
</style>
<template>
    <Form ref="blogData" :model="blogData" :rules="ruleValidate" :label-width="80" label-position="left" >
        <FormItem label="文章标题" prop="title" >
            <Input v-model="blogData.title" placeholder="请输入文章标题" style="width: 500px"></Input>
        </FormItem>
        <FormItem label="分类" prop="typeId" >
            <Select v-model="blogData.typeId"  style="width:260px"
                    clearable  filterable allow-create @on-create="addType">
                <Option v-for="item in typesMenu" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="标签" prop="tags">
            <Select v-model="blogData.tags"  style="width:260px"
                    multiple filterable allow-create @on-create="addTag">
                <Option v-for="item in tagsMenu" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem>
            推荐 <i-switch v-model="blogData.recommend" porp="recommend"></i-switch>
            赞赏 <i-switch v-model="blogData.appreciation"></i-switch>
            评论 <i-switch v-model="blogData.commentabled"></i-switch>
        </FormItem>

        <FormItem label="内容" prop="content">
            <mavon-editor class="markdown" v-model="blogData.content" :toolbars="toolbars"
                          ref=md @imgAdd="$imgAdd" @imgDel="$imgDel"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('blogData')" v-if="blogId"  :loading="loading">
                <span v-if="!loading">修改</span>
                <span v-else>修改中</span>
            </Button>
            <Button type="primary" @click="handleSubmit('blogData')" v-if="!blogId" :loading="loading">
                <span v-if="!loading">发布</span>
                <span v-else>发布中</span>
            </Button>
            <Button @click="handleReset('blogData')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</template>
<script>
    import {getTags,getTypes,getArticleById,postImg,postBlog,putBlog,addTag,addType} from "../../api/apis";
    //markdown 编辑器

    export default {
        data() {
            return {
                blogData: {
                    id:'',
                    title: '',
                    typeId : '',
                    tags: [],
                    content: '',
                    commentabled: false,
                    appreciation: false,
                    recommend: false,
                    status:true,//todo 发表/保存按钮？
                },
                blogId: "",
                //类型菜单
                typesMenu:[],
                //标签菜单
                tagsMenu: [],
                loading:false,
                //表单认证
                ruleValidate: {
                    title: [
                        {required: true, message: '请输入文章标题', trigger: 'change'}
                    ],
                    typeId: [
                        { required: true, message: '请选择文章类型', trigger: 'change',type:'number'},
                    ],
                    tags: [
                        {required: true, message: '请选择文章标签', trigger: 'change',type:'array'}
                    ],
                    content: [
                        {required: true, message: '请输入内容', trigger: 'change'},
                        {type: 'string', min: 20, message: '文章内容不得少于20个字', trigger: 'blur'}
                    ]
                },
                //markdown 编辑器设置
                toolbars: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: false, // 上角标
                    subscript: false, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: false, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    save: true, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: false, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                }
            }
        },
        methods: {
            async handleSubmit(name) {
                var _this = this;
                _this.loading = true;
                _this.$refs[name].validate((valid) => {
                    if (valid) {
                        //存在id为 修改文章
                        if(_this.blogId){
                            _this.blogData.id = _this.blogId;
                            putBlog(_this.blogData).then(res=>{
                                if(res.data.code === 200){
                                    _this.$Message.success('修改成功');
                                    _this.$router.push({ name: "articles"});
                                }else {
                                    _this.$Message.warning('修改时发生错误');
                                }
                                _this.loading = false;
                            })
                        }else {
                            //不存在id 为发表文章
                            _this.blogData.id='',
                            postBlog(_this.blogData).then(res=>{
                                if(res.data.code === 200){
                                    _this.$Message.success('Success!');
                                    _this.$router.push({ name: "articles"});
                                }else  _this.$Message.error('Fail!');
                                _this.loading = false;
                            })
                        }
                    } else {
                        _this.$Message.error('Fail!');
                    }
                })
                _this.loading = false;
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },

            //获取标签列表
            getTags(){
                getTags({
                    page: 1,
                    size:100,
                }).then(res=>{
                    for( let item of res.data.data){
                        let tag =[];
                        tag.value = item.id;
                        tag.label = item.name;
                        this.tagsMenu.push(tag);
                    }
                })
            },

            //添加标签
            addTag(val){
                let _this = this;
                addTag({"name": val}).then(res => {
                    if (res.data.code === 200) {
                        _this.tagsMenu.push({
                            value:res.data.data.id,
                            label:val
                        })
                    } else {
                        this.$Message.warning('错误！');
                    }
                })
            },

            //添加分类
            addType(val){
                let _this = this;
                addType({"name": val}).then(res => {
                    if (res.data.code === 200) {
                        _this.typesMenu.push({
                            value:res.data.data.id+'',
                            label:val
                        })
                    } else {
                        this.$Message.warning('错误！');
                    }
                })

            },

            //获取类型列表
            getTypes(){
                getTypes({
                    page: 1,
                    size:100,
                }).then(res =>{
                    for( let item of res.data.data){
                        let type =[];
                        type.value = item.id;
                        type.label = item.name;
                        this.typesMenu.push(type);
                    }
                })
            },

            //获取文章(回显)
            getArticle(blogId){
                var _this = this;
                getArticleById(blogId).then(res=>{
                    var data = res.data.data;
                    _this.blogData.title = data.title;
                    _this.blogData.typeId = data.typeId;
                    _this.blogData.tags = data.tags;
                    _this.blogData.commentabled = data.commentabled;
                    _this.blogData.appreciation = data.appreciation;
                    _this.blogData.recommend = data.recommend;
                    _this.blogData.content = data.content;

                })
            },
            // 绑定@imgAdd event
            $imgAdd(pos, $file){
                // 第一步.将图片上传到服务器.
                var formdata = new FormData();
                formdata.append('file', $file);
                postImg(formdata).then((res) => {
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    /**
                     * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                     * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                     * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                     */
                    this.$refs.md.$img2Url(pos, res.data.data);
                })
            },
            //删除图片
            $imgDel (pos) {
                delete this.imgFile[pos]
            },
        },
        mounted() {
            var _this = this;
            _this.blogId = _this.$route.params.blogId;
            if(_this.blogId){
                _this.getArticle(_this.blogId);
            }

            _this.getTypes();
            _this.getTags();
        },
        beforeRouteLeave(to, from, next){
            if(to.name === 'articles') {
                to.meta.keepAlive = true
            }
            next()
        }


    }
</script>
