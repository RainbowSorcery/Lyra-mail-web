<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="状态">
        <el-select v-model="dataForm.status" style="width:120px;" placeholder="请选择状态" clearable>
          <el-option label="新建" :value="0" />
          <el-option label="已分配" :value="1" />
          <el-option label="已领取" :value="2" />
          <el-option label="已完成" :value="3" />
          <el-option label="有异常" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="dataForm.key" style="width:120px;" placeholder="参数名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button
          :disabled="dataListSelections.length <= 0"
          type="danger"
          @click="deleteHandle()"
        >批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      style="width: 100%;"
      :data="dataList"
      border
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="id" header-align="center" align="center" label="采购单id" />
      <el-table-column prop="assigneeId" header-align="center" align="center" label="采购人id" />
      <el-table-column prop="assigneeName" header-align="center" align="center" label="采购人名" />
      <el-table-column prop="phone" header-align="center" align="center" label="联系方式" />
      <el-table-column prop="priority" header-align="center" align="center" label="优先级" />
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0">新建</el-tag>
          <el-tag v-if="scope.row.status == 1" type="info">已分配</el-tag>
          <el-tag v-if="scope.row.status == 2" type="warning">已领取</el-tag>
          <el-tag v-if="scope.row.status == 3" type="success">已完成</el-tag>
          <el-tag v-if="scope.row.status == 4" type="danger">有异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="wareId" header-align="center" align="center" label="仓库id" />
      <el-table-column prop="amount" header-align="center" align="center" label="总金额" />
      <el-table-column prop="createTime" header-align="center" align="center" label="创建日期" />
      <el-table-column prop="updateTime" header-align="center" align="center" label="更新日期" />
      <el-table-column fied="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==0||scope.row.status==1"
            type="text"
            size="small"
            @click="opendrawer(scope.row)"
          >分配</el-button>
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
    <el-dialog title="分配采购人员" :visible.sync="caigoudialogVisible" width="30%">
      <el-select v-model="userId" filterable placeholder="请选择">
        <el-option
          v-for="item in userList"
          :key="item.userId"
          :label="item.username"
          :value="item.userId"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="caigoudialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './purchase-add-or-update'

import { purchaseUpdate, purchaseList, deleteIds } from '@/api/ware/purchase'

import { sysUserList } from '@/api/admin/sysUser'

export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      currentRow: {},
      dataForm: {
        key: '',
        status: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      caigoudialogVisible: false,
      userId: '',
      userList: []
    }
  },
  activated() {
    this.getDataList()
  },
  methods: {
    opendrawer(row) {
      this.getUserList()
      this.currentRow = row
      this.caigoudialogVisible = true
    },
    assignUser() {
      const _this = this
      let user = {}
      this.userList.forEach(item => {
        if (item.userId === _this.userId) {
          user = item
        }
      })
      this.caigoudialogVisible = false
      const requestBody = {
        id: this.currentRow.id || undefined,
        assigneeId: user.userId,
        assigneeName: user.username,
        phone: user.mobile,
        status: 1
      }
      purchaseUpdate(requestBody).then((response) => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500
        })
        this.userId = ''
        this.getDataList()
      })
    },
    getUserList() {
      sysUserList().then((response) => {
        this.userList = response.data
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      purchaseList(this.pageIndex, this.pageSize, this.dataForm.key, '').then((response) => {
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
        deleteIds(ids).then((response) => {
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
