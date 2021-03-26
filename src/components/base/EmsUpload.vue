<template>
  <div>
    <slot>
      <div class="upload-slot-head">
        <span class="tip">请上传{{ limit }}张 </span>
        <el-button v-if="exampleImgs.length > 0" type="text" @click="viewExampleImgs">查看示例图片</el-button>
      </div>
    </slot>
    <el-upload
      :action="url"
      multiple
      list-type="picture-card"
      :limit="limit"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-change="onChange"
      :on-success="onSuccess"
      :on-exceed="onExceed"
      class="smallUpload"
      :class="{ hideUpload: fileList.length >= limit }"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <i class="el-icon-plus " />
      <div slot="file" slot-scope="{ file }" class="flexCenter fullBox">
        <img class="flexCenter-img" :src="file.url">
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="showRemoveIcon"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
  </div>
</template>

<script>
import base from '@/api/base'
import axios from '@/utils/http'
import uploadMixins from '@/mixins/ems/upload'
export default {
  mixins: [uploadMixins],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    // 示例图片的数组,图片必须有url属性
    exampleImgs: {
      type: Array,
      default: () => []
    },
    uploadUrl: {
      type: String,
      default: 'a/image/upload'
    },
    deleteUrl: {
      type: String,
      default: 'a/api/image/delete'
    },
    // 隐藏删除图片按钮
    showRemoveIcon: {
      type: Boolean,
      default: true
    },
    // 允许上传图片的最大数量
    limit: {
      type: Number,
      default: 1
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    maxsize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      url: `${base.hall}${this.uploadUrl}`,
      fileList: [],
      dialogImageUrl: '',
      disabled: !false
    }
  },
  watch: {
    list() {
      this.fileList = this.list
    }
  },
  created() {
    this.fileList = this.list
  },
  methods: {
    handleRemove(file) {
      const imageId = file.response.data.imageId
      axios
        .get(`${base.hall}${this.deleteUrl}?imageId=${imageId}`)
        .then(res => {
          if (res.resultCode === 0) {
            this.$emit('deleteImageSuccess')
            this.fileList.splice(this.fileList.indexOf(file), 1)
          } else {
            this.$emit('deleteImageFail')
          }
        })
    },
    handlePictureCardPreview(file) {
      this.$viewer([{ url: file.url }])
    },
    beforeUpload(file) {
      const regLimit = /(.|\/)(jpe?g|png|gif)$/
      const isPhoto = regLimit.test(file.type)
      if (!isPhoto) {
        this.$message.error('请正确上传图片')
      }
      const maxsize = this.maxsize * 1024 * 1024
      const isLt10M = file.size < maxsize
      if (!isLt10M) {
        this.$message.error(
          `${file.name}上传图片总大小不能大于${this.maxsize}M`
        )
      }
      return isPhoto && isLt10M
    },
    onExceed(file, fileList) {
      this.$message.error(
        `图片上传错误，该资料最多上传${this.limit}张，请勿多传或漏传`
      )
    },
    onChange(file, fileList) {
      console.log(file)
      this.fileList = fileList.filter(item => {
        if (item.response && item.response.resultCode !== 0) {
          item.response.message && this.$message.error(item.response.message)
          return false
        } else {
          return item
        }
      })
      this.emitFileList()
    },
    onSuccess(response, file, fileList) {
      this.emitFileList()
    },
    emitFileList() {
      const fileList = this.fileList.map(item => {
        if (item.response && item.response.resultCode === 0) {
          return this.formatImage(item.response.data)
        } else {
          return item
        }
      })
      this.$emit('update:list', fileList)
    },
    viewExampleImgs() {
      this.$viewer(this.exampleImgs)
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadBox {
  width: 104px;
  height: 104px;
  border-radius: 2px;
  padding: 8px;
}
.fullBox {
  width: 100%;
  height: 100%;
}
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
  &-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.smallUpload {
  ::v-deep .el-upload--picture-card {
    @extend .flexCenter;
    @extend .uploadBox;
  }
}
.smallUpload {
  ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    @extend .uploadBox;
  }
}
.hideUpload {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
.upload-slot-head {
  .tip {
    color: #999;
    font-size: 14px;
    line-height: 36px;
  }
}
</style>
