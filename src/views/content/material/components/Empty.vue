<template>
  <div class="null">
    <div class="new_ok" :style="[obj]" else>
      <div class="ok_new">
        <i class="el-icon-folder-add" />
        <div class="title">当前没有文件，请先创建文件夹</div>
        <el-button @click="AddFolder">新建文件夹</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      obj: {
        width: '100%',
        background: '#FFFFFF',
        height: document.documentElement.clientHeight - 125 + 'px'
      }
    }
  },
  methods: {
    AddFolder() {
      this.$emit('AddFolder')
    }
  }
}
</script>
<style lang="scss" scoped>
.new_ok{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .ok_new{
    width: auto;
    height: auto;
    text-align: center;
    i{
      font-size: 36px;
      color: #CDCDCD;
      margin-bottom: 20px;
    }
    .title{
      line-height: 24px;
      font-size: 12px;
      color: #999999;
      font-weight: 400;
      margin-bottom: 15px;
    }
  }
}
</style>
