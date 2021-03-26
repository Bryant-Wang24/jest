<template>
  <div id="AddAndEditSiteProjectForm">
    <div v-if="!result.visible" class="container">
      <!-- <div class="title">{{ pageTitle }}</div> -->
      <MainTitle :title="pageTitle" />
      <!-- 基础信息 -->
      <RowText :text="'基础信息'" />
      <!-- 基础信息表格 -->
      <BasiceForm ref="basiceForm" :basice-form.sync="basiceForm" :site-type-options="SITE_TYPE_OPTIONS" :customer-options="customerOptions" @hostsSelectChange="hostsSelectChange" />

      <!-- 场地&时间安排 -->
      <RowText :text="'场地&时间安排'" />
      <!-- 场地&时间安排表格 -->
      <ScheduleForm
        ref="siteTimeArrangeForms"
        :old-id="oldId"
        :is-conflict="isConflict"
        :is-lock-conflict="isLockConflict"
        :is-meeting-type="isMeetingType"
        :site-options="siteOptions"
        :conflict-list="conflictList"
        @initConflictArgs="initConflictArgs"
      />
      <!-- 联系人信息 -->
      <RowText :text="'联系人信息'" />
      <!-- 联系人信息表格 -->
      <UserInfoForm :user-in-fo-form.sync="userInFoForm" />
      <!-- 按钮 -->
      <div class="bottom">
        <el-button @click="back">返回</el-button>
        <el-button v-if="source!=='change' && !oldId" @click="keep('keep')">保存预订</el-button>
        <el-button
          :disabled="isLockConflict"
          type="primary"
          @click="submit('submit')"
        >提交审核</el-button>
        <!-- <el-button type="primary" @click="test">test</el-button> -->
      </div>
    </div>
    <!-- result -->
    <submitResult v-if="result.visible" @back="resultBack" @view="resultView" />
  </div>
</template>

<script>
import moment from 'moment'
import RowText from '@/components/rowText'
import MainTitle from '@/components/base/MainTitle'
import BasiceForm from './BasiceForm'
import UserInfoForm from './UserInfoForm'
import ScheduleForm from './ScheduleForm'
import { mapGetters, mapState } from 'vuex'
import { DEPARTMENT_KEY } from '@/common/user'
import submitResult from '@/components/submitResult'
import { SITE_TYPE_ENUM } from '@/common/site'
import { deleteTagsView } from '@/utils/common'
import { TIMETYPE } from '@/common/handoverSlipMgmt'

// const TIME_TYPE = {
//   1: 'exh',
//   2: 'launch',
//   3: 'move'
// }

