import api from '@/api/index'
export default {
  data() {
    return {
      userList: []
    }
  },
  methods: {
    getMenuData() {
      api.systemManagement.userTreeData().then(res => {
        this.userList = res
      })
    }
  }
}
