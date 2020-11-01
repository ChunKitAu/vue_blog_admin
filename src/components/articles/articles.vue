<style>
    .articles{
        margin-top: 10px;
    }
    .m-margin{
        margin-top: 10px;
    }
    .page{
        float: right;
    }
</style>
<template>
    <div class="articles">
        <router-link :to="{name:'post'}"><Button type="primary" >发表文章</Button></router-link>
        <br>
        <Input suffix="ios-search" placeholder="请输入标题" style="width: auto;margin-top: 10px" v-model="searchValue" @keyup.enter.native="search()"/>
        <Button type="primary" class="m-margin" style="margin-left: 20px" @click="reset">重置</Button>
        <Table class="m-margin" border stripe :columns="my_columns" :data="tableData" :loading="loading">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="toPostPage(row.id)">View</Button>
                <Button type="error" size="small" @click="deleteArticle(index,row.id)">Delete</Button>
            </template>
        </Table>
        <Page class="page m-margin" :current="page"  :total="totalPage" :page-size="size" @on-change="changePage"/>
    </div>
</template>
<script>
    import {getArticlesByUser,delBlog,getSearchList} from "@/api/apis"
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
            }

        },
        mounted() {
            setTimeout(() => {
                this.getTableData();
            }, 500)

        },
        beforeRouteLeave(to, from, next) {
            from.meta.keepAlive = false;
            next()
        }
    }
</script>
