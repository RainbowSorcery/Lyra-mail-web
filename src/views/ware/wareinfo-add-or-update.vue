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
      <el-form-item
        label="仓库名"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          placeholder="仓库名"
        />
      </el-form-item>
      <el-form-item
        label="仓库地址"
        prop="address"
      >
        <el-input
          v-model="dataForm.address"
          placeholder="仓库地址"
        />
      </el-form-item>
      <el-form-item
        label="区域编码"
        prop="areacode"
      >
        <el-input
          v-model="dataForm.areacode"
          placeholder="区域编码"
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { save, findById, update } from '@/api/ware/wareInfo'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        address: '',
        areacode: ''
      },
      dataRule: {
        name: [{ required: true, message: '仓库名不能为空', trigger: 'blur' }],
        address: [
          { required: true, message: '仓库地址不能为空', trigger: 'blur' }
        ],
        areacode: [
          { required: true, message: '区域编码不能为空', trigger: 'blur' }
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
          findById(this.dataForm.id).then((reponse) => {
            this.dataForm.name = reponse.data.name
            this.dataForm.address = reponse.data.address
            this.dataForm.areacode = reponse.data.areacode
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const rquestBody = {
            id: this.dataForm.id || undefined,
            name: this.dataForm.name,
            address: this.dataForm.address,
            areacode: this.dataForm.areacode
          }
          console.log(this.dataForm.id !== 0)
          if (!this.dataForm.id) {
            save(rquestBody).then((response) => {
              update(rquestBody).then((response) => {
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
            })
          } else {
            update(rquestBody).then((response) => {
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
