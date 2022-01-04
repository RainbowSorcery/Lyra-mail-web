<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <category-tree @tree-node-click="nodeClick" />
    </el-col>
    <el-col :span="18">
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

      <el-table
        ref="multipleTable"
        :data="attrList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="attrId"
          label="id"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="attrName"
          label="属性名"
          width="120"
        />
        <el-table-column
          prop="address"
          label="可检索"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <i v-if="scope.row.searchType==1" class="el-icon-success" />
            <i v-else class="el-icon-error" />
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="值类型"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.valueType==0" type="success">单选</el-tag>
            <el-tag v-else>多选</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="icon"
          label="图标"
          show-overflow-tooltip
        />
        <el-table-column prop="valueSelect" header-align="center" align="center" label="可选值">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content">
                <span v-for="(i,index) in scope.row.valueSelect.split(';')" :key="index">{{ i }}<br></span>
              </div>
              <el-tag>{{ scope.row.valueSelect.split(";")[0]+" ..." }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="启用"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <i v-if="scope.row.searchType==1" class="el-icon-success" />
            <i v-else class="el-icon-error" />
          </template>
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="所属分类"
          show-overflow-tooltip
        />
        <el-table-column
          prop="address"
          label="所属分组"
          show-overflow-tooltip
        />
        <el-table-column
          prop="address"
          label="快速展示"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <i v-if="scope.row.searchType==1" class="el-icon-success" />
            <i v-else class="el-icon-error" />
          </template>
        </el-table-column>

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
        layout="prev, pager, next"
        :total="attrPage.total"
        @current-change="pageChage"
      />
    </el-col>
    <el-dialog title="添加规格参数" :visible.sync="dialogFormVisible" @close="dailogClose">
      <el-form :model="form">
        <el-form-item label="属性名" :label-width="formLabelWidth">
          <el-input
            v-model="form.attrName"
            placeholder="请输入规格"
            clearable
          />
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.attrType" placeholder="请选择属性类型">
            <el-option label="规格参数" value="0" />
            <el-option label="销售属性" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="值类型" :label-width="formLabelWidth">
          <el-switch
            v-model="form.valueType"
            active-text="只能多个值"
            inactive-text="只能单个值"
            :inactive-value="0"
            :active-value="1"
          />
        </el-form-item>
        <el-form-item label="值类型" :label-width="formLabelWidth">
          <el-select
            v-model="valueSelectArray"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入可选值"
          />
        </el-form-item>
        <el-form-item label="属性图标" :label-width="formLabelWidth">
          <el-input
            v-model="form.icon"
            placeholder="请输入属性图标"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属分类" :label-width="formLabelWidth">
          <el-cascader
            v-model="selectedCategoryNode"
            :props="categoryProps"
            :options="categoryList"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="所属分组" :label-width="formLabelWidth">
          <el-cascader
            v-model="selectedgroupAttrNode"
            :props="attrGroupProps"
            :options="groupAttrList"
            @change="handleGroupChange"
          />
        </el-form-item>
        <el-form-item label="可检索" :label-width="formLabelWidth">
          <el-switch
            v-model="form.searchType"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :inactive-value="1"
            :active-value="0"
          />
        </el-form-item>
        <el-form-item label="快速展示" :label-width="formLabelWidth">
          <el-switch
            v-model="form.showDesc"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :inactive-value="1"
            :active-value="0"
          />
        </el-form-item>
        <el-form-item label="启用状态" :label-width="formLabelWidth">
          <el-switch
            v-model="form.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :inactive-value="1"
            :active-value="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import CategoryTree from '@/views/common/category-tree.vue'
import { getCategoryTreeList } from '@/api/category'
import { findCategoryIdByList } from '@/api/attrGroup'
import { saveAttr, findBaseAttrList } from '@/api/attr'

export default {
  name: 'ProductBaseAttr',
  components: {
    CategoryTree
  },
  data() {
    return {
      attrPage: {
        total: 0
      },
      catId: null,
      attrList: [],
      valueSelectArray: [],
      categoryList: [],
      groupAttrList: [],
      dialogFormVisible: false,
      searchCondtion: '',
      formLabelWidth: '100px',
      dialogType: '',
      form: {
        attrId: 0,
        attrName: '',
        searchType: 0,
        valueType: 1,
        icon: '',
        valueSelect: '',
        attrType: 1,
        enable: 1,
        catelogId: '',
        attrGroupId: null,
        showDesc: 0
      },
      categoryProps: {
        value: 'catId',
        label: 'name'
      },
      selectedCategoryNode: null,
      selectedgroupAttrNode: null,
      attrGroupProps: {
        value: 'attrGroupId',
        label: 'attrGroupName'
      }
    }
  },
  created() {
    this.findCategoryList()
  },
  methods: {
    attgroupSearch() {
      findBaseAttrList(this.catId, 0, 10, this.searchCondtion).then((response) => {
        this.attrList = response.data.records
      })
    },
    add() {
      this.findCategoryList()
      this.dialogType = 'add'
      this.dialogFormVisible = true
    },
    deleteAttrGropByList() {
    },
    handleChange(node) {
      var categoryId = this.selectedCategoryNode[this.selectedCategoryNode.length - 1]
      if (this.selectedCategoryNode != null) {
        findCategoryIdByList(categoryId).then((response) => {
          this.groupAttrList = response.data
        })
      }
      this.form.catelogId = categoryId
    },
    findCategoryList() {
      getCategoryTreeList().then((respnse) => {
        this.categoryList = respnse.data
      })
    },
    handleGroupChange(node) {
      this.form.attrGroupId = this.selectedgroupAttrNode[this.selectedgroupAttrNode.length - 1]
    },
    addAttr() {
      saveAttr(this.form).then((response) => {
        this.$message('添加成功')
      })
    },
    selectArrayToString() {
      var selectTosring = ''
      for (let i = 0; i < this.valueSelectArray.length; i++) {
        selectTosring += this.valueSelectArray[i] + ','
      }
      this.form.valueSelect = selectTosring
    },
    commit() {
      if (this.dialogType === 'add') {
        this.selectArrayToString()
        this.addAttr()
        this.dialogFormVisible = false
      }
    },
    dailogClose() {
      this.form = {}
      this.categoryList = []
    },
    nodeClick(object, node, vueObject) {
      if (node.ldev !== null && node.level === 3) {
        findBaseAttrList(node.data.catId, 0, 10, null).then((response) => {
          this.attrPage = response.data
          this.catId = node.data.catId
          this.attrList = response.data.records
        })
      }
    },
    pageChage(val) {
      findBaseAttrList(this.catId, val, 10, null).then((response) => {
        this.attrPage = response.data
        this.attrList = response.data.records
      })
    }
  }
}
</script>

<style scoped>

</style>
