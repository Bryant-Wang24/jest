<template>
  <div class="customer">
    <el-form
      ref="customer"
      :rules="rules"
      :model="customer"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
    >
      <el-form-item label="商铺名称：" prop="projectName">
        <el-input v-model="customer.projectName" />
      </el-form-item>
      <el-form-item label="客户：" prop="hostId">
        <el-select v-model="customer.hostId" filterable placeholder="请选择">
          <WrapOption
            v-for="(item, index) of customerList"
            :key="index"
            :label="item.customerName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="场地类型：" prop="siteType">
        <!-- <el-radio-group v-model="customer.siteType" @change="getSiteType"> -->
        <el-radio-group v-model="customer.siteType">
          <el-radio v-for="(item) of radioList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="场地编号：" prop="siteNo">
        <el-input v-model="customer.siteNo" />
      </el-form-item>
      <!-- <el-form-item label="选择场地：" prop="siteMessageIds">
        <el-select v-model="customer.siteMessageIds" multiple placeholder="请选择">
          <WrapOption
            v-for="(item, index) of siteList"
            :key="index"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="面积：" prop="area" class="area_item_content">
        <el-input v-model="customer.area" style="width:130px" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" />
        <span style="margin-left: 6px;">㎡</span>
      </el-form-item>
      <el-form-item label="起止时间：" prop="time">
        <el-date-picker
          v-model="customer.time"

          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item v-if="customer.siteType === SITE_TYPE_ENUM.FOOD" label="厨房的装修及设备：" :prop="customer.siteType === SITE_TYPE_ENUM.FOOD ? 'device' : ''">
        <el-input v-model="customer.device" />
      </el-form-item>
      <el-form-item label="联系人姓名：" prop="contact">
        <el-input v-model="customer.contact" style="width:256px" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="customer.phone" style="width:256px" />
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-radio-group v-model="customer.enable">
          <el-radio v-for="(item,index) of enableList" :key="index" :label="item.label">{{ item.title }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { SHOP_SITE_RADIO_LIST, SITE_TYPE_ENUM } from '@/common/site'
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    customer: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      SITE_TYPE_ENUM,
      customerList: [],
      radioList: SHOP_SITE_RADIO_LIST,
      enableList: [
        { label: 0, title: '否' },
        { label: 1, title: '是' }
      ],
      rules: {
        projectName: [
          { required: true, message: '请输入商铺名称', trigger: 'blur' }
          // { type: 'string', required: true, pattern: '^[\u4E00-\u9FA5a-zA-Z0-9_\d()\-\s]*$', message: '项目名称仅支持中英文、数字、括号、下划线' }
        ],
        hostId: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        siteType: [
          { required: true, message: '请选择场地类型', trigger: 'change' }
        ],
        // siteMessageIds: [
        //   { required: true, message: '请填写场地编号', trigger: 'blur' }
        // ],
        siteNo: [
          { required: true, message: '请填写场地编号', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: this.checkPhone }
        ],
        area: [
          { required: true, message: '请输入面积', trigger: 'blur' }
        ],
        device: [
          { required: true, message: '请输入厨房的装修及设备', trigger: 'blur' }
        ]
      },
      siteList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getCustomerList()
      // if (!this.isEdit) {
      // return this.setGetSite('FOOD')
      // }
    },
    // 获取场地数据
    setGetSite(siteType) {
      // this.customer['siteMessageIds'] = []
      this.$api.siteList.getSite({ siteType }).then(res => {
        if (res) {
          this.siteList = res.list
        }
      })
    },
    getSiteType(val) {
      this.setGetSite(val)
    },
    getCustomerList() {
      this.$api.shopCustomer.shopCustomer({ customerType: '9' }).then(res => {
        this.customerList = res.list
      })
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.customer.validate((valid) => {
          if (valid) {
            resolve()
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

.el-cascader,.el-date-editor{
  width: 100%;
}
.customer{
  width: 100%;
  display: inline-table;
  box-sizing: border-box;
  .el-form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // ::v-deep .area_item_content{
    //   .el-form-item__content{
    //     span{
    //       margin-left: 6px;
    //     }
    //   }
    // }
    // ::v-deep .is-disabled{
    //   .el-input__inner,.el-range-input{
    //     color: #000000;
    //   }
    // }
    .el-form-item {
      width: 45%;
      margin-right: 10%;
    }
  }
}
</style>
