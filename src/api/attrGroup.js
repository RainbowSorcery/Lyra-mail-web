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

export function addAttrGroups(data) {
  return request({
    url: url + 'addAttrGroup',
    method: 'post',
    data
  })
}

export function findAttrGroupById(attrGroupId) {
  return request({
    url: url + 'findAttrGroupById?attrGroupId=' + attrGroupId,
    method: 'get'
  })
}

export function updateAttrGroupById(data) {
  return request({
    url: url + 'updateAttrGroupById',
    method: 'post',
    data
  })
}

export function findCategoryIdByList(categoryId) {
  return request({
    url: url + 'findCategoryIdByList/' + categoryId,
    method: 'get'
  })
}
