<template>
  <div class="info">
    <el-row>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">公司姓名：</div>
          <div class="value">{{ form.companyName }}</div>
        </div>
        <div class="formItem">
          <div class="label">统一社会信用代码：</div>
          <div class="value">{{ form.taxCode }}</div>
        </div>
        <div class="formItem">
          <div class="label">客户类型：</div>
          <div class="value">{{ customerType[form.customerType] }}</div>
        </div>
        <div class="formItem">
          <div class="label">国家：</div>
          <div class="value">{{ form.country }}</div>
        </div>
        <div class="formItem">
          <div class="label">注册地址：</div>
          <div class="value">{{ form.registerAddress }}</div>
        </div>
        <div class="formItem">
          <div class="label">法人代表：</div>
          <div class="value">{{ form.legalPerson }}</div>
        </div>
        <div class="formItem">
          <div class="label">注册资本：</div>
          <div class="value">{{ form.registerCapital }}</div>
        </div>
        <div class="formItem">
          <div class="label">所属行业：</div>
          <div class="value">{{ industryText(form.industry) }}</div>
        </div>
        <div class="formItem">
          <div class="label">经营范围：</div>
          <div class="value">{{ form.businessScope }}</div>
        </div>
        <div class="formItem">
          <div class="label">客户星级：</div>
          <div class="value">{{ CUSTOMER_STAR_OBJECT[form.starLevel] }}</div>
          <!-- <div class="value">{{ star }}</div> -->
        </div>
        <div class="formItem">
          <div class="label">网址：</div>
          <div class="value">
            <a :href="`http://${form.website}`" target="_blank" style="color:#0045FF;">{{
              form.website
            }}</a>
          </div>
        </div>
        <div class="formItem">
          <div class="label">营业执照图片：</div>
          <div class="value">
            <img
              v-if="license"
              width="120px"
              height="80px"
              :src="license"
              alt=""
              @click="previewImg(license)"
            >
          </div>
        </div>
        <div class="formItem">
          <div class="label">附件资料：</div>
          <div class="value">
            <div v-if="form.form_attachments && form.form_attachments.length > 0">
              <img
                v-for="(item, index) in form.form_attachments"
                :key="index"
                width="120px"
                height="80px"
                :src="item.address"
                alt=""
                @click="previewImg(form.form_attachments, true, index)"
              >
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">公司简称：</div>
          <div class="value">{{ form.abbreviation }}</div>
        </div>
        <div class="formItem">
          <div class="label">公司英文名：</div>
          <div class="value">{{ form.nameEN }}</div>
        </div>
        <div class="formItem" style="height:16px;" />
        <div class="formItem">
          <div class="label">省市：</div>
          <div class="value">{{ `${form.province || ''} ${form.city || ''}` }}</div>
        </div>
        <div class="formItem">
          <div class="label">地区：</div>
          <div class="value">{{ form.region }}</div>
        </div>
        <div class="formItem">
          <div class="label">英文地址：</div>
          <div class="value">{{ form.registerAddressEN }}</div>
        </div>
        <div class="formItem">
          <div class="label">营业期限：</div>
          <div class="value">{{ form.businessTime }}</div>
        </div>
        <div class="formItem">
          <div class="label">公司性质：</div>
          <div class="value">{{ companyNature[form.companyNature] }}</div>
        </div>
        <div class="formItem">
          <div class="label">公司规模：</div>
          <div class="value">{{ form.scale }}</div>
        </div>
        <div class="formItem">
          <div class="label">公司简介：</div>
          <div class="value">{{ form.briefIntroduction }}</div>
        </div>
        <div class="formItem">
          <div class="label">客户状态：</div>
          <div class="value">{{ CUSTOMER_ACTIVE_STATE_OBJECT[form.activeState] }}</div>
        </div>
        <div class="formItem">
          <div class="label">邮编：</div>
          <div class="value">{{ form.postcode }}</div>
        </div>
        <div class="formItem">
          <div class="label">备注：</div>
          <div class="value">{{ form.remarks }}</div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="80%">
      <div style="width:100%;">
        <img width="100%" :src="preview" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  // CUSTOMER_TYPE_OBJECT,
  // ACTIVE_STATE_OBJECT,
  // INDUSTRY,
  // STAR_LEVEL_OBJECT,
  COMPANY_NATURE
  // ACTIVE_STATE,
  // SCALE
} from '@/common/customerMsg'
import { mapGetters } from 'vuex'
// import { preview as handlePreview } from '@/utils/preview'

export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      department: '会议部',
      // customerType: this.CUSTOMER_TYPE_OBJECT, // 用户类型
      // industry: INDUSTRY, // 行业
      // starLevel: STAR_LEVEL_OBJECT, // 星级
      companyNature: COMPANY_NATURE, // 公司性质
      // scale: SCALE, // 公司规模
      // activeState: ACTIVE_STATE_OBJECT, // 客户活跃状态
      preview: '', // 预览图片地址
      dialogVisible: false // 控制预览框显隐
    }
  },
  computed: {
    license() {
      return this.form.businessLicense?.address
    },
    ...mapGetters({
      CUSTOMER_INDUSTRY: 'CUSTOMER_INDUSTRY',
      customerType: 'CUSTOMER_TYPE_OBJECT',
      CUSTOMER_STAR_OBJECT: 'CUSTOMER_STAR_OBJECT',
      COMPANY_SCALE: 'COMPANY_SCALE',
      CUSTOMER_ACTIVE_STATE_OBJECT: 'CUSTOMER_ACTIVE_STATE_OBJECT'
    })
  },
  mounted() {
  },
  methods: {
    previewImg(previewImg, isArray, index) {
      let urls = []
      if (isArray) {
        urls = previewImg.map(item => { return { url: item.address, alt: '' } })
      } else {
        urls = [{ url: previewImg, alt: '' }]
      }
      this.$viewer(urls, { initialViewIndex: index || 0 })
      // this.preview = previewImg
      // this.dialogVisible = true
    },
    industryText(value) {
      const obj = this.CUSTOMER_INDUSTRY.find(item => {
        return item.value === value
      })
      return obj?.label || ''
    }
  }
}
</script>
<style lang="scss" scoped>
.info {
  padding: 20px 0;
  font-size: 14px;
}
.formItem {
  display: flex;
  margin-bottom: 14px;
  .label {
    width: 160px;
    margin-right: 10px;
    text-align: right;
    color: #666;
  }
  .value {
    flex: 1;
    word-break: break-word;
    img {
      margin-right: 6px;
    }
  }
}
</style>
