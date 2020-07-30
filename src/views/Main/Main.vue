<style scoped>
    .layout {
        margin: 0;
        padding: 0;
        background: #f5f7f9;
        position: relative;
        height: 100%;
    }
    .layout-footer-center {
        text-align: center;
        bottom: 0;
    }
</style>

<template>
    <div class="layout">
        <Layout>
            <comm_header :activeNname="activeNname"></comm_header>
        </Layout>
        <Layout :style="{padding: '0 50px', width: '100%', marginTop: '60px'}">
            <div class="container">
                <!--面包屑-->
                <Breadcrumb :style="{ margin: '16px 0' }">
                    <BreadcrumbItem v-for="item in breadcrumb" :key="item">{{item}}</BreadcrumbItem>
                </Breadcrumb>
                <!--需要缓存的试图组件-->
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"/>
                </keep-alive>
                <!--不需要缓存的试图组件-->
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </Layout>

        <Footer class="layout-footer-center"> ChunKitAu&copy; 2020</Footer>
    </div>
</template>

<script>
    import comm_header from "../../components/comm_header/comm_header";
    export default {
        name: "Pages",
        data(){
            return{
                breadcrumb: [],
                activeNname: ""
            }
        },
        components:{
            comm_header,
        },
        mounted() {
            const last = this.$route.meta.breadcrumb.length - 1;
            this.activeNname = this.$route.meta.breadcrumb[last];
            this.changePath();
        },
        watch: {
            $route: "changePath"
        },
        methods:{
            // 路由变化
            changePath() {
                this.breadcrumb = this.$route.meta.breadcrumb;
            },
        }
    }


</script>
