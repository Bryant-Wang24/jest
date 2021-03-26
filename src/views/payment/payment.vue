<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">

    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />
    <!-- <div class="table"> -->
    <MainTitle title="付款通知书" />
    <div class="mb-20">
      <el-button v-if="hasRolePermission('payment_add')" type="primary" @click="addPriceList('创建')">创建</el-button>
      <el-button @click="addPriceList('批量导出')">批量导出</el-button>
    </div>
    <TablePager
      ref="multipleTable"
      v-loading="tableLoading"
      :multiple-selection="submission"
      row-key="id"
      border
      :data="tableData"
      :total="page.total"
      :to="page.pageSize"
      :current-page="page.pageNum"
      @selection-change="changeList"
      @page="handleCurrentChange"
    >
      <el-table-column :resizable="false" type="selection" :reserve-selection="true" width="55" />
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :min-width="item.minWidth"
        :prop="item.key"
        :label="item.text"
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="clickBtn(scope.row, 'VIEW')">查看</el-button>
          <el-button type="text" @click="clickBtn(scope.row, 'EXPORT')">导出</el-button>
          <el-button v-if="hasRoleUserPermission('payment_delete', scope.row.createBy ? scope.row.createBy.id : null)" type="text" @click="clickBtn(scope.row, 'DELETE')">删除</el-button>
        </template>
      </el-table-column>
    </TablePager>
    <DialogPage
      :dialog-show="dialogShow"
      width="62.5%"
      title="创建付款通知书"
      @handleCancel="handleCancel"
    >
      <AddPay ref="payAdd" :account-list="accountList" @paymentAdd="get_paymentAdd" @handleCancel="handleCancel" />
    </DialogPage>
  </Layout>
</template>
<script>
import base from '@/api/base'
import DialogPage from '@/components/dialog/dialog'
import AddPay from './components/addPay'
import FilterForm from '@/components/FilterForm/FilterForm2'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import Layout from '@/components/base/Layout'

