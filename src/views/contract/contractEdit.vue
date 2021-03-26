<template>
  <div class="content_add">
    <div class="content">
      <div class="left">
        <iframe ref="iframe" :src="src" :style="[obj]" />
      </div>
      <div class="right" :style="[obj]">
        <div v-if="contract">
          <div class="title">
            {{
              routerName ==='contractAudit' ? "审核合同" : "查看合同"
            }}
          </div>
          <div class="li">
            <span class="label">项目名称：</span>{{ contract.contract.project.projectName }}
          </div>
          <div class="li">
            <span class="label">提交人：</span>{{ contract.contract.createBy.name }}
          </div>
          <div class="li">
            <span class="label">提交时间：</span>{{ contract.contract.createDate }}
          </div>
          <div class="li">
            <span class="label">状态：</span>{{ contract.stateT }}</div>
          <div v-if="contract.contract.amount" class="li">
            <span class="label">总金额：</span>
            {{ contract.contract.amount }}
            <span v-if="contract.contract.discount" class="discount-amount">（优惠:￥{{ contract.contract.discount }}）</span>
          </div>
          <div v-if="contract.contract.amount" class="li">
            <span class="label" />
            <el-button type="text" @click="handleShowOrder">查看订单明细</el-button>
          </div>
        </div>
        <ApprovalLine v-if="approveId" :vertical="vertical" :approve-id="approveId" />
      </div>
    </div>
    <div v-if="contract" class="foot">
      <el-button
        @click="clickBtn('返回')"
      >返回</el-button>
      <ApprovalBtn v-if="routerName ==='contractAudit' && contract.contract.state==='AUDITING'" :approve-id="approveId" :visible.sync="approveVisible" @refresh="refresh" />
      <el-button
        v-else
        @click="clickBtn('下载')"
      >下载</el-button>

    </div>
    <!-- 订单明细dialog -->
    <el-dialog
      title="订单明细"
      :visible.sync="dialog.visible"
      width="80%"
      custom-class="order-dialog"
    >
      <div class="top">
        <div class="top-block">
          <span class="top-title"> 订单编号：</span>
          <span class="top-content">{{ orderRes.orderNo }}</span>
        </div>
        <div class="top-block">
          <span class="top-title"> 订单创建人：</span>
          <span class="top-content">{{ orderRes.createBy && orderRes.createBy.name }}</span>
        </div>
        <div class="top-block">
          <span class="top-title"> 创建时间：</span>
          <span class="top-content">{{ orderRes.createDate }}</span>
        </div>
      </div>
      <div class="table">
        <TablePage
          :table-data="tableData"
          :table-header="tableHeader"
        />
      </div>
      <div class="bottom">
        <div class="bottom-item">
          <span class="bottom-title">优惠总额：</span>
          <span class="amount">-￥{{ orderRes.discount }}</span>
        </div>
        <div class="bottom-item">
          <span class="bottom-title">合计应收：</span>
          <span class="amount total-amount">￥{{ orderRes.amount }}</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 订单明细dialog -->
  </div>
</template>
<script>
import base from '@/api/base'
import TablePage from '@/components/table/table'
import ApprovalLine from '@/components/ApprovalLine'
import ApprovalBtn from '@/components/ApprovalOperate'
import { routerBack } from '@/utils/common'
import SaveRouterFrom from '@/common/mixin/saveRouterFrom'
const whites = ['contract', 'catInvoice', 'saleDetails', 'sale']

const mixin = new SaveRouterFrom(whites)

