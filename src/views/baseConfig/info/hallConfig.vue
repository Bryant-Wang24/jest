<template>
  <Layout :use-head="false" :use-foot="true">
    <div>
      <MainTitle :title="$route.query.name" />
      <div>
        <el-button
          icon="el-icon-plus"
          @click="addTableRuleForm"
        >添加</el-button>
      </div>
      <InlineForm
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        form-item-width="100%"
        form-item-content-width="100%"
      >
        <TablePager
          v-loading="loading"
          row-key="id"
          :current-page="page.pageNo"
          :data="ruleForm.galleryHalls"
          :tree-props="{ children: 'childItems', hasChildren: 'hasChildren' }"
          :total="total"
          @page="getPage"
        >
          <el-table-column label="名称">
            <template slot-scope="scope">
              <el-form-item
                :prop="'galleryHalls.' + scope.$index + '.name'"
                :rules="rules.name"
              >
                <el-input v-model="scope.row.name" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="排序" width="150px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'galleryHalls.' + scope.$index + '.sequenceNumber'"
                :rules="rules.sequenceNumber"
              >
                <el-input
                  v-model.number="scope.row.sequenceNumber"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-form-item>
                <el-input
                  v-model="scope.row.remarks"
                  type="textarea"
                  autosize
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="是否启用" width="100px">
            <template slot-scope="scope">
              <el-form-item>
                <el-select v-model="scope.row.enable">
                  <el-option
                    v-for="item in enableList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-form-item>
                <ConfirmButton
                  size="mini"
                  type="danger"
                  @onConfirm="deleteRow(scope.row,scope.$index)"
                >删除</ConfirmButton>
              </el-form-item>
            </template>
          </el-table-column>
        </TablePager>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="ruleForm.galleryHalls.length===0"
            :loading="submitLoading"
            @click="submitForm('ruleForm')"
          >保存配置</el-button>
        </el-form-item>
      </InlineForm>
    </div>
    <CloseTabsButton
      ref="closeTabsButton"
      slot="foot"
      @close="back"
    >返回</CloseTabsButton>
  </Layout>
</template>

<script>
import ListMixins from '@/mixins/ems/ListMixins'
import CloseTabsButton from '@/components/base/CloseTabsButton'
import api from '@/api/index'
export default {
  name: 'KeepAlive',
  components: { CloseTabsButton },
  mixins: [ListMixins],
  data() {
    return {
      ruleForm: {
        galleryHalls: []
      },
      rules: {
        name: [{ required: true, message: '请输入展厅名称', trigger: 'blur' }],
        sequenceNumber: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '排序必须为数字值' }
        ]
      },
      addForm: {
        name: '',
        exhallId: '',
        sequenceNumber: '',
        enable: 'YES',
        remarks: ''
      },
      exhallId: '',
      enableList: [
        {
          value: 'YES',
          label: '是'
        },
        {
          value: 'NO',
          label: '否'
        }
      ],
      loading: false,
      submitLoading: false,
      total: 0,
      params: {}
    }
  },
  created() {
    this.initDataFn()
  },
  methods: {
    initDataFn() {
      this.exhallId = this.$route.query.id
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.getFormData()
          this.submitLoading = true
          this.addHall(params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addHall(params) {
      api.baseConfig.addHallInConfig(params).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('保存配置成功')
          this.closeTabByChangeData()
        } else {
          this.$message.error(res.subMessage)
        }
        this.submitLoading = false
      })
    },
    getFormData() {
      const params = {
        galleryHalls: []
      }
      params.galleryHalls = this.ruleForm.galleryHalls.map(item => {
        const temp = {
          name: item.name,
          exhallId: this.exhallId,
          sequenceNumber: item.sequenceNumber,
          enable: item.enable,
          remarks: item.remarks
        }
        if (item.id) {
          temp.id = item.id
        }
        return temp
      })
      return params
    },
    searchPage() {
      this.resetPage()
    },
    getList() {
      this.params = Object.assign({}, this.page, {
        exhallId: this.$route.query.id
      })
      this.params = JSON.parse(JSON.stringify(this.params))
      this.loading = true
      api.baseConfig.hallConfigList(this.params).then(res => {
        this.ruleForm.galleryHalls = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    deleteRow(row, index) {
      if (row.id) {
        api.baseConfig.deleteHallInConfig(row.id).then(res => {
          this.getList()
        })
      } else {
        this.ruleForm.galleryHalls.splice(index, 1)
      }
    },
    addTableRuleForm() {
      this.ruleForm.galleryHalls.push(JSON.parse(JSON.stringify(this.addForm)))
    },
    closeTabByChangeData() {
      this.$refs.closeTabsButton.closeTabByChangeData()
    },
    back() {
      this.$router.push({
        name: 'BaseConfigHall'
      })
    }
  }
}
</script>

<style></style>
