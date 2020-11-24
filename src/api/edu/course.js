import request from "@/utils/request"

export default {
  saveCourse(courseInfo) {
    return request({
      url: `/eduservice/course/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  //根据课程ID查询课程基本信息
  getCourseInfoByCourseId(courseId) {
    return request({
      url: `/eduservice/course/getCourseInfoByCourseId/${courseId}`,
      method: 'get'
    })
  },
  //修改课程基本信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/course/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },

  getPrepublishCourseInfoById(courseId) {
    return request({
      url: `/eduservice/course/getPrePublishInfoById/${courseId}`,
      method: 'get'
    })
  },

  getAllCourses() {
    return request({
      url: `/eduservice/course/getAllCourse`,
      method: 'get'
    })
  },

  getCoursesByCP(current, limit, condition) {
    return request({
      url: `/eduservice/course/getCoursesByConditionAndPageInfo/${current}/${limit}`,
      method: 'post',
      data: condition
    })
  },


  deleteByCourseId(id) {
    return request({
      url: `/eduservice/course/removeCourseById/${id}`,
      method: 'delete'
    })
  }
}
