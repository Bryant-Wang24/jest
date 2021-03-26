<template>
  <div
    v-loading="ssoLoading"
    class="login-container"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ base.title }}展览智慧化系统</h3>
      </div>
      <!-- <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >Login</el-button> -->
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="redirectSSOLogin"
      >登 录</el-button>
      <!-- <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          Or connect with
        </el-button>
      </div> -->
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business
      simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
// import qs from 'qs'
// import { validUsername } from '@/utils/validate'
// import { setToken } from '@/utils/auth'
// import { initMenu } from '@/common/menu'
import SocialSign from './components/SocialSignin'
import { mapActions } from 'vuex'
import base from '@/api/base'
// import { setCookie, getToken } from '@/utils/auth'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      base,
      menuList: [],
      loginForm: {
        username: 'minad',
        password: 'admin'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur'
            // validator: validateUsername
          }
        ],
        password: [
          { required: true, trigger: 'blur'
          // validator: validatePassword
          }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      token: '',
      list: [],
      ssoLoading: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // var data = JSON.parse(window.localStorage.getItem('menu'))
    // if (getToken()) {
    //   this.handleRedirectSSOLogin()
    // }
    // this.setName(this.list)
    // console.log(this.menuList)
    // function arr (data){
    //   var list = []
    //   for(var i in data){
    //     list.push({
    //       path:data[i].path,
    //       component:'',
    //       meta:{title:data[i].name}
    //     })
    //   }

    //   return list
    // }
    // for(var i in list){
    //   arr.push({
    //     path:list[i].path,
    //       component:'',
    //       meta:{title:list[i].name}
    //   })
    //   if(list[i].children.length > 0){
    //     arr[i][children] = this.arr(list[i].children)
    //   }
    // }
    // console.log(arr)
    // for(var i in ){

    // }
    // var menuList = []
    // for (var i in data) {
    //   var menuList_two = []
    //   menuList.push({
    //     path: data[i].path,
    //     component: '',
    //     meta: { title: data[i].name }
    //   })
    //   if (data[i].children.length > 0) {
    //     for (var j in data[i].children) {
    //       menuList_two.push({
    //         path: data[i].children[j].path,
    //         component: '',
    //         meta: { title: data[i].children[j].name }
    //       })
    //     }
    //     menuList[i]['children'] = menuList_two
    //   }
    // }
    // console.log('menuList', menuList)
  },
  mounted() {
    if (this.loginForm.userName === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // handleRedirectSSOLogin() {
    //   console.log('handleRedirectSSOLogin')
    //   this.ssoLoading = true
    //   this.ssoLogin().then(res => {
    //     console.log('handleRedirectSSOLogin', res)
    //     setCookie('JSESSIONID', res.body.JSESSIONID)
    //     // const id = res?.body?.user?.id
    //     // // 获取用户及旧版菜单信息
    //     // this.getUserInfoAndMenuList(id).then(async menuRes => {
    //     //   const { menu } = menuRes
    //     //   console.log('getUserInfoAndMenuList', menu)
    //     //   await initMenu(menu) // 格式化路由
    //     //   // localStorage.setItem('menu', JSON.stringify(menu))
    //     //   // this.$store.dispatch('permission/addJspMenu', menuData)
    //     //   // this.$store.dispatch('permission/addJspMenu', menuData)
    //     //   this.$router.replace('/dashboard')
    //     // })
    //     //   .catch(e => {
    //     //     console.log(e)
    //     //     this.$message.error('登录失败')
    //     //     this.ssoLoading = false
    //     //   })
    //   })
    // },
    ...mapActions('user', ['login', 'getUserInfoAndMenuList', 'redirectSSOLogin']),
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    // handleLogin() {
    //   const params = {
    //     ...this.loginForm
    //   }
    //   // 第一个登录接口
    //   this.login(params).then(res => {
    //     // 第二个登录接口
    //     this.ssoLogin().then(ssoLoginRes => {
    //       console.log('ssoLoginRes', ssoLoginRes)
    //       const id = ssoLoginRes?.body?.user?.id
    //       // 获取用户及旧版菜单信息
    //       this.getUserInfoAndMenuList(id).then(async menuRes => {
    //         const { menu } = menuRes
    //         console.log('getUserInfoAndMenuList', menu)
    //         await initMenu(menu)
    //         // localStorage.setItem('menu', JSON.stringify(menu))
    //         // this.$store.dispatch('permission/addJspMenu', menuData)
    //         // this.$store.dispatch('permission/addJspMenu', menuData)
    //         this.$router.push('/dashboard')
    //       })
    //         .catch(e => {
    //           console.log(e)
    //           this.$message.error('登录失败')
    //         })
    //     })
    //   })
    // },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 300px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
