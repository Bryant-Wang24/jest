<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">
    <!-- 搜索组件 -->
    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />

    <MainTitle title="场地管理" />
    <div class="table-btn">
      <el-button type="primary" @click="addBtn">添加场地</el-button>
      <el-button class="myBtn" @click="clickBtn('','IMPORT')">批量导入</el-button>
    </div>
    <TablePager
      ref="TablePager"
      v-loading="tableLoading"
      :data="tableData"
      :total="total"
      :to="to"
      :current-page="pageNum"
      @page="handleCurrentChange"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :prop="item.key"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="clickBtn(scope.row,'VIEW')">查看</el-button>
          <el-button type="text" @click="clickBtn(scope.row,'EDIT')">编辑</el-button>
          <el-button type="text" @click="clickBtn(scope.row,'DELETE')">删除</el-button>
        </template>
      </el-table-column>
    </TablePager>

    <!-- 弹框组件 -->
    <el-dialog
      :visible="dialogShow"
      width="800px"
      :title="dialogTitle"
      :before-close="handleCancel"
      @close="resetFields"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="180px"
        class="demo-ruleForm"
        :disabled="dialogTitle==='查看详情'"
      >
        <el-form-item label="场地名称 :" prop="siteName">
          <el-input v-model.trim="ruleForm.siteName" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="场地类型 :" prop="siteType">
          <el-select v-model="ruleForm.siteType" placeholder="请选择场地类型">
            <WrapOption v-for="item in SITE_FILTER_TYPE" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸说明 :">
          <el-input v-model="ruleForm.siteSize" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="位置 :">
          <el-input v-model="ruleForm.siteLocation" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="面积 :">
          <el-input v-model="ruleForm.siteArea" autocomplete="off" placeholder="请输入" @keyup.native="ruleForm.siteArea = limitNumberInput(ruleForm.siteArea)" />
        </el-form-item>
        <el-form-item label="附件图片 :">
          <div class="myUpload" />
          <el-upload
            v-if="dialogTitle!=='查看详情'"
            ref="imgUpload"
            class="upload-demo"
            :action="`${base.hall}a/api/ossImage/upload`"
            :data="siteData"
            :on-success="uploadImgSuccess"
            :before-upload="uploadBefore"
            :on-error="uploadImgError"
            :file-list="fileImgList"
            :on-remove="remove"
            list-type="picture"
            accept=".jpg, .jpeg, .png"
          >
            <el-button>选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <div v-else class="imgList">
            <div v-if="fileImgList.length>0" class="fileList_is">
              <div v-for="(item,index) of fileImgList" :key="index">
                <img :src="item.url" alt>
              </div>
            </div>
            <div v-else class="fileList_is">暂无附件图片</div>
          </div>
        </el-form-item>
        <el-form-item label="是否启用 :">
          <el-radio-group v-model="ruleForm.enable">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注 :">
          <el-input v-model="ruleForm.remarks" type="textarea" placeholder="(选填)" />
        </el-form-item>
      </el-form>
      <div v-if="dialogTitle === '查看详情'" class="footBtn">
        <el-button @click="closeSite">返回</el-button>
      </div>
      <div v-else class="footBtn" :loading="btnLoading">
        <el-button type="primary" @click="confirmBtn">确定</el-button>
        <el-button @click="dialogShow=false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 批量导入弹框 -->
    <el-dialog :visible.sync="toDialog" title="导入数据" width="600px" class="toDialog">
      <el-upload
        ref="upload"
        :action="`${base.hall}api/hall/rest/site/import`"
        class="upload-demo"
        :data="licenseData"
        :before-upload="handleLicenseBefore"
        :on-success="handleLicenseSuccess"
        :on-error="handleUploadError"
        :auto-upload="autoUpload"
        :limit="1"
        :file-list="templateFileList"
        accept=".xls, .xlsx"
      >
        <el-button>选择文件</el-button>
        <div slot="tip" class="el-upload__tip">导入文件不能超过10M,仅允许导入"xlsx"格式文件!</div>
      </el-upload>
      <el-button type="text" @click="get_templateSite">下载导入模板</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toDialog = false">取 消</el-button>
        <el-button type="primary" @click=" clickDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入反馈"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>成功导入{{ responseText.success }}条数据，失败{{ responseText.failed }}条</span>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isError!=='0'" type="primary" @click="exportErrorRecords">导出失败记录</el-button>
        <el-button v-else @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </Layout>
</template>

