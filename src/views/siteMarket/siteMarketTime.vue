<template>
  <Layout id="siteMarketTime" :use-head="false" :use-foot="false" :auto-height="true">
    <!-- <div id="siteMarketTime"> -->
    <!-- <div class="container"> -->
    <MainTitle :title="pageTitle">
      <warning v-if="projectState === SCHEDULE_STATE['RESCINDED']" slot="label" />
    </MainTitle>
    <!-- 场地&时间安排 -->
    <RowText :text="'场地&时间安排'" />
    <div class="tip pl-20">
      <div class="mb-10">1. 此处仅可修改展期内每日起止时间，场地面积无法进行修改。</div>
      <div>2. 若场地、面积与日期范围发生变更，需前往销售管理-场地预定申请进行档期变更。</div>
    </div>
    <!-- 场地&时间安排表格 -->
    <ScheduleForm
      ref="siteTimeArrangeForms"
      :site-area-read-only="true"
      :is-conflict="isConflict"
      :is-lock-conflict="isLockConflict"
      :is-meeting-type="isMeetingType"
      :site-options="siteOptions"
      :conflict-list="conflictList"
      :sale-date="saleDate"
      @initConflictArgs="initConflictArgs"
      @siteTimeArrangeFormsSiteIdChange="siteTimeArrangeFormsSiteIdChange"
    />

    <div class="siteTimeArrange">
      <!-- 预留其它时间 -->
      <div class="otherTime">
        <div class="otherTime-title mb-20">预留其它时间:</div>
        <span class="cnmSpan">可为展会预留进场时间,在排期表上进行展示</span>
        <div class="otherTime-type">
          <el-radio-group v-model="radio" @change="handleRadioChange">
            <el-radio :label="0">无需预留时间</el-radio>
            <el-radio :label="1">需预留时间</el-radio>
          </el-radio-group>
        </div>
        <div v-if="radio === 1" class="reservedFormWrapper">
          <el-form
            v-for="(item,index) in reservedTile"
            :key="index"
            ref="siteTim"
            :model="item"
            label-width="100px"
            class="demo-ruleForm myForm bottomForm"
          >
            <el-form-item v-if="index > 0" class="FormDelete">
              <el-button type="text" class="FormDelete-btn" @click="deleteReservedForm(index)">删除</el-button>
            </el-form-item>
            <el-form-item label="场地:">
              <el-select v-model="reservedTile[index].siteIds" multiple placeholder="请先选择场地" class="reservedSelect">
                <WrapOption
                  v-for="(name,siteIndex) in siteSchedules"
                  :key="siteIndex"
                  :label="name.siteName"
                  :value="name.siteId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="时间段:">
              <div v-for="(timeItem,timeIndex) in item.time" :key="timeIndex">
                <el-date-picker
                  v-model="timeItem.dateList"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                  align="right"
                  class="myPicker"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
                <span class="siteTimeSpan">每天</span>
                <el-time-picker
                  v-model="timeItem.startTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  class="timepicker"
                  placeholder="开始"
                />
                <el-time-picker
                  v-model="timeItem.endTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  class="timepicker"
                  placeholder="结束"
                />
                <el-button v-if="timeIndex === 0" type="text" @click="resetReservedTime(item.time)">重置</el-button>
                <el-button v-if="timeIndex === 0" type="text" @click="addReservedTime(index)">增加时间</el-button>
                <el-button v-if="timeIndex > 0" type="text" @click="deleteReservedTime(index,timeIndex)">删除</el-button>
              </div>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="item.remark" placeholder="(填选)" class="myInput" />
            </el-form-item>
          </el-form>
          <SiteTimeArrangeAddBtn class="mb-20" style="margin-top:20px;" @confirm="addReserved" />
        </div>
        <div class="saveBtnWrapper">
          <el-button v-if="hasRolePermission('siteMarketTime_save')" :disabled="disabled || projectState === SCHEDULE_STATE['RESCINDED']" type="primary" @click="save">保存</el-button>
        </div>
      </div>
    </div>
    <!-- </div> -->
    <!-- </div> -->
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import RowText from '@/components/rowText'
import MainTitle from '@/components/base/MainTitle'
import ScheduleForm from '@/views/SiteReserve/components/ScheduleForm'
import SiteTimeArrangeAddBtn from '@/views/SiteReserve/components/base/SiteTimeArrangeAddBtn'
import moment from 'moment'
import { intersection, getDateToArray } from '@/utils/date'
import { SCHEDULE_STATE, SiteTimeArrangeFromItemObject } from '@/common/site'
import { TIMETYPE, TIMETYPE_OBJECT } from '@/common/handoverSlipMgmt'
import { mapState } from 'vuex'
import WrapOption from '@/components/base/WrapOption'
// import { number } from 'echarts/lib/export'

