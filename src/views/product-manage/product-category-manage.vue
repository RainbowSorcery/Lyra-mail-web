<template>
  <div>
    <el-switch
      v-model="draggable"
      active-text="开启拖拽"
      inactive-text="关闭拖拽"
    />
    <el-button v-if="draggable" type="primary" plain size="mini" @click="batchUpdateCategory">保存</el-button>
    <el-button v-if="draggable" type="danger" plain size="mini" @click="deleteSelectedCategory">删除所选商品分类</el-button>
    <el-tree ref="menuTree" show-checkbox node-key="data.catId" :draggable="draggable" :data="categoryList" :props="defaultProps" :allow-drop="allowDrop" @node-click="handleNodeClick" @node-drop="handleDrop">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="data.catLevel != 3"
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button
            v-if="data.children == null"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => updateLable(node, data)"
          >
            update
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog title="添加商品分类" :visible.sync="addCategoryDialog">
      <el-form :model="category" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" />
        </el-form-item>
      </el-form>

      <el-form :model="category" label-width="80px">
        <el-form-item label="icon">

          <el-input v-model="category.icon" />
        </el-form-item>
      </el-form>

      <el-form :model="category" label-width="80px">
        <el-form-item label="计量单位">
          <el-input v-model="category.productUnit" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getCategoryTreeList, deleteCategoryByIds, addProductCategory, getCategoryById, updateCategorById, updateSort } from '@/api/category'
