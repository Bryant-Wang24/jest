<template>
  <div>
    <ElUpload
      ref="upload"
      class="upload"
      :disabled="disabled"
      :action="`${base.hall}${uploadUrl}`"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-success="onSuccess"
      :on-error="onError"
      :on-change="onChange"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :data="uploadData"
      :multiple="multiple"
      :show-file-list="showFileList"
      :limit="limit"
      :on-exceed="onExceed"
      :file-list="fileList"
      :list-type="listType"
      :on-progress="onProgress"
    >
      <!-- <slot v-if="listType === 'text'"> -->
      <el-button v-if="listType === LIST_TYPE['text']" :disabled="disabled" :size="buttonSize" type="primary">{{ buttonText }}</el-button>

      <i v-if="listType === LIST_TYPE['picture-card']" slot="default" class="el-icon-plus" />
      <div v-if="listType === LIST_TYPE['picture-card']" slot="file" slot-scope="scope">
        <img class="el-upload-list__item-thumbnail" :src="scope.file.url || scope.file.address" alt="">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="onPreview(scope.file)">
            <i class="el-icon-zoom-in" />
          </span>
          <span v-if="isDelete" class="el-upload-list__item-delete" @click="handleRemove(scope)">
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
      <!-- </slot> -->
      <div slot="tip" class="el-upload__tip">
        <span v-if="accept">仅支持{{ accept }}格式 </span>
        <span v-if="limit">最多上传{{ limit }}个 </span>
        <span v-if="size">每个文件不超过{{ bytesToSize(size) }}</span>
      </div>
    </ElUpload>

    <transition name="el-fade-in" @after-leave="afterLeave">
      <template v-if="showProgressFloat">
        <div v-show="progressVisible" class="uploadProgressBox">
          <ElCard class="box-card">
            <div slot="header" class="clearfix">
              <span>文件上传</span>
              <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="closeProgressFloat" />
            </div>
            <div v-for="v in pendingObject" :key="v.uid" class="item">
              <span>{{ v.name }}</span>
              <ElProgress
                :percentage="v.percentage"
                :color="PROGRESS_COLOR[v.progressStatus]"
                :status="PROGRESS[v.progressStatus]"
              />
            </div>
          </ElCard>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import base from '@/api/base'
import axios from '@/utils/http'
import { bytesToSize, randomNDigits } from '@/utils/common'
import { MIME } from '@/common/global'

const LIST_TYPE = {
  'text': 'text',
  'picture': 'picture',
  'picture-card': 'picture-card'
}

const PROGRESS = {
  pending: 'exception',
  success: 'success',
  fail: 'exception'
}
const PROGRESS_COLOR = {
  pending: '#67c23a',
  success: '#67c23a',
  fail: '#f56c6c'
}

