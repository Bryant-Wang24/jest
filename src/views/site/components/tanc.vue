<template>
  <div class="site">
    <!-- 弹出框 -->
    <el-dialog title="添加场地" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="202px">
        <el-form-item label="场地名称 :" :label-width="formLabelWidth">
          <el-input v-model="form.siteName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="场地类型 :" :label-width="formLabelWidth">
          <el-select v-model="form.siteType" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸说明 :" :label-width="formLabelWidth">
          <el-input v-model="form.siteSize" autocomplete="off" />
        </el-form-item>
        <el-form-item label="位置 :" :label-width="formLabelWidth">
          <el-input v-model="form.siteLoca" autocomplete="off" />
        </el-form-item>
        <el-form-item label="面积 :" :label-width="formLabelWidth">
          <el-input v-model="form.siteArea" autocomplete="off" />
        </el-form-item>
        <el-form-item label="附件图片 :" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button>选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否启用 :" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="备注 :" :label-width="formLabelWidth">
          <el-input v-model="form.desc" type="textarea" placeholder="(选填)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn1" @click="dialogFormVisible = false">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        dialogFormVisible: false,
        siteName: '',
        siteType: '',
        siteSize: '',
        siteLoca: '',
        siteArea: '',
        radio: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 800px;
  height: 691px;
  .el-dialog__header {
    padding: 24px;
    padding-bottom: 32px;
    .el-dialog__title {
      width: 72px;
      height: 25px;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 25px;
      color: #000000;
      opacity: 1;
    }
    .el-dialog__headerbtn {
      width: 16px;
      height: 16px;
      font-size: 16px;
      opacity: 1;
      position: absolute;
      top: 20px;
      right: 24px;
    }
  }
  .el-dialog__body {
    padding: 0;
    .el-form {
      .el-form-item {
        margin-bottom: 16px;
        .el-form-item__label {
          width: 202px !important;
          padding: 0;
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          margin-right: 12px;
          color: #000;
        }
        .el-input--medium {
          width: 400px;
          height: 34px;
          background: #ffffff;
          opacity: 1;
          border-radius: 2px;
        }
        .el-upload {
          width: 96px;
          height: 32px;
          background: #ffffff;
          border: 1px solid #cccccc;
          opacity: 1;
          border-radius: 2px;
          .el-button {
            width: 100%;
            height: 100%;
            border: none;
          }
        }
      }
    }
  }
}

// ::v-deep .dialog-footer {
//   text-align: center;
//   .el-button {
//     width: 96px;
//     height: 32px;
//     text-align: center;
//     opacity: 1;
//     border-radius: 2px;
//   }
// }
</style>