export default {
  name: 'ProductCategoryManager',
  data() {
    return {
      draggable: true,
      updateObjects: [],
      cateLevel: 0,
      sumbitType: '',
      categoryList: [],
      category: {
        catId: 0,
        name: '',
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        icon: '',
        productUnit: ''
      },
      addCategoryDialog: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      deleteCategoryNameList: [],
      deleteCategoryCatIdList: []
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    addCategory() {
      addProductCategory(this.category).then((response) => {
        if (response.success === true) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })

          getCategoryTreeList().then((response) => {
            this.categoryList = response.data
          })
        }
      })

      this.addCategoryDialog = false
    },
    handleNodeClick(data) {
    },
    append(data) {
      this.addCategoryDialog = true
      this.category.parentCid = data.catId
      // 转换数字再 + 1
      this.category.catLevel = data.catLevel * 1 + 1
    },

    remove(node, data) {
      var ids = [data.catId]
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategoryByIds(ids).then((response) => {
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateLable(node, data) {
      this.addCategoryDialog = true
      this.sumbitType = 'update'

      this.category.catId = data.catId
      getCategoryById(data.catId).then((response) => {
        this.category.name = response.data.name
        this.category.icon = response.data.icon
        this.category.productUnit = response.data.productUnit
      })
    },
    update() {
      var { catId, name, icon, productUnit } = this.category

      var submitObject = { catId, name, icon, productUnit }
      updateCategorById(submitObject).then((response) => {
        this.addCategoryDialog = false
        this.getMenus()
      })
    },
    getMenus() {
      getCategoryTreeList().then((response) => {
        this.categoryList = response.data
      })
      this.$forceUpdate()
    },
    submit() {
      if (this.sumbitType === 'update') {
        this.update()
      } else if (this.sumbitType === 'add') {
        this.addCategory()
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      this.countNode(draggingNode)

      if (type === 'inner') {
        return this.cateLevel + dropNode.level <= 3
      } else {
        return this.cateLevel + dropNode.parent.level <= 3
      }
      // // console.log(count)
      // this.countNode(draggingNode.data)
      // // 当前最深结点深度 - 当前节点深度 = 真实深度
      // var currentCount = this.cateLevel - draggingNode.level
      // // 当进行插入操作时 被插入节点的当前节点
      // // + 插入节点的真实节点 <= 表示可以插入 当进行其他操作时 只需要判断被插入节点的父节点深度 + 插入节点的深度 <= 3 即可
      // if (type === 'inner') {
      //   return (currentCount + dropNode.level) <= 3
      // } else {
      //   return (currentCount + dropNode.parent.level) <= 3
      // }
    },
    countNode(node) {
      // 首先判断是否有子节点 若有子节点则遍历
      if (node.childNodes != null && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].level > this.cateLevel) {
            this.cateLevel = node.childNodes[i].level
          }
          this.countNode(node.childNodes[i])
        }
      }

    //   if (node.childNodes != null && node.children.length > 0) {
    //     for (let i = 0; i < node.childNodes.length; i++) {
    //       // 只记录最大的catLevel
    //       if (this.cateLevel < node.childNodes[i].level) {
    //         this.cateLevel = node.childNodes[i].level
    //       }
    //       this.countNode(node.childNodes[i])
    //     }
    //   }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // 1. 获取父节点id
      let parentId = 0
      console.log(draggingNode, dropNode, dropType)
      // 2. 获取可拖拽节点的排序
      // 先获取到兄弟节点 然后遍历兄弟节点并进行排序 belling 中存放的是兄弟节点
      var belling = null
      if (dropType === 'before' || dropType === 'after') {
        parentId = dropNode.parent.data.catId
        belling = dropNode.parent.childNodes
      } else {
        parentId = dropNode.data.catId
        belling = dropNode.childNodes
      }

      for (let i = 0; i < belling.length; i++) {
        // 拖拽的节点还有可能改变父id 所以如果拖拽的节点是遍历的节点 将父id添加上去
        if (belling[i].data.catId === draggingNode.data.catId) {
          let updateLevel = draggingNode.data.catLevel
          // 拖拽会导致层级变化 判断层级是否变化 若变化 更新层级关系 有两种情况 若是innert的方式 父节点为drop drop节点 + 1 若为after或before 那层级为兄弟节点
          if (belling[i].level !== draggingNode.level) {
            if (dropType === 'beofre' || dropType === 'after') {
              updateLevel = dropNode.level
            } else {
              updateLevel = dropNode.level + 1
            }
            // 父节点的层级改变关系改变的话 那么子节点的层级关系一定也会被改变
            this.updateChildNodeLevel(belling[i].childNodes)
          }

          // 如果将根节点拖到最上面 没有父节点 会获取不到父节点 将parentId设置为0 表示已经在最根节点 没有父节点
          this.updateObjects.push({ catId: belling[i].data.catId, sort: i, parentCid: parentId === undefined ? 0 : parentId, cateLevel: updateLevel })
        } else {
          this.updateObjects.push({ catId: belling[i].data.catId, sort: i })
        }
      }
      // console.log(this.updateObjects)
      // 3. 获取最新的层级关系
    },
    updateChildNodeLevel(node) {
      if (node != null && node.length > 0) {
        for (let i = 0; i < node.length; i++) {
          if (node[i].level !== node[i].data.catLevel) {
            this.updateObjects.push({ catId: node[i].data.catId, catLevel: node[i].level })
          }
          this.updateChildNodeLevel(node[i].childNodes)
        }
      }
    },
    batchUpdateCategory() {
      updateSort(this.updateObjects).then((response) => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        // 修改完成重写刷新menu并将更新列表清空 不然越拖拽对象越多 并将cateLevel复位 不然拖拽之后无法继续拖拽
        this.getMenus()
        this.updateObjects = []
        this.cateLevel = 0
      }).catch((error) => {
        console.log(error)
        this.$message.error('失败')
      })
    },
    deleteSelectedCategory() {
      var selectNodes = this.$refs.menuTree.getCheckedNodes()

      for (let i = 0; i < selectNodes.length; i++) {
        this.deleteCategoryNameList.push(selectNodes[i].name)
        this.deleteCategoryCatIdList.push(selectNodes[i].catId)
      }

      this.$confirm('此操作将永久删除 ' + this.deleteCategoryNameList + ' 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategoryByIds(this.deleteCategoryCatIdList).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getMenus()
        }).catch((error) => {
          console.log(error)
          this.$message.error('删除错误')
        })
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

</style>
