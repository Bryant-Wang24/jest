<template>
  <div class="tableList">

    <el-form ref="form" :model="form" class="form" label-width="82px">
      <el-form-item label="状态：" prop="state">
        <el-select v-model="form.state" filterable placeholder="请选择（可检索）" style="width: 240px">
          <WrapOption
            v-for="(item, index) in stateList"
            :key="index"
            :label="item.label"
            :value="item.value"
            style="width: 240px"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人：" prop="applicant">
        <!-- <el-input v-model="form.applicant" type="text" placeholder="请输入" style="width: 300px" /> -->
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
      <el-table-column label="操作" fixed="right" min-width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="clickBtn(scope.row, '查看')"
          >查看</el-button>
          <el-button
            v-if="scope.row.application.state==='REJECTED'"
            type="text"
            @click="clickBtn(scope.row, '修改')"
          >修改</el-button>
          <el-button
            v-if="scope.row.application.state==='UNDER_REVIEW' && isApprovalAuth(scope.row.currentReviewerId)"
            type="text"
            @click="clickBtn(scope.row, '审核')"
          >审核</el-button>
          <el-button
            v-if="scope.row.application.state==='REJECTED'"
            type="text"
            @click="clickBtn(scope.row, '取消申请')"
          >取消申请</el-button>
          <el-button
            v-if="scope.row.application.state==='APPROVED' && isApprovalAuth(scope.row.application.applicant.id)"
            type="text"
            @click="clickBtn(scope.row, '下载文件')"
          >下载文件</el-button>

        </template>
      </el-table-column>
    </TablePager>
    <!-- <div class="refund_new">

      <table-page
        :table-loading="tableLoading"
        :table-data="tableData"
        :table-header="tableHeader"
      >
        <el-table-column label="操作" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="clickBtn(scope.row, '查看')"
            >查看</el-button>
            <el-button
              v-if="scope.row.application.state==='REJECTED'"
              size="mini"
              type="text"
              @click="clickBtn(scope.row, '修改')"
            >修改</el-button>
            <el-button
              v-if="scope.row.application.state==='UNDER_REVIEW' && isApprovalAuth(scope.row.currentReviewerId)"
              size="mini"
              type="text"
              @click="clickBtn(scope.row, '审核')"
            >审核</el-button>
            <el-button
              v-if="scope.row.application.state==='REJECTED'"
              size="mini"
              type="text"
              @click="clickBtn(scope.row, '取消申请')"
            >取消申请</el-button>
            <el-button
              v-if="scope.row.application.state==='APPROVED' && isApprovalAuth(scope.row.application.applicant.id)"
              size="mini"
              type="text"
              @click="clickBtn(scope.row, '下载文件')"
            >下载文件</el-button>

          </template>
        </el-table-column>
      </table-page>
      <pagination-page
        class="pagination"
        :total="total"
        :to="pageSize"
        :current-page="pageNum"
        @handleCurrentChange="handleCurrentChange"
      />
    </div> -->
  </div>
</template>
<script>
import base from '@/api/base'
import TablePager from '@/components/base/TablePager'
import WrapOption from '@/components/base/WrapOption'
import { isApprovalAuth } from '@/common/approve'

export default {
  components: { TablePager, WrapOption },
  data() {
    return {
      isApprovalAuth,
      base: base,
      tableLoading: false,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableHeader: [
        { key: 'application.no', label: '申请编号', minWidth: '120' },
        { key: 'applicationNodesLength', label: '文件数量', minWidth: '120' },
        { key: 'application.purpose', label: '用途', minWidth: '160' },
        { key: 'application.applicant.name', label: '申请人', width: '120' },
        { key: 'application.applicationTime', label: '申请时间', width: '160' },
        { key: 'state_name', label: '状态', minWidth: '120' }
      ],
      form: {
        state: '',
        applicant: ''
      },
      stateList: [
        { label: '审核中', value: 'UNDER_REVIEW' },
        { label: '审核通过', value: 'APPROVED' },
        { label: '审核拒绝', value: 'REJECTED' },
        { label: '作废', value: 'OBSOLETE' }
      ],
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
    this.restaurants = this.loadAll()
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

    handleCurrentChange({ currentPage }) {
      this.page.pageNum = currentPage
      this.getApplicationList()
    },
    // 分页查询
    getApplicationList() {
      const json = {
        query: {
          applicant: {}
        },
        index: this.page.pageNum,
        size: this.page.pageSize
      }
      this.form.state !== '' ? json.query['state'] = this.form.state : ''
      this.form.applicant !== '' ? json.query.applicant['name'] = this.form.applicant : ''
      this.tableLoading = true
      this.$api.content.applicationList(json).then(res => {
        if (res) {
          this.tableLoading = false
          const arr = res.list
          for (const i in arr) {
            arr[i]['applicationNodesLength'] = Number(arr[i].applicationNodes.length) !== 0 ? arr[i].applicationNodes.length + '份' : 0
            arr[i]['state_name'] = arr[i].application.state === 'UNDER_REVIEW' ? '审核中' : arr[i].application.state === 'APPROVED' ? '审核通过' : arr[i].application.state === 'REJECTED' ? '审核拒绝' : arr[i].application.state === 'OBSOLETE' ? '作废' : '已提交'
          }
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
          this.$confirm('此操作将永久取消该申请, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.getApplicationDelete(res.application.id)
            })
            .catch(() => {})
          break
        case '下载文件':
          window.location.href =
        `http://${window.location.host}${base.hall}api/hall/rest/datalib/application/download/` + res.application.id
          break
      }
    },
    // 申请 - 作废
    getApplicationDelete(id) {
      this.$api.content.applicationDelete({ id: id }).then(res => {
        if (res) return this.getApplicationList()
      })
    },
    // 申请 - 获取申请人列表
    getApplicantList() {
      this.$api.content.applicantList({ operationTypes: 'APPLY_TO_DOWNLOAD' }).then(res => {
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
    // 查询
    submitForm() {
      this.page.pageNum = 1
      this.page.pageSize = 10
      this.getApplicationList()
    },
    // 重置
    handleReset() {
      this.page.pageNum = 1
      this.page.pageSize = 10
      this.form.state = ''
      this.form.applicant = ''
      this.getApplicationList()
    },

    handleCancel() {
      this.dialogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.tableList{
  .form {
    margin-top: 20px;
  }
}
</style>
