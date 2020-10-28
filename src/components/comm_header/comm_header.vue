
<style scoped>
    header {
        background: #fff;
        padding: 0;
        border: none;
        height: 57px;
        position: fixed;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        align-items: center;
    }
    nav {
        display: flex;
        align-items: center;
    }
    .layout-logo {
        font-weight: bold;
        display: flex;
        align-items: center;
        flex: 1;
        font-size: 18px;
    }

    li {
        list-style: none;
    }
    .container {
        max-width: 1200px;
        width: 1200px;
        margin: 0 auto;
    }
    .main {
        display: flex;
        justify-content: center;
    }
    .my-shadow {
        /* 水平 垂直 模糊距离 尺寸 */
        box-shadow: 0px 0px 5px 5px #eee;
    }
</style>
<template>
    <header class="my-shadow" :style="{position: 'fixed', width: '100%'}">
        <nav class="container main">
            <div class="layout-logo">Blog</div>
            <Menu
                    style="border:none"
                    mode="horizontal"
                    :active-name="activeNname"
                    @on-select="toPage"
            >
                <MenuItem style="border:none" name="仪表盘">
                    <Icon type="md-planet" />仪表盘
                </MenuItem>
                <MenuItem style="border:none" name="文章管理">
                    <Icon type="md-list" />文章管理
                </MenuItem>
                <MenuItem style="border:none" name="标签管理">
                    <Icon type="ios-bookmark-outline" />标签管理
                </MenuItem>
                <MenuItem style="border:none" name="分类管理">
                    <Icon type="ios-photos" />分类管理
                </MenuItem>
                <!-- <MenuItem style="border:none" name="个人中心">
                  <Icon type="md-person" />个人中心
                </MenuItem>-->
                <Submenu style="border:none" name="998">
                    <template slot="title">
                        <Icon type="ios-stats" />个人中心
                    </template>
                    <MenuItem name="我的主页">我的主页</MenuItem>
                    <MenuItem style="color: red" name="退出登录">退出登录</MenuItem>
                </Submenu>
            </Menu>
        </nav>
    </header>
</template>

<script>
    import types from "@/store/types";
    export default {
        name: "comm_header",
        data(){
            return{
                list: {
                    文章管理: "articles",
                    标签管理: "tags",
                    分类管理: "types",
                    仪表盘:'dashboard',
                    // 我的主页: "user",
                },
            }
        },
        props:{
            activeNname:'',
        },
        methods:{
            // 点击导航
            toPage(name) {
                if (name === "退出登录") {
                    if (confirm("确认退出登录吗")) {
                        let _this = this;
                        _this.$store.commit(types.CLEARTOKEN);
                        localStorage.removeItem("LoginForm");
                        _this.$router.push({ name: "login" }).catch(()=>{});
                    }
                }
                this.$router.push({
                    name: this.list[name]
                }).catch(()=>{});
            }
        },
        created() {

        }

    }
</script>

<style >

</style>
