export default {
  components: {
    // 展馆
    '/views/baseConfig/hall': () => import('@/views/baseConfig/hall'),
    '/views/baseConfig/info/hallInfo': () => import('@/views/baseConfig/info/hallInfo'),
    '/views/baseConfig/info/hallConfig': () => import('@/views/baseConfig/info/hallConfig')

  },
  name: {
    // 展馆
    '/baseConfig/hall': 'BaseConfigHall',
    '/baseConfig/hallDetail': 'BaseConfigHallDetail',
    '/baseConfig/hallEdit': 'BaseConfigHallEdit',
    '/baseConfig/hallAdd': 'BaseConfigHallAdd',
    '/baseConfig/hallConfig': 'BaseConfigHallConfig'
  }
}
