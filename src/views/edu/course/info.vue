<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="基本信息"/>
      <el-step title="课程大纲"/>
      <el-step title="提交课程"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <el-form-item label="课程教师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程类别 -->
      <el-form-item label="课程类别">
<!--        当一级类别确定以后, 就可以绑定该课程的一级类别ID,即subjectParentId-->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="学院" @change="getSecondarySubject">
          <el-option
            v-for="primarySubject in PrimarySubjectList"
            :key="primarySubject.id"
            :label="primarySubject.title"
            :value="primarySubject.id"/>
        </el-select>

        <el-select
          v-model="courseInfo.subjectId"
          placeholder="专业">
          <el-option
            v-for="secondarySubject in secondarySubjectList"
            :key="secondarySubject.id"
            :label="secondarySubject.title"
            :value="secondarySubject.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>


      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/uploadAvatar'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
import teacher from '@/api/edu/teacher'

export default {
  //声明组件(富文本框)
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '',
        subjectParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://edu-hugh.oss-cn-shenzhen.aliyuncs.com/2020/u%3D639299053%2C3877813446%26fm%3D26%26gp%3D0.jpg',
        price: 0
      },
      courseId: '',
      teacherList: [],
      PrimarySubjectList: [],
      secondarySubjectList: [],
      BASE_API: process.env.BASE_API
    }
  },

  created() {
    if(this.$route.params && this.$route.params.courseId){
      this.courseId = this.$route.params.courseId
      this.getCourseInfoByCourseId()
    }else{
      //获取所有一级分类
      this.getAllSubject()
    }
    //获取所有教师
    this.getAllTeacher()
  },
  watch: {
    $route(from, to){
      this.init()
    }
  },
  methods: {
    init() {
      //判断路径是否有id值, undefined
      if (!(this.$route.params && this.$route.params.courseId)) {
        this.courseInfo = {cover: 'https://edu-hugh.oss-cn-shenzhen.aliyuncs.com/2020/10/19/6d6087250a2d409ca9c9d25a874853eeIMG_20200225_212932%20%283%29.jpg'}
      }
    },
    //根据课程ID获取对应的课程相关信息用于回显
    getCourseInfoByCourseId() {
      course.getCourseInfoByCourseId(this.courseId)
        .then(response => {
        this.courseInfo = response.data.courseInfo
          subject.getAllSubject().then(response => {
            this.PrimarySubjectList = response.data.allSubject
            for (let PrimarySubject of this.PrimarySubjectList) {
              if(this.courseInfo.subjectParentId === PrimarySubject.id){
                this.SecondarySubjectList = PrimarySubject.children
              }
            }
          })
      })
    },
    //封面上传成功的回调
    handleAvatarSuccess(res) {
      this.courseInfo.cover = res.data.url
    },
    //封面上传之前的校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //修改课程
    updateCourseInfo() {
      course.updateCourseInfo(this.courseInfo).then(response => {
        this.$message.success("修改课程信息成功")
        this.$router.push(`/course/chapter/${this.courseId}`)
      })
    },
    //添加课程
    saveCourseInfo() {
      course.saveCourse(this.courseInfo)
        .then(response => {
          this.$message({
            type: 'success',
            message: '添加课程信息成功'
          })
          //将课程ID传给Step2,查询课程相关信息
          this.$router.push({ path: `/course/chapter/${response.data.courseId}`})
        })
    },
    //添加或修改课程信息
    saveOrUpdate() {
      if(!this.courseId){
        this.saveCourseInfo()
      }else{
        this.updateCourseInfo()
      }
    },
    //获取所有教师,
    getAllTeacher() {
      teacher.getAllTeacher().then(response => {
        this.teacherList = response.data.items
      })
    },
    //获取所有一级类别
    getAllSubject() {
      subject.getAllSubject()
        .then(response => {
          this.PrimarySubjectList = response.data.allSubject
        })
    },
    //获取所有二级类别
    getSecondarySubject(value) {
      subject.getSubjectsByPid(value).then(resp => {
        this.secondarySubjectList = resp.data.items

      })
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
