import request from '@/utils/request'

const url = '/product-service/product/pms-attr/'

export function saveAttr(data) {
  return request({
    url: url + 'save',
    method: 'post',
    data
  })
}

export function findBaseAttrList(categoryId, current, pageSize, keyword) {
  return request({
    url: url + '/base/list/' + categoryId + '?pageSize=' + pageSize + '&current=' + current + '&keyword=' + keyword,
    method: 'get'
  })
}

export function attrInfo(attrId) {
  return request({
    url: url + 'info/' + attrId,
    method: 'get'
  })
}

export function attrUpdate(data) {
  return request({
    url: url + 'update',
    method: 'post',
    data
  })
}

export function findSaleAttrList(categoryId, current, pageSize, keyword) {
  return request({
    url: url + '/sale/list/' + categoryId + '?pageSize=' + pageSize + '&current=' + current + '&keyword=' + keyword,
    method: 'get'
  })
}

export function listAttrForSpu(spuId) {
  return request({
    url: url + '/base/listForSpu/' + spuId,
    method: 'get'
  })
}

export function updateAttrBySpu(spuId, data) {
  return request({
    url: url + '/base/update/' + spuId,
    method: 'post',
    data
  })
}
