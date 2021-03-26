<template>
  <Layout :use-head="false">
    <!-- <div class="content_new"> -->
    <!-- <div class="table"> -->
    <!-- <div class="table_title">{{ priceListName }}</div> -->
    <MainTitle :title="priceListName" />
    <div class="table_add">
      <div class="btn">
        <el-button type="primary" @click="listAdd">添加明细</el-button>
        <el-button @click="get_priceListItemsImport">批量导入</el-button>
        <el-button @click="get_priceListItemsDelete">批量删除</el-button>
      </div>
      <div>
        <el-input v-model="name" style="width:320px" placeholder="请输入明细名称">
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
    </div>

    <TablePager
      ref="TablePager"
      :data="tableData"
      :total="total"
      :to="pageSize"
      :current-page="pageNum"
      :multiple-selection="submission"
      row-key="id"
      @page="handleCurrentChange"
      @selection-change="changeList"
    >
      <el-table-column :resizable="false" type="selection" :reserve-selection="true" width="55" />
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        :align="item.align || 'left'"
        show-overflow-tooltip
        :prop="item.key"
        :width="item.width"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="clickBtn(scope.row, '查看')">查看</el-button>
          <el-button type="text" @click="clickBtn(scope.row, '编辑')">编辑</el-button>
          <ConfirmButton
            :title="`确定删除${scope.row.name}吗？`"
            confirm-text="确定"
            cancel-text="取消"
            @onConfirm="handleDelete(scope.row.id)"
            @onCancel="() => {}"
          >
            删除
          </ConfirmButton>
          <!-- <el-button type="text" @click="clickBtn(scope.row, '删除')">删除</el-button> -->
        </template>
      </el-table-column>
    </TablePager>
    <DialogPage :dialog-show="dialogShow" :width="dialogWidth" :title="dialogTitle" @handleCancel="handleCancel">
      <div>
        <div v-if="dialogTitle === '导入数据'" class="import">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="`${base.hall}api/hall/rest/priceListItem/import`"
            :data="licenseData"
            name="excelFile"
            :before-upload="handleLicenseBefore"
            :on-success="handleLicenseSuccess"
            :on-error="handleUploadError"
            :on-preview="handlePreview"
            :auto-upload="false"
            :before-remove="handleRemove"
            :limit="1"
            :file-list="fileList"
            accept=".xls,.xlsx"
          >
            <el-button :loading="btnLoading">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">
              导入文件不能超过10M，仅允许导入“xlsx”格式文件！
            </div>
          </el-upload>
          <el-button size="small" type="text" @click="uploadImport">下载导入模板</el-button>
          <div class="updataBtn">
            <el-button type="primary" @click="clickDialog">确定</el-button>
            <el-button @click="dialogShow = false">取消</el-button>
          </div>

        </div>
        <div v-if="dialogTitle==='导入反馈'">
          <span>成功导入{{ responseText.success }}条数据，失败{{ responseText.failed }}条</span>
          <div class="updataBtn">
            <el-button v-if="isError!=='0'" style="width:auto" type="primary" @click="exportErrorRecords">导出失败记录</el-button>
            <el-button v-else @click="handleCancel">确定</el-button>
          </div>
        </div>
        <div v-if="dialogShowOk()" class="form_new">
          <div class="form_title">
            基础信息
            <div class="title_border" />
          </div>
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            size="small"
            :rules="rules"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="明细项名称：" prop="name">
              <el-input v-model.trim="ruleForm.name" :disabled="fromReadonly()" />
            </el-form-item>
            <el-form-item label="类型：" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择类型" :disabled="fromReadonly()">
                <WrapOption
                  v-for="(item, index) of dictList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="规格：">
              <el-input v-model.trim="ruleForm.standard" :disabled="fromReadonly()" />
            </el-form-item>
            <el-form-item label="单价：" prop="price">
              <el-input v-model="ruleForm.price" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" :disabled="fromReadonly()" />
            </el-form-item>
            <el-form-item label="计价单位：" prop="priceUnit">
              <el-select v-model="ruleForm.priceUnit" placeholder="请选择计价单位" :disabled="fromReadonly()">
                <WrapOption label="天" value="天" />
                <WrapOption label="月" value="月" />
                <WrapOption label="展期" value="展期" />
              </el-select>
            </el-form-item>
            <el-form-item label="总数量：" prop="quantity">
              <el-input v-model.number="ruleForm.quantity" :disabled="fromReadonly()" />
            </el-form-item>
            <el-form-item label="单位：" prop="quantityUnit">
              <el-input v-model.trim="ruleForm.quantityUnit" :disabled="fromReadonly()" />
            </el-form-item>
            <el-form-item label="费用性质：" prop="feeType">
              <el-select v-model="ruleForm.feeType" placeholder="请选择费用性质" :disabled="fromReadonly()">
                <WrapOption label="租赁费" value="RENT" />
                <WrapOption label="服务费" value="SERVICE" />
              </el-select>
            </el-form-item>
            <el-form-item label="默认收款账户：" prop="recipientAccountId">
              <el-select v-model="ruleForm.recipientAccountId" placeholder="请选择收款账户" :disabled="fromReadonly()">
                <!-- <WrapOption label="招商银行" :value="1" /> -->
                <WrapOption v-for="(item,index) of accountList" :key="index" :label="item.bank_name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否启用：">
              <el-radio-group
                v-model="ruleForm.enabled"
                :disabled="fromReadonly()"
              >
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input v-model="ruleForm.remark" :disabled="fromReadonly()" />
            </el-form-item>
          </el-form>
          <div class="form_title">
            补充信息
            <div class="title_border" />
          </div>
          <el-form
            ref="ruleFormK"
            :model="ruleForm"
            size="small"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="尺寸：">
              <el-input v-model="ruleForm.size" :disabled="fromReadonly()" />
            </el-form-item>
            <el-form-item label="材料：">
              <el-input
                v-model="ruleForm.material"
                :disabled="fromReadonly()"
              />
            </el-form-item>
            <el-form-item label="面积：">
              <el-input v-model="ruleForm.area" :disabled="fromReadonly()" />
            </el-form-item>
            <el-form-item label="位置：">
              <el-input
                v-model="ruleForm.position"
                :disabled="fromReadonly()"
              />
            </el-form-item>
          </el-form>
          <div v-if="dialogTitle === '查看价目表明细'" class="footBtn">
            <el-button @click="handleCancel">取消</el-button>
          </div>
          <div v-else class="footBtn">
            <el-button

              type="primary"
              :loading="btnLoading"
              @click="onSubmit"
            >确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </div>
      </div>
    </DialogPage>
    <!-- </div> -->
  </Layout>
