<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <category-tree @tree-node-click="treeNodeClick" />
    </el-col>
    <el-col :span="18">

      <div id="crud">
        <el-input
          v-model="searchCondtion"
          width="10px"
          placeholder="请输入内容"
        />
        <el-button type="primary" @click="attgroupSearch">查询</el-button>
        <el-button
          type="primary"
          @click="add"
        >新增</el-button>
        <el-button
          type="danger"
          @click="deleteBrandByList"
        >批量删除</el-button>
      </div>
      <div class="brandTable">
        <el-table
          :data="attrGroupPage.records"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column
            prop="attrGroupId"
            label="分组id"
            width="180"
          />
          <el-table-column
            prop="attrGroupName"
            label="组名"
            width="180"
          />
          <el-table-column
            prop="sort"
            label="排序"
          />
          <el-table-column
            prop="descript"
            label="描述"
          />
          <el-table-column
            prop="icon"
            label="组图标"
          />
          <el-table-column
            prop="catelogId"
            label="所属分类id"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="regeditBrand(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteBrand(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="attrGroupPage.current"
          :total="attrGroupPage.total"
          :page-size="attrGroupPage.size"
          layout="total, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog
        title="新增"
        :visible.sync="attrGroupDialog"
        @close="closeDailog"
      >
        <el-form
          ref="dailogForm"
          :model="form"
          :rules="rules"
        >
          <el-form-item
            label="组名"
            prop="attrGroupName"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.attrGroupName"
              autocomplete="off"
            />
          </el-form-item>

          <el-form-item
            label="介绍"
            prop="descript"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.descript"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="组图标"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.icon"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            prop="catelogId"
            label="所属分类"
            :label-width="formLabelWidth"
          >
            <el-cascader
              v-model="selectedCategoryIds"
              :options="categoryTreeList"
              :props="cascaderPrps"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="attrGroupDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="sumbit('dailogForm')"
          >确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import CategoryTree from '@/views/common/category-tree.vue'
import { listPageByCategoryId, conditionList } from '@/api/attrGroup'
import { getCategoryTreeList } from '@/api/category'

export default {
  name: 'ProductAttgroup',
  components: {
    CategoryTree
  },
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
      cascaderPrps: {
        value: 'catId',
        children: 'children',
        label: 'name'
      },
      selectedCategoryIds: [],
      categoryTreeList: [],
      searchCondtion: '',
      catId: 0,
      multipleSelection: [],
      attrGroupDialogType: '',
      attrGroupPage: {
        records: [],
        pageSize: 0,
        current: 0,
        total: 0
      },
      attrGroupDialog: false,
      form: {
        name: '',
        logo: '',
        descript: '',
        showStatus: 0,
        firstLetter: '',
        sort: ''
      },
      formLabelWidth: '100px',
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
    this.findCategoryTreeList()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.findAttrGroupPage(val, 10)
      console.log(`当前页: ${val}`)
    },
    add() {
      this.attrGroupDialog = true
    },
    addBrand() {
    },
    updateBrand() {
    },
    regeditBrand(row) {
    },
    sumbit(dailogForm) {
      this.$refs[dailogForm].validate((valid) => {
        if (valid) {
          if (this.attrGroupDialogType === 'updateBrand') {
            this.updateBrand()
            this.form = {}
            this.attrGroupDialog = false
            this.fileList = []
          } else if (this.attrGroupDialogType === 'addBrand') {
            this.addBrand()
            this.form = {}
            this.attrGroupDialog = false
            this.fileList = []
          }
        } else {
          this.$message.error('表单校验失败')
          return false
        }
      })
    },
    findAttrGroupPage(current, pageSize) {
      conditionList(this.catId, current, pageSize, this.searchCondtion).then((response) => {
        this.attrGroupPage = response.data
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    closeDailog() {
      this.form = {}
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
    },
    treeNodeClick(object, node, vueObject) {
      if (node.level === 3) {
        this.catId = node.data.catId
        listPageByCategoryId(this.catId, 0, 10).then((response) => {
          this.attrGroupPage = response.data
        })
      }
    },
    attgroupSearch() {
      conditionList(this.catId, 0, 10, this.searchCondtion).then((response) => {
        this.attrGroupPage = response.data
      })
    },
    findCategoryTreeList() {
      getCategoryTreeList().then((response) => {
        this.categoryTreeList = response.data
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

