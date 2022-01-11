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
      <el-form-item
        label="等级名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          placeholder="等级名称"
        />
      </el-form-item>
      <el-form-item
        label="所需成长值"
        prop="growthPoint"
      >
        <el-input-number
          v-model="dataForm.growthPoint"
          :min="0"
        />
      </el-form-item>
      <el-form-item
        label="默认等级"
        prop="defaultStatus"
      >
        <el-checkbox
          v-model="dataForm.defaultStatus"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>
      <el-form-item
        label="免运费标准"
        prop="freeFreightPoint"
      >
        <el-input-number
          v-model="dataForm.freeFreightPoint"
          :min="0"
        />
      </el-form-item>
      <el-form-item
        label="每次评价获取的成长值"
        prop="commentGrowthPoint"
      >
        <el-input-number
          v-model="dataForm.commentGrowthPoint"
          :min="0"
        />
      </el-form-item>
      <el-form-item
        label="是否有免邮特权"
        prop="priviledgeFreeFreight"
      >
        <el-checkbox
          v-model="dataForm.priviledgeFreeFreight"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>
      <el-form-item
        label="是否有会员价格特权"
        prop="priviledgeMemberPrice"
      >
        <el-checkbox
          v-model="dataForm.priviledgeMemberPrice"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>
      <el-form-item
        label="是否有生日特权"
        prop="priviledgeBirthday"
      >
        <el-checkbox
          v-model="dataForm.priviledgeBirthday"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="note"
      >
        <el-input
          v-model="dataForm.note"
          placeholder="备注"
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
import { saveMemberLeve, updateMemberLevel, getMemberLevelInfo } from '@/api/member/member-level'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        growthPoint: 0,
        defaultStatus: 0,
        freeFreightPoint: 0,
        commentGrowthPoint: 0,
        priviledgeFreeFreight: 0,
        priviledgeMemberPrice: 0,
        priviledgeBirthday: 0,
        note: ''
      },
      dataRule: {
        name: [
          { required: true, message: '等级名称不能为空', trigger: 'blur' }
        ],
        growthPoint: [
          {
            required: true,
            message: '等级需要的成长值不能为空',
            trigger: 'blur'
          }
        ],
        defaultStatus: [
          {
            required: true,
            message: '是否为默认等级[0->不是；1->是]不能为空',
            trigger: 'blur'
          }
        ],
        freeFreightPoint: [
          { required: true, message: '免运费标准不能为空', trigger: 'blur' }
        ],
        commentGrowthPoint: [
          {
            required: true,
            message: '每次评价获取的成长值不能为空',
            trigger: 'blur'
          }
        ],
        priviledgeFreeFreight: [
          {
            required: true,
            message: '是否有免邮特权不能为空',
            trigger: 'blur'
          }
        ],
        priviledgeMemberPrice: [
          {
            required: true,
            message: '是否有会员价格特权不能为空',
            trigger: 'blur'
          }
        ],
        priviledgeBirthday: [
          {
            required: true,
            message: '是否有生日特权不能为空',
            trigger: 'blur'
          }
        ],
        note: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
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
          getMemberLevelInfo(this.dataForm.id).then((response) => {
            this.dataForm.name = response.data.name
            this.dataForm.growthPoint = response.data.growthPoint || 0
            this.dataForm.defaultStatus = response.data.defaultStatus || 0
            this.dataForm.freeFreightPoint =
              response.data.freeFreightPoint || 0
            this.dataForm.commentGrowthPoint =
              response.data.commentGrowthPoint || 0
            this.dataForm.priviledgeFreeFreight =
                response.data.priviledgeFreeFreight || 0
            this.dataForm.priviledgeMemberPrice =
                response.data.priviledgeMemberPrice || 0
            this.dataForm.priviledgeBirthday =
                response.data.priviledgeBirthday || 0
            this.dataForm.note = response.data.note
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const sumbitData = {
            id: this.dataForm.id || undefined,
            name: this.dataForm.name,
            growthPoint: this.dataForm.growthPoint,
            defaultStatus: this.dataForm.defaultStatus,
            freeFreightPoint: this.dataForm.freeFreightPoint,
            commentGrowthPoint: this.dataForm.commentGrowthPoint,
            priviledgeFreeFreight: this.dataForm.priviledgeFreeFreight,
            priviledgeMemberPrice: this.dataForm.priviledgeMemberPrice,
            priviledgeBirthday: this.dataForm.priviledgeBirthday,
            note: this.dataForm.note
          }
          if (!this.dataForm.id) {
            // 添加操作
            saveMemberLeve(sumbitData).then((response) => {
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
            // 修改操作
            updateMemberLevel(sumbitData).then((response) => {
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
