import request from '@/utils/request'

const url = '/ware-service/wms-purchase-detail/'

export function purchaseDetailList(current, pageSize, key, status, wareId) {
  return request({
    url: url + 'list?current=' + current + '&pageSize=' + pageSize + '&key=' + key + '&status=' + status + '&wareId=' + wareId,
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

export function deleteIds(ids) {
  return request({
    url: url + 'delete',
    method: 'post',
    data: ids
  })
}

export function mearge(data) {
  return request({
    url: url + 'merge',
    method: 'post',
    data
  })
}
