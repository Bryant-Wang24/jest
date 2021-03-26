<template>
  <div class="content_add">
    <div class="content">
      <div class="left">
        <iframe ref="iframe" :src="src" :style="[obj]" />
      </div>
      <div class="right" :style="[obj]">
        <div>
          <div class="title">
            查看申请表
          </div>
          <div class="li">
            <span class="label">申请人</span>{{ invoiceInfo.createName }}
          </div>
          <div class="li">
            <span class="label">申请时间：</span>{{ invoiceInfo.createDate }}
          </div>
          <div class="li">
            <span class="label">开票状态：</span>{{ invoiceInfo.invoiceState }}</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <el-button
        @click="clickBtn('back')"
      >返回</el-button>
      <el-button
        @click="clickBtn('download')"
      >下载</el-button>

    </div>

  </div>
</template>
<script>
import base from '@/api/base'
import { INVOICE_STATE } from '@/common/bill'

export default {
  name: '',
  components: { },
  data() {
    return {
      base: base, // 默认路劲
      id: null, // 发票id
      src: '',
      url: '', // 下载地址
      imgPage: [],
      obj: {
        width: '100%',
        height: document.documentElement.clientHeight - 152 + 'px'
      },
      invoiceInfo: {
        createDate: '',
        createName: '',
        invoiceState: ''
      }
    }
  },
  watch: {

  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    clickBtn(type) {
      switch (type) {
        case 'back':
          // this.$router.go(-1)
          this.$store.dispatch('tagsView/delView', this.$route).then(() => {
            this.$router.push({ name: 'BillManagement' })
          })
          break
        case 'download':
          window.location.href = this.url
          break

        default:
          break
      }
    },
    init() {
      const invoiceId = this.$route.params.id
      this.id = invoiceId
      this.getInvoiceInfo(invoiceId)
      this.previewFile(invoiceId)
    },
    getInvoiceInfo(invoiceId) {
      this.$api.billApi.findInvoiceById(invoiceId).then(res => {
        const { createDate, createName, invoiceState } = res
        this.invoiceInfo = { createDate, createName, invoiceState: INVOICE_STATE[invoiceState] }
      })
    },
    previewFile(invoiceId) {
      this.$api.billApi.getApplicationFile(invoiceId).then(res => {
        console.log('getApplicationFile', res)
        const { urlEncodedAddress: url } = res

        this.src = this.$api.file.filePreview(url)
        this.url = url
        // this.$api.file.filePreview({ url }).then(res => {

        // })
      })
    }
  }

}
</script>
<style lang="scss" scoped>
::v-deep .el-table{
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  // th,td{
  //   border-right: 1px solid #dfe6ec;
  // }
}
.rowTitle {
  .el-button {
    display: inline-table;
    float: right;
    color: #888888;
    margin-right: 12px;
  }
}
.form_title_right {
  background: white;
  .span {
    float: right;
    color: #888888;
    font-size: 14px;
  }
}
.content_add {
  width: 100%;
  .content {
    width: 100%;
    height: auto;
    padding-bottom: 64px;
    box-sizing: border-box;
    display: flex;
    .left {
      width: 70%;
      height: 100%;
      margin-right: 16px;
    }
    .right {
      background: white;
      box-sizing: border-box;
      padding: 24px;
      overflow: auto;
      flex: 1;
      .title {
        width: 100%;
        font-size: 18px;
        font-weight: 400;
        line-height: 32px;
      }
      .li {
        display: flex;
        width: 100%;
        line-height: 32px;
        font-size: 14px;
        .label {
          display: block;
          min-width: 70px;
          color: #666666;
        }
      }
      .imgS{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .imgPage{
          width: 40%;
          img{
            width: 100%;
            height: 200px;
            border: 1px solid #D9D9D9;
          }
          .span{
            width: 100%;
            line-height: 32px;
            text-align: center;
            padding-bottom: 15px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
.foot {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 64px;
  padding: 0 56px;
  box-sizing: border-box;
  line-height: 64px;
  background: white;
  text-align: right;
  font-size: 14px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
  .num {
    display: inline-table;
    margin-right: 100px;
    span {
      font-size: 20px;
      color: #ff0000;
    }
  }
  .el-button {
    width: 96px;
  }
}

.order-dialog {
  .top {
    display: flex;
    justify-content: space-between;
    .top-block {
      .top-title {
        color: #666666;
      }
    }
  }
  .table {
    margin-top: 20px;
  }
  .bottom {
    text-align: right;
    margin-top: 20px;
    .bottom-item {
      display: flex;
      margin-bottom: 10px;
      justify-content: flex-end;
      .bottom-title {
        color: #666666;
      }
      .amount {
        min-width: 140px;
      }
      .total-amount {
        color: #FF0000;
        font-size: 16px;
      }
    }
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
