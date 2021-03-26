<template>
  <el-card class="SingleExhibitionRent">
    <div slot="header" class="clearfix">
      <span class="title">{{ titleList.singleExhibitionRenttitle }}</span>
      <div class="clearfixright">
        <el-radio-group
          v-model="radio"
          class="titleRight"
          size="mini"
          @change="hanadleTimeRadioChange"
        >
          <el-radio-button label="QUARTER">季度</el-radio-button>
          <el-radio-button label="MONTH">月份</el-radio-button>
        </el-radio-group>
        <template>
          <el-select
            v-model="value"
            size="mini"
            :placeholder="HOLDER[radio]"
            class="monthSelect"
            clearable
            @change="hanadleTimeSelectChange"
          >
            <el-option
              v-for="(item, index) in list"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </div>
    </div>
    <div class="content" style="height:380px; width:502px;overflow:auto">
      <div class="content-title">
        <span class="content-title1">排序</span>
        <span class="content-title2">场地</span>
        <span class="content-title3">出租率</span>
      </div>
      <div
        v-for="(item, index) in singleExhibitionRentData"
        :key="index"
        class="content-item"
      >
        <span class="content-item1">{{ index+1 }}</span>
        <el-tooltip v-if="item.name.length>=6" placement="top">
          <div slot="content">{{ item.name }}</div>
          <span v-if="item.name.length>=6" class="content-item2">{{ item.name }}</span>
        </el-tooltip>
        <span v-if="item.name.length<6" class="content-item2">{{ item.name }}</span>
        <el-progress
          :percentage="initOccupancy(item.occupancy)"
          :format="() => {
            return format(item)
          }"
          class="content-item3"
          :stroke-width="16"
          color="#ffd840"
          style="font-size:12px"
        />
      </div>
      <!-- <div id="chart" /> -->
    </div>
  </el-card>
</template>

<script>
// import echarts from 'echarts'
// import bus from '@/common/bus'

const HOLDER = {
  QUARTER: '所有季度',
  MONTH: '所有月份'
}

const LIST = {
  QUARTER: [1, 2, 3, 4],
  MONTH: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

export default {
  props: {
    singleExhibitionRentData: {
      type: Array,
      default: () => []
    },
    titleList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      HOLDER,
      value: '',
      radio: 'QUARTER'
    }
  },
  computed: {
    list() {
      return LIST[this.radio]
    }
  },
  methods: {
    initData() {
      this.value = ''
      this.radio = 'QUARTER'
    },
    format(item) {
      return `${item.occupancy}%`
    },
    initOccupancy(occupancy) {
      if (!occupancy || occupancy < 0) return 0
      if (occupancy > 100) return 100
      return occupancy
    },
    hanadleTimeSelectChange(val) {
      if (!this.value) {
        this.value = ''
      } else {
        this.value = val
        this.$emit('siteOccupancy', { timeValue: this.value, timeUnit: this.radio })
      }
    },
    hanadleTimeRadioChange() {
      this.value = ''
      this.$emit('siteOccupancy', { timeValue: '', timeUnit: '' })
    }
  }
}
</script>

<style lang="scss" scoped>
.SingleExhibitionRent {

  height: 100%;
  display: flex;
  flex-direction: column;
  ::v-deep {
    .el-card__body {
      flex: 1;
    }
  }
  .title {
    font-weight: 600;
  }
  .content {
    width: 100%;
    flex-direction: column;
    #chart {
      width: 100%;
    }
    .content-title {
      color: #cdcdcd;
      font-size: 12px;
      display: flex;
      margin-bottom: 10px;
      .content-title1 {
        width: 40px;
        margin-right: 5px;
      }
      .content-title2 {
        flex: 1;
        margin-right: 5px;
      }
      .content-title3 {
        margin-right: 12px;
      }
    }
    .content-item {
      margin-bottom: 15px;
      font-size: 14px;
      display: flex;
      .content-item1 {
        width: 40px;
        margin-right: 5px;
      }
      .content-item2 {
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 60px;
        margin-right: 5px;
      }
      ::v-deep .content-item3 {
        flex: 1;
        font-size: 12px;
        .el-progress-bar {
          padding-right: 65px;
          margin-right: -60px;
          .el-progress-bar__outer {
            border-radius: 0px;
            .el-progress-bar__inner {
              border-radius: 0px;
            }
          }
        }
        .el-progress__text{
          font-size: 12px !important;
        }
      }
    }
  }
  .clearfix {
    position: relative;
    .clearfixright {
      // display: block;
      // white-space:nowrap;
      position: absolute;
      right: 0;
      top: -2px;
      .titleRight {
        margin-right: 10px;
      }
      .monthSelect {
        font-weight: 500;
        ::v-deep .el-input__inner {
          border: none;
        }
      }
    }
  }
  .el-select {
    width: 120px;
  }
  ::v-deep .el-input__suffix-inner .el-input__suffix-inner {
    appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    -webkit-appearance: none;
  }
}
</style>
