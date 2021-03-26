<template>
  <div id="handoverSlipList" @keyup.enter="onSubmit">
    <!-- 查询部分 -->
    <el-form ref="form" :inline="true" :model="form" class="demo-form-inline" label-width="82px">
      <el-form-item label="项目名称：" prop="projectName">
        <el-select v-model="form.projectName" filterable placeholder="请选择（可检索）" style="width: 300px">
          <WrapOption
            v-for="(item, index) in projectOptions"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主办名称：" prop="hostName">
        <!-- <el-input v-model="form.hostName" type="text" placeholder="请输入" style="width: 300px" /> -->
        <el-select v-model="form.hostName" filterable placeholder="请选择（可检索）" style="width: 300px">
          <WrapOption
            v-for="(item, index) in hostOptions"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <TablePager
      ref="TablePager"
      v-loading="loading"
      :data="tableData"
      :total="pagination.total"
      :to="pagination.pageSize"
      :current-page="pagination.pageNum"
      @page="handleCurrentChange"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :prop="item.key"
        :label="item.label"
        reserve-selection
        :formatter="item.formatter"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-show="isShowTableBtn(['REVIEW','PROGRESS','PASSED','REJECTED','CANCEL'], scope)" type="text" @click.native.prevent="handleViewAndReviewAndReceive(scope.row,'VIEW')">
            查看
          </el-button>
          <el-tooltip effect="dark" content="任务书已下发，无法修改" placement="top-start" :disabled="scope.row.taskBookState !== 2">
            <el-button v-if=" hasRoleUserPermission('handoverSlipMgmt_edit', scope.row.createBy ? scope.row.createBy.id : null)" v-show="isShowTableBtn(['REJECTED', 'PASSED'], scope)" type="text" :class="{'button_error':scope.row.taskBookState === 2}" @click.native.prevent="handleViewAndReviewAndReceive(scope.row, 'EDIT')">
              修改
            </el-button>
          </el-tooltip>
          <el-button v-if=" hasRoleUserPermission('handoverSlipMgmt_void', scope.row.createBy ? scope.row.createBy.id : null)" v-show="isShowTableBtn(['REJECTED'], scope) && scope.row.stateType !== 'RESCINDED'" type="text" @click.native.prevent="handleVoid(scope)">
            作废
          </el-button>
          <el-button v-show="(scope.row.stateType !== 'RESCINDED' && isShowTableBtn(['REVIEW'], scope) && isApprovalAuth(scope.row.currentApproverId))" type="text" @click.native.prevent="handleViewAndReviewAndReceive(scope.row, 'REVIEW')">
            审核
          </el-button>
          <el-button v-if=" hasRolePermission('handoverSlipMgmt_receive')" v-show="scope.row.stateType !== 'RESCINDED' && isShowTableBtn(['PROGRESS'], scope)" type="text" @click.native.prevent="handleViewAndReviewAndReceive(scope.row, 'RECEIVE')">
            接收
          </el-button>
        </template>
      </el-table-column>
    </TablePager>
    <!-- 弹窗 -->
    <el-dialog :title="dialogData.title" :visible.sync="dialogData.visible" :destroy-on-close="true" width="65%" @closed="currentData = {handoverSlip:{}}">
      <div v-if="dialogData.visible">
        <basicInfo v-if="DIALOG[dialogData.type].includes('basicInfo')" :basic-info="currentData" />
        <plannerInfo v-if="DIALOG[dialogData.type].includes('plannerInfo') && currentData.handoverSlip.state === 'PASSED'" :plan-info="currentData" />
        <exhInfo v-if="DIALOG[dialogData.type].includes('exhInfo')" :exh-info="currentData" />
        <!-- 审批流组件 -->
        <!-- <ApprovalLine v-if="DIALOG[dialogData.type].includes('logsInfo') && approveId" ref="approve" :approve-id="approveId" /> -->
        <logsInfo v-if="DIALOG[dialogData.type].includes('logsInfo')" :logs-info="currentData" />
        <!-- <review v-if="DIALOG[dialogData.type].includes('review')" ref="review" /> -->
        <assign v-if="DIALOG[dialogData.type].includes('assign')" ref="assign" :user-list="userList" />
        <edit v-if="DIALOG[dialogData.type].includes('edit')" ref="edit" :edit-data="currentData" />
        <!-- <addHandoverSlip v-if="DIALOG[dialogData.type].includes('addHandoverSlip')" :edit-id="editId" /> -->
        <div class="dialogFooter">
          <el-button v-if="isShowDialogBtn(['VIEW','REVIEW'])" @click="handleCloseDialog">关闭</el-button>
          <ApprovalBtn v-if="isShowDialogBtn(['REVIEW'])" :approve-id="approveId" :visible.sync="approveVisible" @refresh="refresh" />
          <!-- <el-button v-if="isShowDialogBtn(['REVIEW'])" @click="handleDialogReview(false)">拒绝</el-button>
          <el-button v-if="isShowDialogBtn(['REVIEW'])" type="primary" @click="handleDialogReview(true)">审核通过</el-button> -->
          <el-button v-if="isShowDialogBtn(['RECEIVE', 'EDIT'])" @click="handleCloseDialog">取消</el-button>
          <el-button v-if="isShowDialogBtn(['RECEIVE'])" type="primary" @click="handleDialogReceive">确认</el-button>
          <el-button v-if="isShowDialogBtn(['EDIT'])" type="primary" @click="handleDialogEdit">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TablePager from '@/components/base/TablePager'
