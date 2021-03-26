<template>
  <div id="companyInfo">
    <!-- <el-button @click="getFormData">getFormData</el-button> -->
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="160px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="营业执照照片">
            <UploadImage class="uploadImage" :limit="1" accept=".jpg,.jpeg,.png" :list.sync="fileList" :data="{type: licenseData.type}" />
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model.trim="form.companyName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="taxCode">
            <el-input
              v-model.trim="form.taxCode"
              maxlength="18"
              show-word-limit
              placeholder="请输入"
              @input="linkInvoiceFormTaxCode"
            />
          </el-form-item>
          <el-form-item label="客户类型" prop="customerType">
            <el-radio-group v-model="form.customerType">
              <el-radio
                v-for="(item) in CUSTOMER_TYPE"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="国家" prop="country">
            <el-select v-model="form.country" placeholder="请选择" @change="handleChangeCountry">
              <WrapOption
                v-for="item in country"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="注册地址" prop="registerAddress">
            <el-input v-model="form.registerAddress" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="法人代表" prop="legalPerson">
            <el-input v-model="form.legalPerson" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="注册资本" prop="registerCapital">
            <el-input v-model="form.registerCapital" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="所属行业" prop="industry">
            <el-select v-model="form.industry" placeholder="请选择">
              <WrapOption
                v-for="item in CUSTOMER_INDUSTRY"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="经营范围" prop="businessScope">
            <el-input
              v-model="form.businessScope"
              :rows="3"
              resize="none"
              type="textarea"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="客户星级" prop="starLevel">
            <el-select v-model="form.starLevel" placeholder="请选择">
              <WrapOption
                v-for="item in CUSTOMER_STAR"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="网址" prop="website">
            <el-input v-model="form.website" placeholder="请输入">
              <template slot="prepend">Http://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="附件资料">
            <UploadImage class="uploadImage" accept=".jpg,.jpeg,.png" :list.sync="AttachmentsList" :data="{type: attachmentsData.type}" />
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <!-- 占位 -->
          <el-form-item style="height:114px;" />
          <el-form-item label="公司简称" prop="abbreviation">
            <el-input v-model="form.abbreviation" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="公司英文名" prop="nameEN">
            <el-input v-model="form.nameEN" placeholder="请输入" />
          </el-form-item>
          <!-- 占位 -->
          <el-form-item style="height:36px;" />
          <el-form-item v-if="form.country === '中国'" label="省市">
            <el-cascader
              v-model="form.areaArray"
              :options="province"
              @change="provinceChange"
            />
          </el-form-item>
          <el-form-item label="地区">
            <el-input v-model="form.region" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="英文地址" prop="registerAddressEN">
            <el-input v-model="form.registerAddressEN" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="营业期限" prop="businessTime">
            <el-input v-model="form.businessTime" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="公司性质" prop="companyNature">
            <el-select v-model="form.companyNature" placeholder="请选择">
              <WrapOption
                v-for="(value, key) in companyNature"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="公司规模" prop="scale">
            <el-select v-model="form.scale" placeholder="请选择">
              <WrapOption
                v-for="item in COMPANY_SCALE"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="公司简介" prop="briefIntroduction">
            <el-input
              v-model="form.briefIntroduction"
              :rows="3"
              resize="none"
              type="textarea"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="客户状态" prop="activeState">
            <el-select v-model="form.activeState" placeholder="请选择">
              <WrapOption
                v-for="item in CUSTOMER_ACTIVE_STATE"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="邮编" prop="postcode">
            <el-input v-model="form.postcode" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model="form.remarks"
              :rows="3"
              resize="none"
              type="textarea"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import base from '@/api/base'
