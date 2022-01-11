<template>
  <div>
    <el-select v-model="brandId" placeholder="请选择" filterable clearable>
      <el-option
        v-for="item in brands"
        :key="item.brandId"
        :label="item.brandName"
        :value="item.brandId"
      />
    </el-select>
  </div>
</template>

<script>

import { brandList } from '@/api/categoryBrand'
import PubSub from 'pubsub-js'

export default {
  components: {},
  props: {},
  data() {
    return {
      catId: 0,
      brands: [
        {
          label: 'a',
          value: 1
        }
      ],
      brandId: '',
      subscribe: null
    }
  },
  computed: {},
  watch: {
    brandId(val) {
      PubSub.publish('brandId', val)
    }
  },
  mounted() {
    this.subscribe = PubSub.subscribe('catPath', (msg, val) => {
      this.catId = val[val.length - 1]
      this.getCatBrands()
    })
  },
  beforeDestroy() {
    PubSub.unsubscribe(this.subscribe)
  },
  methods: {
    getCatBrands() {
      brandList(this.catId).then((response) => {
        this.brands = response.data
      })
    }
  }
}
</script>
<style scoped>
</style>
