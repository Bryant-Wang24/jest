<template>
  <div class="dialogWrap">
    <div v-show="content" class="content">{{ content }}</div>
    <div class="tip">{{ tip }}</div>
    <div v-if="!isPaid" class="token">
      <span>口令：</span>
      <el-input v-model="input" class="input" placeholder="请输入内容" />
    </div>
    <div class="btn">
      <el-button @click="call">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </div>
</template>

<script>

const CONTENT = {
  PAID: '任务书将下发到各个执行部门',
  NO_PAID: '',
  RESCINDED: '当前项目已撤销，无法下发任务书'
}

const TIP = {
  PAID: '下发任务书后将不可再进行修改',
  NO_PAID: '当前项目款项未结清，输入口令后才可下发任务书'
}
export default {
  props: {
    isPaid: {
      type: Boolean,
      default: true
    },
    isRescinded: {
      type: Boolean,
      default: false
    },
    taskBookId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      input: ''
    }
  },
  computed: {
    content() {
      const { isPaid, isRescinded } = this.$props
      if (isRescinded) {
        return CONTENT.RESCINDED
      }
      return isPaid ? CONTENT.PAID : CONTENT.NO_PAID
    },
    tip() {
      const { isPaid, isRescinded } = this.$props
      if (isRescinded) {
        return ''
      }
      return isPaid ? TIP.PAID : TIP.NO_PAID
    }
  },
  methods: {
    checkInput() {
      if (!this.input || this.input?.length !== 6) {
        this.$message.error('请填写六位数字口令')
        return false
      }
      return true
    },
    // 确定按钮下发
    confirm() {
      const params = { taskBookId: this.taskBookId }

      if (!this.isPaid) {
        if (this.checkInput()) {
          params.password = this.input
        } else {
          return
        }
      }

      this.$emit('confirm', params)
    },
    // 取消
    call() {
      this.$emit('call')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogWrap {

  .content {
    padding-bottom: 20px;
    font-size: 16px;
  }
  .token {
    display: flex;
    margin-top: 20px;
    text-align: center;
    span {
      line-height: 36px;
    }
    .input {
      flex: 1;
    }
  }
  .tip{
    // text-align: center;
    color: #ccc;
    font-size: 14px;
  }
  .btn {
    margin-top: 30px;
    text-align: center;
  }
}
</style>
