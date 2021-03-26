<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true" class="contract">
    <!-- <div class="content_new"> -->
    <!-- <div class="container pb-0"> -->
    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />
    <!-- </div> -->
    <!-- <div class="table"> -->
    <MainTitle title="合同/服务单管理" />
    <div class="table_add">
      <el-button
        v-if="hasRolePermission('contract_pass')"
        @click="get_contractsBatchPass()"
      >批量通过</el-button>
      <el-button
        v-if="hasRolePermission('contract_attach')"
        icon="el-icon-plus"
        @click="addPriceList('添加附加合同')"
      >附加合同</el-button>
      <el-dropdown class="dropdown" trigger="click" @command="handleCommand">
        <el-button>
          批量导出<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="EXPORT_TYPE.CONTRACT_FILE">合同/服务单</el-dropdown-item>
          <el-dropdown-item :command="EXPORT_TYPE.RETURN_FILE">回传文件</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-radio-group
        v-model="contractListFilterType"
        @change="get_contractListFilterType"
      >
        <el-radio-button
          v-for="(item, index) of filterTypeList"
          :key="index"
          :label="item.label"
        >{{ item.title }}</el-radio-button>
      </el-radio-group>
    </div>

    <TablePager
      ref="TablePager"
      v-loading="tableLoading"
      :data="tableData"
      :total="page.total"
      :to="page.pageSize"
      :current-page="page.pageIndex"
      :multiple-selection="submission"
      row-key="contract.id"
      @selection-change="changeList"
      @page="handleCurrentChange"
    >
      <el-table-column :resizable="false" type="selection" :reserve-selection="true" width="55" />
      <el-table-column label="合同ID/类型" min-width="160">
        <template slot-scope="scope">
          <el-table class="table_overflow" :data="[scope.row]" :show-header="false">
            <el-table-column label="展示" show-overflow-tooltip prop="contract.idNum" />
          </el-table>
          <el-table class="table_overflow table_color" :data="[scope.row]" :show-header="false">
            <el-table-column label="展示" show-overflow-tooltip prop="templateListTypeName" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="200" align="left">
        <template slot-scope="scope">
          <el-table class="table_overflow" :data="[scope.row]" :show-header="false">
            <el-table-column label="展示" show-overflow-tooltip>
              <template>
                <warning v-if="scope.row.contract.project.state === 'RESCINDED'" />
                {{ scope.row.contract.project.projectName }}
              </template>
            </el-table-column>
          </el-table>
          <el-table class="table_overflow table_color" :data="[scope.row]" :show-header="false">
            <el-table-column label="展示" show-overflow-tooltip prop="customers_nsme" />
          </el-table>
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
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="clickBtn(scope.row, '查看')"
          >查看</el-button>
          <el-button
            v-if="
              scope.row.contract.state === ('NOT_CONFIRMED' || 'REJECTED') &&
                scope.row.contract.createBy.id === userInfo.id &&
                hasRoleUserPermission('contract_void', scope.row.createBy ? scope.row.createBy.id : null)
            "
            type="text"
            @click="clickBtn(scope.row, '作废')"
          >作废</el-button>
          <el-button
            v-if="scope.row.contract.state !== 'NOT_CONFIRMED'"
            type="text"
            @click="clickBtn(scope.row, '审批流')"
          >审批流</el-button>
          <el-button
            v-if="scope.row.contract.state === 'EFFECTIVE'"
            type="text"
            @click="clickBtn(scope.row, '回传文件')"
          >回传文件</el-button>
          <el-button
            v-if="scope.row.contract.state === 'NOT_CONFIRMED' && hasRoleUserPermission('contract_submit', scope.row.contract.createBy ? scope.row.contract.createBy.id : null)"
            type="text"
            @click="clickBtn(scope.row, '提交审核')"
          >提交审核</el-button>
          <el-button
            v-if="
              scope.row.contract.state === 'AUDITING' &&
                isApprovalAuth(scope.row.currentApproverId) &&
                (scope.row.contract.project && scope.row.contract.project.state !== 'RESCINDED')
            "
            type="text"
            @click="clickBtn(scope.row, '审批')"
          >审批</el-button>
          <el-button
            v-if="scope.row.contract.state !== ('REJECTED' || 'OBSOLETE')"
            type="text"
            @click="clickBtn(scope.row, '导出')"
          >导出</el-button>
        </template>
      </el-table-column>
    </TablePager>
    <DialogPage
      :dialog-show="dialogShow"
      :width="dialogWidth"
      :title="titleName"
      @handleCancel="handleCancel"
    >
      <ReturnFile v-if="titleName === '回传文件' && dialogShow" :contract-id="contractId" @cancel="handleCancel" @refresh="refresh" />
      <div v-else class="dialog_new">
        <el-form
          v-if="titleName==='添加附加合同'"
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="选择项目：" prop="projectId">
            <el-select v-model="ruleForm.projectId" placeholder="请选择项目" :style="SelectOptionsStyle">
              <WrapOption
                v-for="(item, index) of projectData"
                :key="index"
                :label="item.projectName"
                :value="item.id"
                :style="SelectOptionsStyle"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择合同模板：" prop="templateId">
            <el-select v-model="ruleForm.templateId" placeholder="请选择合同模板" :style="SelectOptionsStyle">
              <WrapOption
                v-for="(item, index) of templateList"
                :key="index"
                :label="item.name"
                :value="item.id"
                :style="SelectOptionsStyle"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div v-else>
          <el-upload
            class="upload-demo"
            :action="`${base.hall}a/api/ossfile/upload`"
            :data="licenseData"
            name="file"
            :before-upload="handleLicenseBefore"
            :on-success="handleLicenseSuccess"
            :on-error="handleUploadError"
            :on-preview="handlePreview"
            :before-remove="handleRemove"
            :limit="1"
            :file-list="fileList"
            accept=".docx"
          >
            <el-button size="small" :disabled="fileList.length!==0" :loading="btnLoading">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传.docxs格式的文档，且只能上传一个！
            </div>
          </el-upload>
        </div>
        <div class="footBtn">
          <el-button
            type="primary"
            :loading="loadingBtn"
            @click="submitFrom"
          >确定</el-button>
        </div>
      </div>
    </DialogPage>
    <DialogContract
      :dialog-contract="dialogContract"
      :approve-id="approvalFlowId"
      @beforeClose="dialogContract = false"
    />
    <!-- </div> -->
  </Layout>
