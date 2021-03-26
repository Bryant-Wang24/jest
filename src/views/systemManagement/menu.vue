<template>
  <Layout>
    <div slot="head">
      <el-button icon="el-icon-plus">添加</el-button>
    </div>
    <div>
      <MainTitle />
      <div>
        <el-button icon="el-icon-plus">添加</el-button>
        <el-button @click="toInfo('SystemManagementMenuEdit')">编辑</el-button>
        <el-button
          @click="toInfo('SystemManagementMenuDetail')"
        >详情</el-button>
      </div>
      <TablePager
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="menuList"
        :is-pagination="false"
        @page="getPage"
      >
        <el-table-column prop="name" label="名称" width="180" />
        <!-- <el-table-column prop="href" label="前端路由" width="180" /> -->
        <el-table-column prop="href" label="JSP链接" width="180" />
        <el-table-column :formatter="isMenu" label="类型" width="180" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="toEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </TablePager>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import { mapState } from 'vuex'
export default {
  name: 'SystemManagementMenu',
  components: {
    Layout,
    MainTitle,
    TablePager
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          children: [
            {
              id: 12,
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            },
            {
              id: 132,
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            },
            {
              id: 1332,
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            }
          ]
        },
        {
          id: 1232,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          id: 123332,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          id: 122232,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      menuList(state) {
        return state['systemManagement/menu'].menuList
      }
    })
  },
  filters: {
    hasChild(val) {
      return val && val.children && val.children.length > 0
    },
    isMenu(val) {
      console.log(val)
    }
  },
  methods: {
    getPage(page) {
      console.log(page)
    },
    toInfo(routerName, query) {
      this.$router.push({
        name: routerName,
        query: query || {}
      })
    },
    toEdit(row) {
      console.log(row)
      // this.toInfo('SystemManagementMenuEdit', { id: row.id })
    },
    isMenu(row) {
      if (row.href) {
        return `菜单`
      } else {
        if (row.children.length > 0) {
          return `菜单`
        } else {
          return `按钮`
        }
      }
    }
  }
}
</script>

<style></style>
