<template>
  <div class="content_new">
    <div class="new">
      <MainTitle title="订单详情" />
      <row-text style="margin-bottom:20px" :text="'订单信息'" />
      <el-form
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="项目名称：">{{ newData.projectName || '无' }}</el-form-item>
        <el-form-item label="订单编号：">{{ newData.orderNo }}</el-form-item>
        <el-form-item label="订单类型：">{{ newData.type==='PREPAID' ? '预付订单' : '常规订单' }}</el-form-item>
        <el-form-item label="客户名称：">{{ newData.customerName||'-' }}</el-form-item>
        <el-form-item label="联系人：">{{ newData.contactName||'-' }}</el-form-item>
        <el-form-item label="联系电话：">{{ newData.contactNumber||'-' }}</el-form-item>
        <el-form-item label="订单状态：">
          {{ newData.status_name }}
          <!-- <div v-if="newData.status==='CREATED'">已创建</div>
          <div v-if="newData.status==='CONFIRMED'">已确认</div>
          <div v-if="newData.status==='UNPAID'">待收款</div>
          <div v-if="newData.status==='PARTIALLY_PAID'">部分收款</div>
          <div v-if="newData.status==='FINISHED'">已完成</div> -->
        </el-form-item>
        <el-form-item label="订单创建人：">{{ newData.createByName }}</el-form-item>
        <el-form-item label="创建时间：">{{ newData.createDate }}</el-form-item>
        <!-- <el-form-item label="收款状态：">{{ newData.status_name }}</el-form-item> -->
        <el-form-item label="备注："><div>{{ newData.remark || '无' }}</div></el-form-item>
      </el-form>
      <row-text style="margin-bottom:20px" :text="'订单明细'" />
      <div class="table">
        <table-page
          :table-data="newData.items"
          :table-header="tableHeader"
        />
        <div class="table_number">
          <div class="table_num"><div class="new_content"><div class="num_new"><span>优惠总额：</span><span class="span">-￥{{ newData.discount }}</span></div></div></div>
          <div class="table_num"><div class="new_content"><div class="num_new"><span>合计应收：</span><span class="span" style="color:#FF0000">￥{{ newData.amount }}</span></div></div></div>
        </div>
      </div>
      <row-text style="margin-bottom:20px" :text="'合同/服务订单'" />
      <div class="table_contract">
        <el-button
          v-if="hasRoleUserPermission('saleDetails_generate', newData.createBy ? newData.createBy.id : null)"
          type="primary"
          class="primary_btn"
          :disabled="isCreated==='0' || state_show(state)"
          @click="addContractDialogVisible = true"
        >生成</el-button>
        <table-page :table-data="tableData" :table-header="[]">
          <el-table-column prop="contract.idNum" label="合同ID" min-width="130" />
          <el-table-column label="客户" min-width="100" prop="customers_name" show-overflow-tooltip />
          <el-table-column label="类型" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.contract.nature==='MAIN'">主合同</div>
              <div v-else>补充合同</div>
            </template>
          </el-table-column>
          <el-table-column label="总金额" min-width="100" align="right">
            <template slot-scope="scope">￥{{ scope.row.contract.amount }}</template>
          </el-table-column>
          <el-table-column label="提交人" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.contract.createBy!==null ? scope.row.contract.createBy.name:'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="contract.updateDate" label="提交时间" min-width="160" />
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.contract.state==='NOT_CONFIRMED'">待确认</div>
              <div v-if="scope.row.contract.state==='AUDITING'">审核中</div>
              <div v-if="scope.row.contract.state==='REJECTED'">已拒绝</div>
              <div v-if="scope.row.contract.state==='EFFECTIVE'">已生效</div>
              <div v-if="scope.row.contract.state==='OBSOLETE'">已作废</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="clickBtn(scope.row,'查看')">查看</el-button>
              <!-- &&
                    hasRoleUserPermission('saleDetails_void', newData.createBy ? newData.createBy.id : null) -->
              <el-button
                v-if="(scope.row.contract.state === 'REJECTED' || scope.row.contract.state === 'NOT_CONFIRMED') &&
                  hasRoleUserPermission('saleDetails_void', newData.createBy ? newData.createBy.id : null)"
                type="text"
                size="mini"
                @click="clickBtn(scope.row,'作废')"
              >作废</el-button>
              <el-button v-if="scope.row.contract.state!=='NOT_CONFIRMED'" type="text" size="mini" @click="clickBtn(scope.row,'审批流')">审批流</el-button>
              <!-- <el-button v-if="scope.row.contract.state==='EFFECTIVE'" type="text" size="mini" @click="clickBtn(scope.row,'合同文件')">合同文件</el-button> -->
              <el-button
                v-if="scope.row.contract.state==='NOT_CONFIRMED' && hasRoleUserPermission('saleDetails_submit', newData.createBy ? newData.createBy.id : null)"
                type="text"
                size="mini"
                :class="{'button_RESCINGED' :state_show(state)}"
                :disabled="state_show(state)"
                @click="clickBtn(scope.row,'提交审核')"
              >提交审核
                <warning v-if="state_show(state)" />

              </el-button>
              <el-button v-if="(scope.row.contract.state==='AUDITING') && isApprovalAuth(scope.row.currentApproverId)" type="text" @click="clickBtn(scope.row,'审批')">审批</el-button>
              <el-button v-if="scope.row.contract.state!==('REJECTED' || 'OBSOLETE')" type="text" size="mini" @click="clickBtn(scope.row,'导出')">导出</el-button>
            </template>
          </el-table-column>
        </table-page>
      </div>
      <AddContractDialog
        :project-id="newData.projectId"
        :add-contract-dialog-visible="addContractDialogVisible"
        @created_page="created_page"
        @beforeClose="addContractDialogVisible = false"
      />
      <dialog-contract
        :dialog-contract="dialogContract"
        :approve-id="approvalFlowId"
        @beforeClose="dialogContract = false"
      />

    </div>
  </div>
