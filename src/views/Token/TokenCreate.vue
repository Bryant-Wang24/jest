<template>
  <div class="TokenCreate">
    <div class="container">

      <div class="title">生成口令</div>

      <div class="description">
        <span>点击“生成口令”按钮后，系统将自动生成6位数口令，可将口令用于需要输入口令的场景；</span>
        <span>每个口令仅可使用1次，如需多次使用，请重新生成口令；</span>
      </div>

      <div class="btnWrap">
        <el-button :loading="loading" type="primary" @click="createToken">生成口令</el-button>
      </div>

      <div class="tokenInput">
        <el-input v-model="input" class="input" :disabled="true" />
        <el-button v-clipboard:copy="input" v-clipboard:success="clipboardSuccess" type="text">复制口令</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  name: 'TokenCreate',
  directives: {
    clipboard
  },
  data() {
    return {
      loading: false,
      input: ''
    }
  },
  mounted() {
    this.getToken()
  },
  methods: {
    createToken() {
      this.loading = true
      this.$api.token.createToken().then(res => {
        this.input = res
        this.$message.success('操作成功')
      }).finally(() => {
        this.loading = false
      })
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    getToken() {
      this.$api.token.getToken().then(res => {
        if (res) { this.input = res }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.TokenCreate {
  padding: 20px;
  .container {
    padding: 20px;
    min-height: calc(100vh - 124px);
    // margin-bottom: 20px;
    background-color: #ffffff;
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .description {
      padding: 20px;
      background-color: #F4F4F5;
      span {
        display: block;
        line-height: 24px;
        font-size: 14px;
        color: #666;
      }
    }
    .btnWrap {
      margin-top: 20px;
    }
    .tokenInput {
      margin-top: 20px;
      .input {
        width: 200px;
        margin-right: 10px;
      }
    }
  }
}
</style>
