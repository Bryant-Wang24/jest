<template>
  <div class="material">
    <Empty v-if="isEmpty" @AddFolder="AddFolder" />

    <div v-else class="content">
      <LeftTree
        class="LeftMenu"
        :folder-list="folderList"
        :current-node.sync="currentNode"
        :current-node-info="currentNodeInfo"
        @nodeClick="nodeClick"
        @AddFolder="AddFolder"
        @Rename="Rename"
        @DeleteFolder="DeleteFolder"
        @Permission="Permission"
      />
      <RightContent
        v-loading="loading"
        class="RightContent"
        :current-edit-node="currentEditNode"
        :current-node="currentNode"
        :current-node-info="currentNodeInfo"
        :folder-childrens="folderChildrens"
        :page="page"
        @search="search"
        @reset="reset"
        @download="download"
        @AddFolder="AddFolder"
        @Rename="Rename"
        @Permission="Permission"
        @DeleteFolder="DeleteFolder"
        @DeleteMultipleFiles="DeleteMultipleFiles"
        @View="View"
        @handleCurrentChange="handleCurrentChange"
        @nodeClick="nodeClick"
        @upload="upload"
      />
    </div>

    <ElDialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :width="dialog.width"
    >
      <DialogForm
        v-if="dialog.visible"
        :current-permission="currentPermission"
        :current-edit-node="currentEditNode"
        :type="dialog.type"
        :choose-num="chooseNum"
        @confirm="confirm"
        @cancel="closeDialog"
      />
    </ElDialog>
    <!-- <material-page v-if="isTree" @add_material="isTree = false" />
    <material-List v-else ref="materialList" :tree-list="treeList" @set_treeType="set_treeType" /> -->
  </div>
</template>
<script>
import Empty from './components/Empty'
import DialogForm from './components/DialogForm'
import LeftTree from './components/LeftTree'
import RightContent from './components/RightContent'
import { TYPE, DIALOG_TYPE, PERMISSION, PERMISSION_OBJECT } from '@/common/material'
// import MaterialList from './components/materialList'

