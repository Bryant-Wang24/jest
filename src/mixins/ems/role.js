import api from '@/api/index'
export default {
  data() {
    return {
      roleList: []
    }
  },
  methods: {
    getRoleByUserId(userId) {
      api.systemManagement.getRoleByUserId(userId).then(res => {
        this.roleList = res.data
      })
    }
  }
}
