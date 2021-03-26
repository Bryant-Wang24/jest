<template>
  <div class="import">
    <el-form label-width="180px">
      <el-form-item label="批量导入文件:">
        <el-upload
          ref="upload"
          class="upload-demo"
          accept=".xls, .xlsx"
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :action="url"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        >
          <el-button slot="trigger">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">
            导入文件不能超过10M，仅允许导入“xlsx”格式文件！
          </div>
        </el-upload>
        <div class="download" @click="downloadTemplate">下载导入模板</div>
        <el-form-item>
          <el-button
            type="primary"
            @click="importAccount"
          >上传</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <el-dialog
      title="导入反馈"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>成功导入{{ responseText.success }}条数据，失败{{ responseText.failed }}条</span>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isError" type="primary" @click="exportErrorRecords">导出失败记录</el-button>
        <el-button v-else @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import base from '@/api/base.js'
// import accountApi from '@/api/account.js'
export default {
  data() {
    return {
      fileList: [],
      isError: false,
      dialogVisible: false,
      responseText: '',
      file: '',
      url: `http://${window.location.host}${base.hall}api/hall/rest/standingBook/import`
    }
  },
  methods: {
    downloadTemplate() {
      window.location.href =
        `http://${window.location.host}${base.hall}api/hall/rest/standingBook/template`
        // `http://${window.location.host}${base.hall}api/hall/rest/standingBook/template/standing_boot_import_template.xlsx`
    },
    beforeUpload(file) {
    },
    handleChange(file) {
      this.file = file
    },
    handlePreview() {},
    handleRemove() {},
    handleClose() {},
    importAccount() {
      if (!this.file) {
        this.$message.error('请选择文件后再上传')
        return false
      }
      this.$refs['upload']
        .submit()
    },
    handleUploadSuccess(response, file, fileList) {
      this.dialogVisible = true
      this.isError = response.failed
      this.responseText = response
      this.fileList = []
    },
    handleUploadError() {
      this.dialogVisible = true
      this.isError = true
    },
    exportErrorRecords() {
      this.dialogVisible = false
      window.location.href = this.responseText.failedDetailUrl
    }
  }
}
</script>

<style lang='scss' scoped>
.import {
  padding-top: 10px;
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
</style>
