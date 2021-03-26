<template>
  <div>
    <!-- node -->
    <div v-if="nodeConfig.type !== 4" class="node-wrap">
      <div class="node-wrap-box" :class="NODE_CLASS[nodeConfig.type]" @click="clickNodeBox">
        <div>
          <div class="title">
            <span class="title-left">{{ nodeConfig.nodeName }}</span>
            <span v-if="nodeConfig.type === 3" class="priority-level">优先级{{ nodeConfig.priority }}</span>
            <span v-if="nodeConfig.type !== 3 && nodeConfig.type !== 0" class="action-close" @click.stop="delNode()">
              <i class="el-icon-close" /></span>
            <span v-if="nodeConfig.type === 3 && nodeConfig.type !== 0" class="action-close" @click.stop="delNode()">
              <i class="el-icon-close" /></span>
            <!-- <span class="action-close" @click="delNode()"><i class="el-icon-close" /></span> -->
          </div>
          <div class="content">
            <!-- 事件 -->
            <div v-if="nodeConfig.type === 0" class="text">
              {{ nodeConfig.eventName }}
            </div>
            <!-- 条件 -->
            <div v-if="nodeConfig.type === 3" class="text">
              <p v-if="nodeConfig.conditions && nodeConfig.conditions.length > 0">需同时满足以下条件</p>
              <span v-else>未配置</span>
              <span v-for="(condition, index) in nodeConfig.conditions" :key="index">
                {{ conditionsText(condition.fieldName, condition.relation, condition.objectValue) }}
                <!-- {{ fields[condition.fieldName].label }}: {{ fields[condition.fieldName]['typeUsableRelations'][condition.relation] }} {{ condition.value }} -->
              </span>
            </div>
            <!-- 审批人 -->
            <div v-if="nodeConfig.type === 1" class="text">
              <p v-if="nodeConfig.approverIds && nodeConfig.approverIds.length > 0" class="approver">
                {{ getUserName(nodeConfig.approverIds) }}
              </p>
              <span v-else>未配置</span>
              <span v-if="nodeConfig.approverIds.length && nodeConfig.transferable">允许审批人转审</span>
              <span v-if="nodeConfig.approverIds.length && nodeConfig.addable">允许审批人加签</span>
              <span v-if="nodeConfig.approverIds.length && nodeConfig.reversible">允许审批人退回审批节点</span>
            </div>
          </div>
        </div>
      </div>
      <!-- add -->
      <addNode
        :child-node-p.sync="nodeConfig.childNode"
        :type="nodeConfig.type"
        :node-config="nodeConfig"
      />
      <addNode
        v-if="nodeConfig.type === 0 && nodeConfig.childNode === null"
        :child-node-p.sync="nodeConfig.childNode"
        :type="null"
        :node-config="nodeConfig"
      />
    </div>
    <!-- branch -->
    <div v-if="nodeConfig.type === 4" class="branch-wrap">
      <div class="branch-wrap-box">
        <div class="branch-box">
          <div
            v-for="(branch, index) in nodeConfig.branchList"
            :key="index"
            class="col-box"
          >
            <span
              v-if="branch.childNode.type === 3"
              class="action-close branch-close"
              @click="delTerm(index)"
            ><i
              class="el-icon-close"
            /></span>
            <NodeWrap
              v-if="branch.childNode && branch.childNode"
              :node-config.sync="branch.childNode"
            />
            <!-- hide line -->
            <div v-if="index === 0" class="top-left-cover-line" />
            <div v-if="index === 0" class="bottom-left-cover-line" />
            <div
              v-if="index === nodeConfig.branchList.length - 1"
              class="top-right-cover-line"
            />
            <div
              v-if="index === nodeConfig.branchList.length - 1"
              class="bottom-right-cover-line"
            />
          </div>
        </div>
        <!-- add -->
        <!-- <addNode
          :child-node-p.sync="nodeConfig.childNode"
          :type="nodeConfig.type"
          :node-config="nodeConfig"
        /> -->
        <div class="branch-end-middle-line" />
      </div>
    </div>
    <!-- drawer -->
    <el-drawer

      custom-class="approverDrawer"
      title="设置审批人"
      :visible.sync="approverDrawer"
      direction="rtl"
      :close-on-press-escape="false"
      :wrapper-closable="false"
      :append-to-body="true"
      :before-close="handleClose"
      :show-close="false"
      size="720px"
    >

      <div class="drawer-content-wrap">
        <el-scrollbar style="height:100%">
          <div class="drawer-content">
            <div class="person-type">
              <span class="label">选人方式</span>
              <el-radio-group v-model="approverConfig.isMultiple" disabled>
                <el-radio :label="false">单选</el-radio>
                <el-radio :label="true">多选</el-radio>
              </el-radio-group>
            </div>
            <div class="person">
              <span class="label">选择审批人</span>
              <el-select
                v-model="approverConfig.id"
                :multiple="!!approverConfig.isMultiple"
                filterable
                placeholder="可检索"
              >
                <WrapOption
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="person-set">
              <span class="label">审批设置</span>
              <el-checkbox
                v-model="approverConfig.transferable"
                class="checkbox"
                label="允许审批人转审"
              />
              <el-checkbox
                v-model="approverConfig.addable"
                class="checkbox"
                label="允许审批人加签"
              />
              <el-checkbox
                v-model="approverConfig.reversible"
                class="checkbox"
                label="允许审批人退回审批节点（默认退回上一级，第一个审批节点没有退回操作）"
              />
            </div>
          </div>
          <div class="drawer-footer">
            <el-button @click="approverDrawer = false">取消</el-button>
            <el-button type="primary" @click="saveApprover">确定</el-button>
          </div>
        </el-scrollbar>
      </div>
    </el-drawer>
    <el-drawer
      custom-class="conditionDrawer"
      title="设置条件"
      :visible.sync="conditionDrawer"
      direction="rtl"
      :close-on-press-escape="false"
      :wrapper-closable="false"
      :append-to-body="true"
      :before-close="handleClose"
      :show-close="false"
      size="720px"
    >
      <!-- <el-scrollbar> -->
      <div class="drawer-content-wrap">
        <el-scrollbar style="height:100%">
          <div class="drawer-content">
            <div class="branch-info">
              <el-input v-model="conditionConfig.name" class="condition-name" placeholder="请输入条件名称" />
              <!-- <el-input v-model="conditionConfig.priority" class="condition-priority" placeholder="请输入优先级" /> -->
              <el-select v-model="conditionConfig.priority" class="condition-priority" placeholder="请选择优先级">
                <WrapOption
                  v-for="priority in prioritys"
                  :key="priority"
                  :label="`优先级${priority}`"
                  :value="priority"
                />
              </el-select>
            </div>
            <div class="drawer-condition-wrap">
              <span class="title">同时满足以下条件</span>
              <div class="drawer-conditions">
                <div v-for="(item, index) in conditionConfig.conditions" :key="index" class="drawer-condition-row">
                  <!-- 字段 field -->
                  <el-select v-model="item.fieldName" class="field" placeholder="请选择" @change="fieldSelectChange($event, item)">
                    <WrapOption
                      v-for="field in conditionOption"
                      :key="field.fieldName"
                      :label="field.label"
                      :value="field.fieldName"
                      :disabled="isFieldDisabled(field.fieldName)"
                    />
                  </el-select>
                  <!-- relation -->
                  <el-select v-show="item.fieldName" v-model="item.relation" class="relation" placeholder="请选择" @change="relationSelectChange($event, item, currentOptions(conditionOption,item.fieldName).type)">
                    <WrapOption
                      v-for="relation in filterRelation(conditionOption,item.fieldName)"
                      :key="relation.value"
                      :label="relation.label"
                      :value="relation.value"
                    />
                  </el-select>
                  <!--selection value or inpur value-->
                  <!-- STRING -->
                  <template v-if="currentOptions(conditionOption,item.fieldName).type === CONDITION_TYPE.STRING && item.relation">
                    <el-input v-if="!currentOptions(conditionOption,item.fieldName).selections" v-model="item.objectValue.value" class="value" placeholder="请输入" />
                    <el-select v-if="currentOptions(conditionOption,item.fieldName).selections && currentOptions(conditionOption,item.fieldName).selections.length > 0" v-model="item.objectValue.value" class="value">
                      <WrapOption
                        v-for="selection in filterConditionValue(conditionOption,item.fieldName)"
                        :key="selection.value"
                        :label="selection.label"
                        :value="selection.value"
                      />
                    </el-select>
                  </template>
                  <!-- MULTI_STRING -->
                  <template v-if="currentOptions(conditionOption,item.fieldName).type === CONDITION_TYPE.MULTI_STRING && item.relation">
                    <!-- <el-input v-if="!currentOptions(conditionOption,item.fieldName).selections" v-model="item.objectValue.value" class="value" placeholder="请输入" /> -->
                    <el-select v-if="currentOptions(conditionOption,item.fieldName).selections && currentOptions(conditionOption,item.fieldName).selections.length > 0" v-model="item.objectValue.valueList" multiple class="value">
                      <WrapOption
                        v-for="selection in filterConditionValue(conditionOption,item.fieldName)"
                        :key="selection.value"
                        :label="selection.label"
                        :value="selection.value"
                      />
                    </el-select>
                  </template>
                  <!-- NUMBER -->
                  <template v-if="currentOptions(conditionOption,item.fieldName).type === CONDITION_TYPE.NUMBER && item.relation ">
                    <!-- selections is empty Array or null -->
                    <template v-if="!currentOptions(conditionOption,item.fieldName).selections">
                      <el-input v-if="item.relation !== LOGICS_EN.BETWEEN" v-model="item.objectValue.value" class="value" placeholder="请输入数字" @input="filterNaN($event, item, 'SINGLE')" />
                      <!-- relation is BETWEEN -->
                      <template v-else>
                        <el-input v-model="item.objectValue.values[0]" class="value-min" placeholder="请输入数字" @input="filterNaN($event, item, 'MIN')" />
                        <span style="width: 20px;text-align: center;line-height:36px;">~</span>
                        <el-input v-model="item.objectValue.values[1]" class="value-max" placeholder="请输入数字" @input="filterNaN($event, item, 'MAX')" />
                      </template>
                    </template>
                    <!-- selections is Array -->
                    <template v-else>
                      <el-select v-model="item.objectValue.values[0]" class="value-min">
                        <WrapOption
                          v-for="selection in filterConditionValue(conditionOption,item.fieldName)"
                          :key="selection.value"
                          :label="selection.label"
                          :value="selection.value"
                        />
                      </el-select>
                      <el-select v-model="item.objectValue.values[1]" class="value-max">
                        <WrapOption
                          v-for="selection in filterConditionValue(conditionOption,item.fieldName)"
                          :key="selection.value"
                          :label="selection.label"
                          :value="selection.value"
                        />
                      </el-select>
                    </template>
                  </template>
                  <!-- DATE -->
                  <template v-if="currentOptions(conditionOption,item.fieldName).type === CONDITION_TYPE.DATE && item.relation ">
                    <el-date-picker
                      v-if="item.relation !== LOGICS_EN.BETWEEN"
                      v-model="item.objectValue.value"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                    />
                    <!-- relation is BETWEEN -->
                    <el-date-picker
                      v-else
                      v-model="item.objectValue.values"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </template>
                  <!-- USER -->
                  <template v-if="currentOptions(conditionOption,item.fieldName).type === CONDITION_TYPE.USER && item.relation ">
                    <div class="user-wrap">
                      <el-tag
                        v-for="tag in getOffice(item.objectValue)"
                        :key="tag.id"
                        class="user-tag"
                        closable
                        type="info"
                        @close="delUserTag(tag.id, item)"
                      >
                        {{ tag.entity.name }}
                      </el-tag>
                    </div>
                    <el-button type="text" @click="showUserTree(item)">添加/修改</el-button>
                  </template>
                  <div class="close-icon" @click="closeCondition(index)"><i class="el-icon-close" /></div>
                </div>
              </div>
              <!-- add condition -->
              <div class="add-condition-wrap" @click="addCondition">
                <span class="add-condition-icon"><i class="el-icon-plus" /></span>
                <span class="add-condition-btn" type="text">添加条件</span>
              </div>
            </div>
          </div>
          <div class="drawer-footer">
            <el-button @click="conditionDrawer = false">取消</el-button>
            <el-button type="primary" @click="saveCondition">确定</el-button>
          </div>
        </el-scrollbar>
      </div>
      <!-- </el-scrollbar> -->
    </el-drawer>
    <NodeWrap
      v-if="nodeConfig.childNode && nodeConfig.childNode"
      :node-config.sync="nodeConfig.childNode"
    />
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
import { mapState } from 'vuex'
import { isArray } from '@/utils/validate'
import addNode from './addNode'
import { SET_BRANCH_IDS, LOGICS_EN, CONDITION_TYPE, getOfficeName, getOffice, USER_TREE_TYPE, validateConditionConfig } from '@/common/approve'
import { EventBus } from '@/utils/event-bus'
import { regular } from '@/common/global'
const NODE_CLASS = {
  0: 'start-node',
  1: 'approve-node',
  3: 'condition-node'
}
export default {
  name: 'NodeWrap',
  components: { addNode, WrapOption },
  props: {
    nodeConfig: { type: Object, default: () => {} }
  },
  data() {
    return {
      CONDITION_TYPE,
      LOGICS_EN,
      NODE_CLASS,
      conditionOption: [],
      approverDrawer: false,
      approverConfig: {
        isMultiple: 0,
        id: null,
        transferable: false,
        addable: false,
        reversible: false
      },
      conditionDrawer: false,
      conditionConfig: {
        branchId: null, // 分支id
        name: null,
        priority: null,
        conditions: [
          {
            id: null,
            fieldName: null,
            relation: null,
            objectValue: {}
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      fields: state => state.approve.fields,
      userOptions: state => state.approve.userlist,
      prioritys: state => state.approve.prioritys
    })
  },
  mounted() {
    this.conditionOption = this.$store.state.approve.conditionOption
  },
  methods: {
    clickNodeBox() {
      const { type } = this.nodeConfig
      const _nodeConfig = JSON.parse(JSON.stringify(this.nodeConfig))

      if (type === 1) {
        // set approver
        this.approverConfig.branchId = _nodeConfig.branchId
        this.approverConfig.isMultiple = _nodeConfig.isMultiple
        // this.approverConfig.id = _nodeConfig.isMultiple ? _nodeConfig.approverIds.map(id => id) : _nodeConfig.approverIds[0]
        this.approverConfig.id = _nodeConfig.isMultiple
          ? _nodeConfig.approverIds
          : _nodeConfig.approverIds[0]
        this.approverConfig.transferable = !!_nodeConfig.transferable
        this.approverConfig.addable = !!_nodeConfig.addable
        this.approverConfig.reversible = !!_nodeConfig.reversible
        this.approverDrawer = true
      } else if (type === 3) {
        // setCondition
        this.conditionConfig.branchId = _nodeConfig.branchId
        this.conditionConfig.name = _nodeConfig.nodeName
        this.conditionConfig.priority = _nodeConfig.priority
        if (_nodeConfig.conditions.length > 0) {
          this.conditionConfig.conditions = _nodeConfig.conditions.map(t => {
            if (t.objectValue.min && t.objectValue.max) {
              t.objectValue.values = [t.objectValue.min, t.objectValue.max]
            }
            return { ...t }
          })
        } else {
          this.conditionConfig.conditions = [{
            id: null,
            fieldName: null,
            relation: null,
            objectValue: {}
          }]
        }
        // this.conditionConfig.conditions = _nodeConfig.conditions.length > 0 ? _nodeConfig.conditions : [{
        //   id: null,
        //   fieldName: null,
        //   relation: null,
        //   objectValue: {}
        // }]
        this.conditionDrawer = true
      }
    },
    saveApprover() {
      const { isMultiple, id, transferable, addable, reversible, branchId } = this.approverConfig
      if ((isArray(id) && id.length === 0) || !id) {
        this.$message.warning('请设置审批人')
        return
      }
      // const approvers = isMultiple ? id.map(t => { return { id: t, name: this.getUserName(t) } }) : [{ id, name: this.getUserName(id) }]
      const approverIds = isMultiple ? id : [id]
      const config = {
        ...this.nodeConfig,
        isMultiple,
        transferable: transferable ? 1 : 0,
        addable: addable ? 1 : 0,
        reversible: reversible ? 1 : 0,
        approverIds
      }

      this.$emit('update:nodeConfig', config)
      if (branchId) { // 有branchId，标记update
        // this.SET_BRANCH_IDS({ ...this.branchIds, [branchId]: 'UPDATE' })
        SET_BRANCH_IDS(branchId, 'UPDATE')
      }
      this.approverDrawer = false
    },
    saveCondition() {
      const { name, priority, conditions, branchId } = this.conditionConfig
      // 校验条件必填项
      if (!validateConditionConfig(this.conditionConfig)) return
      const _conditions = conditions.map(t => {
        let { objectValue } = t
        if (objectValue.values?.length > 0) {
          const min = objectValue.values[0]
          const max = objectValue.values[1]
          objectValue = { min, max }
          return { ...t, objectValue }
        } else {
          return t
        }
      })
      const config = {
        ...this.nodeConfig,
        nodeName: name,
        priority,
        conditions: _conditions
      }
      this.$emit('update:nodeConfig', config)
      if (branchId) { // 有branchId，标记update
        // this.SET_BRANCH_IDS({ ...this.branchIds, [branchId]: 'UPDATE' })
        SET_BRANCH_IDS(branchId, 'UPDATE')
      }
      this.conditionDrawer = false
    },
    filterRelation(conditionOption, fieldName) {
      if (!fieldName) {
        return []
      }
      const filters = conditionOption.filter(t => {
        return t.fieldName === fieldName
      })
      return filters[0].typeUsableRelations
    },
    filterConditionValue(conditionOption, fieldName) {
      if (!fieldName) {
        return []
      }
      const filters = conditionOption.filter(t => {
        return t.fieldName === fieldName
      })
      return filters[0].selections
    },
    currentOptions(conditionOption, fieldName) {
      const filters = conditionOption.filter(t => {
        return t.fieldName === fieldName
      })
      return filters[0] || {}
    },
    fieldSelectChange(v, item) {
      item.relation = null
      item.objectValue = {}
    },
    filterNaN(v, value, type) {
      switch (type) {
        case 'SINGLE': {
          value.objectValue.value = regular.INPUT_REPLACE_NAN(v)
          break
        }
        case 'MIN': {
          value.objectValue.values[0] = regular.INPUT_REPLACE_NAN(v)
          break
        }
        case 'MAX': {
          value.objectValue.values[1] = regular.INPUT_REPLACE_NAN(v)
          break
        }

        default:
          break
      }
    },
    // 逻辑下拉框change，根据逻辑类型格式化objectValue
    relationSelectChange(v, item, type) {
      switch (type) {
        case CONDITION_TYPE.MULTI_STRING:
          item.objectValue = {
            valueList: []
          }
          break
        default:
          if (v !== LOGICS_EN.BETWEEN) {
            item.objectValue = {
              value: null
            }
          } else {
            item.objectValue = {
              min: null,
              max: null,
              values: [] // 适配DateTimePicker数组格式
            }
          }
          break
      }
    },
    addCondition() {
      this.conditionConfig.conditions.push({
        id: null,
        fieldName: null,
        relation: null,
        objectValue: {}
      })
    },
    closeCondition(index) {
      this.conditionConfig.conditions.splice(index, 1)
    },
    // 拼接流程图条件显示数据
    conditionsText(fieldName, relation, objectValue) {
      const _fieldName = this.fields[fieldName]?.label || ''
      const _relation = this.fields[fieldName]?.typeUsableRelations?.[relation]
      const _type = this.fields[fieldName]?.type
      let _value = ''
      // debugger
      if (relation === LOGICS_EN.BETWEEN) {
        _value = objectValue.min + ' ~ ' + objectValue.max
      } else if (_type === CONDITION_TYPE.USER) {
        const { userIds = [], groupIds = [], roleIds = [] } = objectValue
        const ids = [...userIds, ...groupIds, ...roleIds]
        // 根据id获取部门/角色/用户 name
        const names = getOfficeName(ids)
        _value = names.join('，')
      } else {
        const isSelect = Object.keys(this.fields[fieldName]?.selections || {}).length > 0
        if (isSelect) {
          const isMultiple = !!objectValue.valueList?.length
          switch (isMultiple) {
            case true:
              _value = objectValue.valueList.map(t => this.fields[fieldName]?.selections[t])
              break
            case false:
              _value = this.fields[fieldName]?.selections[objectValue.value]
              break
            default:
              break
          }
        } else {
          _value = objectValue.value
        }
      }
      return `${_fieldName}：${_relation} ${_value}`
    },
    // get user information from the userTree based on userid
    getOffice(objectValue) {
      const { userIds = [], groupIds = [], roleIds = [] } = objectValue
      const ids = [...userIds, ...groupIds, ...roleIds]
      return getOffice(ids)
    },
    // delete user tag
    delUserTag(userid, item) {
      // const { userIds = [], groupIds = [], roleIds = [] } = item.objectValue
      const objectValue = item.objectValue
      // debugger
      for (const key in objectValue) {
        const ids = objectValue[key]
        const index = ids.findIndex(v => v === userid)
        if (index !== -1) {
          item.objectValue[key].splice(index, 1)
          break
        }
      }
    },
    // get userName from userList based on userid
    getUserName(id) {
      if (isArray(id)) {
        // const arr = this.userOptions.filter(t => id.includes(t.value))
        // return arr.join(',')
        const arr = []
        this.userOptions.map(t => {
          if (id.includes(t.id)) {
            arr.push(t.name)
          }
        })
        return arr.join('，')
      } else {
        const arr = this.userOptions.filter(t => t.id === id)
        return arr[0]?.name || ''
      }
    },
    showUserTree(item) {
      const { userIds = [], groupIds = [], roleIds = [] } = item.objectValue
      const ids = [...userIds, ...groupIds, ...roleIds]
      // use callback fn to listen and change objectValue
      EventBus.$emit('user_tree', (res) => {
        const _groupIds = []
        const _roleIds = []
        const _userIds = []
        for (let i = 0; i < res.length; i++) {
          const user = res[i]
          switch (user.type) {
            case USER_TREE_TYPE.OFFICE: {
              _groupIds.push(user.id)
              break
            }
            case USER_TREE_TYPE.ROLE: {
              _roleIds.push(user.id)
              break
            }
            case USER_TREE_TYPE.USER: {
              _userIds.push(user.id)
              break
            }
            default:
              break
          }
        }
        item.objectValue = { userIds: [..._userIds], groupIds: [..._groupIds], roleIds: [..._roleIds] }
      }, ids)
    },
    handleClose(done) {
      done()
    },
    delNode() {
      // debugger
      const { branchId } = this.nodeConfig
      if (branchId) { // 有branchId，标记update
        // this.SET_BRANCH_IDS({ ...this.branchIds, [branchId]: 'UPDATE' })
        SET_BRANCH_IDS(branchId, 'UPDATE')
      }
      this.$emit('update:nodeConfig', this.nodeConfig.childNode)
    },
    delTerm(index) {
      this.$confirm('该分支下所有节点将被删除,确认继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const deleteNodeConfig = this.nodeConfig.branchList.splice(index, 1)
          const { childNode } = deleteNodeConfig[0]
          this.$emit('update:nodeConfig', this.nodeConfig)
          if (childNode.branchId) { // 有branchId，标记update
            // this.SET_BRANCH_IDS({ ...this.branchIds, [childNode.branchId]: 'DELETE' })
            SET_BRANCH_IDS(childNode.branchId, 'DELETE')
          }
          if (this.nodeConfig.branchList.length === 1) {
            if (this.nodeConfig.childNode) {
              if (this.nodeConfig.branchList[0].childNode) {
                this.reData(
                  this.nodeConfig.branchList[0].childNode,
                  this.nodeConfig.childNode
                )
              } else {
                this.nodeConfig.branchList[0].childNode = this.nodeConfig.childNode
              }
            }
            this.$emit(
              'update:nodeConfig',
              this.nodeConfig.branchList[0].childNode
            )
          }
        })
        .catch(() => {})
    },
    reData(data, addData) {
      if (!data.childNode) {
        data.childNode = addData
      } else {
        this.reData(data.childNode, addData)
      }
    },
    isFieldDisabled(fieldName) {
      return this.conditionConfig.conditions.some(t => {
        return fieldName === t.fieldName
      })
    }
  }
}
</script>
<style lang="scss">
.approverDrawer,
.conditionDrawer {
  header > span:focus {
    outline: none;
  }
}
</style>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
p {
  margin: 0;
}
.node-wrap {
  padding: 0 32px;
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  .node-wrap-box {
    width: 320px;
    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
    .title {
      position: relative;
      display: flex;
      padding: 12px 20px;
      justify-content: space-between;
      .title-left {
        width: 190px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .priority-level {
        padding-right: 20px;
      }
      .action-close {
        position: absolute;
        font-size: 16px;
        right: 10px;
        cursor: pointer;
      }
    }
    .content {
      min-height: 80px;
      padding: 12px 20px;
      color: #666;
      .text {
        display: flex;
        flex-direction: column;
        color: #000;
        .approver {
          padding-bottom: 12px;
          border-bottom: 1px dashed #cccccc;
        }
        span {
          color: #999999;
          margin-top: 4px;
        }
      }
    }
  }
  .node-wrap-box {
    cursor: pointer;
  }
  .node-wrap-box.start-node {
    .title {
      color: #0045ff;
      background: #e9f2ff;
    }
  }
  .node-wrap-box.condition-node {
    &:hover {
      box-shadow: 0 0 0 1px $--custom--color--primary;
    }
    .title {
      color: $--custom--color--primary;
      background: #d4faf1;
    }
  }
  .node-wrap-box.approve-node {
    &:hover {
      box-shadow: 0 0 0 1px #fcad22;
    }
    .title {
      color: #fcad22;
      background: #fff9ee;
    }
  }
}
.branch-wrap {
  width: 100%;
  display: inline-flex;
  .branch-wrap-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .branch-box {
      display: flex;
      border-top: 2px solid #ccc;
      border-bottom: 2px solid #ccc;
      .col-box {
        position: relative;
        padding-top: 24px;
        .action-close.branch-close {
          position: absolute;
          font-size: 16px;
          right: 42px;
          top: 36px;
          color: $--custom--color--primary;
          cursor: pointer;
          z-index: 1;
        }
        &::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 2px;
          background-color: #cccccc;
          z-index: -1;
        }
      }
      .top-left-cover-line {
        position: absolute;
        top: -2px;
        left: -1px;
        height: 3px;
        width: 50%;
        background-color: #f1f1f1;
      }
      .bottom-left-cover-line {
        position: absolute;
        bottom: -2px;
        left: -1px;
        height: 3px;
        width: 50%;
        background-color: #f1f1f1;
      }
      .top-right-cover-line {
        position: absolute;
        top: -2px;
        right: -1px;
        height: 3px;
        width: 50%;
        background-color: #f1f1f1;
      }
      .bottom-right-cover-line {
        position: absolute;
        bottom: -2px;
        right: -1px;
        height: 3px;
        width: 50%;
        background-color: #f1f1f1;
      }
    }
    .branch-end-middle-line {
      position: relative;
      height: 44px;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 2px;
        height: 100%;
        margin: auto;
        z-index: -1;
        background-color: #CCCCCC;
      }
    }
  }
}
.drawer-content-wrap {
  display: flex;
  flex-direction: column;
  // height: 100%;
  height: calc(100vh - 68px);
  // overflow: auto;
  .drawer-content {
    flex: 1;
    padding: 20px;
    .person-type {
      .label {
        margin-bottom: 20px;
      }
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }
    .person {
      .label {
        margin-bottom: 20px;
      }
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }
    .person-set {
      .label {
        margin-bottom: 20px;
      }
      .checkbox {
        margin-bottom: 10px;
      }
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }
    .branch-info {
      display: flex;
      margin-bottom: 30px;
      .condition-name {
        width: 40%;
        margin-right: 20px;
      }
      .condition-priority {
        width: 120px;
      }
    }
    .drawer-condition-wrap {
      .title {
        display: block;
        margin-bottom: 20px;
      }
      .drawer-conditions {
        .drawer-condition-row {
          position: relative;
          display: flex;
          // align-items: center;
          padding-right: 40px;
          margin-bottom: 20px;
          .field {
            width: 120px;
            margin-right: 10px;
          }
          .relation {
            width: 90px;
            margin-right: 10px;
          }
          .value {
            width: 400px;
          }
          .value-min,.value-max {
            width: 190px;
          }
          .close-icon {
            position: absolute;
            width: 26px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            top: 5px;
            right: 0px;
            border-radius: 50%;
            background-color: #ccc;
            color: #fff;
            cursor: pointer;
          }
          .user-wrap {
            flex: 1;
            .user-tag {
              margin-right: 10px;
              margin-bottom: 10px;
            }
          }
        }
      }
      .add-condition-wrap {
        // margin-top: 20px;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        .add-condition-icon {
          display: block;
          margin-right: 4px;
          width: 16px;
          height: 16px;
          text-align: center;
          line-height: 16px;
          background-color: #2A44FF;
          color: #fff;
          font-size: 14px;
        }
        .add-condition-btn {
         color: #0045FF;
         font-size: 14px;
        }
      }
    }
  }
  .drawer-footer {
    padding: 20px;
  }
}
</style>
