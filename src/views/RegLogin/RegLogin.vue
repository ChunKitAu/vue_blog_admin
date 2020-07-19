<template>
  <div class="login" :style="{backgroundImage: 'url(' + bg + ')'}">
    <div id="card" class="login-con">
      <div class="login-card">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bg: require("../../assets/bg.png"),
    };
  },
  mounted() {
  }
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
