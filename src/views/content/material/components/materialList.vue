<template>
  <div class="content_add">
    <div class="content">
      <div class="left" :style="[obj]">
        <div class="tree">
          <div class="tree_root">
            <div class="root_title">文件夹</div>
            <el-button size="small" icon="el-icon-circle-plus-outline" type="text" @click="footBtn('新建同级文件夹')">创建</el-button>
          </div>
          <div class="tree_new">
            <div class="new_tree">
              <el-tree ref="treeForm" node-key="id" :data="treeList" :default-expanded-keys="[pid]" :default-checked-keys="[pid]" :props="defaultProps" @check-change="handleClick" @node-click="handleNodeClick">
                <span slot-scope="{ data }" class="custom-tree-node">
                  <span>
                    <div class="tree_icon_file" :class="{'tree_icon_file_ok' :data.id===pid}" />
                  </span>
                  <span>{{ data.name }}</span>
                  <span class="span_click">
                    <el-dropdown trigger="click" @command="handleCommand" @click.native="getChild(data)">
                      <!-- <el-button icon="el-icon-setting" circle size="mini" /> -->
                      <i class="el-icon-setting" />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="file_name">重命名</el-dropdown-item>
                        <el-dropdown-item command="file_admin">管理权限</el-dropdown-item>
                        <el-dropdown-item command="file_delete" style="color:#FF0000">删除文件夹</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
      </div>
      <div class="right" :style="[obj]">
        <div class="new">
          <div class="title">{{ pid_name ||'文件夹' }}</div>
          <div class="ul">
            <div class="li" style="width:50%">
              <div class="name">文件名称：</div>
              <div class="input" style="margin-right:10px">
                <el-input v-model="name" placeholder="请输入" />
              </div>
              <el-button @click="set_datalibList">查询</el-button>
              <el-button @click="Reset">重置</el-button>
            </div>

            <div class="li" style="margin-bottom:13px">
              <div class="li_btn">
                <el-upload
                  :on-preview="handlePreview"
                  class="upload-demo"
                  :action="`${base.hall}a/api/ossfile/upload`"
                  :data="attachmentsData"
                  :on-success="uploadImgSuccess"
                  :before-upload="uploadBefore"
                  :on-error="uploadImgError"
                  :before-remove="beforeRemove"
                  multiple
                  :disabled="!('7' in user_permissions)"
                  :file-list="fileList"
                >
                  <el-button type="primary" :disabled="!('7' in user_permissions)" size="small" @click="uploadOk">上传</el-button>
                </el-upload>
                <!-- <el-button type="primary" size="small" @click="footBtn('上传')">上传</el-button> -->
                <el-button size="small" @click="footBtn('新建')">新建</el-button>
                <el-button size="small" :disabled="!('8' in user_permissions) && !('9' in user_permissions)" @click="footBtn('下载')">下载</el-button>
                <!-- <el-button size="small" :disabled="!('10' in user_permissions)" @click="footBtn('移动到')">移动到...</el-button> -->
                <el-button size="small" :disabled="!('3' in user_permissions)" @click="footBtn('批量删除')">批量删除</el-button>
              </div>
              <el-radio-group v-model="fileStyle" @change="click_fileStyle">
                <el-radio-button label="0"><i class="el-icon-menu" /></el-radio-button>
                <el-radio-button label="1"><i class="el-icon-s-operation" /></el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <TableGongge v-if="fileStyle==='0'" ref="gongge" :permissions="user_permissions" :tree-data="treeData" :name="name" :parent-id="pid" @refresh="refresh" @reduce="reduce" />
          <TableList v-if="fileStyle==='1'" ref="table_list" :permissions="user_permissions" :name="name" :parent-id="pid" @openDetails="reduce" @refresh="refresh" />
        </div>
      </div>
    </div>
    <transition name="slide-fade" class="popover_visible">

      <el-card v-if="show" class="box-card popover_visible" style="width:25%">
        <div slot="header" class="clearfix">
          <span>文件上传</span>
          <i class="el-icon-close" style="float: right; padding: 3px 0" @click="show = !show" />
        </div>
        <div v-for="(o,index) in resultFile" :key="index" class="text item" :class="{'item_red' :!o.status}">
          <div class="item_name">{{ o.name }}</div>
          <div class="item_size">{{ o.size }}</div>
          <i :class="o.status? 'el-icon-check': 'el-icon-close'" />
        </div>
      </el-card>
    </transition>
    <popup-page ref="popup" :change-length="changeLength" :parent-id="pid" :title-name="titleName" :dialog-show="dialogShow" @refresh="refresh" @get_applicationAdd="get_applicationAdd" @handleCancel="dialogShow=false" @get_datalibDelete="get_datalibDelete" />
  </div>
