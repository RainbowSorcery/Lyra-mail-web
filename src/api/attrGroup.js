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

export function removerById(attrGroupId) {
  return request({
    url: url + 'remove/' + attrGroupId,
    method: 'post'
  })
}

export function attrRelation(attrGroupId) {
  return request({
    url: url + '/' + attrGroupId + '/attr/relation',
    method: 'get'
  })
}

export function removerAttrRelation(data) {
  return request({
    url: url + 'attr/relation/delete',
    method: 'post',
    data
  })
}

export function noAttrRelation(attrGroupId, pageSize, current) {
  return request({
    url: url + attrGroupId + '/noAttr/relation?pageSize=' + pageSize + '&current=' + current,
    method: 'get'
  })
}

export function addAttrRelation(data) {
  return request({
    url: url + '/attr/relation',
    method: 'post',
    data
  })
}
