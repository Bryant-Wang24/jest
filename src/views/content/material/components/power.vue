<template>
  <div>
    <el-dialog :title="titleName" width="40%" :before-close="handleCancel" :visible.sync="powerVisible">
      <el-dialog
        width="50%"
        :title="powerTitle"
        :visible.sync="innerVisible"
        append-to-body
      >
        <UserTree v-if="innerVisible" ref="userTree" class="user_tree" :off-ids="offIds" :ids="dialog.ids" />
        <div class="footBtn">
          <el-button type="primary" :loading="innerVisible_loading" @click="innerVisibleOk">确定</el-button>
          <el-button @click="innerVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <div class="power">
        <div v-for="(item,key) in groupConfig" :key="key" class="power_ul">
          <div class="li li_flex">
            <div class="li_title">{{ item.new.title }}</div>
            <div class="li_title"><span> {{ item.list.length }}人 </span><el-button size="small" type="text" @click="power_user(item,key)">添加成员</el-button></div>
          </div>
          <div class="li"><div class="li_title">{{ item.new.desc }}</div></div>
          <div v-if="'canSwitchToKeys' in item.new" class="li">
            <el-radio-group v-model="item.canSwitchToKeys">
              <el-radio :label="item.new.title==='可查看/下载' ? 'view_directDownload' : 'edit_directDownload'">可直接下载</el-radio>
              <el-radio :label="item.new.title==='可查看/下载' ? 'view_applyToDownload' : 'edit_applyToDownload'">需申请下载</el-radio>
            </el-radio-group>
          </div>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="jurisdictionOk">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import UserTree from '@/components/UserTree'
