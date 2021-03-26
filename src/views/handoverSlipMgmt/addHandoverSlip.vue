<template>
  <div id="addHandoverSlip">
    <el-form
      ref="formData"
      :inline="true"
      class="demo-form-inline"
      :label-position="labelPosition"
      label-width="130px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="选择项目：" prop="projectId">
        <el-select
          v-model="formData.projectId"
          filterable
          placeholder="请输入（可检索）"
          style="width: 400px"
          :disabled="isEdit"
          @change="handleProjectChange"
        >
          <WrapOption
            v-for="item in projectOptions"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主办名称：" prop="hostIds">
        <el-select
          v-model="formData.hostIds"
          multiple
          filterable
          placeholder="请输入（可检索）"
          style="width: 400px"
        >
          <WrapOption
            v-for="(item,index) in customerOptions"
            :key="index"
            :label="item.hostName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主办联系人：" prop="hostContacts">
        <el-input
          v-model="formData.hostContacts"
          placeholder="请输入"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="主办联系电话：" prop="phone">
        <el-input
          v-model="formData.phone"
          placeholder="请输入"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="项目负责人：" prop="projectLeader">
        <el-input
          v-model="formData.projectLeader"
          placeholder="请输入"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="合同服务手册：" prop="manual">
        <div>{{ formData.manual || '-' }}</div>
      </el-form-item>
      <!-- 场地与面积   场地时间安排 -->
      <el-form-item>
        <exhInfo id="exhInfo" :exh-info="currentData" :is-view="false" />
      </el-form-item>
      <el-form-item label="送风时间：" prop="supplyTime">
        <el-date-picker
          v-model="formData.supplyTime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="空调时间：" prop="airTime">
        <el-date-picker
          v-model="formData.airTime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="备注：" prop="remarks">
        <el-input
          v-model="formData.remarks"
          type="textarea"
          rows="6"
          style="width: 500px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-show="!isEdit"
          type="primary"
          style="margin-left: 130px"
          @click="submitForm('formData')"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import exhInfo from './components/exhInfo'
import { deepClone } from '@/utils'
import WrapOption from '@/components/base/WrapOption'
// import { isNumber } from '@/utils/validate'
import { TIMETYPE, getSiteName,
  // STATE_OBJECT,
  TIMETYPE_OBJECT } from '@/common/handoverSlipMgmt'
