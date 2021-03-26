<template>
  <div>
    <el-table
      :data="recordTableData"
      border
      :header-cell-style="{
        background: '#FAFAFA',
        color: '#000000'
      }"
      style="width: 100%;"
    >
      <el-table-column
        :resizable="false"
        fixed
        prop="createDate"
        label="操作时间"
        width="160"
        show-overflow-tooltip
      />
      <el-table-column
        :resizable="false"
        prop="action"
        label="用途"
      >
        <template slot-scope="scope">
          <div>{{ ACTION_TEXT[scope.row.action ? scope.row.action : ACTION.PAY_ORDER] }}</div>
          <!-- <div v-if="scope.row.action === 'BILLING_DEPOSIT'">押金入账</div>
          <div v-if="scope.row.action === 'PAY_ORDER'">订单收款</div>
          <div v-if="scope.row.action === 'TURN_DEPOSIT'">押金转款</div>
          <div v-if="scope.row.action === 'INSERT_BY_TURN'">转款新增</div> -->
        </template>
      </el-table-column>
      <el-table-column :resizable="false" prop="amount" label="金额" align="right">
        <template slot-scope="scope">
          <div>￥{{ scope.row.amount }}</div>
        </template>
      </el-table-column>
      <el-table-column :resizable="false" prop="payeeNo" label="订单编号/押金编号" show-overflow-tooltip />
      <el-table-column :resizable="false" prop="projectName" label="所属项目" show-overflow-tooltip />
      <el-table-column :resizable="false" label="操作人" prop="operatorName">
        <!-- <template slot-scope="scope">
          <div v-if="scope.row.createBy">{{ scope.row.createBy.name }}</div>
        </template> -->
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ACTION_TEXT, ACTION } from '@/common/deposit'
export default {
  props: {
    recordTableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      ACTION_TEXT,
      ACTION
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
