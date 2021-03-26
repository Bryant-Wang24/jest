<template>
  <div class="submitResult">
    <div class="iconWrapper">
      <i class="el-icon-success" />
    </div>
    <div class="text">已生成任务书</div>
    <div class="btnWrapper">
      <el-button @click="back">返回列表</el-button>
      <el-button @click="view">查看任务书</el-button>
    </div>
  </div>
</template>

<script>
import pageMixin from '@/views/mixins/page'
export default {
  mixins: [pageMixin],
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    back() {
      this.$router.push({ name: 'TaskBookAdmin' })
    },
    view() {
      console.log(this.$route.query)
      const { id, taskBookId, settled } = this.$route.query
      this.$router.push({
        name: 'LookBook',
        query: { id, taskBookId, settled }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.submitResult {
  height: calc(100vh - 84px);
  padding: 20px;
  width: 100%;
  background-color: #ffffff;
  .text {
    text-align: center;
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  .iconWrapper {
    text-align: center;
    margin-bottom: 20px;
    i {
      color: #67c23a;
      font-size: 72px;
    }
  }
  .btnWrapper {
    text-align: center;
    margin-top: 60px;
    margin-bottom: 30px;
  }
  .infoWrapper {
    width: 400px;
    height: 200px;
    margin: 0 auto;
    font-size: 14px;
  }
  .infoType {
    margin-bottom: 10px;
  }
  .infoSpan {
    margin-left: 5px;
  }
}
</style>
