<template>
  <div class="EntryRecord">
    <RowText :text="'入账记录'" />
    <el-table
      class="EntryRecord-talbe"
      :data="tableData"
      border
      :header-cell-style="{
        background: '#FAFAFA',
        color: '#000000'
      }"
    >
      <el-table-column :resizable="false" prop="createDate" label="入账时间" width="200" />
      <el-table-column :resizable="false" prop="payerNo" label="台账编号" width="200" />
      <el-table-column :resizable="false" prop="amount" label="入账金额" width="200" />
      <el-table-column :resizable="false" prop="operatorName" label="操作人" width="200" />
      <el-table-column v-if="showButton" :resizable="false" label="操作" width="200">
        <template slot-scope="scope">
          <el-popconfirm title="确定撤回此次入账吗？" :hide-icon="true" @onConfirm="recall(scope.row)">
            <el-button v-if="hasRolePermission('DepositList_recall')" slot="reference" type="text">撤回入账</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import RowText from '@/components/rowText'
export default {
  components: {
    RowText
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    recall(row) {
      this.$emit('recall', row.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.EntryRecord {
  margin-top: 20px;
  .EntryRecord-talbe {
    display: inline-block;
    width: inherit;
    margin-top: 20px;
  }
}
</style>
