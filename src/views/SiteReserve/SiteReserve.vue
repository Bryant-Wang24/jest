<template>
  <Layout id="sitereserve" :use-head="true" :use-foot="false" :auto-height="true">
    <!-- 搜索组件 -->
    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />
    <!-- 表格部分 -->
    <MainTitle title="场地预订申请" />
    <div class="table_add">
      <el-button v-if="hasRolePermission('SiteReserve_add')" type="primary" @click="addReserve">添加预订</el-button>
      <el-button v-if="hasRolePermission('SiteReserve_pass')" @click="passBatch">批量通过</el-button>
      <el-button @click="lookSchedule">查看排期</el-button>
    </div>

    <TablePager
      ref="multipleTable"
      v-loading="tableLoading"
      border
      :data="tableData"
      :total="page.total"
      :to="page.pageSize"
      :current-page="page.pageNum"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
      @page="handleCurrentChange"
    >
      <el-table-column :resizable="false" type="selection" :reserve-selection="true" width="55" />
      <el-table-column label="申请编号/类型" show-overflow-tooltip min-width="155px">
        <template slot-scope="scope">
          <div>{{ scope.row.code }}</div>
          <div>类型:{{ RESERVATION_TYPE_VALUE_ZH[scope.row.type] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="321px">
        <template slot-scope="scope">
          <el-tooltip class="item tooltip_new tooltip_projectName" effect="dark" :content="scope.row.projectName||'无'" placement="bottom">
            <el-button type="text">{{ scope.row.projectName }}</el-button>
          </el-tooltip>
          <el-tooltip class="item tooltip_new" :disabled="!scope.row.hostCompany" effect="dark" :content="'主办方:'+scope.row.hostCompany" placement="bottom">
            <el-button type="text" style="color:#666666">主办方:{{ scope.row.hostCompany||'-' }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
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
      <el-table-column label="档期状态" min-width="112px">
        <template slot-scope="scope">
          <span v-if="scope.row.state === SCHEDULE_STATE['RESERVE']">预定</span>
          <span v-if="scope.row.state === SCHEDULE_STATE['LOCK']">锁定</span>
          <span v-if="scope.row.state === SCHEDULE_STATE['CHANGING']">
            变更中
            <el-tooltip class="item" effect="dark" :content="'申请编号'+scope.row.oldCode+'档期变更'" placement="top">
              <el-button type="text" icon="el-icon-info" />
            </el-tooltip>
          </span>
          <span v-if="scope.row.state === SCHEDULE_STATE['CHANGED']">
            已变更
            <el-tooltip class="item" effect="dark" :content="scope.row.newCode ? `已变更为申请编号${scope.row.newCode}` : `已变更`" placement="top">
              <el-button type="text" icon="el-icon-info" />
            </el-tooltip>
          </span>
          <span v-if="scope.row.state === SCHEDULE_STATE['RESCINDED']">已撤销</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="200"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="look(scope.row)">查看</el-button>
          <el-button
            v-if="scope.row.approvalStatus === SITE_APPROVE_TYPE['SAVED']
              || scope.row.approvalStatus === SITE_APPROVE_TYPE['REJECTED']
              && hasRoleUserPermission('SiteReserve_edit', scope.row.createBy ? scope.row.createBy.id : null)
            "
            type="text"
            @click="siteEdit(scope.row,'siteEdit')"
          >编辑</el-button>
          <el-button
            v-if="scope.row.approvalStatus === SITE_APPROVE_TYPE['SAVED']
              || scope.row.approvalStatus === SITE_APPROVE_TYPE['REJECTED']
              && hasRoleUserPermission('SiteReserve_delete', scope.row.createBy ? scope.row.createBy.id : null)
            "
            type="text"
            @click="deleteRes(scope.row.id)"
          >删除</el-button>
          <el-button
            v-if="scope.row.approvalStatus === SITE_APPROVE_TYPE['SUBMITTED']
              && isApprovalAuth(scope.row.currentApproverId)
            "
            type="text"
            @click="audit(scope.row)"
          >审核</el-button>
          <el-tooltip class="item" :disabled="!('newId' in scope.row)" effect="dark" content="档期已提交变更申请" placement="top">
            <el-button
              v-if="scope.row.approvalStatus === SITE_APPROVE_TYPE['APPROVED']
                && scope.row.state ===SCHEDULE_STATE['LOCK']
                && hasRoleUserPermission('SiteReserve_change', scope.row.createBy ? scope.row.createBy.id : null)
              "
              type="text"
              :class="{'button_error':'newId' in scope.row}"
              @click="siteEdit(scope.row,'change')"
            >档期变更</el-button>
          </el-tooltip>
          <el-tooltip class="item" :disabled="!('newId' in scope.row)" effect="dark" content="档期已提交变更申请" placement="top">
            <el-button
              v-if="scope.row.approvalStatus === SITE_APPROVE_TYPE['APPROVED']
                && scope.row.state === SCHEDULE_STATE['LOCK']
                && hasRoleUserPermission('SiteReserve_back', scope.row.createBy ? scope.row.createBy.id : null)
              "
              type="text"
              :class="{'button_error':'newId' in scope.row}"
              @click="revokeBtn(scope.row)"
            >撤销档期</el-button>
          </el-tooltip>

        </template>
      </el-table-column>
    </TablePager>

    <DialogPage title="撤销档期" :dialog-show="dialogShow" width="30%" @handleCancel="handleCancel">
      <div>
        <div class="title">档期撤销后不可恢复</div>
        <el-form ref="ruleForm" label-position="top" label-width="80px" :model="revoke">
          <el-form-item
            label="撤销原因"
            prop="reason"
            :rules="[
              { required: true, message: '撤销档期不能为空'},
            ]"
          >
            <el-input v-model="revoke.reason" type="textarea" />
          </el-form-item>
        </el-form>
        <div class="footBtn text-center">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="revokeOk">确定</el-button>
        </div>
      </div>
    </DialogPage>

  </Layout>
</template>

<script>
import { batchPass, isApprovalAuth } from '@/common/approve'
import { SCHEDULE_STATE_ARRAY, SITE_APPROVE_TYPE_ARRAY, SCHEDULE_STATE, SITE_APPROVE_TYPE_ZH, SITE_APPROVE_TYPE } from '@/common/site'
// 搜索组件
import FilterForm from '@/components/FilterForm/FilterForm2'
import DialogPage from '@/components/dialog/dialog'
// 页码组件

import { mapGetters, mapState } from 'vuex'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import Layout from '@/components/base/Layout'
export default {
  name: 'SiteReserve',
  components: { TablePager, Layout, FilterForm, DialogPage, MainTitle },
  data() {
    return {
      SITE_APPROVE_TYPE,
      SITE_APPROVE_TYPE_ZH,
      SCHEDULE_STATE,
      revoke: {
        reason: ''
      },
      isApprovalAuth,
      rowId: '',
      dialogShow: false,
      getRowKeys(row) {
        return row.id
      },
      tableHeader: [
        { label: '场地', key: 'siteNames', minWidth: 200 },
        { label: '展出面积(㎡)', key: 'totalArea', minWidth: 130 },
        { label: '起止时间', key: 'startTime', minWidth: 220,
          formatter: (row) => {
            const { startTime, endTime } = row
            return `从${startTime}至${endTime}`
          }
        },
        { label: '提交人', key: 'createBy', minWidth: 100,
          formatter: (row) => {
            const { createBy } = row
            return createBy?.name || '-'
          }
        },
        { label: '审批状态', key: 'approvalStatus', minWidth: 120,
          formatter: (row) => {
            const { approvalStatus } = row
            return SITE_APPROVE_TYPE_ZH[approvalStatus] || '-'
          }
        }
      ],
      page: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页条数
        total: 0 // 页码总数
      },
      tableLoading: false, // 加载效果
      // 表格数据
      tableData: [],
      multipleSelection: [],
      changeList: [],
      filterParams: {}
    }
  },
  computed: {
    ...mapState({
      RESERVATION_TYPE_VALUE_ZH: state => state.site.RESERVATION_TYPE_VALUE_ZH,
      allTypes: state => state.site.allTypes
    }),
    filterProp() {
      return {
        searchKeys: [
          { value: 'code', label: '申请编号' },
          // { value: 'type', label: '类型' },
          { value: 'projectName', label: '项目名称' },
          { value: 'siteName', label: '场地名称' }
        ],
        filterKeys: [
          { value: 'state', label: '档期状态', children: SCHEDULE_STATE_ARRAY },
          { value: 'approvalStatus', label: '审批状态', children: SITE_APPROVE_TYPE_ARRAY },
          { value: 'type', label: '类型', children: this.allTypes }
        ]
      }
    },
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  created() {
    this.getSiteReserveList()
  },
  methods: {
    revokeOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.siteReserveList.cancel({ id: this.rowId, reason: this.revoke.reason }).then(res => {
            if (res) {
              this.dialogShow = false
              this.getSiteReserveList()
            }
          })
        }
      })
    },
    // 撤销档期
    revokeBtn(row) {
      if ('newId' in row) return false
      this.rowId = row.id
      this.dialogShow = true
    },
    handleCancel() {
      this.revoke = {}
      this.$refs.ruleForm.resetFields()
      this.dialogShow = false
    },
    // 选中的数据
    handleSelectionChange(val) {
      this.changeList = val
    },
    // 删除
    deleteRes(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.siteReserveList.deleteSiteRes(id).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getSiteReserveList()
          }
        })
      }).catch(() => {})
    },
    // 查看
    look(row) {
      const { id } = row
      this.$router.push({ name: 'SiteReserveInfo', query: { id, source: 'view' }})
    },
    // 审核
    audit(row) {
      const { id } = row
      this.$router.push({ name: 'SiteReserveInfo', query: { id, source: 'review' }})
    },
    // 获取场地预定列表
    getSiteReserveList() {
      const json = {
        ...this.filterParams,
        pageNo: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      this.$api.siteReserveList.getSiteRes(json).then(res => {
        if (res) {
          this.tableLoading = false
          this.page.total = res.total
          this.tableData = res.list
        }
      })
    },
    handleCurrentChange({ currentPage }) {
      this.page.pageNum = currentPage
      this.getSiteReserveList()
    },
    // 搜索项搜索按钮
    submitForm(form) {
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.getSiteReserveList()
    },
    // 搜索项重置按钮
    handleReset() {
      this.filterParams = {}
      this.getSiteReserveList()
    },
    // 添加预定
    addReserve() {
      this.$router.push({ name: 'AddSiteProjectForm' })
    },
    // 编辑
    siteEdit(row, type) {
      const { id } = row
      if ('newId' in row) return false
      switch (type) {
        case 'siteEdit':
          this.$router.push({
            name: 'EditSiteProjectForm',
            query: { id, source: type }
          })
          break
        case 'change':
          this.$router.push({
            name: 'ChangeSiteProjectForm',
            query: { id, source: type }
          })
          break

        default:
          break
      }
    },
    // 批量通过
    passBatch() {
      var list = this.changeList
      if (Number(list.length) === 0) return this.$message.warning('请先选择要通过的数据')
      // var ids = ''
      const params = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (!item.approvalStatus || item.approvalStatus !== SITE_APPROVE_TYPE['SUBMITTED']) {
          this.$message.error('申请编号‘' + list[i].code + '’的场地预定，审批状态不是审核中')
          return
        }
        if (!isApprovalAuth(item.currentApproverId)) {
          this.$message.error('申请编号‘' + list[i].code + '’的场地预定，当前审批人非当前用户')
          return
        }
        params.push({
          approvalFlowId: item.approvalFlowId,
          currentApproverId: item.currentApproverId
        })
      }
      batchPass(params).then(() => {
        this.getSiteReserveList()
        this.$message({
          type: 'success',
          message: '批量通过成功!'
        })
      })
    },
    // 查看排期
    lookSchedule() {
      this.$router.push({ name: 'ScheduleView' })
    }
  }

}
</script>

<style lang="scss" scoped>
.button_error{
  color: #999999;
}

.tooltip_new{
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  padding:4px 0 ;
  text-align: left;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  color: #000000;
}
.tooltip_projectName{
  width: 100%;
}
::v-deep .el-table__empty-text {
    font-size: 16px;
}
</style>
