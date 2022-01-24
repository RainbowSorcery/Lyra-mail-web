import request from '@/utils/request'

const url = '/ware-service/wms-purchase/'

export function purchaseList(current, pageSize, key, status) {
  return request({
    url: url + 'list?current=' + current + '&pageSize=' + pageSize + '&key=' + key + '&status=' + status,
    method: 'get'
  })
}

export function savePurchase(data) {
  return request({
    url: url + 'save',
    method: 'post',
    data
  })
}

export function purchaseInfoById(id) {
  return request({
    url: url + 'info/' + id,
    method: 'get'
  })
}

export function purchaseUpdate(data) {
  return request({
    url: url + 'update',
    method: 'post',
    data
  })
}

export function undeceiveList() {
  return request({
    url: url + 'undeceive/list',
    method: 'get'
  })
}

export function deleteIds(ids) {
  return request({
    url: url + 'delete',
    method: 'post',
    data: ids
  })
}

