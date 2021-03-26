export default {
  methods: {
    formatImages(images) {
      return images.map(img => {
        return this.formatImage(img)
      })
    },
    formatImage(img) {
      const url = img.address || `/a/api/image/downloadByimageId?imageId=${img.imageId}`
      return {
        status: 'success',
        name: img.name,
        url: url,
        response: {
          resultCode: 0,
          data: {
            imageId: img.imageId,
            address: img.address
          }
        }
      }
    }
  }
}
