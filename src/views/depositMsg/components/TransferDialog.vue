<template>
  <div class="TransferDialog">
    <!-- 押金信息部分 -->
    <span class="title">所属项目：{{ lookOverInfo.projectName }}</span>
    <TablePager
      ref="TablePager"
      :data="[lookOverInfo]"
      :is-pagination="false"
      border
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        show-overflow-tooltip
        :resizable="false"
        :prop="item.key"
        :label="item.text"
        :formatter="item.formatter"
        :width="item.width"
        :align="item.align || 'left'"
      />
    </TablePager>
    <!-- 转款操作部分 -->
    <RowText text="转款" />
    <div class="info_list_div" style="margin-top: 20px">
      <el-form ref="formData" label-position="right" label-width="120px" :inline="true" :rules="rules" :model="formData" class="demo-form-inline">
        <el-form-item label="项目名称：" prop="projectId">
          <el-select v-model="formData.projectId" filterable placeholder="请选择（可检索）" style="width: 440px">
            <WrapOption
              v-for="item in projectOptions"
              :key="item.value"
              :label="item.projectName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="押金金额：">
          <el-input v-model="formData.amount" disabled style="width: 240px" /> 元
        </el-form-item>
        <el-form-item label="备注：" placeholder="（选填）">
          <el-input v-model="formData.remark" type="textarea" style="width: 440px" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import TablePager from '@/components/base/TablePager'
import RowText from '@/components/rowText'
import { TYPE } from '@/common/deposit'
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { TablePager, RowText, WrapOption },
  props: {
    lookOverInfo: {
      type: Object,
      default: () => {}
    },
    projectOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableHeader: [
        {
          key: 'code',
          text: '押金编号',
          width: 140
        },
        {
          key: 'customerName',
          text: '客户名称',
          width: 180
        },
        {
          key: 'depositType',
          text: '押金类别',
          width: 120,
          formatter: (row) => {
            return TYPE[row.depositType] || ''
          }
        },
        {
          key: 'accountNameAs',
          text: '收款账户',
          width: 100
        },
        {
          key: 'totalAmount',
          text: '应收金额',
          align: 'right',
          width: 100,
          formatter: (row) => {
            return `￥${row.totalAmount}` || ''
          }
        },
        {
          key: 'receiveAmount',
          text: '已收金额',
          align: 'right',
          width: 100,
          formatter: (row) => {
            return `￥${row.receiveAmount}` || ''
          }
        },
        {
          key: 'usedAmount',
          text: '已用金额',
          align: 'right',
          width: 100,
          formatter: (row) => {
            return `￥${row.usedAmount}` || ''
          }
        },
        {
          key: 'availableAmount',
          text: '可用余额',
          align: 'right',
          width: 100,
          formatter: (row) => {
            return `￥${row.availableAmount}`
          }
        },
        {
          key: 'remark',
          text: '备注',
          width: 140
        }
      ],
      formData: {
        projectId: null,
        amount: null,
        remark: ''
      },
      rules: {
        projectValue: [{ required: true, message: '请选择项目名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    lookOverInfo: {
      handler(lookOverInfo) {
        this.formData.amount = lookOverInfo?.availableAmount || null
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getFormData() {
      return { ...this.formData }
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            resolve(this.getFormData())
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
