<template>
    <div class="login" >
      <vueCanvasNest :config="{color:'0,0,0', count: 100}" ></vueCanvasNest>
        <div id="card" class="login-con">
            <div class="login-card">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import vueCanvasNest from 'vue-canvas-nest'
    export default {
        components: {
            vueCanvasNest
        },
    };
</script>

<style scoped>
    .login {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .login-con {
        width: 410px;
        min-width: 410px;
        padding: 10px;
        background-color: #fff;
        border-color: transparent;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        position: relative;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #fff;
        background-clip: border-box;
        border-radius: 0.8rem;
    }

    .login-card {
        border: none;
        flex: 1 1 auto;
        padding: 1.25rem;
    }
</style>
