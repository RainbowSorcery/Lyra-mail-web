import request from '@/utils/request'

const url = '/product-service/product/pms-attr-group/'

export function listPageByCategoryId(categoryId, current, pageSize) {
  return request({
    url: url + 'list/' + categoryId + '?current=' + current + '&pageSize=' + pageSize,
    method: 'get'
  })
}

export function conditionList(categoryId, current, pageSize, keyWord) {
  return request({
    url: url + 'conditionList/' + categoryId + '?current=' + current + '&pageSize=' + pageSize + '&keyWord=' + keyWord,
    method: 'get'
  })
}
