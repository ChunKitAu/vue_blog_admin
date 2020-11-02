<style lang="less">
    .articles{
        margin-top: 10px;
    }
    .my-margin-top{
        margin-top: 10px;
    }
    .my-margin-left{
        margin-left: 10px;
    }
    .page{
        float: right;
    }
</style>
<template>
    <div class="articles">
        <Card style="padding-bottom: 50px">
            <div class="my-margin-top">
                <router-link :to="{name:'post'}"><Button type="primary" >发表文章</Button></router-link>
            </div>
            <div class="my-margin-top">
                <span>标题：</span>
                <Input suffix="ios-search" placeholder="请输入标题" style="width: auto;" v-model="searchValue"
                       @keyup.enter.native="search()"/>
                <Button type="primary" class="my-margin-left"
                        @click="reset">重置</Button>
            </div>
            <div class="my-margin-top">
                <!--  分类  -->
                <span>分类：</span>
                <Select v-model="select_type_list" style="width:auto ;"
                        clearable filterable @on-change="getArticleByUserAndTypeId">
                    <Option v-for="item in type_list" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <!--   标签-->
                <span class="my-margin-left">标签：</span>
                <Select v-model="select_tag_list"  style="width:auto"
                        multiple filterable @on-change="getArticleByUserAndTagId">
                    <Option v-for="item in tag_list" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </div>
            <div class="my-margin-top">
                <Table   :columns="my_columns" :data="tableData" :loading="loading"
                         border stripe>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="toPostPage(row.id)">View</Button>
                        <Button type="error" size="small" @click="deleteArticle(index,row.id)">Delete</Button>
                    </template>
                </Table>
                <Page class="page my-margin-top" :current="page"  :total="totalPage" :page-size="size" @on-change="changePage"/>
            </div>
        </Card>
    </div>
</template>
<script>
    import {getArticlesByUser,delBlog,getSearchList,getTags,getTypes,getArticleByUserAndTagId,getArticleByUserAndTypeId} from "@/api/apis"
    export default {
        data () {
            return {
                my_columns: [
                    {title: '文章标题', key: 'title'},
                    {title: '发表时间', key: 'createTime'},
                    {title: '浏览数', key: 'views'},
                    {title: '评论数', key: 'comments'},
                    {title: '状态', key: 'status'},
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                //用于下拉显示
                tag_list:[],
                type_list:[],
                //选择的标签,用于查询
                select_tag_list:[],
                select_type_list:[],

                tableData: [],
                page:1,
                size:10,
                totalPage:0,
                searchValue:"",
                searchFlag:false,
                loading:true,
            }
        },
        methods: {
            //回显
            toPostPage(id){
                this.$router.push({ name: "post",params:{blogId:id} });
            },

            //获取文章列表
            getTableData(){
                var _this = this;
                _this.tableData = [];
                _this.loading = true;
                _this.totalPage = 1;
                getArticlesByUser({
                    "page": _this.page,
                    "size":_this.size,
                }).then(res=>{
                    if (res.data.code == 200){
                        if(!res.data.data === undefined || res.data.data.length > 0){
                            _this.totalPage = res.data.data[0].totalPage * 10;
                            _this.tableData = res.data.data;
                        }
                    }
                    _this.loading = false;
                })
            },

            //分页改变页码
            changePage(index){
                var _this = this;
                _this.page = index;
                if(_this.searchFlag){
                    _this.search();
                }else _this.getTableData();

            },

            //搜索
            search(){
                var _this = this;
                _this.loading = true;
                _this.searchFlag = true;
                _this.totalPage = 1;
                _this.tableData = [];
                getSearchList({
                    current:_this.page,
                    size:_this.size,
                    keyWord:_this.searchValue
                }).then(res=>{
                    if(!res.data.data.content === undefined || res.data.data.content.length > 0)
                        _this.tableData = res.data.data.content;
                    if(res.data.data.totalElements)
                        _this.totalPage = res.data.data.totalElements;
                        _this.loading = false;
                });
            },
            //删除
            deleteArticle(index,article_id){
                //删除前端数据缓存
                if (confirm("确定删除？")){
                    delBlog(article_id).then(res =>{
                        console.log(res.data);
                        if (res.data.code == 200){
                            this.tableData.splice(index, 1);
                            this.$Message.success("删除成功!");
                        }else this.$Message.success("删除失败!");
                    })
                }

            },

            reset(){
                var _this = this;
                _this.searchFlag = false;
                _this.tableData = [];
                _this.page  = 1;
                _this.getTableData();
            },

            //获取标签列表
            getTagList(){
                getTags({
                    page: 1,
                    size: 100,
                }).then(res => {
                    this.tag_list = res.data.data;
                })
            },
            //根据标签id获取当前用户的文章
            getArticleByUserAndTagId(value){
                if (value.length === 0){
                    this.getTableData();
                }else
                    getArticleByUserAndTagId(value).then(res=>{
                        this.tableData = res.data.data;
                    })

            },

            //获取分类列表
            getTypeList(){
                getTypes({
                    page: 1,
                    size: 100,
                }).then(res => {
                    this.type_list = res.data.data;
                })
            },

            //根据分类id获取当前用户的文章
            getArticleByUserAndTypeId(value){
                if (value === undefined)
                    this.getTableData();
                else
                    getArticleByUserAndTypeId(value).then(res=>{
                        this.tableData = res.data.data;
                    })
            }


        },
        mounted() {
            this.getTableData();
            this.getTagList();
            this.getTypeList();
        },
        beforeRouteLeave(to, from, next) {
            from.meta.keepAlive = false;
            next()
        }
    }
</script>
