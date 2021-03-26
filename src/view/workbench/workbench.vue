<template>
  <!-- <Panel></Panel> -->
  <Aaa ref="childRules" :form-config="formConfig" :value="form" :rules="rules" />
</template>

<script>
// import Panel from '../../components/panelPrimary.vue'
import Aaa from '../../components/aaa.vue'
export default {
  components: {
    // Panel
    Aaa
  },
  data() {
    return {
      formConfig: {
        formItemList: [
          [
            {
              type: 'text',
              prop: 'airport',
              label: '站点',
              name: 'airport',
              placeholder: '请输入站点'
            },
            {
              type: 'select',
              prop: 'importOrExport',
              label: '进出港',
              name: 'importOrExport',
              placeholder: '请输入进出港',
              optList: [
                {
                  value: '',
                  label: ''
                },
                {
                  value: '进港',
                  label: '进港'
                },
                {
                  value: '出港',
                  label: '出港'
                }
              ]
            },
            {
              type: 'select',
              prop: 'mainOrSubBill',
              name: 'mainOrSubBill',
              label: '主分单',

              placeholder: '请输入主分单',
              optList: [
                {
                  value: '',
                  label: ''
                },
                {
                  value: '主分',
                  label: '主分'
                },
                {
                  value: '主单',
                  label: '主单'
                }
              ]
            }
          ],
          [
            {
              type: 'datetimerange',
              name: 'pickerdata',
              label: '选择时间',
              prop: 'pickerdata',
              dateFormate: 'yyyy-MM-dd HH:mm:ss'
            },
            {
              type: 'text',
              name: 'largeClass',
              prop: 'largeClass',
              label: '大类',
              placeholder: '请输入大类'
            },
            {
              type: 'select',
              name: 'isDomestic',
              prop: 'isDomestic',
              value: '国内',
              label: '国内/国际',
              placeholder: '请输入国内/国际',
              optList: [
                {
                  value: '',
                  label: ''
                },
                {
                  value: '国内',
                  label: '国内'
                },
                {
                  value: '国际',
                  label: '国际'
                }
              ]
            }
          ],
          [
            {
              type: 'switch',
              name: 'save',
              prop: 'save',
              label: '保存'
            },
            {
              type: 'radio',
              name: 'radio',
              prop: 'radio',
              label: '活动类型',
              optList: ['演唱会', '球赛']
            },
            {
              type: 'Checkbox',
              label: '爱好',
              prop: 'Checkbox',
              name: 'Checkbox',
              checkboxs: [
                { label: '羽毛球', value: 'badminton' },
                { label: '篮球', value: 'basketball' },
                { label: '足球', value: 'football' },
                { label: '兵乓球', value: 'pong' }
              ]
            }
          ]
        ],

        operate: [
          {
            type: 'primary',
            name: '查询',
            handleClick: this.search
          },
          {
            type: 'primary',
            name: '重置',
            handleClick: this.add
          }
        ]
      },
      rules: {
        airport: [{ required: true, message: '请输入站点', trigger: 'blur' }],
        importOrExport: [
          { required: true, message: '请输入进出港', trigger: 'blur' }
        ],
        largeClass: [
          { required: true, message: '请输入大类', trigger: 'blur' }
        ],
        mainOrSubBill: [
          { required: true, message: '请输入主分单', trigger: 'blur' }
        ],
        isDomestic: [
          { required: true, message: '请输入国内/国际', trigger: 'blur' }
        ],
        pickerdata: [
          { required: true, message: '请输入时间', trigger: 'change' }
        ]
      },
      form: {
        isDomestic: '国内',
        mainOrSubBill: '主分',
        importOrExport: '进港',
        airport: '',
        largeClass: '',
        Checkbox: [],
        pickerdata: [],
        save: false,
        radio: ''
      }
    }
  },
  methods: {
    // 查询
    search() {
      const flag = this.$refs['childRules'].validateForm()
      if (flag) {
        console.log(this.form)
      }
    },
    // 新增或重置
    add() {
      this.$refs['childRules'].resetFields()
    }
  }
}
</script>

<style>
</style>
