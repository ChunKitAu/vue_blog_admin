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
            <Select v-model="select_type_list" style="width:auto ;" ref="resetTypeSelect"
                    clearable filterable @on-change="getArticleByUserAndTypeId">
                <Option v-for="item in type_list" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <!--   标签-->
            <span class="my-margin-left">标签：</span>
            <Select v-model="select_tag_list"  style="width:auto" ref="resetTagSelect"
                    multiple filterable @on-change="getArticleByUserAndTagId">
                <Option v-for="item in tag_list" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </div>
        <div class="my-margin-top">
            <Table   :columns="my_columns" :data="tableData" :loading="loading" style="overflow-x: hidden"
                     border stripe>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="toPostPage(row.id)">View</Button>
                    <Button type="error" size="small" @click="deleteArticle(index,row.id)">Delete</Button>
                </template>
            </Table>
            <Page class="page my-margin-top" :current="page"  :total="totalPage" :page-size="size" @on-change="changePage"/>
        </div>
    </div>
</template>
<script>
    import {getArticlesByUser,delBlog,getSearchList,getTags,getTypes,getArticleByUserAndTagId,getArticleByUserAndTypeId} from "@/api/apis"
    import article_status from '@/store/articles_status'
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
                loading:true,

                //用于分页记录获取记录途径
                status:article_status.DEFAULT,
                type_or_tage_id : 0,
            }
        },
        methods: {
            //回显
            toPostPage(id){
                this.$router.push({ name: "post",params:{blogId:id} });
            },

            //获取文章列表
            getTableData(){
                let _this = this;
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
                let _this = this;
                _this.page = index;

                switch (_this.status) {
                    case article_status.DEFAULT:
                        _this.getTableData(); break;
                    case article_status.GET_TYPE:
                        _this.getArticleByUserAndTypeId(_this.type_or_tage_id);break;
                    case article_status.GET_TAG:
                        _this.getArticleByUserAndTagId(_this.type_or_tage_id);break;
                    case article_status.SEARCH:
                        _this.search();break;
                }

            },

            //搜索
            search(){
                let _this = this;
                _this.loading = true;
                _this.status = article_status.SEARCH;
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
                });
                _this.loading = false;
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
                let _this = this;
                _this.$refs.resetTypeSelect.clearSingleSelect();
                _this.$refs.resetTagSelect.clearSingleSelect();
                _this.status = article_status.DEFAULT;
                _this.tableData = [];
                _this.page  = 1;
                _this.select_tag_list = [];
                _this.select_type_list = [];
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
                let _this = this;
                _this.status = article_status.GET_TAG;
                _this.$refs.resetTypeSelect.clearSingleSelect();
                if (value.length === 0)
                    _this.getTableData();
                else{
                    _this.type_or_tage_id = value;
                    getArticleByUserAndTagId({
                        "page": _this.page,
                        "size":_this.size,
                        "tagId":_this.type_or_tage_id,
                    }).then(res=>{
                        _this.totalPage = res.data.data[0].totalPage * 10;
                        _this.tableData = res.data.data;
                    })
                }

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
                let _this = this;
                _this.status = article_status.GET_TYPE;
                _this.$refs.resetTagSelect.clearSingleSelect();
                if (value === undefined)
                    _this.getTableData();
                else{
                    _this.type_or_tage_id = value;
                    getArticleByUserAndTypeId({
                        "page": _this.page,
                        "size":_this.size,
                        "typeId":_this.type_or_tage_id,
                    }).then(res=>{
                        _this.totalPage = res.data.data[0].totalPage * 10;
                        _this.tableData = res.data.data;
                    })
                }

            }


        },
        mounted() {
            let _this = this;
            _this.getTableData();
            _this.getTagList();
            _this.getTypeList();
        },
        beforeRouteLeave(to, from, next) {
            from.meta.keepAlive = false;
            next()
        }
    }
</script>