export default {
  name: 'ContractEdit',
  components: { ApprovalBtn, ApprovalLine, TablePage },
  mixins: [mixin], // before Router Enter
  data() {
    return {
      vertical: true,
      approveId: null, // 审批流
      approveVisible: true, // 审批流按钮组件必传参数
      numPages: 1,
      base: base, // 默认路劲
      routerId: '',
      contract: '', // 合同全部数据
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
      dialog: {
        visible: false
      },
      tableData: [], // 明细表格数据
      orderRes: {}, // 明细表格res
      tableHeader: [
        { key: 'type_name', text: '类型' },
        { key: 'name', text: '明细项名称' },
        { key: 'standard_name', text: '规格' },
        { key: 'price_name', text: '单价', minWidth: '100', align: 'right' },
        { key: 'price_unit', text: '计价单位' },
        { key: 'price_quantity', text: '数量/单位' },
        { key: 'feeType_name', text: '费用性质' },
        { key: 'remark', text: '备注' },
        { key: 'discount_num', text: '优惠金额', align: 'right' },
        { key: 'amount', text: '应收小计', align: 'right' }
      ],
      dictList: [],
      fromRouterName: ''
    }
  },
  watch: {
    // $route() {
    //   this.routerStyle()
    // }
  },
  created() {
    this.routerStyle()
  },
  methods: {
    routerStyle() {
      this.routerName = this.$route.name
      this.routerId = this.$route.params.id
      this.get_dictList()
      this.get_contractInfo()
      this.get_downloadInAttachmentWay('preview')
      // this.get_downloadInImageWay()
    },
    // 合同 - 获取合同全部信息
    get_contractInfo() {
      this.$api.contract.contractInfo({ id: this.routerId }).then(res => {
        if (res) {
          res['stateT'] =
            res.contract.state === 'NOT_CONFIRMED'
              ? '待确认'
              : res.contract.state === 'AUDITING'
                ? '审核中'
                : res.contract.state === 'REJECTED'
                  ? '已拒绝'
                  : res.contract.state === 'EFFECTIVE'
                    ? '已生效'
                    : '已作废'
          this.contract = res
          this.approveId = res.contract.approvalFlowId || null
          if ('orderId' in res.contract) return this.get_orderItem()
        }
      })
    },
    // pdf模板
    get_downloadInAttachmentWay(data) {
      this.$api.contract.downloadInAttachmentWay({ id: this.routerId, type: 'DOCX' }).then(res => {
        if (res) {
          if (data === 'DOCX') {
            window.location.href = res.urlEncodedAddress
            return
          } else if (data === 'preview') {
            this.src = this.$api.file.filePreview(res.urlEncodedAddress)
          }
        }
      })
    },
    // 合同 - 以图片形式下载合同
    get_downloadInImageWay() {
      this.$api.contract.downloadInImageWay({ id: this.routerId }).then(res => {
        if (res.length > 0) {
          this.imgPage = res
        }
      })
    },
    refresh() {
      this.$message.success('操作成功')
      this.clickBtn('返回')
    },
    // 操作
    clickBtn(type) {
      switch (type) {
        case '返回':
          routerBack(this.$route)
          break
        case '拒绝申请':
          this.get_contractsApprove(type)
          break
        case '审批通过':
          this.get_contractsApprove(type)
          break
        case '下载':
          this.get_downloadInAttachmentWay('DOCX')
          break
        case '打印':
          // this.$refs.iframe.contentWindow.print()
          // document.getElementById('result').contentWindow.print()
          break
      }
    },
    // 审批
    get_contractsApprove(type) {
      this.$prompt('原因', '审批合同', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: type === '拒绝申请' ? /\S/ : '',
        inputErrorMessage: '请输入原因'
      })
        .then(({ value }) => {
          const json = {
            id: this.routerId,
            userId: this.userInfo.id,
            reason: value,
            pass: type !== '拒绝申请'
          }
          if (this.contract.contract.nextApproveBy === null) {
            return this.$message.error(
              '编号‘' + this.contract.contract.idNum + '’合同，无法执行该操作'
            )
          }
          if (this.contract.contract.nextApproveBy.id !== this.userInfo.id) {
            return this.$message.warning(
              '编号‘' + this.contract.contract.idNum + '’合同，无法执行该操作'
            )
          }
          this.$api.contract.contractsApprove(json).then(res => {
            if (res === true) {
              this.$message.success('状态修改成功')
            } else {
              this.$message.success('状态修改失败')
            }
            this.get_contractInfo()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消该操作'
          })
        })
    },
    get_dictList() {
      this.$api.dict.getDictList('HALL_PRICE_ITEM_TYPE').then(res => {
        if (res) {
          this.dictList = res
        }
      })
    },
    get_type_name(type) {
      for (const i in this.dictList) {
        if (this.dictList[i].value === type) {
          return this.dictList[i].label
        }
      }
    },
    get_orderItem() {
      const orderId = this.contract.contract.orderId
      this.$api.sale.orderItem({ id: orderId }).then(res => {
        for (var i in res.items) {
          res.items[i]['price_name'] = '￥' + res.items[i].price + '/' + res.items[i].quantityUnit + '/' + res.items[i].priceUnit
          res.items[i]['price_unit'] = res.items[i].secondQuantity + res.items[i].priceUnit
          res.items[i]['price_quantity'] = res.items[i].quantity + res.items[i].quantityUnit
          res.items[i]['discount_num'] = Number(res.items[i].discount) === 0 ? res.items[i].discount : '-' + res.items[i].discount
          res.items[i]['standard_name'] = res.items[i].standard === null ? '-' : res.items[i].standard
          res.items[i]['type_name'] = this.get_type_name(res.items[i].type)
          res.items[i]['feeType_name'] = res.items[i].feeType === 'RENT' ? '租赁费' : '服务费'
        }
        const tableData = res.items || []
        this.orderRes = res
        this.tableData = tableData
      })
    },
    handleShowOrder() {
      this.dialog.visible = true
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
