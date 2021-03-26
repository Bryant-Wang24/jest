<template>
  <div>
    <div class="header">
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选 </el-checkbox>
      <span class="checkbox_span">已选择<span>{{ checkedDelete.length }}</span> 项内容</span>
      <el-button size="small" type="text" @click="cancel_checkAll">取消选择</el-button>
    </div>
    <ul v-infinite-scroll="load" :infinite-scroll-distance="10" :infinite-scroll-immediate="false" :style="[obj]" :infinite-scroll-disabled="busy" class="infinite-list" style="overflow:auto">
      <div class="infinite-list-item">
        <div v-if="tableNull" class="infinite_new">
          <div class="folder">
            <div v-for="(ite,index) in fileList" :key="index" class="folder_new" @dblclick="reduce(ite)">
              <el-dropdown trigger="click" class="folder_new_show" @command="handleCommand" @click.native="getChild(ite)">
                <el-button icon="el-icon-more" circle size="mini" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="file_name" :disabled="!('4' in ite.permissions)">重命名</el-dropdown-item>
                  <!-- <el-dropdown-item command="file_move" :disabled="!('10' in ite.permissions)">移动</el-dropdown-item> -->
                  <el-dropdown-item command="file_admin" :disabled="!('0' in ite.permissions)">权限管理</el-dropdown-item>
                  <el-dropdown-item command="file_delete" style="color:#FF0000" :disabled="!('3' in ite.permissions)">删除文件夹</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div class="logo" />
              <div class="title">{{ ite.node.name }}</div>
            </div>
          </div>
          <el-checkbox-group v-model="checkedDelete" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(item,index) in treeList" :key="index" :label="item.node.id">
              <div class="check_new">
                <div v-if="item.node_type==='png' || item.node_type==='gif' || item.node_type==='jpg'" :style="{background:'url('+EncodeURIFilter(item.resLink)+')no-repeat',backgroundSize:'100% 100%'}" class="logo logo_img" />
                <div v-else-if="item.node_type==='pdf'" class="logo logo_img">
                  <div class="logo_other logo_pdf" />
                </div>
                <div v-else-if="item.node_type==='docx' || item.node_type==='doc'" class="logo">
                  <div class="logo_other logo_word" />
                </div>
                <div v-else-if="item.node_type==='ppt' || item.node_type==='pptx'" class="logo">
                  <div class="logo_other logo_ppt" />
                </div>
                <div v-else-if="item.node_type==='mp3' ||item.node_type==='mp4'" class="logo">
                  <div class="logo_other logo_mp3" />
                </div>
                <div v-else-if="item.node_type==='rar' ||item.node_type==='zip' ||item.node_type==='arj'" class="logo">
                  <div class="logo_other logo_compress" />
                </div>
                <div v-else-if="item.node_type==='txt'" class="logo">
                  <div class="logo_other logo_txt" />
                </div>
                <div v-else-if="item.node_type==='xlsx' || item.node_type==='xls'" class="logo">
                  <div class="logo_other logo_excel" />
                </div>
                <div v-else class="logo">
                  <div class="logo_other logo_unknown" />
                </div>

                <div class="title">{{ item.node.name }}</div>
              </div>
              <div class="operation">
                <el-button icon="el-icon-download" circle size="mini" :disabled="!('8' in item.permissions) && !('9' in item.permissions)" @click="set_datalibDownload(item.node.id)" />
                <el-dropdown trigger="click" @command="handleCommand" @click.native="getChild(item)">
                  <el-button icon="el-icon-more" circle size="mini" />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="other_new" :disabled="!('6' in item.permissions)">查看详情</el-dropdown-item>
                    <el-dropdown-item command="file_name" :disabled="!('4' in item.permissions)">重命名</el-dropdown-item>
                    <el-dropdown-item command="file_delete" :disabled="!('3' in item.permissions)">删除素材</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <div v-else class="tableNull">
          <div class="span" style="color:#999999">暂无文件</div>
        </div>
      </div>
    </ul>
    <pagination-page
      style="margin-top:20px"
      :total="total"
      :to="pageSize"
      layout="prev, pager, next,sizes"
      :current-page="pageIndex"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <popup-page :id="node_id" ref="popup" :title-name="titleName" :parent-id="parentId" :dialog-show="dialogShow" @get_applicationAdd="get_applicationAdd" @get_datalibDelete="get_datalibDelete" @refresh="refresh" @handleCancel="dialogShow=false" />
    <power-page :id="node_id" ref="power" :title-name="titleName" :power-visible="powerVisible" @handleCancel="powerVisible=false" />
  </div>