export default {
  name: 'Material',
  components: { Empty, DialogForm, LeftTree, RightContent
  // MaterialList
  },
  data() {
    return {
      // isTree: false,
      // treeList: [],
      // num: 0,
      //
      // isEmpty: false,
      loading: false,
      currentNode: { // 树当前选中的节点
      },
      currentNodeInfo: {}, // currentNode对应节点的后台数据，包括对应的Permission数据
      currentEditNode: { // 当前执行各种操作的节点
      },
      currentPermission: {}, // 点击权限按钮时设置的当前node权限
      folderList: [],
      folderChildrens: [],
      dialog: {
        title: null,
        type: null,
        visible: false,
        width: '600px',
        data: {} // 附加参数
      },
      page: {
        index: 1,
        size: 15,
        total: 0
      },
      chooseNum: null
    }
  },
  computed: {
    isEmpty() {
      return !this.folderList.length
    }
  },
  watch: {
    currentNode: {
      handler(node) {
        const { id } = node
        if (id) {
          this.initPage()
          this.getFolderChildrens()
          this.getCurrentNodeInfo(id)
        }
      }
    }
  },
  created() {
    // this.get_treeType()
    this._getFolderTree(true).then((children) => {
      this.initCurrentNode(children[0] || {})
    })
  },
  methods: {
    initPage() {
      this.page.index = 1
      this.page.size = 15
    },
    nodeClick(data) {
      this.currentNode = { ...data }
      this.currentEditNode = { ...data }
    },
    getFolderChildrens(query = {}) {
      this.loading = true

      const { id: parentId } = this.currentNode
      const _params = {
        query: { parentId, ...query },
        index: this.page.index,
        size: this.page.size
      }
      this._getFolderChildrens(_params).then(res => {
        const { list, total } = res
        this.folderChildrens = list
        this.page.total = total
        this.loading = false
      })
    },
    search({ name }) {
      this.initPage()
      const query = { name }
      this.getFolderChildrens(query)
    },
    reset() {
      this.initPage()
      this.getFolderChildrens()
    },
    handleCurrentChange({ index, size, name }) {
      this.page.index = index
      this.page.size = size

      const params = { name }
      this.getFolderChildrens(params)
    },
    AddFolder(data) {
      this.dialog.data = data || {}
      this.setDialog(DIALOG_TYPE.ADD.type)
    },
    Rename(node) {
      node && (this.currentEditNode = node)
      this.setDialog(DIALOG_TYPE.RENAME.type)
    },
    Permission(node) {
      node && (this.currentEditNode = node)
      const params = { id: this.currentEditNode.id }
      this.getPermission(params)
      this.setDialog(DIALOG_TYPE.PERMISSION.type)
    },
    DeleteFolder(node) {
      node && (this.currentEditNode = node)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { id } = this.currentEditNode

        this._delete([id]).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this._getFolderTree().then((children) => {
              this.initCurrentNode(children[0] || {})
            })
          }
        })
      }).catch(() => {})
    },
    View(node) {
      console.log(node)
      node && (this.currentEditNode = node)
      this.setDialog(DIALOG_TYPE.VIEW.type)
    },
    DeleteMultipleFiles(ids = []) {
      this.$confirm('此操作将永久删除选中文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._delete([...ids]).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this._getFolderTree()
            this.initPage()
            this.getFolderChildrens()
          }
        })
      }).catch(() => {})
    },
    upload(params) {
      this._upload(params).then(res => {
        this.getFolderChildrens()
      })
    },
    async confirm(form) {
      const currentNodeId = this.currentNode.id
      const currentEditNodeId = this.currentEditNode.id
      const isLeftChange = currentNodeId === currentEditNodeId
      const type = this.dialog.type

      switch (type) {
        case DIALOG_TYPE['ADD'].type: {
          const params = { node: { ...form, ...this.dialog.data, type: TYPE['FOLDER'] }}
          this._addNode(params).then((res) => {
            if (res) {
              this.closeDialog()
              this._getFolderTree()
              this.initCurrentNode(res)
            }
          })
          break
        }

        case DIALOG_TYPE['RENAME'].type: {
          const { id, type } = this.currentEditNode
          const { name: _name, suffix } = form
          const name = (type === TYPE['FOLDER']) ? _name : [_name, suffix].join('.')
          const params = { id, name }

          const renameNode = await this._rename(params)

          this.closeDialog()
          this._getFolderTree().then(FolderList => {
            if (isLeftChange) {
              this.initCurrentNode(renameNode)
            } else {
              const nodes = FolderList.filter(t => t.id === currentNodeId)
              this.initCurrentNode(nodes[0])
            }
          })

          break
        }

        case DIALOG_TYPE['PERMISSION'].type: {
          const { id } = this.currentEditNode
          const { members, groupConfig } = form
          const params = { json: { ...groupConfig }, id }

          console.log('form', form)
          await this._setPermission(params)
          await this.setPermissionMember({ members, id })
          this.$message.success('操作成功')
          this.closeDialog()
          this.getPermission({ id })
          this._getFolderTree().then((children) => {
            this.initCurrentNode(children[0] || {})
          })
          break
        }

        case DIALOG_TYPE['APPLY'].type: {
          const { purpose } = form
          const { id } = this.currentEditNode
          const params = {
            application: { purpose, operationType: PERMISSION_OBJECT['APPLY_TO_DOWNLOAD'] },
            applicationNodes: [{ node: { id }}]
          }
          this._applyDownload(params).then(res => {
            if (res) {
              this.$message.success('操作成功')
              this.closeDialog()
            }
          })
          break
        }

        default:
          break
      }
    },
    setPermissionMember({ members, id }) {
      const promises = []
      for (let i = 0; i < members.length; i++) {
        const member = members[i]
        const promise = new Promise((resolve, reject) => {
          this.$api.content.distributionByGroup({ ...member, id }).then(res => {
            if (res) {
              resolve()
            } else {
              reject()
            }
          })
        })
        promises.push(promise)
      }
      return Promise.all([...promises])

      // if (params.groupKey) {
      //   return this.$api.content.distributionByGroup(params)
      // } else {
      //   Promise.resolve()
      // }
    },
    download({ type, ids, permissions, node }) {
      node && (this.currentEditNode = node)
      if (permissions.includes(PERMISSION['DIRECTLY_DOWNLOAD'])) {
        window.location.href = this.$api.content.downloadFiles(ids)
      } else if (permissions.includes(PERMISSION['APPLY_TO_DOWNLOAD'])) {
        this.chooseNum = `${ids}`.split(',').length
        this.setDialog(DIALOG_TYPE.APPLY.type)
      }
    },
    setCurrentNodeById() {

    },
    initCurrentNode(node) {
      this.currentNode = node
      this.currentEditNode = node
    },
    setDialog(type) {
      this.dialog.title = DIALOG_TYPE[type].title
      this.dialog.type = DIALOG_TYPE[type].type
      this.dialog.visible = true
    },
    closeDialog() {
      this.dialog.title = null
      this.dialog.type = null
      this.dialog.visible = false
      this.dialog.data = {}
    },
    getPermission(params) {
      this._getPermission(params).then(res => {
        this.currentPermission = res
      })
    },
    getCurrentNodeInfo(id) {
      this._getCurrentNodeInfo(id).then(res => {
        this.currentNodeInfo = res
      })
    },
    _upload(params) {
      return this.$api.content.datalibUpload(params)
      // return new Promise((resolve, reject) => {
      //   this.$api.content.datalibUpload(params).then(res => {
      //     resolve()
      //   })
      // })
    },
    _getFolderTree() {
      return new Promise((resolve, reject) => {
        this.$api.content.treeType({ types: ['FOLDER'] }).then(res => {
          const { children } = res
          this.folderList = children
          resolve(children)
        })
      })
    },
    _addNode(params) {
      return this.$api.content.datalibAdd(params)
    },
    _rename(params) {
      return this.$api.content.datalibReplace(params)
    },
    _delete(params) {
      return this.$api.content.datalibDelete(params)
    },
    _getPermission(params) {
      return this.$api.content.groupConfig(params)
    },
    _setPermission(params) {
      return this.$api.content.groupConfigDownload(params)
    },
    _getFolderChildrens(params) {
      return this.$api.content.datalibList(params)
    },
    _applyDownload(params) {
      return this.$api.content.applicationAdd(params)
    },
    _getCurrentNodeInfo(id) {
      return this.$api.content.permissionConfigNodeId(id)
    }
    // set_treeType(arg) {
    //   this.get_treeType(arg)
    // },
    // get_treeType(arg) {
    //   if (arg === 'initNum') {
    //     this.num = 0
    //   }
    //   this.num++
    //   this.$api.content.treeType({ types: ['FOLDER'] }).then(res => {
    //     if (res) {
    //       this.treeList = res.children
    //       this.treeData = res.children
    //       this.isTree = false
    //       if (Number(res.children.length) !== 0 && this.num === 1) {
    //         this.$refs.materialList.pid = res.children[0].id
    //         this.$refs.materialList.pid_name = res.children[0].name
    //         this.$refs.materialList.get_permissionConfigNodeId()
    //       }
    //     } else {
    //       this.isTree = true
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.material {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px;
  .content {
    display: flex;
    height: 100%;
    .LeftMenu {
      width: 20%;
      margin-right: 20px;
    }
    .RightContent {
      flex: 1;
    }

  }
}
</style>