<script>
import base from '@/api/base'
import Layout from '@/components/base/Layout'
// 搜索组件
import FilterForm from '@/components/FilterForm/FilterForm2'
// 表格组件
// import TablePage from '@/components/table/table'
import TablePager from '@/components/base/TablePager'
// 弹框组件
// import DialogPage from '@/components/dialog/dialog'
import { SITE_FILTER_TYPE } from '@/common/site'
import MainTitle from '@/components/base/MainTitle'
import { limitNumberInput } from '@/utils/common'
import WrapOption from '@/components/base/WrapOption'
// import { string } from 'jszip/lib/support'
export default {
  name: 'Site',
  components: {
    Layout,
    FilterForm,
    TablePager,
    // TablePage,
    MainTitle,
    WrapOption
    // DialogPage
  },
  data() {
    return {
      SITE_FILTER_TYPE,
      isError: '',
      dialogVisible: false,
      responseText: '',
      enabled: '',
      fuzzyName: '',
      srcImg: [],
      height: 300,
      tableLoading: false, // loading加载
      btnLoading: false, // 表单防刷
      // 图片ID数组
      // imageIDs: [],
      // // 上传图片的url
      RULimg: [], // 图片上传数据
      // 上传模板状态
      autoUpload: false,
      base: base, // 默认路劲
      licenseData: {
        // 默认上传参数
        // priceListId: '',
        'Content-Type': 'multipart/form-data'
      },
      // 上传图片的额外参数
      siteData: {
        dataId: '',
        type: 'CUSTOMER_ATTACHMENT'
      },
      // 上传模板的文件列表
      fileList: [],
      // 上传图片的文件列表
      fileImgList: [],
      // 上传模板列表
      templateFileList: [],
      // 当前页
      pageNum: 1,
      // 每页返回数据的数量
      pageSize: 10,
      // 总条目数
      total: 0,
      // 当前页

      // 每页显示个数
      to: 10,
      enabledList: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 0,
          label: '否'
        }
      ],
      // 表格数据
      tableData: [],
      // 表头数组
      tableHeader: [
        { label: '场地编号', key: 'siteNumber' },
        { label: '场地名称', key: 'siteName' },
        { label: '场地类型', key: 'siteTypes' },
        { label: '尺寸说明', key: 'siteSize' },
        { label: '位置', key: 'siteLocation' },
        { label: '面积', key: 'siteArea' },
        { label: '是否启用', key: 'enables' },
        { label: '备注', key: 'remarks' }
      ],
      // 弹窗开启关闭
      dialogShow: false,
      // 弹窗标题
      dialogTitle: '',
      // 添加场地弹窗数据
      ruleForm: {
        id: '',
        siteNumber: '',
        siteName: '',
        siteType: '',
        siteSize: '',
        siteLocation: '',
        siteArea: '',
        attachImages: [],
        remarks: '',
        enable: 0
      },
      // 获取场地列表数据
      getSite: {
        siteNumber: null,
        siteName: null,
        siteType: null,
        enable: null
      },
      // 表单验证
      rules: {
        siteName: [
          { required: true, message: '请输入场地名称', trigger: 'blur' }
        ],
        siteType: [
          { required: true, message: '请选择场地类型', trigger: 'change' }
        ]
      },
      uploadList: [], // 图片上传历史记录
      uploadListOk: [], // 最终确定上次图片数据
      // 导入弹框开启关闭
      toDialog: false,
      // 选中文件状态
      toText: '未选中文件',
      filterParams: {}
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'siteName', label: '场地名称' },
          { value: 'siteNumber', label: '场地编号' }
        ],
        filterKeys: [
          { value: 'enable', label: '是否启用', children: this.enabledList },
          { value: 'siteType', label: '场地类型', children: SITE_FILTER_TYPE }
        ]
      }
    }
  },
  created() {
    this.site_list()
  },
  methods: {
    limitNumberInput(v) {
      return limitNumberInput(v)
    },
    exportErrorRecords() {
      this.dialogVisible = false
      window.location.href = this.responseText.failedDetailUrl
    },
    handleClose() {
      this.dialogVisible = false
    },
    resetFields() {
      console.log('resetFields')
      this.$refs.ruleForm.resetFields()
    },
    // 搜索按钮
    submitForm(form) {
      this.pageNum = 1
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.site_list()
    },
    // 重置按钮
    handleReset() {
      this.pageNum = 1
      this.filterParams = {}
      this.site_list()
      // 清除筛选,重新请求数据
    },
    // 分页
    handleCurrentChange({ currentPage }) {
      this.pageNum = currentPage
      this.site_list()
    },
    // 上传模板确定按钮
    clickDialog() {
      this.toDialog = false
      this.$refs.upload.submit()
      // this.$refs.upload.clearFiles()
      // setTimeout(() => {
      //   this.site_list()
      // }, 500)
    },
    // 图片上传之前
    uploadBefore() {
      this.siteData.dataId = new Date().getTime()
    },
    // 删除图片
    remove(file, fileList) {
      this.uploadListOk = fileList
      this.fileImgList = fileList
    },
    // 上传模板之前
    handleLicenseBefore(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message.error('上传文件只能是.XLS或.XLSX格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传模板大小不能超过 10MB!')
      }
      // this.licenseData.priceListId = this.priceListId
    },
    // 上传模板成功时
    handleLicenseSuccess(response) {
      this.responseText = response
      this.isError = response.failed.toString()
      this.dialogVisible = true
      this.site_list()
      // this.$message.success('导入成功')
    },
    // 上传模板失败
    handleUploadError() {
      // console.log('shibai')
      // console.log(JSON.parse(JSON.stringify(err)))
      // this.$message.error('模板数据错误')
    },
    // 上传图片成功
    uploadImgSuccess(response, file, fileList) {
      this.uploadListOk = []
      this.uploadListOk = fileList
    },
    // 上传图片失败
    uploadImgError() {
      // console.log('上传失败')
      // this.fileImgList = []
      this.$message.error('上传失败，请重试')
      // // console.log('上传图片失败')
    },
    // 下载模板
    get_templateSite() {
      window.location.href =
        'http://' +
        window.location.host +
        `${base.hall}api/hall/rest/site/template`
    },
    // 获取场地列表
    site_list() {
      const json = {
        ...this.filterParams,
        pageNo: this.pageNum,
        pageSize: 10
      }
      this.$api.siteList.getSite(json).then((res) => {
        if (res) {
          this.tableLoading = false
          var list = res.list
          for (var i in list) {
            if (list[i].siteType === null) {
              list[i]['siteTypes'] = ''
            } else {
              list[i]['siteTypes'] =
              list[i].siteType === 'PAVILION'
                ? '展馆'
                : list[i].siteType === 'AUDITORIUM'
                  ? '会议厅'
                  : list[i].siteType === 'ADVERTISEMENT' ? '广告位' : list[i].siteType === 'FOOD' ? '美食广场' : list[i].siteType === 'STREET' ? '商业街' : '其它'
            }

            list[i]['enables'] = list[i].enable === 1 ? '是' : '否'
          }
          this.tableData = list
          this.total = res.total
          this.pageNum = res.pageNum
        }
      })
    },
    // 添加按钮改变弹窗
    addBtn() {
      this.fileImgList = []
      this.dialogTitle = '添加场地'
      this.ruleForm.id = ''
      this.ruleForm.siteNumber = ''
      this.ruleForm.siteName = ''
      this.ruleForm.siteType = ''
      this.ruleForm.siteSize = ''
      this.ruleForm.siteLocation = ''
      this.ruleForm.siteArea = ''
      this.ruleForm.attachImages = []
      this.ruleForm.remarks = ''
      this.ruleForm.enable = 0
      this.fileImgList = []
      this.uploadListOk = []
      this.dialogShow = true
    },
    // 查看详情的关闭按钮
    closeSite() {
      this.dialogShow = false
      this.ruleForm = {}
    },
    // 弹窗组件右上角关闭按钮
    handleCancel() {
      this.dialogShow = false
      this.ruleForm = {}
    },
    // 图片数据整合
    imgOk() {
      var attachImages = []
      console.log(this.uploadListOk)
      for (var i in this.uploadListOk) {
        attachImages.push(this.uploadListOk[i].response.data[0].imageId)
      }
      return attachImages
    },
    // 添加用户
    addSiteNew() {
      const rule = {
        siteName: this.ruleForm.siteName,
        siteType: this.ruleForm.siteType,
        siteSize: this.ruleForm.siteSize,
        siteLocation: this.ruleForm.siteLocation,
        siteArea: this.ruleForm.siteArea,
        attachImages: this.imgOk(),
        remarks: this.ruleForm.remarks,
        enable: this.ruleForm.enable
      }
      // console.log(rule)
      this.$api.siteList.addSite(rule).then((res) => {
        if (res) {
          this.btnLoading = false
          this.dialogShow = false
          this.$message.success('添加成功！')
          this.site_list()
        }
      })
    },
    // 确定按钮判断
    confirmBtn() {
      this.btnLoading = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.id === '' ? this.addSiteNew() : this.editSite()
        }
      })
    },
    // 查看、编辑获取图片
    get_fileImgList(str) {
      console.log(str)
      var strs = []
      strs = str?.split(',')
      console.log(strs)
      for (var i in strs) {
        this.push_fileImgList(strs[i])
      }
    },
    push_fileImgList(id) {
      this.$api.siteList.tupianID(id).then((res) => {
        if (res.data !== null) {
          this.fileImgList.push({
            name: res.data.name,
            url: res.data.address,
            response: {
              data: [{
                imageId: res.data.imageId
              }]
            }
          })
        } else {
          return false
        }
      })
    },
    // 弹框类型按钮
    clickBtn(row, type) {
      const obj = JSON.stringify(row)
      const res = JSON.parse(obj)
      this.ruleForm = {}
      this.fileImgList = []
      switch (type) {
        case 'VIEW':
          this.dialogTitle = '查看详情'
          this.dialogShow = true
          this.ruleForm = res
          this.get_fileImgList(res.attachImage)
          this.uploadListOk = this.fileImgList
          break
        case 'EDIT':
          this.dialogTitle = '编辑场地'
          this.dialogShow = true
          this.ruleForm = res
          this.get_fileImgList(res.attachImage)
          this.uploadListOk = this.fileImgList
          console.log(this.uploadListOk)
          break
        case 'DELETE':
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteSite(row.id)
            })
            .catch(() => {

            })
          break
        case 'IMPORT':
          this.toDialog = true
          this.templateFileList = []
          break
      }
    },
    // 删除
    deleteSite(ids) {
      const id = ids
      this.$api.siteList.deleteSite(id).then((res) => {
        (this.tableData.length === 1 && this.pageNum !== 1) ? this.pageNum-- : ''
        this.$message.success('删除成功')
        this.site_list()
      })
    },

    // 修改
    editSite() {
      const json = {
        siteName: this.ruleForm.siteName,
        id: this.ruleForm.id,
        siteType: this.ruleForm.siteType,
        siteSize: this.ruleForm.siteSize,
        siteLocation: this.ruleForm.siteLocation,
        siteArea: this.ruleForm.siteArea,
        attachImages: this.imgOk(),
        remarks: this.ruleForm.remarks,
        enable: this.ruleForm.enable
      }
      this.$api.siteList.editSite(json).then((res) => {
        if (res) {
          this.btnLoading = false
          this.dialogShow = false
          this.$message.success('修改成功！')
          this.site_list()
        }
      })
      // console.log(id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.imgList {
  display: inline-table;
  .fileList_is {
    div {
      width: 96px;
      height: 64px;
      margin-right: 6px;
      float: left;
      border: 1px solid #eeeeee;
      border-radius: 2px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
#site {
  padding: 16px;
  .container {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #ffffff;
  }
  .table {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    background: white;
    display: inline-table;
    // .table-title {
    //   width: 100%;
    //   font-size: 18px;
    //   line-height: 25px;
    //   font-family: PingFang SC;
    //   font-weight: 500;
    //   color: #000;
    //   margin-bottom: 23px;
    // }
    .table-btn {
      width: 100%;
      margin-bottom: 20px;
      .el-button--primary {
        background: $--custom--color--primary;
        border: 0;
      }
      .el-button + .el-button {
        margin-left: 20px;
      }
    }
  }
  .el-form-item {
    margin-bottom: 20px;
    .el-input--medium {
      width: 400px;
      height: 34px;
      background: #ffffff;
      opacity: 1;
      border-radius: 2px;
    }
    .el-select {
      width: 400px;
      height: 34px;
      background: #ffffff;
      opacity: 1;
      border-radius: 2px;
    }
  }
  .footBtn {
    width: 100%;
    display: inline-block;
    text-align: center;
    margin-top: 38px;
    button {
      width: 96px;
    }
    .el-button--primary {
      background: $--custom--color--primary;
      border: 0;
    }
  }
  ::v-deep .toDialog > .el-dialog > .el-dialog__body {
    border-top: 1px solid #eee;
    padding-left: 88px;
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .uploadImg {
    display: block;
    width: 120px;
    height: 80px;
  }
}
</style>