// const TIME_TYPE = {
//   1: 'exh',
//   2: 'launch',
//   3: 'move'
// }

export default {
  components: { RowText, MainTitle, ScheduleForm, SiteTimeArrangeAddBtn, WrapOption, Layout },
  data() {
    return {
      SCHEDULE_STATE,
      disabled: false, // 提交按钮状态
      orderId: null, // 冲突接口id
      conflictList: [], // 档期冲突数组
      isConflict: false, // 档期冲突状态
      customerOptions: [], // 承、主办单位
      site: '', // 选中的场地
      exhibitionIndex: '', // 每个大展的下标
      // dialogVisible: false, // 日期重置提示弹框状态
      // centerDialogVisible: false, // 场地数量不一致提示弹框状态
      // isConflictSpan: false, // 与锁定冲突时的红色提示
      isConflictList: [], // 档期冲突数组
      radio: 0, // 预留转态
      pageTitle: '', // 标题
      // area: '', // 总面积
      saleDate: null, // 项目时间范围
      // startDate: '', // 起始时间
      // endDate: '', // 终止时间
      id: null,
      siteSale: {}, // 当前销售res数据
      siteSchedules: {},
      // 场地与面积
      // siteArea: [
      //   {
      //     siteId: '', // 场地id
      //     siteName: '', // 场地名字
      //     siteArea: ''// 面积
      //   }
      // ],
      // 预留时间
      reservedTile: [
        {
          siteIds: [],
          time: [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.RESERVED)],
          remark: ''

        }
      ],
      // 场地列表数据
      siteOptions: [],
      projectState: ''
    }
  },
  computed: {
    ...mapState({
      allTypes: state => state.site.allTypes
    }),
    isMeetingType() {
      return this.allTypes.some(t => {
        if (this.siteSale?.type === t.value) {
          return t.type === 'MEETING'
        }
      })
    },
    isLockConflict() {
      return this.conflictList.some(item => {
        return item.state === 1
      })
    }
  },
  // async created() {
  //   await this.get_SiteType() // 获取场地
  // },
  async mounted() {
    const { id } = this.$route.query
    this.id = id
    // await this.get_SiteType() // 获取场地
    await this.getSiteLists() // 获取场地
    this.getSiteResID(id)
  },
  methods: {
    // 获取场地
    async getSiteLists() {
      const res = await this.$api.siteList.getSite({})
      this.siteOptions = res.list
    },
    // 通过id获取场地
    getSiteResID(id) {
      this.$api.siteMarketList.getSiteMarketID(id).then(res => {
        const { siteSale, siteSchedules, information: timeInformation, state } = res
        const { orderId, projectName, startDate, endDate } = siteSale

        this.projectState = state
        this.siteSale = siteSale
        this.pageTitle = projectName
        this.saleDate = `${startDate} ~ ${endDate}`
        // this.siteArea = siteSchedules
        // this.startDate = startDate
        // this.endDate = endDate
        this.orderId = orderId || null

        const obj = {}
        for (let i = 0; i < timeInformation.length; i++) {
          const timeInfo = timeInformation[i]
          const { isFlag } = timeInfo
          if (!Object.prototype.hasOwnProperty.call(obj, isFlag)) {
            obj[isFlag] = [timeInfo]
          } else {
            obj[isFlag].push(timeInfo)
          }
        }

        const siteTimeArrangeForms = []
        for (const i in obj) {
          const siteTimes = obj[i]
          const newsiteTimes = this.outRepeatSite(siteTimes)
          const objArr = {
            exh: [],
            launch: [],
            move: [],
            siteIds: []
          }
          const ids = siteTimes.map(item => {
            return item.siteId
          })
          const idsSet = Array.from(new Set(ids))

          for (let j = 0; j < newsiteTimes.length; j++) {
            const siteTime = newsiteTimes[j]
            const { type, startTime, endTime, startHm, endHm } = siteTime

            objArr[TIMETYPE[type]]?.push({
              dateList: [startTime, endTime],
              startTime: startHm.substring(0, 5),
              endTime: endHm.substring(0, 5),
              orderId,
              type
            })

            if (type === TIMETYPE_OBJECT.DEPLOY) objArr.startTime = startTime
            if (type === TIMETYPE_OBJECT.CLOSE) objArr.endTime = endTime
          }
          // const item = Array.from(new Set(id))
          objArr.siteIds = idsSet
          objArr.pickerOptions = {
            disabledDate(time) {
              // debugger
              return moment(objArr.startTime).valueOf() > time.getTime() || time.getTime() > moment(objArr.endTime).valueOf()
            }
          }
          siteTimeArrangeForms.push(objArr)
        }
        this.setSiteTimeArrangeFormsData('siteTimeArrangeForms', [...siteTimeArrangeForms])

        // 格式化siteArea
        // const siteArea = [...this.siteArea]
        const siteArea = siteSchedules.map((item) => {
          let obj = {}
          const { siteId } = item
          for (let i = 0; i < this.siteOptions.length; i++) {
            const site = this.siteOptions[i]
            const { id, siteName } = site
            if (id === siteId) {
              obj = { ...item, info: { id: siteId }, siteName }
            }
          }
          return obj
        })
        this.siteSchedules = siteArea
        this.initReservedData(siteSchedules, timeInformation)
        this.setSiteTimeArrangeFormsData('siteArea', [...siteArea])

        // 手动调用获取冲突数据
        this.initConflictArgs()
      })
    },
    // 去重flag相同，且时间相同的数据
    outRepeatSite(siteTimes) {
      const obj = {}
      const arr = []
      for (let i = 0; i < siteTimes.length; i++) {
        const siteTime = siteTimes[i]
        const { type, startTime, endTime, startHm, endHm } = siteTime
        const stringKey = type + startTime + endTime + startHm + endHm
        if (!Object.prototype.hasOwnProperty.call(obj, stringKey)) {
          obj[stringKey] = [siteTime]
          arr.push(siteTime)
        } else {
          continue
        }
      }
      return arr
    },
    setSiteTimeArrangeFormsData(key, data) {
      this.$refs.siteTimeArrangeForms.setData(key, data)
    },
    getSiteTimeArrangeFormsData(key) {
      return this.$refs.siteTimeArrangeForms.getData(key)
    },
    // 格式化冲突接口需要的参数
    initConflictArgs() {
      const siteTimeArrangeForms = this.getSiteTimeArrangeFormsData('siteTimeArrangeForms')
      const rows = []
      for (let i = 0; i < siteTimeArrangeForms.length; i++) {
        const exhibition = siteTimeArrangeForms[i]
        const { siteIds, exh, launch, move } = exhibition
        const arr = [...exh, ...launch, ...move]
        const fliterArr = arr.filter(item => {
          return item.dateList?.length > 0
        })
        for (let j = 0; j < siteIds.length; j++) {
          const id = siteIds[j]
          for (let k = 0; k < fliterArr.length; k++) {
            const time = fliterArr[k]
            const { dateList, startTime, endTime } = time
            const row = {
              siteId: id,
              id: this.orderId,
              startTime: dateList[0],
              endTime: dateList[1],
              startHm: startTime,
              endHm: endTime
            }
            row['oldId'] = this.orderId
            // if (this.oldId !== '') {
            //   row['oldId'] = this.oldId
            // } else {
            //   delete row.id
            //   row['oldId'] = this.id
            // }

            rows.push(row)
          }
        }
      }
      this.getConflict({ conflictList: rows })
    },
    getConflict(params) {
      this.$api.siteReserveList.lookConflict(params).then(res => {
        this.isConflict = (res.length > 0)
        this.conflictList = this.initConflictList(res) || []
      })
    },
    // 初始化ConflictList
    initConflictList(array) {
      const results = []
      const sorts = array.sort((a, b) => {
        return Date.parse(new Date(a.endTime)) - Date.parse(new Date(b.endTime))
      })
      const map = new Map()
      for (let i = 0; i < sorts.length; i++) {
        const ele = sorts[i]
        const { endTime, startTime, projectName, siteName, state, siteId } = ele
        if (!map.has(ele.id) && map.set(ele.id, 1)) {
          results.push({ endTime: moment(endTime).format('YYYY-MM-DD HH:mm'), startTime: moment(startTime).format('YYYY-MM-DD HH:mm'), projectName, siteName, state, siteId })
        }
      }
      return results
    },
    affirm() {
      this.$refs.siteTimeArrangeForms.siteTimeArrangeForms[this.exhibitionIndex].exh = [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.DEPLOY)]
      this.$refs.siteTimeArrangeForms.siteTimeArrangeForms[this.exhibitionIndex].launch = [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.OPEN)]
      this.$refs.siteTimeArrangeForms.siteTimeArrangeForms[this.exhibitionIndex].move = [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.CLOSE)]
    },
    siteTimeArrangeFormsSiteIdChange({ index, siteIds }) {
      // this.site = siteId
      const siteArea = this.getSiteTimeArrangeFormsData('siteArea')
      this.exhibitionIndex = index
      const chooseSchedules = siteArea.filter(item => {
        return siteIds.includes(item.siteId)
      })
      const dateArray = chooseSchedules.map(item => {
        const { beginTime, endTime } = item
        const dates = getDateToArray(beginTime, endTime)
        return dates
      })
      const siteArr = dateArray.map(item => {
        const items = JSON.stringify(item)
        return items
      })
      for (let i = 0; i < siteArr.length; i++) {
        if (siteArr[0] !== siteArr[i]) {
          // this.dialogVisible = true
          this.$confirm('场地可选日期范围不一致, 确定后日期将被重置', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.affirm()
          }).catch(() => {
          })
        }
      }
      const intersectionArray = intersection(dateArray)
      const beg = intersectionArray[0]
      const end = intersectionArray[intersectionArray.length - 1]
      // this.siteTimeArrangeForm[index].pickerOptions = {
      //   disabledDate(time) {
      //     return moment(beg).valueOf() > time.getTime() || time.getTime() > moment(end).valueOf()
      //   }
      // }
      this.$refs.siteTimeArrangeForms.siteTimeArrangeForms[index].pickerOptions = {
        disabledDate(time) {
          return moment(beg).valueOf() > time.getTime() || time.getTime() > moment(end).valueOf()
        }
      }
      // this.siteTimeArrangeForm[index].pickerOptions = {
      //   disabledDate(time) {
      //     return moment(beg).valueOf() > time.getTime() || time.getTime() > moment(end).valueOf()
      //   }
      // }
    },
    handleRadioChange(value) {
      console.log('handleRadioChange', value)
      if (value === 0) {
        this.reservedTile = [{
          siteIds: [],
          time: [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.RESERVED)],
          // time: [
          //   {
          //     dateList: [],
          //     timeList: ['08:30', '17:00'],
          //     timeType: 4
          //   }
          // ],
          remark: ''
        }]
      }
    },
    // 保存 startTime endTime
    save() {
      const siteTimeArr = []
      const siteTimeArrangeForms = this.getSiteTimeArrangeFormsData('siteTimeArrangeForms')
      const siteArea = this.getSiteTimeArrangeFormsData('siteArea')
      this.$refs.siteTimeArrangeForms.validate((valid) => {
        if (valid) {
          for (let i = 0; i < siteTimeArrangeForms.length; i++) {
            const exhibition = siteTimeArrangeForms[i] // 每个大展
            const random = new Date().getTime() + i
            const { siteIds, exh, launch, move } = exhibition
            const stage = [...exh, ...launch, ...move] // 集合所有期的时间数据

            for (let j = 0; j < siteIds.length; j++) {
              const id = siteIds[j] // 每个场地的id

              for (let k = 0; k < stage.length; k++) { // 循环所有时间数组
                const time = stage[k] // 时间对象
                const startTime = String(time.dateList[0])
                const endTime = String(time.dateList[1])
                const startHm = time.startTime
                const endHm = time.endTime
                const type = time.type
                const orderId = this.orderId
                siteTimeArr.push({
                  orderId,
                  siteId: id,
                  startTime,
                  endTime,
                  startHm,
                  endHm,
                  type,
                  isFlag: String(random)
                })
              }
            }
          }
          for (let i = 0; i < this.reservedTile.length; i++) {
            const reserved = this.reservedTile[i] // 每个大展
            const random = new Date().getTime() + i
            const { siteIds, time } = reserved
            for (let j = 0; j < siteIds.length; j++) {
              const id = siteIds[j] // 每个场地的id
              for (let k = 0; k < time.length; k++) {
                const item = time[k]
                const startTime = String(item.dateList[0])
                const endTime = String(item.dateList[1])
                const startHm = item.startTime
                const endHm = item.endTime
                const type = item.type
                const orderId = this.orderId
                siteTimeArr.push({
                  orderId,
                  siteId: id,
                  startTime,
                  endTime,
                  startHm,
                  endHm,
                  type,
                  isFlag: String(random)
                })
              }
            }
          }
          let siteSchedules = []
          // 无预留
          const _siteSchedules = siteArea
          if (this.radio === 0) {
            for (let i = 0; i < _siteSchedules.length; i++) {
              const siteInfo = _siteSchedules[i]
              siteSchedules.push({
                id: siteInfo.id,
                isReserve: 0,
                siteId: siteInfo.siteId,
                siteArea: siteInfo.siteArea,
                pitchNumber: siteInfo.pitchNumber || '',
                sessions: siteInfo.sessions || ''
              })
            }
          } else {
            // 已经填写的预留siteId
            for (let i = 0; i < this.reservedTile.length; i++) {
              const res = this.reservedTile[i]
              const { siteIds, remark } = res
              for (let j = 0; j < siteIds.length; j++) {
                const id = siteIds[j]
                siteSchedules.push({
                  siteId: id,
                  timeRemark: remark,
                  isReserve: this.radio
                })
              }
            }
            let _siteIds = []
            for (let i = 0; i < this.reservedTile.length; i++) {
              const reserved = this.reservedTile[i]
              const { siteIds } = reserved
              _siteIds = [..._siteIds, ...siteIds]
            }
            const filterArray = _siteSchedules.filter(item => {
              const { siteId } = item
              return !_siteIds.includes(siteId)
            })
            const mapArray = filterArray.map(item => {
              const { id } = item
              return { id, isReserve: 0 }
            })
            siteSchedules = siteSchedules.concat(mapArray)
          }
          const json = {
            siteSale: {
              id: this.id
            },
            siteSchedules,
            information: siteTimeArr
          }
          // 判断有没有选中全部场地
          const arrLength = []
          for (let i = 0; i < siteTimeArrangeForms.length; i++) {
            const element = siteTimeArrangeForms[i]
            for (let j = 0; j < element.siteIds.length; j++) {
              const itemId = element.siteIds[j]
              arrLength.push(itemId)
            }
          }
          if (arrLength.length !== siteArea.length) {
            // this.centerDialogVisible = true
            this.$message.error('无法保存，存在场地未选择时间安排，请检查')
          } else {
            this.$api.siteMarketList.editSiteMarketID(json).then(res => {
              if (res) {
                this.$message.success('保存成功')
                this.$router.go(-1)
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        }
      })
    },
    // 预留删除整个表单
    deleteReservedForm(index) {
      this.reservedTile.splice(index, 1)
    },
    // 预留时间添加整个场地
    addReserved() {
      const json = {
        siteIds: [],
        time: [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.RESERVED)],
        remark: ''
      }
      this.reservedTile.push(json)
    },
    // 预留删除时间
    deleteReservedTime(i, m) {
      this.reservedTile[i].time.splice(m, 1)
    },
    // 预留增加时间
    addReservedTime(index) {
      const item = {
        dateList: [],
        startTime: '08:30',
        endTime: '17:00'
      }
      this.reservedTile[index].time.push(item)
    },
    // 预留重置
    resetReservedTime(item) {
      for (let i = 0; i < item.length; i++) {
        item[i].dateList = []
        item[i].startTime = '08:30'
        item[i].endTime = '17:00'
      }
    },
    // 处理预留时间
    initReservedData(siteSchedules, information) {
      const remarks = {}
      // 检查是否有预留
      const isReserve = siteSchedules.some(item => {
        const { isReserve, siteId, timeRemark } = item
        remarks[siteId] = timeRemark
        return isReserve && isReserve === 1
      })
      if (isReserve) {
        this.radio = 1
      }
      // 整理预留时间显示数据
      const reserveds = information.filter(item => {
        const { type } = item
        return type === TIMETYPE_OBJECT.RESERVED
      })
      const obj = {}
      for (let i = 0; i < reserveds.length; i++) {
        const reserved = reserveds[i]
        const { isFlag } = reserved
        if (!Object.prototype.hasOwnProperty.call(obj, isFlag)) {
          obj[isFlag] = [reserved]
        } else {
          obj[isFlag].push(reserved)
        }
      }
      const newSiteTimeArr = []
      for (const i in obj) {
        const siteTimes = obj[i]
        const newsiteTimes = this.outRepeatSite(siteTimes)
        const objArr = {
          time: [],
          siteIds: []
        }
        const ids = siteTimes.map(item => {
          return item.siteId
        })
        const idsSet = Array.from(new Set(ids))

        for (let j = 0; j < newsiteTimes.length; j++) {
          const siteTime = newsiteTimes[j]
          const { type, startTime, endTime, startHm, endHm, orderId } = siteTime
          this.orderId = orderId
          // id.push(siteId)
          objArr.time.push({
            dateList: [startTime, endTime],
            startTime: startHm.substring(0, 5),
            endTime: endHm.substring(0, 5),
            // timeList: [startHm.substring(0, 5), endHm.substring(0, 5)],
            type,
            orderId
          })
        }
        let remark = ''
        // const item = Array.from(new Set(id))
        for (let k = 0; k < idsSet.length; k++) {
          const _siteId = idsSet[k]
          const _timeRemark = remarks[_siteId]
          if (_timeRemark) {
            remark = _timeRemark
          }
          // if(Object.prototype.hasOwnProperty.call(remarks, _siteId)) {

          // }
        }
        objArr.siteIds = idsSet
        objArr.remark = remark

        newSiteTimeArr.push(objArr)
      }
      if (newSiteTimeArr.length > 0) {
        this.reservedTile = newSiteTimeArr
      }
    },
    // 获取场地
    async get_SiteType() {
      return new Promise((resolve, reject) => {
        this.$api.siteList.getSite({}).then(res => {
          this.siteList = res.list
          resolve()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#siteMarketTime {
  // padding: 20px;
  // .container {
    // padding: 20px;
    // margin-bottom: 16px;
    // background-color: #ffffff;
    .tip {
      color: #666;
      font-size: 14px;
    }
    .siteTimeArrange{
      margin-top: 20px;
      padding: 20px;
      padding-top: 0;
      font-size: 14px;
      color: #666;
      .otherTime{
        // padding: 20px;
        padding-top: 0;
        font-size: 14px;
        color: #666;
        .myPicker {
          width: 350px;
        }
        .siteTimeSpan {
          margin: 0 10px;
        }
        .otherTime-type {
          margin-top: 15px;
          margin-left: 100px;
          margin-bottom: 20px;
        }
        .cnmSpan {
          margin-left: 100px;
        }
        .reservedFormWrapper {
          margin-left: 100px;
          .bottomForm {
            position: relative;
            display: inline-block;
            padding: 20px 100px 20px 20px;
            background-color: #FAFAFA;
              .timepicker {
                width: 150px;
                margin-right: 10px;
              }
              .reservedSelect {
                width: 350px;
              }
              .myInput {
                width: 350px;
              }
          }
          .bottomForm:not(:first-child) {
            margin-top: 20px;
          }
        }
        .saveBtnWrapper{
          margin-left: 100px;
        }
      }
    }
  // }
}

.FormDelete {
  margin-bottom: 0;
}
.FormDelete-btn {
  margin-left: 620px;
}

</style>
