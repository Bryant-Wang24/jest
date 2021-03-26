<template>
  <div class="tableList">

    <el-form ref="form" :model="form" class="form mt-20" label-width="82px">
      <el-form-item label="文件名称：" prop="name">
        <el-input v-model="form.name" style="width: 240px" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="下载人：" prop="applicant">
        <el-autocomplete v-model="form.applicant" :fetch-suggestions="querySearch" :trigger-on-focus="false" placeholder="请输入" style="width: 240px" @select="handleSelect" />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <TablePager
      ref="TablePager"
      v-loading="tableLoading"
      border
      :data="tableData"
      :total="page.total"
      :to="page.pageSize"
      :current-page="page.pageNum"
      @page="handleCurrentChange"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :min-width="item.minWidth"
        :prop="item.key"
        :label="item.label"
        :formatter="item.formatter"
      />
    </TablePager>

  </div>
</template>
<script>
import TablePager from '@/components/base/TablePager'

export default {
  components: { TablePager },
  data() {
    return {
      name: '',
      tableLoading: false,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableHeader: [
        { key: 'operationTime', label: '时间', minWidth: '160' },
        { key: 'node.name', label: '文件名称', minWidth: '120' },
        { key: 'operator.name', label: '下载人', minWidth: '100' }
      ],
      form: {
        state: '',
        applicant: ''
      },

      restaurants: []
    }
  },
  computed: {

  },

  watch: {
  },
  created() {
    // this.get_operatorList()
  },
  mounted() {
    this.restaurant = this.loadAll()
  },
  methods: {
    loadAll() {
      return this.restaurants
    },
    handleSelect(item) {
      console.log(item)
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    // 申请 - 获取操作人列表
    get_operatorList() {
      this.$api.content.operatorList({ operationTypes: 'DIRECTLY_DOWNLOAD,APPLY_TO_DOWNLOAD' }).then(res => {
        if (res) {
          this.restaurants = []
          for (const i in res) {
            this.restaurants.push({
              value: res[i].name,
              label: res[i].id
            })
          }
        }
      })
    },

    handleCurrentChange({ currentPage }) {
      this.page.pageNum = currentPage
      this.get_operationLog()
    },
    // 分页查询
    get_operationLog() {
      const json = {
        query: {
          operationTypes: ['DIRECTLY_DOWNLOAD', 'APPLY_TO_DOWNLOAD']
        },
        index: this.page.pageNum,
        size: this.page.pageSize
      }
      if (this.form.name !== '') {
        json.query['node'] = {
          name: this.form.name
        }
      }
      this.form.applicant !== '' ? json.query.operator['name'] = this.form.applicant : ''
      this.tableLoading = true
      this.$api.content.operationLog(json).then(res => {
        if (res) {
          this.tableLoading = false
          const arr = res.list
          this.tableData = arr
          this.page.total = res.total
        }
      })
    },
    // 表格操作
    clickBtn(res, type) {
      switch (type) {
        case '查看':
          this.$router.push({
            name: 'downloadEdit',
            params: {
              id: res.application.id,
              type: 'editNew'
            }
          })
          break
        case '修改':
          this.$router.push({
            name: 'downloadEdit',
            params: {
              id: res.application.id,
              type: 'edit'
            }
          })
          break
        case '审核':
          this.$router.push({
            name: 'downloadEdit',
            params: {
              id: res.application.id,
              type: 'audit'
            }
          })
          break
        case '取消申请':
          break
        case '下载文件':
          break
      }
    },

    // 查询
    submitForm() {
      this.page.pageNum = 1
      this.page.pageSize = 10
      this.get_operationLog()
    },
    // 重置
    handleReset() {
      this.page.pageNum = 1
      this.page.pageSize = 10
      this.form.name = ''
      this.form.applicant = ''
      this.get_operationLog()
    },

    handleCancel() {
      this.dialogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
