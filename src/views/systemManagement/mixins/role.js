import officeMixins from '@/mixins/ems/office'
import menuMixins from '@/mixins/ems/menu'
export default {
  mixins: [officeMixins, menuMixins],
  data() {
    return {
      dataScopeList: [
        {
          value: '1',
          label: '所有数据'
        },
        {
          value: '2',
          label: '所在公司及以下数据'
        },
        {
          value: '3',
          label: '所在公司数据'
        },
        {
          value: '4',
          label: '所在部门及以下数据'
        },
        {
          value: '5',
          label: '所在部门数据'
        },
        {
          value: '8',
          label: '仅本人数据'
        },
        {
          value: '9',
          label: '按明细设置'
        }
      ],
      useableStatus: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      roleTypeList: [
        { value: 'assignment', label: '任务分配' },
        { value: 'security-role', label: '管理角色' },
        { value: 'user', label: '普通角色' }
      ]
    }
  }
}