export default {
  // name: 'AddSiteRes',
  components: {
    RowText,
    submitResult,
    MainTitle,
    BasiceForm,
    ScheduleForm,
    UserInfoForm
  },
  data() {
    return {
      DEPARTMENT_KEY,
      // disabled: false, // 提交按钮状态
      conflictList: [], // 档期冲突数组
      isConflict: false, // 档期冲突状态
      customerOptions: [], // 承、主办单位
      pageTitle: '添加预订', // 标题
      id: null,
      // defaultFromData: '', // 用于检查是否修改过当前页
      source: '', // 页面状态
      // 基础信息
      basiceForm: {
      // 类型
        type: '',
        projectName: '', // 项目名称
        hosts: [], // 主办单位
        undertakes: [], // 承办单位
        content: '', // 展出内容
        projectAs: '', // 项目简称
        website: '', // 官方网站
        remarks: '', // 备注
        mealTime: '', // 用餐时间
        numberPeople: '', // 参会人数
        tableSize: '' // 餐桌围数
      },
      // 联系人信息
      userInFoForm: [
        {
          contact: '', // 联系人
          phone: '', // 联系电话
          email: '', // 邮箱
          address: '', // 联系地址
          job: '', // 职务
          fax: '' // 传真
        }
      ],
      // 场地列表数据
      siteOptions: [],
      oldId: '',
      result: {
        visible: false,
        id: null
      },
      customers: []
    }
  },
  computed: {
    ...mapState({
      allTypes: state => state.site.allTypes,
      currentUserCodeTypes: state => state.site.currentUserCodeTypes
    }),
    ...mapGetters({ office: 'office' }),
    isMeetingType() {
      return this.allTypes.some(t => {
        if (this.basiceForm.type === t.value) {
          return t.type === 'MEETING'
        }
      })
    },
    SITE_TYPE_OPTIONS() {
      return this.currentUserCodeTypes.length ? this.currentUserCodeTypes : this.allTypes
    },
    isLockConflict() {
      return this.conflictList.some(item => {
        return item.state === 1
      })
    }
  },
  watch: {
    SITE_TYPE_OPTIONS: {
      handler: function(options) {
        this.basiceForm.type = options[0]?.value
      },
      immediate: true
    }
  },
  async activated() {
    const { id } = this.$route.query
    if (id && id !== this.id) {
      await this.getSiteLists() // 获取场地
      this.getUnits() // 获取承办、主办单位
      this.routerStyle()
    }
  },
  async mounted() {
    await this.getSiteLists() // 获取场地
    this.getUnits() // 获取承办、主办单位
    this.routerStyle()
  },
  methods: {
    // 主办单位下拉框change事件, 自动更新联系人信息
    hostsSelectChange(hosts) {
      if (hosts.length) {
        const companyId = hosts[0]
        const filter = this.customers.filter(t => Number(t.constructCompany.id) === companyId)
        const { defaultConstructInfo } = filter[0]
        if (defaultConstructInfo) {
          const { name: contact, phone, email, position: job, fax } = defaultConstructInfo
          this.$set(this.userInFoForm, '0', {
            ...this.userInFoForm[0],
            contact: contact || '', // 联系人
            phone: phone || '', // 联系电话
            email: email || '', // 邮箱
            job: job || '', // 职务
            fax: fax || '' // 传真
          })
        }
      } else {
        this.$set(this.userInFoForm, '0', {
          ...this.userInFoForm[0],
          contact: '', // 联系人
          phone: '', // 联系电话
          email: '', // 邮箱
          address: '', // 联系地址
          job: '' // 职务
        })
      }
    },
    resultBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'SiteReserve' })
    },
    resultView() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'SiteReserveInfo', query: { id: this.result.id, source: this.result.source }})
    },
    routerStyle() {
      const { id, source } = this.$route.query
      this.id = id
      this.source = source
      if (source) {
        switch (source) {
          case 'siteEdit':
            this.pageTitle = '编辑预订'
            break
          case 'change':
            this.pageTitle = '档期变更'
            break
          case 'view':
            this.pageTitle = '查看详情'
            break
        }
        this.getSiteResID(id)
      }
    },
    setSiteTimeArrangeFormsData(key, data) {
      this.$refs.siteTimeArrangeForms.setData(key, data)
    },
    getSiteTimeArrangeFormsData(key) {
      return this.$refs.siteTimeArrangeForms.getData(key)
    },
    // 通过id获取场地
    getSiteResID(id) {
      this.$api.siteReserveList.getSiteReserveID(id).then(res => {
        const { siteOrder, siteSchedules, linkMessage, timeInformation } = res
        const { type, projectName, hosts, undertakes, content, projectAs, website, remarks, mealTime, numberPeople, tableSize, oldId } = siteOrder || {}

        this.basiceForm = { type, projectName, hosts: hosts, undertakes, content, projectAs, website, remarks, mealTime, numberPeople, tableSize }
        this.oldId = oldId || ''
        linkMessage && (this.userInFoForm = linkMessage)

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
              type
            })
          }
          // const item = Array.from(new Set(id))
          objArr.siteIds = idsSet
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
              id: this.id,
              startTime: dateList[0],
              endTime: dateList[1],
              startHm: startTime,
              endHm: endTime
            }
            if (this.oldId !== '') {
              row['oldId'] = this.oldId
            } else {
              delete row.id
              row['oldId'] = this.id
            }

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
    // 获取场地
    async getSiteLists() {
      const res = await this.$api.siteList.getSite({})
      this.siteOptions = res.list.filter(t => [SITE_TYPE_ENUM.PAVILION, SITE_TYPE_ENUM.AUDITORIUM].includes(t.siteType))
    },
    // 返回
    back() {
      deleteTagsView(this.$route)
      this.$router.push({ name: 'SiteReserve' })
    },
    // 获取承办、主办单位
    getUnits() {
      const params = {
        pageIndex: 1,
        pageSize: 999999,
        customerSimple: {
          customerRequest: {
            state: 'APPROVED'
          }
        }
      }
      this.$api.customerMsg.getlist(params).then(res => {
        const { list } = res
        this.customers = list
        this.customerOptions = list.map(t => {
          const { constructCompany } = t
          const { companyName, id: companyId } = constructCompany
          return { companyName, companyId: Number(companyId) }
        })
      })
    },
    // 保存预定
    keep() {
      this.$refs.siteTimeArrangeForms.clearValidate()
      this.$refs.basiceForm.validate(valid => {
        if (valid) {
          const json = this.initParams('keep')

          if (this.source) {
            this.$api.siteReserveList.compileSitRes(json).then(res => {
              if (res) {
                deleteTagsView(this.$route)
                this.$router.push({ name: 'SiteReserve' })
              }
            })
          } else {
            this.$api.siteReserveList.saveSiteRes(json).then(res => {
              console.log(res)
              if (res) {
                this.$message.success('保存成功')
                deleteTagsView(this.$route)
                this.$router.push({ name: 'SiteReserve' })
              }
            })
          }
        } else {
          this.$message.warning('保存失败')
        }
      })
    },
    // 提交审核
    submit() {
      if (this.isLockConflict) {
        this.$message.warning('与"锁定状态档期冲突,无法提交审核"')
        return
      }
      const basiceForm = new Promise((resolve, reject) => {
        this.$refs.basiceForm.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      const siteTimeForms = new Promise((resolve, reject) => {
        this.$refs.siteTimeArrangeForms.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      // Promise.all([basiceForm, ...siteTimeForms]).then(res => {
      Promise.all([basiceForm, siteTimeForms]).then(res => {
        const json = this.initParams('submit')

        if (this.source === 'siteEdit') {
          json.siteOrder.oldId = this.oldId
          this.$api.siteReserveList.BJsubmit(json).then(res => {
            if (res) {
              this.showSubmitResult(this.id)
            }
          })
        } else {
          if (this.source === 'change') {
            json.siteOrder['oldId'] = Number(this.id)
            delete json.siteOrder.id
          }
          this.$api.siteReserveList.submit(json).then(res => {
            if (res) {
              const id = res.siteOrder.id
              this.showSubmitResult(id, 'siteEdit')
            }
          })
        }
      }).catch(e => {
        console.log('error', e)
        this.$message.warning('请填写必填项')
      })
    },
    initParams(type) {
      const siteTimeArr = []
      const siteTimeArrangeForms = [...this.getSiteTimeArrangeFormsData('siteTimeArrangeForms')]
      const siteArea = [...this.getSiteTimeArrangeFormsData('siteArea')]

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
            siteTimeArr.push({
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
      const siteSchedules = siteArea.map(item => {
        const { siteId, siteName, siteArea, pitchNumber, sessions } = item
        return { siteId, siteName, siteArea, pitchNumber, sessions }
      })
      // delete this.userInFoForm[0].id
      if (type === 'submit') {
        delete this.userInFoForm[0].orderId
      }
      const json = {
        siteOrder: {
          id: this.id,
          ...this.basiceForm
        },
        siteSchedules,
        linkMessage: this.userInFoForm,
        timeInformation: siteTimeArr
      }
      return json
    },
    showSubmitResult(id, source) {
      this.result.visible = true
      this.result.id = id
      this.result.source = source || ''
    }
  }
}
</script>

<style lang="scss" scoped>
#AddAndEditSiteProjectForm {
  padding: 20px;
  margin-bottom: 64px;
  .container {
      padding: 20px;
      background-color: #ffffff;
      .userInFo {
        margin-top: 20px;
      }
      .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 24px;
      }
      .lookBtn {
        padding: 20px;
      }
      .bottom {
        // width: 100%;
        // height: 72px;
        // line-height: 72px;
        // text-align: center;
        // background-color: #fff;
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        height: 64px;
        padding: 0 56px;
        padding-left: 200px;
        box-sizing: border-box;
        line-height: 64px;
        background: white;
        text-align: center;
        font-size: 14px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
        z-index: 2;
      }
  }
}
.siteArea {
  padding: 20px;
  padding-top: 0;
  font-size: 14px;
  color: #666666;
}
.mySelect {
    width: 150px;
    margin-right: 10px;
}
.myInput {
  width: 150px;
  margin-left: 10px;
}
.sites-input {
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
  display: flex;
  align-items: center;
}
.mySpan {
  margin-right: 20px;
}
.siteArea-content {
  margin-left: 120px;
  margin-bottom: 5px;
  .area-input {
    width: 196px;
    padding-right: 46px;
    &::after {
      content: '平方米';
      position: absolute;
      line-height: 36px;
      font-size: 14px;
      right: 2px;
    }
  }
  .pitch-input {
    width: 184px;
    padding-right: 34px;
    &::after {
      content: '节数';
      position: absolute;
      line-height: 36px;
      right: 2px;
    }
  }
  .session-input {
    width: 184px;
    padding-right: 34px;
    &::after {
      content: '场次';
      position: absolute;
      line-height: 36px;
      right: 2px;
    }
  }
}
.siteTimeArrange{
  padding: 20px;
  padding-top: 0;
  font-size: 14px;
  color: #666;
}
.myForm {
  ::v-deep .el-form-item__label {
    font-size: 14px;
  }
}
.myEl {
  width: 300px;
}
.siteTimeSpan {
  font-size: 14px;
  color: #666;
  margin-left: 15px;
  margin-right: 5px;
}
.siteTimeArrange-addForm {
  margin-left: 105px;
}
.siteSpanS {
  margin-left: 15px;
}
.FormDelete {
  margin-bottom: 0;
}
.FormDelete-btn {
  margin-left: 620px;
}
.conflict {
  padding-left: 20px;
}
.spanRed {
  color: red;
  margin-left: 20px;
}
.conflict-box {
  // padding: 20px 80px ;
  float: left;
  margin-right: 10px;
  margin-bottom: 10px;
}
.conflict-boxChild {
  width: 320px;
  // height: 75px;
  background: #D5FDD8;
  opacity: 1;
  display: block;

  border-left: 2px solid #52C15E;
  padding-top: 10px;
  padding-left: 10px;
  padding: 10px;
}
.conflict-boxChildT{
  border-left: 2px solid #FF7600;
  background: #FFFDEF;
}
.boxChild-child{
  background: #52C15E;
  opacity: 1;
  border-radius: 2px;
  margin-right: 5px;
  padding: 1px;
}
.boxChild-childT{
  background: #FF7600;
}
.boxChild-name {
  padding-top: 3px;
}
.boxChild-clock {
  text-align: left;
}
.boxChild-clock {
  margin-top: 10px;
}
.clock-text {
  margin-left: 6px;
}
.conflict-father {
  overflow: hidden;
  margin-left: 72px;
  margin-top: 10px;
}
.timepicker {
  width: 150px;
  margin-right: 10px;
}
</style>