import { COUNTRY, PROVINCE } from '@/common/global'
import { mapMutations, mapGetters } from 'vuex'
import { DEPARTMENT_KEY } from '@/common/user'
import WrapOption from '@/components/base/WrapOption'
import {
  // CUSTOMER_TYPE,
  // INDUSTRY,
  // STAR_LEVEL,
  COMPANY_NATURE
  // ACTIVE_STATE
  // SCALE
} from '@/common/customerMsg'
import UploadImage from '@/components/Upload/UploadImage'
export default {
  name: 'CompanyFrom',
  components: { UploadImage, WrapOption },
  props: {
    model: {
      // 当有model时为编辑
      type: Object,
      default: null
    }
  },
  data() {
    return {
      DEPARTMENT_KEY,
      base: base, // 默认请求路径
      department: '', // 当前用户部门

      country: COUNTRY, // 国家
      province: PROVINCE, // 中国省份市区

      companyNature: COMPANY_NATURE, // 公司性质

      fileList: [],
      AttachmentsList: [],
      form: {
        id: null,
        companyName: '', // 公司姓名
        taxCode: '', // 统一社会信用代码
        customerType: null, // 客户类型
        country: '中国', // 国家
        registerAddress: '', // 注册地址
        legalPerson: '', // 法人代表
        registerCapital: '', // 注册资本
        industry: null, // 所属行业
        businessScope: '', // 经营范围
        starLevel: null, // 客户星级
        website: '', // 网址
        abbreviation: '', // 公司简称
        nameEN: '', // 公司英文名
        areaArray: [], // 地区（中国）
        region: '', // 地区
        registerAddressEN: '', // 英文地址
        businessTime: '', // 营业期限
        companyNature: null, // 公司性质
        scale: '', // 公司规模
        briefIntroduction: '', // 公司简介
        activeState: null, // 客户活跃状态
        postcode: '', // 邮编
        remarks: '', // 备注
        license: '', // 自定义字段，存执照图片
        attachments: [], // 自定义字段，存附件图片
        province: '', // 省份
        city: '' // 市

      },
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        taxCode: [
          {
            required: true,
            validator: this.validateTaxCode,
            trigger: 'blur'
          }
        ],
        customerType: [
          { required: true, message: '请选择客户类型', trigger: 'change' }
        ],
        country: [{ required: true, message: '请选择国家', trigger: 'change' }]
      },
      licenseData: { // 默认上传参数
        dataId: '',
        type: 'CUSTOMER_BUSINESS_LICENSE'
      },
      attachmentsData: { // 默认上传参数
        dataId: '',
        type: 'CUSTOMER_ATTACHMENT'
      }
    }
  },
  computed: {
    ...mapGetters({
      gettertaxCode: 'taxCode',
      office: 'office',
      CUSTOMER_INDUSTRY: 'CUSTOMER_INDUSTRY',
      CUSTOMER_TYPE_ARRAY: 'CUSTOMER_TYPE_ARRAY',
      CUSTOMER_TYPE: 'CUSTOMER_TYPE',
      CUSTOMER_STAR: 'CUSTOMER_STAR',
      COMPANY_SCALE: 'COMPANY_SCALE',
      CUSTOMER_ACTIVE_STATE: 'CUSTOMER_ACTIVE_STATE'
    })
  },
  watch: {
    model(formData) {
      // console.log('formData222222222222222', formData)
      this.form = { ...formData, areaArray: [formData.province, formData.city] }
      // 图片做特殊处理
      const { form_attachments = [], businessLicense = {}} = formData
      if (businessLicense && Reflect.ownKeys(businessLicense).length > 0) {
        this.fileList = [
          {
            ...businessLicense,
            response: {
              data: [{ ...businessLicense }]
            }
          }
        ]
      }
      if (form_attachments.length > 0) {
        const arr = form_attachments.map(item => {
          item['response'] = {
            data: [{ ...item }]
          }
          return item
        })
        console.log(arr)
        this.AttachmentsList = arr
      }
    },
    gettertaxCode: {
      handler(value) {
        this.form.taxCode = value
      },
      immediate: true
    },
    CUSTOMER_TYPE: {
      handler(value) {
        const source = this.$route.query.source
        if (!source) {
          this.form.customerType = value?.[0]?.value || null
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.setTaxCode('')
  },
  methods: {
    // 联动发票信息的纳税人识别号
    linkInvoiceFormTaxCode(value) {
      // trim
      if (value.includes(' ')) {
        return
      }
      this.setTaxCode(value)
    },
    handleChangeCountry(country) {
      if (country !== '中国') {
        this.form.region = ''
      }
    },
    // 中国省份修改
    provinceChange(val) {
      const province = val[0]
      const city = val[1]
      this.form.province = province
      this.form.city = city
      // this.form.region = val.join(' / ')
    },
    // 获取完整表单数据
    getFormData() {
      // 拼接图片数据
      this.form['license'] = this.fileList[0]?.response?.data[0]?.imageId
      this.form['attachments'] = this.getAttachmentsList()
      return { ...this.form }
    },
    // 获取附件图片数据
    getAttachmentsList() {
      const arr = []
      for (let i = 0; i < this.AttachmentsList.length; i++) {
        arr.push({
          imageId: this.AttachmentsList[i]?.response?.data[0]?.imageId
        })
      }
      return arr
    },
    // 查询taxCode是否存在
    async getTaxCodeIsExist(value) {
      // 接口
      const res = await this.$api.customerMsg.checkTaxCode(value)
      if (res) {
        return true
      }
      return false
    },
    // 自定义校验taxCode
    async validateTaxCode(rule, value, callback) {
      console.log('公司')
      const regular = /^[A-Za-z0-9]+$/
      if (!regular.test(value)) {
        callback(new Error('只能输入英文、数字'))
      } else if (value.length !== 18) {
        callback(new Error('请输入18位统一社会信用代码'))
      } else if (await this.getTaxCodeIsExist({ id: this.form.id, taxCode: value })) {
        // 通过接口检查是否已存在
        callback(new Error('统一社会信用代码已存在'))
      } else {
        callback()
      }
    },
    ...mapMutations('customerMsg', {
      setTaxCode: 'SET_TAXCODE'
    })
  }
}
</script>
<style lang="scss" scoped>
#companyInfo {
  ::v-deep .el-select {
    width: 100%;
  }
  ::v-deep .el-cascader {
    width: 100%;
  }
}
#companyInfo {
  // padding: 20px 0;
  .top {
    display: flex;
    margin-bottom: 22px;
    .topLabel {
      line-height: 36px;
      width: 160px;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
      padding: 0 12px 0 0;
      text-align: right;
    }
  }
}
.upload-demo {
  height: 114px;
}
.uploadImage {
  height: 114px;
}
</style>
