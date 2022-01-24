<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card">
          <el-tabs tab-position="left" style="width:98%">
            <el-tab-pane
              v-for="(group,gidx) in dataResp.attrGroups"
              :key="group.attrGroupId"
              :label="group.attrGroupName"
            >
              <!-- 遍历属性,每个tab-pane对应一个表单，每个属性是一个表单项  spu.baseAttrs[0] = [{attrId:xx,val:}]-->
              <el-form ref="form" :model="dataResp">
                <el-form-item
                  v-for="(attr,aidx) in group.attrs"
                  :key="attr.attrId"
                  :label="attr.attrName"
                >
                  <el-input
                    v-show="false"
                    v-model="dataResp.baseAttrs[gidx][aidx].attrId"
                    type="hidden"
                  />
                  <el-select
                    v-model="dataResp.baseAttrs[gidx][aidx].attrValues"
                    :multiple="attr.valueType == 1"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或输入值"
                  >
                    <el-option
                      v-for="(val,vidx) in attr.valueSelect.split(';')"
                      :key="vidx"
                      :label="val"
                      :value="val"
                    />
                  </el-select>
                  <el-checkbox
                    v-model="dataResp.baseAttrs[gidx][aidx].showDesc"
                    :true-label="1"
                    :false-label="0"
                  >快速展示</el-checkbox>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <div style="margin:auto">
            <el-button type="success" style="float:right" @click="submitSpuAttrs">确认修改</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listAttrForSpu, updateAttrBySpu } from '@/api/attr'
import { attrGroupWithAttr } from '@/api/attrGroup'

export default {
  components: {},
  props: {},
  data() {
    return {
      spuId: '',
      catalogId: '',
      dataResp: {
        // 后台返回的所有数据
        attrGroups: [],
        baseAttrs: []
      },
      spuAttrsMap: {}
    }
  },
  created() {
    this.clearData()
    this.getQueryParams()
    if (this.spuId && this.catalogId) {
      this.showBaseAttrs()
      this.getSpuBaseAttrs()
    }
  },
  methods: {
    clearData() {
      this.dataResp.attrGroups = []
      this.dataResp.baseAttrs = []
      this.spuAttrsMap = {}
    },
    getSpuBaseAttrs() {
      listAttrForSpu(this.spuId).then((response) => {
        response.data.forEach((item) => {
          this.spuAttrsMap['' + item.attrId] = item
        })
      })
    },
    getQueryParams() {
      this.spuId = this.$route.query.spuId
      this.catalogId = this.$route.query.catalogId
      console.log('----', this.spuId, this.catalogId)
    },
    showBaseAttrs() {
      const _this = this
      attrGroupWithAttr(this.catalogId).then((response) => {
        //  先对表单的baseAttrs进行初始化
        response.data.forEach(item => {
          const attrArray = []
          item.attrs.forEach(attr => {
            let v = ''
            if (_this.spuAttrsMap['' + attr.attrId]) {
              v = _this.spuAttrsMap['' + attr.attrId].attrValue.split('')
              if (v.length === 1) {
                v = v[0] + ''
              }
            }
            attrArray.push({
              attrId: attr.attrId,
              attrName: attr.attrName,
              attrValues: v,
              showDesc: _this.spuAttrsMap['' + attr.attrId]
                ? _this.spuAttrsMap['' + attr.attrId].quickShow
                : attr.showDesc
            })
          })
          this.dataResp.baseAttrs.push(attrArray)
        })
        this.dataResp.attrGroups = response.data
      })
    },
    submitSpuAttrs() {
      console.log('·····', this.dataResp.baseAttrs)
      // spu_id  attr_id  attr_name             attr_value             attr_sort  quick_show
      const submitData = []
      this.dataResp.baseAttrs.forEach(item => {
        item.forEach(attr => {
          let val = ''
          if (attr.attrValues instanceof Array) {
            val = attr.attrValues.join('')
          } else {
            val = attr.attrValues
          }

          if (val !== '') {
            submitData.push({
              attrId: attr.attrId,
              attrName: attr.attrName,
              attrValue: val,
              quickShow: attr.showDesc
            })
          }
        })
      })

      this.$confirm('修改商品规格信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateAttrBySpu(this.spuId, submitData).then((response) => {
            this.$message({
              type: 'success',
              message: '属性修改成功!'
            })
          })
        })
    }
  }
}
</script>
<style scoped>
</style>
