<template>
  <div>

    <div id="crud">
      <el-input v-model="input" width="10px" placeholder="请输入内容" />
      <el-button type="primary">查询</el-button>
      <el-button type="primary" @click="add">新增</el-button>
      <el-button type="danger" @click="deleteBrandByList">批量删除</el-button>
    </div>
    <div class="brandTable">
      <el-table
        :data="bradnPageObject.records"
        style="width: 100%"
        @selection-change="handleSelectionChange"
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
        >
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.logo"
            />
          </template>
        </el-table-column>
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
            <el-button type="text" size="small" @click="regeditBrand(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteBrand(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="bradnPageObject.current"
        :total="bradnPageObject.total"
        :page-size="bradnPageObject.size"
        layout="total, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="品牌新增" :visible.sync="brandDialog" @close="closeDailog">
      <el-form ref="dailogForm" :model="form" :rules="rules">
        <el-form-item label="品牌名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌logo" prop="logo" :label-width="formLabelWidth">
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
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="介绍" prop="descript" :label-width="formLabelWidth">
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
        <el-form-item prop="firstLetter" label="检索首字母" :label-width="formLabelWidth">
          <el-input v-model="form.firstLetter" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" :label-width="formLabelWidth">
          <el-input v-model.number="form.sort" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="brandDialog = false">取 消</el-button>
        <el-button type="primary" @click="sumbit('dailogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CrudTable',
  data() {
    var firstLetter = (rule, value, callback) => {
      var reg = new RegExp('^[A-Za-z]{1}$')
      if (value === '') {
        callback(new Error('品牌首字母不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('首字母只能为一位且为英文'))
      } else {
        callback()
      }
    }
    return {
      multipleSelection: [],
      uploadUrl: '',
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
        firstLetter: '',
        sort: ''
      },
      formLabelWidth: '100px',
      policyData: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        key: '',
        success_action_status: 200
      },
      uploadFlag: false,
      rules: {
        name: { required: true, message: '请输入品牌名称', trigger: 'blur' },
        logo: { required: true, message: '请上传品牌图片', trigger: 'blur' },
        descript: { required: true, message: '请输入品牌介绍', trigger: 'blur' },
        sort: [
          { required: true, message: '请输入品牌排序', trigger: 'blur' },
          { type: 'number', message: '年龄必须为数字值' }
        ],
        firstLetter: { validator: firstLetter, trigger: 'blur' }
      }
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
      this.findBrandPage(val, 10)
      console.log(`当前页: ${val}`)
    },
    add() {
      this.bradnDialogType = 'addBrand'
      this.brandDialog = true
    },
    switchChage(sw) {
    },
    addBrand() {
    },
    updateBrand() {
    },
    regeditBrand(row) {
    },
    beforeUpload() {

    },
    sumbit(dailogForm) {
      this.$refs[dailogForm].validate((valid) => {
        if (valid) {
          if (this.bradnDialogType === 'updateBrand') {
            this.updateBrand()
            this.form = {}
            this.brandDialog = false
            this.fileList = []
          } else if (this.bradnDialogType === 'addBrand') {
            this.addBrand()
            this.form = {}
            this.brandDialog = false
            this.fileList = []
          }
        } else {
          this.$message.error('表单校验失败')
          return false
        }
      })
    },
    findBrandPage(current, pageSize) {
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      this.fileList.pop()
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleAvatarSuccess(res, file) {
      this.$message({
        message: '上传成功',
        type: 'success'
      })

      console.log(this.form)

      this.form.logo = this.uploadUrl + this.policyData.key
      this.policyData = {}
    },
    closeDailog() {
      this.form = {}
      this.fileList = []
    },
    deleteBrand(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteBrandByList() {
      var deleteIdList = []
      if (this.multipleSelection.length != null && this.multipleSelection.length > 0) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          deleteIdList.push(this.multipleSelection[i].brandId)
        }
      }

      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