</template>
<script>
import RowText from '@/components/rowText'
import pageMixin from '@/views/mixins/page'
import AddContractDialog from './components/AddContractDialog'
import DialogContract from './components/dialogContract'
import TablePage from '@/components/table/table'
import { isApprovalAuth } from '@/common/approve'
import MainTitle from '@/components/base/MainTitle'

// import { SUCCESS } from 'dropzone'
export default {
  name: '',
  components: { TablePage, AddContractDialog, RowText, DialogContract, MainTitle },
  mixins: [pageMixin],
  data() {
    return {
      // entrance: '',
      isApprovalAuth,
      approvalFlowId: '',
      active: Number(0),
      routerId: '',
      addContractDialogVisible: false,
      dialogContract: false, // 审批流
      stepList: [], // 审批流数据
      // dialogConcat:false,
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
      tableHeaderContract: [
        { key: 'contract.idNum', text: '合同ID' },
        { key: 'name', text: '类型' },
        { key: 'standard', text: '总金额' },
        { key: 'standard', text: '总金额', align: 'right' },
        { key: 'secondQuantity', text: '提交人' },
        { key: 'price', text: '提交时间', minWidth: '150' },
        { key: 'quantity', text: '状态' }
      ],
      tableData: [],
      newData: {
        'items': []
      },
      isCreated: '1', // 合同新建（1--是，0--否）
      userInfo: {}, // 账户数据
      project: '', // 场地销售数据
      state: ''
    }
  },
  watch: {
    $route() {
      this.get_router_id()
    }
  },
  created() {
    this.get_router_id()
  },
  methods: {
    state_show(val) {
      return val === 'RESCINDED'
    },
    // 项目详情
    set_getSiteMarketID(id) {
      this.$api.siteMarketList.getSiteMarketID(id).then(res => {
        if (res) {
          this.state = res.state
        }
      })
    },
    clickBtn(res, type) {
      switch (type) {
        case '查看':
          this.$router.push({
            name: 'contractEdit',
            params: { id: res.contract.id }
          })
          break
        case '审批':
          this.$router.push({
            name: 'contractAudit',
            params: { id: res.contract.id }
          })
          break
        case '导出':
          this.get_download(res)
          break
        case '作废':
          this.btn_some(res, type)
          break
        case '提交审核':
          this.btn_some(res, type)
          break
        case '审批流':
          this.get_contractApprove(res.contract.approvalFlowId)
          break
        case '合同文件':
          break
      }
    },
    get_download(json) {
      this.$api.contract.downloadInAttachmentWay({ id: json.contract.id, type: 'DOCX' }).then(res => {
        if (res.urlEncodedAddress !== '') {
          window.location.href = res.urlEncodedAddress
        } else {
          this.$message.error('导出失败')
        }
      })
    },
    //
    btn_some(res, type) {
      this.$confirm(
        '您确定将合同编号为' + res.contract.idNum + '进行' + type + ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          type === '作废' ? this.get_contractDeleteId(res.contract.id) : this.get_contractsSubmit({ id: res.contract.id, userId: res.contract.createBy.id })
        })
        .catch(() => {
        })
    },
    // 合同作废
    get_contractDeleteId(id) {
      this.$api.contract.contractDeleteId({ id: id }).then(res => {
        this.get_contractsListByOrder()
        this.$message.success('操作成功')
      })
    },
    // 提交审核
    get_contractsSubmit(json) {
      this.$api.contract.contractsSubmit(json).then(res => {
        if (res === true) {
          this.get_contractsListByOrder()
        }
      })
    },
    // 获取审批流
    get_contractApprove(id) {
      this.approvalFlowId = id
      this.dialogContract = true
    },
    get_router_id() {
      this.get_dictList()
      // this.entrance = this.$route.query.entrance
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.routerId = this.$route.params.id
      // this.get_orderItem()
      this.get_contractsListByOrder()
      this.addContractDialogVisible = false

      // this.get_projectId()
    },
    // 服务订单
    created_page(val) {
      const json = {
        contract: {
          orderId: this.routerId,
          template: {
            id: val
          },
          project: {
            id: this.newData.projectId
          },
          updateBy: {
            id: this.userInfo.id
          }
        }
      }
      this.$api.contract.contractsSave(json).then(res => {
        if (res === true) {
          this.$message.success('添加成功')
          this.get_router_id()
        }
      })
    },
    get_dictList() {
      this.$api.dict.getDictList('HALL_PRICE_ITEM_TYPE').then(res => {
        if (res) {
          this.dictList = res
          this.get_orderItem()
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
      this.$api.sale.orderItem({ id: this.routerId }).then(res => {
        for (var i in res.items) {
          res.items[i]['price_name'] = '￥' + res.items[i].price + '/' + res.items[i].quantityUnit + '/' + res.items[i].priceUnit
          res.items[i]['price_unit'] = res.items[i].secondQuantity + res.items[i].priceUnit
          res.items[i]['price_quantity'] = res.items[i].quantity + res.items[i].quantityUnit
          res.items[i]['discount_num'] = Number(res.items[i].discount) === 0 ? res.items[i].discount : '-' + res.items[i].discount
          res.items[i]['standard_name'] = res.items[i].standard === null ? '-' : res.items[i].standard
          res.items[i]['type_name'] = this.get_type_name(res.items[i].type)
          res.items[i]['feeType_name'] = res.items[i].feeType === 'RENT' ? '租赁费' : '服务费'
        }
        res['status_name'] = res.status === 'CREATED' ? '已创建' : res.status === 'CONFIRMED' ? '已确认' : res.status === 'UNPAID' ? '待收款' : res.status === 'PARTIALLY_PAID' ? '部分收款' : '已完成'
        this.newData = res
        this.set_getSiteMarketID(res.projectId)
        this.newData['createByName'] = '-'
        if (res.createBy !== null) {
          this.newData['createByName'] = res.createBy.name
        }
        this.newData.projectId = res.projectId.toString()
        // this.get_projectId(res)
      })
    },
    // 查看根据订单id获取关联合同列表
    get_contractsListByOrder() {
      this.$api.contract.contractsListByOrder({ id: this.routerId }).then(res => {
        if (res) {
          if (res.length === 0) {
            this.isCreated = '1'
            return
          }
          for (const k in res) {
            let customers_name = ''
            for (const j in res[k].customers) {
              customers_name += res[k].customers[j]?.customerName + '，'
            }
            res[k]['customers_name'] = customers_name.substring(0, customers_name.length - 1)
          }
          this.tableData = res
          for (var i in res) {
            if (res[i].contract.state === 'NOT_CONFIRMED' || res[i].contract.state === 'AUDITING' || res[i].contract.state === 'EFFECTIVE') {
              this.isCreated = '0'
              return
            } else {
              this.isCreated = '1'
            }
          }
        }
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.page_num = val
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.new {
  width: 100%;
  padding: 24px;
  background: white;
  // display: inline-table;
  .form_title {
    width: 100%;
    background: #fafafa;
    padding: 9px 4px 9px 15px;
    box-sizing: border-box;
    display: inline-table;
    height: 22px;
    line-height: 22px;
    position: relative;
    margin-bottom: 24px;
    .title_border {
      width: 4px;
      height: 16px;
      background: $--custom--color--primary;
      position: absolute;
      left: 5px;
      top: 11px;
    }
  }
  .el-form {
    width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    align-content: flex-end;
    ::v-deep .el-form-item {
      margin-bottom: 8px;
      width: 33%;
      .el-form-item__label-wrap {
        .el-form-item__label {
          margin:0;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          text-align: left;
        }
      }
      .el-form-item__content{
        line-height: 20px;
        div{
          text-align: justify;
          text-justify: newspaper;
          word-break: break-all;
        }

      }
    }
  }
}
.table {
  width: 100%;
  .table_new ::v-deep .el-table {
    border: 0.5px solid #e7eaec;
    border-bottom: 0;
  }
  .table_number {
    width: 100%;
    display: inline-table;
    padding: 0 10px;
    margin-top: 15px;
    box-sizing: border-box;
    .table_num {
      line-height: 32px;
      font-size: 14px;
      text-align: right;
      .new_content{
        width: 12%;
        display: inline-table;
        .num_new{
          width:100%;
          span {
            color: #666666;
            float: left;

          }
          .span{
            width: 50%;
            float: right;
            text-align: right;
            color: #000000;
          }
        }
      }
    }
  }
}
.table_contract {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  .primary_btn {
    width: 96px;
    border-radius: 2px;
    margin-bottom: 13px;
  }
  .table_new{
    ::v-deep .el-table{
      border-top: 1px solid #dfe6ec;
      border-left: 1px solid #dfe6ec;
      th,td{
        border-right: 1px solid #dfe6ec;
      }
    }
  }
}
.el-button--text{
  color: #0045FF;
}
.button_RESCINGED{
  color: #C0C4CC;
}
</style>