</template>
<script>
import PaginationPage from '@/components/Pagination/index'
import base from '@/api/base'
import PowerPage from './power'
import PopupPage from './popup'
import { EncodeURIFilter } from '@/utils/common'
export default {
  components: { PopupPage, PowerPage, PaginationPage },
  props: {
    parentId: {
      type: Number,
      default: 0
    },

    permissions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      obj: {
        height: document.documentElement.clientHeight - 400 + 'px'
      },
      node_id: 0,
      base: base,
      busy: true,
      total: 0,
      pageIndex: 1,
      navigateLastPage: 0,
      pageSize: 15,
      titleName: '',
      infinite_scroll: false,
      tableNull: false,
      fileList: [], // 文件夹类型数据
      dialogShow: false,
      powerVisible: false,
      navigatepageNums: false,
      checkAll: false,
      checkedDelete: [],
      isIndeterminate: false,
      treeList: []

    }
  },
  watch: {
    parentId(val) {
      this.fileList = []
      this.treeList = []
      this.pageIndex = 1
      this.pageSize = 15
      if (Number(val) === 0) return false
      this.get_datalibList()
    }
  },
  created() {
    // this.routerStyle()
  },
  methods: {
    EncodeURIFilter(str) {
      return EncodeURIFilter(str)
      // if (str !== null && str !== '') {
      //   str = str.replace(/\+/g, '%2B')
      //   str = str.replace(/\&/g, '%26')
      //   str = str.replace(/\ /g, '%20')
      //   str = str.replace(/\（/g, '%28')
      //   str = str.replace(/\）/g, '%29')
      //   str = str.replace(/\(/g, '%28')
      //   str = str.replace(/\)/g, '%29')
      //   // str = str.replace(/\&/g, '%26')
      //   // str = str.replace(/\&/g, '%26')
      // }
      // return str
    },
    // 双击事件
    reduce(val) {
      this.$emit('reduce', val.node)
    },

    // 单体下载
    set_datalibDownload(id) {
      this.$refs.popup.addForm = {}
      if ('9' in this.permissions) {
        this.node_id = id
        this.titleName = '下载文件'
        this.dialogShow = true
      } else {
        this.get_datalibDownload(id)
      }
    },
    // 需要申请下载
    get_applicationAdd(val) {
      const json = {
        application: { purpose: val, operationType: 'APPLY_TO_DOWNLOAD' },
        applicationNodes: [{ node: { id: this.node_id }}]
      }
      this.$api.content.applicationAdd(json).then(res => {
        if (res) {
          this.dialogShow = false
          this.$refs.popup.addForm = {}
        }
      })
    },
    // 不需要申请可以直接下载
    get_datalibDownload(id) {
      window.location.href =
        `http://${window.location.host}${base.hall}api/hall/rest/datalib/node/batch/download?ids=` + id
    },
    refresh(val) {
      // if (this.titleName === '重命名') return this.get_datalibList()
      this.$emit('refresh', val)
    },
    routerStyle() {
      if (Number(this.parentId) !== 0) {
        this.pageIndex = 1
        this.get_datalibList()
      }
    },
    // 获取文件类型
    get_file_type(name) {
      if (name.includes('.')) {
        const num = name.substring(name.lastIndexOf('.') + 1)
        return num
      }
    },

    load() {
      // this.busy = true
      // if (Number(this.parentId) === 0) return false
      // if (Number(this.pageIndex) > Number(this.navigateLastPage)) return false
      // this.get_datalibList()
    },
    cancel_checkAll() {
      this.checkedDelete = []
      this.isIndeterminate = false
      this.checkAll = false
    },
    handleCheckAllChange(val) {
      const allId = []
      if (Number(this.treeList.length) !== 0) {
        for (const i in this.treeList) {
          allId.push(this.treeList[i].node.id)
        }
      }
      this.checkedDelete = val ? allId : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.treeList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.treeList.length
    },
    getChild(val) {
      this.node_id = Number(val.node.id)
    },
    handleCommand(command) {
      switch (command) {
        case 'file_name':
          this.titleName = '重命名'
          this.dialogShow = true
          this.$nextTick(() => {
            this.$refs.popup.get_datalibEdit()
          })
          break
        case 'file_move':
          this.$refs.popup.get_treeType()
          this.titleName = '移动'
          this.dialogShow = true
          break
        case 'file_admin':
          this.titleName = '权限管理'
          this.$refs.power.get_groupConfig()
          this.powerVisible = true
          break
        case 'file_delete':
          this.titleName = '删除'
          this.dialogShow = true
          break
        case 'other_new':
          this.titleName = '查看详情'
          this.$refs.popup.get_datalibEdit()
          this.$refs.popup.get_operationLogBoth()
          this.dialogShow = true
          break
      }
    },
    // 删除
    get_datalibDelete() {
      this.fileList = []
      this.treeList = []
      this.pageIndex = 1
      this.pageSize = 15
      // this.parentId = 0
      this.get_datalibList()
      this.dialogShow = false
    },
    get_permissions(arr) {
      const list = arr.split(',')
      const json = {}
      for (const i in list) {
        json[list[i]] = list[i]
      }
      return json
    },
    // 管理 - 分页查询
    get_datalibList() {
      const json = {
        query: {
          parentId: this.parentId
        },
        index: this.pageIndex,
        size: this.pageSize
      }
      this.name !== '' ? json.query['name'] = this.name : ''

      this.$api.content.datalibList(json).then(res => {
        if (res) {
          this.fileList = []
          this.treeList = []
          const list = res.list
          this.total = res.total
          this.navigateLastPage = res.navigateLastPage
          if (Number(list.length) === 0) {
            this.tableNull = false
            // this.fileList = []
            // this.treeList = []
          } else {
            this.tableNull = true
            for (const i in list) {
              list[i]['permissions'] = list[i].permissionConfig.permissions !== '' ? this.get_permissions(list[i].permissionConfig.permissions) : []
              list[i]['node_type'] = 'resLink' in list[i] ? this.get_file_type(list[i].resLink) : ''
              if (list[i].node.type === 'FOLDER') {
                this.fileList.push(list[i])
              } else {
                this.treeList.push(list[i])
              }
            }
          }
        } else {
          this.fileList = []
          this.treeList = []
        }
      })
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.get_datalibList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.get_datalibList()
    }
  }
}
</script>
<style lang="scss" scoped>

