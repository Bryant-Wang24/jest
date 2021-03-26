<template>
  <div class="content_add">
    <div class="content">
      <div class="left">
        <iframe ref="iframe" :src="src" :style="[obj]" />
      </div>
      <div class="right" :style="[obj]">
        <div v-if="newData">

          <div class="title">
            {{
              routerName ==='refundAudit' ? "审核退款呈批件" : "查看呈批件"
            }}
          </div>
          <el-select v-model="accountValue" placeholder="请选择">
            <WrapOption
              v-for="item in accountList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="li">
            <span>项目名称：</span>{{ newData.refundApply.projectName||'-' }}
          </div>
          <div class="li">
            <span>申请人：</span>{{ newData.refundApply.applier.name || '-' }}
          </div>
          <div class="li">
            <span>提交时间：</span>{{ newData.refundApply.applyDate||'-' }}
          </div>
          <div class="li"><span>状态：</span>{{ newData.refundStatus_name||'-' }}</div>
        </div>
        <ApprovalLine ref="ApprovalLine" :vertical="vertical" :approve-id="approveId" />
      </div>
    </div>
    <div v-if="newData" class="foot">
      <el-button
        @click="clickBtn('返回')"
      >返回</el-button>
      <ApprovalBtn v-if="newData.refundApply.refundStatus==='APPROVING' && routerName==='refundAudit'" :approve-id="approveId" :visible.sync="approveVisible" @refresh="refresh" />
      <el-button
        v-else
        @click="clickBtn('下载')"
      >下载</el-button>
    </div>
  </div>
</template>
<script>
import WrapOption from '@/components/base/WrapOption'
import ApprovalLine from '@/components/ApprovalLine'
import ApprovalBtn from '@/components/ApprovalOperate'
import base from '@/api/base'
import { routerBack } from '@/utils/common'
import SaveRouterFrom from '@/common/mixin/saveRouterFrom'
const whites = ['refund']

const mixin = new SaveRouterFrom(whites)
export default {
  name: '',
  components: { ApprovalLine, ApprovalBtn, WrapOption },
  mixins: [mixin], // before Router Enter
  data() {
    return {
      approveVisible: true, // 审批流按钮组件必传参数
      vertical: true,
      approveId: '',
      numPages: 1,
      base: base, // 默认路劲
      routerId: '',
      newData: '', // 合同全部数据
      userInfo: {}, // 账户数据
      routerName: '',
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'PDF', // 文件类型
      src: '',
      imgPage: [],
      obj: {
        width: '100%',
        height: document.documentElement.clientHeight - 152 + 'px'
      },
      meta_title: '',
      accountList: [],
      accountValue: ''
    }
  },
  watch: {
    accountValue(val) {
      this.getRefundDocx()
    },
    $route() {
      this.routerStyle()
    }
  },
  created() {
    this.routerStyle()
  },
  methods: {

    //
    routerStyle() {
      this.routerName = this.$route.name
      // this.meta_title = this.$route.meta.title
      this.routerId = this.$route.params.id
      this.get_refundapplyNew(this.routerId)
    },
    // 合同 - 获取合同全部信息
    get_refundapplyNew(id) {
      this.$api.refund.refundapplyNew({ id: id }).then(res => {
        if (res) {
          const deposits = res.deposits || []
          // var string = ''
          // for (var n in deposits) {
          //   deposits[n]['paymentName'] = '【' + deposits[n].accountNameAs + '】' + deposits[n].accountName
          //   deposits[n]['depositName'] = deposits[n].depositType === 'ADVANCE_PAYMENT' ? '预付款' : deposits[n].depositType === 'DEPOSIT' ? '押金' : deposits[n].depositType === 'CONSTRUCTION_BOND' ? '施工证保证金' : '商铺押金'
          //   string += deposits[n].accountNameAs
          // }
          res['refundStatus_name'] =
            res.refundApply.refundStatus === 'FOR_REFUND'
              ? '待退款'
              : res.refundApply.refundStatus === 'WAITING_REFUND'
                ? '退款中'
                : res.refundApply.refundStatus === 'INVALID_REFUND'
                  ? '已作废'
                  : res.refundApply.refundStatus === 'APPROVING'
                    ? '审核中'
                    : res.refundApply.refundStatus === 'REJECTED'
                      ? '审核拒绝'
                      : '已退款'
          this.newData = res
          this.approveId = res.refundApply.approvalFlowId

          const accountObject = {}
          for (let i = 0; i < deposits.length; i++) {
            const deposit = deposits[i]
            const { accountNameAs = '', accountId } = deposit
            if (!Reflect.has(accountObject, accountId)) {
              let label = ''
              if (accountNameAs.includes('国贸')) {
                label = '退款呈批件 (国贸)'
              } else if (accountNameAs.includes('物业')) {
                label = '退款呈批件 (物业)'
              }
              this.accountList.push({ label, value: accountId })
              accountObject[accountId] = true
            }
          }

          if (Number(this.accountList.length) === 0) return false
          this.accountValue = this.accountList[0].value
        }
      })
    },
    // pdf模板
    getRefundDocx(data) {
      // this.$api.refund.downloadInAttachmentWay({ id: this.routerId, type: 'DOCX', account: this.accountValue }).then(res => {
      //   if (res) {
      //     if (data === 'DOCX') {
      //       window.location.href = res.urlEncodedAddress
      //       return
      //     } else {
      //       this.src = this.$api.file.filePreview(res.urlEncodedAddress)
      //     }
      //   }
      // })
      this.$api.refund.getRefundDocx({ id: this.routerId, accountId: this.accountValue }).then(res => {
        if (res) {
          if (data === 'download') {
            window.location.href = res.urlEncodedAddress
            return
          } else {
            this.src = this.$api.file.filePreview(res.urlEncodedAddress)
          }
        }
      })
    },
    //
    refresh() {
      this.$message.success('操作成功')
      this.$refs.ApprovalLine.refresh()
      routerBack(this.$route)
      // this.$router.go(-1)
    },
    // 操作
    clickBtn(type) {
      switch (type) {
        case '返回':
          // this.$router.go(-1)
          routerBack(this.$route)
          break
        case '下载':
          this.getRefundDocx('download')
          break
        case '打印':
          // this.$refs.iframe.contentWindow.print()
          // document.getElementById('result').contentWindow.print()
          break
      }
    }

  }
}
</script>
<style lang="scss" scoped>
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
        width: 100%;
        line-height: 32px;
        font-size: 14px;
        span {
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
  // z-index: 10;
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
.el-dropdown-menu{
  z-index: 100;
}
</style>