export default {
  props: {
    buttonText: {
      type: String,
      default: () => '点击上传'
    },
    buttonSize: {
      type: String,
      default: () => 'small'
    },
    uploadUrl: { // 请求api地址
      type: String,
      default: () => 'a/api/ossImage/upload'
    },
    deleteUrl: {
      type: String,
      default: () => 'a/api/ossImage/'
    },
    preview: { // 是否启用预览
      type: Boolean,
      default: () => true
    },
    showFileList: { // 是否显示已上传文件列表
      type: Boolean,
      default: () => true
    },
    showProgressFloat: { // 是否显示已上传文件列表
      type: Boolean,
      default: () => false
    },
    tip: { // tip提示
      type: String,
      default: () => ''
    },
    data: { // 参数
      type: Object,
      default: () => {}
    },
    isSyncMultiple: { // 多选时是否 等待多个文件上传完在执行对应钩子
      type: Boolean,
      default: () => false
    },
    multiple: { // 是否多选
      type: Boolean,
      default: () => false
    },
    accept: { // 上传文件的格式限制，默认不限制，非必传
      type: String,
      default: ''
    },
    listType: {
      type: String,
      default: LIST_TYPE.text
    },
    isDelete: {
      type: Boolean,
      default: () => true
    },
    // acceptText: { // 上传文件格式限制文字说明
    //   type: String,
    //   default: ''
    // },
    limit: {
      type: Number,
      default: () => null
    },
    size: {
      type: Number,
      default: () => null
    },
    list: {
      type: Array,
      default: () => []
    },
    messageSuccessText: {
      type: String,
      default: '上传成功'
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      LIST_TYPE,
      base,
      PROGRESS,
      PROGRESS_COLOR,
      fileList: [],
      propsList: [],
      uploadData: {
        dataId: null,
        ...this.data
      },
      numbers: 0,
      pendingObject: {},
      progressVisible: false
    }
  },
  computed: {
    hasUploadFail() {
      for (const key in this.pendingObject) {
        const { progressStatus } = this.pendingObject[key]
        if (progressStatus === 'fail') {
          return true
        }
      }
      return false
    }
  },
  watch: {
    list() {
      this.fileList = this.list
    }
  },
  methods: {
    beforeUpload(file) {
      this.propsList = []
      this.progressVisible = true
      this.numbers++
      this.uploadData.dataId = Date.now() + randomNDigits(6)

      // 是否空文件
      if (file.size === 0) {
        this.$message.error('文件错误，请上传正确的文件')
        this.numbers--
        return false
      }

      // 是否限制size
      const size = this.size
      if (size && file.size > size) {
        this.$message.error(`文件大小超过限制，最大不超过${bytesToSize(size)}`)
        this.numbers--
        return false
      }

      // 是否限制文件类型
      const accept = this.accept
      if (accept && !this.isAcceptType(file.type)) {
        this.$message.error(`文件格式错误，仅限${accept}格式`)
        this.numbers--
        return false
      }
      return true
    },
    isAcceptType(fileType) {
      const accepts = this.accept.split(',')
      let types = []
      for (let i = 0; i < accepts.length; i++) {
        const accept = accepts[i]
        types = [...types, ...MIME[accept]]
      }
      return types.includes(fileType)
    },
    // 超出限制数量
    onExceed(files, fileList) {
      this.$message.error(`文件个数不超过${this.limit}个`)
    },
    onPreview(file) {
      // 是否可预览
      const preview = this.preview
      const url = file.response?.data?.[0]?.address || file.address

      if (preview) {
        this.$viewer([{ url, alt: '' }])
      }
    },
    onChange(file, fileList) {
      const { uid } = file
      if (this.showProgressFloat) {
        if (file.status === 'ready') {
          this.$set(this.pendingObject, [uid], { ...file, percentage: 0, progressStatus: 'pending' })
          this.$emit('onProgressChange', { uid, data: { ...file, percentage: 0, progressStatus: 'pending' }})
        }

        if (file.status === 'fail') {
          this.$set(this.pendingObject, [uid], { ...file, progressStatus: 'fail' })
          this.$emit('onProgressChange', { uid, data: { ...file, progressStatus: 'fail' }})
        }

        if (file.status === 'success') {
          // console.log('success', uid)
          this.$set(this.pendingObject, [uid], { ...file, percentage: 100, progressStatus: 'success' })
          this.$emit('onProgressChange', { uid, data: { ...file, percentage: 100, progressStatus: 'success' }})
        }
      }
    },
    onProgress(event, file, fileList) {
      // const { uid } = file
      // const percentage = (event.loaded / event.total * 100)

      // this.$set(this.pendingObject, [uid], { ...file, percentage: Math.floor(percentage), progressStatus: 'pending' })
      // this.$emit('onProgressChange', { uid, data: { ...file, percentage: Math.floor(percentage), progressStatus: 'pending' }})
    },
    onSuccess(response, file, fileList) {
      this.propsList.push({ ...file, response: { ...response }})
      this.numbers--

      const { resultCode } = response

      switch (resultCode) {
        case -1:
          this.$message.error(`上传失败，请重试`)
          this.$emit('onError')
          break

        case -3:
          this.$message.error(`登录超时，请重新登录`)
          this.$emit('onError')
          break

        case 0: {
          // 添加address
          // debugger
          // this.fileList.push({ ...file, address })
          // this.fileList = fileList
          // this.fileList[this.fileList.length - 1 ].address = response?.data?.[0]?.address
          // const uid = file?.uid
          // const _fileList = [...fileList].map(t => {
          //   const address = response?.data?.[0]?.address
          //   const _uid = t?.uid
          //   if (uid === _uid) {
          //     return { ...t, address }
          //   }
          // })
          this.messageSuccessText && this.$message.success(this.messageSuccessText)
          this.$emit('update:list', [...fileList])
          this.$emit('onSuccess', { response, file, fileList })

          break
        }

        default:
          break
      }

      (this.numbers === 0) && this.onDone()
    },
    onError() {
      debugger
      this.numbers--
      this.$emit('onError')
      ;(this.numbers === 0) && this.onDone()
    },
    onDone() {
      this.$emit('onDone', [...this.propsList])
      if (this.showProgressFloat && !this.hasUploadFail) {
        setTimeout(() => {
          this.closeProgressFloat()
        }, 3000)
      }
    },
    handleRemove(scope) {
      console.log(scope)
      this.$refs.upload.handleRemove(scope.file)
    },
    onRemove(file, fileList) {
      this.fileList = fileList
      this.$emit('update:list', [...this.fileList])
      this.$emit('onRemove', { file, fileList })
    },
    beforeRemove(file, fileList) {
      return new Promise((resolve, reject) => {
        if (file.status === 'success') {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const id = file.response?.data[0]?.imageId || file.response?.data[0]?.fileId
            const deleteUrl = this.deleteUrl

            axios.delete(`${base.hall}${deleteUrl}${id}`).then(res => {
              if (res.resultCode === 0) {
                this.$message.success('删除成功')
                resolve()
              } else {
                this.$message.error('删除失败，请重试')
                reject()
              }
            }).catch(() => {
              reject()
            })
          }).catch(() => {
            reject()
          })
        } else {
          resolve()
        }
      })
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    closeProgressFloat() {
      this.progressVisible = false
    },
    afterLeave() {
      this.pendingObject = {}
    },
    bytesToSize(size) {
      return bytesToSize(size)
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadProgressBox {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 560px;
  z-index: 100;
}
</style>
