<template>
  <div>
    <el-dialog
      title="审批流"
      width="31%"
      :visible.sync="dialogContract"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <div class="dialogBtn">
        <ApprovalLine :vertical="vertical" :approve-id="approveId" />
        <!-- <div class="dialog_new">
          <el-steps direction="vertical" :active="active">
            <el-step
              v-for="(item,index) of stepList"
              :key="index"
              :title="item.role+'('+item.state+')'"
              :description="item.message===null ? '': item.message"
              :icon="item.icon"
            />
          </el-steps>
          <el-steps class="steps_time" direction="vertical" :active="active">
            <el-step
              v-for="(item,index) of stepList"
              :key="index"
              :description="item.date===null ? '': item.date"
            />
          </el-steps>
        </div> -->
        <el-button @click="beforeClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ApprovalLine from '@/components/ApprovalLine'
export default {
  components: { ApprovalLine },
  props: {
    dialogContract: {
      type: Boolean,
      default: false
    },
    stepList: {
      type: Array,
      default: () => {
        return []
      }
    },
    approveId: {
      type: [Number, String],
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      vertical: true
    }
  },
  watch: {},
  methods: {
    beforeClose() {
      this.$emit('beforeClose')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.el-steps {
  ::v-deep .el-step {
    .is-wait{
      .is-icon{
          border-radius: 50%;
          border: 1px solid #CCCCCC;
        }
    }
    .is-process {
      .el-step__icon {
        border-radius: 50%;
        border: 0.5px solid $--custom--color--primary;
        .el-icon-approval,.el-icon-ing{
          box-sizing: content-box;
          margin: 3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: $--custom--color--primary;
        }
      }
    }
    .el-step__title,.el-step__description{
      color: black;
    }
  }
}

.dialogBtn {
  width: 100%;
  text-align: center;
  .el-button{
    width: 96px;
    float: right;
    margin: 20px 0;
  }
}
.dialog_new {
  position: relative;
  .el-steps {
    margin: 0 auto;
    width: 80%;
    height: 250px;
  }
  .steps_time {
    width: 50%;
    position: absolute;
    top: 0;
    right: 0;
    ::v-deep.el-step {
      .el-step__description{
        text-align: right;
      }
      .el-step__head {
        display: none;
      }
    }
  }
}
</style>
