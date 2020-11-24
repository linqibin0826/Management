import request from "@/utils/request"

export default {
  getAllSubject() {
    return request({
      url: `/eduservice/subject/getAllSubject`,
      method: 'get'
    })
  },
  getSubjectsByPid(pid) {
    return request({
      url: `/eduservice/subject/getSubjectsByPid/${pid}`,
      method: 'get'
    })
  }
}
