import request from '@/utils/request'

const url = '/product-service/product/categoryBrand/'

export function categoryBrandRelation(data) {
  return request({
    url: url + 'categoryBrandRelation/save',
    method: 'post',
    data
  })
}

export function categoryBrandList(brandId) {
  return request({
    url: url + 'categoryBrandRelation/list?' + 'brandId=' + brandId,
    method: 'get'
  })
}

export function categoryBrandDelete(id) {
  return request({
    url: url + 'categoryBrandRelation/delete?' + 'id=' + id,
    method: 'post'
  })
}
