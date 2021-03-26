import officeMixins from '@/mixins/ems/office'
import userMixins from '@/mixins/ems/user'
export default {
  mixins: [officeMixins, userMixins],
  data() {
    return {
      officeTypeList: [
        {
          value: '1',
          label: '公司'
        }, {
          value: '2',
          label: '部门'
        }, {
          value: '3',
          label: '小组'
        }
      ],
      officeGradeList: [
        {
          value: '1',
          label: '一级'
        }, {
          value: '2',
          label: '二级'
        }, {
          value: '3',
          label: '三级'
        }, {
          value: '4',
          label: '四级'
        }
      ]
    }
  }
}
