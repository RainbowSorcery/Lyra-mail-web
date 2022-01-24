<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" label-width="120px" :model="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="优先级" prop="priority">
        <el-input v-model="dataForm.priority" placeholder="优先级" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { savePurchase, purchaseUpdate, purchaseInfoById } from '@/api/ware/purchase'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        assigneeId: '',
        assigneeName: '',
        phone: '',
        priority: '',
        status: 0,
        wareId: '',
        amount: '',
        createTime: '',
        updateTime: ''
      },
      dataRule: {
        assigneeId: [
          { required: true, message: '采购人id不能为空', trigger: 'blur' }
        ],
        assigneeName: [
          { required: true, message: '采购人名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '优先级不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        wareId: [
          { required: true, message: '仓库id不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '总金额不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建日期不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新日期不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          purchaseInfoById(this.dataForm.id).then((response) => {
            this.dataForm.assigneeId = response.data.assigneeId
            this.dataForm.assigneeName = response.data.assigneeName
            this.dataForm.phone = response.data.phone
            this.dataForm.priority = response.data.priority
            this.dataForm.status = response.data.status
            this.dataForm.wareId = response.data.wareId
            this.dataForm.amount = response.data.amount
            this.dataForm.createTime = response.data.createTime
            this.dataForm.updateTime = response.data.updateTime
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const requestBody = {
            'id': this.dataForm.id || undefined,
            'assigneeId': this.dataForm.assigneeId,
            'assigneeName': this.dataForm.assigneeName,
            'phone': this.dataForm.phone,
            'priority': this.dataForm.priority,
            'status': this.dataForm.status,
            'wareId': this.dataForm.wareId,
            'amount': this.dataForm.amount,
            'createTime': this.dataForm.createTime,
            'updateTime': this.dataForm.updateTime
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
