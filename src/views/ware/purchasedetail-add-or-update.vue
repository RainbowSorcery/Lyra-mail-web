<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      ref="dataForm"
      label-width="120px"
      :model="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item label="采购商品id" prop="skuId">
        <el-input v-model="dataForm.skuId" placeholder="采购商品id" />
      </el-form-item>
      <el-form-item label="采购数量" prop="skuNum">
        <el-input v-model="dataForm.skuNum" placeholder="采购数量" />
      </el-form-item>
      <el-form-item label="仓库" prop="wareId">
        <el-select v-model="dataForm.wareId" placeholder="请选择仓库" clearable>
          <el-option v-for="w in wareList" :key="w.id" :label="w.name" :value="w.id" />
        </el-select>
      </el-form-item>
      <!-- [0新建，1已分配，2正在采购，3已完成，4采购失败] -->
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择状态" clearable>
          <el-option label="新建" :value="0"></el-option>
          <el-option label="已分配" :value="1"></el-option>
          <el-option label="正在采购" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
          <el-option label="采购失败" :value="4"></el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { wareInfoListPage } from '@/api/ware/wareInfo'
import { savePurchase, purchaseInfoById, purchaseUpdate } from '@/api/ware/purchase-detail'

export default {
  data() {
    return {
      visible: false,
      wareList: [],
      dataForm: {
        id: 0,
        purchaseId: '',
        skuId: '',
        skuNum: '',
        skuPrice: '',
        wareId: '',
        status: 0
      },
      dataRule: {
        skuId: [
          { required: true, message: '采购商品id不能为空', trigger: 'blur' }
        ],
        skuNum: [
          { required: true, message: '采购数量不能为空', trigger: 'blur' }
        ],
        wareId: [{ required: true, message: '仓库id不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getWares()
  },
  methods: {
    getWares() {
      wareInfoListPage(0, 5000, '').then((response) => {
        this.wareList = response.data.records
      })
    },
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          purchaseInfoById(this.dataForm.id).then((response) => {
            this.dataForm.purchaseId = response.data.purchaseId
            this.dataForm.skuId = response.data.skuId
            this.dataForm.skuNum = response.data.skuNum
            this.dataForm.skuPrice = response.data.skuPrice
            this.dataForm.wareId = response.data.wareId
            this.dataForm.status = response.data.status
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const requestBody = {
            id: this.dataForm.id || undefined,
            purchaseId: this.dataForm.purchaseId,
            skuId: this.dataForm.skuId,
            skuNum: this.dataForm.skuNum,
            skuPrice: this.dataForm.skuPrice,
            wareId: this.dataForm.wareId,
            status: this.dataForm.status
          }
          if (!this.dataForm.id) {
            savePurchase(requestBody).then((response) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          } else {
            purchaseUpdate(requestBody).then((response) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          }
        }
      })
    }
  }
}
</script>
