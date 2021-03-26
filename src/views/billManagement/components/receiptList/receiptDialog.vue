<template>
  <div class="receipt">
    <el-dialog
      :title="isConfirm?'确认已开收据':'标记已回收收据'"
      :visible.sync="receiptVisible"
      width="30%"
    >
      <el-form class="invoiceForm">
        <div class="topList">
          <div class="name">申请编号：</div>
          <div class="intro">{{ receiptInfo.applyCode }}</div>
        </div>
        <div class="topList">
          <div class="name">项目名称：</div>
          <div class="intro">{{ receiptInfo.projectName }}</div>
        </div>
        <div class="topList">
          <div class="name">客户名称：</div>
          <div class="intro">{{ receiptInfo.customer }}</div>
        </div>
        <div class="topList">
          <div class="name">开收据金额：</div>
          <div class="intro">{{ receiptInfo.receiptAmount }}</div>
        </div>
        <div class="topList">
          <div class="name">申请人：</div>
          <div class="intro">{{ receiptInfo.createName }}</div>
        </div>
        <div class="topList">
          <div class="name">申请时间：</div>
          <div class="intro">{{ receiptInfo.createDate }}</div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="trailReceipt(isConfirm,receiptInfo.id)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    receiptVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    receiptInfo: {
      type: Object,
      default() {
        return null
      }
    },
    isConfirm: {
      type: Boolean,
      default() {
        false
      }
    }
  },
  watch: {
    // receiptVisible(val) {
    //   this.$emit('changeDialog', val)
    // }
  },
  methods: {
    async trailReceipt(isConfirm, id) {
      try {
        if (isConfirm) {
          await this.trailInvoice(id)
          this.$message.success('操作成功')
          this.$emit('getReceiptList')
        } else {
          await this.trailRecovery(id)
          this.$message.success('操作成功')
          this.$emit('getReceiptList')
        }
        this.$emit('update:receiptVisible', false)
      } catch (error) {
        this.$message.success('操作失败')
      }
    },
    // 确认已开收据
    trailInvoice(id) {
      return this.$api.billApi.trailReceiptInvoiced(id)
    },
    // 回收收据
    trailRecovery(id) {
      return this.$api.billApi.trailReceiptRecovery(id)
    },
    cancel() {
      this.$emit('update:receiptVisible', false)
    }
  }

}
</script>

<style lang='scss' scoped>
.receipt{
    .invoiceForm {
    .topList {
      margin-bottom: 10px;
      display: flex;
      .name{
          width: 90px;
          text-align:right;
      }
    }
  }
}
</style>
