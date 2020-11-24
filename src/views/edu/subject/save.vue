<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">请严格遵守模板文件中的格式,以免出错</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'https://edu-hugh.oss-cn-shenzhen.aliyuncs.com/2020/%E6%A8%A1%E6%9D%BF%E6%95%B0%E6%8D%AE.xlsx'">点击下载</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/subject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {

  data() {
    return {
      fileUploadBtnText: '上传文件',
      BASE_API: process.env.BASE_API,
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    }
  },
  methods: {
    submitUpload() {
      this.fileUploadBtnText = '正在上传'
      this.importBtnDisabled = true
      this.loading = true
      this.$refs.upload.submit()
    },
    fileUploadSuccess(response) {
      if (response.success === true) {
        this.fileUploadBtnText = '导入成功'
        this.loading = false
        this.$message({
          type: 'success',
          message: response.message
        })
        this.$router.push({ path: '/subject/list' })
      }
    },
    fileUploadError(response) {
      this.fileUploadBtnText = '导入失败'
      this.loading = false
      this.$message({
        type: 'error',
        message: '导入失败'
      })
    }
  }
}
</script>
