<template>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="id" header-align="center" align="center" label="id" />
      <el-table-column prop="spuName" header-align="center" align="center" label="名称" />
      <el-table-column prop="spuDescription" header-align="center" align="center" label="描述" />
      <el-table-column prop="catalogId" header-align="center" align="center" label="分类" />
      <el-table-column prop="brandId" header-align="center" align="center" label="品牌" />
      <el-table-column prop="weight" header-align="center" align="center" label="重量" />
      <el-table-column prop="publishStatus" header-align="center" align="center" label="上架状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.publishStatus == 0">新建</el-tag>
          <el-tag v-if="scope.row.publishStatus == 1">已上架</el-tag>
          <el-tag v-if="scope.row.publishStatus == 2">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" />
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间" />
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.publishStatus == 0"
            type="text"
            size="small"
            @click="productUp(scope.row.id)"
          >上架</el-button>
          <el-button type="text" size="small" @click="attrUpdateShow(scope.row)">规格</el-button>
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
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import { getSpuPageList } from '@/api/spu'

export default {
  props: {
    catId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dataSub: null,
      dataForm: {
        status: '',
        key: '',
        brandId: 0,
        catelogId: 0
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
  mounted() {
    this.dataSub = PubSub.subscribe('dataForm', (msg, val) => {
      console.log('~~~~~', val)
      this.dataForm = val
      this.getDataList()
    })
  },
  beforeDestroy() {
    PubSub.unsubscribe(this.dataSub)
  },
  activated() {
    this.getDataList()
  },
  methods: {
    productUp(id) {
    //   this.$http({
    //     url: this.$http.adornUrl("/product/spuinfo/" + id + "/up"),
    //     method: "post"
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.$message({
    //         message: "操作成功",
    //         type: "success",
    //         duration: 1500,
    //         onClose: () => {
    //           this.getDataList();
    //         }
    //       });
    //     } else {
    //       this.$message.error(data.msg);
    //     }
    //   })
    },
    attrUpdateShow(row) {
      console.log(row)
      this.$router.push({
        path: '/product/productAttrUpdate',
        query: { spuId: row.id, catalogId: row.catalogId }
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      const param = {}
      Object.assign(param, this.dataForm, {
        page: this.pageIndex,
        limit: this.pageSize
      })
      getSpuPageList(param.page, param.limit, this.dataForm.key, this.dataForm.catelogId, this.dataForm.brandId, this.dataForm.status).then((response) => {
        this.dataList = response.data.records
        this.totalPage = response.data.total
        this.dataListLoading = true
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
    addOrUpdateHandle(id) {}
  }
}
</script>
