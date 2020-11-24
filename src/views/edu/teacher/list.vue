<template>
  <div class="dashboard-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="教师名">
        <el-input v-model="teacherQuery.name" placeholder="教师名" />
      </el-form-item>

      <el-form-item label="教师头衔">
        <el-select
          v-model="teacherQuery.level"
          clearable
          placeholder="讲师头衔"
        >
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getTeacherListPage()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? "高级讲师" : "首席讲师" }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="`/teacher/save/${scope.row.id}`">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >修改</el-button
            >
          </router-link>
          <!-- scope.row.id中 scope.row是一个对象,就是后端中的EduTeacher. -->
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeTeacherById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getTeacherListPage"
    />
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher.js";

export default {
  data() {
    //定义变量和初始值
    return {
      list: null, //查询之后返回集合
      page: 1, //当前页码
      limit: 10, //每页记录数量
      total: 0, //总记录数
      teacherQuery: {}, //条件封装对象
    };
  },
  created() {
    //页面渲染之前执行,一般调用methods定义的方法, 将methods中的方法返回的数据进行渲染到template中,即页面中
    this.getTeacherListPage();
  },
  methods: {
    //创建具体的方法,  调用teacher.js定义的方法, teacher.js中是对后端接口进行数据请求的。内有数据
    //获取讲师列表
    getTeacherListPage(page = 1) {
      this.page = page; //使当前页数为分页组件传进来的那个参数
      teacher
        .getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then((response) => {
          //console.log(response);
          this.list = response.data.rows;
          this.total = response.data.total;
        })
    },
    //根据ID删除讲师
    removeTeacherById(id) {
      // console.log(id);
      this.$confirm("此操作将永久删除该讲师, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        teacher.removeTeacherById(id).then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //回到列表页面
          this.getTeacherListPage();
        });
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //清空条件
    resetData() {
      //输入项清空
      this.teacherQuery = {};
      //查询所有
      this.getTeacherListPage();
    },
  },
};
</script>
