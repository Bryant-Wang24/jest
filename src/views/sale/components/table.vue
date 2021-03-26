<template>
  <div style="margin-top:16px">
    <table style="width:100%" class="table_header">
      <tr>
        <td
          v-for="(item, index) of tableHeader"
          :key="index"
          :style="{ width: item.width }"
        >
          {{ item.text }}
        </td>
      </tr>
    </table>

    <div v-if="tableData.length !== 0" class="table_show">
      <div v-for="(ite, i) in tableData" :key="i" class="table_content">
        <table
          style="width:100%;margin-bottom:0"
          class="table_header table_header_title"
        >
          <tr>
            <td style="text-align: left;padding-left:16px">
              <span>订单编号：<el-button
                type="text"
                @click="operation('订单详情', ite)"
              >{{ ite.orderNo }}</el-button></span>
              <span style="color:#666666">订单创建人：{{ 'createBy' in ite?ite.createBy.name : '--' }}</span>
              <span style="color:#666666">创建时间：{{ ite.createDate }}</span>
            </td>
            <td style="text-align: right;padding-right:24px">
              <el-button
                size="small"
                type="text"
                @click="operation('订单详情', ite)"
              >订单详情</el-button>
              <el-button
                v-if="ite.status === 'CREATED' && hasRoleUserPermission('sale_edit', ite.createBy ? ite.createBy.id : null)"
                size="small"
                type="text"
                @click="operation('修改订单', ite)"
              >修改订单</el-button>
              <el-button
                v-if="ite.status === 'CREATED' && hasRoleUserPermission('sale_delete', ite.createBy ? ite.createBy.id : null)"
                size="small"
                type="text"
                @click="operation('删除订单', ite)"
              >删除订单</el-button>
            </td>
          </tr>
        </table>

        <div class="table_new">
          <div style="flex:1" class="table_new_sku">
            <div v-for="(n, key) in ite.items" :key="key" class="table_new_ul">
              <div class="table_new_li" style="width:45%"><div class="table_new_li_span">{{ n.name }}</div></div>
              <div class="table_new_li" style="width:21%">
                <div class="table_new_li_span">￥{{ n.price || '-' }}/{{ n.quantityUnit||'-' }}/{{ n.priceUnit||'-' }}</div>
              </div>
              <div class="table_new_li" style="width:21%">
                <div class="table_new_li_span">x {{ n.quantity }}{{ n.quantityUnit||'-' }}</div>
              </div>
              <div class="table_new_li" style="width:13%">
                {{ n.secondQuantity }}{{ n.priceUnit||'-' }}
              </div>
            </div>
          </div>
          <div class="set" style="width:17%">
            <div class="set_new">
              <div class="new_cell">
                <div class="cell_span">
                  <el-tooltip class="item " effect="dark" :content="ite.customerName" placement="bottom">
                    <el-button type="text">{{ ite.customerName }}</el-button>
                  </el-tooltip>
                  <el-tooltip class="item " effect="dark" :content="'( 客户编号：'+ite.customerNo+' )'" placement="bottom">
                    <el-button type="text" style="color:#666666">( 客户编号：{{ ite.customerNo }} )</el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div class="set" style="width:12%">
            <div class="set_new">
              <div class="new_cell">
                <div class="cell_span">￥{{ ite.amount }}</div>
                <div class="cell_span" style="color:#666666">( 优惠:￥{{ ite.discount || "0" }} )</div>
              </div>

            </div>
          </div>
          <div class="set" style="width:9%">
            <div v-if="ite.status === 'CREATED'" class="set_new">已创建</div>
            <div v-if="ite.status === 'CONFIRMED'" class="set_new">已确认</div>
            <div v-if="ite.status === 'UNPAID'" class="set_new">待收款</div>
            <div v-if="ite.status === 'PARTIALLY_PAID'" class="set_new">
              部分收款
            </div>
            <div v-if="ite.status === 'FINISHED'" class="set_new">已完成</div>
          </div>
          <div class="set" style="width:9%">
            <div class="set_new">
              <div class="new_cell">
                <div v-if="ite.status !== 'CREATED'" class="cell_span contract" @click="path_contract(ite)">查看合同</div>
                <!-- <div>状态：待确认</div> -->
                <div v-else class="cell_span" style="color:#666666">-</div>
              </div>
            </div>
          </div>
          <div class="set" style="width:10%">
            <div class="set_new">
              <!-- <div v-if="ite.remark!==''"> -->
              <el-tooltip v-if="ite.remark!==''" class="item content_item" effect="dark" :content="ite.remark" placement="bottom">
                <el-button type="text">{{ ite.remark }}</el-button>
              </el-tooltip>
              <!-- </div> -->

              <div v-else>-</div>
              <!-- {{ ite.remark }} -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="table_none">暂无数据</div>
  </div>