</template>
<script>
import base from '@/api/base'
import PopupPage from './popup'
import TableGongge from './gongge'
import TableList from './list'
export default {
  name: '',
  components: { TableGongge, TableList, PopupPage },
  props: {
    treeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      show: false,
      i: 0,
      visible: true,
      videoFlag: true,
      fileList: [],
      resultFile: [], // 上传返回结果
      attachmentsData: { // 默认上传参数
        dataId: '',
        type: 'EXHHALL_DATA_LIB_NODE'
      },
      base: base,
      checkedDelete: [], // 批量删除
      pid: 0, // 上级id
      titleName: '',
      dialogShow: false,
      name: '',
      fileStyle: '', // 0-九宫格，1-列表
      obj: {
        height: document.documentElement.clientHeight - 120 + 'px'
      },
      // treeList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // pageIndex: 1,
      // pageSize: 10,
      changeLength: 0,
      pid_name: '',
      user_permissions: {},
      node_id: '',
      num: 0,
      numError: 0

    }
  },
  watch: {
    show(val) {
      if (!val) {
        this.resultFile = []
      }
    }
  },
  created() {
    this.fileStyle = '0'
  },
  methods: {
    reduce(val) {
      console.log(val)
      this.pid = val.id
      this.pid_name = val.name
      this.get_permissionConfigNodeId()
    },
    handleClick(data, checked, node) {
      this.i++
      if (this.i % 2 === 0) {
        if (checked) {
          this.$refs.treeForm.setCheckedNodes([])
          this.$refs.treeForm.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.treeForm.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },

    getChild(data) {
      console.log(data)
      this.node_id = data.id
      // if (this.fileStyle === '0') {
      //   this.$refs.gongge.node_id = data.id
      // } else {
      //   this.$refs.table_list.node_id = data.id
      // }
      if (this.fileStyle !== '0') return false
      this.$refs.gongge.node_id = data.id
      const json = {
        node: { id: data.id }
      }
      this.$refs.gongge.getChild(json)
    },
    handleCommand(command) {
      if (this.fileStyle === '0') {
        this.$refs.gongge.handleCommand(command)
      } else {
        const json = {
          node: { id: this.node_id }
        }
        if (command === 'file_delete') {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteFile()
            // this.$message({
            //   type: 'success',
            //   message: '删除成功!'
            // })
          }).catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // })
          })
          return
        }
        const command_name = command === 'file_name' ? '重命名' : '权限管理'
        this.$refs.table_list.clickBtn(json, command_name)
      }
    },
    deleteFile() {
      this.$api.content.datalibDelete([this.node_id]).then(res => {
        if (res) {
          this.$message.success('删除成功')
          this.refresh('initNum')
        }
      })
    },
    get_permissions(arr) {
      const list = arr.split(',')
      const json = {}
      for (const i in list) {
        json[list[i]] = list[i]
      }
      return json
    },
    // 管理 - 通过id获取详情（通过资料库结点id获取结点详情，其中depth表示递归寻找子结点的深度，0表示不寻找，1表示找到一级子代，以此类推）
    get_permissionConfigNodeId() {
      const json = {
        pid: this.pid
      }
      this.$api.content.permissionConfigNodeId(json).then(res => {
        if (res) {
          if (res.permissions === '') return false
          this.user_permissions = this.get_permissions(res.permissions)
        }
      })
    },
    click_fileStyle(val) {
      if (this.fileStyle === '0') {
        this.$refs.gongge.fileList = []
        this.$refs.gongge.pageIndex = 1
        this.$refs.gongge.pageSize = 15
        this.$refs.gongge.treeList = []
        this.$refs.gongge.get_datalibList()
      } else {
        this.$refs.table_list.pageIndex = 1
        this.$refs.table_list.pageSize = 15
        this.$refs.table_list.get_datalibList()
      }
    },
    // 查询
    set_datalibList() {
      // this.num = 0
      if (this.pid.toString() === '0') return false
      if (this.fileStyle === '0') {
        this.$refs.gongge.fileList = []
        this.$refs.gongge.treeList = []
        this.$refs.gongge.pageIndex = 1
        this.$refs.gongge.pageSize = 15
        this.$refs.gongge.get_datalibList()
      } else {
        this.$refs.table_list.pageIndex = 1
        this.$refs.table_list.pageSize = 15
        this.$refs.table_list.get_datalibList()
      }
      this.num = 0
    },
    // 重置
    Reset() {
      this.name = ''
      this.$nextTick(() => {
        this.set_datalibList()
      })
    },
    get_treeType(initNum) {
      this.$emit('set_treeType', initNum || null)
    },
    refresh(val) {
      // if (val === 'initNum')
      this.get_treeType(val)
      if (val?.titleName === '重命名') {
        switch (this.fileStyle) {
          case '0':
            this.$refs.gongge.get_datalibList()
            break
          case '1':
            this.$refs.table_list.get_datalibList()
            break
        }
        return false
      }

      if (val === '') return false
      this.handleNodeClick(val, true)
    },
    footBtn(val) {
      // if (Number(this.pid) === 0) return false
      switch (val) {
        case '新建同级文件夹':
          this.titleName = '新建同级文件夹'
          this.dialogShow = true
          break
        case '新建':
          this.titleName = '新建文件夹'
          this.dialogShow = true
          break
        case '下载':
          this.$refs.popup.addForm = {}
          if (this.fileStyle === '0' && this.pid !== 0) {
            if (Number(this.$refs.gongge.checkedDelete.length) === 0) return this.$message.warning('请选择要下载的数据')
            // if (Number(this.$refs.gongge.checkedDelete[0]) === 0) return this.get_datalibDelete()
            this.changeLength = this.$refs.gongge.checkedDelete.length
          } else {
            if (Number(this.$refs.table_list.changeList.length) === 0) return this.$message.warning('请选择要下载的数据')
            this.changeLength = this.$refs.table_list.changeList.length
          }
          if ('9' in this.user_permissions) {
            this.titleName = '下载文件'
            this.dialogShow = true
          } else {
            this.get_datalibDownload()
          }
          break
        case '移动到':
          this.titleName = '移动'
          this.dialogShow = true
          break
        case '批量删除':
          this.titleName = '批量删除'

          if (this.fileStyle === '0' && this.pid !== 0) {
            if (Number(this.$refs.gongge.checkedDelete.length) === 0) return this.$message.warning('请选择要删除的数据')
            // if (Number(this.$refs.gongge.checkedDelete[0]) === 0) return this.get_datalibDelete()
          } else {
            if (Number(this.$refs.table_list.changeList.length) === 0) return this.$message.warning('请选择要删除的数据')
            // this.get_datalibDelete()
          }
          this.dialogShow = true
          break
      }
    },
    handlePreview(file) {
      console.log(file)
    },
    uploadOk() {
      this.numError = 0
    },

    // 上传图片成功
    uploadImgSuccess(response, file, fileList) {
      this.visible = true
      this.fileList = []
      this.fileList = fileList
      if (response.resultCode === 0) {
        this.resultFile.push({
          name: file.name,
          size: this.fileSize(Number(file.size)),
          status: true
        })
        this.get_datalibUpload(response, file.size)
      } else {
        this.num--
        this.resultFile.push({
          name: file.name,
          size: this.fileSize(Number(file.size)),
          status: false
        })
      }
    },
    get_datalibUpload(response, size) {
      const json = {
        parentId: this.pid,
        permissionConfigCopyParam: null,
        idNodes: [{ id: response?.data[0].fileId, type: 'FILE', size: size }]
      }
      this.$api.content.datalibUpload(json).then(res => {
        if (res) {
          if (Number(this.num) === 1) {
            this.show = !this.show
            this.set_datalibList()
            setTimeout(() => {
              if (this.show) {
                this.show = !this.show
              }
            }, 3000)
          } else {
            this.num--
          }
        }
      })
    },
    // 执照上传前
    uploadBefore(file) {
      const isLt2M = file.size / 1024 / 1024 < 30
      if (isLt2M) {
        this.num++
        this.attachmentsData.dataId = Date.now()
      } else {
        this.numError++
        if (Number(this.numError) === 1) {
          this.$message.error(file.name + '的大小超过 30MB!')
        }
      }
      return isLt2M
    },
    uploadImgError(err) {
      console.log(err)
    },
    beforeRemove(file, fileList) {},

    handleNodeClick(data, checked, node) {
      if (!data.id) return
      this.pid = data.id
      this.pid_name = data.name
      this.name = ''
      this.get_permissionConfigNodeId()
    },
    get_node_ids() {
      let arr = []
      if (this.fileStyle === '0') {
        arr = arr.concat(this.$refs.gongge.checkedDelete)
      } else {
        const changeList = this.$refs.table_list.changeList
        for (const k in changeList) {
          arr.push(changeList[k].node.id)
        }
      }
      return arr
    },
    // 管理 - 批量删除
    get_datalibDelete() {
      const ids = this.get_node_ids()
      this.$api.content.datalibDelete(ids).then(res => {
        if (res) {
          this.dialogShow = false
          if (this.fileStyle === '0') {
            this.$refs.gongge.checkedDelete = []
            this.$refs.gongge.cancel_checkAll()
          } else {
            this.$refs.table_list.changeList = []
          }

          this.set_datalibList()
        }
      })
    },
    // 需要申请下载
    get_applicationAdd(val) {
      const applicationNodes = []
      const list = this.get_node_ids()
      for (const i in list) {
        applicationNodes.push({
          node: {
            id: list[i]
          }
        })
      }
      const json = {
        application: { purpose: val, operationType: 'APPLY_TO_DOWNLOAD' },
        applicationNodes: applicationNodes
      }
      this.$api.content.applicationAdd(json).then(res => {
        if (res) {
          this.dialogShow = false
        }
      })
    },
    // 不需要申请可以直接下载
    get_datalibDownload() {
      const ids = this.get_node_ids()
      let pid = ''
      for (var i in ids) {
        pid += ids[i] + ','
      }
      pid = pid.substring(0, pid.length - 1)
      window.location.href =
        `http://${window.location.host}${base.hall}api/hall/rest/datalib/node/batch/download?ids=` + pid
    }

  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.el-button{
  font-size: 14px;
}
.el-tree{
  width: 100%;
  overflow: auto;
  ::v-deep .el-tree-node:focus > .el-tree-node__content {
    color: $--custom--color--primary
  }
}
.custom-tree-node{
  width: 100%;
  display: flex;
  span{
    display: inline-table;
    font-size: 14px;
    .tree_icon_file{
      width: 19px;
      height: 16px;
      border-radius: 2px;
      margin-right: 3px;
      background: url('~@/assets/gongge_images/file_no.png') no-repeat;
      background-size: 100% 100%;
    }
    .tree_icon_file_ok{
      background: url('~@/assets/gongge_images/file_ok.png') no-repeat;
    }
  }
  .span_click{
    flex: 1;
    text-align: right;
  }
}
.popover_visible{
  position: fixed;
  right: 5px;
  bottom:20px;
  z-index: 100;
  ::v-deep .el-card__header{
    padding: 15px 20px;
  }
  .el-card__body{
    max-height: 200px;
    padding: 0 20px;
    overflow: auto;
    box-sizing: border-box;
    .item{
      display: flex;
      line-height: 32px;
      border-bottom: 1px solid #E5E5E5;
      .item_size{
        width: 80px;
        text-align: center;
      }
      .item_name{
        flex: 1;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;

      }
      i{
        color: $--custom--color--primary;
        line-height: 32px;
      }
      .el-icon-close{
        color: #f56c6c;
      }
    }
    .item_red{
      color: #f56c6c;
    }
  }

}
.upload-demo{
  display: inline-table;
  margin-right: 10px;
}
.rowTitle {
  .el-button {
    display: inline-table;
    float: right;
    color: #888888;
    margin-right: 12px;
  }
}
.form_title_right {
  background: white;
  .span {
    float: right;
    color: #888888;
    font-size: 14px;
  }
}
.content_add {
  width: 100%;
  .content {
    width: 100%;
    height: auto;

    box-sizing: border-box;
    display: flex;
    .left {
      width: 20%;
      background: #FFFFFF;
      margin-right: 16px;
      .tree{
        width: 100%;
        height: 100%;
        // overflow: auto;
        position: relative;
        padding-top: 62px;
        .tree_root{
          width: 100%;
          padding: 0 20px;
          position: absolute;
          top: 20px;
          left: 0;
          display: flex;
          justify-content: space-between;
          .root_title{
            font-size: 16px;
            line-height: 32px;
            color: #000000;
          }
        }
        .tree_new{
          width: 100%;
          height: 100%;
          overflow: auto;
          .new_tree{
            padding: 0 20px;
          }
        }
      }
    }
    .right {

      background: #FFFFFF;
      max-width: 100%;
      padding: 20px;
      box-sizing: border-box;
      flex: 1;
      .new{
        max-width: 100%;
        // display: inline-table;
        .title{
          font-size: 18px;
          font-weight: 500;
          color: #000000;
          margin-bottom: 20px;
        }
        .ul{
          width: 100%;
          .li{
            width: 100%;
            display:flex;
            margin-bottom: 20px;
            justify-content: space-between;
            .name{
              font-size: 14px;
              line-height: 36px;
              color: #000000;
              font-weight: 400;
            }
            .input{
              flex: 1;
            }
            .li_btn{
              .el-button{
                width: 96px;
              }
              ::v-deep .upload-demo{
                ul{
                  display: none;
                }
              }
            }
          }
          .el-button{
            width: 76px;
            padding: 0;
            height: 36px;
            line-height: 36px;
            text-align: center;
          }
        }
      }

    }
  }
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.el-card{
  ::v-deep .el-card__header{
    background: $--custom--color--primary;
    padding: 10px 15px;
    color: white;
    .clearfix{
      i{
        font-size: 13px;
      }
    }
  }
}
</style>
