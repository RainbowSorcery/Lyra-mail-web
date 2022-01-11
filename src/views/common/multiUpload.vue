<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    :action="uploadUrl"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    list-type="picture"
    :before-upload="beforeUpload"
    :data="policyData"
    :on-success="handleAvatarSuccess"
  >
    <el-button
      size="small"
      type="primary"
    >点击上传</el-button>
    <div
      slot="tip"
      class="el-upload__tip"
    >只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</template>

<script>
import { getOSSPolicy } from '@/api/brand'

export default {
  name: 'MultiUpload',
  data() {
    return {
      uploadUrl: '',
      fileList: [],
      policyData: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        key: '',
        success_action_status: 200
      }
    }
  },
  methods: {
    handlePreview(file) {
      this.fileList.pop()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    async beforeUpload(file) {
      // 异步请求导致 请求为发送完毕就直接执行上传操作 解决方案: ES7的异步特性async / await 在方法中标识 async 表示该方法为异步方法 使用await表标识异步语句 await等待异步请求执行完毕之后向下执行
      await getOSSPolicy().then((response) => {
        this.uploadUrl = response.data.host + '/'
        this.policyData.OSSAccessKeyId = response.data.accessid
        this.policyData.policy = response.data.policy
        this.policyData.signature = response.data.signature
        this.policyData.key = response.data.dir + uuidv4() + '-' + file.name
        this.policyData.success_action_status = 200
      })
      return true
    },
    handleAvatarSuccess(res, file) {
      this.$message({
        message: '上传成功',
        type: 'success'
      })

      console.log(this.form)

      this.form.logo = this.uploadUrl + this.policyData.key
      this.policyData = {}
    }
  }
}
</script>

<style>
</style>
