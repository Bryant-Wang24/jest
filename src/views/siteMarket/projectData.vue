<template>
  <!-- <div id="projectData"> -->
  <Layout :use-head="false" :use-foot="false" :auto-height="true" class="projectData">
    <!-- <div class="contenter"> -->
    <div class="projectData-title">
      <MainTitle :title="projectName">
        <warning v-if="projectState ==='RESCINDED'" slot="label" />
      </MainTitle>
    </div>
    <!-- tab页 -->
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="项目基础信息" name="base">
        <rowText :text="'基础信息'" />
        <!-- 基础信息表格 -->
        <div class="basicsForm">
          <el-form
            ref="el-basiceForm"
            :model="basiceForm"
            label-width="160px"
            class="demo-ruleForm"
            :rules="rules_1"
            disabled
          >
            <el-form-item
              label="类型"
              prop="type"
            >
              <el-radio-group v-model="basiceForm.type">
                <el-radio v-for="item in siteTypes" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="展会中文名"
                  prop="projectName"
                >
                  <el-input v-model="basiceForm.projectName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="主办单位">
                  <el-input v-model="basiceForm.hostCompany" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="承办单位">
                  <el-input v-model="basiceForm.undertakeCompany" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="展出内容">
                  <el-input
                    v-model="basiceForm.content"
                    resize="none"
                    type="textarea"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="展会简称">
                  <el-input v-model="basiceForm.projectAs" placeholder="请输入" />
                </el-form-item>
                <el-form-item v-if="isShowItem('website')" label="官方网站">
                  <el-input v-model="basiceForm.website" placeholder="请输入" />
                </el-form-item>
                <el-form-item v-if="isShowItem('numberPeople')" label="参会人数">
                  <el-input v-model="basiceForm.numberPeople" placeholder="请输入" />
                </el-form-item>
                <el-form-item v-if="isShowItem('mealTime')" label="用餐时间">
                  <el-input v-model="basiceForm.mealTime" placeholder="请输入" />
                </el-form-item>
                <el-form-item v-if="isShowItem('tableSize')" label="餐桌围数">
                  <el-input v-model="basiceForm.tableSize" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    v-model="basiceForm.remarks"
                    resize="none"
                    type="textarea"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <RowText :text="'联系人信息'" />
        <div class="userInfo">
          <div class="userInfo-btn">
            <el-button @click="addUser">添加联系人</el-button>
          </div>
          <div class="userForm">
            <el-form
              v-for="(item,index) in userForm"
              ref="userForm"
              :key="index"
              :model="item"
              :disabled="index === 0"
              label-width="160px"
              class="demo-ruleForm myruleForm"
            >
              <el-button v-if="index !== 0" size="mini" class="rightBtn" type="text" @click="deleteBtn(index)">删除</el-button>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人:">
                    <el-input v-model="item.contact" placeholder="请输入" />
                  </el-form-item>
                  <el-form-item label="联系电话:">
                    <el-input v-model="item.phone" placeholder="请输入" />
                  </el-form-item>
                  <el-form-item label="邮箱:">
                    <el-input v-model="item.email" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系地址:">
                    <el-input v-model="item.address" placeholder="请输入" />
                  </el-form-item>
                  <el-form-item label="职务:">
                    <el-input v-model="item.job" placeholder="请输入" />
                  </el-form-item>
                  <el-form-item label="传真:">
                    <el-input v-model="item.fax" placeholder="请输入" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="bottom-btn">
          <el-button v-if="hasRolePermission('projectData_baseSave')" class="el-btn" type="primary" :disabled="projectState === 'RESCINDED'" @click="basicBtn">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目统筹信息" name="plan">
        <RowText :text="'基础信息'" />
        <div class="planForm">
          <el-form
            ref="planForm"
            :model="planForm"
            label-width="160px"
            class="demo-ruleForm"
            :rules="rules_2"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="主场承建商" prop="CONTRACTOR">
                  <el-select v-model="planForm.CONTRACTOR" class="select" value-key="providerId" multiple filterable placeholder="请选择主场承建商">
                    <WrapOption
                      v-for="item in unit"
                      :key="item.companyId"
                      :label="item.companyName"
                      :value="{providerId: item.companyId}"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="地毯商">
                  <el-select v-model="planForm.CARPET_DEALER" class="select" value-key="providerId" multiple filterable placeholder="请选择地毯商">
                    <WrapOption
                      v-for="item in unit"
                      :key="item.companyId"
                      :label="item.companyName"
                      :value="{providerId: item.companyId}"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主场承运商">
                  <el-select v-model="planForm.CARRIER" class="select" value-key="providerId" multiple filterable placeholder="请选择主场承运商">
                    <WrapOption
                      v-for="item in unit"
                      :key="item.companyId"
                      :label="item.companyName"
                      :value="{providerId: item.companyId}"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <RowText :text="'项目筹备'" />
        <div class="projectMakeForm">
          <el-form
            ref="projectMakeForm"
            :model="projectMakeForm"
            label-width="160px"
            class="demo-ruleForm"
            :rules="rules_3"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="人数规模:" prop="numberPeople">
                  <el-input v-model="projectMakeForm.numberPeople" class="my-item-class" placeholder="请输入规模人数" /><span class="itemSpan">人</span>
                </el-form-item>
                <el-form-item label="参展商报到地点:">
                  <el-input v-model="projectMakeForm.exhibitionLocation" placeholder="请输入参展商报到地点" />
                </el-form-item>
                <el-form-item label="开幕式时间:">
                  <div class="pickerWrap">
                    <el-date-picker
                      v-model="projectMakeForm.openTime"
                      class="picker"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="选择开幕式时间"
                      align="right"
                    />
                  </div>
                </el-form-item>
                <el-form-item label="统筹负责人:">
                  <el-input v-model="projectMakeForm.leader" disabled />
                </el-form-item>
                <el-form-item label="备注:">
                  <el-input
                    v-model="projectMakeForm.remarks"
                    :rows="2"
                    resize="none"
                    type="textarea"
                    placeholder="(选填)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="筹展时间:" prop="preparationTime">
                  <div class="pickerWrap">
                    <el-date-picker
                      v-model="projectMakeForm.preparationTime"
                      type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm"
                      format="yyyy-MM-dd HH:mm"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right"
                      class="picker"
                    />
                  </div>
                </el-form-item>
                <el-form-item label="观众报到地点:">
                  <el-input v-model="projectMakeForm.audienceLocation" placeholder="请输入观众报到地点" />
                </el-form-item>
                <el-form-item label="开幕式地点:">
                  <el-input v-model="projectMakeForm.openLocation" placeholder="请输入开幕式地点" />
                </el-form-item>
                <el-form-item label="负责人电话:">
                  <el-input v-model="projectMakeForm.leaderPhone" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="bottom-btn">
          <el-button v-if="hasRolePermission('projectData_overallSave')" :disabled="projectState === 'RESCINDED'" class="el-btn" type="primary" @click="projectMakeFormBtn">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目相关文件" name="file" class="fileTabs">
        <ProjectFile />
      </el-tab-pane>
      <el-tab-pane v-if="hasRolePermission('projectData_syncInfo')" label="项目信息同步" name="sync">
        <SyncInfo :is-rescinded="isRescinded" />
      </el-tab-pane>
    </el-tabs>
    <!-- </div> -->
  </Layout>
  <!-- </div> -->
