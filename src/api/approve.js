import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'
// import request from '@/utils/request'
/**
 * EQUAL("等于"),
 * NOT_EQUAL("不等于"),
 * GREATER_THAN("大于"),
 * LESS_THAN("小于"),
 * GREATER_THAN_OR_EQUAL("大于等于"),
 * LESS_THAN_OR_EQUAL("小于等于"),
 * BETWEEN("介于"),
 * IN("为"),
 * NOT_IN("不为"),
 * BELONG("属于"),
 * NOT_BELONG("不属于");
 */

const approve = {
  /**
   * @method 获取事件
   */
  getEvents: () => {
    return axios.get(`${base.hall}api/approval/events`)
    // return Promise.resolve([
    //   {
    //     'category': '客户',
    //     'eventKey': 'com.jiuxiang.CustomerAddEvent',
    //     'eventName': '新增客户',
    //     'enabled': false
    //   },
    //   {
    //     'category': '客户',
    //     'eventKey': 'com.jiuxiang.CustomerDeleteEvent',
    //     'eventName': '删除客户',
    //     'enabled': true
    //   },
    //   {
    //     'category': '合同',
    //     'eventKey': 'com.jiuxiang.CustomerAddHetong',
    //     'eventName': '删除合同',
    //     'enabled': true
    //   },
    //   {
    //     'category': '合同',
    //     'eventKey': 'com.jiuxiang.CustomerDeleteHetong',
    //     'eventName': '删除合同',
    //     'enabled': true
    //   }
    // ])
  },
  /**
   * @method 获取事件分支数据
   * @param {string} eventKey 事件ley
   */
  getBranchs: eventKey => {
    return axios.get(`${base.hall}api/approval/events/${eventKey}/branches`)
    // return Promise.resolve([
    //   {
    //     'id': 17,
    //     'eventKey': 'TEST_EVENT',
    //     'name': '分支1',
    //     'priority': 1,
    //     'conditions': [
    //       {
    //         'id': 15,
    //         'fieldName': 'text',
    //         'relation': 'EQUAL',
    //         'objectValue': {
    //           'value': 'stringValue'
    //         }
    //       },
    //       {
    //         'id': 16,
    //         'fieldName': 'number',
    //         'relation': 'BETWEEN',
    //         'objectValue': {
    //           'max': '100',
    //           'min': '500'
    //         }
    //       },
    //       {
    //         'id': 17,
    //         'fieldName': 'user',
    //         'relation': 'IN',
    //         'objectValue': {
    //           'userIds': ['2761796cd8974216906ad63873f5a295', 'faeed73fcc09499781b2a54923f9a97d'],
    //           'groupIds': ['a29f5c36b3574f47b13e32a3366863cb', '5bf26ea4d3274c70b15b98cd9cc69dfe'],
    //           'roleIds': ['15fb306df35b409ab65ec82388dd1a38']
    //         }
    //       },
    //       {
    //         'id': 99,
    //         'fieldName': 'date',
    //         'relation': 'BETWEEN',
    //         'objectValue': {
    //           'max': '2020-01-01 09:00:00',
    //           'min': '2020-01-07 18:00:00'
    //         }
    //       }
    //     ],
    //     'approverNodes': [
    //       {
    //         'id': 2,
    //         'name': '审批节点1',
    //         'approverIds': [
    //           '139660b542924aac9e23dae62d648dbb'
    //           // '4ef9bfa269a94c5196fa1bd568eb7b66'
    //         ],
    //         'approveGroupIds': [
    //         ],
    //         'addable': true,
    //         'transferable': true,
    //         'reversible': false
    //       }
    //     ],
    //     'enabled': true,
    //     'createBy': '32536ff906304b79801cdb056d2c0501',
    //     'updateBy': '32536ff906304b79801cdb056d2c0501',
    //     'createDate': '2020-11-25 15:54:56',
    //     'updateDate': '2020-11-25 15:54:56'
    //   }
    //   // {
    //   //   'id': 18,
    //   //   'eventKey': 'TEST_EVENT',
    //   //   'name': '分支2',
    //   //   'priority': 2,
    //   //   'conditions': [
    //   //     {
    //   //       'id': 15,
    //   //       'fieldName': 'date',
    //   //       'relation': 'BETWEEN',
    //   //       'objectValue': {
    //   //         'max': '2020-01-01',
    //   //         'min': '2020-01-07'
    //   //       }
    //   //     }
    //   //   ],
    //   //   'approverNodes': [
    //   //     {
    //   //       'id': 2,
    //   //       'name': '审批节点1',
    //   //       'approverIds': [
    //   //         1001
    //   //       ],
    //   //       'approveGroupIds': [
    //   //         '1000',
    //   //         '1001'
    //   //       ],
    //   //       'addable': true,
    //   //       'transferable': true,
    //   //       'reversible': false
    //   //     },
    //   //     {
    //   //       'id': 3,
    //   //       'name': '审批节点2',
    //   //       'approverIds': [
    //   //         1003
    //   //       ],
    //   //       'approveGroupIds': [
    //   //         '1000',
    //   //         '1001'
    //   //       ],
    //   //       'addable': true,
    //   //       'transferable': true,
    //   //       'reversible': false
    //   //     }
    //   //     // {
    //   //     //   'id': 4,
    //   //     //   'name': '审批节点3',
    //   //     //   'approverIds': [
    //   //     //     '1',
    //   //     //     '2'
    //   //     //   ],
    //   //     //   'approveGroupIds': [
    //   //     //     '1000',
    //   //     //     '1001'
    //   //     //   ],
    //   //     //   'addable': true,
    //   //     //   'transferable': true,
    //   //     //   'reversible': false
    //   //     // }
    //   //   ],
    //   //   'enabled': true,
    //   //   'createBy': '32536ff906304b79801cdb056d2c0501',
    //   //   'updateBy': '32536ff906304b79801cdb056d2c0501',
    //   //   'createDate': '2020-11-25 15:54:56',
    //   //   'updateDate': '2020-11-25 15:54:56'
    //   // }
    // ])
  },
  /**
   * @method 获取事件可配置的条件
   */
  getConditions: eventKey => {
    return axios.get(`${base.hall}api/approval/events/${eventKey}/conditions`)
    // return Promise.resolve(
    //   [
    //     {
    //       'fieldName': 'text',
    //       'label': '文本',
    //       'type': 'STRING',
    //       'selections': [],
    //       'typeUsableRelations': [
    //         {
    //           'label': '等于',
    //           'value': 'EQUAL'
    //         },
    //         {
    //           'label': '不等于',
    //           'value': 'NOT_EQUAL'
    //         },
    //         {
    //           'label': '为',
    //           'value': 'IN'
    //         },
    //         {
    //           'label': '不属于',
    //           'value': 'NOT_BELONG'
    //         }
    //       ]
    //     },
    //     {
    //       'fieldName': 'number',
    //       'label': '数值',
    //       'type': 'NUMBER',
    //       'selections': [
    //       ],
    //       'typeUsableRelations': [
    //         {
    //           'label': '等于',
    //           'value': 'EQUAL'
    //         },
    //         {
    //           'label': '不等于',
    //           'value': 'NOT_EQUAL'
    //         },
    //         {
    //           'label': '为',
    //           'value': 'IN'
    //         },
    //         {
    //           'label': '不属于',
    //           'value': 'NOT_BELONG'
    //         },
    //         {
    //           'label': '介于',
    //           'value': 'BETWEEN'
    //         }
    //       ]
    //     },
    //     {
    //       'fieldName': 'date',
    //       'label': '日期',
    //       'type': 'DATE',
    //       'selections': [],
    //       'typeUsableRelations': [
    //         {
    //           'label': '等于',
    //           'value': 'EQUAL'
    //         },
    //         {
    //           'label': '不等于',
    //           'value': 'NOT_EQUAL'
    //         },
    //         {
    //           'label': '为',
    //           'value': 'IN'
    //         },
    //         {
    //           'label': '不属于',
    //           'value': 'NOT_BELONG'
    //         },
    //         {
    //           'label': '介于',
    //           'value': 'BETWEEN'
    //         }
    //       ]
    //     },
    //     {
    //       'fieldName': 'user',
    //       'label': '用户',
    //       'type': 'USER',
    //       'selections': [],
    //       'typeUsableRelations': [
    //         {
    //           'label': '等于',
    //           'value': 'EQUAL'
    //         },
    //         {
    //           'label': '不等于',
    //           'value': 'NOT_EQUAL'
    //         },
    //         {
    //           'label': '为',
    //           'value': 'IN'
    //         },
    //         {
    //           'label': '不属于',
    //           'value': 'NOT_BELONG'
    //         }
    //       ]
    //     }
    //   ]
    // )
  },
  /**
   * @method 保存事件
   */
  saveBranchs: (eventKey, params) => {
    return axios.post(`${base.hall}api/approval/events/${eventKey}/branches`, params)
  },
  /**
   * @method 获取用户列表
   */
  getUserList: () => {
    return axios.get(`${base.admin}api/hall/rest/hallUser/userList`)
  },
  /**
   * @method 根据id获取审批流
   * @param id 审批流id
   */
  getApprovalFromId: id => {
    return axios.get(`${base.admin}api/approval/${id}`)
    // return Promise.resolve(
    //   {
    //     'id': 19,
    //     'eventKey': 'TEST_EVENT',
    //     'objectId': '123',
    //     'nodes': [
    //       {
    //         'id': 307675156501,
    //         'approvalFlowId': 19,
    //         'approverId': '025daa96cd634894907b819aac95692b',
    //         'approverName': '虞一平1',
    //         'state': 'PASSED',
    //         'addable': true,
    //         'transferable': true,
    //         'reversible': true,
    //         'nextId': 30961154050,
    //         'createDate': '2020-12-02 15:35:22',
    //         'updateDate': '2020-12-02 15:35:22',
    //         'remark': '审核通过信息，审核通过信息'
    //       },
    //       {
    //         'id': 307675156502,
    //         'approvalFlowId': 19,
    //         'approverId': '00feb701fd614cf6b67054ae1d5ca4c5',
    //         'approverName': '张钧甯',
    //         'state': 'PENDING',
    //         'addable': true,
    //         'transferable': true,
    //         'reversible': true,
    //         'nextId': 30959843330,
    //         'createDate': '2020-12-02 15:35:22',
    //         'updateDate': '2020-12-02 15:35:22'
    //       },
    //       {
    //         'id': 307675156503,
    //         'approvalFlowId': 19,
    //         'approverId': '025daa96cd634894907b819aac95692b',
    //         'approverName': '虞一平2',
    //         'state': 'REFUSE',
    //         'addable': true,
    //         'transferable': true,
    //         'reversible': true,
    //         'nextId': 30959282180,
    //         'createDate': '2020-12-02 15:35:22',
    //         'updateDate': '2020-12-02 15:35:22'
    //       },
    //       {
    //         'id': 307675156504,
    //         'approvalFlowId': 19,
    //         'approverId': '00feb701fd614cf6b67054ae1d5ca4c5',
    //         'approverName': '张钧甯2',
    //         'state': 'REVERSED',
    //         'addable': true,
    //         'transferable': true,
    //         'reversible': true,
    //         'nextId': 30957996030,
    //         'createDate': '2020-12-02 15:35:22',
    //         'updateDate': '2020-12-02 15:35:22'
    //       },
    //       {
    //         'id': 307675156505,
    //         'approvalFlowId': 19,
    //         'approverId': '1c370c0474fe4e498d5eeaf1a968aa6d',
    //         'approverName': '阮一峰',
    //         'state': 'PENDING',
    //         'addable': true,
    //         'transferable': false,
    //         'reversible': false,
    //         'nextId': 307675156506,
    //         'createDate': '2020-12-02 15:35:22',
    //         'updateDate': '2020-12-02 15:35:22'
    //       },
    //       {
    //         'id': 307675156506,
    //         'approvalFlowId': 19,
    //         'approverId': '00feb701fd614cf6b67054ae1d5ca4c5',
    //         'approverName': '库克',
    //         'state': 'PENDING',
    //         'addable': true,
    //         'transferable': true,
    //         'reversible': true,
    //         'nextId': 307675156507,
    //         'createDate': '2020-12-02 15:35:22',
    //         'updateDate': '2020-12-02 15:35:22'
    //       },
    //       {
    //         'id': 307675156507,
    //         'approvalFlowId': 19,
    //         'approverId': '00feb701fd614cf6b67054ae1d5ca4c5',
    //         'approverName': '孙悟空',
    //         'state': 'PENDING',
    //         'addable': true,
    //         'transferable': true,
    //         'reversible': true,
    //         'nextId': null,
    //         'createDate': '2020-12-02 15:35:22',
    //         'updateDate': '2020-12-02 15:35:22'
    //       }
    //     ],
    //     'firstNodeId': 307675156501,
    //     'activeNodeId': 307675156505,
    //     'creatorId': '32536ff906304b79801cdb056d2c0501',
    //     'creatorName': '蔡嘉伟',
    //     'createDate': '2020-12-02 15:35:22'
    //   }
    // )
  },
  /**
   * @method 获取审批流操作记录
   */
  getLogs: id => {
    return axios.get(`${base.admin}api/approval/${id}/operationRecords`)
    // return Promise.resolve([
    //   {
    //     'id': 2,
    //     'moduleKey': 'APPROVAL',
    //     'subjectId': '22',
    //     'subSubjectId': '163713330100756480',
    //     'action': 'PASS',
    //     'actionDesc': '通过',
    //     'remark': '没问题，通过.',
    //     'operatorId': 'ga01',
    //     'createDate': '2020-12-04 13:55:45',
    //     'objectId': '163713330100756480',
    //     'operatorName': '张一'
    //   },
    //   {
    //     'id': 12,
    //     'moduleKey': 'APPROVAL',
    //     'subjectId': '22',
    //     'subSubjectId': '163713330163093507',
    //     'action': 'PASS',
    //     'actionDesc': '通过',
    //     'remark': '没问题，通过.',
    //     'operatorId': 'ga01',
    //     'createDate': '2020-12-04 13:55:45',
    //     'objectId': null,
    //     'operatorName': '张一'
    //   },
    //   {
    //     'id': 18,
    //     'moduleKey': 'APPROVAL',
    //     'subjectId': '22',
    //     'subSubjectId': '163713330163093507',
    //     'action': 'REVERSE',
    //     'actionDesc': '回退',
    //     'remark': '退回',
    //     'operatorId': 'ga03',
    //     'createDate': '2020-12-04 13:56:32',
    //     'objectId': '307675156505',
    //     'operatorName': 'ga03'
    //   }
    // ])
  },
  /**
   * @method 通过
   */
  pass: (id, params) => {
    return axios.post(`${base.admin}api/approval/nodes/${id}/pass`, params)
  },
  /**
   * @method 拒绝
   */
  reject: (id, params) => {
    return axios.post(`${base.admin}api/approval/nodes/${id}/rejection`, params)
  },
  /**
   * @method 回退
   */
  backed: (id, params) => {
    return axios.post(`${base.admin}api/approval/nodes/${id}/reversion`, params)
  },
  /**
   * @method 加签
   */
  add: (id, params) => {
    return axios.post(`${base.admin}api/approval/nodes/${id}/addition`, params)
  },
  /**
   * @method 转审
   */
  transfer: (id, params) => {
    return axios.post(`${base.admin}api/approval/nodes/${id}/transfer`, params)
  },
  /**
   * @method 批量通过
   */
  batchPass: (params) => {
    return axios.post(`${base.admin}api/approval/pass`, params)
  }
}
export default approve