.tableNull{
  height: 100%;
  position: relative;
  .span{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%)
  }
}
.infinite-list{
  width: 100%;
  padding: 0;
  .infinite-list-item{
    height: 100%;
    .infinite_new{
      width: 100%;
    }
  }
}
.header{
  width: 100%;
  line-height: 32px;
  background: #FAFAFA;
  margin-bottom: 13px;
  font-size: 14px;
  .checkbox_span{
    // font-size: 14px;
    margin: 0 10px;
    color: #000000;
    font-weight: 400;
  }
}
// .infinite-list{
//   height: 200px;
// }
.folder{
  width: 100%;
  display: flex;
  flex-wrap:wrap;
  // .folder_new:hover {
  //   .folder_new_show{
  //     display: block;
  //   }
  // }
  .folder_new{
    width: 16%;

    text-align: center;
    border:1px solid #EEEEEE;
    padding-top: 20px;
    margin-bottom: 13px;
    margin-right: 13px;
    position: relative;
    .logo{
      margin: 0  auto;
      width: 50%;
      height: 0;
      padding-bottom: 50%;
      background-size: 100% 100%;
      background : url('~@/assets/gongge_images/file.png') no-repeat;
    }
    .title{
      width: 100%;
      height: 32px;
      padding: 0 13px;
      box-sizing: border-box;
      line-height: 32px;
      font-size: 14px;
      color: #000000;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .el-dropdown{

      position: absolute;
      top: 10px;
      right: 10px;
      .el-button{
        width: 20px;
        height: 20px;
        display: flex;
        flex-direction:row;
        justify-content: center;
        align-items: center;
        i{
          font-size: 6px;
        }
      }
    }

  }
}
.el-checkbox-group{
  ::v-deep .el-checkbox{
    margin: 0 13px 13px 0;
    position: relative;
    width: 16%;
    border:1px solid #EEEEEE;
    .el-checkbox__input{
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .el-checkbox__label{
      width: 100%;
      padding: 0;
      .check_new{
        width: 100%;
        padding-top: 16px;
        .logo{
          width: 80%;
          height: 0;
          margin: 0 auto;
          padding-bottom: 50%;
          background-size: 100% 100% !important;

        }
        .logo_img{
          width: 80%;
          // height: 100%;
          margin: 0 auto;
          text-align: center;
          padding-bottom: 50%;
        }
        .logo_other{
          margin: auto;
          width: 50%;
          padding-bottom: 50%;
          background-size: 100% 100% !important;
        }
        .logo_word{
          background : url('~@/assets/gongge_images/word.png') no-repeat;
        }
        .logo_ppt{
          background : url('~@/assets/gongge_images/ppt.png') no-repeat;
        }
        .logo_mp3{
          background : url('~@/assets/gongge_images/mp3.png') no-repeat;
        }
        .logo_excel{
          background : url('~@/assets/gongge_images/excel.png') no-repeat;
        }
        .logo_compress{
          background : url('~@/assets/gongge_images/compress.png') no-repeat;
        }
        .logo_pdf{
          background : url('~@/assets/gongge_images/pdf.png') no-repeat;
        }
        .logo_txt{
          background : url('~@/assets/gongge_images/txt.png') no-repeat;
        }
        .logo_unknown{
          background : url('~@/assets/gongge_images/unknown.png') no-repeat;
        }
        .title{
          margin-top: 8px;
          width: 100%;
          height: 20px;
          padding: 0 13px;
          text-align: center;
          line-height: 20px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          // white-space:normal;
          // overflow : hidden;
          // text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-line-clamp: 1;
          // -webkit-box-orient: vertical;
        }
      }
      .operation{
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        justify-content: space-between;
        .el-button{
          width: 20px;
          height: 20px;
          display: flex;
          flex-direction:row;
          justify-content: center;
          align-items: center;
          i{
            font-size: 6px;
          }
        }
        .el-dropdown{
          margin-left: 6px;
        }
      }
    }
  }
}
</style>
