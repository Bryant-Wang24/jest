<template>
  <div class="permission">
    <div v-for="(item, index) in list" :key="item.key" class="box">

      <div class="top">
        <span class="title left">{{ item.title }}</span>
        <div class="right">
          <span class="memberNum">{{ item.members.length }}人</span>
          <ElButton type="text" @click="addMember(item, index)">添加成员</ElButton>
        </div>
      </div>

      <div class="desc">{{ item.desc }}</div>

      <div v-if="item.isRadio" class="bottom">
        <el-radio-group v-model="item.radioValue" class="radios">
          <el-radio v-for="radio in item.radios" :key="radio.label" class="radioItem" :label="radio.label">{{ radio.text }}</el-radio>
        </el-radio-group>
      </div>

    </div>
    <ElDialog
      :title="`选择`"
      :visible.sync="visible"
      append-to-body
      width="50%"
    >
      <UserTree v-if="visible" ref="userTree" class="mb-20" :off-ids="offIds" :ids="ids" />
      <div class="btn">
        <ElButton type="primary" @click="setPermissionMember">确定</ElButton>
        <ElButton @click="visible = false">取 消</ElButton>
      </div>
    </ElDialog>
  </div>
</template>

<script>
import UserTree from '@/components/UserTree'
const TEXT = {
  'edit_applyToDownload': '需申请下载',
  'edit_directDownload': '可直接下载',
  'view_applyToDownload': '需申请下载',
  'view_directDownload': '可直接下载'
}
export default {
  components: { UserTree },
  props: {
    currentPermission: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      list: [],
      members: {}, // 用于改变权限人的数据
      groupKey: null,
      offIds: [], // userTree禁用id
      ids: [], // userTree已选id
      currentIndex: {} // 当前正在设置的权限list index
    }
  },
  watch: {
    currentPermission: {
      handler(v) {
        this.initList(v)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initList(data) {
      const { memberMap, permissionGroupConfigMap } = data
      const list = []

      for (const key in permissionGroupConfigMap) {
        const members = memberMap[key]
        const permissionGroupConfig = permissionGroupConfigMap[key]
        const { canSwitchToKeys = null } = permissionGroupConfig
        list.push({
          members,
          key,
          isRadio: !!canSwitchToKeys,
          radioValue: canSwitchToKeys ? key : '',
          radios: this.initRadios(canSwitchToKeys, key),
          ...permissionGroupConfig
        })
      }

      this.list = list.sort((a, b) => {
        return a.order - b.order
      })
    },
    initRadios(canSwitchToKeys, key) {
      if (!canSwitchToKeys) return []

      const radios = [{
        label: key,
        text: TEXT[key]
      }, {
        label: canSwitchToKeys[0],
        text: TEXT[canSwitchToKeys[0]]
      }]

      return radios.sort((a, b) => {
        return a.text.localeCompare(b.text)
      })
    },
    addMember(permission, index) {
      this.currentIndex = index

      const { members, key } = permission

      // this.groupKey = key
      this.offIds = this.getOtherSelectedIds(key) // 获取其他权限组选中的ids
      this.ids = members.map(t => t.id)
      this.visible = true
    },
    setPermissionMember() {
      const nodes = [...this.$refs.userTree.nodes()]
      // const members = nodes.map(t => {
      //   const { id, type } = t
      //   return { id, type }
      // })
      this.list[this.currentIndex].members = nodes
      // this.list[this.currentIndex].membersParams = members
      // this.members = { members, groupKey: this.groupKey }
      this.visible = false
      // this.$emit('setPermissionMember', { members, groupKey: this.groupKey })
    },
    getOtherSelectedIds(currentKey) {
      const list = this.list
      let offIds = []
      for (let i = 0; i < list.length; i++) {
        const permissionGroup = list[i]
        const { key, members } = permissionGroup
        if (key !== currentKey) {
          const ids = members.map(t => t.id)
          offIds = [...offIds, ...ids]
        }
      }
      return offIds
    },
    getFormData() {
      const radios = this.list.filter(t => t.isRadio)
      const params = {
        members: [],
        groupConfig: {}
      }
      for (let i = 0; i < this.list.length; i++) {
        const group = this.list[i]
        const { members: _members, radioValue, key, isRadio } = group
        const members = _members.map(t => {
          const { id, type } = t
          return { id, type }
        })
        const groupKey = isRadio ? radioValue : key
        params.members.push({ members, groupKey })
      }

      for (let i = 0; i < radios.length; i++) {
        const radio = radios[i]
        const { key, radioValue } = radio
        params.groupConfig[key] = radioValue
      }
      return params
    }
  }

}
</script>

<style lang="scss" scoped>
.permission {
  margin-bottom: 20px;
}
.box {
  padding: 20px 10px;
  border-top: 1px solid #DCDFE6;
  font-size: 14px;
  .top {
    display: flex;
    justify-content: space-between;
    .title{
      line-height: 36px;
    }
    .right{
      .memberNum {
        margin-right: 6px;
      }
    }
  }
  .desc {
    color: #888;
  }
  .bottom {
    .radios {
      display: flex;
      flex-direction: column;
      margin-top: 3px;
      .radioItem {
        margin-top: 10px;
      }
    }
  }
}

.btn {
  text-align: center;
}
</style>