export default {
  components: { UserTree },
  props: {
    titleName: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    },
    powerVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      offIds: [],
      index: 0,
      groupConfig: [],
      groupConfig_new: [],
      innerVisible_loading: false,
      groupMap_title: '', // 模块标识
      dialog: {
        title: '',
        component: '',
        ids: [

        ]
      },
      powerTitle: '',
      filterText: '',
      innerVisible: false
    }
  },
  watch: {
    innerVisible(val) {
      if (!val) {
        this.get_groupConfig()
      }
    }
  },
  methods: {
    // get_innerVisible() {
    //   this.innerVisible = false
    //   this.get_groupConfig()
    // },
    handleCancel() {
      this.innerVisible_loading = false
      this.$emit('handleCancel')
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // 添加成员
    power_user(val, index) {
      this.innerVisible_loading = false
      // 如果该项存在单选按钮操作则先保存
      if ('canSwitchToKeys' in val.new) {
        if (this.groupConfig[index].canSwitchToKeys !== this.groupConfig_new[index].canSwitchToKeys) {
          this.get_groupConfigDownload(this.groupConfig_new[index].canSwitchToKeys, this.groupConfig[index].canSwitchToKeys)
        }
      }
      const list = []
      if (Number(val.list.length) !== 0) {
        for (const i in val.list) {
          list.push(val.list[i].id)
        }
      }
      const arr = JSON.stringify(this.groupConfig)
      const arr_new = JSON.parse(arr)
      this.offIds = []

      for (const k in arr_new) {
        if (arr_new[k].type !== val.type && Number(arr_new[k].list.length) !== 0) {
          for (const j in arr_new[k].list) {
            this.offIds.push(arr_new[k].list[j].id)
          }
        }
      }
      this.dialog.ids = list
      this.index = index
      this.groupMap_title = val.new.title
      this.innerVisible = true
      this.powerTitle = '选择' + val.new.title
    },

    innerVisibleOk() {
      let type_value = ''
      for (const k in this.groupConfig) {
        if (this.groupConfig[k].new.title === this.groupMap_title) {
          type_value = this.groupConfig[k].canSwitchToKeys
          break
        }
      }
      const list = this.$refs.userTree.nodes()
      const arr = []
      if (Number(list.length) !== 0) {
        for (const i in list) {
          arr.push({
            id: list[i].id,
            type: list[i].type
          })
        }
      }
      switch (this.powerTitle) {
        case '选择可管理':
          this.get_distributionByGroup('manage', arr)
          break
        case '选择可编辑/下载':
          this.get_distributionByGroup(type_value, arr)
          break
        case '选择可编辑':
          this.get_distributionByGroup('edit', arr)
          break
        case '选择可查看/下载':
          this.get_distributionByGroup(type_value, arr)
          break
        case '选择仅可查看':
          this.get_distributionByGroup('view', arr)
          break
      }
    },
    // 权限 - 更新权限组的下载权限
    get_groupConfigDownload(older, new_value) {
      const data = {
        id: this.id,
        json: {}
      }
      data.json[older] = new_value
      this.$api.content.groupConfigDownload(data).then(res => {
        // if (res.toString() === 'true') {}
      })
    },
    // 权限 - 修改资料库结点的权限组成员配置
    get_distributionByGroup(type, list) {
      const json = {
        id: this.id,
        groupKey: type,
        list: list
      }
      this.innerVisible_loading = true
      this.$api.content.distributionByGroup(json).then(res => {
        if (res.toString() === 'true') {
          this.groupConfig[this.index].list = []
          this.groupConfig[this.index].list = list
          this.innerVisible = false
          this.innerVisible_loading = false
        }
      })
    },
    // 权限 - 获取权限组配置信息
    get_groupConfig() {
      this.$api.content.groupConfig({ id: this.id }).then(res => {
        if (res) {
          const list = res.permissionGroupConfigMap
          const arr = res.memberMap
          const groupConfig = []
          for (const i in list) {
            for (const k in arr) {
              if (i === k) {
                groupConfig.push({
                  canSwitchToKeys: 'canSwitchToKeys' in list[i] ? i : '',
                  new: list[i],
                  list: arr[k],
                  type: i
                })
              }
            }
          }
          this.groupConfig = groupConfig.sort((a, b) => {
            return a.new.order - b.new.order
          })
          const groupConfig_new = JSON.stringify(this.groupConfig)
          this.groupConfig_new = JSON.parse(groupConfig_new)
        }
      })
    },
    jurisdictionOk() {
      const data = {
        id: this.id,
        json: {}
      }
      for (const i in this.groupConfig) {
        if (this.groupConfig[i].canSwitchToKeys !== '') {
          data.json[this.groupConfig_new[i].canSwitchToKeys] = this.groupConfig[i].canSwitchToKeys
        }
      }
      this.$api.content.groupConfigDownload(data).then(res => {
        if (res) {
          this.handleCancel()
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.user_tree{
  margin-top: 20px;
}
.el-botton{
  width: 76px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.user{
  width: 100%;
  margin-top: 20px;
  display: flex;
  .user_left{
    width: 60%;
    border-right: 1px solid #E5E5E5;
    padding-right: 20px;
    box-sizing: border-box;
    .el-input{
      margin-bottom: 13px;
    }
  }
  .user_right{
    flex: 1;
    padding-left: 20px;
    box-sizing: border-box;
    .title{
      font-size: 12px;
      color: #999999;
      line-height: 32px;
    }
  }
}
.footBtn{
  width: 100%;
  margin-top: 20px;
  text-align: center;
  padding-top: 20px;
  box-sizing: border-box;
  border-top: 1px solid #E5E5E5;
}
.el-dialog__wrapper{
  ::v-deep .el-dialog{
    max-height:75%;
    overflow: auto;
    .el-dialog__header{
      border-bottom: 1px solid #E5E5E5;
    }
    .el-dialog__body{
      padding-top: 0;
    }
  }
}
.power{
  width: 100%;
  .power_ul{
    width: 100;
    padding: 13px 0;
    border-bottom: 1px solid #E5E5E5;
    .li{
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #888888;
      .li_title{
        line-height: 32px;
      }
      .el-radio-group{
        width: 100%;
        .el-radio{
          width: 100%;
          margin: 0;
          line-height: 25px;
        }
      }
    }
    .li_flex{
      display: flex;
      color: #000000;
      justify-content: space-between;
    }
  }
}
</style>
