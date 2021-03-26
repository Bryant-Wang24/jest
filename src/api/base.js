/**
 * 接口域名的管理
 */
// 环境的切换
let admin = '/'
let elc = '/'
let sso = '/'
let hall = '/'
let kk = '/'
const env = process.env.NODE_ENV
const title = process.env.VUE_APP_PROJECT_NAME || ''
const ENV_TAG = process.env.VUE_APP_ENV_TAG || 'poly'
export const isPoly = ENV_TAG === 'poly'
export const isBaiMa = ENV_TAG === 'baima'
if (env === 'development') {
  hall = '/admin/'
  admin = '/admin/'
  elc = '/elc/'
  // sso无法使用代理，原因是重定向回到localhost
  // 在这里修改不同环境下的sso
  sso = 'http://account.ems.369zhan.com/'
  // sso = 'http://192.168.1.23:8010/'
  kk = 'http://test.exhibition-hall.jiuxiang.tech/'
} else if (env === 'production') {
  hall = process.env.VUE_APP_HALL_API
  admin = process.env.VUE_APP_ADMIN_API
  sso = process.env.VUE_APP_SSO_API
  elc = '/elc/'
}

export default {
  title,
  admin,
  sso,
  hall,
  kk,
  elc,
  ENV_TAG,
  isPoly,
  isBaiMa
}