</template>
<script>
// import TablePage from '@/components/table/table'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  // components: { TablePage },
  data() {
    return {
      tableHeader: [
        { text: '明细项名称', width: '19%' },
        { text: '单价', width: '9%' },
        { text: '数量', width: '9%' },
        { text: '计价单位', width: '6%' },
        { text: '客户', width: '17%' },
        { text: '实际应收', width: '12%' },
        { text: '订单状态', width: '9%' },
        { text: '合同/服务单', width: '9%' },
        { text: '备注', width: '10%' }
      ]
    }
  },
  methods: {
    path_contract(val) {
      this.$router.push({ name: 'contractEdit', params: { id: val.contractId }})
    },
    operation(type, data) {
      const json = {
        type: type,
        data: data
      }
      this.$emit('operation', json)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button--text{
  color: #0045FF;
}
.content_item{
  width: 100%;
  color: #000000;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;

}
.table_header {
  display: inline-table;
  margin-bottom: 16px;
  border: 1px solid #E7EAEC;
  background: #FAFAFA;
  tr {
    // background: #fafafa;
    // border: 1px solid #E7EAEC;
    border-radius: 2px 2px 0px 0px;
    td {
      padding: 0;
      text-align: center;
      font-size: 14px;
      color: #000000;
      font-weight: 400;
      line-height: 42px;
    }
  }
}
.table_content {
  width: 100%;
  display: inline-table;
  margin-bottom: 16px;
}
.table_header_title {
  border: 0.5px solid #e7eaec;
  tr {
    td {
      span {
        margin-right: 32px;
        .el-button {
          color: #2a44ff;
        }
      }
    }
  }
}
.table_none {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  box-sizing: border-box;
}
.table_new {
  border: 0.5px solid #e7eaec;
  border-top: 0;
  margin-top: -1px;
  display: flex;
  div {
    text-align: center;
    font-size: 14px;
    color: #000000;
    font-weight: 400;
    line-height: 62px;
  }
  .set {
    position: relative;
    border-right: 1px solid #e7eaec;
    border-bottom: 1px solid #e7eaec;
    .set_new {

      width: 100%;
      height: auto;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      margin: auto;
      .new_cell {
        width: 100%;
        text-align: left;
        font-size: 14px;
        // line-height: 20px;
        .cell_span{
          //  text-align: left;
          line-height: 22px;
          .el-button{
            margin: 0;
            padding: 0;
            width: 100%;
            text-align: center;
            // display: inline-table;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #000000;
          }

        }
      }

      // .el-button{

      // }
      .contract {
        color: #2a44ff;
      }
    }
  }
  .table_new_sku {
    width: 100%;
    .table_new_ul {
      display: flex;
      justify-content: space-between;
      .table_new_li {
        width: 100%;
        position: relative;
        border-right: 1px solid #e7eaec;
        border-bottom: 1px solid #e7eaec;
        .table_new_li_span{
          width: 99%;
          padding: 14px 10px;
          box-sizing: border-box;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          margin:auto;
          line-height: 18px;
        }
      }
    }
  }
}
</style>
