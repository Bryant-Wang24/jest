<template>
  <div class="info">
    <RowText :text="'指派负责人'" />
    <el-row class="row">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="统筹负责人：" prop="coordinatorId">
          <el-select v-model="form.coordinatorId" filterable placeholder="请输入（可检索）" style="width:400px">
            <WrapOption v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="面积复核人：" prop="coordinatorId">
          <el-select v-model="form.areaCheckerId" filterable placeholder="请输入（可检索）" style="width:400px">
            <WrapOption v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import RowText from '@/components/rowText'
import WrapOption from '@/components/base/WrapOption'

export default {
  components: { RowText, WrapOption },
  props: {
    userList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      userOptions: [
      ],
      form: {
        coordinatorId: '',
        areaCheckerId: ''
      },
      rules: {
        coordinatorId: [{ required: true, message: '请选择统筹负责人', trigger: 'change' }],
        areaCheckerId: [{ required: true, message: '请选择面积复核人', trigger: 'change' }]
      }
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid, errObj) => {
          if (valid) {
            resolve(this.form)
          } else {
            console.log('errObj', errObj)
            reject(errObj)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input {
  width: 130px;
}
.row{
  padding: 20px;
}
.info {
  padding: 20px 0;
  font-size: 14px;
  .formItem {
    display: flex;
    margin-bottom: 14px;
    .label {
      width: 120px;
      margin-right: 10px;
      text-align: right;
      color: #666;
    }
    .value {
      flex: 1;
      word-break: break-word;
      color: #000;
    }
  }
}

</style>
