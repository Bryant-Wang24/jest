<template>
  <div class="content">
    <span class="tip">在当前审批人审核通过后，增加临时审批人进行审核。</span>
    <el-form ref="form" label-position="top" :rules="rules" :model="form">
      <el-form-item label="审批人" prop="userid">
        <el-select v-model="form.userid" filterable multiple placeholder="请选择（可检索）">
          <WrapOption
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
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
        userid: []
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
              userid: this.form.userid
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
