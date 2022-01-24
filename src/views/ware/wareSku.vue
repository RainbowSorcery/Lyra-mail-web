<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="仓库">
        <el-select v-model="dataForm.wareId" style="width:160px;" placeholder="请选择仓库" clearable>
          <el-option v-for="w in wareList" :key="w.id" :label="w.name" :value="w.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="skuId">
        <el-input v-model="dataForm.skuId" placeholder="skuId" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button
          type="danger"
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()"
        >批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="id" header-align="center" align="center" label="id" />
      <el-table-column prop="skuId" header-align="center" align="center" label="sku_id" />
      <el-table-column prop="wareId" header-align="center" align="center" label="仓库id" />
      <el-table-column prop="stock" header-align="center" align="center" label="库存数" />
      <el-table-column prop="skuName" header-align="center" align="center" label="sku_name" />
      <el-table-column prop="stockLocked" header-align="center" align="center" label="锁定库存" />
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import AddOrUpdate from './waresku-add-or-update'

import { getWmsKsuLst, deleteSkuInfo } from '@/api/ware/wareSkuinfo'
import { wareInfoListPage } from '@/api/ware/wareInfo'

export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      wareList: [],
      dataForm: {
        wareId: '',
        skuId: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  activated() {
    console.log('接收到', this.$route.query.skuId)
    if (this.$route.query.skuId) {
      this.dataForm.skuId = this.$route.query.skuId
    }
    this.getWares()
    this.getDataList()
  },
  created() {
    this.getWares()
  },
  methods: {
    getWares() {
      wareInfoListPage(1, 5000, '').then((response) => {
        this.wareList = response.data.records
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getWmsKsuLst(this.pageIndex, this.pageSize, this.dataForm.skuId, this.dataForm.wareId).then((response) => {
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
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteSkuInfo(ids).then((response) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      })
    }
  }
}
</script>
