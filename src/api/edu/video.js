import request from "@/utils/request"

export default {
  saveVideo(video) {
    return request({
      url: `/eduservice/video/addVideo`,
      method: 'post',
      data: video
    })
  },
  deleteVideoById(id) {
    return request({
      url: `/eduservice/video/deleteVideoById/${id}`,
      method: 'delete'
    })
  },
  updateVideoById(video) {
    return request({
      url: `/eduservice/video/getVideoById`,
      method: 'post',
      data: video
    })
  },
  getVideoById(id) {
    return request({
      url: `/eduservice/video/updateVideoById${id}`,
      method: 'get'
    })
  },

}
