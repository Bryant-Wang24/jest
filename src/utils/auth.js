import Cookies from 'js-cookie'

const TokenKey = 'Authorization'

export function setCookie(key, value) {
  return Cookies.set(key, value)
}

export function getCookie(key) {
  return Cookies.get(key)
}

export function removeCookie(key) {
  return Cookies.remove(key)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeLoginInfo() {
  removeToken()
  removeCookie('JSESSIONID')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('menu')
  localStorage.removeItem('currentPath')
}
