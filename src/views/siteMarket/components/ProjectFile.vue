<template>
  <div class="ProjectFile">
    <div class="row">
      <div class="left">
        <span class="title">文件类别</span>
        <el-menu
          :default-active="activeIndex"
          class="menu"

          text-color="#000000"
        >
          <el-menu-item v-for="item in typeMenus" :key="item.id" :index="item.value" @click="handleClickMenuItem(item)">
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right">
        <FileList ref="Reset" :type-menus="typeMenus" :type-menus-object="typeMenusObject" :current-info="currentInfo" />
      </div>
    </div>

  </div>
</template>
<script>
import FileList from './FileList'
export default {
  components: {
    FileList
  },
  data() {
    return {
      typeMenus: [],
      typeMenusObject: {},
      activeIndex: 'ALL',
      currentInfo: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 切换清空
    Reset() {
      this.$refs.Reset.handleReset()
    },
    init() {
      this.getMenuList()
    },
    getMenuList() {
      this.$api.ProjectFile.getTypeMenus().then(res => {
        const ALL = { label: '全部文件', value: 'ALL', children: res }

        this.typeMenus = [ALL, ...res]
        this.initTypeMenusObject()
        this.handleClickMenuItem(ALL)
      })
    },
    initTypeMenusObject() {
      const typeMenusObject = {}

      for (let i = 0; i < this.typeMenus.length; i++) {
        const menu = this.typeMenus[i]
        const { value, children = [] } = menu
        const childrenObj = {}
        children.forEach(t => {
          childrenObj[t.value] = t.label
        })
        menu.childrenObj = childrenObj

        typeMenusObject[value] = menu
      }

      this.typeMenusObject = typeMenusObject
    },
    handleClickMenuItem(item) {
      this.activeIndex = item.value
      this.currentInfo = item
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.ProjectFile {
  padding-top: 20px;
  height: 100%;
  // margin-top: 20px;
  // height: 100% !important;
  .el-menu-item.is-active {
    background-color: rgba($--custom--color--primary, .1) !important;
  }
  .el-menu-item {
    height: 36px;
    line-height: 36px;
  }
  .row {
    display: flex;
    height: 100%;
    // .left {
    //   margin-right: 20px;
    // }
    .right {
      padding-left: 20px;
      flex: 1;
    }
    .title {
      width: 220px;
      display: block;
      line-height: 60px;
      padding: 0 20px;
      background-color: rgb(245, 245, 245);
      font-size: 16px;
    }
    .menu {
      width: 220px;
      height: 100%;
      background-color: rgb(245, 245, 245);
      border: none;
      // background-color: #dfe7e6;
    }
    .slotitem {
      font-size: 16px;
      color: black;
    }
    .elmenuTitle{
      font-size: 16px;
      color: #000;
    }
  }
}
</style>
