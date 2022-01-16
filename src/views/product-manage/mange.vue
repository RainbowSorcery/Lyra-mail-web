<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form :inline="true" :model="dataForm">
        <el-form-item label="分类">
          <category-cascader :catelog-path.sync="catelogPath" />
        </el-form-item>
        <el-form-item label="品牌">
          <brand-select style="width:160px" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="dataForm.price.min" style="width:160px" :min="0" />
          <el-input-number v-model="dataForm.price.max" style="width:160px" :min="0" />
        </el-form-item>
        <el-form-item label="检索">
          <el-input v-model="dataForm.key" style="width:160px" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSkuInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-form>
    <el-table
      style="width: 100%;"
      :data="dataList"
      border
      @selection-change="selectionChangeHandle"
      @expand-change="getSkuDetails"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          商品标题：{{ scope.row.skuTitle }}
          <br>
          商品副标题：{{ scope.row.skuSubtitle }}
          <br>
          商品描述：{{ scope.row.skuDesc }}
          <br>
          分类ID：{{ scope.row.catalogId }}
          <br>
          SpuID：{{ scope.row.spuId }}
          <br>
          品牌ID：{{ scope.row.brandId }}
          <br>
        </template>
      </el-table-column>
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="skuId" header-align="center" align="center" label="skuId" />
      <el-table-column prop="skuName" header-align="center" align="center" label="名称" />
      <el-table-column prop="skuDefaultImg" header-align="center" align="center" label="默认图片">
        <template slot-scope="scope">
          <img :src="scope.row.skuDefaultImg" style="width:80px;height:80px;">
        </template>
      </el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="价格" />
      <el-table-column prop="saleCount" header-align="center" align="center" label="销量" />
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="previewHandle(scope.row.skuId)">预览</el-button>
          <el-button type="text" size="small" @click="commentHandle(scope.row.skuId)">评论</el-button>
          <el-dropdown
            size="small"
            split-button
            type="text"
            @command="handleCommand(scope.row,$event)"
          >
            更多
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="uploadImages">上传图片</el-dropdown-item>
              <el-dropdown-item command="seckillSettings">参与秒杀</el-dropdown-item>
              <el-dropdown-item command="reductionSettings">满减设置</el-dropdown-item>
              <el-dropdown-item command="discountSettings">折扣设置</el-dropdown-item>
              <el-dropdown-item command="memberPriceSettings">会员价格</el-dropdown-item>
              <el-dropdown-item command="stockSettings">库存管理</el-dropdown-item>
              <el-dropdown-item command="couponSettings">优惠劵</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      :current-page="pageIndex"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
  </div>
</template>

<script>
import CategoryCascader from '../common/category-cascader.vue'
import BrandSelect from '../common/brand-select'
import PubSub from 'pubsub-js'

import { skuPageList } from '@/api/sku'

export default {
  components: {
    CategoryCascader,
    BrandSelect
  },
  data() {
    return {
      catPathSub: null,
      brandIdSub: null,
      dataForm: {
        key: '',
        brandId: 0,
        catelogId: 0,
        price: {
          min: 0,
          max: 0
        }
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      catelogPath: []
    }
  },
  activated() {
    this.getDataList()
  },
  mounted() {
    this.catPathSub = PubSub.subscribe('catPath', (msg, val) => {
      this.dataForm.catelogId = val[val.length - 1]
    })
    this.brandIdSub = PubSub.subscribe('brandId', (msg, val) => {
      this.dataForm.brandId = val
    })
  },
  beforeDestroy() {
    PubSub.unsubscribe(this.catPathSub)
    PubSub.unsubscribe(this.brandIdSub)
  },
  methods: {
    getSkuDetails(row, expand) {
      // sku详情查询
      console.log('展开某行...', row, expand)
    },
    // 处理更多指令
    handleCommand(row, command) {
      console.log('~~~~~', row, command)
      if (command === 'stockSettings') {
        this.$router.push({ path: '/ware-sku', query: { skuId: row.skuId }})
      }
    },
    searchSkuInfo() {
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      skuPageList(this.pageIndex, this.pageSize, this.dataForm.key, this.dataForm.catelogId, this.dataForm.brandId, this.dataForm.price.min, this.dataForm.price.max).then((response) => {
        this.dataList = response.data.records
        this.totalPage = response.data.total
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    }
  }
}
</script>
