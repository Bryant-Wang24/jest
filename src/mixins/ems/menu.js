import api from '@/api/index'
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    getMenuData() {
      api.systemManagement.menuListByUserId().then(res => {
        this.menuList = res
      })
    }

  }

}