</template>
<script>
// import axios from 'axios'
import base from '@/api/base'
import TablePager from '@/components/base/TablePager'
import Layout from '@/components/base/Layout'
import DialogContract from '@/views/sale/components/dialogContract'
import FilterForm from '@/components/FilterForm/FilterForm2'
import DialogPage from '@/components/dialog/dialog'
import { batchPass, isApprovalAuth } from '@/common/approve'
import ReturnFile from './components/ReturnFile'
import MainTitle from '@/components/base/MainTitle'
import WrapOption from '@/components/base/WrapOption'
import { CONTRACT_NATURE, CONTRACT_STATE } from '@/common/contract'
// import {mapState} from 'vuex'
const EXPORT_TYPE = {
  CONTRACT_FILE: 'CONTRACT_FILE', // 合同服务单
  RETURN_FILE: 'RETURN_FILE' // 回传文件
}
export default {
  name: 'PriceList',
  components: {
    WrapOption,
    FilterForm,
    DialogPage,
    DialogContract,
    ReturnFile,
    MainTitle,
    TablePager,
    Layout
  },
  data() {
    return {
      EXPORT_TYPE, // 批量导出类型
      isApprovalAuth,
      base: base, // 默认请求路径
      fileList: [],
      titleName: '',
      loadingBtn: false,
      submission: [], // 表格选中的数据
      active: Number(0),
      dialogContract: false, // 审批流
      stepList: [], // 审批流数据
      enabled: '',
      fuzzyName: '',
      tableLoading: false,
      page: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      btnLoading: false, // 表单防刷
      tableData: [],
      tableHeader: [
        {
          key: 'contractPaymentPlanGroup.amount',
          label: '总金额(元)',
          width: '100',
          align: 'right',
          formatter: (row) => {
            const amount = row?.contract?.amount || '-'
            const discount = row?.contract?.discount
            const discountText = discount ? `优惠:￥${discount}` : ''
            return `${amount} ${discountText}`
          }
        },
        { key: 'state', label: '状态', minWidth: '100',
          formatter: (row) => {
            const state = row?.contract?.state
            return CONTRACT_STATE[state] || '-'
          }

        },
        { key: 'contract.createBy.name', label: '提交人', minWidth: '100' },
        { key: 'contract.createDate', label: '提交时间', minWidth: '160' },
        { key: 'approvedName', label: '审核人', minWidth: '100' },
        { key: 'reviewDate', label: '审核时间', minWidth: '160',
          formatter: (row) => {
            const state = row?.contract?.state
            if (state === 'EFFECTIVE' && Reflect.has(row, 'approvalFlow')) {
              return row.approvalFlow.createDate || '-'
            } else {
              return '-'
            }
          }
        }
      ],
      dialogShow: false, // 弹窗开启关闭
      dialogTitle: '', // 弹窗标题
      dialogWidth: '600px',
      ruleForm: {
        projectId: '',
        templateId: ''
      },
      // 表单校验
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        templateId: [
          { required: true, message: '请选择合同模板', trigger: 'change' }
        ]
      },
      natureList: [
        {
          value: 'MAIN',
          label: '主合同'
        },
        {
          value: 'SUPPLEMENTARY',
          label: '补充合同'
        }
      ],
      stateList: [
        {
          value: 'NOT_CONFIRMED',
          label: '待确认'
        },
        {
          value: 'AUDITING',
          label: '审核中'
        },
        {
          value: 'REJECTED',
          label: '已拒绝'
        },
        {
          value: 'EFFECTIVE',
          label: '已生效'
        },
        {
          value: 'OBSOLETE',
          label: '已作废'
        }
      ],
      contractListFilterType: 'ALL', // 合同列表筛选类型
      filterTypeList: [
        { label: 'ALL', title: '全部' },
        { label: 'WAIT_FOR_ME', title: '待我处理' },
        { label: 'DONE_BY_ME', title: '我已处理' }
      ],
      userInfo: {}, // 账户数据
      templateList: [], // 合同模板
      templateListType: [
        {

          value: 'VENUE_LEASING',
          label: '场馆租赁合同'
        },
        {

          value: 'SERVICE_ORDER',
          label: '服务订单'
        },
        {
          value: 'CONFERENCE_LEASING',
          label: '会议租赁合同'
        },
        {
          value: 'ADV_PRODUCTION_LEASING',
          label: '广告制作租赁合同'
        },
        {
          value: 'FIRE_SAFETY',
          label: '防火安全合同'
        },
        {
          value: 'FIRE_APPROVAL',
          label: '消防报批合同'
        },
        {
          value: 'CONFERENCE_APPROVAL',
          label: '会议报批合同'
        },
        {
          value: 'SHOP_LEASING',
          label: '商铺租赁'
        }
      ],
      licenseData: {
        // 默认上传参数
        type: '',
        dataId: ''
      },
      contractId: '', // 点击table-row当前合同id
      fileId: '',
      approvalFlowId: '',
      filterParams: {},
      SelectOptionsStyle: { width: '440px' }
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'idNum', label: '合同编号' },
          { value: 'projectName', label: '项目名称' },
          { value: 'customerName', label: '客户名称' }
        ],
        filterKeys: [
          { value: 'nature', label: '合同性质', children: this.natureList },
          { value: 'state', label: '合同状态', children: this.stateList },
          { value: 'type', label: '合同类型', children: this.templateListType }
        ]
      }
    }

  },

  created() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.get_contractTemplates()
    this.get_contractList()
    this.get_projectList()
  },
  methods: {
    // 合同类型名称
    get_templateListTypeName(type) {
      for (const i in this.templateListType) {
        if (this.templateListType[i].value === type) {
          return this.templateListType[i].label
        }
      }
    },
    refresh() {
      this.handleCancel()
      this.get_contractList()
    },
    handleCancel() {
      this.dialogShow = false
      if (this.titleName === '添加附加合同') {
        this.$refs.ruleForm.resetFields()
        this.ruleForm = {}
      }
    },
    // 执照上传前
    handleLicenseBefore(file) {
      this.btnLoading = true
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'docx'
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.btnLoading = false
        this.$message.error('上传文件只能是.docx格式!')
        return false
      }
      if (this.fileList.length === '1') return this.$message.warning('只能上传一个文件')
      this.licenseData.dataId = Date.parse(new Date())
      this.licenseData.type = 'EXHHALL_CONTRACT'
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 10MB!')
      // }
      // this.licenseData.priceListId = this.priceListId
    },
    handleUploadError() {
      this.$message.error('上传失败，请重试')
    },
    handleLicenseSuccess(response, file, fileList) {
      if (response.data === null) {
        this.fileList = []
        this.$message.error('上传失败，请重试')
      } else {
        this.fileList = fileList
        this.fileId = response.data[0].fileId
        // this.contractId = response.data[0].fileId
        this.$message.success('已经成功上传')
      }
      this.btnLoading = false
      // console.log(response)
      // this.fileList =fileList
      // this.btnLoading = false
      // this.$message.success('已经成功上传')
    },

    // 点击文件列表中已上传的文件时，预览
    handlePreview(file) {
      // this.preview = file?.response?.data[0]?.address
      // this.dialogVisible = true
    },
    // 文件列表移除文件时的钩子
    handleRemove() {
      this.fileList = []
    },
    // 附加合同提交
    submitFrom() {
      // if (this.titleName === '回传文件') {
      //   this.fileList.length === 1 ? this.get_contractsReturnFile() : this.$message.error('请上传一个.docx格式文档')
      //   return
      // }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loadingBtn = true
          const json = {
            contract: {
              project: {
                id: this.ruleForm.projectId
              },
              template: {
                id: this.ruleForm.templateId
              },
              updateBy: {
                id: this.userInfo.id
              }
            }
          }
          this.$api.contract.saveAndSubmit(json).then(res => {
            if (res === true) {
              this.$message.success('添加成功')
              this.get_contractList()
              this.dialogShow = false
              this.loadingBtn = false
              this.ruleForm = {}
              this.$refs.ruleForm.resetFields()
            } else {
              this.$message.success('添加失败')
              this.loadingBtn = false
              this.ruleForm = {}
              this.$refs.ruleForm.resetFields()
            }
          }).finally(() => {
            this.loadingBtn = false
          })
        }
      })
    },
    // 添加回传文件
    // get_contractsReturnFile() {
    //   // this.btnLoading = true
    //   const json = {
    //     contractId: this.contractId,
    //     fileId: this.fileId
    //   }
    //   this.$api.contract.contractsReturnFile(json).then(res => {
    //     if (res === true) {
    //       this.$message.success('添加成功')
    //     } else {
    //       this.$message.success('添加失败')
    //     }
    //     // this.btnLoading = false
    //     this.dialogShow = false
    //   })
    // },
    // 合同 - 获取合同模板
    get_contractTemplates() {
      this.$api.contract.contractTemplates(['FIRE_SAFETY', 'FIRE_APPROVAL', 'CONFERENCE_APPROVAL']).then(res => {
        this.templateList = res
      })
    },
    // 表格选中的数据集合
    changeList(val) {
      this.submission = val
    },
    // 批量审批
    get_contractsBatchPass() {
      var list = this.submission
      if (list.length === 0) return this.$message.warning('请选择要审批的数据')
      var arr = []
      for (var i in list) {
        // if (list[i].contract.nextApproveBy === null && list[i].contract.state !== 'AUDITING') {
        if (list[i].contract.state !== 'AUDITING') {
          this.$message.error(
            '编号‘' + list[i].contract.idNum + '’合同，无法执行该操作'
          )
          return
        } else {
          // if (list[i].contract.nextApproveBy.id !== this.userInfo.id) {
          if (list[i].currentApproverId !== this.userInfo.id) {
            this.$message.warning(
              '编号‘' + list[i].contract.idNum + '’合同，无法执行该操作'
            )
            return
          }
        }
        // arr.push({
        //   id: list[i].contract.id,
        //   userId: list[i].contract.nextApproveBy.id,
        //   reason: ''
        // })
        arr.push({
          approvalFlowId: list[i].contract.approvalFlowId,
          currentApproverId: list[i].currentApproverId
        })
      }
      batchPass(arr).then(() => {
        this.get_contractList()
        this.$message({
          type: 'success',
          message: '批量通过成功!'
        })
      })
      // this.$api.contract.contractsBatchPass(arr).then(res => {
      //   if (res === true) {
      //     this.get_contractList()
      //   }
      // })
    },
    // 场地销售列表
    get_projectList() {
      this.$api.contract.projectList({}).then(res => {
        if (res) {
          this.projectData = res.list.filter(t => t.state !== 'RESCINDED')
        }
      })
    },
    get_contractListFilterType(val) {
      this.contractListFilterType = val
      this.get_contractList()
    },
    // 重置
    handleReset() {
      this.filterParams = {}
      this.get_contractList()
    },
    // 搜索
    submitForm(form) {
      this.filterParams = {}
      this.page.pageIndex = 1
      this.page.pageSize = 10
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.get_contractList()
    },

    // 合同表格数据
    get_contractList() {
      this.submission = []
      this.tableLoading = true
      const json = {
        userId: this.userInfo.id,
        // contractListFilterType: this.contractListFilterType,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        ...this.filterParams
      }
      // ALL
      // WAIT_FOR_ME
      // DONE_BY_ME
      if (this.contractListFilterType === 'WAIT_FOR_ME') {
        json.currentPendingApproverId = this.userInfo.id
      } else if (this.contractListFilterType === 'DONE_BY_ME') {
        json.processedApprovalNodeUserId = this.userInfo.id
      }
      this.$api.contract.contractList(json).then(res => {
        // console.log(res)
        this.tableLoading = false
        var arr = res.list
        for (var i in arr) {
          arr[i]['templateListTypeName'] = this.get_templateListTypeName(arr[i].contract.type)
          arr[i]['approvedName'] = 'approvalFlow' in arr[i] ? this.getApprovedName(arr[i].approvalFlow.nodes, arr[i].currentApproverId) : '-'
          arr[i]['customers_nsme'] = this.getCustomersName(arr[i].customers)
          arr[i]['natureName'] = CONTRACT_NATURE[arr[i].contract.nature]
        }
        // debugger
        this.page.total = res.total
        this.tableData = arr
      }).finally(() => { this.tableLoading = false })
    },
    getApprovedName(arr, id) {
      for (const i in arr) {
        if (arr[i].approverId === id) {
          return arr[i].approverName
        }
      }
    },
    // 获取名称
    getCustomersName(list) {
      var name = ''
      for (var i in list) {
        if (!list[i]) continue
        name += list[i].companyName + ','
      }
      name = name.substring(0, name.length - 1)
      return name
    },
    // 分页
    handleCurrentChange({ currentPage }) {
      this.page.pageIndex = currentPage
      this.get_contractList()
    },
    // 附加合同
    addPriceList(type) {
      if (type === '回传文件') {
        this.dialogWidth = '80%'
      } else {
        this.dialogWidth = '600px'
      }
      this.loadingBtn = false
      this.titleName = type
      this.dialogShow = true
    },
    // 获取回传文件信息
    get_getAttachment(fileId) {
      this.$api.contract.getAttachment({ id: fileId }).then(res => {
        if (res.data !== null) {
          this.fileList = []
          this.fileList.push({
            name: res.data.name,
            url: res.data.address
          })
        }
      })
    },
    clickBtn(row, type) {
      switch (type) {
        case '查看':
          this.$router.push({
            name: 'contractEdit',
            params: { id: row.contract.id }
          })
          break
        case '回传文件':
          // if (row.fileId) {
          //   // this.get_getAttachment(row.fileId)
          //   this.returnFileId = row.fileId
          // }
          this.addPriceList('回传文件')
          this.contractId = row.contract.id
          break
        case '提交审核':
          this.btn_some(row, type)
          break
        case '审批流':
          this.get_contractApprove(row.contract.approvalFlowId)
          break
        case '导出':
          this.get_download([row])
          break
        case '作废':
          this.btn_some(row, type)
          break
        case '审批':
          this.$router.push({
            name: 'contractAudit',
            params: { id: row.contract.id }
          })
          break
      }
    },
    // 批量导出下拉菜单选中事件
    handleCommand(command) {
      switch (command) {
        case EXPORT_TYPE.CONTRACT_FILE:
          this.get_downloadBoth()
          break
        case EXPORT_TYPE.RETURN_FILE:
          this.batchDownloadReturn()
          break
        default:
          break
      }
    },
    // 批量导出
    batchDownloadReturn() {
      if (this.submission.length === 0) return this.$message.warning('请选择要导出的数据')
      let ids = ''
      for (let i = 0; i < this.submission.length; i++) {
        const row = this.submission[i]
        if (!row.fileId) {
          return this.$message.error('编号‘' + this.submission[i].contract.idNum + '’合同，无法执行该操作')
        }
        ids += row.contract.id + ','
      }
      ids = ids.substring(0, ids.length - 1)
      window.location.href = `${base.hall}api/hall/rest/businessmanagement/contract/contractReturn/export?ids=` + ids
    },
    get_downloadBoth() {
      if (this.submission.length === 0) return this.$message.warning('请选择要导出的数据')
      for (var i in this.submission) {
        if (this.submission[i].contract.state === 'REJECTED' || this.submission[i].contract.state === 'OBSOLETE') {
          this.$message.error(
            '编号‘' + this.submission[i].contract.idNum + '’合同，无法执行该操作'
          )
          return false
        }
      }
      this.get_download(this.submission)
    },
    // 导出、批量导出
    get_download(arr) {
      var pid = ''
      for (var i in arr) {
        pid += arr[i].contract.id + ','
      }
      pid = pid.substring(0, pid.length - 1)
      if (arr.length === 1) {
        this.get_downloadInAttachmentWay(pid)
      } else {
        this.get_downloadInStreamWay(pid)
      }
    },
    // 单个导出
    get_downloadInAttachmentWay(pid) {
      this.$api.contract.downloadInAttachmentWay({ id: pid, type: 'DOCX' }).then(res => {
        if (res.urlEncodedAddress !== '') {
          window.location.href = res.urlEncodedAddress
        } else {
          this.$message.error('导出失败')
        }
      })
    },
    // 批量导出
    get_downloadInStreamWay(ids) {
      window.location.href =
        `http://${window.location.host}${base.hall}api/hall/rest/businessmanagement/contract/downloadInStreamWay?ids=` + ids
    },
    btn_some(res, type) {
      this.$confirm(
        '您确定将合同编号为' +
          res.contract.idNum +
          '进行' +
          type +
          ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          type === '作废'
            ? this.get_contractDeleteId(res.contract.id)
            : this.get_contractsSubmit({
              id: res.contract.id,
              userId: res.contract.createBy.id
            })
        })
        .catch(() => {
        })
    },
    // 提交审核
    get_contractsSubmit(json) {
      this.$api.contract.contractsSubmit(json).then(res => {
        if (res === true) {
          this.$message.success('状态修改成功')
          this.get_contractList()
        }
      })
    },
    // 合同作废
    get_contractDeleteId(id) {
      this.$api.contract.contractDeleteId({ id: id }).then(res => {
        this.get_contractList()
        this.$message.success('操作成功')
      })
    },
    // 获取审批流
    get_contractApprove(id) {
      this.approvalFlowId = id
      this.dialogContract = true
    },
    // 表单提交
    onSubmit() {},
    // 添加
    get_priceAdd() {},
    // 修改
    get_priceEdit() {},
    // 删除
    get_priceDelete(delId) {}
  }
}
</script>
<style lang="scss" scoped>
.tooltip_new{
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  padding:0 ;
  text-align: left;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  color: #000000;
}
.tooltip_projectName{
  width: auto;
}
.dialog_new {
  position: relative;
  .el-steps {
    margin: 0 auto;
    width: 80%;
    height: 300px;
  }
  .steps_time {
    width: auto;
    position: absolute;
    top: 0;
    right: 0;
    ::v-deep.el-step {
      .el-step__head {
        display: none;
      }
    }
  }
  .footBtn {
    width: 100%;
    text-align: right;
    .el-botton {
      width: 96px;
    }
  }
}
.contract {
  .table_add {
    width: 100%;
    margin-bottom: 20px;
    .el-radio-group {
      float: right;
    }
    .dropdown {
      margin-left: 10px
    }
  }
}
.footBtn {
  width: 100%;
  margin-top:10px;
  display: inline-block;
  text-align: center;
  button {
    width: 96px;
  }
}
.el-form {
  width: 100%;
  display: inline-table;
  .el-form-item {
    ::v-deep .el-form-item__label {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
