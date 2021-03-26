<template>
  <div>
    <el-dialog
      title="选择模板"
      width="32%"
      :visible.sync="addContractDialogVisible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="100px"
        size="small"
        class="demo-ruleForm"
      >
        <el-form-item label="模板：" prop="templateId" :rules="[{ required: true, message: '请选择模板', trigger: 'change' }]">
          <!-- <el-select v-model="ruleForm.templateId" placeholder="请选择模板" @change="get_templateId"> -->
          <el-select v-model="ruleForm.templateId" placeholder="请选择模板" @change="selectChange">
            <WrapOption
              v-for="(item, index) of templateList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型：">{{ currentType }}</el-form-item>
      </el-form>
      <div class="dialogBtn">
        <el-button type="primary" @click="addContractAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DIRECT_CONTRACT_CODE, CONTRACT_TYPE } from '@/common/sale'
import WrapOption from '@/components/base/WrapOption'

export default {
  components: { WrapOption },
  props: {
    addContractDialogVisible: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      CONTRACT_TYPE,
      dialogConcat: false,
      currentTemplate: {},
      ruleForm: {
        templateId: ''
      },
      templateList: []
    }
  },
  computed: {
    currentType() {
      const { contractType } = this.currentTemplate
      return CONTRACT_TYPE[contractType]?.label || ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const isSiteMarket = this.$route.query.entrance === 'siteMarket'
      const { VENUE_LEASING, CONFERENCE_LEASING, ADV_PRODUCTION_LEASING, SERVICE_ORDER, SHOP_LEASING } = CONTRACT_TYPE
      let filterTypes = []
      if (isSiteMarket) {
        filterTypes = [VENUE_LEASING.value, CONFERENCE_LEASING.value, ADV_PRODUCTION_LEASING.value, SERVICE_ORDER.value]
      } else {
        filterTypes = [SHOP_LEASING.value]
      }
      this.$api.contract.contractTemplates(filterTypes).then(res => {
        this.templateList = res
      })
    },
    selectChange(id) {
      const currents = this.templateList.filter(t => t.id === id)
      this.currentTemplate = currents[0]
    },
    beforeClose() {
      this.$emit('beforeClose')
    },
    addContractAdd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const { contractType, id, name, code } = this.currentTemplate
          if (DIRECT_CONTRACT_CODE.includes(code)) {
            this.$emit('created_page', id)
            return false
          }
          this.$router.push({
            name: 'contractAdd',
            params: {
              id: this.$route.params.id,
              type: 'add'
            },
            query: { contractType, contractTypeId: id, projectId: this.projectId, templateName: name, entrance: this.$route.query.entrance }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialogBtn {
  width: 100%;
  text-align: right;
  .el-button {
    width: 96px;
    border-radius: 2px;
  }
}
</style>
