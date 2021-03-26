// whites为路由name白名单
export default function(whites = []) {
  return {
    beforeRouteEnter(to, from, next) {
      const { fullPath, name } = from
      const { path } = to
      const isHasPath = localStorage.getItem(path)
      if (whites.includes(name) && !isHasPath) {
        localStorage.setItem(path, fullPath)
        next()
      } else {
        next()
      }
    }
  }
}
