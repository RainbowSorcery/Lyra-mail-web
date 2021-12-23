<template>
  <el-tree ref="menuTree" :data="categoryTree" node-key="catId" :props="defaultProps" @node-click="handleNodeClick" />
</template>

<script>
import { getCategoryTreeList } from '@/api/category'

export default {
  name: 'CategoryTree',
  data() {
    return {
      categoryTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    getTreeList() {
      getCategoryTreeList().then((response) => {
        this.categoryTree = response.data
      })
    },
    handleNodeClick(object, node, vueObject) {
      this.$emit('tree-node-click', object, node, vueObject)
    }
  }
}
</script>

<style>

</style>