</template>

<script>
import Layout from '@/components/base/Layout'
import RowText from '@/components/rowText'
import { mapGetters, mapState } from 'vuex'
// import { DEPARTMENT_KEY } from '@/common/user'
import ProjectFile from './components/ProjectFile'
import WrapOption from '@/components/base/WrapOption'
import SyncInfo from './components/SyncInfo'
import MainTitle from '@/components/base/MainTitle'
import { SCHEDULE_STATE } from '@/common/site'

const IS_SHOW_INFO_FORM_TYPE = {
  EXHIBITION: ['website'],
  MEETING: ['numberPeople'],
  CONFERENCR: ['numberPeople'],
  FEAST: ['numberPeople', 'mealTime', 'tableSize'],
  BANQUET: ['numberPeople', 'mealTime', 'tableSize']
}

export default {
  name: 'ProjectData',
  components: { RowText, ProjectFile, MainTitle, SyncInfo, WrapOption, Layout },
  data() {
    return {
      SCHEDULE_STATE,
      projectName: '', // 项目名称
      siteId: null,
      unit: [], // 承建 承运 地毯
      id: null,
      activeName: 'base', // tabs页默认页面
      siteMarketData: '', // 场地销售信息
      hosts: [], // 主办单位
      undertakes: [], // 承办单位
      projectState: null, // res存储值
      // 基础信息
      basiceForm: {
      // 类型
        type: '',
        projectName: '', // 项目名称
        hostCompany: '', // 主办单位
        undertakeCompany: '', // 承办单位
        content: '', // 展出内容
        projectAs: '', // 项目简称
        website: '', // 官方网站
        remarks: '', // 备注
        numberPeople: '', // 参会人数
        mealTime: '', // 用餐时间
        tableSize: '' // 餐桌围数

      },
      // 联系人信息
      userForm: [{
        contact: '',
        phone: '',
        email: '',
        address: '',
        job: '',
        fax: ''
      }],
      // 删除的联系人信息
      userFormDeletes: [],
      // 项目筹备
      projectMakeForm: {
        numberPeople: '',
        exhibitionLocation: '',
        openTime: '',
        leader: '',
        remarks: '',
        preparationTime: null,
        audienceLocation: '',
        openLocation: '',
        leaderPhone: ''
      },
      // 项目统筹基础信息
      planForm: {
        CONTRACTOR: [], // 承建商
        CARRIER: [], // 承运商
        CARPET_DEALER: [] // 地毯商
      },
      // 表单验证
      rules_1: {
        type: [{ required: true }],
        projectName: [{ required: true }]
      },
      rules_2: {
        CONTRACTOR: [{ required: true, message: '请选择主办承建商', trigger: 'change' }]
      },
      rules_3: {
        numberPeople: [{ required: true, message: '请填写规模人数', trigger: 'blur' }],
        preparationTime: [{ required: true, type: 'array', message: '请填写筹展时间', trigger: 'change' }]
      }
    }
  },
  computed: {
    isRescinded() {
      return this.projectState === SCHEDULE_STATE['RESCINDED']
    },
    ...mapGetters({
      office: 'office'
    }),
    ...mapState({
      allTypes: state => state.site.allTypes
    }),
    siteTypes() {
      return this.allTypes
    }
  },
  mounted() {
    const { id, activeName } = this.$route.query
    this.getSiteMarketID(id)
    this.get_unit()
    this.id = id
    if (activeName) {
      this.activeName = activeName
    }
  },
  methods: {
    isShowItem(field) {
      return IS_SHOW_INFO_FORM_TYPE[this.basiceForm.type]?.includes(field)
    },
    // 切换tabs时触发
    handleClick(tab, event) {
      // console.log(tab.index)
      // if (tab.index === '1') {
      //   this.get_unit()
      // }
      // this.get_unit()
    },
    // 获取承建 承运 地毯
    get_unit() {
      const params = {
        pageIndex: 1,
        pageSize: 999999,
        hasAuthority: false, // 取消权限拦截
        customerSimple: {
          customerRequest: {
            state: 'APPROVED'
          }
        }
      }
      this.$api.customerMsg.getlist(params).then(res => {
        for (let i = 0; i < res.list.length; i++) {
          const companyName = res.list[i].constructCompany.companyName
          const companyId = res.list[i].constructCompany.id
          this.unit.push({
            companyName,
            companyId: Number(companyId)
          })
        }
      })
    },
    // 通过id查询场地销售信息
    getSiteMarketID(id) {
      this.$api.siteMarketList.getSiteMarketID(id).then(res => {
        // console.log(res)
        const { siteSale, linkMessage, projectCoordination, serviceProvidersMap } = res
        // const { preparateStartTime = null, preparateEndTime = null } = projectCoordination
        const preparateStartTime = projectCoordination?.preparateStartTime
        const preparateEndTime = projectCoordination?.preparateEndTime
        this.projectName = siteSale.projectName
        this.siteId = res.projectCoordination?.id
        this.basiceForm = siteSale
        this.userForm = linkMessage
        this.planForm.CONTRACTOR = serviceProvidersMap?.CONTRACTOR || []
        this.planForm.CARRIER = serviceProvidersMap?.CARRIER || []
        this.planForm.CARPET_DEALER = serviceProvidersMap?.CARPET_DEALER || []
        this.projectMakeForm.numberPeople = projectCoordination?.numberPeople
        this.projectMakeForm.exhibitionLocation = projectCoordination?.exhibitionLocation
        this.projectMakeForm.openTime = projectCoordination?.openTime
        this.projectMakeForm.leader = projectCoordination?.leader
        this.projectMakeForm.remarks = projectCoordination?.remarks
        this.projectMakeForm.preparationTime = (preparateStartTime && preparateEndTime) ? [preparateStartTime, preparateEndTime] : null
        this.projectMakeForm.audienceLocation = projectCoordination?.audienceLocation
        this.projectMakeForm.openLocation = projectCoordination?.openLocation
        this.projectMakeForm.leaderPhone = projectCoordination?.leaderPhone
        this.projectState = res.state
        // console.log(res)
        // console.log(res.state)
      })
    },
    // 添加联系人
    addUser() {
      const json = {
        contact: '',
        phone: '',
        email: '',
        address: '',
        job: '',
        fax: ''
      }
      this.userForm.push(json)
    },
    // 联系人删除按钮
    deleteBtn(i) {
      this.$confirm('是否删除联系人?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteObj = this.userForm.splice(i, 1)
        if (deleteObj[0].id) {
          this.userFormDeletes.push(deleteObj[0])
        }
      }).catch(() => {

      })
    },
    // 基础信息保存
    basicBtn() {
      var linkMessage = []
      for (const i in this.userForm) {
        if ('id' in this.userForm[i]) {
          linkMessage.push({
            id: this.userForm[i].id,
            ...this.userForm[i],
            isDelete: 0
          })
        } else {
          linkMessage.push(this.userForm[i])
        }
      }
      for (let i = 0; i < this.userFormDeletes.length; i++) {
        const obj = this.userFormDeletes[i]
        obj['isDelete'] = 1
        linkMessage.push(obj)
      }
      const json = {
        siteSale: {
          id: this.id
        },
        linkMessage: linkMessage
      }
      // console.log('------json', json)
      this.$api.siteMarketList.editSiteMarketID(json).then(res => {
        // console.log(res)
        if (res) {
          this.$message.success('保存成功')
          this.$router.go(-1)
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    // 统筹保存
    projectMakeFormBtn() {
      const planForm = new Promise((resolve, reject) => {
        this.$refs.planForm.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      const projectMakeForm = new Promise((resolve, reject) => {
        this.$refs.projectMakeForm.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      Promise.all([planForm, projectMakeForm]).then(res => {
        const json = {
          siteSale: {
            id: this.id
          },
          projectCoordination: {
            numberPeople: Number(this.projectMakeForm.numberPeople),
            exhibitionLocation: this.projectMakeForm.exhibitionLocation,
            openTime: this.projectMakeForm.openTime,
            remarks: this.projectMakeForm.remarks,
            preparateStartTime: this.projectMakeForm.preparationTime[0],
            preparateEndTime: this.projectMakeForm.preparationTime[1],
            audienceLocation: this.projectMakeForm.audienceLocation,
            openLocation: this.projectMakeForm.openLocation,
            id: this.siteId
          },
          serviceProvidersMap: {
            CONTRACTOR: this.planForm.CONTRACTOR,
            CARRIER: this.planForm.CARRIER,
            CARPET_DEALER: this.planForm.CARPET_DEALER
          }
        }
        this.$api.siteMarketList.editSiteMarketID(json).then(res => {
          // console.log('res', res)
          if (res) {
            this.$message.success('保存成功')
            this.$router.go(-1)
          } else {
            this.$message.error('保存失败')
          }
        })
      }).catch(e => {
        this.$message.warning('请填写必选项')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .projectData {
    ::v-deep .layout-containr {
      display: flex;
      flex-direction: column;
    }
    .tabs {
      flex: 1;
      display: flex;
      flex-direction: column;
      ::v-deep.el-tabs__content {
        flex: 1;
        .fileTabs {
          position: absolute;
          top: 0;
          bottom: 0;
        }
      }
    }
  }
  .userInfo-btn {
    margin: 20px;
    margin-left: 40px;
  }
  .el-btn {
    margin-left: 160px;
    margin-top: 20px;
  }
  .demo-ruleForm {
    position: relative;
    .select {
      min-width: 200px;
      max-width: 450px;
    }
    .pickerWrap {
      min-width: 200px;
      max-width: 450px;
      .picker {
        width: 100%;
      }
    }
  }
  .rightBtn {
    position: absolute;
    right: 140px;
    top: -20px;
  }
  .myruleForm {
    margin-bottom: 20px;
  }
  .el-input--medium {
    min-width: 200px;
    max-width: 450px;
    // height: 34px;
}
// .el-range-editor.el-input__inner {
//   min-width: 200px;
//   max-width: 450px;
// }
.itemSpan {
  margin-left: 10px;
}
.planForm {
  margin: 20px 0;
}
.projectMakeForm {
  margin: 20px 0;
}
</style>
