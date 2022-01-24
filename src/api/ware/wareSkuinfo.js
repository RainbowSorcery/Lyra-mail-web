import request from '@/utils/request'

const url = '/ware-service/wms-ware-sku/'

export function getWmsKsuLst(current, pageSize, skuId, wareId) {
  return request({
    url: url + 'list' + '?current=' + current + '&pageSize=' + pageSize + '&skuId=' + skuId + '&wareId=' + wareId,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: url + 'update',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: url + 'save',
    method: 'post',
    data
  })
}

export function skuInfo(skuId) {
  return request({
    url: url + 'info/' + skuId,
    method: 'get'
  })
}

export function deleteSkuInfo(data) {
  return request({
    url: url + 'delete',
    method: 'post',
    data
  })
}
