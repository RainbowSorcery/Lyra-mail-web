<template>
  <!-- 
使用说明：
1）、引入category-cascader.vue
2）、语法：<category-cascader :catelogPath.sync="catelogPath"></category-cascader>
    解释：
      catelogPath：指定的值是cascader初始化需要显示的值，应该和父组件的catelogPath绑定;
          由于有sync修饰符，所以cascader路径变化以后自动会修改父的catelogPath，这是结合子组件this.$emit("update:catelogPath",v);做的
      -->
  <div>
    <el-cascader
      v-model="paths"
      filterable
      clearable
      placeholder="试试搜索：手机"
      :options="categorys"
      :props="setting"
    />
  </div>
</template>

<script>
import { getCategoryTreeList } from '@/api/category'
import PubSub from 'pubsub-js'

export default {
  components: {},
  props: {
    catelogPath: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      setting: {
        value: 'catId',
        label: 'name',
        children: 'children'
      },
      categorys: [],
      paths: this.catelogPath
    }
  },
  watch: {
    catelogPath(v) {
      this.paths = this.catelogPath
    },
    paths(v) {
      this.$emit('update:catelogPath', v)
      PubSub.publish('catPath', v)
    }
  },
  created() {
    this.getCategorys()
  },
  methods: {
    getCategorys() {
      getCategoryTreeList().then((response) => {
        this.categorys = response.data
      })
    }
  },

}

</script>
<style scoped>
</style>
