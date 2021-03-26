<template>
  <div class="ReturnFile">
    <el-upload
      class="upload-demo"
      :action="`${base.hall}a/api/ossfile/upload`"
      :data="licenseData"
      name="file"
      :before-upload="handleLicenseBefore"
      :on-success="handleLicenseSuccess"
      :before-remove="handleRemove"
      :file-list="fileList"
      :limit="1"
      accept=".docx,.PDF,.dpf"
      :show-file-list="false"
      :disabled="returnTableData.length !== 0 || fileList.length !== 0"
    >
      <el-tooltip class="item" effect="dark" content="需先删除原有回传合同，才可重新上传文件" placement="top">
        <el-button :loading="btnLoading">选择文件</el-button>
      </el-tooltip>
      <span v-if="fileList.length === 0" class="tip">未选择文件</span>
      <span v-else class="tip">已选中{{ fileList.length }}个文件</span>
      <div slot="tip" class="el-upload__tip">
        导入文件不能超过20M，仅允许导入“pdf”或“docx”格式文件！
      </div>
    </el-upload>

    <!-- 回传文件table -->
    <div class="table-wrap">
      <el-table
        :data="returnTableData"
        style="width: 100%;"
        :header-cell-style="{
          background: '#FAFAFA',
          color: '#000000',
          marginLeft:'90px'
        }"
        border
      >
        <el-table-column label="回传合同名称">{{ fileName }}</el-table-column>
        <el-table-column label="回传人" width="200">
          <template slot-scope="scope">
            {{ scope.row.createdBy || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="回传时间" width="200" />
        <el-table-column label="操作列" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row)">下载</el-button>
            <ConfirmButton
              title="确定删除回传文件吗？"
              confirm-text="确定"
              cancel-text="取消"
              @onConfirm="del(scope.row)"
            >
              删除
            </ConfirmButton>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 应收款列表 -->
    <RowText text="应收款列表" class="rowText" />
    <div class="pay-table-wrap">
      <el-table
        :data="payTableData"
        style="width: 100%;"
        :header-cell-style="{
          background: '#FAFAFA',
          color: '#000000',
          marginLeft:'90px'
        }"
        border
      >
        <el-table-column prop="name" label="款项名称" />
        <el-table-column prop="ratio" label="付款比例" width="200" :formatter="(row) => { return row.ratio ? row.ratio + ' %' : '-  '}" />
        <el-table-column prop="amount" label="付款金额（元）" width="200" />
        <el-table-column label="应收款日期" width="200">
          <template slot="header">
            <span style="color:red">* </span>{{ `应收款日期` }}
          </template>
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.date" /> -->
            <el-date-picker
              v-model="scope.row.payDate"
              style="width:160px"
              :disabled="scope.$index !== 0"
              type="date"
              placeholder="选择日期"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" width="180" />
      </el-table>
    </div>

    <!-- footer -->
    <div class="footer">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import RowText from '@/components/rowText'
import ConfirmButton from '@/components/ConfirmButton'
import base from '@/api/base'
export default {
  components: { RowText, ConfirmButton },
  props: {
    contractId: {
      type: [String, Number],
      default: () => {
        return null
      }
    }
    // returnFileId: {
    //   type: [String, Number],
    //   default: () => {
    //     return null
    //   }
    // }
  },
  data() {
    return {
      base,
      a: [],
      fileList: [],
      licenseData: {},
      btnLoading: false,
      customerName: '', // 客户名称
      idNum: '', // 系统生成编号
      returnTableData: [], // 回传文件数据
      payTableData: [], // 收款table数据
      fileId: null // 当前回传文件id
    }
  },
  computed: {
    fileName() {
      return `${this.customerName}_${this.idNum}`
    }
  },
  watch: {
    contractId: {
      handler: function(v) {
        if (v) {
          this._returnFileInfo(v)
        }
      },
      immediate: true
    }
    // returnFileId: {
    //   handler: function(v) {
    //     this.fileId = v
    //   },
    //   immediate: true
    // }
  },
  methods: {
    handleLicenseBefore(file) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 20MB!')
      }
      this.btnLoading = true
      this.licenseData.dataId = Date.parse(new Date())
      this.licenseData.type = 'EXHHALL_CONTRACT_RETURN_DOCUMENT'
      // this.licenseData.type = 'EXHHALL_DATA_LIB_NODE'
    },
    handleLicenseSuccess(response, file, fileList) {
      if (response.data === null) {
        this.fileList = []
        this.$message.error('上传失败，请重试')
      } else {
        this.fileList = fileList
        this.fileId = response.data[0].fileId
        // this.contractId = response.data[0].fileId
        // this.$message.success('已经成功上传')
      }
      this.btnLoading = false
    },
    handleRemove() {},
    async confirm() {
      if (this.payTableData.length > 0 && !this.payTableData?.[0]?.payDate) {
        this.$message.error('请填写应收日期')
        return
      }
      let planItems = []
      if (this.payTableData.length > 0) {
        planItems = [{
          id: this.payTableData?.[0]?.id,
          payDate: moment(this.payTableData?.[0]?.payDate).format('YYYY-MM-DD HH:mm:ss')
        }]
      }
      const params = {
        contractId: this.contractId,
        fileId: this.fileId,
        planItems
      }
      console.log('params', params)
      await this._save(params)
      this.$emit('refresh')
    },
    cancel() {
      this.$emit('cancel')
    },
    download() {
      // this.$api.contract.downloadReturnFile(this.contractId)
      window.location.href = `${base.hall}api/hall/rest/businessmanagement/contract/contractReturn/export?ids=` + this.contractId
    },
    async del(row) {
      const { fileId } = row
      // 请求删除接口
      this.$api.file.deleteFile(fileId).then(async res => {
        if (res.resultCode === 0) {
          const params = {
            contractId: this.contractId,
            fileId: null
          }
          await this._save(params)
          this._returnFileInfo(this.contractId)
        }
      })
    },
    _save(params) {
      return this.$api.contract.saveReturnInfo(params)
    },
    _returnFileInfo(id) {
      this.$api.contract.returnFileInfo(id).then(res => {
        const { attachmentVO, groupList, idNum, customerName } = res
        this.returnTableData = attachmentVO ? [attachmentVO] : []
        this.payTableData = groupList?.[0]?.items || []
        this.fileId = attachmentVO?.fileId || null
        this.customerName = customerName || ''
        this.idNum = idNum || ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  .tip {
    margin-left: 10px;
    color: #888888;
  }
  .el-upload__tip {
    margin-top: 10px;
    font-size: 14px;
    color: #888888;
  }
}
.ReturnFile {
  .table-wrap {
    margin-top: 20px;
  }
  .rowText {
    margin-top: 20px;
  }
  .pay-table-wrap {
    margin-top: 20px;
  }
  .footer {
    margin-top: 40px;
    text-align: center;
  }
}
</style>
