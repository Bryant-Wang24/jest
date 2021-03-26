
export default {
  created() {
    // 页面设置当前path,为了解决刷新时异步路由丢失
    localStorage.setItem('currentPath', this.$route.path)
  },
  activated() {
    // 页面设置当前path,为了解决刷新时异步路由丢失
    localStorage.setItem('currentPath', this.$route.path)
  }
}
