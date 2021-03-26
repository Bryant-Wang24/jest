<template>
  <div id="scheduleView">
    <div class="container">
      <!-- title -->
      <MainTitle title="排期视图" />
      <div class="filterForm">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="54px"
          class="demo-form"
          hide-required-asterisk
        >
          <el-form-item label="视图：" prop="number">
            <el-radio-group v-model="form.number" @change="handleRadioNumber">
              <el-radio
                v-for="item in numbers"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="场地：" prop="siteId" class="">
            <!-- <el-col> -->
            <div class="row">
              <el-form-item prop="siteType" class="form-item">
                <el-select
                  v-model="form.siteType"
                  placeholder="请选择场地类型"
                  @change="handleSelectSiteType"
                >
                  <WrapOption
                    v-for="item in SITES_TYPE_ARRAY"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col v-if="form.number === VIEW_TYPE_NUMBER.single"> -->
              <el-form-item v-if="form.number === VIEW_TYPE_NUMBER.single" prop="siteId" class="form-item">
                <el-select
                  v-model="form.siteId"
                  placeholder="请选择场地"
                  @change="handleSelectSite"
                >
                  <WrapOption
                    v-for="item in sites"
                    :key="item.id"
                    :label="item.siteName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <!-- </el-col> -->
          </el-form-item>
          <el-form-item label="年份：" prop="year">
            <!-- <el-col> -->
            <div class="row">
              <el-form-item prop="year" class="form-item">
                <el-select v-model="form.year" placeholder="请选择年份">
                  <WrapOption
                    v-for="item in years"
                    :key="item.year"
                    :label="item.year"
                    :value="item.year"
                  />
                </el-select>
              </el-form-item>
              <!-- </el-col>
            <el-col> -->
              <el-form-item prop="month" style="width:400px" class="form-item">
                <el-select
                  v-model="form.month"
                  placeholder="请选择月份"
                  multiple
                  class="fullWidth"
                  @change="handleSelectMouth"
                >
                  <WrapOption
                    v-for="item in months"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            <!-- </el-col> -->
            </div>
          </el-form-item>
          <el-form-item label="状态：" prop="state">
            <el-checkbox-group v-model="form.state">
              <el-checkbox
                v-for="item in states"
                :key="item.value"
                :label="item.value"
              >
                <span :class="`checkboxTip ${item.className}`">{{
                  item.label
                }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('form')"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <scheduleTable :view-data="viewData" />
  </div>
</template>

<script>
import {
  // SITES_TYPE_ARRAY,
  // SITE_TYPE,
  MONTHS,
  VIEW_TYPE_NUMBER,
  VIEW_TYPE_NUMBER_ARRAY,
  STATE,
  STATE_DEFAULT,
  MONTHS_ALL_VALUE
  // SITE_TYPE_ENUM
} from '@/common/salesManagement/schedule'
import { SITE_TYPE_ENUM, SITES_TYPE_ARRAY } from '@/common/site'
// import moment from 'moment'
import scheduleTable from './schedule/scheduleTable'
import WrapOption from '@/components/base/WrapOption'
import { mapMutations } from 'vuex'
import { EventBus } from '@/utils/event-bus'
import MainTitle from '@/components/base/MainTitle'

export default {
  name: 'ScheduleView',
  components: { scheduleTable, MainTitle, WrapOption },
  data() {
    return {
      VIEW_TYPE_NUMBER: VIEW_TYPE_NUMBER, // 视图Obejct
      numbers: VIEW_TYPE_NUMBER_ARRAY, // 单馆全馆视图
      SITE_TYPE_ENUM,
      SITES_TYPE_ARRAY,
      // siteType: this.SITE_TYPE,
      states: STATE,
      sites: [], // 根据siteType获取场地信息
      months: MONTHS,
      // years: [`${new Date().getFullYear()}`], // 默认只有当前年份
      years: [],
      form: {
        number: VIEW_TYPE_NUMBER.single, // 视图
        siteId: '', // 场地
        siteType: null, // 类型
        // year: `${new Date().getFullYear()}`, // 年份
        year: '', // 年份
        month: ['01', '02', '03', '04', '05', '06'], // 月份
        state: STATE_DEFAULT // 状态
      },
      rules: {
        state: [{ required: true, message: '请选择' }]
      },
      viewData: { // 查询出来的预定数据
        filterData: {},
        data: {}
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.form.siteType = this.SITES_TYPE_ARRAY?.[0].value
      this.initPageData()
    })
    EventBus.$on('schedule_refresh', () => {
      this.submitForm()
    })
  },
  methods: {
    async initPageData() {
      // 取场地
      await this._getSiteListFromSiteType({ types: [this.SITE_TYPE_ENUM.PAVILION].join(',') })
      if (!this.form.siteId) return
      // 取年份
      await this._getYearsFromType({
        type: this.form.siteType,
        siteId: this.form.siteId
      })
      const { number, siteType, siteId, year, month, state } = this.form
      const params = {
        number,
        type: siteType,
        siteId,
        year,
        month,
        state
      }
      this._getScheduleView(params)
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const { number, siteId, siteType, year, month, state } = this.form
          const params = {
            number,
            type: siteType,
            siteId: siteId,
            year,
            state,
            month
          }
          if (month[0] === '0') {
            // 全选月份
            params['month'] = [...MONTHS_ALL_VALUE]
          }
          if (number === VIEW_TYPE_NUMBER.all) { // 全馆筛选无需指定场地，删除此属性
            Reflect.deleteProperty(params, 'siteId')
          }
          this._getScheduleView(params)
        } else {
          console.log('error submit!!')
          this.$message.warning('请完善搜索项')
          return false
        }
      })
    },
    async handleRadioNumber(value) {
      console.log(value)
      if (value === VIEW_TYPE_NUMBER.single) {
        // 取场地
        await this._getSiteListFromSiteType({ types: [this.SITE_TYPE_ENUM.PAVILION].join(',') })
      }
      // 取年份
      try {
        await this._getYearsFromType({
          type: this.form.siteType,
          siteId: value === VIEW_TYPE_NUMBER.single ? this.form.siteId : ''
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 类型change，重新获取年份和场地列表
    async handleSelectSiteType(value) {
      const viewType = this.form.number
      try {
        await this._getSiteListFromSiteType({ types: [this.form.siteType].join(',') })
        const siteId = viewType === VIEW_TYPE_NUMBER.single ? this.form.siteId : ''
        if (!siteId) return
        await this._getYearsFromType({ // 取年份
          type: this.form.siteType,
          siteId: viewType === VIEW_TYPE_NUMBER.single ? this.form.siteId : ''
        })
      } catch (error) {
        console.log(error)
      }
    },
    async handleSelectSite(value) {
      try {
        await this._getYearsFromType({
          type: this.form.siteType,
          siteId: this.form.siteId
        })
      } catch (error) {
        console.log(error)
      }
    },
    handleSelectMouth(value) {
      console.log(value)
      const index = value.indexOf('0')
      if (value[value.length - 1] === '0' || value.length === 12) {
        this.form.month = ['0']
      } else if (index !== -1) {
        this.form.month.splice(index, 1)
      }
    },
    getFilterData(params) {
      let filterData = {}
      const { number, siteId } = params
      if (number === VIEW_TYPE_NUMBER.single) {
        const sitesItem = this.sites.filter(item => {
          return item.id === siteId
        })
        // const { siteName } = sitesItem?.[0]
        // filterData = { ...params, siteName }
        filterData = { ...params, sites: sitesItem }
      } else {
        // const siteName = this.sites.map(item => {
        //   return item.siteName
        // })
        filterData = { ...params, sites: this.sites }
      }
      this.setFilterForm({ ...filterData })
      return filterData
    },
    _getSiteListFromSiteType(params) {
      return this.$api.schedule.getSiteList(params).then(res => {
        // console.log(res)
        const list = res
        const defaultSiteId = list[0]?.id
        this.sites = list
        this.form.siteId = defaultSiteId
      })
    },
    _getYearsFromType(params) {
      return this.$api.schedule.getYearsFromType(params).then(res => {
        // console.log('getYearsFromType', res)
        this.years = res
        this.form.year = res?.[0]?.year
      })
    },
    _getScheduleView(params) {
      const filterData = this.getFilterData(params)
      console.log('filterData', filterData)
      this.$api.schedule.getScheduleView(params).then(res => {
        console.log('getScheduleView', res)
        this.viewData = { filterData, data: res }
      }).catch(error => {
        console.log(error)
      })
    },
    ...mapMutations('schedule', { setFilterForm: 'SET_FILTER_FORM' })
  }
}
</script>

<style lang="scss" scoped>
#scheduleView {
  .el-select {
    width: 200px;
  }
  padding: 20px;
  .container {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #ffffff;
  }
}

.checkboxTip {
  display: block;
  padding: 2px 6px;
  color: #ffffff;
  border-radius: 2px;
}
.keepTip {
  background: #52c15e;
}
.lockTip {
  background: #ff7600;
}
#scheduleView {
  .container {
    .fullWidth {
      width: 100%;
    }
  }
}
.row {
  display: flex;
  .form-item {
    margin-right: 20px;
  }
}
</style>