import basicInfo from './components/basicInfo'
import plannerInfo from './components/plannerInfo'
import exhInfo from './components/exhInfo'
import logsInfo from './components/logsInfo'
import assign from './components/assign'
import edit from './components/edit'
import ApprovalBtn from '@/components/ApprovalOperate'
import WrapOption from '@/components/base/WrapOption'

import { STATE, TIMETYPE, getSiteName, TIMETYPE_OBJECT } from '@/common/handoverSlipMgmt'
import { isApprovalAuth } from '@/common/approve'
import { deepClone, uniqueArr } from '@/utils'
import { mapMutations } from 'vuex'

// 定义弹窗可展示的组件
const DIALOG = {
  VIEW: ['basicInfo', 'exhInfo', 'logsInfo', 'plannerInfo'],
  REVIEW: ['basicInfo', 'exhInfo', 'review'],
  RECEIVE: ['basicInfo', 'exhInfo', 'assign'],
  EDIT: ['edit', 'plannerInfo']
}
const DIALOG_TITLE = {
  VIEW: '查看详情',
  REVIEW: '审核交接单',
  RECEIVE: '接收交接单',
  EDIT: '修改交接单'
}
export default {
  name: 'HandoverSlipList',
  components: { TablePager, basicInfo, plannerInfo, exhInfo,
    logsInfo,
    WrapOption,
    // review,
    assign, edit, ApprovalBtn
    // ApprovalLine
  },
  data() {
    return {
      // reslist: [], // res数据
      loading: false,
      approveId: null, // 审批流
      approveVisible: false, // 审批流按钮组件必传参数
      isApprovalAuth,
      DIALOG,
      editId: null, // 编辑时传入的id
      projectOptions: [], // 项目名称数组
      hostOptions: [], // 主办名称数组
      projectName: '',
      customerOptions: [], // 客户名称数组
      form: {
        projectName: '', //  项目id
        hostName: '' // 主办名字
      },
      tableHeader: [
        // {
        //   key: 'handoverCode',
        //   text: '交接单编号'
        // },
        // {
        //   key: 'projectName',
        //   text: '项目名称',
        // },
        {
          key: 'hostName',
          label: '主办名称'
        },
        {
          key: 'hostContacts',
          label: '主办联系人'
        },
        {
          key: 'projectLeader',
          label: '项目负责人'
        },
        {
          key: 'coordinator',
          label: '统筹负责人'
        },
        {
          key: 'state',
          label: '状态',
          formatter: (row) => {
            return STATE[row.state] || ''
          }
        },
        {
          key: 'createDate',
          label: '提交时间'
        }
      ],
      tableData: [],
      dialogData: {
        title: '',
        visible: false,
        type: '' // 操作的类型
      },
      currentData: {
        handoverSlip: {}
      }, // 操作按钮点击时，当前row的scope数据
      pagination: {
        pageSize: 10, // 分页
        pageNum: 1,
        total: 0
      },
      siteList: [], // 场地列表
      userList: [] // 主场用户列表
    }
  },
  async mounted() {
    const { pageNum, pageSize } = this.pagination
    await this._getSiteType()
    const params = { pageNum, pageSize }
    this._getDandoverSlipList(params)
    this._getProjectOptionsAndHostOptions()
    this._getUserList()
  },
  methods: {
    refresh() {
      this.$message.success('操作成功')
      this.onSubmit()
      this.dialogData.visible = false
    },
    // 查询
    onSubmit() {
      this.pagination.pageNum = 1
      const { projectName, hostName } = this.form
      // const project = this.projectOptions.find(item => item.id === id)
      const params = { hostName: hostName || null, projectName: projectName || null, pageNum: 1, pageSize: this.pagination.pageSize }
      this._getDandoverSlipList(params)
    },
    // 重置
    onReset() {
      this.pagination.pageNum = 1
      this.$refs['form'].resetFields()
      this._getDandoverSlipList({ pageNum: 1, pageSize: 10 })
    },
    // 查看/审核/接收/编辑
    async handleViewAndReviewAndReceive(val, type) {
      if (Number(val.taskBookState) === 2 && type === 'EDIT') return false
      const { id } = val
      this.dialogData.title = DIALOG_TITLE[type]
      this.dialogData.visible = true
      this.dialogData.type = type
      const res = await this._getDataFromId(id)
      this.approveId = res.handoverSlip?.approvalFlowId
      const currentData = this.initTableRow(res)
      this.currentData = currentData
    },
    /**
     * 作废 交接单
     */
    handleVoid(scope) {
      const { row } = scope
      const { id } = row
      this.$confirm(`<div><p>确定作废此交接单吗?</p><span style="color:#999999;">作废后将无法恢复</span></div>`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.$api.handoverSlipMgmt.cancel(id).then(res => {
            this.$message({
              type: 'success',
              message: '已作废',
              onClose: () => {

              }
            })
            this.onSubmit()
            this._getProjectOptionsAndHostOptions()
          })
        })
        .catch(() => {})
    },
    /**
     * 编辑 交接单
     */
    handleEdit({ row }, type) {
      const { id } = row
      this.editId = id
      this.dialogData.title = DIALOG_TITLE[type]
      this.dialogData.visible = true
      this.dialogData.type = type
    },
    /**
     * 修改保存交接单
     */
    handleDialogEdit() {
      let params = {}
      this.$refs.edit.getFromData().then(res => {
        params = res
        this.$api.handoverSlipMgmt.edit(params).then(res => {
          this.$message.success({
            type: 'success',
            message: '修改成功',
            onClose: () => {

            }
          })
          this.onSubmit()
          this.dialogData.visible = false
        })
      }).catch(e => {
        console.log('e')
      })
    },
    /**
     * 拒绝/审核通过 交接单
     * @param {boolean} 是否通过
     */
    handleDialogReview(type) {
      const { id } = this.currentData?.handoverSlip
      const reason = this.$refs.review.textarea
      switch (type) {
        case false:
          reason ? this.$api.handoverSlipMgmt.reject({ id, reason }).then(res => {
            this.$message.success({
              type: 'success',
              message: '已拒绝',
              onClose: () => {

              }
            })
            this.onSubmit()
            this.dialogData.visible = false
          }) : this.$message.warning('请填写审核意见')
          break
        case true:
          this.$api.handoverSlipMgmt.pass({ id, reason }).then(res => {
            this.$message.success({
              type: 'success',
              message: '审核通过',
              onClose: () => {

              }
            })
            this.onSubmit()
            this.dialogData.visible = false
          })
          break
        default:
          break
      }
    },
    /**
     * 接收 交接单
     */
    handleDialogReceive() {
      const { id } = this.currentData?.handoverSlip
      this.$refs.assign.validate().then(form => {
        const params = { id, ...form }
        this.$api.handoverSlipMgmt.receive(params).then(res => {
          this.$message.success({
            type: 'success',
            message: '接收成功',
            onClose: () => {

            }
          })
          this.onSubmit()
          this.dialogData.visible = false
        })
      }).catch(e => {
        console.log(e)
      })
    },
    // 关闭弹窗
    handleCloseDialog() {
      this.dialogData.visible = false
    },
    // 弹窗底部按钮显隐控制
    isShowDialogBtn(types) {
      return types.includes(this.dialogData.type)
    },
    // table操作按钮
    isShowTableBtn(types, { row }) {
      const { state } = row
      return types.includes(state)
    },
    // 设置pageNum
    handleCurrentChange({ currentPage }) {
      this.pagination.pageNum = currentPage
      const { pageNum, pageSize } = this.pagination
      const params = { pageNum, pageSize }
      this._getDandoverSlipList(params)
    },
    initTableRow(row) {
      const item = deepClone(row)
      // 处理场地数据
      const { state } = item.handoverSlip
      const { siteSchedules, siteSale, information } = item.saleMessageQuery
      const { startDate, endDate } = siteSale
      const siteAndArea = siteSchedules.map(site => {
        const { siteName, siteArea } = site
        return {
          siteName,
          siteArea
        }
      })
      const flagObj = {}
      for (let i = 0; i < information.length; i++) {
        const timeInfo = information[i]
        const { isFlag, type, siteId } = timeInfo
        const siteName = getSiteName(siteId, this.siteList)
        if (type === TIMETYPE_OBJECT.RESERVED) continue // 过滤掉预留时间
        if (Object.prototype.hasOwnProperty.call(flagObj, isFlag)) {
          flagObj[isFlag]['siteNames'].includes(siteName) ? null : flagObj[isFlag]['siteNames'].push(siteName)
          // 相同的时间只取一次
          if (flagObj[isFlag][TIMETYPE[type]].length > 0 && !flagObj[isFlag][TIMETYPE[type]].every(t => t.siteId === siteId)) continue
          flagObj[isFlag][TIMETYPE[type]].push(timeInfo)
        } else {
          flagObj[isFlag] = {
            siteNames: [siteName],
            [TIMETYPE['DEPLOY']]: [],
            [TIMETYPE['OPEN']]: [],
            [TIMETYPE['CLOSE']]: []
          }
          flagObj[isFlag][TIMETYPE[type]].push(timeInfo)
        }
      }
      const siteTimeArrange = {
        startDate,
        endDate,
        flagObj
      }
      item.saleMessageQuery['siteAndArea'] = siteAndArea
      item.saleMessageQuery['siteTimeArrange'] = siteTimeArrange
      item.handoverSlip['stateText'] = STATE[state]
      return item
    },
    // 获取场地list
    async _getSiteType() {
      const types = 'PAVILION,AUDITORIUM'
      const res = await this.$api.siteReserveList.querySite(types)
      this.SET_SITE_LIST(res)
      this.siteList = res
    },
    // 获取列表
    _getDandoverSlipList(params) {
      params['dataBelong'] = 'GZ_POLY'
      this.loading = true
      this.$api.handoverSlipMgmt.getDandoverSlipList(params).then(res => {
        const { list, total } = res
        this.tableData = list
        this.pagination.total = total
        this.loading = false
      })
    },
    // 获取搜索项options
    _getProjectOptionsAndHostOptions() {
      this.$api.handoverSlipMgmt.getDandoverSlipList({ dataBelong: 'GZ_POLY' }).then(res => {
        const list = deepClone(res.list)
        const projectObj = {}
        const projectOptions = list.reduce((item, next) => {
          projectObj[next.projectName] ? '' : projectObj[next.projectName] = true && item.push(next.projectName)
          return item
        }, [])
        // const projectIds = list.map(item => item.projectId)
        this.SET_HANDOVER_LIST(list)
        let hostOptions = []
        list.forEach(item => {
          const { hostName } = item
          let arr = []
          if (hostName) {
            arr = hostName.split(',')
          }
          hostOptions = [...hostOptions, ...arr]
        })
        this.projectOptions = projectOptions
        this.hostOptions = uniqueArr(hostOptions)
      })
    },
    // 根据id获取详情
    _getDataFromId(id) {
      return this.$api.handoverSlipMgmt.getDataFromId(id)
    },
    // 获取主场用户列表
    _getUserList() {
      this.$api.handoverSlipMgmt.getUserList().then(res => {
        this.userList = res
      })
    },
    ...mapMutations('handoverSlipMgmt', {
      SET_SITE_LIST: 'SET_SITE_LIST',
      SET_HANDOVER_LIST: 'SET_HANDOVER_LIST'
    })
  }
}
</script>
<style lang="scss" scoped>
.button_error{
  color: #999999;
}
#handoverSlipList{
  padding-top: 20px;
  .el-form-item{
    width: 100%;
  }
  ::v-deep .el-dialog__footer{
    text-align: center;
  }
}
.dialogFooter{
  text-align: center;
}
</style>
