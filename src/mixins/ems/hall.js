import api from '@/api/index'
export default {
  data() {
    return {
      hallList: []
    }
  },
  methods: {
    getHallList() {
      api.baseConfig.getHallList().then(res => {
        this.hallList = res.data
      })
    }
  }
}
