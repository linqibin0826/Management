import request from '@/utils/request'

 export default {
    //查询讲师
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //data表示把对象转换json进行传递到接口里面
            data: teacherQuery
        })
    },

   //查询所有教师
   getAllTeacher() {
     return request({
       url: `/eduservice/teacher/findAll`,
       method: 'get'
     })
   },

    //删除讲师
    removeTeacherById(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })
    },

    //添加讲师
    addTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: "post",
            data: teacher
        })
    },

    //根据id查询讲师信息用于回显
    getTeacherById(id) {
        return request({
            url: `/eduservice/teacher/getTeacherById/${id}`,
            method: 'get'
        })
    },

    //讲师信息修改
    updateTeacher(teacher) {
        return request({
            url: `eduservice/teacher/updateTeacherById`,
            method: 'post',
            data: teacher
        })

    }
 }
