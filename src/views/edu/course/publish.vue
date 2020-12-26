<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="prepublishCourseInfo.cover">
      <div class="main">
        <h2>{{ prepublishCourseInfo.title }}</h2>
        <p class="gray"><span>共{{ prepublishCourseInfo.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ prepublishCourseInfo.primarySubject }} — {{ prepublishCourseInfo.secondarySubject }}</span></p>
        <p>课程教师：{{ prepublishCourseInfo.teacherName }}</p>
        <h3 class="red">￥{{ prepublishCourseInfo.price }}</h3>
      </div>
    </div>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>

<script>
import course from '@/api/edu/course'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '',
      //后端接口数据
      prepublishCourseInfo: {
        cover: '',
        title: '',
        lessonNum: 0,
        primarySubject: '',
        teacherName: '',
        secondarySubject: '',
        price: 0.00,
      },

    }
  },

  created() {
    if(this.$route.params && this.$route.params.courseId) {
      this.courseId = this.$route.params.courseId
      this.getPrepublishCourseInfoById()
    }
  },

  methods: {
    getPrepublishCourseInfoById() {
      course.getPrepublishCourseInfoById(this.courseId)
        .then(resp => {
        this.prepublishCourseInfo = resp.data.prepublishCourseInfo
      })
    },
    previous() {
      this.$router.push({ path: `/course/chapter/${this.courseId}` })
    },

    publish() {
      this.$router.push({ path: '/course/list' })
    }
  }
}
</script>

<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
}
.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}
.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}
.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>
