import request from '@/utils/request'

const url = '/product-service/product/category/'

export function getCategoryTreeList() {
  return request({
    url: url + '/list/tree',
    method: 'get'
  })
}

export function deleteCategoryByIds(ids) {
  return request({
    url: url + 'delete',
    method: 'post',
    data: ids
  })
}

export function addProductCategory(category) {
  return request({
    url: url + 'add',
    method: 'post',
    data: category
  })
}

export function getCategoryById(categoryId) {
  return request({
    url: url + 'getCategoryById?categoryId=' + categoryId,
    method: 'get'
  })
}

export function updateCategorById(category) {
  return request({
    url: url + 'update',
    method: 'post',
    data: category
  })
}
