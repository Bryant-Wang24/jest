<template>
  <div class="info">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ gender[scope.row.gender] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="position" label="职位" />
      <el-table-column prop="wechat" label="微信号" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="fixedPhone" label="固定电话" />
    </el-table>
    <!-- <contactTable :table-data="tableData" :table-header="tableHeader" /> -->
  </div>
</template>

<script>
// import contactTable from '@/components/table/table'
import { GENDER_OBJECT } from '@/common/customerMsg'
export default {
  // components: { contactTable },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      gender: GENDER_OBJECT,
      // tableData: [
      //   {
      //     name: '啊啊啊',
      //     gender: '男',
      //     iphone: '13111111111',
      //     position: 'adasdasd',
      //     wechat: 'wwwwwww',
      //     email: 'assad@asdad.com',
      //     tel: '21312312'
      //   },
      //   {
      //     name: '啊啊222啊',
      //     gender: '女',
      //     iphone: '13111111111',
      //     position: 'adasdasd',
      //     wechat: 'wwwwwww',
      //     email: 'assad@asdad.com',
      //     tel: '21312312'
      //   }
      // ],
      tableHeader: [
        {
          key: 'name',
          text: '姓名'
        },
        {
          key: 'gender',
          text: '性别'
        },
        {
          key: 'phone',
          text: '联系电话'
        },
        {
          key: 'position',
          text: '职位'
        },
        {
          key: 'wechat',
          text: '微信号'
        },
        {
          key: 'email',
          text: 'Email'
        },
        {
          key: 'fixedPhone',
          text: '固定电话'
        }
      ]
    }
  },
  computed: {},
  mounted() {
    console.log('tableData', this.tableData)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.info {
  padding: 20px 0;
  font-size: 14px;
}
.formItem {
  display: flex;
  margin-bottom: 14px;
  .label {
    width: 160px;
    margin-right: 10px;
    text-align: right;
    color: #666;
  }
  .value {
    flex: 1;
    img {
      margin-right: 6px;
    }
  }
}
</style>
