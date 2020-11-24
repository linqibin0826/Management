<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="基本信息"/>
      <el-step title="课程大纲"/>
      <el-step title="提交课程"/>
    </el-steps>

    <el-button type="text" @click="onSaveChapterClick">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                <el-button type="text" @click="onAddVideoClick(chapter.id)">添加课时</el-button>
                <el-button style="" type="text" @click="onEditChapterClick(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapterById(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 小节 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text">编辑</el-button>
                <el-button type="text" @click="removeVideoById(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 章节表单 -->
    <el-dialog :visible.sync="showChapterDialog" title="添加章节">
      <el-form :model="chapterInfo" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapterInfo.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapterInfo.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChapterDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 课时表单 -->
    <el-dialog :visible.sync="showVideoDialog" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showVideoDialog = false">取 消</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveVideo">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import videoApi from '@/api/edu/video'
import vod from '@/api/edu/vod'

export default {
  data() {
    return {
      BASE_API: process.env.BASE_API,
      fileList: [],
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '',
      chapterVideoList: [],
      showChapterDialog: false,
      showVideoDialog: false,
      chapterInfo: {
        id: '',
        title: '',
        sort: 0,
        courseId: ''
      },
      video: {
        title: '',
        sort: 0,
        isFree: 0,
        chapterId: '',
        courseId: '',
        videoSourceId: '',
        videoOriginalName: ''
      }
    }
  },

  created() {
    if (this.$route.params && this.$route.params.courseId) {
      this.courseId = this.$route.params.courseId
      this.chapterInfo.courseId = this.courseId
    }
    this.getChapterAndVideo()
  },

  methods: {
    upload() {
      vod.upload()
    },
    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },
//视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    handleVodRemove() {
      vod.removeById(this.video.videoSourceId)
      this.video.videoSourceId = ''
      this.video.videoOriginalName = ''
    },
    beforeVodRemove(file, fileList) {
      this.$confirm(`确认移除${file.name}?`, '提示',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
    },
    onAddVideoClick(chapterId) {
      this.showVideoDialog = true
      this.video = { chapterId: chapterId }
    },
    saveVideo() {
      this.video.courseId = this.courseId
      videoApi.saveVideo(this.video).then(resp => {

        this.$message.success('添加课时成功')
        this.getChapterAndVideo()
        this.fileList = []
        this.showVideoDialog = false
      })
    },
    removeVideoById(id) {
      this.$confirm('确认删除此课时?', '提示',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确认后调用删除接口
          videoApi.deleteVideoById(id).then(resp => {
            this.getChapterAndVideo()
          })
        }).then(() => {
          this.$message.success("课时删除成功")
      })
    },
    updateVideoById() {
      videoApi.updateVideoById().then()
    },
    getVideoById() {
      videoApi.getVideoById().then()
    },
    removeChapterById(chapterId) {
      this.$confirm('此操作将删除该章节,请确认已将章节下内容删除完毕?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapter.removeChapterById(chapterId)
      }).then(() => {
        this.getChapterAndVideo()// 刷新列表
        this.$message({
          type: 'success',
          message: '删除章节成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    onEditChapterClick(id) {
      this.showChapterDialog = true
      this.getChapterInfoById(id)
    },
    //添加章节按钮
    onSaveChapterClick() {
      //显示对话
      this.showChapterDialog = true
      //清空原对话信息
      this.chapterInfo.sort = 0
      this.chapterInfo.title = ''
      this.chapterInfo.id = ''
    },
    saveOrUpdate() {
      if (!this.chapterInfo.id) {
        this.saveChapterInfo()
      } else {
        this.updateChapterInfoById()
      }
    },
    getChapterInfoById(id) {
      chapter.getChapterInfoById(id).then(resp => {
        this.chapterInfo = resp.data.chapterInfo
      })
    },
    updateChapterInfoById() {
      chapter.updateChapterInfoById(this.chapterInfo).then(resp => {
        this.$message.success('修改成功')
        this.showChapterDialog = false
        this.getChapterAndVideo()
      })
    },
    //添加章节信息
    saveChapterInfo() {
      chapter.saveChapterInfo(this.chapterInfo).then(response => {
        this.$message.success('添加章节信息成功')
        this.showChapterDialog = false
        this.getChapterAndVideo()  //刷新页面
      })
    },
    //据课程ID获取章节与小节信息
    getChapterAndVideo() {
      chapter.getChapterAndVideoInfoByCourseId(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.items
        })
    },
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` })
    },
    next() {
      this.$router.push({ path: `/course/publish/${this.courseId}` })
    }
  }
}
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chanpterList li {
  position: relative;
}

.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
