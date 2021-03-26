<template>
  <div class="submitResult">
    <div class="iconWrapper">
      <i class="el-icon-success" />
    </div>
    <div class="text">提交成功</div>
    <div class="tips">等待审核</div>
    <div class="btnWrapper">
      <el-button @click="back">返回列表</el-button>
      <el-button @click="view">查看详情</el-button>
    </div>
    <!-- <div class="infoWrapper">
      <div class="infoType">
        <span>类型:</span>
        <span class="infoSpan">光地与会议</span>
      </div>
      <div class="infoType">
        <span>名称:</span>
        <span class="infoSpan">2020微信公开课</span>
      </div>
      <div class="infoType">
        <span>场地:</span>
        <span class="infoSpan">5号馆、百合厅</span>
      </div>
      <div class="infoType">
        <span>使用时间:</span>
        <span class="infoSpan">2020-09-20 ~ 2020-09-22</span>
      </div>
      <div class="infoType">
        <span>提交人:</span>
        <span class="infoSpan">小白</span>
      </div>
      <div class="infoType">
        <span>提交时间:</span>
        <span class="infoSpan">2020-07-31</span>
      </div>
    </div> -->
  </div>
</template>

<script>
import pageMixin from '@/views/mixins/page'
export default {
  mixins: [pageMixin],
  data() {
    return {
      id: null,
      source: ''
    }
  },
  mounted() {
    console.log('this.$route.params', this.$route.query)
    const { id, source } = this.$route.query
    this.id = id
    this.source = source
  },
  methods: {
    back() {
      this.$router.push({ name: 'SiteReserve' })
    },
    view() {
      this.$router.push({ name: 'SiteReserveInfo', query: { id: this.id, source: this.source }})
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
  .tips {
    text-align: center;
    margin-bottom: 20px;
    color: #999999;
    font-size: 14px;
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
