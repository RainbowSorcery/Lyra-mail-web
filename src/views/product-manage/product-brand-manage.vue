<template>
  <div>

    <div id="crud">
      <el-input v-model="input" width="1px" placeholder="请输入内容" />
      <el-button type="primary">查询</el-button>
      <el-button type="primary" @click="add">新增</el-button>
      <el-button type="danger">批量删除</el-button>
    </div>
    <div class="brandTable">
      <el-table
        :data="bradnPageObject.records"
        style="width: 100%"
      >
        <el-table-column type="selection" />
        <el-table-column
          prop="brandId"
          label="品牌id"
          width="180"
        />
        <el-table-column
          prop="name"
          label="品牌名"
          width="180"
        />
        <el-table-column
          prop="logo"
          label="品牌logo"
        />
        <el-table-column
          prop="descript"
          label="介绍"
        />
        <el-table-column
          prop="showStatus"
          label="显示状态"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.showStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :inactive-value="0"
              :active-value="1"
              @change="switchChage(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="firstLetter"
          label="检索首字母"
        />
        <el-table-column
          prop="sort"
          label="排序"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="bradnPageObject.current"
        :total="bradnPageObject.total"
        :page-size="bradnPageObject.size"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="品牌新增" :visible.sync="brandDialog">
      <el-form :model="form">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="https://lyra-mail.oss-cn-beijing.aliyuncs.com"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :before-upload="beforeUpload"
            :data="policyData"
            :multiple="flase"
            :on-success="handleAvatarSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="介绍" :label-width="formLabelWidth">
          <el-input v-model="form.descript" autocomplete="off" />
        </el-form-item>
        <el-form-item label="显示状态" :label-width="formLabelWidth">
          <el-switch
            v-model="form.showStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="检索首字母" :label-width="formLabelWidth">
          <el-input v-model="form.firstLetter" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="brandDialog = false">取 消</el-button>
        <el-button type="primary" @click="sumbit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getBrandPage, updateBrand, addBrand, getOSSPolicy } from '@/api/brand'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'ProductBrand',
  data() {
    return {
      uploadUrl: 'https://lyra-mail.oss-cn-beijing.aliyuncs.com/',
      fileList: [],
      bradnDialogType: '',
      input: '',
      bradnPageObject: {
        records: [],
        pageSize: 0,
        current: 0,
        total: 0
      },
      brandDialog: false,
      form: {
        name: '',
        logo: '',
        descript: '',
        showStatus: 0,
        firstLetter: 'd',
        sort: 0
      },
      formLabelWidth: '100px',
      policyData: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        dir: '',
        host: '',
        expire: '',
        callback: '',
        key: ''
      },
      uploadFlag: false
    }
  },
  created() {
    this.findBrandPage(0, 10)
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    add() {
      this.bradnDialogType = 'addBrand'
      this.brandDialog = true
    },
    switchChage(sw) {
      var { brandId, showStatus } = sw

      updateBrand({ brandId, showStatus }).then((response) => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    addBrand() {
      addBrand(this.form).then((response) => {
        console.log(response)
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
    },
    updateBrand() {

    },
    sumbit() {
      if (this.bradnDialogType === 'updateBrand') {
        this.updateBrand()
      } else if (this.bradnDialogType === 'addBrand') {
        this.addBrand()
      }
    },
    findBrandPage(current, pageSize) {
      getBrandPage(current, pageSize).then((response) => {
        this.bradnPageObject = response.data
      }).catch((error) => {
        console.log(error)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {

    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    async beforeUpload(file) {
      // 异步请求导致 请求为发送完毕就直接执行上传操作 解决方案: ES7的异步特性async / await 在方法中标识 async 表示该方法为异步方法 使用await表标识异步语句 await等待异步请求执行完毕之后向下执行
      console.log('开始上传:%o', file)
      await getOSSPolicy().then((response) => {
        this.policyData.OSSAccessKeyId = response.data.accessid
        this.policyData.policy = response.data.policy
        this.policyData.signature = response.data.signature
        this.policyData.dir = response.data.dir
        this.policyData.host = response.data.host
        this.policyData.expire = response.data.expire
        this.policyData.callback = response.data.callback
        this.policyData.key = response.data.dir + uuidv4() + '-' + file.name
      })
      return true
    },
    handleAvatarSuccess(res, file) {
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
  .div, brandTable {
    margin: 25px;
  }
.el-input {
  width: 30%;
}
</style>
