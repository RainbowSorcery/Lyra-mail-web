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
          @click="deleteAttrGropByList"
        >批量删除</el-button>
      </div>
      <div class="AttrGropTable">
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
                @click="regeditAttrGropd(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteAttrGrop(scope.row)"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="relationHandle(scope.row)"
              >分组关联</el-button>
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
      <el-dialog :close-on-click-modal="false" :visible.sync="visible" @closed="dialogClose">
        <el-dialog width="40%" title="选择属性" :visible.sync="innerVisible" append-to-body>
          <div>
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
              <el-form-item>
                <el-input v-model="dataForm.key" placeholder="参数名" clearable />
              </el-form-item>
              <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
              </el-form-item>
            </el-form>
            <el-table
              v-loading="dataListLoading"
              :data="dataList"
              border
              style="width: 100%;"
              @selection-change="innerSelectionChangeHandle"
            >
              <el-table-column type="selection" header-align="center" align="center" />
              <el-table-column prop="attrId" header-align="center" align="center" label="属性id" />
              <el-table-column prop="attrName" header-align="center" align="center" label="属性名" />
              <el-table-column prop="icon" header-align="center" align="center" label="属性图标" />
              <el-table-column prop="valueSelect" header-align="center" align="center" label="可选值列表" />
            </el-table>
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
            />
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddRealtion">确认新增</el-button>
          </div>
        </el-dialog>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" @click="addRelation">新建关联</el-button>
            <el-button
              type="danger"
              :disabled="dataListSelections.length <= 0"
              @click="batchDeleteRelation"
            >批量删除</el-button>
            <!--  -->
            <el-table
              :data="relationAttrs"
              style="width: 100%"
              border
              @selection-change="selectionChangeHandle"
            >
              <el-table-column type="selection" header-align="center" align="center" width="50" />
              <el-table-column prop="attrId" label="#" />
              <el-table-column prop="attrName" label="属性名" />
              <el-table-column prop="valueSelect" label="可选值">
                <template slot-scope="scope">
                  <el-tooltip placement="top">
                    <div slot="content">
                      <span v-for="(i,index) in scope.row.valueSelect.split(';')" :key="index">
                        {{ i }}
                        <br>
                      </span>
                    </div>
                    <el-tag>{{ scope.row.valueSelect.split(";")[0]+" ..." }}</el-tag>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column fixed="right" header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="relationRemove(scope.row.attrId)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-dialog>
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
            label="排序"
            prop="sort"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.sort"
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
import { listPageByCategoryId, conditionList, addAttrGroups, findAttrGroupById, updateAttrGroupById, removerById, attrRelation, removerAttrRelation, noAttrRelation, addAttrRelation } from '@/api/attrGroup'
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
      attrGroupId: 0,
      visible: false,
      innerVisible: false,
      relationAttrs: [],
      dataListSelections: [],
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      innerdataListSelections: [],
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
        attrGroupName: '',
        sort: 0,
        descript: '',
        icon: '',
        catelogId: 0
      },
      formLabelWidth: '100px',
      rules: {
        name: { required: true, message: '请输入品牌名称', trigger: 'blur' },
        logo: { required: true, message: '请上传品牌图片', trigger: 'blur' },
        descript: { required: true, message: '请输入品牌介绍', trigger: 'blur' },
        sort: [
          { required: true, message: '请输入品牌排序', trigger: 'blur' }
          // { type: 'number', message: '年龄必须为数字值' }
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
      this.attrGroupDialogType = 'addAttrGrop'
      this.attrGroupDialog = true
    },
    addAttrGrop() {
      this.form.catelogId = this.selectedCategoryIds[this.selectedCategoryIds.length - 1]
      addAttrGroups(this.form).then((response) => {
        this.$message({
          message: '添加成功.',
          type: 'success'
        })
      })
    },
    updateAttrGrop() {
      this.form.catelogId = this.selectedCategoryIds[this.selectedCategoryIds.length - 1]
      updateAttrGroupById(this.form).then((response) => {
        this.$message({
          message: '修改成功.',
          type: 'success'
        })
      })
    },
    regeditAttrGropd(row) {
      this.attrGroupDialogType = 'updateAttrGrop'
      this.attrGroupDialog = true
      findAttrGroupById(row.attrGroupId).then((response) => {
        this.form = response.data
        this.selectedCategoryIds = response.data.attrGroupPath
      })
    },
    sumbit(dailogForm) {
      this.$refs[dailogForm].validate((valid) => {
        if (valid) {
          if (this.attrGroupDialogType === 'updateAttrGrop') {
            this.updateAttrGrop()
            this.form = {}
            this.attrGroupDialog = false
            this.fileList = []
          } else if (this.attrGroupDialogType === 'addAttrGrop') {
            this.addAttrGrop()
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
      this.selectedCategoryIds = []
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteAttrGropByList() {
      var deleteIdList = []
      if (this.multipleSelection.length != null && this.multipleSelection.length > 0) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          deleteIdList.push(this.multipleSelection[i].AttrGropId)
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
    },
    deleteAttrGrop(row) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removerById(row.attrGroupId).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    dialogClose() {
    },
    submitAddRealtion() {
      this.innerVisible = false
      // 准备数据
      console.log('准备新增的数据', this.innerdataListSelections)
      if (this.innerdataListSelections.length > 0) {
        const postData = []
        this.innerdataListSelections.forEach(item => {
          postData.push({ attrId: item.attrId, attrGroupId: this.attrGroupId })
        })
        console.log(postData)
        addAttrRelation(postData).then((response) => {
          console.log(response)
        })
      }
    },
    addRelation() {
      this.innerVisible = true
      noAttrRelation(this.attrGroupId, 10, 0).then((response) => {
        this.dataList = response.data.records
      })
    },
    innerSelectionChangeHandle(val) {
      this.innerdataListSelections = val
    },
    sizeChangeHandle() {
    },
    currentChangeHandle() {
    },
    batchDeleteRelation() {
      const data = []
      for (let i = 0; i < this.dataListSelections.length; i++) {
        data.push({ attrId: this.dataListSelections[i].attrId, attrGroupId: this.attrGroupId })
      }

      removerAttrRelation(data).then((response) => {
        this.$message({
          message: '删除成功.',
          type: 'success'
        })
      })
      attrRelation(this.attrGroupId).then((response) => {
        this.relationAttrs = response.data
      })
      this.attrGroupId = 0
    },
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    relationHandle(row) {
      this.attrGroupId = row.attrGroupId
      this.visible = true
      console.log(row)
      attrRelation(row.attrGroupId).then((response) => {
        this.relationAttrs = response.data
      })
    },
    relationRemove(attrId) {
      const data = []
      data.push({ attrId, attrGroupId: this.attrGroupId })
      removerAttrRelation(data).then((response) => {
        this.$message({
          message: '删除成功.',
          type: 'success'
        })
      })
      attrRelation(this.attrGroupId).then((response) => {
        this.relationAttrs = response.data
      })
      this.attrGroupId = 0
    }
  }
}
</script>

<style scoped>
  .div, AttrGropTable {
    margin: 25px;
  }
.el-input {
  width: 30%;
}
</style>

