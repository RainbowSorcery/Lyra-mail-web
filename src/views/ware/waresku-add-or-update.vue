<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="120px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item label="sku_id" prop="skuId">
        <el-input v-model="dataForm.skuId" placeholder="sku_id" />
      </el-form-item>
      <el-form-item label="仓库" prop="wareId">
        <el-select v-model="dataForm.wareId" placeholder="请选择仓库" clearable>
          <el-option v-for="w in wareList" :key="w.id" :label="w.name" :value="w.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="库存数" prop="stock">
        <el-input v-model="dataForm.stock" placeholder="库存数" />
      </el-form-item>
      <el-form-item label="sku_name" prop="skuName">
        <el-input v-model="dataForm.skuName" placeholder="sku_name" />
      </el-form-item>
      <el-form-item label="锁定库存" prop="stockLocked">
        <el-input v-model="dataForm.stockLocked" placeholder="锁定库存" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { wareInfoListPage } from '@/api/ware/wareInfo'
import { skuInfo, save, update } from '@/api/ware/wareSkuinfo'

export default {
  data() {
    return {
      visible: false,
      wareList: [],
      dataForm: {
        id: 0,
        skuId: '',
        wareId: '',
        stock: 0,
        skuName: '',
        stockLocked: 0
      },
      dataRule: {
        skuId: [{ required: true, message: 'sku_id不能为空', trigger: 'blur' }],
        wareId: [
          { required: true, message: '仓库id不能为空', trigger: 'blur' }
        ],
        stock: [{ required: true, message: '库存数不能为空', trigger: 'blur' }],
        skuName: [
          { required: true, message: 'sku_name不能为空', trigger: 'blur' }
        ]
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
          skuInfo(this.dataForm.id).then((response) => {
            this.dataForm.skuId = response.data.skuId
            this.dataForm.wareId = response.data.wareId
            this.dataForm.stock = response.data.stock
            this.dataForm.skuName = response.data.skuName
            this.dataForm.stockLocked = response.data.stockLocked
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
            skuId: this.dataForm.skuId,
            wareId: this.dataForm.wareId,
            stock: this.dataForm.stock,
            skuName: this.dataForm.skuName,
            stockLocked: this.dataForm.stockLocked
          }
          if (!this.dataForm.id) {
            save(requestBody).then((response) => {
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
            update(requestBody).then((response) => {
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