export default {
  name: 'Payment',
  components: {
    FilterForm,
    DialogPage,
    AddPay,
    MainTitle,
    TablePager,
    Layout
  },
  data() {
    return {
      base: base, // 默认请求路径
      dialogShow: false,
      submission: [], // table选择数据
      siteTypeList: [
        {
          value: 'FOOD',
          label: '美食广场'
        },
        {
          value: 'STREET',
          label: '商业街'
        },
        {
          value: 'OTHER',
          label: '其他'
        }
      ],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      tableLoading: false,
      tableData: [{}],
      tableHeader: [
        { key: 'noticeNumber', text: '付款通知书编号', minWidth: '150' },
        { key: 'payPeriod', text: '账期', minWidth: '120' },
        { key: 'projectName', text: '商铺名称', minWidth: '120' },
        { key: 'companyName', text: '客户名称', minWidth: '120' },
        { key: 'siteTypeName', text: '场地类型', minWidth: '100' },
        { key: 'siteName', text: '场地', minWidth: '100' },
        { key: 'get_finalDate', text: '缴费截止日期', minWidth: '160' },
        { key: 'payAmountNum', text: '应收款金额', minWidth: '120', align: 'right' },
        { key: 'createDate', text: '创建日期', minWidth: '160' }
      ],
      accountList: [],
      filterParams: {}
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'noticeNumber', label: '付款通知书编号' },
          { value: 'companyName', label: '客户名称' },
          { value: 'projectName', label: '商铺名称' },
          { value: 'siteName', label: '场地' }
        ],
        filterKeys: [
          { value: 'siteType', label: '场地类型', children: this.siteTypeList },
          { value: 'payPeriod', label: '账期', children: this.accountList }
        ]
      }
    }

  },

  created() {
    this.get_paymentnotice()
    this.getNoticeList()
  },
  methods: {
    // 新增提交
    get_paymentAdd(json) {
      this.$api.payment.paymentAdd(json).then(res => {
        if (res === true) {
          this.dialogShow = false
          this.getNoticeList()
        }
      })
    },
    handleCancel() {
      this.dialogShow = false
    },
    // table 选择数据
    changeList(val) {
      this.submission = val
    },
    // 重置
    handleReset() {
      this.filterParams = {}
      this.getNoticeList()
      // 清除筛选，重新请求数据
    },
    // 搜索
    submitForm(form) {
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.getNoticeList()
    },
    get_time(data, fmt) {
      var o = {
        'M+': data.getMonth() + 1, // 月份
        'd+': data.getDate(), // 日
        'h+': data.getHours(), // 小时
        'm+': data.getMinutes(), // 分
        's+': data.getSeconds(), // 秒
        'q+': Math.floor((data.getMonth() + 3) / 3), // 季度
        'S': data.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },

    // 价目表表格数据
    getNoticeList() {
      this.tableLoading = true
      const json = {
        ...this.filterParams,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }

      this.$api.payment.paymentList(json).then(res => {
        if (res) {
          this.tableLoading = false
          var list = res.list
          for (var i in list) {
            list[i]['get_finalDate'] = this.get_time(new Date(list[i].finalDate), 'yyyy-MM-dd')
            list[i]['payAmountNum'] = '￥' + list[i].payAmount
            list[i]['siteTypeName'] = list[i].siteType === 'FOOD' ? '美食广场' : list[i].siteType === 'STREET' ? '商业街' : '其他'
          }
          this.tableData = list
          this.page.pageNum = res.pageNum
          this.page.pageSize = res.pageSize
          this.total = res.total
        }
      }).finally(() => { this.tableLoading = false })
    },
    // 分页
    handleCurrentChange({ currentPage }) {
      this.page.pageNum = currentPage
      this.getNoticeList()
    },
    // 新增
    addPriceList(val) {
      switch (val) {
        case '创建':
          this.dialogShow = true
          this.$nextTick(() => {
            this.$refs.payAdd.from = {}
            this.$refs.payAdd.payPeriod = ''
            this.$refs.payAdd.tableData = []
            this.$refs.payAdd.$refs.customer.resetFields()
          })

          break
        case '批量导出':
          if (Number(this.submission.length) === 0) return this.$message.warning('请选择要导出的数据')
          this.get_downloadInStreamWay(this.submission)
          break
      }
    },
    // 付款通知书批量导出
    get_downloadInStreamWay(arr) {
      var ids = ''
      for (var i in arr) {
        ids += arr[i].id + ','
      }
      ids = ids.substring(0, ids.length - 1)
      if (Number(arr.length) === 1) {
        this.$api.payment.downloadInAttachmentWay({ id: ids, type: 'DOCX' }).then(res => {
          if (res.urlEncodedAddress !== '') {
            window.location.href = res.urlEncodedAddress
          } else {
            this.$message.error('导出失败')
          }
        })
      } else {
        window.location.href =
        `http://${window.location.host}${base.hall}api/hall/rest/payment/paymentnotice/downloadInStreamWay?ids=` + ids
      }``
    },
    clickBtn(row, type) {
      switch (type) {
        case 'VIEW':
          this.$router.push({ name: 'paymentEdit', params: { id: row.id }})
          break
        case 'EXPORT':
          this.get_downloadInStreamWay([row])
          break
        case 'DELETE':
          this.$confirm(
            '此操作将永久删除付款通知书编号为' + row.noticeNumber + '的数据' + ', 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              this.get_paymentDelete(row.id)
            })
            .catch(() => {
            })
          break
      }
    },
    // 删除
    get_paymentDelete(id) {
      this.$api.payment.paymentDelete({ id: id }).then(res => {
        if (res === true) {
          this.submission = []
          this.$refs.multipleTable.$refs.Page_Table.clearSelection()
          this.$message.success('删除成功')
          this.tableData.length.toString() === '1' ? this.pageNum !== 1 ? this.pageNum-- : '' : ''
          this.getNoticeList()
        }
      })
    },
    // 账期数据
    get_paymentnotice() {
      this.$api.payment.paymentnotice().then(res => {
        if (res) {
          this.accountList = res
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .footBtn {
//   width: 100%;
//   display: inline-block;
//   text-align: center;
//   button {
//     width: 96px;
//   }
// }
// .el-form {
//   width: 100%;
//   display: inline-table;
//   .el-form-item {
//     ::v-deep .el-form-item__label {
//       color: #000000;
//       font-size: 14px;
//       font-weight: 400;
//     }
//   }
// }
</style>
