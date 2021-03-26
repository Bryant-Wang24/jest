<template>
  <div id="collectionPro">
    <!-- 押金记录部分 -->
    <div class="deposit_record">
      <rowText :text="'押金记录'" />
      <el-table
        :data="tableData"
        border
        :header-cell-style="{
          background: '#FAFAFA',
          color: '#000000'
        }"
        style="width: 100%; margin-top: 10px;"
      >
        <el-table-column
          :resizable="false"
          prop="code"
          label="押金编号"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          :resizable="false"
          prop="projectName"
          label="项目名称"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          :resizable="false"
          prop="customerName"
          label="客户名称"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          :resizable="false"
          label="押金类别"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.depositType === 'ADVANCE_PAYMENT'">预付款</div>
            <div v-if="scope.row.depositType === 'DEPOSIT'">押金</div>
            <div v-if="scope.row.depositType === 'CONSTRUCTION_BOND'">施工保证金</div>
            <div v-if="scope.row.depositType === 'STORE_DEPOSIT'">商铺押金</div>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="accountNameAs"
          label="收款账户"
        />
        <el-table-column
          :resizable="false"
          prop="totalAmount"
          label="应收金额"
          align="right"
        >
          <template slot-scope="scope">
            <div>￥{{ scope.row.totalAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="receiveAmount"
          label="已收金额"
          align="right"
        >
          <template slot-scope="scope">
            <div>￥{{ scope.row.receiveAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="usedAmount"
          label="已用金额"
          align="right"
        >
          <template slot-scope="scope">
            <div>￥{{ scope.row.usedAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          label="可用余额"
          align="right"
        >
          <template slot-scope="scope">
            <div>￥{{ scope.row.availableAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="remark"
          label="备注"
          width="120"
          show-overflow-tooltip
        />
      </el-table>
    </div>
    <!-- 收款处理部分 -->
    <div class="collection_pro">
      <!-- <div class="collection_title">
        <span>收款处理</span>
      </div> -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="订单收款" name="first">
          <!-- 收款处理查询部分 -->
          <div class="table_header">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="选择项目：">
                <el-select v-model="projectValue" disabled placeholder="请选择" style="width: 320px" />
              </el-form-item>
              <el-form-item label="客户名称：">
                <el-select v-model="customerValue" filterable placeholder="请选择（可检索）" style="width: 320px">
                  <WrapOption
                    v-for="item in customerOptions"
                    :key="item.value"
                    :label="item.customerName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
            <el-table

              style="width: 100%"
              :header-cell-style="{
                background: '#FAFAFA',
                color: '#000000'
              }"
            >
              <template slot="empty">
                <div :style="[{ height: '0px' }]" />
              </template>
              <el-table-column align="center" :resizable="false" fixed label="应收款编号" width="120" />
              <el-table-column align="center" :resizable="false" label="款项名称" width="340" />
              <el-table-column align="center" :resizable="false" label="应收金额" width="140" />
              <el-table-column align="center" :resizable="false" label="已收金额" width="140" />
              <el-table-column align="center" :resizable="false" label="剩余应收" width="140" />
              <el-table-column align="center" :resizable="false" label="应收日期" width="160" />
              <el-table-column align="center" :resizable="false" label="收款状态" width="80" />
              <el-table-column align="center" :resizable="false" label="款项备注" />
              <el-table-column align="center" :resizable="false" label="本次收款金额" width="160" />
              <el-table-column align="center" :resizable="false" label="操作" width="100" />
            </el-table>
          </div>
          <!-- 收款处理表格列表 -->
          <div v-for="(item, index) in tableList" :key="index" class="table_list">
            <div v-if="item.paymentPlanGroups.length > 0">
              <div class="table_tips">
                <span>客户：{{ item.customerName }}</span>
                <span class="tip_grey">（客户编号：{{ item.customerNo }}）</span>
                <span>订单总额：￥{{ item.amount }}</span>
                <span class="tip_grey">
                  <el-tooltip class="item" effect="dark" :content="contentTips[index].join('')" placement="top-start">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </span>
                <span class="tip_grey" style="float: right;margin-right:5px;">创建时间：{{ item.createDate }}</span>
                <span class="tip_grey" style="float: right">订单创建人：{{ item.createBy? item.createBy.name:'' }}（{{ item.createBy.office ? item.createBy.office.name : '无' }}）</span>

                <span class="tip_grey" style="float: right;margin-right:10px;" @click="jump(item)">订单编号：<i>{{ item.orderNo }}</i></span>
              </div>
              <div v-for="itemData in item.paymentPlanGroups" :key="itemData.id">
                <el-table
                  :data="sort(itemData.items)"
                  border
                  style="width: 100%"
                  :show-header="false"
                  :header-cell-style="{
                    background: '#FAFAFA',
                    color: '#000000'
                  }"
                >
                  <el-table-column fixed prop="payIdNum" label="" width="120" show-overflow-tooltip />
                  <el-table-column prop="name" label="" width="340" show-overflow-tooltip />
                  <el-table-column prop="amount" label="" align="right" width="140">
                    <template slot-scope="scope">
                      <div>￥{{ scope.row.amount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="paidAmount" label="" align="right" width="140">
                    <template slot-scope="scope">
                      <div>￥{{ scope.row.paidAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="" align="right" width="140">
                    <template slot-scope="scope">
                      <div>￥{{ scope.row.receivableBalance }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="payDate" label="" :formatter="formatter" width="160" />
                  <el-table-column label="" width="80">
                    <template slot-scope="scope">
                      <div v-if="scope.row.payState === 'UNPAID'">待付款</div>
                      <div v-if="scope.row.payState === 'PARTIAL_PAID'">部分付款</div>
                      <div v-if="scope.row.payState === 'PAID'">已付款</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remarks" label="" show-overflow-tooltip />
                  <el-table-column label="" width="160">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.thisTimeAmount"
                        placeholder="请输入"
                        :disabled="(scope.row.payState === 'PAID')?true:false"
                        @keyup.native="scope.row.thisTimeAmount = limitNumberInput(scope.row.thisTimeAmount)"
                      />
                      <!-- oninput="value=value.replace(/^\.+|[^\d.]/g,'')" -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="" width="100">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.row.payState !== 'PAID'"
                        type="text"
                        size="small"
                        @click.native.prevent="confirmCollection(scope)"
                      >
                        确认收款
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div v-if="listShow" class="listShow">暂无数据</div>

        </el-tab-pane>
        <el-tab-pane label="收款记录" name="second">
          <CollectionRecord :table-data="paymentTableData" :project-id="projectId" @recall="recall" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import pageMixin from '@/views/mixins/page'
import RowText from '@/components/rowText'
import CollectionRecord from './components/CollectionRecord'
import moment from 'moment'
import { deepClone } from '@/utils'
import { limitNumberInput } from '@/utils/common'
import WrapOption from '@/components/base/WrapOption'
export default {
  name: 'CollectionPro',
  components: {
    RowText,
    CollectionRecord,
    WrapOption
  },
  mixins: [pageMixin],
  data() {
    return {
      activeName: 'first',
      id: null,
      projectOptions: [],
      projectValue: '',
      projectId: '', // 项目id
      customerId: null, // 客户id
      customerOptions: [],
      customerValue: '',
      depositId: '', // 押金id
      receiveAccountId: '', // 退款账户id
      tableData: [],
      tableList: [],
      listShow: false,
      surplusRece: '', // 可用余额金额
      thisTimeAmount: '', // 本次收款金额
      contentTips: [], // 金额提示
      gTips: '', // 国贸提示
      wTips: '', // 物业提示
      paymentTableData: [] // 收款记录数据
    }
  },
  created() {
    // 从缓存中拿客户名称
    if (sessionStorage.getItem('customerOptions')) {
      this.customerOptions = JSON.parse(sessionStorage.getItem('customerOptions'))
    }
    this.id = this.$route.query.id
    this.getDepositInfo(this.id, true)
  },
  mounted() {

  },
  methods: {
    limitNumberInput(v) {
      return limitNumberInput(v, 2)
    },
    jump(val) {
      this.$router.push({ name: 'saleDetails', params: { id: val.id }})
    },
    formatter(row) {
      return row.payDate ? moment(row.payDate).format('YYYY-MM-DD') : ''
    },
    sort(data) {
      const _data = deepClone(data) || []

      const paidList = _data.filter(t => t.payState === 'PAID')
      const paidListSort = paidList.sort((a, b) => {
        return a.order - b.order
      })
      const unPaidList = _data.filter(t => t.payState !== 'PAID')
      const unPaidListSort = unPaidList.sort((a, b) => {
        return a.order - b.order
      })
      return [...unPaidListSort, ...paidListSort]
    },
    // 撤回收款
    recall(id) {
      this.$api.account.recallPayment(id).then(res => {
        this.getDepositInfo(this.id, false)
        if (this.customerValue) {
          this.onSubmit()
        }
        this.$message.success('操作成功')
      })
    },
    // 通过押金id获取押金 && 获取还款记录
    getDepositInfo(id, val) {
      console.log(val)
      this.$api.depositMsg.getDepositById(id).then(res => {
        this.tableData = [res]
        this.projectValue = res.projectName
        this.projectId = res.projectId
        this.depositId = res.id
        this.receiveAccountId = res.accountId
        this.surplusRece = res.availableAmount
        val ? this.customerValue = res.customerId : ''
        this.onSubmit(false)
      })
      this.$api.depositMsg.getDepostitPayment(id).then(res => {
        this.paymentTableData = res
      })
    },
    // 查询
    onSubmit(isAuto = true) {
      if (!this.customerValue) { // 未选择客户提升用户
        this.$message.warning('请选择客户')
        return
      }
      // 每次请求是先清空当前数组
      this.tableList = []
      const params = {
        projectId: this.projectId,
        contractCustomerId: this.customerValue,
        inOrderStatus: ['UNPAID', 'PARTIALLY_PAID'],
        orderType: 'PREPAID',
        accountId: this.receiveAccountId,
        page: { pageNum: 1, pageSize: 10 }
      }
      this.$api.depositMsg
        .getOrderList(params)
        .then(res => {
          // 添加本次收款金额字段
          if (res.list) {
            for (let i = 0; i < res.list.length; i++) {
              for (let m = 0; m < res.list[i].paymentPlanGroups.length; m++) {
                for (let n = 0; n < res.list[i].paymentPlanGroups[m].items.length; n++) {
                  res.list[i].paymentPlanGroups[m].items[n].thisTimeAmount = ''
                }
              }
            }
            this.tableList = res.list
            // 判断当前数组是否有数据，没数据显示没数据的提示，有数据就显示列表
            if (this.tableList.length > 0) {
              this.listShow = false
            } else {
              this.listShow = true
              isAuto && this.$message.info('未查询到应收款的订单')
            }
            // 设置金额提示
            for (let i = 0; i < res.list.length; i++) {
              this.contentTips[i] = []
              for (let m = 0; m < res.list[i].accountAmounts.length; m++) {
                this.contentTips[i].push(`${res.list[i].accountAmounts[m].accountName}:￥${res.list[i].accountAmounts[m].amount}\n`)
              }
            }
          } else {
            this.listShow = true
            isAuto && this.$message.info('未查询到应收款的订单')
          }
        })
        .catch(err => {
          console.log(err)
          // this.$message.error(err.statusText)
        })
        .finally(() => {

        })
    },
    // 确认收款
    confirmCollection(scope) {
      // 判断本次收款金额是否填写
      if (scope.row.thisTimeAmount > 0) {
        // 比较本次收款金额与上面押金记录里的可用余额大小
        if (scope.row.thisTimeAmount > this.surplusRece) {
          this.$message({
            message: '本次收款金额不能大于上面押金记录里的可用余额！',
            type: 'warning'
          })
        } else {
          const query = 'paymentMethod=DEPOSIT'
          const params = {
            depositId: this.depositId,
            paymentPlanItemId: scope.row.id,
            amount: scope.row.thisTimeAmount
          }
          this.$api.depositMsg.orderCollection(query, params).then(res => {
            console.log(res)
            this.$message({
              message: '收款成功！',
              type: 'success'
            })
            this.getDepositInfo(this.id, false)
            this.onSubmit(false)
          })
        }
      } else {
        this.$message({
          message: '请填写本次收款金额！',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
  #collectionPro{
    font-style: PingFang SC;
    .deposit_record{
      background: #fff;
      margin: 15px;
      padding: 20px;
      .title_div{
        position: relative;
        background: #FAFAFA;
        height: 40px;
        margin-bottom: 20px;
        span{
          padding-left: 10px;
          line-height: 40px;
        }
        .title_line{
          position: absolute;
          left: 0;
          top: 12px;
          width: 4px;
          height: 16px;
          background: $--custom--color--primary;
        }
      }
    }
    .collection_pro{
      background: #fff;
      margin: 15px;
      padding: 20px;
      .collection_title{
        span{
          font-size: 18px;
          font-weight: bolder;
        }
        margin-bottom: 10px;
      }
      .el-form-item{
        margin-left: 20px;
      }
      ::v-deep .el-table__header{
        color: #000000;
        background: #E7EAEC;
        min-height: 30px;
      }
      ::v-deep .el-table__empty-block {
        min-height: 0px;
      }
      .table_list{
        margin-top: 20px;
        .table_tips{
          height: 42px;
          border: 1px solid #E7EAEC;
          border-bottom: none;
          padding: 0 10px;
          span{
            font-size: 14px;
            line-height: 42px;
            margin-left: 5px;
          }
          .tip_grey{
            color: #666666;
            i{
              font-style: normal;
              color: #0045FF;
            }
          }
        }
      }
      .listShow{
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #666666;
        margin-top: 20px;
      }
    }
  }
</style>
