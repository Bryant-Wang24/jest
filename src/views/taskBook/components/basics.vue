<template>
  <div class="basics">
    <el-row>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">任务书编号: </div>
          <div class="value">{{ basicsForm.code }}</div>
        </div>
        <div class="formItem">
          <div class="label">主场承建商: </div>
          <el-tooltip :content="basicsForm.CONTRACTOR" :disabled="!basicsForm.CONTRACTOR">
            <div class="value">{{ basicsForm.CONTRACTOR }}</div>
          </el-tooltip>
        </div>
        <div class="formItem">
          <div class="label">项目负责人: </div>
          <div class="value">{{ basicsForm.projectLeader }}</div>
        </div>
        <div class="formItem">
          <div class="label">任务书状态: </div>
          <div v-if="basicsForm.taskBookState === 'NO_GENERATED' || basicsForm.taskBookState === null" class="value">未生成</div>
          <div v-if="basicsForm.taskBookState === 'HAS_GENERATED'" class="value">已生成</div>
          <div v-if="basicsForm.taskBookState === 'HAS_ISSUED'" class="value">已下发</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">主办单位: </div>
          <el-tooltip :content="basicsForm.hostCompany">
            <div class="value">{{ basicsForm.hostCompany }}</div>
          </el-tooltip>
        </div>
        <div class="formItem">
          <div class="label">地毯商: </div>
          <el-tooltip :content="basicsForm.CARPET_DEALER" :disabled="!basicsForm.CARPET_DEALER">
            <div class="value">{{ basicsForm.CARPET_DEALER }}</div>
          </el-tooltip>
        </div>
        <div class="formItem">
          <div class="label">统筹负责人: </div>
          <div class="value">{{ basicsForm.leader }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">类型: </div>
          <div class="value">{{ basicsForm.type === 'EXHIBITION' ? '展会' : basicsForm.type === 'MEETING' ? '纯会议' : basicsForm.type === 'FEAST' ? '纯宴会' : basicsForm.type === 'BANQUET' ? '光地与宴会' : '光地与会议' }}</div>
        </div>
        <div class="formItem">
          <div class="label">主场承运商: </div>
          <el-tooltip :content="basicsForm.CARRIER" :disabled="!basicsForm.CARRIER">
            <div class="value">{{ basicsForm.CARRIER }}</div>
          </el-tooltip>
        </div>
        <div class="formItem">
          <div class="label">人数规模: </div>
          <div class="value">{{ basicsForm.numberPeople }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    basicsForm: {
      type: Object,
      default: () => {
        return {
          CONTRACTOR: [],
          CARPET_DEALER: [],
          CARRIER: []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .basics {
    padding: 20px;
    font-size: 14px;
    .formItem {
      display: flex;
      margin-bottom: 14px;
        // width: 100%;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        .label {
          // width: 160px;
          margin-right: 10px;
          margin-left: 10px;
          text-align: left;
          color: #666;
        }
        .value {
          flex: 1;
          word-wrap: break-word;
          width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
        }
    }
  }
</style>
