<template>
  <div id="id" class="animated fadeIn" >
    <h2 style="margin-bottom: 30px;">MyBlog</h2>
    <Form
      ref="LoginForm"
      :model="LoginForm"
      class="form-class"
      @keydown.enter.native="login(LoginForm)"
    >
      <FormItem>
        <span>账号</span>
        <input v-model="LoginForm['username']" type="text" class="input" />
      </FormItem>
      <FormItem>
        <div style="display: flex; justify-content: space-between">
          <span>密码</span>
        </div>
        <input v-model="LoginForm['password']" type="password" class="input" />
      </FormItem>
      <Checkbox v-model="remeberme">
        <span class="rememberKey">记住密码</span>
      </Checkbox>
      <br />
      <br />
      <FormItem>
        <Button
          @click.native.prevent="login(LoginForm)"
          style="background: #5A8CFF; border:#5A8CFF"
          type="primary"
          :loading="loginLoading"
          long
        >登录</Button>
      </FormItem>
    </Form>
    <div class="registerTips">
      <div>还没有账号?</div>
      <a @click="toRegister" style="margin-left: 5px; color: #007bff">点击注册</a>
    </div>
  </div>
</template>

<script>
import { login } from "../../api/apis";
import types from "@/store/types";

export default {

  created() {
    let LoginForm = localStorage.getItem("LoginForm");
    if (LoginForm) {
      this.LoginForm = JSON.parse(LoginForm);
      this.remeberme = true;
    }
  },

  data() {
    return {
      LoginForm: {
        "username": "",
        "password": ""
      },
      loginLoading: false,
      remeberme: false
    };
  },

  mounted() {
    if (this.remeberme){
      this.login(this.LoginForm);
    }
  },

  methods: {
    login(data) {
      if (!data["username"] || !data["password"]) {
        this.$Message.error("账号和密码都不能为空");
        return;
      }
      this.loginLoading = true;

      login(data).then(res => {
        let _this = this;
        if (res.data.code !== 200) {
          _this.$Message.error("账号或密码错误");
          _this.loginLoading = false;
          return;
        }
        //remember me
        _this.remeberme && localStorage.setItem("LoginForm", JSON.stringify(_this.LoginForm));

        _this.loginLoading = false;

        // token和id存起来
        _this.$store.commit(types.TOKEN, res.data.data.token);

        //重定向
        _this.$router.push({ name: "Home" }).catch(()=>{});
      });
    },

    toRegister: function() {
      this.$router.push({ name: "register" }).catch(()=>{});
    }
  }
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 2px solid #ced4da;
  border-radius: 0.25rem;
  /* transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; */
}

.registerTips {
  display: flex;
  justify-content: center;
}

/* .input :focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
} */
</style>
