<template>
  <div class="dashboard-container">
    <!-- 条件 -->
    <el-form :inline="true" class="demo-form-inline">
<!--      条件筛选-->
      <el-form-item label="课程名称">
        <el-input v-model="condition.title" placeholder="课程名称" />
      </el-form-item>
      <el-form-item label="所属学院">
        <!--        当二级院校确定以后, 就可以绑定该课程的二级学院ID,即subjectParentId-->
        <el-select
          v-model="condition.subjectParentId"
          placeholder="学院" @change="getSecondarySubject">
          <el-option
            v-for="primarySubject in primarySubjectList"
            :key="primarySubject.id"
            :label="primarySubject.title"
            :value="primarySubject.id"/>
        </el-select>

        <el-select
          v-model="condition.subjectId"
          placeholder="所属专业">
          <el-option
            v-for="secondarySubject in secondarySubjectList"
            :key="secondarySubject.id"
            :label="secondarySubject.title"
            :value="secondarySubject.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="教师姓名">
        <el-select
          v-model="condition.teacherId"
          placeholder="教师姓名">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getCourses()">
        查询
      </el-button>
      <el-button type="default" @click="resetData()">
        清空
      </el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading" :data="list" element-loading-text="数据加载中" border fit highlight-current-row
      row-class-name="myClassList">

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="scope.row.title" width="150px">
            </div>
            <div class="title">
              <a href="">{{ scope.row.title }}</a>
              <p>共{{ scope.row.lessonNum }}课时</p>
            </div>
          </div>

        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate.substr(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtModified.substr(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="scope">
          {{
            Number(scope.row.price) === 0 ? '免费' :
              '¥' + scope.row.price.toFixed(2)
          }}
        </template>
      </el-table-column>

      <el-table-column prop="viewCount" label="观看人数" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.viewCount }}人
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteCourse(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getCourses"
    />
  </div>
</template>

<script>
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'

export default {
  component: {},
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: [], // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      condition: {
        subjectParentId: '',
        subjectId: '',
        title: '',
        teacherId: ''
      }, // 查询条件
      teacherList: [], // 教师列表
      primarySubjectList: [], // 一级分类列表
      secondarySubjectList: [] // 二级分类列表,
    }
  },
  created() {
    this.getAllTeacher()
    this.getCourses()
    this.getAllSubject()
  },
  methods: {
    getCourses(page = 1) {
      this.page =  page
      course.getCoursesByCP(this.page, this.limit, this.condition)
        .then(resp => {
          this.list = resp.data.courses
          console.log(this.list)
          if (this.list.length > 0){
            this.total = resp.data.courses[0].total
          } else {
            this.total = 0
          }
          this.listLoading = false
        })
    },
    getAllTeacher() {
      teacher.getAllTeacher().then(resp => {
        this.teacherList = resp.data.items
      })
    },
    getAllSubject() {
      subject.getAllSubject().then(resp => {
        this.primarySubjectList = resp.data.allSubject
      })
    },
    //获取所有二级类别
    getSecondarySubject(value) {
      subject.getSubjectsByPid(value).then(resp => {
        this.secondarySubjectList = resp.data.items
      })
    },
    resetData() {
      this.condition = {}
      this.secondarySubjectList = []
      this.getCourses()
    },
    deleteCourse(id) {
      this.$confirm("即将删除该课程及其相关信息", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(() => {
        course.deleteByCourseId(id).then(resp => {
          this.$message.success("已成功删除课程及其相关内容")
          this.getCourses(this.page, this.limit, this.condition)
        }).catch(() => {
          this.$message.info("已取消删除")
        })
      })
    }
  }
}

</script>


<style scoped>
.myClassList .info {
  width: 450px;
  overflow: hidden;
}

.myClassList .info .pic {
  width: 150px;
  height: 90px;
  overflow: hidden;
  float: left;
}

.myClassList .info .pic a {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.myClassList .info .pic img {
  display: block;
  width: 100%;
}

.myClassList td .info .title {
  width: 280px;
  float: right;
  height: 90px;
}

.myClassList td .info .title a {
  display: block;
  height: 48px;
  line-height: 24px;
  overflow: hidden;
  color: #00baf2;
  margin-bottom: 12px;
}

.myClassList td .info .title p {
  line-height: 20px;
  margin-top: 5px;
  color: #818181;
}
</style>
