<template>
  <div class="content">
    <span class="tip">将申请退回到已经审核过的审批人进行重审。</span>
    <el-form ref="form" label-position="top" :rules="rules" :model="form">
      <el-form-item label="审批人" prop="userid">
        <el-select v-model="form.userid" filterable placeholder="请选择（可检索）">
          <WrapOption
            v-for="item in passOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审批意见：" prop="text">
        <el-input
          v-model="form.text"
          type="textarea"
          :rows="3"
          resize="none"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
    passOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        userid: '',
        text: ''
      },
      rules: {
        userid: [{ required: true, message: '请选择审批人', trigger: 'blur' }]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve({
              userid: this.form.userid,
              text: this.form.text
            })
          } else {
            reject()
            return false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .tip {
    color: #999;
  }
}
</style>
