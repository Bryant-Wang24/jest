<template>
  <Layout :use-head="false" :use-foot="true">
    <div>
      <MainTitle />
      <InlineForm
        ref="ruleForm"
        :disabled="disabledForm"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item label="上级菜单" prop="name">
          <el-input v-model="ruleForm.name" disabled>
            <el-button
              v-if="!disabledForm"
              slot="append"
              icon="el-icon-search"
              @click="toggleTreeDialog"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="链接" prop="name">
          <el-input v-model="ruleForm.name" placeholder="点击菜单跳转的页面" />
        </el-form-item>

        <el-form-item label="目标" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="链接打开的目标窗口，默认：mainFrame"
          />
        </el-form-item>

        <el-form-item label="图标" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="排序" prop="name">
          <el-input v-model="ruleForm.name" placeholder="排序顺序，升序" />
        </el-form-item>

        <el-form-item label="可见" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="该菜单或操作是否显示到系统菜单中"
          />
        </el-form-item>

        <el-form-item label="权限标识" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="控制器中定义的权限标识，如：@RequiresPermissions('权限标识')"
          />
        </el-form-item>

        <el-form-item label="Component" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="前端组件地址，通常页面会有不为空的component，而操作没有"
          />
        </el-form-item>

        <el-form-item label="Meta" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="前端自定义的json数据"
          />
        </el-form-item>

        <el-form-item label="是否JSP" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="勾选为是，不勾选为否"
          />
        </el-form-item>

        <el-form-item label="备注" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item v-if="!disabledForm" slot="block">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </InlineForm>

      <DialogTree
        title="选择菜单"
        :visible.sync="treeDialogVisible"
        :default-checked-keys="defaultCheckKeys"
        show-checkbox
        :data="menuData"
        @getCheckedKeys="getCheckedKeys"
        @getCheckedNodes="getCheckedNodes"
      />

    </div>
    <CloseTabsButton slot="foot" @close="back">返回</CloseTabsButton>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import InlineForm from '@/components/base/InlineForm'
import MainTitle from '@/components/base/MainTitle'
import DialogTree from '@/components/base/DialogTree'
import CloseTabsButton from '@/components/base/CloseTabsButton'
export default {
  name: 'SystemManagementMenuEdit',
  components: {
    Layout,
    InlineForm,
    MainTitle,
    DialogTree,
    CloseTabsButton
  },
  data() {
    return {
      disabledForm: false,
      ruleForm: {
        name: ''
      },
      rules: {},
      treeDialogVisible: false,
      defaultCheckKeys: [1],
      menuData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1',
              disabled: true
            },
            {
              id: 6,
              disabled: true,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.disabledForm = !!this.$route.meta.disabledForm
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$router.push({
        name: 'SystemManagementMenu'
      })
    },
    toggleTreeDialog(isOpen) {
      this.treeDialogVisible = !!isOpen
    },
    getCheckedKeys(row) {
      console.log(row)
      this.toggleTreeDialog(false)
    },
    getCheckedNodes(row) {
      console.log(row)
      this.toggleTreeDialog(false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
