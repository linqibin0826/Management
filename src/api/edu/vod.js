import request from "@/utils/request"

export default {

  removeById(id) {
    return request({
      url: `/eduvod/video/remove/${id}`,
      method: 'delete'
    })
  },
  upload(file) {
    return request({
      url: `/eduvod/video/upload`,
      method: 'post',
      data: file
    })
  }

}
