<template>
  <div class="invoice">
    <el-dialog
      :title="isFlagObj.dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form v-if="isFlagObj.isApplay" ref="confirmForm" :rules="formRules" :model="formData" class="invoiceForm" label-width="120px">
        <div class="topList">
          <div class="name">申请编号：</div>
          <div class="intro">{{ invoiceInfo.applyCode }}</div>
        </div>
        <div class="topList">
          <div class="name">发票抬头：</div>
          <div class="intro">{{ invoiceInfo.invoiceTitle }}</div>
        </div>
        <div class="topList">
          <div class="name">开票金额：</div>
          <div class="intro">{{ invoiceInfo.invoiceAmount }}</div>
        </div>
        <div class="topList">
          <div class="name">开票内容：</div>
          <div class="intro">{{ invoiceInfo.invoiceContent_name }}</div>
        </div>
        <el-form-item label="发票号码：" prop="invoiceNo">
          <el-input v-model="formData.invoiceNo" maxlength="8" show-word-limit type="text" style="width:220px" />
        </el-form-item>
        <el-form-item label="开票日期：" prop="invoiceDate">
          <el-date-picker v-model="formData.invoiceDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :picker-options="pickerOptions0" style="width:220px" />
        </el-form-item>
        <el-form-item label="不含税价格：" prop="noTaxPrice">
          <el-input v-model="formData.noTaxPrice" type="text" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" style="width:220px" />
        </el-form-item>
      </el-form>
      <el-form v-else class="exportForm">
        <el-form-item v-if="!isImported">
          <el-upload
            ref="upload"
            class="upload-demo"
            accept=".xls, .xlsx"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :action="`${base.hall}api/hall/rest/invoice/import`"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :on-success="handleUploadSuccess"
          >
            <el-button slot="trigger" size="small">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">
              导入文件不能超过10M，仅允许导入“xlsx”格式文件！
            </div>
          </el-upload>
          <div class="download" @click="downloadTemplate">下载导入模板</div>
        </el-form-item>
        <div v-else class="tipMessage"><span>成功导入{{ responseText.success }}条数据，失败{{ responseText.failed }}条</span></div>
      </el-form>
      <span v-if="!isImported" slot="footer" class="dialog-footer">
        <el-button @click="cancelImport(isFlagObj.isApplay)">取 消</el-button>
        <el-button
          type="primary"
          @click="importInvioce(isFlagObj.isApplay)"
        >确定</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button v-if="responseText.failed === 0" type="primary" @click="handleClose">确定</el-button>
        <el-button v-else type="primary" @click="closeBack">导出失败记录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import base from '@/api/base'
export default {
  props: {
    // 弹窗是否显示
    dialogVisible: {
      type: Boolean,
      defualt() {
        return false
      }
    },
    invoiceInfo: { type: Object,
      default() {
        return {}
      } },
    isFlagObj: {
      type: Object,
      default() {
        return {
          isApplay: true, // 默认显示确认已开发票页面，false显示导入发票页面
          dialogTitle: '确认已开票',
          info: {
            isRight: true, // 默认显示导入发票页面，false显示反馈信息页面
            msg: '成功导入10条数据，失败0条'
          }
        }
      }
    }
  },
  data() {
    var checkNoTaxPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入不含税价格'))
      } else if (Number(value) > Number(this.invoiceInfo.invoiceAmount)) {
        callback(new Error('税额不可大于开票金额'))
      } else {
        callback()
      }
    }
    return {
      // isError: '0',
      // isErrorOk: true,
      isImported: false,
      responseText: {},
      base: base,
      formData: {
        invoiceHeaderId: '',
        invoiceNo: '',
        invoiceDate: '',
        noTaxPrice: ''
      },
      // isShowButton: true, // 默认显示取消按钮，false时不显示取消按钮
      fileList: [],
      file: '',
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6// 如果不包括今天。就是return time.getTime() > Date.now() - 24*3600*1000;
        }
      },
      formRules: {
        invoiceNo: [
          { required: true, message: '请输入发票号码', trigger: 'change' },
          { min: 8, max: 8, message: '请输入八位数发票号码', trigger: 'blur' }
        ],
        invoiceDate: [
          { required: true, message: '请选择开票日期', trigger: 'blur' }
        ],
        noTaxPrice: [
          { required: true, validator: checkNoTaxPrice, trigger: 'blur' }
        ]
      }
      // url: `http://${window.location.host}${base.hall}api/hall/rest/invoice/import`,
    }
  },
  watch: {

  },
  created() {
  },
  methods: {
    handlePreview() {

    },
    handleClose() {
      this.$emit('handleClose')
      // this.isError = '0'
    },
    importInvioce(isApplay) {
      if (isApplay) {
        // 确认已开发票
        this.$refs.confirmForm.validate(valid => {
          if (valid) {
            this.trailInvoiced()
          } else {
            this.$message.error('请按照要求填写信息')
          }
        })
      } else {
        // 导入发票
        // this.importAccount()
        // console.log('wweewwef')
        // if (this.isErrorOk) {
        this.$refs['upload'].submit()
        // } else {
        //   this.$emit('handleClose')
        // }

        // this.dialogVisible = true
        // this.isFlagObj.info.isRight = false
        // this.isShowButton = false
        // this.isFlagObj.dialogTitle = '导入反馈'
      }
    },
    cancelImport(isApplay) {
      if (isApplay) {
        // 取消申请发票
        // this.dialogVisible = false
      } else {
        // 取消导入发票
        // this.dialogVisible = false
        this.isFlagObj.info.isRight = true
        this.isFlagObj.dialogTitle = '导入发票'
      }
      this.handleClose()
    },
    closeBack() {
      // 关闭导入反馈信息
      this.$emit('handleClose')
      this.isFlagObj.info.isRight = true
      // this.isShowButton = true
      window.location.href = this.responseText.failedDetailUrl
      // this.isError = '0'
    },

    // 导入
    downloadTemplate() {
      window.location.href =
        'http://' +
        window.location.host +
        `${base.hall}api/hall/rest/invoice/template`
    },
    beforeUpload(file) {},
    handleChange(file) {
      this.file = file
    },
    handleRemove() {

    },
    importAccount() {
      this.$refs['upload'].submit()
    },
    handleUploadSuccess(response, file, fileList) {
      this.fileList = fileList
      this.responseText = response
      // if (Number(response.failed) === 0 && Number(response.success) > 0) {
      //   this.isErrorOk = true
      // } else {
      //   this.isErrorOk = false
      // }
      // this.isError = response.failed.toString()
      this.isImported = true
      this.isFlagObj.dialogTitle = '导入反馈'
    },
    trailInvoiced() {
      var time_Ok = new Date(this.formData.invoiceDate)
      const json = {
        invoiceDate: time_Ok.getTime(),
        invoiceHeaderId: this.invoiceInfo.id,
        invoiceNo: this.formData.invoiceNo,
        noTaxPrice: this.formData.noTaxPrice
      }
      this.$api.billApi.trailInvoiced(json).then(() => {
        this.$emit('handleClose')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.invoice {
  .invoiceForm {
    .topList {
      margin-bottom: 10px;
      display: flex;
    }
    // ::v-deep .el-form-item {
    //   margin-bottom: 10px;
    //   margin-left: 30px;
    // }
    // ::v-deep .el-form-item__label {
    //   width: 110px;
    // }
  }
  .exportForm {
    .el-upload__tip {
      font-size: 14px;
      color: #888888;
    }
    .download {
      font-size: 14px;
      color: #0045ff;
      cursor: pointer;
    }
  }
}
</style>