</template>
<script>
import base from '@/api/base'
import Layout from '@/components/base/Layout'
import TablePager from '@/components/base/TablePager'
import MainTitle from '@/components/base/MainTitle'
import ConfirmButton from '@/components/ConfirmButton'
// import TablePage from '@/components/table/table'
import DialogPage from '@/components/dialog/dialog'
// import PaginationPage from '@/components/Pagination/index'
import WrapOption from '@/components/base/WrapOption'
export default {
  name: 'Detailed',
  components: {
    // TablePage,
    ConfirmButton,
    DialogPage,
    WrapOption,
    // PaginationPage,
    Layout, TablePager, MainTitle },
  data() {
    return {
      base: base, // 默认请求路径
      tableLoading: false,
      innerVisible: false,
      name: '',
      priceListId: '', // 路由id
      tabHeight: document.documentElement.clientHeight - 300,
      submission: [], // 表格选中的数据
      total: 0,
      pageSize: 10,
      pageNum: 1,
      tableData: [],
      fileList: [],
      tableHeader: [
        // { type: 'selection', width: '50' },
        { key: 'name', label: '明细项名称' },
        { key: 'types', label: '类型' },
        { key: 'standard', label: '规格', width: 120 },
        { key: 'price', label: '单价', align: 'right', width: 120 },
        { key: 'priceUnit', label: '计价单位', width: 100 },
        { key: 'quantity', label: '总数量/单位' },
        { key: 'feeTypes', label: '费用性质', width: 100 },
        { key: 'enableds', label: '是否启用', width: 100 },
        { key: 'recipientAccountName', label: '默认收款账号', width: 240 }
      ],
      dialogShow: false, // 弹窗开启关闭
      dialogWidth: '',
      dialogTitle: '', // 弹窗标题
      ruleForm: {
        priceListId: '', // 价目表id
        name: '',
        type: '',
        standard: '',
        price: '',
        priceUnit: '',
        quantity: '',
        quantityUnit: '',
        feeType: '',
        recipientAccountId: '',
        enabled: '',
        remark: '',
        size: '',
        material: '',
        area: '',
        position: ''
      },
      rules: {
        price: [
          { required: true, message: '请输入有效值', trigger: 'blur' }
          // { validator: this.checkNum, trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入有效值', trigger: 'blur' },
          { validator: this.checkNum, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        priceUnit: [
          { required: true, message: '请选择计价单位', trigger: 'change' }
        ],
        quantityUnit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          { validator: this.checkString, trigger: 'blur' }
        ],
        feeType: [{ required: true, message: '请选择', trigger: 'change' }],
        recipientAccountId: [
          { required: true, message: '请选择收款账号', trigger: 'change' }
        ]
      },
      btnLoading: false, // 表单防刷loading
      priceListName: '',
      licenseData: {
        // 默认上传参数
        priceListId: ''
      },
      accountList: [],
      dictList: [],
      responseText: '',
      isError: ''
    }
  },
  watch: {
    $route() {
      this.get_router_id()
    },
    name() {
      clearTimeout(this.timer) // 清除延迟执行
      this.timer = setTimeout(() => {
        // 设置延迟执行
        this.get_priceListItem()
      }, 800)
    }
  },
  created() {
    this.get_router_id()
    // this.get_priceListItem()
    // this.set_accountList()
  },
  methods: {
    dialogShowOk() {
      if (this.dialogTitle === '编辑' || this.dialogTitle === '查看价目表明细' || this.dialogTitle === '添加明细') return true
    },
    exportErrorRecords() {
      window.location.href = this.responseText.failedDetailUrl
      this.dialogShow = false
      this.get_priceListItem()
    },
    clickDialog() {
      console.log(this.fileList)
      this.$refs.upload.submit()
    },
    handleCancel() {
      this.dialogShow = false
      this.btnLoading = false

      if (this.dialogTitle === '导入数据' || this.dialogTitle === '导入反馈') {
        this.get_priceListItem()
      } else {
        this.ruleForm = {}
        this.$refs.ruleForm.resetFields()
      }
    },
    fromReadonly() {
      return this.dialogTitle === '查看价目表明细'
    },
    // 银行账号
    set_accountList() {
      this.$api.priceList.accountList({ number: '' }).then(res => {
        if (res) {
          for (var i in res) {
            res[i]['bank_name'] = '【' + res[i].abbreviation + '】' + res[i].name
          }
          this.accountList = res
        }
      })
    },
    // 执照上传前
    handleLicenseBefore(file) {
      this.btnLoading = true
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message.error('上传文件只能是.XLS或.XLSX格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      this.licenseData.priceListId = this.priceListId
    },
    handleUploadError() {
      // console.log(err)
      // const obj = JSON.stringify(err)
      // const kk = JSON.parse(err)
      // console.log(kk)
      // this.$message.error(err)
      this.fileList = []
      this.btnLoading = false
    },
    handleLicenseSuccess(response, file, fileList) {
      this.fileList = []
      this.dialogTitle = '导入反馈'
      this.responseText = response
      this.isError = response.failed.toString()
      // this.btnLoading = false
      // this.$message.success('已经成功上传' + response.operatedCount + '条数据')
      // this.get_priceListItem()
    },

    // 点击文件列表中已上传的文件时，预览
    handlePreview(file) {
      this.preview = file?.response?.data[0]?.address
      this.dialogVisible = true
    },
    // 文件列表移除文件时的钩子
    handleRemove() {
      console.log('gggg')
    },
    //
    uploadImport() {
      // console.log('http://' + window.location.host + `${base}static/hall/template/价目明细导入模版.xlsx`)
      window.location.href =
        'http://' +
        window.location.host +
        // `${base.hall}static/hall/template/import_price_item_template.xlsx`
        `${base.hall}api/hall/rest/priceListItem/template`
    },
    // 导入
    get_priceListItemsImport() {
      this.dialogTitle = '导入数据'
      this.dialogWidth = '35%'
      this.dialogShow = true
      this.btnLoading = false
    },
    ruleForm_num() {
      this.ruleForm = {}
    },
    get_router_id() {
      this.set_accountList()
      // this.get_priceId()
      this.get_dictList()
      this.priceListId = this.$route.params.id
      this.priceListName = this.$route.query.name
      // this.get_priceListItem()
    },
    //
    get_dictList() {
      this.$api.dict.getDictList('HALL_PRICE_ITEM_TYPE').then(res => {
        if (res) {
          this.dictList = res
          this.get_priceListItem()
        }
      })
    },
    get_dictList_name(val) {
      for (var i in this.dictList) {
        if (this.dictList[i].value === val) {
          return this.dictList[i].label
        }
      }
    },
    get_accountList(val) {
      for (var i in this.accountList) {
        if (this.accountList[i].id === val) {
          return this.accountList[i].bank_name
        }
      }
    },
    // 价目表明细表格分页查询
    get_priceListItem() {
      this.tableLoading = true
      const json = {
        priceListId: Number(this.priceListId),
        inTypes: [], // 暂时不传
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.name === '' ? '' : (json['fuzzyName'] = this.name)
      this.$api.priceList.priceListItem(json).then(res => {
        if (res) {
          this.tableLoading = false
          var list = res.list
          for (var i in list) {
            list[i]['enableds'] = list[i].enabled === true ? '是' : '否'
            list[i]['feeTypes'] =
              list[i].feeType === 'RENT' ? '租赁费' : '服务费'
            list[i]['types'] = list[i]['types'] = this.get_dictList_name(list[i].type)
            list[i]['recipientAccountName'] = this.get_accountList(list[i].recipientAccountId)
          }
          this.tableData = list
          this.pageNum = res.pageNum
          this.pageSize = res.pageSize
          this.total = res.total
        }
      })
    },
    handleDelete(id) {
      this.priceListItemDelete(id)
    },
    // 表格操作
    clickBtn(row, type) {
      this.ruleForm = {}
      this.ruleForm.priceListId = this.priceListId
      var obj = JSON.stringify(row)
      var res = JSON.parse(obj)
      this.dialogWidth = '70%'
      this.ruleForm = res
      switch (type) {
        case '查看':
          this.dialogTitle = '查看价目表明细'
          this.dialogShow = true
          break
        case '编辑':
          this.dialogTitle = '编辑'
          this.dialogShow = true
          break
        // case '删除':
        //   this.$confirm(
        //     '此操作将永久删除' + res.name + '的数据' + ', 是否继续?',
        //     '提示',
        //     {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }
        //   )
        //     .then(() => {
        //       this.get_priceListItemDelete(res.id)
        //     })
        //     .catch(() => {
        //     })
        //   break
      }
    },
    handleCurrentChange({ currentPage }) {
      this.pageNum = currentPage
      this.get_priceListItem()
    },
    // 添加
    listAdd() {
      this.btnLoading = false
      this.dialogTitle = '添加明细'
      this.dialogWidth = '70%'
      this.ruleForm = {
        id: '',
        enabled: true
      }
      this.ruleForm.priceListId = this.priceListId
      this.dialogShow = true
    },
    // 价目项 - 修改提交
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.ruleForm.id !== ''
            ? this.get_priceListItemEdit()
            : this.getPriceListItemAdd()
        } else {
          this.btnLoading = false
        }
      })
    },
    // 添加
    getPriceListItemAdd() {
      this.$api.priceList.priceListItemAdd(this.ruleForm).then(res => {
        if (res) {
          this.btnLoading = false
          this.dialogShow = false
          this.$message.success('添加成功！')
          this.get_priceListItem()
          this.ruleForm = {}
          this.$refs.ruleForm.resetFields()
        }
      })
    },
    // 修改
    get_priceListItemEdit() {
      const { id, name, type, standard, price, priceUnit, quantity, quantityUnit, feeType, recipientAccountId, enabled, remark, size, material, area, position } = this.ruleForm
      const json = {
        id: id,
        priceListId: this.priceListId, // 价目表id
        name: name,
        type: type,
        standard: standard,
        price: price,
        priceUnit: priceUnit,
        quantity: quantity,
        quantityUnit: quantityUnit,
        feeType: feeType,
        recipientAccountId: recipientAccountId,
        enabled: enabled,
        remark: remark,
        size: size,
        material: material,
        area: area,
        position: position
      }
      this.$api.priceList.priceListItemEdit(json).then(res => {
        if (res) {
          this.btnLoading = false
          this.dialogShow = false
          this.$message.success('修改成功！')
          this.get_priceListItem()
          this.ruleForm = {}
          this.$refs.ruleForm.resetFields()
        }
      })
    },
    // 表格选中的数据集合
    changeList(val) {
      this.submission = val
    },
    // 单体删除
    priceListItemDelete(id) {
      this.$api.priceList.priceListItemDelete({ id }).then(res => {
        if (res) {
          this.tableData.length === 1 && this.pageNum !== 1
            ? this.pageNum--
            : ''
          this.$message.success('删除成功！')
          this.get_priceListItem()
          //
        }
      })
    },
    // 批量删除
    get_priceListItemsDelete() {
      if (this.submission.length === 0) {
        return this.$message.warning('请选择要删除的数据')
      }
      var arr = JSON.stringify(this.submission)
      var list = JSON.parse(arr)
      var ids = ''
      for (var i in list) {
        ids += 'ids=' + list[i].id + '&'
      }
      this.$confirm('此操作将永久删除的选中的数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.priceList.priceListItemsDelete({ id: ids }).then(res => {
          if (res) {
            this.$message.success('删除成功！')
            // this.pageNum = 1;
            this.get_priceListItem()
          }
        })
      })
        .catch(() => {

        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.import {
  width: 100%;
  padding-left: 50px;
  box-sizing: border-box;
}
// .table {
//   margin-top: 16px;
//   width: 100%;
//   padding: 24px;
//   box-sizing: border-box;
//   background: white;
  .pagination {
    margin-top: 24px;
  }
  .table_title {
    width: 100%;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 23px;
  }
  .table_add {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
// }
.form_new {
  .form_title {
    width: 100%;
    background: #fafafa;
    padding: 9px 4px 9px 15px;
    box-sizing: border-box;
    display: inline-table;
    height: 22px;
    line-height: 22px;
    position: relative;
    margin-bottom: 24px;
    .title_border {
      width: 4px;
      height: 16px;
      background: $--custom--color--primary;
      position: absolute;
      left: 5px;
      top: 11px;
    }
  }
  .el-form {
    width: 100%;
    display: inline-table;
    .el-form-item {
      width: 50%;
      float: left;
      ::v-deep .el-form-item__label {
        color: #000000;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
.footBtn {
  width: 100%;
  margin-top: 73px;
  display: inline-block;
  text-align: center;
  button {
    width: 96px;
  }
}
.updataBtn{
  margin-top: 36px;
  width: 100%;
  text-align: right;
  .el-button{
    width: 96px;
  }
}
</style>
