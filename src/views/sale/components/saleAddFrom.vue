<template>
  <div class="form">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="订单类型：" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择类型">
          <WrapOption
            v-for="(item, index) of saleTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称：" prop="customer_id">
        <el-select
          v-model="ruleForm.customer_id"
          placeholder="请选择客户"
          filterable
          @change="get_customer_id"
        >
          <WrapOption
            v-for="(item, index) of customerList"
            :key="index"
            :label="entrance!=='shop'?item.companyName:item.customerName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人：" prop="contactName">
        <el-input v-model="ruleForm.contactName" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="contactNumber">
        <el-input v-model="ruleForm.contactNumber" />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="ruleForm.remark" />
      </el-form-item>
    </el-form>
    <div class="explain">注：常规订单使用台账进行收款，预付款订单使用押金/预付款进行收款</div>
  </div>
</template>
<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {

  },
  data() {
    return {
      entrance: '',
      ruleForm: {
        type: '',
        customer_id: '',
        contactName: '',
        contactNumber: '',
        remark: ''
      },
      saleTypeList: [
        { label: '常规订单', value: 'NORMAL' },
        { label: '预付订单', value: 'PREPAID' }
      ],
      customerList: [], // 客户列表
      rules: {
        type: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        customer_id: [
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ],
        contactName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactNumber: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
          // { required: true, trigger: 'blur', validator: this.checkPhone }
        ]
      }
    }
  },
  created() {
    this.entrance = this.$route.query.entrance
    this.get_customerList()
  },
  methods: {
    get_customer_id(val) {
      if (this.customerList.length === 0) return false
      for (var i in this.customerList) {
        if (val === this.customerList[i].id) {
          this.ruleForm.contactName = this.customerList[i].name
          this.ruleForm.contactNumber = this.customerList[i].phone
          return
        }
      }
    },
    get_customerList() {
      this.customerList = []
      if (this.entrance === 'shop') {
        this.$api.shopCustomer.shopCustomer({ customerType: '9' }).then(res => {
          this.customerList = res.list
        })
      } else {
        const json = {
          pageIndex: null,
          pageSize: null,
          customerSimple: {
            customerRequest: {
              state: 'APPROVED'
            }
          }
        }
        this.$api.customerMsg.getlist(json).then(res => {
          if (res) {
            var companyList = res.list
            for (var i in companyList) {
              this.customerList.push({
                id: companyList[i].constructCompany.id,
                companyName: companyList[i].constructCompany.companyName,
                name: companyList[i].defaultConstructInfo.name,
                phone: companyList[i].defaultConstructInfo.phone
              })
            }
          }
        })
      }
      // const params = {
      //   customerSimple: { customerRequest: { state: 'APPROVED' }}
      // }
      // this.$api.billApi.getCustomerList().then(res => {
      //   this.customerList = res
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.explain{
  font-size: 14px;
  color: #888888;
}
.form {
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}
.el-form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-form-item {
    width: 46%;
    float: left;
    ::v-deep .el-form-item__label {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
