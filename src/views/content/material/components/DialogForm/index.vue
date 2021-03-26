<template>
  <div class="dialogFrom">
    <Component :is="component" ref="form" :current-edit-node="currentEditNode" :choose-num="chooseNum" :current-permission="currentPermission" />
    <div class="center">
      <el-button v-show="confirmText" type="primary" @click="confirm">{{ confirmText }}</el-button>
      <el-button @click="cancel">{{ cancelText }}</el-button>
    </div>
  </div>
</template>

<script>
import AddForm from './AddForm'
import Rename from './Rename'
import Permission from './Permission'
import ApplyDownLoad from './ApplyDownLoad'
import ViewDetails from './ViewDetails'
import { DIALOG_TYPE } from '@/common/material'

const COMPONENT = {
  ADD: 'AddForm',
  RENAME: 'Rename',
  PERMISSION: 'Permission',
  APPLY: 'ApplyDownLoad',
  VIEW: 'ViewDetails'

}
const BUTTON_TEXT = {
  ADD: {
    confirmText: '确 定',
    cancelText: '取 消'
  },
  RENAME: {
    confirmText: '确 定',
    cancelText: '取 消'
  },
  PERMISSION: {
    confirmText: '确 定',
    cancelText: '取 消'
  },
  APPLY: {
    confirmText: '提交申请',
    cancelText: '取 消'
  },
  VIEW: {
    confirmText: '',
    cancelText: '关 闭'
  }
}

export default {
  components: { AddForm, Rename, Permission, ApplyDownLoad, ViewDetails },
  props: {
    currentPermission: {
      type: Object,
      default: () => {}
    },
    currentEditNode: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    },
    chooseNum: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      BUTTON_TEXT
    }
  },
  computed: {
    component() {
      return COMPONENT[this.type] || ''
    },
    confirmText() {
      return BUTTON_TEXT[this.type]?.confirmText
    },
    cancelText() {
      return BUTTON_TEXT[this.type]?.cancelText
    }
  },
  methods: {
    // setPermissionMember(data) {
    //   this.$emit('setPermissionMember', { ...data })
    // },
    confirm() {
      if (this.type === DIALOG_TYPE['PERMISSION'].type) {
        const formData = this.$refs.form.getFormData()
        this.$emit('confirm', formData)
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const formData = this.$refs.form.getFormData()
            this.$emit('confirm', formData)
          }
        })
      }
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogFrom {
  .center {
    text-align: center;
  }
}
</style>
