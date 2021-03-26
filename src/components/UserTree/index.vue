<template>
  <div ref="userTree" class="user-tree">
    <div class="left">
      <el-input v-model.trim="filterText" placeholder="搜索成员、部门" prefix-icon="el-icon-search" />
      <el-tabs v-model="tabType">
        <el-tab-pane label="按组织架构" :name="TYPE.ORGANIZATION">
          <el-scrollbar>
            <div class="tree-wrap">
              <el-tree ref="organizationTree" :default-expanded-keys="[...ids]" :filter-node-method="filterNode" :props="defaultProps" :data="organization" node-key="id" show-checkbox :check-strictly="true" @check-change="handleCheckChange" />
              <!-- <el-tree :props="defaultProps" node-key="id" show-checkbox :load="loadNode" lazy /> -->
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="按角色" :name="TYPE.ROLE">
          <el-scrollbar>
            <div class="tree-wrap">
              <el-tree ref="roleTree" :default-expanded-keys="[...ids]" :filter-node-method="filterNode" :props="defaultProps" :data="role" node-key="id" show-checkbox :check-strictly="true" @check-change="handleCheckChange" />
              <!-- <el-tree :props="defaultProps" node-key="id" show-checkbox :load="loadNode" lazy /> -->
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- line -->
    <div class="middle" />
    <div class="right">
      <span class="title">已选择的部门、成员或角色</span>
      <el-scrollbar>
        <div class="tag-wrap">
          <div v-for="(tag, index) in checkList" :key="tag.id" class="tag-item-wrap">
            <el-tag
              closable
              type="info"
              @close="deleteTag(tag, index)"
            >
              {{ tag.entity.name || '' }}
            </el-tag>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { debounce } from '@/utils'
import { mapState, mapMutations } from 'vuex'
const CHECK_TYPE = {
  OFFICE: 'OFFICE',
  ROLE: 'ROLE',
  USER: 'USER'
}
const TYPE = {
  ORGANIZATION: 'ORGANIZATION',
  ROLE: 'ROLE'
}
export default {
  props: {
    ids: { // 默认选中的id
      type: Array,
      default: () => {
        return []
      }
    },
    auto: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    offIds: { // 禁选的id
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      TYPE,
      filterText: '',
      tabType: TYPE.ORGANIZATION,
      organization: [],
      role: [],
      defaultProps: {
        children: 'childrenList',
        label: (data, node) => {
          return data.entity.name || ''
        },
        disabled: (data, node) => {
          return this.offIds.includes(data.id) || node.parent && node.parent.disabled === true
        }
      },
      checkList: []
      // refsFilter: debounce(() => { console.log('1') }, 200)
    }
  },
  computed: {
    ...mapState({
      state_organization: state => state.approve.userTree.organization,
      state_role: state => state.approve.userTree.role
    })
  },
  watch: {
    filterText(v) {
      this.refsFilter(v)
    }
  },
  async mounted() {
    const loadingInstance = Loading.service({
      target: this.$refs.userTree
    })
    this.initListenter()
    if (this.auto) {
      if (this.state_organization?.length > 0) {
        this.organization = this.state_organization
      } else {
        await this._getUserTree({ type: 'OFFICE', userIncluded: true })
      }

      if (this.state_role?.length > 0) {
        this.role = this.state_role
      } else {
        await this._getUserTree({ type: 'ROLE', userIncluded: false })
      }
      // await this._getUserTree({ type: 'OFFICE', userIncluded: true })
      // await this._getUserTree({ type: 'ROLE', userIncluded: false })
      this.$nextTick(() => {
        this.$refs.organizationTree.setCheckedKeys([...this.ids])
        this.$refs.roleTree.setCheckedKeys([...this.ids])
        this.handleCheckChange()
      })
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        loadingInstance.close()
      })
    } else {
      this.organization = this.data.organization
      this.role = this.data.role
    }
  },
  destroyed() {
  },
  methods: {
    initListenter() {
      this.refsFilter = debounce(() => {
        this.$refs.organizationTree.filter(this.filterText)
        this.$refs.roleTree.filter(this.filterText)
      }, 200)
    },
    // 获取选中的nodes
    nodes() {
      return this.checkList
    },
    filterNode(value, data) {
      if (!value) return true
      return data?.entity?.name?.includes(value)
    },
    handleCheckChange(data, checked) {
      const organization = this.$refs.organizationTree.getCheckedNodes()
      const role = this.$refs.roleTree.getCheckedNodes()

      this.checkList = [...organization, ...role]
    },
    deleteTag(node, index) {
      const { type } = node
      this.checkList.splice(index, 1)
      switch (type) {
        case CHECK_TYPE.OFFICE: case CHECK_TYPE.USER: {
          this.$refs.organizationTree.setChecked(node, false)
          break
        }
        case CHECK_TYPE.ROLE: {
          this.$refs.roleTree.setChecked(node, false)
          break
        }
        default:
          break
      }
    },
    _getUserTree(params) {
      return new Promise((resolve, reject) => {
        this.$api.user.getUserTree(params).then(res => {
          // console.log('getUserTree', res.childrenList)
          if (params.type === 'OFFICE') {
            this.organization = res.childrenList
            this.SET_ORGANIZATION(res.childrenList)
          } else if (params.type === 'ROLE') {
            this.role = res.childrenList
            this.SET_ROLE(res.childrenList)
          }
          resolve()
          // this.$nextTick(() => {
          //   this.$refs.organizationTree.setCheckedKeys([...this.ids])
          //   this.$refs.roleTree.setCheckedKeys([...this.ids])
          //   this.handleCheckChange()
          // })
        })
      })
    },
    ...mapMutations('approve', {
      SET_ORGANIZATION: 'SET_ORGANIZATION',
      SET_ROLE: 'SET_ROLE'
    })
  }
}
</script>

<style scoped lang="scss">
.user-tree {
  width: 100%;
  display: flex;
  .left {
    width: 50%;
  }
  .middle {
    margin: 0 20px;
    width: 1px;
    height: 460px;
    background-color: #E5E5E5;
  }
  .right{
    flex: 1;
    .title {
      display: block;
      margin-bottom: 20PX;
      color: #999999;
    }
    .tag-wrap {
      display: flex;
      flex-direction: column;
      height: 400px;
      .tag-item-wrap {
        margin-bottom: 12px;
      }
    }
  }
}
.tree-wrap {
  height: 400px;
}
</style>
