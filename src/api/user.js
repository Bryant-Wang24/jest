import base from './base'
import axios from '@/utils/http'
import qs from 'qs'
import { getToken } from '@/utils/auth'

// vue文件中用this.$api.example.getExample调用

// const path = '/' // 临时路径
/**
 * path        {string}   路由路径
 * component   {string}   组件路径，用于前端导入对应组件
 * redirect    {string}   用于前端路由重定向
 * name        {string}   路由名字，英文，用于前端路由跳转、路由缓存
 * meta        {string}   路由元信息配置，路由相关自定义配置
 * children    {array}    子路由，除了一级路由之外的路由页面
 * hidden      {boolean}  如果设置为true，则此路由不会显示在侧边栏中（默认为false）
 * alwaysShow  {boolean}  如果设置为true，将始终显示根菜单
 * buttons     {Object}   按钮权限
 */

const user = {
  firstLogin: ({ username, password }) => {
    return axios.post(`${base.sso}auth/login`, qs.stringify({
      username: username,
      password: password,
      // tokenUrl: 'http://192.168.1.87:81/a/ssoLogin',
      tokenUrl: '',
      authThirdType: 'SYSTEM',
      state: null
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    })
  },
  ssoLogin: (params) => {
    return axios.get(`${base.admin}a/ssoLogin`, {
      params: {
        Authorization: getToken(),
        mobile: true,
        mobileLogin: true,
        __ajax: true,
        nowTime: new Date().getTime()
      }
    })
  },
  getUserInfoAndMenuList: id => {
    return axios.get(`${base.admin}a/api/menu/getUserAndMenuList?id=${id}`)
    // return Promise.resolve({ menu })
  },
  /**
   * @method 获取用户列表
   */
  getUserList: () => {
    return axios.get(`${base.admin}api/hall/rest/hallUser/userList`)
  },
  /**
   * @method 获取用户树
   */
  getUserTree: (params) => {
    return axios.get(`${base.admin}api/hall/rest/office/officetree`, { params })
    // if (params.type === 'OFFICE') {
    //   return axios.get('/office.json')
    // } else {
    //   return axios.get('/role.json')
    // }
  }
}
export default user

