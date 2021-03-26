<template>
  <div style="margin-top:16px">
    <table style="width:100%" class="table_header">
      <tr>
        <td
          v-for="(item, index) of tableHeader"
          :key="index"
          :style="{ width: item.width }"
          style="text-align: center;"
        >
          {{ item.text }}
        </td>
      </tr>
    </table>

    <div v-if="tableData.length !== 0" class="table_show">
      <div v-for="(ite, i) in tableData" :key="i" class="table_content">
        <table
          v-if="ite.order_children.length!==0"
          style="width:100%;margin-bottom:0"
          class="table_header table_header_title"
        >
          <tr>
            <td class="left">
              <div class="span ">客户：{{ ite.customerName }} <span style="color:#666666">(客户编号：{{ ite.customerNo }})</span></div>
              <div class="span">订单总额：￥{{ ite.amount ||'0' }}</div>
            </td>
            <td class="right">
              <span class="span fl">创建时间：{{ ite.createDate || '-' }}</span>
              <span class="span fl">订单创建人：{{ ite.createBy.name || '-' }}</span>
              <span class="span fl">订单编号：<span style="color:#0045FF" @click="operation('订单编号', ite)">{{ ite.orderNo }}</span></span>
            </td>
          </tr>
        </table>

        <div class="table_new">
          <div v-for="(items,n) of ite.order_children" :key="n" class="new_row">
            <div class="set" style="width:9%">
              <div class="set_new">
                <el-tooltip v-if="items.payIdNum!==''" class="item content_item" effect="dark" :content="items.payIdNum" placement="bottom">
                  <el-button type="text">{{ items.payIdNum }}</el-button>
                </el-tooltip>
                <div v-else>-</div>
              </div>
            </div>
            <div class="set" style="width:19%">
              <div class="set_new">
                <el-tooltip v-if="items.name!==''" class="item content_item" effect="dark" :content="items.name" placement="bottom">
                  <el-button type="text">{{ items.name }}</el-button>
                </el-tooltip>
                <div v-else>-</div>
              </div>
            </div>
            <div class="set" style="width:9%">
              <div class="set_new">
                <el-tooltip v-if="items.amount!==''" style="text-align: right" class="item content_item" effect="dark" :content="items.amount.toString()" placement="bottom">
                  <el-button type="text">￥{{ items.amount }}</el-button>
                </el-tooltip>
                <div v-else>-</div>
              </div>
            </div>
            <div class="set" style="width:9%">
              <div class="set_new">
                <el-tooltip v-if="items.paidAmount!==''" style="text-align: right" class="item content_item" effect="dark" :content="items.paidAmount.toString()" placement="bottom">
                  <el-button type="text">￥{{ items.paidAmount }}</el-button>
                </el-tooltip>
                <div v-else>-</div>
              </div>
            </div>
            <div class="set" style="width:9%">
              <div class="set_new">
                <el-tooltip v-if="items.receivableBalance!==''" style="text-align: right" class="item content_item" effect="dark" :content="items.receivableBalance.toString()" placement="bottom">
                  <el-button type="text">￥{{ items.receivableBalance }}</el-button>
                </el-tooltip>
                <div v-else>-</div>
              </div>
            </div>
            <div class="set" style="width:11%">
              <div class="set_new">
                <el-tooltip v-if="items.payDate!==''" class="item content_item" effect="dark" :content="items.payDate_num > 0 ? items.payDate+'(已逾期)' : items.payDate" placement="bottom">
                  <el-button type="text" :class="{'colorRed':items.payDate_num> 0}">{{ items.payDate_num > 0 ? items.payDate+'(已逾期)' : items.payDate }}</el-button>
                </el-tooltip>
                <div v-else>-</div>
              </div>
            </div>
            <div class="set" style="width:10%">
              <div class="set_new">
                <el-tooltip v-if="items.remarks!==''" class="item content_item" effect="dark" :content="items.remarks" placement="bottom">
                  <el-button type="text">{{ items.remarks }}</el-button>
                </el-tooltip>
                <div v-else>-</div>
              </div>
            </div>
            <div class="set" style="width:9%">
              <div class="set_new">
                <div>{{ items.payState_name }}</div>
              </div>
            </div>
            <div class="set" style="width:15%">
              <div class="set_new" style="text-align: left;padding:0 15px">
                <el-button
                  type="text"
                  @click="operation('收款记录', items)"
                >收款记录</el-button>
                <el-popover v-model="items.visible" width="220" placement="bottom">
                  <div class="popover">
                    <div class="li">
                      <div class="name">滞纳金比例：</div>
                      <div class="input">
                        <el-input
                          v-model="items.proportion"
                          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                          style="width:100px"
                          class="popover_oeder"
                          @keyup.native="keyup(n,i)"
                        ><template slot="append">%</template></el-input>
                      </div>
                    </div>
                    <div class="li">
                      <div class="name">已逾期天数：</div>
                      <div class="input">
                        <el-input
                          v-model="items.payDate_nums"
                          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                          style="width:100px"
                          class="popover_oeder"
                          @keyup.native="keyup(n,i)"
                        ><template slot="append">天</template></el-input>
                      </div>
                    </div>
                    <div class="li liRed">
                      <div class="name">应缴滞纳金：</div>
                      <div class="input input_red">￥{{ items.overdue }}</div>
                    </div>
                  </div>
                  <el-button v-if="items.payDate_num>0" slot="reference" type="text" style="margin-left:5px" @click="reference(n,i)">滞纳金</el-button>
                </el-popover>
                <!-- <el-button
                  v-if="items.payDate_num<0"

                  type="text"
                >滞纳金</el-button> -->
              </div>
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
        { text: '应收款编号', width: '9%' },
        { text: '款项名称', width: '19%' },
        { text: '应收金额', width: '9%' },
        { text: '已收金额', width: '9%' },
        { text: '剩余应收', width: '9%' },
        { text: '应收日期', width: '11%' },
        { text: '备注', width: '10%' },
        { text: '收款状态', width: '9%' },
        { text: '操作', width: '15%' }

      ]
    }
  },
  methods: {
    keyup(index, i) {
      var obj = this.tableData[i].order_children[index]
      this.tableData[i].order_children[index].overdue = ((obj.payDate_nums * obj.proportion * obj.amount) / 100).toFixed(2)
    },
    reference(index, i) {
      var obj = this.tableData[i].order_children[index]
      this.tableData[i].order_children[index].proportion = 0.4
      this.tableData[i].order_children[index].payDate_nums = obj.payDate_num
      this.tableData[i].order_children[index].overdue = ((obj.payDate_num * obj.proportion * obj.amount) / 100).toFixed(2)
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
.popover{
  width: 100%;
  .li{
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    .name{
      line-height: 32px;
      font-size: 12px;
      color: #666666;
    }
    .input{
      flex: 1;
      .popover_oeder{
        margin-bottom: 0;
      }
    }
  }
  .liRed{
    border-top:1px solid #E7EAEC;
    margin-bottom: 0;
    .input_red{
      color: #FF0000;
      line-height: 32px;
    }
  }
}
.el-button--text{
  color: #0045FF;
}
.content_item{
  color: #000000;

}
.table_header {
  // position: absolute;
  // top: 0;
  // display: inline-table;
  margin-bottom: 16px;
  border: 1px solid #E7EAEC;
  // background: #FAFAFA;
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
  // display: inline-table;
  margin-bottom: 16px;
}
.table_header_title {
  border: 0.5px solid #e7eaec;
  tr {
    td {
      .span {
        float: left;
        margin-right: 20px;
        &.fl {
          float: right;
        }
        .el-button {
          color: #2a44ff;
        }
      }
    }
    .left {
      text-align: left;
      padding-left:20px;
      span {
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .right {
      text-align: right;
      padding-right:20px;
      color:#666666;
      span {
        &:first-child {
          margin-right: 0;
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
.table_show{
  width: 100%;
  box-sizing: border-box;
}
.table_new {
  border: 0.5px solid #e7eaec;
  border-top: 0;
  border-bottom: 0;
  margin-top: -1px;
  // display: inline-table;
  // display: flex;
  width: 100%;
  .new_row{
    width: 100%;
    display: flex;
    height: 34px;
    .set {
      // display: inline-table;
      text-align: center;
      font-size: 14px;
      color: #000000;
      font-weight: 400;
      line-height: 34px;
      border-right: 1px solid #e7eaec;
      border-bottom: 1px solid #e7eaec;
      .set_new {
        // line-height: 42px;
        width: 100%;
        height: auto;
        .item{
          margin: 0;
          padding: 0;
          width: 100%;
          padding: 0 5px;
          text-align: center;
          display: inline-table;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #000000;
        }
        .colorRed{
          color: #FF0000;
        }
        .contract {
          color: #2a44ff;
        }
      }
    }
  }
  .table_new_sku {
    width: 100%;
    .table_new_ul {
      display: flex;
      justify-content: space-between;
      .table_new_li {
        border-right: 1px solid #e7eaec;
        border-bottom: 1px solid #e7eaec;
      }
    }
  }
}
</style>
