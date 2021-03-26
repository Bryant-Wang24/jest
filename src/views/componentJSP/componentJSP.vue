<template>
  <div id="componentJSP">
    <iframe width="100%" height="100%" :src="`${path}`" frameborder="0" seamless />
  </div>
</template>

<script>
export default {
  data() {
    return {
      path: ''
    }
  },
  watch: {
    $route: (val) => {
      console.log('$route:', val)
    }
  },
  created() {
    console.log(this.$route.meta)
    const { href } = this.$route.meta
    this.path = '/a' + href
  },
  mounted() {
    console.log(this.$route)
    localStorage.setItem('currentPath', this.$route.path)
  }
}
</script>
<style lang="scss" scoped >
#componentJSP{
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
