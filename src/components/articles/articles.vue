<style>
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
        <Table class="m-margin" border stripe :columns="columns12" :data="tableDate">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="toPostPage(row.id)">View</Button>
                <Button type="error" size="small" @click="remove(index)">Delete</Button>
            </template>
        </Table>
        <Page class="page m-margin" :total="totalPage" @on-change="changePage"/>
    </div>
</template>
<script>
    import {getAticles} from "@/api/apis"
    export default {
        data () {
            return {
                columns12: [
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
                tableDate: [],
                page:'1',
                totalPage:0,
            }
        },
        methods: {
            toPostPage(id){
                this.$router.push({ name: "post",params:{blogId:id} });
            },
            remove (index) {
                this.tableDate.splice(index, 1);
            },

            getTableData(){
                var _this = this;
                _this.tableDate = [];
                getAticles({
                    "page": _this.page,
                    "size":10,
                }).then(res=>{
                    if(!res.data.data === undefined || res.data.data.length > 0){
                        _this.totalPage = res.data.data[0].totalPage * 10;
                        _this.tableDate = res.data.data;
                    }
                })
            },
            changePage(index){
                var _this = this;
                _this.page = index;
                _this.getTableData();

            }

        },
        mounted() {
            setTimeout(() => {
                this.getTableData();
            }, 500)

        }
    }
</script>
