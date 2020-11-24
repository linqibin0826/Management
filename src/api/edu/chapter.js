import request from "@/utils/request"

export default {
  //根据路径中的课程ID获取对应的所有章节信息
  getChapterAndVideoInfoByCourseId(courseId) {
    return request({
      url: '/eduservice/chapter/getChapterAndVideoInfoByCourseId/' + courseId,
      method: 'get'
    })
  },
  //根据章节ID删除章节信息
  removeChapterById(id) {
    return request({
      url: `/eduservice/chapter/deleteChapterInfoById/${id}`,
      method: 'delete'
    })
  },
  //新增章节
  saveChapterInfo(chapterInfo) {
    return request({
      url: `/eduservice/chapter/saveChapterInfo`,
      method: 'post',
      data: chapterInfo
    })
  },
  //根据章节ID查找对应的章节信息
  getChapterInfoById(id) {
    return request({
      url: `/eduservice/chapter/getChapterInfoById/${id}`,
      method: 'get'
    })
  },
  //根据章节ID修改章节信息
  updateChapterInfoById(ChapterInfo) {
    return request({
      url: `/eduservice/chapter/updateChapterInfoById`,
      method: 'post',
      data: ChapterInfo
    })
  }
}
