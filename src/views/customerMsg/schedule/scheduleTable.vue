<template>
  <div id="scheduleTable">
    <div class="container">
      <!-- 页面操作按钮 -->
      <div class="operate">
        <el-button v-if="hasRolePermission('ScheduleView_add')" type="primary" @click="handleShowDialog('addScheduleForm')">预订展期</el-button>
        <!-- <el-button type="primary" @click="handleShowDialog('detail', [{id:'1005', projectName: '第一个数据'}])">普通详情</el-button>
        <el-button type="primary" @click="handleShowDialog('detail', [{id:'1005', projectName: '第一个数据'},{id:'1008', projectName: '第二个数据'}],true)">冲突详情</el-button> -->
      </div>
      <!-- 排期展示 -->
      <div class="scheduleTable">
        <div class="legend">
          <div v-for="item in legends" :key="item.label" class="legendItem">
            <span class="colorBlock" :style="{ backgroundColor: item.color }" />
            <span class="label">{{ item.label }}</span>
          </div>
        </div>
        <div class="table">
          <scheduleSingleView v-if="viewType === VIEW_TYPE_NUMBER.single" :view-data="currentViewData" />
          <scheduleAllView v-else-if="viewType === VIEW_TYPE_NUMBER.all" :view-data="currentViewData" />
        </div>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog
      :visible.sync="dialog.dialogShow"
      :title="dialog.dialogTitle"
      :width="diologWidth"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <component :is="comp" :site-infos="dialog.siteInfos" :is-conflict-info="isConflictInfo" @close="handleClose" />
    </el-dialog>
  </div>
</template>

<script>

import { LEGENDS, VIEW_TYPE_NUMBER } from '@/common/salesManagement/schedule'

import addScheduleForm from './addScheduleForm'
import scheduleSingleView from './scheduleSingleView'
import scheduleAllView from './scheduleAllView'
import detail from './detail'
export default {
  components: { addScheduleForm, detail, scheduleSingleView, scheduleAllView },
  props: {
    viewData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      legends: LEGENDS,
      currentViewData: {}, // 查询出来的视图数据
      viewType: VIEW_TYPE_NUMBER.single, // 视图类型
      VIEW_TYPE_NUMBER: VIEW_TYPE_NUMBER,
      dialog: {
        dialogShow: false,
        dialogTitle: '预订展期',
        siteInfos: []
      },
      comp: '',
      isConflictInfo: false
    }
  },
  computed: {
    diologWidth() {
      let diologWidth = '40%'
      switch (this.comp) {
        case 'detail':
          diologWidth = '65%'
          break
        default:
          break
      }
      return diologWidth
    }
    // isConflictInfo() {
    //   return this.comp === 'detail'
    // }
  },
  watch: {
    viewData: {
      handler(data) {
        const { filterData } = data
        this.currentViewData = data
        this.viewType = filterData?.number || VIEW_TYPE_NUMBER.single
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.dialog.dialogShow = false
      this.comp = ''
    },
    handleShowDialog(comp, infos = [], isConflictInfo = false) {
      if (comp === 'detail') {
        this.dialog.siteInfos = infos
      }
      this.isConflictInfo = isConflictInfo
      this.comp = comp
      this.dialog.dialogShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
#scheduleTable {
  .container {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #ffffff;
    .operate {
      margin-bottom: 20px;
    }
    .scheduleTable {
      .legend {
        display: flex;
        margin-bottom: 20px;
        font-size: 14px;
        .legendItem {
          display: flex;
          align-items: center;
          margin-right: 12px;
          .colorBlock {
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
        }
      }
      .table {
        .tableContent {
          border: 1px solid #eeeeee;
          border-collapse: collapse;
          tr th,
          tr td {
            border: 1px solid #eeeeee;
          }
        }
      }
    }
  }
}
</style>