import { mapGetters } from 'vuex'
export default {
  name: 'AddHandoverSlip',
  components: { exhInfo, WrapOption },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // isEdit: false,
      labelPosition: 'right',
      projectOptions: [],
      customerOptions: [],
      currentData: {},
      formData: {
        projectId: null,
        hostIds: [],
        hostContacts: '',
        phone: '',
        projectLeader: '',
        manual: '',
        supplyTime: [],
        airTime: [],
        remarks: ''
      },
      rules: {
        // projectId: [{ validator: this.validateProject, required: true, trigger: 'change' }],
        projectId: [{ required: true, trigger: 'change' }],
        hostIds: [{ required: true, message: '请选择主办名称', trigger: 'change' }],
        hostContacts: [{ required: true, message: '请填写主办联系人', trigger: 'blur' }],
        phone: [{ // pattern: /^1[3456789]\d{9}$/,
          required: true, message: '请填写联系电话', trigger: 'blur'
        }],
        projectLeader: [{ required: true, message: '请填写项目负责人', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['siteList', 'userInfo'])
  },
  watch: {
    editData: {
      handler(prop) {
        // console.log('监听data1', prop)
        if (Object.keys(prop).length) { // 有数据时为编辑
          // this.isEdit = true
          const data = deepClone(prop)
          this.initEditData(data)
        }
      },
      deep: true
      // immediate: true
    }
  },
  mounted() {
    this._getMarketList()
    this._getCustomerList()
  },
  methods: {
    // 校验
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(v => {
          if (v) {
            const params = this.initParams()
            resolve(params)
          } else {
            reject()
          }
        })
      })
    },
    // 校验所选项目是否已开交接单
    // validateProject(rule, value, callback) {
    //   if (this.isEdit) {
    //     callback()
    //     return
    //   }
    //   if (!value) {
    //     callback(new Error('请选择项目'))
    //     return
    //   }
    //   const list = this.$store.state.handoverSlipMgmt.handoverList
    //   const find = list.filter(item => {
    //     return item.projectId === value && item.state !== STATE_OBJECT.CANCEL
    //   })
    //   if (find.length > 0) {
    //     callback(new Error('该项目已创建过交接单'))
    //   } else {
    //     callback()
    //   }
    // },
    // 整理请求参数
    initParams() {
      const { id, projectId, hostIds, hostContacts, phone, projectLeader, supplyTime, airTime, remarks, manual } = this.formData
      const project = this.projectOptions.find(item => {
        return item.id === projectId
      })
      const params = {
        id: id || null,
        projectId,
        projectName: project.projectName,
        hostIds,
        hostContacts,
        hostPhone: phone,
        projectLeader,
        supplyStartTime: supplyTime?.[0] || '',
        supplyEndTime: supplyTime?.[1] || '',
        airStartTime: airTime?.[0] || '',
        airEndTime: airTime?.[1] || '',
        remarks,
        manual
      }
      return params
    },
    submitForm(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          const params = this.initParams()
          this._save(params)
        } else {
          return false
        }
      })
    },
    // 选择项目时change事件
    async handleProjectChange(id) {
      const res = await this._getDataFromProjectId(id)
      const currentData = this.initCurrentData(res)
      const formData = this.initFormData(res, true)
      this.currentData = currentData
      this.formData = { ...this.formData, ...formData }
      this.$nextTick(() => {
        this.$refs['formData'].validate(valid => {})
      })
    },
    initFormData(row, isAdd) {
      let formData = {}
      if (isAdd) { // 新增时
        const { manuals: manual } = row
        const { siteSale, linkMessage } = row.saleMessageQuery
        const { hosts: hostIds } = siteSale
        formData = {
          hostIds,
          hostContacts: linkMessage?.length ? linkMessage[0].contact : '',
          phone: linkMessage?.length ? linkMessage[0].phone : '',
          projectLeader: this.userInfo.name,
          manual
        }
      } else { // 编辑时
        const { id, projectId, hostIds, hostContacts, hostPhone, projectLeader, manual, supplyStartTime, supplyEndTime, airStartTime, airEndTime, remarks } = row.handoverSlip
        formData = {
          id,
          projectId,
          hostIds,
          hostContacts,
          phone: hostPhone,
          projectLeader,
          manual,
          supplyTime: supplyStartTime ? [supplyStartTime, supplyEndTime] : [],
          airTime: airStartTime ? [airStartTime, airEndTime] : [],
          remarks
        }
      }
      return formData
    },
    initCurrentData(row) {
      const item = deepClone(row)
      // 处理场地数据
      const { siteSchedules = [], siteSale = {}, information = [] } = item.saleMessageQuery
      const { startDate, endDate } = siteSale
      const siteAndArea = siteSchedules.map(site => {
        const { siteName, siteArea, sessions, pitchNumber } = site
        return {
          siteName,
          siteArea,
          sessions,
          pitchNumber
        }
      })
      const flagObj = {}
      for (let i = 0; i < information.length; i++) {
        const timeInfo = information[i]
        const { isFlag, type, siteId } = timeInfo
        if (type === TIMETYPE_OBJECT.RESERVED) continue // 过滤掉预留时间
        const siteName = getSiteName(siteId, this.siteList)
        if (Object.prototype.hasOwnProperty.call(flagObj, isFlag)) {
          flagObj[isFlag]['siteNames'].includes(siteName) ? null : flagObj[isFlag]['siteNames'].push(siteName)

          // 相同的时间只取一次
          if (flagObj[isFlag][TIMETYPE[type]].length > 0 && !flagObj[isFlag][TIMETYPE[type]].every(t => t.siteId === siteId)) continue

          flagObj[isFlag][TIMETYPE[type]].push(timeInfo)
        } else {
          flagObj[isFlag] = {
            siteNames: [siteName],
            [TIMETYPE['DEPLOY']]: [],
            [TIMETYPE['OPEN']]: [],
            [TIMETYPE['CLOSE']]: []
          }
          flagObj[isFlag][TIMETYPE[type]].push(timeInfo)
        }
      }
      const siteTimeArrange = {
        startDate,
        endDate,
        flagObj
      }
      item.saleMessageQuery['siteAndArea'] = siteAndArea
      item.saleMessageQuery['siteTimeArrange'] = siteTimeArrange
      return item
    },
    // 初始化编辑时数据
    initEditData(editData) {
      const currentData = this.initCurrentData(editData)
      const formData = this.initFormData(editData, false)
      this.currentData = currentData
      this.formData = formData
    },
    // 取所有项目列表
    _getMarketList() {
      const params = {
        hostName: null,
        pageNo: null,
        pageSize: null,
        projectName: null,
        type: null,
        hasHandover: this.isEdit ? null : false
      }
      this.$api.handoverSlipMgmt.getMarketList(params).then(res => {
        const { list } = res
        const options = list.filter(item => {
          const { state } = item
          return state !== 'RESCINDED'
        })

        const projectOptions = options
        // if (!this.isEdit) {
        //   const handoverList = this.$store.state.handoverSlipMgmt.handoverList
        //   const handoverListObject = {}

        //   for (let i = 0; i < handoverList.length; i++) {
        //     const handover = handoverList[i]
        //     const { projectId, state } = handover
        //     if (!Reflect.has(handoverListObject, projectId)) {
        //       handoverListObject[projectId] = [state]
        //     } else {
        //       handoverListObject[projectId].push(state)
        //     }
        //   }

        //   projectOptions = options.filter(item => {
        //     const { id } = item
        //     // return !(Reflect.has(handoverListObject, id) && handoverListObject[id].some(t => t !== STATE_OBJECT.CANCEL))
        //     return !Reflect.has(handoverListObject, id)
        //   })
        // }

        this.projectOptions = projectOptions
      })
    },
    // 获取客户列表
    _getCustomerList() {
      const params = {
        pageIndex: null,
        pageSize: null,
        hasAuthority: false,
        customerSimple: {
          customerRequest: {
            state: 'APPROVED'
          }
        }
      }
      this.$api.customerMsg.getlist(params).then(res => {
        const { list } = res
        const customerOptions = list.map(item => {
          const { constructCompany } = item
          const { companyName, id } = constructCompany
          return { id: Number(id), hostName: companyName }
        })
        this.customerOptions = customerOptions
      })
    },
    // 根据项目id获取当前项目数据
    _getDataFromProjectId(id) {
      return this.$api.handoverSlipMgmt.getDataFromProjectId(id)
    },
    // 根据交接单id获取交接单数据
    _getDataFromId(id) {
      return this.$api.handoverSlipMgmt.getDataFromId(id)
    },
    // 新增保存
    _save(params) {
      params['dataBelong'] = 'GZ_POLY'
      this.$api.handoverSlipMgmt.save(params).then(res => {
        this.$message.success('提交成功')
        this.currentData = {}
        this.$refs['formData'].resetFields()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#addHandoverSlip {
  padding-top: 20px;
  .el-form-item {
    width: 100%;
  }
  .field_time {
    .info {
      .field_div {
        .field_div_first,
        .field_div_second,
        .field_div_third,
        .field_div_fourth {
          display: flex;
          margin-bottom: 10px;
          .title_tip {
            width: 60px;
            text-align: right;
            line-height: 34px;
          }
          span {
            line-height: 34px;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
#exhInfo {
  ::v-deep .row {
    padding: 0;
    .formItem {
      .label {
        font-size: 14px;
        color: #606266;
        font-weight: 700;
      }
      .value {
        .timeWrapper {
          .el-form-item {
            display: block;
            margin-bottom: 22px;
            .el-form-item__label{
              float: left;
              display: block;
            }
            .el-form-item__content{
              display: block;
            }
          }
        }
        .siteRow {
          line-height: 1.15;
        }
      }
    }
  }
}
</style>
