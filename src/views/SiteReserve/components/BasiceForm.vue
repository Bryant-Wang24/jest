<template>
  <el-form
    ref="basiceForm"
    :model="basiceForm"
    label-width="160px"
    :rules="rules"
  >
    <el-form-item label="类型" prop="type">
      <el-radio-group v-model="basiceForm.type">
        <el-radio v-for="item in siteTypeOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-row>
      <el-col :span="10">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model.trim="basiceForm.projectName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="主办单位" prop="hosts">
          <el-select v-model="basiceForm.hosts" filterable multiple placeholder="请选择 (可多选)" @change="hostsSelectChange">
            <WrapOption
              v-for="item in customerOptions"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="承办单位">
          <el-select v-model="basiceForm.undertakes" filterable multiple placeholder="请选择 (可多选)">
            <WrapOption
              v-for="item in customerOptions"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="展出内容">
          <el-input
            v-model="basiceForm.content"
            :rows="3"
            resize="none"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="项目简称">
          <el-input v-model="basiceForm.projectAs" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="WEBSITE_ALLOWS.includes(basiceForm.type)" label="官方网站">
          <el-input v-model="basiceForm.website" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="NUMBER_PEOPLE_ALLOWS.includes(basiceForm.type)" label="参会人数">
          <el-input v-model.number="basiceForm.numberPeople" placeholder="请输入" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}" />
        </el-form-item>
        <el-form-item v-if="MEAL_TIME_ALLOWS.includes(basiceForm.type)" label="用餐时间">
          <el-input v-model="basiceForm.mealTime" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="TABLE_SIZE_ALLOWS.includes(basiceForm.type)" label="餐桌围数">
          <el-input v-model="basiceForm.tableSize" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="basiceForm.remarks"
            :rows="3"
            resize="none"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

const WEBSITE_ALLOWS = ['EXHIBITION']
const NUMBER_PEOPLE_ALLOWS = ['MEETING', 'CONFERENCR', 'FEAST', 'BANQUET']
const MEAL_TIME_ALLOWS = ['FEAST', 'BANQUET']
const TABLE_SIZE_ALLOWS = ['FEAST', 'BANQUET']
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
    basiceForm: {
      type: Object,
      default: () => {}
    },
    siteTypeOptions: {
      type: Array,
      default: () => []
    },
    customerOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      WEBSITE_ALLOWS, // 允许显示website的type数组
      NUMBER_PEOPLE_ALLOWS, // 允许显示numberPeople的type数组
      MEAL_TIME_ALLOWS, // 允许显示mealTime的type数组
      TABLE_SIZE_ALLOWS,
      // 基础信息表单验证
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        hosts: [
          { required: true, message: '请选择主办单位', trigger: 'change' }
        ],
        projectName: [
          { required: true, message: '请选择项目名称', trigger: 'blur' }
          // { type: 'string', required: true, pattern: '^[\u4E00-\u9FA5a-zA-Z0-9_\d()\-\s]*$', message: '项目名称仅支持中英文、数字、括号、下划线' }
        ]
      }
    }
  },
  methods: {
    validate(callback) {
      this.$refs.basiceForm.validate(callback)
    },
    hostsSelectChange(hosts) {
      this.$emit('hostsSelectChange', hosts)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
