<template>
  <div class="submitResult">
    <div class="result-wrap">
      <div class="iconWrapper">
        <i :class="icon" />
      </div>
      <div class="text">{{ text }}</div>
      <div v-if="tips" class="tips">{{ tips }}</div>
      <div class="btnWrapper">
        <slot name="button">
          <el-button @click="back">返回列表</el-button>
          <el-button @click="view">查看详情</el-button>
        </slot>
      </div>
      <div v-show="info.length > 0" class="infoWrapper">
        <div class="info">
          <slot name="info">
            <div v-for="item in info" :key="item.label" class="infoItem">
              <span class="label">{{ item.label }}:</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubmitResult',
  props: {
    icon: {
      type: String,
      default: 'el-icon-success'
    },
    text: {
      type: String,
      default: '提交成功'
    },
    tips: {
      type: String,
      default: ''
    },
    /**
     * @description {label: '客户类型',value: '主办单位'}
     */
    info: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    back() {
      this.$emit('back')
    },
    view() {
      this.$emit('view')
    }
  }
}
</script>
<style lang="scss" scoped>
.submitResult {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 124px);
  background-color: #ffffff;
  .result-wrap {
    flex: 1;
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
      display: flex;
      justify-content: center;
      .info {
        padding: 20px;
        background-color: #f5f7fa;
        .infoItem {
          margin-bottom: 12px;
          .label {
            margin-right: 12px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
