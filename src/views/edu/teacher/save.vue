<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="教师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="教师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="教师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="讲师" />
          <el-option :value="2" label="教授" />
        </el-select>
      </el-form-item>
      <el-form-item label="教师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="教师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 教师头像 -->
      <el-form-item label="教师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true">
          更换头像
        </el-button>

        <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调
        -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/fileoss/uploadAvatar'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />

      </el-form-item>


      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate()"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherSaveAndUpdate from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";   //引入组件


export default {
  components: { //声明组件
    ImageCropper,
    PanThumb
  },
  data() {
    return {

      imagecropperShow: false,
      imagecropperKey: 0,
      BASE_API: process.env.BASE_API,  //获取配置文件中的api
      teacher: {
        sort: 0,
        level: 1,
        avatar: 'https://edu-hugh.oss-cn-shenzhen.aliyuncs.com/2020/20201202232751.jpg'
      },
      saveBtnDisabled: false, // 保存按钮是否禁用
    };
  },
  //多次路由跳转至同一个页面,created方法只执行一次
  created() {
    this.init()
  },
  watch: {
    //监听
    $route(to, from) {
      //路由变化方式, 路由发生变化,方法就会执行
      this.init();
    },
  },
  methods: {
    close() { //头像上传组件中的关闭方法
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    cropSuccess(data) { //头像上传组件中上传成功后的回调
      this.imagecropperShow = false;
      this.teacher.avatar = data.url;    //执行成功后将后端返回的那个url赋值给avatar
      this.imagecropperKey = this.imagecropperKey + 1;

    },
    // vue-router导航切换问题,如果两个路由都渲染同一个组件,组件会重用,调用监听器,解决此bug
    init() {
      //判断路径是否有id值, undefined
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.getTeacherById(id);
      }else{
        //路径中没有id, 说明要做的是添加,把Teacher对象清空
        this.teacher = {avatar: 'https://edu-hugh.oss-cn-shenzhen.aliyuncs.com/2020/20201202232751.jpg'};
      }
    },
    saveOrUpdate() {
      if (!this.teacher.id) {
        this.saveTeacher();
      } else {
        this.updateTeacher();
      }
    },
    saveTeacher() {
      teacherSaveAndUpdate.addTeacher(this.teacher).then((response) => {
        //提示添加成功,并进行页面跳转,或者清空表单,根据需求决定
        this.$message({
          type: "success",
          message: "添加成功",
        });

        //页面跳转
        this.$router.push({
          path: "/teacher/table",
        });
      });
    },
    //修改教师的方法
    updateTeacher() {
      teacherSaveAndUpdate.updateTeacher(this.teacher).then((response) => {
        //提示修改成功,并进行页面跳转根据需求决定
        this.$message({
          type: "success",
          message: "修改成功",
        });

        //页面跳转
        this.$router.push({
          path: "/teacher/table",
        });
      });
    },
    //根据id获取教师, 用于回显数据
    getTeacherById(id) {
      teacherSaveAndUpdate.getTeacherById(id).then((response) => {
        this.teacher = response.data.teacher;
      });
    },
  },
};
</script>
