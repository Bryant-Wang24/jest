<template>
  <Layout :use-head="false" :use-foot="false">
    <div>
      <MainTitle />
      <div>
        <el-button icon="el-icon-plus" @click="toEdit">添加</el-button>
      </div>
      <TablePager
        :current-page="page.pageNo"
        :data="tableData"
        :total="30"
        @page="getPage"
      >
        <el-table-column label="会议名称" prop="date" width="180" />
        <el-table-column label="会议组织者" prop="name" width="180" />
        <el-table-column label="会议编号" prop="address" width="180" />
        <el-table-column label="计划开始时间" prop="start" width="180" />
        <el-table-column label="计划结束时间" prop="end" width="180" />
        <el-table-column label="会议类型" prop="type" width="180" />
        <el-table-column label="会议室" prop="room" width="180" />
        <el-table-column label="参会人员" prop="person" width="180" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="toEdit(scope.row)">编辑</el-button>
            <ConfirmButton
              size="mini"
              type="danger"
              @onConfirm="deleteRow(scope.row)"
            >删除</ConfirmButton>
          </template>
        </el-table-column>
      </TablePager>
    </div>
  </Layout>
</template>

<script>
import ListMixins from '@/mixins/ems/ListMixins'
import api from '@/api/index'

export default {
  name: 'KeepAlive',
  components: {},
  mixins: [ListMixins],
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: '时刻充满正能量',
          name: '鲜总监',
          address: '001',
          start: '9:00',
          end: '9:30',
          type: '办公会议',
          room: '早会会议室',
          person: '全体人员'
        },
        {
          id: 1232,
          date: '自信的生命最美丽',
          name: '鲜总监',
          address: '002',
          start: '9:00',
          end: '9:30',
          type: '办公会议',
          room: '早会会议室',
          person: '全体人员'
        },
        {
          id: 123332,
          date: '团结一心其利断金',
          name: '鲜总监',
          address: '003',
          start: '9:00',
          end: '9:30',
          type: '办公会议',
          room: '早会会议室',
          person: '全体人员'
        },
        {
          id: 122232,
          date: '超越第一实现梦想',
          name: '鲜总监',
          address: '004',
          start: '9:00',
          end: '9:30',
          type: '办公会议',
          room: '早会会议室',
          person: '全体人员'
        }
      ],
      officeData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1',
              disabled: true
            },
            {
              id: 6,
              disabled: true,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      ruleForm: {
        office: {
          id: '',
          label: ''
        },
        loginName: '',
        name: '',
        email: '',
        mobile: ''
      },
      treeDialogVisible: false
    }
  },
  methods: {
    initDataFn() {
      // 这里调用初始化的方法
    },
    searchPage() {
      this.resetPage()
    },
    resetForm() {
      this.ruleForm = {
        office: {
          id: '',
          label: ''
        },
        loginName: '',
        name: '',
        email: '',
        mobile: ''
      }
    },
    created() {
      this.getList()
    },
    getList() {
      const res = this.tableData
      console.log(res)
    },
    toEdit(row) {
      // this.toRouter('SystemManagementUserEdit', { id: row.id })
      this.$router.push({ name: 'AddMeeting' })
    },
    toggleTreeDialog(isOpen) {
      this.treeDialogVisible = !!isOpen
    },
    getCurrentNode(row) {
      this.ruleForm.office = row
      this.toggleTreeDialog(false)
    },
    deleteRow(row) {
      console.log(row)
    }
  }
}
</script>

<style></style>
